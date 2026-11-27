'use client';

import styled from 'styled-components';
import { useEffect, useRef, useState } from 'react';

/* 3D 캐릭터 한 개를 그리는 칸. 마우스를 따라 몸을 좌우로 천천히 조금 돌린다.
   three.js와 모델은 페이지를 다 그린 뒤 브라우저가 한가할 때 불러와서 첫 화면을 막지 않는다. */

const Box = styled.div<{ $ready: boolean; $square: boolean }>`
  position: relative;
  width: 100%;
  ${p => (p.$square ? 'aspect-ratio: 1 / 1;' : 'height: 100%;')}
  pointer-events: none;
  opacity: ${p => (p.$ready ? 1 : 0)};
  transition: opacity 0.6s var(--k-ease);

  canvas {
    display: block;
    width: 100% !important;
    height: 100% !important;
  }
`;

interface Props {
  src: string;
  /** 모델 크기를 1로 맞춘 뒤의 카메라 거리. 작을수록 크게 보인다 */
  distance?: number;
  /** true면 칸을 정사각형으로, false면 부모 높이를 그대로 쓴다 */
  square?: boolean;
  className?: string;
  /** 모델을 다 불러온 뒤 한 번 불린다 */
  onReady?: () => void;
}

export default function Model3D({ src, distance = 2.15, square = true, className, onReady }: Props) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    let disposed = false;
    let cleanup = () => {};

    const start = async () => {
      const THREE = await import('three');
      const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
      const { MeshoptDecoder } = await import('three/examples/jsm/libs/meshopt_decoder.module.js');
      const { RoomEnvironment } = await import('three/examples/jsm/environments/RoomEnvironment.js');
      if (disposed) return;

      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      } catch {
        return; // WebGL을 못 쓰는 환경이면 그냥 비워 둔다
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.NeutralToneMapping;
      box.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const pmrem = new THREE.PMREMGenerator(renderer);
      const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.environment = envTex;
      // 환경광만으로는 얼굴과 옷이 어둡게 떠서 정면 위쪽에서 빛을 더한다
      const hemi = new THREE.HemisphereLight(0xffffff, 0xdddddd, 1.4);
      scene.add(hemi);
      const key = new THREE.DirectionalLight(0xffffff, 1.6);
      key.position.set(1.5, 2.5, 3);
      scene.add(key);

      // 다크 모드에서는 배경에 맞춰 조명을 낮춘다. 테마가 바뀌면 부드럽게 따라간다
      const LIGHT = { exposure: 1.6, hemi: 1.9, key: 2.2 };
      const DARK = { exposure: 0.75, hemi: 0.55, key: 0.9 };
      const isDark = () => document.documentElement.dataset.theme === 'dark';
      let light = isDark() ? DARK : LIGHT;
      renderer.toneMappingExposure = light.exposure;
      hemi.intensity = light.hemi;
      key.intensity = light.key;
      const mo = new MutationObserver(() => { light = isDark() ? DARK : LIGHT; });
      mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

      const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 20);
      camera.position.set(0, 0, distance);

      // 모델 중심을 원점에 두고, 이 피벗을 돌린다
      const pivot = new THREE.Group();
      scene.add(pivot);

      const size = () => {
        const w = box.clientWidth;
        const h = box.clientHeight;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      size();
      const ro = new ResizeObserver(size);
      ro.observe(box);

      const loader = new GLTFLoader();
      loader.setMeshoptDecoder(MeshoptDecoder);
      loader.load(
        src,
        gltf => {
          if (disposed) return;
          const model = gltf.scene;
          const bbox = new THREE.Box3().setFromObject(model);
          const center = bbox.getCenter(new THREE.Vector3());
          const dims = bbox.getSize(new THREE.Vector3());
          const fit = dims.y || 1; // 키를 1로 맞춘다
          model.position.sub(center);
          // AI로 만든 모델이라 금속 값이 높게 들어가 있어 검게 보인다. 천/피부처럼 보이게 금속감을 뺀다
          model.traverse(obj => {
            const mesh = obj as InstanceType<typeof THREE.Mesh>;
            if (!mesh.isMesh) return;
            const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            mats.forEach(m => {
              const std = m as InstanceType<typeof THREE.MeshStandardMaterial>;
              if ('metalness' in std) {
                std.metalness = 0;
                std.metalnessMap = null;
                std.roughness = Math.max(std.roughness, 0.7);
                std.needsUpdate = true;
              }
            });
          });
          pivot.scale.setScalar(1 / fit);
          pivot.add(model);
          setReady(true);
          onReadyRef.current?.();
        },
        undefined,
        () => { /* 모델을 못 불러오면 빈 칸으로 둔다 */ },
      );

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const canHover = window.matchMedia('(hover: hover)').matches;
      let targetY = 0;
      let targetX = 0;
      const moves = !reduceMotion;
      const onMove = (e: PointerEvent) => {
        // 화면 끝에서 끝까지 옮겨도 좌우 40도 정도만 돈다. 위아래는 아주 살짝
        targetY = (e.clientX / window.innerWidth - 0.5) * 1.4;
        targetX = (e.clientY / window.innerHeight - 0.5) * 0.1;
      };
      if (moves && canHover) window.addEventListener('pointermove', onMove, { passive: true });

      // 화면에 보일 때만 그린다
      let visible = true;
      const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
      io.observe(box);

      let raf = 0;
      let last = performance.now();
      const tick = (now: number) => {
        raf = requestAnimationFrame(tick);
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        if (!visible || document.hidden) return;
        // 마우스가 없는 기기에서는 천천히 혼자 돈다
        if (moves && !canHover) targetY += dt * 0.4;
        const k = 1 - Math.pow(0.2, dt); // 느긋하게 따라간다. 프레임 속도와 무관
        pivot.rotation.y += (targetY - pivot.rotation.y) * k;
        pivot.rotation.x += (targetX - pivot.rotation.x) * k;
        const kl = 1 - Math.pow(0.02, dt);
        renderer.toneMappingExposure += (light.exposure - renderer.toneMappingExposure) * kl;
        hemi.intensity += (light.hemi - hemi.intensity) * kl;
        key.intensity += (light.key - key.intensity) * kl;
        renderer.render(scene, camera);
      };
      raf = requestAnimationFrame(tick);

      cleanup = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener('pointermove', onMove);
        ro.disconnect();
        io.disconnect();
        mo.disconnect();
        scene.traverse(obj => {
          const mesh = obj as InstanceType<typeof THREE.Mesh>;
          if (mesh.isMesh) {
            mesh.geometry.dispose();
            const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            mats.forEach(m => {
              Object.values(m).forEach(v => { if (v instanceof THREE.Texture) v.dispose(); });
              m.dispose();
            });
          }
        });
        envTex.dispose();
        pmrem.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
      // 불러오는 사이에 페이지를 떠났으면 바로 정리
      if (disposed) cleanup();
    };

    // 첫 화면(글, 이미지)을 먼저 그리고, 한가해지면 three.js와 모델을 받기 시작한다
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(() => { void start(); }, { timeout: 2000 })
      : window.setTimeout(() => { void start(); }, 600);

    return () => {
      disposed = true;
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      cleanup();
    };
  }, [src, distance]);

  return <Box ref={boxRef} className={className} $ready={ready} $square={square} aria-hidden />;
}
