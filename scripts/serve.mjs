// Tiny static server for local checks. Usage: node scripts/serve.mjs [port]
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve('dist');
const port = Number(process.argv[2] || 8787);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.xml': 'application/xml', '.txt': 'text/plain', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json', '.webmanifest': 'application/manifest+json' };
http.createServer(async (req, res) => {
  try {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    let file = path.join(root, p);
    try { if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html'); } catch { /* fall through */ }
    const body = await readFile(file);
    res.writeHead(200, { 'content-type': types[path.extname(file)] || 'application/octet-stream' });
    res.end(body);
  } catch (err) {
    res.writeHead(404, { 'content-type': 'text/plain' });
    res.end('404 ' + err.message);
  }
}).listen(port, () => console.log(`serving dist/ on http://localhost:${port}`));
