import type { Locale } from '../types';
import { de } from './de';
import { en } from './en';
import { es } from './es';
import { vi } from './vi';
import type { Messages } from './types';

export type { Messages };
export const LOCALES: Locale[] = ['de', 'en', 'es', 'vi'];
export const MESSAGES: Record<Locale, Messages> = { de, en, es, vi };

export function messages(locale: Locale = 'de'): Messages {
  return MESSAGES[locale] ?? de;
}

/** Zahlenformatierer für eine Sprache */
export function formatters(locale: Locale = 'de') {
  const intl = messages(locale).intl;
  const nf0 = new Intl.NumberFormat(intl, { maximumFractionDigits: 0 });
  const nf1 = new Intl.NumberFormat(intl, { maximumFractionDigits: 1, minimumFractionDigits: 1 });
  const nf2 = new Intl.NumberFormat(intl, { maximumFractionDigits: 2, minimumFractionDigits: 2 });
  const int = (x: number) => nf0.format(Math.round(x));
  return {
    int,
    dec1: (x: number) => nf1.format(x),
    dec2: (x: number) => nf2.format(x),
    num: (x: number) => new Intl.NumberFormat(intl, { maximumFractionDigits: 2 }).format(x),
    kcal: (x: number) => `${int(x)} kcal`,
    pm: (value: number, range: number) => `${int(value)} ± ${int(range)} kcal`,
    pct: (x: number) => (locale === 'en' ? `${int(x * 100)}%` : `${int(x * 100)} %`),
  };
}
