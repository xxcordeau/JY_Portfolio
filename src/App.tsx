import { useState, useEffect, useRef, lazy, Suspense, type ReactNode } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams, useLocation, useNavigationType } from 'react-router-dom';
import styled, { createGlobalStyle, keyframes, css } from 'styled-components';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { supabase } from './lib/supabase';
import { Shield } from 'lucide-react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import BlogPreview from './components/BlogPreview';
import Contact from './components/Contact';
import Chatbot from './components/Chatbot';
import ThankYouCTA from './components/ThankYouCTA';

const ProjectsGallery = lazy(() => import('./components/ProjectsGallery'));
const ProjectDetail = lazy(() => import('./components/ProjectDetail'));
const Blog = lazy(() => import('./components/Blog'));
const BlogDetail = lazy(() => import('./components/BlogDetail'));
const OpenSource = lazy(() => import('./components/OpenSource'));
const OpenSourceDetail = lazy(() => import('./components/OpenSourceDetail'));
const AdminLogin = lazy(() => import('./components/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard'));
const AdminHome = lazy(() => import('./components/admin/AdminHome'));
const MailManager = lazy(() => import('./components/admin/MailManager'));
const AboutEditor = lazy(() => import('./components/admin/AboutEditor'));
const ProjectList = lazy(() => import('./components/admin/projects/ProjectList'));
const ProjectForm = lazy(() => import('./components/admin/projects/ProjectForm'));
const BlogList = lazy(() => import('./components/admin/blog/BlogList'));
const BlogForm = lazy(() => import('./components/admin/blog/BlogForm'));
const OpenSourceEditor = lazy(() => import('./components/admin/OpenSourceEditor'));
const ChatbotEditor = lazy(() => import('./components/admin/ChatbotEditor'));
const SiteSettingsEditor = lazy(() => import('./components/admin/SiteSettingsEditor'));
const PresentationsManager = lazy(() => import('./components/admin/PresentationsManager'));
const Presentations = lazy(() => import('./components/Presentations'));
const PackageDemo = lazy(() => import('./components/PackageDemo'));

// Module-level flag: skip enter animations when navigating back
let __popNavFlag = false;

const GlobalStyle = createGlobalStyle`
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

const AppContainer = styled.div<{ $isDark: boolean }>`
  width: 100%;
  min-height: 100vh;
  background: ${props => props.$isDark ? '#000000' : '#ffffff'};
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  transition: background 0.3s ease, color 0.3s ease;
  overflow-x: hidden;
`;

const LoadingFallback = styled.div<{ $isDark: boolean }>`
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
const AdminFloatBtn = styled.button<{ $isDark: boolean }>`
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

function SnapSection({ children, snap = true, id }: { children: ReactNode; snap?: boolean; id?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(() => __popNavFlag);

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

function HomePage({ onContactClick }: { onContactClick: () => void }) {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  // Enable scroll-snap on <html> for home page only.
  // Delay on POP so scrollTo runs first before snap can re-snap.
  useEffect(() => {
    if (window.matchMedia('(max-width: 768px)').matches) return;
    const html = document.documentElement;
    const prev = html.style.scrollSnapType;
    const isPopNav = __popNavFlag;
    const delay = isPopNav ? 550 : 0;
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
      <SnapSection>
        <Hero />
      </SnapSection>
      {/* About manages its own 3 snap sections internally */}
      <About />
      <SnapSection id="projects">
        <Projects
          onProjectClick={(id) => navigate(`/projects/${id}`)}
          onViewAll={() => navigate('/projects')}
        />
      </SnapSection>
      <SnapSection id="blog">
        <BlogPreview
          onPostClick={(id) => navigate(`/blog/${id}`)}
          onViewAll={() => navigate('/blog')}
        />
      </SnapSection>
      <SnapSection id="opensource">
        <Suspense fallback={<LoadingFallback $isDark={isDark}>Loading...</LoadingFallback>}>
          <OpenSource
            compact
            limit={3}
            onProjectClick={(id) => navigate(`/opensource/${id}`)}
            onViewAll={() => navigate('/opensource')}
          />
        </Suspense>
      </SnapSection>
      <ThankYouCTA onContactClick={onContactClick} githubUrl="https://github.com/hjyeon-n" />
    </>
  );
}

function ProjectsPage() {
  const navigate = useNavigate();

  return (
    <ProjectsGallery
      onProjectClick={(id) => navigate(`/projects/${id}`)}
      onBack={() => navigate('/')}
    />
  );
}

function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!id) {
    navigate('/projects');
    return null;
  }

  return (
    <ProjectDetail
      projectId={id}
      onBack={() => navigate(-1)}
    />
  );
}

function BlogPage() {
  const navigate = useNavigate();

  return (
    <Blog
      onPostClick={(id) => navigate(`/blog/${id}`)}
      onBack={() => navigate('/')}
    />
  );
}

function BlogDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!id) {
    navigate('/blog');
    return null;
  }

  return (
    <BlogDetail
      blogId={id}
      onBack={() => navigate(-1)}
    />
  );
}

function OpenSourcePage() {
  const navigate = useNavigate();

  return (
    <OpenSource
      onProjectClick={(id) => navigate(`/opensource/${id}`)}
      onBack={() => navigate('/')}
    />
  );
}

function PresentationsPage() {
  const navigate = useNavigate();
  return <Presentations onBack={() => navigate('/')} />;
}

function OpenSourceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!id) {
    navigate('/opensource');
    return null;
  }

  return (
    <OpenSourceDetail
      projectId={id}
      onBack={() => navigate(-1)}
    />
  );
}

function AdminPage() {
  const { isDark } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return !error;
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    navigate('/');
  };

  if (isLoading) {
    return <LoadingFallback $isDark={isDark}>Loading...</LoadingFallback>;
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return <AdminDashboard onLogout={handleLogout} />;
}

function AppContent() {
  const { isDark } = useTheme();
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const navigationType = useNavigationType();

  // Save scroll position on every scroll event
  useEffect(() => {
    const save = () => {
      sessionStorage.setItem(`sp:${location.pathname}`, String(window.scrollY));
    };
    window.addEventListener('scroll', save, { passive: true });
    return () => {
      save();
      window.removeEventListener('scroll', save);
    };
  }, [location.pathname]);

  // Restore or reset scroll on navigation
  useEffect(() => {
    if (navigationType === 'POP') {
      __popNavFlag = true;
      const saved = sessionStorage.getItem(`sp:${location.pathname}`);
      const target = saved ? parseInt(saved, 10) : 0;

      if (target === 0) {
        __popNavFlag = false;
        return;
      }

      // Scroll to saved position; retry a few times in case async data
      // hasn't finished rendering yet (Supabase lists, lazy components, etc.)
      const tryScroll = () =>
        window.scrollTo({ top: target, behavior: 'instant' as ScrollBehavior });

      // immediate + two retries to cover slow data loads
      tryScroll();
      const t1 = setTimeout(tryScroll, 120);
      const t2 = setTimeout(tryScroll, 350);
      const t3 = setTimeout(() => { __popNavFlag = false; }, 500);

      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    } else {
      __popNavFlag = false;
      window.scrollTo(0, 0);
    }
  }, [location.pathname, navigationType]);

  const isAdminPage = location.pathname.startsWith('/admin');

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
      // Ctrl/Cmd + C, X, A, S, P (복사·저장·프린트)
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
    <>
      <GlobalStyle />
      <AppContainer $isDark={isDark}>
        {!isAdminPage && (
          <Header
            navigateToHome={() => navigate('/')}
            onContactClick={() => setContactModalOpen(true)}
          />
        )}

        <Suspense fallback={<LoadingFallback $isDark={isDark}>Loading...</LoadingFallback>}>
          <Routes>
            <Route
              path="/"
              element={<HomePage onContactClick={() => setContactModalOpen(true)} />}
            />
            <Route
              path="/preview_page.html"
              element={<HomePage onContactClick={() => setContactModalOpen(true)} />}
            />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:id" element={<ProjectDetailPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:id" element={<BlogDetailPage />} />
            <Route path="/opensource" element={<OpenSourcePage />} />
            <Route path="/opensource/:id" element={<OpenSourceDetailPage />} />
            <Route path="/presentations" element={<PresentationsPage />} />
            <Route path="/demo" element={<PackageDemo />} />
            <Route path="/admin" element={<AdminPage />}>
              <Route index element={<AdminHome />} />
              <Route path="mail" element={<MailManager />} />
              <Route path="about" element={<AboutEditor />} />
              <Route path="projects" element={<ProjectList />} />
              <Route path="projects/new" element={<ProjectForm />} />
              <Route path="projects/:id" element={<ProjectForm />} />
              <Route path="blog" element={<BlogList />} />
              <Route path="blog/new" element={<BlogForm />} />
              <Route path="blog/:id" element={<BlogForm />} />
              <Route path="opensource" element={<OpenSourceEditor />} />
              <Route path="chatbot" element={<ChatbotEditor />} />
              <Route path="presentations" element={<PresentationsManager />} />
              <Route path="settings" element={<SiteSettingsEditor />} />
            </Route>
            <Route
              path="*"
              element={<HomePage onContactClick={() => setContactModalOpen(true)} />}
            />
          </Routes>
        </Suspense>
      </AppContainer>

      {!isAdminPage && (
        <>
          <Contact
            isOpen={contactModalOpen}
            onOpenChange={setContactModalOpen}
          />
          <Chatbot onContactClick={() => setContactModalOpen(true)} />
          <AdminFloatBtn $isDark={isDark} onClick={() => navigate('/admin')}>
            <Shield />
            Admin
          </AdminFloatBtn>
        </>
      )}
    </>
  );
}

export default function App() {
  // 수동으로 스크롤 복원 제어 (sessionStorage 기반)
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  return (
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <AppContent />
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
