import { defineConfig } from 'astro/config';

// `site` bei Veröffentlichung auf die echte Domain setzen (für Canonical-URLs und Sitemap).
export default defineConfig({
  site: 'https://grundumsatz-rechner.example',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
});
