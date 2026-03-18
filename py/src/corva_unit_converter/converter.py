from __future__ import annotations

import logging
from typing import Any, Optional

from .loader import load_bucket_mapping, load_definitions

_definitions: dict[str, dict[str, Any]] | None = None
_alias_cache: dict[str, str] | None = None
_bucket_mapping: dict[str, Any] | None = None


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


def list_units_with_aliases(
    measure: Optional[str] = None,
) -> list[dict[str, Any]]:
    """Return list of units with aliases, optionally filtered by measure."""
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
                    "aliases": unit.get("aliases", []),
                })

    return result


def possibilities(measure: Optional[str] = None) -> list[str]:
    """Return list of unit abbreviations, optionally filtered by measure."""
    definitions = _get_definitions()
    result: list[str] = []

    for measure_name, systems in definitions.items():
        if measure and measure != measure_name:
            continue
        for system_name, units in systems.items():
            if system_name == "_anchors":
                continue
            if not isinstance(units, dict):
                continue
            result.extend(units.keys())

    return result


def get_unit_key_by_alias(alias: str) -> Optional[str]:
    """Resolve an alias to its canonical unit key."""
    return _build_alias_cache().get(alias)


def get_unit_for_pair(
    abbr_one: str, abbr_two: str,
) -> Optional[tuple[dict[str, Any], dict[str, Any]]]:
    """Find two units within the same measure by their abbreviations."""
    definitions = _get_definitions()

    for measure_name, systems in definitions.items():
        found_one: Optional[dict[str, Any]] = None
        found_two: Optional[dict[str, Any]] = None

        for system_name, units in systems.items():
            if system_name == "_anchors":
                continue
            if not isinstance(units, dict):
                continue
            for test_abbr, unit in units.items():
                if test_abbr == abbr_one:
                    found_one = {
                        "abbr": abbr_one,
                        "measure": measure_name,
                        "system": system_name,
                        "unit": unit,
                    }
                elif test_abbr == abbr_two:
                    found_two = {
                        "abbr": abbr_two,
                        "measure": measure_name,
                        "system": system_name,
                        "unit": unit,
                    }
                if found_one and found_two:
                    break
            if found_one and found_two:
                break

        if found_one and found_two:
            return (found_one, found_two)

    return None


def bucket_mapping() -> dict[str, Any]:
    """Return the unit bucket mapping."""
    global _bucket_mapping
    if _bucket_mapping is None:
        _bucket_mapping = load_bucket_mapping()
    return _bucket_mapping


def to_best(
    value: float,
    unit_from: str,
    measure: Optional[str] = None,
    exclude: Optional[list[str]] = None,
) -> Optional[dict[str, Any]]:
    """Convert to the 'best' unit — smallest value >= 1 in the same system."""
    origin = get_unit(unit_from, measure)
    if not origin:
        return None

    exclude = exclude or []
    best: Optional[dict[str, Any]] = None

    for abbr in possibilities(origin["measure"]):
        if abbr in exclude:
            continue
        unit_info = describe(abbr, origin["measure"])
        if not unit_info or unit_info["system"] != origin["system"]:
            continue
        result = convert(value, unit_from, abbr, origin["measure"])
        if result is None:
            continue
        if best is None or (result >= 1 and result < best["val"]):
            best = {
                "val": result,
                "unit": abbr,
                "singular": unit_info["singular"],
                "plural": unit_info["plural"],
                "display": unit_info["display"],
            }

    return best


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

    @staticmethod
    def list_units_with_aliases(
        measure: Optional[str] = None,
    ) -> list[dict[str, Any]]:
        return list_units_with_aliases(measure)

    @staticmethod
    def possibilities(measure: Optional[str] = None) -> list[str]:
        return possibilities(measure)

    @staticmethod
    def get_unit_key_by_alias(alias: str) -> Optional[str]:
        return get_unit_key_by_alias(alias)

    @staticmethod
    def get_unit_for_pair(
        abbr_one: str, abbr_two: str,
    ) -> Optional[tuple[dict[str, Any], dict[str, Any]]]:
        return get_unit_for_pair(abbr_one, abbr_two)

    @staticmethod
    def bucket_mapping() -> dict[str, Any]:
        return bucket_mapping()

    @staticmethod
    def to_best(
        value: float,
        unit_from: str,
        measure: Optional[str] = None,
        exclude: Optional[list[str]] = None,
    ) -> Optional[dict[str, Any]]:
        return to_best(value, unit_from, measure, exclude)
