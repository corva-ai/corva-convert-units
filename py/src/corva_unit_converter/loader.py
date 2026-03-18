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


def load_definitions() -> dict[str, dict[str, Any]]:
    defs_dir = _find_definitions_dir()
    definitions: dict[str, dict[str, Any]] = {}

    for path in sorted(defs_dir.glob("*.json")):
        if path.stem == "unitBucketMapping":
            continue
        with open(path) as f:
            definitions[path.stem] = _process_anchors(json.load(f))

    if "density" in definitions:
        definitions["formationDensity"] = definitions["density"]

    return definitions


def load_bucket_mapping() -> dict[str, Any]:
    defs_dir = _find_definitions_dir()
    with open(defs_dir / "unitBucketMapping.json") as f:
        return json.load(f)
