# US EPA ECHO Industrial Compliance & Risk Report

## Executive Summary
- **Statute Programs Screened:** `{{programs_screened}}` (`CWA NPDES` / `Clean Air Act` / `RCRA Hazardous Waste`)
- **Geographic / Industry Scope:** `{{states_city_naics_scope}}` (`Violations Only: {{violations_only}}` | `Min Penalty: ${{min_penalty_usd}}`)
- **Total Permit Records Returned:** `{{total_records}}` across `{{unique_frs_sites}}` unique EPA FRS physical sites
- **Risk Tier Distribution:** `CRITICAL`: `{{critical_count}}` | `ELEVATED`: `{{elevated_count}}` | `MODERATE`: `{{moderate_count}}`
- **Active SNC / HPV Facilities:** `{{snc_count}}` | **Cumulative Assessed Penalties:** `${{total_penalties_sum}}`

---

## Facility Compliance & Enforcement Matrix

| Rank | Facility Name & Location | EPA FRS ID / Permit ID | Statute Program | NAICS / SIC | Compliance Status (`SNC/HPV`) | Qtrs NC (`3-Yr`) | Inspections / FEAs | Penalties (`USD`) | Score (`Tier`) | ECHO DFR |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | **{{facilityName}}** ({{city}}, {{state}} {{zipCode}}) | FRS: `{{epaRegistryId}}` / Permit: `{{sourcePermitId}}` | `{{statuteProgram}}` | `{{industryCodes}}` | {{complianceStatus}} (`SNC: {{inSignificantNonCompliance}}`) | `{{quartersInNonCompliance}}` | `{{inspectionsCount}}` / `{{formalEnforcementCount}}` | `${{totalPenaltiesUsd}}` | **{{complianceRiskScore}}** (`{{riskTier}}`) | [Report]({{echoReportUrl}}) |
| 2 | **{{facilityName_2}}** ({{city_2}}, {{state_2}} {{zipCode_2}}) | FRS: `{{epaRegistryId_2}}` / Permit: `{{sourcePermitId_2}}` | `{{statuteProgram_2}}` | `{{industryCodes_2}}` | {{complianceStatus_2}} (`SNC: {{inSignificantNonCompliance_2}}`) | `{{quartersInNonCompliance_2}}` | `{{inspectionsCount_2}}` / `{{formalEnforcementCount_2}}` | `${{totalPenaltiesUsd_2}}` | **{{complianceRiskScore_2}}** (`{{riskTier_2}}`) | [Report]({{echoReportUrl_2}}) |

> **Regulatory Provenance:** Sourced live from official US EPA ECHO REST services (`echodata.epa.gov`). Multiple rows sharing one `epaRegistryId` represent distinct statutory permits at the same physical plant. Runtime notices: `{{warnings_or_none}}`.

---

## Recommended Next Actions
- [ ] **Cross-Media Site Consolidation:** Prioritize physical plants (`epaRegistryId`) holding concurrent `CRITICAL` or `inSignificantNonCompliance = true` flags across multiple statutes (e.g., both Clean Water NPDES and Clean Air).
- [ ] **Remediation / Equipment Alignment:** Route `CLEAN_WATER_ACT` violators to wastewater/effluent specialists, `CLEAN_AIR_ACT` HPV sites to emissions/scrubber engineers, and `RCRA_HAZARDOUS_WASTE` sites to hazardous waste compliance teams.
- [ ] **Corporate Parent KYB Cross-Check:** Run `us-kyb-compliance-dossier` on the parent company of top `CRITICAL` plants to link site-level EPA penalties with SEC disclosures, LEI hierarchy, and federal contract exposure.
- [ ] **Detailed Facility Report Verification:** Review linked official `echoReportUrl` pages for pollutant-level effluent exceedances or state consent-order milestones prior to outreach or underwriting sign-off.
