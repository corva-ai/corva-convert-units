from __future__ import annotations

import logging
from typing import Any, Optional

from .loader import load_definitions

_definitions: dict[str, dict[str, Any]] | None = None
_alias_cache: dict[str, str] | None = None


def _get_definitions() -> dict[str, dict[str, Any]]:
    global _definitions
    if _definitions is None:
        _definitions = load_definitions()
    return _definitions


def _resolve_abbr_in_measure(abbr: str, measure_name: str) -> str:
    systems = _get_definitions().get(measure_name)
    if not systems:
        return abbr

    for system_name, units in systems.items():
        if system_name == "_anchors":
            continue
        if not isinstance(units, dict):
            continue

        if abbr in units:
            return abbr

        for unit_key, unit in units.items():
            if not isinstance(unit, dict):
                continue
            for alias in unit.get("aliases", []):
                if alias == abbr:
                    return unit_key

    return abbr


def _build_alias_cache() -> dict[str, str]:
    global _alias_cache
    if _alias_cache is not None:
        return _alias_cache

    _alias_cache = {}
    for systems in _get_definitions().values():
        for system_name, units in systems.items():
            if system_name == "_anchors":
                continue
            if not isinstance(units, dict):
                continue
            for unit_key, unit in units.items():
                if not isinstance(unit, dict):
                    continue
                for alias in unit.get("aliases", []):
                    _alias_cache[alias] = unit_key
                _alias_cache[unit_key] = unit_key

    return _alias_cache


def get_unit(
    abbr: str, measure: Optional[str] = None,
) -> dict[str, Any] | None:
    """Find unit by abbreviation or alias."""
    definitions = _get_definitions()

    if measure:
        resolved = _resolve_abbr_in_measure(abbr, measure)
        systems = definitions.get(measure, {})

        for system_name, units in systems.items():
            if system_name == "_anchors":
                continue
            if not isinstance(units, dict):
                continue
            if resolved in units:
                return {
                    "abbr": resolved,
                    "measure": measure,
                    "system": system_name,
                    "unit": units[resolved],
                }
        return None

    def _find_by_key(key: str) -> dict[str, Any] | None:
        for measure_name, sys in definitions.items():
            for system_name, units in sys.items():
                if system_name == "_anchors":
                    continue
                if not isinstance(units, dict):
                    continue
                if key in units:
                    return {
                        "abbr": key,
                        "measure": measure_name,
                        "system": system_name,
                        "unit": units[key],
                    }
        return None

    found = _find_by_key(abbr)
    if found:
        return found

    resolved = _build_alias_cache().get(abbr)
    if resolved is not None:
        return _find_by_key(resolved)

    return None


def convert(
    value: float,
    unit_from: str,
    unit_to: str,
    measure: Optional[str] = None,
) -> float | None:
    """Convert a value from one unit to another."""
    definitions = _get_definitions()

    if measure is not None and measure not in definitions:
        logging.info(
            "Invalid measure: %s. Available: %s",
            measure, list(definitions.keys())
        )
        return None

    origin = get_unit(unit_from, measure)
    destination = get_unit(unit_to, measure)

    if not origin or not destination:
        return None

    if origin["abbr"] == destination["abbr"]:
        return value

    result = value * origin["unit"]["to_anchor"]

    if "anchor_shift" in origin["unit"]:
        result -= origin["unit"]["anchor_shift"]

    if origin["system"] != destination["system"]:
        anchor = definitions[origin["measure"]]["_anchors"][origin["system"]]
        transform = anchor.get("transform")
        if callable(transform):
            result = transform(result)
        else:
            result *= anchor["ratio"]

    if "anchor_shift" in destination["unit"]:
        result += destination["unit"]["anchor_shift"]

    return result / destination["unit"]["to_anchor"]


def get_measures() -> list[str]:
    """Return list of available measure names."""
    return list(_get_definitions().keys())


def describe(
    abbr: str, measure: Optional[str] = None,
) -> dict[str, Any] | None:
    """Return unit metadata dict."""
    resp = get_unit(abbr, measure)
    if not resp:
        return None
    return {
        "abbr": resp["abbr"],
        "measure": resp["measure"],
        "system": resp["system"],
        "singular": resp["unit"]["name"]["singular"],
        "plural": resp["unit"]["name"]["plural"],
        "display": resp["unit"]["name"]["display"],
    }


def list_units(measure: Optional[str] = None) -> list[dict[str, Any]]:
    """Return list of units, optionally filtered by measure."""
    definitions = _get_definitions()
    result: list[dict[str, Any]] = []

    for measure_name, systems in definitions.items():
        if measure and measure != measure_name:
            continue
        for system_name, units in systems.items():
            if system_name == "_anchors":
                continue
            if not isinstance(units, dict):
                continue
            for abbr, unit in units.items():
                if not isinstance(unit, dict):
                    continue
                result.append({
                    "abbr": abbr,
                    "measure": measure_name,
                    "system": system_name,
                    "singular": unit["name"]["singular"],
                    "plural": unit["name"]["plural"],
                    "display": unit["name"]["display"],
                })

    return result


class Converter:
    """Backward-compatible class wrapper around the functional API."""

    def convert(
        self,
        unit_from: str,
        unit_to: str,
        value: float,
        measure: Optional[str] = None,
    ) -> float | None:
        return convert(value, unit_from, unit_to, measure)

    @staticmethod
    def get_unit(
        abbr: str, measure: Optional[str] = None,
    ) -> dict[str, Any] | None:
        return get_unit(abbr, measure)

    @staticmethod
    def get_measures() -> list[str]:
        return get_measures()

    @staticmethod
    def describe(
        abbr: str, measure: Optional[str] = None,
    ) -> dict[str, Any] | None:
        return describe(abbr, measure)

    @staticmethod
    def list_units(measure: Optional[str] = None) -> list[dict[str, Any]]:
        return list_units(measure)
