import {
  DW4_SITES,
  JP3_SITES,
  JP7_SITES,
  adaptiveTdee,
  calculate,
  dayNumber,
  formatters,
  isoFromDay,
  type AdaptiveResult,
  type BodyFatSource,
  type CalcResult,
  type FieldError,
  type Inputs,
  type Locale,
  type LogEntry,
  type Modifiers,
  type RmrMethod,
  type Sex,
  type SkinfoldSite,
} from '@grundumsatz/core';
import { UI_TEXT, isLocale } from '../i18n';
import { renderChart } from './chart';
import { $, dateFormatter, esc, parseNum, store, todayIso } from './util';

const FORM_KEY = 'grundumsatz:form';
const LOG_KEY = 'grundumsatz:log';
const REMEMBER_KEY = 'grundumsatz:remember';

const htmlLang = document.documentElement.lang;
const locale: Locale = isLocale(htmlLang) ? htmlLang : 'de';
const T = UI_TEXT[locale];
const f = formatters(locale);
const fd = dateFormatter(locale);
const signed = (x: number, fmt: (n: number) => string = f.int) => (Math.round(x) > 0 ? '+' : Math.round(x) < 0 ? '−' : '±') + fmt(Math.abs(x));

const SITES: SkinfoldSite[] = ['chest', 'abdomen', 'thigh', 'triceps', 'suprailiac', 'subscapular', 'midaxillary', 'biceps'];

const form = $('#calc-form') as HTMLFormElement;
const logForm = $('#log-form') as HTMLFormElement;

let log: LogEntry[] = sortLog(store.get<LogEntry[]>(LOG_KEY) ?? []);
let lastResult: CalcResult | undefined;
let shownValue = 0;

// ─────────────────────────────────────────────────────────────── Formular

type FormState = Record<string, string | boolean>;

function field(name: string): HTMLInputElement | HTMLSelectElement | RadioNodeList | null {
  return form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement | RadioNodeList | null;
}

function val(name: string): string {
  const el = field(name);
  if (!el) return '';
  return (el as HTMLInputElement | RadioNodeList).value ?? '';
}

function checked(name: string): boolean {
  return (field(name) as HTMLInputElement | null)?.checked ?? false;
}

function snapshot(): FormState {
  const state: FormState = {};
  for (const el of Array.from(form.elements)) {
    if (!(el instanceof HTMLInputElement || el instanceof HTMLSelectElement) || !el.name) continue;
    if (el instanceof HTMLInputElement && el.type === 'radio') {
      if (el.checked) state[el.name] = el.value;
    } else if (el instanceof HTMLInputElement && el.type === 'checkbox') {
      state[el.name] = el.checked;
    } else {
      state[el.name] = el.value;
    }
  }
  return state;
}

function restore(state: FormState) {
  for (const el of Array.from(form.elements)) {
    if (!(el instanceof HTMLInputElement || el instanceof HTMLSelectElement) || !el.name || !(el.name in state)) continue;
    const v = state[el.name];
    if (el instanceof HTMLInputElement && el.type === 'radio') el.checked = el.value === v;
    else if (el instanceof HTMLInputElement && el.type === 'checkbox') el.checked = v === true;
    else el.value = String(v ?? '');
  }
}

function currentSex(): Sex | undefined {
  const s = val('sex');
  return s === 'male' || s === 'female' ? s : undefined;
}

function readInputs(): { inputs: Partial<Inputs>; complete: boolean } {
  const sex = currentSex();
  const age = parseNum(val('age'));
  const heightCm = parseNum(val('height'));
  const weightKg = parseNum(val('weight'));
  const inputs: Partial<Inputs> = { sex, age, heightCm, weightKg };

  const bf = parseNum(val('bf'));
  if (bf !== undefined) {
    const source = val('bfSource') as BodyFatSource;
    const readings = source === 'bia' || source === 'bia8' ? parseNum(val('readings')) : undefined;
    inputs.bodyFat = { percent: bf, source, ...(readings !== undefined ? { readings } : {}) };
  }

  const waistCm = parseNum(val('waist'));
  const neckCm = parseNum(val('neck'));
  const hipCm = sex === 'female' ? parseNum(val('hip')) : undefined;
  if (waistCm !== undefined || neckCm !== undefined || hipCm !== undefined) inputs.circumferences = { waistCm, neckCm, hipCm };

  const folds: Partial<Record<SkinfoldSite, number>> = {};
  for (const site of SITES) {
    const v = parseNum(val(`sf_${site}`));
    if (v !== undefined) folds[site] = v;
  }
  if (Object.keys(folds).length > 0) {
    inputs.skinfolds = folds;
    inputs.skinfoldMeasurer = val('measurer') === 'trained' ? 'trained' : 'self';
  }

  const rmr = parseNum(val('rmr'));
  if (rmr !== undefined) inputs.measuredRmr = { kcal: rmr, method: (val('rmrMethod') || 'lab') as RmrMethod };

  if (checked('athlete')) inputs.athlete = true;

  const m: Modifiers = {};
  if (val('thyroid')) m.thyroid = val('thyroid') as Modifiers['thyroid'];
  if (sex === 'female' && val('pregnancy')) m.pregnancy = val('pregnancy') as Modifiers['pregnancy'];
  const sleep = parseNum(val('sleep'));
  if (sleep !== undefined) m.sleepHours = sleep;
  if (val('climate')) m.climate = val('climate') as Modifiers['climate'];
  if (checked('diet')) m.recentDiet = true;
  if (checked('smoker')) m.smoker = true;
  if (Object.keys(m).length > 0) inputs.modifiers = m;

  const pal = val('pal');
  if (pal) inputs.activity = { level: pal as NonNullable<Inputs['activity']>['level'], sport: val('sport') as NonNullable<Inputs['activity']>['sport'] };

  if (log.length > 0) inputs.log = log;

  const complete = sex !== undefined && age !== undefined && heightCm !== undefined && weightKg !== undefined;
  return { inputs, complete };
}

function showErrors(errors: FieldError[], onlyFilled: boolean) {
  const byField = new Map(errors.map((e) => [e.field, e.message]));
  for (const el of Array.from(document.querySelectorAll<HTMLElement>('[data-error-for]'))) {
    const key = el.dataset.errorFor!;
    let msg = byField.get(key) ?? '';
    if (onlyFilled && (key === 'sex' || ['age', 'heightCm', 'weightKg'].includes(key)) && isMissing(key)) msg = '';
    el.textContent = msg;
    el.closest('.field')?.classList.toggle('invalid', msg !== '');
  }
}

function isMissing(key: string): boolean {
  const name = { sex: 'sex', age: 'age', heightCm: 'height', weightKg: 'weight' }[key];
  return !name || val(name).trim() === '';
}

/** Zeigt/versteckt Felder je nach Geschlecht und Messmethode, aktualisiert die Caliper-Anzeige. */
function syncVisibility() {
  const sex = currentSex();
  for (const el of Array.from(document.querySelectorAll<HTMLElement>('[data-only="female"]'))) el.hidden = sex !== 'female';
  const source = val('bfSource');
  for (const el of Array.from(document.querySelectorAll<HTMLElement>('[data-show-for-source]'))) {
    el.hidden = !el.dataset.showForSource!.split(' ').includes(source);
  }
  syncCaliper(sex ?? 'male');
}

function syncCaliper(sex: Sex) {
  const set3 = JP3_SITES[sex];
  const filled = new Set(SITES.filter((s) => {
    const v = parseNum(val(`sf_${s}`));
    return v !== undefined && !Number.isNaN(v);
  }));
  const missing3 = set3.filter((s) => !filled.has(s));
  const missing7 = JP7_SITES.filter((s) => !filled.has(s));
  const target = missing3.length > 0 ? missing3 : missing7;

  for (const el of Array.from(document.querySelectorAll<HTMLElement>('.site[data-site]'))) {
    const site = el.dataset.site as SkinfoldSite;
    const in3 = set3.includes(site);
    const in7 = JP7_SITES.includes(site);
    const in4 = DW4_SITES.includes(site);
    el.style.order = String(in3 ? set3.indexOf(site) : in7 ? 10 + JP7_SITES.indexOf(site) : 20);
    const tags = el.querySelector<HTMLElement>('[data-tags]');
    if (tags) {
      tags.innerHTML = [in3 ? `<span class="tag t3">${T.form.caliper.tag3}</span>` : '', in7 ? `<span class="tag">${T.form.caliper.tag7}</span>` : '', in4 ? `<span class="tag">${T.form.caliper.tag4}</span>` : ''].join('');
    }
    el.classList.toggle('missing', filled.size > 0 && target.includes(site));
  }

  $('#cs3').style.width = `${((3 - missing3.length) / 3) * 100}%`;
  $('#cs3-text').textContent = missing3.length === 0 ? T.form.caliper.done3 : T.form.caliper.status3(missing3.length);
  $('#cs7').style.width = `${((7 - missing7.length) / 7) * 100}%`;
  $('#cs7-text').textContent = missing7.length === 0 ? T.form.caliper.done7 : T.form.caliper.status7(missing7.length);
}

// ─────────────────────────────────────────────────────────────── Ergebnis

function update() {
  syncVisibility();
  const { inputs, complete } = readInputs();
  if (checked('remember')) store.set(FORM_KEY, snapshot());

  if (!complete) {
    // Fehler nur für bereits ausgefüllte, ungültige Felder anzeigen
    const probe = calculate({ sex: 'male', age: 30, heightCm: 175, weightKg: 75, ...stripUndefined(inputs) } as Inputs, { suggestions: false, locale });
    showErrors(probe.ok ? [] : probe.errors, true);
    renderEmpty();
    return;
  }

  const result = calculate(inputs as Inputs, { locale });
  if (!result.ok) {
    showErrors(result.errors, false);
    renderEmpty();
    return;
  }
  showErrors([], false);
  lastResult = result;
  renderResult(result);
  renderExplanation(result);
  renderTrackerStatus(result.adaptive, result);
}

function stripUndefined<O extends object>(o: O): Partial<O> {
  return Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined)) as Partial<O>;
}

function renderEmpty() {
  lastResult = undefined;
  $('#result-empty').hidden = false;
  $('#result-full').hidden = true;
  $('#explain-empty').hidden = false;
  $('#explain-body').hidden = true;
  $('#mini-result').hidden = true;
  for (const el of Array.from(document.querySelectorAll<HTMLElement>('[data-gain]'))) el.textContent = '';
  renderTrackerStatus(log.length ? adaptiveTdee(log, locale) : undefined, undefined);
}

function animateValue(el: HTMLElement, to: number) {
  const from = shownValue || to * 0.92;
  shownValue = to;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.textContent = f.int(to);
    return;
  }
  const t0 = performance.now();
  const tick = (now: number) => {
    const k = Math.min(1, (now - t0) / 450);
    const e = 1 - Math.pow(1 - k, 3);
    el.textContent = f.int(from + (to - from) * e);
    if (k < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function renderResult(r: CalcResult) {
  const R = T.result;
  $('#result-empty').hidden = true;
  $('#result-full').hidden = false;
  const { value, range } = r.bmr;
  animateValue($('#r-value'), value);
  $('#r-range').textContent = R.range(f.int(range), f.int(value - range), f.int(value + range));

  // Genauigkeitsbalken: Basisbereich (gestrichelt) vs. aktueller Bereich
  const basis = r.steps[0]!.estimate;
  const half = Math.max(basis.range, range) * 1.5;
  const lo = value - half;
  const hi = value + half;
  const pos = (x: number) => `${((x - lo) / (hi - lo)) * 100}%`;
  const band = $('#m-band');
  band.style.left = pos(value - range);
  band.style.width = `${((2 * range) / (hi - lo)) * 100}%`;
  const ghost = $('#m-ghost');
  const showGhost = r.steps.length > 1;
  ghost.hidden = !showGhost;
  ghost.style.left = pos(basis.value - basis.range);
  ghost.style.width = `${((2 * basis.range) / (hi - lo)) * 100}%`;
  $('#m-mark').style.left = pos(value);
  $('#m-min').textContent = f.int(lo);
  $('#m-max').textContent = f.int(hi);

  $('#r-narrow').innerHTML = showGhost && Math.round(basis.range) !== Math.round(range) ? R.narrowedHtml(f.int(basis.range), f.int(range)) : esc(R.narrowDefault);

  $('#r-precision-label').textContent = `${r.precisionLabel} · ±${f.dec1((range / value) * 100)} %`;
  $('#r-precision-bar').style.width = `${Math.max(4, r.precisionScore)}%`;

  $('#r-stages').innerHTML = r.stages.map((s) => `<li class="stage-chip${s.done ? ' done' : ''}">${esc(s.label)}</li>`).join('');
  $('#r-method').textContent = r.method;

  const td = r.tdee;
  $('#r-tdee').hidden = !td;
  if (td) {
    $('#t-value').textContent = f.int(td.value);
    const parts = [`± ${f.int(td.range)} kcal`];
    if (td.source === 'pal') parts.push(R.tdeePal(f.dec2(td.pal!)));
    else if (td.source === 'combined') parts.push(R.tdeeCombined(f.int(td.formula!.value), f.int(td.adaptive!.value)));
    else parts.push(R.tdeeMeasured);
    if (td.extraKcal) parts.push(R.tdeeExtra(f.int(td.extraKcal)));
    if (td.impliedPal) parts.push(R.impliedPal(f.dec2(td.impliedPal)));
    $('#t-detail').textContent = parts.join(' · ');
  }

  // Gewinn-Anzeigen an den optionalen Abschnitten
  for (const el of Array.from(document.querySelectorAll<HTMLElement>('[data-gain]'))) {
    const id = el.dataset.gain!;
    const s = r.suggestions.find((x) => x.id === id || (id === 'caliper' && (x.id === 'caliper3' || x.id === 'caliper7')));
    el.textContent = s?.expectedRange ? `± ${f.int(range)} → ± ${f.int(s.expectedRange)} kcal` : s?.id === 'activity' ? `+ ${R.tdee}` : '';
  }
  for (const el of Array.from(document.querySelectorAll<HTMLElement>('[data-done]'))) {
    el.classList.toggle('on', r.stages.find((s) => s.id === el.dataset.done)?.done ?? false);
  }

  $('#mini-result').hidden = false;
  $('#mini-value').textContent = `${f.int(value)} kcal`;
  $('#mini-range').textContent = `± ${f.int(range)}`;
}

function renderExplanation(r: CalcResult) {
  const X = T.explain;
  $('#explain-empty').hidden = true;
  $('#explain-body').hidden = false;

  $('#x-steps').innerHTML = r.steps
    .map((s, i) => {
      const e = s.estimate;
      let deltas = '';
      if (i > 0) {
        const dv = Math.round(s.deltaValue);
        const dr = Math.round(s.deltaRange);
        deltas =
          `<div class="deltas"><span class="delta">${dv === 0 ? X.unchanged : `${signed(dv)} kcal`}</span>` +
          `<span class="delta ${dr < 0 ? 'good' : dr > 0 ? 'bad' : ''}">${dr === 0 ? X.rangeUnchanged : dr < 0 ? X.rangeBetter(signed(dr)) : X.rangeWorse(signed(dr))}</span></div>`;
      }
      const breakdown =
        s.id === 'basis'
          ? `<table class="breakdown"><tbody>${r.mifflinBreakdown
              .map((b) => `<tr><td>${esc(b.label)}</td><td>${signed(b.kcal)} kcal</td></tr>`)
              .join('')}<tr class="sum"><td>${X.sumMifflin}</td><td>${f.int(r.formulas[0]!.kcal)} kcal</td></tr></tbody></table>`
          : '';
      return `<li class="step"><div class="step-head"><span class="step-title">${esc(s.title)}</span><span class="step-val">${f.int(e.value)} ± ${f.int(e.range)} kcal</span></div><p>${esc(s.detail)}</p>${breakdown}${deltas}</li>`;
    })
    .join('');

  $('#x-suggest').innerHTML = r.suggestions.length
    ? r.suggestions
        .map(
          (s) =>
            `<li><strong>${esc(s.title)}</strong><p>${esc(s.text)}</p>${
              s.expectedRange ? `<span class="gainline">${X.gain(f.int(r.bmr.range), f.int(s.expectedRange))}</span>` : ''
            }</li>`,
        )
        .join('')
    : `<li><p>${esc(X.noMore)}</p></li>`;

  $('#x-hints-card').hidden = r.hints.length === 0;
  $('#x-hints').innerHTML = r.hints.map((h) => `<p class="note${h.level === 'warn' ? ' warn' : ''}">${esc(h.text)}</p>`).join('');

  const bc = r.bodyComposition;
  $('#x-body-card').hidden = !bc;
  if (bc) {
    const ffmShare = (bc.ffmKg / (bc.ffmKg + bc.fatKg)) * 100;
    $('#x-body').innerHTML =
      `<div class="comp-bar" role="img" aria-label="${X.ffm} ${f.dec1(bc.ffmKg)} kg, ${X.fat} ${f.dec1(bc.fatKg)} kg"><span class="ffm" style="width:${ffmShare}%"></span><span class="fat" style="width:${100 - ffmShare}%"></span></div>` +
      `<div class="comp-legend"><span><strong>${f.dec1(bc.ffmKg)} kg</strong> ${X.ffm}</span><span><strong>${f.dec1(bc.fatKg)} kg</strong> ${X.fat} (${f.dec1(bc.percent)} % ± ${f.dec1(bc.range)})</span></div>` +
      `<ul class="comp-list">${bc.measurements.map((m) => `<li>${esc(m.label)}: ${f.dec1(m.percent)} % (± ${f.dec1(m.range)} ${X.pp})</li>`).join('')}</ul>`;
  }

  $('#x-formulas').innerHTML = r.formulas
    .map(
      (fm) =>
        `<tr><td><strong>${esc(fm.name)}</strong><span class="fnote">${esc(fm.note)}</span></td><td class="r num">${f.int(fm.kcal)} kcal</td>` +
        `<td><span class="wbar"><span class="track"><span class="fill" style="width:${fm.weight * 100}%"></span></span><small>${Math.round(fm.weight * 100)} %</small></span></td></tr>`,
    )
    .join('');
}

// ─────────────────────────────────────────────────────────────── Verlauf

function sortLog(entries: LogEntry[]): LogEntry[] {
  return [...entries].filter((e) => /^\d{4}-\d{2}-\d{2}$/.test(e.date)).sort((a, b) => a.date.localeCompare(b.date));
}

function saveLog() {
  store.set(LOG_KEY, log);
  renderLogTable();
  update();
}

function upsert(entry: LogEntry) {
  const i = log.findIndex((e) => e.date === entry.date);
  if (i >= 0) {
    const prev = log[i]!;
    log[i] = { date: entry.date, weightKg: entry.weightKg ?? prev.weightKg, kcal: entry.kcal ?? prev.kcal };
  } else {
    log.push(entry);
  }
  log = sortLog(log);
}

function renderLogTable() {
  const TR = T.tracker;
  $('#log-count').textContent = TR.entries(log.length);
  $('#log-rows').innerHTML = [...log]
    .reverse()
    .map(
      (e) =>
        `<tr><td class="num">${fd(e.date, true)}</td><td class="num">${typeof e.weightKg === 'number' ? `${f.dec1(e.weightKg)} kg` : '–'}</td>` +
        `<td class="num">${typeof e.kcal === 'number' ? f.int(e.kcal) : '–'}</td><td><button class="row-del" type="button" data-del="${e.date}" aria-label="${esc(TR.deleteAria(fd(e.date, true)))}">×</button></td></tr>`,
    )
    .join('');
}

function renderTrackerStatus(adaptive: AdaptiveResult | undefined, r: CalcResult | undefined) {
  const TR = T.tracker;
  $('#log-chart').innerHTML = renderChart(log, adaptive, locale, TR);
  const status = $('#adaptive-status');
  const teaser = $('#adaptive-teaser');
  if (!adaptive) {
    status.innerHTML = '';
    teaser.textContent = T.form.adaptive.teaser;
    return;
  }
  if (adaptive.status === 'insufficient') {
    const progress = Math.min(1, adaptive.days / 14, adaptive.weightDays / 7, adaptive.kcalDays / 10);
    status.innerHTML =
      `<strong>${TR.notEnough}</strong><div class="progress"><span style="width:${progress * 100}%"></span></div>` +
      `<ul>${adaptive.reasons.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`;
    teaser.textContent = TR.teaserProgress(adaptive.days);
    return;
  }
  const a = adaptive;
  const pal = r?.tdee?.impliedPal ? `<p>${TR.palHtml(f.int(r.bmr.value), f.dec2(r.tdee.impliedPal))}</p>` : '';
  status.innerHTML =
    `<div class="measured"><span class="small muted">${TR.measured}</span><div class="val">${f.int(a.tdee)} ± ${f.int(a.range)} kcal</div>` +
    `<p>${esc(
      TR.measuredDetail({
        intake: f.int(a.avgIntake),
        slope: signed(a.slopeKgPerWeek, f.dec2),
        days: a.days,
        from: fd(a.fromDate),
        to: fd(a.toDate),
        weights: a.weightDays,
        kcalDays: a.kcalDays,
      }),
    )}</p>${pal}</div>` +
    (a.warnings.length ? `<ul>${a.warnings.map((w) => `<li>${esc(w)}</li>`).join('')}</ul>` : '');
  teaser.textContent = TR.teaserMeasured(`${f.int(a.tdee)} ± ${f.int(a.range)}`);
}

function demoLog(): LogEntry[] {
  const end = dayNumber(todayIso());
  const days = 24;
  const w0 = (lastResult ? parseNum(val('weight')) : undefined) ?? 82;
  const base = lastResult ? Math.round(lastResult.bmr.value * 1.5 - 450) : 2150;
  return Array.from({ length: days }, (_, i) => {
    const noise = Math.sin(i * 12.9898 + 1.3) * 0.4 + Math.sin(i * 3.7) * 0.15;
    const weekend = new Date((end - days + 1 + i) * 86_400_000).getUTCDay() % 6 === 0;
    return {
      date: isoFromDay(end - days + 1 + i),
      weightKg: i % 6 === 5 ? null : Math.round((w0 + 0.5 - (0.45 / 7) * i + noise) * 10) / 10,
      kcal: i % 9 === 4 ? null : Math.round(base + (weekend ? 450 : 0) + Math.cos(i * 1.7) * 180),
    };
  });
}

function toCsv(): string {
  return [T.tracker.csvHeader, ...log.map((e) => `${e.date};${e.weightKg != null ? String(e.weightKg).replace('.', ',') : ''};${e.kcal ?? ''}`)].join('\n');
}

function parseCsv(text: string): LogEntry[] {
  const out: LogEntry[] = [];
  for (const line of text.split(/\r?\n/)) {
    // Mit Semikolon/Tab getrennt → Dezimalkomma erlaubt; sonst Komma als Trenner
    const cells = (/[;\t]/.test(line) ? line.split(/[;\t]/) : line.split(',')).map((c) => c.trim().replace(/^"|"$/g, ''));
    const rawDate = cells[0] ?? '';
    let date: string | undefined;
    let m: RegExpMatchArray | null;
    if ((m = rawDate.match(/^(\d{4})-(\d{2})-(\d{2})$/))) date = `${m[1]}-${m[2]}-${m[3]}`;
    else if ((m = rawDate.match(/^(\d{1,2})[./](\d{1,2})[./](\d{4})$/))) date = `${m[3]}-${m[2]!.padStart(2, '0')}-${m[1]!.padStart(2, '0')}`;
    if (!date) continue;
    const w = parseNum(cells[1]);
    const k = parseNum(cells[2]);
    out.push({ date, weightKg: w !== undefined && !Number.isNaN(w) ? w : null, kcal: k !== undefined && !Number.isNaN(k) ? Math.round(k) : null });
  }
  return out;
}

function download(name: string, content: string) {
  // In der iOS-App (Capacitor) gibt es keine Link-Downloads, dort übernimmt das Teilen-Menü (siehe AppShell.astro)
  const share = (window as unknown as { __shareFile?: (n: string, c: string) => Promise<void> }).__shareFile;
  if (share) {
    void share(name, content).catch(() => {});
    return;
  }
  const url = URL.createObjectURL(new Blob([content], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ─────────────────────────────────────────────────────────────── Verdrahtung

function init() {
  const TR = T.tracker;
  const remember = store.get<boolean>(REMEMBER_KEY);
  const saved = store.get<FormState>(FORM_KEY);
  if (saved && remember !== false) restore(saved);
  (field('remember') as HTMLInputElement).checked = remember !== false;

  form.addEventListener('input', update);
  form.addEventListener('change', (e) => {
    const target = e.target as HTMLInputElement;
    if (target.name === 'remember') {
      store.set(REMEMBER_KEY, target.checked);
      if (!target.checked) store.remove(FORM_KEY);
    }
    update();
  });
  form.addEventListener('submit', (e) => e.preventDefault());

  $('#reset-btn').addEventListener('click', () => {
    const keep = checked('remember');
    form.reset();
    (field('remember') as HTMLInputElement).checked = keep;
    store.remove(FORM_KEY);
    shownValue = 0;
    update();
  });

  // Abschnitte öffnen, in denen schon Werte stehen
  for (const d of Array.from(form.querySelectorAll<HTMLDetailsElement>('details.group'))) {
    const hasValue = Array.from(d.querySelectorAll<HTMLInputElement>('input')).some((el) =>
      el.type === 'checkbox' || el.type === 'radio' ? el.checked && el.value !== '' && el.value !== 'on' : el.value !== '',
    );
    const hasCheck = Array.from(d.querySelectorAll<HTMLInputElement>('input[type=checkbox]')).some((el) => el.checked);
    if (hasValue || hasCheck) d.open = true;
  }

  const dateInput = logForm.elements.namedItem('date') as HTMLInputElement;
  const weightInput = logForm.elements.namedItem('weight') as HTMLInputElement;
  const kcalInput = logForm.elements.namedItem('kcal') as HTMLInputElement;
  dateInput.value = todayIso();
  dateInput.max = todayIso();
  logForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const err = $('#log-error');
    const date = dateInput.value;
    const w = parseNum(weightInput.value);
    const k = parseNum(kcalInput.value);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return void (err.textContent = TR.errDate);
    if (w === undefined && k === undefined) return void (err.textContent = TR.errEmpty);
    if (w !== undefined && !(w >= 25 && w <= 350)) return void (err.textContent = TR.errWeight);
    if (k !== undefined && !(k >= 300 && k <= 10000)) return void (err.textContent = TR.errKcal);
    err.textContent = '';
    upsert({ date, weightKg: w ?? null, kcal: k !== undefined ? Math.round(k) : null });
    weightInput.value = '';
    kcalInput.value = '';
    // Nächsten Tag vorschlagen, wenn ein vergangener Tag nachgetragen wurde
    if (date < todayIso()) dateInput.value = isoFromDay(dayNumber(date) + 1);
    saveLog();
  });

  $('#log-rows').addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-del]');
    if (!btn) return;
    log = log.filter((x) => x.date !== btn.dataset.del);
    saveLog();
  });

  $('#log-demo').addEventListener('click', () => {
    if (log.length && !confirm(TR.confirmDemo)) return;
    log = sortLog(demoLog());
    saveLog();
  });
  $('#log-export').addEventListener('click', () => download(`bmr-log-${todayIso()}.csv`, toCsv()));
  $('#log-import').addEventListener('change', async (e) => {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const entries = parseCsv(await file.text());
    input.value = '';
    if (!entries.length) return void ($('#log-error').textContent = TR.errImport);
    for (const en of entries) upsert(en);
    $('#log-error').textContent = '';
    saveLog();
  });
  $('#log-clear').addEventListener('click', () => {
    if (!log.length || !confirm(TR.confirmClear)) return;
    log = [];
    store.remove(LOG_KEY);
    saveLog();
  });

  // Mini-Ergebnis ausblenden, solange das große Ergebnis sichtbar ist
  const mini = $('#mini-result');
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => mini.classList.toggle('away', entry!.isIntersecting)).observe($('#result'));
  }

  renderLogTable();
  update();
}

init();
