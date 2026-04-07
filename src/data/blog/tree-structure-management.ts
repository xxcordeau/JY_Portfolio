import { BlogPost } from '../blogData';

export const treeStructureManagement: BlogPost = {
  id: 'tree-structure-management',
  title: {
    ko: '트리 구조 기반 사용자/자산 관리 화면 구현 경험',
    en: 'Tree-Based User/Asset Management UI Implementation Experience'
  },
  excerpt: {
    ko: 'Lazy-loading, 자동 확장, 양방향 동기화가 필요한 복잡한 트리 UI를 구현하며 배운 상태 관리 전략을 공유합니다.',
    en: 'Sharing state management strategies learned while implementing complex tree UI with Lazy-loading, auto-expansion, and bi-directional synchronization.'
  },
  category: {
    ko: '개발',
    en: 'Development'
  },
  date: '2024-10-21',
  readTime: {
    ko: '8분',
    en: '8 min'
  },
  tags: ['Vue', 'State Management', 'Tree UI', 'Performance'],
  thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
  component: 'TreeManagementPost'
};
