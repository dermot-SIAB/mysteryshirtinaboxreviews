// Cross-check content/reviews.json against raw Trustpilot pulls that recorded each
// review's OWN observed star rating. Trustpilot does not reliably honour the
// ?stars= filter, so any rating that was inferred from the filter is untrustworthy.
// Usage: node scripts/verify-ratings.mjs <pull-dir> [<pull-dir>...] [--fix]
import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REVIEWS = path.join(ROOT, 'content/reviews.json');
const dirs = process.argv.slice(2).filter(a => !a.startsWith('--'));
const FIX = process.argv.includes('--fix');
if (!dirs.length) { console.error('usage: node scripts/verify-ratings.mjs <pull-dir>... [--fix]'); process.exit(1); }

const norm = s => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const key = r => `${norm(r.name)}|${norm(r.text).slice(0, 80)}`;

// Build the observed-rating index from every pull file that carries ratings.
const observed = new Map();
for (const dir of dirs) {
  let files;
  try { files = (await readdir(dir)).filter(f => f.endsWith('.json')); }
  catch { console.error(`skip ${dir} (unreadable)`); continue; }
  for (const f of files) {
    let rows;
    try { rows = JSON.parse(await readFile(path.join(dir, f), 'utf8')); } catch { continue; }
    if (!Array.isArray(rows)) continue;
    for (const r of rows) {
      if (!r?.name || !r?.text) continue;
      const n = Number(r.rating);
      if (!Number.isInteger(n) || n < 1 || n > 5) continue;
      observed.set(key(r), n);
    }
  }
}

const db = JSON.parse(await readFile(REVIEWS, 'utf8'));
const mismatched = [], uncorroborated = [], confirmed = [];
for (const r of db.reviews) {
  const seen = observed.get(key(r));
  if (seen === undefined) uncorroborated.push(r);
  else if (seen !== r.rating) mismatched.push({ r, seen });
  else confirmed.push(r);
}

console.log(`observed index: ${observed.size} rated rows`);
console.log(`confirmed:      ${confirmed.length}`);
console.log(`rating differs: ${mismatched.length}`);
console.log(`no pull match:  ${uncorroborated.length}`);
for (const { r, seen } of mismatched) console.log(`  DIFFERS ${r.id} ${r.name} stored=${r.rating} observed=${seen} :: ${r.text.slice(0, 60)}`);
for (const r of uncorroborated) console.log(`  UNMATCHED ${r.id} ${r.name} (${r.date}) :: ${r.text.slice(0, 60)}`);

if (FIX) {
  // Correct any rating we actually observed; drop anything observed below 4 stars.
  const kept = [];
  let corrected = 0, dropped = 0;
  for (const r of db.reviews) {
    const seen = observed.get(key(r));
    if (seen === undefined) { kept.push(r); continue; }        // keep, flagged above for manual review
    if (seen < 4) { dropped++; continue; }
    if (seen !== r.rating) { r.rating = seen; corrected++; }
    kept.push(r);
  }
  db.reviews = kept;
  db.reviews.forEach((r, i) => { r.id = 'r' + String(i + 1).padStart(4, '0'); });
  db.source.featuredCount = kept.length;
  await writeFile(REVIEWS, JSON.stringify(db, null, 2) + '\n');
  console.log(`--fix: corrected ${corrected}, dropped ${dropped}, kept ${kept.length}`);
}
process.exit(mismatched.length ? 1 : 0);
