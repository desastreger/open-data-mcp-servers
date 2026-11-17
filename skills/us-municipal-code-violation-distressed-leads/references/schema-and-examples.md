# US Municipal Code Violations & Distressed Leads — Schema, Output & Query Recipes

## 1. Input Parameter Reference

### Actor & `search_code_violation_leads` Parameters

| Parameter | Type | Default | Valid Values / Constraints | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `metros` | `string[]` | `["austin", "san_francisco", "buffalo"]` | `"austin"`, `"seattle"`, `"san_francisco"`, `"buffalo"`, `"montgomery_md"`, `"cincinnati"` | Queries official Socrata endpoints concurrently/round-robin with per-city fault isolation. |
| `distressFilter` | `string` | `"all"` | `"all"`, `"structural_hazard"`, `"vacant_abandoned"`, `"fire_electrical_plumbing"`, `"housing_habitability"`, `"unpermitted_zoning"`, `"exterior_blight"` | Deterministic cross-city taxonomy mapping raw municipal violation codes into standardized distress buckets. |
| `openCasesOnly` | `boolean` | `false` | `true` \| `false` | Filters out closed, abated, complied, or withdrawn municipal cases (`isOpenCase === true`). |
| `keywords` | `string[]` | `[]` | Array of case-insensitive substrings (e.g., `["condemned", "vacant", "roof", "mold"]`) | Matched against `description`, `violationType`, `status`, `inspectorOrDivision`, `parcelId`, and `address`. |
| `maxResults` | `integer` | `10` (MCP) / `25` (REST) | `1–50` via MCP Standby; `1–500` via Apify REST run | Caps total returned leads across all selected municipal portals. |

### Supported Municipal Socrata Portals (`list_code_violation_metros`)

| Metro Key | Jurisdiction | Official Socrata Dataset | Primary Parcel / Case Identifiers |
| :--- | :--- | :--- | :--- |
| `austin` | Austin, TX | Austin Code Department Compliance (`6wtj-zbtb`) | `case_id`, `tcad_id` (`parcelId`) |
| `seattle` | Seattle, WA | Seattle SDCI Code Complaints & Violations (`ez4a-iug7`) | `recordnum` |
| `san_francisco` | San Francisco, CA | SF Dept. of Building Inspection Complaints (`gm2e-bten`) | `complaint_number`, `block`/`lot` (`parcelId`) |
| `buffalo` | Buffalo, NY | City of Buffalo Code Violations (`ivrf-k9vm`) | `case_number`, `sbl` (`parcelId`) |
| `montgomery_md` | Montgomery County, MD | DHCA Housing Code Violations (`k9nj-z35d`) | `case_number` |
| `cincinnati` | Cincinnati, OH | Cincinnati / CAGIS Code Enforcement (`cncm-znd6`) | `number_key`, `parcel` (`parcelId`) |

---

## 2. Normalized Output Record Schema

Every returned property record conforms to the unified 19-field `code-violation-lead` schema:

```json
{
  "caseId": "2026-148597 CC",
  "metro": "austin",
  "city": "Austin",
  "state": "TX",
  "zipCode": "78745",
  "address": "5907 EUREKA DRIVE",
  "parcelId": "0415120205",
  "distressCategory": "UNPERMITTED_ZONING",
  "violationType": "Complaints - Work Without Permit - Priority 5",
  "status": "Pending",
  "isOpenCase": true,
  "openedDate": "2026-11-11",
  "description": "Work Without Permit",
  "inspectorOrDivision": "Monroe Yarbrough ((512) 788-3046)",
  "latitude": 30.207773,
  "longitude": -97.790069,
  "distressScore": 69,
  "investorPriorityTier": "HIGH_MOTIVATION",
  "sourcePortalUrl": "https://data.austintexas.gov/Public-Safety/Austin-Code-Department-Code-Compliance/6wtj-zbtb"
}
```

### Key Analytical Fields
- **`distressCategory`:** Normalized uppercase enum (`STRUCTURAL_HAZARD`, `VACANT_ABANDONED`, `FIRE_ELECTRICAL_PLUMBING`, `HOUSING_HABITABILITY`, `UNPERMITTED_ZONING`, `EXTERIOR_BLIGHT`, or `GENERAL_CODE`).
- **`distressScore` & `investorPriorityTier`:** Deterministic `0–100` score combining severity category, open-case status, recency (`openedDate`), parcel/address completeness, and high-urgency hazard terms—bucketed into `CRITICAL_DISTRESS`, `HIGH_MOTIVATION`, and `STANDARD`.

---

## 3. Concrete B2B Query Recipes

### Recipe 1: Off-Market Wholesaling & Fix-and-Flip Acquisition Feed
**Goal:** Find open condemned, unsafe, or structurally compromised residential/commercial buildings across Austin, Buffalo, and Cincinnati for direct-to-seller acquisition.
```json
{
  "metros": ["austin", "buffalo", "cincinnati"],
  "distressFilter": "structural_hazard",
  "openCasesOnly": true,
  "maxResults": 40
}
```
**Expected Analytical Takeaway:** Surfaces `CRITICAL_DISTRESS` properties with `parcelId` (`TCAD`, `SBL`, `CAGIS` parcel numbers) and street addresses ready for county tax-delinquency cross-checks and owner skip-tracing.

### Recipe 2: Specialty Trade Contractor Repair Demand (Electrical, Plumbing & Fire Safety)
**Goal:** Pull active electrical, plumbing, water-heater, and fire-safety code citations in Seattle and San Francisco where property owners must hire licensed contractors to cure violations.
```json
{
  "metros": ["seattle", "san_francisco"],
  "distressFilter": "fire_electrical_plumbing",
  "openCasesOnly": true,
  "maxResults": 35
}
```
**Expected Analytical Takeaway:** Delivers live, compliance-driven repair leads (`isOpenCase: true`) with exact street addresses, ZIP codes, and violation descriptions so local MEP/fire-protection contractors can pitch rapid code abatement.

### Recipe 3: Unpermitted Work & Architect/Permit Expediter Prospecting
**Goal:** Identify properties hit with stop-work orders or unpermitted remodel citations in Austin and San Francisco.
```json
{
  "metros": ["austin", "san_francisco"],
  "distressFilter": "unpermitted_zoning",
  "openCasesOnly": true,
  "keywords": ["permit"],
  "maxResults": 30
}
```
**Expected Analytical Takeaway:** Pinpoints owners caught building without permits who immediately need licensed structural engineers, architects, permit expediters, or general contractors to legalize work and lift municipal stop-work orders.
