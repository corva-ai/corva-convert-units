# corva-convert-units

Monorepo for unit conversion libraries used by Corva. A single set of shared JSON definitions powers both the JavaScript/TypeScript and Python packages.

## Structure

```
definitions/     Shared JSON unit definitions
js/              npm package: corva-convert-units
py/              PyPI package: corva-unit-converter
scripts/         Build and validation scripts
```

## Packages

| Package | Language | Registry | Install |
|---------|----------|----------|---------|
| `corva-convert-units` | TypeScript/JS | npm | `npm install corva-convert-units` |
| `corva-unit-converter` | Python | PyPI | `pip install corva-unit-converter` |

## Usage

### JavaScript / TypeScript

```typescript
import {
  convert,
  getMeasures,
  describe,
  getUnit,
  getUnitForPair,
  listUnits,
  listUnitsWithAliases,
  possibilities,
  toBest,
  bucketMapping,
  getUnitKeyByAlias,
} from 'corva-convert-units';

convert(1, 'ft', 'm');                          // 0.3048
convert(100, 'C', 'F');                         // 212
convert(1, 'ft', 'm', 'length');                // 0.3048

getMeasures();                                  // ['length', 'pressure', ...]
describe('ft');                                 // { abbr: 'ft', measure: 'length', ... }
getUnit('ft');                                  // { abbr: 'ft', measure: 'length', system: 'imperial', unit: ... }
getUnitForPair('ft', 'm');                      // [{ abbr: 'ft', ... }, { abbr: 'm', ... }]
listUnits('length');                            // [{ abbr: 'mm', ... }, ...]
listUnitsWithAliases('length');                 // [{ abbr: 'm', aliases: ['meter', ...], ... }, ...]
possibilities('length');                        // ['mm', 'cm', 'm', 'km', ...]
toBest(100000, 'mm');                           // { val: 100, unit: 'm', ... }
bucketMapping;                                  // { 'Length': ['m', 'ft', ...], ... }
getUnitKeyByAlias('meter');                     // 'm'
```

### Python

```python
from corva_unit_converter import (
    convert,
    get_measures,
    describe,
    get_unit,
    get_unit_for_pair,
    list_units,
    list_units_with_aliases,
    possibilities,
    to_best,
    bucket_mapping,
    get_unit_key_by_alias,
)

convert(1, 'ft', 'm')                           # 0.3048
convert(100, 'C', 'F')                          # 212.0
convert(1, 'ft', 'm', measure='length')         # 0.3048

get_measures()                                  # ['length', 'pressure', ...]
describe('ft')                                  # {'abbr': 'ft', 'measure': 'length', ...}
get_unit('ft')                                  # {'abbr': 'ft', 'measure': 'length', 'system': 'imperial', ...}
get_unit_for_pair('ft', 'm')                    # ({'abbr': 'ft', ...}, {'abbr': 'm', ...})
list_units('length')                            # [{'abbr': 'mm', ...}, ...]
list_units_with_aliases('length')               # [{'abbr': 'm', 'aliases': ['meter', ...], ...}, ...]
possibilities('length')                         # ['mm', 'cm', 'm', 'km', ...]
to_best(100000, 'mm')                           # {'val': 100, 'unit': 'm', ...}
bucket_mapping()                                # {'Length': ['m', 'ft', ...], ...}
get_unit_key_by_alias('meter')                  # 'm'
```

## Development

### Prerequisites

- Node.js 24+ (see `.nvmrc`)
- Python 3.9+
- GNU Make

### Setup

```bash
# JS
cd js && npm install

# Python
cd py && python3 -m venv .venv && .venv/bin/pip install -e ".[test]"
```

### Commands

```bash
make sync-defs    # Copy definitions into packages (local only; CI does this automatically)
make test-js      # Run JS tests
make test-py      # Run Python tests
make test         # Run all tests (includes sync-defs automatically)
make validate     # Validate JSON definition files (also runs in CI on every PR)
make build-js     # Build JS package
make build-py     # Build Python package
make clean        # Remove build artifacts
```

### Adding a new unit

1. Edit the JSON file in `definitions/` (or create a new one)
2. Run `make test` to verify both packages (syncs definitions automatically)
3. The `formation_density` measure is an alias for `density` (handled in loader code, not in JSON)

## Release

Both packages use [release-please](https://github.com/googleapis/release-please) with the `linked-versions` plugin. Merging to `master` creates a combined release PR. When merged, tags `js-v*` and `python-v*` trigger separate publish workflows to npm and PyPI.
