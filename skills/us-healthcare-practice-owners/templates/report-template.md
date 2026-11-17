# Healthcare Practice Owner Intelligence Report

## Executive Summary
- **Target Specialty / Taxonomy:** `{{specialty_or_custom_taxonomy}}`
- **Geographic Scope:** `{{states_city_or_zip_scope}}`
- **Total Verified Practices Returned:** `{{total_leads}}` (`HOT`: `{{hot_count}}` | `WARM`: `{{warm_count}}` | `STANDARD`: `{{standard_count}}`)
- **Clinician-Owned Private Practices:** `{{clinician_owned_count}}` (`{{distinct_phone_count}}` with a distinct executive phone line)
- **Data Source:** Official US HHS / CMS NPPES NPI Registry API v2.1 (`NPI-2` Organization Records)

---

## Prioritized Practice Owner Leads

| Rank | Practice Name (Legal / DBA) | Authorized Official & Title | Credential | Direct Official Phone | Reception Phone | Location | Taxonomy (`Code`) | Ownership Type | Score (`Tier`) | NPI & Provenance |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | **{{practiceLegalName}}** {{dbaName}} | {{authorizedOfficialName}} ({{authorizedOfficialTitle}}) | `{{authorizedOfficialCredential}}` | `{{authorizedOfficialPhone}}` | `{{practicePhone}}` | {{city}}, {{state}} {{postalCode}} | {{primaryTaxonomyDesc}} (`{{primaryTaxonomyCode}}`) | `{{ownershipType}}` | **{{leadScore}}** (`{{leadTier}}`) | [{{npi}}]({{nppesProfileUrl}}) |
| 2 | **{{practiceLegalName_2}}** | {{authorizedOfficialName_2}} ({{authorizedOfficialTitle_2}}) | `{{authorizedOfficialCredential_2}}` | `{{authorizedOfficialPhone_2}}` | `{{practicePhone_2}}` | {{city_2}}, {{state_2}} {{postalCode_2}} | {{primaryTaxonomyDesc_2}} (`{{primaryTaxonomyCode_2}}`) | `{{ownershipType_2}}` | **{{leadScore_2}}** (`{{leadTier_2}}`) | [{{npi_2}}]({{nppesProfileUrl_2}}) |

> **Data Integrity Note:** CMS NPPES publishes verified regulatory phone/fax numbers and street addresses (`lastUpdatedDate` noted per NPI) and does not include email addresses. Any upstream notices or budget caps: `{{warnings_or_none}}`.

---

## Recommended Next Actions
- [ ] **Priority Executive Calling:** Route the `{{distinct_phone_count}}` leads where `hasDistinctOfficialPhone = true` directly to phone outreach sequences addressing the named Authorized Official and credential (`DDS`, `DMD`, `MD`, `DO`).
- [ ] **Domain & Email Infrastructure Enrichment:** Match top `HOT` practices (`leadScore >= 80`) to their clinic domains and run `b2b-domain-mail-security-posture` to identify `Google Workspace` vs `Microsoft 365` mail stacks before cold email sequencing.
- [ ] **Territory Expansion:** Re-run `search_healthcare_practice_owners` across adjacent 3-digit `postalCode` prefixes (`{{next_zip_prefixes}}`) or sister specialties (`{{adjacent_specialties}}`) to expand pipeline coverage.
- [ ] **CRM Deduplication:** Key all imported organization records on the immutable 10-digit `npi` identifier to prevent duplicate clinic entries across legal and DBA names.
