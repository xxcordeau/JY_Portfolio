/**
 * ScrollDot — 각 섹션 eyebrow 바로 위에 점이 뚝 떨어져 안착.
 *
 * 타이밍:
 *  scroll    → 점 즉시 숨김 + 예약 취소
 *  scrollend → 16ms 유예 후 land (그 사이 scroll 오면 취소)
 *  600ms     → scrollend 미지원 브라우저 fallback
 *
 * 위치: y = r.top - DOT_SIZE - 8 (eyebrow 위, 콘텐츠 아래로 내려가지 않음)
 */
import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { useLocation } from 'react-router-dom';

const DOT_SIZE = 10;

const DotEl = styled.div<{ $isDark: boolean }>`
  position: fixed;
  left: 0;
  top: 0;
  width: ${DOT_SIZE}px;
  height: ${DOT_SIZE}px;
  border-radius: 50%;
  background: ${p => p.$isDark ? 'rgba(220,220,222,0.95)' : 'rgba(29,29,31,0.92)'};
  pointer-events: none;
  z-index: 400;
  will-change: transform, opacity;
  opacity: 0;
  transition: background 0.3s ease;
`;

/* 스프링 상수 — 부드럽게 수렴, 과도한 진동 없음 */
const K  = 0.16;   // 스프링 강도
const FR = 0.76;   // 감쇠 (높을수록 진동 적음)

const ANCHOR_IDS = [
  'dot-about',
  'dot-skills',
  'dot-experience',
  'dot-projects',
  'dot-blog',
  'dot-opensource',
];

function resolveTarget(): { el: HTMLElement; x: number; y: number } | null {
  const vh = window.innerHeight;
  let best: HTMLElement | null = null;
  let bestOverlap = 0;

  for (const id of ANCHOR_IDS) {
    const anchor = document.getElementById(id) as HTMLElement | null;
    if (!anchor) continue;

    const section = (anchor.closest('section') as HTMLElement | null) ?? anchor;
    const r = section.getBoundingClientRect();
    if (r.bottom < 0 || r.top > vh) continue;

    const overlap = Math.min(vh, r.bottom) - Math.max(0, r.top);
    if (overlap > bestOverlap) {
      bestOverlap = overlap;
      best = anchor;
    }
  }

  if (!best || bestOverlap < vh * 0.40) return null;

  const r = best.getBoundingClientRect();
  return {
    el: best,
    x: r.left + r.width / 2 - DOT_SIZE / 2,
    y: r.top - DOT_SIZE - 8,   // eyebrow 위 8px — 아래로 절대 안 내려감
  };
}

export default function ScrollDot() {
  const { isDark } = useTheme();
  const location   = useLocation();
  const dotRef     = useRef<HTMLDivElement>(null);

  const pos           = useRef({ x: 0, y: -60, vx: 0, vy: 0 });
  const tgt           = useRef({ x: 0, y: 0 });
  const opacity       = useRef({ val: 0, target: 0 });
  const raf           = useRef(0);
  const currentAnchor = useRef<HTMLElement | null>(null);

  /* RAF 루프 */
  useEffect(() => {
    const p = pos.current, t = tgt.current, o = opacity.current;

    function loop() {
      raf.current = requestAnimationFrame(loop);

      p.vx += (t.x - p.x) * K; p.vx *= FR; p.x += p.vx;
      p.vy += (t.y - p.y) * K; p.vy *= FR; p.y += p.vy;

      /* fade-in (fade-out은 scroll 핸들러가 즉시 0으로) */
      if (o.target > o.val) o.val += (o.target - o.val) * 0.12;

      const dot = dotRef.current;
      if (dot) {
        dot.style.transform = `translate(${p.x.toFixed(1)}px,${p.y.toFixed(1)}px)`;
        dot.style.opacity   = o.val.toFixed(3);
      }
    }

    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  /* 스크롤 이벤트 */
  useEffect(() => {
    const p = pos.current, t = tgt.current, o = opacity.current;

    if (location.pathname !== '/') {
      o.val = 0; o.target = 0;
      currentAnchor.current = null;
      return;
    }

    function land() {
      if (window.scrollY < window.innerHeight * 0.35) {
        o.val = 0; o.target = 0;
        currentAnchor.current = null;
        return;
      }

      const found = resolveTarget();
      if (!found) return;

      const isNew = found.el !== currentAnchor.current;
      currentAnchor.current = found.el;

      t.x = found.x;
      t.y = found.y;

      if (isNew) {
        /* 새 섹션: 위에서 낙하 */
        p.x = t.x;
        p.y = t.y - 52;   // 52px 위에서 출발 (72px → 52px: 덜 과장됨)
        p.vx = 0; p.vy = 0;
      }

      o.target = 1;
    }

    let pendingLand: ReturnType<typeof setTimeout> | null = null;
    let fallbackTimer: ReturnType<typeof setTimeout> | null = null;

    /* scroll 이벤트가 없는 16ms 뒤 land — stray scroll 방어 */
    function scheduleLand() {
      if (pendingLand) clearTimeout(pendingLand);
      pendingLand = setTimeout(() => {
        pendingLand = null;
        land();
      }, 16);
    }

    function onScroll() {
      o.val = 0; o.target = 0;

      if (pendingLand) { clearTimeout(pendingLand); pendingLand = null; }
      if (fallbackTimer) clearTimeout(fallbackTimer);
      fallbackTimer = setTimeout(scheduleLand, 600);
    }

    function onScrollEnd() {
      if (fallbackTimer) { clearTimeout(fallbackTimer); fallbackTimer = null; }
      scheduleLand();
    }

    window.addEventListener('scroll',    onScroll,    { passive: true });
    window.addEventListener('scrollend', onScrollEnd, { passive: true });

    const initTimer = setTimeout(land, 500);

    return () => {
      window.removeEventListener('scroll',    onScroll);
      window.removeEventListener('scrollend', onScrollEnd);
      if (pendingLand)   clearTimeout(pendingLand);
      if (fallbackTimer) clearTimeout(fallbackTimer);
      clearTimeout(initTimer);
    };
  }, [location.pathname]);

  return <DotEl ref={dotRef} $isDark={isDark} />;
}
