import { bmi as bmiOf } from './formulas';
import { formatters, messages } from './i18n';
import type { Hint, Locale } from './types';

/**
 * Makro-Verteilung (Protein, Fett, Kohlenhydrate) als Spannen.
 *
 * Eiweiß (g/kg): Morton 2018 (Plateau ab ca. 1,6 g/kg Körpergewicht, oberes Konfidenzende 2,2),
 * ISSN Position Stand 2017 (1,4–2,0), Helms 2014 (Diät bei Magerkeit: 2,3–3,1 g/kg fettfreie Masse).
 * Fett: mindestens 0,6 g/kg bzw. 20 % der Energie, nach oben 35 % (DGE: 30–35 %).
 * Kohlenhydrate sind der Rest. Ihre Spanne entsteht aus den Spannen von Eiweiß und Fett sowie
 * der Unsicherheit der Energie (nur wenn auf den Erhaltungsbedarf verteilt wird).
 */

/** Eiweißspannen in g je kg Bezugsmasse. */
export const PROTEIN_PER_KG = {
  weight: { lose: [1.8, 2.4], maintain: [1.2, 1.8], gain: [1.6, 2.2] },
  ffm: { lose: [2.3, 3.1], maintain: [1.5, 2.2], gain: [2.0, 2.7] },
} as const;
export const PROTEIN_OVERRIDE_MIN = 0.8;
export const PROTEIN_OVERRIDE_MAX = 3.5;
export const FAT_MIN_PER_KG = 0.6;
export const FAT_MIN_SHARE = 0.2;
export const FAT_MAX_SHARE = 0.35;
/** Richtwert für den Einzelwert (Mitte der Spanne, zwischen Minimum und Maximum begrenzt) */
export const FAT_POINT_SHARE = 0.275;
export const PROTEIN_HIGH_SHARE = 0.35;
export const PROTEIN_HIGH_PER_KG_WEIGHT = 2.5;
export const CARBS_LOW_G = 100;
export const ENERGY_TINY = 1000;

export interface MacroInput {
  age: number;
  heightCm: number;
  weightKg: number;
  /** Energie, auf die verteilt wird (Zielzufuhr oder Gesamtumsatz), kcal/Tag */
  energy: number;
  /** Unsicherheit der Energie (±); 0, wenn die Zufuhr gewählt (Zielzufuhr) statt geschätzt ist */
  energyRange: number;
  direction: 'lose' | 'maintain' | 'gain';
  /** Fettfreie Masse, wenn das Körperfett bekannt ist */
  ffmKg?: number;
  /** Eigener Eiweißwert in g je kg Bezugsmasse; leer = Standard nach Ziel */
  proteinPerKg?: number;
  locale?: Locale;
}

export interface MacroRange {
  low: number;
  mid: number;
  high: number;
}

export interface MacroOk {
  status: 'ok';
  refKind: 'ffm' | 'weight';
  refKg: number;
  /** Eiweiß in g je kg Bezugsmasse (low = high bei eigenem Wert) */
  proteinPerKg: { low: number; high: number };
  customProtein: boolean;
  energy: number;
  energyRange: number;
  /** Gramm pro Tag */
  protein: MacroRange;
  fat: MacroRange;
  carbs: MacroRange;
  /** Anteil an der Energie beim Einzelwert (0–1) */
  share: { protein: number; fat: number; carbs: number };
  warnings: Hint[];
}

export interface MacroError {
  status: 'error';
  errors: { field: 'proteinPerKg'; message: string }[];
}

export type MacroPlan = MacroOk | MacroError;

const clamp = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, x));

export function planMacros(input: MacroInput): MacroPlan {
  const locale = input.locale ?? 'de';
  const t = messages(locale).macro;
  const f = formatters(locale);
  const { energy: E, energyRange, weightKg, direction } = input;

  const custom = input.proteinPerKg !== undefined;
  if (custom && !(input.proteinPerKg! >= PROTEIN_OVERRIDE_MIN && input.proteinPerKg! <= PROTEIN_OVERRIDE_MAX)) {
    return {
      status: 'error',
      errors: [{ field: 'proteinPerKg', message: t.errProtein(f.num(PROTEIN_OVERRIDE_MIN), f.num(PROTEIN_OVERRIDE_MAX)) }],
    };
  }

  const useFfm = input.ffmKg !== undefined && input.ffmKg > 0;
  const refKind = useFfm ? 'ffm' : 'weight';
  const refKg = useFfm ? input.ffmKg! : weightKg;
  const [pLowKg, pHighKg] = custom ? [input.proteinPerKg!, input.proteinPerKg!] : PROTEIN_PER_KG[refKind][direction];

  const pLow = pLowKg * refKg;
  const pHigh = pHighKg * refKg;
  const pMid = (pLow + pHigh) / 2;

  const fatMin = Math.max(FAT_MIN_PER_KG * weightKg, (FAT_MIN_SHARE * E) / 9);
  const fatMax = Math.max(fatMin, (FAT_MAX_SHARE * E) / 9);
  const fatMid = clamp((FAT_POINT_SHARE * E) / 9, fatMin, fatMax);

  const carbsOf = (energy: number, protein: number, fat: number) => Math.max(0, (energy - 4 * protein - 9 * fat) / 4);
  const carbMid = carbsOf(E, pMid, fatMid);
  const carbLow = Math.min(carbMid, carbsOf(E - energyRange, pHigh, fatMax));
  const carbHigh = Math.max(carbMid, carbsOf(E + energyRange, pLow, fatMin));

  const share = {
    protein: (4 * pMid) / E,
    fat: (9 * fatMid) / E,
    carbs: (4 * carbMid) / E,
  };

  const warnings: Hint[] = [];
  const warn = (text: string) => warnings.push({ level: 'warn', text });
  const info = (text: string) => warnings.push({ level: 'info', text });
  if (input.age < 18) warn(t.under18);
  if (E < ENERGY_TINY) warn(t.tinyEnergy(f.int(E)));
  const minNeed = 4 * pLow + 9 * fatMin;
  if (minNeed > E) warn(t.infeasible(f.int(minNeed), f.int(E)));
  if (share.protein > PROTEIN_HIGH_SHARE || pMid / weightKg > PROTEIN_HIGH_PER_KG_WEIGHT) {
    info(t.proteinHigh(f.int(share.protein * 100), f.dec1(pMid / weightKg)));
  }
  if (carbMid < CARBS_LOW_G && minNeed <= E) info(t.carbsLow(f.int(CARBS_LOW_G)));
  if (!useFfm && bmiOf(weightKg, input.heightCm) >= 30) info(t.refObese);

  return {
    status: 'ok',
    refKind,
    refKg,
    proteinPerKg: { low: pLowKg, high: pHighKg },
    customProtein: custom,
    energy: E,
    energyRange,
    protein: { low: pLow, mid: pMid, high: pHigh },
    fat: { low: fatMin, mid: fatMid, high: fatMax },
    carbs: { low: carbLow, mid: carbMid, high: carbHigh },
    share,
    warnings,
  };
}
