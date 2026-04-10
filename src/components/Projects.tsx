import styled from 'styled-components';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useProjects } from '../hooks/useProjects';
import { ArrowRight } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

const ProjectsSection = styled.section<{ $isDark: boolean }>`
  min-height: 100vh;
  padding: 120px 0;
  background: ${props => props.$isDark ? '#000000' : '#ffffff'};
  transition: background 0.3s ease;
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    padding: 80px 0;
    display: block;
  }
`;

const Inner = styled.div`
  width: 100%;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 0 60px;
  margin-bottom: 48px;

  @media (max-width: 768px) {
    padding: 0 20px;
    margin-bottom: 32px;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`;

const SectionTitle = styled.h2<{ $isDark: boolean }>`
  font-size: 52px;
  font-weight: 700;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  margin: 0;
  letter-spacing: -1.5px;
  line-height: 1;
  transition: color 0.3s ease;

  @media (max-width: 768px) {
    font-size: 36px;
  }
`;

const ViewAllLink = styled.button<{ $isDark: boolean }>`
  background: none;
  border: none;
  color: #0c8ce9;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0;
  letter-spacing: -0.2px;
  transition: opacity 0.2s;
  white-space: nowrap;
  margin-bottom: 6px;

  &:hover { opacity: 0.7; }
  svg { width: 15px; height: 15px; }
`;

/* ── 가로 스크롤 트랙 ── */
const ScrollTrack = styled.div`
  display: flex;
  gap: 20px;
  overflow-x: auto;
  padding: 0 60px 24px;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;

  /* 스크롤바 스타일 */
  &::-webkit-scrollbar { height: 4px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: rgba(128,128,128,0.3); border-radius: 2px; }

  @media (max-width: 768px) {
    padding: 0 20px 20px;
    gap: 16px;
  }
`;

const ProjectCard = styled.div<{ $isDark: boolean }>`
  flex: 0 0 300px;
  scroll-snap-align: start;
  cursor: pointer;
  border-radius: 20px;
  overflow: hidden;
  background: ${props => props.$isDark ? '#111111' : '#f5f5f7'};
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-6px);
    img { transform: scale(1.04); }
  }

  @media (max-width: 768px) {
    flex: 0 0 240px;
  }
`;

const ProjectImage = styled.div`
  width: 100%;
  aspect-ratio: 4 / 3;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
  }
`;

const ProjectInfo = styled.div`
  padding: 20px 22px 24px;
`;

const ProjectTitle = styled.h3<{ $isDark: boolean }>`
  font-size: 20px;
  font-weight: 600;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
  transition: color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: space-between;

  svg {
    opacity: 0;
    transition: opacity 0.2s;
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }
  ${ProjectCard}:hover & svg { opacity: 1; }
`;

const ProjectDescription = styled.p`
  font-size: 13px;
  color: #86868b;
  line-height: 1.55;
  margin: 0 0 14px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ProjectTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const Tag = styled.span<{ $isDark: boolean }>`
  background: ${props => props.$isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'};
  color: ${props => props.$isDark ? '#a1a1a6' : '#6e6e73'};
  padding: 4px 10px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: -0.1px;
`;

/* ── 스켈레톤 ── */
const shimmer = `
  @keyframes shimmer {
    0% { background-position: -400% 0; }
    100% { background-position: 400% 0; }
  }
`;

const SkeletonCard = styled.div<{ $isDark: boolean }>`
  flex: 0 0 300px;
  border-radius: 20px;
  overflow: hidden;
  background: ${p => p.$isDark ? '#111111' : '#f5f5f7'};
`;

const SkeletonImage = styled.div<{ $isDark: boolean }>`
  width: 100%;
  aspect-ratio: 4 / 3;
  background: linear-gradient(
    90deg,
    ${p => p.$isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'} 25%,
    ${p => p.$isDark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.09)'} 50%,
    ${p => p.$isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'} 75%
  );
  background-size: 400% 100%;
  animation: shimmer 1.4s ease infinite;
  ${shimmer}
`;

const SkeletonLine = styled.div<{ $isDark: boolean; $width?: string }>`
  height: 14px;
  border-radius: 7px;
  width: ${p => p.$width ?? '100%'};
  margin-bottom: 10px;
  background: linear-gradient(
    90deg,
    ${p => p.$isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'} 25%,
    ${p => p.$isDark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.09)'} 50%,
    ${p => p.$isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'} 75%
  );
  background-size: 400% 100%;
  animation: shimmer 1.4s ease infinite;
`;

interface ProjectsProps {
  onProjectClick: (projectId: string) => void;
  onViewAll?: () => void;
  showAll?: boolean;
}

const translations = {
  ko: { title: '프로젝트', viewAll: '모두 보기 ›' },
  en: { title: 'Projects',  viewAll: 'View All ›'  },
};

export default function Projects({ onProjectClick, onViewAll, showAll = false }: ProjectsProps) {
  const { isDark } = useTheme();
  const { language } = useLanguage();
  const { projects, loading } = useProjects();
  const t = translations[language];
  const displayProjects = showAll ? projects : projects.slice(0, 8);

  return (
    <ProjectsSection id="projects" $isDark={isDark}>
      <Inner>
        <TitleRow>
          <SectionTitle $isDark={isDark}>{t.title}</SectionTitle>
          {onViewAll && (
            <ViewAllLink $isDark={isDark} onClick={onViewAll}>
              {t.viewAll}
              <ArrowRight />
            </ViewAllLink>
          )}
        </TitleRow>

        <ScrollTrack>
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <SkeletonCard key={i} $isDark={isDark}>
                  <SkeletonImage $isDark={isDark} />
                  <ProjectInfo>
                    <SkeletonLine $isDark={isDark} $width="55%" style={{ height: 20, marginBottom: 12 }} />
                    <SkeletonLine $isDark={isDark} />
                    <SkeletonLine $isDark={isDark} $width="75%" />
                  </ProjectInfo>
                </SkeletonCard>
              ))
            : displayProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  $isDark={isDark}
                  onClick={() => onProjectClick(project.id)}
                >
                  <ProjectImage>
                    <ImageWithFallback src={project.image} alt={project.title[language]} />
                  </ProjectImage>
                  <ProjectInfo>
                    <ProjectTitle $isDark={isDark}>
                      {project.title[language]}
                      <ArrowRight size={20} />
                    </ProjectTitle>
                    <ProjectDescription>{project.description[language]}</ProjectDescription>
                    <ProjectTags>
                      {project.tags.map((tag, i) => (
                        <Tag key={i} $isDark={isDark}>{tag}</Tag>
                      ))}
                    </ProjectTags>
                  </ProjectInfo>
                </ProjectCard>
              ))
          }
        </ScrollTrack>
      </Inner>
    </ProjectsSection>
  );
}
