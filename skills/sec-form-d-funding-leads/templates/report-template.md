# SEC Form D Startup Funding Intelligence Brief

**Query Scope:** `{{date_window}}` | **States:** `{{states_filter}}` | **Industries:** `{{industries_filter}}` | **Min Closed Capital:** `{{min_amount_sold_usd}}`

---

## Executive Summary

- **Qualified Operating Startups Returned:** `{{total_leads}}` *(Pooled funds excluded: `{{operating_only_flag}}`)*
- **Verified Capital Closed (`totalAmountSold`):** `${{total_closed_capital_usd}}` across `{{total_leads}}` filings (`${{median_closed_usd}}` median)
- **Hot Priority Leads (`leadTier: HOT`):** `{{hot_leads_count}}` companies | **Federal Award Winners:** `{{federal_award_matches_count}}`
- **Top Geographies & Sectors:** `{{top_states_and_sectors_summary}}`
- **Operational & Coverage Notes:** `{{warnings_or_budget_cap_notes}}` *(State `"None — clean SEC EDGAR & USASpending execution"` when zero warnings occur.)*

---

## Ranked Startup Funding Leads

| Rank | Company & Identifiers | Filing & Round Closed | Offering Target (`% Filled`) | Industry & HQ | Named Executive & Phone | Federal Awards / Prior Rounds | Score & Tier |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | **{{companyName}}**<br>CIK: `{{cik}}` · EIN: `{{ein}}`<br>[EDGAR `{{accessionNumber}}`]({{edgarFilingUrl}}) | **${{totalAmountSold}}**<br>Filed: `{{filingDate}}` (`{{filingType}}`)<br>Investors: `{{investorCount}}` | ${{totalOfferingAmount}} (`{{percentFilled}}%`) | {{industryGroup}}<br>{{city}}, {{state}} {{zipCode}} | **{{primaryContactName}}**<br>*{{primaryContactTitle}}*<br>`{{phone}}` | Grants/Contracts: `{{federalAwardsSummary}}`<br>Prior Form Ds: `{{priorFormDRoundsCount}}` | **{{leadScore}}/100**<br>`{{leadTier}}` |

*(Note: Never fabricate missing email addresses, websites, or phone numbers; render unavailable fields explicitly as `Not disclosed in filing`.)*

---

## Recommended Next Actions

- [ ] **Immediate Executive Outreach (`HOT` Tier, `filingDate` <= 7 days):** Reference the verified `${{top_lead_amount_sold}}` Regulation D close filed on `{{top_lead_filing_date}}` (`Accession {{top_lead_accession}}`) when contacting `{{top_lead_contact_name}}`.
- [ ] **CRM & Tax-ID Deduplication:** Match `cik` and `secEntityMetadata.ein` against existing CRM accounts before creating net-new prospect records.
- [ ] **Open Tranche Monitoring (`percentFilled < 50%`):** Track issuers with large `totalRemaining` balances for service providers, Venture Debt, or follow-on Form D/A tranches.
- [ ] **Dual-Validated R&D Targets (`hasFederalAwards: true`):** Prioritize startups holding DoD, NIH, NSF, or DOE awards for specialized compliance, cloud, or R&D tooling pitches.
