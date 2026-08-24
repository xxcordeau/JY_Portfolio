'use client';

import { useState, useEffect, useRef, type ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTheme } from '../../contexts/ThemeContext';
import { Shield } from 'lucide-react';
import Header from '../Header';
import ScrollDot from '../ScrollDot';
import Contact from '../Contact';
import Chatbot from '../Chatbot';
import {
  GlobalStyle,
  AppContainer,
  AdminFloatBtn,
  setPopNav,
} from './shared';
import { ContactModalContext } from './ContactModalContext';

/**
 * 전 페이지 공통 셸.
 * Vite 시절 App.tsx의 <AppContent/>를 App Router용으로 옮긴 것 —
 * 라우팅은 Next.js가 담당하고 여기서는 children만 받는다.
 */
export default function AppShell({ children }: { children: ReactNode }) {
  const { isDark } = useTheme();
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname() || '/';

  // react-router의 useNavigationType 대체 — popstate로 뒤로/앞으로 이동 감지
  const isPopRef = useRef(false);
  useEffect(() => {
    const onPop = () => { isPopRef.current = true; };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // 브라우저 기본 스크롤 복원 끄기 (sessionStorage로 직접 제어)
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, []);

  // Save scroll position + nearest visible section anchor on every scroll
  useEffect(() => {
    const SECTION_IDS = ['projects', 'blog', 'opensource'];

    const getNearestSection = () => {
      const vh = window.innerHeight;
      let best = '';
      let bestOverlap = 0;
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) continue;
        const overlap = Math.min(vh, r.bottom) - Math.max(0, r.top);
        if (overlap > bestOverlap) { bestOverlap = overlap; best = id; }
      }
      return bestOverlap > vh * 0.25 ? best : '';
    };

    const save = () => {
      sessionStorage.setItem(`sp:${pathname}`, String(window.scrollY));
      const sectionId = getNearestSection();
      if (sectionId) {
        sessionStorage.setItem(`sp:${pathname}:section`, sectionId);
      } else {
        sessionStorage.removeItem(`sp:${pathname}:section`);
      }
    };

    window.addEventListener('scroll', save, { passive: true });
    return () => {
      // cleanup에서 save() 호출 금지:
      // 새 페이지 DOM 커밋 후 cleanup이 실행되어 scrollY가 0으로 덮어써짐.
      window.removeEventListener('scroll', save);
    };
  }, [pathname]);

  // Restore or reset scroll on navigation
  useEffect(() => {
    if (isPopRef.current) {
      isPopRef.current = false;
      setPopNav(true);
      const saved = sessionStorage.getItem(`sp:${pathname}`);
      const sectionId = sessionStorage.getItem(`sp:${pathname}:section`);
      const target = saved ? parseInt(saved, 10) : 0;

      if (target === 0) {
        setPopNav(false);
        return;
      }

      // 섹션 ID로 scrollIntoView — 데이터 로드 후 레이아웃이 변해도 정확함
      // 픽셀 fallback: 섹션이 없거나 아직 렌더링 전
      const tryScroll = () => {
        if (sectionId) {
          const el = document.getElementById(sectionId);
          if (el) {
            el.scrollIntoView({ behavior: 'instant' as ScrollBehavior, block: 'start' });
            return;
          }
        }
        window.scrollTo({ top: target, behavior: 'instant' as ScrollBehavior });
      };

      tryScroll();
      const t1 = setTimeout(tryScroll, 200);
      const t2 = setTimeout(tryScroll, 500);
      const t3 = setTimeout(tryScroll, 900);
      const t4 = setTimeout(() => { setPopNav(false); }, 1000);

      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
    } else {
      setPopNav(false);
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  const isAdminPage = pathname.startsWith('/admin');

  // body 클래스로 CSS 보호 토글
  useEffect(() => {
    if (isAdminPage) {
      document.body.classList.add('admin-page');
    } else {
      document.body.classList.remove('admin-page');
    }
    return () => document.body.classList.remove('admin-page');
  }, [isAdminPage]);

  // 포트폴리오 페이지에서 복사/우클릭/드래그 저장 방지
  useEffect(() => {
    if (isAdminPage) return;

    const block = (e: Event) => e.preventDefault();

    const blockKeys = (e: KeyboardEvent) => {
      // Ctrl/Cmd + C, X, A, S, P, U (복사·저장·프린트·소스보기)
      if ((e.ctrlKey || e.metaKey) && ['c', 'x', 'a', 's', 'p', 'u'].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
      // F12 개발자도구
      if (e.key === 'F12') e.preventDefault();
    };

    document.addEventListener('contextmenu', block);   // 우클릭 메뉴
    document.addEventListener('selectstart', block);   // 텍스트 선택
    document.addEventListener('copy', block);          // 복사
    document.addEventListener('cut', block);           // 잘라내기
    document.addEventListener('dragstart', block);     // 이미지 드래그 저장
    document.addEventListener('keydown', blockKeys);

    return () => {
      document.removeEventListener('contextmenu', block);
      document.removeEventListener('selectstart', block);
      document.removeEventListener('copy', block);
      document.removeEventListener('cut', block);
      document.removeEventListener('dragstart', block);
      document.removeEventListener('keydown', blockKeys);
    };
  }, [isAdminPage]);

  return (
    <ContactModalContext.Provider value={{ open: () => setContactModalOpen(true) }}>
      <GlobalStyle />
      <AppContainer $isDark={isDark}>
        {!isAdminPage && (
          <Header
            navigateToHome={() => router.push('/')}
            onContactClick={() => setContactModalOpen(true)}
          />
        )}
        {children}
      </AppContainer>

      {!isAdminPage && (
        <>
          <ScrollDot />
          <Contact
            isOpen={contactModalOpen}
            onOpenChange={setContactModalOpen}
          />
          <Chatbot onContactClick={() => setContactModalOpen(true)} />
          <AdminFloatBtn $isDark={isDark} onClick={() => router.push('/admin')}>
            <Shield />
            Admin
          </AdminFloatBtn>
        </>
      )}
    </ContactModalContext.Provider>
  );
}
