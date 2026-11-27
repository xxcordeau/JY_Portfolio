import { BlogPost } from '../blogData';

export const designAnimationPhilosophy: BlogPost = {
  id: 'design-animation-philosophy',
  title: {
    ko: '애니메이션을 넣기 전에 \'이걸 빼면 뭘 잃지?\'부터 물어봐요',
    en: 'Before Adding Animation, Ask What You\'d Lose Without It'
  },
  excerpt: {
    ko: '포트폴리오 히어로 파티클 애니메이션을 만들면서 고민한 것들과, 기능적 애니메이션과 표현적 애니메이션을 어떻게 구분하는지 정리했어요.',
    en: 'What I thought about while building the portfolio hero particle animation, and how I tell functional animation apart from expressive animation.'
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
  thumbnail: 'https://wdedhluxoicizxqojadx.supabase.co/storage/v1/object/public/blog-thumbnails/design-animation-philosophy.gif',
  component: 'DesignAnimationPost'
};
