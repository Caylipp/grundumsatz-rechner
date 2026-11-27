import { describe, expect, it } from 'vitest';
import { LOCALES } from '../src/i18n';
import { planGoal, type GoalInput, type GoalOk } from '../src/goal';

const base: GoalInput = {
  sex: 'male',
  age: 35,
  heightCm: 180,
  weightKg: 90,
  targetKg: 80,
  tdee: { value: 2800, range: 280 },
  bmr: { value: 1800, range: 150 },
  pace: { kind: 'rate', pace: 'moderate' },
};

function ok(input: Partial<GoalInput> = {}): GoalOk {
  const r = planGoal({ ...base, ...input });
  if (r.status !== 'ok') throw new Error('Fehler erwartet nicht');
  return r;
}

describe('Zielplan', () => {
  it('Abnahme: Defizit aus Tempo, Zufuhr unter Erhaltung', () => {
    const r = ok();
    expect(r.direction).toBe('lose');
    // 0,5 % von 90 kg = 0,45 kg/Woche → 0,45 × 7700 / 7 ≈ 495 kcal
    expect(r.balance).toBeCloseTo(-495, -1);
    expect(r.intake).toBe(Math.round(2800 - 495));
    expect(r.rateKgPerWeek).toBeCloseTo(-0.45, 2);
    expect(r.ratePct).toBeCloseTo(0.5, 2);
  });

  it('Unsicherheit: Spanne enthält Verbrauchsfehler und Energiedichte (quadratisch)', () => {
    const r = ok();
    expect(r.balanceRange).toBeCloseTo(Math.hypot(280, 495 * 0.1), 0);
    expect(r.balanceRange).toBeGreaterThan(280);
    expect(r.rateRange).toBeCloseTo((r.balanceRange / 7700) * 7, 5);
  });

  it('Dauer: günstiger Fall kürzer, ungünstiger länger; Reihenfolge fast < expected < slow', () => {
    const r = ok();
    expect(r.weeks).not.toBeNull();
    expect(r.weeksFast!).toBeLessThan(r.weeks!);
    expect(r.weeks!).toBeLessThan(r.weeksSlow!);
  });

  it('Verlangsamung: länger als die lineare Rechnung, aber nah dran bei kurzer Strecke', () => {
    const r = ok();
    const linear = 10 / 0.45; // kg / (kg pro Woche)
    expect(r.weeks!).toBeGreaterThan(linear);
    expect(r.weeks!).toBeLessThan(linear * 1.3);
    const short = ok({ targetKg: 88 });
    expect(short.weeks!).toBeGreaterThan(2 / 0.45);
    expect(short.weeks!).toBeLessThan((2 / 0.45) * 1.08);
  });

  it('Zeitplan-Modus: Kurve trifft das Ziel genau nach der gewählten Zeit', () => {
    const r = ok({ pace: { kind: 'weeks', weeks: 20 } });
    expect(r.weeks).toBeCloseTo(20, 1);
    const at20 = r.curve.find((p) => p.week === 20)!;
    expect(at20.expected).toBeCloseTo(80, 1);
    expect(at20.fast).toBeLessThan(80);
    expect(at20.slow).toBeGreaterThan(80);
    // 10 kg in 20 Wochen braucht mehr als die lineare Rate von 0,5 kg/Woche
    expect(r.rateKgPerWeek).toBeLessThan(-0.5);
  });

  it('Zunahme: Überschuss, günstiger Fall = niedrigerer Verbrauch', () => {
    const r = ok({ targetKg: 95, pace: { kind: 'rate', pace: 'moderate' } });
    expect(r.direction).toBe('gain');
    expect(r.balance).toBeGreaterThan(0);
    expect(r.weeksFast!).toBeLessThan(r.weeks!);
    expect(r.weeksSlow === null || r.weeksSlow > r.weeks!).toBe(true);
  });

  it('Gleichgewicht: zu weit gestecktes Ziel wird nicht erreicht', () => {
    // 0,1 % von 90 kg ≈ 0,09 kg/Woche → Plateau nur wenige kg unter dem Start
    const r = ok({ targetKg: 70, pace: { kind: 'rate', pace: 'gentle' } });
    expect(r.weeks).toBeNull();
    expect(r.plateauKg).toBeGreaterThan(70);
    expect(r.plateauKg).toBeLessThan(90);
    expect(r.warnings.some((w) => w.level === 'info')).toBe(true);
  });

  it('Erhalt: Zielgewicht ≈ aktuelles Gewicht → Erhaltungskalorien', () => {
    const r = ok({ targetKg: 90.2 });
    expect(r.direction).toBe('maintain');
    expect(r.intake).toBe(2800);
    expect(r.weeks).toBe(0);
  });

  it('Sicherheitsgrenzen: Zufuhr unter Mindestwert, zu schnelle Abnahme', () => {
    const r = ok({ tdee: { value: 1900, range: 190 }, bmr: { value: 1500, range: 120 }, weightKg: 100, targetKg: 70, pace: { kind: 'weeks', weeks: 10 } });
    expect(r.intake).toBeLessThan(1500);
    expect(r.warnings.filter((w) => w.level === 'warn').length).toBeGreaterThanOrEqual(3);
  });

  it('Frauen: Untergrenze 1200 kcal', () => {
    const r = ok({ sex: 'female', tdee: { value: 1900, range: 190 }, bmr: { value: 1350, range: 120 }, weightKg: 70, targetKg: 60, pace: { kind: 'weeks', weeks: 8 } });
    expect(r.intake).toBeLessThan(1200);
    expect(r.warnings.some((w) => w.text.includes('1.200') || w.text.includes('1,200') || w.text.includes('1200'))).toBe(true);
  });

  it('Untergewicht als Ziel oder Start wird gewarnt', () => {
    const target = ok({ heightCm: 180, targetKg: 55 });
    expect(target.warnings.some((w) => w.level === 'warn' && w.text.includes('17'))).toBe(true);
    const start = ok({ weightKg: 50, targetKg: 48 });
    expect(start.warnings.some((w) => w.level === 'warn' && w.text.includes('15'))).toBe(true);
  });

  it('Minderjährige werden gewarnt', () => {
    expect(ok({ age: 16 }).warnings[0]!.level).toBe('warn');
  });

  it('Eingabefehler: Zielgewicht und Wochen', () => {
    const r = planGoal({ ...base, targetKg: 10, pace: { kind: 'weeks', weeks: 1 } });
    expect(r.status).toBe('error');
    if (r.status === 'error') expect(r.errors.map((e) => e.field)).toEqual(['targetKg', 'weeks']);
    expect(planGoal({ ...base, targetKg: Number.NaN }).status).toBe('error');
  });

  it('Kurve beginnt beim Startgewicht und ist monoton', () => {
    const r = ok();
    expect(r.curve[0]!.expected).toBeCloseTo(90, 6);
    for (let i = 1; i < r.curve.length; i++) {
      expect(r.curve[i]!.expected).toBeLessThan(r.curve[i - 1]!.expected);
      expect(r.curve[i]!.fast).toBeLessThan(r.curve[i]!.expected);
      expect(r.curve[i]!.slow).toBeGreaterThan(r.curve[i]!.expected);
    }
  });

  it('alle Sprachen liefern Warnungen ohne leere Texte', () => {
    for (const locale of LOCALES) {
      const r = ok({ locale, age: 16, weightKg: 100, targetKg: 70, tdee: { value: 1900, range: 190 }, bmr: { value: 1500, range: 120 }, pace: { kind: 'weeks', weeks: 10 } });
      expect(r.warnings.length).toBeGreaterThan(2);
      for (const w of r.warnings) expect(w.text.length).toBeGreaterThan(20);
      const e = planGoal({ ...base, locale, targetKg: 1 });
      if (e.status === 'error') expect(e.errors[0]!.message).toMatch(/25/);
    }
  });
});
