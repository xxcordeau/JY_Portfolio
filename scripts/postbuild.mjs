/**
 * Next 정적 빌드(out/) 후처리.
 *  1) portfolio.txt — 사이트 전체 콘텐츠를 하나의 텍스트로 (크롤러·LLM용)
 *  2) sitemap.xml   — 생성된 모든 HTML 경로
 *  3) robots.txt    — admin 제외
 *
 * (Vite 시절 scripts/prerender.mjs 가 하던 일 중 SSG로 대체되지 않는 부분)
 */
import { writeFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join, dirname, relative } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'out');
const SITE_URL = 'https://developer-pino.info';

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wdedhluxoicizxqojadx.supabase.co';
const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkZWRobHV4b2ljaXp4cW9qYWR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2MjkwNDAsImV4cCI6MjA5MTIwNTA0MH0.SI9KL0LiGVVm_TWB4n6hr0rwKSh_IUWmo4qx8aNqXmw';

const HEADERS = { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` };

const get = (q) =>
  fetch(`${SUPABASE_URL}/rest/v1/${q}`, { headers: HEADERS })
    .then((r) => (r.ok ? r.json() : []))
    .catch(() => []);

async function generatePortfolioTxt() {
  const [skills, education, experiences, projects, blogs, opensource] = await Promise.all([
    get('skills?order=sort_order'),
    get('education?order=sort_order'),
    get('experiences?order=sort_order'),
    get('projects?order=sort_order'),
    get('blog_posts?status=eq.published&order=created_at.desc'),
    get('open_source_projects?is_visible=eq.true&order=sort_order'),
  ]);

  let txt = '';
  txt += '='.repeat(60) + '\n';
  txt += '허정연 — 프론트엔드 개발자 포트폴리오\n';
  txt += '='.repeat(60) + '\n\n';

  txt += '## 기본 정보\n';
  txt += '이름: 허정연\n';
  txt += '생년월일: 2000.01.28\n';
  txt += '이메일: qazseeszaq3219@gmail.com\n';
  txt += '위치: 서울, 대한민국\n';
  txt += '소개: 디자인을 전공하고, 직접 만들어보고 싶어서 개발을 시작한 프론트엔드 개발자입니다.\n\n';

  txt += '## 기술 스택\n';
  const grouped = {};
  for (const s of skills || []) {
    (grouped[s.category] ||= []).push(s.name);
  }
  for (const [cat, names] of Object.entries(grouped)) {
    txt += `- ${cat}: ${names.join(', ')}\n`;
  }
  txt += '\n';

  txt += '## 학력\n';
  for (const edu of education || []) {
    txt += `- ${edu.school_ko} (${edu.period})\n`;
    txt += `  ${edu.degree_ko} · ${edu.major_ko}\n`;
    if (edu.description_ko) txt += `  ${edu.description_ko}\n`;
  }
  txt += '\n';

  txt += '## 경력\n';
  for (const exp of experiences || []) {
    txt += `- ${exp.company_ko} — ${exp.position_ko} (${exp.period})\n`;
    if (exp.description_ko) txt += `  ${exp.description_ko}\n`;
    for (const a of exp.achievements_ko || []) txt += `  · ${a}\n`;
  }
  txt += '\n';

  txt += '## 프로젝트\n';
  for (const p of projects || []) {
    txt += `### ${p.title_ko}\n`;
    if (p.description_ko) txt += `${p.description_ko}\n`;
    if (p.full_description_ko) txt += `${p.full_description_ko}\n`;
    const tech = [p.tech_frontend, p.tech_backend, p.tech_others].flat().filter(Boolean);
    if (tech.length) txt += `기술: ${tech.join(', ')}\n`;
    txt += '\n';
  }

  txt += '## 블로그\n';
  for (const b of blogs || []) {
    txt += `### ${b.title_ko}\n`;
    txt += `날짜: ${(b.date || b.created_at || '').slice(0, 10)}\n`;
    if (b.excerpt_ko) txt += `요약: ${b.excerpt_ko}\n`;
    if (b.content_ko) txt += `\n${b.content_ko}\n`;
    txt += '\n---\n\n';
  }

  txt += '## 컴포넌트 라이브러리\n';
  for (const o of opensource || []) {
    txt += `### ${o.name}\n`;
    if (o.description_ko) txt += `${o.description_ko}\n`;
    if (o.full_description_ko) txt += `${o.full_description_ko}\n`;
    if (o.link_github) txt += `GitHub: ${o.link_github}\n`;
    if (o.link_npm) txt += `NPM: ${o.link_npm}\n`;
    txt += '\n';
  }

  writeFileSync(join(OUT_DIR, 'portfolio.txt'), txt, 'utf-8');
  console.log(`  portfolio.txt (${(txt.length / 1024).toFixed(1)}KB)`);
}

function collectRoutes(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      collectRoutes(full, acc);
    } else if (entry === 'index.html') {
      const rel = relative(OUT_DIR, dirname(full)).split(/[\/]/).filter(Boolean).join('/');
      acc.push(rel ? `/${rel}/` : '/');
    }
  }
  return acc;
}

function generateSitemapAndRobots() {
  const routes = collectRoutes(OUT_DIR)
    .filter((r) => !r.startsWith('/admin'))
    .sort();

  const urls = routes
    .map((r) => `  <url><loc>${SITE_URL}${r}</loc></url>`)
    .join('\n');

  writeFileSync(
    join(OUT_DIR, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    'utf-8',
  );
  console.log(`  sitemap.xml (${routes.length} routes)`);

  writeFileSync(
    join(OUT_DIR, 'robots.txt'),
    `User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
    'utf-8',
  );
  console.log('  robots.txt');
}

if (!existsSync(OUT_DIR)) {
  console.error('[postbuild] out/ 이 없습니다. next build 를 먼저 실행하세요.');
  process.exit(1);
}

console.log('[postbuild] 정적 자산 생성 중...');
await generatePortfolioTxt();
generateSitemapAndRobots();
console.log('[postbuild] 완료');
