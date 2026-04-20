from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Callable


def _parse_transform(expr: str) -> Callable[[float], float]:
    code = compile(expr, "<transform>", "eval")

    def transform(val: float) -> float:
        return eval(code, {"__builtins__": {}}, {"val": val})  # noqa: S307

    return transform


def _find_definitions_dir() -> Path:
    try:
        from importlib.resources import files

        pkg_defs = files("corva_unit_converter") / "definitions"
        pkg_path = Path(str(pkg_defs))
        if pkg_path.is_dir():
            return pkg_path
    except (ImportError, TypeError):
        pass

    local = Path(__file__).parent / "definitions"
    if local.is_dir():
        return local

    current = Path(__file__).resolve().parent
    for _ in range(10):
        candidate = current / "definitions"
        if candidate.is_dir() and (candidate / "length.json").exists():
            return candidate
        current = current.parent

    raise FileNotFoundError("Cannot find definitions directory")


def _process_anchors(definition: dict[str, Any]) -> dict[str, Any]:
    anchors = definition.get("_anchors")
    if not anchors:
        return definition

    for anchor in anchors.values():
        if isinstance(anchor.get("transform"), str):
            anchor["transform"] = _parse_transform(anchor["transform"])

    return definition


_DEPRIORITIZED = [
    "mass",               # g → force (g-force) wins, per original Python library order
    "gravity",            # g → force wins (gravity not in original Python library)
    "pressure_gradient",  # kPa/m, psi/ft → density wins, per original Python library order
    "concentration",      # ppm → gas_concentration wins (not in original Python library)
    "parts_per",          # ppm → gas_concentration wins (not in original Python library)
    "proportion",         # % → gas_concentration wins, per original Python library order
    "gas_volume",         # gal/bbl/m3 → volume wins (volume is new; gives correct liquid anchors)
    "spontaneous_potential",  # mV → voltage wins (not in original Python library)
]
"""
Measures moved to the end of the lookup order so that "first occurrence wins"
in get_unit() resolves shared unit keys correctly.

Priority follows the original corva-convert-units-py hardcoded measure order.
For measures not present in the original library, the correct general measure wins.

  mass / gravity          — share g with force; force (g-force) wins
  pressure_gradient       — shares kPa/m and psi/ft with density; density wins
  concentration           — shares ppm with gas_concentration; gas_concentration wins
  parts_per               — shares ppm with gas_concentration; gas_concentration wins
  proportion              — shares % with gas_concentration; gas_concentration wins
  gas_volume              — shares gal/bbl/m3 with volume; volume wins (correct liquid anchors)
  spontaneous_potential   — shares mV with voltage; voltage wins

Callers who need the specialised measure must pass it explicitly, e.g.
  convert(value, 'bbl', 'm3', 'gas_volume')
"""


def load_definitions() -> dict[str, dict[str, Any]]:
    defs_dir = _find_definitions_dir()
    definitions: dict[str, dict[str, Any]] = {}

    for path in sorted(defs_dir.glob("*.json")):
        if path.stem == "unit_bucket_mapping":
            continue
        with open(path) as f:
            definitions[path.stem] = _process_anchors(json.load(f))

    if "density" in definitions:
        definitions["formation_density"] = definitions["density"]

    deprioritized = {k: definitions.pop(k) for k in _DEPRIORITIZED if k in definitions}
    definitions.update(deprioritized)

    return definitions


def load_bucket_mapping() -> dict[str, Any]:
    defs_dir = _find_definitions_dir()
    with open(defs_dir / "unit_bucket_mapping.json") as f:
        return json.load(f)
