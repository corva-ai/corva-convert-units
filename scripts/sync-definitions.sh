#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEFS_DIR="$REPO_ROOT/definitions"

JS_DEST="$REPO_ROOT/js/definitions"
PY_DEST="$REPO_ROOT/py/src/corva_unit_converter/definitions"

echo "Syncing definitions from $DEFS_DIR"

mkdir -p "$JS_DEST" "$PY_DEST"

cp "$DEFS_DIR"/*.json "$JS_DEST/"
cp "$DEFS_DIR"/*.json "$PY_DEST/"

echo "Synced $(ls "$JS_DEST"/*.json | wc -l | tr -d ' ') JSON files to js/definitions/"
echo "Synced $(ls "$PY_DEST"/*.json | wc -l | tr -d ' ') JSON files to py/src/corva_unit_converter/definitions/"
