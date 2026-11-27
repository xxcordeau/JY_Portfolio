import { BlogPost } from '../blogData';

export const filterSystemImplementation: BlogPost = {
  id: 'filter-system-implementation',
  title: {
    ko: '검색 필터 시스템 구현 경험',
    en: 'Search Filter System Implementation Experience'
  },
  excerpt: {
    ko: '다중 조건 조합, 태그 시각화, 상태 유지가 필요한 필터 시스템을 만들면서 필터마다 상태를 따로 관리하도록 바꾼 과정을 정리했어요.',
    en: 'Building a filter system with combined conditions, tag display, and persisted state, and why I ended up managing each filter\'s state on its own.'
  },
  category: {
    ko: '개발',
    en: 'Development'
  },
  date: '2024-10-21',
  readTime: {
    ko: '6분',
    en: '6 min'
  },
  tags: ['Vue', 'State Management', 'Pinia', 'Filter UI'],
  thumbnail: 'https://wdedhluxoicizxqojadx.supabase.co/storage/v1/object/public/blog-thumbnails/filter-system-implementation.png',
  component: 'FilterSystemPost'
};
