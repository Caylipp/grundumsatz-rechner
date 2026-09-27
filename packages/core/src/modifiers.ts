import type { Hint, Inputs } from './types';

export interface Correction {
  id: string;
  title: string;
  detail: string;
  /** Multiplikativer Faktor auf den Grundumsatz */
  factor: number;
  /** Zusätzliche relative Unsicherheit (±, ca. 80 %) */
  relRange: number;
}

export interface ModifierOutcome {
  corrections: Correction[];
  hints: Hint[];
  /** Zusätzlicher Energiebedarf, der nicht zum Grundumsatz zählt (z. B. Stillzeit) */
  tdeeExtraKcal: number;
}

/**
 * Stufe 4: weitere Faktoren als Korrekturen bzw. Hinweise. Die Effektgrößen sind
 * bewusst vorsichtig gewählt und mit zusätzlicher Unsicherheit versehen, weil die
 * Studienlage für Einzelpersonen dünn ist.
 */
export function evaluateModifiers(input: Inputs): ModifierOutcome {
  const m = input.modifiers ?? {};
  const corrections: Correction[] = [];
  const hints: Hint[] = [];
  let tdeeExtraKcal = 0;

  switch (m.thyroid) {
    case 'hypo_untreated':
      corrections.push({
        id: 'thyroid',
        title: 'Unbehandelte Schilddrüsenunterfunktion',
        detail: 'Eine Unterfunktion senkt den Ruheumsatz typischerweise um 5–15 %. Angesetzt: −10 % mit zusätzlicher Unsicherheit.',
        factor: 0.9,
        relRange: 0.07,
      });
      hints.push({ level: 'warn', text: 'Eine unbehandelte Schilddrüsenunterfunktion sollte ärztlich abgeklärt werden – mit Behandlung normalisiert sich der Grundumsatz meist.' });
      break;
    case 'hyper_untreated':
      corrections.push({
        id: 'thyroid',
        title: 'Unbehandelte Schilddrüsenüberfunktion',
        detail: 'Eine Überfunktion kann den Ruheumsatz um 10–50 % steigern. Angesetzt: +15 % mit großer zusätzlicher Unsicherheit.',
        factor: 1.15,
        relRange: 0.12,
      });
      hints.push({ level: 'warn', text: 'Eine unbehandelte Schilddrüsenüberfunktion gehört in ärztliche Behandlung. Der Wert hier ist nur ein grober Anhaltspunkt.' });
      break;
    case 'hypo_treated':
    case 'hyper_treated':
      corrections.push({
        id: 'thyroid',
        title: 'Behandelte Schilddrüsenerkrankung',
        detail: 'Gut eingestellt liegt der Grundumsatz im Normalbereich. Kein Aufschlag, aber etwas mehr Unsicherheit wegen möglicher Schwankungen der Einstellung.',
        factor: 1,
        relRange: 0.03,
      });
      break;
  }

  if (input.sex === 'female') {
    switch (m.pregnancy) {
      case 't1':
        corrections.push({
          id: 'pregnancy',
          title: 'Schwangerschaft, 1. Trimester',
          detail: 'Im ersten Trimester steigt der Grundumsatz kaum. Kein Aufschlag, leicht erhöhte Unsicherheit.',
          factor: 1,
          relRange: 0.03,
        });
        break;
      case 't2':
        corrections.push({
          id: 'pregnancy',
          title: 'Schwangerschaft, 2. Trimester',
          detail: 'Stoffwechsel von Mutter, Plazenta und Kind steigern den Ruheumsatz. Angesetzt: +5 % (zusätzlich zur Gewichtszunahme, die schon in der Formel steckt).',
          factor: 1.05,
          relRange: 0.04,
        });
        break;
      case 't3':
        corrections.push({
          id: 'pregnancy',
          title: 'Schwangerschaft, 3. Trimester',
          detail: 'Im letzten Trimester ist der Ruheumsatz deutlich erhöht. Angesetzt: +10 % zusätzlich zur Gewichtszunahme.',
          factor: 1.1,
          relRange: 0.05,
        });
        break;
      case 'breastfeeding':
        tdeeExtraKcal += 500;
        hints.push({ level: 'info', text: 'Stillzeit: Die Milchbildung verbraucht zusätzlich rund 500 kcal pro Tag. Das zählt nicht zum Grundumsatz, ist aber im Gesamtumsatz berücksichtigt.' });
        break;
    }
    if (m.pregnancy === 't1' || m.pregnancy === 't2' || m.pregnancy === 't3') {
      hints.push({ level: 'info', text: 'Schwangerschaft: Die DGE empfiehlt ab dem 2. Trimester ca. +250 kcal, im 3. Trimester ca. +500 kcal pro Tag. Bitte keine Diät in der Schwangerschaft – sprich Ernährungsfragen mit deiner Frauenärztin bzw. Hebamme ab.' });
    }
  }

  if (m.sleepHours !== undefined) {
    if (m.sleepHours < 6) {
      corrections.push({
        id: 'sleep',
        title: `Wenig Schlaf (${formatHours(m.sleepHours)} h)`,
        detail: 'Chronischer Schlafmangel senkt in Studien den Ruheumsatz um einige Prozent. Angesetzt: −3 %.',
        factor: 0.97,
        relRange: 0.02,
      });
      hints.push({ level: 'info', text: 'Schlafmangel erhöht außerdem den Appetit – mehr Schlaf hilft oft mehr als jede Formel.' });
    } else if (m.sleepHours > 10) {
      hints.push({ level: 'info', text: 'Sehr lange Schlafdauer kann auf eine Erkrankung hindeuten (z. B. Schilddrüse, Depression). Im Zweifel ärztlich abklären.' });
    }
  }

  if (m.climate === 'cold') {
    corrections.push({
      id: 'climate',
      title: 'Kaltes Umfeld',
      detail: 'Regelmäßige Kälte (kühle Wohnung, viel draußen) aktiviert braunes Fettgewebe und erhöht den Umsatz leicht. Angesetzt: +3 %.',
      factor: 1.03,
      relRange: 0.02,
    });
  } else if (m.climate === 'hot') {
    corrections.push({
      id: 'climate',
      title: 'Heißes Klima',
      detail: 'Dauerhafte Hitze erhöht den Umsatz durch Thermoregulation leicht. Angesetzt: +2 %.',
      factor: 1.02,
      relRange: 0.02,
    });
  }

  if (m.recentDiet) {
    corrections.push({
      id: 'diet',
      title: 'Längere Diät / starke Abnahme',
      detail: 'Nach längerem Kaloriendefizit sinkt der Verbrauch oft stärker, als das geringere Gewicht erklärt (metabolische Adaption). Angesetzt: −5 %.',
      factor: 0.95,
      relRange: 0.03,
    });
  }

  if (m.smoker) {
    corrections.push({
      id: 'smoking',
      title: 'Rauchen',
      detail: 'Nikotin erhöht den Energieumsatz. Angesetzt: +4 %. Beim Rauchstopp fällt dieser Effekt weg.',
      factor: 1.04,
      relRange: 0.03,
    });
  }

  return { corrections, hints, tdeeExtraKcal };
}

function formatHours(h: number): string {
  return String(Math.round(h * 10) / 10).replace('.', ',');
}
