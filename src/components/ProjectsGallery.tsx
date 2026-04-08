import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useProjects } from '../hooks/useProjects';
import { ArrowRight, ArrowLeft } from 'lucide-react';

const GallerySection = styled.section<{ $isDark: boolean }>`
  min-height: 100vh;
  padding: 160px 40px 120px 40px;
  background: ${props => props.$isDark ? '#000000' : '#ffffff'};
  transition: background 0.3s ease;

  @media (max-width: 768px) {
    padding: 120px 20px 80px 20px;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 60px;

  @media (max-width: 768px) {
    margin-bottom: 40px;
  }
`;

const SectionTitle = styled.h2<{ $isDark: boolean }>`
  font-size: 56px;
  font-weight: 600;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  margin: 0;
  letter-spacing: -1.5px;
  transition: color 0.3s ease;

  @media (max-width: 768px) {
    font-size: 36px;
    letter-spacing: -1px;
  }
`;

const BackButton = styled.button<{ $isDark: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: ${props => props.$isDark ? '#1d1d1f' : '#f5f5f7'};
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  border: none;
  border-radius: 24px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: -0.2px;

  &:hover {
    background: ${props => props.$isDark ? '#2d2d2d' : '#e5e5e7'};
    transform: translateX(-4px);
  }

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 10px 20px;
  }
`;

const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 40px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 30px;
  }
`;

const ProjectCard = styled.div<{ $isDark: boolean }>`
  cursor: pointer;
  border-radius: 16px;
  overflow: hidden;
  background: ${props => props.$isDark ? '#0a0a0a' : '#f5f5f7'};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-8px);
    
    img {
      transform: scale(1.05);
    }
  }
`;

const ProjectImage = styled.div`
  width: 100%;
  aspect-ratio: 16 / 10;
  background: #e5e5e7;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
`;

const ProjectInfo = styled.div`
  padding: 24px;
`;

const ProjectTitle = styled.h3<{ $isDark: boolean }>`
  font-size: 24px;
  font-weight: 600;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  margin: 0 0 12px 0;
  letter-spacing: -0.5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: color 0.3s ease;

  svg {
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  ${ProjectCard}:hover & svg {
    opacity: 1;
  }

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const ProjectDescription = styled.p`
  font-size: 15px;
  color: #86868b;
  line-height: 1.6;
  margin: 0 0 16px 0;
  font-weight: 400;
  letter-spacing: -0.2px;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const ProjectTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Tag = styled.span<{ $isDark: boolean }>`
  background: ${props => props.$isDark ? '#1d1d1f' : '#ffffff'};
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: -0.2px;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    font-size: 11px;
    padding: 5px 10px;
  }
`;

const ProjectCount = styled.p<{ $isDark: boolean }>`
  font-size: 17px;
  color: ${props => props.$isDark ? '#86868b' : '#6e6e73'};
  margin: 0 0 40px 0;
  font-weight: 400;
  letter-spacing: -0.2px;

  @media (max-width: 768px) {
    font-size: 15px;
    margin-bottom: 30px;
  }
`;

interface ProjectsGalleryProps {
  onProjectClick: (projectId: string) => void;
  onBack: () => void;
}

const translations = {
  ko: {
    title: '모든 프로젝트',
    back: '홈으로',
    count: (num: number) => `총 ${num}개의 프로젝트`
  },
  en: {
    title: 'All Projects',
    back: 'Back to Home',
    count: (num: number) => `${num} Projects`
  }
};

export default function ProjectsGallery({ onProjectClick, onBack }: ProjectsGalleryProps) {
  const { isDark } = useTheme();
  const { language } = useLanguage();
  const { projects } = useProjects();
  const t = translations[language];

  return (
    <GallerySection $isDark={isDark}>
      <Container>
        <Header>
          <SectionTitle $isDark={isDark}>{t.title}</SectionTitle>
          <BackButton $isDark={isDark} onClick={onBack}>
            <ArrowLeft size={18} />
            {t.back}
          </BackButton>
        </Header>
        <ProjectCount $isDark={isDark}>{t.count(projects.length)}</ProjectCount>
        <ProjectGrid>
          {projects.map((project) => (
            <ProjectCard 
              key={project.id} 
              $isDark={isDark}
              onClick={() => onProjectClick(project.id)}
            >
              <ProjectImage>
                <ImageWithFallback
                  src={project.image}
                  alt={project.title[language]}
                />
              </ProjectImage>
              <ProjectInfo>
                <ProjectTitle $isDark={isDark}>
                  {project.title[language]}
                  <ArrowRight size={20} />
                </ProjectTitle>
                <ProjectDescription>{project.description[language]}</ProjectDescription>
                <ProjectTags>
                  {project.tags.map((tag, tagIndex) => (
                    <Tag key={tagIndex} $isDark={isDark}>{tag}</Tag>
                  ))}
                </ProjectTags>
              </ProjectInfo>
            </ProjectCard>
          ))}
        </ProjectGrid>
      </Container>
    </GallerySection>
  );
}
