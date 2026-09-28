import { formatters, messages } from './i18n';
import type { Hint, Inputs, Locale } from './types';

export interface Correction {
  id: string;
  title: string;
  detail: string;
  /** Multiplikativer Faktor auf den Grundumsatz */
  factor: number;
  /** Zusätzliche relative Unsicherheit (±, ca. 80 %) */
  relRange: number;
}

export interface ModifierOutcome {
  corrections: Correction[];
  hints: Hint[];
  /** Zusätzlicher Energiebedarf, der nicht zum Grundumsatz zählt (z. B. Stillzeit) */
  tdeeExtraKcal: number;
}

/**
 * Stufe 4: weitere Faktoren als Korrekturen bzw. Hinweise. Die Effektgrößen sind
 * bewusst vorsichtig gewählt und mit zusätzlicher Unsicherheit versehen, weil die
 * Studienlage für Einzelpersonen dünn ist.
 */
export function evaluateModifiers(input: Inputs, locale: Locale = 'de'): ModifierOutcome {
  const t = messages(locale).modifiers;
  const f = formatters(locale);
  const m = input.modifiers ?? {};
  const corrections: Correction[] = [];
  const hints: Hint[] = [];
  let tdeeExtraKcal = 0;

  switch (m.thyroid) {
    case 'hypo_untreated':
      corrections.push({ id: 'thyroid', ...t.hypoUntreated, factor: 0.9, relRange: 0.07 });
      hints.push({ level: 'warn', text: t.hypoUntreated.hint });
      break;
    case 'hyper_untreated':
      corrections.push({ id: 'thyroid', ...t.hyperUntreated, factor: 1.15, relRange: 0.12 });
      hints.push({ level: 'warn', text: t.hyperUntreated.hint });
      break;
    case 'hypo_treated':
    case 'hyper_treated':
      corrections.push({ id: 'thyroid', ...t.thyroidTreated, factor: 1, relRange: 0.03 });
      break;
  }

  if (input.sex === 'female') {
    switch (m.pregnancy) {
      case 't1':
        corrections.push({ id: 'pregnancy', ...t.t1, factor: 1, relRange: 0.03 });
        break;
      case 't2':
        corrections.push({ id: 'pregnancy', ...t.t2, factor: 1.05, relRange: 0.04 });
        break;
      case 't3':
        corrections.push({ id: 'pregnancy', ...t.t3, factor: 1.1, relRange: 0.05 });
        break;
      case 'breastfeeding':
        tdeeExtraKcal += 500;
        hints.push({ level: 'info', text: t.breastfeedingHint });
        break;
    }
    if (m.pregnancy === 't1' || m.pregnancy === 't2' || m.pregnancy === 't3') hints.push({ level: 'info', text: t.pregnancyHint });
  }

  if (m.sleepHours !== undefined) {
    if (m.sleepHours < 6) {
      corrections.push({
        id: 'sleep',
        title: t.sleepShort.title(f.num(Math.round(m.sleepHours * 10) / 10)),
        detail: t.sleepShort.detail,
        factor: 0.97,
        relRange: 0.02,
      });
      hints.push({ level: 'info', text: t.sleepShort.hint });
    } else if (m.sleepHours > 10) {
      hints.push({ level: 'info', text: t.sleepLong });
    }
  }

  if (m.climate === 'cold') corrections.push({ id: 'climate', ...t.cold, factor: 1.03, relRange: 0.02 });
  else if (m.climate === 'hot') corrections.push({ id: 'climate', ...t.hot, factor: 1.02, relRange: 0.02 });

  if (m.recentDiet) corrections.push({ id: 'diet', ...t.diet, factor: 0.95, relRange: 0.03 });
  if (m.smoker) corrections.push({ id: 'smoking', ...t.smoking, factor: 1.04, relRange: 0.03 });

  return {
    // Hinweistexte gehören nicht in die Korrektur-Objekte
    corrections: corrections.map(({ id, title, detail, factor, relRange }) => ({ id, title, detail, factor, relRange })),
    hints,
    tdeeExtraKcal,
  };
}
