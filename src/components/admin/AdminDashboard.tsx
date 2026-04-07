import { useState } from 'react';
import styled from 'styled-components';
import { Mail, User, FolderOpen, BookOpen, LogOut, Menu, X } from 'lucide-react';
import MailManager from './MailManager';
import AboutEditor from './AboutEditor';
import ProjectEditor from './ProjectEditor';
import BlogEditor from './BlogEditor';

const DashboardContainer = styled.div<{ $isDark: boolean }>`
  min-height: 100vh;
  background: ${props => props.$isDark ? '#0a0a0a' : '#f5f5f7'};
  transition: background 0.3s ease;
`;

const Header = styled.header<{ $isDark: boolean }>`
  background: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255, 255, 255, 0.8)'};
  border-bottom: 1px solid ${props => props.$isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'};
  backdrop-filter: blur(20px);
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;

  @media (max-width: 768px) {
    padding: 16px 20px;
  }
`;

const Logo = styled.div<{ $isDark: boolean }>`
  font-size: 22px;
  font-weight: 600;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  letter-spacing: -0.5px;

  span {
    background: ${props => props.$isDark 
      ? 'linear-gradient(135deg, #4ECDC4 0%, #45B7D1 100%)' 
      : 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)'};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const LogoutButton = styled.button<{ $isDark: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'};
  border: 1px solid ${props => props.$isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'};
  border-radius: 8px;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif;

  &:hover {
    background: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)'};
  }

  svg {
    width: 18px;
    height: 18px;
  }

  @media (max-width: 768px) {
    span {
      display: none;
    }
  }
`;

const MainContent = styled.div`
  display: flex;
  max-width: 1400px;
  margin: 0 auto;
  min-height: calc(100vh - 80px);

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Sidebar = styled.aside<{ $isDark: boolean; $isOpen: boolean }>`
  width: 280px;
  background: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255, 255, 255, 0.8)'};
  border-right: 1px solid ${props => props.$isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'};
  padding: 32px 0;
  backdrop-filter: blur(20px);

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: ${props => props.$isOpen ? '0' : '-100%'};
    width: 80%;
    max-width: 280px;
    height: 100vh;
    z-index: 200;
    transition: left 0.3s ease;
    padding-top: 80px;
  }
`;

const MobileMenuButton = styled.button<{ $isDark: boolean }>`
  display: none;
  padding: 8px;
  background: none;
  border: none;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  cursor: pointer;

  svg {
    width: 24px;
    height: 24px;
  }

  @media (max-width: 768px) {
    display: flex;
  }
`;

const Overlay = styled.div<{ $isOpen: boolean }>`
  display: none;
  
  @media (max-width: 768px) {
    display: ${props => props.$isOpen ? 'block' : 'none'};
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 150;
  }
`;

const MenuList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const MenuItem = styled.li<{ $isDark: boolean; $active: boolean }>`
  padding: 14px 32px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  color: ${props => {
    if (props.$active) {
      return props.$isDark ? '#4ECDC4' : '#007AFF';
    }
    return props.$isDark ? '#f5f5f7' : '#1d1d1f';
  }};
  background: ${props => props.$active 
    ? props.$isDark ? 'rgba(78, 205, 196, 0.1)' : 'rgba(0, 122, 255, 0.1)'
    : 'transparent'};
  border-left: 3px solid ${props => props.$active 
    ? props.$isDark ? '#4ECDC4' : '#007AFF'
    : 'transparent'};
  font-size: 16px;
  font-weight: ${props => props.$active ? '600' : '500'};
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const Content = styled.div`
  flex: 1;
  padding: 40px;

  @media (max-width: 768px) {
    padding: 24px 20px;
  }
`;

type TabType = 'mail' | 'about' | 'projects' | 'blog';

interface AdminDashboardProps {
  isDark: boolean;
  language: 'ko' | 'en';
  onLogout: () => void;
}

export default function AdminDashboard({ isDark, language, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('mail');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  const menuItems = [
    { id: 'mail' as TabType, icon: Mail, label: '메일 관리' },
    { id: 'about' as TabType, icon: User, label: 'About 관리' },
    { id: 'projects' as TabType, icon: FolderOpen, label: '프로젝트 관리' },
    { id: 'blog' as TabType, icon: BookOpen, label: '블로그 관리' },
  ];

  return (
    <DashboardContainer $isDark={isDark}>
      <Header $isDark={isDark}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <MobileMenuButton 
            $isDark={isDark}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X /> : <Menu />}
          </MobileMenuButton>
          <Logo $isDark={isDark}>
            관리자 <span>대시보드</span>
          </Logo>
        </div>
        <LogoutButton $isDark={isDark} onClick={onLogout}>
          <LogOut />
          <span>로그아웃</span>
        </LogoutButton>
      </Header>

      <Overlay $isOpen={sidebarOpen} onClick={() => setSidebarOpen(false)} />

      <MainContent>
        <Sidebar $isDark={isDark} $isOpen={sidebarOpen}>
          <MenuList>
            {menuItems.map(item => (
              <MenuItem
                key={item.id}
                $isDark={isDark}
                $active={activeTab === item.id}
                onClick={() => handleTabChange(item.id)}
              >
                <item.icon />
                {item.label}
              </MenuItem>
            ))}
          </MenuList>
        </Sidebar>

        <Content>
          {activeTab === 'mail' && <MailManager isDark={isDark} language={language} />}
          {activeTab === 'about' && <AboutEditor isDark={isDark} language={language} />}
          {activeTab === 'projects' && <ProjectEditor isDark={isDark} language={language} />}
          {activeTab === 'blog' && <BlogEditor isDark={isDark} language={language} />}
        </Content>
      </MainContent>
    </DashboardContainer>
  );
}
