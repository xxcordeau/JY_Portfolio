import { BlogPost } from '../blogData';

export const tableComponentStructuring: BlogPost = {
  id: 'table-component-structuring',
  title: {
    ko: '공통 테이블 컴포넌트 구조화 경험',
    en: 'Common Table Component Structuring Experience'
  },
  excerpt: {
    ko: '페이지네이션, 정렬, URL 동기화가 필요한 테이블들을 공통 컴포넌트로 묶으면서 데이터 흐름을 어떻게 통제했는지 정리했어요.',
    en: 'Notes on how I controlled data flow while turning tables that needed pagination, sorting, and URL sync into one common component.'
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
  thumbnail: 'https://wdedhluxoicizxqojadx.supabase.co/storage/v1/object/public/blog-thumbnails/table-component-structuring.png',
  component: 'TableComponentPost'
};
