import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useProjects } from '../hooks/useProjects';
import { supabase } from '../lib/supabase';
import type { DbProjectImage } from '../lib/types/database';
import { ArrowLeft, ExternalLink, Github } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import Footer from './Footer';
import BookCollectionDemo from './interactive/BookCollectionDemo';
import DrawingToolDemo from './interactive/DrawingToolDemo';
import TextHighlightDemo from './interactive/TextHighlightDemo';
import TextHoverDemo from './interactive/TextHoverDemo';
import MouseFollowTextDemo from './interactive/MouseFollowTextDemo';

const DetailContainer = styled.div<{ $isDark: boolean }>`
  min-height: 100vh;
  background: ${props => props.$isDark ? '#000000' : '#ffffff'};
  padding-top: 80px;
  transition: background 0.3s ease;
`;

const BackButton = styled.button<{ $isDark: boolean }>`
  position: fixed;
  top: 100px;
  left: 40px;
  background: ${props => props.$isDark ? '#1d1d1f' : '#f5f5f7'};
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  border: none;
  padding: 12px 24px;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  z-index: 100;

  &:hover {
    opacity: 0.8;
  }

  @media (max-width: 768px) {
    position: fixed;
    top: auto;
    bottom: 24px;
    left: 20px;
    padding: 10px 18px;
    font-size: 13px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  }
`;

const Hero = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 40px;

  @media (max-width: 768px) {
    padding: 40px 20px;
  }
`;

const HeroImage = styled.div`
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 24px;
  overflow: hidden;
  margin-bottom: 60px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 768px) {
    border-radius: 16px;
    margin-bottom: 40px;
  }
`;

const Title = styled.h1<{ $isDark: boolean }>`
  font-size: 64px;
  font-weight: 600;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  margin: 0 0 24px 0;
  letter-spacing: -2px;
  transition: color 0.3s ease;

  @media (max-width: 768px) {
    font-size: 36px;
    letter-spacing: -1px;
  }
`;

const Metadata = styled.div`
  display: flex;
  gap: 40px;
  margin-bottom: 40px;
  flex-wrap: wrap;
`;

const MetaItem = styled.div``;

const MetaLabel = styled.div`
  font-size: 12px;
  color: #86868b;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
  font-weight: 500;
`;

const MetaValue = styled.div<{ $isDark: boolean }>`
  font-size: 16px;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  font-weight: 500;
  transition: color 0.3s ease;
`;

const Description = styled.p<{ $isDark: boolean }>`
  font-size: 20px;
  color: ${props => props.$isDark ? '#a1a1a6' : '#1d1d1f'};
  line-height: 1.7;
  margin: 0 0 40px 0;
  white-space: pre-line;
  transition: color 0.3s ease;

  @media (max-width: 768px) {
    font-size: 17px;
  }
`;

const Links = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 80px;
`;

const LinkButton = styled.a<{ $isDark: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: ${props => props.$isDark ? '#1d1d1f' : '#f5f5f7'};
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  text-decoration: none;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.8;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const Section = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 40px;
  border-top: 1px solid ${props => props.$isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};

  @media (max-width: 768px) {
    padding: 60px 20px;
  }
`;

const SectionTitle = styled.h2<{ $isDark: boolean }>`
  font-size: 36px;
  font-weight: 600;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  margin: 0 0 40px 0;
  letter-spacing: -1px;
  transition: color 0.3s ease;

  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const HighlightsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 16px;
`;

const HighlightItem = styled.li<{ $isDark: boolean }>`
  font-size: 17px;
  color: ${props => props.$isDark ? '#a1a1a6' : '#1d1d1f'};
  padding-left: 28px;
  position: relative;
  line-height: 1.6;
  transition: color 0.3s ease;

  &:before {
    content: '•';
    position: absolute;
    left: 0;
    color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
    font-size: 24px;
  }

  @media (max-width: 768px) {
    font-size: 15px;
  }
`;

const TechStackGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 30px;
  }
`;

const TechCategory = styled.div``;

const TechCategoryTitle = styled.h3<{ $isDark: boolean }>`
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  margin: 0 0 16px 0;
  letter-spacing: -0.3px;
  transition: color 0.3s ease;
`;

const TechList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TechItem = styled.div`
  font-size: 15px;
  color: #86868b;
  line-height: 1.6;
`;

const ImagesSection = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 40px;

  @media (max-width: 768px) {
    padding: 60px 20px;
  }
`;

const ProjectImageWrapper = styled.div`
  margin-bottom: 48px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const ProjectImage = styled.img<{ $isDark: boolean }>`
  width: 100%;
  border-radius: 16px;
  display: block;
  box-shadow: ${p => p.$isDark
    ? '0 4px 24px rgba(0, 0, 0, 0.4)'
    : '0 4px 24px rgba(0, 0, 0, 0.08)'};

  @media (max-width: 768px) {
    border-radius: 12px;
  }
`;

const ImageCaption = styled.p<{ $isDark: boolean }>`
  font-size: 14px;
  color: ${p => p.$isDark ? '#86868b' : '#6e6e73'};
  text-align: center;
  margin-top: 12px;
  line-height: 1.5;
`;

interface ProjectDetailProps {
  projectId: string;
  onBack: () => void;
}

const translations = {
  ko: {
    back: '뒤로가기',
    year: '연도',
    role: '역할',
    highlights: '주요 성과',
    techStack: '기술 스택',
    tryDemo: '인터랙티브 데모',
    frontend: '프론트엔드',
    backend: '백엔드',
    design: '디자인',
    others: '기타',
    viewDemo: '데모 보기',
    viewGithub: 'GitHub',
    viewWebsite: '웹사이트'
  },
  en: {
    back: 'Back',
    year: 'Year',
    role: 'Role',
    highlights: 'Highlights',
    techStack: 'Tech Stack',
    tryDemo: 'Interactive Demo',
    frontend: 'Frontend',
    backend: 'Backend',
    design: 'Design',
    others: 'Others',
    viewDemo: 'View Demo',
    viewGithub: 'GitHub',
    viewWebsite: 'Website'
  }
};

const categoryTranslations = {
  ko: {
    frontend: '프론트엔드',
    backend: '백엔드',
    design: '디자인',
    others: '기타'
  },
  en: {
    frontend: 'Frontend',
    backend: 'Backend',
    design: 'Design',
    others: 'Others'
  }
};

export default function ProjectDetail({ projectId, onBack }: ProjectDetailProps) {
  const { isDark } = useTheme();
  const { language } = useLanguage();
  const { projects, loading: projectsLoading } = useProjects();
  const project = projects.find(p => p.id === projectId);
  const t = translations[language];
  const ct = categoryTranslations[language];

  const [projectImages, setProjectImages] = useState<DbProjectImage[]>([]);

  useEffect(() => {
    supabase.from('project_images')
      .select('*')
      .eq('project_id', projectId)
      .order('sort_order')
      .then(({ data }) => {
        if (data) setProjectImages(data as DbProjectImage[]);
      });
  }, [projectId]);

  if (projectsLoading) {
    return (
      <DetailContainer $isDark={isDark} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#86868b', fontSize: 16 }}>불러오는 중...</div>
      </DetailContainer>
    );
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  // Check if project has interactive demo
  const interactiveProjects = ['book-collection', 'drawing-tool', 'text-highlight', 'text-hover-highlight', 'mouse-follow-text'];
  const hasInteractiveDemo = interactiveProjects.includes(projectId);

  const renderInteractiveDemo = () => {
    switch(projectId) {
      case 'book-collection':
        return <BookCollectionDemo isDark={isDark} language={language} />;
      case 'drawing-tool':
        return <DrawingToolDemo isDark={isDark} language={language} />;
      case 'text-highlight':
        return <TextHighlightDemo isDark={isDark} language={language} />;
      case 'text-hover-highlight':
        return <TextHoverDemo isDark={isDark} language={language} />;
      case 'mouse-follow-text':
        return <MouseFollowTextDemo isDark={isDark} language={language} />;
      default:
        return null;
    }
  };

  return (
    <DetailContainer $isDark={isDark}>
      <BackButton $isDark={isDark} onClick={onBack}>
        <ArrowLeft size={16} />
        {t.back}
      </BackButton>

      <Hero>
        <HeroImage>
          <ImageWithFallback src={project.image} alt={project.title[language]} />
        </HeroImage>

        <Title $isDark={isDark}>{project.title[language]}</Title>
        
        <Metadata>
          <MetaItem>
            <MetaLabel>{t.year}</MetaLabel>
            <MetaValue $isDark={isDark}>{project.year}</MetaValue>
          </MetaItem>
          <MetaItem>
            <MetaLabel>{t.role}</MetaLabel>
            <MetaValue $isDark={isDark}>{project.role[language]}</MetaValue>
          </MetaItem>
        </Metadata>

        <Description $isDark={isDark}>{project.fullDescription[language]}</Description>

        {project.links && (
          <Links>
            {project.links.github && (
              <LinkButton $isDark={isDark} href={project.links.github} target="_blank" rel="noopener noreferrer">
                <Github />
                {t.viewGithub}
              </LinkButton>
            )}
            {project.links.demo && (
              <LinkButton $isDark={isDark} href={project.links.demo} target="_blank" rel="noopener noreferrer">
                <ExternalLink />
                {t.viewDemo}
              </LinkButton>
            )}
            {project.links.website && (
              <LinkButton $isDark={isDark} href={project.links.website} target="_blank" rel="noopener noreferrer">
                <ExternalLink />
                {t.viewWebsite}
              </LinkButton>
            )}
          </Links>
        )}
      </Hero>

      {projectImages.length > 0 && (
        <ImagesSection>
          {projectImages.map(img => {
            const caption = language === 'ko' ? img.caption_ko : img.caption_en;
            return (
              <ProjectImageWrapper key={img.id}>
                <ProjectImage $isDark={isDark} src={img.url} alt={caption || ''} loading="lazy" />
                {caption && <ImageCaption $isDark={isDark}>{caption}</ImageCaption>}
              </ProjectImageWrapper>
            );
          })}
        </ImagesSection>
      )}

      {hasInteractiveDemo && (
        <Section style={{ borderTop: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}` }}>
          <SectionTitle $isDark={isDark}>{t.tryDemo}</SectionTitle>
          {renderInteractiveDemo()}
        </Section>
      )}

      <Section style={{ borderTop: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}` }}>
        <SectionTitle $isDark={isDark}>{t.highlights}</SectionTitle>
        <HighlightsList>
          {project.highlights[language].map((highlight, index) => (
            <HighlightItem key={index} $isDark={isDark}>{highlight}</HighlightItem>
          ))}
        </HighlightsList>
      </Section>

      <Section style={{ borderTop: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}` }}>
        <SectionTitle $isDark={isDark}>{t.techStack}</SectionTitle>
        <TechStackGrid>
          {project.techStack.frontend && (
            <TechCategory>
              <TechCategoryTitle $isDark={isDark}>{ct.frontend}</TechCategoryTitle>
              <TechList>
                {project.techStack.frontend.map((tech, index) => (
                  <TechItem key={index}>{tech}</TechItem>
                ))}
              </TechList>
            </TechCategory>
          )}
          {project.techStack.backend && (
            <TechCategory>
              <TechCategoryTitle $isDark={isDark}>{ct.backend}</TechCategoryTitle>
              <TechList>
                {project.techStack.backend.map((tech, index) => (
                  <TechItem key={index}>{tech}</TechItem>
                ))}
              </TechList>
            </TechCategory>
          )}
          {project.techStack.design && (
            <TechCategory>
              <TechCategoryTitle $isDark={isDark}>{ct.design}</TechCategoryTitle>
              <TechList>
                {project.techStack.design.map((tech, index) => (
                  <TechItem key={index}>{tech}</TechItem>
                ))}
              </TechList>
            </TechCategory>
          )}
          {project.techStack.others && (
            <TechCategory>
              <TechCategoryTitle $isDark={isDark}>{ct.others}</TechCategoryTitle>
              <TechList>
                {project.techStack.others.map((tech, index) => (
                  <TechItem key={index}>{tech}</TechItem>
                ))}
              </TechList>
            </TechCategory>
          )}
        </TechStackGrid>
      </Section>

      <Footer language={language} isDark={isDark} />
    </DetailContainer>
  );
}
