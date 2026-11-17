# Municipal Code Violation & Distressed Property Lead Report

## Executive Summary
- **Queried Municipal Portals:** `{{metros_queried}}`
- **Distress Category / Keyword Filter:** `{{distress_filter_and_keywords}}` (`Open Cases Only: {{open_cases_only}}`)
- **Total Normalized Leads Returned:** `{{total_leads}}`
- **Investor Priority Breakdown:** `CRITICAL_DISTRESS`: `{{critical_count}}` | `HIGH_MOTIVATION`: `{{high_motivation_count}}` | `STANDARD`: `{{standard_count}}`
- **Parcel-Matched Records (`parcelId` Present):** `{{parcel_matched_count}}`

---

## Ranked Distressed Property & Contractor Leads

| Rank | Address & Metro | Parcel ID | Case ID (`Opened`) | Distress Category | Violation Summary & Status | Score (`Priority Tier`) | Coordinates | Official Portal |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | **{{address}}**, {{city}}, {{state}} {{zipCode}} | `{{parcelId}}` | `{{caseId}}` (`{{openedDate}}`) | `{{distressCategory}}` | {{violationType}} — *{{status}}* | **{{distressScore}}** (`{{investorPriorityTier}}`) | `{{latitude}}, {{longitude}}` | [Source]({{sourcePortalUrl}}) |
| 2 | **{{address_2}}**, {{city_2}}, {{state_2}} {{zipCode_2}} | `{{parcelId_2}}` | `{{caseId_2}}` (`{{openedDate_2}}`) | `{{distressCategory_2}}` | {{violationType_2}} — *{{status_2}}* | **{{distressScore_2}}** (`{{investorPriorityTier_2}}`) | `{{latitude_2}}, {{longitude_2}}` | [Source]({{sourcePortalUrl_2}}) |

> **Provenance & Privacy Note:** Records originate directly from official US municipal Socrata open-data portals. `inspectorOrDivision` values reflect city enforcement staff, not property owners. Portal/runtime notices: `{{warnings_or_none}}`.

---

## Recommended Next Actions
- [ ] **Assessor & Skip-Trace Enrichment:** Export the `{{critical_count}}` `CRITICAL_DISTRESS` and `{{high_motivation_count}}` `HIGH_MOTIVATION` rows (`address`, `parcelId`, `zipCode`) to county CAD/assessor lookup or skip-tracing to identify absentee/LLC mailing addresses.
- [ ] **Repeat-Citation Grouping:** Prioritize properties with multiple open `caseId` filings or combined structural + vacancy violations, signaling acute seller motivation.
- [ ] **Trade-Specific Abatement Outreach:** Match `FIRE_ELECTRICAL_PLUMBING`, `UNPERMITTED_ZONING`, and `STRUCTURAL_HAZARD` leads to licensed local contractors or permit expediters offering turnkey municipal violation cure packages.
- [ ] **Cross-Check Active Permits:** Run `us-metro-building-trade-permits` (where metros overlap: Austin, Seattle, San Francisco) to verify whether the owner has already pulled a corrective building permit.
