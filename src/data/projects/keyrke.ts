import { Project } from '../projectsData';
import image_ba0216df9afa3fbf7ece56fec0bc50ab7409d73b from 'figma:asset/ba0216df9afa3fbf7ece56fec0bc50ab7409d73b.png';

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
  image: image_ba0216df9afa3fbf7ece56fec0bc50ab7409d73b,
  year: '2023–2025',
  role: {
    ko: 'Frontend Engineer',
    en: 'Frontend Engineer'
  },
  highlights: {
    ko: [
      '프론트엔드 1인 전담 (팀 규모: 백엔드 3, 프론트 1, PM 1) — 전체 UI 설계·구현·유지보수 책임',
      '공통 컴포넌트 62종 + composable 시스템 구축 → 코드 재사용률 200% 향상, 신규 모듈 개발 속도 2배 단축',
      '다중 조건 검색 + 태그 필터 엔진 (날짜·사용자·상태·정책·장치 복합 검색) → 검색 응답 속도 30% 개선',
      '수천 건 로그·인증 기록 대시보드 — lazy-load + 가상 스크롤 렌더링 최적화로 60fps 유지',
      '트리 구조 조직도 UI — 재귀 탐색·드래그앤드롭·다중 선택 지원, 500+ 노드 안정 처리',
      'Ant Design Vue + 커스텀 차트 기반 실시간 보고서 시각화 (스토리지 사용량, 정책 준수율 등)',
      '현대모비스·현대오토에버·현대케피코 등 대기업 3곳+ 프로덕션 배포 운영 중',
    ],
    en: [
      'Sole frontend developer (team: 3 backend, 1 frontend, 1 PM) — full UI design, implementation, and maintenance',
      'Built 62 common components + composable system → 200% code reusability gain, 2x faster new module development',
      'Multi-condition search + tag filter engine (date, user, status, policy, device) → 30% faster search response',
      'Dashboard for thousands of log/auth records — lazy-load + virtual scroll optimization maintaining 60fps',
      'Tree structure org-chart UI — recursive traversal, drag-and-drop, multi-select, stable with 500+ nodes',
      'Real-time report visualization with Ant Design Vue + custom charts (storage usage, policy compliance, etc.)',
      'Production deployment at 3+ major enterprises: Hyundai Mobis, AutoEver, Kefico',
    ]
  },
  techStack: {
    frontend: ['Nuxt 3', 'Vue 3', 'TypeScript', 'Vite', 'Ant Design Vue'],
    others: ['Docker', 'GitLab CI/CD'],
  }
};
