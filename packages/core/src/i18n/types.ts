import type { AnyBodyFatSource, PalLevelId, RmrMethod, SportLevel, StageId } from '../types';

type S = string;

/** Alle Texte, die der Rechenkern erzeugt. Zahlen werden bereits formatiert übergeben. */
export interface Messages {
  /** Intl-Locale für Zahlenformate */
  intl: string;
  stages: Record<StageId, S>;
  precision: { veryGood: S; good: S; solid: S; rough: S };
  sources: Record<AnyBodyFatSource, S>;
  rmrMethods: Record<RmrMethod, S>;
  formulas: {
    mifflin: { name: S; note: S };
    harris_benedict: { name: S; note: S };
    katch_mcardle: { name: S; note: S };
    cunningham: { name: S; note: S };
    measured: { name: S; note: (method: S) => S };
    comparisonOnly: S;
  };
  basis: {
    title: S;
    reason: S;
    widerAge: (pct: S) => S;
    widerBmi: (pct: S) => S;
    weight: (kg: S) => S;
    height: (cm: S) => S;
    age: (years: S) => S;
    constMale: S;
    constFemale: S;
  };
  bodyfat: {
    title: (source: S, formula: S) => S;
    sourceCirc: S;
    sourceCaliper: (sites: number) => S;
    sourceDirect: S;
    sourceMixed: S;
    single: (pct: S, label: S, range: S) => S;
    combined: (pct: S, range: S, list: S) => S;
    item: (label: S, pct: S) => S;
    detail: (p: { src: S; ffm: S; ffmRange: S; formula: S; estimate: S; wFfm: S; wMifflin: S }) => S;
    cunninghamWhy: S;
    readings: (n: number) => S;
    selfMeasured: S;
  };
  measured: {
    title: (method: S) => S;
    detail: (p: { measured: S; formula: S; wMeasured: S }) => S;
    deviates: (pct: S) => S;
  };
  method: {
    mifflin: S;
    ffm: (formula: S) => S;
    measured: S;
    corrections: (n: number) => S;
  };
  hints: {
    hipNeeded: S;
    implausibleCirc: S;
    implausibleSkinfold: S;
    athlete: S;
    under18: S;
    underweight: (bmi: S) => S;
    highBmi: S;
    caliperPartial: (have: number) => S;
  };
  modifiers: {
    hypoUntreated: { title: S; detail: S; hint: S };
    hyperUntreated: { title: S; detail: S; hint: S };
    thyroidTreated: { title: S; detail: S };
    t1: { title: S; detail: S };
    t2: { title: S; detail: S };
    t3: { title: S; detail: S };
    breastfeedingHint: S;
    pregnancyHint: S;
    sleepShort: { title: (h: S) => S; detail: S; hint: S };
    sleepLong: S;
    cold: { title: S; detail: S };
    hot: { title: S; detail: S };
    diet: { title: S; detail: S };
    smoking: { title: S; detail: S };
  };
  pal: {
    levels: Record<PalLevelId, { label: S; example: S }>;
    sport: Record<SportLevel, S>;
    withSport: (level: S, sport: S) => S;
  };
  adaptive: {
    noEntries: S;
    minDays: (min: number, have: number) => S;
    minWeights: (min: number, have: number) => S;
    minKcal: (min: number, have: number) => S;
    coverage: (min: number, have: number) => S;
    fastChange: S;
    missingDays: S;
    short: S;
  };
  validation: {
    sex: S;
    missing: (label: S) => S;
    nan: (label: S) => S;
    range: (label: S, min: S, max: S, unit: S) => S;
    neckWaist: S;
    labels: Record<
      'age' | 'heightCm' | 'weightKg' | 'bodyFat' | 'readings' | 'waistCm' | 'neckCm' | 'hipCm' | 'sleepHours' | 'skinfold' | 'rmr',
      S
    >;
    units: { years: S; cm: S; kg: S; pct: S; hours: S; mm: S; kcal: S; count: S };
  };
  suggestions: {
    circumferences: { titleMale: S; titleFemale: S; text: S };
    caliper3: { title: S; text: S };
    caliper7: { title: S; text: S };
    bodyfat: { title: S; text: S };
    measured: { title: S; text: S };
    activity: { title: S; text: S };
    adaptive: { title: S; text: S };
  };
}
