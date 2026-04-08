import styled from 'styled-components';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { projects } from '../data/projectsData';
import { ArrowRight } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

const ProjectsSection = styled.section<{ $isDark: boolean }>`
  min-height: 100vh;
  padding: 120px 40px;
  background: ${props => props.$isDark ? '#000000' : '#ffffff'};
  transition: background 0.3s ease;

  @media (max-width: 768px) {
    padding: 80px 20px;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SectionTitle = styled.h2<{ $isDark: boolean }>`
  font-size: 56px;
  font-weight: 600;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  margin: 0 0 80px 0;
  letter-spacing: -1.5px;
  transition: color 0.3s ease;

  @media (max-width: 768px) {
    font-size: 36px;
    margin-bottom: 50px;
    letter-spacing: -1px;
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

const ViewAllButton = styled.button<{ $isDark: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 60px auto 0;
  padding: 16px 32px;
  background: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  color: ${props => props.$isDark ? '#1d1d1f' : '#f5f5f7'};
  border: none;
  border-radius: 24px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: -0.2px;

  &:hover {
    background: ${props => props.$isDark ? '#e5e5e7' : '#2d2d2d'};
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 14px 28px;
    margin-top: 40px;
  }
`;

interface ProjectsProps {
  onProjectClick: (projectId: string) => void;
  onViewAll?: () => void;
  showAll?: boolean;
}

const translations = {
  ko: {
    title: '프로젝트',
    viewAll: '전체보기'
  },
  en: {
    title: 'Projects',
    viewAll: 'View All'
  }
};

export default function Projects({ onProjectClick, onViewAll, showAll = false }: ProjectsProps) {
  const { isDark } = useTheme();
  const { language } = useLanguage();
  const t = translations[language];
  const displayProjects = showAll ? projects : projects.slice(0, 6);
  const hasMore = projects.length > 6;

  return (
    <ProjectsSection id="projects" $isDark={isDark}>
      <Container>
        <SectionTitle $isDark={isDark}>{t.title}</SectionTitle>
        <ProjectGrid>
          {displayProjects.map((project) => (
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
        {!showAll && hasMore && onViewAll && (
          <ViewAllButton $isDark={isDark} onClick={onViewAll}>
            {t.viewAll}
            <ArrowRight size={18} />
          </ViewAllButton>
        )}
      </Container>
    </ProjectsSection>
  );
}
