# Ahrefs ZIP → Astro: remaining visual, feature, CMS and SEO parity audit

Baseline: original `newahrefs-main(1).zip` Next.js/React site (especially `src/components/reference-home/ReferenceStyleHome.tsx`, `src/components/Layout.tsx`, `src/components/Navbar.tsx`, `src/components/Footer.tsx`, `src/components/WhatsAppChatBox.tsx`, `src/next/DynamicSlugPage.tsx` and `src/app/layout.tsx`). Destination: this Astro/Pages CMS repository.

Last code comparison: 2026-11-25. Original 34 article texts and all 135 reusable table/list components previously passed the source-position audit documented in `CONTENT-POSITION-PARITY-AUDIT.md`.

## Restored, directly committed to GitHub

- Hero **How it Works** target restored to `/#limitations`, matching original action.
- Plan CTAs show **Buy Now**, matching original source, and (per requested business change) all point to `https://pay.aherfsgroupbuy.com`. Header Get Started also points to payment subdomain.
- Original pricing **Detailed Comparison** modal, comparing all three plan features, restored.
- Pricing **100% Risk-Free Guarantee / Cheapest Options, Zero Hidden Costs**, and **Why Choose Yearly?** content restored after pricing.
- Toolbar section restored with prominent working **Start Using Ahrefs Bar** payment link, customer avatars and an illustrative SERP metrics browser preview.
- Source **View all 25+ tools** modal now includes editable labels, a searchable list, and logo/favicons/initials fallback. The list is derived from the CMS Power plan tools, as in original.
- Original mobile-vs-desktop price comparison display restored with mobile cards and **See pricing** link.
- Home tool cards now use their CMS `color` field for backgrounds (previously field was editable but not rendered).
- Original split/highlight treatment for **at 90% Off** restored with an editable accent.
- Branded Ahrefs logo mark and two-line text in site header, source-style navy footer columns, and a functional floating WhatsApp widget with editable message text.
- Source-style transparent home nav that becomes solid on scroll. Article routes retain a light navbar.
- Article layout now has right-side table of contents and an editable CMS author bio card after the content.
- Google verification tag, theme color, Apple touch icon and Twitter image meta restored. CMS now exposes SEO verification/theme/OG image.
- CI now validates published CMS article links, all plan payment URLs and rejects old `members.buyseo.org` purchase destinations.

## Known remaining *intentional or unverified* differences

1. Source uses Framer Motion transitions, precise Tailwind spacing, icon paths and a mobile full-screen animated slide-over. Astro approximates these with responsive CSS/native dialogs; **pixel-level identity remains unverified** without side-by-side browser screenshots.
2. Source `SocialProof.tsx` displays **preset (not real-time verified) purchases** labelled “Verified Purchase.” This was **not reproduced**; showing them as real transactions without an authentic events source would be misleading.
3. Source footer's Twitter/Facebook/LinkedIn targets are `#` placeholders. These dead social links were **not reproduced**; add actual approved destinations in CMS before displaying.
4. Original **Write a review** button had no onClick/navigation; it was **not copied as a misleading inert button**.
5. Original **Start Using Ahrefs Bar** button was also inert; it now links to the configured pay subdomain, deliberately improving functionality over the original.
6. Original source generates per-article publication dates algorithmically. Astro preserves CMS-editable date fields but does **not auto-invent historical publication dates**. This differs from the source UI unless dates are explicitly supplied.
7. Featured tool icons still request Simple Icons and Google favicons online when no local media is configured, consistent with the source fallback approach. Bundle brand-owned assets in CMS if external dependencies must be removed.
8. Neither public `aherfsgroupbuy.com` nor `pay.aherfsgroupbuy.com` could be opened from the available external browser fetch; do **not** claim live preview, DNS readiness, Stripe/aMember checkout success, pixel-perfect visuals or production deployment. GitHub Actions build is source-code validation only.
9. Original home review section includes decorative Trustpilot stars. Astro's review text cards are present; **unverified third-party endorsements/badges** were not added as factual claims.

## CMS fields

Restored text and links are in `content/site.json`, with matching `.pages.yml` editor fields. Page content is not hardcoded for the restored homepage sections, chat copy, SEO tag, logo captions, tool search, comparison rows or plans. CSS layout/behavior remains code-owned, which is distinct from editable content.

## Testing

`npm run verify` — site structure, no legacy checkout, internal CMS links, and shared label references.
`npm run build` — Astro static generation.
`npm run verify:source-parity` — separate **original ZIP baseline comparison** for article paragraphs, headings, tables, lists and image captions. This audit is separate by design so intentional CMS edits do not break regular deployments.
