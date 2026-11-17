---
name: epa-echo-industrial-facility-compliance
description: "Screen US industrial plants, chemical manufacturers, refineries, and utilities via official US EPA ECHO REST APIs for Clean Water Act (NPDES), Clean Air Act, and RCRA hazardous waste violations, Significant Non-Compliance (SNC/HPV) flags, inspections, and civil penalties. Activate when the user asks to 'find factories with EPA Clean Water or Clean Air violations', 'check EPA compliance history for a facility or FRS Registry ID', 'screen industrial suppliers for environmental penalties', or 'build environmental remediation sales lists'."
summary: "Screen US industrial plants, chemical manufacturers, refineries, and utilities via official US EPA ECHO APIs for Clean Water Act NPDES, Clean Air Act, and RCRA violations, SNC/HPV flags, inspections, civil penalties, and 0-100 risk scores via remote MCP."
version: "1.0.0"
tags:
  - epa-echo
  - environmental-compliance
  - industrial-facilities
  - clean-water-npdes
  - clean-air-act
  - rcra-hazardous-waste
  - esg-supply-chain
  - environmental-remediation
  - mcp-server
keywords:
  - US EPA ECHO API scraper
  - industrial facility compliance screening
  - NPDES Clean Water Act violations
  - Clean Air Act High Priority Violation
  - RCRA hazardous waste non-compliance
  - EPA FRS Registry ID lookup
  - environmental consulting sales leads
  - M&A environmental due diligence
  - industrial civil penalties search
use_cases:
  - Identify manufacturing plants and refineries in Significant Non-Compliance (SNC/HPV) for environmental engineering, remediation, and EHS compliance consulting outreach
  - Target penalized industrial facilities (minPenaltyUsd) by NAICS sector for wastewater treatment, air scrubber, and emissions monitoring equipment OEMs
  - Conduct 360-degree M&A and commercial real estate Phase I environmental due diligence on specific plants by EPA FRS Registry ID or permit ID
  - Screen Tier-1 and Tier-2 domestic industrial suppliers for multi-quarter EPA enforcement and civil penalty exposure in ESG risk workflows
  - Underwrite commercial P&C and pollution legal liability insurance policies using verified EPA inspection, violation quarter, and formal enforcement counts
docs_url: "https://github.com/desastreger/open-data-mcp-servers"
---

# US EPA ECHO Industrial Facility Compliance & Violations

Screen US industrial plants, chemical facilities, petroleum refineries, metal finishers, food processors, and utilities across three core federal environmental statutes—**Clean Water Act (`cwa` / NPDES)**, **Clean Air Act (`air`)**, and **RCRA Hazardous Waste (`rcra`)**—directly via official **US EPA Enforcement and Compliance History Online (`echodata.epa.gov`)** REST services.

## When to Use This Skill

**Activate this skill when the user wants to:**
- Discover US industrial facilities with active or recent environmental violations, Significant Non-Compliance (`SNC`), High Priority Violations (`HPV`), multi-quarter non-compliance (`quartersInNonCompliance`), formal enforcement actions, or assessed civil penalties (`totalPenaltiesUsd`).
- Filter industrial compliance leads by 2-letter US state codes, `naicsCode` prefixes (e.g., `"325"` Chemical Manufacturing, `"324"` Petroleum/Coal, `"331"` Primary Metals), city, facility name, or minimum USD penalty threshold.
- Perform cross-statute environmental due diligence on a named plant, 12-digit **EPA FRS Registry ID** (`epaRegistryId`), or program permit ID (`sourcePermitId`) via `lookup_facility_compliance`.

**Do NOT use this skill when:**
- Screening non-US facilities outside US EPA federal/state-delegated jurisdiction.
- Looking for corporate SEC financial filings, FDA product recalls, or CFPB consumer complaints (pair with `us-kyb-compliance-dossier` for corporate parent KYB screening).
- Requesting laboratory stack-test raw chemical concentration time-series (this skill returns facility-level permit compliance statuses, 3-year non-compliance quarters, inspections, enforcement counts, and civil penalties).

## Connect the Remote MCP Server

This skill connects to the live Apify Standby Streamable HTTP MCP server (`$0.50 / 1,000 records` launch pay-per-event rate; `$1.50 / 1,000` standard rate; zero external EPA API keys required).

- **Remote Streamable HTTP MCP Endpoint:** `https://desastreger--epa-echo-industrial-facility-compliance.apify.actor/mcp`
- **Authentication Header:** `Authorization: Bearer $APIFY_TOKEN`

### Claude Code CLI
```bash
claude mcp add --transport http epa-echo-industrial-facility-compliance https://desastreger--epa-echo-industrial-facility-compliance.apify.actor/mcp \
  --header "Authorization: Bearer $APIFY_TOKEN"
```

### Cursor / Claude Desktop (`mcp.json` / `claude_desktop_config.json`)
```json
{
  "mcpServers": {
    "epa-echo-industrial-facility-compliance": {
      "url": "https://desastreger--epa-echo-industrial-facility-compliance.apify.actor/mcp",
      "headers": {
        "Authorization": "Bearer <YOUR_APIFY_TOKEN>"
      }
    }
  }
}
```

### Apify REST API Fallback (cURL / Scripts / Clay / n8n)
For territory-wide industrial compliance sweeps up to `500` records per run:
```bash
curl -sS -X POST "https://api.apify.com/v2/acts/desastreger~epa-echo-industrial-facility-compliance/run-sync-get-dataset-items" \
  -H "Authorization: Bearer $APIFY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "programs": ["cwa", "air", "rcra"],
    "states": ["TX", "LA"],
    "violationsOnly": true,
    "naicsCode": "325",
    "minPenaltyUsd": 10000,
    "maxResults": 50
  }'
```

## MCP Tools & Parameter Selection

| MCP Tool | Purpose | Key Arguments & Defaults |
| :--- | :--- | :--- |
| `search_epa_facility_violations` | Territory & industry screening for facilities with violations, SNC/HPV flags, or civil penalties. | `programs` (`["cwa", "air"]` default; supports `"cwa"`, `"air"`, `"rcra"`), `states` (`["DE"]` default; 2-letter US codes), `violationsOnly` (`true`), `facilityName` (optional), `city` (optional), `naicsCode` (2–6 digit prefix), `minPenaltyUsd` (`0`), `maxResults` (`10` default, `1–50` in MCP; `1–500` via REST). |
| `lookup_facility_compliance` | 360-degree cross-statute due diligence on a specific plant (returns both clean and non-compliant permits by default). | At least one of `registryId` (12-digit EPA FRS ID), `sourcePermitId` (NPDES/CAA/RCRA ID), or `facilityName`; plus optional `state` (2-letter), `city`, `programs` (`["cwa", "air", "rcra"]` default), `violationsOnly` (`false` default), `maxResults` (`10` default, `1–50`). |

### Parameter Selection Rules
1. **Prospecting vs Due Diligence:** Use `search_epa_facility_violations` (`violationsOnly: true`) when building B2B remediation/OEM sales lists. Use `lookup_facility_compliance` (`violationsOnly: false`, all 3 `programs`) when auditing a specific target plant so clean permits are confirmed alongside violations.
2. **Statute Alignment for Equipment/Consulting:** Select `["cwa"]` for wastewater/NPDES engineering, `["air"]` for stack scrubbers/VOC/CAA Title V consulting, and `["rcra"]` for hazardous waste disposal and containment vendors.
3. **NAICS + State Scoping:** Always pair large industrial states (`TX`, `LA`, `OH`, `PA`, `CA`, `IL`) with a `naicsCode` prefix (`"324"`, `"325"`, `"331"`, `"332"`) or `minPenaltyUsd` filter to surface high-budget industrial operators first.

### Canonical MCP Tool Call Payloads

**Industry Violation Screening (`search_epa_facility_violations`):**
```json
{
  "programs": ["cwa", "air"],
  "states": ["TX", "LA"],
  "violationsOnly": true,
  "naicsCode": "325",
  "minPenaltyUsd": 10000,
  "maxResults": 25
}
```

**Single-Plant 360-Degree Audit (`lookup_facility_compliance`):**
```json
{
  "registryId": "110000338652",
  "programs": ["cwa", "air", "rcra"],
  "violationsOnly": false,
  "maxResults": 15
}
```

### Interpreting EPA Compliance & Risk Signals

| Output Field | High-Signal Values | Actionable EHS / ESG / OEM Interpretation |
| :--- | :--- | :--- |
| `inSignificantNonCompliance` | `true` | Active EPA Significant Non-Compliance (`SNC` under CWA/RCRA) or High Priority Violation (`HPV` under CAA) — urgent regulatory remediation mandate. |
| `quartersInNonCompliance` | `4` to `12` (out of 12 three-year quarters) | Chronic, multi-year effluent, emissions, or waste handling deficiency requiring capital equipment or engineering intervention. |
| `totalPenaltiesUsd` & `formalEnforcementCount` | `> 0` USD / `>= 1` FEA | Confirmed federal/state formal enforcement orders and civil fines proving compliance budget urgency. |
| `complianceRiskScore` / `riskTier` | `70–100` (`CRITICAL`), `40–69` (`ELEVATED`) | Deterministic composite of SNC/HPV status, non-compliant quarters, formal enforcement actions, and assessed penalty severity. |

See [references/schema-and-examples.md](references/schema-and-examples.md) for the complete parameter table, 21-field output schema, and 3 B2B query recipes.

## Execution Workflow

Follow this deterministic 4-step workflow on every invocation:

1. **Scoping & Cost-Aware Sizing:** Identify whether the request is a broad territory/industry screen (`search_epa_facility_violations`) or a named-site audit (`lookup_facility_compliance`). Start interactive runs at `maxResults: 10` to `25` (`$0.005–$0.0125` at launch pricing).
2. **Tool Call & Filtering:** Pass exact lowercase `programs` enums (`"cwa"`, `"air"`, `"rcra"`) and uppercase 2-letter `states`. When looking up a plant by `facilityName` without a `registryId`, always pass `state` (and `city` if known) to prevent cross-state homonym matches.
3. **Cross-Field Normalization & Ranking:** Group multiple program permits sharing the same 12-digit `epaRegistryId` so cross-media (Water + Air + RCRA) risk is consolidated per physical plant, then rank by `complianceRiskScore` (`0–100`) descending (`CRITICAL` >= 70, `ELEVATED` 40–69, `MODERATE` < 40) and `totalPenaltiesUsd`.
4. **Structured Deliverable Output:** Populate [templates/report-template.md](templates/report-template.md) with facility names, `epaRegistryId`, `sourcePermitId`, `statuteProgram`, `inSignificantNonCompliance`, `quartersInNonCompliance`, `totalPenaltiesUsd`, and direct `echoReportUrl` links.

## Data Provenance & Safety Rules

- **Cite Official EPA Identifiers:** Anchor every finding to its `epaRegistryId` (12-digit FRS ID), program `sourcePermitId`, `statuteProgram` (`CLEAN_WATER_ACT`, `CLEAN_AIR_ACT`, `RCRA_HAZARDOUS_WASTE`), and official `echoReportUrl` (`https://echo.epa.gov/detailed-facility-report?fid=<id>`).
- **Accurate Regulatory Terminology & Zero Contact Fabrication:** Distinguish Historical/Addressed violations from current Significant Non-Compliance (`inSignificantNonCompliance: true`). EPA ECHO does not publish private plant manager emails—never fabricate contact details.
- **Transparent Warnings & Truncation:** Surface any `escalationWarnings`, empty-program results, or budget cap limits clearly in your response.

### High-Value Multi-Skill Chaining
- **Corporate Parent Risk Dossier (`us-kyb-compliance-dossier`):** Pair plant-level `epaRegistryId` violations with parent-company KYB checks across GLEIF LEI corporate hierarchies, SEC 10-K environmental contingencies, FDA recalls, and USASpending federal contracts.
- **Federal Remediation & Energy Grants (`federal-govcon-recompete-radar`):** Match industrial sectors facing Clean Water or Clean Air mandates with open DOE/EPA industrial decarbonization grants and expiring federal environmental remediation contracts.
- **Supplier Domain Verification (`b2b-domain-mail-security-posture`):** When onboarding domestic chemical or manufacturing suppliers, pair EPA compliance screening with domain RDAP age and DMARC/TLS security posture checks.
