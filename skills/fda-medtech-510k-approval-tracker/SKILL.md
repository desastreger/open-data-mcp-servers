---
name: fda-medtech-510k-approval-tracker
description: "Track newly cleared US FDA 510(k) and Premarket Approval (PMA) medical devices via official openFDA APIs, extracting direct applicant contact names, mailing addresses, product codes, device classes, FDA summary URLs, and device recall history. Activate when the user asks to 'find newly cleared FDA 510k medical devices', 'track PMA approvals in cardiovascular or orthopedics', 'get MedTech regulatory contacts from FDA clearances', or 'check FDA device recall history for a medical device manufacturer'."
summary: "Track newly cleared FDA 510(k) & PMA medical devices with direct applicant contact names, addresses, product codes, device classes, and openFDA recall history via remote MCP."
version: "1.0.0"
tags:
  - fda-510k
  - fda-pma
  - medtech-leads
  - medical-devices
  - openfda
  - regulatory-intelligence
  - device-recalls
  - mcp-server
keywords:
  - FDA 510k clearance scraper
  - FDA PMA medical device approvals
  - openFDA device API MCP
  - MedTech regulatory contact leads
  - medical device recall history
  - CDRH 510k summary lookup
  - MedTech BD and CRO prospecting
use_cases:
  - Build weekly outbound lead lists of MedTech manufacturers with brand-new FDA 510(k) clearances and direct regulatory/executive contact names
  - Track Class III Premarket Approvals (PMA) and 30-day supplements for clinical CROs, quality consultants, and MedTech executive recruiters
  - Run 360-degree FDA regulatory and recall due diligence dossiers on specific medical device companies (Class I/II/III recall exposure)
  - Benchmark competitor predicate 510(k) clearances by medical specialty, FDA product code, or device keyword
docs_url: "https://github.com/desastreger/open-data-mcp-servers"
---

# FDA 510(k) & PMA Medical Device Clearances Tracker

Discover newly cleared **US FDA 510(k) Premarket Notifications** and **Premarket Approvals (PMA)** directly from official **openFDA Device REST APIs** (`api.fda.gov/device/510k.json`, `/device/pma.json`, and `/device/enforcement.json`). Extracts normalized regulatory metadata, **direct applicant contact names** (`contactName`), full mailing addresses, FDA `productCode`, `deviceClass`, official CDRH summary URLs, and **applicant recall history** (`recentRecallCount` & latest `Class I/II/III` classification).

## When to Use This Skill

**Activate this skill when the user wants to:**
- Find recently cleared FDA 510(k) or approved PMA medical devices across a date window (`daysBack`), medical specialty (`Cardiovascular`, `Orthopedic`, `Radiology`, `Neurology`), device keyword, or country (`US`, `DE`, `SE`, etc.).
- Obtain direct regulatory/executive `contactName` and mailing addresses for newly cleared MedTech companies.
- Audit a medical device manufacturer's recent clearances alongside its openFDA device recall history (`get_medtech_applicant_dossier`).
- Look up a specific 510(k) K-number (e.g., `K261026`) or PMA number (e.g., `P900056`).

**Do NOT use this skill when:**
- Searching for pharmaceutical NDA/ANDA drug approvals or clinical trial investigators (pair with `openalex-pubmed-expert-finder-mcp` for ClinicalTrials.gov PIs).
- Looking for corporate SEC Form D funding rounds or non-FDA corporate KYB filings (pair with `sec-form-d-funding-leads` or `us-kyb-compliance-dossier`).

## Connect the Remote MCP Server

This skill connects to the live Apify Standby Streamable HTTP MCP server (`$0.80 / 1,000 records` launch pay-per-event rate; zero external FDA API keys required).

### Option 1: 1-Click OAuth MCP (Zero API Key Setup — Recommended)

- **1-Click OAuth MCP Endpoint:** `https://mcp.apify.com/?tools=desastreger/fda-medtech-510k-approval-tracker`

```bash
claude mcp add --transport http fda-medtech-510k-approval-tracker "https://mcp.apify.com/?tools=desastreger/fda-medtech-510k-approval-tracker"
```

```json
{
  "mcpServers": {
    "fda-medtech-510k-approval-tracker": {
      "url": "https://mcp.apify.com/?tools=desastreger/fda-medtech-510k-approval-tracker"
    }
  }
}
```

### Option 2: Direct Standby MCP (Bearer Token for Headless / CI Agents)

- **Direct Standby Streamable HTTP Endpoint:** `https://desastreger--fda-medtech-510k-approval-tracker.apify.actor/mcp`
- **Authentication Header:** `Authorization: Bearer $APIFY_TOKEN`

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

### Apify REST API Fallback (cURL)

```bash
curl -sS -X POST "https://api.apify.com/v2/acts/desastreger~fda-medtech-510k-approval-tracker/run-sync-get-dataset-items" \
  -H "Authorization: Bearer $APIFY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "daysBack": 90,
    "submissionType": "all",
    "medicalSpecialty": "Cardiovascular",
    "countryCode": "US",
    "includeRecallHistory": true,
    "maxResults": 10
  }'
```

## MCP Tools & Parameter Selection

All tools are read-only (`readOnlyHint: true`):

| MCP Tool | Purpose | Key Arguments & Defaults |
| :--- | :--- | :--- |
| `search_fda_device_clearances` | Screen newly cleared 510(k) and PMA devices by recency, specialty, keyword, or country. | `daysBack` (`90` default), `submissionType` (`"all"`, `"510k"`, `"pma"`), `applicantQuery`, `deviceKeyword`, `medicalSpecialty`, `countryCode`, `includeRecallHistory` (`true`), `maxResults` (`10` default, `1–50`). |
| `get_medtech_applicant_dossier` | 360-degree MedTech regulatory & recall dossier for a named manufacturer. | `applicantName` (required), `daysBack` (`365` default), `submissionType` (`"all"`), `maxResults` (`15` default, `1–50`). |
| `lookup_fda_clearance_by_id` | Look up a single 510(k) K-number or PMA ID with recall enrichment. | `clearanceId` (required, e.g., `"K261026"`, `"P900056"`), `includeRecallHistory` (`true`). |

### Parameter Selection Rules
1. **Weekly openFDA Cadence:** openFDA refreshes device clearance batches weekly, so keep `daysBack >= 30` (`90` default) for reliable live discovery.
2. **Direct Contact Prospecting:** Use `submissionType: "510k"` when BD/recruiter workflows specifically require a named `contactName`, because 510(k) filings expose direct regulatory contacts while PMA filings do not.
3. **High-Complexity Class III / CRO Targeting:** Use `submissionType: "pma"` or `"all"` to capture Class III Premarket Approvals and manufacturing supplements.
4. **Large Batch Speed:** For sweeps > 30 records when recall metadata is not needed, set `includeRecallHistory: false` to avoid extra per-applicant enforcement lookups.

## Execution Workflow

1. **Scope Query:** Choose `search_fda_device_clearances` for discovery, `get_medtech_applicant_dossier` for single-company QA/M&A due diligence, or `lookup_fda_clearance_by_id` for a known K/PMA ID.
2. **Rank & Segment:** Sort returned leads by `leadScore` (`0–100`) and `decisionDate`, highlighting `contactName`, `deviceClass`, `recentRecallCount`, and `latestRecallClassification`.
3. **Cite Official Provenance:** Always include `kNumberOrPmaId` and official `fdaSummaryUrl` (`accessdata.fda.gov`), and never fabricate missing emails or phone numbers.
