import styled, { keyframes } from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useOpenSource } from '../hooks/useOpenSource';
import { Github, Star, Download, ArrowRight, ArrowLeft } from 'lucide-react';

/* ── Keyframes ── */
const shimmer = keyframes`
  0% { background-position: -400% 0; }
  100% { background-position: 400% 0; }
`;

/* ── Layout (same as Projects) ── */
const OpenSourceSection = styled.section<{ $isDark: boolean }>`
  padding: 120px 0 80px;
  background: ${p => p.$isDark ? '#000000' : '#ffffff'};
  transition: background 0.3s ease;

  @media (max-width: 768px) {
    padding: 80px 0 60px;
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

/* ── Header (same as Projects) ── */
const SectionEyebrow = styled.span<{ $isDark: boolean }>`
  display: block;
  font-size: 13px;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: ${p => p.$isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)'};
  margin-bottom: 12px;
  text-align: center;
`;

const SectionTitle = styled.h2<{ $isDark: boolean }>`
  font-size: 40px;
  font-weight: 700;
  color: ${p => p.$isDark ? '#f5f5f7' : '#1d1d1f'};
  margin: 0 0 16px 0;
  letter-spacing: -1px;
  line-height: 1.15;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 30px;
  }
`;

const SectionSubtitle = styled.p<{ $isDark: boolean }>`
  font-size: 16px;
  color: ${p => p.$isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)'};
  margin: 0 0 48px 0;
  line-height: 1.5;

  @media (max-width: 768px) {
    font-size: 14px;
    margin-bottom: 36px;
  }
`;

const BackButton = styled.button<{ $isDark: boolean }>`
  background: none;
  border: none;
  padding: 0;
  font-size: 14px;
  font-weight: 500;
  color: ${p => p.$isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)'};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 32px;
  transition: color 0.2s;
  font-family: inherit;

  &:hover {
    color: ${p => p.$isDark ? '#f5f5f7' : '#1d1d1f'};
  }

  svg { width: 16px; height: 16px; }
`;

/* ── Grid (same as Projects: 3 columns) ── */
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

/* ── Card (same hover pattern as Projects) ── */
const CardWrapper = styled.div`
  cursor: pointer;
`;

const ImageContainer = styled.div<{ $image: string }>`
  position: relative;
  border-radius: 14px;
  overflow: hidden;
  aspect-ratio: 4 / 3;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url(${p => p.$image});
    background-size: cover;
    background-position: center;
    transition: transform 0.4s ease, filter 0.4s ease;
  }

  ${CardWrapper}:hover &::before {
    transform: scale(1.04);
    filter: blur(3px) brightness(0.65);
  }
`;

const ImageOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  opacity: 0;
  transition: opacity 0.35s ease;

  ${CardWrapper}:hover & {
    opacity: 1;
  }
`;

const OverlayText = styled.p`
  font-size: 13px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  text-align: center;
  max-width: 280px;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CardMeta = styled.div`
  padding: 12px 2px 0;
`;

const ProjectName = styled.h3<{ $isDark: boolean }>`
  font-size: 15px;
  font-weight: 600;
  color: ${p => p.$isDark ? '#f5f5f7' : '#1d1d1f'};
  margin: 0;
  letter-spacing: -0.2px;
`;

const ProjectInfo = styled.div<{ $isDark: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 4px;
`;

const ProjectCategory = styled.span<{ $isDark: boolean }>`
  font-size: 12px;
  color: ${p => p.$isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)'};
  font-weight: 400;
`;

const Stat = styled.span<{ $isDark: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 11px;
  color: ${p => p.$isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'};

  svg { width: 11px; height: 11px; }
`;

/* ── View All (bottom, same as Projects) ── */
const ViewAllBottom = styled.div`
  text-align: center;
  margin-top: 48px;
`;

const ViewAllButton = styled.button<{ $isDark: boolean }>`
  background: none;
  border: 1px solid ${p => p.$isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)'};
  padding: 12px 32px;
  border-radius: 100px;
  font-size: 14px;
  font-weight: 500;
  color: ${p => p.$isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)'};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  font-family: inherit;

  svg { width: 16px; height: 16px; transition: transform 0.2s ease; }

  &:hover {
    color: ${p => p.$isDark ? '#f5f5f7' : '#1d1d1f'};
    border-color: ${p => p.$isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.25)'};
    svg { transform: translateX(3px); }
  }
`;

/* ── Skeleton ── */
const SkeletonBox = styled.div<{ $isDark: boolean }>`
  border-radius: 14px;
  aspect-ratio: 4 / 3;
  background: linear-gradient(
    90deg,
    ${p => p.$isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'} 25%,
    ${p => p.$isDark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.09)'} 50%,
    ${p => p.$isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'} 75%
  );
  background-size: 400% 100%;
  animation: ${shimmer} 1.4s ease infinite;
`;

const SkeletonLine = styled.div<{ $isDark: boolean; $width?: string }>`
  height: 14px;
  border-radius: 7px;
  width: ${p => p.$width ?? '100%'};
  background: linear-gradient(
    90deg,
    ${p => p.$isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'} 25%,
    ${p => p.$isDark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.09)'} 50%,
    ${p => p.$isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'} 75%
  );
  background-size: 400% 100%;
  animation: ${shimmer} 1.4s ease infinite;
`;

/* ── Translations ── */
const translations = {
  ko: {
    back: '뒤로가기',
    eyebrow: 'OPEN SOURCE',
    title: '컴포넌트 라이브러리',
    subtitle: '직접 만들고 공개한 라이브러리, 컴포넌트, 그리고 작은 실험들',
    viewAll: '전체 보기',
  },
  en: {
    back: 'Back',
    eyebrow: 'OPEN SOURCE',
    title: 'Component Library',
    subtitle: "Libraries, components, and small experiments I've built and open-sourced",
    viewAll: 'View All',
  },
};

/* ── Component ── */
interface OpenSourceProps {
  onProjectClick: (id: string) => void;
  compact?: boolean;
  limit?: number;
  onViewAll?: () => void;
  onBack?: () => void;
}

export default function OpenSource({
  onProjectClick,
  compact = false,
  limit,
  onViewAll,
  onBack,
}: OpenSourceProps) {
  const { isDark } = useTheme();
  const { language } = useLanguage();
  const { projects: openSourceProjects, loading } = useOpenSource();
  const t = translations[language];

  const displayProjects =
    compact && typeof limit === 'number'
      ? openSourceProjects.slice(0, limit)
      : openSourceProjects;

  const skeletonCount = compact && typeof limit === 'number' ? limit : 3;

  return (
    <OpenSourceSection $isDark={isDark}>
      <Container>
        {/* Back button — full page only */}
        {!compact && onBack && (
          <BackButton $isDark={isDark} onClick={onBack}>
            <ArrowLeft />
            {t.back}
          </BackButton>
        )}

        <SectionEyebrow $isDark={isDark}>{t.eyebrow}</SectionEyebrow>
        <SectionTitle $isDark={isDark}>{t.title}</SectionTitle>
        {!compact && <SectionSubtitle $isDark={isDark}>{t.subtitle}</SectionSubtitle>}
        {compact && <div style={{ marginBottom: 48 }} />}

        <Grid>
          {loading
            ? Array.from({ length: skeletonCount }).map((_, i) => (
                <div key={i}>
                  <SkeletonBox $isDark={isDark} />
                  <CardMeta>
                    <SkeletonLine $isDark={isDark} $width="50%" style={{ height: 14, marginBottom: 6 }} />
                    <SkeletonLine $isDark={isDark} $width="30%" style={{ height: 11 }} />
                  </CardMeta>
                </div>
              ))
            : displayProjects.map((project) => (
                <CardWrapper key={project.id} onClick={() => onProjectClick(project.id)}>
                  <ImageContainer $image={project.image}>
                    <ImageOverlay>
                      <OverlayText>{project.description[language]}</OverlayText>
                    </ImageOverlay>
                  </ImageContainer>
                  <CardMeta>
                    <ProjectName $isDark={isDark}>{project.name}</ProjectName>
                    <ProjectInfo $isDark={isDark}>
                      <ProjectCategory $isDark={isDark}>
                        {project.category[language]}
                      </ProjectCategory>
                      <Stat $isDark={isDark}><Star /> {project.stats.stars}</Stat>
                      <Stat $isDark={isDark}><Download /> {project.stats.downloads}</Stat>
                      <Stat $isDark={isDark}><Github /> {project.stats.contributors}</Stat>
                    </ProjectInfo>
                  </CardMeta>
                </CardWrapper>
              ))
          }
        </Grid>

        {compact && onViewAll && (
          <ViewAllBottom>
            <ViewAllButton $isDark={isDark} onClick={onViewAll}>
              {t.viewAll}
              <ArrowRight />
            </ViewAllButton>
          </ViewAllBottom>
        )}
      </Container>
    </OpenSourceSection>
  );
}
