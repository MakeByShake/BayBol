import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import { DV } from './src/config/dv.ts'
import { SITE } from './src/config/site.ts'
import { ru } from './src/i18n/ru.ts'

// ---------- SEO: title, description, schema.org, robots.txt, sitemap.xml — всё из config ----------

const fill = (s: string, vars: Record<string, string | number>) =>
  s.replace(/\{(\w+)\}/g, (_, k: string) => (k in vars ? String(vars[k]) : `{${k}}`))
const price = (n: number) => `${n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0')}\u00A0₸`
const escapeAttr = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

function seoPlugin(): Plugin {
  const vars = {
    price: price(SITE.prices.single),
    program: DV.programName,
    fee: DV.feeUsd,
    site: DV.officialSite.replace('https://', ''),
    payment: SITE.paymentMethods.ru,
  }
  const title = fill(ru.meta.title, vars)
  const description = fill(ru.meta.description, vars)

  const localBusiness = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: SITE.brand,
    legalName: SITE.company.legalName,
    description,
    url: `${SITE.url}/`,
    image: `${SITE.url}/og-image.png`,
    logo: `${SITE.url}/logo-mark.svg`,
    telephone: SITE.whatsapp.map((w) => `+${w.number}`),
    priceRange: `${price(SITE.prices.single)}`,
    currenciesAccepted: 'KZT',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'мкр. Аксай-4, д. 4',
      addressLocality: 'Алматы',
      addressRegion: 'Ауэзовский район',
      addressCountry: 'KZ',
    },
    openingHours: 'Mo-Sa 10:00-19:00',
    sameAs: [SITE.instagram.url],
  }
  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: ru.faq.items.map((it) => ({
      '@type': 'Question',
      name: fill(it.q, vars),
      acceptedAnswer: { '@type': 'Answer', text: fill(it.a, vars) },
    })),
  }
  const schema = [localBusiness, faqPage]
    .map((o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`)
    .join('\n    ')

  return {
    name: 'baybol-seo',
    transformIndexHtml(html, ctx) {
      if (!ctx.filename.endsWith('index.html')) return html
      return html
        .replace(/%SEO_TITLE%/g, escapeAttr(title))
        .replace(/%SEO_DESC%/g, escapeAttr(description))
        .replace(/%SITE_URL%/g, SITE.url)
        .replace(/<!-- %SEO_SCHEMA%[^>]*-->/, schema)
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\nDisallow: /logo-preview\n\nSitemap: ${SITE.url}/sitemap.xml\n`,
      })
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source:
          `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
          `  <url>\n    <loc>${SITE.url}/</loc>\n    <lastmod>${DV.factsCheckedAt}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n  </url>\n</urlset>\n`,
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), seoPlugin()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        logoPreview: resolve(import.meta.dirname, 'logo-preview.html'),
      },
    },
  },
})
