import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useOpenSource } from '../hooks/useOpenSource';
import type { OpenSourceProject } from '../data/types';
import { Github, Package, Star, Download, ArrowLeft, ExternalLink, CheckCircle } from 'lucide-react';
import LibraryDocDemo from './interactive/LibraryDocDemo';
import DataUIKitGuide from './interactive/DataUIKitGuide';

const DetailContainer = styled.div<{ $isDark: boolean }>`
  min-height: 100vh;
  background: ${props => props.$isDark ? '#000000' : '#ffffff'};
  padding-top: 80px;
  transition: background 0.3s ease;
`;

const BackButton = styled.button<{ $isDark: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: 1px solid ${props => props.$isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'};
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  margin: 40px 0 0 40px;

  &:hover {
    background: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
  }

  svg {
    width: 16px;
    height: 16px;
  }

  @media (max-width: 768px) {
    margin: 20px 0 0 20px;
  }
`;

const Hero = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 40px 60px;

  @media (max-width: 768px) {
    padding: 30px 20px 40px;
  }
`;

const HeroHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 30px;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
  }
`;

const TitleSection = styled.div`
  flex: 1;
`;

const Category = styled.span<{ $isDark: boolean }>`
  display: inline-block;
  font-size: 13px;
  color: ${props => props.$isDark ? '#4ECDC4' : '#007AFF'};
  background: ${props => props.$isDark 
    ? 'rgba(78, 205, 196, 0.1)' 
    : 'rgba(0, 122, 255, 0.1)'};
  padding: 6px 14px;
  border-radius: 12px;
  margin-bottom: 16px;
  font-weight: 600;
`;

const Title = styled.h1<{ $isDark: boolean }>`
  font-size: 48px;
  font-weight: 700;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  margin: 0 0 16px 0;
  letter-spacing: -1.5px;
  line-height: 1.1;

  @media (max-width: 768px) {
    font-size: 32px;
  }
`;

const Description = styled.p<{ $isDark: boolean }>`
  font-size: 19px;
  color: ${props => props.$isDark ? '#86868b' : '#6e6e73'};
  line-height: 1.5;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatCard = styled.div<{ $isDark: boolean }>`
  background: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)'};
  border: 1px solid ${props => props.$isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'};
  border-radius: 16px;
  padding: 20px;
  text-align: center;
  backdrop-filter: blur(20px);

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const StatIcon = styled.div<{ $isDark: boolean }>`
  width: 32px;
  height: 32px;
  margin: 0 auto 10px;
  border-radius: 8px;
  background: ${props => props.$isDark 
    ? 'rgba(78, 205, 196, 0.15)'
    : 'rgba(0, 122, 255, 0.15)'};
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 16px;
    height: 16px;
    color: ${props => props.$isDark ? '#4ECDC4' : '#007AFF'};
  }
`;

const StatValue = styled.div<{ $isDark: boolean }>`
  font-size: 20px;
  font-weight: 700;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  margin-bottom: 4px;
`;

const StatLabel = styled.div<{ $isDark: boolean }>`
  font-size: 11px;
  color: ${props => props.$isDark ? '#86868b' : '#6e6e73'};
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const Button = styled.a<{ $isDark: boolean; $variant?: 'primary' | 'secondary' }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
  
  ${props => props.$variant === 'primary' ? `
    background: ${props.$isDark 
      ? 'linear-gradient(135deg, #4ECDC4 0%, #45B7D1 100%)'
      : 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)'};
    color: white;
    border: none;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px ${props.$isDark ? 'rgba(78, 205, 196, 0.3)' : 'rgba(0, 122, 255, 0.3)'};
    }
  ` : `
    background: transparent;
    color: ${props.$isDark ? '#f5f5f7' : '#1d1d1f'};
    border: 1px solid ${props.$isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'};

    &:hover {
      background: ${props.$isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
    }
  `}

  svg {
    width: 16px;
    height: 16px;
  }
`;

const ContentSection = styled.div<{ $isDark: boolean }>`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px 60px;

  @media (max-width: 768px) {
    padding: 0 20px 40px;
  }
`;

const Section = styled.section`
  margin-bottom: 60px;

  @media (max-width: 768px) {
    margin-bottom: 40px;
  }
`;

const SectionTitle = styled.h2<{ $isDark: boolean }>`
  font-size: 32px;
  font-weight: 700;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  margin: 0 0 24px 0;
  letter-spacing: -0.5px;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const FullDescription = styled.div<{ $isDark: boolean }>`
  font-size: 17px;
  color: ${props => props.$isDark ? '#86868b' : '#6e6e73'};
  line-height: 1.8;
  white-space: pre-line;

  @media (max-width: 768px) {
    font-size: 15px;
  }
`;

const FeaturesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureItem = styled.div<{ $isDark: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)'};
  border: 1px solid ${props => props.$isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'};
  border-radius: 12px;
  backdrop-filter: blur(20px);

  svg {
    width: 18px;
    height: 18px;
    color: ${props => props.$isDark ? '#4ECDC4' : '#007AFF'};
    flex-shrink: 0;
    margin-top: 2px;
  }
`;

const FeatureText = styled.span<{ $isDark: boolean }>`
  font-size: 15px;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  line-height: 1.5;
`;

const DemoSection = styled.div<{ $isDark: boolean }>`
  background: ${props => props.$isDark ? '#000000' : '#f5f5f7'};
  padding: 60px 0;
  margin: 0 -40px;

  @media (max-width: 768px) {
    margin: 0 -20px;
    padding: 40px 0;
  }
`;

interface OpenSourceDetailProps {
  projectId: string;
  onBack: () => void;
}

const translations = {
  ko: {
    back: '목록으로',
    overview: '프로젝트 개요',
    features: '주요 기능',
    demo: '데모 및 문서',
    viewGithub: 'GitHub에서 보기',
    viewNpm: 'npm에서 보기',
    viewDemo: '데모 보기',
    stars: 'Stars',
    downloads: 'Downloads',
    components: 'Components',
    contributors: 'Contributors'
  },
  en: {
    back: 'Back to List',
    overview: 'Project Overview',
    features: 'Key Features',
    demo: 'Demo & Documentation',
    viewGithub: 'View on GitHub',
    viewNpm: 'View on npm',
    viewDemo: 'View Demo',
    stars: 'Stars',
    downloads: 'Downloads',
    components: 'Components',
    contributors: 'Contributors'
  }
};

export default function OpenSourceDetail({
  projectId,
  onBack
}: OpenSourceDetailProps) {
  const { isDark } = useTheme();
  const { language } = useLanguage();
  const { projects: openSourceProjects } = useOpenSource();
  const t = translations[language];
  const project = openSourceProjects.find(p => p.id === projectId);

  if (!project) {
    return null;
  }

  return (
    <DetailContainer $isDark={isDark}>
      <BackButton $isDark={isDark} onClick={onBack}>
        <ArrowLeft />
        {t.back}
      </BackButton>

      <Hero>
        <HeroHeader>
          <TitleSection>
            <Category $isDark={isDark}>{project.category[language]}</Category>
            <Title $isDark={isDark}>{project.name}</Title>
            <Description $isDark={isDark}>
              {project.description[language]}
            </Description>
          </TitleSection>
        </HeroHeader>

        <StatsGrid>
          <StatCard $isDark={isDark}>
            <StatIcon $isDark={isDark}>
              <Star />
            </StatIcon>
            <StatValue $isDark={isDark}>{project.stats.stars}</StatValue>
            <StatLabel $isDark={isDark}>{t.stars}</StatLabel>
          </StatCard>

          <StatCard $isDark={isDark}>
            <StatIcon $isDark={isDark}>
              <Download />
            </StatIcon>
            <StatValue $isDark={isDark}>{project.stats.downloads}</StatValue>
            <StatLabel $isDark={isDark}>{t.downloads}</StatLabel>
          </StatCard>

          {project.stats.components && (
            <StatCard $isDark={isDark}>
              <StatIcon $isDark={isDark}>
                <Package />
              </StatIcon>
              <StatValue $isDark={isDark}>{project.stats.components}</StatValue>
              <StatLabel $isDark={isDark}>{t.components}</StatLabel>
            </StatCard>
          )}

          <StatCard $isDark={isDark}>
            <StatIcon $isDark={isDark}>
              <Github />
            </StatIcon>
            <StatValue $isDark={isDark}>{project.stats.contributors}</StatValue>
            <StatLabel $isDark={isDark}>{t.contributors}</StatLabel>
          </StatCard>
        </StatsGrid>

        <ButtonGroup>
          <Button 
            $isDark={isDark} 
            $variant="primary"
            href={project.links.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github />
            {t.viewGithub}
          </Button>
          {project.links.npm && (
            <Button 
              $isDark={isDark} 
              $variant="secondary"
              href={project.links.npm}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Package />
              {t.viewNpm}
            </Button>
          )}
          {project.links.demo && (
            <Button 
              $isDark={isDark} 
              $variant="secondary"
              href={project.links.demo}
            >
              <ExternalLink />
              {t.viewDemo}
            </Button>
          )}
        </ButtonGroup>
      </Hero>

      <ContentSection $isDark={isDark}>
        <Section>
          <SectionTitle $isDark={isDark}>{t.overview}</SectionTitle>
          <FullDescription $isDark={isDark}>
            {project.fullDescription[language]}
          </FullDescription>
        </Section>

        <Section>
          <SectionTitle $isDark={isDark}>{t.features}</SectionTitle>
          <FeaturesList>
            {project.features[language].map((feature, index) => (
              <FeatureItem key={index} $isDark={isDark}>
                <CheckCircle />
                <FeatureText $isDark={isDark}>{feature}</FeatureText>
              </FeatureItem>
            ))}
          </FeaturesList>
        </Section>
      </ContentSection>

      {project.id === 'awesome-ui-kit' && (
        <DemoSection $isDark={isDark}>
          <LibraryDocDemo isDark={isDark} language={language} projectId={project.id} />
        </DemoSection>
      )}

      {project.id === 'data-ui-kit' && (
        <DemoSection $isDark={isDark}>
          <DataUIKitGuide isDark={isDark} language={language} />
          <LibraryDocDemo isDark={isDark} language={language} projectId={project.id} />
        </DemoSection>
      )}
    </DetailContainer>
  );
}
