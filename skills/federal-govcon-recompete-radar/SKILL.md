---
name: federal-govcon-recompete-radar
description: "Track expiring US federal contracts entering incumbent recompete windows on USASpending.gov and live open or forecasted federal grants on Grants.gov with incumbent UEIs, NAICS codes, obligated values, and countdowns. Activate when users ask for expiring federal contracts, GovCon recompete opportunities, incumbent vendor displacement, NAICS contract pipelines, SBIR/STTR NOFOs, or open federal R&D grants."
summary: "Track expiring US federal contracts entering incumbent recompete windows on USASpending.gov alongside live posted and forecasted federal R&D grants on Grants.gov with incumbent UEIs, NAICS codes, ceiling values, and countdowns."
version: "1.0.0"
tags:
  - govcon
  - federal-contracts
  - recompete-radar
  - usaspending
  - grants-gov
  - sbir-sttr
  - naics-procurement
  - capture-management
  - mcp-server
keywords:
  - federal contract recompete scraper
  - expiring government contracts
  - USASpending recompete radar
  - Grants.gov open grants API
  - incumbent vendor UEI lookup
  - NAICS 541512 capture pipeline
  - SBIR STTR federal funding
  - pre-RFP GovCon intelligence
  - government procurement MCP
use_cases:
  - Identify active DoD and civilian prime contracts expiring within 90-365 days for pre-RFP GovCon capture planning
  - Target incumbent prime contractors by 12-character UEI and obligated contract value for subcontracting or teaming outreach
  - Filter federal IT, cybersecurity, engineering, and R&D recompetes by 6-digit NAICS codes and Place of Performance states
  - Discover live posted and forecasted Grants.gov funding opportunities across DOD, NSF, HHS, DOE, and NASA
  - Feed prioritized HIGH-tier federal capture opportunities into Salesforce, HubSpot, or Clay BD pipelines
docs_url: "https://github.com/desastreger/open-data-mcp-servers"
---

# Federal GovCon Recompete & Open Grants Radar (`federal-govcon-recompete-radar`)

## When to Use This Skill

Activate this skill when GovCon capture teams, BD executives, subcontractors, or R&D grant writers need pre-RFP federal procurement visibility:
- **"Find expiring federal cybersecurity / IT contracts in [VA/MD/DC] over $1M"** — pinpoint active prime contracts approaching their Period of Performance End Date (`expiringWithinDays`) before solicitations hit SAM.gov.
- **"Show incumbent contractors and UEIs for NAICS [541512 / 541330 / 541715]"** — build competitor displacement or prime-sub teaming target lists ranked by obligated contract dollars (`amount_desc`) or urgency (`expiration_asc`).
- **"Search open and forecasted federal AI or biotech grants from NSF, DOD, or HHS"** — pull live `posted` and `forecasted` Notices of Funding Opportunity (NOFOs) directly from Grants.gov.
- **"Build a combined federal capture brief of recompetes + R&D grants"** — unify contract recompetes (`RECOMPETE_CONTRACT`) and non-dilutive grants (`OPEN_GRANT`) in one normalized schema.

**When NOT to use this skill:**
- European Union public sector tenders on TED (use `cross-border-tariff-eu-trade-mcp` with `search_eu_ted_tenders` instead).
- Verifying whether a specific commercial company has historical compliance recalls or SEC filings (use `us-kyb-compliance-dossier` instead).
- Municipal local building/construction permits (use `us-metro-building-trade-permits` instead).

## Connect the Remote MCP Server

### Option 1: 1-Click Browser OAuth (Zero API Key Setup — Recommended)

Connect directly via Apify's managed OAuth gateway (`https://mcp.apify.com/?tools=desastreger/federal-govcon-recompete-radar`) — Claude Code, Cursor, Claude Desktop, Windsurf, VS Code, and Google Antigravity sign in via browser OAuth with **zero manual `APIFY_TOKEN`** needed:

- **1-Click OAuth MCP URL:** `https://mcp.apify.com/?tools=desastreger/federal-govcon-recompete-radar`
- **Apify Store Page:** `https://apify.com/desastreger/federal-govcon-recompete-radar`

#### Claude Code CLI (OAuth)
```bash
claude mcp add --transport http federal-govcon-recompete-radar "https://mcp.apify.com/?tools=desastreger/federal-govcon-recompete-radar"
```

#### Cursor / Claude Desktop / Windsurf / Google Antigravity (OAuth `mcp.json`)
```json
{
  "mcpServers": {
    "federal-govcon-recompete-radar": {
      "url": "https://mcp.apify.com/?tools=desastreger/federal-govcon-recompete-radar"
    }
  }
}
```

#### VS Code Copilot (`.vscode/mcp.json`)
```json
{
  "servers": {
    "federal-govcon-recompete-radar": {
      "type": "http",
      "url": "https://mcp.apify.com/?tools=desastreger/federal-govcon-recompete-radar"
    }
  }
}
```

### Option 2: Direct Standby Streamable HTTP (`Bearer $APIFY_TOKEN`)

For headless scripts, CI pipelines, or direct Standby authentication:

- **Standby MCP Endpoint:** `https://desastreger--federal-govcon-recompete-radar.apify.actor/mcp`
- **Auth Header:** `Authorization: Bearer $APIFY_TOKEN`

```bash
claude mcp add --transport http federal-govcon-recompete-radar \
  https://desastreger--federal-govcon-recompete-radar.apify.actor/mcp \
  --header "Authorization: Bearer $APIFY_TOKEN"
```

```json
{
  "mcpServers": {
    "federal-govcon-recompete-radar": {
      "url": "https://desastreger--federal-govcon-recompete-radar.apify.actor/mcp",
      "headers": {
        "Authorization": "Bearer <YOUR_APIFY_TOKEN>"
      }
    }
  }
}
```

### Apify REST API Fallback (Synchronous Dataset Run)
For combined `mode: "all"` feeds or larger capture exports (`up to 1,000` records):
```bash
curl -s -X POST \
  "https://api.apify.com/v2/acts/desastreger~federal-govcon-recompete-radar/run-sync-get-dataset-items?token=$APIFY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "mode": "all",
    "keywords": ["cybersecurity", "artificial intelligence"],
    "naicsCodes": ["541512", "541511"],
    "expiringWithinDays": 180,
    "minAwardAmount": 100000,
    "states": ["VA", "MD", "DC"],
    "agencies": ["DOD", "NSF"],
    "sortBy": "amount_desc",
    "maxResults": 25
  }'
```

## MCP Tools & Parameter Selection

| MCP Tool | Primary Intent | Key Arguments |
| :--- | :--- | :--- |
| `search_expiring_recompete_contracts` | Query active USASpending.gov prime contracts (`A/B/C/D`) expiring within `N` days, returning incumbent vendor, UEI, obligated USD, NAICS/PSC, and awarding sub-agency. | `keywords` (`string[]`), `naicsCodes` (`string[]`, 6-digit e.g. `["541512"]`), `expiringWithinDays` (`1–1095`, default `180`), `minAwardAmount` (default `50000`), `states` (`string[]`, Place of Performance e.g. `["VA","MD"]`), `sortBy` (`"amount_desc"` \| `"expiration_asc"`), `maxResults` (`1–50`, default `10`) |
| `search_open_federal_grants` | Query live `posted` and upcoming `forecasted` federal grant NOFOs from Grants.gov. | `keywords` (`string[]`), `keyword` (`string` alias), `agencies` (`string[]`, e.g. `["DOD","NSF","HHS","DOE","NASA"]`), `oppStatuses` (default `"forecasted\|posted"`), `maxResults` (`1–50`, default `10`) |

### Capture Window Sizing Rules
- **90–180 days (`expiringWithinDays: 180`):** Sweet spot for subcontracting/teaming with incumbents or responding to Sources Sought / RFIs currently in market.
- **180–540 days (`expiringWithinDays: 365`):** Ideal pre-RFP capture horizon for prime displacement on `$10M+` enterprise vehicles before acquisition strategies lock.
- See [references/schema-and-examples.md](references/schema-and-examples.md) for full REST `mode` options (`all`, `recompete_contracts`, `open_grants`), NAICS cheatsheets, and JSON payloads.

### Example MCP Tool Call (`search_expiring_recompete_contracts`)
```json
{
  "keywords": ["cybersecurity", "zero trust"],
  "naicsCodes": ["541512", "541511"],
  "expiringWithinDays": 270,
  "minAwardAmount": 500000,
  "states": ["VA", "MD", "DC"],
  "sortBy": "amount_desc",
  "maxResults": 15
}
```

### Example Federal Grants Call (`search_open_federal_grants`)
```json
{
  "keywords": ["artificial intelligence"],
  "agencies": ["DOD", "NSF", "DOE"],
  "oppStatuses": "forecasted|posted",
  "maxResults": 10
}
```

### Unified Output Schema Fields (`RECOMPETE_CONTRACT` vs `OPEN_GRANT`)
| Field | `RECOMPETE_CONTRACT` (USASpending.gov) | `OPEN_GRANT` (Grants.gov) |
| :--- | :--- | :--- |
| `opportunityOrAwardId` | Federal Contract Award ID / PIID (`FA862118F6251`) | Grants.gov Opportunity Number (`26-503`) |
| `incumbentVendor` / `incumbentUei` | Named incumbent prime + 12-char SAM UEI | `null` (new open funding solicitation) |
| `amountUsd` | Obligated federal contract award value (USD) | `null` on summary index (check NOFO PDF) |
| `endDateOrCloseDate` | Period of Performance End Date (`YYYY-MM-DD`) | Application Close Date (`YYYY-MM-DD`) |
| `naicsCode` / `pscCode` / `cfdaList` | 6-digit `naicsCode` + 4-char `pscCode` | Assistance Listing `cfdaList` (`["47.076"]`) |
| `priorityScore` / `priorityTier` | Deterministic `0–100` score (`HIGH`, `MEDIUM`, `STANDARD`) | Deterministic `0–100` score (`HIGH`, `MEDIUM`, `STANDARD`) |

## Execution Workflow

Follow this deterministic 4-step GovCon capture workflow:

1. **Step 1 — Scoping & Cost-Aware Sizing**
   - Clarify whether the user wants expiring prime contracts (`search_expiring_recompete_contracts`), federal grants (`search_open_federal_grants`), or both.
   - Map domain descriptions to 6-digit NAICS codes when known (e.g., `541512` Computer Systems Design, `541511` Custom Programming, `541330` Engineering Services, `541715` Physical/Bio R&D, `541611` Management Consulting) to maximize USASpending precision.
   - Pay-Per-Event launch pricing is **`$0.80 / 1,000` records** (`$0.0008 / opportunity`, standard `$2.00 / 1,000`). Start with `maxResults: 10–25` for interactive capture reviews.
2. **Step 2 — Tool Call & Filtering**
   - Set `minAwardAmount` appropriately (e.g., `250000` or `1000000` for prime capture; `50000` for small-business simplified acquisition tracking) so micro-purchases do not crowd out strategic awards.
   - Choose `sortBy: "amount_desc"` to surface flagship enterprise vehicles first, or `sortBy: "expiration_asc"` to triage imminent recompetes.
3. **Step 3 — Cross-Field Normalization & Ranking**
   - Separate `RECOMPETE_CONTRACT` records from `OPEN_GRANT` records in analysis while leveraging shared fields (`priorityScore` `0–100`, `priorityTier` `HIGH`/`MEDIUM`/`STANDARD`, `daysUntilExpiration`, `agency`, `sourceUrl`).
   - Group expiring contracts by `incumbentVendor` / `incumbentUei` and `subAgency` to expose incumbent concentration and multi-award capture plays.
   - Note that Grants.gov search listings return `openDate`, `endDateOrCloseDate`, `agencyCode`, and `cfdaList`, whereas `amountUsd` is typically `null` on summary grant notices until full NOFO review.
4. **Step 4 — Structured Deliverable Output**
   - Render the capture brief using [templates/report-template.md](templates/report-template.md) with clickable `usaspending.gov` and `grants.gov` verification links and pre-RFP capture action items.

## Data Provenance & Safety Rules

- **Cite Official Award & Opportunity Identifiers:** Always include `opportunityOrAwardId` (PIID/FAIN or Grants.gov Opportunity Number), 12-character `incumbentUei`, `naicsCode` / `pscCode` / `cfdaList`, and `sourceUrl` verbatim.
- **No Contracting-Officer Contact Hallucination:** USASpending award summaries and Grants.gov search hits provide verified agency names, incumbent entities, UEIs, and award URLs—not individual Contracting Officer (KO) emails or phone numbers. Never fabricate KO contact details.
- **Clarify Obligated Dollars vs. Ceiling:** `amountUsd` on USASpending reflects obligated contract award value to date; advise capture managers to inspect modification history on the linked `sourceUrl` for full IDIQ ceiling context.
- **Surface Warnings Transparently:** If `RUN_SUMMARY.escalations`, `stoppedByBudgetCap: true`, or upstream API `escalationWarnings` occur, report them explicitly in the brief header.
