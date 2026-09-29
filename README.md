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
apps/mobile     iOS-App: Capacitor-Hülle um die Website (ios/ = Xcode-Projekt)
.github         GitHub-Actions-Workflow (Tests, Build, optional Deploy)
```

## Befehle

```bash
npm install
npm run dev        # Entwicklungsserver (apps/web)
npm test           # Tests der Rechenlogik
npm run build      # Typecheck + statischer Build nach apps/web/dist
npm run preview    # Build lokal ansehen
```

## Deployment (Cloudflare)

Live: **https://grundumsatz-rechner.grundumsatz-web.workers.dev**

Das Repo ist privat; gehostet wird kostenlos auf Cloudflare als Worker, der nur statische Dateien ausliefert (`apps/web/wrangler.jsonc`, kein Server-Code).

**Manuell (lokal):** einmalig `npx wrangler login`, danach

```bash
npm run deploy     # Tests → Build → Upload zu Cloudflare
```

**Automatisch bei jedem Push auf `main`:** Der Workflow `.github/workflows/deploy.yml` testet und baut immer. Er deployt zusätzlich, sobald im GitHub-Repo zwei Secrets gesetzt sind:

1. Im Cloudflare-Dashboard unter *My Profile → API Tokens → Create Token* die Vorlage „Edit Cloudflare Workers“ wählen.
2. `gh secret set CLOUDFLARE_API_TOKEN` und `gh secret set CLOUDFLARE_ACCOUNT_ID` (Account-ID steht in `npx wrangler whoami`).

**Eigene Domain:** In Cloudflare unter *Workers & Pages → grundumsatz-rechner → Settings → Domains & Routes* hinzufügen, dann `gh variable set SITE_URL --body https://deine-domain.de` (für Canonical-URLs und Sitemap) und lokal `SITE_URL=https://deine-domain.de npm run deploy`.

**Achtung:** `wrangler` nicht im Repo-Wurzelordner ohne Konfiguration starten – die automatische Einrichtung baut sonst die Astro-Konfiguration auf einen Server-Adapter um.

## iOS-App

Die App ist dieselbe Website in einer nativen Hülle (Capacitor, Swift Package Manager – kein CocoaPods nötig). Sie läuft komplett offline, speichert lokal und wählt beim ersten Start die Gerätesprache (Deutsch, Englisch, Spanisch, Vietnamesisch; sonst Deutsch). Die Wahl im Sprachumschalter wird gemerkt. Der CSV-Export öffnet das iOS-Teilen-Menü.

```bash
npm run ios:sim    # baut für den Simulator ("iPhone 17e", anderes Gerät: DEVICE="iPhone 18 Pro" npm run ios:sim)
npm run ios:ipa    # baut apps/mobile/dist/Grundumsatz.ipa (unsigniert, für LiveContainer)
```

**Aufs iPhone über LiveContainer:** `apps/mobile/dist/Grundumsatz.ipa` über **iCloud Drive** aufs iPhone bringen (nicht per AirDrop – iOS versucht sonst, die unsignierte IPA selbst zu installieren) → LiveContainer → „+“ → IPA wählen. Updates: neu bauen und genauso importieren.

**Aufbau des App-Builds:** `apps/mobile/scripts/sync.sh` baut die Website mit `PUBLIC_APP=1` in `apps/web/dist-app`. Dort enden Links auf `index.html` (Capacitor liefert Pfade ohne Dateiendung sonst immer als Startseite aus) und `AppShell.astro` ist eingebunden (Sprachwahl, Teilen-Menü, Safe-Area). Auf der Website steckt davon nichts. Danach kopiert `cap sync` die Dateien ins Xcode-Projekt.

**App Store / TestFlight (später):** Apple-Developer-Konto (99 $/Jahr) in Xcode hinterlegen (`npm run ios:open -w @grundumsatz/mobile`, dann Signing & Capabilities), Version in Xcode erhöhen, Archive erstellen. Bundle-ID: `com.philipphoang.grundumsatz`, Export-Compliance ist gesetzt. Apple lehnt reine Web-Hüllen oft ab (Richtlinie 4.2) – dann eine native Funktion ergänzen, z. B. tägliche Wiege-Erinnerung (Local Notifications) oder Apple-Health-Import.

## Vor der öffentlichen Bewerbung

- Impressum und Datenschutz (`apps/web/src/pages/`) mit deinen Angaben ausfüllen – derzeit Platzhalter
- PNG-Icons (192/512 px) ergänzen für bessere PWA-Unterstützung

## Nächste Schritte

- Native Zusatzfunktion für den App Store (Wiege-Erinnerung, Apple-Health-Import, Widget)
- Monetarisierung (Werbung/Affiliate) laut Konzept – dann Datenschutz und Consent anpassen
