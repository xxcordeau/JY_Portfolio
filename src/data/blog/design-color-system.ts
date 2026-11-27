import { BlogPost } from '../blogData';

export const designColorSystem: BlogPost = {
  id: 'design-color-system',
  title: {
    ko: '색을 고르는 건 감각이 아니라 시스템이에요',
    en: 'Choosing Colors Is a System, Not a Sense'
  },
  excerpt: {
    ko: '매번 눈으로 보면서 색을 고르다가 화면마다 미묘하게 다른 회색이 쓰이게 됐어요. 그래서 색상을 단계와 역할로 정리한 시스템으로 바꿨어요.',
    en: 'Picking colors by eye left me with subtly different grays on every screen, so I rebuilt our colors as a system of steps and roles.'
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
  thumbnail: 'https://wdedhluxoicizxqojadx.supabase.co/storage/v1/object/public/blog-thumbnails/design-color-system.png',
  component: 'DesignColorSystemPost'
};
