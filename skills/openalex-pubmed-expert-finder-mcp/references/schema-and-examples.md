# Clinical Trials & PubMed KOL Expert Finder — Schema, Output & Query Recipes

## 1. Input Parameter Reference

### Actor & MCP Tool Parameters (`find_clinical_trial_investigators` / `search_pubmed_kol_experts`)

| Parameter | Type | Default | Valid Values / Constraints | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `mode` *(REST Actor only)* | `string` | `"all"` | `"all"`, `"clinical_trial_investigators"`, `"pubmed_kol_authors"` | In MCP mode, tool selection (`find_clinical_trial_investigators` vs `search_pubmed_kol_experts`) sets `mode` automatically. |
| `query` | `string` | `"CAR-T immunotherapy"` | Any therapeutic area, disease, biomarker, target, or modality string (e.g., `"GLP-1 obesity"`, `"KRAS G12C"`, `"ADC breast cancer"`) | Passed directly to ClinicalTrials.gov API v2 and/or Europe PMC `resultType=core` search. |
| `trialStatuses` | `string[]` | `["RECRUITING", "NOT_YET_RECRUITING"]` | `"RECRUITING"`, `"NOT_YET_RECRUITING"`, `"ACTIVE_NOT_RECRUITING"`, `"ENROLLING_BY_INVITATION"`, `"COMPLETED"`, `"SUSPENDED"`, `"TERMINATED"` | Used by `find_clinical_trial_investigators` (and REST `mode: "all"`). |
| `requireDirectContact` | `boolean` | `false` | `true` \| `false` | When `true`, filters clinical trial records to those exposing an unmasked `contactEmail` or `contactPhone`. |
| `minCitations` | `integer` | `0` | Non-negative integer (`0`, `10`, `50`, `100+`) | Minimum `citationCount` filter applied to `search_pubmed_kol_experts` publications. |
| `maxResults` | `integer` | `10` (MCP) / `25` (REST) | `1–50` via MCP Standby; `1–500` via Apify REST run | Maximum normalized expert/investigator leads returned. |

---

## 2. Normalized Output Record Schema

Both clinical trial and PubMed KOL records share a single harmonized 22-field `research-expert-lead` schema (`recordType` distinguishes `CLINICAL_TRIAL_INVESTIGATOR` vs `PUBMED_RESEARCH_KOL`):

```json
[
  {
    "recordType": "CLINICAL_TRIAL_INVESTIGATOR",
    "identifier": "NCT05225363",
    "expertOrContactName": "Lorna Rodriguez",
    "roleOrPosition": "PRINCIPAL_INVESTIGATOR",
    "organizationOrAffiliation": "City of Hope Medical Center",
    "sponsorClass": "ACADEMIC_OR_GOV",
    "contactEmail": "lorrodriguez@coh.org",
    "contactPhone": "626-359-8111",
    "studyOrPaperTitle": "CAR T Cells for the Treatment of Mesothelin-Expressing Cancers",
    "statusOrYear": "RECRUITING",
    "citationCount": null,
    "grantIds": [],
    "leadScore": 96,
    "leadTier": "HOT",
    "leadSponsorName": "City of Hope Medical Center",
    "trialPhases": ["PHASE1"],
    "locationsSummary": "City of Hope Medical Center (Duarte, California, United States)",
    "doi": null,
    "orcid": null,
    "fundingAgencies": ["City of Hope Medical Center"],
    "openAccessUrl": null,
    "sourceUrl": "https://clinicaltrials.gov/study/NCT05225363"
  },
  {
    "recordType": "PUBMED_RESEARCH_KOL",
    "identifier": "PMID:29567707",
    "expertOrContactName": "Carl H June",
    "roleOrPosition": "CORRESPONDING_KOL_AUTHOR",
    "organizationOrAffiliation": "Center for Cellular Immunotherapies, Perlman School of Medicine, Philadelphia, PA, USA",
    "sponsorClass": "ACADEMIC_OR_GOV",
    "contactEmail": "cjune@exchange.upenn.edu",
    "contactPhone": null,
    "studyOrPaperTitle": "CAR T cell immunotherapy for human cancer",
    "statusOrYear": "2018",
    "citationCount": 2421,
    "grantIds": ["5R01CA165206", "R01 CA165206", "1P01CA214278"],
    "leadScore": 100,
    "leadTier": "HOT",
    "leadSponsorName": "National Cancer Institute",
    "trialPhases": [],
    "locationsSummary": null,
    "doi": "10.1126/science.aar6711",
    "orcid": "0000-0003-0241-3557",
    "fundingAgencies": ["National Cancer Institute", "NCI NIH HHS"],
    "openAccessUrl": "https://doi.org/10.1126/science.aar6711",
    "sourceUrl": "https://pubmed.ncbi.nlm.nih.gov/29567707/"
  }
]
```

---

## 3. Concrete B2B Query Recipes

### Recipe 1: CRO & Patient-Recruitment Outbound to Recruiting Oncology Trial PIs
**Goal:** Pull Principal Investigators and unmasked study contact emails/phones for actively recruiting or upcoming `KRAS G12C` solid-tumor trials (`find_clinical_trial_investigators`).
```json
{
  "query": "KRAS G12C",
  "trialStatuses": ["RECRUITING", "NOT_YET_RECRUITING"],
  "requireDirectContact": true,
  "maxResults": 30
}
```
**Expected Analytical Takeaway:** Delivers `HOT`-scored PIs and central study contacts with verified institutional emails, phone numbers, `trialPhases` (`PHASE1` / `PHASE2`), and `locationsSummary` for immediate site-feasibility or biomarker-testing outreach.

### Recipe 2: Medical Affairs / MSL Key Opinion Leader (KOL) Tiering
**Goal:** Map top-cited peer-reviewed KOLs publishing on `GLP-1 receptor agonist cardiometabolic` outcomes (`search_pubmed_kol_experts`).
```json
{
  "query": "GLP-1 receptor agonist cardiometabolic",
  "minCitations": 25,
  "maxResults": 35
}
```
**Expected Analytical Takeaway:** Ranks senior and corresponding academic authors (`CORRESPONDING_KOL_AUTHOR`, `SENIOR_KOL_AUTHOR`) with `citationCount >= 25`, `orcid` IDs, institutional affiliations, and published corresponding emails for advisory board and congress engagement.

### Recipe 3: Life-Science Lab Equipment & Reagent Sales to Grant-Funded CRISPR Labs
**Goal:** Combine upcoming CRISPR trials and NIH-grant-backed academic labs in a single REST payload (`mode: "all"`).
```json
{
  "mode": "all",
  "query": "CRISPR base editing",
  "trialStatuses": ["RECRUITING", "NOT_YET_RECRUITING"],
  "requireDirectContact": false,
  "minCitations": 5,
  "maxResults": 50
}
```
**Expected Analytical Takeaway:** Identifies translational labs holding active `R01`/`U01` `grantIds` (confirming active equipment/reagent purchasing budget) alongside emerging `INDUSTRY` biotech sponsors advancing gene-editing candidates into Phase 1 trials.
