import styled from 'styled-components';
import { Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

const AdminButton = styled.button<{ $isDark: boolean }>`
  position: absolute;
  bottom: 20px;
  left: 20px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)'};
  border: 1px solid ${props => props.$isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'};
  border-radius: 8px;
  color: #86868b;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif;

  &:hover {
    background: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
    color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  }

  svg {
    width: 14px;
    height: 14px;
  }

  @media (max-width: 768px) {
    position: static;
    margin: 0 auto 20px;
  }
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
  language: 'ko' | 'en';
  isDark: boolean;
  onContactClick?: () => void;
}

const ContactButton = styled.button<{ $isDark: boolean }>`
  color: ${props => props.$isDark ? '#a1a1a6' : '#86868b'};\
  background: transparent;
  border: none;
  font-size: 14px;\
  font-weight: 500;
  cursor: pointer;\
  transition: color 0.2s ease;
  letter-spacing: -0.2px;
  padding: 0;

  &:hover {
    color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};\
  }

  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

const translations = {
  ko: {
    copyright: '© 2025 Portfolio. All rights reserved.',
    contact: '연락하기',
    github: 'GitHub',
    twitter: 'Twitter',
    instagram: 'Instagram'
  },
  en: {
    copyright: '© 2025 Portfolio. All rights reserved.',
    contact: 'Contact',
    github: 'GitHub',
    twitter: 'Twitter',
    instagram: 'Instagram'
  }
};

export default function Footer({ language, isDark, onContactClick }: FooterProps) {
  const t = translations[language];
  const navigate = useNavigate();

  return (
    <FooterContainer $isDark={isDark}>
      <AdminButton $isDark={isDark} onClick={() => navigate('/admin')}>
        <Shield />
        Admin
      </AdminButton>
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
            <SocialLink $isDark={isDark} href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              {t.twitter}
            </SocialLink>
            <SocialLink $isDark={isDark} href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              {t.instagram}
            </SocialLink>
          </SocialLinks>
        </FooterContent>
      </Container>
    </FooterContainer>
  );
}
