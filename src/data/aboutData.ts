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
      ko: "동훈아이텍 (Keyrke)",
      en: "Donghun I-Tech (Keyrke)",
    },
    position: {
      ko: "프론트엔드 개발자 (정규직)",
      en: "Frontend Developer (Full-time)",
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
      ko: "SnapClub (호주)",
      en: "SnapClub (Australia)",
    },
    position: {
      ko: "풀스택 엔지니어 (프리랜서 · 야간/주말)",
      en: "Fullstack Engineer (Freelance · nights & weekends)",
    },
    period: "2026.04 - 2026.06",
    description: {
      ko: "호주 멜버른 포토부스 브랜드의 레거시 WPF 시스템을 Electron + React + NestJS로 다시 만들었습니다. 현재 호주 매장 부스에서 실제 운영 중입니다. 동훈아이텍 재직과 병행해 야간·주말 시간에 진행했습니다.",
      en: "Rebuilt an Australian photo booth brand's legacy WPF system with Electron + React + NestJS. Now running in their stores. Worked nights and weekends alongside my full-time role at Donghun I-Tech.",
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
      ko: "윈앤티켓 (WinnTicket)",
      en: "WinnTicket Co., Ltd.",
    },
    position: {
      ko: "풀스택 엔지니어 (프리랜서 · 야간/주말)",
      en: "Fullstack Engineer (Freelance · nights & weekends)",
    },
    period: "2025.11 - 2026.03",
    description: {
      ko: "공연·레저·숙박 티켓을 파는 커머스 플랫폼을 풀스택으로 개발했습니다. 쇼핑몰, 관리자 대시보드, 현장 검증 시스템까지 3개를 단일 React 앱으로 만들었습니다. 동훈아이텍 재직과 병행해 야간·주말 시간에 진행했습니다.",
      en: "Built a ticket commerce platform end to end — storefront, admin dashboard, and on-site verification as one React app. Worked nights and weekends alongside my full-time role at Donghun I-Tech.",
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
      ko: "통인익스프레스",
      en: "Tongin Express",
    },
    position: {
      ko: "프론트엔드 개발자 (프리랜서 · 야간/주말)",
      en: "Frontend Developer (Freelance · nights & weekends)",
    },
    period: "2025.03 - 2025.08",
    description: {
      ko: "이전에 근무했던 통인익스프레스에서 다시 의뢰를 받아, 오프라인 종이 계약을 아이패드 웹앱으로 옮기는 프로젝트를 단독으로 개발했습니다. 동훈아이텍 재직과 병행해 야간·주말 시간에 진행했습니다.",
      en: "Came back to Tongin Express as a contractor to move their paper contract process onto an iPad web app, building the frontend solo. Worked nights and weekends alongside my full-time role at Donghun I-Tech.",
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
      ko: "웹 퍼블리셔 (정규직)",
      en: "Web Publisher (Full-time)",
    },
    period: "2022.05 - 2022.11",
    description: {
      ko: "디자인팀에서 웹 퍼블리셔로 근무하며 홈앤무브 웹사이트 전면 개편을 맡았습니다. UI 디자인부터 마크업까지 한 사람이 담당해, 시안을 넘기고 다시 고치는 왕복 없이 작업했습니다.",
      en: "Worked as a web publisher on the design team, leading the full redesign of the Home&Move website. Handling both UI design and markup myself removed the usual handoff-and-revise loop.",
    },
    achievements: {
      ko: [
        "홈앤무브 웹사이트 전면 개편 — UI 디자인부터 마크업까지 전 과정 단독 수행",
        "디자인·퍼블리싱 일괄 담당으로 시안 전달-피드백-수정 사이클 제거",
        "Vue.js + SCSS 기반 컴포넌트 시스템 구축",
        "사내 웹사이트 기능 개발 및 유지보수",
      ],
      en: [
        "Full redesign of the Home&Move website — UI design through markup, solo",
        "Owning both design and publishing removed the handoff-feedback-revision cycle",
        "Built a component system with Vue.js + SCSS",
        "Developed and maintained internal company websites",
      ],
    },
  },
];