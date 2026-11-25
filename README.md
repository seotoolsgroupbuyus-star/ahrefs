# Ahrefs Group Buy — Astro + Pages CMS

Astro static website migrated from the supplied Next.js project and uploaded to this GitHub repository.

## Verified upload

- 34 original article JSON records with editable article sections and SEO fields
- 27 original article images plus other public assets
- Original Next.js article components preserved under `original-source/` as a migration reference
- Pages CMS configuration: `.pages.yml`
- Astro static pages, sitemap, robots and Cloudflare Pages output configuration
- GitHub Actions CI: `npm run verify` and `npm run build` passed after upload

## Cloudflare Workers Static Assets (current deployment)

The existing Cloudflare project is a **Worker with Git-based Builds**, not a Pages project. This is supported for an Astro static website. The root `wrangler.jsonc` has been updated to use `assets.directory: "./dist"`, with no Worker `main` script required.

Use the existing Cloudflare Worker build settings:
- **Build command:** `npm run build`
- **Deploy command:** `npx wrangler deploy`
- **Root directory:** `/`

Wrangler now uploads `dist/` as Worker Static Assets. Do not use `wrangler pages deploy` or set up another Pages project for this Worker. The `name` in `wrangler.jsonc` is `ahrefs-astro-cms`; make sure this is the intended Worker name or change it to the existing Worker's name before publishing to avoid creating a different service. After a successful deploy, test the Worker URL first and then attach the production domain.

## Alternative: Cloudflare Pages (not used for current Worker deployment)

1. In Cloudflare, open **Workers & Pages → Create → Pages → Connect to Git**.
2. Select `seotoolsgroupbuyus-star/ahrefs`, branch `main`.
3. Framework preset **Astro**; build command `npm run build`; output directory `dist`.
4. Use Node.js 22 (environment variable `NODE_VERSION=22` if needed).
5. Preview first. Connect your custom domain only after link, image, SEO and design validation.
6. For Pages CMS, connect GitHub at https://pagescms.org and select this repo; the editor fields are in `.pages.yml`.

## Cloudflare deploy error — `npx wrangler deploy` (November 25, 2026)

Astro correctly builds static HTML into `dist/`. This repository's `wrangler.jsonc` contains `pages_build_output_dir: "./dist"`, which is a **Pages** deployment configuration. Running the generic Worker command `npx wrangler deploy` on this repository fails with `Missing entry-point to Worker script or to assets directory`.

For the preferred **Cloudflare Pages Git integration**:
- Create or use a **Pages** project under Workers & Pages (not a Worker project with Builds).
- Connect GitHub `seotoolsgroupbuyus-star/ahrefs` and branch `main`.
- Framework: Astro; **Build command**: `npm run build`; **Build output directory**: `dist`; root: repository root.
- Do **not** configure a generic `npx wrangler deploy` command. Pages Git integration publishes the `dist` output automatically.

If you are intentionally using a **custom CLI deployment for an existing Pages project**, the Pages CLI command is `npx wrangler pages deploy dist --project-name <EXACT_PAGES_PROJECT_NAME>` (replace the placeholder with the real Cloudflare Pages project name). Avoid running both the Pages Git integration deployment and a second CLI deployment for the same push.

A **Workers** Git-build project is a separate hosting choice; the Worker deploy command requires a `main` entry point or `assets.directory` in a Workers config. This repository is prepared for **Pages**, so do not add Worker entrypoints merely to suppress this mismatch.

## IMPORTANT: Migration QA still required

- Source config uses `https://aherfsgroupbuy.com` (spelling preserved). Confirm this is the intended production domain before cutover.
- This is an editable Astro migration, **not a verified pixel-identical reproduction** of the Next.js homepage. Original React animations and interactive elements still require parity review.
- Pricing, purchase URLs, copy accuracy, privacy details and layout must be verified against the original site before production release.
- Cloudflare hosting and custom DNS deployment have **not** been performed; GitHub push and CI build **have** been verified.
