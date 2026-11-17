# Clinical Trial PI & PubMed KOL Intelligence Report

## Executive Summary
- **Biomedical Topic / Target Query:** `{{query}}`
- **Discovery Scope:** `ClinicalTrials.gov v2 ({{trial_statuses}})` + `PubMed / Europe PMC (Min Citations: {{min_citations}})`
- **Total Verified Expert Leads:** `{{total_leads}}` (`Trial PIs`: `{{trial_pi_count}}` | `PubMed KOLs`: `{{pubmed_kol_count}}`)
- **Direct Unmasked Contact Coverage:** `{{direct_email_count}}` with verified email | `{{direct_phone_count}}` with direct phone
- **Sponsor / Funding Split:** `INDUSTRY`: `{{industry_count}}` | `ACADEMIC_OR_GOV`: `{{academic_count}}` (`{{grant_backed_count}}` with active grant IDs)

---

## Ranked Investigators & Key Opinion Leaders

| Rank | Expert Name & Role | Institution / Sponsor (`Class`) | Direct Email / Phone | Type & ID (`Status / Year`) | Phase / Citations & Grants | Study or Publication Title | Score (`Tier`) | Source |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | **{{expertOrContactName}}** (`{{roleOrPosition}}`) | {{organizationOrAffiliation}} (`{{sponsorClass}}`) | `{{contactEmail}}` / `{{contactPhone}}` | `{{identifier}}` (`{{statusOrYear}}`) | Phases: `{{trialPhases}}` / Citations: `{{citationCount}}` / Grants: `{{grantIds}}` | {{studyOrPaperTitle}} | **{{leadScore}}** (`{{leadTier}}`) | [Link]({{sourceUrl}}) |
| 2 | **{{expertOrContactName_2}}** (`{{roleOrPosition_2}}`) | {{organizationOrAffiliation_2}} (`{{sponsorClass_2}}`) | `{{contactEmail_2}}` / `{{contactPhone_2}}` | `{{identifier_2}}` (`{{statusOrYear_2}}`) | Phases: `{{trialPhases_2}}` / Citations: `{{citationCount_2}}` / Grants: `{{grantIds_2}}` | {{studyOrPaperTitle_2}} | **{{leadScore_2}}** (`{{leadTier_2}}`) | [Link]({{sourceUrl_2}}) |

> **Scientific Provenance Note:** Extracted live from NIH ClinicalTrials.gov API v2 and EMBL-EBI Europe PMC / PubMed. Missing contact fields are reported as `Not published in registry` without pattern-guessing. Runtime notices: `{{warnings_or_none}}`.

---

## Recommended Next Actions
- [ ] **High-Intent PI & Site Outreach:** Prioritize `HOT` `CLINICAL_TRIAL_INVESTIGATOR` leads (`NOT_YET_RECRUITING` and `RECRUITING`) with unmasked `contactEmail` for site-activation, biomarker assay, or patient-recruitment partnerships.
- [ ] **Grant-Backed Lab Prioritization:** Target `PUBMED_RESEARCH_KOL` authors carrying active NIH `grantIds` (`R01`, `P01`, `U01`) and `CORRESPONDING_KOL_AUTHOR` emails for reagent, sequencing, and instrumentation demos.
- [ ] **Translational Dual-Role Matching:** Flag researchers appearing across both `NCT` clinical protocols and high-citation `PMID` papers as top-tier Scientific Advisory Board (`SAB`) or MSL anchors.
- [ ] **Sponsor Domain & Grant Expansion:** Cross-reference `INDUSTRY` biotech sponsors via `sec-form-d-funding-leads` (recent venture raises) or `federal-govcon-recompete-radar` (open NIH SBIR/STTR grant opportunities).
