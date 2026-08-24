'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '../../contexts/ThemeContext';
import { supabase } from '../../lib/supabase';
import AdminLogin from '../admin/AdminLogin';
import AdminDashboard from '../admin/AdminDashboard';
import { LoadingFallback } from './shared';

/**
 * /admin 하위 전체를 감싸는 인증 게이트.
 * Vite 시절 App.tsx의 <AdminPage/>를 App Router 레이아웃용으로 옮긴 것 —
 * 중첩 라우트는 react-router <Outlet/> 대신 children으로 전달된다.
 */
export default function AdminGate({ children }: { children: ReactNode }) {
  const { isDark } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

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
    router.push('/');
  };

  if (isLoading) {
    return <LoadingFallback $isDark={isDark}>Loading...</LoadingFallback>;
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return <AdminDashboard onLogout={handleLogout}>{children}</AdminDashboard>;
}
