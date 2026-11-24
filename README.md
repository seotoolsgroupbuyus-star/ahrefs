# AhrefsGroupBuy — Astro + Pages CMS Migration

Site URL in supplied Next source: `https://aherfsgroupbuy.com` (spelling retained).

## Setup

1. Upload this folder as a new GitHub repository.
2. In Cloudflare Pages, **Connect to Git** and select the repository.
3. Build command: `npm run build`; output directory: `dist`; Node version 22.
4. Open [Pages CMS](https://pagescms.org/), connect GitHub, select this repository. `.pages.yml` exposes the homepage/settings and **34 articles**, including individually editable sections.
5. Run `npm install`, `npm run verify`, `npm run build` in CI before the domain cutover.
6. Set the domain in Cloudflare Pages and DNS only after checking the preview.

## Source fidelity and unfinished verification

- This is an **Astro editable-content migration draft**, not an exact 1:1 visual port of the Next.js application. The original React homepage has motion/interactive components that have not been ported; source files are under `original-source/` for comparison.
- Article HTML was extracted from TSX JSX to preserve article wording and images where statically representable. Dynamic JSX data, inline conditional branches, and interactions require manual side-by-side QA.
- Pricing and checkout links were copied from source and **must be verified** before live deployment; do not treat the promotional claims as verified.
- Privacy policy wording is extracted from the original React component into `content/privacy.json`; dynamic values and mapped list components need side-by-side QA before publishing.
- Cloudflare deployment and GitHub repository creation have **not** been performed from this artifact.
- Original site page titles/meta content were extracted from `src/config/site.ts`.
- Confirm canonical domain spelling with the site owner before DNS changes.
