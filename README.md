# Ahrefs Group Buy — Astro + Pages CMS migration

This repository contains the Astro migration of the original Next.js site for `https://aherfsgroupbuy.com`, retaining source components in `original-source/` for comparison.

## Source and CMS
- Homepage data, navigation, plans, reviews, FAQ, and other editable settings: `content/site.json`
- 34 article JSON files: `content/articles/`
- CMS editor schema: `.pages.yml` (Pages CMS)
- Article illustrations and static assets: `public/`
- Canonical sitemap: `src/pages/sitemap.xml.js`
- Original article sources for content-parity checks: `original-source/article-components/`

## Deploy to the EXISTING Cloudflare Worker
The preview target is the existing Worker `ahrefs.digizoon7.workers.dev`, whose Worker service name is `ahrefs`. This is **Workers Static Assets**, not a Cloudflare Pages project.

- GitHub repository: `seotoolsgroupbuyus-star/ahrefs`, branch `main`
- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Root directory: `/`
- Output assets: `./dist` (from `wrangler.jsonc`)
- Worker name: `ahrefs` (from `wrangler.jsonc`)

Do not deploy as `ahrefs-astro-cms` or create another Worker. Keep the original production domain pointed at the existing live site until preview parity and payment links are approved.

## Verification
- `npm run verify` checks CMS structure, internal links, image references, payment links, sitemap/robots and homepage components.
- `npm run verify:source-parity` checks headings, paragraphs, inline links, images/captions, all article tables and lists against the original JSX sources.
- `npm run build` checks the Astro static build.
- The main GitHub workflow runs all three checks on every push or pull request.

**Passing CI does not prove pixel-identical rendering or a successful live Cloudflare deployment.** Before switching the custom domain, separately verify the old and new website on desktop and mobile, article URLs, pricing, buttons, image loading, SEO tags, robots and sitemap. Live visual comparison depends on accessible pages/screenshots.

## SEO and payment constraints
- Keep imported original SEO titles/descriptions and page copy unless the owner approves edits.
- The canonical website host is `https://aherfsgroupbuy.com`.
- Purchase/login paths must honor the configured payment host `https://pay.aherfsgroupbuy.com` rather than legacy cart URLs.
