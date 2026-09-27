# Grundumsatz-Rechner

Web + App: berechnet den Ruhekalorienverbrauch (Grundumsatz); je mehr optionale Angaben, desto genauer. Mit Konfidenzbereich und Erklärung darunter. Idee und Bewertung: [concept.md](concept.md).

## Features

- **Formel-Kaskade** (Stufe 1–5 aus dem Konzept)
  1. Basis → Mifflin-St Jeor (± 10 %, bei Adipositas/Alter breiter)
  2. Körperfettanteil (mit Messmethode) → fettfreie Masse → Katch-McArdle bzw. Cunningham (bei viel Muskelmasse)
  3. Taille/Hals(/Hüfte) → Körperfett nach der Navy-Methode; mehrere Körperfettwerte werden nach Genauigkeit gemittelt
  4. Schilddrüse, Schwangerschaft/Stillzeit, Schlaf, Klima, längere Diät, Rauchen → Korrekturen mit zusätzlicher Unsicherheit
  5. Verlauf (Gewicht + kcal, ≥ 14 Tage) → tatsächlicher Gesamtumsatz per Regression, daraus der echte PAL
- Mifflin und FFM-Formel werden **kombiniert** (inverse Varianz, Fehlerkorrelation 0,5) statt stur eine zu wählen
- **Genauigkeitsbalken**: aktueller ±-Bereich vs. Bereich nur mit Basisdaten; jeder optionale Abschnitt zeigt vorab, wie stark er die Spanne verkleinert (z. B. „± 178 → ± 141 kcal“)
- **Erklärung**: Rechenweg Schritt für Schritt inkl. Veränderung von Wert und Spanne, Formelvergleich mit Gewichtung, Körperzusammensetzung, Hinweise, Vorschläge
- Gesamtumsatz über PAL-Stufen (DGE) + Sport, kombiniert mit dem gemessenen Verbrauch
- Tagebuch mit Diagramm, CSV-Import/-Export, Beispieldaten
- DSGVO: alles clientseitig, nur `localStorage`, keine Cookies/Tracking/externen Fonts
- SEO: statische Seiten, FAQ + JSON-LD (FAQPage, WebApplication), Sitemap, Methodik-Seite mit Quellen
- PWA: Manifest + Service Worker (offline nutzbar, installierbar)
- Dark Mode, mobil mit schwebender Ergebnis-Leiste

## Struktur

```
packages/core   Rechenlogik als geteiltes TS-Paket (@grundumsatz/core) + Vitest-Tests
apps/web        Astro-Website (statisch), nutzt @grundumsatz/core
```

## Befehle

```bash
npm install
npm run dev        # Entwicklungsserver (apps/web)
npm test           # Tests der Rechenlogik
npm run build      # Typecheck + statischer Build nach apps/web/dist
npm run preview    # Build lokal ansehen
```

## Vor dem Livegang

- `site` in `apps/web/astro.config.mjs` und die Sitemap-URL in `apps/web/public/robots.txt` auf die echte Domain setzen
- Impressum und Datenschutz (`apps/web/src/pages/`) ausfüllen – derzeit Platzhalter
- PNG-Icons (192/512 px) für bessere PWA-Unterstützung ergänzen (aktuell nur SVG)

## Nächste Schritte

- Native App: `apps/web/dist` mit Capacitor verpacken, oder Expo-App, die `@grundumsatz/core` direkt nutzt
- Monetarisierung (Werbung/Affiliate) laut Konzept – dann Datenschutz und Consent anpassen
- Premium: Verlauf geräteübergreifend synchronisieren
