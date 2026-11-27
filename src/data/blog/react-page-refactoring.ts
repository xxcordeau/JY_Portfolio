import { BlogPost } from '../blogData';

export const reactPageRefactoring: BlogPost = {
  id: 'react-page-refactoring',
  title: {
    ko: 'React 페이지 구조 리팩토링과 코드 스플리팅 적용 경험',
    en: 'React Page Structure Refactoring and Code Splitting Experience'
  },
  excerpt: {
    ko: '페이지 파일 73개가 뒤섞여 있던 구조를 도메인 기준으로 다시 나누고, React.lazy와 Suspense로 초기 번들을 79% 줄인 과정이에요.',
    en: 'I reorganized 73 mixed page files by domain and cut the initial bundle by 79% with React.lazy and Suspense.'
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
  thumbnail: 'https://wdedhluxoicizxqojadx.supabase.co/storage/v1/object/public/blog-thumbnails/react-page-refactoring.png',
  component: 'ReactPageRefactoringPost'
};
