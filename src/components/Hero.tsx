import { useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import faceImg from '../assets/face.png';

const HeroSection = styled.section`
  min-height: 100vh;
  position: relative;
  overflow: hidden;
`;

const Canvas = styled.canvas`
  display: block;
  width: 100%;
  height: 100vh;
`;

const SrOnly = styled.div`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

const translations = {
  ko: {
    title: '안녕하세요',
    subtitle: '디자인과 코드를 잇는 프론트엔드 개발자',
  },
  en: {
    title: 'Hello',
    subtitle: 'Frontend Developer Bridging Design and Code',
  },
};

const MAX_PARTICLES = 3000;
const SAMPLE_INTERVAL = 6; // desktop default; overridden per-call on mobile
const SPRING = 0.045;
const FRICTION = 0.82;
const SIZE_LERP = 0.08;
const JITTER = 0.1;
const HOLD_DURATION = 3000;
const MOUSE_RADIUS = 50;
const MOUSE_FORCE = 3;

interface SampledPoint {
  x: number;
  y: number;
  size: number;
}

/**
 * face.png는 투명 배경 + 얼굴만 있는 이미지.
 * alpha < 30인 투명 영역을 스킵하면 얼굴 부분만 샘플링된다.
 */
function sampleImage(
  img: HTMLImageElement,
  canvasW: number,
  canvasH: number,
  interval: number,
): SampledPoint[] {
  // Mobile: use more of the screen width for the face
  const isMobile = canvasW <= 480;
  const maxW = isMobile ? canvasW * 0.72 : Math.min(canvasW * 0.4, 420);
  const maxH = isMobile ? canvasH * 0.55 : Math.min(canvasH * 0.65, 560);
  const scale = Math.min(maxW / img.width, maxH / img.height);
  const drawW = img.width * scale;
  const drawH = img.height * scale;

  const offscreen = document.createElement('canvas');
  offscreen.width = canvasW;
  offscreen.height = canvasH;
  const ctx = offscreen.getContext('2d')!;
  const ox = (canvasW - drawW) / 2;
  const oy = (canvasH - drawH) / 2;
  ctx.drawImage(img, ox, oy, drawW, drawH);

  const imageData = ctx.getImageData(0, 0, canvasW, canvasH);
  const data = imageData.data;
  const points: SampledPoint[] = [];

  for (let y = 0; y < canvasH; y += interval) {
    for (let x = 0; x < canvasW; x += interval) {
      const idx = (y * canvasW + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const a = data[idx + 3];
      if (a < 30) continue;
      const brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
      if (brightness > 0.72) continue;
      const t = 1 - brightness / 0.72;
      const size = t * t * (interval * 1.0) + 0.4;
      points.push({ x, y, size });
    }
  }
  return points;
}

function sampleFallbackFace(canvasW: number, canvasH: number): SampledPoint[] {
  const points: SampledPoint[] = [];
  const cx = canvasW / 2;
  const cy = canvasH / 2;
  const count = 1500;
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * Math.min(canvasW, canvasH) * 0.25;
    points.push({
      x: cx + Math.cos(angle) * radius,
      y: cy + Math.sin(angle) * radius,
      size: Math.random() * 3 + 0.5,
    });
  }
  return points;
}

function sampleText(
  text: string,
  canvasW: number,
  canvasH: number,
  interval: number,
): SampledPoint[] {
  const offscreen = document.createElement('canvas');
  offscreen.width = canvasW;
  offscreen.height = canvasH;
  const ctx = offscreen.getContext('2d')!;

  const isMobile = canvasW <= 480;
  // Mobile: larger font so text fills the screen better
  let fontSize = isMobile
    ? Math.min(canvasW * 0.19, 100)
    : Math.min(canvasW * 0.12, 140);
  if (!isMobile && text.length <= 5) {
    fontSize = Math.min(canvasW * 0.16, 180);
  }
  ctx.font = `900 ${fontSize}px Pretendard, -apple-system, BlinkMacSystemFont, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#000';
  ctx.fillText(text, canvasW / 2, canvasH / 2);

  const imageData = ctx.getImageData(0, 0, canvasW, canvasH);
  const data = imageData.data;
  const points: SampledPoint[] = [];

  for (let y = 0; y < canvasH; y += interval) {
    for (let x = 0; x < canvasW; x += interval) {
      const idx = (y * canvasW + x) * 4;
      const a = data[idx + 3];
      if (a < 30) continue;
      const size = (a / 255) * (interval * 0.45) + 0.3;
      points.push({ x, y, size });
    }
  }
  return points;
}

/** 위치 기반 정렬: 같은 영역의 파티클끼리 매칭되어 이동 거리 최소화 */
function sortByPosition(arr: SampledPoint[], cx: number, cy: number) {
  arr.sort((a, b) => {
    const angleA = Math.atan2(a.y - cy, a.x - cx);
    const angleB = Math.atan2(b.y - cy, b.x - cx);
    return angleA - angleB;
  });
}

function normalizeAndPad(
  facePoints: SampledPoint[],
  textPoints: SampledPoint[],
  max: number,
  canvasW: number,
  canvasH: number,
): { face: SampledPoint[]; text: SampledPoint[] } {
  let face = facePoints;
  let text = textPoints;

  if (face.length > max) face = subsample(face, max);
  if (text.length > max) text = subsample(text, max);

  const count = Math.max(face.length, text.length);

  while (face.length < count) {
    face.push({ x: canvasW / 2, y: canvasH / 2, size: 0 });
  }
  while (text.length < count) {
    text.push({ x: canvasW / 2, y: canvasH / 2, size: 0 });
  }

  // 같은 방향의 파티클끼리 매칭 → 모서리로 날아가지 않음
  const cx = canvasW / 2;
  const cy = canvasH / 2;
  sortByPosition(face, cx, cy);
  sortByPosition(text, cx, cy);

  return { face, text };
}

function subsample(arr: SampledPoint[], target: number): SampledPoint[] {
  const result: SampledPoint[] = [];
  const step = arr.length / target;
  for (let i = 0; i < target; i++) {
    result.push(arr[Math.floor(i * step)]);
  }
  return result;
}

function shuffleArray(arr: SampledPoint[]) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
}

export default function Hero() {
  const { isDark } = useTheme();
  const { language } = useLanguage();
  const t = translations[language];

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isDarkRef = useRef(isDark);
  const animFrameRef = useRef(0);
  const isVisibleRef = useRef(true);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const initKeyRef = useRef('');

  isDarkRef.current = isDark;

  const initParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    // Denser sampling on mobile (smaller interval = more dots = tighter)
    const interval = w <= 480 ? 4 : w <= 768 ? 5 : SAMPLE_INTERVAL;
    // Slight size reduction on mobile so dots aren't oversized
    const sizeMult = w <= 480 ? 0.72 : w <= 768 ? 0.85 : 1.0;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const key = `${w}x${h}x${language}`;
    if (key === initKeyRef.current) return;
    initKeyRef.current = key;

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = 0;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = faceImg;

    const startAnimation = (faceRaw: SampledPoint[]) => {
      const textRaw = sampleText(t.title, w, h, interval);
      const { face, text } = normalizeAndPad(faceRaw, textRaw, MAX_PARTICLES, w, h);
      const count = face.length;

      const px = new Float32Array(count);
      const py = new Float32Array(count);
      const pvx = new Float32Array(count);
      const pvy = new Float32Array(count);
      const psize = new Float32Array(count);

      const faceX = new Float32Array(count);
      const faceY = new Float32Array(count);
      const faceSize = new Float32Array(count);

      const textX = new Float32Array(count);
      const textY = new Float32Array(count);
      const textSize = new Float32Array(count);

      for (let i = 0; i < count; i++) {
        faceX[i] = face[i].x;
        faceY[i] = face[i].y;
        faceSize[i] = face[i].size;

        textX[i] = text[i].x;
        textY[i] = text[i].y;
        textSize[i] = text[i].size;

        // 처음 위치: 랜덤 산개
        px[i] = w / 2 + (Math.random() - 0.5) * w * 0.8;
        py[i] = h / 2 + (Math.random() - 0.5) * h * 0.8;
        pvx[i] = 0;
        pvy[i] = 0;
        psize[i] = 0;
      }

      let nextX = faceX;
      let nextY = faceY;
      let nextSize = faceSize;
      // 파티클별 현재 타겟 (웨이브 전환용)
      const curTargetX = new Float32Array(count);
      const curTargetY = new Float32Array(count);
      const curTargetSize = new Float32Array(count);
      for (let i = 0; i < count; i++) {
        curTargetX[i] = faceX[i];
        curTargetY[i] = faceY[i];
        curTargetSize[i] = faceSize[i];
      }

      // 파티클별 전환 순서 (거리 + 랜덤으로 자연스럽게)
      const cx = w / 2, cy = h / 2;
      const waveOrder = new Float32Array(count);
      let maxVal = 0;
      for (let i = 0; i < count; i++) {
        const dx = faceX[i] - cx;
        const dy = faceY[i] - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        // 거리 70% + 랜덤 30% → 대체로 중심부터지만 불규칙하게
        waveOrder[i] = dist * 0.7 + Math.random() * maxVal * 0.5;
        if (waveOrder[i] > maxVal) maxVal = waveOrder[i];
      }
      // 두번째 패스에서 정규화
      maxVal = 0;
      for (let i = 0; i < count; i++) {
        const dx = faceX[i] - cx;
        const dy = faceY[i] - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        waveOrder[i] = dist * 0.65 + Math.random() * 300;
        if (waveOrder[i] > maxVal) maxVal = waveOrder[i];
      }
      if (maxVal > 0) {
        for (let i = 0; i < count; i++) waveOrder[i] /= maxVal;
      }

      let showingFace = true;
      let lastSwitch = performance.now();
      let transitioning = false;
      let transitionStart = 0;
      const WAVE_DURATION = 1200; // 웨이브가 퍼져나가는 시간

      function loop(now: number) {
        animFrameRef.current = requestAnimationFrame(loop);

        if (!isVisibleRef.current) return;

        // 전환 트리거
        if (!transitioning && now - lastSwitch >= HOLD_DURATION) {
          transitioning = true;
          transitionStart = now;
          if (showingFace) {
            nextX = textX;
            nextY = textY;
            nextSize = textSize;
          } else {
            nextX = faceX;
            nextY = faceY;
            nextSize = faceSize;
          }
          showingFace = !showingFace;
        }

        // 웨이브 전환: 중심→바깥 순서로 파티클별 타겟 교체
        if (transitioning) {
          const elapsed = now - transitionStart;
          const waveProgress = Math.min(elapsed / WAVE_DURATION, 1);

          for (let i = 0; i < count; i++) {
            // 중심 파티클(dist=0)이 먼저, 바깥(dist=1)이 나중에
            if (waveOrder[i] <= waveProgress) {
              curTargetX[i] = nextX[i];
              curTargetY[i] = nextY[i];
              curTargetSize[i] = nextSize[i];
            }
          }

          if (waveProgress >= 1) {
            transitioning = false;
            lastSwitch = now;
          }
        }

        const mx = mouseRef.current.x;
        const my = mouseRef.current.y;

        for (let i = 0; i < count; i++) {
          const tx = curTargetX[i];
          const ty = curTargetY[i];

          pvx[i] += (tx - px[i]) * SPRING;
          pvy[i] += (ty - py[i]) * SPRING;

          pvx[i] *= FRICTION;
          pvy[i] *= FRICTION;

          pvx[i] += (Math.random() - 0.5) * JITTER;
          pvy[i] += (Math.random() - 0.5) * JITTER;

          // 마우스 반발력
          if (mx > -9000) {
            const dx = px[i] - mx;
            const dy = py[i] - my;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < MOUSE_RADIUS && dist > 0) {
              const force = ((MOUSE_RADIUS - dist) / MOUSE_RADIUS) * MOUSE_FORCE;
              pvx[i] += (dx / dist) * force;
              pvy[i] += (dy / dist) * force;
            }
          }

          px[i] += pvx[i];
          py[i] += pvy[i];
          psize[i] += (curTargetSize[i] - psize[i]) * SIZE_LERP;
        }

        const dark = isDarkRef.current;
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = dark ? 'rgba(220,220,225,0.92)' : 'rgba(30,30,35,0.92)';

        for (let i = 0; i < count; i++) {
          const s = psize[i] * sizeMult;
          if (s < 0.12) continue;
          ctx.beginPath();
          ctx.arc(px[i], py[i], s, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    img.onload = () => {
      const faceRaw = sampleImage(img, w, h, interval);
      startAnimation(faceRaw.length > 0 ? faceRaw : sampleFallbackFace(w, h));
    };

    img.onerror = () => {
      startAnimation(sampleFallbackFace(w, h));
    };
  }, [language, t.title]);

  useEffect(() => {
    initParticles();

    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        initKeyRef.current = '';
        initParticles();
      }, 200);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = 0;
      }
      initKeyRef.current = '';
    };
  }, [initParticles]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisibleRef.current = entry.isIntersecting;
        });
      },
      { threshold: 0.05 },
    );

    observer.observe(section);
    return () => observer.unobserve(section);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const getPos = (e: MouseEvent | Touch) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = getPos(e);
    };
    const onMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) mouseRef.current = getPos(e.touches[0]);
    };
    const onTouchEnd = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseleave', onMouseLeave);
    canvas.addEventListener('touchmove', onTouchMove, { passive: true });
    canvas.addEventListener('touchend', onTouchEnd);

    return () => {
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseleave', onMouseLeave);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  return (
    <HeroSection ref={sectionRef}>
      <Canvas ref={canvasRef} />
      <SrOnly>
        <h1>{t.title}</h1>
        <p>{t.subtitle}</p>
      </SrOnly>
    </HeroSection>
  );
}
