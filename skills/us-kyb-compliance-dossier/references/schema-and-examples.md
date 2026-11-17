# US KYB & Compliance Dossier — Schema & Query Recipes

Reference guide for `desastreger/us-kyb-compliance-dossier` (`https://desastreger--us-kyb-compliance-dossier.apify.actor/mcp`).

---

## 1. Complete Input Parameter Reference

Parameters match `.actor/input_schema.json` and MCP tools (`screen_company_kyb`, `batch_screen_companies`).

| Parameter | Type | Default | Valid Values / Constraints | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `companies` | `array<string>` | `["Pfizer"]` | `1–20` items in MCP (`batch_screen_companies`); `1–500` items in REST | Deduplicated case-insensitively. Required when calling `batch_screen_companies`. |
| `companyName` | `string` | *(unset)* | Non-empty company legal or trade name | Required when calling `screen_company_kyb`; optional convenience input in REST runs (merged with `companies`). |
| `includeGleifLei` | `boolean` | `true` | `true`, `false` | Queries GLEIF Global LEI API (prioritizing US legal addresses first, then global fallback) for 20-char `lei`, `entityStatus`, `registrationStatus`, `jurisdiction`, and HQ address. |
| `includeSecFilings` | `boolean` | `true` | `true`, `false` | Queries SEC EDGAR EFTS index (rate-limited under SEC Fair Access rules) for `primaryCik`, display names, states, and recent `10-K`/`10-Q`/`8-K`/`Form D` filings. |
| `includeFdaEnforcement` | `boolean` | `true` | `true`, `false` | Queries openFDA Drug and Medical Device Enforcement endpoints for historical and active Class I, II, and III recalls. |
| `includeCfpbComplaints` | `boolean` | `true` | `true`, `false` | Queries Consumer Financial Protection Bureau (CFPB) complaint database for total complaint counts and top consumer issues. |
| `includeFederalAwards` | `boolean` | `true` | `true`, `false` | Queries USASpending.gov prime contract awards (`A`, `B`, `C`, `D`) to confirm federal contractor footprint, obligated USD volume, and awarding agencies. |

### Standardized `riskFlags` Enum Reference
- `INACTIVE_ENTITY_STATUS` — GLEIF `entityStatus` is present and not `ACTIVE`.
- `LAPSED_LEI` — GLEIF `registrationStatus` is `LAPSED`, `RETIRED`, `ANNULLED`, or `PENDING_ARCHIVE`.
- `FDA_CLASS_I_RECALL_ACTIVE` — Open ongoing Class I FDA drug or device recall (deducts `-15` points).
- `FDA_RECALL_HISTORY` — One or more historical/terminated FDA recalls on record.
- `CFPB_HIGH_COMPLAINT_VOLUME` — `>= 500` CFPB complaints for SEC-reporting entities or `>= 50` for private entities (deducts `-15` points).
- `CFPB_COMPLAINTS_PRESENT` — At least 1 CFPB complaint recorded.
- `UPSTREAM_PARTIAL_TIMEOUT` — One or more upstream government registries returned a timeout/HTTP error (check nested `<registry>.error`).
- `NO_REGISTRY_MATCH` — Zero footprint found across all queried public registries (`verificationStatus: "UNVERIFIED"`).

---

## 2. Sample Normalized Output Record

```json
{
  "queriedCompany": "Pfizer",
  "normalizedQuery": "Pfizer",
  "resolvedLegalName": "PFIZER INC.",
  "kybVerificationScore": 100,
  "verificationStatus": "VERIFIED_ENTITY",
  "riskFlags": [
    "FDA_RECALL_HISTORY"
  ],
  "lei": "765LHXWGK1KXCLTFYQ30",
  "primaryCik": "0000078003",
  "jurisdiction": "US-DE",
  "headquartersLocation": "66 HUDSON BOULEVARD EAST, NEW YORK, US-NY, 10001-2192, US",
  "isFederalContractor": true,
  "registriesMatchedCount": 3,
  "scoreBreakdown": {
    "baseline": 20,
    "primaryRegistryVerified": 40,
    "activeIssuedLei": 20,
    "operatingFootprintConfirmed": 20,
    "enforcementRiskDeduction": 0
  },
  "gleifLei": {
    "matched": true,
    "lei": "765LHXWGK1KXCLTFYQ30",
    "legalName": "PFIZER INC.",
    "entityStatus": "ACTIVE",
    "registrationStatus": "ISSUED",
    "jurisdiction": "US-DE",
    "error": null
  },
  "secEdgar": {
    "matched": true,
    "primaryCik": "0000078003",
    "totalFilingsFound": 100,
    "recentForms": ["10-K", "10-Q", "8-K"],
    "error": null
  },
  "fdaEnforcement": {
    "totalRecalls": 14,
    "hasActiveClassIRecall": false,
    "error": null
  },
  "cfpbComplaints": {
    "totalComplaints": 0,
    "error": null
  },
  "federalAwards": {
    "isFederalContractor": true,
    "awardsCount": 10,
    "error": null
  },
  "screenedAt": "2026-11-17T10:15:00.000Z"
}
```

---

## 3. Concrete B2B Query Recipes

### Recipe 1: Healthcare & Medical Device Supplier TPRM Onboarding
Call `batch_screen_companies` before approving clinical or hospital supply-chain vendors:

```json
{
  "companies": ["Medtronic", "Dexcom", "Abbott Laboratories", "Stryker"],
  "includeGleifLei": true,
  "includeSecFilings": true,
  "includeFdaEnforcement": true,
  "includeCfpbComplaints": false,
  "includeFederalAwards": true
}
```
**Analytical Takeaway:** Confirms active LEI and SEC reporting standing while immediately surfacing `FDA_CLASS_I_RECALL_ACTIVE` vs routine historical `FDA_RECALL_HISTORY` so quality-assurance reviewers focus only on high-severity active recalls.

### Recipe 2: Fintech Partner & Lending Counterparty KYB Triage
Call `batch_screen_companies` with CFPB and SEC checks enabled to evaluate banking, BNPL, or payment-processing partners:

```json
{
  "companies": ["SoFi Technologies", "Affirm Holdings", "Block Inc"],
  "includeGleifLei": true,
  "includeSecFilings": true,
  "includeFdaEnforcement": false,
  "includeCfpbComplaints": true,
  "includeFederalAwards": false
}
```
**Analytical Takeaway:** Distinguishes routine `CFPB_COMPLAINTS_PRESENT` from elevated `CFPB_HIGH_COMPLAINT_VOLUME` (`>= 500` public / `>= 50` private) alongside `LAPSED_LEI` corporate-governance hygiene flags.

### Recipe 3: Single-Counterparty Pre-Contract KYB Deep Dive
Call `screen_company_kyb` across all five registries for an instant compliance memo before signing an enterprise MSA:

```json
{
  "companyName": "Lockheed Martin",
  "includeGleifLei": true,
  "includeSecFilings": true,
  "includeFdaEnforcement": true,
  "includeCfpbComplaints": true,
  "includeFederalAwards": true
}
```
**Analytical Takeaway:** Produces a complete audit record tying canonical legal name, Delaware/state jurisdiction, HQ address, LEI, SEC CIK, and USASpending prime contractor verification into a single `0–100` score.
