# Ahrefs website — Next.js → Astro / Pages CMS audit

Source website: https://aherfsgroupbuy.com/  
Source code: supplied `newahrefs-main.zip` (Next.js/React).  
Target: this repository (Astro + Pages CMS).  
Date: 2026-11-25 (Pakistan time).

## Changes verified in code

| Check | Status | Evidence |
|---|---|---|
| Original article routes | Imported | 34 `content/articles/*.json` records |
| Article CMS editing | Present | Editable SEO + 269 article sections |
| Article images | Present | 27 bundled PNG images; no broken local `/images/` references identified in migrated article HTML |
| Sitemap and canonical paths | Configured | `src/pages/sitemap.xml.js` and Base layout |
| Indexability | Configured | `index,follow` public article pages |
| Robots crawler policy | Source-matched | `src/pages/robots.txt.js` matches Next.js crawler exclusions |
| Homepage plans | Restored | 3 source plans; USD $5/$22/$35 monthly; annual prices sourced from original code |
| Currency selector | Implemented | USD/PKR with source-supplied 280 conversion rate |
| Homepage comparison | Restored | 12 rows |
| Homepage tools | Restored | 8 featured tools and 5-tool strip |
| Limitations | Restored | 4 cards |
| FAQ | Restored | 10 questions/answers |
| Reviews | Restored | 8 source testimonials and avatar references |
| Privacy policy | Restored | 10 sections from source Privacy.tsx (replacing placeholder) |
| Header / footer | Improved | Source-style anchor navigation, Get Started CTA and WhatsApp support |
| CMS home settings | Expanded | Plans, FAQs, reviews, comparison, tools, limitations, navigation, CTA, footer |

## What is NOT yet confirmed as exact

1. **Pixel-perfect visual parity:** The original React/motion transitions, pricing card styling, tool logo treatments, all responsive states and animation effects have not been verified side by side in a deployed Astro preview.
2. **Word-by-word article parity:** The 34 JSX originals were converted to HTML sections. The migration report has per-article token/word estimates, which are not proof of literal text identity, particularly for JSX dynamic output, tables and interactive components.
3. **External services and business claims:** Review counts, uptime, customer counts, discount claims and checkout/payment options were copied from source, not independently validated. The original checkout URLs point at `members.buyseo.org`; they were not silently changed.
4. **Live HTTP checks:** The old website's `/robots.txt`, `/sitemap.xml`, individual article responses, redirects and live headers could not all be retrieved through the available web crawler. Live production remains untouched.
5. **Images on homepage:** The original React site loads tool logos from third-party icon/favicons URLs. The Astro homepage currently uses local initials rather than exact original logos; that is a visual mismatch.
6. **Cloudflare cutover:** This repo builds in CI, but was not deployed to Cloudflare custom domain. Deploy to a preview domain and compare before connecting production DNS.

## Deployment gate

Do not switch the live domain until all of these are checked:
- Build green on current branch after each edit.
- Preview all 34 articles + home + privacy (HTTP 200), images loaded, canonical self-ref, sitemap valid.
- All primary/secondary CTAs, plan checkout links, billing/currency toggles, FAQ details and responsive navigation.
- Screenshot comparisons desktop/mobile against the original production site.
- SEO title, meta description, canonical, robots, JSON-LD, OG tags, indexability and sitemap consistency.
- Redirect inventory if any slug changes are made.

## Repeatable code verification

Run `npm run verify && npm run build`. GitHub Actions executes both on every push. These tests cover files and configured content; they do **not** simulate a browser, payment gateway, or real Cloudflare deployment.
