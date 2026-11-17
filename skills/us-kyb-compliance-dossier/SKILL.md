---
name: us-kyb-compliance-dossier
description: "Screen US and global companies across five official public compliance registries (GLEIF Global LEI, SEC EDGAR, FDA openFDA Recalls, CFPB Consumer Complaints, and USASpending Federal Contracts) to generate deterministic KYB verification scores and risk flags. Activate when users ask to verify a business entity, run KYB onboarding checks, conduct vendor risk due diligence, look up LEI or CIK identifiers, or screen suppliers for FDA recalls and CFPB complaints."
summary: "Generate deterministic US Know-Your-Business (KYB) and third-party vendor risk dossiers across five official registries: GLEIF Global LEI, SEC EDGAR, FDA openFDA Recalls, CFPB Consumer Complaints, and USASpending Federal Contracts."
version: "1.0.0"
tags:
  - kyb-verification
  - vendor-due-diligence
  - compliance-screening
  - gleif-lei
  - sec-edgar
  - fda-recalls
  - cfpb-complaints
  - third-party-risk
  - mcp-server
keywords:
  - US KYB compliance API
  - vendor risk due diligence
  - company verification dossier
  - GLEIF LEI lookup
  - SEC EDGAR CIK check
  - openFDA Class I recall screening
  - CFPB consumer complaint check
  - third party risk management TPRM
  - B2B underwriting verification
use_cases:
  - Automate fintech and B2B payments merchant KYB onboarding with verified legal names, active LEIs, and SEC CIKs
  - Screen medical, pharmaceutical, and manufacturing suppliers for active Class I/II/III FDA recalls before procurement sign-off
  - Evaluate consumer-finance and lending counterparties against CFPB complaint volume ratios
  - Enrich CRM vendor masters in batch with canonical headquarters addresses, jurisdictions, and federal contractor verification
  - Feed deterministic 0-100 KYB verification scores and machine-readable risk flags into underwriting workflows
docs_url: "https://github.com/desastreger/open-data-mcp-servers"
---

# US KYB & Multi-Registry Compliance Dossier (`us-kyb-compliance-dossier`)

## When to Use This Skill

Activate this skill whenever a user needs authoritative corporate identity verification, counterparty risk triage, or third-party risk management (TPRM) screening:
- **"Run a KYB check / compliance dossier on [company]"** — verify legal entity existence, jurisdiction, headquarters address, 20-character LEI, and 10-digit SEC CIK.
- **"Batch-screen these vendors before onboarding: [list of companies]"** — evaluate up to 20 counterparties per MCP call (or up to 500 via REST) with standardized `0–100` scores.
- **"Check if [supplier] has any FDA recalls or CFPB complaints"** — cross-examine openFDA drug/device enforcement records and Consumer Financial Protection Bureau complaint volume.
- **"Confirm whether [company] is an active US federal contractor"** — verify prime federal award history (`A/B/C/D` contracts) on USASpending.gov.

**When NOT to use this skill:**
- Discovering newly funded private venture leads by industry or state (use `sec-form-d-funding-leads` instead).
- European Union VAT tax-number validation on EC VIES or EU customs tariff checks (use `cross-border-tariff-eu-trade-mcp` instead).
- Sanctioned individuals / OFAC SDN politically exposed person (PEP) biometric screening or consumer credit bureau checks (this tool screens corporate entities across 5 public business/regulatory registries).

## Connect the Remote MCP Server

Connect any Streamable HTTP MCP client directly using `$APIFY_TOKEN`:

- **MCP Endpoint:** `https://desastreger--us-kyb-compliance-dossier.apify.actor/mcp`
- **Apify Store Page:** `https://apify.com/desastreger/us-kyb-compliance-dossier`
- **Auth Header:** `Authorization: Bearer $APIFY_TOKEN`
- **Pay-Per-Event Rate:** `$1.00 / 1,000` dossiers launch (`$2.50 / 1,000` standard); zero monthly subscription

### Claude Code CLI
```bash
claude mcp add --transport http us-kyb-compliance-dossier \
  https://desastreger--us-kyb-compliance-dossier.apify.actor/mcp \
  --header "Authorization: Bearer $APIFY_TOKEN"
```

### Cursor / Claude Desktop (`mcp.json` / `claude_desktop_config.json`)
```json
{
  "mcpServers": {
    "us-kyb-compliance-dossier": {
      "url": "https://desastreger--us-kyb-compliance-dossier.apify.actor/mcp",
      "headers": {
        "Authorization": "Bearer <YOUR_APIFY_TOKEN>"
      }
    }
  }
}
```

### Apify REST API Fallback (Synchronous Dataset Run)
For automated pipelines or larger vendor master batches (up to 500 companies per run):
```bash
curl -s -X POST \
  "https://api.apify.com/v2/acts/desastreger~us-kyb-compliance-dossier/run-sync-get-dataset-items?token=$APIFY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "companies": ["Pfizer", "Medtronic"],
    "includeGleifLei": true,
    "includeSecFilings": true,
    "includeFdaEnforcement": true,
    "includeCfpbComplaints": true,
    "includeFederalAwards": true
  }'
```

## MCP Tools & Parameter Selection

| MCP Tool | Primary Intent | Key Arguments |
| :--- | :--- | :--- |
| `screen_company_kyb` | Single-entity deep compliance dossier across all enabled public registries in parallel. | `companyName` (**required** string), `includeGleifLei` (`true`), `includeSecFilings` (`true`), `includeFdaEnforcement` (`true`), `includeCfpbComplaints` (`true`), `includeFederalAwards` (`true`) |
| `batch_screen_companies` | Multi-company TPRM / vendor onboarding batch triage (`1–20` companies per MCP call). | `companies` (**required** `string[]`, `1–20` items), plus the same five `include*` boolean registry toggles (all default `true`) |

### Registry Toggle Guidance
- Keep all five toggles `true` (`default`) for comprehensive onboarding due diligence—checks execute concurrently with independent 12-second per-registry timeouts, so enabling all five adds negligible wall-clock latency.
- Set `includeFdaEnforcement: false` only when screening pure software/financial entities where life-sciences product recalls are out of scope, or set `includeCfpbComplaints: false` when screening industrial B2B manufacturers with zero consumer financial exposure.
- Full input/output field dictionary and sample payloads are documented in [references/schema-and-examples.md](references/schema-and-examples.md).

### Example MCP Tool Call (`batch_screen_companies`)
```json
{
  "companies": ["Pfizer", "Medtronic", "SoFi Technologies"],
  "includeGleifLei": true,
  "includeSecFilings": true,
  "includeFdaEnforcement": true,
  "includeCfpbComplaints": true,
  "includeFederalAwards": true
}
```

### Example Single-Entity KYB Call (`screen_company_kyb`)
```json
{
  "companyName": "Pfizer",
  "includeGleifLei": true,
  "includeSecFilings": true
}
```

### Deterministic Verification Status & Risk Flag Reference
| Output Field / Flag | Compliance Triage Interpretation |
| :--- | :--- |
| `VERIFIED_ENTITY` (`>= 65`) | Confirmed in GLEIF LEI or SEC EDGAR with active registration, SEC history, or federal contract footprint. |
| `PARTIAL_MATCH` (`>= 40` or 1 hit) | Partial regulatory footprint (e.g., lapsed LEI, recall/complaint match without primary charter match). |
| `UNVERIFIED` (`NO_REGISTRY_MATCH`) | Zero matches across all 5 public registries; common for small private domestic LLCs requiring W-9/SoS review. |
| `FDA_CLASS_I_RECALL_ACTIVE` | High-severity ongoing FDA drug/device recall (`-15` score penalty); trigger QA/legal review. |
| `CFPB_HIGH_COMPLAINT_VOLUME` | `>= 500` CFPB complaints (public SEC filer) or `>= 50` (private firm) (`-15` score penalty). |
| `LAPSED_LEI` / `INACTIVE_ENTITY_STATUS` | GLEIF registration lapsed/retired or entity marked non-active; request treasury renewal proof. |

## Execution Workflow

Execute this deterministic 4-step compliance workflow:

1. **Step 1 — Scoping & Cost-Aware Sizing**
   - Deduplicate and clean raw user company names before calling the tool (the server also strips legal suffixes like `Inc.`, `LLC`, `Corp.`, and `/DE/` automatically, but deduplicating inputs avoids redundant charges).
   - Pay-Per-Event launch pricing is **`$1.00 / 1,000` dossiers** (`$0.001 / company`, standard `$2.50 / 1,000`). Use `screen_company_kyb` for 1 company and `batch_screen_companies` in chunks of up to 20 companies.
2. **Step 2 — Tool Call & Filtering**
   - Pass exact legal names when known (e.g., `"PFIZER INC."` or `"Medtronic"`) so GLEIF US-first legal-name ranking and SEC EDGAR EFTS entity resolution achieve maximum precision.
   - Check `stoppedByBudgetCap` in batch responses to confirm all requested entities were processed.
3. **Step 3 — Cross-Field Normalization & Ranking**
   - Interpret the deterministic `kybVerificationScore` (`0–100`) via `scoreBreakdown`:
     - `+20` baseline
     - `+40` primary registry match (`gleifLei.matched` or `secEdgar.matched`)
     - `+20` active & issued LEI (`entityStatus: "ACTIVE"` and `registrationStatus: "ISSUED"`)
     - `+20` confirmed operating footprint (`federalAwards.isFederalContractor` or SEC filing history)
     - `-15` enforcement deduction (active FDA Class I recall or high CFPB complaint ratio: `>= 500` complaints for SEC-reporting firms, `>= 50` for private firms)
   - Segment multi-company cohorts by `verificationStatus` (`VERIFIED_ENTITY`, `PARTIAL_MATCH`, `UNVERIFIED`) and surface any critical `riskFlags` (`FDA_CLASS_I_RECALL_ACTIVE`, `INACTIVE_ENTITY_STATUS`, `LAPSED_LEI`, `CFPB_HIGH_COMPLAINT_VOLUME`, `NO_REGISTRY_MATCH`).
4. **Step 4 — Structured Deliverable Output**
   - Format the audit report using [templates/report-template.md](templates/report-template.md), separating identity verification evidence from regulatory enforcement findings and escalation actions.

## Data Provenance & Safety Rules

- **Cite Primary Registry Identifiers:** Always report the resolved 20-character `lei`, 10-digit SEC `primaryCik`, canonical `resolvedLegalName`, `jurisdiction`, `headquartersLocation`, and USASpending award IDs (`federalAwards.sampleAwards[].awardId`) verbatim.
- **Small Private Business Nuance:** Many legitimate small US LLCs do not hold a global LEI, file with the SEC, or bid on federal prime contracts. Explain clearly when an `UNVERIFIED` (`NO_REGISTRY_MATCH`) result simply reflects a non-public domestic small business that requires Secretary-of-State or EIN W-9 verification rather than assuming fraud.
- **Zero Data Fabrication:** Never invent officer names, tax IDs, phone numbers, or clean compliance statuses for unscreened subsidiaries.
- **Surface Partial Timeouts Explicitly:** If `riskFlags` includes `UPSTREAM_PARTIAL_TIMEOUT` or any nested registry object (`gleifLei.error`, `secEdgar.error`, `fdaEnforcement.error`, `cfpbComplaints.error`, `federalAwards.error`) is non-null—or if `RUN_SUMMARY.escalations` / `escalationWarnings` appear—disclose exactly which upstream government endpoint timed out so compliance reviewers can re-verify that specific source.
