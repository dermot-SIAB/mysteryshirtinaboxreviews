import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readdir, readFile, stat, mkdtemp } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FORBIDDEN = [
  /aggregateRating/i, /"ratingValue"/i, /"@type":"Review"/i, // no self-serving rating markup
  /Rated Great/i, /FREE Exchanges For 1 Year/i, /Easy to cancel if/i, /4,000 five/i, /150,000/, /100% authentic/i, // retired or conditional claims
  /\[CLAIM/,
];
const EXPECTED = ['/', '/is-mystery-shirt-in-a-box-legit/', '/football-shirt-reviews/', '/rugby-shirt-reviews/', '/subscription-reviews/', '/gift-reviews/', '/delivery-and-customer-service-reviews/', '/all-reviews/', '/faq/', '/about/'];

async function build(mode, base) {
  const out = await mkdtemp(path.join(os.tmpdir(), `msr-${mode}-`));
  execFileSync(process.execPath, [path.join(ROOT, 'scripts/build.mjs'), out], { env: { ...process.env, SITE_MODE: mode, BASE_PATH: base }, stdio: 'pipe' });
  return out;
}
async function walk(dir, acc = []) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) await walk(p, acc); else acc.push(p);
  }
  return acc;
}

for (const [mode, base] of [['preview', '/mysteryshirtinaboxreviews'], ['live', '']]) {
  test(`${mode} build: pages, metadata, links, schema, claims`, async () => {
    const out = await build(mode, base);
    for (const p of EXPECTED) await stat(path.join(out, p, 'index.html'));
    for (const f of ['404.html', 'sitemap.xml', 'robots.txt', 'llms.txt', 'favicon.svg', '.nojekyll', 'og.png', 'favicon.ico']) await stat(path.join(out, f));

    const files = (await walk(out)).filter(f => f.endsWith('.html'));
    const exists = new Set((await walk(out)).map(f => path.relative(out, f)));
    const titles = new Map(), descs = new Map();
    for (const f of files) {
      const html = await readFile(f, 'utf8');
      const rel = '/' + path.relative(out, f).replace(/index\.html$/, '');
      const title = html.match(/<title>([^<]*)<\/title>/)[1];
      const desc = html.match(/name="description" content="([^"]*)"/)[1];
      assert.ok(title.length <= 60, `${rel} title ${title.length} chars`);
      assert.ok(desc.length <= 155 && desc.length >= 50, `${rel} description ${desc.length} chars`);
      assert.ok(!titles.has(title), `${rel} duplicate title with ${titles.get(title)}`);
      titles.set(title, rel);
      if (rel !== '/404') { assert.ok(!descs.has(desc), `${rel} duplicate description with ${descs.get(desc)}`); descs.set(desc, rel); }
      assert.match(html, /rel="canonical" href="https:\/\/mysteryshirtinaboxreviews\.com\//, `${rel} canonical`);
      assert.match(html, /uk\.trustpilot\.com\/review\/mysteryshirtinabox\.com/, `${rel} trustpilot link`);
      assert.match(html, /run by .*Mystery Shirt in a Box/i, `${rel} disclosure`);
      assert.match(html, /mysteryshirtinabox\.com\/[^"]*utm_source=mysteryshirtinaboxreviews\.com/, `${rel} tagged shop link`);
      if (mode === 'live') assert.match(html, /name="robots" content="index,follow/, `${rel} robots live`);
      else assert.match(html, /name="robots" content="noindex/, `${rel} robots preview`);
      for (const re of FORBIDDEN) assert.ok(!re.test(html), `${rel} contains forbidden ${re}`);
      // internal links resolve
      for (const m of html.matchAll(/href="([^"]+)"/g)) {
        const h = m[1];
        if (/^(https?:|mailto:|#)/.test(h)) continue;
        assert.ok(h.startsWith(base + '/'), `${rel} link ${h} missing base '${base}'`);
        let target = h.slice(base.length).replace(/^\//, '');
        if (target === '' || target.endsWith('/')) target += 'index.html';
        assert.ok(exists.has(target), `${rel} broken link ${h}`);
      }
      // JSON-LD parses and carries the expected types
      const ld = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
      const types = ld['@graph'].map(n => n['@type']);
      for (const t of ['Organization', 'WebSite', 'WebPage', 'BreadcrumbList']) assert.ok(types.includes(t), `${rel} missing ${t}`);
      const wantsFaq = rel === '/faq/' || rel === '/is-mystery-shirt-in-a-box-legit/';
      assert.equal(types.includes('FAQPage'), wantsFaq, `${rel} FAQPage should be ${wantsFaq}`);
    }
    const robots = await readFile(path.join(out, 'robots.txt'), 'utf8');
    if (mode === 'live') assert.match(robots, /Allow: \/\n\nSitemap: https:\/\/mysteryshirtinaboxreviews\.com\/sitemap\.xml/);
    else assert.match(robots, /Disallow: \//);
    const sitemap = await readFile(path.join(out, 'sitemap.xml'), 'utf8');
    for (const p of EXPECTED) assert.ok(sitemap.includes(`<loc>https://mysteryshirtinaboxreviews.com${p}</loc>`), `sitemap missing ${p}`);
    assert.ok(!sitemap.includes('404'), 'sitemap must not list 404');
    // every rendered page, including paginated ones, is in the sitemap
    const pageDirs = files.filter(f => f.endsWith('index.html')).map(f => '/' + path.relative(out, f).replace(/index\.html$/, ''));
    for (const p of pageDirs) assert.ok(sitemap.includes(`<loc>https://mysteryshirtinaboxreviews.com${p}</loc>`), `sitemap missing ${p}`);
  });
}

test('pagination: chain is complete and consistent', async () => {
  const out = await build('live', '');
  const files = (await walk(out)).filter(f => f.endsWith('index.html'));
  const paged = files.map(f => '/' + path.relative(out, f).replace(/index\.html$/, '')).filter(p => /\/page\/\d+\/$/.test(p));
  for (const p of paged) {
    const html = await readFile(path.join(out, p, 'index.html'), 'utf8');
    const n = Number(p.match(/\/page\/(\d+)\//)[1]);
    assert.ok(n >= 2, `${p} page number must start at 2`);
    assert.match(html, /rel="prev"/, `${p} missing rel=prev`);
    assert.match(html, new RegExp(`aria-current="page">${n}<`), `${p} pager does not mark page ${n}`);
    const base = p.replace(/page\/\d+\/$/, '');
    await stat(path.join(out, base, 'index.html'));
  }
  // last page of a chain has no next link
  const chains = new Set(paged.map(p => p.replace(/page\/\d+\/$/, '')));
  for (const base of chains) {
    const nums = paged.filter(p => p.startsWith(base)).map(p => Number(p.match(/\/page\/(\d+)\//)[1])).sort((a, b) => a - b);
    assert.deepEqual(nums, nums.map((_, i) => i + 2), `${base} pagination has gaps: ${nums}`);
    const last = await readFile(path.join(out, `${base}page/${nums.at(-1)}/index.html`), 'utf8');
    assert.ok(!/rel="next"/.test(last), `${base} last page should not have rel=next`);
  }
});

test('every review appears on the site exactly as written', async () => {
  const out = await build('live', '');
  const data = JSON.parse(await readFile(path.join(ROOT, 'content/reviews.json'), 'utf8'));
  const files = (await walk(out)).filter(f => f.includes('all-reviews') && f.endsWith('index.html'));
  assert.ok(files.length >= 1, 'no all-reviews pages built');
  let all = '';
  for (const f of files) all += await readFile(f, 'utf8');
  const esc = s => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  for (const r of data.reviews) assert.ok(all.includes(`“${esc(r.text)}”`), `${r.id} quote altered or missing`);
});
