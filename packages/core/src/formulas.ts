import type { BodyFatSource, Sex } from './types';

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

/**
 * Körperfett nach der U.S.-Navy-Methode (Hodgdon & Beckett 1984), metrische Variante.
 * Frauen benötigen zusätzlich den Hüftumfang. Gibt `null` zurück, wenn die Maße
 * unplausibel sind (z. B. Hals ≥ Taille).
 */
export function navyBodyFat(
  sex: Sex,
  heightCm: number,
  waistCm: number,
  neckCm: number,
  hipCm?: number,
): number | null {
  let bf: number;
  if (sex === 'male') {
    const d = waistCm - neckCm;
    if (d <= 0) return null;
    bf = 495 / (1.0324 - 0.19077 * Math.log10(d) + 0.15456 * Math.log10(heightCm)) - 450;
  } else {
    if (hipCm === undefined) return null;
    const d = waistCm + hipCm - neckCm;
    if (d <= 0) return null;
    bf = 495 / (1.29579 - 0.35004 * Math.log10(d) + 0.221 * Math.log10(heightCm)) - 450;
  }
  if (!Number.isFinite(bf) || bf < 2 || bf > 65) return null;
  return bf;
}

/** Deurenberg (1991): grobe Körperfett-Schätzung aus BMI. Nur für Simulationen/Vorschläge. */
export function deurenbergBodyFat(sex: Sex, age: number, bmiValue: number): number {
  return 1.2 * bmiValue + 0.23 * age - 10.8 * (sex === 'male' ? 1 : 0) - 5.4;
}

/**
 * Typische Messunsicherheit (±, Prozentpunkte, ca. 80 %) der Körperfett-Methoden.
 * Gerundete Werte aus Validierungsstudien gegen Referenzverfahren.
 */
export const BODY_FAT_SOURCES: Record<BodyFatSource | 'navy', { label: string; range: number }> = {
  dexa: { label: 'DEXA-Scan', range: 2.5 },
  bodpod: { label: 'BodPod / Unterwasserwiegen', range: 3 },
  caliper: { label: 'Caliper (Hautfaltenmessung)', range: 4.5 },
  navy: { label: 'Navy-Methode (Umfänge)', range: 4.5 },
  bia: { label: 'Körperfettwaage / BIA', range: 5.5 },
  visual: { label: 'Eigene Schätzung', range: 7 },
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
