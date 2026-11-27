# Stand (2026-11-28)

## Was funktioniert
- Formel-Kaskade mit Konfidenzbereich, Erklärung, Verlauf/adaptiver Verbrauch, 4 Sprachen (de/en/es/vi), PWA, iOS-Hülle (Capacitor) und Live-Seite auf Cloudflare (wie bisher).
- Neu: **Ziel-Rechner** (`packages/core/src/goal.ts`, UI `Goal.astro`, Chart `goalChart.ts`). Zielgewicht plus Tempo (0,25/0,5/0,75 % Körpergewicht pro Woche bei Abnahme, 0,1/0,25/0,5 % bei Zunahme) oder Zeitraum in Wochen ergibt Zielzufuhr, Defizit/Überschuss, Dauer als Spanne und Verlaufskurve mit Band. Der Verbrauch sinkt mit dem Gewicht (10 kcal × PAL je kg, Exponentialmodell nach Hall 2011). Die Unsicherheit des Gesamtumsatzes plus 10 % Energiedichte (quadratisch addiert) wird bis in die Dauer weitergeführt. Der Plan sagt ehrlich "nicht erreichbar", wenn es im ungünstigen Fall nicht klappt. Warnungen: Zufuhr < 1.500/1.200 kcal oder < Grundumsatz, Defizit > 25 %, > 1 % pro Woche Abnahme, Ziel-BMI < 18,5, unter 18 Jahren.
- Neu: **Sicherung und Teilen-Link** (`packages/core/src/backup.ts`): JSON-Export/Import von Eingaben, Ziel und Verlauf; Link mit den Eingaben nur im `#d=`-Fragment (nie an einen Server, ohne Verlauf). Alle importierten Daten werden bereinigt (Schlüssel, Länge, Wertebereiche).
- Quellen-Seite ergänzt: Garthe 2011, Helms 2014, Iraki 2019, WHO 2000; neuer Abschnitt "Zielgewicht und Zeitplan" in allen 4 Sprachen; Datenschutz-Hinweis zum Teilen-Link.
- Tests: 77 grün (vitest, davon neu `goal.test.ts`, `backup.test.ts`), Typecheck und Web-Build grün. Browser-Smoke (Headless Chrome, Link mit Eingaben) in allen 4 Sprachen ohne Fehler.

## Nächste Schritte
- **Deploy** (bewusst nicht gemacht): `npm run deploy` nach Durchsicht der neuen Abschnitte auf dem iPhone/Browser.
- Makro-Verteilung (Protein g/kg nach Morton 2018, Fett/Kohlenhydrate) als Anschluss an die Zielzufuhr.
- Zielmarke im Verlaufs-Chart (Ist-Gewicht gegen den Plan) und Plan-Anpassung nach 2–4 Wochen aus dem gemessenen Verbrauch.
- iOS-App neu bauen (`npm run ios:ipa`), PNG-Icons, Impressum/Datenschutz mit echten Angaben füllen (wie bisher offen).

## Offene Fragen an Philipp
- Soll der Teilen-Link in der iOS-App ausgeblendet bleiben (dort gibt es keine öffentliche Adresse)? Aktuell ja.
- Sind die Tempo-Stufen und Warnschwellen so in Ordnung, oder soll der Ziel-Rechner vorsichtiger sein (z. B. Zunahme nur bis 0,25 %)?
- Wann deployen?
