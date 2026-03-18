import convert, { Converter } from '../src/index.js';

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

describe('convert — chained API', () => {
  it('converts ft to m via from/to', () => {
    expect(convert(1).from('ft').to('m')).toBeCloseTo(0.3048, 4);
  });

  it('converts m to ft via from/to', () => {
    expect(convert(1).from('m').to('ft')).toBeCloseTo(3.28084, 4);
  });

  it('returns same value for same unit', () => {
    expect(convert(5).from('ft').to('ft')).toBe(5);
  });

  it('throws when .to is called before .from', () => {
    expect(() => convert(1).to('m')).toThrow('.to must be called after .from');
  });

  it('throws when .from is called after .to', () => {
    const c = convert(1);
    c.from('ft');
    c.to('m');
    expect(() => c.from('km')).toThrow('.from must be called before .to');
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
    expect(convert.getUnitKeyByAlias('meter')).toBe('m');
  });

  it('getUnitKeyByAlias returns undefined for unknown alias', () => {
    expect(convert.getUnitKeyByAlias('not_a_unit_xyz')).toBeUndefined();
  });
});

describe('convert.measures()', () => {
  it('returns an array of measure names', () => {
    const measures = convert.measures();
    expect(Array.isArray(measures)).toBe(true);
    expect(measures.length).toBeGreaterThan(0);
  });

  it('contains expected measures', () => {
    const measures = convert.measures();
    expect(measures).toContain('length');
    expect(measures).toContain('pressure');
    expect(measures).toContain('temperature');
    expect(measures).toContain('density');
    expect(measures).toContain('volume');
  });

  it('contains formationDensity (aliased from density)', () => {
    expect(convert.measures()).toContain('formationDensity');
  });
});

describe('convert.describe()', () => {
  it('returns metadata for a known unit', () => {
    const desc = convert.describe('ft');
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
    expect(() => convert.describe('xyz_invalid')).toThrow(/Unsupported unit/);
  });
});

describe('convert.list()', () => {
  it('returns all units when no measure specified', () => {
    const all = convert.list();
    expect(all.length).toBeGreaterThan(10);
    expect(all[0]).toHaveProperty('abbr');
    expect(all[0]).toHaveProperty('measure');
    expect(all[0]).toHaveProperty('system');
    expect(all[0]).toHaveProperty('singular');
  });

  it('filters by measure', () => {
    const lengthUnits = convert.list('length');
    expect(lengthUnits.length).toBeGreaterThan(0);
    for (const u of lengthUnits) {
      expect(u.measure).toBe('length');
    }
  });
});

describe('convert.possibilities()', () => {
  it('returns unit abbreviations for a measure', () => {
    const p = convert.possibilities('length');
    expect(Array.isArray(p)).toBe(true);
    expect(p).toContain('ft');
    expect(p).toContain('m');
    expect(p).toContain('km');
  });

  it('returns all possibilities when no measure given', () => {
    const all = convert.possibilities();
    expect(all.length).toBeGreaterThan(50);
  });

  it('supports formationDensity', () => {
    const p = convert.possibilities('formationDensity');
    expect(p.length).toBeGreaterThan(0);
    expect(p).toContain('kg/m3');
  });
});

describe('convert.bucketMapping()', () => {
  it('returns an object', () => {
    const bm = convert.bucketMapping();
    expect(typeof bm).toBe('object');
    expect(bm).not.toBeNull();
  });

  it('has mapping keys', () => {
    const bm = convert.bucketMapping();
    const keys = Object.keys(bm);
    expect(keys.length).toBeGreaterThan(0);
  });
});

describe('error cases', () => {
  it('throws for unsupported unit in direct API', () => {
    expect(() => convert(1, 'xyz_invalid', 'm')).toThrow(/Unsupported unit/);
  });

  it('throws for incompatible measures', () => {
    expect(() => convert(1, 'ft', 'C')).toThrow(/Cannot convert incompatible measures/);
  });

  it('throws for unsupported measure in Converter constructor', () => {
    expect(() => new Converter(1, 'not_a_measure')).toThrow(/Unsupported measure/);
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

describe('Converter class', () => {
  it('exposes measures()', () => {
    const c = new Converter(1);
    expect(c.measures()).toContain('length');
  });

  it('exposes list()', () => {
    const c = new Converter(1);
    const list = c.list('length');
    expect(list.length).toBeGreaterThan(0);
  });

  it('exposes possibilities()', () => {
    const c = new Converter(1);
    const p = c.possibilities('pressure');
    expect(p).toContain('psi');
    expect(p).toContain('kPa');
  });

  it('exposes describe()', () => {
    const c = new Converter(1);
    const desc = c.describe('m');
    expect(desc.abbr).toBe('m');
    expect(desc.measure).toBe('length');
  });

  it('exposes getUnitBucketMapping()', () => {
    const c = new Converter(1);
    const bm = c.getUnitBucketMapping();
    expect(typeof bm).toBe('object');
    expect(Object.keys(bm).length).toBeGreaterThan(0);
  });

  it('exposes getUnitKeyByAlias()', () => {
    const c = new Converter(1);
    expect(c.getUnitKeyByAlias('meter')).toBe('m');
  });

  it('supports listWithAlias()', () => {
    const c = new Converter(1);
    const list = c.listWithAlias('length');
    expect(list.length).toBeGreaterThan(0);
    const m = list.find((u) => u.abbr === 'm');
    expect(m?.aliases).toContain('meter');
  });
});
