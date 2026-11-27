import { BlogPost } from '../blogData';

export const designUserAction: BlogPost = {
  id: 'design-user-action',
  title: {
    ko: '사용자는 \'예쁜 화면\'이 아니라 \'다음에 뭘 해야 하는지\'를 원해요',
    en: 'Users Want to Know What to Do Next, Not Just See Pretty Screens'
  },
  excerpt: {
    ko: '보기엔 만족스러웠던 상품 페이지에서 사용자들이 구매 버튼을 못 찾는 걸 보고, 화면을 설계할 때 처음 던지는 질문을 바꿨어요.',
    en: 'After users struggled to find the buy button on a product page I was happy with visually, I changed the first question I ask when designing a screen.'
  },
  category: {
    ko: '디자인',
    en: 'Design'
  },
  date: '2026-04-28',
  readTime: {
    ko: '7분',
    en: '7 min'
  },
  tags: ['UX', 'CTA', 'User Behavior', 'Conversion'],
  thumbnail: 'https://wdedhluxoicizxqojadx.supabase.co/storage/v1/object/public/blog-thumbnails/design-user-action.png',
  component: 'DesignUserActionPost'
};
