import { describe, expect, it } from 'vitest';
import { buildBackup, decodeShare, encodeShare, parseBackup, sanitizeFields, sanitizeLog } from '../src/backup';

const form = { sex: 'female', age: '34', height: '168', weight: '64,5', bf: '', athlete: false, smoker: true, remember: true };

describe('Sicherung (JSON)', () => {
  it('Rundreise erhält Eingaben, Ziel und Verlauf', () => {
    const log = [
      { date: '2026-11-02', weightKg: 64.2, kcal: 2100 },
      { date: '2026-11-01', weightKg: 64.5, kcal: null },
    ];
    const b = buildBackup(form, { targetKg: '60' }, log, new Date('2026-11-28T10:00:00Z'));
    const back = parseBackup(JSON.stringify(b))!;
    expect(back.form).toEqual(form);
    expect(back.goal).toEqual({ targetKg: '60' });
    expect(back.log.map((e) => e.date)).toEqual(['2026-11-01', '2026-11-02']);
    expect(back.exportedAt).toBe('2026-11-28T10:00:00.000Z');
  });

  it('lehnt fremde, kaputte und zu neue Dateien ab', () => {
    expect(parseBackup('kein json')).toBeUndefined();
    expect(parseBackup('[]')).toBeUndefined();
    expect(parseBackup('{"app":"andere","version":1}')).toBeUndefined();
    expect(parseBackup('{"app":"grundumsatz-rechner","version":99}')).toBeUndefined();
  });

  it('bereinigt Felder: nur harmlose Schlüssel, kurze Werte, keine Markup-Zeichen', () => {
    const dirty = JSON.parse(`{"__proto__":"x","a b":"1","ok":"<script>","lang":"x","long":"${'y'.repeat(40)}","num":5,"fine":"12","yes":true}`);
    expect(sanitizeFields(dirty)).toEqual({ lang: 'x', fine: '12', yes: true });
    expect(sanitizeFields(null)).toEqual({});
    expect(sanitizeFields([1])).toEqual({});
  });

  it('bereinigt den Verlauf mit denselben Grenzen wie die Eingabe', () => {
    const out = sanitizeLog([
      { date: '2026-11-01', weightKg: 80, kcal: 2000.4 },
      { date: '2026-11-01', weightKg: 79, kcal: null },
      { date: '2026-13-45', weightKg: 80, kcal: 2000 },
      { date: '2026-11-03', weightKg: 5, kcal: 5 },
      { date: '2026-11-04', weightKg: 400, kcal: 2500 },
      { date: 'x', weightKg: 80 },
      null,
    ]);
    expect(out).toEqual([
      { date: '2026-11-01', weightKg: 79, kcal: null },
      { date: '2026-11-04', weightKg: null, kcal: 2500 },
    ]);
  });
});

describe('Teilen-Link', () => {
  it('Rundreise ohne leere Felder und ohne Einstellung "remember"', () => {
    const text = encodeShare(form, { targetKg: '60', pace: 'moderate' });
    expect(text).toMatch(/^[A-Za-z0-9_-]+$/);
    const d = decodeShare(text)!;
    expect(d.form).toEqual({ sex: 'female', age: '34', height: '168', weight: '64,5', smoker: true });
    expect(d.goal).toEqual({ targetKg: '60', pace: 'moderate' });
  });

  it('Umlaute überstehen die Kodierung', () => {
    expect(decodeShare(encodeShare({ note: 'Größe' }, {}))!.form).toEqual({ note: 'Größe' });
  });

  it('weist Müll, Fremdformate und Überlänge ab', () => {
    expect(decodeShare('')).toBeUndefined();
    expect(decodeShare('!!!')).toBeUndefined();
    expect(decodeShare('abcd')).toBeUndefined();
    expect(decodeShare('a'.repeat(7000))).toBeUndefined();
    expect(decodeShare(btoa('{"v":2}').replace(/=/g, ''))).toBeUndefined();
  });
});
