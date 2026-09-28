export type Locale = 'de' | 'en' | 'es' | 'vi';

export type Sex = 'male' | 'female';

/** Messmethode für einen direkt angegebenen Körperfettanteil. */
export type BodyFatSource = 'dexa' | 'bodpod' | 'caliper' | 'bia8' | 'bia' | 'visual';

/** Vom Rechner selbst geschätzte Körperfettwerte */
export type DerivedBodyFatSource = 'navy' | 'ymca' | 'rfm' | 'jp3' | 'jp7' | 'dw4';

export type AnyBodyFatSource = BodyFatSource | DerivedBodyFatSource;

/** Hautfalten-Messstellen (Caliper) */
export type SkinfoldSite = 'chest' | 'abdomen' | 'thigh' | 'triceps' | 'suprailiac' | 'subscapular' | 'midaxillary' | 'biceps';

export type SkinfoldMeasurer = 'self' | 'trained';

/** Methode einer direkten Messung des Ruheumsatzes (indirekte Kalorimetrie) */
export type RmrMethod = 'lab' | 'handheld';

export type ThyroidStatus = 'normal' | 'hypo_treated' | 'hypo_untreated' | 'hyper_treated' | 'hyper_untreated';
export type PregnancyStatus = 'none' | 't1' | 't2' | 't3' | 'breastfeeding';
export type Climate = 'moderate' | 'cold' | 'hot';
export type PalLevelId = 'sedentary' | 'low' | 'moderate' | 'high' | 'very_high';
export type SportLevel = 'none' | 'some' | 'regular';

export interface Modifiers {
  thyroid?: ThyroidStatus;
  pregnancy?: PregnancyStatus;
  /** Durchschnittliche Schlafdauer pro Nacht in Stunden. */
  sleepHours?: number;
  climate?: Climate;
  /** Mindestens ca. 3 Monate im Kaloriendefizit bzw. deutlich abgenommen. */
  recentDiet?: boolean;
  smoker?: boolean;
}

export interface Activity {
  level: PalLevelId;
  sport?: SportLevel;
}

export interface LogEntry {
  /** ISO-Datum YYYY-MM-DD */
  date: string;
  weightKg?: number | null;
  kcal?: number | null;
}

export interface Inputs {
  sex: Sex;
  age: number;
  heightCm: number;
  weightKg: number;
  /** Direkt angegebener Körperfettanteil. `readings` = Anzahl gemittelter Messungen (bei Waagen sinnvoll). */
  bodyFat?: { percent: number; source: BodyFatSource; readings?: number };
  circumferences?: { waistCm?: number; neckCm?: number; hipCm?: number };
  /** Hautfaltendicken in mm */
  skinfolds?: Partial<Record<SkinfoldSite, number>>;
  skinfoldMeasurer?: SkinfoldMeasurer;
  /** Direkt gemessener Ruheumsatz (indirekte Kalorimetrie) */
  measuredRmr?: { kcal: number; method: RmrMethod };
  /** Kraft-/Ausdauersportler:in mit überdurchschnittlicher Muskelmasse → Cunningham statt Katch-McArdle. */
  athlete?: boolean;
  activity?: Activity;
  modifiers?: Modifiers;
  log?: LogEntry[];
}

/** Schätzwert mit Unsicherheit. `range` ist die halbe Breite eines ca. 80-%-Bereichs (±). */
export interface Estimate {
  value: number;
  range: number;
}

export interface Step {
  id: string;
  title: string;
  detail: string;
  /** Stand nach diesem Schritt */
  estimate: Estimate;
  /** Veränderung gegenüber dem vorherigen Schritt (kcal) */
  deltaValue: number;
  /** Veränderung der Spanne gegenüber dem vorherigen Schritt (kcal, negativ = genauer) */
  deltaRange: number;
}

export type FormulaId = 'mifflin' | 'harris_benedict' | 'katch_mcardle' | 'cunningham' | 'measured';

export interface FormulaComparison {
  id: FormulaId;
  name: string;
  kcal: number;
  /** Gewicht im Endergebnis (0–1), 0 = nur zum Vergleich */
  weight: number;
  note: string;
}

export interface BodyFatMeasurement {
  source: AnyBodyFatSource;
  label: string;
  percent: number;
  range: number;
  /** Methodengruppe: Werte einer Gruppe sind nicht unabhängig voneinander */
  group: 'direct' | 'circumference' | 'caliper';
}

export interface BodyComposition {
  percent: number;
  range: number;
  measurements: BodyFatMeasurement[];
  ffmKg: number;
  fatKg: number;
}

export interface Hint {
  level: 'info' | 'warn';
  text: string;
}

export interface Suggestion {
  id: string;
  title: string;
  text: string;
  /** Erwartete ±-Spanne des Grundumsatzes, wenn die Angabe gemacht wird */
  expectedRange?: number;
}

export interface AdaptiveOk {
  status: 'ok';
  tdee: number;
  range: number;
  days: number;
  weightDays: number;
  kcalDays: number;
  avgIntake: number;
  slopeKgPerWeek: number;
  residualSd: number;
  fromDate: string;
  toDate: string;
  /** Regressionsgerade (Start/Ende) für die Darstellung */
  line: { from: { date: string; weight: number }; to: { date: string; weight: number } };
  /** Geglätteter Gewichtstrend (zentrierter 7-Tage-Mittelwert) */
  trend: { date: string; weight: number }[];
  warnings: string[];
}

export interface AdaptiveInsufficient {
  status: 'insufficient';
  days: number;
  weightDays: number;
  kcalDays: number;
  reasons: string[];
}

export type AdaptiveResult = AdaptiveOk | AdaptiveInsufficient;

export interface TdeeResult extends Estimate {
  pal?: number;
  palLabel?: string;
  /** Zusatzbedarf z. B. in der Stillzeit */
  extraKcal: number;
  source: 'pal' | 'adaptive' | 'combined';
  formula?: Estimate;
  adaptive?: Estimate;
  /** Aus dem gemessenen Verbrauch abgeleiteter Aktivitätsfaktor */
  impliedPal?: number;
}

export type StageId =
  | 'basis'
  | 'bodyfat'
  | 'circumferences'
  | 'caliper3'
  | 'caliper7'
  | 'factors'
  | 'measured'
  | 'activity'
  | 'adaptive';

export interface Stage {
  id: StageId;
  label: string;
  done: boolean;
}

export interface CalcResult {
  ok: true;
  bmr: Estimate;
  bmi: number;
  /** Relative Genauigkeit 0–100 (100 = sehr genau) */
  precisionScore: number;
  precisionLabel: string;
  method: string;
  stages: Stage[];
  steps: Step[];
  mifflinBreakdown: { label: string; kcal: number }[];
  formulas: FormulaComparison[];
  bodyComposition?: BodyComposition;
  tdee?: TdeeResult;
  adaptive?: AdaptiveResult;
  hints: Hint[];
  suggestions: Suggestion[];
}

export interface FieldError {
  field: string;
  message: string;
}

export interface CalcError {
  ok: false;
  errors: FieldError[];
}
