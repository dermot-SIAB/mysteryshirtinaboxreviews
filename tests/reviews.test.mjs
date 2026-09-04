import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const data = JSON.parse(await readFile(new URL('../content/reviews.json', import.meta.url), 'utf8'));
// Specific reviews the company review bank marks as not-for-republication.
// Matched on name AND text fragment. Keep in step with scripts/ingest.mjs.
const EXCLUDED_REVIEWS = [
  { name: 'DAVID DUMMACKIN', contains: 'mental health' },
  { name: 'Nicole', contains: 'sustainable Thursday' },
  { name: 'Gary', contains: 'AI generated' },
  { name: 'Darren Hands', contains: 'basketball vests' },
];
// Personal circumstances or prize wins: never republish, however positive.
const EXCLUDE_TEXT = [/mental health/i, /bereave/i, /passed away/i, /\bcancer\b/i, /\bi won\b/i, /giveaway/i];

test('source snapshot is complete and dated', () => {
  const s = data.source;
  assert.equal(s.name, 'Trustpilot');
  assert.match(s.url, /^https:\/\/uk\.trustpilot\.com\/review\/mysteryshirtinabox\.com$/);
  assert.match(s.captured, /^\d{4}-\d{2}-\d{2}$/);
  assert.ok(s.trustScore > 0 && s.trustScore <= 5);
  assert.ok(s.reviewCount > 1000);
  const sum = Object.values(s.breakdown).reduce((a, b) => a + b, 0);
  assert.ok(sum >= 98 && sum <= 102, `breakdown sums to ${sum}`);
});

test('every review is complete, rated 4 or 5, with a unique id', () => {
  assert.ok(data.reviews.length >= 50, `only ${data.reviews.length}`);
  const ids = new Set();
  for (const r of data.reviews) {
    assert.ok(r.id && !ids.has(r.id), `dup/missing id ${r.id}`); ids.add(r.id);
    for (const k of ['name', 'country', 'date', 'title', 'text', 'topics']) assert.ok(r[k], `${r.id} missing ${k}`);
    assert.ok([4, 5].includes(r.rating), `${r.id} rating ${r.rating}`);
    assert.match(r.date, /^\d{4}-\d{2}-\d{2}$/, `${r.id} date`);
    assert.ok(new Date(r.date) <= new Date(), `${r.id} future date`);
    assert.match(r.country, /^[A-Z]{2}$/, `${r.id} country`);
    assert.ok(r.country !== 'XX', `${r.id} unresolved country`);
    assert.ok(r.text.trim().length >= 10, `${r.id} text too short`);
    assert.ok(Array.isArray(r.topics) && r.topics.length > 0, `${r.id} topics`);
  }
});

test('no duplicate reviews', () => {
  const seen = new Map();
  const norm = s => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  for (const r of data.reviews) {
    const key = `${norm(r.name)}|${norm(r.text).slice(0, 80)}`;
    assert.ok(!seen.has(key), `${r.id} duplicates ${seen.get(key)}`);
    seen.set(key, r.id);
  }
});

test('excluded reviews are not present', () => {
  for (const r of data.reviews) {
    for (const x of EXCLUDED_REVIEWS) {
      assert.ok(!(r.name === x.name && r.text.includes(x.contains)), `${r.id} is on the do-not-use list`);
    }
    for (const re of EXCLUDE_TEXT) assert.ok(!re.test(r.text), `${r.id} matches sensitive pattern ${re}`);
  }
});

test('UK focus: most reviews are GB or IE', () => {
  const ukie = data.reviews.filter(r => ['GB', 'IE'].includes(r.country)).length;
  assert.ok(ukie / data.reviews.length > 0.6, `${ukie}/${data.reviews.length}`);
});

test('the Guyana reviews are never featured together on the curated home page', async () => {
  // Company rule: three customers opening the same shirt in a fortnight reads as stock concentration.
  const { PAGES } = await import('../content/site.mjs');
  const home = PAGES.find(p => p.path === '/');
  const shown = [...data.reviews].sort((a, b) => b.date.localeCompare(a.date)).filter(home.filter).slice(0, home.limit);
  const guyana = shown.filter(r => /guyana/i.test(r.text)).length;
  assert.ok(guyana <= 1, `${guyana} Guyana reviews on the home page`);
});
