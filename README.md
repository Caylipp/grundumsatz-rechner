# Grundumsatz-Rechner

Web + App: berechnet den Ruhekalorienverbrauch (Grundumsatz); je mehr optionale Angaben, desto genauer. Mit Konfidenzbereich und Erklärung darunter. Idee und Bewertung: [concept.md](concept.md).

Sprachen: Deutsch (`/`), Englisch (`/en/`), Spanisch (`/es/`), Vietnamesisch (`/vi/`).

## Features

- **Formel-Kaskade**
  1. Basis → Mifflin-St Jeor (± 10 %, bei Adipositas/Alter breiter)
  2. Umfänge → Navy-Methode, YMCA-Formel, Relative Fat Mass (schon die Taille allein hilft)
  3. Hautfalten (Caliper) → Jackson-Pollock **3-Punkt**, bei allen 7 Stellen automatisch **7-Punkt**, zusätzlich Durnin-Womersley (4 Stellen); selbst gemessen vs. von geübter Person
  4. Körperfettanteil direkt (DEXA, BodPod, Waage mit/ohne Handgriffe, Schätzung); bei Waagen Mittelwert aus mehreren Messungen
  5. Schilddrüse, Schwangerschaft/Stillzeit, Schlaf, Klima, Diät, Rauchen → Korrekturen mit zusätzlicher Unsicherheit
  6. **Gemessener Ruheumsatz** (indirekte Kalorimetrie, Labor oder Handgerät) → wird mit der Formelschätzung kombiniert
  7. Aktivität (PAL) → Gesamtumsatz
  8. Verlauf (Gewicht + kcal, ≥ 14 Tage) → tatsächlicher Gesamtumsatz, daraus der echte PAL
- Körperfettwerte werden in Methodengruppen (direkt, Umfänge, Hautfalten) kombiniert; innerhalb einer Gruppe vorsichtig, weil sie dieselben Fehlerquellen teilen
- **Genauigkeitsbalken** und pro Abschnitt eine Vorschau, wie stark er die Spanne verkleinert (z. B. „± 178 → ± 131 kcal“)
- **Erklärung**: Rechenweg Schritt für Schritt, Formelvergleich mit Gewichtung, Körperzusammensetzung, Hinweise, Vorschläge
- DSGVO: alles clientseitig, nur `localStorage`, keine Cookies/Tracking/externen Fonts
- SEO: statische Seiten je Sprache mit `hreflang`, FAQ + JSON-LD, Sitemap, Methodik-Seite mit Quellen
- PWA: Manifest + Service Worker (offline nutzbar, auf dem iPhone über „Zum Home-Bildschirm“ installierbar)

## Struktur

```
packages/core   Rechenlogik als geteiltes TS-Paket (@grundumsatz/core), inkl. Texte in 4 Sprachen, + Vitest-Tests
apps/web        Astro-Website (statisch), nutzt @grundumsatz/core
  src/i18n      Oberflächentexte (de, en, es, vi)
.github         GitHub-Actions-Workflow für GitHub Pages
```

## Befehle

```bash
npm install
npm run dev        # Entwicklungsserver (apps/web)
npm test           # Tests der Rechenlogik
npm run build      # Typecheck + statischer Build nach apps/web/dist
npm run preview    # Build lokal ansehen
```

## Deployment (GitHub Pages)

Jeder Push auf `main` baut die Seite und veröffentlicht sie über GitHub Pages (`.github/workflows/deploy.yml`). Domain und Basis-Pfad setzt der Workflow automatisch.

**Eigene Domain:** In den Repo-Einstellungen unter *Pages → Custom domain* eintragen und beim Domain-Anbieter einen CNAME-Eintrag auf `<user>.github.io` setzen. Der Workflow baut dann automatisch mit der Domain und dem Pfad `/`.

## Vor der öffentlichen Bewerbung

- Impressum und Datenschutz (`apps/web/src/pages/`) mit deinen Angaben ausfüllen – derzeit Platzhalter
- PNG-Icons (192/512 px) ergänzen für bessere PWA-Unterstützung

## Nächste Schritte

- Native App: `apps/web/dist` mit Capacitor verpacken (mit App-Funktion wie Apple-Health-Import, sonst lehnt Apple reine Web-Hüllen oft ab)
- Monetarisierung (Werbung/Affiliate) laut Konzept – dann Datenschutz und Consent anpassen
