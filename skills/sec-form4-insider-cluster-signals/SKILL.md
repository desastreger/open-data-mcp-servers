---
name: sec-form4-insider-cluster-signals
description: "Track US corporate insider trading and multi-insider cluster buy signals from official SEC EDGAR Form 4 XML filings. Activate when users ask for insider buying, cluster buys, SEC Form 4 filings, Rule 10b5-1 flags, C-suite stock purchases or sales, or company insider trading dossiers."
summary: "Extract real-time US corporate insider purchases, sales, Rule 10b5-1 flags, and multi-insider cluster buy signals from official SEC EDGAR Form 4 XML filings and Submissions/EFTS APIs."
version: "1.0.0"
tags:
  - sec-edgar
  - form-4
  - insider-trading
  - cluster-buys
  - equity-research
  - rule-10b5-1
  - mcp-server
  - financial-signals
keywords:
  - SEC Form 4 scraper
  - insider trading signals
  - insider cluster buys
  - C-suite open market purchases
  - Rule 10b5-1 trading plan filter
  - SEC EDGAR ownershipDocument XML
  - company insider dossier
  - SEC Form 4 MCP
use_cases:
  - Detect multi-insider cluster buying where 2+ officers or directors buy open-market shares in the same company
  - Filter out scheduled Rule 10b5-1 sales and option grants to isolate discretionary C-suite cash purchases (transactionCode P)
  - Pull a 90-day insider trading dossier for any US public ticker or 10-digit SEC CIK with net buy/sell dollar flows
  - Monitor real-time Form 4 filings across US equities without third-party financial data API keys
docs_url: "https://github.com/desastreger/open-data-mcp-servers"
---

# SEC Form 4 Insider Trading & Cluster Buy Signals (`sec-form4-insider-cluster-signals`)

## When to Use This Skill

Activate this skill when the user needs authoritative, real-time US Section 16 insider transaction intelligence from SEC EDGAR Form 4 XML filings:
- **"Find recent insider cluster buys"** — detect companies where 2 or more distinct executives/directors bought shares on the open market (`transactionCode: "P"`) outside Rule 10b5-1 plans (`aff10b5One: false`).
- **"Check insider buying/selling for [TICKER or CIK]"** — pull a complete company insider dossier showing open-market buys, scheduled 10b5-1 sales, option exercises (`M`), and post-trade holdings.
- **"Scan CEO/CFO open-market purchases over $100k this week"** — filter market-wide Form 4 filings by `openMarketPurchasesOnly: true`, `exclude10b51Plans: true`, and `minTransactionValueUsd`.

**When NOT to use this skill:**
- Private company Regulation D funding rounds (use `sec-form-d-funding-leads` instead).
- Non-US securities that do not file Section 16 Form 4 reports with the US SEC.
- Investment advice or price-target forecasting — present factual SEC filing metrics, `signalScore`, and provenance links objectively.

## Connect the Remote MCP Server

### Option 1: 1-Click OAuth MCP (Recommended)
- **OAuth Gateway URL:** `https://mcp.apify.com/?tools=desastreger/sec-form4-insider-cluster-signals`

```bash
claude mcp add --transport http sec-form4-insider-cluster-signals "https://mcp.apify.com/?tools=desastreger/sec-form4-insider-cluster-signals"
```

```json
{
  "mcpServers": {
    "sec-form4-insider-cluster-signals": {
      "url": "https://mcp.apify.com/?tools=desastreger/sec-form4-insider-cluster-signals"
    }
  }
}
```

### Option 2: Direct Standby Streamable HTTP MCP
- **MCP Endpoint:** `https://desastreger--sec-form4-insider-cluster-signals.apify.actor/mcp`
- **Auth Header:** `Authorization: Bearer $APIFY_TOKEN`
- **Pay-Per-Event Rate:** `$0.80 / 1,000` signals launch (`$0.0008 / signal`); zero monthly subscription

### Claude Code CLI
```bash
claude mcp add --transport http sec-form4-insider-cluster-signals \
  https://desastreger--sec-form4-insider-cluster-signals.apify.actor/mcp \
  --header "Authorization: Bearer $APIFY_TOKEN"
```

### Cursor / Claude Desktop (`mcp.json` / `claude_desktop_config.json`)
```json
{
  "mcpServers": {
    "sec-form4-insider-cluster-signals": {
      "url": "https://desastreger--sec-form4-insider-cluster-signals.apify.actor/mcp",
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
  "https://api.apify.com/v2/acts/desastreger~sec-form4-insider-cluster-signals/run-sync-get-dataset-items?token=$APIFY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "daysBack": 7,
    "openMarketPurchasesOnly": true,
    "exclude10b51Plans": true,
    "minTransactionValueUsd": 25000,
    "maxResults": 25
  }'
```

## MCP Tools & Parameter Selection (`readOnlyHint: true`)

| MCP Tool | Primary Intent | Key Arguments |
| :--- | :--- | :--- |
| `search_form4_insider_trades` | Query recent Form 4 insider buys/sales market-wide or by ticker/CIK. | `tickers` (`["NVDA"]`), `ciks`, `daysBack` (`1–365`, default `7`), `openMarketPurchasesOnly` (default `false`), `exclude10b51Plans` (default `false`), `minTransactionValueUsd` (default `0`), `searchQuery`, `maxResults` (`1–50`, default `10`) |
| `get_company_insider_dossier` | Pull a complete insider dossier for one ticker or CIK with net buy/sell dollar flow and 10b5-1 ratio. | `tickerOrCik` (**required**, e.g. `"NVDA"` or `"0001045810"`), `daysBack` (default `90`), `maxResults` (default `15`), `includeAmendments` (default `true`) |
| `detect_insider_cluster_buys` | Group open-market `P` purchases by issuer to surface multi-insider cluster buys (`clusterBuyCount >= 2`). | `tickers` (optional), `daysBack` (default `14`), `minClusterSize` (default `2`), `exclude10b51Plans` (default `true`), `minTransactionValueUsd` (default `10000`), `scanLimit` (default `40`) |

### High-Signal Output Fields to Inspect
| Field | Meaning & Analytical Use |
| :--- | :--- |
| `primaryTransactionCode` | `"P"` (Open Market Purchase), `"S"` (Open Market Sale), `"M"` (Option Exercise), `"A"` (Grant/Award), `"F"` (Tax Withholding). |
| `aff10b5One` | Boolean from SEC `<aff10b5One>`: `false` indicates discretionary trade; `true` indicates pre-scheduled Rule 10b5-1 plan. |
| `totalPurchaseValueUsd` / `totalSaleValueUsd` | Exact USD dollar value (`shares * pricePerShare`) summed across non-derivative transactions. |
| `clusterBuyCount` | Count of distinct reporting insiders executing open-market `P` purchases in the same issuer within the batch. |
| `signalScore` / `signalTier` | Deterministic `0–100` conviction score (`HIGH`, `MEDIUM`, `LOW`, `ROUTINE`) weighting C-suite role, non-10b5-1 `P` buys, USD size, and cluster count. |

## Execution Workflow

1. **Scope & Cost-Aware Sizing:** Clarify whether the user wants a specific ticker dossier (`get_company_insider_dossier`), multi-insider cluster scan (`detect_insider_cluster_buys`), or filtered trade feed (`search_form4_insider_trades`). Start with `maxResults: 10–25` (`$0.0008/signal`).
2. **Isolate Discretionary Conviction:** When hunting bullish signals, set `openMarketPurchasesOnly: true` and `exclude10b51Plans: true` so routine RSU grants (`A`), tax withholdings (`F`), and automated Rule 10b5-1 sales (`S`) are excluded.
3. **Rank & Contextualize:** Sort by `clusterBuyCount`, `signalScore`, `totalPurchaseValueUsd`, and `officerTitle`, and distinguish direct (`D`) vs indirect (`I`) trust/fund holdings.
4. **Cite Primary SEC Provenance:** Always include `ticker`, `cik`, `accessionNumber`, `filingDate`, `aff10b5One`, and `edgarFilingUrl` (`sec.gov/Archives/edgar/...`) for every reported transaction. Never fabricate or extrapolate unfiled prices or holdings.
