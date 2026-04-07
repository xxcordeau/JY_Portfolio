import { Project } from '../projectsData';

export const tonginExpress: Project = {
  id: 'tongin-express',
  title: {
    ko: '통인익스프레스 계약 관리 시스템',
    en: 'Tongin Express Contract Management System'
  },
  description: {
    ko: '아이패드·태블릿 환경에 최적화된 계약 등록·전자서명·진행 관리 솔루션',
    en: 'Contract registration, e-signature, and progress management solution optimized for iPad and tablet environments'
  },
  fullDescription: {
    ko: '이사 전문 브랜드 통인익스프레스의 계약 관리 프로세스를 디지털화한 아이패드·태블릿 PC 전용 웹 애플리케이션입니다. 현장 영업사원이 고객 방문 시 태블릿으로 바로 계약을 등록하고, 문자 전송을 통해 계약서 서명을 진행할 수 있도록 설계되었습니다.\n\n계약 등록, 견적 관리, 계약서 작성 및 전송, 고객 서명 완료, 진행 상태 관리까지 모든 과정을 실시간으로 연동하며, 관리자 페이지에서는 계약 내역 조회, 계약 진행 현황 모니터링, 서명 로그 추적 등을 지원합니다.\n\n이 시스템을 통해 오프라인 중심이던 계약 절차가 완전히 디지털화되어 업무 속도와 고객 응답률이 대폭 향상되었습니다.\n\n※ 이 애플리케이션은 태블릿 환경에 최적화되어 있으므로 모바일 모드로 확인해야 합니다.',
    en: 'A web application exclusively for iPad and tablet PCs that digitizes the contract management process for Tongin Express, a professional moving service brand. Designed to allow field sales representatives to register contracts directly on tablets during customer visits and proceed with contract signatures through text message transmission.\n\nAll processes are synchronized in real-time, including contract registration, quotation management, contract creation and transmission, customer signature completion, and progress status management. The admin page supports contract history inquiries, contract progress monitoring, and signature log tracking.\n\nThrough this system, the previously offline-centered contract process has been completely digitized, significantly improving work speed and customer response rates.\n\n※ This application is optimized for tablet environments and should be viewed in mobile mode.'
  },
  tags: ['React', 'TypeScript', 'Contract Management', 'E-Signature'],
  image: 'https://images.unsplash.com/photo-1670852714979-f73d21652a83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YWJsZXQlMjBjb250cmFjdCUyMGRpZ2l0YWwlMjBzaWduYXR1cmV8ZW58MXx8fHwxNzYxMTM0Mzc4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  year: '2024',
  role: {
    ko: 'Frontend Engineer',
    en: 'Frontend Engineer'
  },
  highlights: {
    ko: [
      '태블릿 전용 반응형 UI 설계 및 최적화 - 아이패드 해상도 기준으로 터치 중심 UX 구성',
      '전자서명 프로세스 구현 - 계약서 링크를 문자로 발송 → 고객 서명 완료 시 실시간 상태 업데이트',
      '계약 등록 및 진행 관리 모듈 개발 - 계약 생성, 수정, 취소, 상태 변경 로직 구현',
      '관리자 페이지 구축 - 계약 현황, 통계, 서명 로그 관리 기능 추가',
      '상태 관리 및 데이터 구조 설계 - React + TypeScript 기반으로 명확한 상태 흐름 및 API 모듈화',
      '현장 계약 처리 속도 약 60% 단축',
      '서명 완료율 35% 증가',
      '관리자 업무 효율성 및 실시간 추적성 강화'
    ],
    en: [
      'Tablet-optimized responsive UI design and optimization - Touch-centric UX based on iPad resolution',
      'E-signature process implementation - Send contract links via text → Real-time status updates upon customer signature completion',
      'Contract registration and progress management module development - Implemented contract creation, modification, cancellation, and status change logic',
      'Admin page construction - Added contract status, statistics, and signature log management features',
      'State management and data structure design - Clear state flow and API modularization based on React + TypeScript',
      'Reduced on-site contract processing time by approximately 60%',
      'Increased signature completion rate by 35%',
      'Enhanced administrator work efficiency and real-time tracking capabilities'
    ]
  },
  techStack: {
    frontend: ['React', 'TypeScript', 'React Router']
  },
  links: {
    demo: 'https://hash-scout-17369249.figma.site'
  }
};
