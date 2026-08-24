/**
 * 빌드 타임에 Supabase에서 동적 라우트 ID를 가져온다.
 * output:'export' 에서는 여기서 반환한 경로만 정적 생성되므로,
 * 기존 puppeteer prerender 스크립트가 하던 역할을 그대로 대체한다.
 */
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wdedhluxoicizxqojadx.supabase.co';
const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkZWRobHV4b2ljaXp4cW9qYWR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2MjkwNDAsImV4cCI6MjA5MTIwNTA0MH0.SI9KL0LiGVVm_TWB4n6hr0rwKSh_IUWmo4qx8aNqXmw';

const HEADERS = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
};

async function fetchIds(query: string, label: string): Promise<string[]> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${query}`, { headers: HEADERS });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const rows = await res.json();
    if (!Array.isArray(rows)) return [];
    return rows.map((r: { id: string | number }) => String(r.id));
  } catch (err) {
    // 빌드를 중단시키지 않는다 — 목록 페이지는 클라이언트에서 여전히 동작
    console.warn(`[staticParams] ${label} 조회 실패, 건너뜀:`, (err as Error).message);
    return [];
  }
}

export const getProjectIds = () =>
  fetchIds('projects?select=id&order=sort_order', 'projects');

export const getBlogIds = () =>
  fetchIds('blog_posts?select=id&status=eq.published&order=created_at.desc', 'blog_posts');

export const getOpenSourceIds = () =>
  fetchIds('open_source_projects?select=id&is_visible=eq.true&order=sort_order', 'open_source_projects');

// ── 상세 페이지 메타데이터용 단건 조회 ────────────────────────────
async function fetchOne<T>(query: string): Promise<T | null> {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${query}`, { headers: HEADERS });
    if (!res.ok) return null;
    const rows = await res.json();
    return Array.isArray(rows) && rows.length ? (rows[0] as T) : null;
  } catch {
    return null;
  }
}

export type ProjectMeta = {
  title_ko?: string; title_en?: string;
  description_ko?: string; description_en?: string;
  tags?: string[];
  cover_image_url?: string;
};

export type BlogMeta = {
  title_ko?: string; title_en?: string;
  excerpt_ko?: string; excerpt_en?: string;
  date?: string; created_at?: string;
  tags?: string[];
  thumbnail_url?: string;
};

export type OpenSourceMeta = {
  name?: string;
  description_ko?: string; description_en?: string;
  tags?: string[];
  image_url?: string;
};

export const getProject = (id: string) =>
  fetchOne<ProjectMeta>(`projects?id=eq.${encodeURIComponent(id)}&limit=1`);

export const getBlogPost = (id: string) =>
  fetchOne<BlogMeta>(`blog_posts?id=eq.${encodeURIComponent(id)}&limit=1`);

export const getOpenSourceProject = (id: string) =>
  fetchOne<OpenSourceMeta>(`open_source_projects?id=eq.${encodeURIComponent(id)}&limit=1`);
