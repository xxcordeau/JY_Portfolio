import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import {
  Mail, User, FolderOpen, BookOpen, Github,
  MessageSquare, FileText, Settings, LogOut,
  Menu, X, ChevronRight
} from 'lucide-react';
import { Toaster } from '../ui/sonner';
import { useTheme } from '../../contexts/ThemeContext';

// ============================================
// Layout — winnticket admin style (styled-components)
// Sidebar(240px) + Header(52px) + Content
// ============================================

const DashboardContainer = styled.div<{ $isDark: boolean }>`
  height: 100vh;
  display: flex;
  background: ${p => p.$isDark ? '#0a0a0a' : '#f5f5f7'};
  transition: background 0.3s ease;
  overflow: hidden;
`;

// --- Sidebar ---

const SidebarWrapper = styled.aside<{ $isDark: boolean; $isOpen: boolean }>`
  width: 240px;
  min-height: 100vh;
  background: ${p => p.$isDark ? '#111' : '#ffffff'};
  border-right: 1px solid ${p => p.$isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'};
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: ${p => p.$isOpen ? '0' : '-280px'};
    width: 280px;
    z-index: 300;
    transition: left 0.25s ease;
  }
`;

const SidebarHeader = styled.div<{ $isDark: boolean }>`
  padding: 20px 20px 16px;
  border-bottom: 1px solid ${p => p.$isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'};
`;

const SidebarLogo = styled.div<{ $isDark: boolean }>`
  font-size: 18px;
  font-weight: 700;
  color: ${p => p.$isDark ? '#f5f5f7' : '#1d1d1f'};
  letter-spacing: -0.5px;
  display: flex;
  align-items: center;
  gap: 8px;

  span {
    color: #0c8ce9;
  }
`;

const SidebarNav = styled.nav`
  flex: 1;
  padding: 12px 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const NavSection = styled.div`
  margin-bottom: 8px;
`;

const NavSectionLabel = styled.div<{ $isDark: boolean }>`
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: ${p => p.$isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)'};
  padding: 12px 12px 6px;
`;

const NavItem = styled.button<{ $isDark: boolean; $active: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: 8px;
  border: none;
  background: ${p => p.$active
    ? p.$isDark ? 'rgba(12,140,233,0.15)' : 'rgba(12,140,233,0.08)'
    : 'transparent'};
  color: ${p => p.$active
    ? '#0c8ce9'
    : p.$isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.65)'};
  font-size: 14px;
  font-weight: ${p => p.$active ? '600' : '500'};
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: inherit;
  text-align: left;

  &:hover {
    background: ${p => p.$active
      ? p.$isDark ? 'rgba(12,140,233,0.15)' : 'rgba(12,140,233,0.08)'
      : p.$isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'};
  }

  svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }
`;

const SidebarFooter = styled.div<{ $isDark: boolean }>`
  padding: 12px 8px;
  border-top: 1px solid ${p => p.$isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'};
`;

// --- Main Area ---

const MainArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
`;

const TopBar = styled.header<{ $isDark: boolean }>`
  height: 52px;
  min-height: 52px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background: ${p => p.$isDark ? '#111' : '#ffffff'};
  border-bottom: 1px solid ${p => p.$isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'};
  flex-shrink: 0;
  z-index: 50;

  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

const TopBarLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const MobileMenuBtn = styled.button<{ $isDark: boolean }>`
  display: none;
  padding: 6px;
  background: none;
  border: none;
  color: ${p => p.$isDark ? '#f5f5f7' : '#1d1d1f'};
  cursor: pointer;
  border-radius: 6px;

  &:hover {
    background: ${p => p.$isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'};
  }

  svg { width: 22px; height: 22px; }

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
  }
`;

const Breadcrumb = styled.div<{ $isDark: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: ${p => p.$isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)'};

  span:last-child {
    color: ${p => p.$isDark ? '#f5f5f7' : '#1d1d1f'};
    font-weight: 500;
  }

  svg { width: 14px; height: 14px; }
`;

const ContentArea = styled.main`
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  overflow-x: hidden;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const Overlay = styled.div<{ $isOpen: boolean }>`
  display: none;

  @media (max-width: 768px) {
    display: ${p => p.$isOpen ? 'block' : 'none'};
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.4);
    z-index: 250;
  }
`;

// ============================================
// Menu configuration
// ============================================

interface MenuItem {
  id: string;
  path: string;
  icon: React.ElementType;
  label: string;
  section: 'content' | 'system';
}

const menuItems: MenuItem[] = [
  { id: 'mail',          path: '/admin/mail',          icon: Mail,           label: '메일 관리',      section: 'content' },
  { id: 'projects',      path: '/admin/projects',      icon: FolderOpen,     label: '프로젝트 관리',  section: 'content' },
  { id: 'blog',          path: '/admin/blog',          icon: BookOpen,       label: '블로그 관리',    section: 'content' },
  { id: 'about',         path: '/admin/about',         icon: User,           label: 'About 관리',     section: 'content' },
  { id: 'opensource',    path: '/admin/opensource',    icon: Github,         label: '오픈소스 관리',  section: 'content' },
  { id: 'presentations', path: '/admin/presentations', icon: FileText,       label: 'PT 자료 관리',   section: 'content' },
  { id: 'chatbot',       path: '/admin/chatbot',       icon: MessageSquare,  label: '챗봇 관리',      section: 'system' },
  { id: 'settings',      path: '/admin/settings',      icon: Settings,       label: '사이트 설정',    section: 'system' },
];

// ============================================
// Component
// ============================================

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentPath = location.pathname;
  const activeItem = menuItems.find(item =>
    currentPath === item.path || currentPath.startsWith(item.path + '/')
  );
  const activeLabel = activeItem?.label ?? '관리자';

  const contentItems = menuItems.filter(m => m.section === 'content');
  const systemItems = menuItems.filter(m => m.section === 'system');

  const handleNav = (path: string) => {
    navigate(path);
    setSidebarOpen(false);
  };

  const isActive = (item: MenuItem) =>
    currentPath === item.path || currentPath.startsWith(item.path + '/');

  return (
    <DashboardContainer $isDark={isDark}>
      <Overlay $isOpen={sidebarOpen} onClick={() => setSidebarOpen(false)} />

      <SidebarWrapper $isDark={isDark} $isOpen={sidebarOpen}>
        <SidebarHeader $isDark={isDark}>
          <SidebarLogo $isDark={isDark}>
            Portfolio <span>Admin</span>
          </SidebarLogo>
        </SidebarHeader>

        <SidebarNav>
          <NavSection>
            <NavSectionLabel $isDark={isDark}>콘텐츠</NavSectionLabel>
            {contentItems.map(item => (
              <NavItem
                key={item.id}
                $isDark={isDark}
                $active={isActive(item)}
                onClick={() => handleNav(item.path)}
              >
                <item.icon />
                {item.label}
              </NavItem>
            ))}
          </NavSection>

          <NavSection>
            <NavSectionLabel $isDark={isDark}>시스템</NavSectionLabel>
            {systemItems.map(item => (
              <NavItem
                key={item.id}
                $isDark={isDark}
                $active={isActive(item)}
                onClick={() => handleNav(item.path)}
              >
                <item.icon />
                {item.label}
              </NavItem>
            ))}
          </NavSection>
        </SidebarNav>

        <SidebarFooter $isDark={isDark}>
          <NavItem
            $isDark={isDark}
            $active={false}
            onClick={onLogout}
            style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)' }}
          >
            <LogOut />
            로그아웃
          </NavItem>
        </SidebarFooter>
      </SidebarWrapper>

      <MainArea>
        <TopBar $isDark={isDark}>
          <TopBarLeft>
            <MobileMenuBtn $isDark={isDark} onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X /> : <Menu />}
            </MobileMenuBtn>
            <Breadcrumb $isDark={isDark}>
              <span>관리자</span>
              <ChevronRight />
              <span>{activeLabel}</span>
            </Breadcrumb>
          </TopBarLeft>
        </TopBar>

        <ContentArea>
          <Outlet />
        </ContentArea>
      </MainArea>

      <Toaster position="bottom-right" richColors />
    </DashboardContainer>
  );
}
