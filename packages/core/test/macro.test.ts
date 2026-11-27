import { describe, expect, it } from 'vitest';
import { LOCALES } from '../src/i18n';
import { planMacros, type MacroInput, type MacroOk } from '../src/macro';
import { buildBackup, decodeShare, encodeShare, parseBackup } from '../src/backup';

const base: MacroInput = {
  age: 35,
  heightCm: 180,
  weightKg: 80,
  energy: 2400,
  energyRange: 0,
  direction: 'maintain',
};

function ok(input: Partial<MacroInput> = {}): MacroOk {
  const r = planMacros({ ...base, ...input });
  if (r.status !== 'ok') throw new Error('Fehler nicht erwartet');
  return r;
}

describe('Makro-Verteilung', () => {
  it('Eiweiß nach Ziel: Abnehmen höher als Halten, Spannen statt Einzelwert', () => {
    const lose = ok({ direction: 'lose' });
    const keep = ok();
    const gain = ok({ direction: 'gain' });
    expect(lose.proteinPerKg).toEqual({ low: 1.8, high: 2.4 });
    expect(lose.protein.mid).toBeGreaterThan(gain.protein.mid);
    expect(gain.protein.mid).toBeGreaterThan(keep.protein.mid);
    expect(lose.protein.low).toBeLessThan(lose.protein.high);
    expect(lose.refKind).toBe('weight');
  });

  it('Bezug auf fettfreie Masse, wenn bekannt', () => {
    const r = ok({ direction: 'lose', ffmKg: 60 });
    expect(r.refKind).toBe('ffm');
    expect(r.protein.low).toBeCloseTo(2.3 * 60, 5);
    expect(r.protein.high).toBeCloseTo(3.1 * 60, 5);
  });

  it('Fett: mindestens 0,6 g/kg und 20 % der Energie, Obergrenze 35 %', () => {
    const r = ok({ energy: 2400, weightKg: 80 });
    expect(r.fat.low).toBeCloseTo(Math.max(48, (0.2 * 2400) / 9), 5); // 53,3
    expect(r.fat.high).toBeCloseTo((0.35 * 2400) / 9, 5);
    const light = ok({ energy: 1500, weightKg: 100, direction: 'lose' });
    expect(light.fat.low).toBeCloseTo(60, 5); // 0,6 g/kg schlägt 20 %
  });

  it('Kohlenhydrate sind der Rest; Einzelwerte ergeben die Energie', () => {
    const r = ok();
    const kcal = 4 * r.protein.mid + 9 * r.fat.mid + 4 * r.carbs.mid;
    expect(kcal).toBeCloseTo(2400, 3);
    expect(r.share.protein + r.share.fat + r.share.carbs).toBeCloseTo(1, 5);
    expect(r.carbs.low).toBeLessThanOrEqual(r.carbs.mid);
    expect(r.carbs.high).toBeGreaterThanOrEqual(r.carbs.mid);
  });

  it('Unsicherheit des Umsatzes verbreitert die Kohlenhydrat-Spanne', () => {
    const exact = ok({ energyRange: 0 });
    const wide = ok({ energyRange: 240 });
    expect(wide.carbs.high - wide.carbs.low).toBeGreaterThan(exact.carbs.high - exact.carbs.low);
    expect(wide.carbs.high - exact.carbs.high).toBeCloseTo(60, 5); // 240 kcal / 4
    expect(wide.carbs.mid).toBeCloseTo(exact.carbs.mid, 5);
  });

  it('eigener Eiweißwert: feste Menge, Wertebereich geprüft', () => {
    const r = ok({ proteinPerKg: 2 });
    expect(r.customProtein).toBe(true);
    expect(r.protein.low).toBe(160);
    expect(r.protein.high).toBe(160);
    for (const bad of [0.3, 5, NaN]) expect(planMacros({ ...base, proteinPerKg: bad }).status).toBe('error');
  });

  it('Warnung bei unplausibler Kombination (Minimum übersteigt Energie)', () => {
    const r = ok({ energy: 1000, weightKg: 120, direction: 'lose' });
    expect(r.warnings.some((w) => w.level === 'warn')).toBe(true);
    expect(r.carbs.mid).toBe(0);
    expect(r.carbs.low).toBe(0);
  });

  it('Warnungen: sehr hoher Eiweißanteil, wenig Kohlenhydrate, Minderjährige, BMI ≥ 30 ohne Körperfett', () => {
    expect(ok({ proteinPerKg: 3.2, energy: 2000 }).warnings.length).toBeGreaterThan(0);
    expect(ok({ age: 16 }).warnings.some((w) => w.level === 'warn')).toBe(true);
    expect(ok({ weightKg: 110, heightCm: 170 }).warnings.length).toBeGreaterThan(0);
    expect(ok({ weightKg: 110, heightCm: 170, ffmKg: 70 }).warnings.length).toBe(0);
    expect(ok().warnings).toEqual([]);
  });

  it('alle Sprachen: Warntexte vorhanden und ohne Platzhalterreste', () => {
    for (const locale of LOCALES) {
      const r = planMacros({ ...base, energy: 900, weightKg: 120, heightCm: 170, age: 16, proteinPerKg: 3.4, direction: 'lose', locale });
      if (r.status !== 'ok') throw new Error('x');
      expect(r.warnings.length).toBeGreaterThan(3);
      for (const w of r.warnings) expect(w.text).not.toMatch(/undefined|NaN|\$\{/);
      const e = planMacros({ ...base, proteinPerKg: 9, locale });
      expect(e.status === 'error' && e.errors[0]!.message.length > 5).toBe(true);
    }
  });
});

describe('Eiweiß-Eingabe in Sicherung und Teilen-Link (rückwärtskompatibel)', () => {
  it('geht durch Sicherung und Link; alte Sicherungen ohne das Feld bleiben gültig', () => {
    const goal = { targetKg: '75', pace: 'moderate', weeks: '', proteinPerKg: '2,1' };
    const b = parseBackup(JSON.stringify(buildBackup({ age: '30' }, goal, [])));
    expect(b?.goal.proteinPerKg).toBe('2,1');
    expect(decodeShare(encodeShare({ age: '30' }, goal))?.goal.proteinPerKg).toBe('2,1');
    const old = decodeShare(encodeShare({ age: '30' }, { targetKg: '75', pace: 'moderate', weeks: '' }));
    expect(old?.goal.proteinPerKg).toBeUndefined();
  });
});
