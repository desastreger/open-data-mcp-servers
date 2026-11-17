# US KYB & Third-Party Risk Compliance Report

**Screened Timestamp:** `{{screened_at_utc}}` | **Entities Evaluated:** `{{total_companies}}` | **Registries Enabled:** `GLEIF LEI, SEC EDGAR, openFDA, CFPB, USASpending`

---

## Executive Summary

- **Verified Entities (`VERIFIED_ENTITY`):** `{{verified_count}}` / `{{total_companies}}`
- **Partial Matches (`PARTIAL_MATCH`):** `{{partial_count}}` | **Unverified (`UNVERIFIED`):** `{{unverified_count}}`
- **Entities with Active Enforcement / Governance Risk Flags:** `{{flagged_count}}`
- **Registry Availability & Timeout Audit:** `{{upstream_timeout_notes}}` *(Explicitly list any `UPSTREAM_PARTIAL_TIMEOUT` or `<registry>.error` values, or state `"All 5 government registries responded within SLA"`.)*

---

## Multi-Registry KYB Verification Matrix

| Queried Name -> Legal Name | Score & Status | LEI & Reg Status | SEC CIK & Forms | Jurisdiction & HQ | Federal Contractor | Risk Flags |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **{{queriedCompany}}**<br>-> `{{resolvedLegalName}}` | **{{kybVerificationScore}}/100**<br>`{{verificationStatus}}` | `{{lei}}`<br>{{entityStatus}} / {{registrationStatus}} | `{{primaryCik}}`<br>{{recentForms}} | `{{jurisdiction}}`<br>{{headquartersLocation}} | `{{isFederalContractor}}` | `{{riskFlags}}` |

---

## Score Breakdown & Enforcement Notes

- **{{resolvedLegalName}} (`{{kybVerificationScore}}/100`):** Baseline `+{{baseline}}` | Primary Registry `+{{primaryRegistryVerified}}` | Active LEI `+{{activeIssuedLei}}` | Operating Footprint `+{{operatingFootprintConfirmed}}` | Enforcement Deduction `{{enforcementRiskDeduction}}`.
- **Regulatory Detail:** FDA Recalls: `{{totalRecalls}}` (Active Class I: `{{hasActiveClassIRecall}}`) · CFPB Complaints: `{{totalComplaints}}` · Federal Prime Contracts Sampled: `{{awardsCount}}`.

---

## Compliance & Underwriting Next Actions

- [ ] **Auto-Approve (`VERIFIED_ENTITY`, Score `>= 80`, Zero Severe Flags):** Record canonical `lei` (`{{lei}}`) and `primaryCik` (`{{primaryCik}}`) in the vendor master / KYB audit log.
- [ ] **Enhanced Due Diligence (`FDA_CLASS_I_RECALL_ACTIVE` or `CFPB_HIGH_COMPLAINT_VOLUME`):** Escalate to Legal/Quality Assurance to review affected product lines or consent decrees before onboarding.
- [ ] **Governance Remediation (`LAPSED_LEI` or `INACTIVE_ENTITY_STATUS`):** Request updated certificate of good standing or LEI renewal confirmation from counterparty treasury.
- [ ] **Manual Private-Entity Verification (`UNVERIFIED` / `NO_REGISTRY_MATCH`):** Collect IRS Form W-9 (EIN) and state Secretary-of-State charter documents for private small businesses outside federal/LEI registries.
