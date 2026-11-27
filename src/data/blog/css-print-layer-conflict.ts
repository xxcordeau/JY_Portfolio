import { BlogPost } from '../blogData';

export const cssPrintLayerConflict: BlogPost = {
  id: 'css-print-layer-conflict',
  title: {
    ko: '인쇄할 때 헤더가 사라지지 않던 이유, @media print와 CSS 레이어의 충돌',
    en: 'Why the Print Header Wouldn\'t Hide: @media print vs CSS Layers'
  },
  excerpt: {
    ko: '@layer 안에 쓴 @media print 규칙이 왜 무시되는지, CSS 캐스케이드 레이어의 우선순위 구조를 따라가며 정리했어요.',
    en: 'Why @media print rules inside @layer get ignored, and how CSS cascade layer priority actually works.'
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
  thumbnail: 'https://wdedhluxoicizxqojadx.supabase.co/storage/v1/object/public/blog-thumbnails/css-print-layer-conflict.png',
  component: 'CssPrintLayerPost'
};
