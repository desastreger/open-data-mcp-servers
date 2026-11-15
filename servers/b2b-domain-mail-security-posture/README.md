<img src="../../icons/b2b-domain-mail-security-posture.svg" width="72" height="72" align="right" alt="b2b-domain-mail-security-posture icon" />

# DMARC, SPF, MX & Domain Security Scraper ($0.50/1k)

**Category:** Cybersecurity & GTM Tech Stack  
**Apify Store:** [https://apify.com/desastreger/b2b-domain-mail-security-posture](https://apify.com/desastreger/b2b-domain-mail-security-posture)  
**Remote MCP Endpoint (Streamable HTTP):** `https://desastreger--b2b-domain-mail-security-posture.apify.actor/mcp`  
**Official Data Sources:** Native RFC DNS (MX/SPF/DMARC/NS), TLS SNI, IANA RDAP, RIPEstat BGP

> [!IMPORTANT]
> **Early-Adopter Launch Pricing:** **$0.50 / 1k records** (`$0.0005`/record) — promotional launch pricing while early adopters onboard. Scheduled to step up to our standard **$1.50 / 1k records** (`$0.0015`/record) rate after the launch window, still **75%–95% cheaper** than comparable Store scrapers.

## Overview

Zero-key RFC infrastructure intelligence: inspect DNS MX email providers (Google Workspace, Microsoft 365, Proofpoint), SPF SaaS senders, DMARC spoofing gaps, live TLS X.509 certificates, IANA RDAP domain age, and RIPEstat BGP ASNs.

- **Zero External API Keys:** Runs 100% deterministically against public-domain government APIs and RFC protocols.
- **Dual Mode:** Call live over MCP (`Streamable HTTP`) from Claude, Cursor, Windsurf, VS Code, or Google Antigravity, OR run batch jobs on [Apify Store](https://apify.com/desastreger/b2b-domain-mail-security-posture).

---

## MCP Tool Schemas

### `audit_domain_posture`

Audit a single B2B domain (accepts raw domain, URL, or email address) via pure RFC protocols: DNS MX Email Provider (Google Workspace, Microsoft 365, Proofpoint, Mimecast, etc.), SPF policy & third-party SaaS senders (HubSpot, Salesforce, SendGrid, etc.), DMARC spoofing vulnerability, TLS X.509 certificate & SAN subdomains, IANA RDAP domain age & registrar, RIPEstat BGP/ASN hosting, and 0-100 security posture score.

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `domain` | `string` **(required)** | Raw domain, website URL, or email address to audit (e.g., "stripe.com" or "ceo@apify.com"). |
| `includeTlsCertCheck` | `boolean` | Inspect live TLS X.509 certificate & SAN subdomains on port 443. Default: true. |
| `includeRdapDomainAge` | `boolean` | Query official IANA RDAP bootstrap for domain registration age & registrar. Default: true. |
| `includeBgpAsnLookup` | `boolean` | Query RIPEstat BGP/ASN prefix-overview for primary IPv4 hosting holder. Default: true. |

### `batch_audit_domains`

Batch-audit up to 50 B2B domains concurrently via pure RFC protocols (DNS MX/SPF/DMARC/NS, TLS X.509 certificates, official IANA RDAP domain age & registrar, and RIPEstat BGP/ASN hosting) for GTM enrichment, MSP security prospecting, and vendor KYB triage.

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `domains` | `array` **(required)** | Array of domains, URLs, or email addresses to audit (1-50 per MCP call). |
| `includeTlsCertCheck` | `boolean` | Inspect live TLS X.509 certificates on port 443. Default: true. |
| `includeRdapDomainAge` | `boolean` | Query official IANA RDAP domain age & registrar. Default: true. |
| `includeBgpAsnLookup` | `boolean` | Query RIPEstat BGP/ASN hosting infrastructure. Default: true. |
| `concurrency` | `integer` | Parallel inspection concurrency (1-20). Default: 5. |

---

## Sample Output JSON

```json
{
  "domain": "stripe.com",
  "domainExists": true,
  "securityScore": 92,
  "securityGrade": "A",
  "emailProvider": "Google Workspace",
  "dmarcPolicy": "reject",
  "emailSpoofingVulnerable": false,
  "nameserverProvider": "AWS Route53",
  "asn": 16509,
  "issuerOrg": "DigiCert, Inc.",
  "daysUntilCertExpiry": 179
}
```

---

## Quickstart

### Add to `mcp_config.json`

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

### cURL (`tools/call`)

```bash
curl -sS -X POST "https://desastreger--b2b-domain-mail-security-posture.apify.actor/mcp" \
  -H "Authorization: Bearer <YOUR_APIFY_TOKEN>" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"audit_domain_posture","arguments":{"domains":["stripe.com"],"includeTlsCertCheck":true,"includeRdapDomainAge":true,"includeBgpAsnLookup":true}}}'
```

### JavaScript (`apify-client`)

```js
import { ApifyClient } from 'apify-client';

const client = new ApifyClient({ token: process.env.APIFY_TOKEN });
const run = await client.actor('desastreger/b2b-domain-mail-security-posture').call({
  "domains": [
    "stripe.com"
  ],
  "includeTlsCertCheck": true,
  "includeRdapDomainAge": true,
  "includeBgpAsnLookup": true
});
const { items } = await client.dataset(run.defaultDatasetId).listItems();
console.log(items);
```

### Python (`apify-client`)

```python
import os
from apify_client import ApifyClient

client = ApifyClient(os.environ["APIFY_TOKEN"])
run = client.actor("desastreger/b2b-domain-mail-security-posture").call(run_input={"domains":["stripe.com"],"includeTlsCertCheck":true,"includeRdapDomainAge":true,"includeBgpAsnLookup":true})
print(client.dataset(run["defaultDatasetId"]).list_items().items)
```

---

[← Back to All 10 Open Data MCP Servers](../../README.md) · [Open on Apify Store →](https://apify.com/desastreger/b2b-domain-mail-security-posture)
