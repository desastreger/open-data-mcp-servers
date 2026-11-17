# Federal GovCon Recompete & Grants Capture Brief

**Scope:** `{{mode_summary}}` | **Lookahead Window:** `{{expiring_within_days}} days` | **NAICS / Agencies:** `{{filters_applied}}`

---

## Executive Summary

- **Total Opportunities Identified:** `{{total_count}}` (`{{recompete_count}}` Expiring Contracts · `{{grant_count}}` Open/Forecasted Grants)
- **Aggregate Obligated Recompete Value:** `${{total_recompete_usd}}` *(Min filter: `${{min_award_amount_usd}}`)*
- **High-Priority Capture Targets (`priorityTier: HIGH`):** `{{high_priority_count}}`
- **Top Awarding Agencies & Incumbents:** `{{top_agencies_and_incumbents}}`
- **Operational & Coverage Notes:** `{{warnings_or_budget_cap_notes}}` *(State `"None — clean USASpending.gov & Grants.gov execution"` when zero warnings occur.)*

---

## Expiring Federal Contract Recompetes (`RECOMPETE_CONTRACT`)

| Award ID (PIID) | Agency / Sub-Agency | Incumbent & UEI | Obligated USD | PoP End (`Days Left`) | NAICS / PSC / State | Priority | Source |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`{{opportunityOrAwardId}}`**<br>{{titleOrDescription}} | {{agency}}<br>*{{subAgency}}* | **{{incumbentVendor}}**<br>UEI: `{{incumbentUei}}` | **${{amountUsd}}** | `{{endDateOrCloseDate}}`<br>(`{{daysUntilExpiration}}d`) | NAICS `{{naicsCode}}`<br>PSC `{{pscCode}}` · `{{placeOfPerformanceState}}` | **{{priorityScore}}**<br>`{{priorityTier}}` | [USASpending]({{sourceUrl}}) |

---

## Open & Forecasted Federal Grants (`OPEN_GRANT`)

| Opportunity # | Agency (`Code`) | Opportunity Title | Status | Open -> Close (`Days Left`) | CFDA Program(s) | Priority | Source |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`{{opportunityOrAwardId}}`** | {{agency}} (`{{agencyCode}}`) | {{titleOrDescription}} | `{{status}}` | `{{openDate}}` -> `{{endDateOrCloseDate}}` (`{{daysUntilExpiration}}d`) | `{{cfdaList}}` | **{{priorityScore}}**<br>`{{priorityTier}}` | [Grants.gov]({{sourceUrl}}) |

---

## Capture & BD Action Checklist

- [ ] **Pre-RFP SAM.gov Cross-Check (`daysUntilExpiration` 90–180d):** Search PIID `{{top_contract_id}}` and NAICS `{{top_naics}}` for Sources Sought, RFI, or Industry Day notices under `{{top_sub_agency}}`.
- [ ] **Incumbent Teaming vs. Displacement Decision:** Evaluate incumbent `{{top_incumbent}}` (`UEI: {{top_incumbent_uei}}`) for prime-sub NDA outreach vs competitive small-business set-aside positioning.
- [ ] **Grant NOFO Eligibility & Deadline Lock (`OPEN_GRANT`):** Download full solicitation guidelines from the linked Grants.gov notice at least 30 days prior to `{{top_grant_close_date}}`.
