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

## Deployment (Cloudflare Pages)

Das Repo ist privat; gehostet wird kostenlos über Cloudflare Pages (Projekt `grundumsatz-rechner`).

**Manuell (lokal):** einmalig `npx wrangler login`, danach

```bash
npm run deploy     # Tests → Build → Upload zu Cloudflare Pages
```

**Automatisch bei jedem Push auf `main`:** Der Workflow `.github/workflows/deploy.yml` testet und baut immer. Er deployt zusätzlich, sobald im GitHub-Repo zwei Secrets gesetzt sind:

1. Im Cloudflare-Dashboard unter *My Profile → API Tokens → Create Token* die Vorlage „Edit Cloudflare Workers“ wählen (enthält *Cloudflare Pages: Edit*).
2. `gh secret set CLOUDFLARE_API_TOKEN` und `gh secret set CLOUDFLARE_ACCOUNT_ID` (Account-ID steht in `npx wrangler whoami`).

**Eigene Domain:** In Cloudflare unter *Workers & Pages → grundumsatz-rechner → Custom domains* hinzufügen, dann `gh variable set SITE_URL --body https://deine-domain.de` (für Canonical-URLs und Sitemap) und beim lokalen Deploy `SITE_URL=https://deine-domain.de npm run deploy`.

## Vor der öffentlichen Bewerbung

- Impressum und Datenschutz (`apps/web/src/pages/`) mit deinen Angaben ausfüllen – derzeit Platzhalter
- PNG-Icons (192/512 px) ergänzen für bessere PWA-Unterstützung

## Nächste Schritte

- Native App: `apps/web/dist` mit Capacitor verpacken (mit App-Funktion wie Apple-Health-Import, sonst lehnt Apple reine Web-Hüllen oft ab)
- Monetarisierung (Werbung/Affiliate) laut Konzept – dann Datenschutz und Consent anpassen
