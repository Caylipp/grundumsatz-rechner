import type { Estimate } from './types';

/** z-Wert für ein zweiseitiges 80-%-Intervall */
export const Z80 = 1.2816;

/** Quadratische Addition unabhängiger Unsicherheiten */
export function quad(...xs: number[]): number {
  return Math.sqrt(xs.reduce((sum, x) => sum + x * x, 0));
}

export interface Fused extends Estimate {
  /** Gewicht der ersten Schätzung (0–1) */
  weightA: number;
}

/**
 * Kombiniert zwei Schätzungen desselben Werts zu einer genaueren (gewichtetes Mittel
 * nach inverser Varianz). `rho` ist die angenommene Korrelation der Fehler: Zwei Formeln,
 * die teils dieselben Eingaben nutzen, irren oft in dieselbe Richtung.
 */
export function fuse(a: Estimate, b: Estimate, rho = 0): Fused {
  const sa = a.range;
  const sb = b.range;
  if (sa <= 0) return { ...a, weightA: 1 };
  if (sb <= 0) return { ...b, weightA: 0 };
  const denom = sa * sa + sb * sb - 2 * rho * sa * sb;
  let wa = denom > 0 ? (sb * sb - rho * sa * sb) / denom : 0.5;
  wa = Math.min(1, Math.max(0, wa));
  const wb = 1 - wa;
  const variance = wa * wa * sa * sa + wb * wb * sb * sb + 2 * wa * wb * rho * sa * sb;
  return { value: wa * a.value + wb * b.value, range: Math.sqrt(variance), weightA: wa };
}

/** Kombiniert beliebig viele unabhängige Messungen (inverse Varianz). */
export function fuseIndependent(items: Estimate[]): Estimate {
  if (items.length === 0) throw new Error('fuseIndependent: keine Messungen');
  let wSum = 0;
  let vSum = 0;
  for (const it of items) {
    const w = 1 / (it.range * it.range);
    wSum += w;
    vSum += w * it.value;
  }
  return { value: vSum / wSum, range: Math.sqrt(1 / wSum) };
}

export function mean(xs: number[]): number {
  return xs.reduce((s, x) => s + x, 0) / xs.length;
}

export function sd(xs: number[]): number {
  if (xs.length < 2) return 0;
  const m = mean(xs);
  return Math.sqrt(xs.reduce((s, x) => s + (x - m) ** 2, 0) / (xs.length - 1));
}

export interface Regression {
  slope: number;
  intercept: number;
  residualSd: number;
  slopeSe: number;
}

export function linearRegression(xs: number[], ys: number[]): Regression {
  const n = xs.length;
  const mx = mean(xs);
  const my = mean(ys);
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i]! - mx) ** 2;
    sxy += (xs[i]! - mx) * (ys[i]! - my);
  }
  const slope = sxx > 0 ? sxy / sxx : 0;
  const intercept = my - slope * mx;
  let ssr = 0;
  for (let i = 0; i < n; i++) ssr += (ys[i]! - (intercept + slope * xs[i]!)) ** 2;
  const residualSd = n > 2 ? Math.sqrt(ssr / (n - 2)) : 0;
  const slopeSe = sxx > 0 ? residualSd / Math.sqrt(sxx) : Infinity;
  return { slope, intercept, residualSd, slopeSe };
}
