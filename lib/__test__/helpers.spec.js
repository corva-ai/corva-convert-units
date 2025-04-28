const { reverseObject, getAliases } = require('../helpers');
const energy = require('../definitions/energy');

describe('reverseObject', () => {
    it('should reverse object key with array of values', () => {
        const object = {
            ft: ['f', 'ft'],
            m: ['m', 'm.'],
            in: ['in', 'inch'],
            mm: ['mm'],
        };
        const expected = {
            'f': 'ft',
            'ft': 'ft',
            'in': 'in',
            'inch': 'in',
            'm': 'm',
            'm.': 'm',
            'mm': 'mm',
        };
        const result = reverseObject(object);

        expect(result).toEqual(expected);
    });

    it('should transform values to lowercase', () => {
        const object = {
            ft: ['f', 'FT'],
            m: ['m', 'M.'],
            in: ['in', 'INCH'],
            mm: ['mM'],
        };
        const expected = {
            'f': 'ft',
            'ft': 'ft',
            'in': 'in',
            'inch': 'in',
            'm': 'm',
            'm.': 'm',
            'mm': 'mm',
        };
        const result = reverseObject(object);

        expect(result).toEqual(expected);
    });
});

describe('getAliases', () => {
    it('should get array of units from aliases', () => {
        const expected = ['Nm', 'kNm', 'kN.m', 'J', 'ft-lbf', 'ft.lbf','ft-klbf', 'kft-lbf', 'ft.klbf'];
        const result = [...getAliases(energy.metric), ...getAliases(energy.imperial)];

        expect(result).toEqual(expected);
    });

    it('should get array of units from aliases without excluded values', () => {
        const expected = ['J', 'ft-lbf', 'ft.lbf', 'ft-klbf', 'kft-lbf', 'ft.klbf'];
        const excluded = ['Nm', 'kNm'];
        const result = [...getAliases(energy.metric, excluded), ...getAliases(energy.imperial)];

        expect(result).toEqual(expected);
    });

    it('should return empty array', () => {
        const expected = [];
        const result = [...getAliases({})];

        expect(result).toEqual(expected);
    });
});
