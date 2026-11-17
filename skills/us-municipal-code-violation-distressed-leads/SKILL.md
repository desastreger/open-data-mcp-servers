---
name: us-municipal-code-violation-distressed-leads
description: "Query active municipal code enforcement, condemned or vacant buildings, housing habitability citations, unpermitted work, and distressed property leads across 6 US Socrata open-data portals (Austin, Seattle, San Francisco, Buffalo, Montgomery County MD, Cincinnati). Activate when the user asks to 'find distressed properties with open code violations', 'pull vacant or condemned house leads in Austin or Buffalo', 'source off-market fix-and-flip real estate leads', or 'find roof, mold, or stop-work violation leads for contractors'."
summary: "Query harmonized municipal code violations, condemned or vacant buildings, housing habitability citations, and distressed property leads across 6 US Socrata open-data portals with parcel IDs, geocodes, and 0-100 investor distress scores via remote MCP."
version: "1.0.0"
tags:
  - distressed-real-estate
  - code-violations
  - off-market-leads
  - wholesaling-leads
  - municipal-open-data
  - vacant-properties
  - contractor-leads
  - property-investment
  - mcp-server
keywords:
  - municipal code violation scraper
  - distressed property leads API
  - off-market real estate wholesaling
  - vacant condemned building leads
  - Socrata code enforcement API
  - unpermitted work stop-work orders
  - housing habitability mold citations
  - fix and flip property sourcing
  - parcel ID skip tracing feed
use_cases:
  - Source off-market real estate wholesaling and fix-and-flip acquisition targets with active structural hazard or vacant building citations before MLS listing
  - Generate immediate homeowner repair leads for roofing, mold remediation, electrical, plumbing, and foundation contractors from active municipal citations
  - Feed standardized street addresses, parcel IDs, and ZIP codes directly into skip-tracing and direct-mail CRM pipelines
  - Screen multi-family and residential parcels across Austin, Seattle, San Francisco, Buffalo, Montgomery County MD, and Cincinnati for unresolved municipal enforcement
  - Benchmark neighborhood blight, unpermitted construction stop-work orders, and open housing habitability complaints across US metros
docs_url: "https://github.com/desastreger/open-data-mcp-servers"
---

# US Municipal Code Violations & Distressed Property Leads

Query and harmonize live municipal code enforcement, condemned/unsafe structures, vacant/boarded properties, fire/electrical/plumbing failures, housing habitability complaints, unpermitted work stop-work orders, and exterior blight records across **6 official US Socrata open-data portals** into one unified 19-field investor and contractor lead schema.

## When to Use This Skill

**Activate this skill when the user wants to:**
- Find off-market distressed real estate leads (`CRITICAL_DISTRESS` and `HIGH_MOTIVATION` tiers) for wholesaling, fix-and-flip rehabbing, or distressed debt/lien research across **Austin (`austin`), Seattle (`seattle`), San Francisco (`san_francisco`), Buffalo (`buffalo`), Montgomery County MD (`montgomery_md`), or Cincinnati (`cincinnati`)**.
- Locate homeowners or landlords facing urgent municipal enforcement deadlines (`openCasesOnly: true`) for structural repairs, roofing, mold/pest remediation, electrical/plumbing upgrades, or unpermitted construction legalization.
- Export parcel identifiers (`parcelId`), normalized street addresses, geocodes (`latitude`, `longitude`), and official case IDs (`caseId`) ready for skip-tracing tools.
- Inspect which municipal code enforcement portals and violation categories are currently supported.

**Do NOT use this skill when:**
- Looking for approved, forward-looking construction, solar PV, HVAC, or commercial remodel building permits (use `us-metro-building-trade-permits` instead).
- Requesting code enforcement records in municipalities outside the 6 supported Socrata portals (always call `list_code_violation_metros` or inform the user of exact supported coverage).
- Expecting homeowner cell phone numbers or personal emails directly from municipal Socrata feeds (city code portals publish property addresses, parcel IDs, case descriptions, and inspector divisions—not private owner phone/email records).

## Connect the Remote MCP Server

This skill connects to the live Apify Standby Streamable HTTP MCP server (`$0.80 / 1,000 leads` launch pay-per-event rate; `$2.00 / 1,000` standard rate; zero Socrata app tokens or proxies required).

- **Remote Streamable HTTP MCP Endpoint:** `https://desastreger--us-municipal-code-violation-distressed-leads.apify.actor/mcp`
- **Authentication Header:** `Authorization: Bearer $APIFY_TOKEN`

### Claude Code CLI
```bash
claude mcp add --transport http us-municipal-code-violation-distressed-leads https://desastreger--us-municipal-code-violation-distressed-leads.apify.actor/mcp \
  --header "Authorization: Bearer $APIFY_TOKEN"
```

### Cursor / Claude Desktop (`mcp.json` / `claude_desktop_config.json`)
```json
{
  "mcpServers": {
    "us-municipal-code-violation-distressed-leads": {
      "url": "https://desastreger--us-municipal-code-violation-distressed-leads.apify.actor/mcp",
      "headers": {
        "Authorization": "Bearer <YOUR_APIFY_TOKEN>"
      }
    }
  }
}
```

### Apify REST API Fallback (cURL / Scripts / Clay / n8n)
For batch pulls up to `500` leads across multiple metros in automated skip-tracing pipelines:
```bash
curl -sS -X POST "https://api.apify.com/v2/acts/desastreger~us-municipal-code-violation-distressed-leads/run-sync-get-dataset-items" \
  -H "Authorization: Bearer $APIFY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "metros": ["austin", "san_francisco", "buffalo"],
    "distressFilter": "structural_hazard",
    "openCasesOnly": true,
    "keywords": ["roof", "unsafe"],
    "maxResults": 50
  }'
```

## MCP Tools & Parameter Selection

| MCP Tool | Purpose | Key Arguments & Defaults |
| :--- | :--- | :--- |
| `search_code_violation_leads` | Search harmonized municipal code violations and distressed property leads across up to 6 US Socrata portals. | `metros` (`["austin", "san_francisco", "buffalo"]` default; valid keys: `"austin"`, `"seattle"`, `"san_francisco"`, `"buffalo"`, `"montgomery_md"`, `"cincinnati"`), `distressFilter` (`"all"` default; 6 category enums), `openCasesOnly` (`false`), `keywords` (`[]`, case-insensitive array), `maxResults` (`10` default, `1–50` in MCP; `1–500` via REST). |
| `list_code_violation_metros` | Return metadata, live Socrata dataset URLs, ordering fields, and supported `distressFilter` values for all 6 portals. | `{}` (no arguments required; zero per-lead event charge). |

### Parameter Selection Rules
1. **Verify Metro Coverage First:** Map user city names to exact `metros` keys (`austin`, `seattle`, `san_francisco`, `buffalo`, `montgomery_md`, `cincinnati`). If the user asks what cities are available, call `list_code_violation_metros` first.
2. **Active Motivation Filtering:** Always set `openCasesOnly: true` for real estate acquisition, wholesaling, or contractor repair outreach so closed/abated historical citations are excluded.
3. **Category vs Keyword Precision:** Use `distressFilter` (`structural_hazard`, `vacant_abandoned`, `fire_electrical_plumbing`, `housing_habitability`, `unpermitted_zoning`, `exterior_blight`) for reliable cross-city classification, and add `keywords` (e.g., `["condemned"]`, `["mold"]`, `["work without permit"]`) only when narrowing to a specific trade or defect.

### Canonical MCP Tool Call Payloads

**Multi-City Distressed Property Search (`search_code_violation_leads`):**
```json
{
  "metros": ["austin", "san_francisco", "buffalo"],
  "distressFilter": "structural_hazard",
  "openCasesOnly": true,
  "keywords": ["unsafe", "roof"],
  "maxResults": 25
}
```

**Portal & Filter Discovery (`list_code_violation_metros`):**
```json
{}
```

### Interpreting Distress Categories & Investor Priority Tiers

| Output Field | High-Signal Values | Actionable Real Estate / Contractor Interpretation |
| :--- | :--- | :--- |
| `investorPriorityTier` | `CRITICAL_DISTRESS` (`distressScore >= 75`) | Active structural hazard, condemnation, fire damage, or vacant/boarded citation with recent `openedDate` and parcel linkage — top off-market acquisition tier. |
| `distressCategory` | `STRUCTURAL_HAZARD`, `VACANT_ABANDONED` | Highest seller motivation for cash wholesalers, fix-and-flip investors, and demolition/structural engineering firms. |
| `distressCategory` | `FIRE_ELECTRICAL_PLUMBING`, `UNPERMITTED_ZONING` | Mandatory compliance cure deadlines requiring licensed MEP contractors, roofers, architects, or permit expediters. |
| `parcelId` | Populated APN / TCAD / SBL / Block-Lot | Direct join key for county tax-assessor ownership lookup, absentee-owner mailers, and skip-tracing enrichment. |

See [references/schema-and-examples.md](references/schema-and-examples.md) for all 6 portal dataset IDs, the 19-field output schema, and 3 B2B recipes.

## Execution Workflow

Follow this deterministic 4-step workflow on every invocation:

1. **Scoping & Cost-Aware Sizing:** Confirm target metro keys, whether only unresolved cases (`openCasesOnly: true`) are needed, and the target distress or contractor trade category. Start interactive MCP searches with `maxResults: 15` to `25` (`$0.012–$0.020` at launch pricing).
2. **Tool Call & Filtering:** Run `search_code_violation_leads` with normalized `metros`, `distressFilter`, and `openCasesOnly`. Note that multi-city queries interleave results across portals with fault isolation so one slow municipal portal never blocks others.
3. **Cross-Field Normalization & Ranking:** Sort returned properties by `distressScore` (`0–100`) descending and group by `investorPriorityTier` (`CRITICAL_DISTRESS` first, then `HIGH_MOTIVATION`, then `STANDARD`). Flag repeat addresses or parcels appearing across multiple open case IDs.
4. **Structured Deliverable Output:** Render findings with [templates/report-template.md](templates/report-template.md), preserving `caseId`, `address`, `parcelId`, `zipCode`, `openedDate`, `distressCategory`, `distressScore`, and `sourcePortalUrl` for downstream skip-tracing or county assessor lookup.

## Data Provenance & Safety Rules

- **Cite Official Municipal Case & Parcel Identifiers:** Always include `caseId`, `metro`, `parcelId` (when published by the city), `openedDate`, `status`, and `sourcePortalUrl` so investors and contractors can verify citation details on the city portal.
- **Never Fabricate Property Owner Contacts:** Municipal Socrata feeds expose public property addresses, parcel numbers, and assigned municipal `inspectorOrDivision` strings—never invent homeowner names, phone numbers, or emails. Clearly distinguish inspector contact strings from property owners.
- **Transparent Portal & Budget Reporting:** If an unsupported city key was requested, or if any portal emits partial results / `escalationWarnings` / budget cap truncation, disclose that clearly to the user.

### Supported Municipal Open-Data Portals Summary
- **`austin`:** Austin, TX — Code Department Compliance (`data.austintexas.gov`, dataset `6wtj-zbtb`, includes `tcad_id` parcel keys).
- **`seattle`:** Seattle, WA — SDCI Code Complaints & Violations (`data.seattle.gov`, dataset `ez4a-iug7`).
- **`san_francisco`:** San Francisco, CA — Dept. of Building Inspection Complaints (`data.sfgov.org`, dataset `gm2e-bten`, includes Block/Lot parcel keys).
- **`buffalo`:** Buffalo, NY — City Code Violations (`data.buffalony.gov`, dataset `ivrf-k9vm`, includes `sbl` parcel keys).
- **`montgomery_md`:** Montgomery County, MD — DHCA Housing Code Violations (`data.montgomerycountymd.gov`, dataset `k9nj-z35d`).
- **`cincinnati`:** Cincinnati, OH — CAGIS Code Enforcement (`data.cincinnati-oh.gov`, dataset `cncm-znd6`, includes `parcel` keys).

### High-Value Multi-Skill Chaining
- **Corrective Permit Verification (`us-metro-building-trade-permits`):** In overlapping metros (`austin`, `seattle`, `san_francisco`), cross-check distressed addresses against issued building, roofing, electrical, or plumbing permits to see whether remediation has already started or if the owner still lacks a contractor.
