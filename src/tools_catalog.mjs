// Auto-generated deterministic read-only MCP tool schemas & frozen endpoint allowlist.
// Zero filesystem or shell access. All 34 tools are strictly read-only public-registry queries.

export const SERVER_INFO = Object.freeze({
  "name": "open-data-mcp-servers",
  "version": "1.3.0",
  "description": "Unified STDIO-to-Streamable-HTTP MCP router for 14 official US/EU public-registry & RFC security MCP servers (34 read-only tools)."
});

export const TOOL_ROUTES = Object.freeze({
  "audit_domain_posture": {
    "slug": "b2b-domain-mail-security-posture",
    "endpoint": "https://desastreger--b2b-domain-mail-security-posture.apify.actor/mcp"
  },
  "batch_audit_domains": {
    "slug": "b2b-domain-mail-security-posture",
    "endpoint": "https://desastreger--b2b-domain-mail-security-posture.apify.actor/mcp"
  },
  "lookup_us_hts_tariff": {
    "slug": "cross-border-tariff-eu-trade-mcp",
    "endpoint": "https://desastreger--cross-border-tariff-eu-trade-mcp.apify.actor/mcp"
  },
  "verify_eu_vat_numbers": {
    "slug": "cross-border-tariff-eu-trade-mcp",
    "endpoint": "https://desastreger--cross-border-tariff-eu-trade-mcp.apify.actor/mcp"
  },
  "search_eu_ted_tenders": {
    "slug": "cross-border-tariff-eu-trade-mcp",
    "endpoint": "https://desastreger--cross-border-tariff-eu-trade-mcp.apify.actor/mcp"
  },
  "search_epa_facility_violations": {
    "slug": "epa-echo-industrial-facility-compliance",
    "endpoint": "https://desastreger--epa-echo-industrial-facility-compliance.apify.actor/mcp"
  },
  "lookup_facility_compliance": {
    "slug": "epa-echo-industrial-facility-compliance",
    "endpoint": "https://desastreger--epa-echo-industrial-facility-compliance.apify.actor/mcp"
  },
  "search_expiring_recompete_contracts": {
    "slug": "federal-govcon-recompete-radar",
    "endpoint": "https://desastreger--federal-govcon-recompete-radar.apify.actor/mcp"
  },
  "search_open_federal_grants": {
    "slug": "federal-govcon-recompete-radar",
    "endpoint": "https://desastreger--federal-govcon-recompete-radar.apify.actor/mcp"
  },
  "find_clinical_trial_investigators": {
    "slug": "openalex-pubmed-expert-finder-mcp",
    "endpoint": "https://desastreger--openalex-pubmed-expert-finder-mcp.apify.actor/mcp"
  },
  "search_pubmed_kol_experts": {
    "slug": "openalex-pubmed-expert-finder-mcp",
    "endpoint": "https://desastreger--openalex-pubmed-expert-finder-mcp.apify.actor/mcp"
  },
  "search_startup_funding_leads": {
    "slug": "sec-form-d-funding-leads",
    "endpoint": "https://desastreger--sec-form-d-funding-leads.apify.actor/mcp"
  },
  "get_company_funding_dossier": {
    "slug": "sec-form-d-funding-leads",
    "endpoint": "https://desastreger--sec-form-d-funding-leads.apify.actor/mcp"
  },
  "summarize_funding_market": {
    "slug": "sec-form-d-funding-leads",
    "endpoint": "https://desastreger--sec-form-d-funding-leads.apify.actor/mcp"
  },
  "search_healthcare_practice_owners": {
    "slug": "us-healthcare-practice-owners",
    "endpoint": "https://desastreger--us-healthcare-practice-owners.apify.actor/mcp"
  },
  "lookup_practice_by_npi": {
    "slug": "us-healthcare-practice-owners",
    "endpoint": "https://desastreger--us-healthcare-practice-owners.apify.actor/mcp"
  },
  "screen_company_kyb": {
    "slug": "us-kyb-compliance-dossier",
    "endpoint": "https://desastreger--us-kyb-compliance-dossier.apify.actor/mcp"
  },
  "batch_screen_companies": {
    "slug": "us-kyb-compliance-dossier",
    "endpoint": "https://desastreger--us-kyb-compliance-dossier.apify.actor/mcp"
  },
  "search_metro_building_permits": {
    "slug": "us-metro-building-trade-permits",
    "endpoint": "https://desastreger--us-metro-building-trade-permits.apify.actor/mcp"
  },
  "list_supported_permit_metros": {
    "slug": "us-metro-building-trade-permits",
    "endpoint": "https://desastreger--us-metro-building-trade-permits.apify.actor/mcp"
  },
  "search_code_violation_leads": {
    "slug": "us-municipal-code-violation-distressed-leads",
    "endpoint": "https://desastreger--us-municipal-code-violation-distressed-leads.apify.actor/mcp"
  },
  "list_code_violation_metros": {
    "slug": "us-municipal-code-violation-distressed-leads",
    "endpoint": "https://desastreger--us-municipal-code-violation-distressed-leads.apify.actor/mcp"
  },
  "search_form4_insider_trades": {
    "slug": "sec-form4-insider-cluster-signals",
    "endpoint": "https://desastreger--sec-form4-insider-cluster-signals.apify.actor/mcp"
  },
  "get_company_insider_dossier": {
    "slug": "sec-form4-insider-cluster-signals",
    "endpoint": "https://desastreger--sec-form4-insider-cluster-signals.apify.actor/mcp"
  },
  "detect_insider_cluster_buys": {
    "slug": "sec-form4-insider-cluster-signals",
    "endpoint": "https://desastreger--sec-form4-insider-cluster-signals.apify.actor/mcp"
  },
  "search_fda_device_clearances": {
    "slug": "fda-medtech-510k-approval-tracker",
    "endpoint": "https://desastreger--fda-medtech-510k-approval-tracker.apify.actor/mcp"
  },
  "get_medtech_applicant_dossier": {
    "slug": "fda-medtech-510k-approval-tracker",
    "endpoint": "https://desastreger--fda-medtech-510k-approval-tracker.apify.actor/mcp"
  },
  "lookup_fda_clearance_by_id": {
    "slug": "fda-medtech-510k-approval-tracker",
    "endpoint": "https://desastreger--fda-medtech-510k-approval-tracker.apify.actor/mcp"
  },
  "search_nonprofit_990_leads": {
    "slug": "irs-990-nonprofit-grantmaker-leads",
    "endpoint": "https://desastreger--irs-990-nonprofit-grantmaker-leads.apify.actor/mcp"
  },
  "get_nonprofit_990_dossier": {
    "slug": "irs-990-nonprofit-grantmaker-leads",
    "endpoint": "https://desastreger--irs-990-nonprofit-grantmaker-leads.apify.actor/mcp"
  },
  "screen_high_asset_foundations": {
    "slug": "irs-990-nonprofit-grantmaker-leads",
    "endpoint": "https://desastreger--irs-990-nonprofit-grantmaker-leads.apify.actor/mcp"
  },
  "search_exploited_vulnerabilities": {
    "slug": "cisa-kev-nvd-exploit-prioritizer-mcp",
    "endpoint": "https://desastreger--cisa-kev-nvd-exploit-prioritizer-mcp.apify.actor/mcp"
  },
  "score_cve_exploit_risk": {
    "slug": "cisa-kev-nvd-exploit-prioritizer-mcp",
    "endpoint": "https://desastreger--cisa-kev-nvd-exploit-prioritizer-mcp.apify.actor/mcp"
  },
  "summarize_vendor_kev_exposure": {
    "slug": "cisa-kev-nvd-exploit-prioritizer-mcp",
    "endpoint": "https://desastreger--cisa-kev-nvd-exploit-prioritizer-mcp.apify.actor/mcp"
  }
});

export const MCP_TOOLS = Object.freeze([
  {
    "name": "audit_domain_posture",
    "description": "Audit a single B2B domain (accepts raw domain, URL, or email address) via pure RFC protocols: DNS MX Email Provider (Google Workspace, Microsoft 365, Proofpoint, Mimecast, etc.), SPF policy & third-party SaaS senders (HubSpot, Salesforce, SendGrid, etc.), DMARC spoofing vulnerability, TLS X.509 certificate & SAN subdomains, IANA RDAP domain age & registrar, RIPEstat BGP/ASN hosting, and 0-100 security posture score.",
    "inputSchema": {
      "type": "object",
      "required": [
        "domain"
      ],
      "properties": {
        "domain": {
          "type": "string",
          "description": "Raw domain, website URL, or email address to audit (e.g., \"stripe.com\" or \"ceo@apify.com\")."
        },
        "includeTlsCertCheck": {
          "type": "boolean",
          "description": "Inspect live TLS X.509 certificate & SAN subdomains on port 443. Default: true.",
          "default": true
        },
        "includeRdapDomainAge": {
          "type": "boolean",
          "description": "Query official IANA RDAP bootstrap for domain registration age & registrar. Default: true.",
          "default": true
        },
        "includeBgpAsnLookup": {
          "type": "boolean",
          "description": "Query RIPEstat BGP/ASN prefix-overview for primary IPv4 hosting holder. Default: true.",
          "default": true
        }
      },
      "additionalProperties": false
    },
    "annotations": {
      "title": "Audit Domain Posture",
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": true
    }
  },
  {
    "name": "batch_audit_domains",
    "description": "Batch-audit up to 50 B2B domains concurrently via pure RFC protocols (DNS MX/SPF/DMARC/NS, TLS X.509 certificates, official IANA RDAP domain age & registrar, and RIPEstat BGP/ASN hosting) for GTM enrichment, MSP security prospecting, and vendor KYB triage.",
    "inputSchema": {
      "type": "object",
      "required": [
        "domains"
      ],
      "properties": {
        "domains": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "Array of domains, URLs, or email addresses to audit (1-50 per MCP call)."
        },
        "includeTlsCertCheck": {
          "type": "boolean",
          "description": "Inspect live TLS X.509 certificates on port 443. Default: true.",
          "default": true
        },
        "includeRdapDomainAge": {
          "type": "boolean",
          "description": "Query official IANA RDAP domain age & registrar. Default: true.",
          "default": true
        },
        "includeBgpAsnLookup": {
          "type": "boolean",
          "description": "Query RIPEstat BGP/ASN hosting infrastructure. Default: true.",
          "default": true
        },
        "concurrency": {
          "type": "integer",
          "description": "Parallel inspection concurrency (1-20). Default: 5.",
          "default": 5
        }
      },
      "additionalProperties": false
    },
    "annotations": {
      "title": "Batch Audit Domains",
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": true
    }
  },
  {
    "name": "lookup_us_hts_tariff",
    "description": "Look up official US Harmonized Tariff Schedule (HTS) duty rates from USITC, deterministically compute base ad-valorem USD duty estimates for a shipment value, inherit 8-digit parent rates on statistical subheadings, and flag Chapter 99 / Section 301 trade-remedy footnotes.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "htsKeywords": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "Product keywords or 4-10 digit HTS code prefixes (e.g., [\"lithium ion\"], [\"8507.60\"], [\"semiconductor\"])."
        },
        "keyword": {
          "type": "string",
          "description": "Optional single keyword or HTS code query (alias merged with htsKeywords)."
        },
        "shipmentValueUsd": {
          "type": "number",
          "description": "Customs shipment value in USD for deterministic ad-valorem duty calculation. Default: 10000.",
          "default": 10000
        },
        "maxResults": {
          "type": "integer",
          "description": "Maximum HTS tariff records to return (1-50 in MCP mode). Default: 10.",
          "default": 10
        }
      },
      "additionalProperties": false
    },
    "annotations": {
      "title": "Lookup US HTS Tariff",
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": true
    }
  },
  {
    "name": "verify_eu_vat_numbers",
    "description": "Verify European Union corporate VAT numbers in real time via the official European Commission VIES REST API, returning legal entity names, registered addresses, and member-state availability status.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "euVatNumbers": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "EU VAT numbers including 2-letter country prefix (e.g., [\"IE6388047V\", \"DE123456789\"])."
        },
        "vatNumber": {
          "type": "string",
          "description": "Optional single EU VAT number string (alias merged with euVatNumbers)."
        },
        "maxResults": {
          "type": "integer",
          "description": "Maximum VAT verification records to return (1-50 in MCP mode). Default: 10.",
          "default": 10
        }
      },
      "additionalProperties": false
    },
    "annotations": {
      "title": "Verify EU VAT Numbers",
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": true
    }
  },
  {
    "name": "search_eu_ted_tenders",
    "description": "Search European public procurement tenders and contract notices from the official EU Tenders Electronic Daily (TED) Open API v3 by keywords, 8-digit CPV codes, and 3-letter ISO country codes.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "tedKeywords": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "Keywords (e.g., [\"cybersecurity\", \"cloud\"]) or 8-digit CPV codes (e.g., [\"72000000\"])."
        },
        "keyword": {
          "type": "string",
          "description": "Optional single keyword or CPV code string (alias merged with tedKeywords)."
        },
        "tedCountries": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "Optional 3-letter ISO country codes (e.g., [\"DEU\", \"FRA\", \"IRL\", \"NLD\"])."
        },
        "maxResults": {
          "type": "integer",
          "description": "Maximum EU tender notices to return (1-50 in MCP mode). Default: 10.",
          "default": 10
        }
      },
      "additionalProperties": false
    },
    "annotations": {
      "title": "Search EU TED Tenders",
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": true
    }
  },
  {
    "name": "search_epa_facility_violations",
    "description": "Screen US industrial facilities, manufacturing plants, refineries, and utilities for Clean Water Act (NPDES), Clean Air Act, and RCRA hazardous waste violations, SNC/HPV flags, inspections, and civil penalties via official US EPA ECHO REST APIs.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "programs": {
          "type": "array",
          "items": {
            "type": "string",
            "enum": [
              "cwa",
              "air",
              "rcra"
            ]
          },
          "description": "EPA statute programs to query: \"cwa\" (Clean Water Act NPDES), \"air\" (Clean Air Act), \"rcra\" (RCRA Hazardous Waste). Default: [\"cwa\", \"air\"].",
          "default": [
            "cwa",
            "air"
          ]
        },
        "states": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "2-letter US state codes (e.g., [\"DE\"], [\"TX\", \"LA\"]). Default: [\"DE\"].",
          "default": [
            "DE"
          ]
        },
        "violationsOnly": {
          "type": "boolean",
          "description": "Return only facilities with violations, SNC/HPV flags, formal enforcement actions, or penalties. Default: true.",
          "default": true
        },
        "facilityName": {
          "type": "string",
          "description": "Optional partial or exact facility/company name filter."
        },
        "city": {
          "type": "string",
          "description": "Optional city name filter."
        },
        "naicsCode": {
          "type": "string",
          "description": "Optional 2-to-6 digit NAICS industry code prefix (e.g., \"325\")."
        },
        "minPenaltyUsd": {
          "type": "number",
          "description": "Minimum total formal enforcement civil penalties in USD. Default: 0.",
          "default": 0
        },
        "maxResults": {
          "type": "integer",
          "description": "Maximum facility records to return (1-50 in MCP mode). Default: 10.",
          "default": 10
        }
      },
      "additionalProperties": false
    },
    "annotations": {
      "title": "Search EPA Facility Violations",
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": true
    }
  },
  {
    "name": "lookup_facility_compliance",
    "description": "Look up cross-statute US EPA compliance history, permits, inspections, SNC status, and penalties for a specific facility by EPA FRS Registry ID, source permit ID (NPDES/AIR/RCRA), or facility name.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "registryId": {
          "type": "string",
          "description": "EPA FRS 12-digit Registry ID (e.g., \"110000338652\")."
        },
        "sourcePermitId": {
          "type": "string",
          "description": "Program-specific NPDES, CAA, or RCRA source permit ID (e.g., \"DE0000299\")."
        },
        "facilityName": {
          "type": "string",
          "description": "Facility or company name when Registry ID / Permit ID is unknown."
        },
        "state": {
          "type": "string",
          "description": "Optional 2-letter US state code to scope facilityName lookups (e.g., \"DE\")."
        },
        "city": {
          "type": "string",
          "description": "Optional city filter for facilityName lookups."
        },
        "programs": {
          "type": "array",
          "items": {
            "type": "string",
            "enum": [
              "cwa",
              "air",
              "rcra"
            ]
          },
          "description": "Statute programs to check for this facility. Default: [\"cwa\", \"air\", \"rcra\"].",
          "default": [
            "cwa",
            "air",
            "rcra"
          ]
        },
        "violationsOnly": {
          "type": "boolean",
          "description": "When false (default for lookup), returns both clean and non-compliant permits held by the facility.",
          "default": false
        },
        "maxResults": {
          "type": "integer",
          "description": "Maximum permit compliance records to return (1-50). Default: 10.",
          "default": 10
        }
      },
      "additionalProperties": false
    },
    "annotations": {
      "title": "Lookup Facility Compliance",
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": true
    }
  },
  {
    "name": "search_expiring_recompete_contracts",
    "description": "Search active US federal contracts (USASpending.gov) expiring within the next N days to identify incumbent recompete capture opportunities, incumbent vendor names, obligated contract values, NAICS codes, and awarding agencies.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "keywords": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "Optional domain keywords (e.g., [\"cybersecurity\", \"cloud migration\"])."
        },
        "naicsCodes": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "Optional 6-digit NAICS codes (e.g., [\"541512\", \"541511\"])."
        },
        "expiringWithinDays": {
          "type": "integer",
          "description": "Days ahead from today for Period of Performance End Date (1-1095). Default: 180.",
          "default": 180
        },
        "minAwardAmount": {
          "type": "number",
          "description": "Minimum contract award value in USD. Default: 50000.",
          "default": 50000
        },
        "states": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "Optional 2-letter US Place of Performance state codes (e.g., [\"VA\", \"MD\", \"DC\"])."
        },
        "sortBy": {
          "type": "string",
          "enum": [
            "amount_desc",
            "expiration_asc"
          ],
          "description": "Sort by highest contract value (\"amount_desc\") or soonest expiration (\"expiration_asc\").",
          "default": "amount_desc"
        },
        "maxResults": {
          "type": "integer",
          "description": "Maximum recompete contracts to return (1-50 in MCP mode). Default: 10.",
          "default": 10
        }
      },
      "additionalProperties": false
    },
    "annotations": {
      "title": "Search Expiring Recompete Contracts",
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": true
    }
  },
  {
    "name": "search_open_federal_grants",
    "description": "Search live open (\"posted\") and upcoming (\"forecasted\") US federal grant & R&D funding opportunities directly from official Grants.gov APIs.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "keywords": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "Optional topic keywords (e.g., [\"artificial intelligence\", \"quantum\"])."
        },
        "keyword": {
          "type": "string",
          "description": "Optional single keyword string query (alias merged with keywords)."
        },
        "agencies": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "Optional federal agency codes filter (e.g., [\"DOD\", \"NSF\", \"HHS\", \"DOE\"])."
        },
        "oppStatuses": {
          "type": "string",
          "description": "Pipe-delimited Grants.gov statuses. Default: \"forecasted|posted\".",
          "default": "forecasted|posted"
        },
        "maxResults": {
          "type": "integer",
          "description": "Maximum grant opportunities to return (1-50 in MCP mode). Default: 10.",
          "default": 10
        }
      },
      "additionalProperties": false
    },
    "annotations": {
      "title": "Search Open Federal Grants",
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": true
    }
  },
  {
    "name": "find_clinical_trial_investigators",
    "description": "Find active Recruiting and upcoming clinical trial Principal Investigators, direct Central Contacts (unmasked emails and phone numbers), biotech/pharma vs academic sponsors, trial phases, and clinical sites via official NIH ClinicalTrials.gov REST API v2.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "query": {
          "type": "string",
          "description": "Therapeutic area, biomarker, disease, or modality keyword (e.g., \"CAR-T immunotherapy\", \"CRISPR\", \"KRAS G12C\").",
          "default": "CAR-T immunotherapy"
        },
        "trialStatuses": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "ClinicalTrials.gov v2 recruitment statuses (e.g., [\"RECRUITING\", \"NOT_YET_RECRUITING\"]).",
          "default": [
            "RECRUITING",
            "NOT_YET_RECRUITING"
          ]
        },
        "requireDirectContact": {
          "type": "boolean",
          "description": "When true, only return trials exposing a direct unmasked contact email or phone number.",
          "default": false
        },
        "maxResults": {
          "type": "integer",
          "description": "Maximum trial investigator leads to return (1-50 in MCP mode). Default: 10.",
          "default": 10
        }
      },
      "additionalProperties": false
    },
    "annotations": {
      "title": "Find Clinical Trial Investigators",
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": true
    }
  },
  {
    "name": "search_pubmed_kol_experts",
    "description": "Search peer-reviewed biomedical Key Opinion Leaders (KOLs) and Principal Investigators from official PubMed / EMBL-EBI Europe PMC APIs, extracting institutional affiliations, corresponding emails, citation counts, NIH/research grant IDs, ORCIDs, and open-access links.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "query": {
          "type": "string",
          "description": "Biomedical topic, disease, target, or R&D technology query (e.g., \"CAR-T immunotherapy\", \"GLP-1 obesity\").",
          "default": "CAR-T immunotherapy"
        },
        "minCitations": {
          "type": "integer",
          "description": "Minimum citation count filter for KOL publications. Default: 0.",
          "default": 0
        },
        "maxResults": {
          "type": "integer",
          "description": "Maximum PubMed KOL leads to return (1-50 in MCP mode). Default: 10.",
          "default": 10
        }
      },
      "additionalProperties": false
    },
    "annotations": {
      "title": "Search Pubmed KOL Experts",
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": true
    }
  },
  {
    "name": "search_startup_funding_leads",
    "description": "Search real-time US startup venture & private placement funding rounds from official SEC EDGAR Form D filings. Returns decision-maker names/titles, phone, HQ address, exact amount raised, EIN, and optional federal grant history.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "daysBack": {
          "type": "integer",
          "description": "Lookback window in days (1-365). Default: 7.",
          "default": 7
        },
        "startDate": {
          "type": "string",
          "description": "Optional explicit YYYY-MM-DD start date."
        },
        "endDate": {
          "type": "string",
          "description": "Optional explicit YYYY-MM-DD end date."
        },
        "maxResults": {
          "type": "integer",
          "description": "Maximum leads to return (1-50 in MCP mode). Default: 10.",
          "default": 10
        },
        "operatingCompaniesOnly": {
          "type": "boolean",
          "description": "Exclude pooled hedge/PE/VC funds and SPVs so only operating startups are returned. Default: true.",
          "default": true
        },
        "minAmountSold": {
          "type": "number",
          "description": "Minimum USD capital already closed in the round (e.g., 250000).",
          "default": 0
        },
        "states": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "Filter by 2-letter US state codes (e.g., [\"CA\", \"NY\", \"TX\"])."
        },
        "industries": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "Filter by industry keywords (e.g., [\"Technology\", \"Biotechnology\", \"Health Care\"])."
        },
        "searchQuery": {
          "type": "string",
          "description": "Optional full-text keyword or company name filter."
        },
        "enrichWithFederalAwards": {
          "type": "boolean",
          "description": "Cross-check USASpending.gov for SBIR/STTR grants & federal contracts. Default: false.",
          "default": false
        }
      },
      "additionalProperties": false
    },
    "annotations": {
      "title": "Search Startup Funding Leads",
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": true
    }
  },
  {
    "name": "get_company_funding_dossier",
    "description": "Look up a specific US private company by name or CIK across SEC EDGAR Form D filings, SEC entity metadata (EIN, SIC, prior rounds), and USASpending.gov federal contracts/grants.",
    "inputSchema": {
      "type": "object",
      "required": [
        "companyQuery"
      ],
      "properties": {
        "companyQuery": {
          "type": "string",
          "description": "Company legal name or 10-digit SEC CIK."
        },
        "daysBack": {
          "type": "integer",
          "description": "Lookback window in days (default: 365).",
          "default": 365
        }
      },
      "additionalProperties": false
    },
    "annotations": {
      "title": "Get Company Funding Dossier",
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": true
    }
  },
  {
    "name": "summarize_funding_market",
    "description": "Aggregate recent US private placement volume, median/total capital raised, top states, and top industries from recent SEC Form D operating startup filings.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "daysBack": {
          "type": "integer",
          "description": "Lookback window in days (default: 7).",
          "default": 7
        },
        "sampleSize": {
          "type": "integer",
          "description": "Number of operating startup filings to analyze (5-50, default: 20).",
          "default": 20
        }
      },
      "additionalProperties": false
    },
    "annotations": {
      "title": "Summarize Funding Market",
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": true
    }
  },
  {
    "name": "search_healthcare_practice_owners",
    "description": "Search US dental, medspa, dermatology, physical therapy, chiropractic, optometry, urgent care, pharmacy, and specialty healthcare practice organizations (CMS NPPES v2.1 NPI-2) to extract Authorized Official (owner/president) names, clinician credentials (DDS, DMD, MD, DO, PT), direct phone numbers, ownership classification, and 0-100 B2B lead scores.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "specialty": {
          "type": "string",
          "enum": [
            "dentist",
            "orthodontics",
            "dermatology",
            "physical_therapy",
            "chiropractic",
            "optometry",
            "mental_health",
            "urgent_care",
            "ambulatory_surgery",
            "home_health",
            "pharmacy",
            "plastic_surgery",
            "custom"
          ],
          "description": "Healthcare specialty preset (e.g., \"dentist\", \"orthodontics\", \"dermatology\", \"physical_therapy\", \"chiropractic\", \"optometry\", \"plastic_surgery\", \"custom\"). Default: \"dentist\".",
          "default": "dentist"
        },
        "customTaxonomy": {
          "type": "string",
          "description": "Optional custom CMS NPPES taxonomy_description when specialty is \"custom\" (e.g., \"Podiatrist\", \"Ophthalmology\")."
        },
        "states": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "2-letter US state codes (e.g., [\"TX\", \"FL\"]). Default: [\"TX\"].",
          "default": [
            "TX"
          ]
        },
        "city": {
          "type": "string",
          "description": "Optional city filter (e.g., \"Austin\", \"Dallas\")."
        },
        "postalCode": {
          "type": "string",
          "description": "Optional 5-digit ZIP code or wildcard ZIP prefix (e.g., \"752*\")."
        },
        "requireAuthorizedOfficial": {
          "type": "boolean",
          "description": "Only emit practices with a named Authorized Official. Default: true.",
          "default": true
        },
        "independentPracticesOnly": {
          "type": "boolean",
          "description": "Filter out massive corporate hospital/pharmacy/DSO chains (Walgreens, CVS, HCA, Kaiser, Aspen Dental) and multi-location corporate groups. Default: false.",
          "default": false
        },
        "maxResults": {
          "type": "integer",
          "description": "Maximum practice owner leads to return (1-100 in MCP mode). Default: 10.",
          "default": 10
        }
      },
      "additionalProperties": false
    },
    "annotations": {
      "title": "Search Healthcare Practice Owners",
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": true
    }
  },
  {
    "name": "lookup_practice_by_npi",
    "description": "Look up a specific US healthcare practice organization by its 10-digit National Provider Identifier (NPI) from CMS NPPES v2.1 and return normalized Authorized Official, phones, taxonomy, ownership type, and lead score.",
    "inputSchema": {
      "type": "object",
      "required": [
        "npi"
      ],
      "properties": {
        "npi": {
          "type": "string",
          "description": "10-digit US National Provider Identifier (e.g., \"1043458821\")."
        }
      },
      "additionalProperties": false
    },
    "annotations": {
      "title": "Lookup Practice By NPI",
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": true
    }
  },
  {
    "name": "screen_company_kyb",
    "description": "Generate a deterministic Know-Your-Business (KYB) & vendor compliance dossier for a single company across 5 official public registries: GLEIF Global LEI, SEC EDGAR, FDA openFDA Recalls, CFPB Consumer Complaints, and USASpending Federal Contracts.",
    "inputSchema": {
      "type": "object",
      "required": [
        "companyName"
      ],
      "properties": {
        "companyName": {
          "type": "string",
          "description": "Company legal or trade name to screen (e.g., \"Pfizer\", \"Medtronic\")."
        },
        "includeGleifLei": {
          "type": "boolean",
          "description": "Cross-check GLEIF Global LEI registry (ACTIVE/ISSUED status, jurisdiction, HQ address). Default: true.",
          "default": true
        },
        "includeSecFilings": {
          "type": "boolean",
          "description": "Cross-check SEC EDGAR EFTS filings (CIK, display names, recent 10-K/10-Q/8-K/Form D filings). Default: true.",
          "default": true
        },
        "includeFdaEnforcement": {
          "type": "boolean",
          "description": "Cross-check FDA openFDA Drug & Device recall enforcement databases. Default: true.",
          "default": true
        },
        "includeCfpbComplaints": {
          "type": "boolean",
          "description": "Cross-check CFPB Consumer Complaint database. Default: true.",
          "default": true
        },
        "includeFederalAwards": {
          "type": "boolean",
          "description": "Cross-check USASpending.gov prime federal contract awards (A/B/C/D). Default: true.",
          "default": true
        }
      },
      "additionalProperties": false
    },
    "annotations": {
      "title": "Screen Company KYB",
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": true
    }
  },
  {
    "name": "batch_screen_companies",
    "description": "Batch-screen up to 20 companies across GLEIF LEI, SEC EDGAR, FDA openFDA Recalls, CFPB Consumer Complaints, and USASpending Federal Contracts, returning deterministic 0-100 KYB verification scores, verification statuses, and risk flags.",
    "inputSchema": {
      "type": "object",
      "required": [
        "companies"
      ],
      "properties": {
        "companies": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "Array of up to 20 company names to screen (e.g., [\"Pfizer\", \"Medtronic\"]).",
          "minItems": 1,
          "maxItems": 20
        },
        "includeGleifLei": {
          "type": "boolean",
          "description": "Cross-check GLEIF Global LEI registry (ACTIVE/ISSUED status, jurisdiction, HQ address). Default: true.",
          "default": true
        },
        "includeSecFilings": {
          "type": "boolean",
          "description": "Cross-check SEC EDGAR EFTS filings (CIK, display names, recent 10-K/10-Q/8-K/Form D filings). Default: true.",
          "default": true
        },
        "includeFdaEnforcement": {
          "type": "boolean",
          "description": "Cross-check FDA openFDA Drug & Device recall enforcement databases. Default: true.",
          "default": true
        },
        "includeCfpbComplaints": {
          "type": "boolean",
          "description": "Cross-check CFPB Consumer Complaint database. Default: true.",
          "default": true
        },
        "includeFederalAwards": {
          "type": "boolean",
          "description": "Cross-check USASpending.gov prime federal contract awards (A/B/C/D). Default: true.",
          "default": true
        }
      },
      "additionalProperties": false
    },
    "annotations": {
      "title": "Batch Screen Companies",
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": true
    }
  },
  {
    "name": "search_metro_building_permits",
    "description": "Search live municipal building, solar PV, roofing, electrical, HVAC/mechanical, plumbing, new construction, and commercial remodel permits across major US metros (Chicago, Austin, Seattle, Los Angeles, San Francisco) with contractor names, valuations, and B2B lead scores.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "metros": {
          "type": "array",
          "items": {
            "type": "string",
            "enum": [
              "chicago",
              "austin",
              "seattle",
              "los_angeles",
              "san_francisco"
            ]
          },
          "description": "US metro portals to query. Supported keys: \"chicago\", \"austin\", \"seattle\", \"los_angeles\", \"san_francisco\". Default: [\"chicago\", \"austin\", \"seattle\"].",
          "default": [
            "chicago",
            "austin",
            "seattle"
          ]
        },
        "tradeFilter": {
          "type": "string",
          "enum": [
            "all",
            "solar",
            "roofing",
            "electrical",
            "hvac_mechanical",
            "plumbing",
            "new_construction",
            "commercial_remodel"
          ],
          "description": "Filter permits by specialty trade or construction category (\"all\", \"solar\", \"roofing\", \"electrical\", \"hvac_mechanical\", \"plumbing\", \"new_construction\", \"commercial_remodel\"). Default: \"all\".",
          "default": "all"
        },
        "minEstimatedCostUsd": {
          "type": "integer",
          "description": "Minimum reported project valuation / estimated cost in USD. Default: 0.",
          "default": 0
        },
        "keywords": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "Optional keywords matched against work description, permit type, contractor name, or address (e.g., [\"EV charger\", \"heat pump\"])."
        },
        "maxResults": {
          "type": "integer",
          "description": "Maximum permit leads to return (1-50 in MCP Standby mode). Default: 10.",
          "default": 10
        }
      },
      "additionalProperties": false
    },
    "annotations": {
      "title": "Search Metro Building Permits",
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": true
    }
  },
  {
    "name": "list_supported_permit_metros",
    "description": "List all supported US municipal building permit Socrata portals (Chicago, Austin, Seattle, Los Angeles, San Francisco), their live dataset URLs, ordering fields, and supported trade filters.",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "additionalProperties": false
    },
    "annotations": {
      "title": "List Supported Permit Metros",
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": true
    }
  },
  {
    "name": "search_code_violation_leads",
    "description": "Search active municipal code enforcement, housing habitability violations, condemned/vacant structures, blight, and distressed property leads across 6 US Socrata portals (Austin, Seattle, San Francisco, Buffalo, Montgomery County MD, Cincinnati) with parcel IDs, geocodes, distress scores, and investor priority tiers.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "metros": {
          "type": "array",
          "items": {
            "type": "string",
            "enum": [
              "austin",
              "seattle",
              "san_francisco",
              "buffalo",
              "montgomery_md",
              "cincinnati"
            ]
          },
          "description": "US municipal portals to query. Supported keys: \"austin\", \"seattle\", \"san_francisco\", \"buffalo\", \"montgomery_md\", \"cincinnati\". Default: [\"austin\", \"san_francisco\", \"buffalo\"].",
          "default": [
            "austin",
            "san_francisco",
            "buffalo"
          ]
        },
        "distressFilter": {
          "type": "string",
          "enum": [
            "all",
            "structural_hazard",
            "vacant_abandoned",
            "fire_electrical_plumbing",
            "housing_habitability",
            "unpermitted_zoning",
            "exterior_blight"
          ],
          "description": "Filter leads by property distress category (\"all\", \"structural_hazard\", \"vacant_abandoned\", \"fire_electrical_plumbing\", \"housing_habitability\", \"unpermitted_zoning\", \"exterior_blight\"). Default: \"all\".",
          "default": "all"
        },
        "openCasesOnly": {
          "type": "boolean",
          "description": "When true, returns only open/active/unresolved municipal code enforcement cases. Default: false.",
          "default": false
        },
        "keywords": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "Optional keywords matched against violation description, violation type, status, parcel ID, or address (e.g., [\"condemned\", \"mold\", \"vacant\"])."
        },
        "maxResults": {
          "type": "integer",
          "description": "Maximum code violation leads to return (1-50 in MCP Standby mode). Default: 10.",
          "default": 10
        }
      },
      "additionalProperties": false
    },
    "annotations": {
      "title": "Search Code Violation Leads",
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": true
    }
  },
  {
    "name": "list_code_violation_metros",
    "description": "List all 6 supported US municipal code enforcement Socrata portals (Austin, Seattle, San Francisco, Buffalo, Montgomery County MD, Cincinnati), their live dataset URLs, ordering fields, and supported distress filters.",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "additionalProperties": false
    },
    "annotations": {
      "title": "List Code Violation Metros",
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": true
    }
  },
  {
    "name": "search_form4_insider_trades",
    "description": "Search real-time US corporate insider buys and sales from official SEC EDGAR Form 4 XML filings. Filter by stock tickers, CIKs, date window, open-market purchases only (code P), Rule 10b5-1 plan exclusion, or minimum USD transaction value. Returns insider role, 10b5-1 flag, transaction rows, clusterBuyCount, and 0-100 signalScore.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "tickers": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "Optional US stock tickers (e.g., [\"NVDA\", \"AAPL\"]). Omit for market-wide Form 4 scan."
        },
        "ciks": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "Optional SEC CIK numbers (e.g., [\"0001045810\"])."
        },
        "daysBack": {
          "type": "integer",
          "description": "Lookback window in days (1-365). Default: 7.",
          "default": 7
        },
        "startDate": {
          "type": "string",
          "description": "Optional explicit YYYY-MM-DD start date."
        },
        "endDate": {
          "type": "string",
          "description": "Optional explicit YYYY-MM-DD end date."
        },
        "openMarketPurchasesOnly": {
          "type": "boolean",
          "description": "Only return filings with open-market purchases (transactionCode = P). Default: false.",
          "default": false
        },
        "exclude10b51Plans": {
          "type": "boolean",
          "description": "Exclude pre-scheduled Rule 10b5-1 plan trades (aff10b5One = true). Default: false.",
          "default": false
        },
        "minTransactionValueUsd": {
          "type": "number",
          "description": "Minimum transaction dollar value in USD. Default: 0.",
          "default": 0
        },
        "searchQuery": {
          "type": "string",
          "description": "Optional company, ticker, or insider name keyword."
        },
        "maxResults": {
          "type": "integer",
          "description": "Maximum signals to return (1-50 in MCP mode). Default: 10.",
          "default": 10
        }
      },
      "additionalProperties": false
    },
    "annotations": {
      "title": "Search SEC Form 4 Insider Trades",
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": true
    }
  },
  {
    "name": "get_company_insider_dossier",
    "description": "Pull a complete insider trading dossier for a specific US public company by stock ticker (e.g., \"NVDA\") or 10-digit SEC CIK, summarizing net insider buying vs selling, Rule 10b5-1 plan ratio, cluster buy count, and recent Form 4 / 4/A filings.",
    "inputSchema": {
      "type": "object",
      "required": [
        "tickerOrCik"
      ],
      "properties": {
        "tickerOrCik": {
          "type": "string",
          "description": "Stock ticker symbol (e.g., \"NVDA\") or 10-digit SEC CIK (e.g., \"0001045810\")."
        },
        "daysBack": {
          "type": "integer",
          "description": "Lookback window in days (1-365). Default: 90.",
          "default": 90
        },
        "maxResults": {
          "type": "integer",
          "description": "Maximum recent Form 4 filings to inspect (1-50). Default: 15.",
          "default": 15
        },
        "includeAmendments": {
          "type": "boolean",
          "description": "Include Form 4/A amended filings. Default: true.",
          "default": true
        }
      },
      "additionalProperties": false
    },
    "annotations": {
      "title": "Get Company Insider Trading Dossier",
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": true
    }
  },
  {
    "name": "detect_insider_cluster_buys",
    "description": "Scan recent SEC Form 4 filings for multi-insider open-market cluster buys (2+ distinct insiders purchasing shares of the same company with code P), prioritizing discretionary C-suite buys outside Rule 10b5-1 plans.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "tickers": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "Optional list of tickers to check for cluster buys. Omit for market-wide scan."
        },
        "daysBack": {
          "type": "integer",
          "description": "Lookback window in days (1-90). Default: 14.",
          "default": 14
        },
        "minClusterSize": {
          "type": "integer",
          "description": "Minimum distinct insiders buying the same ticker (default: 2).",
          "default": 2
        },
        "exclude10b51Plans": {
          "type": "boolean",
          "description": "Exclude Rule 10b5-1 scheduled purchases. Default: true.",
          "default": true
        },
        "minTransactionValueUsd": {
          "type": "number",
          "description": "Minimum USD purchase per filing. Default: 10000.",
          "default": 10000
        },
        "scanLimit": {
          "type": "integer",
          "description": "Number of open-market purchase filings to scan and group (5-100). Default: 40.",
          "default": 40
        }
      },
      "additionalProperties": false
    },
    "annotations": {
      "title": "Detect Insider Cluster Buys",
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": true
    }
  },
  {
    "name": "search_fda_device_clearances",
    "description": "Search newly cleared FDA 510(k) and Premarket Approval (PMA) medical devices via official openFDA APIs, returning normalized device names, direct applicant contact names, mailing addresses, product codes, device classes, FDA summary URLs, and optional openFDA device recall history.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "daysBack": {
          "type": "integer",
          "description": "Number of past days of FDA decision_date records to scan (1-3650). Default: 90.",
          "default": 90
        },
        "submissionType": {
          "type": "string",
          "enum": [
            "all",
            "510k",
            "pma"
          ],
          "description": "Filter by FDA pathway: \"all\" (510k + PMA), \"510k\", or \"pma\". Default: \"all\".",
          "default": "all"
        },
        "applicantQuery": {
          "type": "string",
          "description": "Optional MedTech company/applicant name filter (e.g., \"Boston Scientific\", \"Medtronic\")."
        },
        "deviceKeyword": {
          "type": "string",
          "description": "Optional keyword across device_name, trade_name, or generic_name (e.g., \"catheter\", \"MRI\")."
        },
        "medicalSpecialty": {
          "type": "string",
          "description": "Optional FDA advisory committee / medical specialty (e.g., \"Cardiovascular\", \"Orthopedic\", \"Radiology\")."
        },
        "countryCode": {
          "type": "string",
          "description": "Optional 2-letter ISO country code filter (e.g., \"US\", \"DE\")."
        },
        "includeRecallHistory": {
          "type": "boolean",
          "description": "Enrich each clearance with applicant recall count and latest Class I/II/III recall status. Default: true.",
          "default": true
        },
        "maxResults": {
          "type": "integer",
          "description": "Maximum clearance leads to return (1-50 in MCP mode). Default: 10.",
          "default": 10
        }
      },
      "additionalProperties": false
    },
    "annotations": {
      "title": "Search FDA 510(k) & PMA Device Clearances",
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": true
    }
  },
  {
    "name": "get_medtech_applicant_dossier",
    "description": "Build a 360-degree FDA regulatory dossier for a specific MedTech manufacturer/applicant, combining recent 510(k) clearances (with direct regulatory contacts), PMA approvals/supplements, and full openFDA device recall/enforcement history.",
    "inputSchema": {
      "type": "object",
      "required": [
        "applicantName"
      ],
      "properties": {
        "applicantName": {
          "type": "string",
          "description": "MedTech manufacturer or applicant name (e.g., \"Boston Scientific\", \"Stryker\", \"Medtronic\")."
        },
        "daysBack": {
          "type": "integer",
          "description": "Historical decision_date lookback in days (1-3650). Default: 365.",
          "default": 365
        },
        "submissionType": {
          "type": "string",
          "enum": [
            "all",
            "510k",
            "pma"
          ],
          "description": "Filter clearances by \"all\", \"510k\", or \"pma\". Default: \"all\".",
          "default": "all"
        },
        "maxResults": {
          "type": "integer",
          "description": "Maximum clearance records to return in the dossier (1-50). Default: 15.",
          "default": 15
        }
      },
      "additionalProperties": false
    },
    "annotations": {
      "title": "Get MedTech Applicant Regulatory Dossier",
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": true
    }
  },
  {
    "name": "lookup_fda_clearance_by_id",
    "description": "Look up a specific FDA 510(k) K-number (e.g., \"K261026\") or PMA ID (e.g., \"P900056\") with direct applicant contact info and optional openFDA device recall history.",
    "inputSchema": {
      "type": "object",
      "required": [
        "clearanceId"
      ],
      "properties": {
        "clearanceId": {
          "type": "string",
          "description": "FDA 510(k) K-number (e.g., \"K261026\") or PMA number (e.g., \"P900056\")."
        },
        "includeRecallHistory": {
          "type": "boolean",
          "description": "Include applicant openFDA device recall history. Default: true.",
          "default": true
        }
      },
      "additionalProperties": false
    },
    "annotations": {
      "title": "Lookup FDA 510(k) or PMA Clearance by ID",
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": true
    }
  },
  {
    "name": "search_nonprofit_990_leads",
    "description": "Search US 501(c) nonprofits, hospitals, universities, and private grantmaking foundations via ProPublica Nonprofit Explorer API v2, enriched with latest IRS Form 990 / 990-PF / 990-EZ financials, executive compensation, grants paid, PDF filing URLs, and lead quality scores.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "query": {
          "type": "string",
          "description": "Organization name, city, or mission keyword (e.g., \"foundation\", \"hospital\", \"university\"). Default: \"foundation\".",
          "default": "foundation"
        },
        "state": {
          "type": "string",
          "description": "Optional 2-letter US state abbreviation (e.g., \"NY\", \"CA\", \"TX\")."
        },
        "nteeCategory": {
          "type": "integer",
          "description": "Optional NTEE broad sector ID 1-10 (1=Arts, 2=Education, 3=Environment, 4=Health, 5=Human Services, 6=International, 7=Public/Societal Benefit & Foundations, 8=Religion, 9=Mutual, 10=Unknown)."
        },
        "subsectionCode": {
          "type": "integer",
          "description": "Optional IRS 501(c) subsection code (e.g., 3 for 501(c)(3), 4 for 501(c)(4), 6 for 501(c)(6))."
        },
        "minRevenueUsd": {
          "type": "integer",
          "description": "Minimum latest total revenue in USD. Default: 0.",
          "default": 0
        },
        "minAssetsUsd": {
          "type": "integer",
          "description": "Minimum latest total assets in USD. Default: 0.",
          "default": 0
        },
        "foundationsOnly": {
          "type": "boolean",
          "description": "When true, restrict to private foundations (990-PF) and grantmaking foundations (NTEE T* / grants paid). Default: false.",
          "default": false
        },
        "maxResults": {
          "type": "integer",
          "description": "Maximum leads to return (1-50 in MCP mode). Default: 10.",
          "default": 10
        }
      },
      "additionalProperties": false
    },
    "annotations": {
      "title": "Search IRS Form 990 Nonprofit Leads",
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": true
    }
  },
  {
    "name": "get_nonprofit_990_dossier",
    "description": "Retrieve a complete IRS Form 990/990-PF/990-EZ financial dossier for a specific US nonprofit or foundation by 9-digit EIN (e.g., \"13-1684331\") or organization name (e.g., \"Ford Foundation\"), including up to 5 recent multi-year filings.",
    "inputSchema": {
      "type": "object",
      "required": [
        "einOrQuery"
      ],
      "properties": {
        "einOrQuery": {
          "type": "string",
          "description": "9-digit IRS EIN (with or without hyphen, e.g., \"13-1684331\") or organization name (e.g., \"Ford Foundation\")."
        },
        "state": {
          "type": "string",
          "description": "Optional 2-letter US state filter when searching by name."
        },
        "nteeCategory": {
          "type": "integer",
          "description": "Optional NTEE category (1-10) when searching by name."
        }
      },
      "additionalProperties": false
    },
    "annotations": {
      "title": "Get IRS Form 990 Nonprofit Dossier",
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": true
    }
  },
  {
    "name": "screen_high_asset_foundations",
    "description": "Screen active US grantmaking foundations above a minimum asset threshold (default $1,000,000), returning ranked Form 990-PF and Community Foundation prospects with combined assets, total grants paid, and state breakdown.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "query": {
          "type": "string",
          "description": "Foundation keyword, cause, or city (e.g., \"climate\", \"education\", \"foundation\"). Default: \"foundation\".",
          "default": "foundation"
        },
        "state": {
          "type": "string",
          "description": "Optional 2-letter US state filter (e.g., \"CA\", \"NY\", \"MA\")."
        },
        "nteeCategory": {
          "type": "integer",
          "description": "Optional NTEE sector category ID (1-10)."
        },
        "minAssetsUsd": {
          "type": "integer",
          "description": "Minimum total end-of-year assets in USD. Default: 1000000.",
          "default": 1000000
        },
        "minRevenueUsd": {
          "type": "integer",
          "description": "Minimum total annual revenue in USD. Default: 0.",
          "default": 0
        },
        "maxResults": {
          "type": "integer",
          "description": "Maximum foundations to return (1-50). Default: 10.",
          "default": 10
        }
      },
      "additionalProperties": false
    },
    "annotations": {
      "title": "Screen High-Asset Grantmaking Foundations",
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": true
    }
  },
  {
    "name": "search_exploited_vulnerabilities",
    "description": "Search and prioritize active CISA Known Exploited Vulnerabilities (KEV) filtered by vendor, product, keyword, ransomware linkage, KEV dateAdded window, or minimum FIRST.org EPSS probability. Returns 0-100 patchPriorityScore rankings, federal BOD due dates, EPSS scores, and optional NIST NVD v2 CVSS.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "cveIds": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "Optional specific CVE IDs to include and score (e.g., [\"CVE-2024-3400\"])."
        },
        "vendorProject": {
          "type": "string",
          "description": "Optional vendor/project substring filter (e.g., \"Microsoft\", \"Cisco\", \"Fortinet\")."
        },
        "product": {
          "type": "string",
          "description": "Optional product substring filter (e.g., \"Windows\", \"PAN-OS\", \"IOS XE\")."
        },
        "keyword": {
          "type": "string",
          "description": "Optional keyword or CWE across CVE ID, vendor, product, title, and description."
        },
        "ransomwareOnly": {
          "type": "boolean",
          "description": "Filter to CVEs with knownRansomwareCampaignUse = \"Known\". Default: false.",
          "default": false
        },
        "daysBack": {
          "type": "integer",
          "description": "KEV dateAdded lookback window in days (1-3650). Falls back to most recent matches if 0 inside window when vendorProject/cveIds is set. Default: 90.",
          "default": 90
        },
        "minEpssScore": {
          "type": "number",
          "description": "Minimum FIRST.org EPSS 30d exploit probability (0.0 to 1.0). Default: 0.",
          "default": 0
        },
        "includeNvdCvss": {
          "type": "boolean",
          "description": "Optionally enrich top 3 matched CVEs with NIST NVD v2 CVSS severity/vector. Default: false.",
          "default": false
        },
        "maxResults": {
          "type": "integer",
          "description": "Maximum prioritized advisories to return (1-50 in MCP mode). Default: 10.",
          "default": 10
        }
      },
      "additionalProperties": false
    },
    "annotations": {
      "title": "Search CISA KEV Exploited Vulnerabilities",
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": true
    }
  },
  {
    "name": "score_cve_exploit_risk",
    "description": "Score 1 to 10 specific CVE identifiers (e.g., \"CVE-2024-3400\" or [\"CVE-2021-44228\", \"CVE-2026-132224\"]) by fusing CISA KEV active-exploitation status, FIRST.org EPSS probability/percentile, and NIST NVD v2 CVSS baseScore into a deterministic 0-100 patch priority dossier.",
    "inputSchema": {
      "type": "object",
      "properties": {
        "cveId": {
          "type": "string",
          "description": "Single CVE ID to score (e.g., \"CVE-2024-3400\")."
        },
        "cveIds": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "description": "Optional array of up to 10 CVE IDs to score in one call."
        },
        "includeNvdCvss": {
          "type": "boolean",
          "description": "Fetch NIST NVD v2 CVSS baseScore, vector, and analysis status (capped at 3 CVEs unauthenticated). Default: true.",
          "default": true
        }
      },
      "additionalProperties": false
    },
    "annotations": {
      "title": "Score CVE Exploit Risk (KEV + EPSS + NVD)",
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": true
    }
  },
  {
    "name": "summarize_vendor_kev_exposure",
    "description": "Summarize a software or hardware vendor/project exposure across the live CISA KEV catalog, reporting total KEV entries, ransomware-linked count, overdue BOD directives, top affected products, top CWEs, and EPSS-ranked top vulnerabilities.",
    "inputSchema": {
      "type": "object",
      "required": [
        "vendorProject"
      ],
      "properties": {
        "vendorProject": {
          "type": "string",
          "description": "Vendor or project name substring (e.g., \"Cisco\", \"Microsoft\", \"Ivanti\", \"Fortinet\")."
        },
        "product": {
          "type": "string",
          "description": "Optional product substring filter within the vendor exposure summary."
        },
        "daysBack": {
          "type": "integer",
          "description": "Historical KEV lookback window in days (1-3650). Default: 3650 (full catalog).",
          "default": 3650
        },
        "ransomwareOnly": {
          "type": "boolean",
          "description": "Restrict vendor summary to ransomware-linked KEV entries. Default: false.",
          "default": false
        },
        "includeNvdCvss": {
          "type": "boolean",
          "description": "Optionally enrich top 3 vendor advisories with NIST NVD v2 CVSS. Default: false.",
          "default": false
        },
        "maxResults": {
          "type": "integer",
          "description": "Maximum top-ranked vulnerabilities to include in the vendor summary (1-50). Default: 15.",
          "default": 15
        }
      },
      "additionalProperties": false
    },
    "annotations": {
      "title": "Summarize Vendor CISA KEV Exposure",
      "readOnlyHint": true,
      "destructiveHint": false,
      "idempotentHint": true,
      "openWorldHint": true
    }
  }
]);
