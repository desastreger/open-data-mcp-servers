# Cross-Border US Tariff, EU VAT & TED Tenders — Schema & Query Recipes

Reference guide for `desastreger/cross-border-tariff-eu-trade-mcp` (`https://desastreger--cross-border-tariff-eu-trade-mcp.apify.actor/mcp`).

---

## 1. Complete Input Parameter Reference

Parameters match `.actor/input_schema.json` for REST runs and map to the three MCP tools (`lookup_us_hts_tariff`, `verify_eu_vat_numbers`, `search_eu_ted_tenders`).

| Parameter | Type | Default | Valid Values / Constraints | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `mode` | `string` | `"us_hts_tariffs"` | `"all"`, `"us_hts_tariffs"`, `"eu_vies_vat"`, `"eu_ted_tenders"` | REST feed selector (`all` balances VIES VAT, USITC HTS, and TED Tenders). Each MCP tool binds automatically to its matching mode. |
| `htsKeywords` | `array<string>` | `["lithium ion"]` | Product terms or 4–10 digit HTS prefixes (`["8507.60", "semiconductor"]`) | Used by `lookup_us_hts_tariff` and `mode: "us_hts_tariffs"` / `"all"`. |
| `shipmentValueUsd` | `number` | `10000` | `>= 0` (USD) | Commercial invoice customs value used to compute `estimatedBaseDutyUsd` when `rateKind` is `"ad_valorem"` or `"free"`. |
| `euVatNumbers` | `array<string>` | `["IE6388047V"]` | 2-letter EU member-state prefix + VAT digits (`["IE6388047V", "DE123456789"]`) | Leading whitespace, dots, and hyphens are stripped automatically. Note: Greece uses prefix `EL`; Northern Ireland uses `XI`. |
| `vatNumber` | `string` | *(unset)* | Single EU VAT ID | Convenience alias on MCP tool `verify_eu_vat_numbers` (merged into `euVatNumbers`). |
| `tedKeywords` | `array<string>` | `["cybersecurity"]` | Keywords or 8-digit CPV codes (`["cloud infrastructure", "72000000"]`) | Used by `search_eu_ted_tenders` and `mode: "eu_ted_tenders"` / `"all"`. May be `[]` when `tedCountries` is non-empty. |
| `tedCountries` | `array<string>` | `[]` | 3-letter ISO-3 country codes (`["DEU", "FRA", "IRL", "NLD", "ITA", "BEL"]`) | Filters EU TED notices by buyer country. |
| `keyword` | `string` | *(unset)* | Single keyword, HTS code, or CPV code | Convenience alias accepted on `lookup_us_hts_tariff` and `search_eu_ted_tenders`. |
| `maxResults` | `integer` | `20` (`10` MCP) | `1` to `500` (`1` to `50` in MCP mode) | Maximum unified records returned across active feeds. |

---

## 2. Sample Normalized Output Records

All three feeds share identical top-level fields (`recordType`, `identifier`, `jurisdiction`, `titleOrEntity`, `statusOrRate`, `estimatedDutyOrValueUsd`, `hasTradeRemedyOrRiskFlag`, `officialSourceUrl`, `details`):

```json
[
  {
    "recordType": "US_HTS_TARIFF",
    "identifier": "8507.60.00",
    "jurisdiction": "US",
    "titleOrEntity": "Lithium-ion batteries",
    "statusOrRate": "3.4%",
    "estimatedDutyOrValueUsd": 340,
    "hasTradeRemedyOrRiskFlag": false,
    "officialSourceUrl": "https://hts.usitc.gov/search?query=8507.60.00",
    "details": {
      "htsno": "8507.60.00",
      "generalRate": "3.4%",
      "specialRate": "Free (A,AU,B,BH,C,CL,CO,D,E,IL,JO,KR,MA,OM,P,PA,PE,S,SG)",
      "otherRate": "40%",
      "rateKind": "ad_valorem",
      "adValoremPct": 3.4,
      "shipmentValueUsd": 10000,
      "estimatedBaseDutyUsd": 340,
      "hasChapter99Footnote": false,
      "chapter99References": []
    }
  },
  {
    "recordType": "EU_VAT_VERIFICATION",
    "identifier": "IE6388047V",
    "jurisdiction": "EU-IE",
    "titleOrEntity": "GOOGLE IRELAND LIMITED",
    "statusOrRate": "VALID_VAT",
    "estimatedDutyOrValueUsd": null,
    "hasTradeRemedyOrRiskFlag": false,
    "officialSourceUrl": "https://ec.europa.eu/taxation_customs/vies/#/vat-validation",
    "details": {
      "countryCode": "IE",
      "vatNumber": "6388047V",
      "valid": true,
      "companyName": "GOOGLE IRELAND LIMITED",
      "registeredAddress": "3RD FLOOR, GORDON HOUSE, BARROW STREET, DUBLIN 4"
    }
  },
  {
    "recordType": "EU_PUBLIC_TENDER",
    "identifier": "783488-2026",
    "jurisdiction": "EU-ITA",
    "titleOrEntity": "Italy – Network equipment – INVA AQ - Prevenzione incidenti Cyber CSIRT-VdA",
    "statusOrRate": "PUBLISHED_TENDER",
    "estimatedDutyOrValueUsd": null,
    "hasTradeRemedyOrRiskFlag": false,
    "officialSourceUrl": "https://ted.europa.eu/en/notice/-/detail/783488-2026",
    "details": {
      "publicationNumber": "783488-2026",
      "publicationDate": "2026-11-11",
      "countries": ["ITA"],
      "cpvCodes": ["32420000"]
    }
  }
]
```

---

## 3. Concrete B2B Query Recipes

### Recipe 1: US Import Landed Duty & Chapter 99 Surcharge Audit
Call `lookup_us_hts_tariff` to model base ad-valorem duties on a `$120,000` industrial hardware shipment and check for Section 301 / Chapter 99 footnotes:

```json
{
  "htsKeywords": ["8507.60", "8504.40", "power inverter"],
  "shipmentValueUsd": 120000,
  "maxResults": 15
}
```
**Analytical Takeaway:** Computes exact Column 1 General USD duty (`estimatedBaseDutyUsd`), inherits 8-digit duty rates onto 10-digit statistical subheadings, lists FTA `specialRate` eligibility codes, and highlights any `chapter99References` requiring Country-of-Origin surcharge review.

### Recipe 2: Automated B2B Reverse-Charge EU VAT Onboarding Batch
Call `verify_eu_vat_numbers` before enabling VAT-exempt intra-EU invoicing for new enterprise customers:

```json
{
  "euVatNumbers": ["IE6388047V", "NL820646660B01", "FR40303265045"],
  "maxResults": 10
}
```
**Analytical Takeaway:** Confirms live EC VIES `VALID_VAT` vs `INVALID_VAT` status (`hasTradeRemedyOrRiskFlag: true` when invalid or unavailable) alongside registered corporate legal names and addresses for audit-ready tax compliance logs.

### Recipe 3: European Public-Sector IT & Cybersecurity Tender Pipeline
Call `search_eu_ted_tenders` combining CPV `72000000` (IT services) and domain keywords across DACH, France, and Benelux:

```json
{
  "tedKeywords": ["cybersecurity", "cloud", "72000000"],
  "tedCountries": ["DEU", "FRA", "NLD", "BEL", "IRL"],
  "maxResults": 20
}
```
**Analytical Takeaway:** Returns live EU TED v3 notice numbers (`783488-2026`), buyer jurisdictions, CPV classifications, and direct `ted.europa.eu` solicitation URLs for European public-sector capture teams.
