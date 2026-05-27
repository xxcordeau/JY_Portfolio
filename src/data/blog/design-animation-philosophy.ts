import { BlogPost } from '../blogData';

export const designAnimationPhilosophy: BlogPost = {
  id: 'design-animation-philosophy',
  title: {
    ko: '애니메이션을 넣기 전에 물어봐야 할 한 가지 — \'이걸 빼면 뭘 잃는가\'',
    en: 'One Question Before Adding Animation — What Do We Lose Without It?'
  },
  excerpt: {
    ko: '포트폴리오 히어로 파티클 애니메이션을 만들면서 고민한 인터랙션 철학과 기능적/표현적 애니메이션의 차이를 정리했어요.',
    en: 'Sharing the interaction philosophy behind the portfolio hero particle animation and the difference between functional and expressive animation.'
  },
  category: {
    ko: '디자인',
    en: 'Design'
  },
  date: '2026-05-10',
  readTime: {
    ko: '9분',
    en: '9 min'
  },
  tags: ['Animation', 'UX', 'Interaction Design', 'Performance', 'Canvas'],
  thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80',
  component: 'DesignAnimationPost'
};
