# CMS NPPES Practice Owners — Schema, Output & Query Recipes

## 1. Input Parameter Reference

### Actor & `search_healthcare_practice_owners` Parameters

| Parameter | Type | Default | Valid Values / Constraints | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `specialty` | `string` | `"dentist"` | `"dentist"`, `"orthodontics"`, `"dermatology"`, `"physical_therapy"`, `"chiropractic"`, `"optometry"`, `"mental_health"`, `"urgent_care"`, `"ambulatory_surgery"`, `"home_health"`, `"pharmacy"`, `"plastic_surgery"`, `"custom"` | Maps to curated CMS NPPES `taxonomy_description` queries. Set to `"custom"` when supplying `customTaxonomy`. |
| `customTaxonomy` | `string` | `undefined` | Free-text CMS taxonomy keyword (e.g., `"Podiatrist"`, `"Ophthalmology"`, `"Pediatrics"`, `"Oral & Maxillofacial"`) | Used only when `specialty` is `"custom"`. |
| `states` | `string[]` | `["TX"]` | 2-letter uppercase US state/territory codes (e.g., `["TX", "FL", "CA"]`) | Iterated sequentially with deduplication across NPIs. |
| `city` | `string` | `undefined` | US city name (e.g., `"Austin"`, `"Scottsdale"`, `"Miami"`) | Optional municipal filter applied directly to the CMS NPPES query. |
| `postalCode` | `string` | `undefined` | 5-digit ZIP (`"78701"`) or wildcard prefix (`"752*"`, `"902*"`) | Supports CMS prefix wildcards (`2` to `5` digits + `*`) for metro sub-territory targeting. |
| `requireAuthorizedOfficial` | `boolean` | `true` | `true` \| `false` | Filters out incomplete `NPI-2` filings lacking a named owner, president, or managing executive. |
| `independentPracticesOnly` | `boolean` | `false` | `true` \| `false` | Excludes corporate DSO/hospital/pharmacy chains (e.g., Walgreens, CVS, HCA, Kaiser, Aspen Dental), organizational subparts, and multi-site groups sharing one executive across batch locations. |
| `maxResults` | `integer` | `10` (MCP) / `25` (REST) | `1–100` via MCP Standby; `1–500` via Apify REST run | Stops streaming immediately once `maxResults` verified leads are emitted. |

### `lookup_practice_by_npi` Parameters (MCP Tool Only)

| Parameter | Type | Default | Valid Values / Constraints | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `npi` | `string` | *(required)* | Exact 10-digit US NPI string (e.g., `"1043458821"`) | Returns `{ found, npi, practice }` with normalized ownership classification and `0–100` `leadScore`. |

---

## 2. Normalized Output Record Schema

Every item returned in `leads` (or dataset output) conforms to the deterministic 24-field `healthcare-practice-lead` schema:

```json
{
  "npi": "1043458821",
  "practiceLegalName": "1-800-GO-DENTIST",
  "dbaName": null,
  "authorizedOfficialName": "BRADLEY K BARTELLI",
  "authorizedOfficialCredential": "D.M.D",
  "authorizedOfficialTitle": "President",
  "authorizedOfficialPhone": "(361) 851-2828",
  "hasDistinctOfficialPhone": false,
  "practicePhone": "(361) 851-2828",
  "practiceFax": "(361) 851-2830",
  "address": "6262 WEBER RD, SUITE 120",
  "city": "CORPUS CHRISTI",
  "state": "TX",
  "postalCode": "78413-4006",
  "primaryTaxonomyCode": "1223G0001X",
  "primaryTaxonomyDesc": "Dentist, General Practice",
  "secondaryLocationCount": 0,
  "ownershipType": "CLINICIAN_OWNED_PRIVATE_PRACTICE",
  "leadScore": 84,
  "leadTier": "HOT",
  "npiStatus": "A",
  "enumerationDate": "2009-02-01",
  "lastUpdatedDate": "2009-02-01",
  "nppesProfileUrl": "https://npiregistry.cms.hhs.gov/provider-view/1043458821"
}
```

### Key Analytical Fields
- **`ownershipType`:** Distinguishes `CLINICIAN_OWNED_PRIVATE_PRACTICE` (credentialed clinician owner, single/low location count, non-chain legal name) from `INDEPENDENT_ORGANIZATION` and `CORPORATE_OR_DSO_GROUP`.
- **`hasDistinctOfficialPhone`:** `true` when `authorizedOfficialPhone` is populated and differs from the main reception `practicePhone` — highest-converting cold-call signal.
- **`leadScore` & `leadTier`:** Deterministic `0–100` score mapped to `HOT` (`>= 80`), `WARM` (`60–79`), or `STANDARD` (`< 60`) based on active NPI status, named Authorized Official, clinician credentials, distinct executive phone, independent ownership, and record freshness.

---

## 3. Concrete B2B Query Recipes

### Recipe 1: DSO Roll-Up & Dental SaaS Prospecting (Independent Clinician-Owned Clinics)
**Goal:** Pull independent dental practice owners in Dallas ZIP prefixes (`752*`) with named Authorized Officials.
```json
{
  "specialty": "dentist",
  "states": ["TX"],
  "postalCode": "752*",
  "requireAuthorizedOfficial": true,
  "independentPracticesOnly": true,
  "maxResults": 40
}
```
**Expected Analytical Takeaway:** Isolates single-site `DDS` / `DMD` owner-operators (`CLINICIAN_OWNED_PRIVATE_PRACTICE`) while suppressing DSO chains like Aspen Dental or Pacific Dental Services, ranked by `leadScore` and direct official phone availability.

### Recipe 2: Aesthetic Laser & MedSpa Device Territory Build
**Goal:** Identify private plastic surgery, medspa, and dermatology clinic decision-makers across South Florida and Southern California.
```json
{
  "specialty": "plastic_surgery",
  "states": ["FL", "CA"],
  "requireAuthorizedOfficial": true,
  "independentPracticesOnly": true,
  "maxResults": 50
}
```
**Expected Analytical Takeaway:** Surfaces `MD` / `DO` medical directors and clinic presidents purchasing high-ticket aesthetic equipment, injectables, and patient-financing software, complete with direct phone lines and suite-level addresses.

### Recipe 3: Custom Specialty Lookup for Podiatry / Ophthalmology Billing Services
**Goal:** Target independent ophthalmology clinics in New York and New Jersey using a custom CMS taxonomy string.
```json
{
  "specialty": "custom",
  "customTaxonomy": "Ophthalmology",
  "states": ["NY", "NJ"],
  "requireAuthorizedOfficial": true,
  "independentPracticesOnly": true,
  "maxResults": 30
}
```
**Expected Analytical Takeaway:** Matches `NPI-2` ophthalmology group practices (`primaryTaxonomyDesc`), enabling RCM billing vendors and surgical supply reps to target managing physicians directly rather than hospital health systems.
