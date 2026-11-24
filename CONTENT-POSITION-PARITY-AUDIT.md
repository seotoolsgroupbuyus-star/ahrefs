# Ahrefs Group Buy — Original ZIP → Astro CMS content parity

Source of truth: uploaded `newahrefs-main(1).zip` and its 34 JSX article files preserved under `original-source/article-components/`.
Destination: `content/articles/*.json` rendered by Astro and edited through Pages CMS.
Checked: 2026-11-25 (Asia/Karachi).

## Result: original article content restored and verified

GitHub Actions commit `3761dc8dd1cb8122c2b62632aee4c9289fbdfeaa` passed **all three source-content validation scripts and the Astro build**:

- 34 JSX source article components compared with their 34 Astro CMS articles.
- 269 independently editable source-matched article sections.
- 2,218 paragraphs: normalized visible words match **in order, paragraph by paragraph**.
- 1,295 heading blocks: text matches **in order and level**.
- 27 original figures: image paths, order and their **previously missing captions** restored and matched.
- 110 source tables: headers, rows and **1,497 individual table cells** matched in order.
- 125 unordered lists: **569 individual bullet items** matched in order.
- Inline link occurrence counts and ordered/list structures checked.
- All 135 original `ArticleTable` / `BulletList` component occurrences restored, including nested bold text. 134 newly inserted, one previously present.
- Nine raw dynamic JSX comparison tables had empty bodies on migration; their data rows were restored from the original source arrays.

The tests normalize capitalization, punctuation, HTML tags, and whitespace when comparing *visible words*. These results **do not mean byte-for-byte JSX/HTML equality** or certify identical animation and styling. Source values are preserved in their semantic blocks and relative positions.

## How to verify again

Run `npm run verify:source-parity` or use GitHub Actions → **Check original ZIP word-by-word parity** → Run workflow. The underlying scripts are:

- `scripts/verify.mjs` — content structure and CMS safety checks
- `scripts/verify-word-parity.mjs` — paragraph, heading, figure, link, and block order
- `scripts/verify-table-data.mjs` — every source table cell and bullet item

The ordinary `npm run verify` and production builds **deliberately do not require content to stay identical to the original ZIP**, because Pages CMS users must be able to make intentional edits without causing a failed deployment. Use the separate source-parity audit when confirming migration baseline or investigating unintended changes.

## Beyond article-content parity

The homepage data (plans, prices, checkout URLs, FAQs, review copy, comparison, limitations and navigation) are imported into `content/site.json`, and many interface labels are now exposed in Pages CMS. Pixel-perfect visual styling, React animation equivalence, external CDNs, checkout gateway behavior, and live Cloudflare domain preview have not been certified against a browser rendering. Do not change production DNS until preview QA is complete.
