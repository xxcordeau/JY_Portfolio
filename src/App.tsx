import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams, useLocation } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import ProjectsGallery from './components/ProjectsGallery';
import BlogPreview from './components/BlogPreview';
import ProjectDetail from './components/ProjectDetail';
import Blog from './components/Blog';
import BlogDetail from './components/BlogDetail';
import OpenSource from './components/OpenSource';
import OpenSourceDetail from './components/OpenSourceDetail';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import PackageDemo from './components/PackageDemo';
import { projectId, publicAnonKey } from './utils/supabase/info';

const GlobalStyle = createGlobalStyle`
  @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css');
  
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

function HomePage({ 
  language, 
  isDark, 
  onContactClick 
}: { 
  language: 'ko' | 'en'; 
  isDark: boolean;
  onContactClick: () => void;
}) {
  const navigate = useNavigate();

  const navigateToProject = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  const navigateToBlogPost = (blogId: string) => {
    navigate(`/blog/${blogId}`);
  };

  return (
    <>
      <Hero language={language} isDark={isDark} />
      <About language={language} isDark={isDark} />
      <Projects 
        language={language} 
        isDark={isDark}
        onProjectClick={navigateToProject}
        onViewAll={() => navigate('/projects')}
      />
      <BlogPreview 
        language={language} 
        isDark={isDark}
        onPostClick={navigateToBlogPost}
        onViewAll={() => navigate('/blog')}
      />
      <Footer 
        language={language} 
        isDark={isDark}
        onContactClick={onContactClick}
      />
    </>
  );
}

function ProjectsPage({ 
  language, 
  isDark 
}: { 
  language: 'ko' | 'en'; 
  isDark: boolean;
}) {
  const navigate = useNavigate();

  return (
    <ProjectsGallery
      language={language}
      isDark={isDark}
      onProjectClick={(id) => navigate(`/projects/${id}`)}
      onBack={() => navigate('/')}
    />
  );
}

function ProjectDetailPage({ 
  language, 
  isDark 
}: { 
  language: 'ko' | 'en'; 
  isDark: boolean;
}) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!id) {
    navigate('/projects');
    return null;
  }

  return (
    <ProjectDetail 
      projectId={id}
      language={language}
      isDark={isDark}
      onBack={() => navigate('/projects')}
    />
  );
}

function BlogPage({ 
  language, 
  isDark 
}: { 
  language: 'ko' | 'en'; 
  isDark: boolean;
}) {
  const navigate = useNavigate();

  return (
    <Blog 
      language={language}
      isDark={isDark}
      onPostClick={(id) => navigate(`/blog/${id}`)}
      onBack={() => navigate('/')}
    />
  );
}

function BlogDetailPage({ 
  language, 
  isDark 
}: { 
  language: 'ko' | 'en'; 
  isDark: boolean;
}) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!id) {
    navigate('/blog');
    return null;
  }

  return (
    <BlogDetail 
      blogId={id}
      language={language}
      isDark={isDark}
      onBack={() => navigate('/blog')}
    />
  );
}

function OpenSourcePage({ 
  language, 
  isDark 
}: { 
  language: 'ko' | 'en'; 
  isDark: boolean;
}) {
  const navigate = useNavigate();

  return (
    <OpenSource
      language={language}
      isDark={isDark}
      onProjectClick={(id) => navigate(`/opensource/${id}`)}
    />
  );
}

function OpenSourceDetailPage({ 
  language, 
  isDark 
}: { 
  language: 'ko' | 'en'; 
  isDark: boolean;
}) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!id) {
    navigate('/opensource');
    return null;
  }

  return (
    <OpenSourceDetail 
      projectId={id}
      language={language}
      isDark={isDark}
      onBack={() => navigate('/opensource')}
    />
  );
}

function AdminPage({ 
  language, 
  isDark 
}: { 
  language: 'ko' | 'en'; 
  isDark: boolean;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if already logged in
    const adminToken = localStorage.getItem('admin_token');
    if (adminToken) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = async (password: string): Promise<boolean> => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-a3d4d756/admin/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ password }),
        }
      );

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('admin_token', 'authenticated');
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
    navigate('/');
  };

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <AdminLogin isDark={isDark} onLogin={handleLogin} />;
  }

  return (
    <AdminDashboard 
      isDark={isDark} 
      language={language}
      onLogout={handleLogout}
    />
  );
}

function AppContent() {
  const [language, setLanguage] = useState<'ko' | 'en'>('ko');
  const [isDark, setIsDark] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 시스템 다크모드 감지
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(prefersDark);
  }, []);

  // 페이지 변경 시 스크롤 최상단으로 이동
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ko' ? 'en' : 'ko');
  };

  const toggleDarkMode = () => {
    setIsDark(prev => !prev);
  };

  // Don't show header/footer/chatbot on admin page
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <>
      <GlobalStyle />
      <AppContainer $isDark={isDark}>
        {!isAdminPage && (
          <Header 
            language={language} 
            toggleLanguage={toggleLanguage}
            isDark={isDark}
            toggleDarkMode={toggleDarkMode}
            navigateToHome={() => navigate('/')}
            navigateToBlog={() => navigate('/blog')}
            currentPage="home"
            onContactClick={() => setContactModalOpen(true)}
          />
        )}
        
        <Routes>
          <Route 
            path="/" 
            element={
              <HomePage 
                language={language} 
                isDark={isDark}
                onContactClick={() => setContactModalOpen(true)}
              />
            } 
          />
          <Route 
            path="/preview_page.html" 
            element={
              <HomePage 
                language={language} 
                isDark={isDark}
                onContactClick={() => setContactModalOpen(true)}
              />
            } 
          />
          <Route 
            path="/projects" 
            element={
              <ProjectsPage 
                language={language} 
                isDark={isDark}
              />
            } 
          />
          <Route 
            path="/projects/:id" 
            element={
              <ProjectDetailPage 
                language={language} 
                isDark={isDark}
              />
            } 
          />
          <Route 
            path="/blog" 
            element={
              <BlogPage 
                language={language} 
                isDark={isDark}
              />
            } 
          />
          <Route 
            path="/blog/:id" 
            element={
              <BlogDetailPage 
                language={language} 
                isDark={isDark}
              />
            } 
          />
          <Route 
            path="/opensource" 
            element={
              <OpenSourcePage 
                language={language} 
                isDark={isDark}
              />
            } 
          />
          <Route 
            path="/opensource/:id" 
            element={
              <OpenSourceDetailPage 
                language={language} 
                isDark={isDark}
              />
            } 
          />
          <Route
            path="/demo"
            element={
              <PackageDemo
                language={language}
                isDark={isDark}
              />
            }
          />
          <Route
            path="/admin" 
            element={
              <AdminPage 
                language={language} 
                isDark={isDark}
              />
            } 
          />
          <Route 
            path="*" 
            element={
              <HomePage 
                language={language} 
                isDark={isDark}
                onContactClick={() => setContactModalOpen(true)}
              />
            } 
          />
        </Routes>
      </AppContainer>
      
      {!isAdminPage && (
        <>
          <Contact 
            language={language} 
            isDark={isDark}
            isOpen={contactModalOpen}
            onOpenChange={setContactModalOpen}
          />
          
          <Chatbot 
            language={language} 
            isDark={isDark}
            onContactClick={() => setContactModalOpen(true)}
          />
        </>
      )}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
