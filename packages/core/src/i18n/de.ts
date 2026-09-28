import type { Messages } from './types';

export const de: Messages = {
  intl: 'de-DE',
  stages: {
    basis: 'Basisdaten',
    bodyfat: 'Körperfett',
    circumferences: 'Umfänge',
    caliper3: 'Caliper 3',
    caliper7: 'Caliper 7',
    factors: 'Weitere Faktoren',
    measured: 'Ruheumsatz gemessen',
    activity: 'Aktivität',
    adaptive: 'Verlauf',
  },
  precision: { veryGood: 'sehr gut', good: 'gut', solid: 'solide', rough: 'grob' },
  sources: {
    dexa: 'DEXA-Scan',
    bodpod: 'BodPod / Unterwasserwiegen',
    caliper: 'Caliper (Wert vom Studio/Coach)',
    bia8: 'Körperfettwaage mit Handgriffen (8 Elektroden)',
    bia: 'Körperfettwaage (nur Füße)',
    visual: 'Eigene Schätzung',
    navy: 'Navy-Methode (Taille, Hals, Hüfte)',
    ymca: 'YMCA-Formel (Taille, Gewicht)',
    rfm: 'Relative Fat Mass (Taille, Größe)',
    jp3: 'Caliper 3-Punkt (Jackson-Pollock)',
    jp7: 'Caliper 7-Punkt (Jackson-Pollock)',
    dw4: 'Caliper 4-Punkt (Durnin-Womersley)',
  },
  rmrMethods: { lab: 'Labor / Sportmedizin (Spirometrie)', handheld: 'Handgerät für zu Hause' },
  formulas: {
    mifflin: { name: 'Mifflin-St Jeor', note: 'Standard ohne Körperfettangabe (1990)' },
    harris_benedict: { name: 'Harris-Benedict (rev. 1984)', note: 'Klassiker, überschätzt meist leicht' },
    katch_mcardle: { name: 'Katch-McArdle', note: 'Fettfreie Masse, allgemein' },
    cunningham: { name: 'Cunningham', note: 'Fettfreie Masse, für Sportler:innen' },
    measured: { name: 'Gemessener Ruheumsatz', note: (m) => `Indirekte Kalorimetrie: ${m}` },
    comparisonOnly: 'nur zum Vergleich',
  },
  basis: {
    title: 'Basis: Mifflin-St Jeor',
    reason:
      'Ohne Angaben zur Körperzusammensetzung ist Mifflin-St Jeor die genaueste Standardformel. Sie trifft bei etwa 8 von 10 Menschen auf ±10 % genau.',
    widerAge: (p) => `Bei deinem Alter streut sie etwas stärker (±${p}).`,
    widerBmi: (p) => `Bei deinem BMI streut sie etwas stärker (±${p}).`,
    weight: (kg) => `10 × ${kg} kg Gewicht`,
    height: (cm) => `6,25 × ${cm} cm Größe`,
    age: (y) => `−5 × ${y} Jahre Alter`,
    constMale: 'Konstante für Männer',
    constFemale: 'Konstante für Frauen',
  },
  bodyfat: {
    title: (src, f) => `${src} → ${f}`,
    sourceCirc: 'Körperfett aus Umfängen',
    sourceCaliper: (n) => `Körperfett aus ${n} Hautfalten`,
    sourceDirect: 'Körperfettanteil',
    sourceMixed: 'Körperfett aus mehreren Methoden',
    single: (pct, label, range) => `Körperfett ${pct} % (${label}, ±${range} Prozentpunkte).`,
    combined: (pct, range, list) => `Körperfett ${pct} % (±${range} Prozentpunkte), kombiniert aus: ${list}.`,
    item: (label, pct) => `${label} ${pct} %`,
    detail: (p) =>
      `${p.src} Daraus ergibt sich eine fettfreie Masse von ${p.ffm} kg (±${p.ffmRange} kg). Muskeln und Organe verbrauchen in Ruhe viel mehr Energie als Fett, deshalb rechnet ${p.formula} nur mit der fettfreien Masse: ${p.estimate}. Beide Formeln werden nach ihrer Genauigkeit gewichtet kombiniert (${p.wFfm} ${p.formula}, ${p.wMifflin} Mifflin-St Jeor).`,
    cunninghamWhy: 'Cunningham wird gewählt, weil du viel Muskelmasse angegeben hast.',
    readings: (n) => `Mittelwert aus ${n} Messungen`,
    selfMeasured: 'selbst gemessen',
  },
  measured: {
    title: (m) => `Gemessener Ruheumsatz (${m})`,
    detail: (p) =>
      `Eine Messung von Sauerstoffaufnahme und CO₂-Abgabe erfasst deinen tatsächlichen Verbrauch – genauer als jede Formel. Gemessen: ${p.measured}, Formelschätzung: ${p.formula}. Beides wird nach Genauigkeit gewichtet (${p.wMeasured} Messung).`,
    deviates: (pct) =>
      `Deine Messung weicht um ${pct} von der Formel ab. Das kann echt sein (z. B. Schilddrüse, Muskelmasse) – prüfe aber, ob die Messbedingungen stimmten: morgens, nüchtern, 30 Minuten Ruhe, kein Sport und kein Koffein vorher.`,
  },
  method: {
    mifflin: 'Mifflin-St Jeor',
    ffm: (f) => `${f} + Mifflin-St Jeor`,
    measured: 'Messung',
    corrections: (n) => (n === 1 ? 'mit 1 Korrektur' : `mit ${n} Korrekturen`),
  },
  hints: {
    hipNeeded: 'Für die Navy-Methode brauchen Frauen zusätzlich den Hüftumfang.',
    implausibleCirc: 'Die Umfänge ergeben keinen plausiblen Körperfettanteil – bitte Messung prüfen (Taille auf Nabelhöhe, Hals unter dem Kehlkopf).',
    implausibleSkinfold: 'Die Hautfalten ergeben keinen plausiblen Körperfettanteil – bitte Werte in Millimetern prüfen.',
    athlete:
      'Bei viel Muskelmasse unterschätzt Mifflin-St Jeor den Grundumsatz oft. Gib deinen Körperfettanteil, Umfänge oder Hautfalten an, dann wird die Cunningham-Formel genutzt.',
    under18:
      'Die Formeln sind für Erwachsene entwickelt. Im Wachstum ist der Bedarf höher und schwankt stärker – das Ergebnis ist hier nur ein grober Richtwert.',
    underweight: (b) => `Dein BMI liegt bei ${b} (Untergewicht). Bitte nicht weiter reduzieren, ohne das ärztlich abzuklären.`,
    highBmi: 'Bei höherem Körpergewicht wird die Schätzung mit Körperfett-, Umfangs- oder Hautfaltenangaben deutlich zuverlässiger.',
    caliperPartial: (n) => `Du hast ${n} Hautfalten eingetragen. Für die 3-Punkt-Methode fehlen noch Messstellen – siehe Markierung im Formular.`,
  },
  modifiers: {
    hypoUntreated: {
      title: 'Unbehandelte Schilddrüsenunterfunktion',
      detail: 'Eine Unterfunktion senkt den Ruheumsatz typischerweise um 5–15 %. Angesetzt: −10 % mit zusätzlicher Unsicherheit.',
      hint: 'Eine unbehandelte Schilddrüsenunterfunktion sollte ärztlich abgeklärt werden – mit Behandlung normalisiert sich der Grundumsatz meist.',
    },
    hyperUntreated: {
      title: 'Unbehandelte Schilddrüsenüberfunktion',
      detail: 'Eine Überfunktion kann den Ruheumsatz um 10–50 % steigern. Angesetzt: +15 % mit großer zusätzlicher Unsicherheit.',
      hint: 'Eine unbehandelte Schilddrüsenüberfunktion gehört in ärztliche Behandlung. Der Wert hier ist nur ein grober Anhaltspunkt.',
    },
    thyroidTreated: {
      title: 'Behandelte Schilddrüsenerkrankung',
      detail: 'Gut eingestellt liegt der Grundumsatz im Normalbereich. Kein Aufschlag, aber etwas mehr Unsicherheit wegen möglicher Schwankungen der Einstellung.',
    },
    t1: { title: 'Schwangerschaft, 1. Trimester', detail: 'Im ersten Trimester steigt der Grundumsatz kaum. Kein Aufschlag, leicht erhöhte Unsicherheit.' },
    t2: {
      title: 'Schwangerschaft, 2. Trimester',
      detail: 'Stoffwechsel von Mutter, Plazenta und Kind steigern den Ruheumsatz. Angesetzt: +5 % (zusätzlich zur Gewichtszunahme, die schon in der Formel steckt).',
    },
    t3: { title: 'Schwangerschaft, 3. Trimester', detail: 'Im letzten Trimester ist der Ruheumsatz deutlich erhöht. Angesetzt: +10 % zusätzlich zur Gewichtszunahme.' },
    breastfeedingHint:
      'Stillzeit: Die Milchbildung verbraucht zusätzlich rund 500 kcal pro Tag. Das zählt nicht zum Grundumsatz, ist aber im Gesamtumsatz berücksichtigt.',
    pregnancyHint:
      'Schwangerschaft: Die DGE empfiehlt ab dem 2. Trimester ca. +250 kcal, im 3. Trimester ca. +500 kcal pro Tag. Bitte keine Diät in der Schwangerschaft – sprich Ernährungsfragen mit deiner Frauenärztin bzw. Hebamme ab.',
    sleepShort: {
      title: (h) => `Wenig Schlaf (${h} h)`,
      detail: 'Chronischer Schlafmangel senkt in Studien den Ruheumsatz um einige Prozent. Angesetzt: −3 %.',
      hint: 'Schlafmangel erhöht außerdem den Appetit – mehr Schlaf hilft oft mehr als jede Formel.',
    },
    sleepLong: 'Sehr lange Schlafdauer kann auf eine Erkrankung hindeuten (z. B. Schilddrüse, Depression). Im Zweifel ärztlich abklären.',
    cold: {
      title: 'Kaltes Umfeld',
      detail: 'Regelmäßige Kälte (kühle Wohnung, viel draußen) aktiviert braunes Fettgewebe und erhöht den Umsatz leicht. Angesetzt: +3 %.',
    },
    hot: { title: 'Heißes Klima', detail: 'Dauerhafte Hitze erhöht den Umsatz durch Thermoregulation leicht. Angesetzt: +2 %.' },
    diet: {
      title: 'Längere Diät / starke Abnahme',
      detail: 'Nach längerem Kaloriendefizit sinkt der Verbrauch oft stärker, als das geringere Gewicht erklärt (metabolische Adaption). Angesetzt: −5 %.',
    },
    smoking: { title: 'Rauchen', detail: 'Nikotin erhöht den Energieumsatz. Angesetzt: +4 %. Beim Rauchstopp fällt dieser Effekt weg.' },
  },
  pal: {
    levels: {
      sedentary: { label: 'Ausschließlich sitzend oder liegend', example: 'z. B. bettlägerig, sehr eingeschränkt mobil' },
      low: { label: 'Sitzend, kaum Bewegung in der Freizeit', example: 'z. B. Büroarbeit, Pendeln mit Auto/ÖPNV' },
      moderate: { label: 'Überwiegend sitzend, zeitweise gehend/stehend', example: 'z. B. Studium, Labor, Fahrdienst' },
      high: { label: 'Überwiegend stehend oder gehend', example: 'z. B. Verkauf, Service, Handwerk, Pflege' },
      very_high: { label: 'Körperlich anstrengende Arbeit', example: 'z. B. Bau, Landwirtschaft, Leistungssport' },
    },
    sport: { none: 'Kein regelmäßiger Sport', some: '2–3× pro Woche 30–60 Min.', regular: '4–5× pro Woche 30–60 Min.' },
    withSport: (l, s) => `${l} + Sport ${s}`,
  },
  adaptive: {
    noEntries: 'Noch keine Einträge.',
    minDays: (min, have) => `Mindestens ${min} Tage Zeitraum nötig – aktuell ${have}.`,
    minWeights: (min, have) => `Mindestens ${min} Gewichtsmessungen nötig – aktuell ${have}.`,
    minKcal: (min, have) => `Mindestens ${min} Tage mit Kalorienangabe nötig – aktuell ${have}.`,
    coverage: (min, have) => `Kalorien an mindestens ${min} % der Tage eintragen – aktuell ${have} %.`,
    fastChange: 'Sehr schnelle Gewichtsänderung: Anfangs sind das oft Wasser und Glykogen. Das Ergebnis wird mit mehr Wochen verlässlicher.',
    missingDays: 'An einigen Tagen fehlen Kalorienangaben – es wird angenommen, dass du an diesen Tagen ähnlich viel gegessen hast.',
    short: 'Unter 3 Wochen schwankt das Ergebnis noch deutlich. Ideal sind 3–4 Wochen.',
  },
  validation: {
    sex: 'Bitte Geschlecht wählen.',
    missing: (l) => `${l} fehlt.`,
    nan: (l) => `${l} ist keine gültige Zahl.`,
    range: (l, min, max, u) => `${l} muss zwischen ${min} und ${max} ${u} liegen.`,
    neckWaist: 'Der Halsumfang muss kleiner als der Taillenumfang sein.',
    labels: {
      age: 'Alter',
      heightCm: 'Größe',
      weightKg: 'Gewicht',
      bodyFat: 'Körperfettanteil',
      readings: 'Anzahl Messungen',
      waistCm: 'Taillenumfang',
      neckCm: 'Halsumfang',
      hipCm: 'Hüftumfang',
      sleepHours: 'Schlafdauer',
      skinfold: 'Hautfalte',
      rmr: 'Gemessener Ruheumsatz',
    },
    units: { years: 'Jahren', cm: 'cm', kg: 'kg', pct: '%', hours: 'Stunden', mm: 'mm', kcal: 'kcal', count: '' },
  },
  suggestions: {
    circumferences: {
      titleMale: 'Taille und Hals messen',
      titleFemale: 'Taille, Hüfte und Hals messen',
      text: 'Ein Maßband genügt: Daraus schätzen Navy-Methode, YMCA-Formel und Relative Fat Mass deinen Körperfettanteil.',
    },
    caliper3: {
      title: '3 Hautfalten mit einem Caliper messen',
      text: 'Ein Caliper kostet wenige Euro. Drei Hautfalten (Jackson-Pollock) schätzen das Körperfett genauer als Umfänge.',
    },
    caliper7: {
      title: 'Auf 7 Hautfalten erweitern',
      text: 'Mit vier weiteren Messstellen nutzt der Rechner die 7-Punkt-Methode – Messfehler einzelner Falten mitteln sich heraus.',
    },
    bodyfat: {
      title: 'Körperfett genau messen lassen',
      text: 'Ein DEXA-Scan (Radiologie, Sportmedizin, manche Studios) liefert die fettfreie Masse am genauesten.',
    },
    measured: {
      title: 'Ruheumsatz direkt messen',
      text: 'Die genaueste Methode: indirekte Kalorimetrie in Sportmedizin oder Ernährungspraxis (ca. 50–100 €) oder mit einem Atemgas-Handgerät zu Hause.',
    },
    activity: { title: 'Aktivität angeben', text: 'Dann siehst du auch deinen Gesamtumsatz (Grundumsatz × Aktivitätsfaktor).' },
    adaptive: {
      title: '2–4 Wochen Gewicht und Kalorien notieren',
      text: 'Aus Gewichtsverlauf und Kalorienzufuhr wird dein tatsächlicher Gesamtverbrauch zurückgerechnet.',
    },
  },
};
