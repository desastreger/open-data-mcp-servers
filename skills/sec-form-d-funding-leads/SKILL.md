---
name: sec-form-d-funding-leads
description: "Discover newly funded US operating startups and private placement rounds from official SEC EDGAR Form D XML filings with executive contacts, EINs, and federal grant history. Activate when users ask for recently funded startups, seed or Series A venture leads, SEC Form D filings, founder phone numbers, startup fundraising dossiers, or private placement market summaries."
summary: "Extract real-time US startup venture and Reg D funding leads from official SEC EDGAR Form D XML filings. Automatically excludes pooled investment funds and returns CEO contacts, phones, HQ addresses, EINs, and USASpending grant history."
version: "1.0.0"
tags:
  - sec-edgar
  - form-d
  - startup-funding
  - venture-leads
  - b2b-prospecting
  - private-placements
  - sbir-grants
  - mcp-server
  - lead-generation
keywords:
  - SEC Form D scraper
  - startup funding leads
  - newly funded startups
  - Reg D private placements
  - venture capital outbound
  - founder contact phone
  - startup EIN lookup
  - SBIR STTR grant enrichment
  - SEC EDGAR MCP
use_cases:
  - Build targeted outbound SDR lists of US operating startups within days of closing new seed or Series A capital
  - Enrich CRM and Clay prospect tables with verified SEC CIKs, Employer Identification Numbers (EINs), and prior Form D round counts
  - Source technical and executive recruiting candidates at freshly capitalized biotech, AI, and manufacturing startups
  - Cross-check private venture issuers against USASpending.gov SBIR/STTR grants and federal R&D contracts
  - Pull instant pre-call fundraising dossiers and state-by-state private capital market summaries
docs_url: "https://github.com/desastreger/open-data-mcp-servers"
---

# SEC Form D Startup Funding & Venture Leads (`sec-form-d-funding-leads`)

## When to Use This Skill

Activate this skill when the user needs authoritative, real-time intelligence on private US capital raises filed under Regulation D:
- **"Find recently funded startups in [state/industry]"** — e.g., AI, robotics, biotechnology, energy, or healthcare companies that closed `$250k+` in the past 7–30 days.
- **"Pull a funding dossier on [company name or CIK]"** — inspect a specific private company's Form D history, `totalAmountSold`, named executives, `ein`, SIC classification, and federal contract/grant footprint.
- **"Summarize this week's startup fundraising market"** — aggregate capital closed, top states, and top industries across recent operating-company Form D filings.
- **"Filter out hedge funds and SPVs from Form D filings"** — isolate genuine operating companies (`operatingCompaniesOnly: true`) from pooled 3(c)(1)/3(c)(7) investment vehicles.

**When NOT to use this skill:**
- Public-company quarterly financial statements (`10-K`/`10-Q`) or multi-registry corporate compliance screening (use `us-kyb-compliance-dossier` instead).
- Non-US venture rounds outside SEC Regulation D jurisdiction unless the foreign issuer filed a US Form D tranche.
- Individual personal email scraping (SEC Form D filings publish verified executive names, titles, business phone numbers, and street addresses, never personal email addresses).

## Connect the Remote MCP Server

Preferred transport is the zero-install Apify Standby Streamable HTTP MCP endpoint authenticated with `$APIFY_TOKEN`:

- **MCP Endpoint:** `https://desastreger--sec-form-d-funding-leads.apify.actor/mcp`
- **Apify Store Page:** `https://apify.com/desastreger/sec-form-d-funding-leads`
- **Auth Header:** `Authorization: Bearer $APIFY_TOKEN`
- **Pay-Per-Event Rate:** `$1.00 / 1,000` leads launch (`$2.50 / 1,000` standard); zero monthly subscription

### Claude Code CLI
```bash
claude mcp add --transport http sec-form-d-funding-leads \
  https://desastreger--sec-form-d-funding-leads.apify.actor/mcp \
  --header "Authorization: Bearer $APIFY_TOKEN"
```

### Cursor / Claude Desktop (`mcp.json` / `claude_desktop_config.json`)
```json
{
  "mcpServers": {
    "sec-form-d-funding-leads": {
      "url": "https://desastreger--sec-form-d-funding-leads.apify.actor/mcp",
      "headers": {
        "Authorization": "Bearer <YOUR_APIFY_TOKEN>"
      }
    }
  }
}
```

### Apify REST API Fallback (Synchronous Dataset Run)
When running outside an MCP host or exporting larger batches (`up to 1,000` leads), invoke the Actor REST endpoint directly:
```bash
curl -s -X POST \
  "https://api.apify.com/v2/acts/desastreger~sec-form-d-funding-leads/run-sync-get-dataset-items?token=$APIFY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "daysBack": 7,
    "maxResults": 25,
    "operatingCompaniesOnly": true,
    "minAmountSold": 250000,
    "states": ["CA", "NY", "TX"],
    "includeSecEntityMetadata": true
  }'
```

## MCP Tools & Parameter Selection

| MCP Tool | Primary Intent | Key Arguments |
| :--- | :--- | :--- |
| `search_startup_funding_leads` | Discover newly funded operating startups matching date, capital, geography, and sector filters. | `daysBack` (`1–365`, default `7`), `startDate`, `endDate`, `maxResults` (`1–50` MCP / `1–1000` REST), `operatingCompaniesOnly` (default `true`), `minAmountSold` (default `0`), `states` (`["CA","NY"]`), `industries` (`["Technology","Biotechnology"]`), `searchQuery`, `enrichWithFederalAwards` (default `false`) |
| `get_company_funding_dossier` | Deep-dive lookup on a specific issuer by legal name or 10-digit SEC CIK, automatically including Form D/A amendments, EIN metadata, and USASpending awards. | `companyQuery` (**required**, company name or CIK), `daysBack` (default `365`) |
| `summarize_funding_market` | Compute aggregate private placement volume, total USD closed, state distribution, industry breakdown, and top 5 deals. | `daysBack` (default `7`), `sampleSize` (`5–50`, default `20`) |

Additional REST-only batch filters in `input_schema.json`: `includeAmendments` (boolean, default `false`), `minOfferingAmount` (integer USD, default `0`), and `includeSecEntityMetadata` (boolean, default `true`). See [references/schema-and-examples.md](references/schema-and-examples.md) for the complete field dictionary and recipes.

### Example MCP Tool Call (`search_startup_funding_leads`)
```json
{
  "daysBack": 14,
  "maxResults": 15,
  "operatingCompaniesOnly": true,
  "minAmountSold": 500000,
  "states": ["CA", "NY", "MA", "TX"],
  "industries": ["Technology", "Biotechnology"],
  "enrichWithFederalAwards": true
}
```

### Example Single-Company Dossier Call (`get_company_funding_dossier`)
```json
{
  "companyQuery": "INNOVATIVE POWDERS INC",
  "daysBack": 365
}
```

### High-Signal Output Fields to Inspect
| Field | Meaning & Analytical Use |
| :--- | :--- |
| `totalAmountSold` / `totalOfferingAmount` | Actual closed USD capital vs authorized round ceiling (`percentFilled` shows tranche progress). |
| `primaryContactName` / `primaryContactTitle` / `phone` | Verified executive officer or director listed on the Form D signature/issuer block. |
| `secEntityMetadata.ein` / `sicCode` | IRS Employer Identification Number (`XX-XXXXXXX`), 4-digit SIC, and `priorFormDRoundsCount`. |
| `federalAwards.hasFederalAwards` | Boolean + `recentFederalAwards[]` (`awardId`, `amountUsd`, `agency`) from USASpending.gov. |
| `leadScore` / `leadTier` | Deterministic `0–100` score and priority bucket (`HOT`, `WARM`, `STANDARD`). |

## Execution Workflow

Follow this deterministic 4-step workflow on every invocation:

1. **Step 1 — Scoping & Cost-Aware Sizing**
   - Confirm geography (`states`), sector (`industries` or `searchQuery`), recency (`daysBack` or explicit `startDate`/`endDate`), and minimum closed capital (`minAmountSold`).
   - Size requests conservatively: Pay-Per-Event launch pricing is **`$1.00 / 1,000` leads** (`$0.001/lead`, standard `$2.50/1k`) plus optional **`$0.30 / 1,000`** federal award cross-checks when `enrichWithFederalAwards: true`. Start with `maxResults: 10–25` for interactive discovery before scaling batch runs.
   - Use `summarize_funding_market` (`sampleSize: 20`) first when the user asks a macro market trend question rather than requesting raw lead rows.
2. **Step 2 — Tool Call & Filtering**
   - Keep `operatingCompaniesOnly: true` enabled unless the user explicitly asks for hedge funds, venture funds, real estate syndications, or 3(c)(1)/3(c)(7) SPVs.
   - Enable `enrichWithFederalAwards: true` when scouting deep-tech, defense, aerospace, medical device, or biotech startups where SBIR/STTR non-dilutive funding signals technical validation.
   - Use `get_company_funding_dossier` whenever the user names a specific company or 10-digit CIK so both `Form D` and `Form D/A` amendments over the past 365 days are captured.
3. **Step 3 — Cross-Field Normalization & Ranking**
   - Prioritize leads by `leadTier` (`HOT`, `WARM`, `STANDARD`), `leadScore` (`0–100`), `totalAmountSold` (verified closed capital rather than aspirational `totalOfferingAmount`), and first-time vs repeat filers (`secEntityMetadata.priorFormDRoundsCount`).
   - Distinguish `filingType: "D"` (new round) from `"D/A"` (amended tranche) and note `percentFilled` plus `investorCount`.
   - Flag stealth or pre-revenue spinouts (`revenueRange: "Decline to Disclose"` or `"No Revenues"`) closing `$1M+` with low `investorCount` as high-conviction institutional seed rounds.
4. **Step 4 — Structured Deliverable Output**
   - Present results using [templates/report-template.md](templates/report-template.md), including an executive summary, ranked Markdown table, verifiable SEC links, and concrete outbound/research next actions.

## Data Provenance & Safety Rules

- **Cite Primary Federal Identifiers:** Always anchor every company row to its 10-digit SEC `cik`, Form D `accessionNumber`, `filingDate`, and `edgarFilingUrl` (`sec.gov/Archives/edgar/...`), plus `secEntityMetadata.ein` and `federalAwards.recentFederalAwards[].awardId` when present.
- **Zero Contact Fabrication:** SEC Form D XML provides `primaryContactName`, `primaryContactTitle`, corporate `phone`, `address.fullAddress`, and occasionally `secEntityMetadata.website`. Never guess, infer, or construct email addresses or unverified LinkedIn URLs when fields are `null`.
- **Closed vs. Target Capital Clarity:** Never conflate `totalOfferingAmount` (maximum authorized offering ceiling, which can be indefinite) with `totalAmountSold` (actual capital closed to date). Report both clearly.
- **Surface Warnings Transparently:** If an Actor dataset summary (`RUN_SUMMARY.escalations`) or tool payload notes `stoppedByBudgetCap: true` or partial upstream timeouts (`escalationWarnings`), report those exact operational notes to the user rather than silently omitting records.
