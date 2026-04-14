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

// ── Generate portfolio.txt — 모든 콘텐츠를 하나의 텍스트로 ─────
async function generatePortfolioTxt() {
  console.log('Generating portfolio.txt...');
  try {
    const [about, skills, education, experiences, projects, blogs, opensource] = await Promise.all([
      fetch(`${SUPABASE_URL}/rest/v1/site_settings?key=in.(profile_name,profile_job_title,profile_bio)`, { headers: HEADERS }).then(r => r.json()),
      fetch(`${SUPABASE_URL}/rest/v1/skills?order=sort_order`, { headers: HEADERS }).then(r => r.json()),
      fetch(`${SUPABASE_URL}/rest/v1/education?order=sort_order`, { headers: HEADERS }).then(r => r.json()),
      fetch(`${SUPABASE_URL}/rest/v1/experiences?order=sort_order`, { headers: HEADERS }).then(r => r.json()),
      fetch(`${SUPABASE_URL}/rest/v1/projects?order=sort_order`, { headers: HEADERS }).then(r => r.json()),
      fetch(`${SUPABASE_URL}/rest/v1/blog_posts?status=eq.published&order=created_at.desc`, { headers: HEADERS }).then(r => r.json()),
      fetch(`${SUPABASE_URL}/rest/v1/open_source_projects?is_visible=eq.true&order=sort_order`, { headers: HEADERS }).then(r => r.json()),
    ]);

    let txt = '';
    txt += '='.repeat(60) + '\n';
    txt += '허정연 — 프론트엔드 개발자 포트폴리오\n';
    txt += '='.repeat(60) + '\n\n';

    // 기본 정보
    txt += '## 기본 정보\n';
    txt += '이름: 허정연\n';
    txt += '생년월일: 2000.01.28\n';
    txt += '이메일: qazseeszaq3219@gmail.com\n';
    txt += '연락처: 010-2863-7447\n';
    txt += '위치: 서울, 대한민국\n';
    txt += '소개: 사용자 중심의 인터페이스를 설계하고, 섬세한 UI와 부드러운 경험을 만드는 프론트엔드 개발자입니다.\n\n';

    // 기술 스택
    txt += '## 기술 스택\n';
    const grouped = {};
    for (const s of (skills || [])) {
      if (!grouped[s.category]) grouped[s.category] = [];
      grouped[s.category].push(s.name);
    }
    for (const [cat, names] of Object.entries(grouped)) {
      txt += `- ${cat}: ${names.join(', ')}\n`;
    }
    txt += '\n';

    // 학력
    txt += '## 학력\n';
    for (const edu of (education || [])) {
      txt += `- ${edu.school_ko} (${edu.period})\n`;
      txt += `  ${edu.degree_ko} · ${edu.major_ko}\n`;
      if (edu.description_ko) txt += `  ${edu.description_ko}\n`;
    }
    txt += '\n';

    // 경력
    txt += '## 경력\n';
    for (const exp of (experiences || [])) {
      txt += `- ${exp.company_ko} — ${exp.position_ko} (${exp.period})\n`;
      if (exp.description_ko) txt += `  ${exp.description_ko}\n`;
      if (exp.achievements_ko?.length) {
        for (const a of exp.achievements_ko) txt += `  · ${a}\n`;
      }
    }
    txt += '\n';

    // 프로젝트
    txt += '## 프로젝트\n';
    for (const p of (projects || [])) {
      txt += `### ${p.title_ko}\n`;
      txt += `${p.description_ko}\n`;
      if (p.full_description_ko) txt += `${p.full_description_ko}\n`;
      if (p.tech_stack?.length) txt += `기술: ${p.tech_stack.join(', ')}\n`;
      txt += '\n';
    }

    // 블로그
    txt += '## 블로그\n';
    for (const b of (blogs || [])) {
      txt += `### ${b.title_ko}\n`;
      txt += `날짜: ${b.created_at?.slice(0, 10) || ''}\n`;
      if (b.excerpt_ko) txt += `요약: ${b.excerpt_ko}\n`;
      if (b.content_ko) {
        // 마크다운 본문 전체 포함
        txt += `\n${b.content_ko}\n`;
      }
      txt += '\n---\n\n';
    }

    // 오픈소스
    txt += '## 컴포넌트 라이브러리\n';
    for (const o of (opensource || [])) {
      txt += `### ${o.name}\n`;
      if (o.description_ko) txt += `${o.description_ko}\n`;
      if (o.long_description_ko) txt += `${o.long_description_ko}\n`;
      if (o.tech_stack?.length) txt += `기술: ${o.tech_stack.join(', ')}\n`;
      if (o.github_url) txt += `GitHub: ${o.github_url}\n`;
      if (o.npm_url) txt += `NPM: ${o.npm_url}\n`;
      txt += '\n';
    }

    writeFileSync(join(BUILD_DIR, 'portfolio.txt'), txt, 'utf-8');
    console.log(`  ✓ portfolio.txt (${(txt.length / 1024).toFixed(1)}KB)`);
  } catch (err) {
    console.warn('  ⚠ portfolio.txt generation failed:', err.message);
  }
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

  // portfolio.txt 생성
  await generatePortfolioTxt();

  console.log('\nPrerender complete!');
}

prerender().catch(err => {
  // CI에서 Puppeteer 실패 시에도 빌드는 성공하도록 (SPA 폴백 유지)
  console.warn('⚠ Prerender skipped:', err.message);
  console.warn('  Build output will use SPA shell only.');
  process.exit(0);
});
