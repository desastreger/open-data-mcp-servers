# Federal GovCon Recompete Radar — Schema & Query Recipes

Reference guide for `desastreger/federal-govcon-recompete-radar` (`https://desastreger--federal-govcon-recompete-radar.apify.actor/mcp`).

---

## 1. Complete Input Parameter Reference

Parameters match `.actor/input_schema.json` for REST runs and map to MCP tools (`search_expiring_recompete_contracts`, `search_open_federal_grants`).

| Parameter | Type | Default | Valid Values / Constraints | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `mode` | `string` | `"all"` | `"all"`, `"recompete_contracts"`, `"open_grants"` | REST feed selector (`all` balances contracts and grants with automatic backfill). MCP tools bind automatically to their respective mode. |
| `keywords` | `array<string>` | `[]` | Domain phrases (`["cybersecurity", "cloud migration", "autonomous systems"]`) | Filters USASpending award descriptions or Grants.gov opportunity titles/synopses. |
| `keyword` | `string` | *(unset)* | Single search string | Convenience alias on `search_open_federal_grants` (merged with `keywords`). |
| `naicsCodes` | `array<string>` | `[]` | 6-digit NAICS strings (`["541512", "541511", "541330", "541715"]`) | Applies to `RECOMPETE_CONTRACT` queries on USASpending.gov. |
| `expiringWithinDays` | `integer` | `180` | `1` to `1095` | Forward lookahead window in days from today for contract Period of Performance End Date. |
| `minAwardAmount` | `integer` | `50000` | `>= 0` (USD) | Minimum obligated USD value for expiring federal contracts. |
| `maxResults` | `integer` | `25` (`10` MCP) | `1` to `1000` (`1` to `50` in MCP mode) | Total normalized records returned; respects PPE budget caps cleanly. |
| `states` | `array<string>` | `[]` | 2-letter US state codes (`["VA", "MD", "DC", "CA", "TX"]`) | Filters contracts by Place of Performance state. |
| `agencies` | `array<string>` | `[]` | Grants.gov agency prefixes (`["DOD", "NSF", "HHS", "DOE", "NASA"]`) | Filters `OPEN_GRANT` opportunities by federal agency code. |
| `oppStatuses` | `string` | `"forecasted\|posted"` | `"posted"`, `"forecasted"`, `"forecasted\|posted"` | MCP parameter on `search_open_federal_grants` controlling Grants.gov status scope. |
| `sortBy` | `string` | `"amount_desc"` | `"amount_desc"`, `"expiration_asc"` | Sorts expiring contracts by highest obligated dollar value or soonest expiration date. |

---

## 2. Sample Normalized Output Records

Both `RECOMPETE_CONTRACT` and `OPEN_GRANT` share a single 22-field schema:

```json
[
  {
    "recordType": "RECOMPETE_CONTRACT",
    "opportunityOrAwardId": "FA862118F6251",
    "titleOrDescription": "CYBERSECURITY AND MISSION SYSTEMS ENGINEERING SUPPORT",
    "agency": "Department of Defense",
    "subAgency": "Department of the Air Force",
    "agencyCode": null,
    "incumbentVendor": "LOCKHEED MARTIN CORPORATION",
    "incumbentUei": "Z4F9X8K2L1M0",
    "amountUsd": 666315748.84,
    "startDate": "2022-02-01",
    "openDate": null,
    "endDateOrCloseDate": "2027-01-31",
    "daysUntilExpiration": 81,
    "status": "active_expiring",
    "naicsCode": "541512",
    "naicsDescription": "COMPUTER SYSTEMS DESIGN SERVICES",
    "pscCode": "DA01",
    "placeOfPerformanceState": "VA",
    "cfdaList": [],
    "sourceUrl": "https://www.usaspending.gov/award/CONT_AWD_FA862118F6251_9700_-NONE-_-NONE-",
    "priorityScore": 100,
    "priorityTier": "HIGH"
  },
  {
    "recordType": "OPEN_GRANT",
    "opportunityOrAwardId": "26-503",
    "titleOrDescription": "Artificial Intelligence and Cybersecurity Education Innovation and Scholarship for Service (CyberAI SFS)",
    "agency": "U.S. National Science Foundation",
    "subAgency": null,
    "agencyCode": "NSF",
    "incumbentVendor": null,
    "incumbentUei": null,
    "amountUsd": null,
    "startDate": "2026-02-04",
    "openDate": "2026-02-04",
    "endDateOrCloseDate": "2027-04-05",
    "daysUntilExpiration": 145,
    "status": "posted",
    "naicsCode": null,
    "naicsDescription": null,
    "pscCode": null,
    "placeOfPerformanceState": null,
    "cfdaList": ["47.076"],
    "sourceUrl": "https://www.grants.gov/search-results-detail/361238",
    "priorityScore": 92,
    "priorityTier": "HIGH"
  }
]
```

---

## 3. Concrete B2B Query Recipes

### Recipe 1: National Capital Region IT & Cyber Pre-RFP Recompete Pipeline
Call `search_expiring_recompete_contracts` to surface `$1M+` federal IT contracts in `VA`, `MD`, and `DC` expiring over the next 9 months:

```json
{
  "keywords": ["cybersecurity", "zero trust", "cloud"],
  "naicsCodes": ["541512", "541511", "541519"],
  "expiringWithinDays": 270,
  "minAwardAmount": 1000000,
  "states": ["VA", "MD", "DC"],
  "sortBy": "amount_desc",
  "maxResults": 20
}
```
**Analytical Takeaway:** Delivers high-ceiling recompete targets ranked by obligated spend alongside `incumbentVendor` and `incumbentUei`, giving BD teams 6–9 months to initiate teaming agreements or shape RFI responses.

### Recipe 2: Imminent 90-Day Subcontracting & Bridge-Contract Triage
Call `search_expiring_recompete_contracts` sorted by `expiration_asc` for engineering and R&D services:

```json
{
  "naicsCodes": ["541330", "541715"],
  "expiringWithinDays": 90,
  "minAwardAmount": 250000,
  "sortBy": "expiration_asc",
  "maxResults": 15
}
```
**Analytical Takeaway:** Surfaces contracts nearing immediate Period of Performance expiration (`daysUntilExpiration <= 90`) where incumbents frequently need rapid specialty staffing, bridge support, or niche technical subcontractors.

### Recipe 3: Non-Dilutive Federal AI & Quantum R&D Grant Scout
Call `search_open_federal_grants` to capture both `posted` and early `forecasted` NOFOs across defense, energy, and science agencies:

```json
{
  "keywords": ["artificial intelligence", "autonomous", "quantum"],
  "agencies": ["DOD", "NSF", "DOE", "NASA"],
  "oppStatuses": "forecasted|posted",
  "maxResults": 15
}
```
**Analytical Takeaway:** Combines active grant deadlines (`endDateOrCloseDate`) with forecasted upcoming solicitations and CFDA program codes (`cfdaList`) for university labs, deep-tech startups, and defense research consortia.
