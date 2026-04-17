import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

const Section = styled.section<{ $isDark: boolean }>`
  min-height: 100vh;
  scroll-snap-align: start;
  scroll-snap-stop: normal;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${p => p.$isDark ? '#000' : '#ffffff'};
  text-align: center;
  transition: background 0.3s ease;
  padding: 80px 0;

  @media (max-width: 768px) {
    min-height: auto;
    scroll-snap-align: none;
    padding: 80px 0;
  }
`;

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 40px;

  @media (max-width: 768px) {
    padding: 0 20px;
  }
`;

const ThankYouText = styled.h2<{ $isDark: boolean }>`
  font-size: 36px;
  font-weight: 700;
  color: ${p => p.$isDark ? '#f5f5f7' : '#1d1d1f'};
  margin: 0 0 16px 0;
  letter-spacing: -1px;
  line-height: 1.3;

  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const SubText = styled.p<{ $isDark: boolean }>`
  font-size: 16px;
  color: ${p => p.$isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)'};
  margin: 0 0 40px 0;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
`;

const ContactBtn = styled.button<{ $isDark: boolean }>`
  padding: 12px 28px;
  border-radius: 100px;
  border: none;
  background: ${p => p.$isDark ? '#f5f5f7' : '#1d1d1f'};
  color: ${p => p.$isDark ? '#000' : '#fff'};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  letter-spacing: -0.2px;

  &:hover {
    opacity: 0.82;
    transform: scale(0.98);
  }
`;

const GithubBtn = styled.a<{ $isDark: boolean }>`
  padding: 12px 28px;
  border-radius: 100px;
  background: transparent;
  border: 1px solid ${p => p.$isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)'};
  color: ${p => p.$isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)'};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  letter-spacing: -0.2px;
  text-decoration: none;
  display: inline-block;

  &:hover {
    background: ${p => p.$isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'};
    color: ${p => p.$isDark ? '#f5f5f7' : '#1d1d1f'};
    border-color: ${p => p.$isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.2)'};
  }
`;

const translations = {
  ko: {
    thanks: '감사합니다',
    sub: '더 궁금한 점이 있다면 언제든 물어보세요',
    contact: '연락하기',
    github: 'GitHub',
  },
  en: {
    thanks: 'Thank You',
    sub: 'Feel free to ask if you have any questions',
    contact: 'Contact',
    github: 'GitHub',
  },
};

interface ThankYouCTAProps {
  onContactClick?: () => void;
  githubUrl?: string;
}

export default function ThankYouCTA({ onContactClick, githubUrl = 'https://github.com' }: ThankYouCTAProps) {
  const { isDark } = useTheme();
  const { language } = useLanguage();
  const t = translations[language];

  return (
    <Section $isDark={isDark}>
      <Container>
        <ThankYouText $isDark={isDark}>{t.thanks}</ThankYouText>
        <SubText $isDark={isDark}>{t.sub}</SubText>
        <ButtonRow>
          {onContactClick && (
            <ContactBtn $isDark={isDark} onClick={onContactClick}>
              {t.contact}
            </ContactBtn>
          )}
          <GithubBtn
            $isDark={isDark}
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.github}
          </GithubBtn>
        </ButtonRow>
      </Container>
    </Section>
  );
}
