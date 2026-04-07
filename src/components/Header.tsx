import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Moon, Sun, Menu, X } from 'lucide-react';

const HeaderContainer = styled.header<{ $scrolled: boolean; $isDark: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 20px 40px;
  background: ${props => props.$scrolled
    ? props.$isDark
      ? 'rgba(0, 0, 0, 0.8)'
      : 'rgba(255, 255, 255, 0.8)'
    : 'transparent'};
  backdrop-filter: ${props => props.$scrolled ? 'blur(20px)' : 'none'};
  transition: all 0.3s ease;
  border-bottom: ${props => props.$scrolled
    ? props.$isDark
      ? '1px solid rgba(255, 255, 255, 0.1)'
      : '1px solid rgba(0, 0, 0, 0.1)'
    : 'none'};

  @media (max-width: 768px) {
    padding: 15px 20px;
  }
`;

const Nav = styled.nav`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
`;

const Logo = styled.div<{ $isDark: boolean }>`
  font-size: 20px;
  font-weight: 600;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  letter-spacing: -0.5px;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.6;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 40px;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled.a<{ $isDark: boolean }>`
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  text-decoration: none;
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
  transition: opacity 0.2s ease;
  letter-spacing: -0.2px;

  &:hover {
    opacity: 0.6;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const IconButton = styled.button<{ $isDark: boolean }>`
  background: transparent;
  border: 1px solid ${props => props.$isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'};
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  width: 36px;
  height: 36px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const LangButton = styled.button<{ $isDark: boolean }>`
  background: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  color: ${props => props.$isDark ? '#1d1d1f' : '#ffffff'};
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  letter-spacing: -0.2px;

  &:hover {
    opacity: 0.8;
  }

  @media (max-width: 768px) {
    padding: 6px 12px;
    font-size: 12px;
  }
`;

/* Mobile hamburger button */
const HamburgerButton = styled.button<{ $isDark: boolean }>`
  display: none;
  background: transparent;
  border: none;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  cursor: pointer;
  padding: 4px;
  z-index: 1001;

  svg {
    width: 24px;
    height: 24px;
  }

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

/* Mobile menu overlay */
const MobileMenuOverlay = styled.div<{ $isOpen: boolean; $isDark: boolean }>`
  display: none;

  @media (max-width: 768px) {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => props.$isDark ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
    backdrop-filter: blur(20px);
    z-index: 999;
    opacity: ${props => props.$isOpen ? 1 : 0};
    pointer-events: ${props => props.$isOpen ? 'auto' : 'none'};
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
    opacity: ${props => props.$isOpen ? 1 : 0};
    pointer-events: ${props => props.$isOpen ? 'auto' : 'none'};
    transform: ${props => props.$isOpen ? 'translateY(0)' : 'translateY(-20px)'};
    transition: all 0.3s ease;
  }
`;

const MobileNavLink = styled.a<{ $isDark: boolean }>`
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  text-decoration: none;
  font-size: 24px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s ease;
  letter-spacing: -0.5px;

  &:hover {
    opacity: 0.6;
  }
`;

const MobileCloseButton = styled.button<{ $isDark: boolean }>`
  position: absolute;
  top: 15px;
  right: 20px;
  background: transparent;
  border: none;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  cursor: pointer;
  padding: 4px;

  svg {
    width: 28px;
    height: 28px;
  }
`;

const MobileButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  margin-top: 8px;
`;

interface HeaderProps {
  language: 'ko' | 'en';
  toggleLanguage: () => void;
  isDark: boolean;
  toggleDarkMode: () => void;
  navigateToHome: () => void;
  navigateToBlog: () => void;
  currentPage: string;
  onContactClick: () => void;
}

const translations = {
  ko: {
    about: '소개',
    projects: '프로젝트',
    opensource: '오픈소스',
    blog: '블로그',
    contact: '연락',
    lang: 'EN'
  },
  en: {
    about: 'About',
    projects: 'Projects',
    opensource: 'Open Source',
    blog: 'Blog',
    contact: 'Contact',
    lang: 'KO'
  }
};

export default function Header({
  language,
  toggleLanguage,
  isDark,
  toggleDarkMode,
  navigateToHome,
  navigateToBlog,
  currentPage,
  onContactClick
}: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const t = translations[language];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    if (id === 'contact') {
      onContactClick();
      return;
    }

    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleBlogClick = () => {
    setMobileMenuOpen(false);
    if (location.pathname === '/') {
      scrollToSection('blog');
    } else {
      navigate('/blog');
    }
  };

  const handleOpenSourceClick = () => {
    setMobileMenuOpen(false);
    navigate('/opensource');
  };

  return (
    <>
      <HeaderContainer $scrolled={scrolled || mobileMenuOpen} $isDark={isDark}>
        <Nav>
          <Logo $isDark={isDark} onClick={() => { setMobileMenuOpen(false); navigateToHome(); }}>Portfolio</Logo>
          <NavLinks>
            <NavLink $isDark={isDark} onClick={() => scrollToSection('about')}>{t.about}</NavLink>
            <NavLink $isDark={isDark} onClick={() => scrollToSection('projects')}>{t.projects}</NavLink>
            <NavLink $isDark={isDark} onClick={handleOpenSourceClick}>{t.opensource}</NavLink>
            <NavLink $isDark={isDark} onClick={handleBlogClick}>{t.blog}</NavLink>
            <NavLink $isDark={isDark} onClick={() => scrollToSection('contact')}>{t.contact}</NavLink>
          </NavLinks>
          <ButtonGroup>
            <IconButton $isDark={isDark} onClick={toggleDarkMode}>
              {isDark ? <Sun /> : <Moon />}
            </IconButton>
            <LangButton $isDark={isDark} onClick={toggleLanguage}>{t.lang}</LangButton>
            <HamburgerButton
              $isDark={isDark}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </HamburgerButton>
          </ButtonGroup>
        </Nav>
      </HeaderContainer>

      {/* Mobile fullscreen menu */}
      <MobileMenuOverlay $isOpen={mobileMenuOpen} $isDark={isDark} onClick={() => setMobileMenuOpen(false)} />
      <MobileMenu $isOpen={mobileMenuOpen} $isDark={isDark}>
        <MobileNavLink $isDark={isDark} onClick={() => scrollToSection('about')}>{t.about}</MobileNavLink>
        <MobileNavLink $isDark={isDark} onClick={() => scrollToSection('projects')}>{t.projects}</MobileNavLink>
        <MobileNavLink $isDark={isDark} onClick={handleOpenSourceClick}>{t.opensource}</MobileNavLink>
        <MobileNavLink $isDark={isDark} onClick={handleBlogClick}>{t.blog}</MobileNavLink>
        <MobileNavLink $isDark={isDark} onClick={() => scrollToSection('contact')}>{t.contact}</MobileNavLink>
        <MobileButtonGroup>
          <IconButton $isDark={isDark} onClick={toggleDarkMode}>
            {isDark ? <Sun /> : <Moon />}
          </IconButton>
          <LangButton $isDark={isDark} onClick={toggleLanguage}>{t.lang}</LangButton>
        </MobileButtonGroup>
      </MobileMenu>
    </>
  );
}
