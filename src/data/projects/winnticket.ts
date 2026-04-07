import { Project } from '../projectsData';

export const winnticket: Project = {
  id: 'winnticket',
  title: {
    ko: 'WinnTicket - 티켓 커머스 플랫폼',
    en: 'WinnTicket - Ticket Commerce Platform'
  },
  description: {
    ko: '티켓·바우처 판매부터 현장 검증까지, 멀티채널 기반의 올인원 티켓 커머스 플랫폼',
    en: 'An all-in-one multi-channel ticket commerce platform covering ticket & voucher sales to on-site verification'
  },
  fullDescription: {
    ko: '공연, 레저, 숙박 등 다양한 티켓 상품을 온라인으로 판매하고 관리할 수 있는 풀스택 티켓 커머스 플랫폼입니다. 쇼핑몰(고객용), 관리자 대시보드, 현장 관리자 시스템까지 하나의 통합 플랫폼으로 구축했습니다.\n\n채널별 가격 정책, 시즌별 요금 관리, 파트너사 할인 시스템, QR/바코드 쿠폰 발행, KCP 결제 연동, 주문 관리, 커뮤니티(공지·이벤트·FAQ·1:1문의), 배너/팝업 관리 등 실제 운영에 필요한 모든 기능을 포함합니다.\n\n역할 기반 접근 제어(RBAC)를 통해 관리자와 현장 관리자의 권한을 분리하고, 현장에서는 티켓 스캐너를 통한 실시간 입장 검증이 가능합니다. React.lazy 코드 스플리팅과 Suspense를 적용하여 초기 로딩 성능을 최적화했습니다.',
    en: 'A full-stack ticket commerce platform for selling and managing various ticket products including performances, leisure, and accommodations online. Built as a unified platform covering the shopping mall (customer-facing), admin dashboard, and field manager system.\n\nIncludes all features needed for real operations: channel-specific pricing, seasonal rate management, partner discount systems, QR/barcode coupon issuance, KCP payment integration, order management, community (notices, events, FAQ, inquiries), and banner/popup management.\n\nRole-based access control (RBAC) separates admin and field manager permissions, with real-time ticket scanning for on-site entry verification. Optimized initial loading performance with React.lazy code splitting and Suspense.'
  },
  tags: ['React', 'TypeScript', 'Spring Boot', 'PostgreSQL', 'Production'],
  image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  year: '2026',
  role: {
    ko: 'Fullstack Engineer',
    en: 'Fullstack Engineer'
  },
  highlights: {
    ko: [
      '쇼핑몰 + 관리자 + 현장관리자 3개 시스템을 단일 React 앱으로 통합 구축',
      '멀티채널 시스템 설계 - 채널별 독립적 가격 정책·할인율·상품 노출 관리',
      'KCP 결제 연동 및 전액 포인트 결제 지원 구현',
      'QR코드/바코드 기반 티켓 쿠폰 발행 및 현장 스캐너 검증 시스템 개발',
      'RBAC(역할 기반 접근 제어) 설계 - 관리자/현장관리자 권한 분리',
      'Spring Boot + MyBatis + PostgreSQL 기반 RESTful API 설계 및 구현',
      'JWT + Spring Security 기반 인증/인가 시스템 구축',
      'AWS S3 파일 업로드, Redis 세션 관리, Excel 데이터 내보내기 구현',
      'React.lazy + Suspense 코드 스플리팅으로 초기 로딩 성능 최적화',
      '시즌별 요금 관리, 상품 옵션 시스템, 파트너사 할인 관리 등 복잡한 비즈니스 로직 구현'
    ],
    en: [
      'Built 3 systems (shop, admin, field manager) as a single unified React application',
      'Multi-channel system design - independent pricing, discounts, and product exposure per channel',
      'KCP payment integration with full point payment support',
      'QR/barcode ticket coupon issuance and on-site scanner verification system',
      'RBAC design - separated admin and field manager permissions',
      'RESTful API design and implementation with Spring Boot + MyBatis + PostgreSQL',
      'JWT + Spring Security authentication/authorization system',
      'AWS S3 file uploads, Redis session management, Excel data export',
      'Initial loading optimization with React.lazy + Suspense code splitting',
      'Complex business logic: seasonal pricing, product options, partner discount management'
    ]
  },
  techStack: {
    frontend: ['React', 'TypeScript', 'Tailwind CSS', 'Radix UI', 'Recharts', 'React Router', 'Vite', 'Motion'],
    backend: ['Spring Boot', 'Java 17', 'MyBatis', 'JPA', 'Spring Security', 'JWT'],
    others: ['PostgreSQL', 'Redis', 'AWS S3', 'KCP Payment', 'Jenkins CI/CD']
  },
  links: {
    website: 'https://www.winnticket.co.kr/'
  }
};
