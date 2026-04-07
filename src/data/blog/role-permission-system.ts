import { BlogPost } from '../blogData';

export const rolePermissionSystem: BlogPost = {
  id: 'role-permission-system',
  title: {
    ko: '권한(Role)별 접근 제어 시스템',
    en: 'Role-Based Access Control System'
  },
  excerpt: {
    ko: '사용자 역할에 따른 페이지/기능 접근 제어를 중앙 composable로 통합하여 일관된 권한 관리를 구현한 경험을 공유합니다.',
    en: 'Sharing experience of implementing consistent permission management by integrating page/feature access control based on user roles into a central composable.'
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
  thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80',
  component: 'RolePermissionPost'
};
