import { BlogPost } from '../blogData';

export const hiddenDivReactRendering: BlogPost = {
  id: 'hidden-div-react-rendering',
  title: {
    ko: '숨겨진 div의 역습, React에서 hidden 클래스는 조건부 렌더링이 아니에요',
    en: 'The Hidden Div Strikes Back, or Why CSS hidden Isn\'t Conditional Rendering in React'
  },
  excerpt: {
    ko: 'className="hidden"으로 숨긴 컴포넌트가 여전히 JS를 실행하고 있었어요. display:none과 조건부 렌더링이 어떻게 다른지 정리했어요.',
    en: 'A component hidden with className="hidden" was still running JavaScript. Here is how display:none differs from conditional rendering.'
  },
  category: {
    ko: '개발',
    en: 'Development'
  },
  date: '2025-11-20',
  readTime: {
    ko: '4분',
    en: '4 min'
  },
  tags: ['React', 'JSX', '렌더링'],
  thumbnail: 'https://wdedhluxoicizxqojadx.supabase.co/storage/v1/object/public/blog-thumbnails/hidden-div-react-rendering.png',
  component: 'HiddenDivPost'
};
