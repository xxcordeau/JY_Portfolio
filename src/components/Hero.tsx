import { useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import faceImg from '../assets/face.png';

/* ── Layout: tall container + sticky canvas ── */
const HeroContainer = styled.div<{ $isDark: boolean }>`
  height: 350vh;
  position: relative;
  background: ${p => (p.$isDark ? '#000000' : '#ffffff')};
  transition: background 0.3s ease;

  @media (max-width: 768px) {
    height: 250vh;
  }
`;

const StickyFrame = styled.div<{ $isDark: boolean }>`
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
  background: ${p => (p.$isDark ? '#000000' : '#ffffff')};
  transition: background 0.3s ease;
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

/* ── Constants ── */
const MAX_PARTICLES = 5000;
const SAMPLE_INTERVAL = 4;
const MOUSE_RADIUS = 50;
const MOUSE_FORCE = 3;

const SPRING_IDLE = 0.045;
const SPRING_SCROLL = 0.1;
const FRICTION = 0.78;
const SIZE_LERP = 0.1;
const JITTER = 0.06;

// Idle cycling: face ↔ greeting
const CYCLE_HALF = 3500; // ms per half-cycle
const MORPH_DURATION = 1200; // ms for morphing transition

// Scroll-driven phase boundaries (progress 0→1)
const P_FACE_HOLD = 0.10; // Face stays visible at start of scroll
const P_SCATTER_END = 0.55;
const P_LINES_START = 0.35;
const P_LINES_END = 0.80;

/* ── Types ── */
interface SampledPoint {
  x: number;
  y: number;
  size: number;
}

/* ── Utilities ── */
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function subsample(arr: SampledPoint[], target: number): SampledPoint[] {
  const result: SampledPoint[] = [];
  const step = arr.length / target;
  for (let i = 0; i < target; i++) {
    result.push(arr[Math.floor(i * step)]);
  }
  return result;
}

/* ── Sampling: face image → dots ── */
function sampleImage(
  img: HTMLImageElement,
  canvasW: number,
  canvasH: number,
  interval: number,
): SampledPoint[] {
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
  for (let i = 0; i < 1500; i++) {
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

/* ── Sampling: greeting text → dots ── */
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
  const fontSize = isMobile
    ? Math.min(canvasW * 0.16, 75)
    : Math.min(canvasW * 0.075, 100);

  ctx.font = `700 ${fontSize}px Pretendard, -apple-system, BlinkMacSystemFont, sans-serif`;
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
      if (data[idx + 3] < 30) continue;
      const size = 1.5;
      points.push({ x, y, size });
    }
  }
  return points;
}

/* ── Sampling: multi-line text → random-sized circles (full-screen) ── */
function sampleConstellation(
  lines: string[],
  canvasW: number,
  canvasH: number,
): { points: SampledPoint[]; connections: [number, number][] } {
  const offscreen = document.createElement('canvas');
  offscreen.width = canvasW;
  offscreen.height = canvasH;
  const ctx = offscreen.getContext('2d')!;

  const isMobile = canvasW <= 480;
  const fontFamily = 'Pretendard, -apple-system, BlinkMacSystemFont, sans-serif';

  // Large font that fills the viewport with safe padding (꽉차게 but no clip)
  const targetW = canvasW * 0.85;
  const targetH = canvasH * 0.62;

  // Start big and auto-shrink to fit both width and height
  let fontSize = isMobile
    ? Math.min(canvasW * 0.50, 450)
    : Math.min(canvasW * 0.40, 700);

  // Measure each line and find the widest
  ctx.font = `900 ${fontSize}px ${fontFamily}`;
  let maxLineW = 0;
  for (const line of lines) {
    const w = ctx.measureText(line).width;
    if (w > maxLineW) maxLineW = w;
  }

  // Shrink to fit width
  if (maxLineW > targetW) {
    fontSize *= targetW / maxLineW;
    ctx.font = `900 ${fontSize}px ${fontFamily}`;
  }

  // Shrink to fit height (lineHeight ≈ 1.15 × fontSize)
  const lineHeight = fontSize * 1.15;
  const totalTextH = lineHeight * lines.length;
  if (totalTextH > targetH) {
    fontSize *= targetH / totalTextH;
    ctx.font = `900 ${fontSize}px ${fontFamily}`;
  }

  // Render each line centered
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#000';

  const updatedLineH = fontSize * 1.2;
  const totalH = updatedLineH * lines.length;
  // Center vertically (no offset — previous 3% push caused bottom clip)
  const startY = (canvasH - totalH) / 2 + updatedLineH / 2;

  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], canvasW / 2, startY + i * updatedLineH);
  }

  const imageData = ctx.getImageData(0, 0, canvasW, canvasH);
  const data = imageData.data;

  // Denser interval for tightly packed dots (촘촘하게)
  const interval = Math.max(isMobile ? 4 : 5, Math.floor(fontSize / 50));
  const jitter = interval * 0.3;
  const points: SampledPoint[] = [];

  for (let y = 0; y < canvasH; y += interval) {
    for (let x = 0; x < canvasW; x += interval) {
      const idx = (y * canvasW + x) * 4;
      if (data[idx + 3] < 30) continue;
      const size = 0.5 + Math.random() * 2.2;
      const jx = x + (Math.random() - 0.5) * jitter;
      const jy = y + (Math.random() - 0.5) * jitter;
      points.push({ x: jx, y: jy, size });
    }
  }

  return { points, connections: [] };
}

/* ── Nearest-neighbor matcher ── */
function matchNearestPoints(
  source: SampledPoint[],
  targetCount: number,
  cx: number,
  cy: number,
  w: number,
  h: number,
): SampledPoint[] {
  if (source.length >= targetCount) {
    return subsample(source, targetCount);
  }
  // Pad with invisible dots scattered around center
  const padded = [...source];
  while (padded.length < targetCount) {
    padded.push({
      x: cx + (Math.random() - 0.5) * w * 0.5,
      y: cy + (Math.random() - 0.5) * h * 0.5,
      size: 0,
    });
  }
  return padded;
}

/* ── Component ── */
const translations = {
  ko: {
    greeting: '안녕하세요',
    subtitle: '디자인과 코드를 잇는 프론트엔드 개발자',
  },
  en: {
    greeting: 'Hello',
    subtitle: 'Frontend Developer Bridging Design and Code',
  },
};

export default function Hero() {
  const { isDark } = useTheme();
  const { language } = useLanguage();
  const t = translations[language];

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDarkRef = useRef(isDark);
  const animFrameRef = useRef(0);
  const isVisibleRef = useRef(true);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const progressRef = useRef(0);
  const initKeyRef = useRef('');

  isDarkRef.current = isDark;

  /* ── Scroll progress tracker + snap lock ── */
  useEffect(() => {
    // Inject a style element to kill scroll-snap during hero animation.
    // Start with snap DISABLED to prevent the browser from jumping past
    // the hero section before scroll events can fire (race condition).
    const snapKill = document.createElement('style');
    snapKill.id = 'hero-snap-kill';
    snapKill.textContent = 'html { scroll-snap-type: none !important; }';
    document.head.appendChild(snapKill);

    const onScroll = () => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const scrollable = container.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const p = Math.max(0, Math.min(1, -rect.top / scrollable));
      progressRef.current = p;

      // Only re-enable scroll-snap after hero animation is complete
      if (p >= 0.98) {
        if (snapKill.textContent) snapKill.textContent = '';
      } else {
        if (!snapKill.textContent) {
          snapKill.textContent =
            'html { scroll-snap-type: none !important; }';
        }
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      snapKill.remove();
    };
  }, []);

  /* ── Particle system init ── */
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
      /* ── Sample greeting text + constellation ── */
      const greetingText = language === 'ko' ? '안녕하세요' : 'Hello';
      const greetRaw = sampleText(greetingText, w, h, SAMPLE_INTERVAL);
      const constellationLines = language === 'ko'
        ? ['허정연', '입니다']
        : ["I'm", 'Jeongyeon'];
      const constellation = sampleConstellation(constellationLines, w, h);

      /* ── Normalize face particles ── */
      const facePoints =
        faceRaw.length > MAX_PARTICLES
          ? subsample(faceRaw, MAX_PARTICLES)
          : faceRaw;
      const count = facePoints.length;
      const cx = w / 2;
      const cy = h / 2;

      /* ── Match greeting text to same particle count ── */
      const greetPoints = matchNearestPoints(greetRaw, count, cx, cy, w, h);

      /* ── Allocate typed arrays ── */
      const faceX = new Float32Array(count);
      const faceY = new Float32Array(count);
      const faceSize = new Float32Array(count);

      const greetX = new Float32Array(count);
      const greetY = new Float32Array(count);
      const greetSize = new Float32Array(count);

      const scatterX = new Float32Array(count);
      const scatterY = new Float32Array(count);
      const scatterSize = new Float32Array(count);

      const depth = new Float32Array(count);
      const faceDist = new Float32Array(count); // normalized dist from center (0=center, 1=edge)
      const greetCDist = new Float32Array(count); // normalized dist from center in greeting space
      const morphAngle = new Float32Array(count); // per-particle radial angle for bloom
      const morphRand = new Float32Array(count); // per-particle random strength

      const px = new Float32Array(count);
      const py = new Float32Array(count);
      const pvx = new Float32Array(count);
      const pvy = new Float32Array(count);
      const psize = new Float32Array(count);

      /* ── Fill positions ── */
      for (let i = 0; i < count; i++) {
        faceX[i] = facePoints[i].x;
        faceY[i] = facePoints[i].y;
        faceSize[i] = facePoints[i].size;

        greetX[i] = greetPoints[i].x;
        greetY[i] = greetPoints[i].y;
        greetSize[i] = greetPoints[i].size;

        depth[i] = Math.random();
        // Random angle for circular bloom cloud during morph transitions
        morphAngle[i] = Math.random() * Math.PI * 2;
        morphRand[i] = 0.3 + Math.random() * 0.7; // 0.3–1.0 radius variation

        // Scatter: push outward naturally (no edge clamping → organic shape)
        const dx = faceX[i] - cx;
        const dy = faceY[i] - cy;
        const angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.6;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const pushFactor = 2.5 + (1 - depth[i]) * 4;
        const pushDist = dist * pushFactor + Math.random() * 200 + 80;

        // Let particles fly beyond viewport — canvas naturally clips them
        scatterX[i] = cx + Math.cos(angle) * pushDist;
        scatterY[i] = cy + Math.sin(angle) * pushDist;
        scatterSize[i] = faceSize[i] * (1.5 + (1 - depth[i]) * 2.5);

        // Start at random positions → spring pulls them to face
        px[i] = cx + (Math.random() - 0.5) * w * 0.8;
        py[i] = cy + (Math.random() - 0.5) * h * 0.8;
        pvx[i] = 0;
        pvy[i] = 0;
        psize[i] = 0;
      }

      // Compute normalized distance from center for wave-morph stagger
      let maxFDist = 0;
      for (let i = 0; i < count; i++) {
        const fdx = faceX[i] - cx;
        const fdy = faceY[i] - cy;
        faceDist[i] = Math.sqrt(fdx * fdx + fdy * fdy);
        if (faceDist[i] > maxFDist) maxFDist = faceDist[i];
      }
      if (maxFDist > 0) {
        for (let i = 0; i < count; i++) faceDist[i] /= maxFDist;
      }

      // Compute normalized distance from center in greeting space
      let maxGDist = 0;
      for (let i = 0; i < count; i++) {
        const gdx = greetX[i] - cx;
        const gdy = greetY[i] - cy;
        greetCDist[i] = Math.sqrt(gdx * gdx + gdy * gdy);
        if (greetCDist[i] > maxGDist) maxGDist = greetCDist[i];
      }
      if (maxGDist > 0) {
        for (let i = 0; i < count; i++) greetCDist[i] /= maxGDist;
      }

      /* ── Map constellation points → scatter positions ── */
      // For constellation-mapped particles, override their scatter position
      // to the constellation text position → lines between them form "허정연"
      const cpCount = constellation.points.length;
      const cpToParticleIdx = new Int32Array(cpCount);
      const isMapped = new Uint8Array(count);

      for (let cp = 0; cp < cpCount; cp++) {
        const cpx = constellation.points[cp].x;
        const cpy = constellation.points[cp].y;
        let bestDist = Infinity;
        let bestIdx = 0;

        for (let i = 0; i < count; i++) {
          if (isMapped[i]) continue;
          const ddx = faceX[i] - cpx;
          const ddy = faceY[i] - cpy;
          const d = ddx * ddx + ddy * ddy;
          if (d < bestDist) {
            bestDist = d;
            bestIdx = i;
          }
        }

        isMapped[bestIdx] = 1;
        cpToParticleIdx[cp] = bestIdx;

        // Override scatter position → constellation text position
        scatterX[bestIdx] = cpx;
        scatterY[bestIdx] = cpy;
        scatterSize[bestIdx] = constellation.points[cp].size;
      }

      // Line connections mapped to particle indices
      const lineConns: [number, number][] = constellation.connections.map(
        ([a, b]) => [cpToParticleIdx[a], cpToParticleIdx[b]],
      );

      /* ── Animation loop ── */
      const startTime = performance.now();

      function loop() {
        animFrameRef.current = requestAnimationFrame(loop);
        if (!isVisibleRef.current) return;

        const progress = progressRef.current;
        const now = performance.now() - startTime;

        /* ── Compute per-particle targets ── */
        for (let i = 0; i < count; i++) {
          let tx: number, ty: number, ts: number;

          if (progress < 0.02) {
            // ── Idle: cycle face ↔ greeting ──
            const fullCycle = CYCLE_HALF * 2;
            const cyclePos = (now % fullCycle) / fullCycle; // 0→1
            // 0→0.5 = face, 0.5→1.0 = greeting
            // morphT: 0 = fully face, 1 = fully greeting
            let morphT: number;
            if (cyclePos < 0.5) {
              // Face phase with morph-out at end
              const facePhaseT = cyclePos / 0.5; // 0→1 within face phase
              const morphWindow = MORPH_DURATION / fullCycle;
              if (facePhaseT > 1 - morphWindow * 2) {
                morphT = easeInOutCubic(
                  (facePhaseT - (1 - morphWindow * 2)) / (morphWindow * 2),
                );
              } else {
                morphT = 0;
              }
            } else {
              // Greeting phase with morph-out at end
              const greetPhaseT = (cyclePos - 0.5) / 0.5;
              const morphWindow = MORPH_DURATION / fullCycle;
              if (greetPhaseT > 1 - morphWindow * 2) {
                morphT =
                  1 -
                  easeInOutCubic(
                    (greetPhaseT - (1 - morphWindow * 2)) / (morphWindow * 2),
                  );
              } else {
                morphT = 1;
              }
            }

            // Bidirectional center-out wave:
            // Forward (face→greeting): center-of-face particles lead
            // Backward (greeting→face): center-of-greeting particles lead
            // Crossfade the distance source so the wave origin always
            // tracks the currently visible layout.
            const STAGGER = 0.55;
            const crossfade = easeInOutCubic(
              Math.min(1, Math.max(0, (morphT - 0.3) / 0.4)),
            );
            // faceDist: 0=center → high pMorphT → leads forward
            // 1 - greetCDist: center-of-greet→1 → low pMorphT → returns first
            const d = lerp(faceDist[i], 1 - greetCDist[i], crossfade);
            const rawP = morphT * (1 + STAGGER) - d * STAGGER;
            const pMorphT = easeInOutCubic(
              Math.max(0, Math.min(1, rawP)),
            );

            tx = lerp(faceX[i], greetX[i], pMorphT);
            ty = lerp(faceY[i], greetY[i], pMorphT);

            // Circular cloud attractor: at mid-morph, almost fully override
            // the interpolated position with a random circular position so
            // the transition looks like an organic circular burst, not a
            // rectangular text silhouette.
            const bloom = Math.sin(pMorphT * Math.PI);
            const baseR = Math.min(w, h) * 0.28;
            const circR = (baseR * 0.35 + baseR * faceDist[i]) * morphRand[i];
            const circX = cx + Math.cos(morphAngle[i]) * circR;
            const circY = cy + Math.sin(morphAngle[i]) * circR;
            tx = lerp(tx, circX, bloom * 0.93);
            ty = lerp(ty, circY, bloom * 0.93);

            // Accelerated size transition: padding particles (greetSize=0)
            // fade out faster so they don't linger as visible scattered dots
            ts = lerp(faceSize[i], greetSize[i], Math.min(1, morphT * 1.6));
          } else if (progress <= P_FACE_HOLD) {
            // ── Face holds briefly at start of scroll ──
            tx = faceX[i];
            ty = faceY[i];
            ts = faceSize[i];
          } else if (progress <= P_SCATTER_END) {
            // ── Scatter phase ──
            const rawT =
              (progress - P_FACE_HOLD) / (P_SCATTER_END - P_FACE_HOLD);
            const depthFactor = 0.3 + depth[i] * 0.7;
            const et = easeInOutCubic(Math.min(1, rawT / depthFactor));
            tx = lerp(faceX[i], scatterX[i], et);
            ty = lerp(faceY[i], scatterY[i], et);
            ts = lerp(faceSize[i], scatterSize[i], et);
          } else {
            // ── Post-scatter: constellation stays, stars fly away ──
            // Non-constellation particles continue outward and fade to 0,
            // like zooming through a star field — only "허정연" remains.
            const fadeT = Math.min(
              1,
              (progress - P_SCATTER_END) / (P_LINES_END - P_SCATTER_END),
            );
            const easedFade = easeInOutCubic(fadeT);

            if (isMapped[i]) {
              // Constellation dot: hold at text position
              tx = scatterX[i];
              ty = scatterY[i];
              ts = scatterSize[i];
            } else {
              // Star particle: keep flying outward + shrink to invisible
              const pushAngle = Math.atan2(
                scatterY[i] - cy,
                scatterX[i] - cx,
              );
              const extraPush = easedFade * 500;
              tx = scatterX[i] + Math.cos(pushAngle) * extraPush;
              ty = scatterY[i] + Math.sin(pushAngle) * extraPush;
              ts = scatterSize[i] * (1 - easedFade);
            }
          }

          /* ── Spring physics ── */
          // When returning from scatter, particles are far from targets.
          // Add distance-based boost so they snap back quickly, then
          // settle to gentle SPRING_IDLE once close.
          let springK: number;
          if (progress < 0.02) {
            const distSq =
              (tx - px[i]) * (tx - px[i]) + (ty - py[i]) * (ty - py[i]);
            const boost = Math.min(Math.sqrt(distSq) * 0.0005, 0.09);
            springK = SPRING_IDLE + boost;
          } else {
            springK = SPRING_SCROLL;
          }
          pvx[i] += (tx - px[i]) * springK;
          pvy[i] += (ty - py[i]) * springK;
          pvx[i] *= FRICTION;
          pvy[i] *= FRICTION;
          pvx[i] += (Math.random() - 0.5) * JITTER;
          pvy[i] += (Math.random() - 0.5) * JITTER;

          // Mouse repulsion (idle only)
          if (progress < 0.02) {
            const mx = mouseRef.current.x;
            const my = mouseRef.current.y;
            if (mx > -9000) {
              const mdx = px[i] - mx;
              const mdy = py[i] - my;
              const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
              if (mDist < MOUSE_RADIUS && mDist > 0) {
                const force =
                  ((MOUSE_RADIUS - mDist) / MOUSE_RADIUS) * MOUSE_FORCE;
                pvx[i] += (mdx / mDist) * force;
                pvy[i] += (mdy / mDist) * force;
              }
            }
          }

          px[i] += pvx[i];
          py[i] += pvy[i];
          psize[i] += (ts - psize[i]) * SIZE_LERP;
        }

        /* ── Draw ── */
        const dark = isDarkRef.current;
        ctx.clearRect(0, 0, w, h);

        // Constellation lines (fade in during scatter/settled phase)
        const lineAlpha = Math.max(
          0,
          Math.min(
            1,
            (progress - P_LINES_START) / (P_LINES_END - P_LINES_START),
          ),
        );
        if (lineAlpha > 0.01) {
          const strokeAlpha = lineAlpha * (dark ? 0.6 : 0.5);
          ctx.strokeStyle = dark
            ? `rgba(220,220,225,${strokeAlpha})`
            : `rgba(30,30,35,${strokeAlpha})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          for (let l = 0; l < lineConns.length; l++) {
            const a = lineConns[l][0];
            const b = lineConns[l][1];
            if (psize[a] < 0.3 || psize[b] < 0.3) continue;
            ctx.moveTo(px[a], py[a]);
            ctx.lineTo(px[b], py[b]);
          }
          ctx.stroke();
        }

        // Dots
        ctx.fillStyle = dark
          ? 'rgba(220,220,225,0.92)'
          : 'rgba(30,30,35,0.92)';
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

    // Explicitly load Pretendard 900 (ExtraBold/Black) for constellation text.
    // Pretendard CSS is already linked in index.html via CDN, but we need to
    // trigger the browser to download the specific weight + glyph subsets.
    const fontReady = Promise.race([
      Promise.all([
        document.fonts.load('900 48px Pretendard', '허정연입니다'),
        document.fonts.load('900 48px Pretendard', "I'm Jeongyeon"),
      ]),
      new Promise(resolve => setTimeout(resolve, 5000)),
    ]);

    img.onload = () => {
      const faceRaw = sampleImage(img, w, h, SAMPLE_INTERVAL);
      fontReady.then(() => {
        startAnimation(
          faceRaw.length > 0 ? faceRaw : sampleFallbackFace(w, h),
        );
      });
    };
    img.onerror = () => {
      fontReady.then(() => {
        startAnimation(sampleFallbackFace(w, h));
      });
    };
  }, [language]);

  /* ── Effects ── */
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

  // Visibility observer — pause animation when off-screen
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisibleRef.current = entry.isIntersecting;
        });
      },
      { threshold: 0.01 },
    );
    observer.observe(container);
    return () => observer.unobserve(container);
  }, []);

  // Mouse / touch events
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const getPos = (e: MouseEvent | Touch) => {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
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
    <HeroContainer ref={containerRef} $isDark={isDark}>
      <StickyFrame $isDark={isDark}>
        <Canvas ref={canvasRef} />
        <SrOnly>
          <h1>허정연 · Heo JeongYeon</h1>
          <p>{t.subtitle}</p>
        </SrOnly>
      </StickyFrame>
    </HeroContainer>
  );
}
