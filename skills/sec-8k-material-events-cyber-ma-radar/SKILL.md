---
name: sec-8k-material-events-cyber-ma-radar
description: "Monitor real-time US public company SEC Form 8-K and 8-K/A material event filings (Item 1.05 cybersecurity incidents, M&A deals, CEO/CFO changes, layoffs, bankruptcy, delisting, and restatements) via official SEC EDGAR EFTS & Submissions APIs. Activate when the user asks to 'scan SEC Form 8-K cyber breaches', 'track recent M&A 8-K filings', 'find CEO or CFO departures on Form 8-K', or 'get a company 8-K event timeline'."
summary: "Track SEC Form 8-K & 8-K/A Item 1.05 cyber incidents, M&A deals, CEO/CFO turnover, layoffs, bankruptcy & restatements with 0-100 materiality scores via remote MCP."
version: "1.0.0"
tags:
  - sec-edgar
  - form-8k
  - cybersecurity-incidents
  - ma-deals
  - executive-turnover
  - distressed-signals
  - b2b-lead-gen
  - mcp-server
keywords:
  - SEC Form 8-K API scraper
  - Item 1.05 cybersecurity breach tracker
  - SEC EDGAR 8-K M&A deals
  - CEO CFO departure 8-K Item 5.02
  - bankruptcy delisting 8-K alerts
  - accounting restatement Item 4.02
  - B2B trigger event intelligence
use_cases:
  - Catch Item 1.05 material cybersecurity incident disclosures within hours of SEC EDGAR filing for incident-response and cyber insurance outreach
  - Monitor Item 1.01 and Item 2.01 M&A definitive agreements and completed acquisitions for post-merger integration and advisory capture
  - Track Item 5.02 CEO, CFO, and board director departures and appointments to trigger 100-day executive vendor reset outreach
  - Screen Item 1.03 bankruptcy, Item 2.05/2.06 layoffs & impairments, Item 3.01 delisting notices, and Item 4.02 restatements
docs_url: "https://github.com/desastreger/open-data-mcp-servers"
---

# SEC Form 8-K Material Events, M&A, Cyber & CEO Radar

Monitor real-time **US SEC EDGAR Form `8-K` and `8-K/A`** material corporate event filings directly from official **SEC EDGAR EFTS (`efts.sec.gov`)** and **Submissions (`data.sec.gov`)** APIs. Decodes every 8-K item code (`1.01`–`9.01`), classifies high-intent B2B trigger categories (`CYBERSECURITY_BREACH`, `MA_DEFINITIVE_DEAL`, `EXECUTIVE_TURNOVER`, `RESTRUCTURING_LAYOFFS`, `DISTRESS_BANKRUPTCY_DELISTING`, `ACCOUNTING_RESTATEMENT_AUDITOR`), and computes deterministic `0–100` `materialityScore`, `severityTier`, `outreachAngle`, and direct EDGAR archive links.

## When to Use This Skill

**Activate this skill when the user wants to:**
- Scan recent SEC Form 8-K filings for **Item 1.05 cybersecurity incidents**, **M&A deals (1.01/2.01)**, **CEO/CFO departures (5.02)**, **layoffs/restructuring (2.05/2.06)**, **bankruptcy/delisting (1.03/2.04/3.01)**, or **restatements/auditor changes (4.01/4.02)**.
- Pull a specific public company's Form 8-K event timeline by stock ticker (e.g., `"AAPL"`, `"CRWD"`) or 10-digit SEC CIK.
- Rank material corporate events by deterministic `materialityScore` (`0–100`) and B2B outreach angle.

**Do NOT use this skill when:**
- Tracking insider stock purchases/sales by officers and directors (use `sec-form4-insider-cluster-signals`).
- Analyzing institutional hedge fund 13F equity holdings (use `sec-13f-institutional-whale-holdings`).
- Tracking private startup Reg D fundraising (use `sec-form-d-funding-leads`).

## Connect the Remote MCP Server

This skill connects to the live Apify Standby Streamable HTTP MCP server (`$0.80 / 1,000 events` pay-per-event; zero external SEC API keys required).

### Option 1: 1-Click OAuth MCP (Zero API Key Setup — Recommended)

- **1-Click OAuth MCP Endpoint:** `https://mcp.apify.com/?tools=desastreger/sec-8k-material-events-cyber-ma-radar`

```bash
claude mcp add --transport http sec-8k-material-events-cyber-ma-radar "https://mcp.apify.com/?tools=desastreger/sec-8k-material-events-cyber-ma-radar"
```

```json
{
  "mcpServers": {
    "sec-8k-material-events-cyber-ma-radar": {
      "url": "https://mcp.apify.com/?tools=desastreger/sec-8k-material-events-cyber-ma-radar"
    }
  }
}
```

### Option 2: Direct Standby MCP (Bearer Token for Headless / CI Agents)

- **Direct Standby Streamable HTTP Endpoint:** `https://desastreger--sec-8k-material-events-cyber-ma-radar.apify.actor/mcp`
- **Authentication Header:** `Authorization: Bearer $APIFY_TOKEN`

```json
{
  "mcpServers": {
    "sec-8k-material-events-cyber-ma-radar": {
      "url": "https://desastreger--sec-8k-material-events-cyber-ma-radar.apify.actor/mcp",
      "headers": {
        "Authorization": "Bearer <YOUR_APIFY_TOKEN>"
      }
    }
  }
}
```

### Apify REST API Fallback (cURL)

```bash
curl -sS -X POST "https://api.apify.com/v2/acts/desastreger~sec-8k-material-events-cyber-ma-radar/run-sync-get-dataset-items" \
  -H "Authorization: Bearer $APIFY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "eventCategory": "cybersecurity",
    "daysBack": 30,
    "excludeRegFdOnly": true,
    "maxResults": 10
  }'
```

## MCP Tools & Parameter Selection

All tools are read-only (`readOnlyHint: true`):

| MCP Tool | Purpose | Key Arguments & Defaults |
| :--- | :--- | :--- |
| `search_sec_8k_material_events` | Search SEC Form 8-K & 8-K/A filings by category, explicit item codes, keyword, or tickers/CIKs. | `eventCategory` (`"all"`, `"cybersecurity"`, `"ma_deals"`, `"exec_changes"`, `"layoffs_distress"`, `"accounting"`), `itemCodes`, `query`, `ciksOrTickers`, `daysBack` (`7`), `excludeRegFdOnly` (`false`), `enrichSubmissions` (`false`), `maxResults` (`10`). |
| `scan_cyber_and_distress_8k_alerts` | Scan high-urgency Item 1.05 cyber breaches, bankruptcy/delisting, layoffs, restatements, and C-suite turnover ranked by `materialityScore`. | `focus` (`"all_alerts"`, `"cyber_only"`, `"distress_and_layoffs"`, `"restatements_and_auditors"`, `"exec_turnover"`), `minMaterialityScore` (`70`), `daysBack` (`30`), `query`, `enrichSubmissions` (`false`), `maxResults` (`10`). |
| `get_company_8k_event_timeline` | Retrieve a company's full Form 8-K / 8-K/A event timeline by ticker or CIK via `data.sec.gov/submissions`. | `tickerOrCik` (required, e.g. `"AAPL"` or `"0000320193"`), `eventCategory`, `itemCodes`, `daysBack` (`365`), `excludeRegFdOnly` (`false`), `maxResults` (`15`). |

## Execution Workflow

1. **Scope Trigger Event:** Use `scan_cyber_and_distress_8k_alerts` for high-urgency cybersecurity, distress, or leadership triggers; `search_sec_8k_material_events` for M&A or custom keyword/item filters; or `get_company_8k_event_timeline` for single-issuer due diligence.
2. **Filter Noise:** Set `excludeRegFdOnly: true` to skip routine `7.01` / `8.01` / `9.01` filings.
3. **Cite Official Provenance:** Always include `companyName`, `primaryTicker`, `cik`, `accessionNumber`, `filingDate`, decoded `itemLabels`, `materialityScore`, and direct `edgarFilingIndexUrl`.
