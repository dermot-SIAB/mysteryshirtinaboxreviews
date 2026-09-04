#!/usr/bin/env bash
# Tell Bing/Yandex/etc (IndexNow) about every URL in the live sitemap. Free, no account needed.
set -euo pipefail
HOST=mysteryshirtinaboxreviews.com
KEY=2a5b4d039f8857d8e1153122c2e4d6d9
urls=$(curl -sL "https://$HOST/sitemap.xml" | grep -o '<loc>[^<]*</loc>' | sed 's#</\?loc>##g')
[ -n "$urls" ] || { echo "no urls in sitemap"; exit 1; }
json=$(printf '%s\n' $urls | python3 -c 'import sys,json;print(json.dumps({"host":"'$HOST'","key":"'$KEY'","keyLocation":"https://'$HOST'/'$KEY'.txt","urlList":[l.strip() for l in sys.stdin if l.strip()]}))')
code=$(curl -s -o /tmp/indexnow.out -w '%{http_code}' -X POST https://api.indexnow.org/indexnow -H 'Content-Type: application/json; charset=utf-8' -d "$json")
echo "IndexNow: HTTP $code for $(printf '%s\n' $urls | wc -l | tr -d ' ') urls"
case "$code" in 200|202) exit 0;; *) cat /tmp/indexnow.out; exit 1;; esac
