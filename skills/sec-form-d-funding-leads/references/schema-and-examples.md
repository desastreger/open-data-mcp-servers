# SEC Form D Funding Leads — Schema & Query Recipes

Reference guide for `desastreger/sec-form-d-funding-leads` (`https://desastreger--sec-form-d-funding-leads.apify.actor/mcp`).

---

## 1. Complete Input Parameter Reference

Parameters match `.actor/input_schema.json` for Apify REST runs and map directly to the MCP tools (`search_startup_funding_leads`, `get_company_funding_dossier`, `summarize_funding_market`).

| Parameter | Type | Default | Valid Values / Constraints | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `daysBack` | `integer` | `7` | `1` to `365` | Lookback window in calendar days when `startDate` is omitted (`365` default on `get_company_funding_dossier`). |
| `startDate` | `string` | *(unset)* | `YYYY-MM-DD` (`^\d{4}-\d{2}-\d{2}$`) | Explicit UTC start date; overrides `daysBack` when set. |
| `endDate` | `string` | *(today UTC)* | `YYYY-MM-DD` (`^\d{4}-\d{2}-\d{2}$`) | Explicit UTC end date for historical cohort queries. |
| `maxResults` | `integer` | `25` (`10` MCP) | `1` to `1000` (`1` to `50` in MCP mode) | Maximum qualified Form D funding leads returned; stops immediately on PPE budget cap. |
| `operatingCompaniesOnly` | `boolean` | `true` | `true`, `false` | Excludes Pooled Investment Funds and 3(c)(1)/3(c)(7) hedge/PE/VC SPVs so only real operating startups are returned. |
| `includeAmendments` | `boolean` | `false` | `true`, `false` | When `true`, includes `Form D/A` amended filings alongside initial `Form D` notices (`true` automatically in `get_company_funding_dossier`). |
| `minAmountSold` | `integer` | `0` | `>= 0` (USD) | Minimum capital already closed (`totalAmountSold`), e.g. `250000` for `$250k+` verified raises. |
| `minOfferingAmount` | `integer` | `0` | `>= 0` (USD) | Minimum total offering target (`totalOfferingAmount`) in USD (REST input). |
| `states` | `array<string>` | `[]` | 2-letter US postal codes (`["CA", "NY", "TX", "MA"]`) | Filters by issuer headquarters state in the parsed Form D XML. |
| `industries` | `array<string>` | `[]` | Case-insensitive substrings (`["Technology", "Biotechnology", "Health Care", "Manufacturing", "Energy"]`) | Matched against SEC Form D `industryGroup`. |
| `searchQuery` | `string` | `""` | Free-text string | Full-text EDGAR EFTS filter across issuer names and Form D text (e.g., `"robotics"`, `"therapeutics"`). |
| `includeSecEntityMetadata` | `boolean` | `true` | `true`, `false` | Enriches each issuer via SEC Entity Submissions API with `ein`, `lei`, `sicCode`, `sicDescription`, `website`, and `priorFormDRoundsCount`. |
| `enrichWithFederalAwards` | `boolean` | `false` | `true`, `false` | Cross-checks USASpending.gov API for prime federal contracts (`A/B/C/D`) and grants (`02/03/04/05`, including SBIR/STTR). |
| `companyQuery` | `string` | *(required)* | Legal name or 10-digit CIK | Used exclusively by MCP tool `get_company_funding_dossier`. |
| `sampleSize` | `integer` | `20` | `5` to `50` | Used exclusively by MCP tool `summarize_funding_market`. |

---

## 2. Sample Normalized Output Record

Every item returned by `search_startup_funding_leads`, `get_company_funding_dossier`, or the Actor dataset follows this deterministic structure:

```json
{
  "accessionNumber": "0002163331-26-000001",
  "cik": "0002163331",
  "companyName": "INNOVATIVE POWDERS INC",
  "entityType": "Corporation",
  "yearIncorporated": 2023,
  "jurisdictionOfInc": "UTAH",
  "industryGroup": "Manufacturing",
  "isPooledInvestmentFund": false,
  "revenueRange": "$1 - $1,000,000",
  "filingType": "D",
  "isAmendment": false,
  "filingDate": "2026-11-10",
  "dateOfFirstSale": "2026-11-03",
  "totalOfferingAmount": 7500000,
  "totalAmountSold": 250000,
  "totalRemaining": 7250000,
  "percentFilled": 3.3,
  "investorCount": 2,
  "primaryContactName": "Daniel Thomas Turner",
  "primaryContactTitle": "Chief Executive Officer and Director",
  "phone": "(717) 271-2984",
  "address": {
    "street1": "551 W POWERLINE RD",
    "street2": "SUITE #9",
    "city": "HEBER CITY",
    "state": "UT",
    "zipCode": "84032",
    "fullAddress": "551 W POWERLINE RD, SUITE #9, HEBER CITY, UT, 84032"
  },
  "secEntityMetadata": {
    "ein": "92-3940381",
    "lei": null,
    "sicCode": "3390",
    "sicDescription": "MISCELLANEOUS PRIMARY METAL PRODUCTS",
    "website": null,
    "fiscalYearEnd": "1231",
    "acceptanceDateTime": "2026-11-10T16:42:18.000Z",
    "totalSecFilingsCount": 1,
    "totalFormDFilingsCount": 1,
    "priorFormDRoundsCount": 0
  },
  "federalAwards": {
    "hasFederalAwards": true,
    "federalAwardsReturnedCount": 1,
    "federalAwardsSampleTotalUsd": 275000,
    "topFederalAgencies": ["Department of Defense"],
    "recentFederalAwards": [
      {
        "awardId": "FA864926P0412",
        "recipientName": "INNOVATIVE POWDERS INC",
        "amountUsd": 275000,
        "agency": "Department of Defense",
        "startDate": "2026-06-15"
      }
    ]
  },
  "leadScore": 98,
  "leadTier": "HOT",
  "edgarFilingUrl": "https://www.sec.gov/Archives/edgar/data/2163331/000216333126000001/0002163331-26-000001-index.htm"
}
```

---

## 3. Concrete B2B Query Recipes

### Recipe 1: Freshly Funded Seed & Series A Tech Startups for SDR Outbound
Call `search_startup_funding_leads` to isolate operating technology companies in major venture hubs that have already closed at least `$500,000` in the past 14 days:

```json
{
  "daysBack": 14,
  "maxResults": 20,
  "operatingCompaniesOnly": true,
  "minAmountSold": 500000,
  "states": ["CA", "NY", "MA", "TX", "WA"],
  "industries": ["Technology"],
  "enrichWithFederalAwards": false
}
```
**Analytical Takeaway:** Prioritizes `HOT` tier startups with verified capital in the bank (`totalAmountSold >= $500k`), direct CEO/Founder names (`primaryContactName`), and corporate phone numbers—eliminating shell SPVs and unfunded offerings (`totalAmountSold: 0`).

### Recipe 2: Deep-Tech & Biotech Non-Dilutive SBIR/STTR Signal Hunt
Call `search_startup_funding_leads` with `enrichWithFederalAwards: true` to spot biotech, robotics, or defense startups pairing private venture capital with federal R&D awards:

```json
{
  "daysBack": 30,
  "maxResults": 15,
  "operatingCompaniesOnly": true,
  "minAmountSold": 250000,
  "industries": ["Biotechnology", "Health Care", "Manufacturing"],
  "enrichWithFederalAwards": true
}
```
**Analytical Takeaway:** Surfaces companies where `federalAwards.hasFederalAwards === true`, highlighting NIH, NSF, DOE, or DoD award amounts alongside private round size—ideal for specialized lab equipment vendors, CROs, and Series A/B VC scouts.

### Recipe 3: Pre-Call Issuer Due Diligence & Historical Round Audit
Call `get_company_funding_dossier` before an investor pitch, partnership review, or executive search kickoff:

```json
{
  "companyQuery": "0002163331",
  "daysBack": 365
}
```
**Analytical Takeaway:** Returns initial `Form D` and follow-on `Form D/A` tranches, Employer Identification Number (`secEntityMetadata.ein`), `priorFormDRoundsCount`, investor participation count, and any matched federal awards in a single deterministic call.
