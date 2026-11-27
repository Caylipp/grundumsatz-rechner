import { formatters, type GoalOk, type Locale } from '@grundumsatz/core';
import type { UI } from '../i18n';

const W = 640;
const H = 260;
const PAD = { l: 48, r: 16, t: 14, b: 30 };

/** Erwarteter Gewichtsverlauf mit Unsicherheitsband (SVG). */
export function renderGoalChart(plan: GoalOk, startKg: number, targetKg: number, locale: Locale, t: UI['goal']): string {
  const f = formatters(locale);
  const pts = plan.curve;
  if (pts.length < 2) return '';
  const wMaxX = pts[pts.length - 1]!.week;
  const all = pts.flatMap((p) => [p.fast, p.slow, p.expected]).concat(targetKg, startKg);
  let lo = Math.min(...all);
  let hi = Math.max(...all);
  const pad = Math.max(0.5, (hi - lo) * 0.1);
  lo -= pad;
  hi += pad;

  const iw = W - PAD.l - PAD.r;
  const ih = H - PAD.t - PAD.b;
  const x = (w: number) => PAD.l + (w / wMaxX) * iw;
  const y = (kg: number) => PAD.t + (1 - (kg - lo) / (hi - lo)) * ih;
  const path = (key: 'expected' | 'fast' | 'slow') => pts.map((p, i) => `${i ? 'L' : 'M'}${x(p.week).toFixed(1)},${y(p[key]).toFixed(1)}`).join('');
  const band = `${path('fast')}${[...pts].reverse().map((p) => `L${x(p.week).toFixed(1)},${y(p.slow).toFixed(1)}`).join('')}Z`;

  const parts: string[] = ['<g class="grid axis">'];
  for (let i = 0; i <= 4; i++) {
    const kg = lo + ((hi - lo) * i) / 4;
    parts.push(`<line x1="${PAD.l}" x2="${W - PAD.r}" y1="${y(kg)}" y2="${y(kg)}" /><text x="${PAD.l - 6}" y="${y(kg) + 4}" text-anchor="end">${f.dec1(kg)}</text>`);
  }
  const step = Math.max(1, Math.round(wMaxX / 6 / 2) * 2);
  for (let w = 0; w <= wMaxX; w += step) parts.push(`<text x="${x(w)}" y="${H - 8}" text-anchor="middle">${w}</text>`);
  parts.push(`<text x="${W - PAD.r}" y="${H - 8}" text-anchor="end">${t.week}</text></g>`);
  parts.push(`<path class="goal-band" d="${band}" />`);
  parts.push(`<line class="goal-target" x1="${PAD.l}" x2="${W - PAD.r}" y1="${y(targetKg)}" y2="${y(targetKg)}" />`);
  parts.push(`<path class="goal-line" d="${path('expected')}" />`);

  const legend =
    `<span><i style="background:var(--accent)"></i>${t.legendExpected}</span>` +
    `<span><i style="background:var(--band);height:8px"></i>${t.legendBand}</span>` +
    `<span><i style="background:var(--warn)"></i>${t.legendTarget}</span>`;
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${t.chartAria}">${parts.join('')}</svg><div class="chart-legend">${legend}</div>`;
}
