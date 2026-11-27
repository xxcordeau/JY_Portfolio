import { BlogPost } from '../blogData';

export const apiMismatchUsememoCrash: BlogPost = {
  id: 'api-mismatch-usememo-crash',
  title: {
    ko: 'API 응답 형식이 어긋나 터진 useMemo, undefined는 조용히 퍼져요',
    en: 'How an API Response Mismatch Crashed useMemo, and Why undefined Spreads Silently'
  },
  excerpt: {
    ko: 'API가 배열을 바로 반환하는데 response.data.content로 접근하면 undefined가 돼요. 그 undefined가 useMemo까지 흘러가 크래시를 낸 과정을 기록했어요.',
    en: 'When an API returns an array directly but you read response.data.content, you get undefined. This is how that undefined made its way into useMemo and caused a crash.'
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
  thumbnail: 'https://wdedhluxoicizxqojadx.supabase.co/storage/v1/object/public/blog-thumbnails/api-mismatch-usememo-crash.png',
  component: 'ApiMismatchMemoPost'
};
