# corva-convert-units

Monorepo for unit conversion libraries used by Corva. A single set of shared JSON definitions powers both the JavaScript/TypeScript and Python packages.

## Structure

```
definitions/     Shared JSON unit definitions (source of truth)
js/              npm package: corva-convert-units
py/              PyPI package: corva-unit-converter
scripts/         Build and validation scripts
```

## Packages

| Package | Language | Registry | Install |
|---------|----------|----------|---------|
| `corva-convert-units` | TypeScript/JS | npm | `npm install corva-convert-units` |
| `corva-unit-converter` | Python | PyPI | `pip install corva-unit-converter` |

Both packages are versioned together (currently v2.0.0).

## Usage

### JavaScript / TypeScript

```typescript
import { convert } from 'corva-convert-units';

// Direct conversion
convert(1, 'ft', 'm');                // 0.3048
convert(100, 'C', 'F');              // 212

// Chained API
convert(1).from('ft').to('m');       // 0.3048

// With explicit measure
convert(1, 'ft', 'm', 'length');     // 0.3048

// Utilities
convert.measures();                   // ['length', 'pressure', ...]
convert.describe('ft');               // { abbr: 'ft', measure: 'length', ... }
convert.list('length');               // [{ abbr: 'mm', ... }, ...]
convert.possibilities('length');      // ['mm', 'cm', 'm', 'km', ...]
```

### Python

```python
from corva_unit_converter import convert, get_measures, describe

convert(1, 'ft', 'm')                    # 0.3048
convert(100, 'C', 'F')                  # 212.0
convert(1, 'ft', 'm', measure='length') # 0.3048

get_measures()     # ['length', 'pressure', ...]
describe('ft')     # {'abbr': 'ft', 'measure': 'length', ...}
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
cd py && pip install -e ".[test]"
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
4. The `formationDensity` measure is an alias for `density` (handled in loader code, not in JSON)

## Release

Both packages use [release-please](https://github.com/googleapis/release-please) with the `linked-versions` plugin. Merging to `master` creates a combined release PR. When merged, tags `js-v*` and `python-v*` trigger separate publish workflows to npm and PyPI.

## License

MIT
