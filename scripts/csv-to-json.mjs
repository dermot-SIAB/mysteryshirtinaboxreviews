// Convert a Trustpilot (or Loox / Judge.me / Okendo) review CSV export into the
// JSON array shape scripts/ingest.mjs expects. Header names are matched loosely,
// so most platforms' exports work without editing the file.
// Usage: node scripts/csv-to-json.mjs <file.csv> [out.json]
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const src = process.argv[2];
if (!src) { console.error('usage: node scripts/csv-to-json.mjs <file.csv> [out.json]'); process.exit(1); }
const out = process.argv[3] || src.replace(/\.csv$/i, '') + '.json';

// RFC4180-ish parser: handles quoted fields, embedded commas, newlines and "" escapes.
function parseCsv(text) {
  const rows = [];
  let row = [], field = '', inQuotes = false;
  const s = text.replace(/^﻿/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (inQuotes) {
      if (c === '"') { if (s[i + 1] === '"') { field += '"'; i++; } else inQuotes = false; }
      else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); field = ''; if (row.some(v => v !== '')) rows.push(row); row = []; }
    else field += c;
  }
  row.push(field);
  if (row.some(v => v !== '')) rows.push(row);
  return rows;
}

const MAP = {
  rating:  [/^(review\s*)?stars?$/i, /rating/i, /score/i],
  name:    [/reviewer.*name/i, /consumer.*name/i, /customer.*name/i, /^name$/i, /author/i, /display.*name/i],
  text:    [/review.*(content|body|text)/i, /^(content|body|comment|text|message)$/i, /description/i],
  title:   [/review.*title/i, /^title$/i, /headline/i, /subject/i],
  date:    [/review.*date/i, /date.*(published|created|submitted)/i, /^(date|created_at|created|published)$/i, /submitted/i],
  country: [/country/i, /location/i, /region/i],
};

const raw = await readFile(src, 'utf8');
const rows = parseCsv(raw);
if (rows.length < 2) { console.error('csv has no data rows'); process.exit(1); }
const header = rows[0].map(h => h.trim());
const idx = {};
for (const [field, pats] of Object.entries(MAP)) {
  for (const pat of pats) {
    const i = header.findIndex(h => pat.test(h));
    if (i > -1) { idx[field] = i; break; }
  }
}
for (const need of ['rating', 'text', 'date']) {
  if (idx[need] === undefined) {
    console.error(`could not find a '${need}' column. Headers seen: ${header.join(' | ')}`);
    process.exit(1);
  }
}

const COUNTRY_NAMES = { 'united kingdom': 'GB', 'great britain': 'GB', england: 'GB', scotland: 'GB', wales: 'GB', 'northern ireland': 'GB', uk: 'GB', ireland: 'IE', 'republic of ireland': 'IE', 'united states': 'US', usa: 'US', australia: 'AU', 'new zealand': 'NZ', netherlands: 'NL', portugal: 'PT', italy: 'IT', canada: 'CA', germany: 'DE', france: 'FR', spain: 'ES', belgium: 'BE' };
const toCountry = v => {
  const t = (v || '').trim();
  if (/^[A-Za-z]{2}$/.test(t)) return t.toUpperCase();
  return COUNTRY_NAMES[t.toLowerCase()] || 'GB';
};
const toDate = v => {
  const t = (v || '').trim();
  const iso = t.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;
  const dmy = t.match(/^(\d{1,2})[/.](\d{1,2})[/.](\d{4})/);          // UK order: day first
  if (dmy) return `${dmy[3]}-${String(dmy[2]).padStart(2, '0')}-${String(dmy[1]).padStart(2, '0')}`;
  const d = new Date(t);
  return Number.isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10);
};

const reviews = [];
let skipped = 0;
for (const r of rows.slice(1)) {
  const get = f => (idx[f] === undefined ? '' : (r[idx[f]] ?? '').trim());
  const rating = Math.round(Number(String(get('rating')).replace(/[^\d.]/g, '')));
  const text = get('text');
  const date = toDate(get('date'));
  const name = get('name') || 'customer';
  if (!Number.isInteger(rating) || rating < 1 || rating > 5 || !text || !date) { skipped++; continue; }
  reviews.push({ name, country: toCountry(get('country')), date, rating, title: get('title') || text.slice(0, 60), text, page: 0 });
}

await writeFile(out, JSON.stringify(reviews, null, 2) + '\n');
const byRating = reviews.reduce((m, r) => { m[r.rating] = (m[r.rating] || 0) + 1; return m; }, {});
console.log(`columns: ${Object.entries(idx).map(([k, i]) => `${k}="${header[i]}"`).join(' ')}`);
console.log(`rows ${rows.length - 1} -> ${reviews.length} usable (${skipped} unusable)`);
console.log(`by rating: ${JSON.stringify(byRating)}`);
console.log(`wrote ${path.resolve(out)}`);
