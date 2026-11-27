import { BlogPost } from '../blogData';

export const commonUtilsComposable: BlogPost = {
  id: 'common-utils-composable',
  title: {
    ko: '공통 유틸/컴포저블 분리 사례',
    en: 'Common Utility/Composable Separation Case Study'
  },
  excerpt: {
    ko: 'i18n 처리, 권한 체크, 파일 포맷, 아이콘 스타일처럼 화면마다 중복되던 로직을 명시적으로 호출하는 유틸/컴포저블로 분리한 기록이에요.',
    en: 'How I pulled duplicated logic (i18n handling, permission checks, file formats, icon styles) out of individual screens into explicitly called utils and composables.'
  },
  category: {
    ko: '개발',
    en: 'Development'
  },
  date: '2024-10-21',
  readTime: {
    ko: '9분',
    en: '9 min'
  },
  tags: ['Vue', 'Composable', 'Utils', 'Code Quality'],
  thumbnail: 'https://wdedhluxoicizxqojadx.supabase.co/storage/v1/object/public/blog-thumbnails/common-utils-composable.png',
  component: 'CommonUtilsPost'
};
