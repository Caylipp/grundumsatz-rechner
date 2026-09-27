import { describe, expect, it } from 'vitest';
import { adaptiveTdee, isoFromDay, dayNumber } from '../src/adaptive';
import { calculate } from '../src/calculate';
import type { LogEntry } from '../src/types';

/** Deterministisches Pseudo-Rauschen */
function noise(i: number): number {
  return Math.sin(i * 12.9898) * 0.35;
}

function makeLog(days: number, intake: number, kgPerWeek: number, start = '2026-08-01'): LogEntry[] {
  const d0 = dayNumber(start);
  return Array.from({ length: days }, (_, i) => ({
    date: isoFromDay(d0 + i),
    weightKg: 85 + (kgPerWeek / 7) * i + noise(i),
    kcal: intake + Math.round(Math.cos(i) * 250),
  }));
}

describe('adaptiver Verbrauch', () => {
  it('zu wenige Daten → insufficient mit Gründen', () => {
    const r = adaptiveTdee(makeLog(7, 2200, -0.5));
    expect(r.status).toBe('insufficient');
    if (r.status === 'insufficient') expect(r.reasons.length).toBeGreaterThan(0);
  });

  it('rechnet den Verbrauch aus Abnahme und Zufuhr zurück', () => {
    const r = adaptiveTdee(makeLog(28, 2200, -0.5));
    expect(r.status).toBe('ok');
    if (r.status !== 'ok') return;
    // 2200 + 0,5 kg/Woche × 7700 / 7 ≈ 2750
    expect(r.tdee).toBeGreaterThan(2550);
    expect(r.tdee).toBeLessThan(2950);
    expect(r.slopeKgPerWeek).toBeCloseTo(-0.5, 0);
    expect(r.range).toBeLessThan(350);
    expect(r.trend.length).toBe(28);
  });

  it('mehr Tage → schmalere Spanne', () => {
    const a = adaptiveTdee(makeLog(15, 2200, -0.5));
    const b = adaptiveTdee(makeLog(28, 2200, -0.5));
    if (a.status !== 'ok' || b.status !== 'ok') throw new Error('erwartet ok');
    expect(b.range).toBeLessThan(a.range);
  });

  it('nutzt nur die letzten 28 Tage', () => {
    const r = adaptiveTdee(makeLog(60, 2200, 0));
    expect(r.status === 'ok' && r.days).toBe(28);
  });

  it('ignoriert ungültige Werte und Tage ohne Kalorien', () => {
    const log = makeLog(21, 2400, 0).map((e, i) => (i % 5 === 0 ? { ...e, kcal: null } : e));
    log.push({ date: 'kaputt', weightKg: 80, kcal: 2000 });
    const r = adaptiveTdee(log);
    expect(r.status).toBe('ok');
    if (r.status === 'ok') expect(r.kcalDays).toBe(16);
  });

  it('fließt in calculate ein und liefert impliziten PAL', () => {
    const r = calculate({ sex: 'male', age: 35, heightCm: 182, weightKg: 85, activity: { level: 'low' }, log: makeLog(28, 2200, -0.5) });
    if (!r.ok) throw new Error('erwartet ok');
    expect(r.tdee!.source).toBe('combined');
    expect(r.tdee!.range).toBeLessThan(r.tdee!.formula!.range);
    expect(r.tdee!.impliedPal).toBeGreaterThan(1.3);
    expect(r.stages.find((s) => s.id === 'adaptive')!.done).toBe(true);
  });
});
