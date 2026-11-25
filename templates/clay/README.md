# Clay HTTP API Enrichment Recipes

Use **Clay HTTP API** columns to enrich any Clay prospect, vendor, or clinic table directly against official US/EU public registries via Apify's synchronous dataset endpoint (`run-sync-get-dataset-items`) — **zero third-party data vendor markups ($0.50–$1.00 / 1,000 records)**.

## Universal Clay HTTP API Column Setup

1. In your Clay table, click **Add Column → Add Enrichment → HTTP API**.
2. Set **Method** to `POST`.
3. Set **Endpoint** to:
   ```text
   https://api.apify.com/v2/acts/desastreger~<ACTOR_SLUG>/run-sync-get-dataset-items
   ```
4. Under **Headers**, add:
   - `Content-Type`: `application/json`
   - `Authorization`: `Bearer <YOUR_APIFY_TOKEN>` *(stored in Clay Secrets)*
5. Paste one of the JSON **Body** templates below (mapping your Clay `/` column tokens).
6. Click **Save and Run** on 1–3 test rows, click any response cell to map nested JSON keys (`[0].primaryContactName`, `[0].kybVerificationScore`, etc.) into dedicated Clay columns.

---

## Recipe 1: Enrich Startup Companies with SEC Form D Funding, Executive Contacts & EIN

- **Endpoint:** `https://api.apify.com/v2/acts/desastreger~sec-form-d-funding-leads/run-sync-get-dataset-items`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "searchQuery": "/Company Name",
    "daysBack": 365,
    "maxResults": 1,
    "operatingCompaniesOnly": true,
    "includeSecEntityMetadata": true,
    "enrichWithFederalAwards": true
  }
  ```
- **Recommended Clay Output Columns:**
  - `Form D Closed USD`: `[0].totalAmountSold`
  - `Executive Contact`: `[0].primaryContactName`
  - `Executive Title`: `[0].primaryContactTitle`
  - `Executive Phone`: `[0].phone`
  - `Company EIN`: `[0].secEntityMetadata.ein`
  - `SBIR / Federal Awards`: `[0].federalAwards.hasFederalAwards`

---

## Recipe 2: Screen B2B Accounts & Vendors with US KYB Compliance Dossier (GLEIF LEI, SEC, FDA, CFPB, USASpending)

- **Endpoint:** `https://api.apify.com/v2/acts/desastreger~us-kyb-compliance-dossier/run-sync-get-dataset-items`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "companies": ["/Company Name"],
    "includeGleifLei": true,
    "includeSecFilings": true,
    "includeFdaEnforcement": true,
    "includeCfpbComplaints": true,
    "includeFederalAwards": true
  }
  ```
- **Recommended Clay Output Columns:**
  - `KYB Score (0-100)`: `[0].kybVerificationScore`
  - `Verification Status`: `[0].verificationStatus`
  - `Resolved Legal Name`: `[0].resolvedLegalName`
  - `Global LEI`: `[0].lei`
  - `SEC CIK`: `[0].primaryCik`
  - `Risk Flags`: `[0].riskFlags`

---

## Recipe 3: Audit Prospect Domains for Email Stack (Google/M365), SPF SaaS Tools & DMARC Gaps

- **Endpoint:** `https://api.apify.com/v2/acts/desastreger~b2b-domain-mail-security-posture/run-sync-get-dataset-items`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "domains": ["/Domain"],
    "includeTlsCertificate": true,
    "includeRdapWhois": true,
    "includeBgpAsn": true
  }
  ```
- **Recommended Clay Output Columns:**
  - `Mail Provider`: `[0].mxProvider`
  - `DMARC Policy`: `[0].dmarcPolicy`
  - `DMARC Vulnerable`: `[0].dmarcSpoofingVulnerable`
  - `SPF SaaS Tools`: `[0].spfDetectedSaaSTools`
  - `Security Score`: `[0].securityPostureScore`
  - `Domain Age (Years)`: `[0].rdap.domainAgeYears`

---

## Recipe 4: Pull Healthcare Clinic Owners & Direct Phones by NPI or Practice Name (CMS NPPES)

- **Endpoint:** `https://api.apify.com/v2/acts/desastreger~us-healthcare-practice-owners/run-sync-get-dataset-items`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "organizationName": "/Practice Name",
    "state": "/State",
    "excludeChains": true,
    "maxResults": 1
  }
  ```
- **Recommended Clay Output Columns:**
  - `NPI Number`: `[0].npi`
  - `Owner / Authorized Official`: `[0].authorizedOfficialName`
  - `Official Title`: `[0].authorizedOfficialTitle`
  - `Direct Phone`: `[0].phone`
  - `Lead Score`: `[0].leadScore`

---

## Recipe 5: Check Industrial Facilities for EPA Clean Water / Clean Air / RCRA Violations

- **Endpoint:** `https://api.apify.com/v2/acts/desastreger~epa-echo-industrial-facility-compliance/run-sync-get-dataset-items`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "facilityName": "/Company Name",
    "states": ["/State"],
    "maxResults": 3
  }
  ```
- **Recommended Clay Output Columns:**
  - `EPA Registry ID`: `[0].registryId`
  - `SNC Violation Flag`: `[0].significantNonCompliance`
  - `Quarters In Non-Compliance`: `[0].quartersWithNonCompliance`
  - `Total Penalties USD`: `[0].totalPenaltiesUsd`

---

## All 10 Supported Apify Actor Slugs for Clay

| Actor Slug | Registry / Protocol | Launch Rate |
| :--- | :--- | :--- |
| `desastreger~sec-form-d-funding-leads` | SEC EDGAR Form D + USASpending | `$1.00 / 1k` |
| `desastreger~us-kyb-compliance-dossier` | GLEIF LEI + SEC + FDA + CFPB + USASpending | `$1.00 / 1k` |
| `desastreger~federal-govcon-recompete-radar` | USASpending + Grants.gov | `$0.80 / 1k` |
| `desastreger~us-metro-building-trade-permits` | LA, Chicago, Austin, SF, Seattle Socrata | `$0.50 / 1k` |
| `desastreger~cross-border-tariff-eu-trade-mcp` | USITC HTS + EU VIES VAT + EU TED | `$0.80 / 1k` |
| `desastreger~us-healthcare-practice-owners` | CMS NPPES NPI v2.1 | `$0.50 / 1k` |
| `desastreger~b2b-domain-mail-security-posture` | RFC DNS / TLS / IANA RDAP / RIPEstat BGP | `$0.50 / 1k` |
| `desastreger~us-municipal-code-violation-distressed-leads` | 6 US Municipal Socrata Portals | `$0.80 / 1k` |
| `desastreger~epa-echo-industrial-facility-compliance` | US EPA ECHO (CWA / CAA / RCRA) | `$0.50 / 1k` |
| `desastreger~openalex-pubmed-expert-finder-mcp` | ClinicalTrials.gov v2 + Europe PMC / PubMed | `$0.50 / 1k` |
