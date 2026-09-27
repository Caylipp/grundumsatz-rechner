import {
  adaptiveTdee,
  calculate,
  dayNumber,
  isoFromDay,
  type AdaptiveResult,
  type CalcResult,
  type FieldError,
  type Inputs,
  type LogEntry,
  type Modifiers,
} from '@grundumsatz/core';
import { renderChart } from './chart';
import { $, dec1, dec2, esc, formatDate, int, parseNum, signed, store, todayIso } from './util';

const FORM_KEY = 'grundumsatz:form';
const LOG_KEY = 'grundumsatz:log';
const REMEMBER_KEY = 'grundumsatz:remember';

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

interface ReadOutcome {
  inputs: Partial<Inputs>;
  complete: boolean;
}

function readInputs(): ReadOutcome {
  const sexRaw = val('sex');
  const sex = sexRaw === 'male' || sexRaw === 'female' ? sexRaw : undefined;
  const age = parseNum(val('age'));
  const heightCm = parseNum(val('height'));
  const weightKg = parseNum(val('weight'));
  const inputs: Partial<Inputs> = { sex, age, heightCm, weightKg };

  const bf = parseNum(val('bf'));
  if (bf !== undefined) inputs.bodyFat = { percent: bf, source: val('bfSource') as NonNullable<Inputs['bodyFat']>['source'] };

  const waistCm = parseNum(val('waist'));
  const neckCm = parseNum(val('neck'));
  const hipCm = sex === 'female' ? parseNum(val('hip')) : undefined;
  if (waistCm !== undefined || neckCm !== undefined || hipCm !== undefined) inputs.circumferences = { waistCm, neckCm, hipCm };

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
    const f = el.dataset.errorFor!;
    let msg = byField.get(f) ?? '';
    if (onlyFilled && msg.endsWith('fehlt.')) msg = '';
    if (onlyFilled && f === 'sex') msg = '';
    el.textContent = msg;
    el.closest('.field')?.classList.toggle('invalid', msg !== '');
  }
}

function toggleSexFields() {
  const female = val('sex') === 'female';
  for (const el of Array.from(document.querySelectorAll<HTMLElement>('[data-only="female"]'))) {
    el.classList.toggle('hidden-sex', !female);
    el.hidden = !female;
  }
}

// ─────────────────────────────────────────────────────────────── Ergebnis

function update() {
  toggleSexFields();
  const { inputs, complete } = readInputs();

  if (checked('remember')) store.set(FORM_KEY, snapshot());

  if (!complete) {
    // Fehler nur für bereits ausgefüllte, ungültige Felder anzeigen
    const probe = calculate({ sex: 'male', age: 30, heightCm: 175, weightKg: 75, ...stripUndefined(inputs) } as Inputs, { suggestions: false });
    showErrors(probe.ok ? [] : probe.errors, true);
    renderEmpty();
    return;
  }

  const result = calculate(inputs as Inputs);
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

function stripUndefined<T extends object>(o: T): Partial<T> {
  return Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined)) as Partial<T>;
}

function renderEmpty() {
  lastResult = undefined;
  $('#result-empty').hidden = false;
  $('#result-full').hidden = true;
  $('#explain-empty').hidden = false;
  $('#explain-body').hidden = true;
  $('#mini-result').hidden = true;
  for (const el of Array.from(document.querySelectorAll<HTMLElement>('[data-gain]'))) el.textContent = '';
  renderTrackerStatus(log.length ? adaptiveTdee(log) : undefined, undefined);
}

function animateValue(el: HTMLElement, to: number) {
  const from = shownValue || to * 0.92;
  shownValue = to;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.textContent = int(to);
    return;
  }
  const t0 = performance.now();
  const dur = 450;
  const tick = (t: number) => {
    const k = Math.min(1, (t - t0) / dur);
    const e = 1 - Math.pow(1 - k, 3);
    el.textContent = int(from + (to - from) * e);
    if (k < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function renderResult(r: CalcResult) {
  $('#result-empty').hidden = true;
  $('#result-full').hidden = false;
  const { value, range } = r.bmr;
  animateValue($('#r-value'), value);
  $('#r-range').textContent = `± ${int(range)} kcal · wahrscheinlich ${int(value - range)} – ${int(value + range)} kcal`;

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
  $('#m-min').textContent = int(lo);
  $('#m-max').textContent = int(hi);

  $('#r-narrow').innerHTML =
    showGhost && Math.round(basis.range) !== Math.round(range)
      ? `Nur mit Basisdaten: ± ${int(basis.range)} kcal (gestrichelt) → mit deinen Angaben: <strong>± ${int(range)} kcal</strong>`
      : 'Mit jeder weiteren Angabe wird der Bereich schmaler.';

  $('#r-precision-label').textContent = `${r.precisionLabel} · ±${dec1((range / value) * 100)} %`;
  $('#r-precision-bar').style.width = `${Math.max(4, r.precisionScore)}%`;

  $('#r-stages').innerHTML = r.stages.map((s) => `<li class="stage-chip${s.done ? ' done' : ''}">${esc(s.label)}</li>`).join('');
  $('#r-method').textContent = r.method;

  const t = r.tdee;
  const tdeeEl = $('#r-tdee');
  tdeeEl.hidden = !t;
  if (t) {
    $('#t-value').textContent = int(t.value);
    let detail = `± ${int(t.range)} kcal · `;
    if (t.source === 'pal') detail += `Grundumsatz × PAL ${dec2(t.pal!)}`;
    else if (t.source === 'combined') detail += `Formel (${int(t.formula!.value)}) und gemessener Verbrauch (${int(t.adaptive!.value)}) kombiniert`;
    else detail += 'gemessen aus deinem Verlauf';
    if (t.extraKcal) detail += ` · inkl. +${int(t.extraKcal)} kcal Stillzeit`;
    if (t.impliedPal) detail += ` · dein tatsächlicher PAL: ${dec2(t.impliedPal)}`;
    $('#t-detail').textContent = detail;
  }

  // Gewinn-Anzeigen an den optionalen Abschnitten
  for (const el of Array.from(document.querySelectorAll<HTMLElement>('[data-gain]'))) {
    const s = r.suggestions.find((x) => x.id === el.dataset.gain);
    el.textContent = s?.expectedRange ? `± ${int(range)} → ± ${int(s.expectedRange)} kcal` : s?.id === 'activity' ? '+ Gesamtumsatz' : '';
  }
  for (const el of Array.from(document.querySelectorAll<HTMLElement>('[data-done]'))) {
    el.classList.toggle('on', r.stages.find((s) => s.id === el.dataset.done)?.done ?? false);
  }

  $('#mini-result').hidden = false;
  $('#mini-value').textContent = `${int(value)} kcal`;
  $('#mini-range').textContent = `± ${int(range)}`;
}

function renderExplanation(r: CalcResult) {
  $('#explain-empty').hidden = true;
  $('#explain-body').hidden = false;

  $('#x-steps').innerHTML = r.steps
    .map((s, i) => {
      const e = s.estimate;
      let deltas = '';
      if (i > 0) {
        const dv = Math.round(s.deltaValue);
        const dr = Math.round(s.deltaRange);
        deltas = `<div class="deltas"><span class="delta">${dv === 0 ? 'Wert unverändert' : `${signed(dv)} kcal`}</span>` +
          `<span class="delta ${dr < 0 ? 'good' : dr > 0 ? 'bad' : ''}">${dr === 0 ? 'Spanne unverändert' : `Spanne ${signed(dr)} kcal${dr < 0 ? ' genauer' : ' unsicherer'}`}</span></div>`;
      }
      const breakdown =
        s.id === 'basis'
          ? `<table class="breakdown"><tbody>${r.mifflinBreakdown
              .map((b) => `<tr><td>${esc(b.label)}</td><td>${signed(b.kcal)} kcal</td></tr>`)
              .join('')}<tr class="sum"><td>= Mifflin-St Jeor</td><td>${int(r.formulas[0]!.kcal)} kcal</td></tr></tbody></table>`
          : '';
      return `<li class="step"><div class="step-head"><span class="step-title">${esc(s.title)}</span><span class="step-val">${int(e.value)} ± ${int(e.range)} kcal</span></div><p>${esc(s.detail)}</p>${breakdown}${deltas}</li>`;
    })
    .join('');

  const sug = r.suggestions;
  $('#x-suggest').innerHTML = sug.length
    ? sug
        .map(
          (s) =>
            `<li><strong>${esc(s.title)}</strong><p>${esc(s.text)}</p>${
              s.expectedRange ? `<span class="gainline">± ${int(r.bmr.range)} → ca. ± ${int(s.expectedRange)} kcal</span>` : ''
            }</li>`,
        )
        .join('')
    : '<li><p>Mehr Genauigkeit ist mit Formeln kaum möglich. Genauer geht es nur noch mit einer Messung per indirekter Kalorimetrie (z. B. in der Sportmedizin).</p></li>';

  const hintsCard = $('#x-hints-card');
  hintsCard.hidden = r.hints.length === 0;
  $('#x-hints').innerHTML = r.hints.map((h) => `<p class="note${h.level === 'warn' ? ' warn' : ''}">${esc(h.text)}</p>`).join('');

  const bc = r.bodyComposition;
  $('#x-body-card').hidden = !bc;
  if (bc) {
    const ffmShare = (bc.ffmKg / (bc.ffmKg + bc.fatKg)) * 100;
    $('#x-body').innerHTML =
      `<div class="comp-bar" role="img" aria-label="Fettfreie Masse ${dec1(bc.ffmKg)} kg, Fettmasse ${dec1(bc.fatKg)} kg"><span class="ffm" style="width:${ffmShare}%"></span><span class="fat" style="width:${100 - ffmShare}%"></span></div>` +
      `<div class="comp-legend"><span><strong>${dec1(bc.ffmKg)} kg</strong> fettfreie Masse</span><span><strong>${dec1(bc.fatKg)} kg</strong> Fett (${dec1(bc.percent)} % ± ${dec1(bc.range)})</span></div>` +
      `<ul class="comp-list">${bc.measurements.map((m) => `<li>${esc(m.label)}: ${dec1(m.percent)} % (± ${dec1(m.range)} %-Pkt.)</li>`).join('')}</ul>`;
  }

  $('#x-formulas').innerHTML = r.formulas
    .map(
      (f) =>
        `<tr><td><strong>${esc(f.name)}</strong><span class="fnote">${esc(f.note)}</span></td><td class="r num">${int(f.kcal)} kcal</td>` +
        `<td><span class="wbar"><span class="track"><span class="fill" style="width:${f.weight * 100}%"></span></span><small>${Math.round(f.weight * 100)} %</small></span></td></tr>`,
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

function upsert(entry: LogEntry, merge: boolean) {
  const i = log.findIndex((e) => e.date === entry.date);
  if (i >= 0) {
    const prev = log[i]!;
    log[i] = merge
      ? { date: entry.date, weightKg: entry.weightKg ?? prev.weightKg, kcal: entry.kcal ?? prev.kcal }
      : entry;
  } else {
    log.push(entry);
  }
  log = sortLog(log);
}

function renderLogTable() {
  $('#log-count').textContent = `${log.length} ${log.length === 1 ? 'Eintrag' : 'Einträge'} anzeigen`;
  $('#log-rows').innerHTML = [...log]
    .reverse()
    .map(
      (e) =>
        `<tr><td class="num">${formatDate(e.date, true)}</td><td class="num">${typeof e.weightKg === 'number' ? `${dec1(e.weightKg)} kg` : '–'}</td>` +
        `<td class="num">${typeof e.kcal === 'number' ? int(e.kcal) : '–'}</td><td><button class="row-del" type="button" data-del="${e.date}" aria-label="Eintrag vom ${formatDate(e.date, true)} löschen">×</button></td></tr>`,
    )
    .join('');
}

function renderTrackerStatus(adaptive: AdaptiveResult | undefined, r: CalcResult | undefined) {
  $('#log-chart').innerHTML = renderChart(log, adaptive);
  const status = $('#adaptive-status');
  const teaser = $('#adaptive-teaser');
  if (!adaptive) {
    status.innerHTML = '';
    return;
  }
  if (adaptive.status === 'insufficient') {
    const progress = Math.min(1, Math.min(adaptive.days / 14, adaptive.weightDays / 7, adaptive.kcalDays / 10));
    status.innerHTML =
      `<strong>Noch nicht genug Daten</strong><div class="progress"><span style="width:${progress * 100}%"></span></div>` +
      `<ul>${adaptive.reasons.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`;
    teaser.textContent = `Dein Tagebuch: ${adaptive.days} von mind. 14 Tagen. Zum Tagebuch ↓`;
    return;
  }
  const a = adaptive;
  let pal = '';
  if (r?.tdee?.impliedPal) pal = `<p>Bei deinem Grundumsatz von ${int(r.bmr.value)} kcal entspricht das einem Aktivitätsfaktor (PAL) von <strong>${dec2(r.tdee.impliedPal)}</strong>.</p>`;
  status.innerHTML =
    `<div class="measured"><span class="small muted">Gemessener Gesamtumsatz</span><div class="val">${int(a.tdee)} ± ${int(a.range)} kcal</div>` +
    `<p>Ø gegessen ${int(a.avgIntake)} kcal · Gewichtstrend ${signed(a.slopeKgPerWeek, dec2)} kg/Woche · ${a.days} Tage (${formatDate(a.fromDate)}–${formatDate(a.toDate)}), ${a.weightDays} Wägungen, ${a.kcalDays} Tage mit Kalorien</p>${pal}</div>` +
    (a.warnings.length ? `<ul>${a.warnings.map((w) => `<li>${esc(w)}</li>`).join('')}</ul>` : '');
  teaser.textContent = `Gemessener Verbrauch: ${int(a.tdee)} ± ${int(a.range)} kcal/Tag. Zum Tagebuch ↓`;
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
  return ['datum;gewicht_kg;kcal', ...log.map((e) => `${e.date};${e.weightKg != null ? String(e.weightKg).replace('.', ',') : ''};${e.kcal ?? ''}`)].join('\n');
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
    else if ((m = rawDate.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/))) date = `${m[3]}-${m[2]!.padStart(2, '0')}-${m[1]!.padStart(2, '0')}`;
    if (!date) continue;
    const w = parseNum(cells[1]);
    const k = parseNum(cells[2]);
    out.push({ date, weightKg: w !== undefined && !Number.isNaN(w) ? w : null, kcal: k !== undefined && !Number.isNaN(k) ? Math.round(k) : null });
  }
  return out;
}

function download(name: string, content: string) {
  const url = URL.createObjectURL(new Blob([content], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ─────────────────────────────────────────────────────────────── Verdrahtung

function init() {
  const remember = store.get<boolean>(REMEMBER_KEY);
  const saved = store.get<FormState>(FORM_KEY);
  if (saved && remember !== false) restore(saved);
  (field('remember') as HTMLInputElement).checked = remember !== false;

  form.addEventListener('input', update);
  form.addEventListener('change', (e) => {
    const t = e.target as HTMLInputElement;
    if (t.name === 'remember') {
      store.set(REMEMBER_KEY, t.checked);
      if (!t.checked) store.remove(FORM_KEY);
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

  // Offene Abschnitte, wenn dort schon Werte stehen
  for (const d of Array.from(form.querySelectorAll<HTMLDetailsElement>('details.group'))) {
    const hasValue = Array.from(d.querySelectorAll<HTMLInputElement | HTMLSelectElement>('input, select')).some((el) =>
      el instanceof HTMLInputElement && (el.type === 'checkbox' || el.type === 'radio') ? el.checked && el.value !== '' : el.value !== '' && el.tagName === 'INPUT',
    );
    if (hasValue) d.open = true;
  }

  (logForm.elements.namedItem('date') as HTMLInputElement).value = todayIso();
  (logForm.elements.namedItem('date') as HTMLInputElement).max = todayIso();
  logForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const err = $('#log-error');
    const date = (logForm.elements.namedItem('date') as HTMLInputElement).value;
    const w = parseNum((logForm.elements.namedItem('weight') as HTMLInputElement).value);
    const k = parseNum((logForm.elements.namedItem('kcal') as HTMLInputElement).value);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return void (err.textContent = 'Bitte ein Datum wählen.');
    if (w === undefined && k === undefined) return void (err.textContent = 'Bitte Gewicht und/oder Kalorien eintragen.');
    if (w !== undefined && !(w >= 25 && w <= 350)) return void (err.textContent = 'Gewicht bitte zwischen 25 und 350 kg.');
    if (k !== undefined && !(k >= 300 && k <= 10000)) return void (err.textContent = 'Kalorien bitte zwischen 300 und 10.000.');
    err.textContent = '';
    upsert({ date, weightKg: w ?? null, kcal: k !== undefined ? Math.round(k) : null }, true);
    (logForm.elements.namedItem('weight') as HTMLInputElement).value = '';
    (logForm.elements.namedItem('kcal') as HTMLInputElement).value = '';
    // Nächster Tag vorschlagen, wenn ein vergangener Tag nachgetragen wurde
    if (date < todayIso()) (logForm.elements.namedItem('date') as HTMLInputElement).value = isoFromDay(dayNumber(date) + 1);
    saveLog();
  });

  $('#log-rows').addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-del]');
    if (!btn) return;
    log = log.filter((x) => x.date !== btn.dataset.del);
    saveLog();
  });

  $('#log-demo').addEventListener('click', () => {
    if (log.length && !confirm('Vorhandenen Verlauf durch Beispieldaten ersetzen?')) return;
    log = sortLog(demoLog());
    saveLog();
  });
  $('#log-export').addEventListener('click', () => download(`grundumsatz-verlauf-${todayIso()}.csv`, toCsv()));
  $('#log-import').addEventListener('change', async (e) => {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const entries = parseCsv(await file.text());
    input.value = '';
    if (!entries.length) return void ($('#log-error').textContent = 'In der Datei wurden keine gültigen Zeilen gefunden (Format: Datum;Gewicht;kcal).');
    for (const en of entries) upsert(en, true);
    $('#log-error').textContent = '';
    saveLog();
  });
  $('#log-clear').addEventListener('click', () => {
    if (!log.length || !confirm('Gesamten Verlauf auf diesem Gerät löschen?')) return;
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
