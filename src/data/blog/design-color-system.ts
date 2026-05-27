import { BlogPost } from '../blogData';

export const designColorSystem: BlogPost = {
  id: 'design-color-system',
  title: {
    ko: '색을 고르는 건 감각이 아니라 시스템이에요',
    en: 'Choosing Colors Is a System, Not a Sense'
  },
  excerpt: {
    ko: '매번 눈으로 보면서 색을 고르다가 화면마다 미묘하게 다른 회색이 쓰이게 됐어요. 색상을 시스템으로 전환한 경험을 공유합니다.',
    en: 'Picking colors by eye led to subtly different grays across screens. Sharing how I switched from intuition to a color system.'
  },
  category: {
    ko: '디자인',
    en: 'Design'
  },
  date: '2026-05-15',
  readTime: {
    ko: '8분',
    en: '8 min'
  },
  tags: ['Design System', 'Color', 'Dark Mode', 'CSS Variables'],
  thumbnail: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80',
  component: 'DesignColorSystemPost'
};
