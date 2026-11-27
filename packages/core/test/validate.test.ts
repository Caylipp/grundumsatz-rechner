import { describe, expect, it } from 'vitest';
import { validate } from '../src/validate';

const ok = { sex: 'male', age: 30, heightCm: 180, weightKg: 80 } as const;
const fields = (errs: { field: string }[]) => errs.map((e) => e.field);

describe('validate', () => {
  it('akzeptiert gültige Basisangaben', () => {
    expect(validate({ ...ok })).toEqual([]);
  });

  it('meldet fehlende Pflichtfelder', () => {
    expect(fields(validate({}))).toEqual(['sex', 'age', 'heightCm', 'weightKg']);
  });

  it('prüft Bereichsgrenzen inklusiv', () => {
    expect(validate({ ...ok, age: 15 })).toEqual([]);
    expect(validate({ ...ok, age: 100 })).toEqual([]);
    expect(fields(validate({ ...ok, age: 14 }))).toEqual(['age']);
    expect(fields(validate({ ...ok, heightCm: 231 }))).toEqual(['heightCm']);
    expect(fields(validate({ ...ok, weightKg: 29.9 }))).toEqual(['weightKg']);
  });

  it('weist NaN und Infinity ab', () => {
    expect(fields(validate({ ...ok, age: NaN }))).toEqual(['age']);
    expect(fields(validate({ ...ok, weightKg: Infinity }))).toEqual(['weightKg']);
  });

  it('verlangt Nacken < Taille', () => {
    const errs = validate({ ...ok, circumferences: { waistCm: 55, neckCm: 60 } });
    expect(fields(errs)).toEqual(['neckCm']);
    expect(validate({ ...ok, circumferences: { waistCm: 85, neckCm: 38 } })).toEqual([]);
  });

  it('prüft Körperfett, Hautfalten, gemessenen Ruheumsatz und Schlaf', () => {
    expect(fields(validate({ ...ok, bodyFat: { percent: 2 } as never }))).toEqual(['bodyFat']);
    expect(fields(validate({ ...ok, skinfolds: { chest: 1 } as never }))).toEqual(['skinfold.chest']);
    expect(fields(validate({ ...ok, measuredRmr: { kcal: 600 } as never }))).toEqual(['rmr']);
    expect(fields(validate({ ...ok, modifiers: { sleepHours: 15 } as never }))).toEqual(['sleepHours']);
  });

  it('liefert Meldungen je Sprache', () => {
    const de = validate({}, 'de')[0]!.message;
    const en = validate({}, 'en')[0]!.message;
    expect(de).not.toBe(en);
    expect(de.length).toBeGreaterThan(0);
  });
});
