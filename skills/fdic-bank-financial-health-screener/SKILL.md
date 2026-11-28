---
name: fdic-bank-financial-health-screener
description: "Screen US FDIC-insured banks for counterparty treasury risk, CAMELS-proxy capital health (Tier 1 leverage RBC1AAJ, ROA, ROE, non-current loans), FDIC bank failure history, and CFPB consumer complaints via official FDIC BankFind Suite API. Activate when the user asks to 'check a US bank financial health', 'screen sponsor banks or BaaS partner banks', 'look up FDIC Call Report ratios', or 'search FDIC bank failures'."
summary: "Screen US FDIC-insured banks via official BankFind Suite REST API & CFPB complaints for Tier 1 leverage, ROA/ROE, non-current loans, bank failures, and 0-100 bankHealthScore via remote MCP."
version: "1.0.0"
tags:
  - fdic-banks
  - bank-financial-health
  - camels-rating
  - call-reports
  - treasury-risk
  - sponsor-bank
  - cfpb-complaints
  - mcp-server
keywords:
  - FDIC BankFind API scraper
  - US bank financial health screener
  - FDIC Call Report Tier 1 leverage RBC1AAJ
  - FDIC bank failure tracker
  - fintech sponsor bank due diligence
  - counterparty treasury bank risk MCP
  - CFPB consumer complaints bank risk
use_cases:
  - Audit corporate treasury depository banks for Tier 1 capital adequacy, ROA/ROE profitability, and non-current loan ratios
  - Benchmark fintech BaaS sponsor banks side-by-side on Call Report ratios and CFPB consumer complaint intensity
  - Screen counterparties and historical institutions against the official FDIC Bank Failures registry
  - Monitor regional bank balance sheets across specific US states and minimum asset tiers
docs_url: "https://github.com/desastreger/open-data-mcp-servers"
---

# FDIC Bank Financial Health, Call Reports & Risk Screener

Screen **US FDIC-insured banks** directly against the official **FDIC BankFind Suite REST API** (`banks.data.fdic.gov/api` — institutions, quarterly Call Report financials, and bank failures) enriched with **CFPB Consumer Complaint Database** counts. Returns assets, deposits, equity, and net income in both `$k` and normalized USD, Tier 1 Leverage Ratio (`RBC1AAJ`), `ROA`, `ROE`, non-current loan ratio (`NCLNLS / LNLSNET`), deterministic `0–100` `bankHealthScore`, and `riskTier` (`STRONG`, `SATISFACTORY`, `WATCH`, `ELEVATED_RISK`, `FAILED_BANK`).

## When to Use This Skill

**Activate this skill when the user wants to:**
- Screen a specific US bank by name (`bankNames`) or FDIC Certificate Number (`certNumbers`) for capital health, earnings, and non-current loans.
- Compare 2 or more fintech sponsor banks or treasury counterparties (`compare_bank_financial_ratios`).
- Search historical or recent bank closures (`search_fdic_bank_failures`) by name, CERT, state, or failure year.
- Audit large or regional banks in specific US states (`states: ["CA", "NY"]`, `minAssetsMillions: 1000`).

**Do NOT use this skill when:**
- Checking non-bank corporate SEC Form D / Form 4 / 13F filings or KYB across GLEIF/FDA/USASpending (use `us-kyb-compliance-dossier` or `sec-13f-institutional-whale-holdings`).
- Screening sanctioned entities or crypto wallets (use `ofac-sanctions-aml-pep-screener-mcp`).

## Connect the Remote MCP Server

This skill connects to the live Apify Standby Streamable HTTP MCP server (`$0.80 / 1,000 records` pay-per-event rate; zero external FDIC or CFPB API keys required).

### Option 1: 1-Click OAuth MCP (Zero API Key Setup — Recommended)

- **1-Click OAuth MCP Endpoint:** `https://mcp.apify.com/?tools=desastreger/fdic-bank-financial-health-screener`

```bash
claude mcp add --transport http fdic-bank-financial-health-screener "https://mcp.apify.com/?tools=desastreger/fdic-bank-financial-health-screener"
```

```json
{
  "mcpServers": {
    "fdic-bank-financial-health-screener": {
      "url": "https://mcp.apify.com/?tools=desastreger/fdic-bank-financial-health-screener"
    }
  }
}
```

### Option 2: Direct Standby MCP (Bearer Token for Headless / CI Agents)

- **Direct Standby Streamable HTTP Endpoint:** `https://desastreger--fdic-bank-financial-health-screener.apify.actor/mcp`
- **Authentication Header:** `Authorization: Bearer $APIFY_TOKEN`

```json
{
  "mcpServers": {
    "fdic-bank-financial-health-screener": {
      "url": "https://desastreger--fdic-bank-financial-health-screener.apify.actor/mcp",
      "headers": {
        "Authorization": "Bearer <YOUR_APIFY_TOKEN>"
      }
    }
  }
}
```

### Apify REST API Fallback (cURL)

```bash
curl -sS -X POST "https://api.apify.com/v2/acts/desastreger~fdic-bank-financial-health-screener/run-sync-get-dataset-items" \
  -H "Authorization: Bearer $APIFY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "mode": "screen",
    "bankNames": ["JPMorgan Chase", "Cross River"],
    "includeCfpbComplaints": true,
    "maxResults": 5
  }'
```

## MCP Tools & Parameter Selection

All tools are read-only (`readOnlyHint: true`):

| MCP Tool | Purpose | Key Arguments & Defaults |
| :--- | :--- | :--- |
| `screen_us_bank_health` | Screen US banks for Call Report capital ratios, earnings, asset quality, CFPB complaints, and `0–100` `bankHealthScore`. | `bankNames`, `certNumbers`, `states`, `minAssetsMillions`, `activeOnly` (`true`), `includeFailureHistory` (`true`), `includeCfpbComplaints` (`true`), `sortBy` (`"ASSET"`), `maxResults` (`5`, `1–50`). |
| `search_fdic_bank_failures` | Search official FDIC Bank Failures registry by bank name, CERT, state, or failure year range. | `bankName`, `certNumber`, `states`, `startYear`, `endYear`, `includeCfpbComplaints` (`false`), `maxResults` (`10`, `1–50`). |
| `compare_bank_financial_ratios` | Side-by-side peer comparison across Tier 1 leverage, ROA/ROE, non-current loans, CFPB complaints, and `bankHealthScore`. | `bankNames`, `certNumbers`, `includeCfpbComplaints` (`true`). |

### Parameter Selection Rules
1. **Exact CERT Lookup (`certNumbers`):** Prefer FDIC `CERT` numbers (e.g., `["628", "58410", "1299"]`) whenever known to avoid name-matching ambiguity across similarly named community banks.
2. **Closed/Failed Bank Inspection:** Set `activeOnly: false` (or call `search_fdic_bank_failures`) when checking historical or recently failed institutions (e.g., CERT `24735`).
3. **Sponsor-Bank Peer Benchmarking:** Use `compare_bank_financial_ratios` with 2–5 candidate banks to automatically surface the highest `bankHealthScore`, strongest `tier1LeverageRatioPercent`, highest `roaPercent`, and lowest `nonCurrentLoanRatioPercent`.

## Execution Workflow

1. **Scope Query:** Use `screen_us_bank_health` for single-bank or state/asset cohort screening, `compare_bank_financial_ratios` for sponsor-bank selection, or `search_fdic_bank_failures` for failure history.
2. **Triage by `riskTier` & `bankHealthScore`:** Flag `FAILED_BANK` (`0`), `ELEVATED_RISK` (`<45`), or `WATCH` (`45–64`) counterparties, and inspect `tier1LeverageRatioPercent` (`<5.0%` below well-capitalized) and `nonCurrentLoanRatioPercent` (`>2.0%` elevated credit stress).
3. **Cite Official Provenance:** Always include FDIC `cert`, `callReportDate`, `totalAssetsUsd`, `tier1LeverageRatioPercent`, `roaPercent`, `nonCurrentLoanRatioPercent`, `cfpbComplaintsTotal`, and `fdicProfileUrl`.
