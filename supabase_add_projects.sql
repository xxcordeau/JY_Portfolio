-- ============================================
-- 프로젝트 4개 추가 SQL
-- Supabase SQL Editor에서 실행
-- ============================================

-- 1) project_type 컬럼이 없으면 추가
ALTER TABLE projects ADD COLUMN IF NOT EXISTS project_type text NOT NULL DEFAULT 'personal';

-- 2) 기존 외주 프로젝트 타입 설정
UPDATE projects SET project_type = 'freelance'
WHERE id IN ('winnticket', 'tongin-express', 'keyrke');


-- ============================================
-- [외주] SnapClub — 포토부스 키오스크 시스템
-- ============================================
INSERT INTO projects (
  id, project_type,
  title_ko, title_en,
  description_ko, description_en,
  full_description_ko, full_description_en,
  role_ko, role_en,
  year, tags, cover_image_url,
  tech_frontend, tech_backend, tech_design, tech_others,
  highlights_ko, highlights_en,
  challenge_ko, challenge_en,
  solution_ko, solution_en,
  link_github, link_demo, link_website,
  is_featured, sort_order
) VALUES (
  'snapclub',
  'freelance',
  'SnapClub - 포토부스 키오스크 시스템',
  'SnapClub - Photo Booth Kiosk System',
  '호주 포토부스 브랜드의 레거시 WPF 시스템을 Electron + React + NestJS로 풀 리빌드한 풀스택 키오스크 관리 시스템',
  'Full rebuild of an Australian photo booth brand''s legacy WPF system into a modern Electron + React + NestJS kiosk management system',
  '호주 멜버른에 위치한 포토부스 브랜드 SnapClub의 기존 WPF 기반 레거시 시스템을 Electron + React + NestJS 기반으로 전면 리빌드한 프로젝트입니다. 부스 키오스크 앱, 관리자 대시보드, 백엔드 서버까지 아우르는 pnpm 모노레포 구성으로 개발했습니다.

부스 앱은 대기화면부터 언어선택, 프레임선택, 결제, 촬영, 편집, 꾸미기, QR 다운로드까지 15단계 세션 플로우를 구현했으며, Canvas 기반 1200×1800px 고해상도 사진 합성 엔진으로 10가지 이상의 cutType을 지원합니다. Canon EDSDK 카메라, Nayax 결제기, Sinfonia 염료승화 프린터를 C# 데몬과 Named Pipe IPC로 연동했습니다.

관리자 대시보드는 17개 페이지로 구성되어 매출 분석, 장치 원격 관리, 프레임 에디터, 쿠폰 발행, CMS 등 운영에 필요한 모든 기능을 제공합니다.',
  'A complete rebuild of SnapClub''s legacy WPF-based photo booth system into a modern Electron + React + NestJS stack, developed as a pnpm monorepo encompassing the booth kiosk app, admin dashboard, and backend server.

The booth app implements a 15-step session flow from idle screen through language selection, frame selection, payment, photo capture, editing, decoration, to QR download. A Canvas-based 1200×1800px high-resolution photo composition engine supports 10+ cut types. Canon EDSDK camera, Nayax payment terminal, and Sinfonia dye-sublimation printer are integrated via a C# daemon using Named Pipe IPC.

The admin dashboard spans 17 pages covering revenue analytics, remote device management, frame editor, coupon issuance, and CMS — everything needed for day-to-day operations.',
  'Fullstack Engineer',
  'Fullstack Engineer',
  '2026',
  ARRAY['React','Electron','NestJS','TypeScript','Monorepo','Production'],
  'https://images.unsplash.com/photo-1527011046414-4781f1f94f8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  ARRAY['React','TypeScript','Electron','Vite','styled-components','Tailwind CSS','Zustand','Recharts','i18next'],
  ARRAY['NestJS','Prisma','PostgreSQL','JWT','Swagger','AWS S3'],
  ARRAY[]::text[],
  ARRAY['pnpm Workspaces','Docker','Terraform','GitHub Actions','Vitest'],
  ARRAY[
    '레거시 WPF 시스템 리버스 엔지니어링 후 Electron + React + NestJS로 풀 리빌드',
    'Canvas 기반 1200×1800px 인쇄 품질 사진 합성 엔진 — 10+ cutType 지원',
    'Canon EDSDK 카메라 + Nayax 결제기 + Sinfonia 프린터 하드웨어 연동 (C# 데몬 IPC)',
    '15단계 세션 플로우 (대기→결제→촬영→편집→꾸미기→QR 다운로드)',
    '17개 페이지 관리자 대시보드 — 매출 분석, 장치 원격 관리, 프레임 에디터',
    'pnpm 모노레포 + 공유 타입 패키지로 프론트/백엔드 타입 안정성 확보',
    'JWT 이중 인증 — 관리자(역할 기반) + 부스 디바이스 분리',
    '66개 테스트 케이스 (Vitest + Jest + Supertest)'
  ],
  ARRAY[
    'Full rebuild from legacy WPF after reverse engineering into Electron + React + NestJS',
    'Canvas-based 1200×1800px print-quality photo composition engine — 10+ cut types',
    'Canon EDSDK camera + Nayax payment + Sinfonia printer hardware integration via C# daemon IPC',
    '15-step session flow (idle→payment→capture→edit→decorate→QR download)',
    '17-page admin dashboard — revenue analytics, remote device management, frame editor',
    'pnpm monorepo + shared type packages for frontend/backend type safety',
    'Dual JWT auth — role-based admin + booth device authentication',
    '66 test cases (Vitest + Jest + Supertest)'
  ],
  '기존 WPF 레거시 시스템의 실행 파일과 로그만으로 프린터 IPC 프로토콜, 결제기 MDB/VMC 프로토콜, 프레임 에셋 구조를 리버스 엔지니어링해야 했습니다. 카메라·결제기·프린터 세 가지 하드웨어를 웹 기반 앱에서 제어하는 기술적 제약도 있었습니다.',
  'Had to reverse-engineer the legacy WPF system''s printer IPC protocol, payment terminal MDB/VMC protocol, and frame asset structure from executables and logs alone, while controlling three hardware devices from a web-based application.',
  'C# .NET 8 기반 하드웨어 데몬을 분리하여 Named Pipe IPC로 Electron 앱과 통신하는 계층 구조를 설계했습니다. 하드웨어 추상화 계층으로 웹 기술의 한계를 극복하고, 모노레포 구조로 타입 공유와 배포 일관성을 확보했습니다.',
  'Designed a layered architecture with a separate C# .NET 8 hardware daemon communicating via Named Pipe IPC. Overcame web technology limitations through hardware abstraction and ensured type sharing consistency via monorepo structure.',
  'https://github.com/xxcordeau/SnapClub',
  NULL,
  NULL,
  true,
  0
);


-- ============================================
-- [개인] Typing Battle — 실시간 타자 대결 게임
-- ============================================
INSERT INTO projects (
  id, project_type,
  title_ko, title_en,
  description_ko, description_en,
  full_description_ko, full_description_en,
  role_ko, role_en,
  year, tags, cover_image_url,
  tech_frontend, tech_backend, tech_design, tech_others,
  highlights_ko, highlights_en,
  challenge_ko, challenge_en,
  solution_ko, solution_en,
  link_github, link_demo, link_website,
  is_featured, sort_order
) VALUES (
  'typing-battle',
  'personal',
  'Typing Battle - 실시간 타자 대결 게임',
  'Typing Battle - Real-time Typing Battle Game',
  '링크 하나로 친구를 초대해 실시간으로 타이핑 속도를 겨루는 멀티플레이 레트로 타자 대결 게임',
  'A retro-styled multiplayer typing battle game where friends compete in real-time typing speed via a single shared link',
  '링크 하나로 친구를 불러서 같은 지문을 동시에 타이핑하며 속도를 겨루는 실시간 멀티플레이 타자 대결 게임입니다. 로그인 없이 2~8명이 참여 가능하며, 방 코드를 공유하여 입장하는 구조입니다.

글자 단위 정오 판정 엔진, 실시간 WPM(분당 타수)·정확도 계산, 상대방 진행률 동시 표시 등 게임 핵심 로직을 커스텀 훅으로 캡슐화했습니다. 오타 시 shake 애니메이션, 3초 카운트다운, 순위별 금/은/동 랭크 카드 등 게임 몰입감을 높이는 요소를 구현했습니다.

레트로 픽셀 아트 스타일의 UI를 외부 라이브러리 없이 직접 디자인했으며, 공룡/고양이 SVG 스프라이트, scanline 효과, 깜빡이는 텍스트 등 8-bit 게임 느낌을 충실히 구현했습니다.',
  'A real-time multiplayer typing battle game where 2-8 players join without login and compete on the same passage simultaneously via a shared room code.

Core game logic — character-level accuracy checking, real-time WPM and accuracy calculation, opponent progress display — is encapsulated in custom hooks. Immersive features include shake animation on typos, 3-second countdown, and gold/silver/bronze rank cards.

The retro pixel-art UI was custom-built without external UI libraries, featuring dinosaur/cat SVG sprites, scanline effects, and blinking text for an authentic 8-bit game feel.',
  'Frontend Developer',
  'Frontend Developer',
  '2026',
  ARRAY['React','TypeScript','WebSocket','Game','Retro'],
  'https://images.unsplash.com/photo-1587829741301-dc798b83add3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  ARRAY['React','TypeScript','Vite','Zustand'],
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['WebSocket','STOMP'],
  ARRAY[
    '글자 단위 정오 판정 엔진 — 실시간 WPM·정확도 계산을 useTyping 훅으로 캡슐화',
    'STOMP WebSocket 기반 실시간 멀티플레이 아키텍처 설계 (mock → 실 서버 교체 용이)',
    '커스텀 훅 기반 관심사 분리 — useTyping, useGame, useRoom, useWebSocket 4개 훅',
    '레트로 픽셀 UI 직접 제작 — SVG 스프라이트, PixelBox·PixelButton 디자인 시스템',
    '한/영 지문 지원 (퍼블릭 도메인 고전 텍스트 활용)',
    '하루 만에 전체 프론트엔드 개발 완료 (2026-04-24)'
  ],
  ARRAY[
    'Character-level accuracy engine with real-time WPM calculation encapsulated in useTyping hook',
    'STOMP WebSocket-based real-time multiplayer architecture (mock-first, easy server swap)',
    'Separation of concerns via custom hooks — useTyping, useGame, useRoom, useWebSocket',
    'Custom-built retro pixel UI — SVG sprites, PixelBox/PixelButton design system',
    'Korean/English passage support using public domain classic texts',
    'Complete frontend developed in a single day (2026-04-24)'
  ],
  '글자 단위 타이핑 판정에서 한글의 조합형 입력 특성과 영문의 단순 비교를 모두 처리해야 했고, 실시간 멀티플레이어의 상태 동기화를 저지연으로 구현해야 했습니다.',
  'Needed to handle both Korean''s composing-character input and English''s simple comparison in character-level typing judgment, while implementing low-latency state synchronization for real-time multiplayer.',
  'STOMP 프로토콜 기반의 구독/발행 패턴을 mock으로 먼저 구현하여 프론트엔드를 독립적으로 개발하고, 실제 백엔드 교체가 용이하도록 인터페이스를 분리했습니다. Zustand의 useShallow로 selector 최적화하여 리렌더링을 최소화했습니다.',
  'Implemented STOMP subscribe/publish patterns as mocks first for independent frontend development with easy backend swapping. Optimized re-renders with Zustand''s useShallow selectors.',
  'https://github.com/xxcordeau/TypingBattle',
  NULL,
  'https://typebattle.co.kr/',
  false,
  100
);


-- ============================================
-- [개인] WiaPet — 반려동물 용품 쇼핑몰
-- ============================================
INSERT INTO projects (
  id, project_type,
  title_ko, title_en,
  description_ko, description_en,
  full_description_ko, full_description_en,
  role_ko, role_en,
  year, tags, cover_image_url,
  tech_frontend, tech_backend, tech_design, tech_others,
  highlights_ko, highlights_en,
  challenge_ko, challenge_en,
  solution_ko, solution_en,
  link_github, link_demo, link_website,
  is_featured, sort_order
) VALUES (
  'wiapet',
  'personal',
  'WiaPet - 반려동물 프리미엄 쇼핑몰',
  'WiaPet - Premium Pet Supplies Shop',
  '반려동물 프리미엄 용품 전문 이커머스 쇼핑몰의 프론트엔드 전체 구현',
  'Complete frontend implementation of a premium pet supplies e-commerce shopping mall',
  '반려동물(고양이/강아지) 전용 프리미엄 용품 쇼핑몰입니다. 사료, 간식, 모래, 건강용품 등을 판매하는 이커머스 플랫폼의 프론트엔드를 설계부터 구현까지 전담했습니다.

메인 페이지의 히어로 배너, 카테고리 네비게이션, 베스트/신상품 그리드부터 상품 목록(6종 정렬·카테고리 필터·검색), 상품 상세(탭 UI·관련 상품 추천), 장바구니(수량 변경·주문 요약·Sticky 사이드바), 주문/결제(배송정보 폼·4종 결제수단), 주문완료까지 풀 쇼핑 플로우를 구현했습니다.

styled-components의 ThemeProvider를 활용한 디자인 토큰 시스템과 4단계 반응형 breakpoint로 모바일부터 데스크탑까지 대응합니다.',
  'A premium pet supplies e-commerce platform for cats and dogs. Designed and implemented the complete frontend covering food, treats, litter, and health products.

Built the full shopping flow from hero banners, category navigation, best/new product grids, product listing (6 sort options, category filters, search), product detail (tabbed UI, related product recommendations), cart (quantity changes, order summary, sticky sidebar), checkout (shipping form, 4 payment methods), to order completion.

Features a design token system via styled-components ThemeProvider and 4-tier responsive breakpoints covering mobile to desktop.',
  'Frontend Developer',
  'Frontend Developer',
  '2026',
  ARRAY['React','TypeScript','E-Commerce','styled-components'],
  'https://images.unsplash.com/photo-1583337130417-13104dec14a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  ARRAY['React','TypeScript','Vite','styled-components','React Router'],
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['Vercel'],
  ARRAY[
    '풀 쇼핑 플로우 구현 — 홈→목록→상세→장바구니→결제→주문완료',
    '6종 정렬 + 카테고리 필터 + 검색 기능이 결합된 상품 목록 페이지',
    'Context API 기반 장바구니 CRUD — 추가/삭제/수량 변경/금액 자동 계산',
    '4종 결제수단 선택 UI (신용카드/무통장/카카오페이/네이버페이)',
    'styled-components ThemeProvider 기반 디자인 토큰 시스템',
    '4단계 반응형 breakpoint (480/768/1024/1200px) — 모바일~데스크탑 대응',
    '상품 카드 hover 인터랙션 — 이미지 줌 + 장바구니 오버레이 애니메이션',
    '20개 실제 브랜드(로얄캐닌/네츄럴코어/이나바 등) 기반 상품 데이터'
  ],
  ARRAY[
    'Full shopping flow — home→listing→detail→cart→checkout→order complete',
    'Product listing with 6 sort options + category filters + search',
    'Context API cart CRUD — add/remove/quantity change/auto price calculation',
    '4 payment method selection UI (credit card/bank transfer/KakaoPay/NaverPay)',
    'styled-components ThemeProvider-based design token system',
    '4-tier responsive breakpoints (480/768/1024/1200px) — mobile to desktop',
    'Product card hover interactions — image zoom + cart overlay animation',
    '20 real brand-based product data (Royal Canin, Natural Core, Inaba, etc.)'
  ],
  '외부 UI 라이브러리 없이 이커머스에 필요한 모든 UI 패턴(상품 그리드, 필터, 장바구니, 결제 폼 등)을 직접 구현해야 했으며, 반응형 레이아웃에서 장바구니 Sticky 사이드바와 모바일 전환을 자연스럽게 처리해야 했습니다.',
  'Had to implement all e-commerce UI patterns (product grids, filters, cart, checkout forms) without external UI libraries, and handle natural transitions between sticky cart sidebar and mobile layouts across responsive breakpoints.',
  'styled-components의 theme 기반으로 색상·그림자·간격 등 디자인 토큰을 일원화하여 컴포넌트 간 일관성을 확보했고, React Context API만으로 장바구니 상태 관리(CRUD + 금액 계산)를 구현하여 별도 상태관리 라이브러리 의존을 제거했습니다.',
  'Unified design tokens (colors, shadows, spacing) through styled-components theme for component consistency. Implemented cart state management (CRUD + price calculation) with React Context API alone, eliminating external state management library dependencies.',
  NULL,
  NULL,
  NULL,
  false,
  101
);


-- ============================================
-- [개인] IntoVet EMR — 수의 전자차트 시스템
-- ============================================
INSERT INTO projects (
  id, project_type,
  title_ko, title_en,
  description_ko, description_en,
  full_description_ko, full_description_en,
  role_ko, role_en,
  year, tags, cover_image_url,
  tech_frontend, tech_backend, tech_design, tech_others,
  highlights_ko, highlights_en,
  challenge_ko, challenge_en,
  solution_ko, solution_en,
  link_github, link_demo, link_website,
  is_featured, sort_order
) VALUES (
  'intovet-emr',
  'personal',
  'IntoVet Cloud EMR - 수의 전자차트 시스템',
  'IntoVet Cloud EMR - Veterinary Electronic Medical Records',
  '동물병원용 클라우드 기반 전자의무기록(EMR) 시스템 — SOAP 진료 차트, 예약, 검사, 처방 통합 관리',
  'Cloud-based Electronic Medical Records system for veterinary clinics — integrating SOAP charts, appointments, lab results, and prescriptions',
  '동물병원용 클라우드 기반 전자의무기록(EMR) 시스템입니다. 수의사가 환자(반려동물) 관리, SOAP 진료 차트 작성, 예약 관리, 검사 결과 조회, 처방 관리를 하나의 웹 애플리케이션에서 수행할 수 있는 SaaS형 솔루션의 프론트엔드를 개발했습니다.

대시보드에서는 오늘 진료/대기/수술/입원 환자 통계, 월별 현황 차트(Recharts BarChart), 종별 분포 파이 차트, 예약 일정을 한눈에 확인할 수 있습니다. 진료 차트는 수의학 표준 SOAP(Subjective/Objective/Assessment/Plan) 형식의 기록 폼과 Problem List, 검사 결과 패널, 처방 목록을 통합하여 제공합니다.

예약 관리는 필터링, 통계 카드, 캘린더 뷰를 지원하며, 검사 결과와 처방 관리 모듈까지 포함한 종합적인 병원 운영 시스템입니다.',
  'A cloud-based Electronic Medical Records (EMR) system for veterinary clinics. Developed the frontend for a SaaS solution enabling veterinarians to manage patients, write SOAP charts, handle appointments, review lab results, and manage prescriptions in a single web application.

The dashboard provides at-a-glance views of today''s consultation/waiting/surgery/hospitalization patient stats, monthly trend charts (Recharts BarChart), species distribution pie charts, and appointment schedules. The medical chart integrates SOAP (Subjective/Objective/Assessment/Plan) recording forms with Problem List, lab results panel, and prescription lists.

Appointment management supports filtering, statistics cards, and calendar views, forming a comprehensive hospital operations system including lab results and prescription management modules.',
  'Frontend Developer',
  'Frontend Developer',
  '2026',
  ARRAY['Next.js','TypeScript','EMR','Healthcare','Recharts'],
  'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  ARRAY['Next.js','React','TypeScript','styled-components','Recharts','Lucide React'],
  ARRAY[]::text[],
  ARRAY[]::text[],
  ARRAY['Vercel'],
  ARRAY[
    'SOAP(Subjective/Objective/Assessment/Plan) 수의학 표준 진료 기록 폼 구현',
    'Recharts 기반 데이터 시각화 — 월별 현황 BarChart + 종별 분포 PieChart',
    '8개 주요 페이지 — 대시보드, 환자 목록, 진료 차트, 예약, 검사, 처방, 통계, 설정',
    'Problem List (질환 이력 관리) — On-going/Completed/Resolved 상태 추적',
    '캘린더 뷰 + 필터링 기반 예약 관리 시스템',
    '상태별 컬러 코딩 — 대기(노랑)/진료중(파랑)/완료(녹색)/입원(빨강)',
    'Next.js App Router + styled-components SSR 설정 (StyledComponentsRegistry)',
    'theme.ts 기반 디자인 토큰 시스템 — 색상, 간격, 그림자, 반응형 일원화'
  ],
  ARRAY[
    'Veterinary-standard SOAP (Subjective/Objective/Assessment/Plan) medical record form implementation',
    'Recharts data visualization — monthly trend BarChart + species distribution PieChart',
    '8 main pages — dashboard, patients, medical chart, appointments, lab, pharmacy, statistics, settings',
    'Problem List (disease history management) — On-going/Completed/Resolved status tracking',
    'Calendar view + filter-based appointment management system',
    'Status color coding — waiting(yellow)/in-consultation(blue)/completed(green)/hospitalized(red)',
    'Next.js App Router + styled-components SSR setup (StyledComponentsRegistry)',
    'theme.ts-based design token system — unified colors, spacing, shadows, breakpoints'
  ],
  '수의학 도메인 특화 용어(ALT, BUN, WBC, PLT 등)와 SOAP 진료 체계를 정확히 이해하고 UI로 표현해야 했으며, Next.js App Router 환경에서 styled-components의 SSR 호환성 문제를 해결해야 했습니다.',
  'Required accurate understanding and UI representation of veterinary-specific terminology (ALT, BUN, WBC, PLT) and the SOAP medical record system, while resolving styled-components SSR compatibility in the Next.js App Router environment.',
  '수의학 전문가 자문을 통해 실제 진료 워크플로우를 반영한 UI를 설계했고, StyledComponentsRegistry를 통해 서버사이드 렌더링에서 styled-components가 정상 동작하도록 구성했습니다. 공통 컴포넌트(Button, Card, Modal, Badge, Table 등)를 체계적으로 분리하여 신규 페이지 추가 속도를 높였습니다.',
  'Designed UI reflecting actual clinical workflows through veterinary expert consultation. Configured StyledComponentsRegistry for proper styled-components operation in SSR. Systematically separated common components (Button, Card, Modal, Badge, Table) to accelerate new page development.',
  NULL,
  NULL,
  NULL,
  false,
  102
);
