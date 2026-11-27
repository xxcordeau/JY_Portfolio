import { BlogPost } from '../blogData';

export const treeStructureManagement: BlogPost = {
  id: 'tree-structure-management',
  title: {
    ko: '트리 구조 기반 사용자/자산 관리 화면 구현 경험',
    en: 'Tree-Based User/Asset Management UI Implementation Experience'
  },
  excerpt: {
    ko: 'Lazy-loading, 자동 확장, 양방향 동기화가 얽힌 트리 UI를 만들면서 노드 상태를 어떻게 나눠 관리했는지 정리했어요.',
    en: 'Notes from building a tree UI that needed lazy-loading, auto-expansion, and two-way sync, and how I split state per node to keep it under control.'
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
  thumbnail: 'https://wdedhluxoicizxqojadx.supabase.co/storage/v1/object/public/blog-thumbnails/tree-structure-management.png',
  component: 'TreeManagementPost'
};
