import type { Locale } from '@grundumsatz/core';
import { de } from './de';
import { en } from './en';
import { es } from './es';
import { vi } from './vi';
import type { UI } from './types';

export type { UI };
export const UI_TEXT: Record<Locale, UI> = { de, en, es, vi };
export const DEFAULT_LOCALE: Locale = 'de';
export const LOCALE_ORDER: Locale[] = ['de', 'en', 'es', 'vi'];

/** Basis-URL der Seite (z. B. "/" oder "/grundumsatz-rechner/"), immer mit Slash am Ende */
export const BASE = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;

/** Pfad einer Seite in einer Sprache. `page` ohne führenden Slash, z. B. "" oder "methodik/". */
export function localePath(locale: Locale, page = ''): string {
  return `${BASE}${locale === DEFAULT_LOCALE ? '' : `${locale}/`}${page}`;
}

/** Pfad außerhalb der Sprachstruktur (Assets, Rechtstexte) */
export function asset(path: string): string {
  return `${BASE}${path.replace(/^\//, '')}`;
}

export function isLocale(x: string | undefined): x is Locale {
  return x === 'de' || x === 'en' || x === 'es' || x === 'vi';
}
