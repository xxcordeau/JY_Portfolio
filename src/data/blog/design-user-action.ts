import { BlogPost } from '../blogData';

export const designUserAction: BlogPost = {
  id: 'design-user-action',
  title: {
    ko: '사용자는 \'예쁜 화면\'이 아니라 \'다음에 뭘 해야 하는지\'를 원해요',
    en: 'Users Want to Know What to Do Next, Not Just See Pretty Screens'
  },
  excerpt: {
    ko: '시각적으로 만족스러운 상품 페이지에서 구매 버튼을 못 찾는 문제를 겪고 나서, 화면 설계의 첫 질문을 바꾼 경험을 공유합니다.',
    en: 'After users couldn\'t find the buy button on a visually polished product page, I changed the first question I ask when designing screens.'
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
  thumbnail: 'https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?w=800&q=80',
  component: 'DesignUserActionPost'
};
