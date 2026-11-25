# Ahrefs Migration Parity Audit — 26 November 2026

**Compared:** archived `original-source/` Next.js article components / site metadata / marketing data versus current Astro + Pages CMS source and generated `dist/` output.  
**Repository:** `seotoolsgroupbuyus-star/ahrefs`.  
**CI verification:** https://github.com/seotoolsgroupbuyus-star/ahrefs/actions/runs/45705339518

## Source-to-Astro parity checks (PASS)

| Area | Source-backed result |
| --- | --- |
| Article URLs | 34 matching original slugs |
| Word order | 2,218 paragraphs and 1,295 headings in the original order |
| Literal capitalization and punctuation | 2,421 static paragraphs / H3-H4 blocks equal after HTML-entity and whitespace normalization |
| JSX dynamic blocks | 823 not subject to literal-only comparison; covered in part by word-order, links, table and list checks |
| Data tables | 110 tables, 1,497 cells match original values and order |
| Lists | 125 lists, 569 bullet items match original content/order |
| Figures | 27 image references and captions match archived source |
| Exact SEO metadata | 34 H1s, SEO titles, meta descriptions, page slugs, clusters, pillar flags and parent relationships match archived original `site.ts` |
| Homepage marketing records | Original 3 plans, prices, tool strip, comparison, feature lists, limitations, exchange rate, coupon and hero marketing source values match |
| CMS | All currently defined CMS site/interface fields are surfaced; no unused homepage label fields; 34 article JSONs and image media collections configured |
| Editing simulation | Building with temporary edits to pricing title, review platform, price, logo and article title rendered modified values correctly; original files restored |
| Original article order | The five editorial clusters, pillars and supporting-page sequence are restored in `content/site.json` and editable in Pages CMS |

## Generated site audit (PASS)

- Static output includes homepage, Privacy Policy and all 34 published article URLs.
- 269 generated article sections, 27 article images, 56 internal article links, source text and section headings verified.
- Article SEO titles, descriptions, H1s, canonical URLs, index/follow tags, BreadcrumbList markup, `sitemap.xml` (36 URLs) and `robots.txt` validated.
- Astro production build and GitHub CI pass.

## Explicitly intentional differences

- Checkout buttons use `https://pay.aherfsgroupbuy.com` directly, as requested, rather than original legacy checkout routes.
- Content is read from editable CMS JSON instead of original Next.js hardcoded code.
- CSS, animation, component behavior and layout implementation remain code-controlled; editing wording does not require changing them.

## What these tests do NOT claim

- **Live original site:** `aherfsgroupbuy.com` declined/blocked direct automated retrieval during this audit, so production live-server DOM, screenshot and HTTP behavior cannot be certified against the archived source.
- **Pixel-perfect visual layout:** source content parity and successful generated output do not prove exact rendered pixel parity with the live Next.js site.
- **Manually signed-in CMS editing:** build-time JSON mutation tests pass; browser-based authenticated Pages CMS save/publish and Cloudflare deployment are separate release checks.
- **Exact non-text asset bytes:** the 27 archived article image references resolve in the built output; byte-level image identity with the original live server was not measured.
- **JSX dynamic blocks:** 823 dynamic JSX cases were not individually matched with the strict literal punctuation checker, although normalized word/order, links and data structures have dedicated checks.

## Ongoing Pages CMS editing and audit workflow

- Normal GitHub push verification checks content integrity, internal links, CMS bindings, edited-page rendering, generated SEO tags/sitemap, Astro build. It does **not** require content to remain word-for-word equal to the historical Next.js snapshot after an editor intentionally changes content.
- Strict archived-source comparisons remain available through the **Check original ZIP word-by-word parity** manually dispatched GitHub Action. These checks passed during this migration audit, but will intentionally flag later editorial updates when rerun.
- Existing hero CTA URLs are CMS-editable and may route to a valid local section or HTTPS URL. Pricing Buy Now destinations are still enforced to the direct `pay.aherfsgroupbuy.com` root.

No original SEO titles/descriptions or pricing were changed by this audit.
