import { KCAL_PER_KG } from './adaptive';
import { bmi as bmiOf } from './formulas';
import { formatters, messages } from './i18n';
import { quad } from './stats';
import type { Estimate, Hint, Locale, Sex } from './types';

/** Tempo-Stufen in % des Startgewichts pro Woche (Betrag). */
export const GOAL_PACES = {
  lose: { gentle: 0.25, moderate: 0.5, fast: 0.75 },
  gain: { gentle: 0.1, moderate: 0.25, fast: 0.5 },
} as const;
export type GoalPaceId = keyof typeof GOAL_PACES.lose;

/** Ab diesem Anteil (% Körpergewicht/Woche) warnen wir (Garthe 2011, Helms 2014; Iraki 2019). */
export const LOSS_RATE_WARN_PCT = 1;
export const GAIN_RATE_WARN_PCT = 0.5;
/** Defizit über diesem Anteil des Gesamtumsatzes gilt als zu aggressiv. */
export const DEFICIT_WARN_SHARE = 0.25;
/** Übliche Untergrenzen der Zufuhr ohne ärztliche Begleitung (kcal/Tag). */
export const INTAKE_FLOOR = { female: 1200, male: 1500 } as const;
/** Energieänderung des Verbrauchs je kg Gewichtsänderung = 10 kcal (Mifflin-St-Jeor-Koeffizient) × PAL. */
export const MIFFLIN_KCAL_PER_KG = 10;
/** Relative Unsicherheit der Energiedichte über Wochen (Fett/Magermasse-Mix, Wasser) */
export const GOAL_DENSITY_REL_RANGE = 0.1;
export const GOAL_WEIGHT_MIN = 25;
export const GOAL_WEIGHT_MAX = 350;
export const GOAL_WEEKS_MIN = 2;
export const GOAL_WEEKS_MAX = 156;
/** Kurven und Zeiträume werden auf diese Länge begrenzt. */
const HORIZON_WEEKS = 156;
const LONG_HORIZON_WEEKS = 52;

export type GoalPace = { kind: 'rate'; pace: GoalPaceId } | { kind: 'weeks'; weeks: number };

export interface GoalInput {
  sex: Sex;
  age: number;
  heightCm: number;
  weightKg: number;
  targetKg: number;
  /** Gesamtumsatz (Erhaltungskalorien) mit Unsicherheit */
  tdee: Estimate;
  /** Grundumsatz mit Unsicherheit */
  bmr: Estimate;
  pace: GoalPace;
  locale?: Locale;
}

export interface GoalPoint {
  week: number;
  expected: number;
  /** Günstiger Fall (Verbrauch am oberen Rand der Spanne für Abnahme, am unteren für Zunahme) */
  fast: number;
  /** Ungünstiger Fall */
  slow: number;
}

export interface GoalOk {
  status: 'ok';
  direction: 'lose' | 'gain' | 'maintain';
  deltaKg: number;
  /** Empfohlene Zufuhr (konstant über den ganzen Zeitraum) */
  intake: number;
  /** Zufuhr − Erhaltungsumsatz zu Beginn (negativ = Defizit) */
  balance: number;
  /** Unsicherheit des tatsächlichen Defizits/Überschusses (±) */
  balanceRange: number;
  /** Anfängliche Änderung in kg pro Woche (mit Vorzeichen) und ihre Unsicherheit (±) */
  rateKgPerWeek: number;
  rateRange: number;
  ratePct: number;
  /** Erwartete Dauer in Wochen; `null` = wird mit dieser Zufuhr nicht erreicht */
  weeks: number | null;
  weeksFast: number | null;
  weeksSlow: number | null;
  /** Gleichgewichtsgewicht bei dieser Zufuhr (Verbrauch = Zufuhr) */
  plateauKg: number;
  bmiStart: number;
  bmiTarget: number;
  curve: GoalPoint[];
  warnings: Hint[];
}

export interface GoalError {
  status: 'error';
  errors: { field: 'targetKg' | 'weeks'; message: string }[];
}

export type GoalPlan = GoalOk | GoalError;

const round1 = (x: number) => Math.round(x * 10) / 10;

/**
 * Plan zum Zielgewicht bei konstanter Zufuhr.
 *
 * Modell: Der Verbrauch folgt dem Gewicht – je kg weniger sinkt er um 10 kcal × PAL (Steigung des
 * Gewichtsterms in Mifflin-St Jeor). Mit 7.700 kcal/kg ergibt das eine Exponentialannäherung an ein
 * Gleichgewichtsgewicht (Hall 2011): w(t) = w* + (w₀ − w*) · e^(−λt), λ = k / 7700, k = 10 · PAL.
 * Deshalb verlangsamt sich der Verlauf; ein lineares „Defizit × Tage / 7700“ wäre zu optimistisch.
 *
 * Unsicherheit: Die Zufuhr ist gewählt, der Verbrauch aber nur ±range bekannt. Zusammen mit ±10 %
 * Energiedichte (quadratisch addiert, wie bei den anderen Stufen) verschiebt das den Verbrauch im
 * günstigen/ungünstigen Fall um `balanceRange`.
 */
export function planGoal(input: GoalInput): GoalPlan {
  const locale = input.locale ?? 'de';
  const t = messages(locale).goal;
  const f = formatters(locale);
  const { weightKg: w0, targetKg: wt, tdee, bmr } = input;

  const errors: GoalError['errors'] = [];
  if (!Number.isFinite(wt) || wt < GOAL_WEIGHT_MIN || wt > GOAL_WEIGHT_MAX) {
    errors.push({ field: 'targetKg', message: t.errTarget(f.int(GOAL_WEIGHT_MIN), f.int(GOAL_WEIGHT_MAX)) });
  }
  if (input.pace.kind === 'weeks') {
    const w = input.pace.weeks;
    if (!Number.isFinite(w) || w < GOAL_WEEKS_MIN || w > GOAL_WEEKS_MAX) {
      errors.push({ field: 'weeks', message: t.errWeeks(f.int(GOAL_WEEKS_MIN), f.int(GOAL_WEEKS_MAX)) });
    }
  }
  if (errors.length > 0) return { status: 'error', errors };

  const delta = wt - w0;
  const bmiStart = bmiOf(w0, input.heightCm);
  const bmiTarget = bmiOf(wt, input.heightCm);
  const T0 = tdee.value;
  const pal = Math.min(2.4, Math.max(1.1, T0 / bmr.value));
  const k = MIFFLIN_KCAL_PER_KG * pal; // kcal/Tag je kg
  const lambda = k / KCAL_PER_KG; // 1/Tag

  const direction: GoalOk['direction'] = Math.abs(delta) < 0.5 ? 'maintain' : delta < 0 ? 'lose' : 'gain';
  const sign = direction === 'lose' ? -1 : 1;

  // Zufuhr bestimmen
  let intake = T0;
  if (direction !== 'maintain') {
    if (input.pace.kind === 'rate') {
      const pct = GOAL_PACES[direction][input.pace.pace];
      intake = T0 + sign * ((pct / 100) * w0 * KCAL_PER_KG) / 7;
    } else {
      // Gewicht nach `weeks` soll genau das Ziel sein: w* aus der Exponentialfunktion auflösen
      const e = Math.exp(-lambda * input.pace.weeks * 7);
      const wStar = (wt - w0 * e) / (1 - e);
      intake = T0 + k * (wStar - w0);
    }
  }
  intake = Math.round(intake);

  const balance = intake - T0;
  const balanceRange = quad(tdee.range, Math.abs(balance) * GOAL_DENSITY_REL_RANGE);
  const rateKgPerWeek = (balance / KCAL_PER_KG) * 7;
  const rateRange = (balanceRange / KCAL_PER_KG) * 7;
  const ratePct = (Math.abs(rateKgPerWeek) / w0) * 100;

  /** Gleichgewichtsgewicht, wenn der Verbrauch um `shift` kcal vom Schätzwert abweicht */
  const plateauFor = (shift: number) => w0 + (intake - (T0 + shift)) / k;
  const weightAt = (shift: number, weeks: number) => {
    const ws = plateauFor(shift);
    return ws + (w0 - ws) * Math.exp(-lambda * weeks * 7);
  };
  const weeksTo = (shift: number): number | null => {
    if (direction === 'maintain') return 0;
    const ws = plateauFor(shift);
    const ratio = (wt - ws) / (w0 - ws);
    if (!(ratio > 0 && ratio < 1)) return null;
    const weeks = -Math.log(ratio) / lambda / 7;
    return weeks > 1000 ? null : weeks;
  };

  // Günstiger Fall: Abnahme → höherer Verbrauch, Zunahme → niedrigerer
  const favour = direction === 'gain' ? -1 : 1;
  const weeks = weeksTo(0);
  const weeksFast = weeksTo(favour * balanceRange);
  const weeksSlow = weeksTo(-favour * balanceRange);
  const plateauKg = plateauFor(0);

  // Kurve
  const last = Math.max(weeksSlow ?? 0, weeks ?? 0, weeksFast ?? 0);
  const horizon = Math.min(HORIZON_WEEKS, Math.max(12, Math.ceil(last * 1.15) + 1));
  const step = horizon > 60 ? 2 : 1;
  const curve: GoalPoint[] = [];
  for (let w = 0; w <= horizon; w += step) {
    curve.push({
      week: w,
      expected: weightAt(0, w),
      fast: weightAt(favour * balanceRange, w),
      slow: weightAt(-favour * balanceRange, w),
    });
  }

  // Warnungen
  const warnings: Hint[] = [];
  const warn = (text: string) => warnings.push({ level: 'warn', text });
  const info = (text: string) => warnings.push({ level: 'info', text });
  if (input.age < 18) warn(t.under18);
  if (direction === 'lose') {
    const floor = INTAKE_FLOOR[input.sex];
    if (intake < floor) warn(t.floor(f.int(intake), f.int(floor)));
    else if (intake < bmr.value) warn(t.belowBmr(f.int(bmr.value)));
    if (-balance / T0 > DEFICIT_WARN_SHARE) warn(t.deficitLarge(f.int((-balance / T0) * 100)));
    if (ratePct > LOSS_RATE_WARN_PCT) warn(t.lossFast(f.dec2(ratePct)));
    if (bmiStart < 18.5) warn(t.startBmiLow(f.dec1(bmiStart)));
    else if (bmiTarget < 18.5) warn(t.targetBmiLow(f.dec1(bmiTarget)));
  } else if (direction === 'gain') {
    if (ratePct > GAIN_RATE_WARN_PCT) warn(t.gainFast(f.dec2(ratePct)));
  }
  if (direction !== 'maintain') {
    if (weeks === null) info(t.plateau(f.dec1(plateauKg)));
    else if (weeksSlow === null) info(t.slowNotReached);
    if (weeks !== null && weeks > LONG_HORIZON_WEEKS) info(t.longHorizon);
  }

  return {
    status: 'ok',
    direction,
    deltaKg: round1(delta),
    intake,
    balance,
    balanceRange,
    rateKgPerWeek,
    rateRange,
    ratePct,
    weeks,
    weeksFast,
    weeksSlow,
    plateauKg,
    bmiStart,
    bmiTarget,
    curve,
    warnings,
  };
}
