---
name: ofac-sanctions-aml-pep-screener-mcp
description: "Screen individuals, companies, vessels, aircraft, aliases, and crypto wallet addresses against the live US Treasury OFAC SDN & Consolidated Non-SDN lists with deterministic 0-100 match scoring. Activate when the user asks to 'screen an entity against OFAC', 'check a crypto wallet for sanctions', 'run AML sanctions screening', or 'search OFAC SDN by program or country'."
summary: "Screen names, aliases, vessels, and crypto wallets (BTC/XBT, ETH, USDT, TRX, XMR) against live US Treasury OFAC SDN, ALT, ADD, and Consolidated Non-SDN lists with 0-100 deterministic scoring via remote MCP."
version: "1.0.0"
tags:
  - compliance
  - ofac
  - sanctions
  - aml
  - kyb
  - crypto-compliance
  - fintech
  - trade-compliance
  - mcp-server
keywords:
  - US Treasury OFAC SDN API
  - AML sanctions screening
  - crypto wallet sanctions check
  - OFAC Consolidated Non-SDN
  - fuzzy name matching
  - KYB due diligence
  - vessel IMO sanctions
  - zero-key sanctions screener
use_cases:
  - Batch-screen customer, vendor, beneficial owner, or vessel names against live OFAC SDN + ALT aliases with 0-100 match scoring
  - Screen BTC/XBT, ETH, USDT, TRX, and XMR wallet addresses against OFAC-designated Digital Currency Addresses
  - Audit sanctioned entities, vessels, and aircraft by OFAC program (SDGT, CYBER2, RUSSIA-EO14024, DPRK, IRAN, CMIC) or country
  - Power KYB onboarding, crypto compliance, and trade-compliance AI agents with zero third-party sanctions API keys
docs_url: "https://github.com/desastreger/open-data-mcp-servers"
---

# OFAC Sanctions, AML & Crypto Wallet Screening Server

Screen individuals, corporations, vessels, aircraft, and cryptocurrency wallet addresses directly against the **official US Treasury OFAC Sanctions List Service (SLS)** (`SDN.CSV`, `ALT.CSV`, `ADD.CSV`, `CONS_PRIM.CSV` — public domain `17 U.S.C. § 105`, zero API key required). Caches the parsed index in memory (`TTL = 6 hours`) for `<15 ms` deterministic Standby MCP screening.

## When to Use This Skill

**Activate this skill when the user wants to:**
- Screen one or more person, company, vessel, or aircraft names (`screen_entities_ofac_aml`) against OFAC SDN, Consolidated Non-SDN, and `ALT.CSV` aliases.
- Screen cryptocurrency wallet addresses (`screen_crypto_wallet_sanctions`) or list OFAC-sanctioned wallets by chain (`XBT`/`BTC`, `ETH`, `USDT`, `TRX`, `XMR`, `SOL`).
- Browse sanctioned entities by OFAC program (`SDGT`, `CYBER2`, `RUSSIA-EO14024`, `DPRK`, `IRAN`, `CMIC`, `CUBA`), country, or entity type (`search_ofac_sanctions_by_program`).

**Do NOT use this skill when:**
- Checking US corporate SEC filings or beneficial ownership disclosures (use `us-kyb-compliance-dossier` or `sec-form-d-funding-leads`).
- Checking EU VAT numbers or USITC tariff duty rates (use `cross-border-tariff-eu-trade-mcp`).

## Connect the Remote MCP Server

### Option 1: 1-Click OAuth MCP (Zero API Key Setup — Recommended)

Connect directly via Apify's hosted Streamable HTTP MCP gateway—your MCP client triggers browser OAuth sign-in automatically with no manual token copy-paste:

- **1-Click OAuth MCP URL:** `https://mcp.apify.com/?tools=desastreger/ofac-sanctions-aml-pep-screener-mcp`
- **Direct Standby Endpoint (Headless / CI):** `https://desastreger--ofac-sanctions-aml-pep-screener-mcp.apify.actor/mcp` (`Authorization: Bearer $APIFY_TOKEN`)
- **Apify Store Page:** `https://apify.com/desastreger/ofac-sanctions-aml-pep-screener-mcp`
- **Pricing:** `$0.80 / 1,000 screens` launch pay-per-event rate; zero Treasury/OFAC API keys required

#### Claude Code CLI (1-Click OAuth)
```bash
claude mcp add --transport http ofac-sanctions-aml-pep-screener-mcp "https://mcp.apify.com/?tools=desastreger/ofac-sanctions-aml-pep-screener-mcp"
```

#### Cursor (`.cursor/mcp.json`) / Claude Desktop
```json
{
  "mcpServers": {
    "ofac-sanctions-aml-pep-screener-mcp": {
      "url": "https://mcp.apify.com/?tools=desastreger/ofac-sanctions-aml-pep-screener-mcp"
    }
  }
}
```

#### Windsurf (`~/.codeium/windsurf/mcp_config.json`)
```json
{
  "mcpServers": {
    "ofac-sanctions-aml-pep-screener-mcp": {
      "serverUrl": "https://mcp.apify.com/?tools=desastreger/ofac-sanctions-aml-pep-screener-mcp"
    }
  }
}
```

#### VS Code (`.vscode/mcp.json`)
```json
{
  "servers": {
    "ofac-sanctions-aml-pep-screener-mcp": {
      "type": "http",
      "url": "https://mcp.apify.com/?tools=desastreger/ofac-sanctions-aml-pep-screener-mcp"
    }
  }
}
```

### Option 2: Direct Standby Endpoint (`Bearer $APIFY_TOKEN` for Headless / CI)
For automated KYB, payment-screening, or CI pipelines without interactive browser OAuth:
```bash
claude mcp add --transport http ofac-sanctions-aml-pep-screener-mcp \
  https://desastreger--ofac-sanctions-aml-pep-screener-mcp.apify.actor/mcp \
  --header "Authorization: Bearer $APIFY_TOKEN"
```
```json
{
  "mcpServers": {
    "ofac-sanctions-aml-pep-screener-mcp": {
      "url": "https://desastreger--ofac-sanctions-aml-pep-screener-mcp.apify.actor/mcp",
      "headers": {
        "Authorization": "Bearer <YOUR_APIFY_TOKEN>"
      }
    }
  }
}
```

### Apify REST API Fallback (cURL / Scripts / Compliance Pipelines)
For high-volume batch screening (>100 entities) via synchronous Apify Actor execution:
```bash
curl -sS -X POST "https://api.apify.com/v2/acts/desastreger~ofac-sanctions-aml-pep-screener-mcp/run-sync-get-dataset-items" \
  -H "Authorization: Bearer $APIFY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "queries": ["AEROCARIBBEAN AIRLINES"],
    "minMatchScore": 70,
    "includeClearResults": true,
    "maxResults": 25
  }'
```

## MCP Tools & Parameter Selection

| MCP Tool | Purpose | Key Arguments & Defaults |
| :--- | :--- | :--- |
| `screen_entities_ofac_aml` | Batch-screen 1–100 entity, person, vessel, or aircraft names across SDN, Consolidated Non-SDN, and `ALT.CSV` aliases. | `query` or `queries`, `entityType` (`"all"`), `minMatchScore` (`70`), `includeClearResults` (`true`), `maxResults` (`25`) |
| `screen_crypto_wallet_sanctions` | Screen 1–100 crypto wallet addresses or list OFAC-sanctioned wallets by chain/program. | `address` or `cryptoAddresses`, `currency` (`"XBT"`, `"ETH"`, `"USDT"`, `"TRX"`, `"XMR"`), `programFilter`, `maxResults` (`25`) |
| `search_ofac_sanctions_by_program` | Browse/filter SDN & Consolidated Non-SDN entries by OFAC program, country, entity type, or keyword. | `programFilter`, `countryFilter`, `entityType` (`"all"`), `listSource` (`"ALL"`), `keyword`, `maxResults` (`25`) |

### Canonical MCP Tool Call Payloads

**Entity / KYB Screening (`screen_entities_ofac_aml`):**
```json
{
  "queries": ["AEROCARIBBEAN AIRLINES", "AERO-CARIBBEAN", "ACME WIDGETS LLC"],
  "minMatchScore": 70,
  "includeClearResults": true
}
```

**Crypto Wallet Screening (`screen_crypto_wallet_sanctions`):**
```json
{
  "cryptoAddresses": ["TNiq9AXBp9EjUqhDhrwrfvAA8U3GUQZH81"],
  "includeClearResults": true
}
```

**Program / Country Browse (`search_ofac_sanctions_by_program`):**
```json
{
  "programFilter": "RUSSIA-EO14024",
  "entityType": "vessel",
  "maxResults": 10
}
```

## Execution Workflow

1. **Choose the Right Tool:** Use `screen_entities_ofac_aml` for names, `screen_crypto_wallet_sanctions` for blockchain addresses, and `search_ofac_sanctions_by_program` for regulatory program/country sweeps.
2. **Triage by `matchDecision` & `matchScore`:** Treat `EXACT_SANCTIONS_HIT` (`92–100`) and `STRONG_ALIAS_MATCH` (`88–98`) as confirmed matches requiring immediate block/escalation; route `POTENTIAL_FUZZY_MATCH` (`70–87`) for manual analyst review using `idNumbers`, `countries`, and `addresses`.
3. **Anchor to Authoritative Evidence:** Always cite `ofacEntNum`, `listSource`, `primaryName`, `matchedAlias`, `programs`, `cryptoWallets`, and `idNumbers` directly from the returned dossier.
