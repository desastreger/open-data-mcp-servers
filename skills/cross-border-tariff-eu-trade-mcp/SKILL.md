---
name: cross-border-tariff-eu-trade-mcp
description: "Calculate official USITC Harmonized Tariff Schedule (HTS) duty estimates with Chapter 99 / Section 301 trade-remedy flags, verify EU corporate VAT IDs via European Commission VIES, and search EU Tenders Electronic Daily (TED) public procurement notices. Activate when users ask for US import tariff rates, HTS code lookups, landed duty calculations, EU VAT number validation, VIES corporate checks, or European public sector tenders."
summary: "Automate cross-border customs and European procurement checks across three official APIs: USITC Harmonized Tariff Schedule (HTS) duty math with Chapter 99 flags, live EC VIES EU corporate VAT verification, and EU TED tenders."
version: "1.0.0"
tags:
  - usitc-hts
  - customs-tariffs
  - eu-vat-vies
  - eu-ted-tenders
  - cross-border-trade
  - supply-chain-compliance
  - section-301
  - public-procurement
  - mcp-server
keywords:
  - US Harmonized Tariff Schedule API
  - USITC HTS duty calculator
  - Section 301 Chapter 99 tariff check
  - EU VIES VAT verification
  - European VAT number lookup
  - EU TED public tenders scraper
  - CPV procurement search
  - landed cost customs compliance
  - cross border trade MCP
use_cases:
  - Model US import landed costs with official USITC Schedule 1 General ad-valorem duty math and Chapter 99 footnote alerts
  - Inherit 8-digit HTS parent tariff rates automatically onto 10-digit statistical reporting subheadings
  - Validate 27-member-state EU corporate VAT numbers in real time via EC VIES before zero-rating B2B cross-border invoices
  - Discover European government tenders on EU TED v3 filtered by 8-digit CPV codes and ISO-3 country codes
  - Unify US customs classification, EU tax onboarding, and EU public sector BD inside one deterministic compliance workflow
docs_url: "https://github.com/desastreger/open-data-mcp-servers"
---

# Cross-Border US Tariff (HTS), EU VIES VAT & TED Tenders (`cross-border-tariff-eu-trade-mcp`)

## When to Use This Skill

Activate this skill whenever supply-chain, finance, tax, e-commerce, or European BD teams need authoritative transatlantic customs, VAT, or procurement records:
- **"What is the US tariff / HTS code and duty on a $50,000 shipment of [product or HTS prefix]?"** — look up official USITC Harmonized Tariff Schedule subheadings, inherit 8-digit parent rates onto 10-digit statistical suffixes, compute deterministic base USD duty, and detect Chapter 99 / Section 301 / Section 232 footnotes (`lookup_us_hts_tariff`).
- **"Verify these EU VAT numbers before we issue reverse-charge B2B invoices: [IE6388047V, ...]"** — query the official European Commission VIES REST endpoint for live registration validity, legal entity name, and registered address (`verify_eu_vat_numbers`).
- **"Find open European government tenders for [cybersecurity / cloud / medical devices] in Germany, France, or Ireland"** — search EU Tenders Electronic Daily (TED) Open API v3 by keywords, 8-digit CPV classification codes, and ISO-3 country codes (`search_eu_ted_tenders`).

**When NOT to use this skill:**
- US federal government contracts or Grants.gov R&D funding (use `federal-govcon-recompete-radar` instead).
- US domestic corporate KYB, SEC EDGAR, FDA recall, or CFPB screening (use `us-kyb-compliance-dossier` instead; note that EC VIES covers the 27 EU member states + `XI` Northern Ireland, not UK `GB` domestic VAT).
- Binding customs brokerage rulings, anti-dumping/countervailing duty (AD/CVD) cash-deposit liquidation legal opinions, or origin-specific Chapter 99 stacking math beyond flagging `chapter99References`.

## Connect the Remote MCP Server

Connect any Streamable HTTP MCP client using `$APIFY_TOKEN`:

- **MCP Endpoint:** `https://desastreger--cross-border-tariff-eu-trade-mcp.apify.actor/mcp`
- **Apify Store Page:** `https://apify.com/desastreger/cross-border-tariff-eu-trade-mcp`
- **Auth Header:** `Authorization: Bearer $APIFY_TOKEN`
- **Pay-Per-Event Rate:** `$0.80 / 1,000` records launch (`$2.00 / 1,000` standard); zero monthly subscription

### Claude Code CLI
```bash
claude mcp add --transport http cross-border-tariff-eu-trade-mcp \
  https://desastreger--cross-border-tariff-eu-trade-mcp.apify.actor/mcp \
  --header "Authorization: Bearer $APIFY_TOKEN"
```

### Cursor / Claude Desktop (`mcp.json` / `claude_desktop_config.json`)
```json
{
  "mcpServers": {
    "cross-border-tariff-eu-trade-mcp": {
      "url": "https://desastreger--cross-border-tariff-eu-trade-mcp.apify.actor/mcp",
      "headers": {
        "Authorization": "Bearer <YOUR_APIFY_TOKEN>"
      }
    }
  }
}
```

### Apify REST API Fallback (Synchronous Dataset Run)
For combined `mode: "all"` runs or larger customs/VAT/procurement batches (`up to 500` records):
```bash
curl -s -X POST \
  "https://api.apify.com/v2/acts/desastreger~cross-border-tariff-eu-trade-mcp/run-sync-get-dataset-items?token=$APIFY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "mode": "all",
    "htsKeywords": ["lithium ion", "8507.60"],
    "shipmentValueUsd": 25000,
    "euVatNumbers": ["IE6388047V"],
    "tedKeywords": ["cybersecurity", "72000000"],
    "tedCountries": ["DEU", "FRA", "IRL"],
    "maxResults": 20
  }'
```

## MCP Tools & Parameter Selection

| MCP Tool | Primary Intent | Key Arguments |
| :--- | :--- | :--- |
| `lookup_us_hts_tariff` | Query USITC HTS headings/subheadings, compute deterministic USD base duty on `shipmentValueUsd`, and flag Chapter 99 trade remedies. | `htsKeywords` (`string[]`, product terms or 4–10 digit HTS prefixes e.g. `["8507.60"]`), `keyword` (`string` alias), `shipmentValueUsd` (`number`, default `10000`), `maxResults` (`1–50`, default `10`) |
| `verify_eu_vat_numbers` | Real-time EU corporate VAT validation via EC VIES REST API with member-state availability handling. | `euVatNumbers` (`string[]`, 2-letter country prefix + number e.g. `["IE6388047V"]`), `vatNumber` (`string` alias), `maxResults` (`1–50`, defaults to input array length up to `50`) |
| `search_eu_ted_tenders` | Search official EU TED Open API v3 public procurement notices. | `tedKeywords` (`string[]`, keywords or 8-digit CPV codes e.g. `["72000000"]`), `keyword` (`string` alias), `tedCountries` (`string[]`, 3-letter ISO-3 codes e.g. `["DEU","FRA","ITA","NLD"]`), `maxResults` (`1–50`, default `10`) |

See [references/schema-and-examples.md](references/schema-and-examples.md) for the complete REST `mode` matrix (`all`, `us_hts_tariffs`, `eu_vies_vat`, `eu_ted_tenders`), output schemas, and B2B recipes.

### Example USITC HTS Tariff Call (`lookup_us_hts_tariff`)
```json
{
  "htsKeywords": ["8507.60", "lithium ion"],
  "shipmentValueUsd": 50000,
  "maxResults": 10
}
```

### Example EC VIES VAT Verification Call (`verify_eu_vat_numbers`)
```json
{
  "euVatNumbers": ["IE6388047V", "NL820646660B01"]
}
```

### Example EU TED Tenders Call (`search_eu_ted_tenders`)
```json
{
  "tedKeywords": ["cybersecurity", "72000000"],
  "tedCountries": ["DEU", "FRA", "IRL"],
  "maxResults": 10
}
```

### Unified Top-Level Output Schema Across All 3 Feeds
| Field | `US_HTS_TARIFF` (USITC) | `EU_VAT_VERIFICATION` (EC VIES) | `EU_PUBLIC_TENDER` (EU TED v3) |
| :--- | :--- | :--- | :--- |
| `identifier` | 8–10 digit HTS code (`8507.60.00`) | Normalized VAT ID (`IE6388047V`) | Notice number (`783488-2026`) |
| `jurisdiction` | `"US"` | `"EU-<2-letter>"` (`EU-IE`) | `"EU-<ISO3>"` (`EU-ITA`) |
| `titleOrEntity` | Commodity description | Registered legal company name | Official tender title |
| `statusOrRate` | Column 1 General rate (`"3.4%"`, `"Free"`) | `VALID_VAT`, `INVALID_VAT`, `MS_UNAVAILABLE` | `PUBLISHED_TENDER` |
| `estimatedDutyOrValueUsd` | Deterministic base USD duty (`number` \| `null`) | `null` | Estimated tender value or `null` |
| `hasTradeRemedyOrRiskFlag` | `true` on Chapter 99 footnote or non-ad-valorem rate | `true` when invalid or VIES unavailable | `false` (informational notice) |

## Execution Workflow

Follow this deterministic 4-step workflow on every invocation:

1. **Step 1 — Scoping & Cost-Aware Sizing**
   - Select the exact specialized MCP tool (`lookup_us_hts_tariff`, `verify_eu_vat_numbers`, or `search_eu_ted_tenders`) matching the user's question rather than running unneeded feeds.
   - Normalize country codes carefully: EC VIES VAT prefixes use **2-letter EU prefixes** (`IE`, `DE`, `FR`, `NL`, `IT`, `ES`; note Greece uses `EL` in VIES!), whereas EU TED tender filters (`tedCountries`) require **3-letter ISO-3 codes** (`IRL`, `DEU`, `FRA`, `NLD`, `ITA`, `ESP`, `GRC`).
   - Pay-Per-Event launch pricing is **`$0.80 / 1,000` records** (`$0.0008 / record`, standard `$2.00 / 1,000`).
2. **Step 2 — Tool Call & Filtering**
   - For HTS queries, pass specific 4–8 digit headings (`"8507.60"`, `"8541.41"`) alongside descriptive nouns (`"lithium ion"`) and set `shipmentValueUsd` to the user's actual commercial invoice value.
   - For TED procurement searches, pair domain keywords with 8-digit CPV codes (e.g., `72000000` IT services, `48000000` Software packages, `33100000` Medical equipment, `32420000` Network equipment).
3. **Step 3 — Cross-Field Normalization & Ranking**
   - Inspect `hasTradeRemedyOrRiskFlag` on every returned item:
     - On `US_HTS_TARIFF`, `true` warns that `details.hasChapter99Footnote` is active (`details.chapter99References` lists Section 301/232 subheadings) or that a compound/specific weight-based rate requires manual customs broker review (`rateKind !== "ad_valorem"`).
     - On `EU_VAT_VERIFICATION`, `true` flags an `INVALID_VAT` number or member-state VIES service outage (`MS_UNAVAILABLE` / `SERVICE_UNAVAILABLE`).
   - Separate `details.generalRate` (Column 1 General MFN rate), `details.specialRate` (FTA preferential programs like USMCA `S`, Korea `KR`, Australia `AU`), and `details.otherRate` (Column 2 statutory rate).
4. **Step 4 — Structured Deliverable Output**
   - Present results using [templates/report-template.md](templates/report-template.md) with explicit tariff math disclaimers, official USITC/VIES/TED source links, and compliance follow-ups.

## Data Provenance & Safety Rules

- **Cite Official Identifiers & URLs:** Always report the exact `htsno` (`8507.60.00`), normalized EU VAT ID (`IE6388047V`), or TED `publicationNumber` (`783488-2026`) alongside `officialSourceUrl`.
- **Base Duty vs. Chapter 99 Stacking Clarity:** `details.estimatedBaseDutyUsd` represents deterministic Column 1 General ad-valorem math on `shipmentValueUsd` only. Always warn users when `details.hasChapter99Footnote: true` (or when importing from China/covered jurisdictions) that Section 301, Section 232, IEEPA, or AD/CVD surcharges apply on top of the base duty and do not constitute formal customs brokerage legal advice.
- **Zero Entity Fabrication:** Certain EU member states (such as Germany `DE` or Spain `ES` under national VIES privacy rules) validate `valid: true` while returning `"---"` for `companyName` / `registeredAddress`. Report `"Undisclosed by national tax authority"` rather than guessing company details.
- **Surface Member-State & Upstream Warnings:** Transparently surface VIES member-state maintenance statuses (`MS_UNAVAILABLE`), `stoppedByBudgetCap`, or any `RUN_SUMMARY.escalations` / `escalationWarnings`.
