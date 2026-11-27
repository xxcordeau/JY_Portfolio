import { BlogPost } from '../blogData';

export const rolePermissionSystem: BlogPost = {
  id: 'role-permission-system',
  title: {
    ko: '권한(Role)별 접근 제어 시스템',
    en: 'Role-Based Access Control System'
  },
  excerpt: {
    ko: '역할마다 다른 페이지/기능 접근 조건을 중앙 composable 하나로 모아 라우터, UI, API가 같은 권한 로직을 쓰게 만든 과정이에요.',
    en: 'How I pulled role-based page and feature access checks into one central composable so the router, UI, and API calls all share the same permission logic.'
  },
  category: {
    ko: '개발',
    en: 'Development'
  },
  date: '2024-10-21',
  readTime: {
    ko: '8분',
    en: '8 min'
  },
  tags: ['Vue', 'Security', 'Access Control', 'Authorization'],
  thumbnail: 'https://wdedhluxoicizxqojadx.supabase.co/storage/v1/object/public/blog-thumbnails/role-permission-system.png',
  component: 'RolePermissionPost'
};
