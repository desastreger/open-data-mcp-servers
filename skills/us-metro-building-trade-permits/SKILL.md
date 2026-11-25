---
name: us-metro-building-trade-permits
description: "Search harmonized live municipal building, solar PV, roofing, electrical, HVAC/mechanical, plumbing, new construction, and commercial remodel permits across Chicago, Austin, Seattle, Los Angeles, and San Francisco with contractor details, project valuations, and B2B lead scores. Activate when users ask for building permit leads, active contractors, rooftop solar or battery permits, commercial tenant improvements, roofing or HVAC jobs, or municipal construction activity."
summary: "Search harmonized live municipal building, solar PV, roofing, electrical, HVAC, plumbing, and commercial remodel permits across Chicago, Austin, Seattle, Los Angeles, and San Francisco with contractor contacts and valuations."
version: "1.0.0"
tags:
  - building-permits
  - construction-leads
  - solar-permits
  - roofing-leads
  - hvac-contractors
  - commercial-real-estate
  - socrata-open-data
  - contractor-prospecting
  - mcp-server
keywords:
  - municipal building permits scraper
  - solar PV permit leads
  - roofing and HVAC permits
  - commercial tenant improvement leads
  - active licensed contractors
  - Chicago Austin Seattle LA SF permits
  - construction material supply leads
  - EV charger electrical permits
  - building permits MCP server
use_cases:
  - Identify newly issued solar PV, battery storage, and EV charger electrical permits for equipment distributors
  - Source high-valuation roofing, HVAC heat-pump, and plumbing construction jobs with named contractors
  - Track commercial tenant improvements and new construction filings across Chicago, Austin, Seattle, LA, and San Francisco
  - Prospect active licensed general and specialty trade contractors for construction insurance, bonding, and equipment rental
  - Enrich territory field-sales CRMs with round-robin multi-city permit feeds ranked by project valuation and recency
docs_url: "https://github.com/desastreger/open-data-mcp-servers"
---

# US Metro Building, Solar & Specialty Trade Permits (`us-metro-building-trade-permits`)

## When to Use This Skill

Activate this skill whenever a user needs live municipal construction activity, specialty trade project leads, or active licensed contractor intelligence across major US cities:
- **"Find recent solar / roofing / HVAC / electrical permits in [Austin, LA, Chicago, Seattle, or SF]"** — filter directly by normalized `tradeFilter` and minimum valuation (`minEstimatedCostUsd`).
- **"Show commercial tenant improvement or new construction projects over $250,000"** — isolate high-budget commercial build-outs (`commercial_remodel` or `new_construction`).
- **"List active contractors installing EV chargers, battery storage, or heat pumps"** — combine `tradeFilter` with targeted `keywords` to extract `contractorName`, `contractorPhone`, and `contractorLicense`.
- **"Which US cities and permit datasets are supported?"** — call `list_supported_permit_metros` to inspect live Socrata portal metadata before running targeted searches.

**When NOT to use this skill:**
- Municipal code enforcement violations, blighted/condemned structures, or distressed real-estate acquisition leads (use `us-municipal-code-violation-distressed-leads` instead).
- Cities outside the 5 supported Socrata open-data metros (`chicago`, `austin`, `seattle`, `los_angeles`, `san_francisco`) — always check `list_supported_permit_metros` rather than passing unsupported city keys.
- Industrial EPA environmental discharge permits under NPDES, Clean Air, or RCRA (use `epa-echo-industrial-facility-compliance` instead).

## Connect the Remote MCP Server

### Option 1: 1-Click Browser OAuth (Zero API Key Setup — Recommended)

Connect directly via Apify's managed OAuth gateway (`https://mcp.apify.com/?tools=desastreger/us-metro-building-trade-permits`) — Claude Code, Cursor, Claude Desktop, Windsurf, VS Code, and Google Antigravity sign in via browser OAuth with **zero manual `APIFY_TOKEN`** needed:

- **1-Click OAuth MCP URL:** `https://mcp.apify.com/?tools=desastreger/us-metro-building-trade-permits`
- **Apify Store Page:** `https://apify.com/desastreger/us-metro-building-trade-permits`

#### Claude Code CLI (OAuth)
```bash
claude mcp add --transport http us-metro-building-trade-permits "https://mcp.apify.com/?tools=desastreger/us-metro-building-trade-permits"
```

#### Cursor / Claude Desktop / Windsurf / Google Antigravity (OAuth `mcp.json`)
```json
{
  "mcpServers": {
    "us-metro-building-trade-permits": {
      "url": "https://mcp.apify.com/?tools=desastreger/us-metro-building-trade-permits"
    }
  }
}
```

#### VS Code Copilot (`.vscode/mcp.json`)
```json
{
  "servers": {
    "us-metro-building-trade-permits": {
      "type": "http",
      "url": "https://mcp.apify.com/?tools=desastreger/us-metro-building-trade-permits"
    }
  }
}
```

### Option 2: Direct Standby Streamable HTTP (`Bearer $APIFY_TOKEN`)

For headless scripts, CI pipelines, or direct Standby authentication:

- **Standby MCP Endpoint:** `https://desastreger--us-metro-building-trade-permits.apify.actor/mcp`
- **Auth Header:** `Authorization: Bearer $APIFY_TOKEN`

```bash
claude mcp add --transport http us-metro-building-trade-permits \
  https://desastreger--us-metro-building-trade-permits.apify.actor/mcp \
  --header "Authorization: Bearer $APIFY_TOKEN"
```

```json
{
  "mcpServers": {
    "us-metro-building-trade-permits": {
      "url": "https://desastreger--us-metro-building-trade-permits.apify.actor/mcp",
      "headers": {
        "Authorization": "Bearer <YOUR_APIFY_TOKEN>"
      }
    }
  }
}
```

### Apify REST API Fallback (Synchronous Dataset Run)
For territory batch exports (`up to 500` normalized permits per run):
```bash
curl -s -X POST \
  "https://api.apify.com/v2/acts/desastreger~us-metro-building-trade-permits/run-sync-get-dataset-items?token=$APIFY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "metros": ["chicago", "austin", "seattle", "los_angeles", "san_francisco"],
    "tradeFilter": "solar",
    "minEstimatedCostUsd": 15000,
    "keywords": ["battery"],
    "maxResults": 25
  }'
```

## MCP Tools & Parameter Selection

| MCP Tool | Primary Intent | Key Arguments |
| :--- | :--- | :--- |
| `search_metro_building_permits` | Query, harmonize, deduplicate, and score live municipal permits across selected metros in round-robin order. | `metros` (`string[]`, default `["chicago","austin","seattle"]`), `tradeFilter` (`"all"`, `"solar"`, `"roofing"`, `"electrical"`, `"hvac_mechanical"`, `"plumbing"`, `"new_construction"`, `"commercial_remodel"`), `minEstimatedCostUsd` (integer `>= 0`, default `0`), `keywords` (`string[]`), `maxResults` (`1–50` MCP / `1–500` REST, default `10` MCP / `25` REST) |
| `list_supported_permit_metros` | Inspect supported metro portal keys, Socrata dataset IDs, ordering columns, and valid trade filters (zero PPE lead charge). | *(No arguments `{}`)* |

### Supported Metro Keys & Official Socrata Portals
- `chicago` — City of Chicago Dept. of Buildings (`data.cityofchicago.org`, `ydr8-5enu`)
- `austin` — City of Austin Issued Construction Permits (`data.austintexas.gov`, `3syk-w9eu`)
- `seattle` — City of Seattle SDCI Building Permits (`data.seattle.gov`, `76t5-zqzr`)
- `los_angeles` — City of Los Angeles LADBS Permits (`data.lacity.org`, `xnhu-aczu`)
- `san_francisco` — San Francisco Dept. of Building Inspection (`data.sfgov.org`, `i98e-djp9`)

See [references/schema-and-examples.md](references/schema-and-examples.md) for the complete 18-field normalized schema and query recipes.

### Example MCP Tool Call (`search_metro_building_permits`)
```json
{
  "metros": ["austin", "los_angeles", "san_francisco", "seattle"],
  "tradeFilter": "solar",
  "minEstimatedCostUsd": 15000,
  "keywords": ["battery", "storage"],
  "maxResults": 20
}
```

### Example Commercial Remodel Call (`search_metro_building_permits`)
```json
{
  "metros": ["chicago", "austin", "seattle", "los_angeles", "san_francisco"],
  "tradeFilter": "commercial_remodel",
  "minEstimatedCostUsd": 150000,
  "maxResults": 20
}
```

### Trade Filter Mapping & High-Signal Output Fields
| `tradeFilter` Input | Normalized `tradeCategory` | Typical B2B Buyer / GTM Use Case |
| :--- | :--- | :--- |
| `"solar"` | `SOLAR` | PV module, inverter, racking, and residential/commercial battery distributors |
| `"roofing"` | `ROOFING` | Shingle/TPO material suppliers, waste dumpsters, and commercial roofing SaaS |
| `"electrical"` | `ELECTRICAL` | Panel upgrades, EV charging hardware OEMs, and switchgear wholesalers |
| `"hvac_mechanical"` | `HVAC_MECHANICAL` | Heat-pump, chiller, VRF, and ductwork equipment reps |
| `"plumbing"` | `PLUMBING` | Commercial water-heater, pipe/valve, and trenchless sewer suppliers |
| `"commercial_remodel"` | `COMMERCIAL_REMODEL` | Tenant-improvement cabling, commercial interiors, signage, and CRE lenders |
| `"new_construction"` | `NEW_CONSTRUCTION` | Heavy equipment rental, surety bonding, builder's risk insurance, and lumber |

Key per-record fields: `permitId`, `metro`, `city`, `state`, `issueDate`, `status`, `address`, `zipCode`, `description`, `estimatedCostUsd`, `contractorName`, `contractorPhone`, `contractorLicense`, `leadScore` (`0–100`), `priorityTier` (`HOT`, `WARM`, `STANDARD`), and `sourcePortalUrl`.

## Execution Workflow

Follow this deterministic 4-step workflow on every invocation:

1. **Step 1 — Scoping & Cost-Aware Sizing**
   - Map user geography strictly to the 5 supported `metros` keys (`chicago`, `austin`, `seattle`, `los_angeles`, `san_francisco`). If the user asks for an unsupported city (e.g., Miami or Phoenix), inform them upfront and offer the closest or full 5-metro benchmark rather than passing invalid keys.
   - Pay-Per-Event launch pricing is **`$0.50 / 1,000` permits** (`$0.0005 / permit`, standard `$1.50 / 1,000`), and `list_supported_permit_metros` incurs zero per-lead event cost. Start with `maxResults: 10–25` for interactive queries.
2. **Step 2 — Tool Call & Filtering**
   - Prefer `tradeFilter` (`solar`, `roofing`, `electrical`, `hvac_mechanical`, `plumbing`, `new_construction`, `commercial_remodel`) over broad free-text `keywords` first—the pipeline pushes down trade hints to Socrata and automatically falls back to broader recent batches if a city uses non-standard terminology.
   - Add `minEstimatedCostUsd` (e.g., `15000` for residential solar/roofing, `100000+` for commercial tenant improvements) when project valuation matters, keeping in mind that some municipal trade permits omit valuation (`null`) on flat-fee MEP filings.
3. **Step 3 — Cross-Field Normalization & Ranking**
   - Results interleave round-robin across active metros and sort within each city by newest `issueDate` first, then `leadScore` (`0–100`, `priorityTier`: `HOT`, `WARM`, `STANDARD`).
   - Group recurring `contractorName` entries across permits to identify high-velocity installers and general contractors for B2B distributor or SaaS outreach.
4. **Step 4 — Structured Deliverable Output**
   - Present findings using [templates/report-template.md](templates/report-template.md), highlighting metro breakdown, total reported construction valuation, named contractors, and direct `sourcePortalUrl` verification links.

## Data Provenance & Safety Rules

- **Cite Municipal Permit Identifiers:** Always display `permitId`, `city`/`state`, `issueDate`, `status`, and `sourcePortalUrl` verbatim from the official municipal Socrata record.
- **Zero Contact or Valuation Fabrication:** Municipal open-data portals vary in field disclosure—for example, Austin and Chicago frequently publish `contractorName` or `estimatedCostUsd`, while certain trade sub-permits leave `contractorPhone`, `contractorLicense`, or `estimatedCostUsd` as `null`. Never invent contractor phone numbers, emails, license IDs, or project valuations.
- **Fault-Isolated Multi-City Transparency:** If one municipal Socrata portal experiences a temporary `503` maintenance window or if an unsupported metro key was ignored (`RUN_SUMMARY.escalations` / `escalationWarnings`), report that exact city status transparently alongside the healthy metro results.
