import { BlogPost } from '../blogData';

export const dashboardWidgetSystem: BlogPost = {
  id: 'dashboard-widget-system',
  title: {
    ko: '모듈형 대시보드 위젯 시스템',
    en: 'Modular Dashboard Widget System'
  },
  excerpt: {
    ko: '여러 독립 모듈이 한 화면에 모이는 대시보드를 메타 데이터 기반 동적 렌더링과 공통 상태 관리로 정리한 과정이에요.',
    en: 'How I restructured a dashboard full of independent modules around metadata-driven dynamic rendering and shared state handling.'
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
  thumbnail: 'https://wdedhluxoicizxqojadx.supabase.co/storage/v1/object/public/blog-thumbnails/dashboard-widget-system.png',
  component: 'DashboardWidgetPost'
};
