import { adaptiveTdee } from './adaptive';
import { PAL_REL_RANGE, palFor } from './activity';
import {
  BODY_FAT_SOURCES,
  CUNNINGHAM_SLOPE,
  FFM_MODEL_REL_RANGE,
  KATCH_SLOPE,
  bmi as bmiOf,
  cunningham,
  deurenbergBodyFat,
  harrisBenedictRevised,
  katchMcArdle,
  mifflinRelRange,
  mifflinStJeor,
  navyBodyFat,
} from './formulas';
import { evaluateModifiers } from './modifiers';
import { fuse, fuseIndependent, quad } from './stats';
import type {
  AdaptiveResult,
  BodyComposition,
  BodyFatMeasurement,
  CalcError,
  CalcResult,
  Estimate,
  FormulaComparison,
  Hint,
  Inputs,
  Stage,
  Step,
  Suggestion,
  TdeeResult,
} from './types';
import { validate } from './validate';

/** Angenommene Fehlerkorrelation zwischen Mifflin-St Jeor und FFM-Formel */
const RHO_FORMULAS = 0.5;
/** Angenommene Fehlerkorrelation zwischen Formel-Gesamtumsatz und gemessenem Verbrauch */
const RHO_TDEE = 0.2;

const nf0 = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 });
const nf1 = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 1, minimumFractionDigits: 1 });
const kcal = (x: number) => `${nf0.format(Math.round(x))} kcal`;
const pm = (e: Estimate) => `${kcal(e.value)} ± ${nf0.format(Math.round(e.range))}`;
const pct = (x: number) => `${nf0.format(Math.round(x * 100))} %`;

export interface CalculateOptions {
  /** Vorschläge „Was macht das Ergebnis genauer?“ berechnen (Standard: true) */
  suggestions?: boolean;
}

export function calculate(input: Inputs, options: CalculateOptions = {}): CalcResult | CalcError {
  const errors = validate(input);
  if (errors.length > 0) return { ok: false, errors };

  const { sex, age, heightCm, weightKg } = input;
  const bmiValue = bmiOf(weightKg, heightCm);
  const hints: Hint[] = [];
  const steps: Step[] = [];
  const push = (id: string, title: string, detail: string, estimate: Estimate) => {
    const prev = steps[steps.length - 1]?.estimate;
    steps.push({
      id,
      title,
      detail,
      estimate: { ...estimate },
      deltaValue: prev ? estimate.value - prev.value : 0,
      deltaRange: prev ? estimate.range - prev.range : 0,
    });
  };

  // ── Stufe 1: Basis (Mifflin-St Jeor) ────────────────────────────────
  const mifflin = mifflinStJeor(sex, age, heightCm, weightKg);
  const mRel = mifflinRelRange(bmiValue, age);
  const mifflinEst: Estimate = { value: mifflin, range: mifflin * mRel };
  const mifflinBreakdown = [
    { label: `10 × ${nf1.format(weightKg)} kg Gewicht`, kcal: 10 * weightKg },
    { label: `6,25 × ${nf0.format(heightCm)} cm Größe`, kcal: 6.25 * heightCm },
    { label: `−5 × ${nf0.format(age)} Jahre Alter`, kcal: -5 * age },
    { label: sex === 'male' ? 'Konstante für Männer' : 'Konstante für Frauen', kcal: sex === 'male' ? 5 : -161 },
  ];
  let reason = `Ohne Angaben zur Körperzusammensetzung ist Mifflin-St Jeor die genaueste Standardformel. Sie trifft bei etwa 8 von 10 Menschen auf ±${pct(0.1)} genau.`;
  if (mRel > 0.1) reason += ` Bei deinem ${age >= 65 ? 'Alter' : 'BMI'} streut sie etwas stärker (±${pct(mRel)}).`;
  push('basis', 'Basis: Mifflin-St Jeor', reason, mifflinEst);

  let current: Estimate = { ...mifflinEst };
  let method = 'Mifflin-St Jeor';

  // ── Stufen 2 & 3: Körperfett → fettfreie Masse ──────────────────────
  const measurements: BodyFatMeasurement[] = [];
  if (input.bodyFat) {
    const src = BODY_FAT_SOURCES[input.bodyFat.source];
    measurements.push({ source: input.bodyFat.source, label: src.label, percent: input.bodyFat.percent, range: src.range });
  }
  const c = input.circumferences;
  if (c?.waistCm !== undefined && c.neckCm !== undefined) {
    if (sex === 'female' && c.hipCm === undefined) {
      hints.push({ level: 'info', text: 'Für die Navy-Methode brauchen Frauen zusätzlich den Hüftumfang.' });
    } else {
      const navy = navyBodyFat(sex, heightCm, c.waistCm, c.neckCm, c.hipCm);
      if (navy === null) {
        hints.push({ level: 'warn', text: 'Die Umfänge ergeben keinen plausiblen Körperfettanteil – bitte Messung prüfen (Taille auf Nabelhöhe, Hals unter dem Kehlkopf).' });
      } else {
        measurements.push({ source: 'navy', label: BODY_FAT_SOURCES.navy.label, percent: navy, range: BODY_FAT_SOURCES.navy.range });
      }
    }
  }

  let bodyComposition: BodyComposition | undefined;
  let formulaWeightMifflin = 1;
  let ffmFormula: { id: 'katch_mcardle' | 'cunningham'; value: number } | undefined;
  let ffmAlt: { id: 'katch_mcardle' | 'cunningham'; value: number } | undefined;

  if (measurements.length > 0) {
    const bf = fuseIndependent(measurements.map((m) => ({ value: m.percent, range: m.range })));
    const percent = Math.min(60, Math.max(3, bf.value));
    const ffmKg = weightKg * (1 - percent / 100);
    const ffmRange = (weightKg * bf.range) / 100;
    bodyComposition = { percent, range: bf.range, measurements, ffmKg, fatKg: weightKg - ffmKg };

    const useCunningham = input.athlete === true;
    const value = useCunningham ? cunningham(ffmKg) : katchMcArdle(ffmKg);
    const slope = useCunningham ? CUNNINGHAM_SLOPE : KATCH_SLOPE;
    const ffmEst: Estimate = { value, range: quad(value * FFM_MODEL_REL_RANGE, slope * ffmRange) };
    ffmFormula = { id: useCunningham ? 'cunningham' : 'katch_mcardle', value };
    ffmAlt = useCunningham ? { id: 'katch_mcardle', value: katchMcArdle(ffmKg) } : { id: 'cunningham', value: cunningham(ffmKg) };
    const name = useCunningham ? 'Cunningham' : 'Katch-McArdle';

    const fused = fuse(mifflinEst, ffmEst, RHO_FORMULAS);
    formulaWeightMifflin = fused.weightA;

    const srcText =
      measurements.length === 1
        ? `${nf1.format(measurements[0]!.percent)} % (${measurements[0]!.label}, ±${nf1.format(measurements[0]!.range)} Prozentpunkte)`
        : `${nf1.format(percent)} % – kombiniert aus ${measurements.map((m) => `${m.label}: ${nf1.format(m.percent)} %`).join(' und ')}`;
    const detail =
      `Körperfett ${srcText}. Daraus ergibt sich eine fettfreie Masse von ${nf1.format(ffmKg)} kg (±${nf1.format(ffmRange)} kg). ` +
      `Muskeln und Organe verbrauchen in Ruhe viel mehr Energie als Fett, deshalb rechnet ${name} nur mit der fettfreien Masse: ${pm(ffmEst)}. ` +
      `Beide Formeln werden nach ihrer Genauigkeit gewichtet kombiniert (${pct(1 - fused.weightA)} ${name}, ${pct(fused.weightA)} Mifflin-St Jeor).` +
      (useCunningham ? ' Cunningham wird gewählt, weil du viel Muskelmasse angegeben hast.' : '');
    const hasNavy = measurements.some((m) => m.source === 'navy');
    const hasDirect = measurements.some((m) => m.source !== 'navy');
    const stepTitle = hasNavy && !hasDirect ? 'Körperfett aus Umfängen (Navy) → ' + name : hasNavy ? 'Körperfett (Angabe + Navy) → ' + name : 'Körperfettanteil → ' + name;
    current = { value: fused.value, range: fused.range };
    method = `${name} + Mifflin-St Jeor`;
    push('bodyfat', stepTitle, detail, current);
  } else if (input.athlete) {
    hints.push({ level: 'info', text: 'Bei viel Muskelmasse unterschätzt Mifflin-St Jeor den Grundumsatz oft. Gib deinen Körperfettanteil oder deine Umfänge an, dann wird die Cunningham-Formel genutzt.' });
  }

  // ── Stufe 4: weitere Faktoren ───────────────────────────────────────
  const mods = evaluateModifiers(input);
  hints.push(...mods.hints);
  for (const corr of mods.corrections) {
    const value = current.value * corr.factor;
    current = { value, range: quad(current.range * corr.factor, value * corr.relRange) };
    push(`mod-${corr.id}`, corr.title, corr.detail, current);
  }
  if (mods.corrections.length > 0) method += ` mit ${mods.corrections.length === 1 ? '1 Korrektur' : `${mods.corrections.length} Korrekturen`}`;

  const bmr = current;

  // ── Formelvergleich ─────────────────────────────────────────────────
  const formulas: FormulaComparison[] = [
    { id: 'mifflin', name: 'Mifflin-St Jeor', kcal: mifflin, weight: formulaWeightMifflin, note: 'Standard ohne Körperfettangabe (1990)' },
    { id: 'harris_benedict', name: 'Harris-Benedict (rev. 1984)', kcal: harrisBenedictRevised(sex, age, heightCm, weightKg), weight: 0, note: 'Klassiker, überschätzt meist leicht – nur zum Vergleich' },
  ];
  if (ffmFormula && ffmAlt) {
    const names = { katch_mcardle: 'Katch-McArdle', cunningham: 'Cunningham' } as const;
    const notes = { katch_mcardle: 'Fettfreie Masse, allgemein', cunningham: 'Fettfreie Masse, für Sportler:innen' } as const;
    formulas.push({ id: ffmFormula.id, name: names[ffmFormula.id], kcal: ffmFormula.value, weight: 1 - formulaWeightMifflin, note: notes[ffmFormula.id] });
    formulas.push({ id: ffmAlt.id, name: names[ffmAlt.id], kcal: ffmAlt.value, weight: 0, note: notes[ffmAlt.id] + ' – nur zum Vergleich' });
  }

  // ── Gesamtumsatz (PAL) und Stufe 5: adaptiver Verbrauch ─────────────
  let adaptive: AdaptiveResult | undefined;
  if (input.log && input.log.length > 0) adaptive = adaptiveTdee(input.log);

  let tdee: TdeeResult | undefined;
  const extra = mods.tdeeExtraKcal;
  if (input.activity) {
    const { pal, label } = palFor(input.activity);
    const value = bmr.value * pal + extra;
    const formulaTdee: Estimate = { value, range: quad(bmr.range * pal, bmr.value * pal * PAL_REL_RANGE) };
    tdee = { ...formulaTdee, pal, palLabel: label, extraKcal: extra, source: 'pal', formula: formulaTdee };
  }
  if (adaptive?.status === 'ok') {
    const measured: Estimate = { value: adaptive.tdee, range: adaptive.range };
    const impliedPal = (adaptive.tdee - extra) / bmr.value;
    if (tdee?.formula) {
      const f = fuse(tdee.formula, measured, RHO_TDEE);
      tdee = { ...tdee, value: f.value, range: f.range, source: 'combined', adaptive: measured, impliedPal };
    } else {
      tdee = { ...measured, extraKcal: extra, source: 'adaptive', adaptive: measured, impliedPal };
    }
  }

  // ── Hinweise ────────────────────────────────────────────────────────
  if (age < 18) hints.unshift({ level: 'warn', text: 'Die Formeln sind für Erwachsene entwickelt. Im Wachstum ist der Bedarf höher und schwankt stärker – das Ergebnis ist hier nur ein grober Richtwert.' });
  if (bmiValue < 18.5) hints.push({ level: 'warn', text: `Dein BMI liegt bei ${nf1.format(bmiValue)} (Untergewicht). Bitte nicht weiter reduzieren, ohne das ärztlich abzuklären.` });
  if (bmiValue >= 35 && measurements.length === 0) hints.push({ level: 'info', text: 'Bei höherem Körpergewicht wird die Schätzung mit Körperfett- oder Umfangsangaben deutlich zuverlässiger.' });

  // ── Genauigkeit und Stufen ──────────────────────────────────────────
  const rel = bmr.range / bmr.value;
  const precisionScore = Math.round(Math.min(100, Math.max(0, ((0.16 - rel) / (0.16 - 0.04)) * 100)));
  const precisionLabel = precisionScore >= 75 ? 'sehr gut' : precisionScore >= 55 ? 'gut' : precisionScore >= 35 ? 'solide' : 'grob';
  const m = input.modifiers ?? {};
  const stages: Stage[] = [
    { id: 'basis', label: 'Basisdaten', done: true },
    { id: 'bodyfat', label: 'Körperfett', done: measurements.some((x) => x.source !== 'navy') },
    { id: 'circumferences', label: 'Umfänge', done: measurements.some((x) => x.source === 'navy') },
    { id: 'factors', label: 'Weitere Faktoren', done: Object.values(m).some((v) => v !== undefined) || input.athlete !== undefined },
    { id: 'activity', label: 'Aktivität', done: input.activity !== undefined },
    { id: 'adaptive', label: 'Verlauf', done: adaptive?.status === 'ok' },
  ];

  const result: CalcResult = {
    ok: true,
    bmr,
    bmi: bmiValue,
    precisionScore,
    precisionLabel,
    method,
    stages,
    steps,
    mifflinBreakdown,
    formulas,
    bodyComposition,
    tdee,
    adaptive,
    hints,
    suggestions: [],
  };
  if (options.suggestions !== false) result.suggestions = suggest(input, result);
  return result;
}

/** Simuliert, wie stark zusätzliche Angaben die Spanne verkleinern würden. */
function suggest(input: Inputs, result: CalcResult): Suggestion[] {
  const out: Suggestion[] = [];
  const bmiValue = result.bmi;
  const guessBf = Math.min(50, Math.max(8, deurenbergBodyFat(input.sex, input.age, bmiValue)));
  const simulate = (patch: Partial<Inputs>): number | undefined => {
    const r = calculate({ ...input, ...patch }, { suggestions: false });
    return r.ok ? r.bmr.range : undefined;
  };
  const measured = result.bodyComposition?.measurements ?? [];
  const hasNavy = measured.some((m) => m.source === 'navy');
  const bestDirect = measured.filter((m) => m.source !== 'navy').reduce((best, m) => Math.min(best, m.range), Infinity);

  if (!hasNavy) {
    const circ =
      input.sex === 'male'
        ? navyInverseMale(input.heightCm, guessBf)
        : { waistCm: 80, neckCm: 33, hipCm: 100 };
    const r = simulate({ circumferences: circ });
    out.push({
      id: 'circumferences',
      title: input.sex === 'male' ? 'Taille und Hals messen' : 'Taille, Hüfte und Hals messen',
      text: 'Ein Maßband genügt: Daraus schätzt die Navy-Methode deinen Körperfettanteil.',
      expectedRange: r,
    });
  }
  if (bestDirect > BODY_FAT_SOURCES.caliper.range) {
    const r = simulate({ bodyFat: { percent: result.bodyComposition?.percent ?? guessBf, source: 'dexa' } });
    out.push({
      id: 'bodyfat',
      title: 'Körperfett genau messen lassen',
      text: 'Ein DEXA-Scan oder eine Caliper-Messung (z. B. im Fitnessstudio) liefert die fettfreie Masse deutlich genauer als eine Körperfettwaage.',
      expectedRange: r,
    });
  }
  if (!input.activity) {
    out.push({ id: 'activity', title: 'Aktivität angeben', text: 'Dann siehst du auch deinen Gesamtumsatz (Grundumsatz × Aktivitätsfaktor).' });
  }
  if (result.adaptive?.status !== 'ok') {
    out.push({
      id: 'adaptive',
      title: '2–4 Wochen Gewicht und Kalorien notieren',
      text: 'Der Königsweg: Aus Gewichtsverlauf und Kalorienzufuhr wird dein tatsächlicher Verbrauch zurückgerechnet – genauer als jede Formel.',
    });
  }
  return out;
}

/** Findet für die Simulation plausible Männer-Umfänge zu einem Ziel-Körperfettanteil. */
function navyInverseMale(heightCm: number, targetBf: number): { waistCm: number; neckCm: number } {
  const neckCm = 39;
  let lo = neckCm + 1;
  let hi = 200;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    const bf = navyBodyFat('male', heightCm, mid, neckCm) ?? 0;
    if (bf < targetBf) lo = mid;
    else hi = mid;
  }
  return { waistCm: Math.round(lo), neckCm };
}
