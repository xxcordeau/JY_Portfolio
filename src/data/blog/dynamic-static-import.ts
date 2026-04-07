import { BlogPost } from '../blogData';

export const dynamicStaticImport: BlogPost = {
  id: 'dynamic-static-import',
  title: {
    ko: 'React.lazy + Suspense 적용 시 마주친 dynamic/static import 혼용 문제',
    en: 'Dynamic vs Static Import Mixing Issues with React.lazy + Suspense'
  },
  excerpt: {
    ko: 'React.lazy 코드 스플리팅 적용 후 Vite 빌드에서 발생한 dynamic/static import 혼용 경고의 원인과 해결 과정을 공유합니다.',
    en: 'Sharing the root cause and resolution of dynamic/static import mixing warnings in Vite builds after applying React.lazy code splitting.'
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
  thumbnail: 'https://images.unsplash.com/photo-1551033406-611cf9a28f67?w=800&q=80',
  component: 'DynamicStaticImportPost'
};
