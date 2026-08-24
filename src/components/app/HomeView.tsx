'use client';

import { useEffect, Suspense, lazy } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '../../contexts/ThemeContext';
import Hero from '../Hero';
import About from '../About';
import Projects from '../Projects';
import BlogPreview from '../BlogPreview';
import ThankYouCTA from '../ThankYouCTA';
import { SnapSection, LoadingFallback, getPopNav } from './shared';
import { useContactModal } from './ContactModalContext';

const OpenSource = lazy(() => import('../OpenSource'));

export default function HomeView() {
  const router = useRouter();
  const { isDark } = useTheme();
  const { open: openContact } = useContactModal();

  /** 페이지 이동 전 홈 스크롤 위치를 명시적으로 저장 (DOM 변경 전 호출 보장) */
  const saveAndNavigate = (to: string) => {
    const SECTION_IDS = ['projects', 'blog', 'opensource'];
    sessionStorage.setItem('sp:/', String(window.scrollY));
    const vh = window.innerHeight;
    let best = ''; let bestOverlap = 0;
    for (const id of SECTION_IDS) {
      const el = document.getElementById(id);
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) continue;
      const overlap = Math.min(vh, r.bottom) - Math.max(0, r.top);
      if (overlap > bestOverlap) { bestOverlap = overlap; best = id; }
    }
    if (best && bestOverlap > vh * 0.25) {
      sessionStorage.setItem('sp:/:section', best);
    }
    router.push(to);
  };

  // Enable scroll-snap on <html> for home page only.
  // Delay on POP so scrollTo runs first before snap can re-snap.
  useEffect(() => {
    if (window.matchMedia('(max-width: 768px)').matches) return;
    const html = document.documentElement;
    const prev = html.style.scrollSnapType;
    const delay = getPopNav() ? 1100 : 0;
    const t = setTimeout(() => { html.style.scrollSnapType = 'y proximity'; }, delay);
    return () => {
      clearTimeout(t);
      html.style.scrollSnapType = prev;
    };
  }, []);

  // Handle cross-page scroll: when arriving from another page via nav click
  useEffect(() => {
    const target = sessionStorage.getItem('scrollTarget');
    if (!target) return;
    sessionStorage.removeItem('scrollTarget');
    const timer = setTimeout(() => {
      const el = document.getElementById(target);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Hero />
      {/* About manages its own 3 snap sections internally */}
      <About />
      <SnapSection id="projects">
        <Projects
          onProjectClick={(id) => saveAndNavigate(`/projects/${id}`)}
          onViewAll={() => saveAndNavigate('/projects')}
        />
      </SnapSection>
      <SnapSection id="blog">
        <BlogPreview
          onPostClick={(id) => saveAndNavigate(`/blog/${id}`)}
          onViewAll={() => saveAndNavigate('/blog')}
        />
      </SnapSection>
      <SnapSection id="opensource">
        <Suspense fallback={<LoadingFallback $isDark={isDark}>Loading...</LoadingFallback>}>
          <OpenSource
            compact
            limit={3}
            onProjectClick={(id) => saveAndNavigate(`/opensource/${id}`)}
            onViewAll={() => saveAndNavigate('/opensource')}
          />
        </Suspense>
      </SnapSection>
      <ThankYouCTA onContactClick={openContact} githubUrl="https://github.com/hjyeon-n" />
    </>
  );
}
