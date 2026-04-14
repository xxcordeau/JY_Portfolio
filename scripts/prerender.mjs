/**
 * Prerender script — Vite build 후 Puppeteer로 각 라우트를 렌더링하여
 * 완성된 HTML을 build/ 폴더에 저장한다.
 * 크롤러·AI가 JavaScript 없이도 콘텐츠를 읽을 수 있게 해 줌.
 */
import puppeteer from 'puppeteer';
import { createServer } from 'http';
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from 'fs';
import { join, dirname, extname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BUILD_DIR = join(__dirname, '..', 'build');
const PORT = 4936;

// ── Supabase (public anon key, same as client-side) ─────────────
const SUPABASE_URL = 'https://wdedhluxoicizxqojadx.supabase.co';
const SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkZWRobHV4b2ljaXp4cW9qYWR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2MjkwNDAsImV4cCI6MjA5MTIwNTA0MH0.SI9KL0LiGVVm_TWB4n6hr0rwKSh_IUWmo4qx8aNqXmw';

const HEADERS = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
};

// ── MIME types for static server ─────────────────────────────────
const MIME = {
  '.html': 'text/html',
  '.js':   'application/javascript',
  '.mjs':  'application/javascript',
  '.css':  'text/css',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
  '.ttf':  'font/ttf',
  '.webp': 'image/webp',
};

// ── Static routes (always prerender) ─────────────────────────────
const STATIC_ROUTES = [
  '/',
  '/projects',
  '/blog',
  '/opensource',
  '/presentations',
];

// ── Fetch dynamic routes from Supabase ───────────────────────────
async function fetchDynamicRoutes() {
  try {
    const [projects, blogs, opensource] = await Promise.all([
      fetch(`${SUPABASE_URL}/rest/v1/projects?select=id&order=sort_order`, { headers: HEADERS }).then(r => r.json()),
      fetch(`${SUPABASE_URL}/rest/v1/blog_posts?select=id&status=eq.published&order=created_at.desc`, { headers: HEADERS }).then(r => r.json()),
      fetch(`${SUPABASE_URL}/rest/v1/open_source_projects?select=id&is_visible=eq.true&order=sort_order`, { headers: HEADERS }).then(r => r.json()),
    ]);
    return [
      ...(Array.isArray(projects) ? projects.map(p => `/projects/${p.id}`) : []),
      ...(Array.isArray(blogs) ? blogs.map(b => `/blog/${b.id}`) : []),
      ...(Array.isArray(opensource) ? opensource.map(o => `/opensource/${o.id}`) : []),
    ];
  } catch (err) {
    console.warn('  ⚠ Could not fetch dynamic routes:', err.message);
    return [];
  }
}

// ── Simple static file server with SPA fallback ──────────────────
function tryRead(filePath) {
  try { return readFileSync(filePath); } catch { return null; }
}

function startServer() {
  const spaHtml = readFileSync(join(BUILD_DIR, 'index.html'));

  return new Promise(resolve => {
    const server = createServer((req, res) => {
      const urlPath = new URL(req.url, `http://localhost:${PORT}`).pathname;
      const absPath = join(BUILD_DIR, urlPath);

      // 1) exact file
      let buf = tryRead(absPath);
      if (buf) {
        res.writeHead(200, { 'Content-Type': MIME[extname(absPath).toLowerCase()] || 'application/octet-stream' });
        return res.end(buf);
      }

      // 2) directory → index.html
      buf = tryRead(join(absPath, 'index.html'));
      if (buf) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        return res.end(buf);
      }

      // 3) SPA fallback
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(spaHtml);
    });

    server.listen(PORT, () => resolve(server));
  });
}

// ── Main ─────────────────────────────────────────────────────────
async function prerender() {
  if (!existsSync(join(BUILD_DIR, 'index.html'))) {
    console.error('build/index.html not found — run "vite build" first');
    process.exit(1);
  }

  // 0) 원본 SPA 셸을 404.html로 보존 (프리렌더되지 않은 경로의 SPA 폴백)
  copyFileSync(join(BUILD_DIR, 'index.html'), join(BUILD_DIR, '404.html'));
  console.log('Saved SPA shell → 404.html');

  // 1) 라우트 목록
  console.log('Fetching dynamic routes...');
  const dynamicRoutes = await fetchDynamicRoutes();
  const allRoutes = [...STATIC_ROUTES, ...dynamicRoutes];
  console.log(`Prerendering ${allRoutes.length} routes\n`);

  // 2) 로컬 서버 기동
  const server = await startServer();

  // 3) Puppeteer
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  for (const route of allRoutes) {
    const t0 = Date.now();
    const page = await browser.newPage();

    try {
      await page.goto(`http://localhost:${PORT}${route}`, {
        waitUntil: 'networkidle0',
        timeout: 30_000,
      });

      // React 렌더링 + Supabase 응답 대기
      await new Promise(r => setTimeout(r, 1500));

      const html = await page.content();

      // 출력 경로 결정
      const outPath = route === '/'
        ? join(BUILD_DIR, 'index.html')
        : join(BUILD_DIR, ...route.split('/').filter(Boolean), 'index.html');

      mkdirSync(dirname(outPath), { recursive: true });
      writeFileSync(outPath, html);

      console.log(`  ✓ ${route}  (${Date.now() - t0}ms)`);
    } catch (err) {
      console.warn(`  ✗ ${route}  — ${err.message}`);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  server.close();
  console.log('\nPrerender complete!');
}

prerender().catch(err => {
  console.error('Prerender failed:', err);
  process.exit(1);
});
