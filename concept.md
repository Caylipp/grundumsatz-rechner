# Konzept: Grundumsatz-Rechner

## Idee
Webseite und App, die den Ruhekalorienverbrauch (Grundumsatz, BMR/RMR) berechnen. Das Besondere: Alle Angaben außer den Basisdaten sind optional, und **je mehr man angibt, desto genauer wird das Ergebnis**. Unter dem Ergebnis steht eine Erklärung, wie es zustande kommt.

## Bewertung
| Kriterium | Einschätzung |
|---|---|
| Machbarkeit | Sehr hoch. Reine Formeln, läuft komplett clientseitig. |
| Aufwand MVP | Gering (1–2 Wochen) |
| Konkurrenz | Hunderte BMR-Rechner, fast alle mit einer einzigen Formel. „Progressive Genauigkeit“ mit Konfidenzbereich und Erklärung ist ein echter Unterschied. |
| Traffic | Suchvolumen für „Grundumsatz berechnen“ ist hoch, also SEO-tauglich. |
| Monetarisierung | Werbung, Affiliate (Waagen mit Körperfettmessung, Fitness-Tracker), später eine Premium-App mit Verlauf. |
| Rechtliches | Hinweis „keine medizinische Beratung“ nötig, Gesundheitsdaten nur lokal speichern (DSGVO). |

**Fazit:** Schnell umsetzbar, klarer USP, gutes SEO-Potenzial. Sehr gutes Einstiegsprojekt.

## Umsetzungsideen
- **Formel-Kaskade** (je nach verfügbaren Daten die beste Formel wählen):
  1. Basis: Alter, Geschlecht, Größe, Gewicht → Mifflin-St Jeor (± ca. 10 %)
  2. Mit Körperfettanteil → Katch-McArdle bzw. Cunningham (fettfreie Masse)
  3. Mit Taillen- und Halsumfang → Körperfett nach der Navy-Methode schätzen, dann wie Stufe 2
  4. Weitere Faktoren wie Schlaf, Schilddrüse, Klima, Schwangerschaft oder Muskelmasse per BIA als Korrekturen bzw. Hinweise
  5. Königsweg: Gewichtsverlauf und gegessene Kalorien über 2–4 Wochen eintragen, daraus den tatsächlichen Verbrauch zurückrechnen (adaptiver TDEE)
- **UX**: Genauigkeitsbalken bzw. Konfidenzintervall, das mit jeder Eingabe schmaler wird („± 180 kcal → ± 60 kcal“).
- **Erklärung**: welche Formel genutzt wurde, warum, und wie jede Eingabe das Ergebnis verändert hat.
- **Tech**: Web mit Next.js oder Astro (statisch, SEO), später als App über Capacitor oder Expo wiederverwenden. Die Rechenlogik als geteiltes TS-Paket.
- **MVP**: Web mit den Stufen 1–3, Konfidenzbalken und Erklärung.
