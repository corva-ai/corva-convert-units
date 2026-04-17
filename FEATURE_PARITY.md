# Feature Parity: JS ↔ PY

Both converters expose the same core set of functions. Below is the full mapping, known gaps, and what's new vs the legacy versions.

## API mapping

| JS | PY | Description |
|---|---|---|
| `convert(1, 'ft', 'm')` | `convert(1, 'ft', 'm')` | Direct conversion |
| `convert(1, 'ft', 'm', 'length')` | `convert(1, 'ft', 'm', 'length')` | Direct conversion with explicit measure |
| `convert(1).from('ft').to('m')` | — *(JS only)* | Chained Converter API |
| `new Converter(1, 'length').from('ft').to('m')` | — *(JS only)* | Chained API with measure pre-set |
| `convert.measures()` *(camelCase)* | `get_measures()` *(snake_case)* | List all measure names |
| `convert.describe('ft')` | `describe('ft')` | Unit metadata dict |
| `convert.list('length')` | `list_units('length')` | All units, optional measure filter |
| `convert.listWithAlias('length')` | `list_units_with_aliases('length')` | All units including aliases |
| `convert.possibilities('length')` | `possibilities('length')` | Unit abbreviation list |
| `convert.getUnitKeyByAlias('meter')` | `get_unit_key_by_alias('meter')` | Resolve alias → canonical key |
| `convert.bucketMapping()` | `bucket_mapping()` | Unit bucket mapping dict |
| `new Converter(1200000).from('mm').toBest()` | `to_best(1200000, 'mm')` | Best unit (smallest value ≥ 1, same system) |
| `Converter.getUnitBucketMapping()` | `Converter.bucket_mapping()` | Bucket mapping on the class *(different name — see Gaps)* |
| *(internal only)* | `get_unit('ft')` | Raw resolved unit dict — PY public, JS internal |
| *(internal only)* | `get_unit_for_pair('ft', 'm')` | Find two units in a common measure — PY public, JS internal |

---

## Gaps (known differences between JS and PY)

### 1. Chained Converter API — JS only

JS has a stateful `Converter` instance with a fluent chain:

```js
new Converter(1200000).from('mm').toBest({ exclude: ['km'] });
convert(1).from('ft').to('m');
convert(1, 'length').from('ft').to('m');  // measure pre-set
```

The Python `Converter` class is a **static-method facade** — no chaining, no instance state.

### 2. Error vs `None`

| Scenario | JS | PY |
|---|---|---|
| Unknown unit | throws `Error` | returns `None` |
| Unknown measure | throws `Error` | returns `None` (logs warning) |
| `describe()` unknown unit | throws `Error` | returns `None` |

### 3. `Converter.getUnitBucketMapping()` vs `Converter.bucket_mapping()`

The bucket mapping method is named differently on the class:
- JS: `Converter.getUnitBucketMapping()`
- PY: `Converter.bucket_mapping()`

The top-level static function is consistent: `convert.bucketMapping()` / `bucket_mapping()`.

### 4. `get_unit()` and `get_unit_for_pair()` — PY public, JS internal

Both functions exist in JS but are not exported. PY exposes them in the public API.

---

## New APIs vs legacy versions

### Added to PY (were JS-only before)

### `possibilities(measure=None)`

Returns a flat list of unit abbreviations.

```python
from corva_unit_converter import possibilities

possibilities('length')
# ['mm', 'cm', 'm', 'km', 'in', 'yd', 'ft', 'ftUS', 'mi', 'nMi', 'fathom']

possibilities()
# all units across all measures
```

### `list_units_with_aliases(measure=None)`

Like `list_units()` but includes the `aliases` array for each unit.

```python
from corva_unit_converter import list_units_with_aliases

list_units_with_aliases('length')[0]
# {'abbr': 'mm', 'measure': 'length', 'system': 'metric',
#  'singular': 'Millimeter', 'plural': 'Millimeters', 'display': 'mm',
#  'aliases': ['mm', 'millimeter', 'millimeters']}
```

### `get_unit_key_by_alias(alias)`

Resolves any alias to its canonical unit key. Returns `None` if not found.

```python
from corva_unit_converter import get_unit_key_by_alias

get_unit_key_by_alias('meter')    # 'm'
get_unit_key_by_alias('feet')     # 'ft'
get_unit_key_by_alias('PSI')      # 'psi'
get_unit_key_by_alias('m')        # 'm' (identity)
get_unit_key_by_alias('xyz')      # None
```

### `get_unit_for_pair(abbr_one, abbr_two)`

Finds two units within the same measure. Returns a tuple `(unit_one, unit_two)` or `None`.

```python
from corva_unit_converter import get_unit_for_pair

pair = get_unit_for_pair('ft', 'm')
# ({'abbr': 'ft', 'measure': 'length', 'system': 'imperial', ...},
#  {'abbr': 'm',  'measure': 'length', 'system': 'metric', ...})

get_unit_for_pair('ft', 'psi')  # None (different measures)
```

### `bucket_mapping()`

Returns the unit bucket mapping dictionary.

```python
from corva_unit_converter import bucket_mapping

mapping = bucket_mapping()
# {'Acoustic Slowness': ['us/m', 'us/f', 'us/ft'], 'Angle': ['rad', 'deg', ...], ...}
```

### `to_best(value, unit_from, measure=None, exclude=None)`

Converts to the "best" unit — the one where the value has the fewest digits before the decimal point but is still ≥ 1. Stays within the same system (metric/imperial).

```python
from corva_unit_converter import to_best

to_best(1200000, 'mm')
# {'val': 1.2, 'unit': 'km', 'singular': 'Kilometer', 'plural': 'Kilometers', 'display': 'km'}

to_best(5280, 'ft')
# {'val': 1.0, 'unit': 'mi', 'singular': 'Mile', 'plural': 'Miles', 'display': 'mi'}

to_best(0.5, 'km')
# {'val': 500.0, 'unit': 'm', 'singular': 'Meter', 'plural': 'Meters', 'display': 'm'}
```

All new functions are also available as static methods on the `Converter` class for backward compatibility.

### Added to both JS and PY (new in this version vs legacy)

| Feature | Details |
|---|---|
| Direct call syntax | `convert(v, 'ft', 'm')` — both languages now support direct conversion without chaining or class instantiation |
| `formationDensity` measure alias | Both packages expose `formationDensity` as an alias for `density` (loaded from the same JSON) |
| camelCase measure names (JS) / snake_case (PY) | JS `convert.measures()` returns camelCase (`acousticSlowness`). PY `get_measures()` returns snake_case (`acoustic_slowness`). Both accept either form as a `measure=` argument. |
| `listWithAlias` / `list_units_with_aliases` | New in both — includes `aliases` array per unit |

### Added to PY only (recent additions)

| Feature | Details |
|---|---|
| `definitions.__all__` | Restored backward-compat submodule with sorted snake_case measure names |
| snake_case measure normalization | All `measure=` parameters accept both `'acousticSlowness'` and `'acoustic_slowness'` |
| `get_unit(abbr, measure?)` | Public function returning the raw resolved unit dict (JS keeps this internal) |
| `get_unit_for_pair(a, b)` | Public function (JS keeps this internal) |

---

## Backward compatibility

### `definitions.__all__` (PY only)

The old package exposed a `definitions` submodule with an `__all__` list of snake_case measure group names. This is restored and built dynamically from the loaded JSON definitions.

```python
from corva_unit_converter.definitions import __all__ as measure_names
# ['acoustic_slowness', 'angle', 'area', 'concentration', 'density',
#  'formation_density', 'gas_flow_rate', 'length', 'pressure', 'temperature', ...]

# also accessible via the top-level package
from corva_unit_converter import definitions
definitions.__all__  # same sorted snake_case list
```

### snake_case measure names (PY only)

All functions that accept a `measure=` parameter transparently accept both camelCase and snake_case names. `get_measures()` returns snake_case — so values from it can be passed directly back into any function without any conversion.

```python
from corva_unit_converter import convert, list_units, possibilities

# these are equivalent
convert(1, 'ft', 'm', measure='length')
convert(1, 'ft', 'm', measure='length')  # unchanged — already snake_case-safe

list_units('acousticSlowness')   # camelCase (canonical)
list_units('acoustic_slowness')  # snake_case (legacy) — same result

possibilities('gasFlowRate')     # camelCase
possibilities('gas_flow_rate')   # snake_case — same result
```
