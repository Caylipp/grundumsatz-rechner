import type { Activity, PalLevelId, SportLevel } from './types';

/** PAL-Stufen nach DGE (Physical Activity Level = Gesamtumsatz / Grundumsatz). */
export const PAL_LEVELS: { id: PalLevelId; pal: number; label: string; example: string }[] = [
  { id: 'sedentary', pal: 1.2, label: 'Ausschließlich sitzend oder liegend', example: 'z. B. bettlägerig, sehr eingeschränkt mobil' },
  { id: 'low', pal: 1.45, label: 'Sitzend, kaum Bewegung in der Freizeit', example: 'z. B. Büroarbeit, Pendeln mit Auto/ÖPNV' },
  { id: 'moderate', pal: 1.65, label: 'Überwiegend sitzend, zeitweise gehend/stehend', example: 'z. B. Studium, Labor, Fahrdienst' },
  { id: 'high', pal: 1.85, label: 'Überwiegend stehend oder gehend', example: 'z. B. Verkauf, Service, Handwerk, Pflege' },
  { id: 'very_high', pal: 2.2, label: 'Körperlich anstrengende Arbeit', example: 'z. B. Bau, Landwirtschaft, Leistungssport' },
];

export const SPORT_LEVELS: { id: SportLevel; add: number; label: string }[] = [
  { id: 'none', add: 0, label: 'Kein regelmäßiger Sport' },
  { id: 'some', add: 0.15, label: '2–3× pro Woche 30–60 Min.' },
  { id: 'regular', add: 0.3, label: '4–5× pro Woche 30–60 Min.' },
];

/** Relative Unsicherheit (±, ca. 80 %) der PAL-Selbsteinschätzung */
export const PAL_REL_RANGE = 0.12;

export function palFor(activity: Activity): { pal: number; label: string } {
  const level = PAL_LEVELS.find((l) => l.id === activity.level) ?? PAL_LEVELS[1]!;
  const sport = SPORT_LEVELS.find((s) => s.id === (activity.sport ?? 'none')) ?? SPORT_LEVELS[0]!;
  const pal = Math.round((level.pal + sport.add) * 100) / 100;
  const label = sport.add > 0 ? `${level.label} + Sport ${sport.label}` : level.label;
  return { pal, label };
}
