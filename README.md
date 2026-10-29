# BMR Calculator (Grundumsatz-Rechner)

**Live:** https://grundumsatz-rechner.grundumsatz-web.workers.dev · [Deutsche Version](README.de.md)

A basal metabolic rate calculator that gets **more precise the more you tell it**, and shows a confidence range plus a step-by-step explanation instead of a single number. Web app and iOS app, available in German, English, Spanish and Vietnamese.

## Highlights

- **Formula cascade with uncertainty propagation**: starts with Mifflin-St Jeor (±10 %) and narrows the range as optional inputs are added: body circumferences (Navy, YMCA, Relative Fat Mass), skinfolds (Jackson-Pollock 3/7-site, Durnin-Womersley), direct body-fat measurements (DEXA, BodPod, scales), measured resting energy expenditure, activity level, and a weight/calorie log (≥ 14 days) that yields the actual total expenditure.
- **Method groups**: body-fat estimates are combined per method group, conservatively within a group because those methods share error sources.
- **Accuracy preview**: each input section shows how much it would shrink the range (e.g. "±178 → ±131 kcal").
- **Explainable result**: full calculation path, weighted formula comparison, body composition, hints.
- **Privacy by design**: everything runs client-side; no cookies, tracking or external fonts.
- **SEO and PWA**: static page per language with `hreflang`, FAQ with JSON-LD, sitemap, sources page; installable and usable offline.

## Tech stack

TypeScript monorepo (npm workspaces):

```
packages/core   calculation engine as shared TS package, texts in 4 languages, Vitest tests
apps/web        Astro static site using @grundumsatz/core
apps/mobile     iOS app: Capacitor shell around the website
.github         GitHub Actions: test, build, deploy
```

Hosted on Cloudflare Workers (static assets only). CI tests and builds every push to `main` and deploys automatically.

## Run locally

```bash
npm install
npm run dev      # dev server
npm test         # tests for the calculation engine
npm run build    # typecheck + static build
```

The product idea and its evaluation are in [concept.md](concept.md) (German).
