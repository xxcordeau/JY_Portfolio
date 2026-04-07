import { BlogPost } from '../blogData';

export const tableComponentStructuring: BlogPost = {
  id: 'table-component-structuring',
  title: {
    ko: '공통 테이블 컴포넌트 구조화 경험',
    en: 'Common Table Component Structuring Experience'
  },
  excerpt: {
    ko: '페이지네이션, 정렬, URL 동기화가 필요한 복잡한 테이블 시스템을 공통 컴포넌트로 구조화하며 배운 데이터 흐름 제어 전략을 공유합니다.',
    en: 'Sharing data flow control strategies learned while structuring a complex table system requiring pagination, sorting, and URL synchronization into a common component.'
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
  tags: ['Vue', 'Composable', 'Table UI', 'State Management'],
  thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
  component: 'TableComponentPost'
};
