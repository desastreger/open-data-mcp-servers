# B2B Domain Security & Technographic Audit Report

## Executive Summary
- **Total Normalized Domains Audited:** `{{total_domains}}` (`Live`: `{{live_domains}}` | `NXDOMAIN / Unreachable`: `{{inactive_domains}}`)
- **Email Spoofing Vulnerable (`Missing DMARC` or `p=none`):** `{{spoofing_vulnerable_count}}`
- **Newly Registered Shell Risk (`<90 Days Old`):** `{{shell_risk_count}}`
- **Expiring / Untrusted TLS Certificates (`<=30 Days` or Unauthorized):** `{{tls_issue_count}}`
- **Protocol Layers Inspected:** `DNS (MX/SPF/DMARC/NS/TXT)` | `TLS 443: {{tls_enabled}}` | `IANA RDAP: {{rdap_enabled}}` | `RIPEstat BGP: {{bgp_enabled}}`

---

## Domain Posture & Technographic Matrix

| Domain | Grade (`Score`) | Email Provider & Gateway | SPF / DMARC Posture | Spoof Risk | Detected SaaS & Cloud (`ASN`) | TLS Expiry (`CA`) | Domain Age (`Registrar`) | Primary Risk / MSP Trigger |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **{{domain}}** | **{{securityGrade}}** (`{{securityScore}}`) | {{emailProvider}} (`ESG: {{hasEmailSecurityGateway}}`) | SPF: `{{spfAllQualifier}}` / DMARC: `{{dmarcPolicy}}` | `{{emailSpoofingVulnerable}}` | {{detectedSaasSenders}} (`AS{{asn}}` {{asnHolder}}) | `{{daysUntilCertExpiry}}d` ({{issuerOrg}}) | `{{domainAgeDays}}d` ({{registrarName}}) | {{primary_msp_trigger}} |
| **{{domain_2}}** | **{{securityGrade_2}}** (`{{securityScore_2}}`) | {{emailProvider_2}} (`ESG: {{hasEmailSecurityGateway_2}}`) | SPF: `{{spfAllQualifier_2}}` / DMARC: `{{dmarcPolicy_2}}` | `{{emailSpoofingVulnerable_2}}` | {{detectedSaasSenders_2}} (`AS{{asn_2}}` {{asnHolder_2}}) | `{{daysUntilCertExpiry_2}}d` ({{issuerOrg_2}}) | `{{domainAgeDays_2}}d` ({{registrarName_2}}) | {{primary_msp_trigger_2}} |

> **Audit Provenance:** Live RFC queries executed at `{{auditedAt}}`. Unresolved TLD RDAP fields or closed port 443 endpoints are reported as `null` / `false` without extrapolation. Budget/runtime notices: `{{warnings_or_none}}`.

---

## Recommended Next Actions
- [ ] **Immediate Spoofing Remediation / MSP Outreach:** Prioritize the `{{spoofing_vulnerable_count}}` domains with `emailSpoofingVulnerable = true` to deploy `v=DMARC1; p=quarantine`/`p=reject` with `rua` aggregate reporting and tighten SPF `~all` to `-all`.
- [ ] **KYB Fraud Escalation:** Hold onboarding or payment approval for any domain flagged `newlyRegisteredShellRisk = true` (`domainAgeDays < 90`) and cross-screen corporate legal existence via `us-kyb-compliance-dossier`.
- [ ] **TLS Certificate Renewal:** Alert infrastructure owners for any domain with `daysUntilCertExpiry <= 30` or `tlsAuthorized = false`.
- [ ] **GTM Stack Routing:** Segment CRM outreach by `emailProvider` (`Microsoft 365` vs `Google Workspace`) and `detectedSaasSenders` for tailored integration messaging.
