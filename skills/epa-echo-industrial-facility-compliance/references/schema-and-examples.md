# US EPA ECHO Industrial Compliance — Schema, Output & Query Recipes

## 1. Input Parameter Reference

### Actor & `search_epa_facility_violations` Parameters

| Parameter | Type | Default | Valid Values / Constraints | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `programs` | `string[]` | `["cwa", "air"]` | `"cwa"` (Clean Water Act / NPDES), `"air"` (Clean Air Act), `"rcra"` (RCRA Hazardous Waste) | Queries official EPA ECHO two-step `get_facilities` -> `get_qid` services per statute. |
| `states` | `string[]` | `["DE"]` | 2-letter uppercase US state/territory codes (e.g., `["TX", "LA"]`, `["PA", "OH"]`) | Required for broad geographic screening. |
| `violationsOnly` | `boolean` | `true` | `true` \| `false` | When `true`, emits only facilities with non-compliance quarters, SNC/HPV flags, formal enforcement actions, or civil penalties. |
| `facilityName` | `string` | `undefined` | Partial or exact facility/operator name (e.g., `"CRODA"`, `"DUPONT"`, `"EXXON"`) | Passed to EPA ECHO facility name search. |
| `city` | `string` | `undefined` | City name filter (e.g., `"HOUSTON"`, `"NEW CASTLE"`, `"BATON ROUGE"`) | Scopes state searches to a single municipality. |
| `naicsCode` | `string` | `undefined` | 2-to-6 digit NAICS code or prefix (e.g., `"325"`, `"324110"`, `"332813"`) | Filters facilities by primary industrial classification. |
| `minPenaltyUsd` | `number` | `0` | Non-negative USD threshold (e.g., `10000`, `50000`) | Filters to facilities with assessed formal enforcement civil penalties >= threshold. |
| `maxResults` | `integer` | `10` (MCP) / `25` (REST) | `1–50` via MCP Standby; `1–500` via Apify REST run | Maximum normalized permit compliance records returned. |

### `lookup_facility_compliance` Additional Parameters (MCP Tool Only)

| Parameter | Type | Default | Valid Values / Constraints | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `registryId` | `string` | `undefined` | 12-digit EPA FRS Registry ID (e.g., `"110000338652"`) | Exact physical-site key linking CWA, CAA, and RCRA permits. Provide at least one of `registryId`, `sourcePermitId`, or `facilityName`. |
| `sourcePermitId` | `string` | `undefined` | Program permit ID (e.g., `"DE0000299"`, `"DE0000001000300058"`) | Direct permit-level lookup. |
| `state` | `string` | `undefined` | Single 2-letter US state code (e.g., `"DE"`) | Recommended whenever looking up by `facilityName`. |
| `programs` | `string[]` | `["cwa", "air", "rcra"]` | Subset of `["cwa", "air", "rcra"]` | Defaults to all 3 statutes for 360-degree facility due diligence. |
| `violationsOnly` | `boolean` | `false` | `true` \| `false` | Defaults to `false` so clean permits are also confirmed during M&A/ESG audits. |

---

## 2. Normalized Output Record Schema

Each item returned in `facilities` conforms to the unified 21-field `industrial-compliance-record` schema:

```json
{
  "facilityName": "CRODA, INC",
  "sourcePermitId": "DE0000001000300058",
  "epaRegistryId": "110000338652",
  "statuteProgram": "CLEAN_AIR_ACT",
  "address": "315 CHERRY LANE",
  "city": "NEW CASTLE",
  "state": "DE",
  "zipCode": "19720",
  "county": "New Castle",
  "latitude": 39.690455,
  "longitude": -75.538406,
  "industryCodes": [
    "NAICS:325613",
    "SIC:2821",
    "SIC:2833",
    "SIC:2843"
  ],
  "complianceStatus": "High Priority Violation (Addressed-State)",
  "inSignificantNonCompliance": true,
  "quartersInNonCompliance": 12,
  "inspectionsCount": 249,
  "formalEnforcementCount": 1,
  "totalPenaltiesUsd": 0,
  "complianceRiskScore": 88,
  "riskTier": "CRITICAL",
  "echoReportUrl": "https://echo.epa.gov/detailed-facility-report?fid=110000338652"
}
```

---

## 3. Concrete B2B Query Recipes

### Recipe 1: Gulf Coast Chemical Plant Remediation & Air/Water OEM Sales
**Goal:** Find chemical manufacturing plants (`NAICS 325`) in Texas and Louisiana with active violations and at least `$25,000` in assessed EPA civil penalties.
```json
{
  "programs": ["cwa", "air"],
  "states": ["TX", "LA"],
  "violationsOnly": true,
  "naicsCode": "325",
  "minPenaltyUsd": 25000,
  "maxResults": 35
}
```
**Expected Analytical Takeaway:** Surfaces high-urgency chemical plants under formal EPA consent decrees or penalty orders (`CRITICAL` risk tier) actively budgeting for wastewater treatment upgrades, continuous emissions monitoring, and EHS consulting.

### Recipe 2: RCRA Hazardous Waste Compliance Prospecting in Rust Belt Manufacturing
**Goal:** Screen electroplating and metal-finishing plants (`NAICS 3328`) in Ohio and Pennsylvania for RCRA hazardous waste non-compliance.
```json
{
  "programs": ["rcra"],
  "states": ["OH", "PA"],
  "violationsOnly": true,
  "naicsCode": "3328",
  "maxResults": 30
}
```
**Expected Analytical Takeaway:** Identifies generators and treatment/storage facilities with `RCRA_HAZARDOUS_WASTE` violations (`quartersInNonCompliance > 0`), ideal for licensed hazardous waste haulers, lab-pack services, and secondary containment suppliers.

### Recipe 3: M&A Phase I Environmental Due Diligence by EPA FRS Registry ID
**Goal:** Pull the complete cross-statute permit portfolio (both clean and violated CWA, Clean Air, and RCRA permits) for a target acquisition plant (`110000338652`).
```json
{
  "registryId": "110000338652",
  "programs": ["cwa", "air", "rcra"],
  "violationsOnly": false,
  "maxResults": 20
}
```
**Expected Analytical Takeaway:** Consolidates every federal environmental permit tied to the physical site's FRS ID so deal counsel and ESG underwriters see exact SNC/HPV status, 12-quarter non-compliance history, inspection counts, and direct `echoReportUrl` evidence.
