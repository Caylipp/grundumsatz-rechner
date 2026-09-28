import type { AnyBodyFatSource, Sex, SkinfoldSite } from './types';

/** Mifflin-St Jeor (1990): Standard für Erwachsene ohne Angaben zur Körperzusammensetzung. */
export function mifflinStJeor(sex: Sex, age: number, heightCm: number, weightKg: number): number {
  return 10 * weightKg + 6.25 * heightCm - 5 * age + (sex === 'male' ? 5 : -161);
}

/** Harris-Benedict, revidiert von Roza & Shizgal (1984). Nur zum Vergleich. */
export function harrisBenedictRevised(sex: Sex, age: number, heightCm: number, weightKg: number): number {
  return sex === 'male'
    ? 88.362 + 13.397 * weightKg + 4.799 * heightCm - 5.677 * age
    : 447.593 + 9.247 * weightKg + 3.098 * heightCm - 4.33 * age;
}

/** Katch-McArdle: basiert allein auf der fettfreien Masse (FFM). */
export function katchMcArdle(ffmKg: number): number {
  return 370 + 21.6 * ffmKg;
}
export const KATCH_SLOPE = 21.6;

/** Cunningham (1980): FFM-basiert, bewährt bei Sportler:innen mit viel Muskelmasse. */
export function cunningham(ffmKg: number): number {
  return 500 + 22 * ffmKg;
}
export const CUNNINGHAM_SLOPE = 22;

export function bmi(weightKg: number, heightCm: number): number {
  const m = heightCm / 100;
  return weightKg / (m * m);
}

function plausible(bf: number): number | null {
  return Number.isFinite(bf) && bf >= 2 && bf <= 65 ? bf : null;
}

/**
 * Körperfett nach der U.S.-Navy-Methode (Hodgdon & Beckett 1984), metrische Variante.
 * Frauen benötigen zusätzlich den Hüftumfang. Gibt `null` zurück, wenn die Maße
 * unplausibel sind (z. B. Hals ≥ Taille).
 */
export function navyBodyFat(sex: Sex, heightCm: number, waistCm: number, neckCm: number, hipCm?: number): number | null {
  if (sex === 'male') {
    const d = waistCm - neckCm;
    if (d <= 0) return null;
    return plausible(495 / (1.0324 - 0.19077 * Math.log10(d) + 0.15456 * Math.log10(heightCm)) - 450);
  }
  if (hipCm === undefined) return null;
  const d = waistCm + hipCm - neckCm;
  if (d <= 0) return null;
  return plausible(495 / (1.29579 - 0.35004 * Math.log10(d) + 0.221 * Math.log10(heightCm)) - 450);
}

/** YMCA-Formel: Körperfett aus Taillenumfang und Gewicht (rechnet intern in Zoll/Pfund). */
export function ymcaBodyFat(sex: Sex, waistCm: number, weightKg: number): number | null {
  const waistIn = waistCm / 2.54;
  const weightLb = weightKg * 2.20462;
  const c = sex === 'male' ? -98.42 : -76.76;
  return plausible(((c + 4.15 * waistIn - 0.082 * weightLb) / weightLb) * 100);
}

/** Relative Fat Mass (Woolcott & Bergman 2018): nur Größe und Taille, gegen DEXA validiert. */
export function rfmBodyFat(sex: Sex, heightCm: number, waistCm: number): number | null {
  return plausible((sex === 'male' ? 64 : 76) - 20 * (heightCm / waistCm));
}

/** Siri (1961): Körperdichte → Körperfettanteil */
export function siri(density: number): number {
  return 495 / density - 450;
}

export const JP3_SITES: Record<Sex, SkinfoldSite[]> = {
  male: ['chest', 'abdomen', 'thigh'],
  female: ['triceps', 'suprailiac', 'thigh'],
};
export const JP7_SITES: SkinfoldSite[] = ['chest', 'midaxillary', 'triceps', 'subscapular', 'abdomen', 'suprailiac', 'thigh'];
export const DW4_SITES: SkinfoldSite[] = ['biceps', 'triceps', 'subscapular', 'suprailiac'];

function sumSites(folds: Partial<Record<SkinfoldSite, number>>, sites: SkinfoldSite[]): number | null {
  let s = 0;
  for (const site of sites) {
    const v = folds[site];
    if (typeof v !== 'number' || !Number.isFinite(v) || v <= 0) return null;
    s += v;
  }
  return s;
}

/** Jackson & Pollock 3-Punkt-Methode (Männer 1978, Frauen 1980) + Siri. Hautfalten in mm. */
export function jacksonPollock3(sex: Sex, age: number, folds: Partial<Record<SkinfoldSite, number>>): number | null {
  const s = sumSites(folds, JP3_SITES[sex]);
  if (s === null) return null;
  const d =
    sex === 'male'
      ? 1.10938 - 0.0008267 * s + 0.0000016 * s * s - 0.0002574 * age
      : 1.0994921 - 0.0009929 * s + 0.0000023 * s * s - 0.0001392 * age;
  return plausible(siri(d));
}

/** Jackson & Pollock 7-Punkt-Methode + Siri. Hautfalten in mm. */
export function jacksonPollock7(sex: Sex, age: number, folds: Partial<Record<SkinfoldSite, number>>): number | null {
  const s = sumSites(folds, JP7_SITES);
  if (s === null) return null;
  const d =
    sex === 'male'
      ? 1.112 - 0.00043499 * s + 0.00000055 * s * s - 0.00028826 * age
      : 1.097 - 0.00046971 * s + 0.00000056 * s * s - 0.00012828 * age;
  return plausible(siri(d));
}

/** Durnin & Womersley (1974): 4 Hautfalten, altersabhängige Koeffizienten + Siri. */
export function durninWomersley(sex: Sex, age: number, folds: Partial<Record<SkinfoldSite, number>>): number | null {
  const s = sumSites(folds, DW4_SITES);
  if (s === null) return null;
  const table =
    sex === 'male'
      ? [
          [20, 1.162, 0.063],
          [30, 1.1631, 0.0632],
          [40, 1.1422, 0.0544],
          [50, 1.162, 0.07],
          [Infinity, 1.1715, 0.0779],
        ]
      : [
          [20, 1.1549, 0.0678],
          [30, 1.1599, 0.0717],
          [40, 1.1423, 0.0632],
          [50, 1.1333, 0.0612],
          [Infinity, 1.1339, 0.0645],
        ];
  const [, c, m] = table.find(([maxAge]) => age < maxAge!)!;
  return plausible(siri(c! - m! * Math.log10(s)));
}

/** Deurenberg (1991): grobe Körperfett-Schätzung aus BMI. Nur für Simulationen/Vorschläge. */
export function deurenbergBodyFat(sex: Sex, age: number, bmiValue: number): number {
  return 1.2 * bmiValue + 0.23 * age - 10.8 * (sex === 'male' ? 1 : 0) - 5.4;
}

/**
 * Typische Messunsicherheit (±, Prozentpunkte, ca. 80 %) der Körperfett-Methoden.
 * Gerundete Werte aus Validierungsstudien gegen Referenzverfahren.
 */
export const BODY_FAT_RANGES: Record<AnyBodyFatSource, number> = {
  dexa: 2.5,
  bodpod: 3,
  jp7: 3.8,
  caliper: 4.5,
  jp3: 4.5,
  dw4: 4.5,
  navy: 4.5,
  rfm: 5,
  bia8: 4,
  bia: 5.4,
  ymca: 5.5,
  visual: 7,
};

/** Waagen: systematischer und zufälliger Anteil. Mehrere Messungen mitteln verkleinert nur den zufälligen Anteil. */
export const BIA_ERROR: Record<'bia' | 'bia8', { systematic: number; random: number }> = {
  bia: { systematic: 4.5, random: 3 },
  bia8: { systematic: 3.5, random: 2 },
};

/** Zusatzfehler bei selbst gemessenen Hautfalten (±, Prozentpunkte) */
export const SELF_SKINFOLD_EXTRA = 2.5;

/** Unsicherheit (±, relativ, ca. 80 %) gemessener Ruheumsätze */
export const RMR_MEASUREMENT_REL_RANGE: Record<'lab' | 'handheld', number> = {
  lab: 0.06,
  handheld: 0.1,
};

/** Relative Modellunsicherheit (±, ca. 80 %) einer FFM-Formel bei exakt bekannter FFM. */
export const FFM_MODEL_REL_RANGE = 0.075;

/** Relative Unsicherheit (±, ca. 80 %) von Mifflin-St Jeor in Abhängigkeit von BMI und Alter. */
export function mifflinRelRange(bmiValue: number, age: number): number {
  let r = 0.1;
  if (bmiValue >= 40) r = 0.13;
  else if (bmiValue >= 30) r = 0.115;
  else if (bmiValue < 18.5) r = 0.12;
  if (age >= 65) r += 0.02;
  if (age < 18) r += 0.03;
  return r;
}
