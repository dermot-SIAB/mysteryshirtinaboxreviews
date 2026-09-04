import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const data = JSON.parse(await readFile(new URL('../content/reviews.json', import.meta.url), 'utf8'));
// Reviews the company review bank marks as not for outbound use.
const EXCLUDED_NAMES = ['DAVID DUMMACKIN', 'Nicole', 'Gary', 'Darren Hands'];

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

test('at least 50 reviews, every one complete, rated 4 or 5, unique id', () => {
  assert.ok(data.reviews.length >= 50, `only ${data.reviews.length}`);
  const ids = new Set();
  for (const r of data.reviews) {
    assert.ok(r.id && !ids.has(r.id), `dup/missing id ${r.id}`); ids.add(r.id);
    for (const k of ['name', 'country', 'date', 'title', 'text', 'topics']) assert.ok(r[k], `${r.id} missing ${k}`);
    assert.ok([4, 5].includes(r.rating), `${r.id} rating ${r.rating}`);
    assert.match(r.date, /^\d{4}-\d{2}-\d{2}$/, `${r.id} date`);
    assert.ok(new Date(r.date) <= new Date(), `${r.id} future date`);
    assert.match(r.country, /^[A-Z]{2}$/, `${r.id} country`);
    assert.ok(r.text.trim().length >= 10, `${r.id} text too short`);
    assert.ok(Array.isArray(r.topics) && r.topics.length > 0, `${r.id} topics`);
  }
});

test('excluded reviewers are not present', () => {
  for (const r of data.reviews) assert.ok(!EXCLUDED_NAMES.includes(r.name), `${r.name} is on the do-not-use list`);
});

test('UK focus: majority of reviews are GB or IE', () => {
  const ukie = data.reviews.filter(r => ['GB', 'IE'].includes(r.country)).length;
  assert.ok(ukie / data.reviews.length > 0.75, `${ukie}/${data.reviews.length}`);
});

test('the three Guyana reviews are never featured together on a curated page (home)', async () => {
  // Company rule: three customers opening the same shirt in a fortnight reads as stock concentration.
  const { PAGES } = await import('../content/site.mjs');
  const home = PAGES.find(p => p.path === '/');
  const shown = data.reviews.sort((a, b) => b.date.localeCompare(a.date)).filter(home.filter).slice(0, home.limit);
  const guyana = shown.filter(r => /guyana/i.test(r.text)).length;
  assert.ok(guyana <= 1, `${guyana} Guyana reviews on the home page`);
});
