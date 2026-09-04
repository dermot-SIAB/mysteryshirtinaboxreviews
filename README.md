# mysteryshirtinaboxreviews.com

A static reviews hub for Mystery Shirt in a Box. Openly run by the company. Every
quote is a real Trustpilot review, copied word for word, attributed and linked to
its source. The overall Trustpilot score (including critical reviews) is shown on
every page. No AggregateRating or Review structured data is published.

## Layout

- `content/reviews.json` — the review corpus plus the Trustpilot snapshot. Add new
  reviews here; nothing else needs to change.
- `content/site.mjs` — site config, navigation, and hand-written page copy.
- `scripts/build.mjs` — dependency-free static site generator → `dist/`. Long review
  lists paginate at 60 per page under `/page/N/`.
- `scripts/csv-to-json.mjs` — turn a Trustpilot (or Loox / Judge.me / Okendo) review
  CSV export into the JSON shape `scripts/ingest.mjs` expects. Header names are matched
  loosely, so most platforms' exports work unedited.
- `scripts/ingest.mjs` — merge pulled reviews into `content/reviews.json`. Dedupes,
  auto-tags topics, assigns stable ids, and preserves existing entries and hand tags.
- `scripts/verify-ratings.mjs` — cross-check every published rating against the raw
  pulls, because Trustpilot does not reliably honour its own `?stars=` filter.
- `scripts/refresh.sh` — the whole path in one command: convert → ingest → verify →
  test → commit → push.
- `scripts/indexnow.sh` — ping IndexNow (Bing, Yandex) with every URL in the live sitemap.
- `scripts/serve.mjs` — tiny static server for local checks.
- `static/` — favicons, OG image, and the IndexNow key file, copied into `dist/` as-is.
- `tests/` — 10 checks: data integrity, metadata limits, link check, schema and claims
  guards, the pagination chain, and every review appearing exactly as written.
- `.github/workflows/pages.yml` — build + deploy to GitHub Pages on push to main.

## Build modes

| Mode | When | Effect |
|---|---|---|
| `preview` (default) | before the domain is live | served at the github.io project URL, `noindex`, robots disallow |
| `live` | after DNS points at Pages | served at the custom domain, indexable |

Set the repository variable `SITE_MODE=live` and add a `CNAME` file to cut over.

## Commands

```bash
npm test
npm run build:preview   # or build:live
npm run serve           # http://localhost:8787
```

## Adding reviews

### One at a time

Copy the review exactly as written on Trustpilot (typos included), with the
reviewer display name, country code, publication date, rating (4 or 5 only) and
topics. Update the `source` snapshot (score, count, breakdown, captured date) at
the same time. Run `npm test`, commit, push. The site rebuilds itself.

### In bulk (owner CSV export)

Drop the CSV export (or pulled JSON) into a folder and run one command. It converts
any CSVs, merges and dedupes them, verifies the ratings against the raw pulls, runs
the tests, then commits and pushes only if everything passes.

```bash
bash scripts/refresh.sh <folder> --snapshot 3.7,2502,57,10,3,3,27
```

`--snapshot` is the current Trustpilot header figures in the order
`SCORE,COUNT,P5,P4,P3,P2,P1`. Add `--no-push` to commit locally without publishing.
Re-running is safe; duplicates are merged.
