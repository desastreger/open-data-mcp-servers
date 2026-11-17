# US Metro Building & Specialty Trade Permits Brief

**Metros Queried:** `{{metros_list}}` | **Trade Filter:** `{{trade_filter}}` | **Min Valuation:** `${{min_estimated_cost_usd}}` | **Keywords:** `{{keywords_list}}`

---

## Executive Summary

- **Normalized Permits Returned:** `{{total_permits}}` (`{{with_contractor_count}}` with named contractor)
- **Total Reported Construction Valuation:** `${{total_estimated_cost_usd}}`
- **Breakdown by Metro:** `{{by_metro_summary}}`
- **Breakdown by Trade Category:** `{{by_trade_category_summary}}`
- **Portal Health & Coverage Notes:** `{{portal_warnings_or_budget_notes}}` *(State `"All queried municipal Socrata portals responded cleanly"` when zero warnings occur.)*

---

## Ranked Permit & Contractor Leads

| Permit ID & Issue Date | Metro / Address | Trade & Permit Type | Work Description | Valuation (USD) | Contractor & Contact | Score & Tier | Source |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`{{permitId}}`**<br>`{{issueDate}}` (`{{status}}`) | **{{city}}, {{state}}** `{{zipCode}}`<br>{{address}} | `{{tradeCategory}}`<br>*{{permitType}}* | {{description}} | `${{estimatedCostUsd}}` | **{{contractorName}}**<br>Phone: `{{contractorPhone}}`<br>Lic: `{{contractorLicense}}` | **{{leadScore}}/100**<br>`{{priorityTier}}` | [Portal]({{sourcePortalUrl}}) |

*(Render `null` contractor phones, licenses, or valuations explicitly as `Not disclosed` — never guess contact details.)*

---

## Field Sales & GTM Next Actions

- [ ] **High-Velocity Contractor Account Mapping:** Aggregate repeat `contractorName` appearances across the returned batch to prioritize multi-permit installers (`{{top_repeat_contractor}}`).
- [ ] **Immediate Job-Site / GC Outreach (`priorityTier: HOT`):** Contact `{{top_contractor_name}}` regarding `{{top_permit_id}}` at `{{top_address}}` issued on `{{top_issue_date}}`.
- [ ] **Territory CRM Sync:** Deduplicate records on `<metro>:<permitId>` before importing into HubSpot, Salesforce, or Clay territory queues.
