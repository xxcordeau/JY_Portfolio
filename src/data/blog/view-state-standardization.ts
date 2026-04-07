import { BlogPost } from '../blogData';

export const viewStateStandardization: BlogPost = {
  id: 'view-state-standardization',
  title: {
    ko: '에러/로딩/빈 상태 UI의 전역 표준화',
    en: 'Global Standardization of Error/Loading/Empty State UI'
  },
  excerpt: {
    ko: '모든 화면에서 일관된 로딩/에러/빈 상태 경험을 제공하기 위한 전역 컴포넌트와 composable 패턴 구축 사례를 공유합니다.',
    en: 'Sharing a case of building global components and composable patterns to provide consistent loading/error/empty state experiences across all screens.'
  },
  category: {
    ko: '개발',
    en: 'Development'
  },
  date: '2024-10-21',
  readTime: {
    ko: '10분',
    en: '10 min'
  },
  tags: ['Vue', 'UX', 'State Management', 'Error Handling'],
  thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
  component: 'ViewStatePost'
};
