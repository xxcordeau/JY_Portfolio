import { BlogPost } from '../blogData';

export const filterSystemImplementation: BlogPost = {
  id: 'filter-system-implementation',
  title: {
    ko: '검색 필터 시스템 구현 경험',
    en: 'Search Filter System Implementation Experience'
  },
  excerpt: {
    ko: '다중 조건 조합, 태그 시각화, 상태 유지가 필요한 복잡한 필터 시스템을 구현하며 배운 독립형 상태 관리 전략을 공유합니다.',
    en: 'Sharing independent state management strategies learned while implementing a complex filter system with multiple conditions, tag visualization, and state persistence.'
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
  thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
  component: 'FilterSystemPost'
};
