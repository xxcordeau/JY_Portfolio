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
  { name: "Vue 3", category: "frontend" },
  { name: "React", category: "frontend" },
  { name: "TypeScript", category: "frontend" },
  { name: "JavaScript", category: "frontend" },
  { name: "Redux", category: "frontend" },

  // Backend
  { name: "Node.js", category: "backend" },
  { name: "Nest.js", category: "backend" },
  { name: "PostgreSQL", category: "backend" },

  // Design
  { name: "Figma", category: "design" },
  { name: "Illustrator", category: "design" },
  { name: "Photoshop", category: "design" },

  // Other
  { name: "Git", category: "other" },
  { name: "Swagger / Postman", category: "other" },
  { name: "Jira / Notion / Slack", category: "other" },
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
        "Vue 3, Nuxt 3 기반의 SPA 구조 설계 및 구현",
        "공통 컴포넌트 및 디자인 시스템 구축으로 코드 일관성과 생산성 향상",
        "대시보드, 정책관리, 로그·인증 기록 등 복합 데이터 테이블 UI 개발",
        "런타임 환경 대응형 API 모듈 및 공통 composable 구조 개선",
      ],
      en: [
        "Designed and implemented SPA structure based on Vue 3 and Nuxt 3",
        "Enhanced code consistency and productivity by building common components and design system",
        "Developed complex data table UI for dashboard, policy management, logs, and authentication records",
        "Improved runtime environment-responsive API modules and common composable structure",
      ],
    },
  },
  {
    company: {
      ko: "통인익스프레스",
      en: "Tongin Express",
    },
    position: {
      ko: "프론트엔드 개발자 (사내 근무 / 프리랜서)",
      en: "Frontend Developer (In-house / Freelancer)",
    },
    period: "2022.07 - 2023.07",
    description: {
      ko: "처음에는 사내 웹 퍼블리셔로 근무하였고, 이후 외주 프리랜서로 전환하여 계약관리 시스템과 물류 서비스 웹 페이지 개발을 지속적으로 담당했습니다.",
      en: "Initially worked as an in-house web publisher, then transitioned to freelance to continue developing contract management systems and logistics service web pages.",
    },
    achievements: {
      ko: [
        "계약 등록·관리·서명 프로세스 페이지 개발",
        "반응형 웹 구조 설계 및 관리자 페이지 UI 구현",
        "모바일·태블릿 환경 최적화 및 사용자 경험 개선",
        "Vue.js, SCSS, JavaScript를 활용한 컴포넌트 기반 UI 구축",
      ],
      en: [
        "Developed contract registration, management, and signature process pages",
        "Designed responsive web structure and implemented admin page UI",
        "Optimized mobile and tablet environments and improved user experience",
        "Built component-based UI using Vue.js, SCSS, and JavaScript",
      ],
    },
  },
];