import type { UI } from './types';

export const de: UI = {
  meta: {
    title: 'Grundumsatz berechnen – je mehr Angaben, desto genauer | Grundumsatz-Rechner',
    description:
      'Kostenloser Grundumsatz-Rechner mit Konfidenzbereich: Mifflin-St Jeor, Katch-McArdle, Navy-Methode, Caliper (3/7 Hautfalten), gemessener Ruheumsatz und echter Verbrauch aus deinem Verlauf. Ohne Tracking.',
    ogLocale: 'de_DE',
    langName: 'Deutsch',
  },
  nav: { calculator: 'Rechner', method: 'So rechnen wir', skip: 'Zum Inhalt springen', language: 'Sprache' },
  footer: {
    disclaimerStrong: 'Keine medizinische Beratung.',
    disclaimer:
      'Die Ergebnisse sind Schätzungen auf Basis wissenschaftlicher Formeln und ersetzen keine ärztliche oder ernährungstherapeutische Beratung. Bei Erkrankungen, in der Schwangerschaft und bei Essstörungen bitte fachlichen Rat einholen.',
    privacy: 'Datenschutz: Alle Eingaben werden ausschließlich lokal in deinem Browser verarbeitet und gespeichert. Keine Konten, keine Cookies, kein Tracking.',
    method: 'Methodik & Quellen',
    privacyLink: 'Datenschutz',
    imprint: 'Impressum',
    legalGerman: '',
  },
  hero: {
    h1: 'Grundumsatz berechnen',
    leadHtml:
      'Die meisten Rechner nutzen eine einzige Formel und zeigen eine scheinbar exakte Zahl. Hier siehst du, <strong>wie genau</strong> dein Ergebnis ist – und mit jeder zusätzlichen Angabe wird der Bereich schmaler.',
  },
  form: {
    required: 'Pflicht',
    optionalHtml: 'Alles Weitere ist <strong>optional</strong> – jede Angabe macht das Ergebnis genauer.',
    noAnswer: 'Keine Angabe',
    basics: {
      title: 'Basisdaten',
      sex: 'Geschlecht',
      female: 'Frau',
      male: 'Mann',
      sexHint: 'Biologisches Geschlecht – es beeinflusst Muskel- und Fettanteil und damit die Formeln.',
      age: 'Alter',
      years: 'Jahre',
      height: 'Größe',
      weight: 'Gewicht',
    },
    bodyfat: {
      title: 'Körperfettanteil',
      intro:
        'Kennst du deinen Körperfettanteil? Dann wird aus der fettfreien Masse gerechnet (Katch-McArdle bzw. Cunningham). Wie genau das ist, hängt stark von der Messmethode ab.',
      percent: 'Körperfett',
      source: 'Gemessen mit',
      readings: 'Anzahl Messungen',
      readingsHint: 'Waagen schwanken von Tag zu Tag. Miss z. B. 7 Tage morgens nüchtern und trage den Mittelwert ein – das macht den Wert genauer.',
      pp: '%-Pkt.',
    },
    circ: {
      title: 'Körperumfänge',
      introHtml:
        'Mit einem Maßband schätzen drei Formeln deinen Körperfettanteil: <strong>Navy-Methode</strong> (Taille, Hals, bei Frauen Hüfte), <strong>YMCA</strong> und <strong>Relative Fat Mass</strong> (beide nur Taille). Schon die Taille allein hilft.',
      waist: 'Taille',
      neck: 'Hals',
      hip: 'Hüfte',
      howto: 'So misst du richtig',
      howtoWaistHtml: '<strong>Taille:</strong> waagerecht auf Höhe des Bauchnabels, entspannt ausatmen, nicht einziehen.',
      howtoNeckHtml: '<strong>Hals:</strong> direkt unterhalb des Kehlkopfs, Maßband leicht nach vorne unten geneigt.',
      howtoHipHtml: '<strong>Hüfte:</strong> an der breitesten Stelle des Gesäßes.',
      howtoGeneral: 'Morgens messen, Maßband anliegend, aber ohne einzuschnüren. Zweimal messen und mitteln.',
    },
    caliper: {
      title: 'Hautfalten (Caliper)',
      introHtml:
        'Mit einem Caliper (Hautfaltenzange, wenige Euro) misst du die Dicke des Unterhautfetts. <strong>3 Messstellen</strong> reichen für die Jackson-Pollock-3-Punkt-Methode; mit <strong>7 Messstellen</strong> wird es noch genauer. Mit Bizeps, Trizeps, Schulterblatt und Hüftkamm rechnet zusätzlich Durnin-Womersley.',
      measurer: 'Gemessen von',
      self: 'Mir selbst (etwas ungenauer)',
      trained: 'Geübter Person (Trainer:in, Ärzt:in)',
      tag3: '3',
      tag7: '7',
      tag4: '4',
      status3: (n) => `3-Punkt-Methode: noch ${n} ${n === 1 ? 'Messstelle' : 'Messstellen'}`,
      status7: (n) => `7-Punkt-Methode: noch ${n} ${n === 1 ? 'Messstelle' : 'Messstellen'}`,
      done3: '3-Punkt-Methode aktiv',
      done7: '7-Punkt-Methode aktiv – maximale Caliper-Genauigkeit',
      howto: 'So misst du Hautfalten',
      howtoGeneral:
        'Immer rechte Körperseite, entspannte Muskulatur. Hautfalte mit Daumen und Zeigefinger fest abheben, Caliper 1 cm daneben ansetzen, nach 2 Sekunden ablesen. Jede Stelle 2–3× messen und mitteln.',
      sites: {
        chest: { label: 'Brust', howto: 'Diagonal, auf halber Strecke zwischen Achselfalte und Brustwarze (Frauen: ein Drittel).' },
        abdomen: { label: 'Bauch', howto: 'Senkrecht, 2 cm rechts neben dem Bauchnabel.' },
        thigh: { label: 'Oberschenkel', howto: 'Senkrecht, Vorderseite, Mitte zwischen Leiste und Kniescheibe.' },
        triceps: { label: 'Trizeps', howto: 'Senkrecht, Rückseite Oberarm, Mitte zwischen Schulter und Ellenbogen.' },
        suprailiac: { label: 'Hüftkamm', howto: 'Diagonal, direkt oberhalb des Beckenknochens, vordere Achsellinie.' },
        subscapular: { label: 'Schulterblatt', howto: 'Diagonal (45°), 2 cm unterhalb der Schulterblattspitze.' },
        midaxillary: { label: 'Achsel', howto: 'Senkrecht, mittlere Achsellinie auf Höhe des Brustbeinendes.' },
        biceps: { label: 'Bizeps', howto: 'Senkrecht, Vorderseite Oberarm, auf Höhe der Trizeps-Messstelle.' },
      },
    },
    factors: {
      title: 'Weitere Faktoren',
      athleteHtml: '<strong>Viel Muskelmasse</strong> – regelmäßiges Krafttraining oder Leistungssport seit über einem Jahr',
      thyroid: 'Schilddrüse',
      thyroidOptions: {
        normal: 'Gesund',
        hypo_treated: 'Unterfunktion, behandelt',
        hypo_untreated: 'Unterfunktion, unbehandelt',
        hyper_treated: 'Überfunktion, behandelt',
        hyper_untreated: 'Überfunktion, unbehandelt',
      },
      pregnancy: 'Schwangerschaft / Stillzeit',
      pregnancyOptions: { none: 'Nein', t1: 'Schwanger, 1. Trimester', t2: 'Schwanger, 2. Trimester', t3: 'Schwanger, 3. Trimester', breastfeeding: 'Stillzeit' },
      sleep: 'Schlaf pro Nacht (Ø)',
      hours: 'Std.',
      climate: 'Umgebung',
      climateOptions: { moderate: 'Gemäßigt', cold: 'Oft kalt (kühle Wohnung, viel draußen)', hot: 'Dauerhaft heiß' },
      dietHtml: '<strong>Längere Diät:</strong> seit ca. 3 Monaten oder länger im Kaloriendefizit bzw. deutlich abgenommen',
      smokerHtml: '<strong>Rauchen</strong> (regelmäßig)',
    },
    measured: {
      title: 'Ruheumsatz gemessen',
      introHtml:
        'Der genaueste Weg: Ein Gerät misst, wie viel Sauerstoff du einatmest und CO₂ du ausatmest (<strong>indirekte Kalorimetrie</strong>). Daraus ergibt sich dein tatsächlicher Ruheumsatz – ganz ohne Formel.',
      kcal: 'Gemessener Ruheumsatz',
      method: 'Gemessen mit',
      conditionsTitle: 'Für eine gültige Messung',
      conditions: ['Morgens, mindestens 8 Stunden nüchtern', 'Kein Sport am Vortag, kein Koffein und Nikotin vor der Messung', '20–30 Minuten ruhig liegen, dann 10–15 Minuten messen', 'Mehrere Messungen an verschiedenen Tagen mitteln'],
      whereTitle: 'Wo und wie?',
      where: [
        'Labor: Sportmedizin, Ernährungspraxen, Uni-Kliniken und einige Fitnessstudios (Spiroergometrie in Ruhe), meist 50–150 €.',
        'Zu Hause: Atemgas-Handgeräte (z. B. Breezing) messen den Ruheumsatz mit Mundstück. Günstige Atem-Tracker, die nur den Stoffwechselmodus anzeigen, liefern keinen kcal-Wert.',
      ],
    },
    activity: { title: 'Alltag & Sport', arrow: '→ Gesamtumsatz', intro: 'Der Grundumsatz gilt für völlige Ruhe. Mit deinem Aktivitätsniveau (PAL) wird daraus der Gesamtumsatz.', none: 'Keine Angabe', sport: 'Zusätzlicher Sport' },
    adaptive: {
      title: 'Verlauf: echten Verbrauch messen',
      badge: 'Königsweg',
      teaser: '2–4 Wochen Gewicht und Kalorien notieren – daraus wird dein tatsächlicher Verbrauch berechnet. Zum Tagebuch ↓',
    },
    remember: 'Eingaben auf diesem Gerät merken',
    reset: 'Eingaben zurücksetzen',
  },
  result: {
    eyebrow: 'Dein Grundumsatz',
    emptyValue: '– kcal',
    empty: 'Gib Geschlecht, Alter, Größe und Gewicht ein – das Ergebnis erscheint sofort.',
    perDay: 'kcal/Tag',
    range: (r, lo, hi) => `± ${r} kcal · wahrscheinlich ${lo} – ${hi} kcal`,
    narrowedHtml: (b, n) => `Nur mit Basisdaten: ± ${b} kcal (gestrichelt) → mit deinen Angaben: <strong>± ${n} kcal</strong>`,
    narrowDefault: 'Mit jeder weiteren Angabe wird der Bereich schmaler.',
    precision: 'Genauigkeit',
    method: 'Berechnet mit',
    tdee: 'Gesamtumsatz',
    how: 'Wie kommt das Ergebnis zustande? ↓',
    tdeePal: (p) => `Grundumsatz × PAL ${p}`,
    tdeeCombined: (f, m) => `Formel (${f}) und gemessener Verbrauch (${m}) kombiniert`,
    tdeeMeasured: 'gemessen aus deinem Verlauf',
    tdeeExtra: (k) => `inkl. +${k} kcal Stillzeit`,
    impliedPal: (p) => `dein tatsächlicher PAL: ${p}`,
  },
  explain: {
    h2: 'So kommt dein Ergebnis zustande',
    empty: 'Sobald du die Basisdaten eingibst, erscheint hier Schritt für Schritt, wie gerechnet wurde.',
    steps: 'Rechenweg',
    suggest: 'Noch genauer werden',
    hints: 'Hinweise',
    body: 'Körperzusammensetzung',
    formulas: 'Alle Formeln im Vergleich',
    formulasIntro: 'Verschiedene Formeln liefern für dieselbe Person unterschiedliche Werte. Wir nutzen nicht einfach eine, sondern gewichten die passenden nach ihrer Genauigkeit.',
    thFormula: 'Formel',
    thResult: 'Ergebnis',
    thShare: 'Anteil am Ergebnis',
    allFormulas: 'Alle Formeln, Annahmen und Quellen →',
    sumMifflin: '= Mifflin-St Jeor',
    unchanged: 'Wert unverändert',
    rangeUnchanged: 'Spanne unverändert',
    rangeBetter: (d) => `Spanne ${d} kcal genauer`,
    rangeWorse: (d) => `Spanne ${d} kcal unsicherer`,
    gain: (a, b) => `± ${a} → ca. ± ${b} kcal`,
    noMore: 'Du hast alle Möglichkeiten ausgeschöpft. Noch genauer geht es nur mit wiederholten Messungen.',
    ffm: 'fettfreie Masse',
    fat: 'Fett',
    pp: '%-Pkt.',
  },
  tracker: {
    h2: 'Verlauf: deinen echten Verbrauch messen',
    leadHtml:
      'Formeln schätzen – dein Körper misst. Wenn du 2–4 Wochen lang dein Gewicht (am besten täglich morgens) und deine gegessenen Kalorien notierst, lässt sich dein <strong>tatsächlicher Gesamtumsatz</strong> zurückrechnen: Wer bei 2.200 kcal pro Tag ein halbes Kilo pro Woche abnimmt, verbraucht rund 2.750 kcal.',
    add: 'Eintrag hinzufügen',
    date: 'Datum',
    weight: 'Gewicht (kg)',
    kcal: 'Gegessen (kcal)',
    save: 'Speichern',
    hint: 'Einen Wert leer lassen ist okay – z. B. nur das Gewicht eintragen. Ein weiterer Eintrag am selben Tag überschreibt den alten.',
    demo: 'Beispieldaten laden',
    exportCsv: 'CSV exportieren',
    importCsv: 'CSV importieren',
    clear: 'Verlauf löschen',
    chart: 'Gewichtstrend',
    noWeights: 'Noch keine Gewichtseinträge.',
    entries: (n) => `${n} ${n === 1 ? 'Eintrag' : 'Einträge'} anzeigen`,
    thDate: 'Datum',
    thWeight: 'Gewicht',
    thKcal: 'kcal',
    action: 'Aktion',
    deleteAria: (d) => `Eintrag vom ${d} löschen`,
    notEnough: 'Noch nicht genug Daten',
    measured: 'Gemessener Gesamtumsatz',
    measuredDetail: (p) =>
      `Ø gegessen ${p.intake} kcal · Gewichtstrend ${p.slope} kg/Woche · ${p.days} Tage (${p.from}–${p.to}), ${p.weights} Wägungen, ${p.kcalDays} Tage mit Kalorien`,
    palHtml: (b, p) => `Bei deinem Grundumsatz von ${b} kcal entspricht das einem Aktivitätsfaktor (PAL) von <strong>${p}</strong>.`,
    teaserProgress: (d) => `Dein Tagebuch: ${d} von mind. 14 Tagen. Zum Tagebuch ↓`,
    teaserMeasured: (v) => `Gemessener Verbrauch: ${v} kcal/Tag. Zum Tagebuch ↓`,
    errDate: 'Bitte ein Datum wählen.',
    errEmpty: 'Bitte Gewicht und/oder Kalorien eintragen.',
    errWeight: 'Gewicht bitte zwischen 25 und 350 kg.',
    errKcal: 'Kalorien bitte zwischen 300 und 10.000.',
    errImport: 'In der Datei wurden keine gültigen Zeilen gefunden (Format: Datum;Gewicht;kcal).',
    confirmDemo: 'Vorhandenen Verlauf durch Beispieldaten ersetzen?',
    confirmClear: 'Gesamten Verlauf auf diesem Gerät löschen?',
    legendWeight: 'Gewicht',
    legendTrend: 'Trend (geglättet)',
    legendReg: 'Regressionsgerade',
    legendKcal: 'Kalorien',
    csvHeader: 'datum;gewicht_kg;kcal',
    chartAria: 'Gewichtsverlauf',
  },
  faqTitle: 'Häufige Fragen zum Grundumsatz',
  faqMore: 'Ausführlich: alle Formeln, Annahmen und Quellen →',
  faq: [
    {
      q: 'Was ist der Grundumsatz?',
      a: 'Der Grundumsatz (englisch Basal Metabolic Rate, BMR) ist die Energiemenge, die dein Körper in völliger Ruhe pro Tag verbraucht – für Atmung, Herzschlag, Gehirn, Organe und Körpertemperatur. Er macht bei den meisten Menschen 60–70 % des gesamten Tagesverbrauchs aus.',
    },
    {
      q: 'Was ist der Unterschied zwischen Grundumsatz und Gesamtumsatz?',
      a: 'Der Gesamtumsatz (TDEE) umfasst zusätzlich jede Bewegung, Sport und die Verdauung. Er wird aus dem Grundumsatz mal Aktivitätsfaktor (PAL) geschätzt – bei Büroarbeit etwa 1,4–1,5. Noch genauer ist es, ihn aus Gewichtsverlauf und gegessenen Kalorien zurückzurechnen.',
    },
    {
      q: 'Warum ist das Ergebnis ein Bereich und keine feste Zahl?',
      a: 'Jede Formel ist ein Durchschnitt über viele Menschen. Zwei Personen mit gleichem Alter, Gewicht und gleicher Größe können sich um mehrere hundert Kalorien unterscheiden, etwa weil eine mehr Muskeln hat. Der Bereich enthält den wahren Wert mit etwa 80 % Wahrscheinlichkeit. Je mehr du angibst, desto schmaler wird er.',
    },
    {
      q: 'Wie kann ich meinen Grundumsatz zu Hause genauer bestimmen?',
      a: 'Mit einem Maßband (Taille, Hals, Hüfte), einem Caliper für Hautfalten (3 oder besser 7 Messstellen), einer Körperfettwaage mit Mittelwert über mehrere Tage und einem Tagebuch aus Gewicht und Kalorien. Am genauesten ist eine direkte Messung per indirekter Kalorimetrie – im Labor oder mit einem Atemgas-Handgerät.',
    },
    {
      q: 'Welche Formel ist die genaueste?',
      a: 'Ohne Angaben zur Körperzusammensetzung gilt Mifflin-St Jeor als die zuverlässigste Standardformel. Kennst du deinen Körperfettanteil, sind Formeln auf Basis der fettfreien Masse (Katch-McArdle, Cunningham) meist genauer. Dieser Rechner kombiniert die passenden Formeln automatisch und gewichtet sie nach ihrer Genauigkeit.',
    },
    {
      q: 'Sollte ich weniger als meinen Grundumsatz essen?',
      a: 'Dauerhaft nicht ohne fachliche Begleitung. Für eine gesunde Abnahme orientiert man sich am Gesamtumsatz und isst etwa 300–500 kcal weniger. Sehr niedrige Kalorienzufuhr kann zu Muskelabbau und Nährstoffmangel führen.',
    },
    {
      q: 'Werden meine Daten gespeichert?',
      a: 'Nur lokal in deinem Browser, wenn du das möchtest. Es werden keine Daten an einen Server übertragen, es gibt keine Cookies und kein Tracking. Mit „Eingaben zurücksetzen“ und „Verlauf löschen“ entfernst du alles.',
    },
  ],
  methodik: {
    title: 'Methodik: So berechnen wir deinen Grundumsatz | Grundumsatz-Rechner',
    description: 'Formeln (Mifflin-St Jeor, Katch-McArdle, Cunningham, Navy, YMCA, RFM, Jackson-Pollock, Durnin-Womersley), Konfidenzbereiche, Korrekturfaktoren und adaptiver Verbrauch – transparent erklärt mit Quellen.',
    h1: 'So rechnen wir',
    lead: 'Kein Rechner kennt deinen Grundumsatz genau – nur eine Messung (indirekte Kalorimetrie) kommt nah heran. Wir machen das Beste aus deinen Angaben und sagen ehrlich dazu, wie sicher das Ergebnis ist.',
    toc: 'Inhalt',
    thMethod: 'Methode',
    thUncertainty: 'Unsicherheit',
    pp: '%-Punkte',
    thActivity: 'Alltag',
    sections: [
      {
        id: 'kaskade',
        h2: 'Die Formel-Kaskade',
        html: `<p>Je nachdem, welche Angaben vorliegen, nutzt der Rechner die passenden Methoden und kombiniert sie:</p><ol>
<li><strong>Basisdaten</strong> → Mifflin-St Jeor, ca. ± 10 %.</li>
<li><strong>Körperfettanteil</strong> (DEXA, Waage, …) → fettfreie Masse → Katch-McArdle bzw. Cunningham.</li>
<li><strong>Umfänge</strong> → Navy-Methode, YMCA-Formel, Relative Fat Mass.</li>
<li><strong>Hautfalten</strong> → Jackson-Pollock 3- oder 7-Punkt, Durnin-Womersley.</li>
<li><strong>Weitere Faktoren</strong> → Korrekturen mit zusätzlicher Unsicherheit.</li>
<li><strong>Gemessener Ruheumsatz</strong> → indirekte Kalorimetrie, genauer als jede Formel.</li>
<li><strong>Verlauf</strong> → tatsächlicher Gesamtumsatz aus Gewicht und Kalorien.</li></ol>`,
      },
      {
        id: 'basis',
        h2: 'Mifflin-St Jeor',
        html: `<p>Die Formel von Mifflin und St Jeor (1990) gilt in Übersichtsarbeiten als die zuverlässigste Standardformel für gesunde Erwachsene:</p>
<code class="formula">Männer: 10 × Gewicht [kg] + 6,25 × Größe [cm] − 5 × Alter + 5</code>
<code class="formula">Frauen: 10 × Gewicht [kg] + 6,25 × Größe [cm] − 5 × Alter − 161</code>
<p>Sie trifft bei rund 80 % der Normalgewichtigen auf ± 10 % genau (Frankenfield 2005). Bei starkem Über- oder Untergewicht und ab 65 Jahren setzen wir ± 11,5 bis ± 15 % an. Harris-Benedict zeigen wir nur zum Vergleich.</p>`,
      },
      {
        id: 'ffm',
        h2: 'Fettfreie Masse',
        html: `<p>Muskeln und Organe verbrauchen in Ruhe ein Vielfaches dessen, was Fettgewebe benötigt. Formeln auf Basis der fettfreien Masse (FFM) erfassen das:</p>
<code class="formula">FFM = Gewicht × (1 − Körperfett % / 100)</code>
<code class="formula">Katch-McArdle: 370 + 21,6 × FFM</code>
<code class="formula">Cunningham: 500 + 22 × FFM  (bei viel Muskelmasse)</code>
<p>Die Genauigkeit hängt vor allem vom Körperfettwert ab. Typische Unsicherheiten (± Prozentpunkte, ca. 80 %):</p>{{bodyfatTable}}
<p>Körperfettwaagen haben einen systematischen Fehler (Wassergehalt, Elektrodenposition) und einen zufälligen, der von Tag zu Tag schwankt. Mittelst du mehrere Messungen, schrumpft nur der zufällige Anteil. Selbst gemessene Hautfalten bekommen ± 2,5 Prozentpunkte Zusatzfehler.</p>`,
      },
      {
        id: 'umfaenge',
        h2: 'Umfänge: Navy, YMCA, Relative Fat Mass',
        html: `<code class="formula">Navy Männer: 495 / (1,0324 − 0,19077 × log₁₀(Taille − Hals) + 0,15456 × log₁₀(Größe)) − 450</code>
<code class="formula">Navy Frauen: 495 / (1,29579 − 0,35004 × log₁₀(Taille + Hüfte − Hals) + 0,221 × log₁₀(Größe)) − 450</code>
<code class="formula">YMCA: (−98,42 bzw. −76,76 + 4,15 × Taille [in] − 0,082 × Gewicht [lb]) / Gewicht [lb] × 100</code>
<code class="formula">RFM: 64 (Männer) bzw. 76 (Frauen) − 20 × Größe / Taille</code>
<p>Alle drei beruhen auf dem Taillenumfang und irren deshalb oft in dieselbe Richtung. Wir kombinieren sie als Gruppe: gemeinsam höchstens 10 % genauer als die beste Einzelmethode.</p>`,
      },
      {
        id: 'caliper',
        h2: 'Hautfalten: Jackson-Pollock und Durnin-Womersley',
        html: `<p>Aus der Summe der Hautfalten (mm) wird die Körperdichte berechnet und mit der Siri-Formel in Körperfett umgerechnet:</p>
<code class="formula">Körperfett % = 495 / Dichte − 450</code>
<ul><li><strong>3-Punkt</strong> (Jackson &amp; Pollock 1978/1980): Männer Brust, Bauch, Oberschenkel; Frauen Trizeps, Hüftkamm, Oberschenkel.</li>
<li><strong>7-Punkt</strong>: Brust, Achsel, Trizeps, Schulterblatt, Bauch, Hüftkamm, Oberschenkel. Messfehler einzelner Falten mitteln sich heraus.</li>
<li><strong>4-Punkt</strong> (Durnin &amp; Womersley 1974): Bizeps, Trizeps, Schulterblatt, Hüftkamm mit altersabhängigen Koeffizienten.</li></ul>
<p>Liegen 7 Stellen vor, ersetzt die 7-Punkt- die 3-Punkt-Formel. Caliper-Werte werden – wie die Umfänge – als eigene Gruppe kombiniert.</p>`,
      },
      {
        id: 'kombination',
        h2: 'Kombinieren statt auswählen',
        html: `<p>Körperfettwerte verschiedener Methodengruppen (direkte Messung, Umfänge, Hautfalten) haben unabhängige Fehler und werden nach inverser Varianz gemittelt. Anschließend kombinieren wir Mifflin-St Jeor und die FFM-Formel zu einem gewichteten Mittel. Weil beide Formeln teils dieselben Eingaben nutzen, rechnen wir mit einer Fehlerkorrelation von 0,5 – das verhindert, dass das Ergebnis genauer wirkt, als es ist.</p>`,
      },
      {
        id: 'faktoren',
        h2: 'Weitere Faktoren',
        html: `<p>Diese Umstände verändern den Grundumsatz, lassen sich aber nur grob beziffern. Wir wenden sie vorsichtig an und verbreitern dabei den Bereich.</p>
<div class="table-scroll"><table><thead><tr><th>Faktor</th><th>Korrektur</th><th>Zusatz-Unsicherheit</th></tr></thead><tbody>
<tr><td>Schilddrüsenunterfunktion, unbehandelt</td><td>−10 %</td><td>± 7 %</td></tr>
<tr><td>Schilddrüsenüberfunktion, unbehandelt</td><td>+15 %</td><td>± 12 %</td></tr>
<tr><td>Schilddrüse, behandelt</td><td>0 %</td><td>± 3 %</td></tr>
<tr><td>Schwangerschaft 1. / 2. / 3. Trimester</td><td>0 / +5 / +10 %</td><td>± 3 / 4 / 5 %</td></tr>
<tr><td>Stillzeit</td><td>+500 kcal im Gesamtumsatz</td><td>–</td></tr>
<tr><td>Weniger als 6 Stunden Schlaf</td><td>−3 %</td><td>± 2 %</td></tr>
<tr><td>Kaltes Umfeld / heißes Klima</td><td>+3 % / +2 %</td><td>± 2 %</td></tr>
<tr><td>Längere Diät</td><td>−5 %</td><td>± 3 %</td></tr>
<tr><td>Rauchen</td><td>+4 %</td><td>± 3 %</td></tr></tbody></table></div>`,
      },
      {
        id: 'messung',
        h2: 'Gemessener Ruheumsatz',
        html: `<p>Bei der indirekten Kalorimetrie wird aus Sauerstoffaufnahme und CO₂-Abgabe der Energieverbrauch berechnet (Weir-Gleichung). Eine Labormessung setzen wir mit ± 6 % an, ein Handgerät mit ± 10 %. Die Messung wird mit der Formelschätzung nach Genauigkeit kombiniert – eine gute Labormessung bestimmt das Ergebnis fast allein. Weicht sie mehr als 15 % von der Formel ab, weisen wir auf die Messbedingungen hin.</p>`,
      },
      {
        id: 'pal',
        h2: 'Gesamtumsatz (PAL)',
        html: `<p>Gesamtumsatz = Grundumsatz × Physical Activity Level (PAL) nach DGE. Für Sport kommen +0,15 (2–3× pro Woche) bzw. +0,3 (4–5× pro Woche) hinzu, mit zusätzlich ± 12 % Unsicherheit.</p>{{palTable}}`,
      },
      {
        id: 'adaptiv',
        h2: 'Echter Verbrauch aus dem Verlauf',
        html: `<p>Notierst du über mindestens 14 Tage (ideal 3–4 Wochen) Gewicht und Kalorien, gilt:</p>
<code class="formula">Verbrauch = Ø Kalorienzufuhr − Gewichtstrend [kg/Tag] × 7.700 kcal/kg</code>
<p>Den Trend bestimmen wir per linearer Regression über die letzten 28 Tage. Der Bereich berücksichtigt Waagen-Rauschen, Fehler beim Kalorienzählen (± 7 %), fehlende Tage und die Unsicherheit der 7.700-kcal-Regel bei schneller Abnahme.</p>`,
      },
      {
        id: 'bereich',
        h2: 'Was der Bereich bedeutet',
        html: `<p>„1.780 ± 178 kcal“ heißt: Dein wahrer Grundumsatz liegt mit etwa 80 % Wahrscheinlichkeit zwischen 1.602 und 1.958 kcal. Die Unsicherheiten stammen aus Validierungsstudien und sind gerundet – eine ehrliche Größenordnung, keine exakte Statistik.</p>`,
      },
    ],
    sourcesTitle: 'Quellen',
    disclaimer: 'Dieser Rechner ersetzt keine medizinische Beratung. Bei Erkrankungen, in Schwangerschaft und Stillzeit sowie bei Essstörungen sprich bitte mit Ärztin, Arzt oder Ernährungsfachkraft.',
  },
};
