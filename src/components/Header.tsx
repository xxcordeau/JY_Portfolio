import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useSiteSettings } from '../hooks/useSiteSettings';

/* ── Floating Capsule Header ── */
const HeaderWrapper = styled.header<{ $visible: boolean }>`
  position: fixed;
  top: 16px;
  left: 50%;
  transform: translateX(-50%) translateY(${p => p.$visible ? '0' : '-80px'});
  z-index: 1002;
  opacity: ${p => p.$visible ? 1 : 0};
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
  pointer-events: ${p => p.$visible ? 'auto' : 'none'};

  @media (max-width: 768px) {
    top: 12px;
  }
`;

const Capsule = styled.nav<{ $isDark: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 100px;
  background: ${p => p.$isDark
    ? 'rgba(30, 30, 30, 0.85)'
    : 'rgba(255, 255, 255, 0.85)'};
  backdrop-filter: blur(24px) saturate(1.8);
  -webkit-backdrop-filter: blur(24px) saturate(1.8);
  border: 1px solid ${p => p.$isDark
    ? 'rgba(255, 255, 255, 0.08)'
    : 'rgba(0, 0, 0, 0.06)'};
  box-shadow: ${p => p.$isDark
    ? '0 4px 24px rgba(0, 0, 0, 0.4)'
    : '0 4px 24px rgba(0, 0, 0, 0.06)'};

  @media (max-width: 768px) {
    width: auto;
    gap: 6px;
  }
`;

const Dots = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 0 8px 0 4px;
  flex-shrink: 0;
`;

const Dot = styled.div<{ $color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${p => p.$color};
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavButton = styled.button<{ $isDark: boolean; $active?: boolean }>`
  padding: 6px 16px;
  border: none;
  border-radius: 100px;
  background: ${p => p.$active
    ? p.$isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.07)'
    : 'transparent'};
  color: ${p => p.$active
    ? p.$isDark ? '#f5f5f7' : '#1d1d1f'
    : p.$isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)'};
  font-size: 13px;
  font-weight: ${p => p.$active ? 600 : 400};
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  letter-spacing: -0.2px;
  white-space: nowrap;

  &:hover {
    background: ${p => p.$isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)'};
    color: ${p => p.$isDark ? '#f5f5f7' : '#1d1d1f'};
  }
`;

const Separator = styled.div<{ $isDark: boolean }>`
  width: 1px;
  height: 16px;
  background: ${p => p.$isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'};
  margin: 0 4px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    display: none;
  }
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
`;

const IconButton = styled.button<{ $isDark: boolean }>`
  background: transparent;
  border: none;
  color: ${p => p.$isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)'};
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${p => p.$isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)'};
    color: ${p => p.$isDark ? '#f5f5f7' : '#1d1d1f'};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const LangButton = styled.button<{ $isDark: boolean }>`
  background: ${p => p.$isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'};
  color: ${p => p.$isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)'};
  border: none;
  padding: 5px 12px;
  border-radius: 100px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  letter-spacing: 0.5px;

  &:hover {
    background: ${p => p.$isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'};
    color: ${p => p.$isDark ? '#f5f5f7' : '#1d1d1f'};
  }
`;

const HamburgerButton = styled.button<{ $isDark: boolean }>`
  display: none;
  background: transparent;
  border: none;
  color: ${p => p.$isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)'};
  cursor: pointer;
  padding: 4px;
  z-index: 1001;

  svg {
    width: 20px;
    height: 20px;
  }

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

/* ── Mobile Menu ── */
const MobileMenuOverlay = styled.div<{ $isOpen: boolean; $isDark: boolean }>`
  display: none;

  @media (max-width: 768px) {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${p => p.$isDark ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
    backdrop-filter: blur(20px);
    z-index: 999;
    opacity: ${p => p.$isOpen ? 1 : 0};
    pointer-events: ${p => p.$isOpen ? 'auto' : 'none'};
    transition: opacity 0.3s ease;
  }
`;

const MobileMenu = styled.div<{ $isOpen: boolean; $isDark: boolean }>`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 32px;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    opacity: ${p => p.$isOpen ? 1 : 0};
    pointer-events: ${p => p.$isOpen ? 'auto' : 'none'};
    transform: ${p => p.$isOpen ? 'translateY(0)' : 'translateY(-20px)'};
    transition: all 0.3s ease;
  }
`;

const MobileNavButton = styled.button<{ $isDark: boolean }>`
  color: ${p => p.$isDark ? '#f5f5f7' : '#1d1d1f'};
  background: none;
  border: none;
  font-size: 24px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s ease;
  letter-spacing: -0.5px;
  font-family: inherit;

  &:hover {
    opacity: 0.6;
  }
`;

const MobileButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  margin-top: 8px;
`;

interface HeaderProps {
  navigateToHome: () => void;
  onContactClick: () => void;
}

const translations = {
  ko: {
    about: '소개',
    projects: '프로젝트',
    opensource: '컴포넌트 라이브러리',
    blog: '블로그',
    contact: '연락',
    presentations: 'PT 자료',
    lang: 'EN'
  },
  en: {
    about: 'About',
    projects: 'Projects',
    opensource: 'Component Library',
    blog: 'Blog',
    contact: 'Contact',
    presentations: 'Presentations',
    lang: 'KO'
  }
};

export default function Header({ navigateToHome, onContactClick }: HeaderProps) {
  const { isDark, toggleDarkMode } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const { isNavVisible, navOrder } = useSiteSettings();
  const [visible, setVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const t = translations[language];

  useEffect(() => {
    const handleScroll = () => {
      // Show capsule after scrolling past hero area (roughly 200px)
      setVisible(window.scrollY > 200);
    };

    // Also check on mount for pages that aren't the home page
    if (location.pathname !== '/') {
      setVisible(true);
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  // Determine active nav item based on current route/scroll
  const getActiveKey = (): string | null => {
    const path = location.pathname;
    if (path.startsWith('/projects')) return 'nav_projects';
    if (path.startsWith('/blog')) return 'nav_blog';
    if (path.startsWith('/opensource')) return 'nav_opensource';
    if (path.startsWith('/presentations')) return 'nav_presentations';
    return null;
  };

  const activeKey = getActiveKey();

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    if (id === 'contact') {
      onContactClick();
      return;
    }

    if (location.pathname !== '/') {
      // Store target section, then navigate to home — HomePage will pick it up
      sessionStorage.setItem('scrollTarget', id);
      navigate('/');
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handlePresentationsClick = () => {
    setMobileMenuOpen(false);
    navigate('/presentations');
  };

  const navActions: Record<string, { label: string; onClick: () => void }> = {
    nav_about: { label: t.about, onClick: () => scrollToSection('about') },
    nav_projects: { label: t.projects, onClick: () => scrollToSection('projects') },
    nav_opensource: { label: t.opensource, onClick: () => scrollToSection('opensource') },
    nav_blog: { label: t.blog, onClick: () => scrollToSection('blog') },
    nav_presentations: { label: t.presentations, onClick: handlePresentationsClick },
    nav_contact: { label: t.contact, onClick: () => scrollToSection('contact') },
  };

  return (
    <>
      <HeaderWrapper $visible={visible || mobileMenuOpen}>
        <Capsule $isDark={isDark} aria-label="Main navigation">
          <Dots onClick={() => { setMobileMenuOpen(false); navigateToHome(); }} style={{ cursor: 'pointer' }}>
            <Dot $color={isDark ? '#f5f5f7' : '#1d1d1f'} />
          </Dots>

          <NavLinks>
            {navOrder.map(key => {
              if (!isNavVisible(key) || !navActions[key]) return null;
              const { label, onClick } = navActions[key];
              return (
                <NavButton
                  key={key}
                  $isDark={isDark}
                  $active={activeKey === key}
                  onClick={onClick}
                >
                  {label}
                </NavButton>
              );
            })}
          </NavLinks>

          <Separator $isDark={isDark} />

          <Controls>
            <IconButton $isDark={isDark} onClick={toggleDarkMode} aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
              {isDark ? <Sun /> : <Moon />}
            </IconButton>
            <LangButton $isDark={isDark} onClick={toggleLanguage} aria-label={language === 'ko' ? 'Switch to English' : '한국어로 전환'}>
              {t.lang}
            </LangButton>
            <HamburgerButton
              $isDark={isDark}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </HamburgerButton>
          </Controls>
        </Capsule>
      </HeaderWrapper>

      <MobileMenuOverlay $isOpen={mobileMenuOpen} $isDark={isDark} onClick={() => setMobileMenuOpen(false)} />
      <MobileMenu $isOpen={mobileMenuOpen} $isDark={isDark} role="dialog" aria-label="Navigation menu">
        {navOrder.map(key => {
          if (!isNavVisible(key) || !navActions[key]) return null;
          const { label, onClick } = navActions[key];
          return <MobileNavButton key={key} $isDark={isDark} onClick={onClick}>{label}</MobileNavButton>;
        })}
        <MobileButtonGroup>
          <IconButton $isDark={isDark} onClick={toggleDarkMode} aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
            {isDark ? <Sun /> : <Moon />}
          </IconButton>
          <LangButton $isDark={isDark} onClick={toggleLanguage} aria-label={language === 'ko' ? 'Switch to English' : '한국어로 전환'}>
            {t.lang}
          </LangButton>
        </MobileButtonGroup>
      </MobileMenu>
    </>
  );
}
