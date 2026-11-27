# Stand (2026-11-28, später am Tag)

## Was funktioniert
- Formel-Kaskade mit Konfidenzbereich, Erklärung, Verlauf/adaptiver Verbrauch, 4 Sprachen (de/en/es/vi), PWA, iOS-Hülle (Capacitor) und Live-Seite auf Cloudflare (wie bisher).
- Neu: **Ziel-Rechner** (`packages/core/src/goal.ts`, UI `Goal.astro`, Chart `goalChart.ts`). Zielgewicht plus Tempo (0,25/0,5/0,75 % Körpergewicht pro Woche bei Abnahme, 0,1/0,25/0,5 % bei Zunahme) oder Zeitraum in Wochen ergibt Zielzufuhr, Defizit/Überschuss, Dauer als Spanne und Verlaufskurve mit Band. Der Verbrauch sinkt mit dem Gewicht (10 kcal × PAL je kg, Exponentialmodell nach Hall 2011). Die Unsicherheit des Gesamtumsatzes plus 10 % Energiedichte (quadratisch addiert) wird bis in die Dauer weitergeführt. Der Plan sagt ehrlich "nicht erreichbar", wenn es im ungünstigen Fall nicht klappt. Warnungen: Zufuhr < 1.500/1.200 kcal oder < Grundumsatz, Defizit > 25 %, > 1 % pro Woche Abnahme, Ziel-BMI < 18,5, unter 18 Jahren.
- Neu: **Sicherung und Teilen-Link** (`packages/core/src/backup.ts`): JSON-Export/Import von Eingaben, Ziel und Verlauf; Link mit den Eingaben nur im `#d=`-Fragment (nie an einen Server, ohne Verlauf). Alle importierten Daten werden bereinigt (Schlüssel, Länge, Wertebereiche).
- Quellen-Seite ergänzt: Garthe 2011, Helms 2014, Iraki 2019, WHO 2000; neuer Abschnitt "Zielgewicht und Zeitplan" in allen 4 Sprachen; Datenschutz-Hinweis zum Teilen-Link.
- Neu: **Makro-Verteilung** (`packages/core/src/macro.ts`, UI im Abschnitt Ziel, Karte `#macro-card`). Verteilt die Zielzufuhr (ohne Ziel: den Gesamtumsatz, dann mit dessen Unsicherheit in der Kohlenhydrat-Spanne). Eiweiß in g/kg nach Ziel (Körpergewicht: Halten 1,2–1,8, Zunehmen 1,6–2,2, Abnehmen 1,8–2,4; fettfreie Masse bei bekanntem Körperfett: 1,5–2,2 / 2,0–2,7 / 2,3–3,1), Fett mindestens max(0,6 g/kg, 20 % Energie) bis 35 %, Kohlenhydrate Rest. Einzelwert = Mitte der Eiweißspanne und ca. 27,5 % Fett. Optional eigener Eiweißwert (Feld `proteinPerKg` im Ziel-Block, wandert in Sicherung und Teilen-Link; alte Sicherungen und Links bleiben gültig, Version unverändert 1). Warnungen: Minimum über der Energie, unter 1.000 kcal, Eiweiß über 35 % bzw. 2,5 g/kg, unter 100 g Kohlenhydrate, BMI ab 30 ohne Körperfett, unter 18 Jahren. Quellen ergänzt (Jäger 2017 ISSN, Morton 2018, DGE D-A-CH), Methodik-Abschnitt "Makro-Verteilung" in allen 4 Sprachen. Eiweiß-Spannen sind eine eigene Ableitung aus diesen Quellen, kein Zitat einer einzelnen Tabelle.
- Emoji-Bereinigung: das Stern-Zeichen am Ruheumsatz-Abzeichen und das Häkchen an den Stufen-Chips sind jetzt schlichte Linien-Icons (SVG bzw. CSS); sonst gab es in der angezeigten Oberfläche keine Emoji (Pfeile in Texten bleiben).
- Tests: 87 grün (davon neu `macro.test.ts`; vorher 77), Browser-Smoke in 4 Sprachen (Makro-Karte erscheint, eigener Wert, Fehlerfall, keine Konsolenfehler) (vitest, davon neu `goal.test.ts`, `backup.test.ts`), Typecheck und Web-Build grün. Browser-Smoke (Headless Chrome, Link mit Eingaben) in allen 4 Sprachen ohne Fehler.

## Nächste Schritte
- **Deploy** (bewusst nicht gemacht): `npm run deploy` nach Durchsicht der neuen Abschnitte auf dem iPhone/Browser.
- Makro-Verteilung ggf. um Trainingsstatus (Eiweiß ohne Training niedriger) und Mahlzeitenverteilung erweitern.
- Zielmarke im Verlaufs-Chart (Ist-Gewicht gegen den Plan) und Plan-Anpassung nach 2–4 Wochen aus dem gemessenen Verbrauch.
- iOS-App neu bauen (`npm run ios:ipa`), PNG-Icons, Impressum/Datenschutz mit echten Angaben füllen (wie bisher offen).

## Offene Fragen an Philipp
- Soll der Teilen-Link in der iOS-App ausgeblendet bleiben (dort gibt es keine öffentliche Adresse)? Aktuell ja.
- Sind die Tempo-Stufen und Warnschwellen so in Ordnung, oder soll der Ziel-Rechner vorsichtiger sein (z. B. Zunahme nur bis 0,25 %)?
- Passt die Eiweiß-Standardspanne (Abnehmen 1,8–2,4 g/kg Körpergewicht) oder lieber enger an 1,6–2,2?
- Wann deployen?
