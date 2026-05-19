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
      ko: "시각디자인과 웹디자인을 중심으로 학습하며, UI/UX 설계와 디지털 콘텐츠 제작 능력을 길렀습니다. 디자인 감각과 사용자 경험을 기반으로 한 프론트엔드 개발 역량의 토대를 다졌습니다.",
      en: "Studied visual design and web design, developing UI/UX design and digital content creation skills. Built a foundation for frontend development capabilities based on design sensibility and user experience.",
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
      ko: "프론트엔드 개발자",
      en: "Frontend Developer",
    },
    period: "2023.08 - 현재",
    description: {
      ko: "보안 자산관리 솔루션의 프론트엔드 전반을 담당하며, 대규모 관리자 페이지와 사용자 포털 UI를 개발하고 있습니다. 해당 솔루션은 현대모비스, 현대오토에버, 현대케피코 등 주요 그룹사에 도입되어 운용 중입니다.",
      en: "Leading comprehensive frontend development for security asset management solution, developing large-scale admin pages and user portal UI. The solution has been deployed and is being operated at major group companies including Hyundai Mobis, Hyundai AutoEver, and Hyundai Kefico.",
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