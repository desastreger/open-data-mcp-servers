---
name: us-healthcare-practice-owners
description: "Discover verified US dental, medspa, dermatology, physical therapy, optometry, chiropractic, and specialty medical practice owners (Authorized Officials), clinician credentials, direct phone numbers, and private-vs-DSO ownership scores from CMS NPPES v2.1. Activate when the user asks to 'find dental practice owners in Texas', 'list independent medspa or dermatology clinic owners', 'enrich healthcare practices by NPI', or 'pull private clinic decision-makers for medical SaaS or DSO M&A outreach'."
summary: "Extract verified US dental, medspa, dermatology, PT, optometry, and clinic Authorized Officials (owners/presidents), credentials, direct phone numbers, ownership types, and B2B lead scores from official CMS NPPES v2.1 via remote Streamable HTTP MCP."
version: "1.0.0"
tags:
  - healthcare-leads
  - nppes-npi
  - dental-practices
  - medspa-leads
  - clinic-owners
  - b2b-prospecting
  - dso-rollup
  - medical-sales
  - mcp-server
keywords:
  - CMS NPPES NPI Registry API
  - healthcare practice owners
  - dental practice Authorized Official
  - independent private practice leads
  - medspa dermatology clinic owners
  - NPI-2 organization lookup
  - medical device B2B sales leads
  - DSO M&A acquisition targets
  - clinician-owned practice filter
use_cases:
  - Build outbound call and mail lists of clinician-owned dental, orthodontics, and medspa practice presidents with direct executive phone numbers
  - Source independent private medical and physical therapy clinics for DSO and healthcare private equity M&A roll-up pipelines
  - Segment specialty clinics by official CMS taxonomy codes for medical device, diagnostic lab, and healthcare SaaS territory planning
  - Enrich existing CRM healthcare account tables by 10-digit National Provider Identifier (NPI) with legal names, DBAs, and Authorized Officials
  - Filter out national pharmacy, hospital, and corporate DSO chains before routing verified clinic leads to SDR sequences
docs_url: "https://github.com/desastreger/open-data-mcp-servers"
---

# US Healthcare & Dental Practice Owners (CMS NPPES v2.1)

Query official US Department of Health & Human Services (HHS) / CMS National Plan and Provider Enumeration System (`NPPES v2.1`) `NPI-2` organization records to identify clinic Authorized Officials (owners, presidents, managing partners), clinician credentials (`DDS`, `DMD`, `MD`, `DO`, `PT`, `DC`, `OD`), direct phone lines, corporate-vs-private ownership classifications, and deterministic `0–100` B2B lead scores.

## When to Use This Skill

**Activate this skill when the user wants to:**
- Find owners, presidents, or managing clinicians of US dental, orthodontics, dermatology, plastic surgery/medspa, physical therapy, chiropractic, optometry, behavioral health, urgent care, ambulatory surgery, home health, or pharmacy practices.
- Filter out corporate healthcare chains and Dental Support Organizations (e.g., Aspen Dental, Heartland, CVS, Walgreens, HCA) to isolate independent clinician-owned private practices.
- Look up or enrich a specific healthcare organization using its 10-digit National Provider Identifier (`NPI`).
- Prioritize clinic outreach using distinct executive phone numbers (`hasDistinctOfficialPhone`) and `HOT` / `WARM` lead tiers.

**Do NOT use this skill when:**
- Searching for individual clinicians (`NPI-1` sole practitioners without an organizational practice entity) or international non-US medical providers.
- Seeking patient health records, Medicare claims volume, or protected health information (`PHI` — NPPES contains zero patient data).
- Looking for academic biomedical clinical trial investigators or PubMed research authors (use `openalex-pubmed-expert-finder-mcp` instead).

## Connect the Remote MCP Server

### Option 1: 1-Click Browser OAuth (Zero API Key Setup — Recommended)

Connect directly via Apify's managed OAuth gateway (`https://mcp.apify.com/?tools=desastreger/us-healthcare-practice-owners`) — Claude Code, Cursor, Claude Desktop, Windsurf, VS Code, and Google Antigravity sign in via browser OAuth with **zero manual `APIFY_TOKEN`** needed:

- **1-Click OAuth MCP URL:** `https://mcp.apify.com/?tools=desastreger/us-healthcare-practice-owners`
- **Apify Store Page:** `https://apify.com/desastreger/us-healthcare-practice-owners`

#### Claude Code CLI (OAuth)
```bash
claude mcp add --transport http us-healthcare-practice-owners "https://mcp.apify.com/?tools=desastreger/us-healthcare-practice-owners"
```

#### Cursor / Claude Desktop / Windsurf / Google Antigravity (OAuth `mcp.json`)
```json
{
  "mcpServers": {
    "us-healthcare-practice-owners": {
      "url": "https://mcp.apify.com/?tools=desastreger/us-healthcare-practice-owners"
    }
  }
}
```

#### VS Code Copilot (`.vscode/mcp.json`)
```json
{
  "servers": {
    "us-healthcare-practice-owners": {
      "type": "http",
      "url": "https://mcp.apify.com/?tools=desastreger/us-healthcare-practice-owners"
    }
  }
}
```

### Option 2: Direct Standby Streamable HTTP (`Bearer $APIFY_TOKEN`)

For headless scripts, CI pipelines, or direct Standby authentication:

- **Standby MCP Endpoint:** `https://desastreger--us-healthcare-practice-owners.apify.actor/mcp`
- **Auth Header:** `Authorization: Bearer $APIFY_TOKEN`

```bash
claude mcp add --transport http us-healthcare-practice-owners \
  https://desastreger--us-healthcare-practice-owners.apify.actor/mcp \
  --header "Authorization: Bearer $APIFY_TOKEN"
```

```json
{
  "mcpServers": {
    "us-healthcare-practice-owners": {
      "url": "https://desastreger--us-healthcare-practice-owners.apify.actor/mcp",
      "headers": {
        "Authorization": "Bearer <YOUR_APIFY_TOKEN>"
      }
    }
  }
}
```

### Apify REST API Fallback (cURL / Scripts / Clay / n8n)
When MCP transport is unavailable or batching up to `500` leads synchronously in a script:
```bash
curl -sS -X POST "https://api.apify.com/v2/acts/desastreger~us-healthcare-practice-owners/run-sync-get-dataset-items" \
  -H "Authorization: Bearer $APIFY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "specialty": "dentist",
    "states": ["TX"],
    "city": "Austin",
    "requireAuthorizedOfficial": true,
    "independentPracticesOnly": true,
    "maxResults": 25
  }'
```

## MCP Tools & Parameter Selection

| MCP Tool | Purpose | Key Arguments & Defaults |
| :--- | :--- | :--- |
| `search_healthcare_practice_owners` | Discover US `NPI-2` healthcare practice organizations by specialty, geography, and ownership filters. | `specialty` (`"dentist"` default; 12 presets or `"custom"`), `customTaxonomy` (string when `specialty="custom"`), `states` (`["TX"]` default, 2-letter codes), `city` (optional), `postalCode` (5-digit ZIP or wildcard like `"752*"`), `requireAuthorizedOfficial` (`true`), `independentPracticesOnly` (`false`), `maxResults` (`10` default, `1–100` in MCP; up to `500` via REST). |
| `lookup_practice_by_npi` | Retrieve and score one healthcare organization by its exact 10-digit NPI. | `npi` (required 10-digit string, e.g., `"1043458821"`). |

### Parameter Selection Rules
1. **Specialty Mapping:** Prefer built-in `specialty` enum presets (`dentist`, `orthodontics`, `dermatology`, `physical_therapy`, `chiropractic`, `optometry`, `mental_health`, `urgent_care`, `ambulatory_surgery`, `home_health`, `pharmacy`, `plastic_surgery`). Use `specialty: "custom"` + `customTaxonomy` (e.g., `"Podiatrist"`, `"Ophthalmology"`, `"Oral & Maxillofacial"`) for unlisted niches.
2. **Private Practice Isolation:** Always set `independentPracticesOnly: true` and `requireAuthorizedOfficial: true` when prospecting for SMB medical SaaS, broker financing, or DSO M&A roll-ups.
3. **Granular Territory Slicing:** Combine `states` with `city` or wildcard `postalCode` prefixes (e.g., `"331*"` for Miami-Dade) to avoid broad state-level pagination when targeting dense metros.

### Canonical MCP Tool Call Payloads

**Discovery Search (`search_healthcare_practice_owners`):**
```json
{
  "specialty": "dentist",
  "states": ["TX", "FL"],
  "postalCode": "752*",
  "requireAuthorizedOfficial": true,
  "independentPracticesOnly": true,
  "maxResults": 25
}
```

**Single-Clinic NPI Verification (`lookup_practice_by_npi`):**
```json
{
  "npi": "1043458821"
}
```

### Interpreting Ownership & Lead Scoring Signals

| Output Field | High-Signal Values | Actionable B2B Interpretation |
| :--- | :--- | :--- |
| `ownershipType` | `CLINICIAN_OWNED_PRIVATE_PRACTICE` | Credentialed clinician (`DDS`, `DMD`, `MD`, `DO`, `PT`, `DC`, `OD`) serves as Authorized Official with low location count and no corporate DSO/hospital parent. |
| `hasDistinctOfficialPhone` | `true` | `authorizedOfficialPhone` differs from reception `practicePhone` — route to direct executive cold-call queues first. |
| `leadScore` / `leadTier` | `80–100` (`HOT`), `60–79` (`WARM`) | Combines active NPI status (`npiStatus: "A"`), named executive, clinical credential, distinct official phone, private ownership, and CMS update recency. |
| `secondaryLocationCount` | `0` to `2` | Indicates single-office or boutique multi-site private group rather than a regional corporate roll-up. |

See [references/schema-and-examples.md](references/schema-and-examples.md) for the complete parameter reference, sample JSON record, and B2B query recipes.

## Execution Workflow

Follow this deterministic 4-step workflow on every invocation:

1. **Scoping & Cost-Aware Sizing:** Confirm target specialty, US state/city/ZIP scope, and whether corporate groups should be excluded. Start interactive discovery calls with `maxResults: 10` to `25` (`$0.005–$0.0125` at launch pricing) before scaling to larger territory pulls.
2. **Tool Call & Filtering:** Invoke `lookup_practice_by_npi` when given specific 10-digit NPIs; otherwise invoke `search_healthcare_practice_owners` with normalized 2-letter uppercase `states`, `requireAuthorizedOfficial: true`, and `independentPracticesOnly: true` (unless corporate groups are explicitly requested).
3. **Cross-Field Normalization & Ranking:** Sort returned practices by `leadScore` descending. Highlight clinics where `ownershipType === "CLINICIAN_OWNED_PRIVATE_PRACTICE"` and `hasDistinctOfficialPhone === true` (indicating the Authorized Official's phone differs from the front-desk reception `practicePhone`).
4. **Structured Deliverable Output:** Format results using [templates/report-template.md](templates/report-template.md), including executive summary counts, a ranked Markdown lead table citing each `npi` and `nppesProfileUrl`, and concrete outreach next steps.

## Data Provenance & Safety Rules

- **Cite Official Primary Identifiers:** Always anchor every practice row to its 10-digit CMS `npi`, `primaryTaxonomyCode`, `lastUpdatedDate`, and official `nppesProfileUrl` (`https://npiregistry.cms.hhs.gov/provider-view/<npi>`).
- **Never Fabricate Contact Channels:** CMS NPPES provides verified `authorizedOfficialPhone`, `practicePhone`, `practiceFax`, and physical location addresses—it does **not** publish email addresses or clinic website domains. Never guess or hallucinate emails; recommend pairing clinic names/locations with domain lookup + `b2b-domain-mail-security-posture` when email infrastructure enrichment is needed.
- **Transparent Warnings & Budget Caps:** If an MCP response includes `budgetCapReached: true`, partial counts, or upstream `escalationWarnings`, report them transparently to the user rather than silently omitting records.

### High-Value Multi-Skill Chaining
- **Email & SaaS Stack Enrichment (`b2b-domain-mail-security-posture`):** Once clinic names and suite addresses are matched to website domains, audit those domains to detect `Google Workspace` vs `Microsoft 365`, `HubSpot`/`Salesforce` usage, and DMARC posture before cold outreach.
- **Corporate Roll-Up KYB (`us-kyb-compliance-dossier`):** When evaluating multi-location healthcare groups (`CORPORATE_OR_DSO_GROUP`), cross-screen parent entities across GLEIF LEI, SEC EDGAR, FDA recalls, and federal Medicare/VA contracts.
- **Biomedical Clinical Trial Crossover (`openalex-pubmed-expert-finder-mcp`):** For specialty dermatology, oncology, or ophthalmology clinics running sponsored clinical trials, cross-check `NPI-2` practice owners against active ClinicalTrials.gov Principal Investigators.
