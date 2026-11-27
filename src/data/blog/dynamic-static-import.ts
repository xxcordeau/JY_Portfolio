import { BlogPost } from '../blogData';

export const dynamicStaticImport: BlogPost = {
  id: 'dynamic-static-import',
  title: {
    ko: 'React.lazy + Suspense 적용 시 마주친 dynamic/static import 혼용 문제',
    en: 'Dynamic vs Static Import Mixing Issues with React.lazy + Suspense'
  },
  excerpt: {
    ko: 'React.lazy로 코드 스플리팅을 적용한 뒤 Vite 빌드에서 나온 dynamic/static import 혼용 경고의 원인과, 어떤 모듈을 어떻게 나눴는지 정리했어요.',
    en: 'Why Vite warned about mixed dynamic and static imports after adding React.lazy code splitting, and how I decided which modules to split.'
  },
  category: {
    ko: '개발',
    en: 'Development'
  },
  date: '2026-04-07',
  readTime: {
    ko: '6분',
    en: '6 min'
  },
  tags: ['React', 'Vite', 'Code Splitting', 'Bundling'],
  thumbnail: '/blog-thumbs/dynamic-static-import.png',
  component: 'DynamicStaticImportPost'
};
