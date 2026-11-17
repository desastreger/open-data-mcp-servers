---
name: openalex-pubmed-expert-finder-mcp
description: "Discover recruiting clinical trial Principal Investigators, direct unmasked trial emails and phones, biotech or academic sponsors, and cited PubMed / Europe PMC Key Opinion Leaders (KOLs) with ORCIDs and NIH grant IDs. Activate when the user asks to 'find Principal Investigators running recruiting CAR-T or GLP-1 clinical trials', 'get direct emails for clinical trial contacts', 'map PubMed KOL researchers by citation count and NIH grants', or 'source life-science R&D lab leads'."
summary: "Discover recruiting clinical trial Principal Investigators, direct unmasked trial emails and phones, pharma or academic sponsors, and cited PubMed KOL researchers with ORCIDs and NIH grant IDs from ClinicalTrials.gov v2 and Europe PMC via remote MCP."
version: "1.0.0"
tags:
  - clinical-trials
  - pubmed-kol
  - principal-investigators
  - biotech-leads
  - pharma-sponsors
  - nih-grants
  - life-sciences-sales
  - medical-affairs
  - mcp-server
keywords:
  - ClinicalTrials.gov API v2 scraper
  - Principal Investigator emails
  - PubMed KOL finder API
  - Europe PMC researcher citations
  - CRO clinical site recruitment leads
  - biotech R&D lab equipment leads
  - Medical Science Liaison KOL mapping
  - NIH R01 grant funded labs
  - ORCID biomedical expert search
use_cases:
  - Extract Principal Investigators and unmasked Central Contact emails and phone numbers from recruiting trials for CRO, patient-recruitment, and eClinical SaaS outreach
  - Rank peer-reviewed PubMed and Europe PMC Key Opinion Leaders (KOLs) by citation count, ORCID, and NIH grant IDs for Medical Science Liaison (MSL) engagement
  - Build targeted academic and biotech lab prospect lists for reagents, sequencing assays, antibodies, and analytical instruments using active NIH grant provenance
  - Segment clinical trial pipelines by sponsor class (INDUSTRY biotech/pharma vs ACADEMIC_OR_GOV medical centers) and trial phase (Phase 1 to Phase 4)
  - Source credentialed scientific advisory board (SAB) candidates and expert witnesses with verified DOI/PMID publication records
docs_url: "https://github.com/desastreger/open-data-mcp-servers"
---

# Clinical Trials & PubMed KOL Expert Finder (NIH & Europe PMC)

Combine **NIH National Library of Medicine ClinicalTrials.gov REST API v2** and **EMBL-EBI Europe PMC / PubMed** into one unified life-science intelligence feed—extracting recruiting trial Principal Investigators (`overallOfficials`), unmasked `centralContacts` (`contactEmail`, `contactPhone`), `INDUSTRY` vs `ACADEMIC_OR_GOV` sponsors, trial phases, corresponding KOL authors, citation counts, competitive NIH `grantIds`, and `orcid` identifiers.

## When to Use This Skill

**Activate this skill when the user wants to:**
- Find active clinical trial Principal Investigators (`PI`s) and unmasked trial Central Contacts (`contactEmail`, `contactPhone`) by disease, biomarker, drug target, or therapeutic modality (e.g., `"CAR-T immunotherapy"`, `"GLP-1 obesity"`, `"KRAS G12C"`, `"CRISPR gene editing"`).
- Rank published biomedical Key Opinion Leaders (`KOL`s) and senior/corresponding lab authors from PubMed / Europe PMC filtered by `minCitations`, extracting institutional affiliations, corresponding author emails, `orcid`, and NIH/research `grantIds`.
- Distinguish biotech/pharma-sponsored trials (`sponsorClass: "INDUSTRY"`) from academic hospital/government studies (`sponsorClass: "ACADEMIC_OR_GOV"`).

**Do NOT use this skill when:**
- Searching for community dental, medspa, chiropractic, optometry, or private outpatient clinic owners by US state/ZIP (use `us-healthcare-practice-owners` backed by CMS NPPES `NPI-2` instead).
- Seeking FDA drug/device recall enforcement histories for corporate vendor risk (use `us-kyb-compliance-dossier`).
- Requesting clinical patient-level outcomes or individual medical advice (this tool returns strictly public investigator, sponsor, protocol, and bibliographic metadata).

## Connect the Remote MCP Server

This skill connects to the live Apify Standby Streamable HTTP MCP server (`$0.50 / 1,000 leads` launch pay-per-event rate; `$1.50 / 1,000` standard rate; zero external NCBI/Europe PMC API keys required).

- **Remote Streamable HTTP MCP Endpoint:** `https://desastreger--openalex-pubmed-expert-finder-mcp.apify.actor/mcp`
- **Authentication Header:** `Authorization: Bearer $APIFY_TOKEN`

### Claude Code CLI
```bash
claude mcp add --transport http openalex-pubmed-expert-finder-mcp https://desastreger--openalex-pubmed-expert-finder-mcp.apify.actor/mcp \
  --header "Authorization: Bearer $APIFY_TOKEN"
```

### Cursor / Claude Desktop (`mcp.json` / `claude_desktop_config.json`)
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

### Apify REST API Fallback (cURL / Scripts / Clay / n8n)
To run combined `"mode": "all"` (ClinicalTrials.gov + PubMed KOLs in one dataset) up to `500` leads:
```bash
curl -sS -X POST "https://api.apify.com/v2/acts/desastreger~openalex-pubmed-expert-finder-mcp/run-sync-get-dataset-items" \
  -H "Authorization: Bearer $APIFY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "mode": "all",
    "query": "CAR-T immunotherapy",
    "trialStatuses": ["RECRUITING", "NOT_YET_RECRUITING"],
    "requireDirectContact": true,
    "minCitations": 15,
    "maxResults": 50
  }'
```

## MCP Tools & Parameter Selection

| MCP Tool | Purpose | Key Arguments & Defaults |
| :--- | :--- | :--- |
| `find_clinical_trial_investigators` | Query NIH ClinicalTrials.gov v2 for Principal Investigators, Central Contacts, trial phases, sites, and sponsors. | `query` (`"CAR-T immunotherapy"` default), `trialStatuses` (`["RECRUITING", "NOT_YET_RECRUITING"]` default), `requireDirectContact` (`false` default), `maxResults` (`10` default, `1–50` in MCP; `1–500` via REST). |
| `search_pubmed_kol_experts` | Query PubMed / Europe PMC for high-impact KOL authors, affiliations, corresponding emails, citations, ORCIDs, and grant IDs. | `query` (`"CAR-T immunotherapy"` default), `minCitations` (`0` default), `maxResults` (`10` default, `1–50` in MCP; `1–500` via REST). |

*(Note: When calling the Apify REST API directly, `mode` selects `"all"`, `"clinical_trial_investigators"`, or `"pubmed_kol_authors"`.)*

### Parameter Selection Rules
1. **Direct Outbound vs Complete Landscape:** Set `requireDirectContact: true` on `find_clinical_trial_investigators` when building email/phone outreach lists (note that industry big-pharma trials often route central contacts through generic clinical mailboxes, whereas `ACADEMIC_OR_GOV` and mid-size biotech trials frequently publish direct PI/coordinator emails). Keep `requireDirectContact: false` when mapping all active Phase 1–3 sponsors.
2. **KOL Impact Filtering:** Set `minCitations: 10` to `50` on `search_pubmed_kol_experts` for established Medical Affairs KOLs, or `minCitations: 0` when hunting brand-new 2025–2026 publications with fresh corresponding author emails.
3. **Dual-Tool Cross-Verification:** Call both `find_clinical_trial_investigators` and `search_pubmed_kol_experts` on the same biomarker/indication `query` to identify "translational" PIs who both publish high-impact papers and lead active recruiting trials.

### Canonical MCP Tool Call Payloads

**Recruiting Clinical Trial PIs (`find_clinical_trial_investigators`):**
```json
{
  "query": "KRAS G12C",
  "trialStatuses": ["RECRUITING", "NOT_YET_RECRUITING"],
  "requireDirectContact": true,
  "maxResults": 20
}
```

**Cited PubMed KOL Researchers (`search_pubmed_kol_experts`):**
```json
{
  "query": "CAR-T immunotherapy",
  "minCitations": 25,
  "maxResults": 20
}
```

### Interpreting Investigator & KOL Signals

| Output Field | High-Signal Values | Actionable Biotech / CRO / Lab-Sales Interpretation |
| :--- | :--- | :--- |
| `recordType` & `roleOrPosition` | `PRINCIPAL_INVESTIGATOR`, `CORRESPONDING_KOL_AUTHOR` | Verified study decision-maker or senior lab head directing clinical enrollment, assay selection, or core grant budgets. |
| `sponsorClass` | `INDUSTRY` vs `ACADEMIC_OR_GOV` | Separates commercial biotech/pharma sponsors (`INDUSTRY`) from university medical centers and NIH institutes (`ACADEMIC_OR_GOV`). |
| `contactEmail` & `contactPhone` | Unmasked institutional email / direct phone | Extracted directly from ClinicalTrials.gov `centralContacts` or PubMed corresponding author affiliations for compliant scientific outreach. |
| `grantIds` & `citationCount` | Active NIH `R01`/`P01`/`U01` IDs + high citations | Confirms active non-dilutive research funding for lab equipment/reagent purchases and peer-recognized KOL influence. |

See [references/schema-and-examples.md](references/schema-and-examples.md) for the unified 22-field schema and 3 concrete life-science recipes.

## Execution Workflow

Follow this deterministic 4-step workflow on every invocation:

1. **Scoping & Cost-Aware Sizing:** Clarify the exact biomedical `query` (indication, target, modality), whether clinical trials, PubMed KOLs, or both are needed, and whether unmasked contact info is mandatory. Start with `maxResults: 10` to `25` per tool (`$0.005–$0.0125` at launch pricing).
2. **Tool Call & Filtering:** Invoke `find_clinical_trial_investigators` (with `trialStatuses` such as `["RECRUITING", "NOT_YET_RECRUITING"]`) and/or `search_pubmed_kol_experts` (with `minCitations`).
3. **Cross-Field Normalization & Ranking:** Sort leads by `leadScore` (`0–100`, `HOT` / `WARM` / `STANDARD`) descending. Highlight records carrying unmasked `contactEmail` / `contactPhone`, competitive `grantIds` (e.g., NIH `R01`, `P01`, `U01`), and cross-match investigators appearing in both `NCT` trials and `PMID` articles.
4. **Structured Deliverable Output:** Populate [templates/report-template.md](templates/report-template.md) with `expertOrContactName`, `roleOrPosition`, `organizationOrAffiliation`, `sponsorClass`, `contactEmail` / `contactPhone`, `identifier` (`NCT...` or `PMID:...`), `citationCount` / `trialPhases`, `grantIds`, and `sourceUrl`.

## Data Provenance & Safety Rules

- **Cite Official Scientific Identifiers:** Always cite the exact `NCT` trial number (`NCT05225363`), `PMID` (`PMID:29567707`), `doi`, `orcid`, `grantIds`, and clickable `sourceUrl` (`clinicaltrials.gov` or `pubmed.ncbi.nlm.nih.gov`).
- **Zero Fabrication of Investigator Emails:** Only output `contactEmail` and `contactPhone` strings explicitly published in ClinicalTrials.gov `centralContacts` or PubMed/Europe PMC corresponding author affiliations. When `contactEmail` is `null`, mark it `Not published in registry`—never guess institutional email patterns.
- **Surface Runtime Notices Transparently:** Report any `escalationWarnings`, empty query subsets, or budget cap limits clearly to the user.

### High-Value Multi-Skill Chaining
- **Biotech Sponsor Venture Funding (`sec-form-d-funding-leads`):** Cross-reference emerging `INDUSTRY` clinical trial sponsors (`leadSponsorName`) against recent SEC Form D Reg D venture raises to identify newly funded Phase 1/2 biotechs hiring CROs and lab vendors.
- **Non-Dilutive NIH / BARDA Grants (`federal-govcon-recompete-radar`):** Pair `grantIds` and therapeutic `query` keywords with live open `Grants.gov` federal R&D funding opportunities.
- **Sponsor & Lab Domain Technographics (`b2b-domain-mail-security-posture`):** Extract domains from `contactEmail` addresses on biotech trials to inspect email gateways, SaaS stacks, and domain registration age prior to BD outreach.
