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
    "density",            # kPa/m, psi/ft → pressure_gradient wins (old PY density had neither)
    "formation_density",  # same data as density
    "concentration",      # ppm → gas_concentration wins (concentration not in old PY)
    "parts_per",          # ppm → gas_concentration wins (parts_per was unwired in old PY)
    "proportion",         # % → gas_concentration wins, per original Python library order
    "force",              # g → mass (gram) wins (old PY force had no g; it came from JS)
    "gravity",            # g → mass wins (gravity not in old PY)
    "gas_volume",         # gal/bbl/m3 → volume wins (volume is new; gives correct liquid anchors)
    "spontaneous_potential",  # mV → voltage wins (not in old PY)
]
"""
Measures moved to the end of the lookup order so that "first occurrence wins"
in get_unit() resolves shared unit keys correctly.

Priority replicates the behavior of the original corva-convert-units-py library.
Several of these collisions did not exist there at all — the shared keys were
added to the specialised measures during the definitions sync — so the measure
that exclusively owned the key in the original library must keep winning:

  density / formation_density — kPa/m, psi/ft belonged only to pressure_gradient
  concentration / parts_per   — ppm resolved to gas_concentration
  proportion                  — % resolved to gas_concentration (earlier in old order)
  force / gravity             — g belonged only to mass (gram)
  gas_volume                  — gal/bbl/m3 must use volume's liquid anchors
  spontaneous_potential       — mV belonged only to voltage

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
