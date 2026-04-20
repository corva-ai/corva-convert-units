from __future__ import annotations

import pytest

from corva_unit_converter import (
    convert,
    describe,
    get_measures,
    get_unit,
    list_units,
)


# ---------------------------------------------------------------------------
# Basic length conversions
# ---------------------------------------------------------------------------

class TestBasicConversion:
    def test_ft_to_m(self):
        assert convert(1, "ft", "m") == pytest.approx(0.3048, abs=1e-4)

    def test_m_to_ft(self):
        assert convert(1, "m", "ft") == pytest.approx(3.28084, abs=1e-4)

    def test_km_to_mi(self):
        assert convert(1, "km", "mi") == pytest.approx(0.621371, abs=1e-4)

    def test_in_to_mm(self):
        assert convert(1, "in", "mm") == pytest.approx(25.4, abs=1e-2)

    def test_mm_to_in(self):
        assert convert(1, "mm", "in") == pytest.approx(0.0393701, abs=1e-4)

    def test_same_unit_returns_identity(self):
        assert convert(5, "ft", "ft") == 5

    def test_zero_value(self):
        assert convert(0, "ft", "m") == pytest.approx(0, abs=1e-10)


# ---------------------------------------------------------------------------
# Temperature
# ---------------------------------------------------------------------------

class TestTemperature:
    def test_0C_to_F(self):
        assert convert(0, "C", "F") == pytest.approx(32, abs=1e-4)

    def test_100C_to_F(self):
        assert convert(100, "C", "F") == pytest.approx(212, abs=1e-4)

    def test_32F_to_C(self):
        assert convert(32, "F", "C") == pytest.approx(0, abs=1e-4)

    def test_0C_to_K(self):
        assert convert(0, "C", "K") == pytest.approx(273.15, abs=1e-4)

    def test_0K_to_C(self):
        assert convert(0, "K", "C") == pytest.approx(-273.15, abs=1e-4)

    def test_32F_to_K(self):
        assert convert(32, "F", "K") == pytest.approx(273.15, abs=1e-1)

    def test_0K_to_F(self):
        assert convert(0, "K", "F") == pytest.approx(-459.67, abs=1e-1)


# ---------------------------------------------------------------------------
# Pressure
# ---------------------------------------------------------------------------

class TestPressure:
    def test_kPa_to_psi(self):
        assert convert(1, "kPa", "psi") == pytest.approx(0.14503768, abs=1e-4)

    def test_psi_to_kPa(self):
        assert convert(1, "psi", "kPa") == pytest.approx(6.89476, abs=1e-2)

    def test_Pa_to_bar(self):
        assert convert(1, "Pa", "bar") == pytest.approx(1e-5, abs=1e-9)

    def test_ksi_to_kPa(self):
        assert convert(1, "ksi", "kPa") == pytest.approx(6894.76, abs=1)


# ---------------------------------------------------------------------------
# Density
# ---------------------------------------------------------------------------

class TestDensity:
    def test_kg_m3_to_lb_gal(self):
        result = convert(1000, "kg/m3", "lb/gal")
        assert result is not None
        assert result == pytest.approx(8.345406, abs=1e-2)

    def test_g_cm3_to_kg_m3(self):
        result = convert(1, "g/cm3", "kg/m3")
        assert result is not None
        assert result == pytest.approx(1000, abs=1)


# ---------------------------------------------------------------------------
# With explicit measure
# ---------------------------------------------------------------------------

class TestExplicitMeasure:
    def test_length_measure(self):
        result = convert(1, "ft", "m", measure="length")
        assert result == pytest.approx(0.3048, abs=1e-4)

    def test_invalid_measure_returns_none(self):
        result = convert(1, "ft", "m", measure="not_a_measure")
        assert result is None


# ---------------------------------------------------------------------------
# Alias resolution
# ---------------------------------------------------------------------------

class TestAliasResolution:
    def test_meter_alias_to_m(self):
        assert convert(1, "meter", "m") == 1

    def test_feet_alias_to_ft(self):
        assert convert(1, "feet", "ft") == 1

    def test_alias_in_conversion(self):
        assert convert(1, "meter", "ft") == pytest.approx(3.28084, abs=1e-4)


# ---------------------------------------------------------------------------
# get_measures()
# ---------------------------------------------------------------------------

class TestGetMeasures:
    def test_returns_list(self):
        measures = get_measures()
        assert isinstance(measures, list)
        assert len(measures) > 0

    def test_contains_expected_measures(self):
        measures = get_measures()
        for m in ["length", "pressure", "temperature", "density", "volume"]:
            assert m in measures

    def test_contains_formation_density(self):
        assert "formation_density" in get_measures()

    def test_returns_snake_case(self):
        measures = get_measures()
        for m in measures:
            assert m == m.lower(), f"{m!r} is not snake_case"


# ---------------------------------------------------------------------------
# describe()
# ---------------------------------------------------------------------------

class TestDescribe:
    def test_known_unit(self):
        desc = describe("ft")
        assert desc is not None
        assert desc["abbr"] == "ft"
        assert desc["measure"] == "length"
        assert desc["system"] == "imperial"
        assert desc["singular"] == "Foot"
        assert desc["plural"] == "Feet"
        assert desc["display"] == "ft"

    def test_unknown_unit_returns_none(self):
        assert describe("xyz_invalid") is None


# ---------------------------------------------------------------------------
# get_unit()
# ---------------------------------------------------------------------------

class TestGetUnit:
    def test_returns_dict_for_known_unit(self):
        unit = get_unit("m")
        assert unit is not None
        assert unit["abbr"] == "m"
        assert unit["measure"] == "length"

    def test_returns_none_for_unknown(self):
        assert get_unit("xyz_invalid") is None


# ---------------------------------------------------------------------------
# list_units()
# ---------------------------------------------------------------------------

class TestListUnits:
    def test_returns_list(self):
        units = list_units()
        assert isinstance(units, list)
        assert len(units) > 10

    def test_filtered_by_measure(self):
        length_units = list_units("length")
        assert len(length_units) > 0
        for u in length_units:
            assert u["measure"] == "length"

    def test_unit_structure(self):
        units = list_units("length")
        u = units[0]
        assert "abbr" in u
        assert "measure" in u
        assert "system" in u
        assert "singular" in u
        assert "plural" in u
        assert "display" in u


# ---------------------------------------------------------------------------
# formationDensity
# ---------------------------------------------------------------------------

class TestFormationDensity:
    def test_formation_density_in_measures(self):
        assert "formation_density" in get_measures()

    def test_list_units_for_formation_density(self):
        units = list_units("formation_density")
        assert len(units) > 0

    def test_conversion_using_formation_density(self):
        result = convert(1, "kg/m3", "lb/gal", measure="formation_density")
        assert result is not None
        assert result == pytest.approx(
            convert(1, "kg/m3", "lb/gal", measure="density"),
            abs=1e-10,
        )


# ---------------------------------------------------------------------------
# Unsupported / error handling
# ---------------------------------------------------------------------------

class TestErrorHandling:
    def test_unsupported_from_unit(self):
        assert convert(1, "xyz_invalid", "m") is None

    def test_unsupported_to_unit(self):
        assert convert(1, "m", "xyz_invalid") is None


# ---------------------------------------------------------------------------
# Round-trip conversions
# ---------------------------------------------------------------------------

class TestRoundTrip:
    @pytest.mark.parametrize(
        "unit_from,unit_to,value",
        [
            ("ft", "m", 100),
            ("psi", "kPa", 14.7),
            ("kg/m3", "lb/gal", 1200),
            ("C", "F", 37),
            ("km", "mi", 42),
        ],
    )
    def test_round_trip(self, unit_from: str, unit_to: str, value: float):
        intermediate = convert(value, unit_from, unit_to)
        assert intermediate is not None
        back = convert(intermediate, unit_to, unit_from)
        assert back is not None
        assert back == pytest.approx(value, rel=1e-4)


# ---------------------------------------------------------------------------
# Possibilities
# ---------------------------------------------------------------------------

class TestPossibilities:
    def test_all_possibilities(self):
        from corva_unit_converter import possibilities

        result = possibilities()
        assert isinstance(result, list)
        assert len(result) > 100
        assert "m" in result
        assert "ft" in result
        assert "psi" in result

    def test_filtered_by_measure(self):
        from corva_unit_converter import possibilities

        result = possibilities("length")
        assert "m" in result
        assert "ft" in result
        assert "psi" not in result

    def test_unknown_measure_returns_empty(self):
        from corva_unit_converter import possibilities

        assert possibilities("nonexistent") == []


# ---------------------------------------------------------------------------
# List units with aliases
# ---------------------------------------------------------------------------

class TestListUnitsWithAliases:
    def test_returns_aliases(self):
        from corva_unit_converter import list_units_with_aliases

        result = list_units_with_aliases("length")
        assert len(result) > 0
        for item in result:
            assert "aliases" in item
            assert isinstance(item["aliases"], list)

    def test_unit_key_in_aliases(self):
        from corva_unit_converter import list_units_with_aliases

        result = list_units_with_aliases("length")
        for item in result:
            assert item["abbr"] in item["aliases"]


# ---------------------------------------------------------------------------
# Get unit key by alias
# ---------------------------------------------------------------------------

class TestGetUnitKeyByAlias:
    def test_exact_key(self):
        from corva_unit_converter import get_unit_key_by_alias

        assert get_unit_key_by_alias("m") == "m"

    def test_alias_resolves(self):
        from corva_unit_converter import get_unit_key_by_alias

        assert get_unit_key_by_alias("meter") == "m"

    def test_unknown_returns_none(self):
        from corva_unit_converter import get_unit_key_by_alias

        assert get_unit_key_by_alias("nonexistent_xyz") is None


# ---------------------------------------------------------------------------
# Get unit for pair
# ---------------------------------------------------------------------------

class TestGetUnitForPair:
    def test_same_measure(self):
        from corva_unit_converter import get_unit_for_pair

        result = get_unit_for_pair("ft", "m")
        assert result is not None
        assert result[0]["abbr"] == "ft"
        assert result[1]["abbr"] == "m"
        assert result[0]["measure"] == result[1]["measure"]

    def test_no_common_measure(self):
        from corva_unit_converter import get_unit_for_pair

        result = get_unit_for_pair("ft", "psi")
        assert result is None


# ---------------------------------------------------------------------------
# Bucket mapping
# ---------------------------------------------------------------------------

class TestBucketMapping:
    def test_returns_dict(self):
        from corva_unit_converter import bucket_mapping

        result = bucket_mapping()
        assert isinstance(result, dict)
        assert len(result) > 0


# ---------------------------------------------------------------------------
# To best
# ---------------------------------------------------------------------------

class TestToBest:
    def test_converts_to_best(self):
        from corva_unit_converter import to_best

        result = to_best(1200000, "mm")
        assert result is not None
        assert result["val"] == pytest.approx(1.2, rel=1e-4)
        assert result["unit"] == "km"

    def test_invalid_unit_returns_none(self):
        from corva_unit_converter import to_best

        assert to_best(1, "xyz_invalid") is None

    def test_stays_in_same_system(self):
        from corva_unit_converter import to_best

        result = to_best(5280, "ft")
        assert result is not None
        assert result["unit"] == "mi"


# ---------------------------------------------------------------------------
# definitions module backward compatibility
# ---------------------------------------------------------------------------

class TestDefinitionsModule:
    """The old package had ``corva_unit_converter.definitions.__all__`` as a
    sorted list of snake_case measure names."""

    def test_importable(self):
        from corva_unit_converter import definitions
        assert hasattr(definitions, "__all__")

    def test_all_is_list_of_strings(self):
        from corva_unit_converter.definitions import __all__ as measure_names
        assert isinstance(measure_names, list)
        assert all(isinstance(n, str) for n in measure_names)

    def test_snake_case_names(self):
        from corva_unit_converter.definitions import __all__ as measure_names
        for name in measure_names:
            assert name == name.lower(), f"{name!r} is not snake_case"

    def test_contains_expected_measures(self):
        from corva_unit_converter.definitions import __all__ as measure_names
        for m in ["length", "pressure", "temperature", "density", "volume"]:
            assert m in measure_names

    def test_snake_case_measures(self):
        from corva_unit_converter.definitions import __all__ as measure_names
        assert "acoustic_slowness" in measure_names
        assert "gas_flow_rate" in measure_names
        assert "formation_density" in measure_names

    def test_sorted(self):
        from corva_unit_converter.definitions import __all__ as measure_names
        assert measure_names == sorted(measure_names)


    def test_unknown_measure_returns_none(self):
        result = convert(1, "ft", "m", measure="completely_unknown_measure")
        assert result is None

    def test_get_measures_returns_snake_case(self):
        measures = get_measures()
        assert "acoustic_slowness" in measures
        assert "acousticSlowness" not in measures


