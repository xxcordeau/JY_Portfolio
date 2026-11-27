'use client';

import styled from 'styled-components';
import Link from 'next/link';
import { useState, useEffect, type MouseEvent } from 'react';
import { usePathname } from 'next/navigation';
import { Moon, Sun, Menu, X, Search, Globe } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useSiteSettings } from '../hooks/useSiteSettings';

/* PUUS 앱 헤더와 같은 구조: 화면 폭 전체를 쓰는 고정 헤더 + 1px 아래선,
   안쪽은 본문과 같은 1040px 폭에 맞춘다. 활성 메뉴는 굵게 + 2px 밑줄. */
const Bar = styled.header`
  position: sticky;
  top: 0;
  z-index: 1002;
  background: var(--k-bg);
  border-bottom: 1px solid var(--k-line);
`;

const Inner = styled.div`
  max-width: var(--k-page-max);
  height: 64px;
  margin: 0 auto;
  padding: 0 var(--k-space-6);
  display: flex;
  align-items: center;
  gap: var(--k-space-12);

  @media (max-width: 1040px) {
    gap: var(--k-space-8);
  }

  @media (max-width: 768px) {
    height: 56px;
    padding: 0 var(--k-space-4);
    gap: var(--k-space-3);
  }
`;

const Brand = styled(Link)`
  display: flex;
  align-items: baseline;
  gap: 6px;
  color: var(--k-text);
  text-decoration: none;
  font-size: 19px;
  font-weight: 800;
  letter-spacing: -0.03em;
  white-space: nowrap;

  span {
    font-weight: 500;
    color: var(--k-text-weak);
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: stretch;
  height: 100%;
  gap: var(--k-space-6);

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavItem = styled(Link)<{ $active: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  font-size: 15px;
  font-weight: ${p => (p.$active ? 700 : 500)};
  color: ${p => (p.$active ? 'var(--k-text)' : 'var(--k-text-sub)')};
  text-decoration: none;
  white-space: nowrap;
  transition: color 0.15s var(--k-ease);

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -1px;
    height: 2px;
    background: var(--k-accent);
    transform: scaleX(${p => (p.$active ? 1 : 0)});
    transition: transform 0.2s var(--k-ease);
  }

  &:hover { color: var(--k-text); }
`;

const Right = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  flex: none;
  gap: var(--k-space-3);

  @media (max-width: 1040px) {
    gap: var(--k-space-2);
  }
`;

/* PUUS .search-btn: 테두리 없는 회색 칸 + 단축키 표시, 좁아지면 아이콘만 */
const SearchButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: var(--k-space-2);
  width: 180px;
  height: 34px;
  padding: 0 6px 0 12px;
  border: none;
  border-radius: var(--k-radius);
  background: var(--k-bg-sub);
  color: var(--k-text-weak);
  font: inherit;
  font-size: var(--k-text-sm);
  cursor: pointer;
  transition: background 0.15s var(--k-ease);

  svg { width: 15px; height: 15px; flex: none; }
  .text { flex: 1; text-align: left; }

  kbd {
    font-family: inherit;
    font-size: 11px;
    padding: 2px 6px;
    border-radius: var(--k-radius-sm);
    background: var(--k-bg);
    color: var(--k-text-weak);
  }

  &:hover { background: var(--k-bg-hover); }

  @media (max-width: 1040px) {
    width: 34px;
    padding: 0;
    justify-content: center;
    background: none;
    .text, kbd { display: none; }
  }
`;

/* PUUS .lang-btn */
const LangButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  border: none;
  border-radius: var(--k-radius);
  background: none;
  color: var(--k-text-sub);
  font: inherit;
  font-size: var(--k-text-sm);
  cursor: pointer;

  svg { width: 15px; height: 15px; }
  &:hover { background: var(--k-bg-hover); color: var(--k-text); }

  @media (max-width: 768px) {
    .text { display: none; }
    padding: 6px;
  }
`;


const IconButton = styled.button`
  width: var(--k-control-sm);
  height: var(--k-control-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: var(--k-radius);
  color: var(--k-text-sub);
  cursor: pointer;
  font: inherit;
  font-size: var(--k-text-xs);
  font-weight: 700;
  transition: background 0.15s var(--k-ease), color 0.15s var(--k-ease);

  svg { width: 16px; height: 16px; }

  &:hover {
    background: var(--k-bg-hover);
    color: var(--k-text);
  }
`;

const ContactButton = styled.button`
  height: var(--k-control-sm);
  padding: 0 var(--k-space-3);
  background: var(--k-accent);
  color: var(--k-on-accent);
  border: none;
  border-radius: var(--k-radius);
  font: inherit;
  font-size: var(--k-text-sm);
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s var(--k-ease);

  &:hover { background: var(--k-accent-hover); }

  @media (max-width: 768px) {
    display: none;
  }
`;

const MenuButton = styled(IconButton)`
  display: none;

  @media (max-width: 768px) {
    display: flex;
  }
`;

/* 모바일: 헤더 바로 아래로 펼쳐지는 목록 */
const MobilePanel = styled.div<{ $open: boolean }>`
  display: none;

  @media (max-width: 768px) {
    display: ${p => (p.$open ? 'block' : 'none')};
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--k-bg);
    border-bottom: 1px solid var(--k-line);
    padding: var(--k-space-2) var(--k-space-4) var(--k-space-4);
    animation: k-enter 0.2s var(--k-ease);
  }
`;

const MobileItem = styled(Link)<{ $active: boolean }>`
  display: block;
  padding: var(--k-space-3) 0;
  font-size: var(--k-text-lg);
  font-weight: ${p => (p.$active ? 700 : 500)};
  color: ${p => (p.$active ? 'var(--k-text)' : 'var(--k-text-sub)')};
  text-decoration: none;
  border-bottom: 1px solid var(--k-line);
`;

const MobileContact = styled(ContactButton)`
  @media (max-width: 768px) {
    display: block;
    width: 100%;
    height: var(--k-control-md);
    margin-top: var(--k-space-4);
  }
`;

interface HeaderProps {
  onContactClick: () => void;
  onSearchClick: () => void;
}

const LABELS = {
  ko: {
    home: '요약', nav_projects: '프로젝트', nav_opensource: '오픈소스',
    nav_blog: '블로그', nav_presentations: 'PT 자료',
    contact: '연락하기', search: '검색', sub: '프론트엔드',
  },
  en: {
    home: 'Overview', nav_projects: 'Projects', nav_opensource: 'Open source',
    nav_blog: 'Blog', nav_presentations: 'Talks',
    contact: 'Contact', search: 'Search', sub: 'Frontend',
  },
} as const;

const ROUTES: Record<string, string> = {
  nav_projects: '/projects',
  nav_opensource: '/opensource',
  nav_blog: '/blog',
  nav_presentations: '/presentations',
};

export default function Header({ onContactClick, onSearchClick }: HeaderProps) {
  const { isDark, toggleDarkMode } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const { isNavVisible, navOrder } = useSiteSettings();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname() || '/';
  const t = LABELS[language];

  // 테마 전환 원이 누른 버튼 한가운데서 퍼지도록 버튼 중심을 넘긴다
  const handleThemeToggle = (e: MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    toggleDarkMode({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
  };

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  // 관리자에서 끈 메뉴는 숨기고, 순서도 관리자 설정을 따른다
  const items = [
    { key: 'home', href: '/', label: t.home },
    ...navOrder
      .filter(key => ROUTES[key] && isNavVisible(key))
      .map(key => ({ key, href: ROUTES[key], label: t[key as keyof typeof t] })),
  ];

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <Bar>
      <Inner>
        <Brand href="/" aria-label="허정연 포트폴리오 홈">
          {language === 'ko' ? '허정연' : 'Heo JeongYeon'}
          <span>{t.sub}</span>
        </Brand>

        <Nav aria-label="Main navigation">
          {items.map(item => (
            <NavItem key={item.key} href={item.href} $active={isActive(item.href)}>
              {item.label}
            </NavItem>
          ))}
        </Nav>

        <Right>
          <SearchButton onClick={onSearchClick} aria-label={t.search}>
            <Search />
            <span className="text">{t.search}</span>
            <kbd>Ctrl K</kbd>
          </SearchButton>
          <IconButton onClick={handleThemeToggle} aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
            {isDark ? <Sun /> : <Moon />}
          </IconButton>
          <LangButton onClick={toggleLanguage} aria-label={language === 'ko' ? 'Switch to English' : '한국어로 전환'}>
            <Globe />
            <span className="text">{language === 'ko' ? 'English' : '한국어'}</span>
          </LangButton>
          <ContactButton onClick={onContactClick}>{t.contact}</ContactButton>
          <MenuButton
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X /> : <Menu />}
          </MenuButton>
        </Right>
      </Inner>

      <MobilePanel $open={menuOpen}>
        {items.map(item => (
          <MobileItem key={item.key} href={item.href} $active={isActive(item.href)}>
            {item.label}
          </MobileItem>
        ))}
        <MobileContact onClick={() => { setMenuOpen(false); onContactClick(); }}>
          {t.contact}
        </MobileContact>
      </MobilePanel>
    </Bar>
  );
}
