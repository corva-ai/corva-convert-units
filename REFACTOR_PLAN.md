# Monorepo Refactor: Shared JSON Definitions

## Target Structure

```
corva-convert-units/
├── definitions/                       # shared JSON (already created)
│   ├── *.json                         # 46 unit definition files
│   ├── unitBucketMapping.json
│   └── SYNC_REPORT.md
├── js/                                # npm package: corva-convert-units
│   ├── package.json
│   ├── src/
│   │   ├── index.ts                   # main entry point + Converter
│   │   ├── loader.ts                  # loads JSON definitions at startup
│   │   └── types.ts                   # TypeScript type definitions
│   ├── tsconfig.json
│   ├── jest.config.js
│   └── __tests__/                     # migrated + updated tests
├── py/                            # PyPI package: corva-unit-converter
│   ├── pyproject.toml
│   ├── src/
│   │   └── corva_unit_converter/
│   │       ├── __init__.py            # public API exports
│   │       ├── converter.py           # conversion logic (loads JSON)
│   │       ├── loader.py              # loads JSON definitions
│   │       └── definitions/           # JSON files copied here at build time
│   └── tests/                         # migrated + updated tests
├── scripts/
│   ├── sync-definitions.sh            # copies definitions/ into both packages
│   └── validate-definitions.js        # validates JSON schema
├── VERSION                            # shared version (2.0.0)
├── .github/workflows/                 # combined CI
├── Makefile                           # top-level orchestration
└── README.md
```

## Phase 1: Restructure the repo

- Move current `lib/`, `index.d.ts`, `__test__/` into `js/`
- Move Python source from the sibling repo into `py/`
- Keep `definitions/` at root (already done)
- Delete old JS definition files (`lib/definitions/*.js`) and old Python definition files
- Delete `.eslintrc.js`, `yarn.lock` — ESLint is removed entirely, npm replaces yarn
- Update `.nvmrc` to Node 24 (LTS)
- Add root `Makefile` with targets: `sync-defs`, `build-js`, `build-py`, `test-js`, `test-py`, `test`

## Phase 2: JS package refactor (`js/`)

**Modern JS/TS rewrite:**

- **Node 24 LTS**, ESM-first (`"type": "module"` in package.json)
- **No ESLint** — removed entirely (can be added back later with a flat config)
- **No yarn** — use npm with `package-lock.json`
- **No lodash** — use native `Object.keys()`, `Object.entries()`, `for...of`, `Array.prototype.find/filter/map/reduce`
- **Zero runtime dependencies**

**Source files:**

- `src/types.ts` — full TypeScript types, replacing the old hand-written `index.d.ts`:

```typescript
export interface UnitNames {
  singular: string;
  plural: string;
  display: string;
}

export interface UnitDefinition {
  name: UnitNames;
  to_anchor: number;
  anchor_shift?: number;
  aliases: string[];
}

export interface SystemAnchor {
  unit: string;
  ratio?: number;
  transform?: (val: number) => number;
}

export interface MeasureDefinition {
  [system: string]:
    | Record<string, UnitDefinition>
    | Record<string, SystemAnchor>;
  _anchors: Record<string, SystemAnchor>;
}

export interface ResolvedUnit {
  abbr: string;
  measure: string;
  system: string;
  unit: UnitDefinition;
}

export interface ConversionResult {
  val: number;
  unit: string;
  singular: string;
  plural: string;
  display: string;
}

export type PlainUnit = UnitNames & Omit<ResolvedUnit, "unit">;
```

- `src/loader.ts` — reads all `*.json` from the definitions directory, builds the `measures` map. Handles:
  - Parsing `transform` string expressions into functions via `new Function('val', 'return ' + expr)`
  - The `formationDensity` measure alias (maps to `density` definition)
  - Non-standard system names (digital uses `bits`/`bytes`)
- `src/index.ts` — the Converter class with a cleaner API:

```typescript
import { convert } from "corva-convert-units";

// Chained (existing style, kept for familiarity)
convert(1).from("ft").to("m"); // => 0.3048

// Direct (new)
convert(1, "ft", "m"); // => 0.3048
convert(1, "ft", "m", "length"); // with explicit measure

// Utilities
convert.measures(); // string[]
convert.describe("ft"); // { abbr, measure, system, ... }
convert.list("length"); // PlainUnit[]
convert.possibilities("length"); // string[]
convert.bucketMapping(); // { BUCKETS, BUCKET_MAP }
```

- `package.json`:
  - `"type": "module"`, `"engines": { "node": ">=24" }`
  - `"main"`: `"dist/index.cjs"`, `"module"`: `"dist/index.js"`, `"types"`: `"dist/index.d.ts"`
  - `"exports"` field with CJS and ESM dual output
  - `dependencies`: none
  - `devDependencies`: `typescript`, `jest`, `ts-jest`, `@types/jest`, `@types/node`
  - No eslint, no yarn
- `tsconfig.json`:
  - `"target": "ES2024"`, `"module": "NodeNext"`, `"moduleResolution": "NodeNext"`
  - `"declaration": true`, `"outDir": "dist"`, `"rootDir": "src"`
  - `"resolveJsonModule": true` (for importing JSON definitions)
- JSON definitions bundled: during build, `scripts/sync-definitions.sh` copies `definitions/*.json` into `js/definitions/`. The `files` field in `package.json` includes `definitions/`. Loader resolves path via `import.meta.url`.

## Phase 3: Python package refactor (`py/`)

**Modernize with functional API:**

- `src/corva_unit_converter/loader.py` — reads all JSON files from the bundled `definitions/` directory using `importlib.resources` (Python 3.9+) or `pkg_resources`. Handles transform strings via a safe evaluator (`ast.literal_eval` won't work for expressions, so use a minimal parser or `compile()`/`eval()` with a restricted namespace).
- `src/corva_unit_converter/converter.py` — refactored:

```python
from corva_unit_converter import convert, measures, describe

result = convert(1, 'ft', 'm')                    # => 0.3048
result = convert(1, 'ft', 'm', measure='length')  # explicit measure

all_measures = measures()          # list of measure names
info = describe('ft')              # unit metadata dict
```

- `src/corva_unit_converter/__init__.py` — exports `convert`, `measures`, `describe`, `list_units`, `Converter` (for backward compat)
- `pyproject.toml` — modern packaging with `[project]` table, `package-data` includes `definitions/*.json`
- Adds all previously-missing measures: volume, surveyLength, gasFlowRate, concentration, gravity, gravityRMS, each, unitless, spontaneousPotential, resistivity, formationDensity
- JSON definitions bundled: `sync-definitions.sh` copies `definitions/*.json` into `py/src/corva_unit_converter/definitions/`

## Phase 4: Build and publish pipeline

### Scripts and Makefile

- **`scripts/sync-definitions.sh`** — copies `definitions/*.json` into `js/definitions/` and `py/src/corva_unit_converter/definitions/`. Both destination dirs are `.gitignore`d (derived artifacts).
- **Makefile targets:**
  - `sync-defs` — run the sync script
  - `build-js` — sync + `cd js && npm run build`
  - `build-py` — sync + `cd python && python -m build`
  - `test-js` — sync + `cd js && npm test`
  - `test-py` — sync + `cd python && pytest`
  - `test` — test-js + test-py
  - `validate` — run `scripts/validate-definitions.js` (checks all JSON against schema)

### Release-please (manifest mode with linked-versions)

**`release-please-config.json`** at repo root:

```json
{
  "packages": {
    "js": {
      "release-type": "node",
      "component": "js"
    },
    "python": {
      "release-type": "python",
      "component": "python",
      "package-name": "corva-unit-converter"
    }
  },
  "plugins": [
    {
      "type": "linked-versions",
      "groupName": "corva-convert-units",
      "components": ["js", "python"]
    }
  ],
  "group-pull-request-title-pattern": "chore: release v${version}",
  "include-component-in-tag": true
}
```

**`.release-please-manifest.json`** at repo root (bootstrapped):

```json
{
  "js": "2.0.0",
  "python": "2.0.0"
}
```

This ensures:
- Both packages always share the same version (linked-versions plugin picks the highest bump and applies it to both)
- A single combined release PR is created for both packages
- Tags are created as `js-v2.x.x` and `python-v2.x.x`

### CI/CD Workflows

**`release-please.yml`** — updated for manifest mode:

```yaml
name: Release
on:
  push:
    branches: [master]
jobs:
  release-please:
    runs-on: ubuntu-24.04
    steps:
      - uses: googleapis/release-please-action@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          config-file: release-please-config.json
          manifest-file: .release-please-manifest.json
```

(Or continue using `corva-ai/gh-actions/common/release-please@develop` if it supports manifest mode.)

**`publish-js.yml`** — triggers on JS tags (`js-v*`), runs sync-definitions, builds JS, publishes to npm via `publish.mjs` with `WORKING_DIRECTORY: js`.

**`publish-py.yml`** — triggers on Python tags (`python-v*`), runs sync-definitions, builds Python, publishes to PyPI.

**`code-analysis.yml`** — updated:
- Lint job removed entirely (no ESLint)
- Test job: switch from `yarn` to `npm`, run JS and Python tests in parallel
- `setup-environment` action: cache key changes from `yarn.lock` to `package-lock.json`, install changes from `yarn install --frozen-lockfile` to `npm ci`

**`semantic-pr.yml`** — kept as-is (still validates PR titles)

### Versioning

Both packages share the same version number, starting at `2.0.0` (major bump). The `linked-versions` plugin ensures they always stay in sync. The `.release-please-manifest.json` tracks the current version for both.

## Phase 5: Tests

- **JS tests:** Migrate existing Jest tests from `lib/__test__/`. Update imports. Add a test that verifies all 46 JSON files load successfully and every unit can round-trip convert to itself.
- **Python tests:** Migrate existing pytest tests from the Python repo. Update imports. Add same round-trip test. Add tests for the new measures.
- **Cross-validation test** (optional, in `scripts/`): A Node.js script that runs conversions through both packages and asserts identical numeric results.

## Key Decisions

- **Version 2.0.0**: Both packages bump to `2.0.0` together, tracked by `.release-please-manifest.json`. The `linked-versions` plugin keeps them in sync on every release.
- **Node 24 LTS**: `.nvmrc` set to `24`. Target ES2024 in TypeScript. Use modern APIs like `structuredClone`, `Object.groupBy`, `import.meta.url`.
- **No ESLint**: Removed entirely. Linting can be re-added later with the new flat config format when needed.
- **npm over yarn**: `yarn.lock` deleted, `package-lock.json` used. CI uses `npm ci`.
- **ESM-first**: `"type": "module"` in package.json. CJS output is a secondary build target for backward compat. Uses `import`/`export` throughout.
- **No lodash**: The JS package drops `lodash.foreach` and `lodash.keys` in favor of native `Object.keys()`, `Object.entries()`, `for...of`, `.find()`, `.filter()`. Zero runtime dependencies.
- **Transform handling**: String expressions like `"val * 9 / 5 + 32"` are converted to functions at load time — `new Function` in JS, `compile()` in Python. Safe because definitions are bundled, not user-provided.
- **formationDensity**: Handled as a measure alias in the wrapper layer (both JS and Python), not as a separate JSON file. The loader maps `formationDensity` -> `density` definition.
- **Definitions directory in packages is gitignored**: The copied JSON files in `js/definitions/` and `py/src/corva_unit_converter/definitions/` are derived artifacts, generated by the sync script. Only `definitions/` at the root is the source of truth.
