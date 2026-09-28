import { linearRegression, mean, quad, sd, Z80 } from './stats';
import { messages } from './i18n';
import type { AdaptiveResult, Locale, LogEntry } from './types';

/** Energiegehalt von 1 kg Körpergewichtsänderung (Mischgewebe) */
export const KCAL_PER_KG = 7700;
export const ADAPTIVE_MIN_DAYS = 14;
export const ADAPTIVE_WINDOW_DAYS = 28;
const MIN_WEIGHT_DAYS = 7;
const MIN_KCAL_DAYS = 10;
const MIN_KCAL_COVERAGE = 0.6;
/** Untergrenze für das Tagesrauschen des Gewichts (kg), damit wenige Punkte nicht zu optimistisch werden */
const MIN_WEIGHT_NOISE = 0.3;
/** Systematischer Fehler beim Kalorienzählen (±, relativ, ca. 80 %) */
const INTAKE_REL_RANGE = 0.07;
/** Unsicherheit der Energiedichte kurzfristiger Gewichtsänderungen (Wasser, Glykogen) */
const DENSITY_REL_RANGE = 0.25;
const TREND_HALF_WINDOW = 3;

export function dayNumber(iso: string): number {
  const [y, m, d] = iso.split('-').map(Number);
  return Math.round(Date.UTC(y!, (m ?? 1) - 1, d ?? 1) / 86_400_000);
}

export function isoFromDay(day: number): string {
  return new Date(day * 86_400_000).toISOString().slice(0, 10);
}

function valid(n: number | null | undefined, min: number, max: number): n is number {
  return typeof n === 'number' && Number.isFinite(n) && n >= min && n <= max;
}

/**
 * Stufe 5 („Königsweg“): Aus Gewichtsverlauf und gegessenen Kalorien wird der
 * tatsächliche Gesamtumsatz zurückgerechnet:
 *   Verbrauch = Ø Kalorienzufuhr − Gewichtstrend (kg/Tag) × 7700 kcal/kg
 * Betrachtet werden die letzten 28 Tage.
 */
export function adaptiveTdee(entries: LogEntry[], locale: Locale = 'de'): AdaptiveResult {
  const t = messages(locale).adaptive;
  const clean = new Map<number, { weight?: number; kcal?: number }>();
  for (const e of entries) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(e.date)) continue;
    const day = dayNumber(e.date);
    const rec = clean.get(day) ?? {};
    if (valid(e.weightKg, 25, 350)) rec.weight = e.weightKg;
    if (valid(e.kcal, 300, 10000)) rec.kcal = e.kcal;
    if (rec.weight !== undefined || rec.kcal !== undefined) clean.set(day, rec);
  }

  const allDays = [...clean.keys()].sort((a, b) => a - b);
  if (allDays.length === 0) {
    return { status: 'insufficient', days: 0, weightDays: 0, kcalDays: 0, reasons: [t.noEntries] };
  }
  const lastDay = allDays[allDays.length - 1]!;
  const windowStart = lastDay - ADAPTIVE_WINDOW_DAYS + 1;
  const days = allDays.filter((d) => d >= windowStart);
  const firstDay = days[0]!;
  const span = lastDay - firstDay + 1;

  const weightPts = days.filter((d) => clean.get(d)!.weight !== undefined).map((d) => ({ d, w: clean.get(d)!.weight! }));
  const kcalVals = days.filter((d) => clean.get(d)!.kcal !== undefined).map((d) => clean.get(d)!.kcal!);

  const reasons: string[] = [];
  if (span < ADAPTIVE_MIN_DAYS) reasons.push(t.minDays(ADAPTIVE_MIN_DAYS, span));
  if (weightPts.length < MIN_WEIGHT_DAYS) reasons.push(t.minWeights(MIN_WEIGHT_DAYS, weightPts.length));
  if (kcalVals.length < MIN_KCAL_DAYS) reasons.push(t.minKcal(MIN_KCAL_DAYS, kcalVals.length));
  else if (kcalVals.length / span < MIN_KCAL_COVERAGE)
    reasons.push(t.coverage(Math.round(MIN_KCAL_COVERAGE * 100), Math.round((kcalVals.length / span) * 100)));

  if (reasons.length > 0) {
    return { status: 'insufficient', days: span, weightDays: weightPts.length, kcalDays: kcalVals.length, reasons };
  }

  const xs = weightPts.map((p) => p.d - firstDay);
  const ys = weightPts.map((p) => p.w);
  const reg = linearRegression(xs, ys);
  const noise = Math.max(reg.residualSd, MIN_WEIGHT_NOISE);
  const sxx = xs.reduce((s, x) => s + (x - mean(xs)) ** 2, 0);
  const slopeSe = noise / Math.sqrt(sxx);

  const avgIntake = mean(kcalVals);
  const tdee = avgIntake - reg.slope * KCAL_PER_KG;
  // Nicht protokollierte Tage können vom Durchschnitt abweichen
  const missingShare = 1 - kcalVals.length / span;
  const range = quad(
    Z80 * slopeSe * KCAL_PER_KG,
    INTAKE_REL_RANGE * avgIntake,
    (Z80 * sd(kcalVals) / Math.sqrt(kcalVals.length)) * (1 + missingShare),
    Math.abs(reg.slope) * KCAL_PER_KG * DENSITY_REL_RANGE,
  );

  const warnings: string[] = [];
  const weeklyChange = reg.slope * 7;
  if (Math.abs(weeklyChange) > 1) warnings.push(t.fastChange);
  if (kcalVals.length / span < 0.85) warnings.push(t.missingDays);
  if (span < 21) warnings.push(t.short);

  // Geglätteter Trend: zentrierter Mittelwert über ±3 Tage (ohne den Nachlauf eines EMA)
  const trend: { date: string; weight: number }[] = [];
  for (let d = firstDay; d <= lastDay; d++) {
    const near = weightPts.filter((p) => Math.abs(p.d - d) <= TREND_HALF_WINDOW);
    if (near.length >= 2) trend.push({ date: isoFromDay(d), weight: round1(mean(near.map((p) => p.w))) });
  }

  return {
    status: 'ok',
    tdee,
    range,
    days: span,
    weightDays: weightPts.length,
    kcalDays: kcalVals.length,
    avgIntake,
    slopeKgPerWeek: weeklyChange,
    residualSd: reg.residualSd,
    fromDate: isoFromDay(firstDay),
    toDate: isoFromDay(lastDay),
    line: {
      from: { date: isoFromDay(firstDay), weight: reg.intercept },
      to: { date: isoFromDay(lastDay), weight: reg.intercept + reg.slope * (lastDay - firstDay) },
    },
    trend,
    warnings,
  };
}

function round1(x: number): number {
  return Math.round(x * 10) / 10;
}
