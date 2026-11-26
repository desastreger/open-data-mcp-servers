---
name: sec-13f-institutional-whale-holdings
description: "Track US institutional investor, hedge fund, and family office equity & Put/Call option holdings from official SEC EDGAR Form 13F-HR XML filings. Activate when users ask for 13F filings, whale portfolios, Berkshire Hathaway or hedge fund holdings, institutional ownership by ticker/CUSIP, or Put/Call option positions."
summary: "Extract real-time US institutional manager & hedge fund holdings, portfolio weights, Put/Call options, and manager signer contacts from official SEC EDGAR Form 13F-HR XML filings."
version: "1.0.0"
tags:
  - sec-edgar
  - form-13f
  - hedge-funds
  - institutional-holdings
  - whale-tracking
  - equity-research
  - mcp-server
  - financial-signals
keywords:
  - SEC Form 13F-HR scraper
  - institutional whale holdings
  - hedge fund 13F portfolio
  - Berkshire Hathaway 13F holdings
  - SEC EDGAR informationTable XML
  - Put Call 13F options filter
  - institutional holders by CUSIP
  - SEC 13F MCP
use_cases:
  - Pull the largest equity and option holdings for any institutional investment manager by SEC CIK or fund name
  - Identify top institutional whales holding a specific US stock ticker, issuer name, or 9-character CUSIP
  - Isolate Put and Call derivative option disclosures reported on Form 13F-HR filings over a USD threshold
  - Enrich wealth and RIA prospect lists with institutional manager addresses and compliance signer phone/title contacts
docs_url: "https://github.com/desastreger/open-data-mcp-servers"
---

# SEC Form 13F Institutional Whale Holdings (`sec-13f-institutional-whale-holdings`)

## When to Use This Skill

Activate this skill when the user needs authoritative institutional holdings data from SEC EDGAR Form 13F-HR XML filings (`primary_doc.xml` + `<informationTable>`):
- **"What are Berkshire Hathaway's (or [Fund Name] / [CIK]) top 13F holdings?"** — pull the manager's latest `13F-HR` portfolio summary, total AUM (`tableValueTotalUsd`), and largest positions sorted by `valueUsd` descending.
- **"Which institutional funds hold [TICKER / ISSUER / CUSIP]?"** — find recent 13F-HR managers holding that security, ranked by USD position value.
- **"Show large Put/Call option positions filed in recent 13Fs"** — filter market-wide 13F-HR XML tables with `optionsOnly: true` and `minPositionValueUsd`.

**When NOT to use this skill:**
- Daily Section 16 executive/director insider trades (use `sec-form4-insider-cluster-signals` instead).
- Private Regulation D fundraising rounds (use `sec-form-d-funding-leads` instead).
- Short-interest or intra-quarter unfiled trades — Form 13F-HR reflects quarter-end long/option positions filed within 45 days of quarter end.

## Connect the Remote MCP Server

### Option 1: 1-Click OAuth MCP (Recommended)
- **OAuth Gateway URL:** `https://mcp.apify.com/?tools=desastreger/sec-13f-institutional-whale-holdings`

### Option 2: Direct Standby Streamable HTTP MCP
- **MCP Endpoint:** `https://desastreger--sec-13f-institutional-whale-holdings.apify.actor/mcp`
- **Auth Header:** `Authorization: Bearer $APIFY_TOKEN`
- **Pay-Per-Event Rate:** `$0.80 / 1,000` holdings launch (`$0.0008 / holding`); zero monthly subscription

### Claude Code CLI
```bash
claude mcp add --transport http sec-13f-institutional-whale-holdings \
  https://desastreger--sec-13f-institutional-whale-holdings.apify.actor/mcp \
  --header "Authorization: Bearer $APIFY_TOKEN"
```

### Cursor / Claude Desktop (`mcp.json` / `claude_desktop_config.json`)
```json
{
  "mcpServers": {
    "sec-13f-institutional-whale-holdings": {
      "url": "https://desastreger--sec-13f-institutional-whale-holdings.apify.actor/mcp",
      "headers": {
        "Authorization": "Bearer <YOUR_APIFY_TOKEN>"
      }
    }
  }
}
```

### Apify REST API Fallback (Synchronous Dataset Run)
```bash
curl -s -X POST \
  "https://api.apify.com/v2/acts/desastreger~sec-13f-institutional-whale-holdings/run-sync-get-dataset-items?token=$APIFY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "managerCiks": ["0001067983"],
    "daysBack": 30,
    "topHoldingsPerManager": 10,
    "maxResults": 10
  }'
```

## MCP Tools & Parameter Selection (`readOnlyHint: true`)

| MCP Tool | Primary Intent | Key Arguments |
| :--- | :--- | :--- |
| `search_13f_whale_holdings` | Search recent Form 13F-HR holdings market-wide or by manager CIK, issuer/CUSIP/fund keyword, and options filter. | `managerCiks` (`["0001067983"]`), `query`, `daysBack` (default `30`, auto-expands to `90` if empty), `minPositionValueUsd` (default `0`), `optionsOnly` (default `false`), `topHoldingsPerManager` (default `5`), `maxResults` (`1–50`, default `10`) |
| `get_fund_13f_portfolio` | Pull a specific manager's latest 13F-HR portfolio summary and top holdings by CIK or fund name. | `managerCikOrName` (**required**, e.g. `"0001067983"` or `"Berkshire Hathaway"`), `topHoldings` (default `15`), `optionsOnly` (default `false`), `minPositionValueUsd` (default `0`), `includeAmendments` (default `true`) |
| `find_institutional_holders_by_issuer` | Find institutional whales holding a specific issuer, ticker, or CUSIP ranked by USD value desc. | `issuerOrCusip` (**required**, e.g. `"NVIDIA"`, `"NVDA"`, or `"67066G104"`), `daysBack` (default `30`), `optionsOnly` (default `false`), `minPositionValueUsd` (default `0`), `maxResults` (default `15`) |

### High-Signal Output Fields to Inspect
| Field | Meaning & Analytical Use |
| :--- | :--- |
| `valueUsd` | Exact USD market value reported in the `<infoTable>` row (automatically handles `X0202` exact USD vs legacy `X0201` thousands). |
| `portfolioWeightPct` | Position size as a percentage of the manager's `tableValueTotalUsd` (`valueUsd / tableValueTotalUsd * 100`). |
| `putCall` | `"Put"`, `"Call"`, or `null` for common equity / non-option holdings. |
| `sharesOrPrincipalAmount` / `sharesOrPrincipalType` | Share count (`"SH"`) or principal bond/note amount (`"PRN"`). |
| `investmentDiscretion` / `votingAuthority` | `"SOLE"`, `"DFND"`, or `"OTR"` discretion plus `{ sole, shared, none }` voting share breakdown. |
| `signerName` / `signerTitle` / `signerPhone` | Official Form 13F cover-page compliance officer / executive signer contact details. |

## Execution Workflow

1. **Scope & Cost-Aware Sizing:** Choose `get_fund_13f_portfolio` for a single whale manager, `find_institutional_holders_by_issuer` for a stock/CUSIP holder list, or `search_13f_whale_holdings` for broad scans. Keep `topHoldingsPerManager` (`2–15`) bounded so large funds do not emit thousands of micro-positions (`$0.0008/holding`).
2. **Handle Multi-Account Rows Carefully:** Institutional managers with `otherIncludedManagersCount > 0` may report multiple `<infoTable>` rows for the same CUSIP across distinct `otherManager` sub-accounts; sum across rows when computing total firm exposure to a CUSIP.
3. **Separate Equity vs Options:** Check `putCall` (`"Put"` / `"Call"` vs `null`) before combining share counts (`sharesOrPrincipalAmount` on Put/Call rows represents underlying option shares).
4. **Cite Primary SEC Provenance:** Always report `managerName`, `managerCik`, `periodOfReport`, `filingDate`, `accessionNumber`, `cusip`, `valueUsd`, and `edgarFilingUrl` (`sec.gov/Archives/edgar/...`). Never fabricate unfiled positions.
