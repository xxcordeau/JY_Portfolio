'use client';

import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

const FooterContainer = styled.footer<{ $isDark: boolean }>`
  padding: 60px 40px;
  background: ${props => props.$isDark ? '#000000' : '#ffffff'};
  border-top: 1px solid ${props => props.$isDark ? 'rgba(255, 255, 255, 0.1)' : '#d2d2d7'};
  transition: all 0.3s ease;
  position: relative;

  @media (max-width: 768px) {
    padding: 40px 20px;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const FooterContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 24px;
    text-align: center;
  }
`;

const Copyright = styled.p`
  font-size: 14px;
  color: #86868b;
  margin: 0;
  font-weight: 400;
  letter-spacing: -0.2px;

  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 24px;
`;

const SocialLink = styled.a<{ $isDark: boolean }>`
  color: ${props => props.$isDark ? '#a1a1a6' : '#86868b'};
  text-decoration: none;
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
  transition: color 0.2s ease;
  letter-spacing: -0.2px;

  &:hover {
    color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  }

  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

interface FooterProps {
  onContactClick?: () => void;
}

const ContactButton = styled.button<{ $isDark: boolean }>`
  color: ${props => props.$isDark ? '#a1a1a6' : '#86868b'};
  background: transparent;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s ease;
  letter-spacing: -0.2px;
  padding: 0;

  &:hover {
    color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  }

  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

const translations = {
  ko: {
    copyright: '© 2026 Portfolio. All rights reserved.',
    contact: '연락하기',
    github: 'GitHub',
    twitter: 'Twitter',
    instagram: 'Instagram'
  },
  en: {
    copyright: '© 2026 Portfolio. All rights reserved.',
    contact: 'Contact',
    github: 'GitHub',
    twitter: 'Twitter',
    instagram: 'Instagram'
  }
};

export default function Footer({ onContactClick }: FooterProps) {
  const { isDark } = useTheme();
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <FooterContainer $isDark={isDark}>
      <Container>
        <FooterContent>
          <Copyright>{t.copyright}</Copyright>
          <SocialLinks>
            {onContactClick && (
              <ContactButton $isDark={isDark} onClick={onContactClick}>
                {t.contact}
              </ContactButton>
            )}
            <SocialLink $isDark={isDark} href="https://github.com" target="_blank" rel="noopener noreferrer">
              {t.github}
            </SocialLink>

          </SocialLinks>
        </FooterContent>
      </Container>
    </FooterContainer>
  );
}
