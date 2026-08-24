-- ============================================
-- 외주 경력 3건 추가 (WinnTicket, SnapClub, 통인익스프레스 외주)
-- Supabase SQL Editor에서 실행
-- ============================================

-- sort_order: 낮을수록 위에 표시 (order by sort_order)
-- -3: WinnTicket (2026)
-- -2: SnapClub (2025.12~2026)
-- -1: 통인익스프레스 외주 (2024)
-- 0: 동훈아이텍 (기존)
-- 1: 통인익스프레스 사내 (기존)

-- 1) 윈앤티켓 — 티켓 커머스 플랫폼
INSERT INTO experiences (
  company_ko, company_en,
  position_ko, position_en,
  period,
  description_ko, description_en,
  achievements_ko, achievements_en,
  sort_order
) VALUES (
  '윈앤티켓 (WinnTicket)',
  'WinnTicket Co., Ltd.',
  '풀스택 엔지니어 (프리랜서)',
  'Fullstack Engineer (Freelancer)',
  '2026.01 - 2026.06',
  '공연·레저·숙박 등 다양한 티켓 상품을 판매·관리하는 올인원 티켓 커머스 플랫폼의 풀스택 개발을 담당했습니다. 쇼핑몰(고객용), 관리자 대시보드, 현장 관리자 시스템까지 3개 시스템을 단일 React 앱으로 설계·구현했습니다.',
  'Led fullstack development of an all-in-one ticket commerce platform for selling and managing tickets across performances, leisure, and accommodation. Designed and implemented 3 systems (shopping mall, admin dashboard, field manager) as a unified React application.',
  ARRAY[
    '풀스택 개발 (팀 3명: 풀스택 1, 백엔드 2) — 쇼핑몰 + 관리자 + 현장관리자 3개 시스템을 단일 React 앱으로 설계·구현',
    'React.lazy + Suspense 코드 스플리팅 → 초기 번들 사이즈 42% 감소 (580KB → 336KB gzip)',
    'KCP PG 결제 연동 + 전액 포인트 결제 → 주문 완료 전환율 개선',
    'QR/바코드 기반 실시간 티켓 검증 — 현장 입장 처리 3초 이내',
    'RBAC 3단계 권한 분리 (관리자/현장관리자/파트너) + 라우트·API 이중 가드',
    'Spring Boot + MyBatis + PostgreSQL RESTful API 50+ 엔드포인트 설계·구현'
  ],
  ARRAY[
    'Fullstack development (team of 3: 1 fullstack, 2 backend) — 3 systems as unified React app',
    'React.lazy + Suspense code splitting → 42% initial bundle reduction (580KB → 336KB gzip)',
    'KCP payment gateway + full point payment → improved order completion conversion',
    'QR/barcode real-time ticket verification — on-site entry processing under 3 seconds',
    'RBAC 3-tier permissions (admin/field/partner) + route & API dual guards',
    'Spring Boot + MyBatis + PostgreSQL RESTful API 50+ endpoints designed & implemented'
  ],
  -3
);

-- 2) SnapClub — 포토부스 키오스크 시스템
INSERT INTO experiences (
  company_ko, company_en,
  position_ko, position_en,
  period,
  description_ko, description_en,
  achievements_ko, achievements_en,
  sort_order
) VALUES (
  'SnapClub (호주)',
  'SnapClub (Australia)',
  '풀스택 엔지니어 (프리랜서)',
  'Fullstack Engineer (Freelancer)',
  '2025.12 - 2026.06',
  '호주 멜버른 포토부스 브랜드의 레거시 WPF 시스템을 Electron + React + NestJS 기반으로 전면 리빌드했습니다. 부스 키오스크 앱, 관리자 대시보드, 백엔드 서버까지 pnpm 모노레포로 개발했습니다.',
  'Full rebuild of an Australian photo booth brand''s legacy WPF system into a modern Electron + React + NestJS stack. Developed booth kiosk app, admin dashboard, and backend server as a pnpm monorepo.',
  ARRAY[
    '레거시 WPF 시스템 리버스 엔지니어링 → Electron + React + NestJS 풀 리빌드',
    'Canvas 기반 1200×1800px 인쇄 품질 사진 합성 엔진 — 10+ cutType 지원',
    'Canon EDSDK 카메라 + Nayax 결제기 + Sinfonia 프린터 하드웨어 연동 (C# 데몬 IPC)',
    '15단계 세션 플로우 (대기→결제→촬영→편집→꾸미기→QR 다운로드)',
    '17페이지 관리자 대시보드 — 매출 분석, 장치 원격 관리, 프레임 에디터, CMS',
    'pnpm 모노레포 + 공유 타입 패키지 → 프론트/백엔드 타입 안정성 확보',
    '66개 테스트 케이스 (Vitest + Jest + Supertest)'
  ],
  ARRAY[
    'Full rebuild from legacy WPF via reverse engineering into Electron + React + NestJS',
    'Canvas-based 1200×1800px print-quality photo composition engine — 10+ cut types',
    'Canon EDSDK camera + Nayax payment + Sinfonia printer hardware integration via C# daemon IPC',
    '15-step session flow (idle→payment→capture→edit→decorate→QR download)',
    '17-page admin dashboard — revenue analytics, remote device management, frame editor, CMS',
    'pnpm monorepo + shared type packages for frontend/backend type safety',
    '66 test cases (Vitest + Jest + Supertest)'
  ],
  -2
);

-- 3) 통인익스프레스 — 계약 관리 시스템 (외주)
INSERT INTO experiences (
  company_ko, company_en,
  position_ko, position_en,
  period,
  description_ko, description_en,
  achievements_ko, achievements_en,
  sort_order
) VALUES (
  '통인익스프레스',
  'Tongin Express',
  '프론트엔드 개발자 (프리랜서)',
  'Frontend Developer (Freelancer)',
  '2024.01 - 2024.06',
  '기존 오프라인 종이 계약 프로세스를 아이패드·태블릿 전용 웹앱으로 디지털 전환하는 프로젝트를 단독으로 개발했습니다. 계약 등록부터 전자서명, 진행 관리까지 전 과정을 실시간으로 연동했습니다.',
  'Solo-developed a digital transformation project converting the existing offline paper contract process into a tablet-optimized web application. Integrated the entire flow from contract registration to e-signature and progress management in real-time.',
  ARRAY[
    '프론트엔드 단독 개발 (팀: 백엔드 1, 프론트 1, 기획 1) — 오프라인 종이 계약 → 태블릿 웹앱 디지털 전환',
    '전자서명 프로세스: SMS 계약서 링크 발송 → WebSocket 실시간 상태 업데이트',
    '계약 CRUD + 실시간 상태 머신 (대기 → 서명중 → 완료 → 취소)',
    '관리자 대시보드: 계약 현황 통계, 일별/월별 추이 차트, 서명 로그 추적',
    '현장 계약 처리 시간 25분 → 10분 (60% 단축)',
    '전자서명 완료율 52% → 87% (35%p 향상)'
  ],
  ARRAY[
    'Solo frontend developer (team: 1 backend, 1 frontend, 1 PM) — digitized offline paper contracts to tablet webapp',
    'E-signature flow: SMS contract link → real-time WebSocket status update on customer signature',
    'Contract CRUD + real-time state machine (pending → signing → completed → cancelled)',
    'Admin dashboard: contract statistics, daily/monthly trend charts, signature log tracking',
    'Reduced contract processing from 25min → 10min (60% reduction)',
    'E-signature completion rate: 52% → 87% (35pp improvement)'
  ],
  -1
);
