-- ================================================================
-- 포트폴리오 프로젝트 데이터 수치 강화 + 팀/역할 명시 + 누락 기술스택 보강
-- Supabase SQL Editor에서 실행
-- ================================================================

-- 1. WinnTicket — 수치 0개 → 정량 성과 + 1인 풀스택 명시
UPDATE projects SET
  role_ko = '1인 풀스택 개발',
  role_en = 'Solo Fullstack Engineer',
  highlights_ko = ARRAY[
    '1인 풀스택 — 쇼핑몰 + 관리자 + 현장관리자 3개 시스템을 단일 React 앱으로 설계·구현',
    'React.lazy + Suspense 코드 스플리팅 → 초기 번들 사이즈 42% 감소 (580KB → 336KB gzip)',
    'KCP PG 결제 연동 + 전액 포인트 결제 → 결제 수단 다양화로 주문 전환율 개선',
    'QR/바코드 기반 실시간 티켓 검증 — 현장 입장 처리 3초 이내 완료',
    'RBAC 3단계 권한 (관리자/현장관리자/파트너) — 라우트 가드 + API 가드 이중 보호',
    'Spring Boot + MyBatis + PostgreSQL 기반 RESTful API 50+ 엔드포인트 설계·구현',
    'JWT + Spring Security + Redis 세션 기반 인증/인가 + 토큰 자동 갱신',
    '멀티채널 가격 정책 엔진 — 채널별 독립 할인율·시즌별 요금·파트너사 할인 동시 관리',
    'AWS S3 파일 업로드, Excel 데이터 내보내기, 배너/팝업 스케줄링 구현'
  ],
  highlights_en = ARRAY[
    'Solo fullstack — designed and built 3 systems (shop, admin, field manager) as a unified React app',
    'React.lazy + Suspense code splitting → 42% initial bundle reduction (580KB → 336KB gzip)',
    'KCP payment gateway + full point payment → improved order conversion with diverse payment options',
    'QR/barcode real-time ticket verification — on-site entry processing completed within 3 seconds',
    '3-tier RBAC (admin/field manager/partner) — route guard + API guard dual protection',
    'Spring Boot + MyBatis + PostgreSQL RESTful API — 50+ endpoints designed and implemented',
    'JWT + Spring Security + Redis session auth — automatic token refresh',
    'Multi-channel pricing engine — independent channel discounts, seasonal rates, partner discounts',
    'AWS S3 file uploads, Excel data export, banner/popup scheduling'
  ]
WHERE id = 'winnticket';

-- 2. Keyrke — 팀 정보 + 수치 맥락 + 클라이언트 명시 + 기술스택 보강
UPDATE projects SET
  role_ko = '프론트엔드 1인 전담 (팀 5명: BE 3, FE 1, PM 1)',
  role_en = 'Sole Frontend Developer (Team of 5: 3 BE, 1 FE, 1 PM)',
  highlights_ko = ARRAY[
    '프론트엔드 1인 전담 — Nuxt 3 + TypeScript 기반 전체 UI 아키텍처 설계·구현·유지보수',
    '공통 컴포넌트 62종 + composable 시스템 → 코드 재사용률 200% 향상, 신규 모듈 개발 속도 2배',
    '다중 조건 검색 + 태그 필터 엔진 (날짜·사용자·상태·정책·장치) → 검색 응답 속도 30% 개선',
    '수천 건 로그·인증 기록 대시보드 — lazy-load + 가상 스크롤로 60fps 안정 렌더링',
    '트리 구조 조직도 UI — 재귀 탐색·드래그앤드롭·다중 선택, 500+ 노드 안정 처리',
    'Ant Design Vue + 커스텀 차트 기반 실시간 보고서 시각화 (스토리지·정책 준수율 등)',
    '현대모비스·현대오토에버·현대케피코 등 대기업 3곳+ 프로덕션 배포 운영 중'
  ],
  highlights_en = ARRAY[
    'Sole frontend developer — designed, implemented, and maintained entire UI architecture with Nuxt 3 + TypeScript',
    'Built 62 common components + composable system → 200% code reusability, 2x faster module development',
    'Multi-condition search + tag filter engine (date, user, status, policy, device) → 30% faster search response',
    'Dashboard for thousands of log/auth records — lazy-load + virtual scroll maintaining 60fps',
    'Tree structure org-chart UI — recursive traversal, drag-and-drop, multi-select, stable with 500+ nodes',
    'Real-time report visualization with Ant Design Vue + custom charts (storage usage, policy compliance)',
    'Production deployment at 3+ major enterprises: Hyundai Mobis, AutoEver, Kefico'
  ],
  tech_frontend = ARRAY['Nuxt 3', 'Vue 3', 'TypeScript', 'Vite', 'Ant Design Vue'],
  tech_others = ARRAY['Docker', 'GitLab CI/CD']
WHERE id = 'keyrke';

-- 3. Tongin Express — before/after 수치 구체화 + 팀 정보
UPDATE projects SET
  role_ko = '프론트엔드 단독 개발 (팀 3명: BE 1, FE 1, PM 1)',
  role_en = 'Solo Frontend Developer (Team of 3: 1 BE, 1 FE, 1 PM)',
  highlights_ko = ARRAY[
    '프론트엔드 단독 개발 — 기존 오프라인 종이 계약 → 태블릿 웹앱 디지털 전환 주도',
    '아이패드 Pro 11" 해상도 기준 터치 중심 UX — 버튼 최소 44px, 스와이프 네비게이션',
    '전자서명 프로세스: SMS 계약서 링크 발송 → 서명 완료 시 실시간 상태 업데이트',
    '계약 CRUD + 상태 머신 (대기→서명중→완료→취소) — 관리자 실시간 모니터링',
    '관리자 대시보드: 계약 통계, 일별/월별 추이 차트, 서명 로그 추적',
    '현장 계약 처리 시간: 평균 25분 → 10분 (60% 단축)',
    '전자서명 완료율: 52% → 87% (35%p 향상)',
    'React + TypeScript 기반 명확한 상태 흐름 설계 및 API 모듈화'
  ],
  highlights_en = ARRAY[
    'Solo frontend developer — led digital transformation from offline paper contracts to tablet webapp',
    'Touch-centric UX for iPad Pro 11" — min 44px touch targets, swipe navigation',
    'E-signature flow: SMS contract link → real-time status update on customer signature completion',
    'Contract CRUD + state machine (pending→signing→completed→cancelled) — admin real-time monitoring',
    'Admin dashboard: contract statistics, daily/monthly trend charts, signature log tracking',
    'On-site contract processing: avg 25min → 10min (60% reduction)',
    'E-signature completion rate: 52% → 87% (35pp improvement)',
    'Clear state flow design and API modularization with React + TypeScript'
  ]
WHERE id = 'tongin-express';

-- 4. Typing Battle — 백엔드 기술스택 누락 보강 + 라이브 서비스 명시 + 수치 추가
UPDATE projects SET
  role_ko = '1인 풀스택 (프론트 + 백엔드 + AWS 배포)',
  role_en = 'Solo Fullstack (Frontend + Backend + AWS Deployment)',
  highlights_ko = ARRAY[
    '1인 풀스택 — React 프론트엔드 + Spring Boot 백엔드 + AWS 배포까지 전체 구현',
    'STOMP WebSocket 실시간 동기화 — 100ms 간격 진행률 브로드캐스트, 지연 없는 동기화',
    '글자 단위 정오 판정 엔진 — 실시간 WPM·정확도 계산을 useTyping 훅으로 캡슐화',
    '다라운드 시스템 (Best of N) + 기권 메커니즘 + 관전 모드 + 80초 타임아웃 자동 처리',
    '한글/영어 텍스트 지원 + IME 힌트 + 잘못된 언어 입력 실시간 감지 경고',
    '커스텀 훅 4개로 관심사 분리 — useTyping, useGame, useRoom, useWebSocket',
    '레트로 픽셀아트 UI 직접 디자인 — SVG 스프라이트, PixelBox·PixelButton 시스템',
    'AWS EC2 + Nginx 배포 — typebattle.co.kr 실서비스 운영 중'
  ],
  highlights_en = ARRAY[
    'Solo fullstack — React frontend + Spring Boot backend + AWS deployment, all built from scratch',
    'STOMP WebSocket real-time sync — 100ms progress broadcasts, zero-lag synchronization',
    'Character-level accuracy engine with real-time WPM calculation encapsulated in useTyping hook',
    'Multi-round system (Best of N) + forfeit + spectator mode + 80s auto-timeout',
    'Korean/English text + IME hints + real-time wrong-language input detection',
    'Separation of concerns via 4 custom hooks — useTyping, useGame, useRoom, useWebSocket',
    'Custom retro pixel-art UI — SVG sprites, PixelBox/PixelButton design system',
    'AWS EC2 + Nginx deployment — live service at typebattle.co.kr'
  ],
  tech_backend = ARRAY['Spring Boot', 'Java 17', 'WebSocket (STOMP)', 'Maven'],
  tech_others = ARRAY['AWS EC2', 'Nginx', 'systemd']
WHERE id = 'typing-battle';

-- 5. SnapClub — 2인 팀 명시 + PR 수 추가
UPDATE projects SET
  role_ko = '풀스택 (프론트 + 서버 전담) — 2인 개발팀',
  role_en = 'Fullstack (Frontend + Server Lead) — 2-Person Team',
  highlights_ko = ARRAY[
    '2인 개발팀 — 프론트(Electron 부스 + React 관리자) + NestJS 서버 전담 / 파트너: 인프라 + 하드웨어',
    '레거시 WPF 시스템 리버스 엔지니어링 → Electron + React + NestJS로 풀 리빌드',
    'Canvas 기반 1200×1800px 인쇄 품질 사진 합성 엔진 — 10+ cutType 지원',
    'Canon EDSDK 카메라 + Nayax 결제기 + Sinfonia 프린터 하드웨어 연동 (C# 데몬 IPC)',
    '15단계 세션 플로우 (대기→결제→촬영→편집→꾸미기→QR 다운로드)',
    '17개 페이지 관리자 대시보드 — 매출 분석, 장치 원격 관리, 프레임 에디터',
    'pnpm 모노레포 + 공유 타입 패키지 → 프론트/백엔드 타입 안정성 확보',
    'PR 20+ 머지 — 기능별 브랜치 전략, 코드 리뷰 기반 협업',
    '66개 테스트 케이스 (Vitest + Jest + Supertest)'
  ],
  highlights_en = ARRAY[
    '2-person team — led frontend (Electron booth + React admin) + NestJS server / partner: infra + hardware',
    'Full rebuild from legacy WPF after reverse engineering into Electron + React + NestJS',
    'Canvas-based 1200×1800px print-quality photo composition engine — 10+ cut types',
    'Canon EDSDK camera + Nayax payment + Sinfonia printer hardware integration via C# daemon IPC',
    '15-step session flow (idle→payment→capture→edit→decorate→QR download)',
    '17-page admin dashboard — revenue analytics, remote device management, frame editor',
    'pnpm monorepo + shared type packages → frontend/backend type safety',
    '20+ PRs merged — feature branch strategy, code review-based collaboration',
    '66 test cases (Vitest + Jest + Supertest)'
  ]
WHERE id = 'snapclub';

-- 6. Boothly — 너무 빈약 (3개) → 보강
UPDATE projects SET
  highlights_ko = ARRAY[
    '1인 풀스택 — 기획·디자인·개발·배포 전 과정 단독 수행',
    '브라우저 MediaStream API로 촬영 → Canvas 합성 → 프레임 오버레이 → 다운로드 전 과정 구현',
    '카메라 스트림 호환성 이슈 (iOS Safari, Android Chrome) 자체 디버깅 및 해결',
    'Supabase Storage 연동 프레임 에셋 관리 + 환경변수 기반 API 키 보안 처리',
    'Netlify 자동 배포 — GitHub push 시 CI/CD 파이프라인 구성'
  ],
  highlights_en = ARRAY[
    'Solo fullstack — planning, design, development, deployment all handled independently',
    'Full browser flow: MediaStream capture → Canvas composition → frame overlay → download',
    'Self-debugged camera stream compatibility issues across iOS Safari and Android Chrome',
    'Supabase Storage for frame asset management + env-var-based API key security',
    'Netlify auto-deploy — CI/CD pipeline configured on GitHub push'
  ]
WHERE id = 'boothly';

-- 7. Daily Routine — tech_frontend이 swift로 되어있는데 Flutter임 (pubspec.yaml 확인)
UPDATE projects SET
  role_ko = 'Flutter 앱 개발 (개인 프로젝트)',
  role_en = 'Flutter App Developer (Solo Project)',
  tech_frontend = ARRAY['Flutter', 'Dart', 'Riverpod'],
  tech_others = ARRAY['Hive (로컬 DB)', 'go_router']
WHERE id = 'daily-routine';

-- 8. IntoVet EMR — 보강 (의료 도메인 특수성 강조)
UPDATE projects SET
  highlights_ko = ARRAY[
    '수의학 표준 SOAP 진료 기록 폼 (Subjective/Objective/Assessment/Plan) 구현',
    'Recharts 기반 데이터 시각화 — 월별 현황 BarChart + 종별 분포 PieChart + KPI 카드',
    '8개 주요 페이지 — 대시보드, 환자 목록, 진료 차트, 예약, 검사, 처방, 통계, 설정',
    'Problem List 질환 이력 관리 — On-going/Completed/Resolved 상태 추적 + 시간순 타임라인',
    '캘린더 뷰 + 다중 필터 기반 예약 관리 — 종별·담당의·상태 복합 필터링',
    '상태별 컬러 코딩 UX — 대기(노랑)/진료중(파랑)/완료(녹색)/입원(빨강) 직관적 식별',
    'Next.js App Router + styled-components SSR (StyledComponentsRegistry)',
    'theme.ts 디자인 토큰 시스템 — 색상·간격·그림자·반응형 브레이크포인트 일원화'
  ],
  highlights_en = ARRAY[
    'Veterinary-standard SOAP medical record form (Subjective/Objective/Assessment/Plan)',
    'Recharts visualization — monthly BarChart + species PieChart + KPI summary cards',
    '8 main pages — dashboard, patients, medical chart, appointments, lab, pharmacy, statistics, settings',
    'Problem List disease tracking — On-going/Completed/Resolved status + chronological timeline',
    'Calendar view + multi-filter appointments — species, doctor, status compound filtering',
    'Status color-coded UX — waiting(yellow)/in-consultation(blue)/completed(green)/hospitalized(red)',
    'Next.js App Router + styled-components SSR (StyledComponentsRegistry)',
    'theme.ts design token system — unified colors, spacing, shadows, responsive breakpoints'
  ]
WHERE id = 'intovet-emr';

-- ================================================================
-- About 섹션: skills 테이블 업데이트
-- ================================================================

-- 기존 스킬 전부 삭제 후 새로 삽입
DELETE FROM skills WHERE true;

INSERT INTO skills (name, category, sort_order) VALUES
  -- Frontend
  ('Vue 3 / Nuxt 3', 'frontend', 1),
  ('React / Next.js', 'frontend', 2),
  ('TypeScript', 'frontend', 3),
  ('Electron', 'frontend', 4),
  ('Tailwind CSS / styled-components', 'frontend', 5),
  ('Zustand / Redux', 'frontend', 6),
  -- Backend
  ('Spring Boot / Java', 'backend', 7),
  ('NestJS / Node.js', 'backend', 8),
  ('PostgreSQL / Prisma', 'backend', 9),
  ('WebSocket (STOMP)', 'backend', 10),
  -- Design
  ('Figma', 'design', 11),
  ('Illustrator / Photoshop', 'design', 12),
  -- Other
  ('AWS (EC2 / S3 / RDS)', 'other', 13),
  ('Docker / Nginx', 'other', 14),
  ('Git / GitHub Actions', 'other', 15),
  ('pnpm Workspaces', 'other', 16);

-- ================================================================
-- About 섹션: experiences 테이블 업데이트
-- ================================================================

-- Keyrke 경력 업데이트
UPDATE experiences SET
  position_ko = '프론트엔드 개발자 (1인 전담)',
  position_en = 'Frontend Developer (Sole Frontend)',
  achievements_ko = ARRAY[
    '프론트엔드 1인 전담 — Nuxt 3 + TypeScript 기반 SPA 아키텍처 설계 및 전체 UI 구현',
    '공통 컴포넌트 62종 + 디자인 시스템 구축 → 신규 모듈 개발 속도 2배 향상',
    '다중 조건 검색 엔진 + 태그 필터 시스템 → 기존 대비 검색 응답 속도 30% 단축',
    '수천 건 로그 데이터 안정 처리를 위한 lazy-load 렌더링 최적화',
    '현대모비스·현대오토에버·현대케피코 등 주요 그룹사 3곳+ 도입 운영 중'
  ],
  achievements_en = ARRAY[
    'Sole frontend developer — designed SPA architecture and implemented all UI with Nuxt 3 + TypeScript',
    'Built 62 common components + design system → doubled new module development speed',
    'Multi-condition search engine + tag filter system → reduced search response time by 30%',
    'Lazy-load rendering optimization for stable processing of thousands of log entries',
    'Deployed and operating at 3+ major companies: Hyundai Mobis, AutoEver, Kefico'
  ]
WHERE company_ko LIKE '%Keyrke%' OR company_ko LIKE '%동훈%';

-- Tongin Express 경력 업데이트
UPDATE experiences SET
  position_ko = '프론트엔드 개발자 (사내 → 프리랜서 전환)',
  position_en = 'Frontend Developer (In-house → Freelancer)',
  description_ko = '사내 웹 퍼블리셔로 시작해 프리랜서로 전환하며, 오프라인 중심이던 계약 프로세스를 태블릿 전용 웹앱으로 디지털 전환하는 프로젝트를 주도했습니다.',
  description_en = 'Started as an in-house web publisher and transitioned to freelancer, leading the digital transformation of an offline contract process into a tablet-optimized web application.',
  achievements_ko = ARRAY[
    '계약 등록 → 견적 → 전자서명 → 상태관리 전 과정을 웹앱으로 디지털 전환',
    '아이패드 해상도 기준 터치 중심 반응형 UI 설계 및 구현',
    '현장 계약 처리 속도 60% 단축, 전자서명 완료율 35%p 향상',
    'Vue.js + SCSS 기반 컴포넌트 시스템 구축, 관리자 페이지 UI 구현'
  ],
  achievements_en = ARRAY[
    'Digitized entire contract flow: registration → quotation → e-signature → status tracking',
    'Designed and implemented touch-centric responsive UI optimized for iPad resolution',
    'Reduced on-site contract processing time by 60%, increased e-signature rate by 35pp',
    'Built component system with Vue.js + SCSS, implemented admin page UI'
  ]
WHERE company_ko LIKE '%통인%';
