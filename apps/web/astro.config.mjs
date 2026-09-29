import { defineConfig } from 'astro/config';

// SITE_URL und BASE_PATH werden beim Deployment gesetzt (siehe .github/workflows/deploy.yml).
// Mit eigener Domain: SITE_URL=https://deine-domain.de, BASE_PATH=/
const site = process.env.SITE_URL ?? 'https://grundumsatz-rechner.example';
const base = process.env.BASE_PATH ?? '/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  // App-Build (apps/mobile) landet in einem eigenen Ordner und stört den Web-Build nicht.
  outDir: process.env.APP_BUILD ? './dist-app' : './dist',
});
