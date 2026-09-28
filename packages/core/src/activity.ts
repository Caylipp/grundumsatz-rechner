import { messages } from './i18n';
import type { Activity, Locale, PalLevelId, SportLevel } from './types';

/** PAL-Stufen nach DGE (Physical Activity Level = Gesamtumsatz / Grundumsatz). */
export const PAL_VALUES: { id: PalLevelId; pal: number }[] = [
  { id: 'sedentary', pal: 1.2 },
  { id: 'low', pal: 1.45 },
  { id: 'moderate', pal: 1.65 },
  { id: 'high', pal: 1.85 },
  { id: 'very_high', pal: 2.2 },
];

export const SPORT_VALUES: { id: SportLevel; add: number }[] = [
  { id: 'none', add: 0 },
  { id: 'some', add: 0.15 },
  { id: 'regular', add: 0.3 },
];

/** PAL-Stufen mit Beschriftung in der gewünschten Sprache */
export function palLevels(locale: Locale = 'de') {
  const m = messages(locale).pal;
  return PAL_VALUES.map((l) => ({ ...l, ...m.levels[l.id] }));
}

export function sportLevels(locale: Locale = 'de') {
  const m = messages(locale).pal;
  return SPORT_VALUES.map((s) => ({ ...s, label: m.sport[s.id] }));
}

/** Relative Unsicherheit (±, ca. 80 %) der PAL-Selbsteinschätzung */
export const PAL_REL_RANGE = 0.12;

export function palFor(activity: Activity, locale: Locale = 'de'): { pal: number; label: string } {
  const m = messages(locale).pal;
  const level = PAL_VALUES.find((l) => l.id === activity.level) ?? PAL_VALUES[1]!;
  const sport = SPORT_VALUES.find((s) => s.id === (activity.sport ?? 'none')) ?? SPORT_VALUES[0]!;
  const pal = Math.round((level.pal + sport.add) * 100) / 100;
  const levelLabel = m.levels[level.id].label;
  const label = sport.add > 0 ? m.withSport(levelLabel, m.sport[sport.id]) : levelLabel;
  return { pal, label };
}
