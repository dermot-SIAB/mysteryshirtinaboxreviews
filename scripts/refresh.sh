#!/usr/bin/env bash
# One command to take a folder of review data (CSV exports and/or pulled JSON),
# publish it, and prove it is sound. Safe to re-run; duplicates are merged.
#
#   bash scripts/refresh.sh <folder> [--snapshot SCORE,COUNT,P5,P4,P3,P2,P1] [--no-push]
#
# Example:
#   bash scripts/refresh.sh ../../companies/shirt-in-a-box/projects/reviews-site/import --snapshot 3.7,2502,57,10,3,3,27
set -euo pipefail
cd "$(dirname "$0")/.."

SRC="${1:-}"
[ -n "$SRC" ] && [ -d "$SRC" ] || { echo "usage: bash scripts/refresh.sh <folder> [--snapshot ...] [--no-push]"; exit 1; }
shift
SNAPSHOT=""; PUSH=1
while [ $# -gt 0 ]; do
  case "$1" in
    --snapshot) SNAPSHOT="$2"; shift 2 ;;
    --snapshot=*) SNAPSHOT="${1#*=}"; shift ;;
    --no-push) PUSH=0; shift ;;
    *) echo "unknown option: $1"; exit 1 ;;
  esac
done

echo "==> converting any CSV exports in $SRC"
shopt -s nullglob nocaseglob
found_csv=0
for csv in "$SRC"/*.csv; do
  found_csv=1
  echo "    $(basename "$csv")"
  node scripts/csv-to-json.mjs "$csv" "${csv%.*}.json"
done
[ "$found_csv" -eq 0 ] && echo "    (none)"
shopt -u nocaseglob

echo "==> ingesting"
if [ -n "$SNAPSHOT" ]; then node scripts/ingest.mjs "$SRC" --snapshot "$SNAPSHOT"; else node scripts/ingest.mjs "$SRC"; fi

echo "==> verifying ratings against the raw pulls"
node scripts/verify-ratings.mjs "$SRC" || { echo "RATING MISMATCH — not publishing. Re-run with --fix once reviewed."; exit 1; }

echo "==> tests"
npm test --silent >/tmp/reviews-refresh-test.log 2>&1 || { echo "TESTS FAILED — not publishing:"; tail -30 /tmp/reviews-refresh-test.log; exit 1; }
grep -E '^# (pass|fail)' /tmp/reviews-refresh-test.log || true

if git diff --quiet -- content/reviews.json; then
  echo "==> no change to the review corpus; nothing to publish"; exit 0
fi
COUNT=$(node -e "console.log(require('./content/reviews.json').reviews.length)")
echo "==> publishing ($COUNT reviews)"
git add content/reviews.json
git commit -q -m "Review refresh: ${COUNT} published reviews" -m "Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>"
if [ "$PUSH" -eq 1 ]; then
  git pull -q --rebase && git push -q
  echo "==> pushed; GitHub Actions will rebuild and deploy"
else
  echo "==> committed locally (--no-push)"
fi
