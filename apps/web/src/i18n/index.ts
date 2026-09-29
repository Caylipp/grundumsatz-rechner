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

/**
 * App-Build (Capacitor): Die App liefert Pfade ohne Dateiendung immer als Startseite aus.
 * Deshalb enden Verzeichnis-Links dort auf `index.html`.
 */
export const IS_APP = import.meta.env.PUBLIC_APP === '1';
const withIndex = (path: string) => (IS_APP && path.endsWith('/') ? `${path}index.html` : path);

/** Pfad einer Seite in einer Sprache. `page` ohne führenden Slash, z. B. "" oder "methodik/". */
export function localePath(locale: Locale, page = ''): string {
  return withIndex(`${BASE}${locale === DEFAULT_LOCALE ? '' : `${locale}/`}${page}`);
}

/** Pfad außerhalb der Sprachstruktur (Assets, Rechtstexte) */
export function asset(path: string): string {
  const clean = path.replace(/^\//, '');
  return clean === '' ? BASE : withIndex(`${BASE}${clean}`);
}

export function isLocale(x: string | undefined): x is Locale {
  return x === 'de' || x === 'en' || x === 'es' || x === 'vi';
}
