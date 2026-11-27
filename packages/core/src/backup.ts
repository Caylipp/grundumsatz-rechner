import type { LogEntry } from './types';

/**
 * Export/Import der Eingaben ohne Server: JSON-Sicherung (Datei) und Teilen-Link (Fragment `#d=…`,
 * das der Browser nie an einen Server sendet). Alle Daten aus Dateien und Links gelten als
 * unvertrauenswürdig und werden hier bereinigt.
 */

export type FieldValue = string | boolean;
export type FieldMap = Record<string, FieldValue>;

export const BACKUP_APP = 'grundumsatz-rechner';
export const BACKUP_VERSION = 1;
const MAX_FIELDS = 80;
const MAX_VALUE_LENGTH = 32;
const MAX_LOG_ENTRIES = 3660;
const MAX_SHARE_LENGTH = 6000;
const KEY_RE = /^[A-Za-z][A-Za-z0-9_]{0,31}$/;
/** Felder, die nie geteilt werden (Einstellung statt Eingabe) */
const SHARE_SKIP = new Set(['remember']);

export interface Backup {
  app: typeof BACKUP_APP;
  version: typeof BACKUP_VERSION;
  exportedAt: string;
  form: FieldMap;
  goal: FieldMap;
  log: LogEntry[];
}

/** Behält nur harmlose Schlüssel und kurze Text-/Wahrheitswerte. */
export function sanitizeFields(raw: unknown): FieldMap {
  const out: FieldMap = {};
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return out;
  let n = 0;
  for (const [key, value] of Object.entries(raw)) {
    if (n >= MAX_FIELDS) break;
    if (!KEY_RE.test(key)) continue;
    if (typeof value === 'boolean') out[key] = value;
    else if (typeof value === 'string' && value.length <= MAX_VALUE_LENGTH && !/[\u0000-\u001f<>]/.test(value)) out[key] = value;
    else continue;
    n++;
  }
  return out;
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Gültige Einträge (gleiche Grenzen wie im Verlauf), sortiert, pro Tag der letzte. */
export function sanitizeLog(raw: unknown): LogEntry[] {
  if (!Array.isArray(raw)) return [];
  const byDate = new Map<string, LogEntry>();
  for (const e of raw.slice(0, MAX_LOG_ENTRIES)) {
    if (typeof e !== 'object' || e === null) continue;
    const { date, weightKg, kcal } = e as Record<string, unknown>;
    if (typeof date !== 'string' || !DATE_RE.test(date) || Number.isNaN(Date.parse(`${date}T00:00:00Z`))) continue;
    const w = typeof weightKg === 'number' && Number.isFinite(weightKg) && weightKg >= 25 && weightKg <= 350 ? weightKg : null;
    const k = typeof kcal === 'number' && Number.isFinite(kcal) && kcal >= 300 && kcal <= 10000 ? Math.round(kcal) : null;
    if (w === null && k === null) continue;
    byDate.set(date, { date, weightKg: w, kcal: k });
  }
  return [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));
}

export function buildBackup(form: FieldMap, goal: FieldMap, log: LogEntry[], now = new Date()): Backup {
  return {
    app: BACKUP_APP,
    version: BACKUP_VERSION,
    exportedAt: now.toISOString(),
    form: sanitizeFields(form),
    goal: sanitizeFields(goal),
    log: sanitizeLog(log),
  };
}

/** Liest eine JSON-Sicherung; `undefined`, wenn es keine Sicherung dieser App ist. */
export function parseBackup(text: string): Backup | undefined {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return undefined;
  }
  if (typeof data !== 'object' || data === null) return undefined;
  const d = data as Record<string, unknown>;
  if (d.app !== BACKUP_APP || typeof d.version !== 'number' || d.version > BACKUP_VERSION) return undefined;
  return {
    app: BACKUP_APP,
    version: BACKUP_VERSION,
    exportedAt: typeof d.exportedAt === 'string' ? d.exportedAt.slice(0, 40) : '',
    form: sanitizeFields(d.form),
    goal: sanitizeFields(d.goal),
    log: sanitizeLog(d.log),
  };
}

function toBase64Url(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(s: string): string {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b64 + '='.repeat((4 - (b64.length % 4)) % 4));
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
}

/** Kompakter Teilen-Text (nur Eingaben und Ziel, kein Verlauf; leere Felder entfallen). */
export function encodeShare(form: FieldMap, goal: FieldMap): string {
  const compact = (m: FieldMap) =>
    Object.fromEntries(Object.entries(sanitizeFields(m)).filter(([k, v]) => !SHARE_SKIP.has(k) && v !== '' && v !== false));
  return toBase64Url(JSON.stringify({ v: BACKUP_VERSION, f: compact(form), g: compact(goal) }));
}

export function decodeShare(text: string): { form: FieldMap; goal: FieldMap } | undefined {
  if (!text || text.length > MAX_SHARE_LENGTH || !/^[A-Za-z0-9_-]+$/.test(text)) return undefined;
  try {
    const d = JSON.parse(fromBase64Url(text)) as Record<string, unknown>;
    if (typeof d !== 'object' || d === null || d.v !== BACKUP_VERSION) return undefined;
    return { form: sanitizeFields(d.f), goal: sanitizeFields(d.g) };
  } catch {
    return undefined;
  }
}
