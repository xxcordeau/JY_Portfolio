import { useRef, useCallback } from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useOpenSource } from '../hooks/useOpenSource';
import { Github, Package, Star, Download, ArrowRight } from 'lucide-react';

const OpenSourceContainer = styled.div<{ $isDark: boolean; $compact: boolean }>`
  min-height: 100vh;
  background: ${props => props.$isDark ? '#000000' : '#ffffff'};
  transition: background 0.3s ease;
  ${p => p.$compact ? css`
    padding: 120px 0 60px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  ` : css`
    padding-top: 80px;
  `}

  @media (max-width: 768px) {
    ${p => p.$compact && css`
      padding: 80px 0 40px;
      display: block;
    `}
  }
`;

const Hero = styled.div<{ $compact: boolean }>`
  width: 100%;
  ${p => p.$compact ? css`
    padding: 0 40px 32px 12vw;
    text-align: left;
  ` : css`
    max-width: 1200px;
    margin: 0 auto;
    padding: 80px 40px 60px;
    text-align: center;
  `}

  @media (max-width: 768px) {
    padding: ${p => p.$compact ? '0 20px 24px' : '60px 20px 40px'};
  }
`;

const TitleRow = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 0 12vw;
  margin-bottom: 48px;

  @media (max-width: 768px) {
    padding: 0 20px;
    margin-bottom: 32px;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`;

const Title = styled.h1<{ $isDark: boolean; $compact: boolean }>`
  font-size: ${p => p.$compact ? '52px' : '56px'};
  font-weight: ${p => p.$compact ? '700' : '700'};
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  margin: 0;
  letter-spacing: ${p => p.$compact ? '-1.5px' : '-1.5px'};
  line-height: 1;

  @media (max-width: 768px) {
    font-size: 36px;
  }
`;

const Subtitle = styled.p<{ $isDark: boolean; $compact: boolean }>`
  font-size: ${p => p.$compact ? '16px' : '21px'};
  color: ${props => props.$isDark ? '#86868b' : '#6e6e73'};
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.5;
  ${p => p.$compact && css`display: none;`}

  @media (max-width: 768px) {
    font-size: ${p => p.$compact ? '14px' : '17px'};
  }
`;

const ViewAllButton = styled.button<{ $isDark: boolean }>`
  background: transparent;
  border: 2px solid ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  padding: 12px 24px;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  margin-bottom: 6px;

  &:hover {
    background: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
    color: ${props => props.$isDark ? '#1d1d1f' : '#f5f5f7'};
  }

  svg { width: 16px; height: 16px; }
`;

/* ── 가로 스크롤 트랙 (compact) ── */
const ScrollTrack = styled.div`
  display: flex;
  gap: 20px;
  overflow-x: auto;
  padding: 10px 0 0 12vw;
  scrollbar-width: none;
  -ms-overflow-style: none;
  cursor: grab;
  user-select: none;
  &::-webkit-scrollbar { display: none; }

  @media (max-width: 768px) {
    padding: 0 0 0 20px;
  }
`;

const ProjectsGrid = styled.div<{ $compact: boolean }>`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  ${p => p.$compact ? css`
    padding: 0 40px;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 24px;
  ` : css`
    padding: 0 40px 100px;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 30px;
  `}
  display: grid;

  @media (max-width: 768px) {
    padding: ${p => p.$compact ? '0 20px' : '0 20px 60px'};
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const ProjectCard = styled.div<{ $isDark: boolean; $compact?: boolean }>`
  background: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)'};
  border: 1px solid ${props => props.$isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'};
  border-radius: 20px;
  overflow: hidden;
  backdrop-filter: blur(20px);
  transition: all 0.3s ease;
  cursor: pointer;
  ${p => p.$compact && css`
    flex: 0 0 340px;
    scroll-snap-align: start;
  `}

  &:hover {
    transform: translateY(-8px);
    background: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
    box-shadow: ${props => props.$isDark
      ? '0 20px 60px rgba(0, 0, 0, 0.4)'
      : '0 20px 60px rgba(0, 0, 0, 0.1)'};
  }
`;

const ProjectImage = styled.div<{ $image: string; $compact: boolean }>`
  width: 100%;
  height: ${p => p.$compact ? '140px' : '200px'};
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

const ProjectContent = styled.div<{ $compact: boolean }>`
  padding: ${p => p.$compact ? '18px 20px' : '24px'};
`;

const ProjectHeader = styled.div<{ $compact: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${p => p.$compact ? '10px' : '16px'};
  gap: 12px;
`;

const ProjectName = styled.h3<{ $isDark: boolean; $compact: boolean }>`
  font-size: ${p => p.$compact ? '18px' : '22px'};
  font-weight: ${p => p.$compact ? '600' : '700'};
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  margin: 0;
  letter-spacing: -0.4px;
`;

const Category = styled.span<{ $isDark: boolean; $compact: boolean }>`
  font-size: ${p => p.$compact ? '11px' : '12px'};
  color: ${props => props.$isDark ? '#86868b' : '#6e6e73'};
  background: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
  padding: ${p => p.$compact ? '3px 10px' : '4px 12px'};
  border-radius: 12px;
  white-space: nowrap;
  font-weight: 500;
`;

const ProjectDescription = styled.p<{ $isDark: boolean; $compact: boolean }>`
  font-size: ${p => p.$compact ? '13px' : '15px'};
  color: ${props => props.$isDark ? '#86868b' : '#6e6e73'};
  margin: 0 0 ${p => p.$compact ? '12px' : '20px'} 0;
  line-height: 1.5;
  ${p => p.$compact && css`
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  `}
`;

const StatsRow = styled.div<{ $compact: boolean }>`
  display: flex;
  gap: ${p => p.$compact ? '12px' : '16px'};
  margin-bottom: ${p => p.$compact ? '10px' : '16px'};
  flex-wrap: wrap;
`;

const Stat = styled.div<{ $isDark: boolean; $compact: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: ${p => p.$compact ? '12px' : '13px'};
  color: ${props => props.$isDark ? '#86868b' : '#6e6e73'};

  svg {
    width: ${p => p.$compact ? '12px' : '14px'};
    height: ${p => p.$compact ? '12px' : '14px'};
    color: ${props => props.$isDark ? '#4ECDC4' : '#007AFF'};
  }
`;

const Tags = styled.div<{ $compact: boolean }>`
  display: flex;
  flex-wrap: wrap;
  gap: ${p => p.$compact ? '6px' : '8px'};
  margin-bottom: ${p => p.$compact ? '10px' : '16px'};
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
const SkeletonCard = styled.div<{ $isDark: boolean; $compact?: boolean }>`
  background: ${p => p.$isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'};
  border: 1px solid ${p => p.$isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'};
  border-radius: 20px;
  overflow: hidden;
  ${p => p.$compact && css`
    flex: 0 0 340px;
  `}
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
  /** Home preview mode: left-aligned title, no subtitle, compact cards, limited count */
  compact?: boolean;
  /** Max number of items to show in compact mode */
  limit?: number;
  /** Callback for "View All" button in compact mode */
  onViewAll?: () => void;
}

const translations = {
  ko: {
    title: '오픈소스',
    subtitle: '커뮤니티와 함께 만들어가는 개발자 도구와 라이브러리',
    viewDetails: '자세히 보기',
    viewAll: '전체보기'
  },
  en: {
    title: 'Open Source',
    subtitle: 'Developer tools and libraries built with the community',
    viewDetails: 'View Details',
    viewAll: 'View All'
  }
};

export default function OpenSource({
  onProjectClick,
  compact = false,
  limit,
  onViewAll,
}: OpenSourceProps) {
  const { isDark } = useTheme();
  const { language } = useLanguage();
  const { projects: openSourceProjects, loading } = useOpenSource();
  const t = translations[language];
  const displayProjects =
    compact && typeof limit === 'number'
      ? openSourceProjects.slice(0, limit)
      : openSourceProjects;

  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.pageX - (trackRef.current?.offsetLeft ?? 0);
    scrollLeft.current = trackRef.current?.scrollLeft ?? 0;
    if (trackRef.current) trackRef.current.style.cursor = 'grabbing';
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current || !trackRef.current) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.2;
    trackRef.current.scrollLeft = scrollLeft.current - walk;
  }, []);

  const onMouseUp = useCallback(() => {
    isDragging.current = false;
    if (trackRef.current) trackRef.current.style.cursor = 'grab';
  }, []);

  if (compact) {
    return (
      <OpenSourceContainer $isDark={isDark} $compact={compact}>
        <TitleRow>
          <Title $isDark={isDark} $compact={compact}>{t.title}</Title>
          {onViewAll && (
            <ViewAllButton $isDark={isDark} onClick={onViewAll}>
              {t.viewAll}
              <ArrowRight />
            </ViewAllButton>
          )}
        </TitleRow>

        <ScrollTrack
          ref={trackRef}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        >
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <SkeletonCard key={i} $isDark={isDark} $compact>
                <SkeletonImg $isDark={isDark} />
                <SkeletonBody>
                  <SkeletonLine $isDark={isDark} $w="60%" style={{ height: 20 }} />
                  <SkeletonLine $isDark={isDark} $w="90%" />
                  <SkeletonLine $isDark={isDark} $w="75%" />
                  <SkeletonLine $isDark={isDark} $w="40%" />
                </SkeletonBody>
              </SkeletonCard>
            ))
          ) : displayProjects.map((project) => (
            <ProjectCard
              key={project.id}
              $isDark={isDark}
              $compact
              onClick={() => { if (!isDragging.current) onProjectClick(project.id); }}
            >
              <ProjectImage $image={project.image} $compact={compact} />
              <ProjectContent $compact={compact}>
                <ProjectHeader $compact={compact}>
                  <ProjectName $isDark={isDark} $compact={compact}>{project.name}</ProjectName>
                  <Category $isDark={isDark} $compact={compact}>{project.category[language]}</Category>
                </ProjectHeader>

                <ProjectDescription $isDark={isDark} $compact={compact}>
                  {project.description[language]}
                </ProjectDescription>

                <StatsRow $compact={compact}>
                  <Stat $isDark={isDark} $compact={compact}>
                    <Star />
                    {project.stats.stars}
                  </Stat>
                  <Stat $isDark={isDark} $compact={compact}>
                    <Download />
                    {project.stats.downloads}
                  </Stat>
                  <Stat $isDark={isDark} $compact={compact}>
                    <Github />
                    {project.stats.contributors}
                  </Stat>
                </StatsRow>

                <Tags $compact={compact}>
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
        </ScrollTrack>
      </OpenSourceContainer>
    );
  }

  return (
    <OpenSourceContainer $isDark={isDark} $compact={compact}>
      <Hero $compact={compact}>
        <Title $isDark={isDark} $compact={compact}>{t.title}</Title>
        <Subtitle $isDark={isDark} $compact={compact}>{t.subtitle}</Subtitle>
      </Hero>

      <ProjectsGrid $compact={compact}>
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
        ) : displayProjects.map((project) => (
          <ProjectCard
            key={project.id}
            $isDark={isDark}
            onClick={() => onProjectClick(project.id)}
          >
            <ProjectImage $image={project.image} $compact={compact} />
            <ProjectContent $compact={compact}>
              <ProjectHeader $compact={compact}>
                <ProjectName $isDark={isDark} $compact={compact}>{project.name}</ProjectName>
                <Category $isDark={isDark} $compact={compact}>{project.category[language]}</Category>
              </ProjectHeader>

              <ProjectDescription $isDark={isDark} $compact={compact}>
                {project.description[language]}
              </ProjectDescription>

              <StatsRow $compact={compact}>
                <Stat $isDark={isDark} $compact={compact}>
                  <Star />
                  {project.stats.stars}
                </Stat>
                <Stat $isDark={isDark} $compact={compact}>
                  <Download />
                  {project.stats.downloads}
                </Stat>
                <Stat $isDark={isDark} $compact={compact}>
                  <Github />
                  {project.stats.contributors}
                </Stat>
              </StatsRow>

              <Tags $compact={compact}>
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
