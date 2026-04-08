import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import {
  Mail, FolderOpen, BookOpen, User, Github,
  FileText, MessageSquare, Settings
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Title = styled.h1<{ $isDark: boolean }>`
  font-size: 24px;
  font-weight: 700;
  color: ${p => p.$isDark ? '#f5f5f7' : '#1d1d1f'};
  letter-spacing: -0.5px;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #86868b;
  margin-top: -16px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
`;

const Card = styled.button<{ $isDark: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  padding: 24px;
  background: ${p => p.$isDark ? '#1a1a1a' : '#ffffff'};
  border: 1px solid ${p => p.$isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  text-align: left;

  &:hover {
    border-color: #0c8ce9;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${p => p.$isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.08)'};
  }
`;

const IconBox = styled.div<{ $color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: ${p => p.$color}15;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${p => p.$color};

  svg {
    width: 20px;
    height: 20px;
  }
`;

const CardTitle = styled.div<{ $isDark: boolean }>`
  font-size: 15px;
  font-weight: 600;
  color: ${p => p.$isDark ? '#f5f5f7' : '#1d1d1f'};
`;

const CardDesc = styled.div`
  font-size: 13px;
  color: #86868b;
  line-height: 1.4;
`;

const items = [
  { path: '/admin/mail',          icon: Mail,           label: '메일 관리',      desc: '받은 문의 메일 확인', color: '#0c8ce9' },
  { path: '/admin/projects',      icon: FolderOpen,     label: '프로젝트 관리',  desc: '프로젝트 추가/수정/삭제', color: '#10b981' },
  { path: '/admin/blog',          icon: BookOpen,       label: '블로그 관리',    desc: '블로그 글 작성/편집', color: '#f59e0b' },
  { path: '/admin/about',         icon: User,           label: 'About 관리',     desc: '소개, 스킬, 경력 편집', color: '#8b5cf6' },
  { path: '/admin/opensource',    icon: Github,         label: '오픈소스 관리',  desc: '오픈소스 프로젝트 관리', color: '#6366f1' },
  { path: '/admin/presentations', icon: FileText,       label: 'PT 자료 관리',   desc: 'PT/발표 자료 업로드', color: '#ec4899' },
  { path: '/admin/chatbot',       icon: MessageSquare,  label: '챗봇 관리',      desc: '챗봇 Q&A 편집', color: '#14b8a6' },
  { path: '/admin/settings',      icon: Settings,       label: '사이트 설정',    desc: '네비게이션, 연락처 설정', color: '#64748b' },
];

export default function AdminHome() {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  return (
    <Container>
      <Title $isDark={isDark}>대시보드</Title>
      <Subtitle>관리할 섹션을 선택하세요</Subtitle>
      <Grid>
        {items.map(item => (
          <Card key={item.path} $isDark={isDark} onClick={() => navigate(item.path)}>
            <IconBox $color={item.color}><item.icon /></IconBox>
            <CardTitle $isDark={isDark}>{item.label}</CardTitle>
            <CardDesc>{item.desc}</CardDesc>
          </Card>
        ))}
      </Grid>
    </Container>
  );
}
