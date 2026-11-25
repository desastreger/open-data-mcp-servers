<img src="../../icons/cross-border-tariff-eu-trade-mcp.svg" width="72" height="72" align="right" alt="cross-border-tariff-eu-trade-mcp icon" />

# US Tariff (HTS), EU VAT & TED Tenders Scraper ($0.80/1k)

**Category:** International Trade & Procurement  
**Apify Store:** [https://apify.com/desastreger/cross-border-tariff-eu-trade-mcp](https://apify.com/desastreger/cross-border-tariff-eu-trade-mcp)  
**1-Click OAuth MCP (Zero API Key):** `https://mcp.apify.com/?tools=desastreger/cross-border-tariff-eu-trade-mcp`  
**Direct Standby MCP (Bearer Token):** `https://desastreger--cross-border-tariff-eu-trade-mcp.apify.actor/mcp`  
**Official Data Sources:** USITC HTS API, European Commission VIES, EU TED API v3

> [!IMPORTANT]
> **Early-Adopter Launch Pricing:** **$0.80 / 1k records** (`$0.0008`/record) — promotional launch pricing while early adopters onboard. Scheduled to step up to our standard **$2.00 / 1k records** (`$0.002`/record) rate after the launch window, still **75%–95% cheaper** than comparable Store scrapers.

## Overview

Cross-border customs & European procurement intelligence: calculate official USITC Harmonized Tariff Schedule (HTS) duty rates + Chapter 99 footnotes, verify EU corporate VAT numbers via EC VIES, and search EU TED public tenders.

- **Zero External API Keys:** Runs 100% deterministically against public-domain government APIs and RFC protocols.
- **Dual Mode:** Call live over MCP (`Streamable HTTP`) from Claude, Cursor, Windsurf, VS Code, or Google Antigravity, OR run batch jobs on [Apify Store](https://apify.com/desastreger/cross-border-tariff-eu-trade-mcp).

---

## MCP Tool Schemas

### `lookup_us_hts_tariff`

Look up official US Harmonized Tariff Schedule (HTS) duty rates from USITC, deterministically compute base ad-valorem USD duty estimates for a shipment value, inherit 8-digit parent rates on statistical subheadings, and flag Chapter 99 / Section 301 trade-remedy footnotes.

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `htsKeywords` | `array` | Product keywords or 4-10 digit HTS code prefixes (e.g., ["lithium ion"], ["8507.60"], ["semiconductor"]). |
| `keyword` | `string` | Optional single keyword or HTS code query (alias merged with htsKeywords). |
| `shipmentValueUsd` | `number` | Customs shipment value in USD for deterministic ad-valorem duty calculation. Default: 10000. |
| `maxResults` | `integer` | Maximum HTS tariff records to return (1-50 in MCP mode). Default: 10. |

### `verify_eu_vat_numbers`

Verify European Union corporate VAT numbers in real time via the official European Commission VIES REST API, returning legal entity names, registered addresses, and member-state availability status.

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `euVatNumbers` | `array` | EU VAT numbers including 2-letter country prefix (e.g., ["IE6388047V", "DE123456789"]). |
| `vatNumber` | `string` | Optional single EU VAT number string (alias merged with euVatNumbers). |
| `maxResults` | `integer` | Maximum VAT verification records to return (1-50 in MCP mode). Default: 10. |

### `search_eu_ted_tenders`

Search European public procurement tenders and contract notices from the official EU Tenders Electronic Daily (TED) Open API v3 by keywords, 8-digit CPV codes, and 3-letter ISO country codes.

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `tedKeywords` | `array` | Keywords (e.g., ["cybersecurity", "cloud"]) or 8-digit CPV codes (e.g., ["72000000"]). |
| `keyword` | `string` | Optional single keyword or CPV code string (alias merged with tedKeywords). |
| `tedCountries` | `array` | Optional 3-letter ISO country codes (e.g., ["DEU", "FRA", "IRL", "NLD"]). |
| `maxResults` | `integer` | Maximum EU tender notices to return (1-50 in MCP mode). Default: 10. |

---

## Sample Output JSON

```json
{
  "recordType": "US_HTS_TARIFF",
  "identifier": "8507.60.00",
  "jurisdiction": "US",
  "titleOrEntity": "Lithium-ion batteries",
  "statusOrRate": "3.4%",
  "estimatedDutyOrValueUsd": 340,
  "hasTradeRemedyOrRiskFlag": false,
  "officialSourceUrl": "https://hts.usitc.gov/search?query=8507.60.00"
}
```

---

## Quickstart

### Option 1: 1-Click Browser OAuth (Zero API Key Setup)

Connect directly via Apify's managed OAuth MCP gateway — your AI client opens a browser login once and requires **no manual `APIFY_TOKEN`** in config files:

```bash
# Claude Code CLI (1-Click OAuth)
claude mcp add --transport http cross-border-tariff-eu-trade-mcp "https://mcp.apify.com/?tools=desastreger/cross-border-tariff-eu-trade-mcp"
```

**Claude Desktop / Cursor / Windsurf / Google Antigravity (`mcp_config.json`):**
```json
{
  "mcpServers": {
    "cross-border-tariff-eu-trade-mcp": {
      "url": "https://mcp.apify.com/?tools=desastreger/cross-border-tariff-eu-trade-mcp"
    }
  }
}
```

**VS Code Copilot (`.vscode/mcp.json`):**
```json
{
  "servers": {
    "cross-border-tariff-eu-trade-mcp": {
      "type": "http",
      "url": "https://mcp.apify.com/?tools=desastreger/cross-border-tariff-eu-trade-mcp"
    }
  }
}
```

### Option 2: Direct Standby Streamable HTTP (`Bearer $APIFY_TOKEN`)

For headless automation, CI/CD, or direct token-authenticated clients:

```json
{
  "mcpServers": {
    "cross-border-tariff-eu-trade-mcp": {
      "url": "https://desastreger--cross-border-tariff-eu-trade-mcp.apify.actor/mcp",
      "headers": {
        "Authorization": "Bearer <YOUR_APIFY_TOKEN>"
      }
    }
  }
}
```

### cURL (`tools/call`)

```bash
curl -sS -X POST "https://desastreger--cross-border-tariff-eu-trade-mcp.apify.actor/mcp" \
  -H "Authorization: Bearer <YOUR_APIFY_TOKEN>" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"lookup_us_hts_tariff","arguments":{"mode":"all","htsKeywords":["lithium ion"],"shipmentValueUsd":10000,"euVatNumbers":["IE6388047V"],"tedKeywords":["cybersecurity"],"maxResults":5}}}'
```

### JavaScript (`apify-client`)

```js
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: process.env.APIFY_TOKEN });
const run = await client.actor('desastreger/cross-border-tariff-eu-trade-mcp').call({
  "mode": "all",
  "htsKeywords": [
    "lithium ion"
  ],
  "shipmentValueUsd": 10000,
  "euVatNumbers": [
    "IE6388047V"
  ],
  "tedKeywords": [
    "cybersecurity"
  ],
  "maxResults": 5
});
const { items } = await client.dataset(run.defaultDatasetId).listItems();
console.log(items);
```

### Python (`apify-client`)

```python
import os
from apify_client import ApifyClient

client = ApifyClient(os.environ["APIFY_TOKEN"])
run = client.actor("desastreger/cross-border-tariff-eu-trade-mcp").call(run_input={"mode":"all","htsKeywords":["lithium ion"],"shipmentValueUsd":10000,"euVatNumbers":["IE6388047V"],"tedKeywords":["cybersecurity"],"maxResults":5})
print(client.dataset(run["defaultDatasetId"]).list_items().items)
```

---

[← Back to All 10 Open Data MCP Servers](../../README.md) · [Open on Apify Store →](https://apify.com/desastreger/cross-border-tariff-eu-trade-mcp)
