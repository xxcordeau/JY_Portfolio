import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useOpenSource } from '../hooks/useOpenSource';
import { Github, Package, Star, Download, ArrowRight } from 'lucide-react';

const OpenSourceContainer = styled.div<{ $isDark: boolean }>`
  min-height: 100vh;
  background: ${props => props.$isDark ? '#000000' : '#ffffff'};
  padding-top: 80px;
  transition: background 0.3s ease;
`;

const Hero = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 40px 60px;
  text-align: center;

  @media (max-width: 768px) {
    padding: 60px 20px 40px;
  }
`;

const Title = styled.h1<{ $isDark: boolean }>`
  font-size: 56px;
  font-weight: 700;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  margin: 0 0 20px 0;
  letter-spacing: -1.5px;
  line-height: 1.1;

  @media (max-width: 768px) {
    font-size: 36px;
  }
`;

const Subtitle = styled.p<{ $isDark: boolean }>`
  font-size: 21px;
  color: ${props => props.$isDark ? '#86868b' : '#6e6e73'};
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.5;

  @media (max-width: 768px) {
    font-size: 17px;
  }
`;

const ProjectsGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px 100px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 30px;

  @media (max-width: 768px) {
    padding: 0 20px 60px;
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const ProjectCard = styled.div<{ $isDark: boolean }>`
  background: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)'};
  border: 1px solid ${props => props.$isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'};
  border-radius: 20px;
  overflow: hidden;
  backdrop-filter: blur(20px);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-8px);
    background: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
    box-shadow: ${props => props.$isDark 
      ? '0 20px 60px rgba(0, 0, 0, 0.4)'
      : '0 20px 60px rgba(0, 0, 0, 0.1)'};
  }
`;

const ProjectImage = styled.div<{ $image: string }>`
  width: 100%;
  height: 200px;
  background-image: url(${props => props.$image});
  background-size: cover;
  background-position: center;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.3) 100%);
  }
`;

const ProjectContent = styled.div`
  padding: 24px;
`;

const ProjectHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  gap: 12px;
`;

const ProjectName = styled.h3<{ $isDark: boolean }>`
  font-size: 22px;
  font-weight: 700;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  margin: 0;
  letter-spacing: -0.5px;
`;

const Category = styled.span<{ $isDark: boolean }>`
  font-size: 12px;
  color: ${props => props.$isDark ? '#86868b' : '#6e6e73'};
  background: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
  padding: 4px 12px;
  border-radius: 12px;
  white-space: nowrap;
  font-weight: 500;
`;

const ProjectDescription = styled.p<{ $isDark: boolean }>`
  font-size: 15px;
  color: ${props => props.$isDark ? '#86868b' : '#6e6e73'};
  margin: 0 0 20px 0;
  line-height: 1.5;
`;

const StatsRow = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

const Stat = styled.div<{ $isDark: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: ${props => props.$isDark ? '#86868b' : '#6e6e73'};

  svg {
    width: 14px;
    height: 14px;
    color: ${props => props.$isDark ? '#4ECDC4' : '#007AFF'};
  }
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
`;

const Tag = styled.span<{ $isDark: boolean }>`
  font-size: 11px;
  color: ${props => props.$isDark ? '#86868b' : '#6e6e73'};
  background: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
  padding: 4px 10px;
  border-radius: 8px;
  font-weight: 500;
`;

const ViewMore = styled.div<{ $isDark: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: ${props => props.$isDark ? '#4ECDC4' : '#007AFF'};
  font-weight: 600;

  svg {
    width: 16px;
    height: 16px;
    transition: transform 0.3s ease;
  }

  ${ProjectCard}:hover & svg {
    transform: translateX(4px);
  }
`;

// ── Skeleton ─────────────────────────────────────
const shimmer = `
  @keyframes sk-shimmer {
    0%   { background-position: -400% 0; }
    100% { background-position:  400% 0; }
  }
`;
const SkeletonCard = styled.div<{ $isDark: boolean }>`
  background: ${p => p.$isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'};
  border: 1px solid ${p => p.$isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'};
  border-radius: 20px;
  overflow: hidden;
`;
const SkeletonImg = styled.div<{ $isDark: boolean }>`
  width: 100%; height: 200px;
  background: linear-gradient(
    90deg,
    ${p => p.$isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'} 25%,
    ${p => p.$isDark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.09)'} 50%,
    ${p => p.$isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'} 75%
  );
  background-size: 400% 100%;
  animation: sk-shimmer 1.4s ease infinite;
  ${shimmer}
`;
const SkeletonBody = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
const SkeletonLine = styled.div<{ $isDark: boolean; $w?: string }>`
  height: 14px;
  border-radius: 6px;
  width: ${p => p.$w ?? '100%'};
  background: linear-gradient(
    90deg,
    ${p => p.$isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'} 25%,
    ${p => p.$isDark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.09)'} 50%,
    ${p => p.$isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'} 75%
  );
  background-size: 400% 100%;
  animation: sk-shimmer 1.4s ease infinite;
  ${shimmer}
`;
// ─────────────────────────────────────────────────

interface OpenSourceProps {
  onProjectClick: (id: string) => void;
}

const translations = {
  ko: {
    title: '오픈소스 프로젝트',
    subtitle: '커뮤니티와 함께 만들어가는 개발자 도구와 라이브러리',
    viewDetails: '자세히 보기'
  },
  en: {
    title: 'Open Source Projects',
    subtitle: 'Developer tools and libraries built with the community',
    viewDetails: 'View Details'
  }
};

export default function OpenSource({ onProjectClick }: OpenSourceProps) {
  const { isDark } = useTheme();
  const { language } = useLanguage();
  const { projects: openSourceProjects, loading } = useOpenSource();
  const t = translations[language];

  return (
    <OpenSourceContainer $isDark={isDark}>
      <Hero>
        <Title $isDark={isDark}>{t.title}</Title>
        <Subtitle $isDark={isDark}>{t.subtitle}</Subtitle>
      </Hero>

      <ProjectsGrid>
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} $isDark={isDark}>
              <SkeletonImg $isDark={isDark} />
              <SkeletonBody>
                <SkeletonLine $isDark={isDark} $w="60%" style={{ height: 20 }} />
                <SkeletonLine $isDark={isDark} $w="90%" />
                <SkeletonLine $isDark={isDark} $w="75%" />
                <SkeletonLine $isDark={isDark} $w="40%" />
              </SkeletonBody>
            </SkeletonCard>
          ))
        ) : openSourceProjects.map((project) => (
          <ProjectCard
            key={project.id}
            $isDark={isDark}
            onClick={() => onProjectClick(project.id)}
          >
            <ProjectImage $image={project.image} />
            <ProjectContent>
              <ProjectHeader>
                <ProjectName $isDark={isDark}>{project.name}</ProjectName>
                <Category $isDark={isDark}>{project.category[language]}</Category>
              </ProjectHeader>

              <ProjectDescription $isDark={isDark}>
                {project.description[language]}
              </ProjectDescription>

              <StatsRow>
                <Stat $isDark={isDark}>
                  <Star />
                  {project.stats.stars}
                </Stat>
                <Stat $isDark={isDark}>
                  <Download />
                  {project.stats.downloads}
                </Stat>
                <Stat $isDark={isDark}>
                  <Github />
                  {project.stats.contributors}
                </Stat>
              </StatsRow>

              <Tags>
                {project.tags.map((tag) => (
                  <Tag key={tag} $isDark={isDark}>{tag}</Tag>
                ))}
              </Tags>

              <ViewMore $isDark={isDark}>
                {t.viewDetails}
                <ArrowRight />
              </ViewMore>
            </ProjectContent>
          </ProjectCard>
        ))}
      </ProjectsGrid>
    </OpenSourceContainer>
  );
}
