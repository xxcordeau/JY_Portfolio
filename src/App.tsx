import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { supabase } from './lib/supabase';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import BlogPreview from './components/BlogPreview';
import Footer from './components/Footer';
import Contact from './components/Contact';
import Chatbot from './components/Chatbot';

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

function HomePage({ onContactClick }: { onContactClick: () => void }) {
  const navigate = useNavigate();

  return (
    <>
      <Hero />
      <About />
      <Projects
        onProjectClick={(id) => navigate(`/projects/${id}`)}
        onViewAll={() => navigate('/projects')}
      />
      <BlogPreview
        onPostClick={(id) => navigate(`/blog/${id}`)}
        onViewAll={() => navigate('/blog')}
      />
      <Footer onContactClick={onContactClick} />
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
      onBack={() => navigate('/projects')}
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
      onBack={() => navigate('/blog')}
    />
  );
}

function OpenSourcePage() {
  const navigate = useNavigate();

  return (
    <OpenSource
      onProjectClick={(id) => navigate(`/opensource/${id}`)}
    />
  );
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
      onBack={() => navigate('/opensource')}
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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const isAdminPage = location.pathname.startsWith('/admin');

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
            <Route path="/presentations" element={<Presentations />} />
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
        </>
      )}
    </>
  );
}

export default function App() {
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
