import { BlogPost } from '../blogData';

export const reactPageRefactoring: BlogPost = {
  id: 'react-page-refactoring',
  title: {
    ko: 'React 페이지 구조 리팩토링과 코드 스플리팅 적용 경험',
    en: 'React Page Structure Refactoring and Code Splitting Experience'
  },
  excerpt: {
    ko: '73개의 페이지 파일이 뒤섞인 구조를 도메인 기반으로 재편하고, React.lazy + Suspense로 초기 번들을 79% 줄인 경험을 공유합니다.',
    en: 'Reorganized 73 mixed page files into domain-based structure and reduced initial bundle by 79% with React.lazy + Suspense.'
  },
  category: {
    ko: '개발',
    en: 'Development'
  },
  date: '2026-04-07',
  readTime: {
    ko: '8분',
    en: '8 min'
  },
  tags: ['React', 'TypeScript', 'Vite', 'Code Splitting', 'Refactoring'],
  thumbnail: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=800&q=80',
  component: 'ReactPageRefactoringPost'
};
