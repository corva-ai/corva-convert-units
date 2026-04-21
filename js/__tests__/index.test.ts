import convert, {
  getMeasures,
  describe as describeUnit,
  getUnit,
  getUnitForPair,
  listUnits,
  listUnitsWithAliases,
  possibilities,
  toBest,
  bucketMapping,
  getUnitKeyByAlias,
} from '../src/index';

describe('convert — direct API (3-arg / 4-arg)', () => {
  it('converts ft to m', () => {
    expect(convert(1, 'ft', 'm')).toBeCloseTo(0.3048, 4);
  });

  it('converts m to ft', () => {
    expect(convert(1, 'm', 'ft')).toBeCloseTo(3.28084, 4);
  });

  it('converts with explicit measure', () => {
    expect(convert(1, 'ft', 'm', 'length')).toBeCloseTo(0.3048, 4);
  });

  it('returns same value for same unit', () => {
    expect(convert(5, 'ft', 'ft')).toBe(5);
  });

  it('converts km to mi', () => {
    expect(convert(1, 'km', 'mi')).toBeCloseTo(0.621371, 4);
  });

  it('converts in to mm', () => {
    expect(convert(1, 'in', 'mm')).toBeCloseTo(25.4, 2);
  });
});

describe('temperature conversions', () => {
  it('converts 0 °C to 32 °F', () => {
    expect(convert(0, 'C', 'F')).toBeCloseTo(32, 4);
  });

  it('converts 100 °C to 212 °F', () => {
    expect(convert(100, 'C', 'F')).toBeCloseTo(212, 4);
  });

  it('converts 32 °F to 0 °C', () => {
    expect(convert(32, 'F', 'C')).toBeCloseTo(0, 4);
  });

  it('converts 0 °C to 273.15 K', () => {
    expect(convert(0, 'C', 'K')).toBeCloseTo(273.15, 4);
  });

  it('converts 0 K to −273.15 °C', () => {
    expect(convert(0, 'K', 'C')).toBeCloseTo(-273.15, 4);
  });

  it('converts 32 °F to 273.15 K', () => {
    expect(convert(32, 'F', 'K')).toBeCloseTo(273.15, 2);
  });

  it('converts 0 K to −459.67 °F', () => {
    expect(convert(0, 'K', 'F')).toBeCloseTo(-459.67, 1);
  });
});

describe('pressure conversions', () => {
  it('converts 1 kPa to psi', () => {
    expect(convert(1, 'kPa', 'psi')).toBeCloseTo(0.14503768, 4);
  });

  it('converts 1 psi to kPa', () => {
    expect(convert(1, 'psi', 'kPa')).toBeCloseTo(6.89476, 3);
  });

  it('converts 1 Pa to bar', () => {
    expect(convert(1, 'Pa', 'bar')).toBeCloseTo(1e-5, 8);
  });

  it('converts 1 ksi to kPa', () => {
    expect(convert(1, 'ksi', 'kPa')).toBeCloseTo(6894.76, 0);
  });
});

describe('density conversions', () => {
  it('converts kg/m3 to lb/gal', () => {
    const result = convert(1000, 'kg/m3', 'lb/gal');
    expect(result).toBeCloseTo(8.345406, 2);
  });

  it('converts g/cm3 to kg/m3', () => {
    expect(convert(1, 'g/cm3', 'kg/m3')).toBeCloseTo(1000, 0);
  });
});

describe('digital conversions', () => {
  it('converts 1 B to 8 b', () => {
    expect(convert(1, 'B', 'b')).toBeCloseTo(8, 4);
  });

  it('converts 1 KB to 1024 B', () => {
    expect(convert(1, 'KB', 'B')).toBeCloseTo(1024, 4);
  });

  it('converts 1 Kb to 128 B', () => {
    expect(convert(1, 'Kb', 'B')).toBeCloseTo(128, 4);
  });

  it('converts 1 MB to 1048576 B', () => {
    expect(convert(1, 'MB', 'B')).toBeCloseTo(1048576, 0);
  });
});

describe('alias resolution', () => {
  it('resolves "meter" alias to "m" (same unit)', () => {
    expect(convert(1, 'meter', 'm')).toBe(1);
  });

  it('resolves "feet" alias to "ft"', () => {
    expect(convert(1, 'feet', 'ft')).toBe(1);
  });

  it('converts using alias on source', () => {
    expect(convert(1, 'meter', 'ft')).toBeCloseTo(3.28084, 4);
  });

  it('getUnitKeyByAlias resolves known alias', () => {
    expect(getUnitKeyByAlias('meter')).toBe('m');
  });

  it('getUnitKeyByAlias returns undefined for unknown alias', () => {
    expect(getUnitKeyByAlias('not_a_unit_xyz')).toBeUndefined();
  });
});

describe('getMeasures()', () => {
  it('returns an array of measure names', () => {
    const ms = getMeasures();
    expect(Array.isArray(ms)).toBe(true);
    expect(ms.length).toBeGreaterThan(0);
  });

  it('contains expected measures', () => {
    const ms = getMeasures();
    expect(ms).toContain('length');
    expect(ms).toContain('pressure');
    expect(ms).toContain('temperature');
    expect(ms).toContain('density');
    expect(ms).toContain('volume');
  });

  it('contains formationDensity (aliased from density)', () => {
    expect(getMeasures()).toContain('formationDensity');
  });
});

describe('getUnit()', () => {
  it('returns a resolved unit for a known abbreviation', () => {
    const unit = getUnit('ft');
    expect(unit).toMatchObject({
      abbr: 'ft',
      measure: 'length',
      system: 'imperial',
    });
    expect(unit?.unit).toHaveProperty('to_anchor');
  });

  it('resolves an alias to its canonical unit', () => {
    const unit = getUnit('meter');
    expect(unit?.abbr).toBe('m');
  });

  it('returns undefined for an unknown abbreviation', () => {
    expect(getUnit('xyz_invalid')).toBeUndefined();
  });

  it('finds a unit within a specific measure', () => {
    const unit = getUnit('ft', 'length');
    expect(unit?.abbr).toBe('ft');
    expect(unit?.measure).toBe('length');
  });
});

describe('getUnitForPair()', () => {
  it('returns both units when they share the same measure', () => {
    const pair = getUnitForPair('ft', 'm');
    expect(pair).not.toBeNull();
    const [one, two] = pair!;
    expect(one.abbr).toBe('ft');
    expect(two.abbr).toBe('m');
    expect(one.measure).toBe(two.measure);
  });

  it('returns null when units belong to different measures', () => {
    expect(getUnitForPair('ft', 'C')).toBeNull();
  });

  it('returns null for unknown abbreviations', () => {
    expect(getUnitForPair('xyz', 'm')).toBeNull();
  });
});

describe('describeUnit()', () => {
  it('returns metadata for a known unit', () => {
    const desc = describeUnit('ft');
    expect(desc).toMatchObject({
      abbr: 'ft',
      measure: 'length',
      system: 'imperial',
      singular: 'Foot',
      plural: 'Feet',
      display: 'ft',
    });
  });

  it('throws for an unknown unit', () => {
    expect(() => describeUnit('xyz_invalid')).toThrow(/Unsupported unit/);
  });
});

describe('listUnits()', () => {
  it('returns all units when no measure specified', () => {
    const all = listUnits();
    expect(all.length).toBeGreaterThan(10);
    expect(all[0]).toHaveProperty('abbr');
    expect(all[0]).toHaveProperty('measure');
    expect(all[0]).toHaveProperty('system');
    expect(all[0]).toHaveProperty('singular');
  });

  it('filters by measure', () => {
    const lengthUnits = listUnits('length');
    expect(lengthUnits.length).toBeGreaterThan(0);
    for (const u of lengthUnits) {
      expect(u.measure).toBe('length');
    }
  });
});

describe('possibilities()', () => {
  it('returns unit abbreviations for a measure', () => {
    const p = possibilities('length');
    expect(Array.isArray(p)).toBe(true);
    expect(p).toContain('ft');
    expect(p).toContain('m');
    expect(p).toContain('km');
  });

  it('returns all possibilities when no measure given', () => {
    const all = possibilities();
    expect(all.length).toBeGreaterThan(50);
  });

  it('supports formationDensity', () => {
    const p = possibilities('formationDensity');
    expect(p.length).toBeGreaterThan(0);
    expect(p).toContain('kg/m3');
  });
});

describe('toBest()', () => {
  it('returns the best unit for a length', () => {
    const best = toBest(100000, 'mm');
    expect(best).toBeDefined();
    expect(best!.val).toBeGreaterThanOrEqual(1);
  });

  it('respects the exclude list', () => {
    const best = toBest(100000, 'mm', undefined, ['m']);
    expect(best?.unit).not.toBe('m');
  });

  it('returns undefined for an unknown unit', () => {
    expect(toBest(1, 'xyz_unknown')).toBeUndefined();
  });
});

describe('bucketMapping', () => {
  it('is an object', () => {
    expect(typeof bucketMapping).toBe('object');
    expect(bucketMapping).not.toBeNull();
  });

  it('has mapping keys', () => {
    expect(Object.keys(bucketMapping).length).toBeGreaterThan(0);
  });
});

describe('listUnitsWithAliases()', () => {
  it('includes aliases on units', () => {
    const list = listUnitsWithAliases('length');
    expect(list.length).toBeGreaterThan(0);
    const m = list.find((u) => u.abbr === 'm');
    expect(m?.aliases).toContain('meter');
  });
});

describe('lookup priority — shared unit keys resolve to the correct measure', () => {
  /**
   * Several unit keys appear in more than one measure with different anchor
   * chains. The loader deprioritises the specialised measures so that the
   * general measure always wins when no explicit measure is passed.
   *
   * See definitions/SYNC_REPORT.md — "Known Issue" section for full details.
   */

  // --- volume: liquid anchors must win over gas-accounting anchors ----------

  it('m3 resolves to volume (not gasVolume)', () => {
    expect(describeUnit('m3').measure).toBe('volume');
  });

  it('bbl resolves to volume (not gasVolume)', () => {
    expect(describeUnit('bbl').measure).toBe('volume');
  });

  it('gal resolves to volume (not gasVolume)', () => {
    expect(describeUnit('gal').measure).toBe('volume');
  });

  it('m3→bbl uses liquid anchors (~628.98, not gas-accounting ~630.36)', () => {
    expect(convert(100, 'm3', 'bbl')).toBeCloseTo(628.981, 2);
  });

  it('gal→l uses liquid anchors (~378.54, not gas-accounting ~376.77)', () => {
    expect(convert(100, 'gal', 'l')).toBeCloseTo(378.541, 2);
  });

  it('bbl→fl-oz uses liquid anchors (268.8)', () => {
    expect(convert(0.05, 'bbl', 'fl-oz')).toBeCloseTo(268.8, 4);
  });

  it('gasVolume is still reachable with explicit measure', () => {
    expect(convert(100, 'm3', 'bbl', 'gasVolume')).toBeCloseTo(630.357, 2);
  });

  // --- voltage: mV must resolve to voltage, not spontaneousPotential --------

  it('mV resolves to voltage (not spontaneousPotential)', () => {
    expect(describeUnit('mV').measure).toBe('voltage');
  });

  it('V→mV converts correctly (1000)', () => {
    expect(convert(1, 'V', 'mV')).toBeCloseTo(1000, 6);
  });

  // --- mass: g must resolve to mass (gram) per original JS library order ----

  it('g resolves to mass (gram, not force g-force)', () => {
    expect(describeUnit('g').measure).toBe('mass');
  });

  it('g→kg: 1000 g = 1 kg (gram conversion, not g-force)', () => {
    expect(convert(1000, 'g', 'kg')).toBeCloseTo(1, 6);
  });

  // --- pressureGradient: kPa/m and psi/ft must resolve to pressureGradient --

  it('kPa/m resolves to pressureGradient (not density)', () => {
    expect(describeUnit('kPa/m').measure).toBe('pressureGradient');
  });

  it('psi/ft resolves to pressureGradient (not density)', () => {
    expect(describeUnit('psi/ft').measure).toBe('pressureGradient');
  });

  // --- proportion: % must resolve to proportion; partsPer wins for ppm ------

  it('% resolves to proportion (not gasConcentration)', () => {
    expect(describeUnit('%').measure).toBe('proportion');
  });

  it('%→Fraction: 50% = 0.5', () => {
    expect(convert(50, '%', 'Fraction')).toBeCloseTo(0.5, 6);
  });

  it('ppm resolves to partsPer (not concentration or gasConcentration)', () => {
    expect(describeUnit('ppm').measure).toBe('partsPer');
  });

  // --- ft → m: exact SI value -----------------------------------------------

  it('ft→m is exactly 0.3048 (SI international foot)', () => {
    expect(convert(1, 'ft', 'm')).toBe(0.3048);
  });
});

describe('error cases', () => {
  it('throws for unsupported unit', () => {
    expect(() => convert(1, 'xyz_invalid', 'm')).toThrow(/Unsupported unit/);
  });

  it('throws for incompatible measures', () => {
    expect(() => convert(1, 'ft', 'C')).toThrow(/Cannot convert incompatible measures/);
  });
});

describe('round-trip conversions', () => {
  const cases: Array<{ from: string; to: string; value: number }> = [
    { from: 'ft', to: 'm', value: 100 },
    { from: 'psi', to: 'kPa', value: 14.7 },
    { from: 'kg/m3', to: 'lb/gal', value: 1200 },
    { from: 'C', to: 'F', value: 37 },
    { from: 'b', to: 'B', value: 8192 },
  ];

  for (const { from, to, value } of cases) {
    it(`round-trips ${value} ${from} → ${to} → ${from}`, () => {
      const intermediate = convert(value, from, to);
      const back = convert(intermediate, to, from);
      expect(back).toBeCloseTo(value, 2);
    });
  }
});
