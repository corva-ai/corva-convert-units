from __future__ import annotations

import pytest

from corva_unit_converter import (
    Converter,
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
        assert "formationDensity" in get_measures()


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
        assert "formationDensity" in get_measures()

    def test_list_units_for_formation_density(self):
        units = list_units("formationDensity")
        assert len(units) > 0

    def test_conversion_using_formation_density(self):
        result = convert(1, "kg/m3", "lb/gal", measure="formationDensity")
        assert result is not None
        assert result == pytest.approx(
            convert(1, "kg/m3", "lb/gal", measure="density"),
            abs=1e-10,
        )


# ---------------------------------------------------------------------------
# Backward-compatible Converter class
# ---------------------------------------------------------------------------

class TestConverterClass:
    def test_convert_method(self):
        c = Converter()
        result = c.convert("ft", "m", 1)
        assert result == pytest.approx(0.3048, abs=1e-4)

    def test_get_measures(self):
        c = Converter()
        measures = c.get_measures()
        assert "length" in measures

    def test_describe(self):
        c = Converter()
        desc = c.describe("ft")
        assert desc is not None
        assert desc["abbr"] == "ft"

    def test_list_units(self):
        c = Converter()
        units = c.list_units("pressure")
        assert len(units) > 0

    def test_get_unit(self):
        c = Converter()
        unit = c.get_unit("psi")
        assert unit is not None
        assert unit["abbr"] == "psi"


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
