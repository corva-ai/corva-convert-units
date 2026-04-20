.PHONY: sync-defs build-js build-py test-js test-py test validate clean

sync-defs:
	bash scripts/sync-definitions.sh

build-js: sync-defs
	cd js && npm run build

build-py: sync-defs
	cd py && .venv/bin/python3 -m build

test-js: sync-defs
	cd js && npm test

test-py: sync-defs
	cd py && .venv/bin/python3 -m pytest

test: test-js test-py

validate:
	node scripts/validate-definitions.mjs

clean:
	rm -rf js/dist js/definitions py/src/corva_unit_converter/definitions
