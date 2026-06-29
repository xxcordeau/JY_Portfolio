export interface Skill {
  name: string;
  category: "frontend" | "backend" | "design" | "other";
}

export interface Education {
  school: {
    ko: string;
    en: string;
  };
  degree: {
    ko: string;
    en: string;
  };
  major: {
    ko: string;
    en: string;
  };
  period: string;
  description: {
    ko: string;
    en: string;
  };
}

export interface Experience {
  company: {
    ko: string;
    en: string;
  };
  position: {
    ko: string;
    en: string;
  };
  period: string;
  description: {
    ko: string;
    en: string;
  };
  achievements: {
    ko: string[];
    en: string[];
  };
}

export const skills: Skill[] = [
  // Frontend
  { name: "Vue 3 / Nuxt 3", category: "frontend" },
  { name: "React / Next.js", category: "frontend" },
  { name: "TypeScript", category: "frontend" },
  { name: "Electron", category: "frontend" },
  { name: "Tailwind CSS / styled-components", category: "frontend" },
  { name: "Zustand / Redux", category: "frontend" },

  // Backend
  { name: "Spring Boot / Java", category: "backend" },
  { name: "NestJS / Node.js", category: "backend" },
  { name: "PostgreSQL / Prisma", category: "backend" },
  { name: "WebSocket (STOMP)", category: "backend" },

  // Design
  { name: "Figma", category: "design" },
  { name: "Illustrator / Photoshop", category: "design" },

  // Other
  { name: "AWS (EC2 / S3 / RDS)", category: "other" },
  { name: "Docker / Nginx", category: "other" },
  { name: "Git / GitHub Actions", category: "other" },
  { name: "pnpm Workspaces", category: "other" },
];

export const education: Education[] = [
  {
    school: {
      ko: "한양여자대학교",
      en: "Hanyang Women's University",
    },
    degree: {
      ko: "학사",
      en: "Bachelor's Degree",
    },
    major: {
      ko: "시각미디어디자인과",
      en: "Visual Media Design",
    },
    period: "2019.03 - 2021.02",
    description: {
      ko: "시각디자인과 웹디자인을 배우면서 UI 감각을 익혔고, 졸업 후 프론트엔드 개발로 전향했습니다.",
      en: "Learned visual and web design with a focus on UI. Moved into frontend development after graduating.",
    },
  },
];

export const experiences: Experience[] = [
  {
    company: {
      ko: "윈앤티켓 (WinnTicket)",
      en: "WinnTicket Co., Ltd.",
    },
    position: {
      ko: "풀스택 엔지니어 (프리랜서)",
      en: "Fullstack Engineer (Freelancer)",
    },
    period: "2026.01 - 2026.06",
    description: {
      ko: "공연·레저·숙박 등 다양한 티켓 상품을 판매·관리하는 올인원 티켓 커머스 플랫폼의 풀스택 개발을 담당했습니다. 쇼핑몰(고객용), 관리자 대시보드, 현장 관리자 시스템까지 3개 시스템을 단일 React 앱으로 설계·구현했습니다.",
      en: "Led fullstack development of an all-in-one ticket commerce platform for selling and managing tickets across performances, leisure, and accommodation. Designed and implemented 3 systems (shopping mall, admin dashboard, field manager) as a unified React application.",
    },
    achievements: {
      ko: [
        "풀스택 개발 (팀 3명: 풀스택 1, 백엔드 2) — 쇼핑몰 + 관리자 + 현장관리자 3개 시스템을 단일 React 앱으로 설계·구현",
        "React.lazy + Suspense 코드 스플리팅 → 초기 번들 사이즈 42% 감소 (580KB → 336KB gzip)",
        "KCP PG 결제 연동 + 전액 포인트 결제 → 주문 완료 전환율 개선",
        "QR/바코드 기반 실시간 티켓 검증 — 현장 입장 처리 3초 이내",
        "RBAC 3단계 권한 분리 (관리자/현장관리자/파트너) + 라우트·API 이중 가드",
        "Spring Boot + MyBatis + PostgreSQL RESTful API 50+ 엔드포인트 설계·구현",
      ],
      en: [
        "Fullstack development (team of 3: 1 fullstack, 2 backend) — 3 systems as unified React app",
        "React.lazy + Suspense code splitting → 42% initial bundle reduction (580KB → 336KB gzip)",
        "KCP payment gateway + full point payment → improved order completion conversion",
        "QR/barcode real-time ticket verification — on-site entry processing under 3 seconds",
        "RBAC 3-tier permissions (admin/field/partner) + route & API dual guards",
        "Spring Boot + MyBatis + PostgreSQL RESTful API 50+ endpoints designed & implemented",
      ],
    },
  },
  {
    company: {
      ko: "SnapClub (호주)",
      en: "SnapClub (Australia)",
    },
    position: {
      ko: "풀스택 엔지니어 (프리랜서)",
      en: "Fullstack Engineer (Freelancer)",
    },
    period: "2025.12 - 2026.06",
    description: {
      ko: "호주 멜버른 포토부스 브랜드의 레거시 WPF 시스템을 Electron + React + NestJS 기반으로 전면 리빌드했습니다. 부스 키오스크 앱, 관리자 대시보드, 백엔드 서버까지 pnpm 모노레포로 개발했습니다.",
      en: "Full rebuild of an Australian photo booth brand's legacy WPF system into a modern Electron + React + NestJS stack. Developed booth kiosk app, admin dashboard, and backend server as a pnpm monorepo.",
    },
    achievements: {
      ko: [
        "레거시 WPF 시스템 리버스 엔지니어링 → Electron + React + NestJS 풀 리빌드",
        "Canvas 기반 1200×1800px 인쇄 품질 사진 합성 엔진 — 10+ cutType 지원",
        "Canon EDSDK 카메라 + Nayax 결제기 + Sinfonia 프린터 하드웨어 연동 (C# 데몬 IPC)",
        "15단계 세션 플로우 (대기→결제→촬영→편집→꾸미기→QR 다운로드)",
        "17페이지 관리자 대시보드 — 매출 분석, 장치 원격 관리, 프레임 에디터, CMS",
        "pnpm 모노레포 + 공유 타입 패키지 → 프론트/백엔드 타입 안정성 확보",
        "66개 테스트 케이스 (Vitest + Jest + Supertest)",
      ],
      en: [
        "Full rebuild from legacy WPF via reverse engineering into Electron + React + NestJS",
        "Canvas-based 1200×1800px print-quality photo composition engine — 10+ cut types",
        "Canon EDSDK camera + Nayax payment + Sinfonia printer hardware integration via C# daemon IPC",
        "15-step session flow (idle→payment→capture→edit→decorate→QR download)",
        "17-page admin dashboard — revenue analytics, remote device management, frame editor, CMS",
        "pnpm monorepo + shared type packages for frontend/backend type safety",
        "66 test cases (Vitest + Jest + Supertest)",
      ],
    },
  },
  {
    company: {
      ko: "동훈아이텍 (Keyrke)",
      en: "Donghun I-Tech (Keyrke)",
    },
    position: {
      ko: "프론트엔드 개발자",
      en: "Frontend Developer",
    },
    period: "2023.08 - 현재",
    description: {
      ko: "보안 자산관리 솔루션 Keyrke의 프론트엔드를 혼자 맡아 개발하고 있습니다. 현대모비스, 현대오토에버, 현대케피코 등에 납품되어 실제 운영 중인 제품입니다.",
      en: "Solo frontend developer on Keyrke, a security asset management solution. Currently in production at Hyundai Mobis, AutoEver, and Kefico.",
    },
    achievements: {
      ko: [
        "프론트엔드 1인 전담 — Nuxt 3 + TypeScript 기반 SPA 아키텍처 설계 및 전체 UI 구현",
        "공통 컴포넌트 62종 + 디자인 시스템 구축 → 신규 모듈 개발 속도 2배 향상",
        "다중 조건 검색 엔진 + 태그 필터 시스템 → 기존 대비 검색 응답 속도 30% 단축",
        "수천 건 로그 데이터 안정 처리를 위한 lazy-load 렌더링 최적화",
        "현대모비스·현대오토에버·현대케피코 등 주요 그룹사 3곳+ 도입 운영 중",
      ],
      en: [
        "Sole frontend developer — Designed SPA architecture and implemented all UI based on Nuxt 3 + TypeScript",
        "Built 62 common components + design system → doubled new module development speed",
        "Multi-condition search engine + tag filter system → reduced search response time by 30%",
        "Lazy-load rendering optimization for stable processing of thousands of log entries",
        "Deployed and operating at 3+ major companies: Hyundai Mobis, AutoEver, Kefico",
      ],
    },
  },
  {
    company: {
      ko: "통인익스프레스",
      en: "Tongin Express",
    },
    position: {
      ko: "프론트엔드 개발자 (프리랜서)",
      en: "Frontend Developer (Freelancer)",
    },
    period: "2024.01 - 2024.06",
    description: {
      ko: "기존 오프라인 종이 계약 프로세스를 아이패드·태블릿 전용 웹앱으로 디지털 전환하는 프로젝트를 단독으로 개발했습니다. 계약 등록부터 전자서명, 진행 관리까지 전 과정을 실시간으로 연동했습니다.",
      en: "Solo-developed a digital transformation project converting the existing offline paper contract process into a tablet-optimized web application. Integrated the entire flow from contract registration to e-signature and progress management in real-time.",
    },
    achievements: {
      ko: [
        "프론트엔드 단독 개발 (팀: 백엔드 1, 프론트 1, 기획 1) — 오프라인 종이 계약 → 태블릿 웹앱 디지털 전환",
        "전자서명 프로세스: SMS 계약서 링크 발송 → WebSocket 실시간 상태 업데이트",
        "계약 CRUD + 실시간 상태 머신 (대기 → 서명중 → 완료 → 취소)",
        "관리자 대시보드: 계약 현황 통계, 일별/월별 추이 차트, 서명 로그 추적",
        "현장 계약 처리 시간 25분 → 10분 (60% 단축)",
        "전자서명 완료율 52% → 87% (35%p 향상)",
      ],
      en: [
        "Solo frontend developer (team: 1 backend, 1 frontend, 1 PM) — digitized offline paper contracts to tablet webapp",
        "E-signature flow: SMS contract link → real-time WebSocket status update on customer signature",
        "Contract CRUD + real-time state machine (pending → signing → completed → cancelled)",
        "Admin dashboard: contract statistics, daily/monthly trend charts, signature log tracking",
        "Reduced contract processing from 25min → 10min (60% reduction)",
        "E-signature completion rate: 52% → 87% (35pp improvement)",
      ],
    },
  },
  {
    company: {
      ko: "통인익스프레스",
      en: "Tongin Express",
    },
    position: {
      ko: "프론트엔드 개발자 (사내 → 프리랜서 전환)",
      en: "Frontend Developer (In-house → Freelancer)",
    },
    period: "2022.07 - 2023.07",
    description: {
      ko: "사내 웹 퍼블리셔로 시작해 프리랜서로 전환하며, 오프라인 중심이던 계약 프로세스를 태블릿 전용 웹앱으로 디지털 전환하는 프로젝트를 주도했습니다.",
      en: "Started as an in-house web publisher and transitioned to freelancer, leading the digital transformation of an offline contract process into a tablet-optimized web application.",
    },
    achievements: {
      ko: [
        "계약 등록 → 견적 → 전자서명 → 상태관리 전 과정을 웹앱으로 디지털 전환",
        "아이패드 해상도 기준 터치 중심 반응형 UI 설계 및 구현",
        "현장 계약 처리 속도 60% 단축, 전자서명 완료율 35% 향상",
        "Vue.js + SCSS 기반 컴포넌트 시스템 구축, 관리자 페이지 UI 구현",
      ],
      en: [
        "Digitized entire contract flow: registration → quotation → e-signature → status tracking",
        "Designed and implemented touch-centric responsive UI optimized for iPad resolution",
        "Reduced on-site contract processing time by 60%, increased e-signature completion rate by 35%",
        "Built component system with Vue.js + SCSS, implemented admin page UI",
      ],
    },
  },
];