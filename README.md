# mysteryshirtinaboxreviews.com

A static reviews hub for Mystery Shirt in a Box. Openly run by the company. Every
quote is a real Trustpilot review, copied word for word, attributed and linked to
its source. The overall Trustpilot score (including critical reviews) is shown on
every page. No AggregateRating or Review structured data is published.

## Layout

- `content/reviews.json` — the review corpus plus the Trustpilot snapshot. Add new
  reviews here; nothing else needs to change.
- `content/site.mjs` — site config, navigation, and hand-written page copy.
- `scripts/build.mjs` — dependency-free static site generator → `dist/`.
- `tests/` — data integrity, metadata limits, link check, schema and claims guards.
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

Copy the review exactly as written on Trustpilot (typos included), with the
reviewer display name, country code, publication date, rating (4 or 5 only) and
topics. Update the `source` snapshot (score, count, breakdown, captured date) at
the same time. Run `npm test`, commit, push. The site rebuilds itself.
