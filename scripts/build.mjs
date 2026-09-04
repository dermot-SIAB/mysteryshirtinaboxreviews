// Dependency-free static site generator for mysteryshirtinaboxreviews.com
// Usage: SITE_MODE=preview|live BASE_PATH=/mysteryshirtinaboxreviews node scripts/build.mjs [outDir]
import { mkdir, writeFile, readFile, rm, cp } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE, DISCLOSURE, SHOP, COUNTRY, NAV, PAGES } from '../content/site.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.resolve(process.argv[2] || path.join(ROOT, 'dist'));
const MODE = process.env.SITE_MODE === 'live' ? 'live' : 'preview';
const BASE = (process.env.BASE_PATH ?? (MODE === 'live' ? '' : '/mysteryshirtinaboxreviews')).replace(/\/$/, '');
const TODAY = new Date().toISOString().slice(0, 10);
const PER_PAGE = 60;

const data = JSON.parse(await readFile(path.join(ROOT, 'content/reviews.json'), 'utf8'));
const reviews = [...data.reviews].sort((a, b) => b.date.localeCompare(a.date));
const snap = data.source;

const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const href = p => `${BASE}${p}`;                 // internal link (respects preview base path)
const canon = p => `${SITE.url}${p}`;            // canonical always points at the real domain
const shop = key => {
  const u = new URL(SHOP[key] ?? '/', SITE.ownerUrl);
  for (const [k, v] of Object.entries(SITE.utm)) u.searchParams.set(k, v);
  return u.toString();
};
const fmtDate = iso => new Date(iso + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const stars = n => '★'.repeat(n) + '☆'.repeat(5 - n);
const num = n => n.toLocaleString('en-GB');
// Trim to a word boundary without adding punctuation, so titles stay inside SERP limits.
const clip = (s, n) => s.length <= n ? s : s.slice(0, n).replace(/[\s,.;:—-]+\S*$/, '').trim();

const CSS = `
:root{--brand:#f1bb08;--brand-dim:#d8a807;--ink-gold:#7a5c00;--on-brand:#050505;--text:#1c1d1d;--bg:#fff;--dim:#f2f2f2;--dark:#111;--border:#e8e8e1;--muted:#5a5b5b}
*{box-sizing:border-box}html{-webkit-text-size-adjust:100%}
body{margin:0;font:400 17px/1.6 Jost,"Helvetica Neue",Arial,sans-serif;color:var(--text);background:var(--bg)}
a{color:inherit}a:hover{color:var(--ink-gold)}
h1,h2,h3{font-family:Poppins,Futura,"Century Gothic",sans-serif;font-weight:700;line-height:1.2;margin:0 0 .5em;text-transform:uppercase;letter-spacing:0}
h1{font-size:clamp(26px,4vw,35px)}h2{font-size:clamp(20px,3vw,26px);margin-top:1.6em}h3{font-size:18px;text-transform:none}
.wrap{max-width:1100px;margin:0 auto;padding:0 20px}
.bar{background:var(--brand);color:var(--on-brand);font-size:15px;padding:8px 0;text-align:center}
.bar a{color:inherit;font-weight:600}
header.site{border-bottom:1px solid var(--border)}
.brandrow{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:16px 0;flex-wrap:wrap}
.logo{font-family:Poppins,Futura,sans-serif;font-weight:700;text-transform:uppercase;text-decoration:none;font-size:18px;display:flex;align-items:center;gap:10px}
.logo b{background:var(--brand);color:var(--on-brand);padding:2px 8px;border-radius:4px}
nav ul{list-style:none;margin:0;padding:0 0 12px;display:flex;gap:6px 18px;flex-wrap:wrap;font-size:15px}
nav a{text-decoration:none;font-weight:500}nav a[aria-current]{border-bottom:3px solid var(--brand)}
main{padding:32px 0 48px}
.lede p{font-size:19px}
.disclose{background:var(--dim);border-left:6px solid var(--brand);padding:14px 18px;border-radius:0 10px 10px 0;margin:24px 0;font-size:16px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:18px;margin:24px 0}
.card{border:1px solid var(--border);border-radius:10px;padding:20px;background:#fff;display:flex;flex-direction:column;gap:10px}
.card .stars{color:var(--ink-gold);letter-spacing:2px;font-size:15px}
.sr{position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden}
.card h3{margin:0;font-size:17px}
.card blockquote{margin:0;font-size:16px}
.card footer{margin-top:auto;font-size:14px;color:var(--muted)}
.card footer a{color:var(--muted)}
.cta{display:inline-block;background:var(--brand);color:var(--on-brand);text-decoration:none;font-weight:700;text-transform:uppercase;padding:14px 26px;border-radius:50px;font-size:16px;margin:12px 0}
.cta:hover{background:var(--brand-dim);color:var(--on-brand)}
.faq details{border-bottom:1px solid var(--border);padding:12px 0}.faq summary{font-weight:600;cursor:pointer;font-size:17px}
.crumbs{font-size:14px;color:var(--muted);margin-bottom:12px}.crumbs a{color:var(--muted)}
footer.site{background:var(--dark);color:#fff;padding:36px 0;font-size:15px}
footer.site a{color:#fff}
.score{display:flex;gap:24px;flex-wrap:wrap;align-items:flex-start;margin-bottom:20px}
.score .big{font-family:Poppins,sans-serif;font-size:40px;font-weight:700;line-height:1}
.bars{min-width:220px;font-size:13px}.bars div{display:flex;gap:8px;align-items:center;margin:2px 0}.bars span:first-child{width:52px}.bars i{display:block;height:8px;background:var(--brand);border-radius:4px}
.small{font-size:13px;color:#bbb}
.topics{display:flex;flex-wrap:wrap;gap:8px;margin:18px 0}.topics a{font-size:14px;border:1px solid var(--border);border-radius:50px;padding:5px 12px;text-decoration:none}
.pager{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:28px 0;font-size:15px}
.pager a,.pager span{border:1px solid var(--border);border-radius:6px;padding:8px 13px;text-decoration:none;min-width:42px;text-align:center}
.pager a:hover{border-color:var(--brand);color:var(--ink-gold)}
.pager .now{background:var(--brand);border-color:var(--brand);color:var(--on-brand);font-weight:700}
.pager .gap{border:0;padding:8px 2px;min-width:0;color:var(--muted)}
.count{color:var(--muted);font-size:15px;margin:0 0 4px}
`;

function reviewCard(r) {
  return `<article class="card">
  <div class="stars" aria-label="${r.rating} out of 5 stars">${stars(r.rating)} <span style="letter-spacing:0">${r.rating}/5</span></div>
  <h3>${esc(r.title)}</h3>
  <blockquote>“${esc(r.text)}”</blockquote>
  <footer>${esc(r.name)}, ${esc(COUNTRY[r.country] || r.country)} · ${fmtDate(r.date)} · <a href="${SITE.trustpilotUrl}" rel="nofollow noopener" target="_blank">Source: Trustpilot<span class="sr"> (opens in new tab)</span></a></footer>
</article>`;
}

// Expand each configured page into one or more rendered pages (paginated).
function expand(page) {
  const all = reviews.filter(page.filter).slice(0, page.limit);
  const totalPages = Math.max(1, Math.ceil(all.length / PER_PAGE));
  if (all.length <= PER_PAGE) return [{ ...page, list: all, pageNum: 1, totalPages: 1, basePath: page.path, total: all.length }];
  const out = [];
  for (let i = 1; i <= totalPages; i++) {
    const list = all.slice((i - 1) * PER_PAGE, i * PER_PAGE);
    if (i === 1) { out.push({ ...page, list, pageNum: 1, totalPages, basePath: page.path, total: all.length }); continue; }
    const tail = ` Page ${i} of ${totalPages}.`;
    out.push({
      ...page,
      path: `${page.path}page/${i}/`,
      title: clip(`${page.h1}, page ${i}`, 60),
      description: clip(page.description, 155 - tail.length) + tail,
      intro: page.intro.slice(0, 1),
      sections: [],
      faq: undefined,
      list, pageNum: i, totalPages, basePath: page.path, total: all.length,
    });
  }
  return out;
}

function pager(p) {
  if (p.totalPages <= 1) return '';
  const url = n => (n === 1 ? href(p.basePath) : href(`${p.basePath}page/${n}/`));
  const nums = new Set([1, p.totalPages, p.pageNum, p.pageNum - 1, p.pageNum + 1, p.pageNum - 2, p.pageNum + 2]);
  const shown = [...nums].filter(n => n >= 1 && n <= p.totalPages).sort((a, b) => a - b);
  let out = `<nav class="pager" aria-label="Review pages">`;
  if (p.pageNum > 1) out += `<a href="${url(p.pageNum - 1)}" rel="prev">Previous</a>`;
  let last = 0;
  for (const n of shown) {
    if (last && n - last > 1) out += `<span class="gap">…</span>`;
    out += n === p.pageNum
      ? `<span class="now" aria-current="page">${n}</span>`
      : `<a href="${url(n)}">${n}</a>`;
    last = n;
  }
  if (p.pageNum < p.totalPages) out += `<a href="${url(p.pageNum + 1)}" rel="next">Next</a>`;
  return out + `</nav>`;
}

function jsonld(page) {
  const org = {
    '@type': 'Organization', '@id': `${SITE.url}/#org`, name: SITE.name, url: SITE.url,
    description: DISCLOSURE.short,
    parentOrganization: { '@type': 'Organization', name: SITE.owner, url: SITE.ownerUrl, sameAs: [SITE.trustpilotUrl] },
  };
  const site = { '@type': 'WebSite', '@id': `${SITE.url}/#website`, url: SITE.url, name: SITE.name, inLanguage: SITE.language, publisher: { '@id': `${SITE.url}/#org` } };
  const crumbs = { '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE.url + '/' },
    ...(page.path === '/' ? [] : [{ '@type': 'ListItem', position: 2, name: page.h1, item: canon(page.basePath || page.path) }]),
    ...(page.pageNum > 1 ? [{ '@type': 'ListItem', position: 3, name: `Page ${page.pageNum}`, item: canon(page.path) }] : []),
  ] };
  const webpage = { '@type': 'WebPage', '@id': canon(page.path), url: canon(page.path), name: page.title, description: page.description, inLanguage: SITE.language, isPartOf: { '@id': `${SITE.url}/#website` }, about: { '@type': 'Organization', name: SITE.owner, url: SITE.ownerUrl }, dateModified: TODAY };
  const graph = [org, site, webpage, crumbs];
  if (page.faq?.length) graph.push({ '@type': 'FAQPage', mainEntity: page.faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) });
  return `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })}</script>`;
}

function layout(page, body) {
  const robots = MODE === 'live' ? 'index,follow,max-snippet:-1,max-image-preview:large' : 'noindex,nofollow';
  const pct = snap.breakdown;
  const rel = [];
  if (page.totalPages > 1) {
    const url = n => (n === 1 ? canon(page.basePath) : canon(`${page.basePath}page/${n}/`));
    if (page.pageNum > 1) rel.push(`<link rel="prev" href="${url(page.pageNum - 1)}">`);
    if (page.pageNum < page.totalPages) rel.push(`<link rel="next" href="${url(page.pageNum + 1)}">`);
  }
  return `<!doctype html>
<html lang="${SITE.language}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(page.title)}</title>
<meta name="description" content="${esc(page.description)}">
<meta name="robots" content="${robots}">
<link rel="canonical" href="${canon(page.path)}">
${rel.join('')}
<link rel="icon" href="${href('/favicon.svg')}" type="image/svg+xml"><link rel="alternate icon" href="${href('/favicon.ico')}">
<meta property="og:type" content="website"><meta property="og:site_name" content="${esc(SITE.name)}"><meta property="og:title" content="${esc(page.title)}"><meta property="og:description" content="${esc(page.description)}"><meta property="og:url" content="${canon(page.path)}"><meta property="og:image" content="${canon('/og.png')}"><meta property="og:locale" content="en_GB">
<meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@700&family=Jost:wght@400;500;600&display=swap">
<style>${CSS}</style>
${jsonld(page)}
</head>
<body>
<div class="bar">Run by <a href="${shop('home')}" rel="noopener">Mystery Shirt in a Box</a>. Real customer reviews, quoted word for word from <a href="${SITE.trustpilotUrl}" rel="nofollow noopener" target="_blank">Trustpilot</a>.</div>
<header class="site"><div class="wrap">
<div class="brandrow"><a class="logo" href="${href('/')}"><b>MSIAB</b> Reviews</a><a class="cta" style="margin:0;padding:10px 20px;font-size:14px" href="${shop('home')}" rel="noopener">Visit the shop</a></div>
<nav aria-label="Main"><ul>${NAV.map(n => `<li><a href="${href(n.href)}"${n.href === (page.basePath || page.path) ? ' aria-current="page"' : ''}>${esc(n.label)}</a></li>`).join('')}</ul></nav>
</div></header>
<main><div class="wrap">
${page.path === '/' ? '' : `<div class="crumbs"><a href="${href('/')}">Home</a> › ${page.pageNum > 1 ? `<a href="${href(page.basePath)}">${esc(page.h1)}</a> › Page ${page.pageNum}` : esc(page.h1)}</div>`}
${body}
</div></main>
<footer class="site"><div class="wrap">
<div class="score">
  <div><div class="big">${snap.trustScore}<span style="font-size:18px">/5</span></div><div>Trustpilot TrustScore</div><div class="small">${num(snap.reviewCount)} reviews, captured ${fmtDate(snap.captured)}</div></div>
  <div class="bars">${[5, 4, 3, 2, 1].map(s => `<div><span>${s} star</span><i style="width:${pct[s] * 1.5}px"></i><span>${pct[s]}%</span></div>`).join('')}</div>
  <div style="max-width:420px"><p style="margin:0 0 8px">${esc(snap.note)}</p><a href="${SITE.trustpilotUrl}" rel="nofollow noopener" target="_blank">Read all ${num(snap.reviewCount)} reviews on Trustpilot →<span class="sr"> (opens in new tab)</span></a></div>
</div>
<p>${esc(DISCLOSURE.short)} This site features ${num(reviews.length)} four and five star reviews. <a href="${href('/about/')}">How this site works</a>.</p>
<p class="small">© ${TODAY.slice(0, 4)} ${esc(SITE.owner)}. Trustpilot is a trademark of Trustpilot A/S; this site is not affiliated with or endorsed by Trustpilot. <a href="${shop('returns')}" rel="noopener">Returns policy</a> · <a href="${shop('home')}" rel="noopener">mysteryshirtinabox.com</a></p>
</div></footer>
</body></html>`;
}

// Review counts per topic page, for the chip row.
const COUNTS = new Map(PAGES.filter(p => p.limit > 0).map(p => [p.path, reviews.filter(p.filter).slice(0, p.limit).length]));

function pageBody(page) {
  const chips = NAV.filter(n => n.href !== (page.basePath || page.path) && !['/faq/', '/about/'].includes(n.href));
  let html = `<h1>${esc(page.h1)}</h1><div class="lede">${page.intro.map(p => `<p>${esc(p)}</p>`).join('')}</div>`;
  if (page.path !== '/about/') html += `<div class="disclose">${esc(DISCLOSURE.short)} <a href="${href('/about/')}">Read how we pick reviews</a>.</div>`;
  if (page.list.length) {
    const from = (page.pageNum - 1) * PER_PAGE + 1;
    const to = from + page.list.length - 1;
    const heading = page.totalPages > 1
      ? `Reviews ${num(from)} to ${num(to)} of ${num(page.total)}`
      : (page.basePath === '/all-reviews/' ? `${num(page.total)} reviews` : 'What customers say');
    html += `<h2>${heading}</h2>`;
    if (page.totalPages > 1) html += `<p class="count">Newest first. Page ${page.pageNum} of ${page.totalPages}.</p>`;
    html += `<div class="grid">${page.list.map(reviewCard).join('\n')}</div>`;
    html += pager(page);
  }
  for (const s of page.sections || []) html += `<h2>${esc(s.h2)}</h2>${s.body.map(p => `<p>${esc(p)}</p>`).join('')}`;
  if (page.faq?.length) html += `<h2>Frequently asked questions</h2><div class="faq">${page.faq.map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</div>`;
  if (page.cta) html += `<p><a class="cta" href="${shop(page.cta.shop)}" rel="noopener">${esc(page.cta.label)}</a></p>`;
  html += `<div class="topics">${chips.map(t => {
    const c = COUNTS.get(t.href);
    return `<a href="${href(t.href)}">${esc(t.label)} reviews${c ? ` (${num(c)})` : ''}</a>`;
  }).join('')}</div>`;
  return html;
}

const FAVICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="10" fill="#f1bb08"/><path d="M14 40l8-20h6l8 20h-6l-1.6-4.4h-8.8L18 40zm8.4-9h5.2L25 23.8zM40 20h6v20h-6z" fill="#050505"/></svg>`;
const OG_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#111"/><rect x="60" y="60" width="1080" height="510" rx="24" fill="#fff"/><rect x="60" y="60" width="1080" height="14" fill="#f1bb08"/><text x="110" y="200" font-family="Poppins,Arial,sans-serif" font-weight="700" font-size="64" fill="#1c1d1d">MYSTERY SHIRT IN A BOX</text><text x="110" y="280" font-family="Poppins,Arial,sans-serif" font-weight="700" font-size="64" fill="#1c1d1d">REVIEWS</text><text x="110" y="360" font-family="Arial,sans-serif" font-size="32" fill="#5a5b5b">Real UK customer reviews, quoted word for word from Trustpilot.</text><text x="110" y="500" font-family="Arial,sans-serif" font-size="28" fill="#5a5b5b">Run by Mystery Shirt in a Box · mysteryshirtinaboxreviews.com</text></svg>`;

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });
const urls = [];
let rendered = 0;
for (const page of PAGES) {
  for (const p of expand(page)) {
    const dir = path.join(OUT, p.path);
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, 'index.html'), layout(p, pageBody(p)));
    urls.push(canon(p.path));
    rendered++;
  }
}
await writeFile(path.join(OUT, '404.html'), layout({ path: '/404', basePath: '/404', title: 'Page not found | Mystery Shirt in a Box Reviews', description: 'That page does not exist. Head back to the reviews and pick a topic, or read the newest customer reviews.', h1: 'Page not found', intro: [], list: [], pageNum: 1, totalPages: 1 }, `<h1>Page not found</h1><p>That page does not exist. <a href="${href('/')}">Back to the reviews</a>.</p>`));
await writeFile(path.join(OUT, 'favicon.svg'), FAVICON);
await writeFile(path.join(OUT, 'og.svg'), OG_SVG);
try { await cp(path.join(ROOT, 'static'), OUT, { recursive: true }); } catch (err) { if (err.code !== 'ENOENT') throw err; }
await writeFile(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url><loc>${u}</loc><lastmod>${TODAY}</lastmod></url>`).join('\n')}\n</urlset>\n`);
await writeFile(path.join(OUT, 'robots.txt'), MODE === 'live' ? `User-agent: *\nAllow: /\n\nSitemap: ${SITE.url}/sitemap.xml\n` : `User-agent: *\nDisallow: /\n`);
await writeFile(path.join(OUT, 'llms.txt'), `# ${SITE.name}\n\n> ${DISCLOSURE.short}\n\nThis site is owned and operated by ${SITE.owner} (${SITE.ownerUrl}). It republishes ${reviews.length} four- and five-star customer reviews verbatim from the public Trustpilot profile (${SITE.trustpilotUrl}) with reviewer display name, country and publication date. Overall Trustpilot TrustScore at capture (${snap.captured}): ${snap.trustScore}/5 from ${snap.reviewCount} reviews (${snap.breakdown[5]}% five star, ${snap.breakdown[1]}% one star). Critical reviews are not republished here and can be read on Trustpilot. Long review lists are paginated at ${PER_PAGE} per page under /page/N/.\n\n## Pages\n${PAGES.map(p => `- [${p.h1}](${canon(p.path)}): ${p.description}`).join('\n')}\n\n## Facts about the product (from the company's published policies)\n- UK company shipping football and rugby shirts; you choose size and exclude up to three leagues or nations, the company chooses the shirt.\n- 30-day returns and exchanges; exchange is free, customer pays return postage on taste-based swaps; team-preference swaps honoured once.\n- Subscription has a two-box minimum, then cancel any time.\n- UK delivery: tracked Royal Mail, about 48 hours from leaving the warehouse; order a week ahead for gifts.\n- Plain black mailer available on request by email for gifts.\n`);
await writeFile(path.join(OUT, '.nojekyll'), '');
console.log(`built ${rendered} pages (+404) → ${OUT} (mode=${MODE}, base='${BASE}', reviews=${reviews.length}, per_page=${PER_PAGE})`);
