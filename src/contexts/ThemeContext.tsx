'use client';

import {
  createContext, useContext, useState, useEffect, useLayoutEffect, type ReactNode,
} from 'react';

interface ThemeContextType {
  isDark: boolean;
  toggleDarkMode: () => void;
}

export const THEME_STORAGE_KEY = 'portfolio_dark_mode';

const ThemeContext = createContext<ThemeContextType | null>(null);

// SSR에서는 useLayoutEffect가 경고를 내므로 서버에서는 useEffect로 대체
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

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
    document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
  }, [isDark, hydrated]);

  const toggleDarkMode = () => setIsDark(prev => !prev);

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
