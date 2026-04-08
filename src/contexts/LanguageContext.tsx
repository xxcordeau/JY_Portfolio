import { createContext, useContext, useState, type ReactNode } from 'react';

interface LanguageContextType {
  language: 'ko' | 'en';
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<'ko' | 'en'>('ko');

  const toggleLanguage = () => setLanguage(prev => prev === 'ko' ? 'en' : 'ko');

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
