import { BlogPost } from '../blogData';

export const commonUtilsComposable: BlogPost = {
  id: 'common-utils-composable',
  title: {
    ko: '공통 유틸/컴포저블 분리 사례',
    en: 'Common Utility/Composable Separation Case Study'
  },
  excerpt: {
    ko: 'i18n 처리, 권한 체크, 파일 포맷, 아이콘 스타일 등 중복 로직을 명시적 함수 호출 가능한 유틸/컴포저블로 분리한 경험을 공유합니다.',
    en: 'Sharing experience of separating duplicate logic like i18n handling, permission checks, file formats, and icon styles into explicitly callable utils/composables.'
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
  thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
  component: 'CommonUtilsPost'
};
