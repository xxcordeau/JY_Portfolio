import { BlogPost } from '../blogData';

export const cssPrintLayerConflict: BlogPost = {
  id: 'css-print-layer-conflict',
  title: {
    ko: '@media print과 CSS 레이어의 충돌 — 인쇄 헤더가 사라지지 않던 이유',
    en: '@media print vs CSS Layers Conflict — Why the Print Header Wouldn\'t Hide'
  },
  excerpt: {
    ko: '@layer 안에 작성한 @media print 규칙이 왜 무시되는지, CSS 캐스케이드 레이어의 우선순위 구조를 파헤쳐봤습니다.',
    en: 'Investigating why @media print rules inside @layer get ignored, and understanding the CSS cascade layer priority structure.'
  },
  category: {
    ko: '개발',
    en: 'Development'
  },
  date: '2025-10-15',
  readTime: {
    ko: '5분',
    en: '5 min'
  },
  tags: ['@media print', 'CSS', '@layer', 'React'],
  thumbnail: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&q=80',
  component: 'CssPrintLayerPost'
};
