import { messages, type Locale } from '@grundumsatz/core';

/** Parst deutsche und englische Dezimalschreibweise. Leer → undefined, ungültig → NaN. */
export function parseNum(raw: string | null | undefined): number | undefined {
  if (raw == null) return undefined;
  const s = raw.trim().replace(/\s/g, '').replace(',', '.');
  if (s === '') return undefined;
  const n = Number(s);
  return Number.isFinite(n) ? n : NaN;
}

export function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

export const store = {
  get<T>(key: string): T | undefined {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : undefined;
    } catch {
      return undefined;
    }
  },
  set(key: string, value: unknown) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* Speicher nicht verfügbar (privater Modus o. Ä.) – Rechner funktioniert trotzdem */
    }
  },
  remove(key: string) {
    try {
      localStorage.removeItem(key);
    } catch {
      /* ignorieren */
    }
  },
};

export function todayIso(): string {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
}

/** Datum im Format der Sprache, z. B. 27.09. / 9/27 */
export function dateFormatter(locale: Locale) {
  const intl = messages(locale).intl;
  const short = new Intl.DateTimeFormat(intl, { day: '2-digit', month: '2-digit', timeZone: 'UTC' });
  const long = new Intl.DateTimeFormat(intl, { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' });
  return (iso: string, withYear = false) => {
    const d = new Date(`${iso}T00:00:00Z`);
    return (withYear ? long : short).format(d);
  };
}

export function $(sel: string, root: ParentNode = document): HTMLElement {
  const el = root.querySelector<HTMLElement>(sel);
  if (!el) throw new Error(`Element fehlt: ${sel}`);
  return el;
}
