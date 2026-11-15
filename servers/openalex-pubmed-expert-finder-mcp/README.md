<img src="../../icons/openalex-pubmed-expert-finder-mcp.svg" width="72" height="72" align="right" alt="openalex-pubmed-expert-finder-mcp icon" />

# Clinical Trials & PubMed Scraper — PI Emails ($0.50/1k)

**Category:** Biotech, Life Sciences & R&D  
**Apify Store:** [https://apify.com/desastreger/openalex-pubmed-expert-finder-mcp](https://apify.com/desastreger/openalex-pubmed-expert-finder-mcp)  
**Remote MCP Endpoint (Streamable HTTP):** `https://desastreger--openalex-pubmed-expert-finder-mcp.apify.actor/mcp`  
**Official Data Sources:** NIH ClinicalTrials.gov REST API v2, EMBL-EBI Europe PMC / PubMed

> [!IMPORTANT]
> **Early-Adopter Launch Pricing:** **$0.50 / 1k records** (`$0.0005`/record) — promotional launch pricing while early adopters onboard. Scheduled to step up to our standard **$1.50 / 1k records** (`$0.0015`/record) rate after the launch window, still **75%–95% cheaper** than comparable Store scrapers.

## Overview

Combine NIH ClinicalTrials.gov API v2 and EMBL-EBI Europe PMC / PubMed to extract recruiting clinical trial Principal Investigators, direct unmasked contact emails & phones, pharma/academic sponsors, citations, and NIH grant IDs.

- **Zero External API Keys:** Runs 100% deterministically against public-domain government APIs and RFC protocols.
- **Dual Mode:** Call live over MCP (`Streamable HTTP`) from Claude, Cursor, Windsurf, VS Code, or Google Antigravity, OR run batch jobs on [Apify Store](https://apify.com/desastreger/openalex-pubmed-expert-finder-mcp).

---

## MCP Tool Schemas

### `find_clinical_trial_investigators`

Find active Recruiting and upcoming clinical trial Principal Investigators, direct Central Contacts (unmasked emails and phone numbers), biotech/pharma vs academic sponsors, trial phases, and clinical sites via official NIH ClinicalTrials.gov REST API v2.

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `query` | `string` | Therapeutic area, biomarker, disease, or modality keyword (e.g., "CAR-T immunotherapy", "CRISPR", "KRAS G12C"). |
| `trialStatuses` | `array` | ClinicalTrials.gov v2 recruitment statuses (e.g., ["RECRUITING", "NOT_YET_RECRUITING"]). |
| `requireDirectContact` | `boolean` | When true, only return trials exposing a direct unmasked contact email or phone number. |
| `maxResults` | `integer` | Maximum trial investigator leads to return (1-50 in MCP mode). Default: 10. |

### `search_pubmed_kol_experts`

Search peer-reviewed biomedical Key Opinion Leaders (KOLs) and Principal Investigators from official PubMed / EMBL-EBI Europe PMC APIs, extracting institutional affiliations, corresponding emails, citation counts, NIH/research grant IDs, ORCIDs, and open-access links.

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `query` | `string` | Biomedical topic, disease, target, or R&D technology query (e.g., "CAR-T immunotherapy", "GLP-1 obesity"). |
| `minCitations` | `integer` | Minimum citation count filter for KOL publications. Default: 0. |
| `maxResults` | `integer` | Maximum PubMed KOL leads to return (1-50 in MCP mode). Default: 10. |

---

## Sample Output JSON

```json
{
  "recordType": "CLINICAL_TRIAL_INVESTIGATOR",
  "identifier": "NCT05225363",
  "expertOrContactName": "Lorna Rodriguez",
  "roleOrPosition": "PRINCIPAL_INVESTIGATOR",
  "organizationOrAffiliation": "City of Hope Medical Center",
  "contactEmail": "lorrodriguez@coh.org",
  "contactPhone": "626-359-8111",
  "statusOrYear": "RECRUITING",
  "leadScore": 96,
  "leadTier": "HOT"
}
```

---

## Quickstart

### Add to `mcp_config.json`

```json
{
  "mcpServers": {
    "openalex-pubmed-expert-finder-mcp": {
      "url": "https://desastreger--openalex-pubmed-expert-finder-mcp.apify.actor/mcp",
      "headers": {
        "Authorization": "Bearer <YOUR_APIFY_TOKEN>"
      }
    }
  }
}
```

### cURL (`tools/call`)

```bash
curl -sS -X POST "https://desastreger--openalex-pubmed-expert-finder-mcp.apify.actor/mcp" \
  -H "Authorization: Bearer <YOUR_APIFY_TOKEN>" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"find_clinical_trial_investigators","arguments":{"mode":"all","query":"CAR-T immunotherapy","trialStatuses":["RECRUITING"],"maxResults":5}}}'
```

### JavaScript (`apify-client`)

```js
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: process.env.APIFY_TOKEN });
const run = await client.actor('desastreger/openalex-pubmed-expert-finder-mcp').call({
  "mode": "all",
  "query": "CAR-T immunotherapy",
  "trialStatuses": [
    "RECRUITING"
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
run = client.actor("desastreger/openalex-pubmed-expert-finder-mcp").call(run_input={"mode":"all","query":"CAR-T immunotherapy","trialStatuses":["RECRUITING"],"maxResults":5})
print(client.dataset(run["defaultDatasetId"]).list_items().items)
```

---

[← Back to All 10 Open Data MCP Servers](../../README.md) · [Open on Apify Store →](https://apify.com/desastreger/openalex-pubmed-expert-finder-mcp)
