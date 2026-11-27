import { BlogPost } from '../blogData';

export const iconSystemImplementation: BlogPost = {
  id: 'icon-system-implementation',
  title: {
    ko: '전역 아이콘 시스템 구축 경험',
    en: 'Global Icon System Implementation Experience'
  },
  excerpt: {
    ko: '수십 개 화면에 걸친 아이콘의 색상, 크기, 상태를 한곳에서 관리하려고 메타데이터 기반 전역 아이콘 시스템을 만든 경험이에요.',
    en: 'How I built a metadata-based global icon system to keep icon colors, sizes, and states consistent across dozens of screens.'
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
  tags: ['Vue', 'Design System', 'Icons', 'UI Consistency'],
  thumbnail: 'https://wdedhluxoicizxqojadx.supabase.co/storage/v1/object/public/blog-thumbnails/icon-system-implementation.png',
  component: 'IconSystemPost'
};
