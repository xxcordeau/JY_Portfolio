import { BlogPost } from '../blogData';

export const designWhitespace: BlogPost = {
  id: 'design-whitespace',
  title: {
    ko: '여백이 두려웠던 시절, 빈 공간은 비어 있는 게 아니었어요',
    en: 'I Used to Be Afraid of Whitespace. Empty Space Isn\'t Really Empty'
  },
  excerpt: {
    ko: '화면에 빈 공간이 보이면 불안했던 때가 있었어요. 여백을 \'구분선 없는 구분선\'으로 보게 된 과정을 적었어요.',
    en: 'Blank space on screen used to make me anxious. This is how I came to see whitespace as an invisible divider.'
  },
  category: {
    ko: '디자인',
    en: 'Design'
  },
  date: '2026-05-20',
  readTime: {
    ko: '7분',
    en: '7 min'
  },
  tags: ['UI Design', 'Whitespace', 'Layout', 'UX'],
  thumbnail: 'https://wdedhluxoicizxqojadx.supabase.co/storage/v1/object/public/blog-thumbnails/design-whitespace.png',
  component: 'DesignWhitespacePost'
};
