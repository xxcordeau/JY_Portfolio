/**
 * Seed script — migrate hardcoded data files into Supabase
 *
 * Run with: npx vite-node src/scripts/seedSupabase.ts
 *
 * This inserts all existing portfolio data (projects, blog metadata,
 * about, chatbot, open source, site settings) into Supabase tables.
 *
 * Blog content (markdown) is NOT migrated here — the legacy JSX
 * component rendering still works as a fallback.
 */

import { createClient } from '@jsr/supabase__supabase-js';

const url = process.env.VITE_SUPABASE_URL ?? '';
const key = process.env.VITE_SUPABASE_ANON_KEY ?? '';

if (!url || !key) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY env vars');
  process.exit(1);
}

const supabase = createClient(url, key);

// ============================================
// Projects
// ============================================
const projects = [
  {
    id: 'winnticket',
    title_ko: 'WinnTicket - 티켓 커머스 플랫폼',
    title_en: 'WinnTicket - Ticket Commerce Platform',
    description_ko: '티켓·바우처 판매부터 현장 검증까지, 멀티채널 기반의 올인원 티켓 커머스 플랫폼',
    description_en: 'An all-in-one multi-channel ticket commerce platform covering ticket & voucher sales to on-site verification',
    full_description_ko: '공연, 레저, 숙박 등 다양한 티켓 상품을 온라인으로 판매하고 관리할 수 있는 풀스택 티켓 커머스 플랫폼입니다.',
    full_description_en: 'A full-stack ticket commerce platform for selling and managing various ticket products including performances, leisure, and accommodations online.',
    role_ko: 'Fullstack Engineer',
    role_en: 'Fullstack Engineer',
    year: '2026',
    tags: ['React', 'TypeScript', 'Spring Boot', 'PostgreSQL', 'Production'],
    cover_image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    tech_frontend: ['React', 'TypeScript', 'Tailwind CSS', 'Radix UI', 'Recharts', 'React Router', 'Vite', 'Motion'],
    tech_backend: ['Spring Boot', 'Java 17', 'MyBatis', 'JPA', 'Spring Security', 'JWT'],
    tech_design: [],
    tech_others: ['PostgreSQL', 'Redis', 'AWS S3', 'KCP Payment', 'Jenkins CI/CD'],
    highlights_ko: [
      '쇼핑몰 + 관리자 + 현장관리자 3개 시스템을 단일 React 앱으로 통합 구축',
      '멀티채널 시스템 설계 - 채널별 독립적 가격 정책·할인율·상품 노출 관리',
      'KCP 결제 연동 및 전액 포인트 결제 지원 구현',
    ],
    highlights_en: [
      'Built 3 systems (shop, admin, field manager) as a single unified React application',
      'Multi-channel system design - independent pricing, discounts, and product exposure per channel',
      'KCP payment integration with full point payment support',
    ],
    link_github: null,
    link_demo: null,
    link_website: 'https://www.winnticket.co.kr/',
    is_featured: true,
    sort_order: 0,
  },
  {
    id: 'tongin-express',
    title_ko: '통인익스프레스 계약 관리 시스템',
    title_en: 'Tongin Express Contract Management System',
    description_ko: '아이패드·태블릿 환경에 최적화된 계약 등록·전자서명·진행 관리 솔루션',
    description_en: 'Contract registration, e-signature, and progress management solution optimized for iPad and tablet environments',
    full_description_ko: '이사 전문 브랜드 통인익스프레스의 계약 관리 프로세스를 디지털화한 아이패드·태블릿 PC 전용 웹 애플리케이션입니다.',
    full_description_en: 'A web application exclusively for iPad and tablet PCs that digitizes the contract management process for Tongin Express.',
    role_ko: 'Frontend Engineer',
    role_en: 'Frontend Engineer',
    year: '2024',
    tags: ['React', 'TypeScript', 'Contract Management', 'E-Signature'],
    cover_image_url: null,
    tech_frontend: ['React', 'TypeScript', 'React Router'],
    tech_backend: [],
    tech_design: [],
    tech_others: [],
    highlights_ko: [
      '태블릿 전용 반응형 UI 설계 및 최적화',
      '전자서명 프로세스 구현',
      '현장 계약 처리 속도 약 60% 단축',
    ],
    highlights_en: [
      'Tablet-optimized responsive UI design and optimization',
      'E-signature process implementation',
      'Reduced on-site contract processing time by approximately 60%',
    ],
    link_github: null,
    link_demo: 'https://hash-scout-17369249.figma.site',
    link_website: null,
    is_featured: false,
    sort_order: 1,
  },
  {
    id: 'keyrke',
    title_ko: '보안 자산관리 플랫폼 Keyrke',
    title_en: 'Security Asset Management Platform Keyrke',
    description_ko: '보안 자산관리 솔루션의 프론트엔드 개발 전반을 담당',
    description_en: 'Led comprehensive frontend development for security asset management solution',
    full_description_ko: '현대 오토에버, 현대 모비스, 현대 케피코 등 주요 기업에 도입된 보안 자산관리 솔루션의 프론트엔드 개발 전반을 담당했습니다.',
    full_description_en: 'Led comprehensive frontend development for a security asset management solution deployed at major companies.',
    role_ko: 'Frontend Engineer',
    role_en: 'Frontend Engineer',
    year: '2023–2025',
    tags: ['Nuxt 3', 'Vue 3', 'TypeScript', 'Enterprise'],
    cover_image_url: null,
    tech_frontend: ['Nuxt 3', 'Vue 3', 'TypeScript', 'Vite'],
    tech_backend: [],
    tech_design: [],
    tech_others: [],
    highlights_ko: [
      'Nuxt 3 기반 대시보드 및 레이아웃 아키텍처 설계',
      '공통 컴포넌트 시스템 개발 - 코드 재사용률 200% 향상',
      '다중 조건 검색 및 태그 필터 시스템 구현',
    ],
    highlights_en: [
      'Designed Nuxt 3-based dashboard and layout architecture',
      'Developed common component system - improving code reusability by 200%',
      'Implemented multi-condition search and tag filter system',
    ],
    link_github: null,
    link_demo: null,
    link_website: null,
    is_featured: false,
    sort_order: 2,
  },
];

// ============================================
// Skills
// ============================================
const skills = [
  { name: 'Vue 3', level: 95, category: 'frontend', sort_order: 0 },
  { name: 'React', level: 85, category: 'frontend', sort_order: 1 },
  { name: 'TypeScript', level: 85, category: 'frontend', sort_order: 2 },
  { name: 'JavaScript', level: 90, category: 'frontend', sort_order: 3 },
  { name: 'Redux', level: 80, category: 'frontend', sort_order: 4 },
  { name: 'Node.js', level: 80, category: 'backend', sort_order: 5 },
  { name: 'Nest.js', level: 80, category: 'backend', sort_order: 6 },
  { name: 'PostgreSQL', level: 75, category: 'backend', sort_order: 7 },
  { name: 'Figma', level: 95, category: 'design', sort_order: 8 },
  { name: 'Illustrator', level: 90, category: 'design', sort_order: 9 },
  { name: 'Photoshop', level: 90, category: 'design', sort_order: 10 },
  { name: 'Git', level: 80, category: 'other', sort_order: 11 },
  { name: 'Swagger / Postman', level: 85, category: 'other', sort_order: 12 },
  { name: 'Jira / Notion / Slack', level: 80, category: 'other', sort_order: 13 },
].map(s => ({ ...s, id: crypto.randomUUID() }));

// ============================================
// Education
// ============================================
const educationData = [
  {
    id: crypto.randomUUID(),
    school_ko: '한양여자대학교',
    school_en: "Hanyang Women's University",
    degree_ko: '학사',
    degree_en: "Bachelor's Degree",
    major_ko: '시각미디어디자인과',
    major_en: 'Visual Media Design',
    period: '2019.03 - 2021.02',
    description_ko: '시각디자인과 웹디자인을 중심으로 학습하며, UI/UX 설계와 디지털 콘텐츠 제작 능력을 길렀습니다.',
    description_en: 'Studied visual design and web design, developing UI/UX design and digital content creation skills.',
    sort_order: 0,
  },
];

// ============================================
// Experiences
// ============================================
const experiencesData = [
  {
    id: crypto.randomUUID(),
    company_ko: '동훈아이텍 (Keyrke)',
    company_en: 'Donghun I-Tech (Keyrke)',
    position_ko: '프론트엔드 개발자',
    position_en: 'Frontend Developer',
    period: '2023.08 - 현재',
    description_ko: '보안 자산관리 솔루션의 프론트엔드 전반을 담당하며, 대규모 관리자 페이지와 사용자 포털 UI를 개발하고 있습니다.',
    description_en: 'Leading comprehensive frontend development for security asset management solution.',
    achievements_ko: [
      'Vue 3, Nuxt 3 기반의 SPA 구조 설계 및 구현',
      '공통 컴포넌트 및 디자인 시스템 구축으로 코드 일관성과 생산성 향상',
      '대시보드, 정책관리, 로그·인증 기록 등 복합 데이터 테이블 UI 개발',
      '런타임 환경 대응형 API 모듈 및 공통 composable 구조 개선',
    ],
    achievements_en: [
      'Designed and implemented SPA structure based on Vue 3 and Nuxt 3',
      'Enhanced code consistency and productivity by building common components and design system',
      'Developed complex data table UI for dashboard, policy management, logs, and authentication records',
      'Improved runtime environment-responsive API modules and common composable structure',
    ],
    sort_order: 0,
  },
  {
    id: crypto.randomUUID(),
    company_ko: '통인익스프레스',
    company_en: 'Tongin Express',
    position_ko: '프론트엔드 개발자 (사내 근무 / 프리랜서)',
    position_en: 'Frontend Developer (In-house / Freelancer)',
    period: '2022.07 - 2023.07',
    description_ko: '처음에는 사내 웹 퍼블리셔로 근무하였고, 이후 외주 프리랜서로 전환하여 계약관리 시스템과 물류 서비스 웹 페이지 개발을 지속적으로 담당했습니다.',
    description_en: 'Initially worked as an in-house web publisher, then transitioned to freelance to continue developing contract management systems.',
    achievements_ko: [
      '계약 등록·관리·서명 프로세스 페이지 개발',
      '반응형 웹 구조 설계 및 관리자 페이지 UI 구현',
      '모바일·태블릿 환경 최적화 및 사용자 경험 개선',
      'Vue.js, SCSS, JavaScript를 활용한 컴포넌트 기반 UI 구축',
    ],
    achievements_en: [
      'Developed contract registration, management, and signature process pages',
      'Designed responsive web structure and implemented admin page UI',
      'Optimized mobile and tablet environments and improved user experience',
      'Built component-based UI using Vue.js, SCSS, and JavaScript',
    ],
    sort_order: 1,
  },
];

// ============================================
// Site Settings
// ============================================
const siteSettings = [
  { key: 'nav_about', value: 'true' },
  { key: 'nav_projects', value: 'true' },
  { key: 'nav_opensource', value: 'true' },
  { key: 'nav_blog', value: 'true' },
  { key: 'nav_contact', value: 'true' },
  { key: 'nav_presentations', value: 'false' },
  { key: 'contact_email', value: 'qazseeszaq3219@gmail.com' },
  { key: 'github_url', value: '' },
  { key: 'linkedin_url', value: '' },
  { key: 'open_to_work', value: 'true' },
];

// ============================================
// Chatbot Categories + Questions
// ============================================
const chatbotCategories = [
  { id: 'intro', icon: '👋', title_ko: '자기소개', title_en: 'Introduction', sort_order: 0 },
  { id: 'tech', icon: '🧠', title_ko: '기술', title_en: 'Technology', sort_order: 1 },
  { id: 'projects', icon: '🧩', title_ko: '프로젝트', title_en: 'Projects', sort_order: 2 },
  { id: 'collaboration', icon: '🤝', title_ko: '일하는 방식 / 협업 철학', title_en: 'Work Style / Collaboration', sort_order: 3 },
  { id: 'values', icon: '🌱', title_ko: '가치관 / 목표', title_en: 'Values / Goals', sort_order: 4 },
  { id: 'contact', icon: '📩', title_ko: '연락', title_en: 'Contact', sort_order: 5 },
];

const chatbotQuestions = [
  // intro
  { id: crypto.randomUUID(), category_id: 'intro', question_ko: '당신은 누구인가요?', question_en: 'Who are you?', answer_ko: '디자인 감각을 바탕으로 인터페이스를 구현하는 프론트엔드 개발자, 허정연입니다.', answer_en: "I'm Jeongyeon Heo, a frontend developer who implements interfaces based on design sense.", action: null, sort_order: 0 },
  { id: crypto.randomUUID(), category_id: 'intro', question_ko: '어떤 일을 하나요?', question_en: 'What do you do?', answer_ko: 'UI/UX 설계부터 실제 화면 개발까지 담당하고 있습니다.', answer_en: 'I handle everything from UI/UX design to actual screen development.', action: null, sort_order: 1 },
  { id: crypto.randomUUID(), category_id: 'intro', question_ko: '디자인도 하시나요?', question_en: 'Do you also do design?', answer_ko: '네, 디자인도 직접 합니다. Figma로 UI를 설계합니다.', answer_en: 'Yes, I do design directly. I design UI with Figma.', action: null, sort_order: 2 },
  // tech
  { id: crypto.randomUUID(), category_id: 'tech', question_ko: '어떤 기술을 주로 사용하나요?', question_en: 'What technologies do you mainly use?', answer_ko: 'Vue 3, Nuxt 3, TypeScript 그리고 Docker 환경에서 개발합니다.', answer_en: 'I develop with Vue 3, Nuxt 3, TypeScript, and Docker environment.', action: null, sort_order: 0 },
  { id: crypto.randomUUID(), category_id: 'tech', question_ko: '코드 스타일이나 철학이 있나요?', question_en: 'Do you have a code style or philosophy?', answer_ko: '읽기 쉬운 코드가 유지보수의 시작이라고 믿습니다.', answer_en: 'I believe readable code is the beginning of maintenance.', action: null, sort_order: 1 },
  // contact
  { id: crypto.randomUUID(), category_id: 'contact', question_ko: '연락드려도 될까요?', question_en: 'Can I contact you?', answer_ko: '물론입니다. 언제든 환영이에요 ☕\nqazseeszaq3219@gmail.com', answer_en: 'Of course. Always welcome ☕\nqazseeszaq3219@gmail.com', action: 'openContact', sort_order: 0 },
];

// ============================================
// Main seed function
// ============================================
async function seed() {
  console.log('🌱 Starting seed...\n');

  // Projects
  console.log('📦 Seeding projects...');
  const { error: projErr } = await supabase.from('projects').upsert(
    projects.map(p => ({ ...p, created_at: new Date().toISOString(), updated_at: new Date().toISOString() })),
    { onConflict: 'id' }
  );
  if (projErr) console.error('  Projects error:', projErr.message);
  else console.log(`  ✅ ${projects.length} projects`);

  // Skills
  console.log('🎯 Seeding skills...');
  const { error: skillErr } = await supabase.from('skills').upsert(skills, { onConflict: 'id' });
  if (skillErr) console.error('  Skills error:', skillErr.message);
  else console.log(`  ✅ ${skills.length} skills`);

  // Education
  console.log('🎓 Seeding education...');
  const { error: eduErr } = await supabase.from('education').upsert(educationData, { onConflict: 'id' });
  if (eduErr) console.error('  Education error:', eduErr.message);
  else console.log(`  ✅ ${educationData.length} education entries`);

  // Experiences
  console.log('💼 Seeding experiences...');
  const { error: expErr } = await supabase.from('experiences').upsert(experiencesData, { onConflict: 'id' });
  if (expErr) console.error('  Experiences error:', expErr.message);
  else console.log(`  ✅ ${experiencesData.length} experiences`);

  // Chatbot
  console.log('💬 Seeding chatbot...');
  const { error: catErr } = await supabase.from('chatbot_categories').upsert(chatbotCategories, { onConflict: 'id' });
  if (catErr) console.error('  Categories error:', catErr.message);
  else console.log(`  ✅ ${chatbotCategories.length} categories`);

  const { error: qErr } = await supabase.from('chatbot_questions').upsert(chatbotQuestions, { onConflict: 'id' });
  if (qErr) console.error('  Questions error:', qErr.message);
  else console.log(`  ✅ ${chatbotQuestions.length} questions`);

  // Site Settings
  console.log('⚙️ Seeding site settings...');
  for (const s of siteSettings) {
    const { error } = await supabase.from('site_settings').upsert(
      { ...s, updated_at: new Date().toISOString() },
      { onConflict: 'key' }
    );
    if (error) console.error(`  Setting "${s.key}" error:`, error.message);
  }
  console.log(`  ✅ ${siteSettings.length} settings`);

  console.log('\n🎉 Seed complete!');
}

seed().catch(console.error);
