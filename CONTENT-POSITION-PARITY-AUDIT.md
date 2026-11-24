# Original ZIP → Astro: exact text-position verification (2026-11-25)

Source archive: `newahrefs-main(1).zip`; destination: `content/articles/*.json`.

## Verification method
The source files were parsed as TypeScript/JSX. For simple articles, visible JSX text nodes were normalized into a sequential word stream; the same word stream was extracted from Astro article headings and rich-text HTML. The normalized streams were compared using ordered token fingerprints (FNV-1a), not only word counts. Punctuation, case and whitespace were excluded. This is *not* byte-for-byte HTML equality.

## 22 articles with identical normalized word order
- ahrefs-group-buy-guide
- what-is-ahrefs-group-buy
- is-ahrefs-group-buy-worth-it
- ahrefs-group-buy-review
- pros-and-cons-of-ahrefs-group-buy
- ahrefs-group-buy-for-beginners
- why-search-for-ahrefs-group-buy
- ahrefs-group-buy-risks
- account-bans-prevention
- ahrefs-alternative-list
- ahrefs-group-buy-limitations
- ahrefs-monthly-price-breakdown
- best-cheap-ahrefs-options
- best-plan-instead-of-ahrefs-group-buy
- best-seo-tool-alternatives
- common-group-buy-problems
- daily-report-limits
- group-buy-vs-ahrefs-starter
- is-ahrefs-group-buy-safe
- is-ahrefs-starter-better
- low-cost-seo-tools
- no-projects-limitation

## 12 articles require full JSX expression/component parity audit
The initial source text extractor ignores template-literal JSX expressions and composite components; therefore *a mismatch in its aggregate hash is not proof that the prose is missing*. Verify each paragraph and position together with their embedded lists and tables:
- ahrefs-cost-comparison
- ahrefs-group-buy-pricing
- ahrefs-group-buy-reddit-reviews
- ahrefs-group-buy-scam-or-legit
- best-ahrefs-group-buy-provider
- cheap-ahrefs-access-guide
- cheap-ahrefs-group-buy-price
- group-buy-vs-official-ahrefs
- how-to-choose-ahrefs-provider
- uptime-guarantee-comparison
- provider-review-guide
- trusted-ahrefs-group-buy-sites

## Confirmed composite component gap
In the original ZIP, the article components explicitly contain the following occurrences (excluding component definitions):
| Article | ArticleTable | BulletList |
|---|---:|---:|
| ahrefs-cost-comparison | 8 | 7 |
| ahrefs-group-buy-pricing | 9 | 7 |
| ahrefs-group-buy-reddit-reviews | 7 | 7 |
| ahrefs-monthly-price-breakdown | 3 | 1 |
| best-cheap-ahrefs-options | 3 | 1 |
| cheap-ahrefs-access-guide | 7 | 7 |
| cheap-ahrefs-group-buy-price | 7 | 6 |
| group-buy-vs-official-ahrefs | 12 | 19 |
| low-cost-seo-tools | 0 | 6 |

**Confirmed example:** the original `ahrefs-group-buy-pricing` article includes a two-column 'Ahrefs plan / Listed monthly price' table after the paragraph 'Here is a simple official pricing summary'. The migrated article did not include this table. That first table was restored in the original location in commit `ba297538`. The remaining composite tables and lists have **not** been confirmed restored.

## Completion requirement
Before production, verify *every original visible word and composite component in the same relative order* on all 34 articles. A zero-text-loss test alone does not catch missing table rows, list items, image captions, layout components, or interactive UI. Do not mark exact parity complete until those are checked.
