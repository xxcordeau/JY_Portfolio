import { BlogPost } from '../blogData';

export const viewStateStandardization: BlogPost = {
  id: 'view-state-standardization',
  title: {
    ko: '에러/로딩/빈 상태 UI의 전역 표준화',
    en: 'Global Standardization of Error/Loading/Empty State UI'
  },
  excerpt: {
    ko: '모든 화면에서 로딩, 에러, 빈 상태를 같은 방식으로 보여주려고 전역 컴포넌트와 composable 패턴을 만든 과정을 정리했어요.',
    en: 'How I built global components and a composable pattern so every screen handles loading, error, and empty states the same way.'
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
  thumbnail: 'https://wdedhluxoicizxqojadx.supabase.co/storage/v1/object/public/blog-thumbnails/view-state-standardization.png',
  component: 'ViewStatePost'
};
