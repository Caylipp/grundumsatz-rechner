import { describe, expect, it } from 'vitest';
import { calculate } from '../src/calculate';
import type { CalcResult, Inputs } from '../src/types';

const base: Inputs = { sex: 'male', age: 30, heightCm: 180, weightKg: 80 };

function ok(input: Inputs): CalcResult {
  const r = calculate(input);
  if (!r.ok) throw new Error(JSON.stringify(r.errors));
  return r;
}

describe('calculate – Kaskade', () => {
  it('Stufe 1: nur Basisdaten → Mifflin ± 10 %', () => {
    const r = ok(base);
    expect(r.bmr.value).toBe(1780);
    expect(r.bmr.range).toBeCloseTo(178);
    expect(r.method).toBe('Mifflin-St Jeor');
    expect(r.steps).toHaveLength(1);
    expect(r.mifflinBreakdown.reduce((s, b) => s + b.kcal, 0)).toBe(1780);
    expect(r.tdee).toBeUndefined();
  });

  it('jede zusätzliche Angabe macht die Spanne schmaler', () => {
    const s1 = ok(base).bmr.range;
    const s2 = ok({ ...base, circumferences: { waistCm: 85, neckCm: 38 } }).bmr.range;
    const s3 = ok({ ...base, circumferences: { waistCm: 85, neckCm: 38 }, bodyFat: { percent: 16, source: 'dexa' } }).bmr.range;
    expect(s2).toBeLessThan(s1);
    expect(s3).toBeLessThan(s2);
  });

  it('Stufe 2: Körperfett → Katch-McArdle kombiniert mit Mifflin', () => {
    const r = ok({ ...base, bodyFat: { percent: 20, source: 'dexa' } });
    expect(r.bodyComposition?.ffmKg).toBeCloseTo(64);
    expect(r.method).toContain('Katch-McArdle');
    const katch = r.formulas.find((f) => f.id === 'katch_mcardle')!;
    expect(katch.kcal).toBeCloseTo(370 + 21.6 * 64);
    expect(katch.weight).toBeGreaterThan(0.5);
    // Ergebnis liegt zwischen beiden Formeln
    expect(r.bmr.value).toBeGreaterThan(Math.min(katch.kcal, 1780));
    expect(r.bmr.value).toBeLessThan(Math.max(katch.kcal, 1780));
    expect(r.steps.map((s) => s.id)).toEqual(['basis', 'bodyfat']);
  });

  it('Sportler:innen → Cunningham', () => {
    const r = ok({ ...base, athlete: true, bodyFat: { percent: 12, source: 'caliper' } });
    expect(r.method).toContain('Cunningham');
    expect(r.formulas.find((f) => f.id === 'cunningham')!.weight).toBeGreaterThan(0);
  });

  it('Frauen ohne Hüftumfang: Hinweis statt Navy', () => {
    const r = ok({ sex: 'female', age: 35, heightCm: 168, weightKg: 65, circumferences: { waistCm: 74, neckCm: 32 } });
    expect(r.bodyComposition).toBeUndefined();
    expect(r.hints.some((h) => h.text.includes('Hüftumfang'))).toBe(true);
  });

  it('Stufe 4: Korrekturen verändern Wert und verbreitern die Spanne', () => {
    const plain = ok(base);
    const r = ok({ ...base, modifiers: { thyroid: 'hypo_untreated', sleepHours: 5 } });
    expect(r.bmr.value).toBeCloseTo(1780 * 0.9 * 0.97, 0);
    expect(r.bmr.range).toBeGreaterThan(plain.bmr.range * 0.9 * 0.97);
    expect(r.steps).toHaveLength(3);
    expect(r.steps[1]!.deltaValue).toBeLessThan(0);
  });

  it('Schwangerschaft gilt nur für Frauen', () => {
    const r = ok({ ...base, modifiers: { pregnancy: 't3' } });
    expect(r.steps).toHaveLength(1);
    const f = ok({ sex: 'female', age: 30, heightCm: 165, weightKg: 70, modifiers: { pregnancy: 't3' } });
    expect(f.steps).toHaveLength(2);
  });

  it('Stillzeit: +500 kcal nur im Gesamtumsatz', () => {
    const f = ok({ sex: 'female', age: 30, heightCm: 165, weightKg: 62, modifiers: { pregnancy: 'breastfeeding' }, activity: { level: 'low' } });
    expect(f.tdee!.extraKcal).toBe(500);
    expect(f.tdee!.value).toBeCloseTo(f.bmr.value * 1.45 + 500);
  });

  it('Gesamtumsatz über PAL', () => {
    const r = ok({ ...base, activity: { level: 'moderate', sport: 'regular' } });
    expect(r.tdee!.pal).toBeCloseTo(1.95);
    expect(r.tdee!.value).toBeCloseTo(1780 * 1.95);
    expect(r.tdee!.source).toBe('pal');
  });

  it('Validierung', () => {
    const r = calculate({ sex: 'male', age: 10, heightCm: 180, weightKg: 80 });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors[0]!.field).toBe('age');
    const r2 = calculate({ ...base, circumferences: { waistCm: 60, neckCm: 70 } });
    expect(r2.ok).toBe(false);
  });

  it('Vorschläge sagen eine schmalere Spanne voraus', () => {
    const r = ok(base);
    const circ = r.suggestions.find((s) => s.id === 'circumferences')!;
    expect(circ.expectedRange).toBeLessThan(r.bmr.range);
    const bf = r.suggestions.find((s) => s.id === 'bodyfat')!;
    expect(bf.expectedRange).toBeLessThan(circ.expectedRange!);
    expect(r.suggestions.map((s) => s.id)).toContain('adaptive');
  });

  it('Genauigkeitswert steigt mit mehr Angaben', () => {
    const a = ok(base).precisionScore;
    const b = ok({ ...base, bodyFat: { percent: 18, source: 'dexa' }, circumferences: { waistCm: 84, neckCm: 39 } }).precisionScore;
    expect(b).toBeGreaterThan(a);
  });
});
