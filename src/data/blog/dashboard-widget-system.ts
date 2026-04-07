import { BlogPost } from '../blogData';

export const dashboardWidgetSystem: BlogPost = {
  id: 'dashboard-widget-system',
  title: {
    ko: '모듈형 대시보드 위젯 시스템',
    en: 'Modular Dashboard Widget System'
  },
  excerpt: {
    ko: '여러 독립 모듈이 공존하는 대시보드를 메타 데이터 기반 동적 렌더링과 공통 상태 관리로 구조화한 경험을 공유합니다.',
    en: 'Sharing experience of structuring a dashboard with multiple independent modules through metadata-based dynamic rendering and common state management.'
  },
  category: {
    ko: '개발',
    en: 'Development'
  },
  date: '2024-10-21',
  readTime: {
    ko: '7분',
    en: '7 min'
  },
  tags: ['Vue', 'Dashboard', 'Dynamic Components', 'Modular Design'],
  thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
  component: 'DashboardWidgetPost'
};
