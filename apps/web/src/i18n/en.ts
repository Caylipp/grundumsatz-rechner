import type { UI } from './types';

export const en: UI = {
  meta: {
    title: 'BMR Calculator – the more you enter, the more accurate | Basal Metabolic Rate',
    description:
      'Free BMR calculator with a confidence range: Mifflin-St Jeor, Katch-McArdle, Navy method, calipers (3/7 skinfolds), measured RMR and your real expenditure from tracking. No tracking cookies.',
    ogLocale: 'en_US',
    langName: 'English',
  },
  nav: { calculator: 'Calculator', method: 'How we calculate', skip: 'Skip to content', language: 'Language' },
  footer: {
    disclaimerStrong: 'Not medical advice.',
    disclaimer:
      'Results are estimates based on scientific equations and do not replace advice from a doctor or dietitian. If you have a medical condition, are pregnant or have an eating disorder, please seek professional advice.',
    privacy: 'Privacy: all inputs are processed and stored only locally in your browser. No accounts, no cookies, no tracking.',
    method: 'Methods & sources',
    privacyLink: 'Privacy policy',
    imprint: 'Legal notice',
    legalGerman: '(in German)',
  },
  hero: {
    h1: 'Calculate your BMR',
    leadHtml:
      'Most calculators use a single equation and show a seemingly exact number. Here you see <strong>how accurate</strong> your result is – and every extra input makes the range narrower.',
  },
  form: {
    required: 'Required',
    optionalHtml: 'Everything else is <strong>optional</strong> – every input makes the result more accurate.',
    noAnswer: 'Not specified',
    basics: {
      title: 'Basics',
      sex: 'Sex',
      female: 'Female',
      male: 'Male',
      sexHint: 'Biological sex – it affects muscle and fat share and therefore the equations.',
      age: 'Age',
      years: 'years',
      height: 'Height',
      weight: 'Weight',
    },
    bodyfat: {
      title: 'Body fat percentage',
      intro:
        'Do you know your body fat percentage? Then the calculation uses your fat-free mass (Katch-McArdle or Cunningham). How accurate this is depends heavily on the measuring method.',
      percent: 'Body fat',
      source: 'Measured with',
      readings: 'Number of readings',
      readingsHint: 'Scales fluctuate from day to day. Measure e.g. 7 mornings on an empty stomach and enter the average – that makes the value more accurate.',
      pp: 'pp',
    },
    circ: {
      title: 'Body circumferences',
      introHtml:
        'With a tape measure, three equations estimate your body fat: the <strong>Navy method</strong> (waist, neck, plus hip for women), <strong>YMCA</strong> and <strong>Relative Fat Mass</strong> (both waist only). Even the waist alone helps.',
      waist: 'Waist',
      neck: 'Neck',
      hip: 'Hip',
      howto: 'How to measure',
      howtoWaistHtml: '<strong>Waist:</strong> horizontally at navel height, breathe out relaxed, do not pull in.',
      howtoNeckHtml: '<strong>Neck:</strong> just below the larynx, tape slightly angled downward to the front.',
      howtoHipHtml: '<strong>Hip:</strong> at the widest part of the buttocks.',
      howtoGeneral: 'Measure in the morning, tape snug but not tight. Measure twice and average.',
    },
    caliper: {
      title: 'Skinfolds (caliper)',
      introHtml:
        'A caliper (a cheap skinfold pincer) measures the thickness of the fat under your skin. <strong>3 sites</strong> are enough for the Jackson-Pollock 3-site method; <strong>7 sites</strong> are even more accurate. With biceps, triceps, subscapular and suprailiac, Durnin-Womersley is calculated as well.',
      measurer: 'Measured by',
      self: 'Myself (a bit less accurate)',
      trained: 'A trained person (coach, doctor)',
      tag3: '3',
      tag7: '7',
      tag4: '4',
      status3: (n) => `3-site method: ${n} more ${n === 1 ? 'site' : 'sites'}`,
      status7: (n) => `7-site method: ${n} more ${n === 1 ? 'site' : 'sites'}`,
      done3: '3-site method active',
      done7: '7-site method active – maximum caliper accuracy',
      howto: 'How to measure skinfolds',
      howtoGeneral:
        'Always the right side of the body, muscles relaxed. Firmly lift the skinfold with thumb and index finger, place the caliper 1 cm next to it and read after 2 seconds. Measure each site 2–3 times and average.',
      sites: {
        chest: { label: 'Chest', howto: 'Diagonal, halfway between armpit fold and nipple (women: one third).' },
        abdomen: { label: 'Abdomen', howto: 'Vertical, 2 cm to the right of the navel.' },
        thigh: { label: 'Thigh', howto: 'Vertical, front, midway between groin and kneecap.' },
        triceps: { label: 'Triceps', howto: 'Vertical, back of the upper arm, midway between shoulder and elbow.' },
        suprailiac: { label: 'Suprailiac', howto: 'Diagonal, just above the hip bone, front armpit line.' },
        subscapular: { label: 'Subscapular', howto: 'Diagonal (45°), 2 cm below the tip of the shoulder blade.' },
        midaxillary: { label: 'Midaxillary', howto: 'Vertical, mid-armpit line at the level of the lower end of the sternum.' },
        biceps: { label: 'Biceps', howto: 'Vertical, front of the upper arm, at the level of the triceps site.' },
      },
    },
    factors: {
      title: 'Other factors',
      athleteHtml: '<strong>High muscle mass</strong> – regular strength training or competitive sport for more than a year',
      thyroid: 'Thyroid',
      thyroidOptions: {
        normal: 'Healthy',
        hypo_treated: 'Underactive, treated',
        hypo_untreated: 'Underactive, untreated',
        hyper_treated: 'Overactive, treated',
        hyper_untreated: 'Overactive, untreated',
      },
      pregnancy: 'Pregnancy / breastfeeding',
      pregnancyOptions: { none: 'No', t1: 'Pregnant, 1st trimester', t2: 'Pregnant, 2nd trimester', t3: 'Pregnant, 3rd trimester', breastfeeding: 'Breastfeeding' },
      sleep: 'Sleep per night (avg.)',
      hours: 'h',
      climate: 'Environment',
      climateOptions: { moderate: 'Moderate', cold: 'Often cold (cool home, lots of time outdoors)', hot: 'Constantly hot' },
      dietHtml: '<strong>Prolonged diet:</strong> in a calorie deficit for about 3 months or longer, or major weight loss',
      smokerHtml: '<strong>Smoking</strong> (regularly)',
    },
    measured: {
      title: 'Measured resting metabolic rate',
      introHtml:
        'The most accurate way: a device measures how much oxygen you breathe in and CO₂ you breathe out (<strong>indirect calorimetry</strong>). This gives your actual resting expenditure – no equation needed.',
      kcal: 'Measured RMR',
      method: 'Measured with',
      conditionsTitle: 'For a valid measurement',
      conditions: ['In the morning, at least 8 hours fasted', 'No exercise the day before, no caffeine or nicotine before the test', 'Lie still for 20–30 minutes, then measure for 10–15 minutes', 'Average several measurements on different days'],
      whereTitle: 'Where and how?',
      where: [
        'Lab: sports medicine, nutrition clinics, university hospitals and some gyms (resting metabolic test), usually $50–150.',
        'At home: handheld breath analyzers (e.g. Breezing) measure RMR with a mouthpiece. Cheap breath trackers that only show a "metabolic mode" do not give a kcal value.',
      ],
    },
    activity: { title: 'Daily life & exercise', arrow: '→ total expenditure', intro: 'BMR applies to complete rest. Your activity level (PAL) turns it into total daily energy expenditure.', none: 'Not specified', sport: 'Additional exercise' },
    adaptive: {
      title: 'Tracking: measure your real expenditure',
      badge: 'Gold standard',
      teaser: 'Log weight and calories for 2–4 weeks – your actual expenditure is calculated from that. Go to the log ↓',
    },
    remember: 'Remember inputs on this device',
    reset: 'Reset inputs',
  },
  result: {
    eyebrow: 'Your BMR',
    emptyValue: '– kcal',
    empty: 'Enter sex, age, height and weight – the result appears instantly.',
    perDay: 'kcal/day',
    range: (r, lo, hi) => `± ${r} kcal · likely ${lo} – ${hi} kcal`,
    narrowedHtml: (b, n) => `Basics only: ± ${b} kcal (dashed) → with your inputs: <strong>± ${n} kcal</strong>`,
    narrowDefault: 'Every additional input narrows the range.',
    precision: 'Accuracy',
    method: 'Calculated with',
    tdee: 'Total daily expenditure',
    how: 'How is this calculated? ↓',
    tdeePal: (p) => `BMR × PAL ${p}`,
    tdeeCombined: (f, m) => `equation (${f}) and measured expenditure (${m}) combined`,
    tdeeMeasured: 'measured from your log',
    tdeeExtra: (k) => `incl. +${k} kcal breastfeeding`,
    impliedPal: (p) => `your actual PAL: ${p}`,
  },
  explain: {
    h2: 'How your result is calculated',
    empty: 'As soon as you enter the basics, the calculation appears here step by step.',
    steps: 'Calculation',
    suggest: 'Get more accurate',
    hints: 'Notes',
    body: 'Body composition',
    formulas: 'All equations compared',
    formulasIntro: 'Different equations give different values for the same person. Instead of picking one, we weight the suitable ones by their accuracy.',
    thFormula: 'Equation',
    thResult: 'Result',
    thShare: 'Share of result',
    allFormulas: 'All equations, assumptions and sources →',
    sumMifflin: '= Mifflin-St Jeor',
    unchanged: 'Value unchanged',
    rangeUnchanged: 'Range unchanged',
    rangeBetter: (d) => `Range ${d} kcal more precise`,
    rangeWorse: (d) => `Range ${d} kcal less certain`,
    gain: (a, b) => `± ${a} → approx. ± ${b} kcal`,
    noMore: 'You have used every option. Only repeated measurements can make it more accurate.',
    ffm: 'fat-free mass',
    fat: 'fat',
    pp: 'pp',
  },
  tracker: {
    h2: 'Tracking: measure your real expenditure',
    leadHtml:
      'Equations estimate – your body measures. If you log your weight (ideally every morning) and the calories you eat for 2–4 weeks, your <strong>actual total expenditure</strong> can be calculated: losing half a kilo per week on 2,200 kcal a day means you burn about 2,750 kcal.',
    add: 'Add entry',
    date: 'Date',
    weight: 'Weight (kg)',
    kcal: 'Eaten (kcal)',
    save: 'Save',
    hint: 'Leaving one value empty is fine – e.g. enter only your weight. Another entry on the same day overwrites the old one.',
    demo: 'Load sample data',
    exportCsv: 'Export CSV',
    importCsv: 'Import CSV',
    clear: 'Delete log',
    chart: 'Weight trend',
    noWeights: 'No weight entries yet.',
    entries: (n) => `Show ${n} ${n === 1 ? 'entry' : 'entries'}`,
    thDate: 'Date',
    thWeight: 'Weight',
    thKcal: 'kcal',
    action: 'Action',
    deleteAria: (d) => `Delete entry from ${d}`,
    notEnough: 'Not enough data yet',
    measured: 'Measured total expenditure',
    measuredDetail: (p) =>
      `Avg. intake ${p.intake} kcal · weight trend ${p.slope} kg/week · ${p.days} days (${p.from}–${p.to}), ${p.weights} weigh-ins, ${p.kcalDays} days with calories`,
    palHtml: (b, p) => `With your BMR of ${b} kcal, this corresponds to an activity factor (PAL) of <strong>${p}</strong>.`,
    teaserProgress: (d) => `Your log: ${d} of at least 14 days. Go to the log ↓`,
    teaserMeasured: (v) => `Measured expenditure: ${v} kcal/day. Go to the log ↓`,
    errDate: 'Please choose a date.',
    errEmpty: 'Please enter weight and/or calories.',
    errWeight: 'Weight must be between 25 and 350 kg.',
    errKcal: 'Calories must be between 300 and 10,000.',
    errImport: 'No valid rows found in the file (format: date;weight;kcal).',
    confirmDemo: 'Replace the existing log with sample data?',
    confirmClear: 'Delete the entire log on this device?',
    legendWeight: 'Weight',
    legendTrend: 'Trend (smoothed)',
    legendReg: 'Regression line',
    legendKcal: 'Calories',
    csvHeader: 'date;weight_kg;kcal',
    chartAria: 'Weight history',
  },
  faqTitle: 'Frequently asked questions about BMR',
  faqMore: 'In detail: all equations, assumptions and sources →',
  faq: [
    {
      q: 'What is basal metabolic rate (BMR)?',
      a: 'BMR is the amount of energy your body uses per day at complete rest – for breathing, heartbeat, brain, organs and body temperature. For most people it makes up 60–70% of total daily expenditure.',
    },
    {
      q: 'What is the difference between BMR and TDEE?',
      a: 'Total daily energy expenditure (TDEE) also includes all movement, exercise and digestion. It is estimated as BMR times an activity factor (PAL) – about 1.4–1.5 for office work. Even more accurate is calculating it from your weight trend and calorie intake.',
    },
    {
      q: 'Why is the result a range and not a single number?',
      a: 'Every equation is an average over many people. Two people with the same age, weight and height can differ by several hundred calories, for example because one has more muscle. The range contains the true value with about 80% probability. The more you enter, the narrower it gets.',
    },
    {
      q: 'How can I determine my BMR more accurately at home?',
      a: 'With a tape measure (waist, neck, hip), a caliper for skinfolds (3 or better 7 sites), a body fat scale averaged over several days, and a log of weight and calories. Most accurate is a direct measurement by indirect calorimetry – in a lab or with a handheld breath analyzer.',
    },
    {
      q: 'Which equation is the most accurate?',
      a: 'Without body composition data, Mifflin-St Jeor is considered the most reliable standard equation. If you know your body fat, equations based on fat-free mass (Katch-McArdle, Cunningham) are usually more accurate. This calculator combines the suitable equations automatically, weighted by accuracy.',
    },
    {
      q: 'Should I eat less than my BMR?',
      a: 'Not long-term without professional guidance. For healthy weight loss, aim for about 300–500 kcal below your total expenditure. Very low calorie intake can lead to muscle loss and nutrient deficiencies.',
    },
    {
      q: 'Is my data stored?',
      a: 'Only locally in your browser, if you want. No data is sent to a server, there are no cookies and no tracking. "Reset inputs" and "Delete log" remove everything.',
    },
  ],
  methodik: {
    title: 'Methods: how we calculate your BMR | BMR Calculator',
    description: 'Equations (Mifflin-St Jeor, Katch-McArdle, Cunningham, Navy, YMCA, RFM, Jackson-Pollock, Durnin-Womersley), confidence ranges, adjustments and adaptive expenditure – explained transparently with sources.',
    h1: 'How we calculate',
    lead: 'No calculator knows your BMR exactly – only a measurement (indirect calorimetry) comes close. We make the most of your inputs and tell you honestly how certain the result is.',
    toc: 'Contents',
    thMethod: 'Method',
    thUncertainty: 'Uncertainty',
    pp: 'percentage points',
    thActivity: 'Daily life',
    sections: [
      {
        id: 'cascade',
        h2: 'The equation cascade',
        html: `<p>Depending on your inputs, the calculator uses the suitable methods and combines them:</p><ol>
<li><strong>Basics</strong> → Mifflin-St Jeor, about ± 10%.</li>
<li><strong>Body fat percentage</strong> (DEXA, scale, …) → fat-free mass → Katch-McArdle or Cunningham.</li>
<li><strong>Circumferences</strong> → Navy method, YMCA formula, Relative Fat Mass.</li>
<li><strong>Skinfolds</strong> → Jackson-Pollock 3- or 7-site, Durnin-Womersley.</li>
<li><strong>Other factors</strong> → adjustments with extra uncertainty.</li>
<li><strong>Measured RMR</strong> → indirect calorimetry, more accurate than any equation.</li>
<li><strong>Tracking</strong> → actual total expenditure from weight and calories.</li></ol>`,
      },
      {
        id: 'basis',
        h2: 'Mifflin-St Jeor',
        html: `<p>The Mifflin-St Jeor equation (1990) is considered the most reliable standard equation for healthy adults in systematic reviews:</p>
<code class="formula">Men: 10 × weight [kg] + 6.25 × height [cm] − 5 × age + 5</code>
<code class="formula">Women: 10 × weight [kg] + 6.25 × height [cm] − 5 × age − 161</code>
<p>It is within ± 10% for about 80% of normal-weight people (Frankenfield 2005). For marked over- or underweight and from age 65 we assume ± 11.5 to ± 15%. Harris-Benedict is shown for comparison only.</p>`,
      },
      {
        id: 'ffm',
        h2: 'Fat-free mass',
        html: `<p>Muscles and organs burn many times more energy at rest than fat tissue. Equations based on fat-free mass (FFM) capture this:</p>
<code class="formula">FFM = weight × (1 − body fat % / 100)</code>
<code class="formula">Katch-McArdle: 370 + 21.6 × FFM</code>
<code class="formula">Cunningham: 500 + 22 × FFM  (with high muscle mass)</code>
<p>Accuracy depends mainly on the body fat value. Typical uncertainties (± percentage points, about 80%):</p>{{bodyfatTable}}
<p>Body fat scales have a systematic error (hydration, electrode position) and a random one that varies from day to day. Averaging several readings only shrinks the random part. Self-measured skinfolds get ± 2.5 percentage points of extra error.</p>`,
      },
      {
        id: 'circumferences',
        h2: 'Circumferences: Navy, YMCA, Relative Fat Mass',
        html: `<code class="formula">Navy men: 495 / (1.0324 − 0.19077 × log₁₀(waist − neck) + 0.15456 × log₁₀(height)) − 450</code>
<code class="formula">Navy women: 495 / (1.29579 − 0.35004 × log₁₀(waist + hip − neck) + 0.221 × log₁₀(height)) − 450</code>
<code class="formula">YMCA: (−98.42 or −76.76 + 4.15 × waist [in] − 0.082 × weight [lb]) / weight [lb] × 100</code>
<code class="formula">RFM: 64 (men) or 76 (women) − 20 × height / waist</code>
<p>All three rely on waist circumference and therefore often err in the same direction. We combine them as a group: together at most 10% more precise than the best single method.</p>`,
      },
      {
        id: 'caliper',
        h2: 'Skinfolds: Jackson-Pollock and Durnin-Womersley',
        html: `<p>Body density is calculated from the sum of skinfolds (mm) and converted to body fat with the Siri equation:</p>
<code class="formula">Body fat % = 495 / density − 450</code>
<ul><li><strong>3-site</strong> (Jackson &amp; Pollock 1978/1980): men chest, abdomen, thigh; women triceps, suprailiac, thigh.</li>
<li><strong>7-site</strong>: chest, midaxillary, triceps, subscapular, abdomen, suprailiac, thigh. Errors of individual folds average out.</li>
<li><strong>4-site</strong> (Durnin &amp; Womersley 1974): biceps, triceps, subscapular, suprailiac with age-dependent coefficients.</li></ul>
<p>With all 7 sites, the 7-site equation replaces the 3-site one. Like circumferences, caliper values are combined as their own group.</p>`,
      },
      {
        id: 'combination',
        h2: 'Combining instead of choosing',
        html: `<p>Body fat values from different method groups (direct measurement, circumferences, skinfolds) have independent errors and are averaged by inverse variance. Then we combine Mifflin-St Jeor and the FFM equation into a weighted average. Because both partly use the same inputs, we assume an error correlation of 0.5 – this prevents the result from looking more precise than it is.</p>`,
      },
      {
        id: 'factors',
        h2: 'Other factors',
        html: `<p>These conditions change BMR but can only be quantified roughly. We apply them cautiously and widen the range.</p>
<div class="table-scroll"><table><thead><tr><th>Factor</th><th>Adjustment</th><th>Extra uncertainty</th></tr></thead><tbody>
<tr><td>Hypothyroidism, untreated</td><td>−10%</td><td>± 7%</td></tr>
<tr><td>Hyperthyroidism, untreated</td><td>+15%</td><td>± 12%</td></tr>
<tr><td>Thyroid, treated</td><td>0%</td><td>± 3%</td></tr>
<tr><td>Pregnancy 1st / 2nd / 3rd trimester</td><td>0 / +5 / +10%</td><td>± 3 / 4 / 5%</td></tr>
<tr><td>Breastfeeding</td><td>+500 kcal in total expenditure</td><td>–</td></tr>
<tr><td>Less than 6 hours of sleep</td><td>−3%</td><td>± 2%</td></tr>
<tr><td>Cold environment / hot climate</td><td>+3% / +2%</td><td>± 2%</td></tr>
<tr><td>Prolonged diet</td><td>−5%</td><td>± 3%</td></tr>
<tr><td>Smoking</td><td>+4%</td><td>± 3%</td></tr></tbody></table></div>`,
      },
      {
        id: 'measurement',
        h2: 'Measured resting metabolic rate',
        html: `<p>Indirect calorimetry calculates energy expenditure from oxygen uptake and CO₂ output (Weir equation). We assume ± 6% for a lab measurement and ± 10% for a handheld device. The measurement is combined with the equation estimate by accuracy – a good lab measurement determines the result almost on its own. If it deviates by more than 15% from the equation, we point out the measuring conditions.</p>`,
      },
      {
        id: 'pal',
        h2: 'Total expenditure (PAL)',
        html: `<p>Total expenditure = BMR × physical activity level (PAL). Exercise adds +0.15 (2–3× per week) or +0.3 (4–5× per week), with an extra ± 12% uncertainty.</p>{{palTable}}`,
      },
      {
        id: 'adaptive',
        h2: 'Real expenditure from tracking',
        html: `<p>If you log weight and calories for at least 14 days (ideally 3–4 weeks):</p>
<code class="formula">Expenditure = avg. intake − weight trend [kg/day] × 7,700 kcal/kg</code>
<p>We determine the trend by linear regression over the last 28 days. The range accounts for scale noise, calorie counting errors (± 7%), missing days and the uncertainty of the 7,700 kcal rule during fast weight loss.</p>`,
      },
      {
        id: 'range',
        h2: 'What the range means',
        html: `<p>"1,780 ± 178 kcal" means: your true BMR lies between 1,602 and 1,958 kcal with about 80% probability. The uncertainties come from validation studies and are rounded – an honest order of magnitude, not exact statistics.</p>`,
      },
    ],
    sourcesTitle: 'Sources',
    disclaimer: 'This calculator does not replace medical advice. If you have a medical condition, are pregnant or breastfeeding, or have an eating disorder, please talk to a doctor or dietitian.',
  },
};
