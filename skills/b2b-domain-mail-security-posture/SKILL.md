---
name: b2b-domain-mail-security-posture
description: "Audit B2B domains, URLs, and email addresses via pure RFC protocols across DNS MX email providers, SPF SaaS stacks, DMARC spoofing risk, port 443 TLS X.509 certificates, IANA RDAP domain age, and RIPEstat BGP ASNs. Activate when the user asks to 'check DMARC and SPF for these domains', 'find which email provider and SaaS tools a company uses', 'audit domain security posture for MSP outbound', or 'screen vendor domains for newly registered shell risk'."
summary: "Audit B2B domains via live RFC protocols for DNS MX email providers, SPF SaaS stacks, DMARC spoofing risk, port 443 TLS X.509 certificates, IANA RDAP domain age, RIPEstat BGP ASNs, 0-100 security posture scores, and MSP sales triggers via remote MCP."
version: "1.0.0"
tags:
  - domain-security
  - dmarc-spf-mx
  - technographics
  - msp-leads
  - cybersecurity-audit
  - tls-certificates
  - rdap-whois
  - vendor-risk-kyb
  - mcp-server
keywords:
  - DMARC SPF MX checker API
  - B2B email provider technographics
  - MSP cybersecurity lead generation
  - email spoofing vulnerability audit
  - IANA RDAP domain age check
  - TLS X.509 certificate expiry
  - RIPEstat BGP ASN lookup
  - SPF SaaS stack detection
  - vendor domain risk scoring
use_cases:
  - Score SMB and mid-market prospect domains for missing or p=none DMARC policies to generate high-converting MSP and cybersecurity sales triggers
  - Enrich CRM account lists with verified email suites (Google Workspace vs Microsoft 365), email security gateways (Proofpoint, Mimecast), and SPF SaaS senders (HubSpot, Salesforce, SendGrid)
  - Screen vendor and counterparty domains during KYB onboarding for newly registered shell risk (<90 days old) via authoritative IANA RDAP registries
  - Monitor partner and portfolio domains for expiring port 443 TLS X.509 certificates, untrusted CAs, and exposed SAN subdomains
  - Map prospect cloud hosting footprints across BGP Autonomous System Numbers (AWS, Cloudflare, Fastly, Google) and DNS nameserver providers
docs_url: "https://github.com/desastreger/open-data-mcp-servers"
---

# B2B Domain, Email Security (DMARC/SPF/MX), TLS & RDAP Posture

Inspect single or bulk B2B domains, website URLs, and email addresses across four live RFC infrastructure layers—native DNS (`MX`, `SPF`, `DMARC`, `NS`, root `TXT`), direct port `443` TLS SNI handshakes, official **IANA RDAP** registries (`data.iana.org`), and **RIPEstat BGP/ASN** routing (`stat.ripe.net`)—returning `0–100` security grades (`A`–`F`), SaaS technographics, and actionable `mspSalesTrigger` talking points.

## When to Use This Skill

**Activate this skill when the user wants to:**
- Check whether one or more domains are vulnerable to email spoofing (`emailSpoofingVulnerable: true` due to missing DMARC or `p=none` monitoring-only policies) or permissive SPF (`+all` / `?all` / `~all`).
- Detect a company's email provider (`Google Workspace`, `Microsoft 365`, `Proofpoint`, `Mimecast`, `Proton Mail`), DNS host (`Cloudflare`, `AWS Route53`), cloud ASN holder, and third-party SPF/TXT SaaS stack (`HubSpot`, `Salesforce`, `SendGrid`, `Zendesk`, `DocuSign`).
- Verify domain registration age (`domainAgeDays`), registrar, and `<90`-day newly registered shell-company risk (`newlyRegisteredShellRisk`) for fraud/KYB screening.
- Audit live port `443` TLS certificate validity, issuing CA, days until expiration (`daysUntilCertExpiry`), and Subject Alternative Name (`SAN`) subdomains.

**Do NOT use this skill when:**
- Guessing personal employee email addresses, scraping LinkedIn profiles, or performing intrusive port scanning / vulnerability exploitation (this tool executes strictly passive/standard RFC DNS, port 443 TLS SNI, RDAP, and BGP queries).
- Looking up corporate legal filings, SEC disclosures, FDA recalls, or federal contracts (combine with `us-kyb-compliance-dossier` for legal-entity KYB).

## Connect the Remote MCP Server

### Option 1: 1-Click Browser OAuth (Zero API Key Setup — Recommended)

Connect directly via Apify's managed OAuth gateway (`https://mcp.apify.com/?tools=desastreger/b2b-domain-mail-security-posture`) — Claude Code, Cursor, Claude Desktop, Windsurf, VS Code, and Google Antigravity sign in via browser OAuth with **zero manual `APIFY_TOKEN`** needed:

- **1-Click OAuth MCP URL:** `https://mcp.apify.com/?tools=desastreger/b2b-domain-mail-security-posture`
- **Apify Store Page:** `https://apify.com/desastreger/b2b-domain-mail-security-posture`

#### Claude Code CLI (OAuth)
```bash
claude mcp add --transport http b2b-domain-mail-security-posture "https://mcp.apify.com/?tools=desastreger/b2b-domain-mail-security-posture"
```

#### Cursor / Claude Desktop / Windsurf / Google Antigravity (OAuth `mcp.json`)
```json
{
  "mcpServers": {
    "b2b-domain-mail-security-posture": {
      "url": "https://mcp.apify.com/?tools=desastreger/b2b-domain-mail-security-posture"
    }
  }
}
```

#### VS Code Copilot (`.vscode/mcp.json`)
```json
{
  "servers": {
    "b2b-domain-mail-security-posture": {
      "type": "http",
      "url": "https://mcp.apify.com/?tools=desastreger/b2b-domain-mail-security-posture"
    }
  }
}
```

### Option 2: Direct Standby Streamable HTTP (`Bearer $APIFY_TOKEN`)

For headless scripts, CI pipelines, or direct Standby authentication:

- **Standby MCP Endpoint:** `https://desastreger--b2b-domain-mail-security-posture.apify.actor/mcp`
- **Auth Header:** `Authorization: Bearer $APIFY_TOKEN`

```bash
claude mcp add --transport http b2b-domain-mail-security-posture \
  https://desastreger--b2b-domain-mail-security-posture.apify.actor/mcp \
  --header "Authorization: Bearer $APIFY_TOKEN"
```

```json
{
  "mcpServers": {
    "b2b-domain-mail-security-posture": {
      "url": "https://desastreger--b2b-domain-mail-security-posture.apify.actor/mcp",
      "headers": {
        "Authorization": "Bearer <YOUR_APIFY_TOKEN>"
      }
    }
  }
}
```

### Apify REST API Fallback (cURL / Scripts / Clay / n8n)
For larger domain lists (>50 domains in a single run) or automated webhook pipelines:
```bash
curl -sS -X POST "https://api.apify.com/v2/acts/desastreger~b2b-domain-mail-security-posture/run-sync-get-dataset-items" \
  -H "Authorization: Bearer $APIFY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "domains": ["apify.com", "stripe.com", "https://www.cloudflare.com"],
    "includeTlsCertCheck": true,
    "includeRdapDomainAge": true,
    "includeBgpAsnLookup": true,
    "concurrency": 5
  }'
```

## MCP Tools & Parameter Selection

| MCP Tool | Purpose | Key Arguments & Defaults |
| :--- | :--- | :--- |
| `audit_domain_posture` | Deep real-time RFC security & technographic audit of a single domain, URL, or email address. | `domain` (required string: raw domain, URL, or email like `"ceo@stripe.com"`), `includeTlsCertCheck` (`true`), `includeRdapDomainAge` (`true`), `includeBgpAsnLookup` (`true`). |
| `batch_audit_domains` | Parallel multi-domain posture audit (`1–50` domains per MCP call) with automatic deduplication. | `domains` (required `string[]`, max `50` per MCP call), `includeTlsCertCheck` (`true`), `includeRdapDomainAge` (`true`), `includeBgpAsnLookup` (`true`), `concurrency` (`5` default, `1–20`). |

### Parameter Selection Rules
1. **Input Normalization:** Pass raw domains, full `https://` URLs, or email addresses (`sales@company.com`) directly—the server automatically strips schemes/paths/mailboxes and deduplicates normalized hostnames.
2. **Speed Optimization for Pure Mail/GTM Runs:** When the user only needs MX email provider, SPF SaaS stack, and DMARC status across dozens of domains, set `includeTlsCertCheck: false`, `includeRdapDomainAge: false`, and `includeBgpAsnLookup: false` with `concurrency: 10` for sub-second DNS-only execution.
3. **Full KYB & MSP Security Mode:** Keep all three boolean flags `true` (default) when auditing vendor legitimacy (`newlyRegisteredShellRisk`), SSL expiry (`daysUntilCertExpiry`), or full `0–100` `securityScore` grades.

### Canonical MCP Tool Call Payloads

**Single-Domain Deep Audit (`audit_domain_posture`):**
```json
{
  "domain": "stripe.com",
  "includeTlsCertCheck": true,
  "includeRdapDomainAge": true,
  "includeBgpAsnLookup": true
}
```

**Parallel Prospect Batch (`batch_audit_domains`):**
```json
{
  "domains": [
    "apify.com",
    "https://www.cloudflare.com",
    "sales@hubspot.com"
  ],
  "includeTlsCertCheck": true,
  "includeRdapDomainAge": true,
  "includeBgpAsnLookup": true,
  "concurrency": 5
}
```

### Interpreting Posture Signals & GTM Triggers

| Output Field | High-Signal Values | Actionable Security / GTM Interpretation |
| :--- | :--- | :--- |
| `emailSpoofingVulnerable` | `true` (`dmarcPresent: false` or `dmarcPolicy: "none"`) | Domain lacks enforced DMARC (`quarantine`/`reject`), exposing executives and customers to spoofing; prime MSP/MSSP outbound hook via `mspSalesTrigger`. |
| `emailProvider` & `hasEmailSecurityGateway` | `Microsoft 365` / `Google Workspace` + `false` | Cloud inbox without Proofpoint/Mimecast/Barracuda perimeter gateway — ideal target for API-native cloud email security solutions. |
| `detectedSaasSenders` | `["HubSpot", "Salesforce", "SendGrid", ...]` | Verified third-party marketing/CRM/support platforms authorized in DNS SPF/TXT records for RevOps technographic segmentation. |
| `newlyRegisteredShellRisk` | `true` (`domainAgeDays < 90`) | Authoritative IANA RDAP registration is under 90 days old — escalate immediately in vendor KYB, wire-payment, or procurement workflows. |
| `daysUntilCertExpiry` | `<= 30` or `tlsAuthorized: false` | Imminent port `443` HTTPS outage or untrusted certificate chain requiring immediate DevOps remediation. |

See [references/schema-and-examples.md](references/schema-and-examples.md) for the complete 45-field output schema and 3 concrete B2B recipes.

## Execution Workflow

Follow this deterministic 4-step workflow on every invocation:

1. **Scoping & Cost-Aware Sizing:** Deduplicate candidate domains/URLs/emails first. Use `audit_domain_posture` for a single target or `batch_audit_domains` in chunks of up to `50` domains per MCP call (`$0.025` per 50 domains at launch pricing).
2. **Tool Call & Filtering:** Execute the audit with appropriate protocol flags (`TLS`, `RDAP`, `BGP`). Filter out non-existent domains (`domainExists: false`) separately from live misconfigured domains.
3. **Cross-Field Normalization & Ranking:** For MSP/security prospecting, rank live domains with `emailSpoofingVulnerable: true`, expiring certs (`daysUntilCertExpiry <= 30`), or low `securityScore` (`securityGrade` `C`/`D`/`F`) at the top. For KYB risk triage, flag `newlyRegisteredShellRisk: true` (`domainAgeDays < 90`) immediately.
4. **Structured Deliverable Output:** Present findings using [templates/report-template.md](templates/report-template.md), pairing each `domain` with its exact `emailProvider`, `dmarcPolicy`, `spfAllQualifier`, `detectedSaasSenders`, `domainAgeDays`, `securityScore`, and `mspSalesTrigger` remediation hooks.

## Data Provenance & Safety Rules

- **Anchor to Verifiable RFC Evidence:** Cite the exact normalized `domain`, `primaryMx`, `spfRecord` / `spfAllQualifier`, `dmarcRecord` / `dmarcPolicy`, TLS `issuerOrg`, IANA RDAP `registeredAt` / `registrarName`, BGP `asn` / `asnHolder`, and `auditedAt` timestamp.
- **Zero Fabrication of Contacts or Vulnerabilities:** Report only observed DNS/TLS/RDAP/BGP states. If a TLD registry does not support RDAP (`domainAgeDays: null`) or port 443 is closed on a mail-only domain (`tlsReachable: false`), state that explicitly rather than inventing registration dates or claiming a breach.
- **Transparent Warnings & Budget Caps:** Surface `budgetCapReached: true`, `AUDIT_ERROR` signals in `riskAndSalesSignals`, or any `escalationWarnings` clearly in the report summary.
