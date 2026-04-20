#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEFS_DIR="$REPO_ROOT/definitions"

JS_DEST="$REPO_ROOT/js/definitions"
PY_DEST="$REPO_ROOT/py/src/corva_unit_converter/definitions"

echo "Syncing definitions from $DEFS_DIR"

mkdir -p "$JS_DEST" "$PY_DEST"
rm -f "$JS_DEST"/*.json "$PY_DEST"/*.json

cp "$DEFS_DIR"/*.json "$JS_DEST/"

camel_to_snake() {
  python3 -c "
import re, sys
s = re.sub(r'([A-Z]+)([A-Z][a-z])', r'\1_\2', sys.argv[1])
print(re.sub(r'([a-z0-9])([A-Z])', r'\1_\2', s).lower())
" "$1"
}

for f in "$DEFS_DIR"/*.json; do
  stem=$(basename "$f" .json)
  snake=$(camel_to_snake "$stem")
  cp "$f" "$PY_DEST/${snake}.json"
done

echo "Synced $(ls "$JS_DEST"/*.json | wc -l | tr -d ' ') JSON files to js/definitions/"
echo "Synced $(ls "$PY_DEST"/*.json | wc -l | tr -d ' ') JSON files to py/src/corva_unit_converter/definitions/"
