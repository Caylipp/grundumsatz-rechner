import { adaptiveTdee } from './adaptive';
import { PAL_REL_RANGE, palFor } from './activity';
import {
  BIA_ERROR,
  BODY_FAT_RANGES,
  CUNNINGHAM_SLOPE,
  DW4_SITES,
  FFM_MODEL_REL_RANGE,
  JP3_SITES,
  JP7_SITES,
  KATCH_SLOPE,
  RMR_MEASUREMENT_REL_RANGE,
  SELF_SKINFOLD_EXTRA,
  bmi as bmiOf,
  cunningham,
  deurenbergBodyFat,
  durninWomersley,
  harrisBenedictRevised,
  jacksonPollock3,
  jacksonPollock7,
  katchMcArdle,
  mifflinRelRange,
  mifflinStJeor,
  navyBodyFat,
  rfmBodyFat,
  ymcaBodyFat,
} from './formulas';
import { formatters, messages, type Messages } from './i18n';
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
  Locale,
  SkinfoldSite,
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
/** Methoden derselben Gruppe teilen Fehlerquellen: kombiniert höchstens 10 % genauer als die beste */
const GROUP_MAX_GAIN = 0.9;

type Fmt = ReturnType<typeof formatters>;

export interface CalculateOptions {
  /** Vorschläge „Was macht das Ergebnis genauer?“ berechnen (Standard: true) */
  suggestions?: boolean;
  /** Sprache aller Texte im Ergebnis (Standard: de) */
  locale?: Locale;
}

export function calculate(input: Inputs, options: CalculateOptions = {}): CalcResult | CalcError {
  const locale = options.locale ?? 'de';
  const errors = validate(input, locale);
  if (errors.length > 0) return { ok: false, errors };

  const t = messages(locale);
  const f = formatters(locale);
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
    { label: t.basis.weight(f.dec1(weightKg)), kcal: 10 * weightKg },
    { label: t.basis.height(f.int(heightCm)), kcal: 6.25 * heightCm },
    { label: t.basis.age(f.int(age)), kcal: -5 * age },
    { label: sex === 'male' ? t.basis.constMale : t.basis.constFemale, kcal: sex === 'male' ? 5 : -161 },
  ];
  let reason = t.basis.reason;
  if (mRel > 0.1) reason += ' ' + (age >= 65 || age < 18 ? t.basis.widerAge(f.pct(mRel)) : t.basis.widerBmi(f.pct(mRel)));
  push('basis', t.basis.title, reason, mifflinEst);

  let current: Estimate = { ...mifflinEst };
  let method = t.method.mifflin;

  // ── Stufen 2 & 3: Körperfett → fettfreie Masse ──────────────────────
  const measurements = collectBodyFat(input, t, hints);
  const groups = (['direct', 'circumference', 'caliper'] as const)
    .map((g) => measurements.filter((m) => m.group === g))
    .filter((ms) => ms.length > 0);

  let bodyComposition: BodyComposition | undefined;
  let wMifflin = 1;
  let ffmFormula: { id: 'katch_mcardle' | 'cunningham'; value: number } | undefined;
  let ffmAlt: { id: 'katch_mcardle' | 'cunningham'; value: number } | undefined;

  if (groups.length > 0) {
    const bf = fuseIndependent(groups.map(fuseGroup));
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
    const name = t.formulas[ffmFormula.id].name;

    const fused = fuse(mifflinEst, ffmEst, RHO_FORMULAS);
    wMifflin = fused.weightA;

    const src =
      measurements.length === 1
        ? t.bodyfat.single(f.dec1(measurements[0]!.percent), measurements[0]!.label, f.dec1(measurements[0]!.range))
        : t.bodyfat.combined(f.dec1(percent), f.dec1(bf.range), measurements.map((m) => t.bodyfat.item(m.label, f.dec1(m.percent))).join('; '));
    let detail = t.bodyfat.detail({
      src,
      ffm: f.dec1(ffmKg),
      ffmRange: f.dec1(ffmRange),
      formula: name,
      estimate: f.pm(ffmEst.value, ffmEst.range),
      wFfm: f.pct(1 - fused.weightA),
      wMifflin: f.pct(fused.weightA),
    });
    if (useCunningham) detail += ' ' + t.bodyfat.cunninghamWhy;

    const groupIds = groups.map((g) => g[0]!.group);
    let sourceTitle: string;
    if (groupIds.length > 1) sourceTitle = t.bodyfat.sourceMixed;
    else if (groupIds[0] === 'circumference') sourceTitle = t.bodyfat.sourceCirc;
    else if (groupIds[0] === 'caliper') sourceTitle = t.bodyfat.sourceCaliper(caliperSiteCount(measurements));
    else sourceTitle = t.bodyfat.sourceDirect;

    current = { value: fused.value, range: fused.range };
    method = t.method.ffm(name);
    push('bodyfat', t.bodyfat.title(sourceTitle, name), detail, current);
  } else if (input.athlete) {
    hints.push({ level: 'info', text: t.hints.athlete });
  }

  // ── Stufe 4: weitere Faktoren ───────────────────────────────────────
  const mods = evaluateModifiers(input, locale);
  hints.push(...mods.hints);
  for (const corr of mods.corrections) {
    const value = current.value * corr.factor;
    current = { value, range: quad(current.range * corr.factor, value * corr.relRange) };
    push(`mod-${corr.id}`, corr.title, corr.detail, current);
  }

  // ── Gemessener Ruheumsatz (indirekte Kalorimetrie) ──────────────────
  let wFormulas = 1;
  if (input.measuredRmr) {
    const { kcal, method: rmrMethod } = input.measuredRmr;
    const measured: Estimate = { value: kcal, range: kcal * RMR_MEASUREMENT_REL_RANGE[rmrMethod] };
    const deviation = Math.abs(kcal - current.value) / current.value;
    const fused = fuse(current, measured, 0);
    wFormulas = fused.weightA;
    push(
      'measured',
      t.measured.title(t.rmrMethods[rmrMethod]),
      t.measured.detail({ measured: f.pm(measured.value, measured.range), formula: f.pm(current.value, current.range), wMeasured: f.pct(1 - fused.weightA) }),
      fused,
    );
    current = { value: fused.value, range: fused.range };
    if (deviation > 0.15) hints.push({ level: 'warn', text: t.measured.deviates(f.pct(deviation)) });
    method = `${method} + ${t.method.measured}`;
  }
  if (mods.corrections.length > 0) method += ` ${t.method.corrections(mods.corrections.length)}`;

  const bmr = current;

  // ── Formelvergleich ─────────────────────────────────────────────────
  const formulas: FormulaComparison[] = [
    { id: 'mifflin', name: t.formulas.mifflin.name, kcal: mifflin, weight: wMifflin * wFormulas, note: t.formulas.mifflin.note },
    {
      id: 'harris_benedict',
      name: t.formulas.harris_benedict.name,
      kcal: harrisBenedictRevised(sex, age, heightCm, weightKg),
      weight: 0,
      note: `${t.formulas.harris_benedict.note} – ${t.formulas.comparisonOnly}`,
    },
  ];
  if (ffmFormula && ffmAlt) {
    formulas.push({ id: ffmFormula.id, name: t.formulas[ffmFormula.id].name, kcal: ffmFormula.value, weight: (1 - wMifflin) * wFormulas, note: t.formulas[ffmFormula.id].note });
    formulas.push({ id: ffmAlt.id, name: t.formulas[ffmAlt.id].name, kcal: ffmAlt.value, weight: 0, note: `${t.formulas[ffmAlt.id].note} – ${t.formulas.comparisonOnly}` });
  }
  if (input.measuredRmr) {
    formulas.push({
      id: 'measured',
      name: t.formulas.measured.name,
      kcal: input.measuredRmr.kcal,
      weight: 1 - wFormulas,
      note: t.formulas.measured.note(t.rmrMethods[input.measuredRmr.method]),
    });
  }

  // ── Gesamtumsatz (PAL) und Stufe 5: adaptiver Verbrauch ─────────────
  let adaptive: AdaptiveResult | undefined;
  if (input.log && input.log.length > 0) adaptive = adaptiveTdee(input.log, locale);

  let tdee: TdeeResult | undefined;
  const extra = mods.tdeeExtraKcal;
  if (input.activity) {
    const { pal, label } = palFor(input.activity, locale);
    const value = bmr.value * pal + extra;
    const formulaTdee: Estimate = { value, range: quad(bmr.range * pal, bmr.value * pal * PAL_REL_RANGE) };
    tdee = { ...formulaTdee, pal, palLabel: label, extraKcal: extra, source: 'pal', formula: formulaTdee };
  }
  if (adaptive?.status === 'ok') {
    const measured: Estimate = { value: adaptive.tdee, range: adaptive.range };
    const impliedPal = (adaptive.tdee - extra) / bmr.value;
    if (tdee?.formula) {
      const fz = fuse(tdee.formula, measured, RHO_TDEE);
      tdee = { ...tdee, value: fz.value, range: fz.range, source: 'combined', adaptive: measured, impliedPal };
    } else {
      tdee = { ...measured, extraKcal: extra, source: 'adaptive', adaptive: measured, impliedPal };
    }
  }

  // ── Hinweise ────────────────────────────────────────────────────────
  if (age < 18) hints.unshift({ level: 'warn', text: t.hints.under18 });
  if (bmiValue < 18.5) hints.push({ level: 'warn', text: t.hints.underweight(f.dec1(bmiValue)) });
  if (bmiValue >= 35 && measurements.length === 0) hints.push({ level: 'info', text: t.hints.highBmi });

  // ── Genauigkeit und Stufen ──────────────────────────────────────────
  const rel = bmr.range / bmr.value;
  const precisionScore = Math.round(Math.min(100, Math.max(0, ((0.16 - rel) / (0.16 - 0.03)) * 100)));
  const P = t.precision;
  const precisionLabel = precisionScore >= 75 ? P.veryGood : precisionScore >= 55 ? P.good : precisionScore >= 35 ? P.solid : P.rough;
  const m = input.modifiers ?? {};
  const has = (g: BodyFatMeasurement['group']) => measurements.some((x) => x.group === g);
  const done: Record<Stage['id'], boolean> = {
    basis: true,
    bodyfat: has('direct'),
    circumferences: has('circumference'),
    caliper3: has('caliper'),
    caliper7: measurements.some((x) => x.source === 'jp7'),
    factors: Object.values(m).some((v) => v !== undefined) || input.athlete !== undefined,
    measured: input.measuredRmr !== undefined,
    activity: input.activity !== undefined,
    adaptive: adaptive?.status === 'ok',
  };
  const stages: Stage[] = (Object.keys(done) as Stage['id'][]).map((id) => ({ id, label: t.stages[id], done: done[id] }));

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
  if (options.suggestions !== false) result.suggestions = suggest(input, result, locale, t);
  return result;
}

/** Sammelt alle verfügbaren Körperfettwerte samt Unsicherheit. */
function collectBodyFat(input: Inputs, t: Messages, hints: Hint[]): BodyFatMeasurement[] {
  const { sex, age, heightCm, weightKg } = input;
  const out: BodyFatMeasurement[] = [];
  const add = (source: BodyFatMeasurement['source'], group: BodyFatMeasurement['group'], percent: number | null, range = BODY_FAT_RANGES[source], label = t.sources[source]) => {
    if (percent !== null) out.push({ source, group, percent, range, label });
  };

  // Direkte Angabe
  if (input.bodyFat) {
    const { source, percent } = input.bodyFat;
    if (source === 'bia' || source === 'bia8') {
      const n = Math.max(1, Math.round(input.bodyFat.readings ?? 1));
      const e = BIA_ERROR[source];
      const label = n > 1 ? `${t.sources[source]} (${t.bodyfat.readings(n)})` : t.sources[source];
      add(source, 'direct', percent, quad(e.systematic, e.random / Math.sqrt(n)), label);
    } else {
      add(source, 'direct', percent);
    }
  }

  // Umfänge
  const c = input.circumferences;
  if (c?.waistCm !== undefined) {
    if (c.neckCm !== undefined) {
      if (sex === 'female' && c.hipCm === undefined) {
        hints.push({ level: 'info', text: t.hints.hipNeeded });
      } else {
        const navy = navyBodyFat(sex, heightCm, c.waistCm, c.neckCm, c.hipCm);
        if (navy === null) hints.push({ level: 'warn', text: t.hints.implausibleCirc });
        add('navy', 'circumference', navy);
      }
    }
    add('ymca', 'circumference', ymcaBodyFat(sex, c.waistCm, weightKg));
    add('rfm', 'circumference', rfmBodyFat(sex, heightCm, c.waistCm));
  }

  // Hautfalten (Caliper)
  const folds = input.skinfolds ?? {};
  const filled = (Object.keys(folds) as SkinfoldSite[]).filter((s) => typeof folds[s] === 'number');
  if (filled.length > 0) {
    const extra = input.skinfoldMeasurer === 'trained' ? 0 : SELF_SKINFOLD_EXTRA;
    const suffix = input.skinfoldMeasurer === 'trained' ? '' : `, ${t.bodyfat.selfMeasured}`;
    const hasAll = (sites: SkinfoldSite[]) => sites.every((s) => typeof folds[s] === 'number');
    const before = out.length;
    let attempted = false;
    if (hasAll(JP7_SITES)) {
      attempted = true;
      add('jp7', 'caliper', jacksonPollock7(sex, age, folds), quad(BODY_FAT_RANGES.jp7, extra), t.sources.jp7 + suffix);
    } else if (hasAll(JP3_SITES[sex])) {
      attempted = true;
      add('jp3', 'caliper', jacksonPollock3(sex, age, folds), quad(BODY_FAT_RANGES.jp3, extra), t.sources.jp3 + suffix);
    }
    if (hasAll(DW4_SITES)) {
      attempted = true;
      add('dw4', 'caliper', durninWomersley(sex, age, folds), quad(BODY_FAT_RANGES.dw4, extra), t.sources.dw4 + suffix);
    }
    if (!attempted) hints.push({ level: 'info', text: t.hints.caliperPartial(filled.length) });
    else if (out.length === before) hints.push({ level: 'warn', text: t.hints.implausibleSkinfold });
  }
  return out;
}

/** Werte derselben Methodengruppe teilen Fehlerquellen und werden deshalb vorsichtig kombiniert. */
function fuseGroup(ms: BodyFatMeasurement[]): Estimate {
  const fz = fuseIndependent(ms.map((m) => ({ value: m.percent, range: m.range })));
  const best = Math.min(...ms.map((m) => m.range));
  return { value: fz.value, range: ms.length > 1 ? Math.max(fz.range, best * GROUP_MAX_GAIN) : fz.range };
}

function caliperSiteCount(ms: BodyFatMeasurement[]): number {
  if (ms.some((m) => m.source === 'jp7')) return 7;
  if (ms.some((m) => m.source === 'dw4')) return ms.some((m) => m.source === 'jp3') ? 3 : 4;
  return 3;
}

/** Plausible Beispielwerte für Simulationen */
const SAMPLE_FOLDS: Record<SkinfoldSite, number> = {
  chest: 12,
  abdomen: 20,
  thigh: 18,
  triceps: 14,
  suprailiac: 15,
  subscapular: 14,
  midaxillary: 12,
  biceps: 7,
};

/** Simuliert, wie stark zusätzliche Angaben die Spanne verkleinern würden. */
function suggest(input: Inputs, result: CalcResult, locale: Locale, t: Messages): Suggestion[] {
  const out: Suggestion[] = [];
  const S = t.suggestions;
  const guessBf = Math.min(50, Math.max(8, deurenbergBodyFat(input.sex, input.age, result.bmi)));
  const simulate = (patch: Partial<Inputs>): number | undefined => {
    const r = calculate({ ...input, ...patch }, { suggestions: false, locale });
    return r.ok ? r.bmr.range : undefined;
  };
  const measured = result.bodyComposition?.measurements ?? [];
  const has = (g: BodyFatMeasurement['group']) => measured.some((m) => m.group === g);

  if (!has('circumference')) {
    const circ = input.sex === 'male' ? { waistCm: 88, neckCm: 39 } : { waistCm: 80, neckCm: 33, hipCm: 100 };
    out.push({
      id: 'circumferences',
      title: input.sex === 'male' ? S.circumferences.titleMale : S.circumferences.titleFemale,
      text: S.circumferences.text,
      expectedRange: simulate({ circumferences: circ }),
    });
  }
  const folds = input.skinfolds ?? {};
  const fillSites = (sites: SkinfoldSite[]) => {
    const next: Partial<Record<SkinfoldSite, number>> = { ...folds };
    for (const s of sites) if (typeof next[s] !== 'number') next[s] = SAMPLE_FOLDS[s];
    return next;
  };
  if (!has('caliper')) {
    out.push({ id: 'caliper3', ...S.caliper3, expectedRange: simulate({ skinfolds: fillSites(JP3_SITES[input.sex]) }) });
  } else if (!measured.some((m) => m.source === 'jp7')) {
    out.push({ id: 'caliper7', ...S.caliper7, expectedRange: simulate({ skinfolds: fillSites(JP7_SITES) }) });
  }
  const bestDirect = measured.filter((m) => m.group === 'direct').reduce((best, m) => Math.min(best, m.range), Infinity);
  if (bestDirect > BODY_FAT_RANGES.bodpod) {
    out.push({
      id: 'bodyfat',
      ...S.bodyfat,
      expectedRange: simulate({ bodyFat: { percent: result.bodyComposition?.percent ?? guessBf, source: 'dexa' } }),
    });
  }
  if (!input.measuredRmr) {
    out.push({ id: 'measured', ...S.measured, expectedRange: simulate({ measuredRmr: { kcal: Math.round(result.bmr.value), method: 'lab' } }) });
  }
  if (!input.activity) out.push({ id: 'activity', ...S.activity });
  if (result.adaptive?.status !== 'ok') out.push({ id: 'adaptive', ...S.adaptive });
  return out;
}
