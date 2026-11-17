# B2B Domain, Mail Security & Technographics — Schema, Output & Query Recipes

## 1. Input Parameter Reference

### Actor & MCP Tool Parameters (`audit_domain_posture` / `batch_audit_domains`)

| Parameter | Type | Default | Valid Values / Constraints | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `domain` *(MCP single)* | `string` | *(required)* | Raw domain (`"stripe.com"`), URL (`"https://www.stripe.com/pricing"`), or email (`"billing@stripe.com"`) | Used by `audit_domain_posture`. Automatically normalized to clean domain. |
| `domains` *(Batch / REST)* | `string[]` | `["apify.com", "stripe.com"]` | Array of domains, URLs, or emails (`1–50` per MCP `batch_audit_domains` call; larger batches via REST) | Automatically normalized and deduplicated before billing or querying. |
| `includeTlsCertCheck` | `boolean` | `true` | `true` \| `false` | Performs native port `443` TLS SNI handshake to extract X.509 issuer CA, validity dates, `daysUntilCertExpiry`, trust status, and SAN subdomains. |
| `includeRdapDomainAge` | `boolean` | `true` | `true` \| `false` | Queries authoritative TLD RDAP servers via official `data.iana.org` bootstrap for `registeredAt`, `expiresAt`, `domainAgeDays`, `registrarName`, and `<90`-day `newlyRegisteredShellRisk`. |
| `includeBgpAsnLookup` | `boolean` | `true` | `true` \| `false` | Queries `stat.ripe.net` `prefix-overview` for primary IPv4 `asn`, `asnHolder` (e.g., AWS, Cloudflare, Google), and `bgpPrefix`. |
| `concurrency` | `integer` | `5` | `1` to `20` | Number of domains audited in parallel during `batch_audit_domains` or REST runs. |

---

## 2. Normalized Output Record Schema

Each audited domain returns a comprehensive RFC posture & technographic object:

```json
{
  "queriedInput": "stripe.com",
  "domain": "stripe.com",
  "domainExists": true,
  "securityScore": 92,
  "securityGrade": "A",
  "emailProvider": "Google Workspace",
  "primaryMx": "aspmx.l.google.com",
  "mxRecords": ["1 aspmx.l.google.com", "5 alt1.aspmx.l.google.com"],
  "hasEmailSecurityGateway": false,
  "spfPresent": true,
  "spfRecord": "v=spf1 include:_spf.google.com include:spf.mandrillapp.com ~all",
  "spfAllQualifier": "softfail (~all)",
  "detectedSaasSenders": ["Greenhouse", "Qualtrics"],
  "detectedDomainVerifications": ["Google Site Verification", "Stripe"],
  "dmarcPresent": true,
  "dmarcRecord": "v=DMARC1; p=reject; rua=mailto:dmarc-reports@stripe.com",
  "dmarcPolicy": "reject",
  "dmarcSubdomainPolicy": null,
  "dmarcPct": 100,
  "dmarcRua": "mailto:dmarc-reports@stripe.com",
  "emailSpoofingVulnerable": false,
  "nameserverProvider": "AWS Route53",
  "nameservers": ["ns-111.awsdns-13.com", "ns-540.awsdns-03.net"],
  "ipv4": ["18.202.10.1"],
  "asn": 16509,
  "asnHolder": "AMAZON-02 - Amazon.com, Inc.",
  "bgpPrefix": "18.202.0.0/15",
  "tlsReachable": true,
  "tlsAuthorized": true,
  "tlsAuthorizationError": null,
  "issuerOrg": "DigiCert, Inc.",
  "validFrom": "2026-06-01T00:00:00.000Z",
  "validTo": "2027-05-15T23:59:59.000Z",
  "daysUntilCertExpiry": 179,
  "sanCount": 2,
  "sampleSubdomains": ["stripe.com", "www.stripe.com"],
  "registrarName": "SafeNames Ltd.",
  "registeredAt": "1995-09-12T04:00:00.000Z",
  "expiresAt": "2027-09-11T04:00:00.000Z",
  "domainAgeDays": 11383,
  "domainStatuses": ["clientDeleteProhibited", "clientTransferProhibited"],
  "newlyRegisteredShellRisk": false,
  "riskAndSalesSignals": ["SOFTFAIL_SPF"],
  "mspSalesTrigger": [
    "SPF uses softfail (~all); can be hardened to -all after auditing third-party SaaS senders."
  ],
  "auditedAt": "2026-11-17T10:00:00.000Z"
}
```

---

## 3. Concrete B2B Query Recipes

### Recipe 1: MSP & Email Security Outbound Lead Qualification
**Goal:** Batch-audit 25 regional law firm or accounting firm domains to find targets vulnerable to CEO/invoice domain spoofing (`emailSpoofingVulnerable: true`) without an enterprise email security gateway.
```json
{
  "domains": [
    "examplelawgroup.com",
    "midwestcpaadvisors.com",
    "coastalwealthpartners.com"
  ],
  "includeTlsCertCheck": true,
  "includeRdapDomainAge": true,
  "includeBgpAsnLookup": false,
  "concurrency": 10
}
```
**Expected Analytical Takeaway:** Pinpoints prospects running `Microsoft 365` or `Google Workspace` with `hasEmailSecurityGateway: false` and `dmarcPolicy: "none"` (or `dmarcPresent: false`), equipping SDRs with concrete `mspSalesTrigger` sentences citing the exact missing DMARC/SPF controls.

### Recipe 2: Fast GTM & RevOps SaaS Technographic Enrichment
**Goal:** Enrich inbound signup email addresses to segment leads by mail ecosystem (`Google Workspace` vs `Microsoft 365`) and outbound marketing maturity (`HubSpot`, `Salesforce`, `SendGrid`, `Marketo`).
```json
{
  "domains": [
    "vp-ops@acmelogistics.io",
    "founder@brighthealthai.com",
    "it@precisionmfg.net"
  ],
  "includeTlsCertCheck": false,
  "includeRdapDomainAge": false,
  "includeBgpAsnLookup": true,
  "concurrency": 10
}
```
**Expected Analytical Takeaway:** Executes fast DNS + BGP checks to populate CRM fields with `emailProvider`, `detectedSaasSenders`, `detectedDomainVerifications`, `nameserverProvider`, and cloud `asnHolder` without burning third-party enrichment credits.

### Recipe 3: Vendor Onboarding KYB & Shell-Domain Fraud Triage
**Goal:** Screen a prospective supplier or wire-transfer recipient domain for newly registered lookalike fraud (`<90` days old) and untrusted SSL certificates.
```json
{
  "domain": "global-industrial-supply-corp.com",
  "includeTlsCertCheck": true,
  "includeRdapDomainAge": true,
  "includeBgpAsnLookup": true
}
```
**Expected Analytical Takeaway:** Reveals `domainAgeDays`, `newlyRegisteredShellRisk`, `registrarName`, `tlsAuthorized`, and `securityGrade` in one call—instantly flagging 14-day-old lookalike domains before procurement approves vendor payment details.
