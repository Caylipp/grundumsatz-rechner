import { describe, expect, it } from 'vitest';
import { calculate } from '../src/calculate';
import { durninWomersley, jacksonPollock3, jacksonPollock7, rfmBodyFat, ymcaBodyFat } from '../src/formulas';
import { LOCALES } from '../src/i18n';
import type { CalcResult, Inputs } from '../src/types';

const base: Inputs = { sex: 'male', age: 30, heightCm: 180, weightKg: 80 };
const three = { chest: 12, abdomen: 20, thigh: 15 };
const seven = { ...three, triceps: 11, subscapular: 13, suprailiac: 14, midaxillary: 11 };

function ok(input: Inputs, locale: (typeof LOCALES)[number] = 'de'): CalcResult {
  const r = calculate(input, { locale });
  if (!r.ok) throw new Error(JSON.stringify(r.errors));
  return r;
}

describe('weitere Körperfett-Formeln', () => {
  it('Jackson-Pollock 3-Punkt (Männer)', () => {
    // Summe 47 mm, 30 J. → Dichte ≈ 1,0671 → ≈ 13,9 %
    expect(jacksonPollock3('male', 30, three)).toBeCloseTo(13.9, 0);
    expect(jacksonPollock3('male', 30, { chest: 12 })).toBeNull();
  });

  it('Jackson-Pollock 3-Punkt (Frauen) nutzt andere Stellen', () => {
    expect(jacksonPollock3('female', 30, three)).toBeNull();
    const bf = jacksonPollock3('female', 30, { triceps: 18, suprailiac: 15, thigh: 25 });
    expect(bf!).toBeGreaterThan(18);
    expect(bf!).toBeLessThan(28);
  });

  it('Jackson-Pollock 7-Punkt', () => {
    const bf = jacksonPollock7('male', 30, seven)!;
    expect(bf).toBeGreaterThan(10);
    expect(bf).toBeLessThan(18);
  });

  it('Durnin-Womersley', () => {
    const bf = durninWomersley('male', 35, { biceps: 6, triceps: 10, subscapular: 12, suprailiac: 12 })!;
    expect(bf).toBeGreaterThan(12);
    expect(bf).toBeLessThan(22);
  });

  it('YMCA und RFM', () => {
    expect(ymcaBodyFat('male', 85, 80)).toBeCloseTo(14.7, 0);
    expect(rfmBodyFat('male', 180, 85)).toBeCloseTo(21.6, 1);
    expect(rfmBodyFat('female', 165, 75)).toBeCloseTo(32, 0);
  });
});

describe('Caliper-Stufen', () => {
  it('7 Hautfalten sind genauer als 3', () => {
    const r3 = ok({ ...base, skinfolds: three });
    const r7 = ok({ ...base, skinfolds: seven });
    expect(r7.bmr.range).toBeLessThan(r3.bmr.range);
    expect(r3.stages.find((s) => s.id === 'caliper3')!.done).toBe(true);
    expect(r3.stages.find((s) => s.id === 'caliper7')!.done).toBe(false);
    expect(r7.stages.find((s) => s.id === 'caliper7')!.done).toBe(true);
    expect(r7.bodyComposition!.measurements.map((m) => m.source)).toEqual(['jp7']);
  });

  it('von geübter Person gemessen ist genauer als selbst gemessen', () => {
    const self = ok({ ...base, skinfolds: three, skinfoldMeasurer: 'self' });
    const pro = ok({ ...base, skinfolds: three, skinfoldMeasurer: 'trained' });
    expect(pro.bmr.range).toBeLessThan(self.bmr.range);
  });

  it('unvollständige Hautfalten → Hinweis', () => {
    const r = ok({ ...base, skinfolds: { chest: 12 } });
    expect(r.bodyComposition).toBeUndefined();
    expect(r.hints.some((h) => h.text.includes('Hautfalten'))).toBe(true);
  });

  it('Vorschlag wechselt von 3 auf 7 Punkte', () => {
    expect(ok(base).suggestions.map((s) => s.id)).toContain('caliper3');
    const r3 = ok({ ...base, skinfolds: three });
    const s7 = r3.suggestions.find((s) => s.id === 'caliper7')!;
    expect(s7.expectedRange!).toBeLessThan(r3.bmr.range);
  });

  it('Umfänge + Caliper + Waage werden als unabhängige Gruppen kombiniert', () => {
    const circ = ok({ ...base, circumferences: { waistCm: 85, neckCm: 38 } });
    const all = ok({ ...base, circumferences: { waistCm: 85, neckCm: 38 }, skinfolds: seven, bodyFat: { percent: 15, source: 'bia8' } });
    expect(all.bmr.range).toBeLessThan(circ.bmr.range);
    expect(all.steps.find((s) => s.id === 'bodyfat')!.title).toContain('mehreren Methoden');
  });
});

describe('Körperfettwaage', () => {
  it('mehrere Messungen mitteln verkleinert den Fehler, aber nicht unter den systematischen Anteil', () => {
    const one = ok({ ...base, bodyFat: { percent: 18, source: 'bia' } }).bodyComposition!.range;
    const ten = ok({ ...base, bodyFat: { percent: 18, source: 'bia', readings: 10 } }).bodyComposition!.range;
    expect(ten).toBeLessThan(one);
    expect(ten).toBeGreaterThan(4.5);
  });

  it('8-Elektroden-Waage ist genauer als nur Füße', () => {
    const feet = ok({ ...base, bodyFat: { percent: 18, source: 'bia' } }).bmr.range;
    const hands = ok({ ...base, bodyFat: { percent: 18, source: 'bia8' } }).bmr.range;
    expect(hands).toBeLessThan(feet);
  });
});

describe('gemessener Ruheumsatz', () => {
  it('Labormessung dominiert das Ergebnis', () => {
    const r = ok({ ...base, measuredRmr: { kcal: 1650, method: 'lab' } });
    expect(r.bmr.value).toBeLessThan(1700);
    expect(r.bmr.range).toBeLessThan(100);
    expect(r.formulas.find((f) => f.id === 'measured')!.weight).toBeGreaterThan(0.7);
    expect(r.stages.find((s) => s.id === 'measured')!.done).toBe(true);
  });

  it('Handgerät ist weniger genau als Labor', () => {
    const lab = ok({ ...base, measuredRmr: { kcal: 1780, method: 'lab' } });
    const hand = ok({ ...base, measuredRmr: { kcal: 1780, method: 'handheld' } });
    expect(hand.bmr.range).toBeGreaterThan(lab.bmr.range);
  });

  it('große Abweichung erzeugt Warnhinweis', () => {
    const r = ok({ ...base, measuredRmr: { kcal: 1300, method: 'handheld' } });
    expect(r.hints.some((h) => h.level === 'warn')).toBe(true);
  });

  it('Formelgewichte summieren sich auf 1', () => {
    const r = ok({ ...base, skinfolds: seven, measuredRmr: { kcal: 1800, method: 'handheld' } });
    expect(r.formulas.reduce((s, f) => s + f.weight, 0)).toBeCloseTo(1);
  });
});

describe('Sprachen', () => {
  it('liefert in jeder Sprache dieselben Zahlen, aber eigene Texte', () => {
    const input: Inputs = { ...base, skinfolds: three, activity: { level: 'low' }, modifiers: { sleepHours: 5 } };
    const results = LOCALES.map((l) => ok(input, l));
    for (const r of results) expect(r.bmr.value).toBeCloseTo(results[0]!.bmr.value);
    const titles = new Set(results.map((r) => r.steps[1]!.title));
    expect(titles.size).toBe(LOCALES.length);
  });

  it('Validierungsfehler sind übersetzt', () => {
    const en = calculate({ sex: 'male', age: 5, heightCm: 180, weightKg: 80 }, { locale: 'en' });
    const vi = calculate({ sex: 'male', age: 5, heightCm: 180, weightKg: 80 }, { locale: 'vi' });
    expect(!en.ok && en.errors[0]!.message).toContain('Age');
    expect(!vi.ok && vi.errors[0]!.message).toContain('Tuổi');
  });
});
