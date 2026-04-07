import { Project } from '../projectsData';
import image_ba0216df9afa3fbf7ece56fec0bc50ab7409d73b from 'figma:asset/ba0216df9afa3fbf7ece56fec0bc50ab7409d73b.png';

export const keyrke: Project = {
  id: 'keyrke',
  title: {
    ko: '보안 자산관리 플랫폼 Keyrke',
    en: 'Security Asset Management Platform Keyrke'
  },
  description: {
    ko: '보안 자산관리 솔루션의 프론트엔드 개발 전반을 담당',
    en: 'Led comprehensive frontend development for security asset management solution'
  },
  fullDescription: {
    ko: '현대 오토에버, 현대 모비스, 현대 케피코 등 주요 기업에 도입된 보안 자산관리 솔루션의 프론트엔드 개발 전반을 담당했습니다. 이 플랫폼은 조직 내 단말기의 자산 현황, 보안 정책, 스토리지 사용량, 원드라이브 동기화, 하드웨어 관리, 보고서 생성 등 기업 정보보호 체계를 통합적으로 관리할 수 있는 시스템입니다.\n\nNuxt 3 및 TypeScript 기반으로 프론트엔드 아키텍처를 설계하고, 공통 컴포넌트 시스템과 다중 조건 검색 엔진, 트리 구조 탐색 UI를 구축했습니다. 또한, 대규모 데이터 렌더링과 비동기 API 호출 성능을 최적화하여 수천 건의 로그 데이터도 안정적으로 처리할 수 있는 구조를 완성했습니다.',
    en: 'Led comprehensive frontend development for a security asset management solution deployed at major companies including Hyundai AutoEver, Hyundai Mobis, and Hyundai Kefico. This platform is an integrated system for managing enterprise information security framework, including asset status, security policies, storage usage, OneDrive synchronization, hardware management, and report generation.\n\nDesigned frontend architecture based on Nuxt 3 and TypeScript, built common component system, multi-condition search engine, and tree structure navigation UI. Additionally, optimized large-scale data rendering and asynchronous API call performance to create a structure capable of stably processing thousands of log data entries.'
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
      'Nuxt 3 기반 대시보드 및 레이아웃 아키텍처 설계 - 모듈별로 확장 가능한 폴더 구조와 공통 컴포저블을 정의',
      '공통 컴포넌트 시스템 개발 - 테이블, 폼, 트리뷰, 드롭다운 등 UI 전반을 모듈화하여 코드 재사용률 200% 향상',
      '다중 조건 검색 및 태그 필터 시스템 구현 - 날짜, 사용자, 상태, 정책, 장치 유형 등 복합 조건 검색을 지원하고 상태 동기화 유지',
      '스토리지·하드웨어·원드라이브 관리 UI 구축 - 대규모 데이터를 가볍게 처리할 수 있는 lazy-load 기반 구조로 렌더링 성능 최적화',
      '보고서 및 로그 시각화 기능 - Ant Design Vue Chart 및 커스텀 그래프 컴포넌트를 이용해 실시간 보고서 UI 개발',
      '공통화 구조 도입으로 신규 모듈 개발 속도 2배 향상',
      '필터 구조 개선으로 검색 응답 속도 30% 단축',
      '유지보수성 및 코드 일관성 강화로 프론트엔드 전면 책임 운영 가능'
    ],
    en: [
      'Designed Nuxt 3-based dashboard and layout architecture - Defined scalable folder structure and common composables per module',
      'Developed common component system - Modularized UI including tables, forms, tree views, dropdowns, improving code reusability by 200%',
      'Implemented multi-condition search and tag filter system - Supports complex searches by date, user, status, policy, device type while maintaining state synchronization',
      'Built storage, hardware, and OneDrive management UI - Optimized rendering performance with lazy-load based structure for handling large-scale data',
      'Report and log visualization features - Developed real-time report UI using Ant Design Vue Chart and custom graph components',
      'Doubled new module development speed through common structure implementation',
      'Reduced search response time by 30% through filter structure improvements',
      'Enhanced maintainability and code consistency enabling full frontend responsibility operations'
    ]
  },
  techStack: {
    frontend: ['Nuxt 3', 'Vue 3', 'TypeScript', 'Vite']
  }
};
