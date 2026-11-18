import { Project } from '../projectsData';

export const keyrke: Project = {
  id: 'keyrke',
  title: {
    ko: '보안 자산관리 플랫폼 Keyrke',
    en: 'Security Asset Management Platform Keyrke'
  },
  description: {
    ko: '보안 자산관리 솔루션 Keyrke 프론트엔드 1인 개발',
    en: 'Solo frontend development for Keyrke, a security asset management solution'
  },
  fullDescription: {
    ko: '현대 오토에버, 현대 모비스, 현대 케피코 등에 납품된 보안 자산관리 솔루션 Keyrke의 프론트엔드를 혼자 담당했습니다. 단말기 자산 현황, 보안 정책, 스토리지, 원드라이브 동기화, 하드웨어 관리, 보고서까지 — 기업 보안 관리에 필요한 기능을 한 플랫폼에서 다루는 시스템입니다.\n\nNuxt 3 + TypeScript로 프론트엔드 구조를 설계하고, 공통 컴포넌트 62종과 다중 조건 검색 엔진, 트리 구조 조직도 UI를 만들었습니다. 수천 건 로그 데이터도 버벅임 없이 처리할 수 있도록 렌더링을 최적화했습니다.',
    en: 'Solo frontend developer on Keyrke, a security asset management solution deployed at Hyundai AutoEver, Hyundai Mobis, and Hyundai Kefico. The platform covers asset tracking, security policies, storage monitoring, OneDrive sync, hardware management, and reporting — everything an enterprise needs to manage security in one place.\n\nDesigned the frontend with Nuxt 3 and TypeScript. Built 62 shared components, a multi-condition search engine, and a tree-based org navigation UI. Optimized rendering so it handles thousands of log entries without lag.'
  },
  tags: ['Nuxt 3', 'Vue 3', 'TypeScript', 'Enterprise'],
  image: '/images/keyrke-cover.png',
  year: '2023–2025',
  role: {
    ko: 'Frontend Engineer',
    en: 'Frontend Engineer'
  },
  highlights: {
    ko: [
      '프론트엔드 1인 전담 (팀: 백엔드 3, 프론트 1, PM 1), Nuxt 3 + TypeScript 기반 전체 UI 설계·구현·유지보수',
      '테이블·폼·트리·드롭다운 등 공통 컴포넌트 62종과 composable 구축',
      '날짜·사용자·상태·정책·장치 조건을 조합하는 다중 조건 검색과 태그 필터 구현',
      '수천 건 로그·인증 기록 테이블에 lazy-load와 가상 스크롤 적용',
      '조직도 트리 UI: 재귀 탐색·드래그앤드롭·다중 선택, 노드 500개 이상 처리',
      'Ant Design Vue와 커스텀 차트로 보고서 시각화 (스토리지 사용량, 정책 준수율 등)',
      '현대모비스·현대오토에버·현대케피코 납품, 프로덕션 운영 중',
    ],
    en: [
      'Sole frontend developer (team: 3 backend, 1 frontend, 1 PM), owning the whole Nuxt 3 + TypeScript UI',
      'Built 62 common components (tables, forms, trees, dropdowns) and shared composables',
      'Multi-condition search and tag filters combining date, user, status, policy, and device',
      'Lazy-load and virtual scrolling for log and auth tables with thousands of rows',
      'Org-chart tree UI with recursive traversal, drag-and-drop, and multi-select for 500+ nodes',
      'Report visualization with Ant Design Vue and custom charts (storage usage, policy compliance)',
      'Delivered to and running in production at Hyundai Mobis, Hyundai AutoEver, and Hyundai Kefico',
    ]
  },
  techStack: {
    frontend: ['Nuxt 3', 'Vue 3', 'TypeScript', 'Vite', 'Ant Design Vue'],
    others: ['Docker', 'GitLab CI/CD'],
  }
};
