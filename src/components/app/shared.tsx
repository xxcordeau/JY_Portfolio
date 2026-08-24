'use client';

import { useState, useEffect, useRef, type ReactNode } from 'react';
import styled, { createGlobalStyle, keyframes, css } from 'styled-components';

/**
 * 뒤로가기(POP) 내비게이션 플래그.
 * 복원 스크롤 중에는 진입 애니메이션을 건너뛰기 위해 공유한다.
 * (Vite 시절 App.tsx의 모듈 레벨 변수를 모듈로 분리한 것)
 */
let popNavFlag = false;
export const getPopNav = () => popNavFlag;
export const setPopNav = (v: boolean) => { popNavFlag = v; };

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* 관리자 페이지가 아닐 때: 텍스트 선택·이미지 드래그 저장 방지 */
  body:not(.admin-page) {
    user-select: none;
    -webkit-user-select: none;
  }

  /* 입력 필드는 선택/타이핑 허용 */
  body:not(.admin-page) input,
  body:not(.admin-page) textarea,
  body:not(.admin-page) [contenteditable] {
    user-select: text;
    -webkit-user-select: text;
  }

  body:not(.admin-page) img {
    pointer-events: none;
    -webkit-user-drag: none;
    user-drag: none;
  }
`;

export const AppContainer = styled.div<{ $isDark: boolean }>`
  width: 100%;
  min-height: 100vh;
  background: ${props => props.$isDark ? '#000000' : '#ffffff'};
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  transition: background 0.3s ease, color 0.3s ease;
  /* Do NOT set overflow-x here — any non-visible value
     (hidden/auto/clip) causes browsers to convert overflow-y:visible→auto,
     which creates a scroll container and breaks position:sticky in Hero. */
`;

export const LoadingFallback = styled.div<{ $isDark: boolean }>`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.$isDark ? '#000000' : '#ffffff'};
  color: ${props => props.$isDark ? '#86868b' : '#86868b'};
  font-size: 16px;
`;

// ─── Home page scroll-snap chapter layout ────────────────────────────────
const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const SnapWrap = styled.div<{ $inView: boolean; $snap: boolean }>`
  ${p => p.$snap && css`
    scroll-snap-align: start;
    scroll-snap-stop: normal;
  `}

  /* Fade-in when scrolled into view */
  opacity: 0;
  ${p => p.$inView && css`
    animation: ${fadeUp} 0.9s ease forwards;
  `}

  /* Disable snap + animation on mobile for natural scroll */
  @media (max-width: 768px) {
    scroll-snap-align: none;
    opacity: 1;
    animation: none;
  }
`;

/* Floating admin access button — fixed bottom-left */
export const AdminFloatBtn = styled.button<{ $isDark: boolean }>`
  position: fixed;
  bottom: 24px;
  left: 24px;
  z-index: 900;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: ${p => p.$isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'};
  border: 1px solid ${p => p.$isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'};
  border-radius: 100px;
  color: ${p => p.$isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'};
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  &:hover {
    background: ${p => p.$isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)'};
    color: ${p => p.$isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)'};
  }

  svg { width: 13px; height: 13px; }

  @media (max-width: 768px) {
    bottom: 16px;
    left: 16px;
    padding: 7px 12px;
  }
`;

export function SnapSection({ children, snap = true, id }: { children: ReactNode; snap?: boolean; id?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(() => getPopNav());

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <SnapWrap ref={ref} $inView={inView} $snap={snap} id={id}>
      {children}
    </SnapWrap>
  );
}
