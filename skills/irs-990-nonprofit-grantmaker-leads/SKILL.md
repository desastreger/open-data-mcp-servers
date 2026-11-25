---
name: irs-990-nonprofit-grantmaker-leads
description: "Discover US 501(c) nonprofits, hospitals, universities, and private grantmaking foundations from official IRS Form 990, 990-PF, and 990-EZ filings via ProPublica Nonprofit Explorer API v2. Activate when users ask for nonprofit financial leads, foundation grantmakers, EIN 990 dossiers, executive compensation, or endowment screening."
summary: "Extract verified IRS Form 990, 990-PF & 990-EZ financials for US nonprofits and grantmaking foundations via ProPublica API v2. Returns EIN, revenue, assets, executive compensation, grants paid, official PDF links, and lead scores."
version: "1.0.0"
tags:
  - irs-990
  - nonprofit-leads
  - foundation-grants
  - philanthropy
  - b2b-prospecting
  - propublica-api
  - ein-lookup
  - mcp-server
  - lead-generation
keywords:
  - IRS Form 990 scraper
  - foundation grantmakers
  - nonprofit financial leads
  - 990-PF endowment data
  - ProPublica Nonprofit Explorer MCP
  - nonprofit executive compensation
  - EIN 990 lookup
  - grant prospecting
use_cases:
  - Build B2B SaaS outbound lists of mid-market and enterprise nonprofits, hospitals, and universities filtered by revenue, assets, and US state
  - Prospect active private foundations (990-PF) and community foundations by endowment size and grants paid
  - Pull multi-year IRS Form 990 financial dossiers and PDF filing links by 9-digit EIN or organization name
  - Benchmark nonprofit executive compensation, functional expenses, and balance-sheet health before outreach
docs_url: "https://github.com/desastreger/open-data-mcp-servers"
---

# IRS Form 990 Nonprofit & Foundation Grantmakers (`irs-990-nonprofit-grantmaker-leads`)

## When to Use This Skill

Activate this skill whenever the user needs verified IRS Form 990 / 990-PF / 990-EZ financial intelligence on US tax-exempt organizations or grantmaking foundations:
- **"Find grantmaking foundations in [state/topic] with $[X]M+ in assets"** — screen Form 990-PF and NTEE `T*` foundations by asset scale and grants paid (`contrpdpbks`).
- **"Pull an IRS 990 dossier for [EIN or organization name]"** — inspect multi-year revenue, functional expenses, assets, liabilities, officer compensation, and official IRS PDF filings.
- **"Build a B2B lead list of nonprofits, hospitals, or universities in [state]"** — filter 501(c) organizations by `minRevenueUsd`, `minAssetsUsd`, `nteeCategory`, and `subsectionCode`.

**When NOT to use this skill:**
- For-profit private startups or corporate VC raises (use `sec-form-d-funding-leads` instead).
- Non-US charities without an IRS 501(c) registration or Form 990 filing.
- Private email/phone scraping (IRS Form 990 public API summaries provide verified EINs, addresses, care-of lines, financials, and PDF links—never fabricated personal emails).

## Connect the Remote MCP Server

### Option 1: 1-Click OAuth MCP (Zero API Key Setup — Recommended)

Connect directly via Apify's hosted Streamable HTTP MCP gateway—your MCP client triggers browser OAuth sign-in automatically with no manual token copy-paste:

- **1-Click OAuth MCP URL:** `https://mcp.apify.com/?tools=desastreger/irs-990-nonprofit-grantmaker-leads`
- **Direct Standby Endpoint (Headless / CI):** `https://desastreger--irs-990-nonprofit-grantmaker-leads.apify.actor/mcp` (`Authorization: Bearer $APIFY_TOKEN`)
- **Apify Store Page:** `https://apify.com/desastreger/irs-990-nonprofit-grantmaker-leads`
- **Pricing:** `$0.50 / 1,000` leads launch (`$0.0005` per record); zero monthly subscription

#### Claude Code CLI (1-Click OAuth)
```bash
claude mcp add --transport http irs-990-nonprofit-grantmaker-leads "https://mcp.apify.com/?tools=desastreger/irs-990-nonprofit-grantmaker-leads"
```

#### Cursor (`.cursor/mcp.json`) / Claude Desktop
```json
{
  "mcpServers": {
    "irs-990-nonprofit-grantmaker-leads": {
      "url": "https://mcp.apify.com/?tools=desastreger/irs-990-nonprofit-grantmaker-leads"
    }
  }
}
```

#### Windsurf (`~/.codeium/windsurf/mcp_config.json`)
```json
{
  "mcpServers": {
    "irs-990-nonprofit-grantmaker-leads": {
      "serverUrl": "https://mcp.apify.com/?tools=desastreger/irs-990-nonprofit-grantmaker-leads"
    }
  }
}
```

#### VS Code (`.vscode/mcp.json`)
```json
{
  "servers": {
    "irs-990-nonprofit-grantmaker-leads": {
      "type": "http",
      "url": "https://mcp.apify.com/?tools=desastreger/irs-990-nonprofit-grantmaker-leads"
    }
  }
}
```

### Option 2: Direct Standby Endpoint (`Bearer $APIFY_TOKEN` for Headless / CI)
For automated servers or CI runners without interactive browser OAuth:
```bash
claude mcp add --transport http irs-990-nonprofit-grantmaker-leads \
  https://desastreger--irs-990-nonprofit-grantmaker-leads.apify.actor/mcp \
  --header "Authorization: Bearer $APIFY_TOKEN"
```
```json
{
  "mcpServers": {
    "irs-990-nonprofit-grantmaker-leads": {
      "url": "https://desastreger--irs-990-nonprofit-grantmaker-leads.apify.actor/mcp",
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
  "https://api.apify.com/v2/acts/desastreger~irs-990-nonprofit-grantmaker-leads/run-sync-get-dataset-items?token=$APIFY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "foundation",
    "state": "NY",
    "foundationsOnly": true,
    "minAssetsUsd": 10000000,
    "maxResults": 10
  }'
```

## MCP Tools & Parameter Selection

| MCP Tool | Primary Intent | Key Arguments |
| :--- | :--- | :--- |
| `search_nonprofit_990_leads` | Discover US nonprofits, hospitals, universities, or foundations with enriched Form 990 financials. | `query` (default `"foundation"`), `state` (`"NY"`, `"CA"`), `nteeCategory` (`1–10`), `subsectionCode` (`3` for 501c3), `minRevenueUsd`, `minAssetsUsd`, `foundationsOnly`, `maxResults` (`1–50`) |
| `get_nonprofit_990_dossier` | Deep-dive profile + up to 5 multi-year Form 990/990-PF filings by EIN or name. | `einOrQuery` (**required**, e.g. `"13-1684331"` or `"Ford Foundation"`), `state`, `nteeCategory` |
| `screen_high_asset_foundations` | Rank grantmaking foundations above an asset floor with combined assets and grants paid totals. | `query`, `state`, `nteeCategory`, `minAssetsUsd` (default `1000000`), `minRevenueUsd`, `maxResults` (`1–50`) |

## Execution Workflow

1. **Step 1 — Scope & Cost-Aware Sizing:** Clarify geography (`state`), sector (`nteeCategory` 1–10), foundation filter (`foundationsOnly`), and financial thresholds (`minRevenueUsd`, `minAssetsUsd`). Start with `maxResults: 10` (`$0.50/1k` = `$0.005` for 10 leads).
2. **Step 2 — Query & Enrich:** Call `screen_high_asset_foundations` for grant-prospecting queries, `get_nonprofit_990_dossier` for a named entity or EIN, or `search_nonprofit_990_leads` for broad B2B nonprofit targeting.
3. **Step 3 — Rank & Verify:** Sort prospects by `leadScore` (`0–100`), `totalAssetsUsd`, `totalRevenueUsd`, and `grantsOrContributionsPaidUsd`, checking `latestTaxYear` recency and `formType` (`990PF` vs `990`).
4. **Step 4 — Structured Output:** Present ranked Markdown tables citing `formattedEin`, `organizationName`, `state`, `formType`, `latestTaxPeriod`, `totalAssetsUsd`, `totalRevenueUsd`, `grantsOrContributionsPaidUsd`, `leadScore`, `propublicaUrl`, and `latestFilingPdfUrl`.

## Data Provenance & Safety Rules

- **Cite Primary IRS Identifiers:** Always include `formattedEin` (`XX-XXXXXXX`), `latestTaxPeriod`, `formType`, and `propublicaUrl` / `latestFilingPdfUrl`.
- **Zero Fabrication:** Never invent contact emails, phone numbers, or grant deadlines not present in the official ProPublica / IRS 990 payload.
- **Distinguish Form Types:** Note whether metrics come from Form `990` (public charities/hospitals/universities), `990PF` (private grantmaking foundations with `grantsOrContributionsPaidUsd`), or `990EZ` (smaller nonprofits).
