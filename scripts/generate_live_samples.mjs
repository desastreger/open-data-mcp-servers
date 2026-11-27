import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const USER_AGENT = process.env.SEC_USER_AGENT || "RegPulseOpenData/1.0 (ops@regpulse.io)";
const TIMEOUT_MS = 15000;

async function fetchJson(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      "User-Agent": USER_AGENT,
      ...(options.headers || {}),
    },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} from ${url}`);
  }
  return res.json();
}

async function fetchSecFormD() {
  const data = await fetchJson("https://efts.sec.gov/LATEST/search-index?forms=D");
  const hits = (data?.hits?.hits || []).slice(0, 3);
  return hits.map((h) => {
    const src = h._source || {};
    const rawName = Array.isArray(src.display_names) ? src.display_names[0] || "" : "";
    const cikMatch = rawName.match(/\(CIK\s+(\d+)\)/i);
    const cik = cikMatch ? cikMatch[1] : (Array.isArray(src.ciks) ? src.ciks[0] : "");
    const companyName = rawName.replace(/\s*\(CIK\s+\d+\)\s*/i, "").trim() || "N/A";
    const accession = String(h._id || "").split(":")[0];
    return {
      companyName,
      cik: cik || "N/A",
      form: src.form || "D",
      filingDate: src.file_date || "N/A",
      location: Array.isArray(src.biz_locations) ? src.biz_locations[0] || "US" : "US",
      accessionNumber: accession || "N/A",
    };
  });
}

async function fetchUsaSpending() {
  const data = await fetchJson("https://api.usaspending.gov/api/v2/search/spending_by_award/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fields: ["Award ID", "Recipient Name", "Award Amount", "Awarding Agency", "End Date", "NAICS Code"],
      filters: {
        award_type_codes: ["A", "B", "C", "D"],
        time_period: [{ start_date: "2026-01-01", end_date: "2027-12-31" }],
      },
      limit: 3,
      page: 1,
      sort: "Award Amount",
      order: "desc",
    }),
  });
  return (data?.results || []).slice(0, 3).map((r) => ({
    awardId: r["Award ID"] || "N/A",
    recipientName: r["Recipient Name"] || "N/A",
    awardAmountUsd: Number(r["Award Amount"] || 0),
    awardingAgency: r["Awarding Agency"] || "N/A",
    endDate: r["End Date"] || "N/A",
    naicsCode: r["NAICS Code"] || "—",
  }));
}

async function fetchCmsNppes() {
  const data = await fetchJson(
    "https://npiregistry.cms.hhs.gov/api/?version=2.1&enumeration_type=NPI-2&taxonomy_description=Dentist&state=CA&limit=3"
  );
  return (data?.results || []).slice(0, 3).map((item) => {
    const basic = item.basic || {};
    const addr = (item.addresses || [])[0] || {};
    const official = [basic.authorized_official_first_name, basic.authorized_official_last_name]
      .filter(Boolean)
      .join(" ")
      .trim();
    return {
      npi: String(item.number || "N/A"),
      organizationName: basic.organization_name || "N/A",
      authorizedOfficial: official || "N/A",
      officialTitle: basic.authorized_official_title_or_position || "Authorized Official",
      cityState: [addr.city, addr.state].filter(Boolean).join(", ") || "CA",
      phone: addr.telephone_number || "N/A",
    };
  });
}

async function fetchEpaEcho() {
  const step1 = await fetchJson(
    "https://echodata.epa.gov/echo/echo_rest_services.get_facilities?output=JSON&p_st=TX&p_snc=Y&p_act=Y&responseset=3"
  );
  const qid = step1?.Results?.QueryID;
  if (!qid) {
    throw new Error(step1?.Results?.Error?.ErrorMessage || "Missing EPA ECHO QueryID");
  }
  const step2 = await fetchJson(
    `https://echodata.epa.gov/echo/echo_rest_services.get_qid?output=JSON&qid=${encodeURIComponent(qid)}&pageno=1&responseset=3`
  );
  return (step2?.Results?.Facilities || []).slice(0, 3).map((f) => ({
    registryId: f.RegistryID || "N/A",
    facilityName: f.FacName || "N/A",
    location: [f.FacCity, f.FacState].filter(Boolean).join(", ") || "TX",
    sncFlag: f.FacSNCFlg || "N",
    quartersNc: f.FacQtrsWithNC || "0",
    sicCodes: f.FacSICCodes || "—",
  }));
}

async function fetchClinicalTrials() {
  const data = await fetchJson("https://clinicaltrials.gov/api/v2/studies?filter.overallStatus=RECRUITING&pageSize=3");
  return (data?.studies || []).slice(0, 3).map((s) => {
    const p = s.protocolSection || {};
    const idMod = p.identificationModule || {};
    const sponsorMod = p.sponsorCollaboratorsModule || {};
    const designMod = p.designModule || {};
    const contact = (p.contactsLocationsModule?.centralContacts || [])[0] || {};
    return {
      nctId: idMod.nctId || "N/A",
      briefTitle: idMod.briefTitle || "N/A",
      leadSponsor: sponsorMod.leadSponsor?.name || "N/A",
      phases: Array.isArray(designMod.phases) && designMod.phases.length ? designMod.phases.join(", ") : "N/A",
      contactName: contact.name || "Site Contact",
      contactEmail: contact.email || "See NCT record",
    };
  });
}

async function fetchSecForm4() {
  const data = await fetchJson("https://efts.sec.gov/LATEST/search-index?forms=4");
  const hits = (data?.hits?.hits || []).slice(0, 3);
  return hits.map((h) => {
    const src = h._source || {};
    const names = Array.isArray(src.display_names) ? src.display_names : [];
    const owner = (names[0] || "N/A").replace(/\s*\(CIK\s+\d+\)\s*/i, "").trim();
    const issuer = (names[1] || "N/A").replace(/\s*\(CIK\s+\d+\)\s*/i, "").trim();
    const accession = String(h._id || "").split(":")[0];
    return {
      issuer,
      reportingOwner: owner,
      form: src.form || "4",
      filingDate: src.file_date || "N/A",
      accessionNumber: accession || "N/A",
    };
  });
}

async function fetchFda510k() {
  const data = await fetchJson("https://api.fda.gov/device/510k.json?sort=decision_date:desc&limit=3");
  return (data?.results || []).slice(0, 3).map((r) => ({
    kNumber: r.k_number || "N/A",
    deviceName: r.device_name || "N/A",
    applicant: r.applicant || "N/A",
    specialty: r.advisory_committee_description || r.advisory_committee || "N/A",
    productCode: r.product_code || "—",
    decisionDate: r.decision_date || "N/A",
  }));
}

async function fetchIrs990() {
  const FORM_MAP = { 0: "990", 1: "990EZ", 2: "990PF" };
  const search = await fetchJson("https://projects.propublica.org/nonprofits/api/v2/search.json?q=foundation&state%5Bid%5D=NY");
  const candidates = (search?.organizations || []).filter((o) => o?.ein).slice(0, 3);
  const details = await Promise.all(
    candidates.map(async (org) => {
      const einDigits = String(org.ein).padStart(9, "0");
      const detail = await fetchJson(`https://projects.propublica.org/nonprofits/api/v2/organizations/${einDigits}.json`);
      const o = detail?.organization || org;
      const latest = (detail?.filings_with_data || [])[0] || {};
      return {
        formattedEin: org.strein || `${einDigits.slice(0, 2)}-${einDigits.slice(2)}`,
        organizationName: o.name || org.name || "N/A",
        cityState: [o.city || org.city, o.state || org.state].filter(Boolean).join(", ") || "NY",
        formType: FORM_MAP[latest.formtype] || "990",
        taxPeriod: latest.tax_prd ? `${String(latest.tax_prd).slice(0, 4)}-${String(latest.tax_prd).slice(4, 6)}` : "N/A",
        totalRevenueUsd: Number(latest.totrevenue || 0),
        totalAssetsUsd: Number(latest.totassetsend || 0),
      };
    })
  );
  return details;
}

async function fetchCisaKev() {
  const data = await fetchJson("https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json");
  const sorted = [...(data?.vulnerabilities || [])]
    .sort((a, b) => String(b.dateAdded || "").localeCompare(String(a.dateAdded || "")) || String(b.cveID || "").localeCompare(String(a.cveID || "")))
    .slice(0, 3);

  let epssByCve = {};
  if (sorted.length) {
    try {
      const cveParam = sorted.map((v) => v.cveID).filter(Boolean).join(",");
      const epss = await fetchJson(`https://api.first.org/data/v1/epss?cve=${encodeURIComponent(cveParam)}`);
      for (const row of epss?.data || []) {
        if (row?.cve) epssByCve[row.cve.toUpperCase()] = Number(row.epss);
      }
    } catch {
      epssByCve = {};
    }
  }

  return sorted.map((v) => {
    const score = epssByCve[String(v.cveID || "").toUpperCase()];
    return {
      cveId: v.cveID || "N/A",
      vendorProject: v.vendorProject || "N/A",
      product: v.product || "N/A",
      dateAdded: v.dateAdded || "N/A",
      dueDate: v.dueDate || "N/A",
      ransomwareUse: v.knownRansomwareCampaignUse || "Unknown",
      epssPct: Number.isFinite(score) ? `${(score * 100).toFixed(2)}%` : "—",
    };
  });
}

async function fetchSec13f() {
  const data = await fetchJson("https://efts.sec.gov/LATEST/search-index?forms=13F-HR");
  const hits = (data?.hits?.hits || []).slice(0, 3);
  return hits.map((h) => {
    const src = h._source || {};
    const rawName = Array.isArray(src.display_names) ? src.display_names[0] || "" : "";
    const cikMatch = rawName.match(/\(CIK\s+(\d+)\)/i);
    const cik = cikMatch ? cikMatch[1] : Array.isArray(src.ciks) ? src.ciks[0] : "";
    const managerName = rawName.replace(/\s*\(CIK\s+\d+\)\s*/i, "").trim() || "N/A";
    const accession = String(h._id || "").split(":")[0];
    return {
      managerName,
      cik: cik || "N/A",
      form: src.form || "13F-HR",
      periodEnding: src.period_ending || "N/A",
      filingDate: src.file_date || "N/A",
      location: Array.isArray(src.biz_locations) ? src.biz_locations[0] || "US" : "US",
      accessionNumber: accession || "N/A",
    };
  });
}

function parseCsvLine(line) {
  const fields = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        cur += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      fields.push(cur.trim());
      cur = "";
    } else {
      cur += ch;
    }
  }
  fields.push(cur.trim());
  return fields;
}

async function fetchOfacSanctions() {
  const res = await fetch("https://sanctionslistservice.ofac.treas.gov/api/PublicationPreview/exports/SDN.CSV", {
    headers: { "User-Agent": USER_AGENT },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} from OFAC SDN.CSV`);
  }
  const text = await res.text();
  const lines = text.split(/\r?\n/);
  const rows = [];
  for (let i = lines.length - 1; i >= 0 && rows.length < 3; i--) {
    const line = lines[i].trim();
    if (!line || line === "\u001a") continue;
    const cols = parseCsvLine(line);
    const entNum = cols[0];
    const primaryName = cols[1];
    if (!entNum || !/^\d+$/.test(entNum) || !primaryName) continue;
    const rawType = cols[2] && cols[2] !== "-0-" ? cols[2] : "entity";
    const programs = (cols[3] && cols[3] !== "-0-" ? cols[3] : "")
      .split(/\]\s*\[|;/)
      .map((s) => s.replace(/[\[\]]/g, "").trim())
      .filter(Boolean)
      .join(", ");
    const remarks = cols[11] && cols[11] !== "-0-" ? cols[11] : "";
    const walletMatches = remarks.match(/Digital Currency Address\s*-\s*[A-Z0-9]+/gi) || [];
    const remarksPreview = remarks.length > 85 ? `${remarks.slice(0, 82)}...` : remarks || "—";
    rows.push({
      entNum,
      primaryName,
      entityType: rawType,
      programs: programs || "OFAC-SDN",
      walletCount: walletMatches.length,
      remarksPreview,
    });
  }
  return rows;
}

async function fetchFederalRegister() {
  const url =
    "https://www.federalregister.gov/api/v1/documents.json?per_page=3&order=newest" +
    "&conditions%5Btype%5D%5B%5D=RULE&conditions%5Btype%5D%5B%5D=PRORULE&conditions%5Btype%5D%5B%5D=PRESDOCU" +
    "&fields%5B%5D=document_number&fields%5B%5D=title&fields%5B%5D=type&fields%5B%5D=publication_date" +
    "&fields%5B%5D=agencies&fields%5B%5D=cfr_references&fields%5B%5D=comments_close_on&fields%5B%5D=effective_on&fields%5B%5D=significant";
  const data = await fetchJson(url);
  return (data?.results || []).slice(0, 3).map((r) => {
    const agencies = (r.agencies || []).map((a) => a.name).filter(Boolean);
    const cfrRefs = (r.cfr_references || [])
      .map((c) => (c?.title && c?.part ? `${c.title} CFR ${c.part}` : null))
      .filter(Boolean);
    const title = String(r.title || "N/A");
    return {
      documentNumber: r.document_number || "N/A",
      title: title.length > 85 ? `${title.slice(0, 82)}...` : title,
      type: r.type || "N/A",
      agency: agencies[0] || "Federal Agency",
      publicationDate: r.publication_date || "N/A",
      deadlineOrEffective: r.comments_close_on
        ? `Comments: ${r.comments_close_on}`
        : r.effective_on
          ? `Effective: ${r.effective_on}`
          : "—",
      cfr: cfrRefs.slice(0, 2).join(", ") || "—",
    };
  });
}

async function safeCollect(label, fn) {
  try {
    const records = await fn();
    return { label, ok: true, error: null, records };
  } catch (err) {
    return { label, ok: false, error: err instanceof Error ? err.message : String(err), records: [] };
  }
}

function mdCell(val) {
  return String(val ?? "")
    .replace(/\|/g, "\\|")
    .replace(/\r?\n/g, " ")
    .trim();
}

function escapeHtml(val) {
  return String(val ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatUsd(amount) {
  if (!Number.isFinite(amount) || amount <= 0) return "$0";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function buildMarkdown(generatedAt, catalog, sources) {
  const lines = [
    "# Live US/EU Open-Data Registry Snapshot",
    "",
    `> **Auto-generated:** \`${generatedAt}\` (0 LLM tokens · pure Node.js \`fetch\` against live government APIs)`,
    "> **Interactive Web Showcase:** [https://desastreger.github.io/open-data-mcp-servers/](https://desastreger.github.io/open-data-mcp-servers/)",
    `> **1-Click All-in-One OAuth MCP:** \`${catalog.oauthGatewayUrl}\``,
    "",
    "Each table below contains **3 real live sample records** pulled directly from official public registries during the latest automated showcase refresh.",
    "",
  ];

  // 1. SEC EDGAR
  lines.push("## 1. SEC EDGAR Form D Filings (`sec-form-d-funding-leads`)");
  lines.push("");
  if (sources.sec.ok && sources.sec.records.length) {
    lines.push("| Company Name | CIK | Form | Filing Date | Location | Accession Number |");
    lines.push("| :--- | :--- | :--- | :--- | :--- | :--- |");
    for (const r of sources.sec.records) {
      lines.push(
        `| ${mdCell(r.companyName)} | \`${mdCell(r.cik)}\` | \`${mdCell(r.form)}\` | \`${mdCell(r.filingDate)}\` | ${mdCell(r.location)} | \`${mdCell(r.accessionNumber)}\` |`
      );
    }
  } else {
    lines.push(`_Upstream fetch note: ${mdCell(sources.sec.error || "No records returned")}_`);
  }
  lines.push("");

  // 2. USASpending
  lines.push("## 2. USASpending.gov Federal Prime Contracts (`federal-govcon-recompete-radar`)");
  lines.push("");
  if (sources.usaspending.ok && sources.usaspending.records.length) {
    lines.push("| Award ID | Incumbent Recipient | Obligated Amount | Awarding Agency | End Date | NAICS |");
    lines.push("| :--- | :--- | :--- | :--- | :--- | :--- |");
    for (const r of sources.usaspending.records) {
      lines.push(
        `| \`${mdCell(r.awardId)}\` | ${mdCell(r.recipientName)} | **${formatUsd(r.awardAmountUsd)}** | ${mdCell(r.awardingAgency)} | \`${mdCell(r.endDate)}\` | \`${mdCell(r.naicsCode)}\` |`
      );
    }
  } else {
    lines.push(`_Upstream fetch note: ${mdCell(sources.usaspending.error || "No records returned")}_`);
  }
  lines.push("");

  // 3. CMS NPPES
  lines.push("## 3. CMS NPPES NPI-2 Healthcare Practice Owners (`us-healthcare-practice-owners`)");
  lines.push("");
  if (sources.nppes.ok && sources.nppes.records.length) {
    lines.push("| NPI | Organization Name | Authorized Official | Title | Location | Phone |");
    lines.push("| :--- | :--- | :--- | :--- | :--- | :--- |");
    for (const r of sources.nppes.records) {
      lines.push(
        `| \`${mdCell(r.npi)}\` | ${mdCell(r.organizationName)} | ${mdCell(r.authorizedOfficial)} | ${mdCell(r.officialTitle)} | ${mdCell(r.cityState)} | \`${mdCell(r.phone)}\` |`
      );
    }
  } else {
    lines.push(`_Upstream fetch note: ${mdCell(sources.nppes.error || "No records returned")}_`);
  }
  lines.push("");

  // 4. EPA ECHO
  lines.push("## 4. US EPA ECHO Industrial Facility Compliance (`epa-echo-industrial-facility-compliance`)");
  lines.push("");
  if (sources.epa.ok && sources.epa.records.length) {
    lines.push("| Registry ID | Facility Name | Location | SNC Flag | Quarters Non-Compliance | SIC |");
    lines.push("| :--- | :--- | :--- | :--- | :--- | :--- |");
    for (const r of sources.epa.records) {
      lines.push(
        `| \`${mdCell(r.registryId)}\` | ${mdCell(r.facilityName)} | ${mdCell(r.location)} | \`${mdCell(r.sncFlag)}\` | ${mdCell(r.quartersNc)} | \`${mdCell(r.sicCodes)}\` |`
      );
    }
  } else {
    lines.push(`_Upstream fetch note: ${mdCell(sources.epa.error || "No records returned")}_`);
  }
  lines.push("");

  // 5. ClinicalTrials.gov
  lines.push("## 5. NIH ClinicalTrials.gov Recruiting Studies (`openalex-pubmed-expert-finder-mcp`)");
  lines.push("");
  if (sources.trials.ok && sources.trials.records.length) {
    lines.push("| NCT ID | Study Title | Lead Sponsor | Phase | Central Contact | Email |");
    lines.push("| :--- | :--- | :--- | :--- | :--- | :--- |");
    for (const r of sources.trials.records) {
      const titleShort = r.briefTitle.length > 90 ? `${r.briefTitle.slice(0, 87)}...` : r.briefTitle;
      lines.push(
        `| \`${mdCell(r.nctId)}\` | ${mdCell(titleShort)} | ${mdCell(r.leadSponsor)} | \`${mdCell(r.phases)}\` | ${mdCell(r.contactName)} | \`${mdCell(r.contactEmail)}\` |`
      );
    }
  } else {
    lines.push(`_Upstream fetch note: ${mdCell(sources.trials.error || "No records returned")}_`);
  }
  lines.push("");

  // 6. SEC EDGAR Form 4
  lines.push("## 6. SEC EDGAR Form 4 Insider Transactions (`sec-form4-insider-cluster-signals`)");
  lines.push("");
  if (sources.form4.ok && sources.form4.records.length) {
    lines.push("| Issuer | Reporting Insider | Form | Filing Date | Accession Number |");
    lines.push("| :--- | :--- | :--- | :--- | :--- |");
    for (const r of sources.form4.records) {
      lines.push(
        `| ${mdCell(r.issuer)} | ${mdCell(r.reportingOwner)} | \`${mdCell(r.form)}\` | \`${mdCell(r.filingDate)}\` | \`${mdCell(r.accessionNumber)}\` |`
      );
    }
  } else {
    lines.push(`_Upstream fetch note: ${mdCell(sources.form4.error || "No records returned")}_`);
  }
  lines.push("");

  // 7. FDA 510(k)
  lines.push("## 7. US FDA 510(k) Medical Device Clearances (`fda-medtech-510k-approval-tracker`)");
  lines.push("");
  if (sources.fda510k.ok && sources.fda510k.records.length) {
    lines.push("| 510(k) ID | Device Name | Applicant | Specialty | Product Code | Decision Date |");
    lines.push("| :--- | :--- | :--- | :--- | :--- | :--- |");
    for (const r of sources.fda510k.records) {
      lines.push(
        `| \`${mdCell(r.kNumber)}\` | ${mdCell(r.deviceName)} | ${mdCell(r.applicant)} | ${mdCell(r.specialty)} | \`${mdCell(r.productCode)}\` | \`${mdCell(r.decisionDate)}\` |`
      );
    }
  } else {
    lines.push(`_Upstream fetch note: ${mdCell(sources.fda510k.error || "No records returned")}_`);
  }
  lines.push("");

  // 8. IRS Form 990
  lines.push("## 8. IRS Form 990 Nonprofits & Foundations (`irs-990-nonprofit-grantmaker-leads`)");
  lines.push("");
  if (sources.irs990.ok && sources.irs990.records.length) {
    lines.push("| EIN | Organization | Location | Form | Tax Period | Revenue | Total Assets |");
    lines.push("| :--- | :--- | :--- | :--- | :--- | :--- | :--- |");
    for (const r of sources.irs990.records) {
      lines.push(
        `| \`${mdCell(r.formattedEin)}\` | ${mdCell(r.organizationName)} | ${mdCell(r.cityState)} | \`${mdCell(r.formType)}\` | \`${mdCell(r.taxPeriod)}\` | ${formatUsd(r.totalRevenueUsd)} | **${formatUsd(r.totalAssetsUsd)}** |`
      );
    }
  } else {
    lines.push(`_Upstream fetch note: ${mdCell(sources.irs990.error || "No records returned")}_`);
  }
  lines.push("");

  // 9. CISA KEV + EPSS
  lines.push("## 9. CISA KEV & FIRST.org EPSS Exploited Vulnerabilities (`cisa-kev-nvd-exploit-prioritizer-mcp`)");
  lines.push("");
  if (sources.cisaKev.ok && sources.cisaKev.records.length) {
    lines.push("| CVE ID | Vendor | Product | Date Added | BOD Due Date | Ransomware | EPSS 30d |");
    lines.push("| :--- | :--- | :--- | :--- | :--- | :--- | :--- |");
    for (const r of sources.cisaKev.records) {
      lines.push(
        `| \`${mdCell(r.cveId)}\` | ${mdCell(r.vendorProject)} | ${mdCell(r.product)} | \`${mdCell(r.dateAdded)}\` | \`${mdCell(r.dueDate)}\` | \`${mdCell(r.ransomwareUse)}\` | \`${mdCell(r.epssPct)}\` |`
      );
    }
  } else {
    lines.push(`_Upstream fetch note: ${mdCell(sources.cisaKev.error || "No records returned")}_`);
  }
  lines.push("");

  // 10. SEC EDGAR Form 13F-HR
  lines.push("## 10. SEC EDGAR Form 13F-HR Institutional Filings (`sec-13f-institutional-whale-holdings`)");
  lines.push("");
  if (sources.sec13f.ok && sources.sec13f.records.length) {
    lines.push("| Institutional Manager | CIK | Form | Period Ending | Filing Date | Location | Accession Number |");
    lines.push("| :--- | :--- | :--- | :--- | :--- | :--- | :--- |");
    for (const r of sources.sec13f.records) {
      lines.push(
        `| ${mdCell(r.managerName)} | \`${mdCell(r.cik)}\` | \`${mdCell(r.form)}\` | \`${mdCell(r.periodEnding)}\` | \`${mdCell(r.filingDate)}\` | ${mdCell(r.location)} | \`${mdCell(r.accessionNumber)}\` |`
      );
    }
  } else {
    lines.push(`_Upstream fetch note: ${mdCell(sources.sec13f.error || "No records returned")}_`);
  }
  lines.push("");

  // 11. US Treasury OFAC SDN
  lines.push("## 11. US Treasury OFAC SDN Sanctions List (`ofac-sanctions-aml-pep-screener-mcp`)");
  lines.push("");
  if (sources.ofac.ok && sources.ofac.records.length) {
    lines.push("| Ent # | Primary Name | Type | OFAC Programs | Crypto Wallets | Remarks / Identifiers |");
    lines.push("| :--- | :--- | :--- | :--- | :--- | :--- |");
    for (const r of sources.ofac.records) {
      lines.push(
        `| \`${mdCell(r.entNum)}\` | ${mdCell(r.primaryName)} | \`${mdCell(r.entityType)}\` | \`${mdCell(r.programs)}\` | ${r.walletCount} | ${mdCell(r.remarksPreview)} |`
      );
    }
  } else {
    lines.push(`_Upstream fetch note: ${mdCell(sources.ofac.error || "No records returned")}_`);
  }
  lines.push("");

  // 12. US Federal Register
  lines.push("## 12. US Federal Register Rules & Executive Orders (`federal-register-regulatory-rule-radar`)");
  lines.push("");
  if (sources.fedreg.ok && sources.fedreg.records.length) {
    lines.push("| Doc # | Title | Type | Primary Agency | Published | Deadline / Effective | CFR |");
    lines.push("| :--- | :--- | :--- | :--- | :--- | :--- | :--- |");
    for (const r of sources.fedreg.records) {
      lines.push(
        `| \`${mdCell(r.documentNumber)}\` | ${mdCell(r.title)} | \`${mdCell(r.type)}\` | ${mdCell(r.agency)} | \`${mdCell(r.publicationDate)}\` | \`${mdCell(r.deadlineOrEffective)}\` | \`${mdCell(r.cfr)}\` |`
      );
    }
  } else {
    lines.push(`_Upstream fetch note: ${mdCell(sources.fedreg.error || "No records returned")}_`);
  }
  lines.push("");

  return lines.join("\n");
}

function renderTableRows(rows, columns) {
  if (!rows.length) {
    return `<tr><td colspan="${columns.length}" class="muted">No live rows returned during this cycle.</td></tr>`;
  }
  return rows
    .map(
      (row) =>
        `<tr>${columns
          .map((col) => `<td>${col.raw ? col.raw(row) : escapeHtml(col.get(row))}</td>`)
          .join("")}</tr>`
    )
    .join("\n");
}

function buildHtml(generatedAt, catalog, sources) {
  const oauthAllUrl = catalog.oauthGatewayUrl;
  const skillsCmd = "npx skills add desastreger/open-data-mcp-servers --all";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Open Data B2B & Compliance MCP Servers",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Cross-platform (Streamable HTTP MCP / STDIO)",
    url: "https://desastreger.github.io/open-data-mcp-servers/",
    downloadUrl: "https://github.com/desastreger/open-data-mcp-servers",
    softwareVersion: "1.5.0",
    license: "https://opensource.org/licenses/MIT",
    description:
      "17 deterministic, zero-API-key Streamable HTTP MCP servers & Apify Actors for US Federal Register rules & Executive Orders, SEC Form D, Form 4 & Form 13F-HR, US Treasury OFAC SDN/AML, IRS Form 990, CISA KEV + EPSS + NVD, FDA 510(k)/PMA, US KYB, GovCon recompetes, building permits, tariffs, NPPES clinics, DNS/DMARC, code violations, EPA ECHO, and ClinicalTrials.gov.",
    author: {
      "@type": "Person",
      name: "desastreger",
      url: "https://apify.com/desastreger",
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: "0.50",
      highPrice: "1.00",
      offerCount: String(catalog.servers.length),
    },
  };

  const serverCardsHtml = catalog.servers
    .map((s) => {
      const oauthUrl = s.oauthUrl || `https://mcp.apify.com/?tools=desastreger/${s.id}`;
      const standbyUrl = s.remotes?.[0]?.url || `https://desastreger--${s.id}.apify.actor/mcp`;
      const launchPrice = s.pricing?.launchRatePer1kUsd
        ? `$${Number(s.pricing.launchRatePer1kUsd).toFixed(2)} / 1k`
        : "Pay-Per-Event";
      const iconPath = `https://raw.githubusercontent.com/desastreger/open-data-mcp-servers/main/icons/${s.id}.svg`;
      const toolBadges = (s.tools || [])
        .map((t) => `<span class="tool-pill">${escapeHtml(t.name)}</span>`)
        .join("");

      return `
      <article class="card">
        <div class="card-head">
          <img src="${escapeHtml(iconPath)}" alt="${escapeHtml(s.id)} icon" width="44" height="44" loading="lazy" />
          <div>
            <h3>${escapeHtml(s.name)}</h3>
            <span class="price-badge">${escapeHtml(launchPrice)} launch</span>
          </div>
        </div>
        <p class="card-desc">${escapeHtml(s.description)}</p>
        <div class="meta-line"><strong>Sources:</strong> ${escapeHtml(s.dataSources || "")}</div>
        <div class="tools-wrap">${toolBadges}</div>
        <div class="endpoint-box">
          <span class="label">1-Click OAuth MCP (Zero Key)</span>
          <div class="copy-row">
            <code>${escapeHtml(oauthUrl)}</code>
            <button type="button" class="copy-btn" data-copy="${escapeHtml(oauthUrl)}">Copy</button>
          </div>
        </div>
        <div class="card-links">
          <a href="${escapeHtml(s.storeUrl)}" target="_blank" rel="noopener">Apify Store ↗</a>
          <a href="https://github.com/desastreger/open-data-mcp-servers/blob/main/servers/${escapeHtml(s.id)}/README.md" target="_blank" rel="noopener">Docs</a>
          <a href="https://github.com/desastreger/open-data-mcp-servers/blob/main/skills/${escapeHtml(s.id)}/SKILL.md" target="_blank" rel="noopener">SKILL.md</a>
        </div>
        <details class="standby-details">
          <summary>Direct Standby URL (Bearer $APIFY_TOKEN)</summary>
          <div class="copy-row" style="margin-top:8px;">
            <code>${escapeHtml(standbyUrl)}</code>
            <button type="button" class="copy-btn" data-copy="${escapeHtml(standbyUrl)}">Copy</button>
          </div>
        </details>
      </article>`;
    })
    .join("\n");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Open Data MCP Servers — 17 Zero-Key US/EU Registry &amp; Compliance MCP Endpoints</title>
  <meta name="description" content="Connect Claude, Cursor, VS Code, Windsurf, n8n, and Clay to 17 deterministic zero-API-key MCP servers for US Federal Register rules, SEC Form D/4/13F, OFAC SDN/AML, IRS Form 990, CISA KEV &amp; EPSS, FDA 510(k)/PMA, US KYB, GovCon, EPA ECHO, CMS NPPES, and ClinicalTrials.gov." />
  <meta property="og:title" content="Open Data B2B &amp; Compliance MCP Servers" />
  <meta property="og:description" content="17 production-ready Streamable HTTP MCP servers with 1-Click Browser OAuth, daily live government registry snapshots, and ready-to-import n8n/Clay templates." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://desastreger.github.io/open-data-mcp-servers/" />
  <link rel="canonical" href="https://desastreger.github.io/open-data-mcp-servers/" />
  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
  <style>
    :root {
      --bg: #0b1120;
      --panel: #111827;
      --panel-2: #162033;
      --border: #25324a;
      --text: #e2e8f0;
      --muted: #94a3b8;
      --accent: #38bdf8;
      --accent-2: #10b981;
      --code-bg: #070c17;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, sans-serif;
      background: radial-gradient(circle at top right, #13223e 0%, var(--bg) 52%);
      color: var(--text);
      line-height: 1.55;
    }
    a { color: var(--accent); text-decoration: none; }
    a:hover { text-decoration: underline; }
    .container { max-width: 1200px; margin: 0 auto; padding: 32px 20px 72px; }
    .hero {
      background: linear-gradient(145deg, rgba(22,32,51,0.95), rgba(11,17,32,0.95));
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 36px 28px;
      margin-bottom: 36px;
    }
    .pill-row { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 16px; }
    .badge {
      display: inline-flex; align-items: center; gap: 6px;
      font-size: 12px; font-weight: 600; padding: 4px 10px;
      border-radius: 999px; border: 1px solid var(--border);
      background: rgba(56, 189, 248, 0.08); color: #bae6fd;
    }
    .badge.green { background: rgba(16, 185, 129, 0.1); color: #a7f3d0; }
    h1 { margin: 0 0 12px; font-size: clamp(1.75rem, 3vw, 2.5rem); line-height: 1.18; }
    .subtitle { color: var(--muted); max-width: 820px; margin: 0 0 24px; font-size: 1.05rem; }
    .hero-actions { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; margin-bottom: 20px; }
    .install-box {
      background: var(--code-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 14px;
    }
    .label { display: block; font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--accent-2); font-weight: 700; margin-bottom: 6px; }
    .copy-row { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
    .copy-row code {
      display: block; overflow-x: auto; white-space: nowrap;
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: 12.5px; color: #f8fafc; padding: 4px 0;
    }
    .copy-btn {
      flex-shrink: 0; background: #1e293b; color: #f8fafc;
      border: 1px solid #334155; border-radius: 8px;
      padding: 6px 12px; font-size: 12px; font-weight: 600; cursor: pointer;
    }
    .copy-btn:hover { background: #334155; border-color: var(--accent); }
    .cta-links { display: flex; flex-wrap: wrap; gap: 12px; }
    .btn {
      display: inline-block; padding: 9px 15px; border-radius: 9px;
      font-weight: 600; font-size: 14px; border: 1px solid var(--border);
      background: var(--panel-2); color: var(--text);
    }
    .btn.primary { background: #0284c7; border-color: #38bdf8; color: #ffffff; }
    h2 { font-size: 1.45rem; margin: 40px 0 14px; }
    .section-note { color: var(--muted); margin-top: -6px; margin-bottom: 18px; font-size: 0.95rem; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(330px, 1fr)); gap: 18px; }
    .card {
      background: var(--panel); border: 1px solid var(--border);
      border-radius: 14px; padding: 20px; display: flex; flex-direction: column; gap: 12px;
    }
    .card-head { display: flex; align-items: center; gap: 12px; }
    .card-head h3 { margin: 0 0 4px; font-size: 1.03rem; }
    .price-badge {
      display: inline-block; font-size: 12px; font-weight: 600;
      padding: 2px 8px; border-radius: 6px;
      background: rgba(16, 185, 129, 0.14); color: #6ee7b7;
    }
    .card-desc { margin: 0; font-size: 0.91rem; color: #cbd5e1; }
    .meta-line { font-size: 0.83rem; color: var(--muted); }
    .tools-wrap { display: flex; flex-wrap: wrap; gap: 6px; }
    .tool-pill {
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 11px; padding: 3px 7px; border-radius: 6px;
      background: #0f172a; border: 1px solid #26354d; color: #7dd3fc;
    }
    .endpoint-box {
      background: var(--code-bg); border: 1px solid var(--border);
      border-radius: 10px; padding: 10px 12px;
    }
    .card-links { display: flex; gap: 16px; font-size: 13px; font-weight: 600; }
    .standby-details { font-size: 12px; color: var(--muted); }
    .standby-details summary { cursor: pointer; }
    .table-card {
      background: var(--panel); border: 1px solid var(--border);
      border-radius: 14px; padding: 18px; margin-bottom: 18px; overflow-x: auto;
    }
    .table-card h3 { margin: 0 0 10px; font-size: 1.05rem; }
    table { width: 100%; border-collapse: collapse; font-size: 0.88rem; }
    th, td { text-align: left; padding: 9px 10px; border-bottom: 1px solid #1e293b; vertical-align: top; }
    th { color: #93c5fd; font-weight: 600; white-space: nowrap; }
    .muted { color: var(--muted); }
    footer { margin-top: 48px; padding-top: 20px; border-top: 1px solid var(--border); color: var(--muted); font-size: 0.88rem; display: flex; flex-wrap: wrap; justify-content: space-between; gap: 12px; }
  </style>
</head>
<body>
  <main class="container">
    <section class="hero">
      <div class="pill-row">
        <span class="badge green">1-Click Browser OAuth · Zero API Keys</span>
        <span class="badge">43 Read-Only MCP Tools</span>
        <span class="badge">Official MCP Registry: io.github.desastreger/open-data-mcp-servers</span>
        <span class="badge">Live Snapshot: ${escapeHtml(generatedAt)}</span>
      </div>
      <h1>Open Data B2B &amp; Compliance MCP Servers</h1>
      <p class="subtitle">
        Seventeen deterministic, zero-third-party-API-key remote Streamable HTTP MCP servers &amp; Apify Actors backed by US Federal Register API v1, SEC EDGAR (Form D, Form 4 &amp; Form 13F-HR), US Treasury OFAC SLS (SDN, ALT, ADD, Consolidated Non-SDN), IRS Form 990 (ProPublica), CISA KEV + FIRST EPSS + NIST NVD, US FDA openFDA (510(k), PMA, Recalls), GLEIF LEI, USASpending, Grants.gov, CMS NPPES, US EPA ECHO, ClinicalTrials.gov, USITC HTS, EC VIES, EU TED, Socrata Municipal Portals, and RFC DNS/TLS/RDAP/BGP.
      </p>
      <div class="hero-actions">
        <div class="install-box">
          <span class="label">1-Click All-in-One OAuth MCP URL (Claude / Cursor / VS Code / Antigravity)</span>
          <div class="copy-row">
            <code>${escapeHtml(oauthAllUrl)}</code>
            <button type="button" class="copy-btn" data-copy="${escapeHtml(oauthAllUrl)}">Copy URL</button>
          </div>
        </div>
        <div class="install-box">
          <span class="label">Install All 17 Agent Skills (skills.sh)</span>
          <div class="copy-row">
            <code>${escapeHtml(skillsCmd)}</code>
            <button type="button" class="copy-btn" data-copy="${escapeHtml(skillsCmd)}">Copy CLI</button>
          </div>
        </div>
      </div>
      <div class="cta-links">
        <a class="btn primary" href="https://apify.com/desastreger" target="_blank" rel="noopener">Browse Apify Store ↗</a>
        <a class="btn" href="https://github.com/desastreger/open-data-mcp-servers" target="_blank" rel="noopener">GitHub Repository ↗</a>
        <a class="btn" href="https://agensi.io" target="_blank" rel="noopener">Agensi Marketplace ↗</a>
        <a class="btn" href="https://github.com/desastreger/open-data-mcp-servers/tree/main/templates/n8n" target="_blank" rel="noopener">n8n Workflows ↗</a>
        <a class="btn" href="https://github.com/desastreger/open-data-mcp-servers/blob/main/templates/clay/README.md" target="_blank" rel="noopener">Clay HTTP Recipes ↗</a>
      </div>
    </section>

    <section>
      <h2>17 Production MCP Servers &amp; Apify Actors</h2>
      <p class="section-note">Connect via 1-Click Browser OAuth (no manual API key) or direct Apify Standby Streamable HTTP (<code>Bearer $APIFY_TOKEN</code>).</p>
      <div class="grid">
        ${serverCardsHtml}
      </div>
    </section>

    <section>
      <h2>Daily Live Open-Data Preview (Pulled ${escapeHtml(generatedAt)})</h2>
      <p class="section-note">Automatically refreshed every day at <code>07:15 UTC</code> with 0 LLM tokens from live public-domain APIs. Full markdown archive: <a href="https://github.com/desastreger/open-data-mcp-servers/blob/main/samples/LATEST_SNAPSHOT.md" target="_blank" rel="noopener">samples/LATEST_SNAPSHOT.md</a>.</p>

      <div class="table-card">
        <h3>1. SEC EDGAR Form D Filings (<code>sec-form-d-funding-leads</code>)</h3>
        <table>
          <thead><tr><th>Company Name</th><th>CIK</th><th>Form</th><th>Filing Date</th><th>Location</th><th>Accession</th></tr></thead>
          <tbody>
            ${renderTableRows(sources.sec.records, [
              { get: (r) => r.companyName },
              { raw: (r) => `<code>${escapeHtml(r.cik)}</code>` },
              { raw: (r) => `<code>${escapeHtml(r.form)}</code>` },
              { get: (r) => r.filingDate },
              { get: (r) => r.location },
              { raw: (r) => `<code>${escapeHtml(r.accessionNumber)}</code>` },
            ])}
          </tbody>
        </table>
      </div>

      <div class="table-card">
        <h3>2. USASpending.gov Prime Federal Contracts (<code>federal-govcon-recompete-radar</code>)</h3>
        <table>
          <thead><tr><th>Award ID</th><th>Recipient</th><th>Obligated USD</th><th>Awarding Agency</th><th>End Date</th><th>NAICS</th></tr></thead>
          <tbody>
            ${renderTableRows(sources.usaspending.records, [
              { raw: (r) => `<code>${escapeHtml(r.awardId)}</code>` },
              { get: (r) => r.recipientName },
              { raw: (r) => `<strong>${escapeHtml(formatUsd(r.awardAmountUsd))}</strong>` },
              { get: (r) => r.awardingAgency },
              { get: (r) => r.endDate },
              { raw: (r) => `<code>${escapeHtml(r.naicsCode)}</code>` },
            ])}
          </tbody>
        </table>
      </div>

      <div class="table-card">
        <h3>3. CMS NPPES NPI-2 Healthcare Practice Owners (<code>us-healthcare-practice-owners</code>)</h3>
        <table>
          <thead><tr><th>NPI</th><th>Organization</th><th>Authorized Official</th><th>Title</th><th>Location</th><th>Phone</th></tr></thead>
          <tbody>
            ${renderTableRows(sources.nppes.records, [
              { raw: (r) => `<code>${escapeHtml(r.npi)}</code>` },
              { get: (r) => r.organizationName },
              { get: (r) => r.authorizedOfficial },
              { get: (r) => r.officialTitle },
              { get: (r) => r.cityState },
              { raw: (r) => `<code>${escapeHtml(r.phone)}</code>` },
            ])}
          </tbody>
        </table>
      </div>

      <div class="table-card">
        <h3>4. US EPA ECHO Industrial Compliance (<code>epa-echo-industrial-facility-compliance</code>)</h3>
        <table>
          <thead><tr><th>Registry ID</th><th>Facility Name</th><th>Location</th><th>SNC Flag</th><th>Quarters NC</th><th>SIC</th></tr></thead>
          <tbody>
            ${renderTableRows(sources.epa.records, [
              { raw: (r) => `<code>${escapeHtml(r.registryId)}</code>` },
              { get: (r) => r.facilityName },
              { get: (r) => r.location },
              { raw: (r) => `<code>${escapeHtml(r.sncFlag)}</code>` },
              { get: (r) => r.quartersNc },
              { raw: (r) => `<code>${escapeHtml(r.sicCodes)}</code>` },
            ])}
          </tbody>
        </table>
      </div>

      <div class="table-card">
        <h3>5. NIH ClinicalTrials.gov Recruiting Trials (<code>openalex-pubmed-expert-finder-mcp</code>)</h3>
        <table>
          <thead><tr><th>NCT ID</th><th>Study Title</th><th>Lead Sponsor</th><th>Phase</th><th>Central Contact</th><th>Email</th></tr></thead>
          <tbody>
            ${renderTableRows(sources.trials.records, [
              { raw: (r) => `<code>${escapeHtml(r.nctId)}</code>` },
              { get: (r) => (r.briefTitle.length > 90 ? `${r.briefTitle.slice(0, 87)}...` : r.briefTitle) },
              { get: (r) => r.leadSponsor },
              { get: (r) => r.phases },
              { get: (r) => r.contactName },
              { raw: (r) => `<code>${escapeHtml(r.contactEmail)}</code>` },
            ])}
          </tbody>
        </table>
      </div>

      <div class="table-card">
        <h3>6. SEC EDGAR Form 4 Insider Transactions (<code>sec-form4-insider-cluster-signals</code>)</h3>
        <table>
          <thead><tr><th>Issuer</th><th>Reporting Insider</th><th>Form</th><th>Filing Date</th><th>Accession</th></tr></thead>
          <tbody>
            ${renderTableRows(sources.form4.records, [
              { get: (r) => r.issuer },
              { get: (r) => r.reportingOwner },
              { raw: (r) => `<code>${escapeHtml(r.form)}</code>` },
              { get: (r) => r.filingDate },
              { raw: (r) => `<code>${escapeHtml(r.accessionNumber)}</code>` },
            ])}
          </tbody>
        </table>
      </div>

      <div class="table-card">
        <h3>7. US FDA 510(k) Medical Device Clearances (<code>fda-medtech-510k-approval-tracker</code>)</h3>
        <table>
          <thead><tr><th>510(k) ID</th><th>Device Name</th><th>Applicant</th><th>Specialty</th><th>Product Code</th><th>Decision Date</th></tr></thead>
          <tbody>
            ${renderTableRows(sources.fda510k.records, [
              { raw: (r) => `<code>${escapeHtml(r.kNumber)}</code>` },
              { get: (r) => r.deviceName },
              { get: (r) => r.applicant },
              { get: (r) => r.specialty },
              { raw: (r) => `<code>${escapeHtml(r.productCode)}</code>` },
              { get: (r) => r.decisionDate },
            ])}
          </tbody>
        </table>
      </div>

      <div class="table-card">
        <h3>8. IRS Form 990 Nonprofits &amp; Foundations (<code>irs-990-nonprofit-grantmaker-leads</code>)</h3>
        <table>
          <thead><tr><th>EIN</th><th>Organization</th><th>Location</th><th>Form</th><th>Tax Period</th><th>Revenue</th><th>Total Assets</th></tr></thead>
          <tbody>
            ${renderTableRows(sources.irs990.records, [
              { raw: (r) => `<code>${escapeHtml(r.formattedEin)}</code>` },
              { get: (r) => r.organizationName },
              { get: (r) => r.cityState },
              { raw: (r) => `<code>${escapeHtml(r.formType)}</code>` },
              { get: (r) => r.taxPeriod },
              { get: (r) => formatUsd(r.totalRevenueUsd) },
              { raw: (r) => `<strong>${escapeHtml(formatUsd(r.totalAssetsUsd))}</strong>` },
            ])}
          </tbody>
        </table>
      </div>

      <div class="table-card">
        <h3>9. CISA KEV &amp; FIRST.org EPSS Exploited Vulnerabilities (<code>cisa-kev-nvd-exploit-prioritizer-mcp</code>)</h3>
        <table>
          <thead><tr><th>CVE ID</th><th>Vendor</th><th>Product</th><th>Date Added</th><th>BOD Due Date</th><th>Ransomware</th><th>EPSS 30d</th></tr></thead>
          <tbody>
            ${renderTableRows(sources.cisaKev.records, [
              { raw: (r) => `<code>${escapeHtml(r.cveId)}</code>` },
              { get: (r) => r.vendorProject },
              { get: (r) => r.product },
              { get: (r) => r.dateAdded },
              { get: (r) => r.dueDate },
              { raw: (r) => `<code>${escapeHtml(r.ransomwareUse)}</code>` },
              { raw: (r) => `<code>${escapeHtml(r.epssPct)}</code>` },
            ])}
          </tbody>
        </table>
      </div>

      <div class="table-card">
        <h3>10. SEC EDGAR Form 13F-HR Institutional Filings (<code>sec-13f-institutional-whale-holdings</code>)</h3>
        <table>
          <thead><tr><th>Institutional Manager</th><th>CIK</th><th>Form</th><th>Period Ending</th><th>Filing Date</th><th>Location</th><th>Accession</th></tr></thead>
          <tbody>
            ${renderTableRows(sources.sec13f.records, [
              { get: (r) => r.managerName },
              { raw: (r) => `<code>${escapeHtml(r.cik)}</code>` },
              { raw: (r) => `<code>${escapeHtml(r.form)}</code>` },
              { get: (r) => r.periodEnding },
              { get: (r) => r.filingDate },
              { get: (r) => r.location },
              { raw: (r) => `<code>${escapeHtml(r.accessionNumber)}</code>` },
            ])}
          </tbody>
        </table>
      </div>

      <div class="table-card">
        <h3>11. US Treasury OFAC SDN Sanctions List (<code>ofac-sanctions-aml-pep-screener-mcp</code>)</h3>
        <table>
          <thead><tr><th>Ent #</th><th>Primary Name</th><th>Type</th><th>OFAC Programs</th><th>Crypto Wallets</th><th>Remarks / Identifiers</th></tr></thead>
          <tbody>
            ${renderTableRows(sources.ofac.records, [
              { raw: (r) => `<code>${escapeHtml(r.entNum)}</code>` },
              { get: (r) => r.primaryName },
              { raw: (r) => `<code>${escapeHtml(r.entityType)}</code>` },
              { raw: (r) => `<code>${escapeHtml(r.programs)}</code>` },
              { get: (r) => String(r.walletCount) },
              { get: (r) => r.remarksPreview },
            ])}
          </tbody>
        </table>
      </div>

      <div class="table-card">
        <h3>12. US Federal Register Rules &amp; Executive Orders (<code>federal-register-regulatory-rule-radar</code>)</h3>
        <table>
          <thead><tr><th>Doc #</th><th>Title</th><th>Type</th><th>Primary Agency</th><th>Published</th><th>Deadline / Effective</th><th>CFR</th></tr></thead>
          <tbody>
            ${renderTableRows(sources.fedreg.records, [
              { raw: (r) => `<code>${escapeHtml(r.documentNumber)}</code>` },
              { get: (r) => r.title },
              { raw: (r) => `<code>${escapeHtml(r.type)}</code>` },
              { get: (r) => r.agency },
              { get: (r) => r.publicationDate },
              { raw: (r) => `<code>${escapeHtml(r.deadlineOrEffective)}</code>` },
              { raw: (r) => `<code>${escapeHtml(r.cfr)}</code>` },
            ])}
          </tbody>
        </table>
      </div>
    </section>

    <footer>
      <span>MIT License · Built by <a href="https://github.com/desastreger" target="_blank" rel="noopener">desastreger</a></span>
      <span><a href="https://apify.com/desastreger" target="_blank" rel="noopener">Apify Store</a> · <a href="https://agensi.io" target="_blank" rel="noopener">Agensi</a> · <a href="https://skills.sh" target="_blank" rel="noopener">skills.sh</a></span>
    </footer>
  </main>

  <script>
    document.querySelectorAll('.copy-btn').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const value = btn.getAttribute('data-copy');
        if (!value) return;
        const orig = btn.textContent;
        try {
          await navigator.clipboard.writeText(value);
          btn.textContent = 'Copied!';
          setTimeout(() => { btn.textContent = orig; }, 1600);
        } catch {
          btn.textContent = 'Copy manually';
          setTimeout(() => { btn.textContent = orig; }, 1600);
        }
      });
    });
  </script>
</body>
</html>
`;
}

async function main() {
  const catalogPath = path.join(ROOT, "catalog.json");
  const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
  const generatedAt = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");

  const [sec, usaspending, nppes, epa, trials, form4, fda510k, irs990, cisaKev, sec13f, ofac, fedreg] = await Promise.all([
    safeCollect("SEC EDGAR", fetchSecFormD),
    safeCollect("USASpending", fetchUsaSpending),
    safeCollect("CMS NPPES", fetchCmsNppes),
    safeCollect("EPA ECHO", fetchEpaEcho),
    safeCollect("ClinicalTrials.gov", fetchClinicalTrials),
    safeCollect("SEC Form 4", fetchSecForm4),
    safeCollect("FDA 510(k)", fetchFda510k),
    safeCollect("IRS 990", fetchIrs990),
    safeCollect("CISA KEV", fetchCisaKev),
    safeCollect("SEC Form 13F", fetchSec13f),
    safeCollect("OFAC SDN", fetchOfacSanctions),
    safeCollect("Federal Register", fetchFederalRegister),
  ]);

  const sources = { sec, usaspending, nppes, epa, trials, form4, fda510k, irs990, cisaKev, sec13f, ofac, fedreg };

  fs.mkdirSync(path.join(ROOT, "samples"), { recursive: true });
  fs.mkdirSync(path.join(ROOT, "docs"), { recursive: true });

  const md = buildMarkdown(generatedAt, catalog, sources);
  const html = buildHtml(generatedAt, catalog, sources);

  fs.writeFileSync(path.join(ROOT, "samples", "LATEST_SNAPSHOT.md"), md, "utf8");
  fs.writeFileSync(path.join(ROOT, "docs", "index.html"), html, "utf8");

  console.log(
    JSON.stringify(
      {
        generatedAt,
        counts: {
          sec: sec.records.length,
          usaspending: usaspending.records.length,
          nppes: nppes.records.length,
          epa: epa.records.length,
          trials: trials.records.length,
          form4: form4.records.length,
          fda510k: fda510k.records.length,
          irs990: irs990.records.length,
          cisaKev: cisaKev.records.length,
          sec13f: sec13f.records.length,
          ofac: ofac.records.length,
          fedreg: fedreg.records.length,
        },
        errors: Object.fromEntries(
          Object.entries(sources)
            .filter(([, v]) => !v.ok)
            .map(([k, v]) => [k, v.error])
        ),
      },
      null,
      2
    )
  );
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
