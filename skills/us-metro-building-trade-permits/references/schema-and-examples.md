# US Metro Building & Trade Permits — Schema & Query Recipes

Reference guide for `desastreger/us-metro-building-trade-permits` (`https://desastreger--us-metro-building-trade-permits.apify.actor/mcp`).

---

## 1. Complete Input Parameter Reference

Parameters match `.actor/input_schema.json` and MCP tool `search_metro_building_permits` (`list_supported_permit_metros` accepts `{}`).

| Parameter | Type | Default | Valid Values / Constraints | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `metros` | `array<string>` | `["chicago", "austin", "seattle"]` | `"chicago"`, `"austin"`, `"seattle"`, `"los_angeles"`, `"san_francisco"` | Unknown metro keys are safely ignored with a logged warning; active cities are interleaved round-robin. |
| `tradeFilter` | `string` | `"all"` | `"all"`, `"solar"`, `"roofing"`, `"electrical"`, `"hvac_mechanical"`, `"plumbing"`, `"new_construction"`, `"commercial_remodel"` | Maps heterogeneous municipal permit types and work descriptions into standardized `tradeCategory` enums. |
| `minEstimatedCostUsd` | `integer` | `0` | `>= 0` (USD) | Filters permits with reported `estimatedCostUsd >= minEstimatedCostUsd`. Set `0` when querying flat-fee MEP sub-permits that omit valuation. |
| `keywords` | `array<string>` | `[]` | Case-insensitive strings (`["EV charger", "heat pump", "tenant improvement"]`) | Matched across `permitType`, `description`, `contractorName`, `address`, `tradeCategory`, and `city` (OR-matched across list items). |
| `maxResults` | `integer` | `25` (`10` MCP) | `1` to `500` (`1` to `50` in MCP mode) | Total deduplicated permits returned across all selected metros. |

### Normalized `tradeCategory` Output Values
`SOLAR`, `ROOFING`, `ELECTRICAL`, `HVAC_MECHANICAL`, `PLUMBING`, `NEW_CONSTRUCTION`, `COMMERCIAL_REMODEL`, `GENERAL_BUILDING`.

---

## 2. Sample Normalized Output Record

Every permit across all 5 municipal Socrata portals is normalized into this identical 18-field JSON object:

```json
{
  "permitId": "2026-141802 EP",
  "metro": "austin",
  "city": "Austin",
  "state": "TX",
  "tradeCategory": "SOLAR",
  "permitType": "Electrical Permit - Solar - Residential",
  "status": "Active",
  "issueDate": "2026-11-09",
  "address": "4812 SHOAL CREEK BLVD",
  "zipCode": "78756",
  "description": "Install 11.2 kW rooftop solar PV array with battery energy storage system",
  "estimatedCostUsd": 38500,
  "contractorName": "FREEDOM SOLAR LLC",
  "contractorPhone": "(512) 555-0194",
  "contractorLicense": null,
  "leadScore": 83,
  "priorityTier": "HOT",
  "sourcePortalUrl": "https://abc.austintexas.gov/web/permit/public-search-other?t_detail=1&t_selected_folderrsn=13791002"
}
```

---

## 3. Concrete B2B Query Recipes

### Recipe 1: Solar PV & Battery Storage Installer Supply Pipeline
Call `search_metro_building_permits` across sunbelt and west-coast portals to identify active solar + storage jobs and high-volume installers:

```json
{
  "metros": ["austin", "los_angeles", "san_francisco", "seattle"],
  "tradeFilter": "solar",
  "minEstimatedCostUsd": 15000,
  "keywords": ["battery", "energy storage", "kW"],
  "maxResults": 25
}
```
**Analytical Takeaway:** Surfaces newly issued residential and commercial solar/storage installations with `contractorName` and `contractorPhone`, allowing solar equipment distributors and financing providers to spot active EPCs immediately.

### Recipe 2: High-Budget Commercial Tenant Improvements & Office Build-Outs
Call `search_metro_building_permits` targeting `$150,000+` commercial remodels across all 5 major metros:

```json
{
  "metros": ["chicago", "austin", "seattle", "los_angeles", "san_francisco"],
  "tradeFilter": "commercial_remodel",
  "minEstimatedCostUsd": 150000,
  "maxResults": 30
}
```
**Analytical Takeaway:** Captures high-value office, retail, restaurant, and lab tenant improvements (`COMMERCIAL_REMODEL`) for commercial furniture dealers, low-voltage cabling integrators, waste-hauling vendors, and CRE brokers.

### Recipe 3: Electrification, EV Charger & Heat-Pump MEP Contractor Discovery
Call `search_metro_building_permits` with `minEstimatedCostUsd: 0` (so flat-fee trade permits are preserved) and targeted electrification keywords:

```json
{
  "metros": ["seattle", "san_francisco", "chicago", "austin"],
  "tradeFilter": "hvac_mechanical",
  "minEstimatedCostUsd": 0,
  "keywords": ["heat pump", "VRF", "chiller"],
  "maxResults": 20
}
```
**Analytical Takeaway:** Preserves mechanical trade permits even where cities do not require cost disclosure, ranking active HVAC mechanical contractors installing modern heat-pump and commercial VRF systems.
