-- ============================================================
-- FULL SEED — JY Portfolio Supabase
-- Supabase Dashboard > SQL Editor에 붙여넣기 후 실행하세요
-- ============================================================

-- ============================================================
-- 1. RLS 정책 설정 (관리자가 수정 가능하도록)
-- ============================================================

-- blog_posts: anon은 published만 읽기, authenticated는 모든 작업 가능
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public read published" ON blog_posts;
DROP POLICY IF EXISTS "admin all" ON blog_posts;
CREATE POLICY "public read published" ON blog_posts FOR SELECT TO anon USING (status = 'published');
CREATE POLICY "admin all" ON blog_posts FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- projects: anon 읽기, authenticated 모든 작업
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public read" ON projects;
DROP POLICY IF EXISTS "admin all" ON projects;
CREATE POLICY "public read" ON projects FOR SELECT TO anon USING (true);
CREATE POLICY "admin all" ON projects FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- open_source_projects
ALTER TABLE open_source_projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public read visible" ON open_source_projects;
DROP POLICY IF EXISTS "admin all" ON open_source_projects;
CREATE POLICY "public read visible" ON open_source_projects FOR SELECT TO anon USING (is_visible = true);
CREATE POLICY "admin all" ON open_source_projects FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- skills
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public read" ON skills;
DROP POLICY IF EXISTS "admin all" ON skills;
CREATE POLICY "public read" ON skills FOR SELECT TO anon USING (true);
CREATE POLICY "admin all" ON skills FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- education
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public read" ON education;
DROP POLICY IF EXISTS "admin all" ON education;
CREATE POLICY "public read" ON education FOR SELECT TO anon USING (true);
CREATE POLICY "admin all" ON education FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- experiences
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public read" ON experiences;
DROP POLICY IF EXISTS "admin all" ON experiences;
CREATE POLICY "public read" ON experiences FOR SELECT TO anon USING (true);
CREATE POLICY "admin all" ON experiences FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- chatbot_categories
ALTER TABLE chatbot_categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public read" ON chatbot_categories;
DROP POLICY IF EXISTS "admin all" ON chatbot_categories;
CREATE POLICY "public read" ON chatbot_categories FOR SELECT TO anon USING (true);
CREATE POLICY "admin all" ON chatbot_categories FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- chatbot_questions
ALTER TABLE chatbot_questions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public read" ON chatbot_questions;
DROP POLICY IF EXISTS "admin all" ON chatbot_questions;
CREATE POLICY "public read" ON chatbot_questions FOR SELECT TO anon USING (true);
CREATE POLICY "admin all" ON chatbot_questions FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- site_settings
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public read" ON site_settings;
DROP POLICY IF EXISTS "admin all" ON site_settings;
CREATE POLICY "public read" ON site_settings FOR SELECT TO anon USING (true);
CREATE POLICY "admin all" ON site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================================
-- 2. Blog Posts 데이터 (13개)
-- ============================================================
INSERT INTO blog_posts (id, title_ko, title_en, excerpt_ko, excerpt_en, category_ko, category_en, read_time_ko, read_time_en, tags, thumbnail_url, status, date, content_ko, content_en, created_at, updated_at)
VALUES
  (
    'react-page-refactoring',
    'React 페이지 구조 리팩토링과 코드 스플리팅 적용 경험',
    'React Page Structure Refactoring and Code Splitting Experience',
    '73개의 페이지 파일이 뒤섞인 구조를 도메인 기반으로 재편하고, React.lazy + Suspense로 초기 번들을 79% 줄인 경험을 공유합니다.',
    'Reorganized 73 mixed page files into domain-based structure and reduced initial bundle by 79% with React.lazy + Suspense.',
    '개발', 'Development', '8분', '8 min',
    ARRAY['React', 'TypeScript', 'Vite', 'Code Splitting', 'Refactoring'],
    'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=800&q=80',
    'published', '2026-04-07', '', '',
    NOW(), NOW()
  ),
  (
    'dynamic-static-import',
    'React.lazy + Suspense 적용 시 마주친 dynamic/static import 혼용 문제',
    'Dynamic vs Static Import Mixing Issues with React.lazy + Suspense',
    'React.lazy 코드 스플리팅 적용 후 Vite 빌드에서 발생한 dynamic/static import 혼용 경고의 원인과 해결 과정을 공유합니다.',
    'Sharing the root cause and resolution of dynamic/static import mixing warnings in Vite builds after applying React.lazy code splitting.',
    '개발', 'Development', '6분', '6 min',
    ARRAY['React', 'Vite', 'Code Splitting', 'Bundling'],
    'https://images.unsplash.com/photo-1551033406-611cf9a28f67?w=800&q=80',
    'published', '2026-04-07', '', '',
    NOW(), NOW()
  ),
  (
    'api-mismatch-usememo-crash',
    'API 응답 형식 불일치와 useMemo 크래시 — undefined는 조용히 퍼져요',
    'API Response Mismatch and useMemo Crash — undefined Spreads Silently',
    'API가 배열을 바로 반환하는데 response.data.content로 접근하면 undefined가 됩니다. 그 undefined가 useMemo까지 전파되어 크래시를 일으킨 과정을 기록했습니다.',
    'When an API returns an array directly but you access response.data.content, you get undefined. Documenting how that undefined propagated into useMemo and caused a crash.',
    '개발', 'Development', '6분', '6 min',
    ARRAY['React', 'TypeScript', 'useMemo', '디버깅'],
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80',
    'published', '2025-12-10', '', '',
    NOW(), NOW()
  ),
  (
    'hidden-div-react-rendering',
    '숨겨진 div의 역습 — React에서 hidden 클래스는 조건부 렌더링이 아니에요',
    'The Hidden Div Strike Back — CSS hidden Is Not Conditional Rendering in React',
    'className="hidden"으로 숨긴 컴포넌트가 여전히 JS를 실행하고 있었어요. display:none과 조건부 렌더링의 차이를 정리했습니다.',
    'A component hidden with className="hidden" was still executing JavaScript. Clarifying the difference between display:none and conditional rendering.',
    '개발', 'Development', '4분', '4 min',
    ARRAY['React', 'JSX', '렌더링'],
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
    'published', '2025-11-20', '', '',
    NOW(), NOW()
  ),
  (
    'css-print-layer-conflict',
    '@media print과 CSS 레이어의 충돌 — 인쇄 헤더가 사라지지 않던 이유',
    E'@media print vs CSS Layers Conflict — Why the Print Header Wouldn''t Hide',
    '@layer 안에 작성한 @media print 규칙이 왜 무시되는지, CSS 캐스케이드 레이어의 우선순위 구조를 파헤쳐봤습니다.',
    'Investigating why @media print rules inside @layer get ignored, and understanding the CSS cascade layer priority structure.',
    '개발', 'Development', '5분', '5 min',
    ARRAY['@media print', 'CSS', '@layer', 'React'],
    'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&q=80',
    'published', '2025-10-15', '', '',
    NOW(), NOW()
  ),
  (
    'common-utils-composable',
    '공통 유틸/컴포저블 분리 사례',
    'Common Utility/Composable Separation Case Study',
    'i18n 처리, 권한 체크, 파일 포맷, 아이콘 스타일 등 중복 로직을 명시적 함수 호출 가능한 유틸/컴포저블로 분리한 경험을 공유합니다.',
    'Sharing experience of separating duplicate logic like i18n handling, permission checks, file formats, and icon styles into explicitly callable utils/composables.',
    '개발', 'Development', '9분', '9 min',
    ARRAY['Vue', 'Composable', 'Utils', 'Code Quality'],
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
    'published', '2024-10-21', '', '',
    NOW(), NOW()
  ),
  (
    'dashboard-widget-system',
    '모듈형 대시보드 위젯 시스템',
    'Modular Dashboard Widget System',
    '여러 독립 모듈이 공존하는 대시보드를 메타 데이터 기반 동적 렌더링과 공통 상태 관리로 구조화한 경험을 공유합니다.',
    'Sharing experience of structuring a dashboard with multiple independent modules through metadata-based dynamic rendering and common state management.',
    '개발', 'Development', '7분', '7 min',
    ARRAY['Vue', 'Dashboard', 'Dynamic Components', 'Modular Design'],
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    'published', '2024-10-21', '', '',
    NOW(), NOW()
  ),
  (
    'view-state-standardization',
    '에러/로딩/빈 상태 UI의 전역 표준화',
    'Global Standardization of Error/Loading/Empty State UI',
    '모든 화면에서 일관된 로딩/에러/빈 상태 경험을 제공하기 위한 전역 컴포넌트와 composable 패턴 구축 사례를 공유합니다.',
    'Sharing a case of building global components and composable patterns to provide consistent loading/error/empty state experiences across all screens.',
    '개발', 'Development', '10분', '10 min',
    ARRAY['Vue', 'UX', 'State Management', 'Error Handling'],
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
    'published', '2024-10-21', '', '',
    NOW(), NOW()
  ),
  (
    'role-permission-system',
    '권한(Role)별 접근 제어 시스템',
    'Role-Based Access Control System',
    '사용자 역할에 따른 페이지/기능 접근 제어를 중앙 composable로 통합하여 일관된 권한 관리를 구현한 경험을 공유합니다.',
    'Sharing experience of implementing consistent permission management by integrating page/feature access control based on user roles into a central composable.',
    '개발', 'Development', '8분', '8 min',
    ARRAY['Vue', 'Security', 'Access Control', 'Authorization'],
    'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80',
    'published', '2024-10-21', '', '',
    NOW(), NOW()
  ),
  (
    'table-component-structuring',
    '공통 테이블 컴포넌트 구조화 경험',
    'Common Table Component Structuring Experience',
    '페이지네이션, 정렬, URL 동기화가 필요한 복잡한 테이블 시스템을 공통 컴포넌트로 구조화하며 배운 데이터 흐름 제어 전략을 공유합니다.',
    'Sharing data flow control strategies learned while structuring a complex table system requiring pagination, sorting, and URL synchronization into a common component.',
    '개발', 'Development', '7분', '7 min',
    ARRAY['Vue', 'Composable', 'Table UI', 'State Management'],
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
    'published', '2024-10-21', '', '',
    NOW(), NOW()
  ),
  (
    'filter-system-implementation',
    '검색 필터 시스템 구현 경험',
    'Search Filter System Implementation Experience',
    '다중 조건 조합, 태그 시각화, 상태 유지가 필요한 복잡한 필터 시스템을 구현하며 배운 독립형 상태 관리 전략을 공유합니다.',
    'Sharing independent state management strategies learned while implementing a complex filter system with multiple conditions, tag visualization, and state persistence.',
    '개발', 'Development', '6분', '6 min',
    ARRAY['Vue', 'State Management', 'Pinia', 'Filter UI'],
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    'published', '2024-10-21', '', '',
    NOW(), NOW()
  ),
  (
    'tree-structure-management',
    '트리 구조 기반 사용자/자산 관리 화면 구현 경험',
    'Tree-Based User/Asset Management UI Implementation Experience',
    'Lazy-loading, 자동 확장, 양방향 동기화가 필요한 복잡한 트리 UI를 구현하며 배운 상태 관리 전략을 공유합니다.',
    'Sharing state management strategies learned while implementing complex tree UI with Lazy-loading, auto-expansion, and bi-directional synchronization.',
    '개발', 'Development', '8분', '8 min',
    ARRAY['Vue', 'State Management', 'Tree UI', 'Performance'],
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
    'published', '2024-10-21', '', '',
    NOW(), NOW()
  ),
  (
    'icon-system-implementation',
    '전역 아이콘 시스템 구축 경험',
    'Global Icon System Implementation Experience',
    '수십 개 화면에 걸친 아이콘의 색상, 크기, 상태를 일관되게 관리하기 위한 메타데이터 기반 전역 아이콘 시스템 구축 경험을 공유합니다.',
    'Sharing experience of building a metadata-based global icon system to consistently manage colors, sizes, and states of icons across dozens of screens.',
    '개발', 'Development', '6분', '6 min',
    ARRAY['Vue', 'Design System', 'Icons', 'UI Consistency'],
    'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
    'published', '2024-10-21', '', '',
    NOW(), NOW()
  )
ON CONFLICT (id) DO UPDATE SET
  title_ko = EXCLUDED.title_ko,
  title_en = EXCLUDED.title_en,
  excerpt_ko = EXCLUDED.excerpt_ko,
  excerpt_en = EXCLUDED.excerpt_en,
  category_ko = EXCLUDED.category_ko,
  category_en = EXCLUDED.category_en,
  read_time_ko = EXCLUDED.read_time_ko,
  read_time_en = EXCLUDED.read_time_en,
  tags = EXCLUDED.tags,
  thumbnail_url = EXCLUDED.thumbnail_url,
  status = EXCLUDED.status,
  date = EXCLUDED.date,
  updated_at = NOW();

-- ============================================================
-- 3. 결과 확인
-- ============================================================
SELECT id, title_ko, status, date FROM blog_posts ORDER BY date DESC;
