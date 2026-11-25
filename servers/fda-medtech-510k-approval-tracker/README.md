<img src="../../icons/fda-medtech-510k-approval-tracker.svg" width="72" height="72" align="right" alt="fda-medtech-510k-approval-tracker icon" />

# FDA 510(k) & PMA Medical Device Clearances Scraper

**Category:** MedTech Regulatory & Device Clearances  
**Apify Store:** [https://apify.com/desastreger/fda-medtech-510k-approval-tracker](https://apify.com/desastreger/fda-medtech-510k-approval-tracker)  
**1-Click OAuth MCP (Zero API Key):** `https://mcp.apify.com/?tools=desastreger/fda-medtech-510k-approval-tracker`  
**Direct Standby MCP (Bearer Token):** `https://desastreger--fda-medtech-510k-approval-tracker.apify.actor/mcp`  
**Official Data Sources:** US FDA openFDA Device REST APIs (`/device/510k.json`, `/device/pma.json`, `/device/enforcement.json`)

> [!IMPORTANT]
> **Early-Adopter Launch Pricing:** **$0.80 / 1k records** (`$0.0008`/record) — promotional launch pricing for early Store adopters & MCP integrations.

## Overview

Track newly cleared **US FDA 510(k) Premarket Notifications** and **Premarket Approvals (PMA)** directly from official **openFDA Device REST APIs**. Extracts normalized regulatory metadata, **direct applicant contact names** (`contactName`), full mailing addresses, FDA `productCode`, `deviceClass`, official CDRH summary URLs, and **openFDA device recall history** (`recentRecallCount` & latest `Class I/II/III` classification).

- **Zero External API Keys:** Runs 100% deterministically against public-domain US FDA APIs (`17 U.S.C. § 105`).
- **Dual Mode:** Call live over MCP (`Streamable HTTP`) from Claude, Cursor, Windsurf, VS Code, or Google Antigravity, OR run batch jobs on [Apify Store](https://apify.com/desastreger/fda-medtech-510k-approval-tracker).

---

## MCP Tool Schemas

### `search_fda_device_clearances`

Search newly cleared FDA 510(k) and Premarket Approval (PMA) medical devices via official openFDA APIs, returning normalized device names, direct applicant contacts, mailing addresses, product codes, device classes, FDA summary URLs, and optional recall history.

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `daysBack` | `integer` | Number of past days of FDA `decision_date` records to scan (1-3650). Default: 90. |
| `submissionType` | `string` | Filter by FDA pathway: `"all"`, `"510k"`, or `"pma"`. Default: `"all"`. |
| `applicantQuery` | `string` | Optional MedTech company/applicant name filter (e.g., `"Boston Scientific"`, `"Medtronic"`). |
| `deviceKeyword` | `string` | Optional keyword across `device_name`, `trade_name`, or `generic_name` (e.g., `"catheter"`, `"MRI"`). |
| `medicalSpecialty` | `string` | Optional FDA advisory committee / medical specialty (e.g., `"Cardiovascular"`, `"Orthopedic"`, `"Radiology"`). |
| `countryCode` | `string` | Optional 2-letter ISO country code filter (e.g., `"US"`, `"DE"`). |
| `includeRecallHistory` | `boolean` | Enrich each clearance with applicant recall count and latest Class I/II/III recall status. Default: true. |
| `maxResults` | `integer` | Maximum clearance leads to return (1-50 in MCP mode). Default: 10. |

### `get_medtech_applicant_dossier`

Build a 360-degree FDA regulatory dossier for a specific MedTech manufacturer/applicant, combining recent 510(k) clearances, PMA approvals/supplements, and full openFDA device recall/enforcement history.

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `applicantName` | `string` **(required)** | MedTech manufacturer or applicant name (e.g., `"Boston Scientific"`, `"Stryker"`, `"Medtronic"`). |
| `daysBack` | `integer` | Historical `decision_date` lookback in days (1-3650). Default: 365. |
| `submissionType` | `string` | Filter clearances by `"all"`, `"510k"`, or `"pma"`. Default: `"all"`. |
| `maxResults` | `integer` | Maximum clearance records to return in the dossier (1-50). Default: 15. |

### `lookup_fda_clearance_by_id`

Look up a specific FDA 510(k) K-number (e.g., `"K261026"`) or PMA ID (e.g., `"P900056"`) with direct applicant contact info and optional openFDA device recall history.

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `clearanceId` | `string` **(required)** | FDA 510(k) K-number (e.g., `"K261026"`) or PMA number (e.g., `"P900056"`). |
| `includeRecallHistory` | `boolean` | Include applicant openFDA device recall history. Default: true. |

---

## Sample Output JSON

```json
{
  "kNumberOrPmaId": "K261022",
  "submissionType": "510k",
  "deviceName": "Smart SedLine Sedation Monitor",
  "applicant": "Masimo Corporation",
  "contactName": "Gabriel Dilanji",
  "address": "52 Discovery, Irvine, CA 92618, US",
  "decisionDate": "2026-11-13",
  "advisoryCommittee": "Neurology",
  "productCode": "OLW",
  "deviceClass": "2",
  "fdaSummaryUrl": "https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfpmn/pmn.cfm?ID=K261022",
  "recentRecallCount": 13,
  "latestRecallClassification": "Class II",
  "leadScore": 90
}
```

---

## Quickstart

### Option 1: 1-Click Browser OAuth (Zero API Key Setup)

Connect directly via Apify's managed OAuth MCP gateway — your AI client opens a browser login once and requires **no manual `APIFY_TOKEN`** in config files:

```bash
# Claude Code CLI (1-Click OAuth)
claude mcp add --transport http fda-medtech-510k-approval-tracker "https://mcp.apify.com/?tools=desastreger/fda-medtech-510k-approval-tracker"
```

**Claude Desktop / Cursor / Windsurf / Google Antigravity (`mcp_config.json`):**
```json
{
  "mcpServers": {
    "fda-medtech-510k-approval-tracker": {
      "url": "https://mcp.apify.com/?tools=desastreger/fda-medtech-510k-approval-tracker"
    }
  }
}
```

**VS Code Copilot (`.vscode/mcp.json`):**
```json
{
  "servers": {
    "fda-medtech-510k-approval-tracker": {
      "type": "http",
      "url": "https://mcp.apify.com/?tools=desastreger/fda-medtech-510k-approval-tracker"
    }
  }
}
```

### Option 2: Direct Standby Streamable HTTP (`Bearer $APIFY_TOKEN`)

For headless automation, CI/CD, or direct token-authenticated clients:

```json
{
  "mcpServers": {
    "fda-medtech-510k-approval-tracker": {
      "url": "https://desastreger--fda-medtech-510k-approval-tracker.apify.actor/mcp",
      "headers": {
        "Authorization": "Bearer <YOUR_APIFY_TOKEN>"
      }
    }
  }
}
```

### cURL (`tools/call`)

```bash
curl -sS -X POST "https://desastreger--fda-medtech-510k-approval-tracker.apify.actor/mcp" \
  -H "Authorization: Bearer <YOUR_APIFY_TOKEN>" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"search_fda_device_clearances","arguments":{"daysBack":90,"submissionType":"all","medicalSpecialty":"Cardiovascular","maxResults":5}}}'
```

### JavaScript (`apify-client`)

```js
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: process.env.APIFY_TOKEN });
const run = await client.actor('desastreger/fda-medtech-510k-approval-tracker').call({
  daysBack: 90,
  submissionType: 'all',
  medicalSpecialty: 'Cardiovascular',
  includeRecallHistory: true,
  maxResults: 25,
});
const { items } = await client.dataset(run.defaultDatasetId).listItems();
console.log(items);
```

### Python (`apify-client`)

```python
import os
from apify_client import ApifyClient

client = ApifyClient(os.environ["APIFY_TOKEN"])
run = client.actor("desastreger/fda-medtech-510k-approval-tracker").call(
    run_input={"daysBack": 90, "submissionType": "510k", "countryCode": "US", "maxResults": 25}
)
print(client.dataset(run["defaultDatasetId"]).list_items().items)
```

---

[← Back to All 12 Open Data MCP Servers](../../README.md) · [Open on Apify Store →](https://apify.com/desastreger/fda-medtech-510k-approval-tracker)
