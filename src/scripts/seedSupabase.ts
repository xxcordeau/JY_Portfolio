/**
 * Seed script — migrate ALL hardcoded data files into Supabase
 *
 * Run with: VITE_SUPABASE_URL=... VITE_SUPABASE_ANON_KEY=... npx tsx src/scripts/seedSupabase.ts
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
// Projects (3) — COMPLETE DATA
// ============================================
const projects = [
  {
    id: 'winnticket',
    title_ko: 'WinnTicket - 티켓 커머스 플랫폼',
    title_en: 'WinnTicket - Ticket Commerce Platform',
    description_ko: '티켓·바우처 판매부터 현장 검증까지, 멀티채널 기반의 올인원 티켓 커머스 플랫폼',
    description_en: 'An all-in-one multi-channel ticket commerce platform covering ticket & voucher sales to on-site verification',
    full_description_ko: '공연, 레저, 숙박 등 다양한 티켓 상품을 온라인으로 판매하고 관리할 수 있는 풀스택 티켓 커머스 플랫폼입니다. 쇼핑몰(고객용), 관리자 대시보드, 현장 관리자 시스템까지 하나의 통합 플랫폼으로 구축했습니다.\n\n채널별 가격 정책, 시즌별 요금 관리, 파트너사 할인 시스템, QR/바코드 쿠폰 발행, KCP 결제 연동, 주문 관리, 커뮤니티(공지·이벤트·FAQ·1:1문의), 배너/팝업 관리 등 실제 운영에 필요한 모든 기능을 포함합니다.\n\n역할 기반 접근 제어(RBAC)를 통해 관리자와 현장 관리자의 권한을 분리하고, 현장에서는 티켓 스캐너를 통한 실시간 입장 검증이 가능합니다. React.lazy 코드 스플리팅과 Suspense를 적용하여 초기 로딩 성능을 최적화했습니다.',
    full_description_en: 'A full-stack ticket commerce platform for selling and managing various ticket products including performances, leisure, and accommodations online. Built as a unified platform covering the shopping mall (customer-facing), admin dashboard, and field manager system.\n\nIncludes all features needed for real operations: channel-specific pricing, seasonal rate management, partner discount systems, QR/barcode coupon issuance, KCP payment integration, order management, community (notices, events, FAQ, inquiries), and banner/popup management.\n\nRole-based access control (RBAC) separates admin and field manager permissions, with real-time ticket scanning for on-site entry verification. Optimized initial loading performance with React.lazy code splitting and Suspense.',
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
      'QR코드/바코드 기반 티켓 쿠폰 발행 및 현장 스캐너 검증 시스템 개발',
      'RBAC(역할 기반 접근 제어) 설계 - 관리자/현장관리자 권한 분리',
      'Spring Boot + MyBatis + PostgreSQL 기반 RESTful API 설계 및 구현',
      'JWT + Spring Security 기반 인증/인가 시스템 구축',
      'AWS S3 파일 업로드, Redis 세션 관리, Excel 데이터 내보내기 구현',
      'React.lazy + Suspense 코드 스플리팅으로 초기 로딩 성능 최적화',
      '시즌별 요금 관리, 상품 옵션 시스템, 파트너사 할인 관리 등 복잡한 비즈니스 로직 구현',
    ],
    highlights_en: [
      'Built 3 systems (shop, admin, field manager) as a single unified React application',
      'Multi-channel system design - independent pricing, discounts, and product exposure per channel',
      'KCP payment integration with full point payment support',
      'QR/barcode ticket coupon issuance and on-site scanner verification system',
      'RBAC design - separated admin and field manager permissions',
      'RESTful API design and implementation with Spring Boot + MyBatis + PostgreSQL',
      'JWT + Spring Security authentication/authorization system',
      'AWS S3 file uploads, Redis session management, Excel data export',
      'Initial loading optimization with React.lazy + Suspense code splitting',
      'Complex business logic: seasonal pricing, product options, partner discount management',
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
    full_description_ko: '이사 전문 브랜드 통인익스프레스의 계약 관리 프로세스를 디지털화한 아이패드·태블릿 PC 전용 웹 애플리케이션입니다. 현장 영업사원이 고객 방문 시 태블릿으로 바로 계약을 등록하고, 문자 전송을 통해 계약서 서명을 진행할 수 있도록 설계되었습니다.\n\n계약 등록, 견적 관리, 계약서 작성 및 전송, 고객 서명 완료, 진행 상태 관리까지 모든 과정을 실시간으로 연동하며, 관리자 페이지에서는 계약 내역 조회, 계약 진행 현황 모니터링, 서명 로그 추적 등을 지원합니다.\n\n이 시스템을 통해 오프라인 중심이던 계약 절차가 완전히 디지털화되어 업무 속도와 고객 응답률이 대폭 향상되었습니다.\n\n※ 이 애플리케이션은 태블릿 환경에 최적화되어 있으므로 모바일 모드로 확인해야 합니다.',
    full_description_en: 'A web application exclusively for iPad and tablet PCs that digitizes the contract management process for Tongin Express, a professional moving service brand. Designed to allow field sales representatives to register contracts directly on tablets during customer visits and proceed with contract signatures through text message transmission.\n\nAll processes are synchronized in real-time, including contract registration, quotation management, contract creation and transmission, customer signature completion, and progress status management. The admin page supports contract history inquiries, contract progress monitoring, and signature log tracking.\n\nThrough this system, the previously offline-centered contract process has been completely digitized, significantly improving work speed and customer response rates.\n\n※ This application is optimized for tablet environments and should be viewed in mobile mode.',
    role_ko: 'Frontend Engineer',
    role_en: 'Frontend Engineer',
    year: '2024',
    tags: ['React', 'TypeScript', 'Contract Management', 'E-Signature'],
    cover_image_url: 'https://images.unsplash.com/photo-1670852714979-f73d21652a83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YWJsZXQlMjBjb250cmFjdCUyMGRpZ2l0YWwlMjBzaWduYXR1cmV8ZW58MXx8fHwxNzYxMTM0Mzc4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    tech_frontend: ['React', 'TypeScript', 'React Router'],
    tech_backend: [],
    tech_design: [],
    tech_others: [],
    highlights_ko: [
      '태블릿 전용 반응형 UI 설계 및 최적화 - 아이패드 해상도 기준으로 터치 중심 UX 구성',
      '전자서명 프로세스 구현 - 계약서 링크를 문자로 발송 → 고객 서명 완료 시 실시간 상태 업데이트',
      '계약 등록 및 진행 관리 모듈 개발 - 계약 생성, 수정, 취소, 상태 변경 로직 구현',
      '관리자 페이지 구축 - 계약 현황, 통계, 서명 로그 관리 기능 추가',
      '상태 관리 및 데이터 구조 설계 - React + TypeScript 기반으로 명확한 상태 흐름 및 API 모듈화',
      '현장 계약 처리 속도 약 60% 단축',
      '서명 완료율 35% 증가',
      '관리자 업무 효율성 및 실시간 추적성 강화',
    ],
    highlights_en: [
      'Tablet-optimized responsive UI design and optimization - Touch-centric UX based on iPad resolution',
      'E-signature process implementation - Send contract links via text → Real-time status updates upon customer signature completion',
      'Contract registration and progress management module development - Implemented contract creation, modification, cancellation, and status change logic',
      'Admin page construction - Added contract status, statistics, and signature log management features',
      'State management and data structure design - Clear state flow and API modularization based on React + TypeScript',
      'Reduced on-site contract processing time by approximately 60%',
      'Increased signature completion rate by 35%',
      'Enhanced administrator work efficiency and real-time tracking capabilities',
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
    full_description_ko: '현대 오토에버, 현대 모비스, 현대 케피코 등 주요 기업에 도입된 보안 자산관리 솔루션의 프론트엔드 개발 전반을 담당했습니다. 이 플랫폼은 조직 내 단말기의 자산 현황, 보안 정책, 스토리지 사용량, 원드라이브 동기화, 하드웨어 관리, 보고서 생성 등 기업 정보보호 체계를 통합적으로 관리할 수 있는 시스템입니다.\n\nNuxt 3 및 TypeScript 기반으로 프론트엔드 아키텍처를 설계하고, 공통 컴포넌트 시스템과 다중 조건 검색 엔진, 트리 구조 탐색 UI를 구축했습니다. 또한, 대규모 데이터 렌더링과 비동기 API 호출 성능을 최적화하여 수천 건의 로그 데이터도 안정적으로 처리할 수 있는 구조를 완성했습니다.',
    full_description_en: 'Led comprehensive frontend development for a security asset management solution deployed at major companies including Hyundai AutoEver, Hyundai Mobis, and Hyundai Kefico. This platform is an integrated system for managing enterprise information security framework, including asset status, security policies, storage usage, OneDrive synchronization, hardware management, and report generation.\n\nDesigned frontend architecture based on Nuxt 3 and TypeScript, built common component system, multi-condition search engine, and tree structure navigation UI. Additionally, optimized large-scale data rendering and asynchronous API call performance to create a structure capable of stably processing thousands of log data entries.',
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
      'Nuxt 3 기반 대시보드 및 레이아웃 아키텍처 설계 - 모듈별로 확장 가능한 폴더 구조와 공통 컴포저블을 정의',
      '공통 컴포넌트 시스템 개발 - 테이블, 폼, 트리뷰, 드롭다운 등 UI 전반을 모듈화하여 코드 재사용률 200% 향상',
      '다중 조건 검색 및 태그 필터 시스템 구현 - 날짜, 사용자, 상태, 정책, 장치 유형 등 복합 조건 검색을 지원하고 상태 동기화 유지',
      '스토리지·하드웨어·원드라이브 관리 UI 구축 - 대규모 데이터를 가볍게 처리할 수 있는 lazy-load 기반 구조로 렌더링 성능 최적화',
      '보고서 및 로그 시각화 기능 - Ant Design Vue Chart 및 커스텀 그래프 컴포넌트를 이용해 실시간 보고서 UI 개발',
      '공통화 구조 도입으로 신규 모듈 개발 속도 2배 향상',
      '필터 구조 개선으로 검색 응답 속도 30% 단축',
      '유지보수성 및 코드 일관성 강화로 프론트엔드 전면 책임 운영 가능',
    ],
    highlights_en: [
      'Designed Nuxt 3-based dashboard and layout architecture - Defined scalable folder structure and common composables per module',
      'Developed common component system - Modularized UI including tables, forms, tree views, dropdowns, improving code reusability by 200%',
      'Implemented multi-condition search and tag filter system - Supports complex searches by date, user, status, policy, device type while maintaining state synchronization',
      'Built storage, hardware, and OneDrive management UI - Optimized rendering performance with lazy-load based structure for handling large-scale data',
      'Report and log visualization features - Developed real-time report UI using Ant Design Vue Chart and custom graph components',
      'Doubled new module development speed through common structure implementation',
      'Reduced search response time by 30% through filter structure improvements',
      'Enhanced maintainability and code consistency enabling full frontend responsibility operations',
    ],
    link_github: null,
    link_demo: null,
    link_website: null,
    is_featured: false,
    sort_order: 2,
  },
];

// ============================================
// Open Source Projects (2) — NEW
// ============================================
const openSourceProjects = [
  {
    id: 'awesome-ui-kit',
    name: 'Awesome UI Kit',
    description_ko: '개발자를 위한 아름답고 접근성 높은 React 컴포넌트 라이브러리',
    description_en: 'Beautiful and accessible React component library for developers',
    full_description_ko: '개발자들이 쉽고 빠르게 아름다운 UI를 구축할 수 있도록 설계된 React 컴포넌트 라이브러리입니다. Radix UI 기반으로 접근성(WAI-ARIA)을 보장하며, styled-components와 다크 모드를 기본 지원합니다.\n\nnpm에 jy-awesome-ui로 배포되어 누구나 설치 가능합니다. Accordion, Button, Card, Dialog, Tabs 등 62개의 프로덕션 레디 컴포넌트를 포함하며, Tree-shaking을 지원하여 번들 사이즈를 최소화합니다.',
    full_description_en: 'A React component library designed to help developers build beautiful UIs quickly and easily. Built on Radix UI primitives for WAI-ARIA accessibility, with styled-components and built-in dark mode support.\n\nPublished on npm as jy-awesome-ui for anyone to install. Includes 62 production-ready components such as Accordion, Button, Card, Dialog, Tabs, and more. Supports tree-shaking for minimal bundle size.',
    category_ko: 'UI 컴포넌트',
    category_en: 'UI Components',
    tags: ['React', 'TypeScript', 'UI Library', 'Components'],
    stat_stars: '-',
    stat_downloads: '-',
    stat_components: '62',
    stat_contributors: '1',
    link_github: 'https://github.com/xxcordeau/jy-awesome-ui',
    link_npm: 'https://www.npmjs.com/package/jy-awesome-ui',
    link_demo: '#awesome-ui-kit',
    features_ko: [
      'TypeScript 기반 완전한 타입 지원',
      '다크 모드 기본 지원',
      '62개의 프로덕션 레디 컴포넌트',
      '접근성(a11y) 최적화',
      '코드 하이라이팅이 적용된 인터랙티브 문서',
      '실시간 미리보기 기능',
      'Tree-shaking 지원으로 번들 사이즈 최소화',
    ],
    features_en: [
      'Full TypeScript support',
      'Built-in dark mode support',
      '62 production-ready components',
      'Accessibility (a11y) optimized',
      'Interactive documentation with code highlighting',
      'Live preview feature',
      'Tree-shaking support for minimal bundle size',
    ],
    image_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    year: '2026',
    is_visible: true,
    sort_order: 0,
  },
  {
    id: 'data-ui-kit',
    name: 'Data UI Kit',
    description_ko: '8가지 핵심 데이터 컴포넌트를 제공하는 전문 React 라이브러리',
    description_en: '8 core data components for professional React applications',
    full_description_ko: '복잡한 데이터를 효과적으로 시각화하고 표현하기 위한 전문 컴포넌트 라이브러리입니다. 대용량 데이터 처리, 다양한 차트 타입, 고급 테이블 기능을 제공하며 데이터 중심 애플리케이션 개발에 최적화되어 있습니다.\n\nVirtual scrolling을 통한 대용량 데이터 처리, Recharts 기반의 다양한 차트 컴포넌트, 정렬/필터링/검색이 가능한 고급 테이블, 통계 카드, KPI 대시보드 등을 포함합니다. 모든 컴포넌트는 Apple 스타일의 미니멀한 디자인과 다크 모드를 지원합니다.',
    full_description_en: 'A professional component library for effectively visualizing and presenting complex data. Optimized for data-centric application development with large-scale data processing, various chart types, and advanced table features.\n\nIncludes virtual scrolling for large datasets, various chart components based on Recharts, advanced tables with sorting/filtering/search, statistics cards, KPI dashboards, and more. All components support Apple-style minimal design and dark mode.',
    category_ko: '데이터 시각화',
    category_en: 'Data Visualization',
    tags: ['React', 'TypeScript', 'Data', 'Charts', 'Tables'],
    stat_stars: '-',
    stat_downloads: '-',
    stat_components: '8',
    stat_contributors: '1',
    link_github: 'https://github.com/xxcordeau/jy-data-ui-kit',
    link_npm: 'https://www.npmjs.com/package/jy-data-ui-kit',
    link_demo: '#data-ui-kit',
    features_ko: [
      'Table / DataGrid - 정렬, 필터링, 페이지네이션 지원',
      'List / Item List - 리스트 및 그리드 레이아웃',
      'Tree / Hierarchy - 계층 구조 트리 뷰',
      'Chart / Graph - Line, Bar, Area, Pie 차트',
      'Calendar / DatePicker / TimePicker - 날짜/시간 선택',
      'SearchBar / Filter - 검색 및 고급 필터링',
      'TagSelector / MultiSelect - 다중 선택 및 태그',
    ],
    features_en: [
      'Table / DataGrid - Sorting, filtering, pagination support',
      'List / Item List - List and grid layouts',
      'Tree / Hierarchy - Hierarchical tree view',
      'Chart / Graph - Line, Bar, Area, Pie charts',
      'Calendar / DatePicker / TimePicker - Date and time pickers',
      'SearchBar / Filter - Search and advanced filtering',
      'TagSelector / MultiSelect - Multi-select and tags',
    ],
    image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    year: '2026',
    is_visible: true,
    sort_order: 1,
  },
];

// ============================================
// Blog Posts (13) — ALL posts with metadata
// ============================================
const blogPosts = [
  {
    id: 'react-page-refactoring',
    title_ko: 'React 페이지 구조 리팩토링과 코드 스플리팅 적용 경험',
    title_en: 'React Page Structure Refactoring and Code Splitting Experience',
    excerpt_ko: '73개의 페이지 파일이 뒤섞인 구조를 도메인 기반으로 재편하고, React.lazy + Suspense로 초기 번들을 79% 줄인 경험을 공유합니다.',
    excerpt_en: 'Reorganized 73 mixed page files into domain-based structure and reduced initial bundle by 79% with React.lazy + Suspense.',
    category_ko: '개발',
    category_en: 'Development',
    read_time_ko: '8분',
    read_time_en: '8 min',
    tags: ['React', 'TypeScript', 'Vite', 'Code Splitting', 'Refactoring'],
    thumbnail_url: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=800&q=80',
    status: 'published',
    date: '2026-04-07',
    content_ko: '',
    content_en: '',
  },
  {
    id: 'dynamic-static-import',
    title_ko: 'React.lazy + Suspense 적용 시 마주친 dynamic/static import 혼용 문제',
    title_en: 'Dynamic vs Static Import Mixing Issues with React.lazy + Suspense',
    excerpt_ko: 'React.lazy 코드 스플리팅 적용 후 Vite 빌드에서 발생한 dynamic/static import 혼용 경고의 원인과 해결 과정을 공유합니다.',
    excerpt_en: 'Sharing the root cause and resolution of dynamic/static import mixing warnings in Vite builds after applying React.lazy code splitting.',
    category_ko: '개발',
    category_en: 'Development',
    read_time_ko: '6분',
    read_time_en: '6 min',
    tags: ['React', 'Vite', 'Code Splitting', 'Bundling'],
    thumbnail_url: 'https://images.unsplash.com/photo-1551033406-611cf9a28f67?w=800&q=80',
    status: 'published',
    date: '2026-04-07',
    content_ko: '',
    content_en: '',
  },
  {
    id: 'api-mismatch-usememo-crash',
    title_ko: 'API 응답 형식 불일치와 useMemo 크래시 — undefined는 조용히 퍼져요',
    title_en: 'API Response Mismatch and useMemo Crash — undefined Spreads Silently',
    excerpt_ko: 'API가 배열을 바로 반환하는데 response.data.content로 접근하면 undefined가 됩니다. 그 undefined가 useMemo까지 전파되어 크래시를 일으킨 과정을 기록했습니다.',
    excerpt_en: 'When an API returns an array directly but you access response.data.content, you get undefined. Documenting how that undefined propagated into useMemo and caused a crash.',
    category_ko: '개발',
    category_en: 'Development',
    read_time_ko: '6분',
    read_time_en: '6 min',
    tags: ['React', 'TypeScript', 'useMemo', '디버깅'],
    thumbnail_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80',
    status: 'published',
    date: '2025-12-10',
    content_ko: '',
    content_en: '',
  },
  {
    id: 'hidden-div-react-rendering',
    title_ko: '숨겨진 div의 역습 — React에서 hidden 클래스는 조건부 렌더링이 아니에요',
    title_en: 'The Hidden Div Strike Back — CSS hidden Is Not Conditional Rendering in React',
    excerpt_ko: 'className="hidden"으로 숨긴 컴포넌트가 여전히 JS를 실행하고 있었어요. display:none과 조건부 렌더링의 차이를 정리했습니다.',
    excerpt_en: 'A component hidden with className="hidden" was still executing JavaScript. Clarifying the difference between display:none and conditional rendering.',
    category_ko: '개발',
    category_en: 'Development',
    read_time_ko: '4분',
    read_time_en: '4 min',
    tags: ['React', 'JSX', '렌더링'],
    thumbnail_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
    status: 'published',
    date: '2025-11-20',
    content_ko: '',
    content_en: '',
  },
  {
    id: 'css-print-layer-conflict',
    title_ko: '@media print과 CSS 레이어의 충돌 — 인쇄 헤더가 사라지지 않던 이유',
    title_en: "@media print vs CSS Layers Conflict — Why the Print Header Wouldn't Hide",
    excerpt_ko: '@layer 안에 작성한 @media print 규칙이 왜 무시되는지, CSS 캐스케이드 레이어의 우선순위 구조를 파헤쳐봤습니다.',
    excerpt_en: 'Investigating why @media print rules inside @layer get ignored, and understanding the CSS cascade layer priority structure.',
    category_ko: '개발',
    category_en: 'Development',
    read_time_ko: '5분',
    read_time_en: '5 min',
    tags: ['@media print', 'CSS', '@layer', 'React'],
    thumbnail_url: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&q=80',
    status: 'published',
    date: '2025-10-15',
    content_ko: '',
    content_en: '',
  },
  {
    id: 'common-utils-composable',
    title_ko: '공통 유틸/컴포저블 분리 사례',
    title_en: 'Common Utility/Composable Separation Case Study',
    excerpt_ko: 'i18n 처리, 권한 체크, 파일 포맷, 아이콘 스타일 등 중복 로직을 명시적 함수 호출 가능한 유틸/컴포저블로 분리한 경험을 공유합니다.',
    excerpt_en: 'Sharing experience of separating duplicate logic like i18n handling, permission checks, file formats, and icon styles into explicitly callable utils/composables.',
    category_ko: '개발',
    category_en: 'Development',
    read_time_ko: '9분',
    read_time_en: '9 min',
    tags: ['Vue', 'Composable', 'Utils', 'Code Quality'],
    thumbnail_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
    status: 'published',
    date: '2024-10-21',
    content_ko: '',
    content_en: '',
  },
  {
    id: 'dashboard-widget-system',
    title_ko: '모듈형 대시보드 위젯 시스템',
    title_en: 'Modular Dashboard Widget System',
    excerpt_ko: '여러 독립 모듈이 공존하는 대시보드를 메타 데이터 기반 동적 렌더링과 공통 상태 관리로 구조화한 경험을 공유합니다.',
    excerpt_en: 'Sharing experience of structuring a dashboard with multiple independent modules through metadata-based dynamic rendering and common state management.',
    category_ko: '개발',
    category_en: 'Development',
    read_time_ko: '7분',
    read_time_en: '7 min',
    tags: ['Vue', 'Dashboard', 'Dynamic Components', 'Modular Design'],
    thumbnail_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    status: 'published',
    date: '2024-10-21',
    content_ko: '',
    content_en: '',
  },
  {
    id: 'view-state-standardization',
    title_ko: '에러/로딩/빈 상태 UI의 전역 표준화',
    title_en: 'Global Standardization of Error/Loading/Empty State UI',
    excerpt_ko: '모든 화면에서 일관된 로딩/에러/빈 상태 경험을 제공하기 위한 전역 컴포넌트와 composable 패턴 구축 사례를 공유합니다.',
    excerpt_en: 'Sharing a case of building global components and composable patterns to provide consistent loading/error/empty state experiences across all screens.',
    category_ko: '개발',
    category_en: 'Development',
    read_time_ko: '10분',
    read_time_en: '10 min',
    tags: ['Vue', 'UX', 'State Management', 'Error Handling'],
    thumbnail_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
    status: 'published',
    date: '2024-10-21',
    content_ko: '',
    content_en: '',
  },
  {
    id: 'role-permission-system',
    title_ko: '권한(Role)별 접근 제어 시스템',
    title_en: 'Role-Based Access Control System',
    excerpt_ko: '사용자 역할에 따른 페이지/기능 접근 제어를 중앙 composable로 통합하여 일관된 권한 관리를 구현한 경험을 공유합니다.',
    excerpt_en: 'Sharing experience of implementing consistent permission management by integrating page/feature access control based on user roles into a central composable.',
    category_ko: '개발',
    category_en: 'Development',
    read_time_ko: '8분',
    read_time_en: '8 min',
    tags: ['Vue', 'Security', 'Access Control', 'Authorization'],
    thumbnail_url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80',
    status: 'published',
    date: '2024-10-21',
    content_ko: '',
    content_en: '',
  },
  {
    id: 'table-component-structuring',
    title_ko: '공통 테이블 컴포넌트 구조화 경험',
    title_en: 'Common Table Component Structuring Experience',
    excerpt_ko: '페이지네이션, 정렬, URL 동기화가 필요한 복잡한 테이블 시스템을 공통 컴포넌트로 구조화하며 배운 데이터 흐름 제어 전략을 공유합니다.',
    excerpt_en: 'Sharing data flow control strategies learned while structuring a complex table system requiring pagination, sorting, and URL synchronization into a common component.',
    category_ko: '개발',
    category_en: 'Development',
    read_time_ko: '7분',
    read_time_en: '7 min',
    tags: ['Vue', 'Composable', 'Table UI', 'State Management'],
    thumbnail_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
    status: 'published',
    date: '2024-10-21',
    content_ko: '',
    content_en: '',
  },
  {
    id: 'filter-system-implementation',
    title_ko: '검색 필터 시스템 구현 경험',
    title_en: 'Search Filter System Implementation Experience',
    excerpt_ko: '다중 조건 조합, 태그 시각화, 상태 유지가 필요한 복잡한 필터 시스템을 구현하며 배운 독립형 상태 관리 전략을 공유합니다.',
    excerpt_en: 'Sharing independent state management strategies learned while implementing a complex filter system with multiple conditions, tag visualization, and state persistence.',
    category_ko: '개발',
    category_en: 'Development',
    read_time_ko: '6분',
    read_time_en: '6 min',
    tags: ['Vue', 'State Management', 'Pinia', 'Filter UI'],
    thumbnail_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    status: 'published',
    date: '2024-10-21',
    content_ko: '',
    content_en: '',
  },
  {
    id: 'tree-structure-management',
    title_ko: '트리 구조 기반 사용자/자산 관리 화면 구현 경험',
    title_en: 'Tree-Based User/Asset Management UI Implementation Experience',
    excerpt_ko: 'Lazy-loading, 자동 확장, 양방향 동기화가 필요한 복잡한 트리 UI를 구현하며 배운 상태 관리 전략을 공유합니다.',
    excerpt_en: 'Sharing state management strategies learned while implementing complex tree UI with Lazy-loading, auto-expansion, and bi-directional synchronization.',
    category_ko: '개발',
    category_en: 'Development',
    read_time_ko: '8분',
    read_time_en: '8 min',
    tags: ['Vue', 'State Management', 'Tree UI', 'Performance'],
    thumbnail_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
    status: 'published',
    date: '2024-10-21',
    content_ko: '',
    content_en: '',
  },
  {
    id: 'icon-system-implementation',
    title_ko: '전역 아이콘 시스템 구축 경험',
    title_en: 'Global Icon System Implementation Experience',
    excerpt_ko: '수십 개 화면에 걸친 아이콘의 색상, 크기, 상태를 일관되게 관리하기 위한 메타데이터 기반 전역 아이콘 시스템 구축 경험을 공유합니다.',
    excerpt_en: 'Sharing experience of building a metadata-based global icon system to consistently manage colors, sizes, and states of icons across dozens of screens.',
    category_ko: '개발',
    category_en: 'Development',
    read_time_ko: '6분',
    read_time_en: '6 min',
    tags: ['Vue', 'Design System', 'Icons', 'UI Consistency'],
    thumbnail_url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
    status: 'published',
    date: '2024-10-21',
    content_ko: '',
    content_en: '',
  },
];

// ============================================
// Skills (24)
// ============================================
const skills = [
  { name: 'Vue 3',              level: 95, category: 'frontend', sort_order: 0 },
  { name: 'React',              level: 85, category: 'frontend', sort_order: 1 },
  { name: 'TypeScript',         level: 85, category: 'frontend', sort_order: 2 },
  { name: 'JavaScript',         level: 90, category: 'frontend', sort_order: 3 },
  { name: 'Redux',              level: 80, category: 'frontend', sort_order: 4 },
  { name: 'Next.js',            level: 82, category: 'frontend', sort_order: 5 },
  { name: 'Styled-Components',  level: 88, category: 'frontend', sort_order: 6 },
  { name: 'Tailwind CSS',       level: 85, category: 'frontend', sort_order: 7 },
  { name: 'Ant Design',         level: 80, category: 'frontend', sort_order: 8 },
  { name: 'Storybook',          level: 75, category: 'frontend', sort_order: 9 },
  { name: 'Sass',               level: 85, category: 'frontend', sort_order: 10 },
  { name: 'Node.js',            level: 80, category: 'backend',  sort_order: 11 },
  { name: 'Nest.js',            level: 80, category: 'backend',  sort_order: 12 },
  { name: 'PostgreSQL',         level: 75, category: 'backend',  sort_order: 13 },
  { name: 'Figma',              level: 95, category: 'design',   sort_order: 14 },
  { name: 'Illustrator',        level: 90, category: 'design',   sort_order: 15 },
  { name: 'Photoshop',          level: 90, category: 'design',   sort_order: 16 },
  { name: 'Git',                level: 80, category: 'other',    sort_order: 17 },
  { name: 'Webpack',            level: 72, category: 'other',    sort_order: 18 },
  { name: 'npm',                level: 85, category: 'other',    sort_order: 19 },
  { name: 'Vercel',             level: 80, category: 'other',    sort_order: 20 },
  { name: 'Vite',               level: 82, category: 'other',    sort_order: 21 },
  { name: 'Swagger / Postman',  level: 85, category: 'other',    sort_order: 22 },
  { name: 'Jira / Notion / Slack', level: 80, category: 'other', sort_order: 23 },
].map(s => ({ ...s, id: crypto.randomUUID() }));

// ============================================
// Education (1)
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
    description_ko: '시각디자인과 웹디자인을 중심으로 학습하며, UI/UX 설계와 디지털 콘텐츠 제작 능력을 길렀습니다. 디자인 감각과 사용자 경험을 기반으로 한 프론트엔드 개발 역량의 토대를 다졌습니다.',
    description_en: 'Studied visual design and web design, developing UI/UX design and digital content creation skills. Built a foundation for frontend development capabilities based on design sensibility and user experience.',
    sort_order: 0,
  },
];

// ============================================
// Experiences (2)
// ============================================
const experiencesData = [
  {
    id: crypto.randomUUID(),
    company_ko: '동훈아이텍 (Keyrke)',
    company_en: 'Donghun I-Tech (Keyrke)',
    position_ko: '프론트엔드 개발자',
    position_en: 'Frontend Developer',
    period: '2023.08 - 현재',
    description_ko: '보안 자산관리 솔루션의 프론트엔드 전반을 담당하며, 대규모 관리자 페이지와 사용자 포털 UI를 개발하고 있습니다. 해당 솔루션은 현대모비스, 현대오토에버, 현대케피코 등 주요 그룹사에 도입되어 운용 중입니다.',
    description_en: 'Leading comprehensive frontend development for security asset management solution, developing large-scale admin pages and user portal UI. The solution has been deployed and is being operated at major group companies including Hyundai Mobis, Hyundai AutoEver, and Hyundai Kefico.',
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
    description_en: 'Initially worked as an in-house web publisher, then transitioned to freelance to continue developing contract management systems and logistics service web pages.',
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
// Site Settings (10)
// ============================================
const siteSettings = [
  { key: 'nav_about', value: 'true' },
  { key: 'nav_projects', value: 'true' },
  { key: 'nav_opensource', value: 'true' },
  { key: 'nav_blog', value: 'true' },
  { key: 'nav_contact', value: 'true' },
  { key: 'nav_presentations', value: 'true' },
  { key: 'contact_email', value: 'qazseeszaq3219@gmail.com' },
  { key: 'github_url', value: '' },
  { key: 'linkedin_url', value: '' },
  { key: 'open_to_work', value: 'true' },
];

// ============================================
// Chatbot Categories (6) + ALL Questions (19)
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
  // intro (4)
  { id: crypto.randomUUID(), category_id: 'intro', question_ko: '당신은 누구인가요?', question_en: 'Who are you?', answer_ko: "디자인 감각을 바탕으로 인터페이스를 구현하는 프론트엔드 개발자, 허정연입니다.\n사용자가 '편안함'을 느끼는 화면을 만드는 걸 좋아해요.", answer_en: "I'm Jeongyeon Heo, a frontend developer who implements interfaces based on design sense.\nI love creating screens where users feel 'comfortable'.", action: null, sort_order: 0 },
  { id: crypto.randomUUID(), category_id: 'intro', question_ko: '어떤 일을 하나요?', question_en: 'What do you do?', answer_ko: 'UI/UX 설계부터 실제 화면 개발까지 담당하고 있습니다.\nNuxt, Vue, React 기반의 웹 서비스를 개발하며, 디자인 시스템과 컴포넌트 구조화를 주로 다룹니다.', answer_en: 'I handle everything from UI/UX design to actual screen development.\nI develop web services based on Nuxt, Vue, and React, mainly dealing with design systems and component architecture.', action: null, sort_order: 1 },
  { id: crypto.randomUUID(), category_id: 'intro', question_ko: '디자인도 하시나요?', question_en: 'Do you also do design?', answer_ko: '네, 디자인도 직접 합니다.\nFigma로 UI를 설계하고, 그 디자인이 실제로 코드에서 얼마나 자연스럽게 구현될 수 있을지를 함께 고민합니다.', answer_en: 'Yes, I do design directly.\nI design UI with Figma and consider how naturally the design can be implemented in code.', action: null, sort_order: 2 },
  { id: crypto.randomUUID(), category_id: 'intro', question_ko: '왜 프론트엔드 개발을 선택했나요?', question_en: 'Why did you choose frontend development?', answer_ko: "디자인의 감각과 논리를 동시에 표현할 수 있는 영역이 프론트엔드라고 생각했어요.\n'보여주는 것' 이상으로 '느끼게 만드는 경험'을 만들고 싶었습니다.", answer_en: "I thought frontend is the area where I can express both design sense and logic.\nI wanted to create 'experiences that make you feel' beyond just 'showing'.", action: null, sort_order: 3 },
  // tech (4)
  { id: crypto.randomUUID(), category_id: 'tech', question_ko: '어떤 기술을 주로 사용하나요?', question_en: 'What technologies do you mainly use?', answer_ko: 'Vue 3, Nuxt 3, TypeScript 그리고 Docker 환경에서 개발합니다.\n개인 프로젝트에선 React, Styled Components, Next.js도 사용해요.', answer_en: 'I develop with Vue 3, Nuxt 3, TypeScript, and Docker environment.\nFor personal projects, I also use React, Styled Components, and Next.js.', action: null, sort_order: 0 },
  { id: crypto.randomUUID(), category_id: 'tech', question_ko: '프론트엔드 개발 시 중요하게 생각하는 점은요?', question_en: 'What do you consider important in frontend development?', answer_ko: "확장 가능한 구조, 명확한 타입, 그리고 일관된 사용자 경험.\n코드가 단지 '작동하는 것'이 아니라, 팀과 함께 '성장할 수 있는 구조'여야 한다고 생각합니다.", answer_en: "Scalable structure, clear types, and consistent user experience.\nI believe code should not just 'work', but be a 'structure that can grow with the team'.", action: null, sort_order: 1 },
  { id: crypto.randomUUID(), category_id: 'tech', question_ko: '디자인과 개발 중 어떤 쪽이 더 자신 있나요?', question_en: 'Are you more confident in design or development?', answer_ko: "개발 쪽이 주력입니다. 하지만 디자인 감각을 함께 살리는 게 제 강점이에요.\n'디자인을 이해하는 개발자'로서 두 영역을 자연스럽게 연결하는 걸 좋아합니다.", answer_en: "Development is my main focus. But utilizing design sense together is my strength.\nAs a 'developer who understands design', I love naturally connecting the two areas.", action: null, sort_order: 2 },
  { id: crypto.randomUUID(), category_id: 'tech', question_ko: '코드 스타일이나 철학이 있나요?', question_en: 'Do you have a code style or philosophy?', answer_ko: '읽기 쉬운 코드가 유지보수의 시작이라고 믿습니다.\n명확한 타입 정의, 재사용 가능한 구조, 그리고 불필요한 복잡성을 피하는 것이 제 기본 원칙이에요.', answer_en: 'I believe readable code is the beginning of maintenance.\nClear type definitions, reusable structure, and avoiding unnecessary complexity are my basic principles.', action: null, sort_order: 3 },
  // projects (2)
  { id: crypto.randomUUID(), category_id: 'projects', question_ko: '어떤 프로젝트를 진행했나요?', question_en: 'What projects have you worked on?', answer_ko: "동훈아이텍의 기업 보안 솔루션 'Keyrke'의 프론트엔드 개발을 담당하며, 대규모 로그 관리·정책 관리·디자인 시스템 프로젝트를 진행했습니다.", answer_en: "I was in charge of frontend development for Donghun I-Tech's enterprise security solution 'Keyrke', working on large-scale log management, policy management, and design system projects.", action: null, sort_order: 0 },
  { id: crypto.randomUUID(), category_id: 'projects', question_ko: '기억에 남는 프로젝트가 있나요?', question_en: 'Do you have a memorable project?', answer_ko: "'통인익스프레스 통합 계약관리 시스템' 프로젝트가 가장 기억에 남아요.\n이사 신청부터 계약 관리까지의 전 과정을 디지털화한 시스템을 개발했습니다.", answer_en: "The 'Tongin Express Integrated Contract Management System' project is the most memorable.\nI developed a system that digitized the entire process from moving application to contract management.", action: null, sort_order: 1 },
  // collaboration (3)
  { id: crypto.randomUUID(), category_id: 'collaboration', question_ko: '어떤 방식으로 일하나요?', question_en: 'How do you work?', answer_ko: '문제를 빠르게 파악하고, 구조를 시각화해서 해결책을 제시합니다.\n작업 전후에 문서화를 습관처럼 합니다.', answer_en: 'I quickly identify problems, visualize the structure, and present solutions.\nI habitually document before and after work.', action: null, sort_order: 0 },
  { id: crypto.randomUUID(), category_id: 'collaboration', question_ko: '협업 시 중요하게 생각하는 점은요?', question_en: 'What do you consider important in collaboration?', answer_ko: '명확한 커뮤니케이션과 투명한 공유.\n"팀 전체가 이해할 수 있는 구조"를 만드는 걸 가장 중요하게 생각해요.', answer_en: "Clear communication and transparent sharing.\nI think creating a 'structure that the entire team can understand' is most important.", action: null, sort_order: 1 },
  { id: crypto.randomUUID(), category_id: 'collaboration', question_ko: '문제를 해결할 때 어떤 접근을 하나요?', question_en: 'What approach do you take when solving problems?', answer_ko: '먼저 원인을 시각화합니다.\n단순히 증상을 고치기보다, 재발하지 않게 구조를 다시 설계하는 편이에요.', answer_en: 'First, I visualize the cause.\nRather than just fixing symptoms, I tend to redesign the structure to prevent recurrence.', action: null, sort_order: 2 },
  // values (3)
  { id: crypto.randomUUID(), category_id: 'values', question_ko: '당신의 작업을 한 문장으로 표현한다면요?', question_en: 'How would you describe your work in one sentence?', answer_ko: "디자인과 코드를 잇는 사람.\n사용자의 시선과 개발자의 논리가 만나는 지점을 찾습니다.", answer_en: "A person who connects design and code.\nI find the point where user's eyes and developer's logic meet.", action: null, sort_order: 0 },
  { id: crypto.randomUUID(), category_id: 'values', question_ko: '어떤 사람이 되고 싶나요?', question_en: 'What kind of person do you want to be?', answer_ko: '감각과 논리를 동시에 다루는 엔지니어.\n기술이 사람에게 따뜻하게 느껴지게 만드는 개발자가 되고 싶습니다.', answer_en: 'An engineer who handles both sense and logic.\nI want to be a developer who makes technology feel warm to people.', action: null, sort_order: 1 },
  { id: crypto.randomUUID(), category_id: 'values', question_ko: '앞으로의 목표는요?', question_en: 'What are your future goals?', answer_ko: '디자인 시스템과 인터랙션에 강한 프론트엔드 엔지니어로 성장하는 것.\n더 나은 사용자 경험을 설계하는 제품 중심 개발자로 나아가고 싶어요.', answer_en: 'To grow as a frontend engineer strong in design systems and interactions.\nI want to move forward as a product-centered developer who designs better user experiences.', action: null, sort_order: 2 },
  // contact (3)
  { id: crypto.randomUUID(), category_id: 'contact', question_ko: '더 궁금한 게 있어요.', question_en: 'I have more questions.', answer_ko: '언제든지 물어보세요🙂\n프로젝트나 기술적인 부분도 편하게 이야기할 수 있어요.', answer_en: 'Feel free to ask anytime🙂\nI can comfortably talk about projects or technical aspects.', action: null, sort_order: 0 },
  { id: crypto.randomUUID(), category_id: 'contact', question_ko: '프로젝트를 보고 싶어요.', question_en: 'I want to see your projects.', answer_ko: '제 GitHub와 포트폴리오에 정리되어 있습니다.\nhttps://github.com/yourusername 또는 "프로젝트 보기" 버튼을 눌러주세요.', answer_en: 'They are organized on my GitHub and portfolio.\nhttps://github.com/yourusername or click the "View Projects" button.', action: null, sort_order: 1 },
  { id: crypto.randomUUID(), category_id: 'contact', question_ko: '연락드려도 될까요?', question_en: 'Can I contact you?', answer_ko: '물론입니다.\n협업, 제안, 또는 커피챗이라도 언제든 환영이에요 ☕\nqazseeszaq3219@gmail.com', answer_en: 'Of course.\nCollaboration, proposals, or even coffee chat are always welcome ☕\nqazseeszaq3219@gmail.com', action: 'openContact', sort_order: 2 },
];

// ============================================
// Main seed function
// ============================================
async function seed() {
  console.log('🌱 Starting FULL seed...\n');

  // Projects
  console.log('📦 Seeding projects...');
  const { error: projErr } = await supabase.from('projects').upsert(
    projects.map(p => ({ ...p, created_at: new Date().toISOString(), updated_at: new Date().toISOString() })),
    { onConflict: 'id' }
  );
  if (projErr) console.error('  Projects error:', projErr.message);
  else console.log(`  ✅ ${projects.length} projects`);

  // Open Source Projects
  console.log('🔓 Seeding open source projects...');
  const { error: osErr } = await supabase.from('open_source_projects').upsert(
    openSourceProjects,
    { onConflict: 'id' }
  );
  if (osErr) console.error('  Open source error:', osErr.message);
  else console.log(`  ✅ ${openSourceProjects.length} open source projects`);

  // Blog Posts
  console.log('📝 Seeding blog posts...');
  const { error: blogErr } = await supabase.from('blog_posts').upsert(
    blogPosts.map(p => ({ ...p, created_at: new Date().toISOString(), updated_at: new Date().toISOString() })),
    { onConflict: 'id' }
  );
  if (blogErr) console.error('  Blog posts error:', blogErr.message);
  else console.log(`  ✅ ${blogPosts.length} blog posts`);

  // Skills — delete old and re-insert to avoid duplicates
  console.log('🎯 Seeding skills...');
  await supabase.from('skills').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  const { error: skillErr } = await supabase.from('skills').insert(skills);
  if (skillErr) console.error('  Skills error:', skillErr.message);
  else console.log(`  ✅ ${skills.length} skills`);

  // Education — delete old and re-insert
  console.log('🎓 Seeding education...');
  await supabase.from('education').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  const { error: eduErr } = await supabase.from('education').insert(educationData);
  if (eduErr) console.error('  Education error:', eduErr.message);
  else console.log(`  ✅ ${educationData.length} education entries`);

  // Experiences — delete old and re-insert
  console.log('💼 Seeding experiences...');
  await supabase.from('experiences').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  const { error: expErr } = await supabase.from('experiences').insert(experiencesData);
  if (expErr) console.error('  Experiences error:', expErr.message);
  else console.log(`  ✅ ${experiencesData.length} experiences`);

  // Chatbot — delete old questions first, then categories, then re-insert
  console.log('💬 Seeding chatbot...');
  await supabase.from('chatbot_questions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  const { error: catErr } = await supabase.from('chatbot_categories').upsert(chatbotCategories, { onConflict: 'id' });
  if (catErr) console.error('  Categories error:', catErr.message);
  else console.log(`  ✅ ${chatbotCategories.length} categories`);

  const { error: qErr } = await supabase.from('chatbot_questions').insert(chatbotQuestions);
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

  console.log('\n🎉 FULL seed complete!');
}

seed().catch(console.error);
