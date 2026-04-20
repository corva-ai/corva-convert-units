# Shared JSON Definitions — Sync Report

This document describes the merge of unit definitions from two repositories into a single shared JSON source of truth.

**Source repositories:**

- **JS**: `corva-convert-units` (v1.33.0)
- **PY**: `corva-convert-units-py` (v0.6.0)

**Output:** 47 JSON files in `definitions/` (46 unit definitions + 1 bucket mapping)

---

## Merge Strategy

- All units and aliases from both repos are included (union/superset).
- Where both repos define the same unit with the same `to_anchor` value, they are kept as-is.
- Where one repo has extra aliases, all aliases are merged into a single array.
- Where only one repo defines a unit or entire measure, it is included in full.
- Bugs found in either repo are fixed in the JSON output.
- The unit key itself is always included as the first element of the `aliases` array.

---

## Bugs Fixed

| # | File | Bug | Fix |
|---|------|-----|-----|
| 1 | `energy.json` | JS `kNm` display had a trailing comma: `"kNm,"` | Changed to `"kNm"` |
| 2 | `energy.json` | JS `_anchors.metric.unit` was `"nm"` (lowercase), but the actual unit key is `"Nm"` | Changed to `"Nm"` |
| 3 | `volumeFlowRate.json` | Both JS and PY had `km3/s` display set to `"km³/min"` (wrong time unit) | Changed to `"km³/s"` |
| 4 | `partsPer.json` | PY `rule` object used string references (`"metric": "metric"`) instead of actual dict values, breaking iteration | Used JS as source of truth; PY's `parts_per` was not wired into `converter.py` anyway |

---

## Aliases Merged (from JS into PY direction)

These aliases existed in JS but were missing from PY. All are now in the shared JSON.

| Definition | Unit | Aliases added |
|---|---|---|
| `pressure.json` | `psi` | `"PSI"` |
| `pressure.json` | `ksi` | `"kpsi"`, `"KPSI"` (from commit `fdda5be`) |
| `density.json` | `lb/gal` | `"lbs_per_gal"` |
| `volumeFlowRate.json` | `l/min` | `"L/min"` |
| `volumeFlowRate.json` | `gal/min` | `"gal_per_min"` |
| `speed.json` | `ft/h` | `"ft_per_hr"` |
| `temperature.json` | `K` | `"degK"` |
| `angle.json` | `deg` | `"dega"`, `"degrees"` |
| `energy.json` | `kNm` | `"kN.m"` |
| `energy.json` | `ft-klbf` | `"kft-lbf"`, `"ft.klbf"` |
| `proportion.json` | `%` | `"percent"`, `"flow_percent"` |

## Aliases Merged (from PY into JS direction)

These aliases existed in PY but were missing from JS. All are now in the shared JSON.

| Definition | Unit | Aliases added |
|---|---|---|
| `time.json` | `s` | `"sec"` |
| `time.json` | `d` | `"day"` |
| `angularVelocity.json` | `radsec` | `"rad/s"`, `"rad/sec"` |
| `gasVolume.json` | `ml` | `"mL"`, `"ml of"`, `"mL of"` |
| `gasVolume.json` | `gal` | `"gals"` |
| `gasVolume.json` | `bbl` | `"bbls"` |
| `gasConcentration.json` | `Units (0-10000u)` | `"Units (0-10000u)"` (self-alias) |
| `gasConcentration.json` | `Units (0-5000u)` | `"Units (0-5000u)"` (self-alias) |
| `gasConcentration.json` | `Units` | `"Units"` (self-alias) |
| `gasConcentration.json` | `%EMA` | `"%EMA"` (self-alias) |

---

## Units Added (present in JS but missing from PY)

| Definition | Units | System |
|---|---|---|
| `mass.json` | `sack`, `100lb`, `lbm`, `klbs` | imperial |
| `density.json` | `kPa/m` | metric |
| `density.json` | `psi/ft`, `psi/1000ft` | imperial |
| `massFlowRate.json` | `mcg/s`, `mcg/min`, `mcg/h` | metric |
| `force.json` | `g` (g-force) | metric |

## Units Added (present in PY but missing from JS)

| Definition | Units | System |
|---|---|---|
| `lengthPerAngle.json` | `m/rev` | metric |
| `pressureGradient.json` | `Pa/m` | metric |

---

## Entire Definitions Only in JS (9 files — no PY equivalent existed)

| File | Units | Notes |
|---|---|---|
| `volume.json` | 25 units (mm3, cm3, ml, l, m3, gal, bbl, ft3, etc.) | Liquid volume |
| `surveyLength.json` | m, ft, usft | US survey foot |
| `gasFlowRate.json` | m3/day, Mscf/day | Gas flow rate |
| `concentration.json` | ppm | Molar concentration |
| `gravity.json` | m/s2, g, ft/s2 | Gravitational acceleration |
| `gravityRMS.json` | gRMS | Gravity RMS |
| `each.json` | ea | Count |
| `unitless.json` | unitless | Dimensionless |
| `spontaneousPotential.json` | mV | Well logging |
| `resistivity.json` | ohmm | Electrical resistivity |

## Entire Definitions Only in PY (1 file — no JS equivalent existed)

| File | Units | Notes |
|---|---|---|
| `torque.json` | Nm, kNm, J, ft-lbf, ft-klbf | JS handles torque via `energy` (same units and anchors). PY separated it as a distinct measure. |

---

## Display String Conflicts Resolved

Where JS and PY had different display strings for the same unit, the JS value was preferred unless it contained a bug.

| Definition | Unit | JS display | PY display | Chosen |
|---|---|---|---|---|
| `energy.json` | `kNm` | `"kNm,"` (bug) | `"kNm"` | PY (bug fix) |
| `energy.json` | `ft-klbf` | `"kft-lbf"` | `"ft-klbf"` | JS (`"kft-lbf"`) |
| `angularVelocity.json` | `rev/s` | `"rev/s"` | `"1/s"` | JS (`"rev/s"`) |

---

## Numeric Values

All `to_anchor` values, `anchor_shift` values, and `_anchors.ratio` values are **100% consistent** between JS and PY wherever both repos define the same unit. There were zero numeric conflicts.

---

## JSON Schema

Each definition file follows this structure:

```json
{
  "metric": {
    "<unitKey>": {
      "name": {
        "singular": "...",
        "plural": "...",
        "display": "..."
      },
      "to_anchor": 1.0,
      "anchor_shift": 273.15,
      "aliases": ["<unitKey>", "alias1", "alias2"]
    }
  },
  "imperial": { },
  "_anchors": {
    "metric": {
      "unit": "<anchorUnitKey>",
      "ratio": 3.28084,
      "transform": "val * 9 / 5 + 32"
    },
    "imperial": {
      "unit": "<anchorUnitKey>",
      "ratio": 0.3048
    }
  }
}
```

| Field | Required | Notes |
|---|---|---|
| `name.singular` | yes | Singular display name |
| `name.plural` | yes | Plural display name |
| `name.display` | yes | Short display label (used in UIs) |
| `to_anchor` | yes | Multiplier to convert this unit to the system's anchor unit |
| `anchor_shift` | no | Additive offset (e.g. Kelvin = Celsius + 273.15). Omitted when not applicable. |
| `aliases` | yes | Array of strings. First element is always the unit key. |
| `_anchors.ratio` | conditional | Multiplier for cross-system conversion. Omitted when `transform` is used. |
| `_anchors.transform` | conditional | String expression using `val` for non-linear cross-system conversion (only temperature). |

**Exception:** `digital.json` uses `"bits"` and `"bytes"` as system names instead of `"metric"` / `"imperial"`.

---

## Known Issue — Shared Unit Keys and JS Lookup Priority

Several unit keys appear in more than one measure with **different anchor chains**. This is intentional (e.g. `bbl` means liquid barrel in `volume` and gas-accounting barrel in `gasVolume`), but it requires explicit lookup priority management in the JS loader.

### Root Cause

The original separate JS library resolved unit keys by iterating a **hardcoded measure order** where the "general" measure always appeared before the "specialised" one. The monorepo loader uses `fs.readdirSync()` (alphabetical), which produces a different order and causes the wrong measure to win for shared keys.

### Affected Unit Keys

| Unit key(s) | General measure (should win) | Specialised measure (loses) | Notes |
|---|---|---|---|
| `gal`, `bbl`, `m3`, `l`, `fl-oz`, `ft3`, … | `volume` | `gasVolume` | gasVolume uses MCF-based gas-accounting anchors |
| `mV` | `voltage` | `spontaneousPotential` | SP is always mV; no intra-measure conversion exists |
| `g` | `mass` (gram, `to_anchor=1`) | `force` / `gravity` (g-force, `to_anchor=9.80665`) | Completely different physical quantities |
| `kPa/m`, `psi/ft` | `pressureGradient` | `density` | Different anchor chains; same units used as equivalent mud weight |
| `ppm` | `partsPer` | `concentration` / `gasConcentration` | gasConcentration uses a 0.0001 scale factor |
| `%` | `proportion` | `gasConcentration` | Same `to_anchor`; proportion is the more general measure |

### Fix (JS)

`js/src/loader.ts` explicitly moves the specialised measures to the **end** of the insertion order after loading, so "first occurrence wins" in `buildIndexes()` always picks the general measure:

```typescript
const DEPRIORITIZED = [
  'density',           // kPa/m, psi/ft → pressureGradient wins
  'formationDensity',  // same data as density
  'concentration',     // ppm → partsPer wins
  'gasConcentration',  // ppm → partsPer wins; % → proportion wins
  'force',             // g → mass wins
  'gravity',           // g → mass wins
  'gasVolume',         // gal/bbl/m3 → volume wins
  'spontaneousPotential', // mV → voltage wins
];
```

Callers who need the specialised measure must pass it explicitly, e.g. `convert(value, 'bbl', 'm3', 'gasVolume')`.

### Fix (Python)

`py/src/corva_unit_converter/loader.py` applies the same deprioritization after loading. Note that the original Python repo (`corva-convert-units-py`) had a different hardcoded measure order from the original JS repo — notably `density` before `pressure_gradient` and `force` before `mass`. Both are now aligned to the same priority as JS:

```python
_DEPRIORITIZED = [
    "density",
    "formation_density",
    "concentration",
    "gas_concentration",
    "force",
    "gravity",
    "gas_volume",
    "spontaneous_potential",
]
```

### Future-Proofing

If new definition files are added that share unit keys with existing measures, add the **less general** measure to the `DEPRIORITIZED` list. The long-term clean solution is to remove overlapping unit keys from specialised measures entirely and require callers to pass `measure` explicitly for gas-accounting or domain-specific conversions.

---

## Final Stats

| Metric | Value |
|---|---|
| Total JSON files | 47 |
| Unit definition files | 46 |
| Total units | 334 |
| Total aliases | 484 |
| Validation issues | 0 |
