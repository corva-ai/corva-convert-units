# Feature Parity: JS ↔ PY

Both converters now expose the same set of functions. Below is the mapping and usage for each.

## API mapping

| JS | PY | Description |
|---|---|---|
| `convert(1, 'ft', 'm')` | `convert(1, 'ft', 'm')` | Direct conversion |
| `convert(1).from('ft').to('m')` | — | Chained API (JS only) |
| `convert.measures()` | `get_measures()` | List all measure names |
| `convert.describe('ft')` | `describe('ft')` | Unit metadata |
| `convert.list('length')` | `list_units('length')` | All units (optional measure filter) |
| `convert.listWithAlias('length')` | `list_units_with_aliases('length')` | All units including aliases |
| `convert.possibilities('length')` | `possibilities('length')` | Unit abbreviation list |
| `convert.getUnitKeyByAlias('meter')` | `get_unit_key_by_alias('meter')` | Resolve alias → canonical key |
| `convert.bucketMapping()` | `bucket_mapping()` | Unit bucket mapping dict |
| `new Converter(1200000).from('mm').toBest()` | `to_best(1200000, 'mm')` | Best unit (smallest value ≥ 1, same system) |
| internal: `getUnitForPair('ft', 'm')` | `get_unit_for_pair('ft', 'm')` | Find two units in a common measure |

## Functions added to PY (were JS-only before)

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
