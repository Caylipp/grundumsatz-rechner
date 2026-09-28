import { dayNumber, formatters, isoFromDay, type AdaptiveResult, type Locale, type LogEntry } from '@grundumsatz/core';
import type { UI } from '../i18n';
import { dateFormatter } from './util';

const W = 640;
const H = 280;
const PAD = { l: 44, r: 44, t: 14, b: 28 };

/** Zeichnet Gewichtspunkte, geglätteten Trend, Regressionsgerade und Kalorienbalken als SVG. */
export function renderChart(entries: LogEntry[], adaptive: AdaptiveResult | undefined, locale: Locale, t: UI['tracker']): string {
  const f = formatters(locale);
  const fd = dateFormatter(locale);
  const weights = entries.filter((e) => typeof e.weightKg === 'number') as (LogEntry & { weightKg: number })[];
  if (weights.length === 0) return `<p class="muted small">${t.noWeights}</p>`;

  const days = entries.map((e) => dayNumber(e.date));
  const d0 = Math.min(...days);
  const d1 = Math.max(d0 + 6, Math.max(...days));
  const ws = weights.map((e) => e.weightKg);
  let wMin = Math.min(...ws);
  let wMax = Math.max(...ws);
  const padW = Math.max(0.5, (wMax - wMin) * 0.15);
  wMin -= padW;
  wMax += padW;
  const kcals = entries.map((e) => e.kcal).filter((k): k is number => typeof k === 'number');
  const kMax = kcals.length ? Math.max(...kcals) * 1.1 : 1;

  const iw = W - PAD.l - PAD.r;
  const ih = H - PAD.t - PAD.b;
  const x = (d: number) => PAD.l + ((d - d0) / (d1 - d0)) * iw;
  const y = (w: number) => PAD.t + (1 - (w - wMin) / (wMax - wMin)) * ih;
  const yk = (k: number) => PAD.t + ih - (k / kMax) * ih * 0.3;

  const parts: string[] = [];
  parts.push('<g class="grid axis">');
  const ticks = 4;
  for (let i = 0; i <= ticks; i++) {
    const w = wMin + ((wMax - wMin) * i) / ticks;
    const yy = y(w);
    parts.push(`<line x1="${PAD.l}" x2="${W - PAD.r}" y1="${yy}" y2="${yy}" />`);
    parts.push(`<text x="${PAD.l - 6}" y="${yy + 4}" text-anchor="end">${f.dec1(w)}</text>`);
  }
  const span = d1 - d0;
  const step = Math.max(1, Math.round(span / 5));
  for (let d = d0; d <= d1; d += step) {
    parts.push(`<text x="${x(d)}" y="${H - 8}" text-anchor="middle">${fd(isoFromDay(d))}</text>`);
  }
  if (kcals.length) {
    parts.push(`<text x="${W - PAD.r + 6}" y="${yk(kMax / 1.1) + 4}" text-anchor="start">${f.int(kMax / 1.1)}</text>`);
    parts.push(`<text x="${W - PAD.r + 6}" y="${PAD.t + ih}" text-anchor="start">kcal</text>`);
  }
  parts.push('</g>');

  const bw = Math.max(2, (iw / (span + 1)) * 0.6);
  for (const e of entries) {
    if (typeof e.kcal !== 'number') continue;
    const xx = x(dayNumber(e.date));
    const yy = yk(e.kcal);
    parts.push(`<rect class="kcal" x="${xx - bw / 2}" y="${yy}" width="${bw}" height="${PAD.t + ih - yy}"><title>${fd(e.date)}: ${f.int(e.kcal)} kcal</title></rect>`);
  }
  for (const e of weights) {
    parts.push(`<circle class="pt" cx="${x(dayNumber(e.date))}" cy="${y(e.weightKg)}" r="3.5"><title>${fd(e.date)}: ${f.dec1(e.weightKg)} kg</title></circle>`);
  }
  if (adaptive?.status === 'ok') {
    const path = adaptive.trend.map((p, i) => `${i ? 'L' : 'M'}${x(dayNumber(p.date)).toFixed(1)},${y(p.weight).toFixed(1)}`).join('');
    parts.push(`<path class="trend" d="${path}" />`);
    const { from, to } = adaptive.line;
    parts.push(`<line class="reg" x1="${x(dayNumber(from.date))}" y1="${y(from.weight)}" x2="${x(dayNumber(to.date))}" y2="${y(to.weight)}" />`);
  }

  const ok = adaptive?.status === 'ok';
  const legend = [
    `<span><i style="background:var(--muted);opacity:.6;height:7px;width:7px;border-radius:50%"></i>${t.legendWeight}</span>`,
    ok ? `<span><i style="background:var(--accent)"></i>${t.legendTrend}</span>` : '',
    ok ? `<span><i style="background:var(--muted)"></i>${t.legendReg}</span>` : '',
    kcals.length ? `<span><i style="background:#e2b04a;opacity:.6;height:8px"></i>${t.legendKcal}</span>` : '',
  ].join('');

  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${t.chartAria}">${parts.join('')}</svg><div class="chart-legend">${legend}</div>`;
}
