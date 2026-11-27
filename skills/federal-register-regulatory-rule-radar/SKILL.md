---
name: federal-register-regulatory-rule-radar
description: "Track newly published US Federal Register Final Rules, Proposed Rules (with open public comment deadlines), Notices, and Presidential Executive Orders via official federalregister.gov API v1. Activate when the user asks to 'search recent Federal Register rules', 'track open federal public comment deadlines', 'monitor SEC, FDA, or EPA proposed rules and CFR changes', or 'look up a Federal Register document or Executive Order'."
summary: "Track US Federal Register Final Rules, Proposed Rules, open comment deadlines, Notices, and Executive Orders with CFR citations and 0-100 regulatory impact scores via remote MCP."
version: "1.0.0"
tags:
  - federal-register
  - regulatory-compliance
  - executive-orders
  - public-comment-deadlines
  - government-affairs
  - cfr-rules
  - legal-tech
  - mcp-server
keywords:
  - US Federal Register API scraper
  - Federal Register proposed rules comments
  - Presidential Executive Orders tracker
  - OMB significant rules monitor
  - CFR regulatory change radar
  - SEC FDA EPA Federal Register MCP
  - government affairs compliance intelligence
use_cases:
  - Monitor newly published Final Rules and Executive Orders with imminent effective dates across 400+ US federal agencies
  - Track Proposed Rules with open Regulations.gov public comment deadlines before submission windows close
  - Screen OMB economically and regulatorily significant rulemakings (EO 12866) across healthcare, energy, finance, and tech agencies
  - Look up exact CFR part citations, docket IDs, Regulation Identifier Numbers (RINs), and official PDFs for any Federal Register document number
docs_url: "https://github.com/desastreger/open-data-mcp-servers"
---

# US Federal Register Rules, Notices & Executive Orders Radar

Monitor newly published **US Federal Register Final Rules (`RULE`)**, **Proposed Rules (`PRORULE`)**, **Agency Notices (`NOTICE`)**, and **Presidential Executive Orders & Memoranda (`PRESDOCU`)** directly from the official **US Federal Register REST API v1** (`federalregister.gov/api/v1`). Returns normalized `daysUntilCommentsClose`, `daysUntilEffective`, CFR citations (`cfrReferences`), agency slugs, dockets, RINs, Regulations.gov comment counts, `urgencyTier`, and deterministic `0–100` `regulatoryImpactScore`.

## When to Use This Skill

**Activate this skill when the user wants to:**
- Search recent US Federal Register Final Rules, Proposed Rules, Notices, or Presidential Executive Orders by keyword (`query`), agency slug (`agencySlugs`), or lookback window (`daysBack`).
- Track open public comment windows (`track_open_comment_deadlines`) closing soon on Regulations.gov.
- Filter for OMB economically/regulatorily significant rules (`significantOnly: true`).
- Retrieve full regulatory metadata, CFR citations, and PDF/HTML links for a specific `documentNumber` (e.g., `"2026-24141"`).

**Do NOT use this skill when:**
- Auditing facility-level environmental inspections or enforcement penalties (use `epa-echo-industrial-facility-compliance`).
- Checking SEC EDGAR Form D / Form 4 / 13F corporate securities filings (use `sec-form-d-funding-leads`, `sec-form4-insider-cluster-signals`, or `sec-13f-institutional-whale-holdings`).

## Connect the Remote MCP Server

This skill connects to the live Apify Standby Streamable HTTP MCP server (`$0.50 / 1,000 records` launch pay-per-event rate; zero external Federal Register API keys required).

### Option 1: 1-Click OAuth MCP (Zero API Key Setup — Recommended)

- **1-Click OAuth MCP Endpoint:** `https://mcp.apify.com/?tools=desastreger/federal-register-regulatory-rule-radar`

```bash
claude mcp add --transport http federal-register-regulatory-rule-radar "https://mcp.apify.com/?tools=desastreger/federal-register-regulatory-rule-radar"
```

```json
{
  "mcpServers": {
    "federal-register-regulatory-rule-radar": {
      "url": "https://mcp.apify.com/?tools=desastreger/federal-register-regulatory-rule-radar"
    }
  }
}
```

### Option 2: Direct Standby MCP (Bearer Token for Headless / CI Agents)

- **Direct Standby Streamable HTTP Endpoint:** `https://desastreger--federal-register-regulatory-rule-radar.apify.actor/mcp`
- **Authentication Header:** `Authorization: Bearer $APIFY_TOKEN`

```json
{
  "mcpServers": {
    "federal-register-regulatory-rule-radar": {
      "url": "https://desastreger--federal-register-regulatory-rule-radar.apify.actor/mcp",
      "headers": {
        "Authorization": "Bearer <YOUR_APIFY_TOKEN>"
      }
    }
  }
}
```

### Apify REST API Fallback (cURL)

```bash
curl -sS -X POST "https://api.apify.com/v2/acts/desastreger~federal-register-regulatory-rule-radar/run-sync-get-dataset-items" \
  -H "Authorization: Bearer $APIFY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "artificial intelligence",
    "documentTypes": ["RULE", "PRORULE", "PRESDOCU"],
    "daysBack": 30,
    "openCommentWindowOnly": false,
    "significantOnly": false,
    "maxResults": 10
  }'
```

## MCP Tools & Parameter Selection

All tools are read-only (`readOnlyHint: true`):

| MCP Tool | Purpose | Key Arguments & Defaults |
| :--- | :--- | :--- |
| `search_federal_register_rules` | Search Rules, Proposed Rules, Notices, and Presidential Documents by keyword, agency, and significance. | `query`, `documentTypes` (`["RULE","PRORULE","PRESDOCU"]`), `agencySlugs`, `daysBack` (`14` default, falls back to `60` if 0 hits), `openCommentWindowOnly` (`false`), `significantOnly` (`false`), `maxResults` (`10` default, `1–50`). |
| `track_open_comment_deadlines` | Track Proposed Rules and Notices with active public comment windows (`comments_close_on >= today`), sorted by soonest deadline. | `query`, `agencySlugs`, `documentTypes` (`["PRORULE","NOTICE"]`), `significantOnly` (`false`), `daysBack` (`60`), `maxClosingInDays`, `maxResults` (`10` default, `1–50`). |
| `get_federal_register_document` | Look up full normalized metadata for a single Federal Register document number. | `documentNumber` (required, e.g., `"2026-24141"`). |

### Parameter Selection Rules
1. **Agency Filtering (`agencySlugs`):** Use Federal Register lowercase hyphenated slugs such as `"securities-and-exchange-commission"`, `"environmental-protection-agency"`, `"food-and-drug-administration"`, `"federal-trade-commission"`, or `"centers-for-medicare-medicaid-services"`.
2. **Comment-Window Capture:** Use `track_open_comment_deadlines` with `maxClosingInDays: 30` for government affairs briefings on rules closing within 30 days.
3. **High-Materiality Screening:** Set `significantOnly: true` to isolate rules flagged as OMB economically or regulatorily significant under EO 12866.

## Execution Workflow

1. **Scope Query:** Use `search_federal_register_rules` for broad regulatory monitoring, `track_open_comment_deadlines` for upcoming comment cutoffs, or `get_federal_register_document` for a known document number.
2. **Triage by `urgencyTier` & `regulatoryImpactScore`:** Prioritize `IMMEDIATE_EFFECTIVE` (`daysUntilEffective <= 14`) and `OPEN_COMMENT_DEADLINE` (`daysUntilCommentsClose >= 0`) items with `regulatoryImpactScore >= 60`.
3. **Cite Official Provenance:** Always include `documentNumber`, `publicationDate`, affected `cfrReferences`, `docketIds`, and official `htmlUrl` / `pdfUrl`.
