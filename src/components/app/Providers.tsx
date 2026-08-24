'use client';

import type { ReactNode } from 'react';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { LanguageProvider } from '../../contexts/LanguageContext';
import AppShell from './AppShell';

/**
 * 클라이언트 프로바이더 경계.
 * 서버 컴포넌트인 layout.tsx가 컨텍스트를 직접 감쌀 수 없어 한 겹 분리한다.
 */
export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppShell>{children}</AppShell>
      </LanguageProvider>
    </ThemeProvider>
  );
}
