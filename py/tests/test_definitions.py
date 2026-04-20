from __future__ import annotations

import json
from pathlib import Path

import pytest

DEFINITIONS_DIR = (
    Path(__file__).resolve().parent.parent
    / "src"
    / "corva_unit_converter"
    / "definitions"
)

EXPECTED_DEF_COUNT = 46
BUCKET_MAPPING_FILE = "unit_bucket_mapping.json"


def _load_all_definitions() -> dict[str, dict]:
    defs = {}
    for path in sorted(DEFINITIONS_DIR.glob("*.json")):
        if path.name == BUCKET_MAPPING_FILE:
            continue
        with open(path) as f:
            defs[path.stem] = json.load(f)
    return defs


ALL_DEFINITIONS = _load_all_definitions()


# ---------------------------------------------------------------------------
# Definitions loading
# ---------------------------------------------------------------------------

class TestDefinitionsLoading:
    def test_definitions_directory_exists(self):
        assert DEFINITIONS_DIR.is_dir()

    def test_expected_definition_count(self):
        assert len(ALL_DEFINITIONS) == EXPECTED_DEF_COUNT

    def test_bucket_mapping_exists(self):
        bm_path = DEFINITIONS_DIR / BUCKET_MAPPING_FILE
        assert bm_path.exists()
        with open(bm_path) as f:
            data = json.load(f)
        assert isinstance(data, dict)
        assert len(data) > 0


# ---------------------------------------------------------------------------
# Unit structure validation
# ---------------------------------------------------------------------------

class TestUnitStructure:
    @pytest.mark.parametrize("measure_name", list(ALL_DEFINITIONS.keys()))
    def test_every_unit_has_required_fields(self, measure_name: str):
        definition = ALL_DEFINITIONS[measure_name]
        for system_name, units in definition.items():
            if system_name == "_anchors":
                continue
            if not isinstance(units, dict):
                continue
            for abbr, unit in units.items():
                if not isinstance(unit, dict):
                    continue
                assert "name" in unit, (
                    f"{measure_name}.{system_name}.{abbr} missing 'name'"
                )
                assert "to_anchor" in unit, (
                    f"{measure_name}.{system_name}.{abbr} missing 'to_anchor'"
                )
                assert "aliases" in unit, (
                    f"{measure_name}.{system_name}.{abbr} missing 'aliases'"
                )

                name = unit["name"]
                assert "singular" in name, (
                    f"{measure_name}.{system_name}.{abbr} name missing 'singular'"
                )
                assert "plural" in name, (
                    f"{measure_name}.{system_name}.{abbr} name missing 'plural'"
                )
                assert "display" in name, (
                    f"{measure_name}.{system_name}.{abbr} name missing 'display'"
                )


# ---------------------------------------------------------------------------
# Alias validation
# ---------------------------------------------------------------------------

class TestAliases:
    @pytest.mark.parametrize("measure_name", list(ALL_DEFINITIONS.keys()))
    def test_aliases_contain_unit_key(self, measure_name: str):
        definition = ALL_DEFINITIONS[measure_name]
        for system_name, units in definition.items():
            if system_name == "_anchors":
                continue
            if not isinstance(units, dict):
                continue
            for abbr, unit in units.items():
                if not isinstance(unit, dict):
                    continue
                aliases = unit.get("aliases", [])
                assert abbr in aliases, (
                    f"{measure_name}.{system_name}.{abbr}: "
                    f"unit key '{abbr}' not found in aliases {aliases}"
                )

    @pytest.mark.parametrize("measure_name", list(ALL_DEFINITIONS.keys()))
    def test_aliases_are_strings(self, measure_name: str):
        definition = ALL_DEFINITIONS[measure_name]
        for system_name, units in definition.items():
            if system_name == "_anchors":
                continue
            if not isinstance(units, dict):
                continue
            for abbr, unit in units.items():
                if not isinstance(unit, dict):
                    continue
                aliases = unit.get("aliases", [])
                assert isinstance(aliases, list), (
                    f"{measure_name}.{system_name}.{abbr}: aliases is not a list"
                )
                for alias in aliases:
                    assert isinstance(alias, str), (
                        f"{measure_name}.{system_name}.{abbr}: "
                        f"alias {alias!r} is not a string"
                    )


# ---------------------------------------------------------------------------
# Anchor validation
# ---------------------------------------------------------------------------

class TestAnchors:
    @pytest.mark.parametrize("measure_name", list(ALL_DEFINITIONS.keys()))
    def test_anchors_key_exists(self, measure_name: str):
        definition = ALL_DEFINITIONS[measure_name]
        assert "_anchors" in definition, (
            f"{measure_name} missing '_anchors' key"
        )

    @pytest.mark.parametrize("measure_name", list(ALL_DEFINITIONS.keys()))
    def test_anchors_have_required_fields(self, measure_name: str):
        anchors = ALL_DEFINITIONS[measure_name]["_anchors"]
        for system_name, anchor in anchors.items():
            assert "unit" in anchor, (
                f"{measure_name}._anchors.{system_name} missing 'unit'"
            )
            has_ratio = "ratio" in anchor
            has_transform = "transform" in anchor
            assert has_ratio or has_transform, (
                f"{measure_name}._anchors.{system_name} "
                f"must have 'ratio' or 'transform'"
            )

    @pytest.mark.parametrize("measure_name", list(ALL_DEFINITIONS.keys()))
    def test_anchor_systems_match_definition_systems(self, measure_name: str):
        definition = ALL_DEFINITIONS[measure_name]
        anchors = definition["_anchors"]
        data_systems = {
            k for k in definition
            if k != "_anchors" and isinstance(definition[k], dict) and len(definition[k]) > 0
        }
        anchor_systems = set(anchors.keys())
        assert anchor_systems >= data_systems, (
            f"{measure_name}: anchor systems {anchor_systems} "
            f"missing data systems {data_systems - anchor_systems}"
        )


# ---------------------------------------------------------------------------
# to_anchor values
# ---------------------------------------------------------------------------

class TestToAnchor:
    @pytest.mark.parametrize("measure_name", list(ALL_DEFINITIONS.keys()))
    def test_to_anchor_is_numeric(self, measure_name: str):
        definition = ALL_DEFINITIONS[measure_name]
        for system_name, units in definition.items():
            if system_name == "_anchors":
                continue
            if not isinstance(units, dict):
                continue
            for abbr, unit in units.items():
                if not isinstance(unit, dict):
                    continue
                to_anchor = unit["to_anchor"]
                assert isinstance(to_anchor, (int, float)), (
                    f"{measure_name}.{system_name}.{abbr}: "
                    f"to_anchor={to_anchor!r} is not numeric"
                )
