import type { APIRoute } from 'astro';
import { LOCALE_ORDER, asset, localePath } from '../i18n';

export const GET: APIRoute = ({ site }) => {
  const localized = ['', 'methodik/'].flatMap((page) => {
    const alts = LOCALE_ORDER.map((l) => ({ l, href: new URL(localePath(l, page), site).href }));
    return alts.map(
      ({ href }) =>
        `  <url><loc>${href}</loc>${alts.map((a) => `<xhtml:link rel="alternate" hreflang="${a.l}" href="${a.href}"/>`).join('')}</url>`,
    );
  });
  const legal = ['datenschutz/', 'impressum/'].map((p) => `  <url><loc>${new URL(asset(p), site).href}</loc></url>`);
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${[...localized, ...legal].join('\n')}
</urlset>
`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
};
