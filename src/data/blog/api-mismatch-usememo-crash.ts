import { BlogPost } from '../blogData';

export const apiMismatchUsememoCrash: BlogPost = {
  id: 'api-mismatch-usememo-crash',
  title: {
    ko: 'API 응답 형식 불일치와 useMemo 크래시 — undefined는 조용히 퍼져요',
    en: 'API Response Mismatch and useMemo Crash — undefined Spreads Silently'
  },
  excerpt: {
    ko: 'API가 배열을 바로 반환하는데 response.data.content로 접근하면 undefined가 됩니다. 그 undefined가 useMemo까지 전파되어 크래시를 일으킨 과정을 기록했습니다.',
    en: 'When an API returns an array directly but you access response.data.content, you get undefined. Documenting how that undefined propagated into useMemo and caused a crash.'
  },
  category: {
    ko: '개발',
    en: 'Development'
  },
  date: '2025-12-10',
  readTime: {
    ko: '6분',
    en: '6 min'
  },
  tags: ['React', 'TypeScript', 'useMemo', '디버깅'],
  thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80',
  component: 'ApiMismatchMemoPost'
};
