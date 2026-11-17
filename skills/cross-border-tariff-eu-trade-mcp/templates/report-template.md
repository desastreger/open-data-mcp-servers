# Cross-Border Trade, EU VAT & Public Tenders Brief

**Feeds Queried:** `{{modes_executed}}` | **Shipment Value Basis:** `${{shipment_value_usd}}` | **Jurisdictions:** `{{jurisdictions_scope}}`

---

## Executive Summary

- **Total Records Processed:** `{{total_records}}` (`{{hts_count}}` US HTS Tariffs · `{{vat_count}}` EU VIES VAT Checks · `{{ted_count}}` EU TED Tenders)
- **Records with Trade-Remedy / Validation Flags (`hasTradeRemedyOrRiskFlag: true`):** `{{flagged_count}}`
- **Upstream Availability & Notes:** `{{vies_or_upstream_warnings}}` *(Report any VIES `MS_UNAVAILABLE` member-state maintenance windows or budget caps explicitly.)*

---

## 1. USITC Harmonized Tariff Schedule Estimates (`US_HTS_TARIFF`)

| HTS Code | Commodity Description | Col. 1 General Rate | Special (FTA) / Col. 2 | Base Duty on `${{shipment_value_usd}}` | Chapter 99 / Remedy Flag | Source |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`{{identifier}}`** | {{titleOrEntity}} | `{{generalRate}}` (`{{rateKind}}`) | Special: `{{specialRate}}`<br>Other: `{{otherRate}}` | **${{estimatedBaseDutyUsd}}** | `{{hasChapter99Footnote}}` (`{{chapter99References}}`) | [USITC]({{officialSourceUrl}}) |

> **Customs Estimate Note:** Base USD duty reflects Schedule 1 General ad-valorem tariff math only. Country-of-origin Chapter 99 remedies (Section 301, Section 232, IEEPA) and AD/CVD orders apply separately and require licensed customs broker confirmation.

---

## 2. European Commission VIES VAT Verification (`EU_VAT_VERIFICATION`)

| EU VAT Number | Member State | Validation Status | Registered Legal Entity | Registered Address | Risk Flag | Source |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`{{identifier}}`** | `{{jurisdiction}}` | **`{{statusOrRate}}`** | {{companyName}} | {{registeredAddress}} | `{{hasTradeRemedyOrRiskFlag}}` | [EC VIES]({{officialSourceUrl}}) |

---

## 3. EU TED Public Procurement Notices (`EU_PUBLIC_TENDER`)

| Notice # & Date | Country | Tender Title | CPV Codes | Status | Source |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`{{identifier}}`**<br>`{{publicationDate}}` | `{{jurisdiction}}` | {{titleOrEntity}} | `{{cpvCodes}}` | `{{statusOrRate}}` | [TED Notice]({{officialSourceUrl}}) |

---

## Trade Compliance & Procurement Next Actions

- [ ] **Chapter 99 & FTA Origin Review (`US_HTS_TARIFF`):** Verify supplier Country of Origin certificate against `specialRate` FTA indicators and any `chapter99References` before finalizing landed-cost quotes.
- [ ] **Invoice Tax Hold / Release (`EU_VAT_VERIFICATION`):** Archive VIES confirmation for `VALID_VAT` accounts; place reverse-charge hold on any `INVALID_VAT` or `MS_UNAVAILABLE` counterparties.
- [ ] **EU Bid Qualification (`EU_PUBLIC_TENDER`):** Open linked `ted.europa.eu` notice URLs to download tender dossiers, language requirements, and submission deadlines.
