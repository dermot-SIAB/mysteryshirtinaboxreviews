// Merge freshly pulled Trustpilot reviews into content/reviews.json.
// Usage: node scripts/ingest.mjs <dir-of-json-arrays> [--snapshot score,count,p5,p4,p3,p2,p1]
// Dedupes, auto-tags topics, assigns stable ids, preserves existing entries and their hand tags.
import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REVIEWS = path.join(ROOT, 'content/reviews.json');
const srcDir = process.argv[2];
if (!srcDir) { console.error('usage: node scripts/ingest.mjs <dir> [--snapshot s,c,p5,p4,p3,p2,p1]'); process.exit(1); }

// Reviewers whose reviews must never be republished (fairness / provenance).
// Keep in step with tests/reviews.test.mjs.
// Specific reviews the company review bank marks as not-for-republication.
// Matched on display name AND a text fragment, so an unrelated reviewer who
// happens to share a common first name is never dropped.
const EXCLUDED_REVIEWS = [
  { name: 'DAVID DUMMACKIN', contains: 'mental health' },
  { name: 'Nicole', contains: 'sustainable Thursday' },
  { name: 'Gary', contains: 'AI generated' },
  { name: 'Darren Hands', contains: 'basketball vests' },
];
// Phrases that mean "do not republish this one": personal circumstances, prize wins,
// or content that reads as a complaint even at 4 stars.
const EXCLUDE_TEXT = [
  /mental health/i, /bereave/i, /passed away/i, /cancer/i, /hospital/i, /depress/i,
  /\bi won\b/i, /giveaway/i, /free prize/i, /competition win/i,
];

const TOPIC_RULES = [
  ['rugby', /rugby/i],
  ['basketball', /basketball|\bvest/i],
  ['football', /football|soccer|jersey|\bkit\b|\bstrip\b|premier league/i],
  ['delivery', /deliver|arriv|dispatch|postage|post office|tracking|tracked|royal mail|quick|fast|prompt|next day|on time|2 days|48 ?h/i],
  ['service', /service|support|helpful|email|replied|reply|respond|response|contact|sorted|resolve|polite|communicat/i],
  ['exchange', /exchang|return|swap|refund|size|sizing|too small|too big|too tight|fit\b|fitted|larger|xxl|5xl/i],
  ['quality', /quality|top notch|well made|material|print|stitch|belter|class\b|fantastic shirt|good shirt|nice shirt/i],
  ['gift', /gift|present|christmas|xmas|birthday|\bson\b|daughter|husband|\bwife\b|partner|godson|son in law|\bdad\b|father|nephew|grandson/i],
  ['subscription', /subscri|monthly|every (three|3) months|quarterly|next one|next shirt|next box|next jersey|renew|cancel|first box|second box|third shirt/i],
  ['value', /price|pricing|value|cheap|worth|money|expensive|bargain|\bcost/i],
  ['legit', /legit|scam|genuine|authentic|\bfake|real deal/i],
  ['mystery', /mystery|random|surprise|obscure|never heard|unique|lesser known|out of left field/i],
];

const norm = s => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const tag = (title, text) => {
  const hay = `${title} ${text}`;
  const topics = TOPIC_RULES.filter(([, re]) => re.test(hay)).map(([t]) => t);
  if (topics.includes('rugby')) { const i = topics.indexOf('football'); if (i > -1) topics.splice(i, 1); }
  return topics.length ? topics : ['general'];
};

const db = JSON.parse(await readFile(REVIEWS, 'utf8'));
const seen = new Map();                                  // dedupe key -> review
for (const r of db.reviews) seen.set(`${norm(r.name)}|${norm(r.text).slice(0, 80)}`, r);
const before = db.reviews.length;

let scanned = 0, skippedDup = 0, skippedRule = 0, added = 0;
const files = (await readdir(srcDir)).filter(f => f.endsWith('.json')).sort();
for (const f of files) {
  let batch;
  try { batch = JSON.parse(await readFile(path.join(srcDir, f), 'utf8')); }
  catch (err) { console.error(`SKIP ${f}: ${err.message}`); continue; }
  if (!Array.isArray(batch)) { console.error(`SKIP ${f}: not an array`); continue; }
  for (const raw of batch) {
    scanned++;
    const name = (raw.name || '').trim();
    const text = (raw.text || '').trim();
    const title = (raw.title || '').trim();
    if (!name || !text || !raw.date || ![4, 5].includes(Number(raw.rating))) { skippedRule++; continue; }
    if (text.length < 10) { skippedRule++; continue; }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(raw.date) || new Date(raw.date) > new Date()) { skippedRule++; continue; }
    if (EXCLUDED_REVIEWS.some(x => x.name === name && text.includes(x.contains))) { skippedRule++; continue; }
    if (EXCLUDE_TEXT.some(re => re.test(text))) { skippedRule++; continue; }
    const key = `${norm(name)}|${norm(text).slice(0, 80)}`;
    if (seen.has(key)) { skippedDup++; continue; }
    seen.set(key, {
      id: '', name, country: /^[A-Z]{2}$/.test(raw.country || '') && raw.country !== 'XX' ? raw.country : 'GB',
      date: raw.date, rating: Number(raw.rating), title: title || text.slice(0, 60), text,
      topics: tag(title, text),
    });
    added++;
  }
}

// Newest first, then stable sequential ids.
const merged = [...seen.values()].sort((a, b) => b.date.localeCompare(a.date) || norm(a.name).localeCompare(norm(b.name)));
merged.forEach((r, i) => { r.id = 'r' + String(i + 1).padStart(4, '0'); });
db.reviews = merged;

const snapArg = process.argv.find(a => a.startsWith('--snapshot'));
if (snapArg) {
  const [s, c, p5, p4, p3, p2, p1] = (snapArg.split('=')[1] || process.argv[process.argv.indexOf(snapArg) + 1]).split(',').map(Number);
  db.source.trustScore = s; db.source.reviewCount = c;
  db.source.breakdown = { 5: p5, 4: p4, 3: p3, 2: p2, 1: p1 };
}
db.source.captured = new Date().toISOString().slice(0, 10);
db.source.featuredCount = merged.length;

await writeFile(REVIEWS, JSON.stringify(db, null, 2) + '\n');
const byTopic = {};
for (const r of merged) for (const t of r.topics) byTopic[t] = (byTopic[t] || 0) + 1;
console.log(`files=${files.length} scanned=${scanned} added=${added} dupes=${skippedDup} rejected=${skippedRule}`);
console.log(`reviews ${before} -> ${merged.length} (${merged.at(-1).date} .. ${merged[0].date})`);
console.log('topics: ' + Object.entries(byTopic).sort((a, b) => b[1] - a[1]).map(([t, n]) => `${t}=${n}`).join(' '));
