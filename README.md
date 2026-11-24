# Ahrefs Group Buy — Astro + Pages CMS

Astro static website migrated from the supplied Next.js project and uploaded to this GitHub repository.

## Verified upload

- 34 original article JSON records with editable article sections and SEO fields
- 27 original article images plus other public assets
- Original Next.js article components preserved under `original-source/` as a migration reference
- Pages CMS configuration: `.pages.yml`
- Astro static pages, sitemap, robots and Cloudflare Pages output configuration
- GitHub Actions CI: `npm run verify` and `npm run build` passed after upload

## Cloudflare Pages setup

1. In Cloudflare, open **Workers & Pages → Create → Pages → Connect to Git**.
2. Select `seotoolsgroupbuyus-star/ahrefs`, branch `main`.
3. Framework preset **Astro**; build command `npm run build`; output directory `dist`.
4. Use Node.js 22 (environment variable `NODE_VERSION=22` if needed).
5. Preview first. Connect your custom domain only after link, image, SEO and design validation.
6. For Pages CMS, connect GitHub at https://pagescms.org and select this repo; the editor fields are in `.pages.yml`.

## IMPORTANT: Migration QA still required

- Source config uses `https://aherfsgroupbuy.com` (spelling preserved). Confirm this is the intended production domain before cutover.
- This is an editable Astro migration, **not a verified pixel-identical reproduction** of the Next.js homepage. Original React animations and interactive elements still require parity review.
- Pricing, purchase URLs, copy accuracy, privacy details and layout must be verified against the original site before production release.
- Cloudflare hosting and custom DNS deployment have **not** been performed; GitHub push and CI build **have** been verified.
