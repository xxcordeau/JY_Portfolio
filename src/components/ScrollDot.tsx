'use client';

/**
 * ScrollDot — 사이트 전체를 안내하는 '하나의 점'.
 *
 * 세 가지 모드
 *  1) handoff : 히어로에서 "허정연"이 모여 만든 점을 같은 자리에서 이어받아,
 *               스크롤에 맞춰 ABOUT eyebrow 위까지 데려간다. 이 구간에서는 숨기지 않는다.
 *  2) section : 각 섹션 eyebrow 바로 위에 점이 뚝 떨어져 안착한다.
 *  3) absorb  : data-dot-mode="center" 앵커(연락하기 버튼)에서는 중앙에 내려앉고,
 *               멈추는 순간 사라지며 DOT_ARRIVED_EVENT를 보낸다 → 버튼이 그 점에서 펼쳐진다.
 *
 * section 모드 타이밍
 *  scroll    → 점 즉시 숨김 + 예약 취소
 *  scrollend → 16ms 유예 후 land (그 사이 scroll 오면 취소)
 *  600ms     → scrollend 미지원 브라우저 fallback
 */
import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { usePathname } from 'next/navigation';
import { DOT_SIZE, dotColor, HERO_ID, P_HANDOFF, DOT_ARRIVED_EVENT } from '../lib/dot';

const DotEl = styled.div<{ $isDark: boolean }>`
  position: fixed;
  left: 0;
  top: 0;
  width: ${DOT_SIZE}px;
  height: ${DOT_SIZE}px;
  border-radius: 50%;
  background: ${p => dotColor(p.$isDark)};
  pointer-events: none;
  z-index: 400;
  will-change: transform, opacity;
  opacity: 0;
  transition: background 0.3s ease;
`;

/* 스프링 상수 — 부드럽게 수렴, 과도한 진동 없음 */
const K  = 0.16;   // 스프링 강도
const FR = 0.76;   // 감쇠 (높을수록 진동 적음)

const ABOUT_ANCHOR_ID = 'dot-about';

const ANCHOR_IDS = [
  ABOUT_ANCHOR_ID,
  'dot-skills',
  'dot-clients',

  'dot-freelance',
  'dot-personal',
  'dot-blog',
  'dot-opensource',
  'dot-contact',
];

/** transform 영향을 받지 않는 문서 기준 좌표 (섹션 fade-up 애니메이션 중에도 흔들리지 않게) */
function docOffset(el: HTMLElement): { top: number; left: number } {
  let top = 0;
  let left = 0;
  let node: HTMLElement | null = el;
  while (node) {
    top += node.offsetTop;
    left += node.offsetLeft;
    node = node.offsetParent as HTMLElement | null;
  }
  return { top, left };
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

type HandoffState =
  | { phase: 'before' }
  | { phase: 'after'; overshoot: number }
  | { phase: 'during'; x: number; y: number };

/**
 * 히어로 → ABOUT 구간 판정.
 *  start: 히어로 진행도가 P_HANDOFF가 되는 scrollY (캔버스가 점을 넘겨주는 지점)
 *  end  : ABOUT 섹션 위쪽이 화면 맨 위에 닿는 scrollY (점이 eyebrow 위에 안착하는 지점)
 */
function getHandoff(): HandoffState | null {
  const hero = document.getElementById(HERO_ID);
  const anchor = document.getElementById(ABOUT_ANCHOR_ID);
  const section = anchor?.closest('section') as HTMLElement | null;
  if (!hero || !anchor || !section) return null;

  const vh = window.innerHeight;
  const scrollable = hero.offsetHeight - vh;
  if (scrollable <= 0) return null;

  const scrollY = window.scrollY;
  const start = docOffset(hero).top + scrollable * P_HANDOFF;
  const end = docOffset(section).top;
  if (end <= start) return null;

  if (scrollY < start) return { phase: 'before' };
  if (scrollY > end + 2) return { phase: 'after', overshoot: scrollY - end };

  const t = easeInOutCubic(Math.min(1, (scrollY - start) / (end - start)));
  const a = docOffset(anchor);

  // 출발: 히어로 캔버스의 중심 점 (캔버스 폭 = innerWidth)
  const fromX = window.innerWidth / 2 - DOT_SIZE / 2;
  const fromY = vh / 2 - DOT_SIZE / 2;
  // 도착: ABOUT이 맨 위에 닿았을 때의 eyebrow 위 8px (section 모드 안착 위치와 동일)
  const toX = a.left + anchor.offsetWidth / 2 - DOT_SIZE / 2;
  const toY = a.top - end - DOT_SIZE - 8;

  return {
    phase: 'during',
    x: fromX + (toX - fromX) * t,
    y: fromY + (toY - fromY) * t,
  };
}

function resolveTarget(): { el: HTMLElement; x: number; y: number } | null {
  const vh = window.innerHeight;
  let best: HTMLElement | null = null;
  let bestOverlap = 0;
  let centerPick: HTMLElement | null = null;

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

    // 버튼처럼 중앙에 앉는 앵커는 섹션이 짧을 수 있다(모바일 마지막 섹션 ≈ 화면의 40%).
    // 화면 대비가 아니라 '자기 섹션이 얼마나 보이는지'로 판단해, 대부분 보이면 우선한다.
    if (anchor.dataset.dotMode === 'center' && overlap / Math.min(r.height, vh) >= 0.6) {
      const ar = anchor.getBoundingClientRect();
      if (ar.top >= 0 && ar.bottom <= vh) centerPick = anchor;
    }
  }

  if (centerPick) {
    best = centerPick;
  } else if (!best || bestOverlap < vh * 0.40) {
    return null;
  }

  const r = best.getBoundingClientRect();
  const x = r.left + r.width / 2 - DOT_SIZE / 2;

  // 버튼처럼 '중앙'에 내려앉는 앵커
  if (best.dataset.dotMode === 'center') {
    return { el: best, x, y: r.top + r.height / 2 - DOT_SIZE / 2 };
  }

  return {
    el: best,
    x,
    y: r.top - DOT_SIZE - 8,   // eyebrow 위 8px — 아래로 절대 안 내려감
  };
}

export default function ScrollDot() {
  const { isDark } = useTheme();
  const pathname   = usePathname() || '';
  const dotRef     = useRef<HTMLDivElement>(null);

  const pos           = useRef({ x: 0, y: -60, vx: 0, vy: 0 });
  const tgt           = useRef({ x: 0, y: 0 });
  const opacity       = useRef({ val: 0, target: 0 });
  const raf           = useRef(0);
  const currentAnchor = useRef<HTMLElement | null>(null);
  const handoffActive = useRef(false);
  const pathRef       = useRef(pathname);
  pathRef.current = pathname;

  /* RAF 루프 */
  useEffect(() => {
    const p = pos.current, t = tgt.current, o = opacity.current;

    function loop() {
      raf.current = requestAnimationFrame(loop);

      /* ── 1) handoff: 히어로 → ABOUT ── */
      const hand = pathRef.current === '/' ? getHandoff() : null;

      if (hand?.phase === 'during') {
        if (!handoffActive.current) {
          // 진입한 프레임: 캔버스 점이 있던 자리에서 그대로 이어받는다
          handoffActive.current = true;
          p.x = hand.x; p.y = hand.y; p.vx = 0; p.vy = 0;
          currentAnchor.current = document.getElementById(ABOUT_ANCHOR_ID);
        }
        t.x = hand.x;
        t.y = hand.y;
        o.target = 1;
        o.val = 1;
      } else if (handoffActive.current) {
        handoffActive.current = false;
        // ABOUT 바로 아래로 살짝 넘어간 경우만 안착 위치에 그대로 남긴다.
        // 위로 빠져나가면(히어로 캔버스가 다시 점을 그림) 또는 메뉴 클릭처럼
        // 멀리 한 번에 이동한 경우에는 엉뚱한 자리에 남지 않도록 즉시 숨긴다.
        const justPastAbout =
          hand?.phase === 'after' && hand.overshoot < window.innerHeight * 0.1;
        if (!justPastAbout) {
          o.val = 0; o.target = 0;
        }
      }

      /* ── 물리 ── */
      p.vx += (t.x - p.x) * K; p.vx *= FR; p.x += p.vx;
      p.vy += (t.y - p.y) * K; p.vy *= FR; p.y += p.vy;

      /* fade-in (fade-out은 scroll 핸들러가 즉시 0으로) */
      if (o.target > o.val) o.val += (o.target - o.val) * 0.12;

      /* ── 3) absorb: 버튼 중앙에 멈추면 점은 버튼 속으로 ── */
      const a = currentAnchor.current;
      if (
        !handoffActive.current &&
        a && a.dataset.dotMode === 'center' && a.dataset.dotState === 'waiting' &&
        o.target === 1 && o.val > 0.9 &&
        Math.abs(t.x - p.x) < 0.8 && Math.abs(t.y - p.y) < 0.8 &&
        Math.abs(p.vx) + Math.abs(p.vy) < 0.4
      ) {
        o.val = 0; o.target = 0;
        a.dispatchEvent(new CustomEvent(DOT_ARRIVED_EVENT));
      }

      const dot = dotRef.current;
      if (dot) {
        dot.style.transform = `translate(${p.x.toFixed(1)}px,${p.y.toFixed(1)}px)`;
        dot.style.opacity   = o.val.toFixed(3);
      }
    }

    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  /* ── 2) section: 스크롤 이벤트 ── */
  useEffect(() => {
    const p = pos.current, t = tgt.current, o = opacity.current;

    if (pathname !== '/') {
      o.val = 0; o.target = 0;
      currentAnchor.current = null;
      handoffActive.current = false;
      return;
    }

    function land() {
      // handoff 구간은 RAF가 직접 제어 (ref가 한 프레임 늦을 수 있어 위치로 다시 판정)
      if (getHandoff()?.phase === 'during') return;

      if (window.scrollY < window.innerHeight * 0.35) {
        o.val = 0; o.target = 0;
        currentAnchor.current = null;
        return;
      }

      const found = resolveTarget();
      if (!found) return;

      const isCenter = found.el.dataset.dotMode === 'center';

      // 이미 점을 받아 펼쳐진 버튼 위에는 점을 다시 띄우지 않는다
      if (isCenter && found.el.dataset.dotState === 'open') {
        currentAnchor.current = found.el;
        o.val = 0; o.target = 0;
        return;
      }

      // 버튼이 다시 접힌 뒤 돌아온 경우에도 새로 떨어뜨린다
      const isNew = found.el !== currentAnchor.current || (isCenter && o.val < 0.05);
      currentAnchor.current = found.el;

      t.x = found.x;
      t.y = found.y;

      if (isNew) {
        /* 새 섹션: 위에서 낙하 */
        p.x = t.x;
        p.y = t.y - 52;
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
      // handoff 구간에서는 점이 스크롤을 따라 움직여야 하므로 숨기지 않는다
      if (!handoffActive.current) {
        o.val = 0; o.target = 0;
      }

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
  }, [pathname]);

  return <DotEl ref={dotRef} $isDark={isDark} aria-hidden="true" />;
}
