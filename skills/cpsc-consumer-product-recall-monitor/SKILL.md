---
name: cpsc-consumer-product-recall-monitor
description: "Monitor official US CPSC consumer product recalls, NHTSA vehicle/equipment recalls, and openFDA food & drug enforcement recalls with UPCs, retailers (Amazon, Walmart, Target, Costco), park-outside flags, and 0-100 severity scores. Activate when the user asks to 'check CPSC product recalls', 'screen Amazon or Walmart recalled products', 'look up NHTSA vehicle recalls', or 'search FDA food or drug recalls'."
summary: "Monitor US CPSC product, NHTSA vehicle, and openFDA food/drug recalls with UPCs, retailers, park-outside flags, and 0-100 severity scores via remote MCP."
version: "1.0.0"
tags:
  - product-recalls
  - cpsc
  - nhtsa
  - openfda
  - supply-chain-compliance
  - ecommerce-safety
  - legal-tech
  - mcp-server
keywords:
  - CPSC SaferProducts recall API
  - NHTSA vehicle recall lookup
  - openFDA food drug enforcement recalls
  - Amazon Walmart product recall monitor
  - UPC recall compliance checker
  - park outside do not drive recall
  - product liability risk intelligence
use_cases:
  - Screen CPSC consumer product recalls by retailer (Amazon, Walmart, Target, Costco) and extract UPCs/models for marketplace trust & safety
  - Check NHTSA vehicle and equipment recalls by make/model/year or campaign number for DO_NOT_DRIVE and PARK_OUTSIDE fire advisories
  - Search openFDA Class I, II, and III food and drug enforcement recalls by allergen, pathogen, lot code, or distribution pattern
  - Prioritize recall triage using deterministic 0-100 recallSeverityScore and CRITICAL / HIGH / MODERATE / LOW tiers
docs_url: "https://github.com/desastreger/open-data-mcp-servers"
---

# US Product, Vehicle, Food & Drug Recalls Monitor

Monitor official US federal recalls across three zero-API-key government registries: **CPSC SaferProducts (`saferproducts.gov`)**, **NHTSA Recalls (`api.nhtsa.gov`)**, and **openFDA Food & Drug Enforcement (`api.fda.gov`)**. Returns unified records with `upcsOrCodes`, `retailersSoldAt`, `hazardSummary`, `injuriesOrIncidents`, `classificationOrParkOutside`, `remedySummary`, and deterministic `0–100` `recallSeverityScore`.

## When to Use This Skill

**Activate this skill when the user wants to:**
- Search recent CPSC consumer product recalls by keyword (`query`), marketplace/retailer (`retailer`), or lookback window (`daysBack`).
- Check NHTSA vehicle or equipment recalls by `make`, `model`, `modelYear`, or `campaignNumber` (including `DO_NOT_DRIVE` and `PARK_OUTSIDE` flags).
- Screen openFDA Food or Drug Enforcement recalls (`Class I`, `Class II`, `Class III`) for allergens, contamination, or lot/NDC codes.

**Do NOT use this skill when:**
- Tracking FDA 510(k) or PMA medical device premarket clearances (use `fda-medtech-510k-approval-tracker`).
- Monitoring newly published Federal Register rules or Executive Orders (use `federal-register-regulatory-rule-radar`).

## Connect the Remote MCP Server

This skill connects to the live Apify Standby Streamable HTTP MCP server (`$0.50 / 1,000 records` launch pay-per-event rate; zero upstream government API keys required).

### Option 1: 1-Click OAuth MCP (Zero API Key Setup — Recommended)

- **1-Click OAuth MCP Endpoint:** `https://mcp.apify.com/?tools=desastreger/cpsc-consumer-product-recall-monitor`

```bash
claude mcp add --transport http cpsc-consumer-product-recall-monitor "https://mcp.apify.com/?tools=desastreger/cpsc-consumer-product-recall-monitor"
```

```json
{
  "mcpServers": {
    "cpsc-consumer-product-recall-monitor": {
      "url": "https://mcp.apify.com/?tools=desastreger/cpsc-consumer-product-recall-monitor"
    }
  }
}
```

### Option 2: Direct Standby MCP (Bearer Token for Headless / CI Agents)

- **Direct Standby Streamable HTTP Endpoint:** `https://desastreger--cpsc-consumer-product-recall-monitor.apify.actor/mcp`
- **Authentication Header:** `Authorization: Bearer $APIFY_TOKEN`

```json
{
  "mcpServers": {
    "cpsc-consumer-product-recall-monitor": {
      "url": "https://desastreger--cpsc-consumer-product-recall-monitor.apify.actor/mcp",
      "headers": {
        "Authorization": "Bearer <YOUR_APIFY_TOKEN>"
      }
    }
  }
}
```

### Apify REST API Fallback (cURL)

```bash
curl -sS -X POST "https://api.apify.com/v2/acts/desastreger~cpsc-consumer-product-recall-monitor/run-sync-get-dataset-items" \
  -H "Authorization: Bearer $APIFY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "sources": ["cpsc", "fda_food"],
    "daysBack": 30,
    "maxResults": 10
  }'
```

## MCP Tools & Parameter Selection

All tools are read-only (`readOnlyHint: true`):

| MCP Tool | Purpose | Key Arguments & Defaults |
| :--- | :--- | :--- |
| `search_cpsc_product_recalls` | Search CPSC SaferProducts consumer product recalls by keyword, retailer, and severity. | `query`, `retailer` (e.g., `"Amazon"`, `"Walmart"`), `daysBack` (`30` default), `minSeverityScore` (`0`), `maxResults` (`10` default, `1–50`). |
| `check_nhtsa_vehicle_recalls` | Check NHTSA vehicle & equipment recalls by vehicle or campaign number. | `make`, `model`, `modelYear`, OR `campaignNumber` (e.g., `"23V432000"`), `maxResults` (`10` default, `1–50`). |
| `search_fda_enforcement_recalls` | Search openFDA Food & Drug Enforcement recalls (Class I / II / III). | `productType` (`"food" \| "drug" \| "both"`), `query`, `retailer`, `classification` (`"Class I" \| "Class II" \| "Class III"`), `daysBack` (`30`), `maxResults` (`10` default, `1–50`). |

### Parameter Selection Rules
1. **Marketplace Trust & Safety:** Call `search_cpsc_product_recalls` with `retailer: "Amazon"` (or `"Walmart"`, `"Target"`, `"Costco"`) and `daysBack: 30` to keep payloads fast (<300KB).
2. **Fleet / Automotive Safety:** Call `check_nhtsa_vehicle_recalls` with `make`, `model`, and `modelYear` (or `campaignNumber`) and inspect `classificationOrParkOutside` for `DO_NOT_DRIVE` or `PARK_OUTSIDE`.
3. **Food & Pharma Screening:** Call `search_fda_enforcement_recalls` with `classification: "Class I"` for highest-risk pathogen, allergen, or drug recalls.

## Execution Workflow

1. **Select Target Agency Tool:** Route consumer goods to `search_cpsc_product_recalls`, vehicles/equipment to `check_nhtsa_vehicle_recalls`, and food/pharma to `search_fda_enforcement_recalls`.
2. **Triage by `severityTier` & `recallSeverityScore`:** Escalate `CRITICAL` (`>= 75`) and `HIGH` (`55–74`) recalls immediately, especially `DO_NOT_DRIVE`, `PARK_OUTSIDE`, `Class I`, or mandatory toy/battery standard violations.
3. **Cite Identifiers & Remedies:** Always report `agency`, `recallId`, `recallDate`, `upcsOrCodes`, `retailersSoldAt`, `remedySummary`, and official `sourceUrl`.
