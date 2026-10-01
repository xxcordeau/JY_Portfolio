'use client';

import {
  createContext, useContext, useState, useEffect, useLayoutEffect, type ReactNode,
} from 'react';
import { flushSync } from 'react-dom';
import { DOT_SIZE } from '../lib/dot';

/** 테마 전환 원이 퍼져 나갈 시작점 (보통 토글 버튼의 중심) */
export type ThemeToggleOrigin = { x: number; y: number };

interface ThemeContextType {
  isDark: boolean;
  toggleDarkMode: (origin?: ThemeToggleOrigin) => void;
}

export const THEME_STORAGE_KEY = 'portfolio_dark_mode';

const ThemeContext = createContext<ThemeContextType | null>(null);

// SSR에서는 useLayoutEffect가 경고를 내므로 서버에서는 useEffect로 대체
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/** <html>의 테마 표시를 맞춘다 (layout.tsx 인라인 스크립트가 처음 설정한 값과 같은 규칙) */
function applyDocumentTheme(dark: boolean) {
  const root = document.documentElement;
  root.dataset.theme = dark ? 'dark' : 'light';
  root.style.backgroundColor = dark ? '#000' : '#fff';
}

type ViewTransitionLike = {
  ready: Promise<void>;
  finished: Promise<void>;
};
type DocumentWithViewTransition = Document & {
  startViewTransition?: (update: () => void) => ViewTransitionLike;
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  // 서버 렌더 결과와 첫 클라이언트 렌더가 일치해야 하므로 항상 라이트로 시작한다.
  // (localStorage를 초기값으로 읽으면 정적 HTML과 어긋나 hydration 불일치가 난다)
  const [isDark, setIsDark] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // 하이드레이션 직후 · 페인트 전에 저장된 설정을 반영 → 깜빡임 최소화
  useIsomorphicLayoutEffect(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved !== null) setIsDark(saved === 'true');
    } catch {
      // 프라이빗 모드 등 localStorage 접근 불가 — 기본값(라이트) 유지
    }
    setHydrated(true);
  }, []);

  // 사용자가 토글한 뒤에만 저장 (초기 마운트 시 덮어쓰기 방지)
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, String(isDark));
    } catch {
      /* 저장 실패는 무시 */
    }
    applyDocumentTheme(isDark);
  }, [isDark, hydrated]);

  /**
   * 테마 전환.
   * View Transitions API를 지원하면 origin에서 점 크기의 원이 퍼져 나가며 새 테마가 드러난다.
   * 지원하지 않거나 '동작 줄이기' 설정이면 지금처럼 즉시 바뀐다.
   */
  const toggleDarkMode = (origin?: ThemeToggleOrigin) => {
    const next = !isDark;
    const apply = () => {
      setIsDark(next);
      applyDocumentTheme(next);
    };

    const doc = document as DocumentWithViewTransition;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!doc.startViewTransition || reduceMotion) {
      apply();
      return;
    }

    const x = origin?.x ?? window.innerWidth / 2;
    const y = origin?.y ?? 0;
    // 시작점에서 가장 먼 모서리까지 덮는 반지름
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    const root = document.documentElement;
    // 요소별 background 트랜지션(0.3s)이 원 안에서 따로 재생되면 색이 탁해지므로 전환 동안 끈다
    root.classList.add('theme-switching');

    const transition = doc.startViewTransition(() => {
      // 콜백이 끝나기 전에 새 테마가 DOM에 반영돼야 '새 화면' 스냅샷이 올바르다
      flushSync(apply);
    });

    transition.ready
      .then(() => {
        root.animate(
          {
            clipPath: [
              `circle(${DOT_SIZE / 2}px at ${x}px ${y}px)`,
              `circle(${endRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 700,
            easing: 'cubic-bezier(0.65, 0, 0.35, 1)',
            pseudoElement: '::view-transition-new(root)',
          },
        );
      })
      .catch(() => { /* 전환이 건너뛰어져도 테마는 이미 바뀌어 있다 */ });

    transition.finished.finally(() => root.classList.remove('theme-switching'));
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
