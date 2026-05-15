import { useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useProjects } from '../hooks/useProjects';
import { ArrowLeft } from 'lucide-react';
import { resolveIcon } from '../lib/techIcons';

/* ── Keyframes ── */
const shimmer = keyframes`
  0% { background-position: -400% 0; }
  100% { background-position: 400% 0; }
`;

/* ── Full-viewport section per group ── */
const GroupSection = styled.section<{ $isDark: boolean }>`
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: ${p => p.$isDark ? '#000000' : '#ffffff'};
  transition: background 0.3s ease;
  padding: 80px 0;
`;

/* ── First section needs extra top padding for header ── */
const FirstSection = styled(GroupSection)`
  padding-top: 160px;

  @media (max-width: 768px) {
    padding-top: 120px;
  }
`;

const Container = styled.div`
  max-width: 1100px;
  width: 100%;
  margin: 0 auto;
  padding: 0 40px;

  @media (max-width: 768px) {
    padding: 0 20px;
  }
`;

/* ── Group header ── */
const GroupEyebrow = styled.span<{ $isDark: boolean }>`
  display: block;
  font-size: 13px;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: ${p => p.$isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)'};
  margin-bottom: 12px;
  text-align: center;
`;

const GroupTitle = styled.h2<{ $isDark: boolean }>`
  font-size: 40px;
  font-weight: 700;
  color: ${p => p.$isDark ? '#f5f5f7' : '#1d1d1f'};
  margin: 0 0 48px 0;
  letter-spacing: -1px;
  line-height: 1.15;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 30px;
    margin-bottom: 36px;
  }
`;

/* ── Back button (fixed pill) ── */
const BackButton = styled.button<{ $isDark: boolean }>`
  position: fixed;
  top: 24px;
  left: 24px;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 22px;
  background: ${p => p.$isDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.7)'};
  border: 1px solid ${p => p.$isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)'};
  border-radius: 100px;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  font-size: 14px;
  font-weight: 500;
  color: ${p => p.$isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.55)'};
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;

  svg {
    width: 16px;
    height: 16px;
    transition: transform 0.2s ease;
  }

  &:hover {
    color: ${p => p.$isDark ? '#f5f5f7' : '#1d1d1f'};
    border-color: ${p => p.$isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.25)'};
    svg { transform: translateX(-3px); }
  }

  @media (max-width: 768px) {
    top: 16px;
    left: 16px;
    padding: 8px 18px;
    font-size: 13px;
  }
`;

/* ── Grid: 3 columns ── */
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

/* ── Card ── */
const CardWrapper = styled.div`
  cursor: pointer;
`;

const ImageContainer = styled.div`
  position: relative;
  border-radius: 14px;
  overflow: hidden;
  aspect-ratio: 4 / 3;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.4s ease, filter 0.4s ease;
  }

  ${CardWrapper}:hover & > img {
    transform: scale(1.04);
    filter: blur(3px) brightness(0.65);
  }
`;

const ImageOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 20px;
  opacity: 0;
  transition: opacity 0.35s ease;

  ${CardWrapper}:hover & {
    opacity: 1;
  }
`;

const OverlayDescription = styled.p`
  font-size: 13px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 12px 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const OverlayTechIcons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const TechIcon = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 18px;
    height: 18px;
    object-fit: contain;
    filter: none;
    transform: none;
  }
`;

const CardMeta = styled.div`
  padding: 12px 2px 0;
`;

const ProjectTitle = styled.h3<{ $isDark: boolean }>`
  font-size: 15px;
  font-weight: 600;
  color: ${p => p.$isDark ? '#f5f5f7' : '#1d1d1f'};
  margin: 0;
  letter-spacing: -0.2px;
`;

const ProjectMeta = styled.span<{ $isDark: boolean }>`
  display: block;
  font-size: 12px;
  color: ${p => p.$isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)'};
  margin-top: 3px;
  font-weight: 400;
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

/* ── Component ── */
interface ProjectsGalleryProps {
  onProjectClick: (projectId: string) => void;
  onBack: () => void;
}

const translations = {
  ko: {
    back: '홈으로',
    freelanceEyebrow: 'CLIENT WORK',
    freelanceTitle: '외주 프로젝트',
    personalEyebrow: 'PERSONAL',
    personalTitle: '개인 프로젝트',
  },
  en: {
    back: 'Back to Home',
    freelanceEyebrow: 'CLIENT WORK',
    freelanceTitle: 'Freelance Projects',
    personalEyebrow: 'PERSONAL',
    personalTitle: 'Personal Projects',
  },
};

export default function ProjectsGallery({ onProjectClick, onBack }: ProjectsGalleryProps) {
  const { isDark } = useTheme();
  const { language } = useLanguage();
  const { projects, loading } = useProjects();
  const t = translations[language];

  const freelance = projects.filter(p => p.type === 'freelance');
  const personal  = projects.filter(p => p.type !== 'freelance');

  const handleCardClick = useCallback(
    (projectId: string) => () => onProjectClick(projectId),
    [onProjectClick],
  );

  const getTechNames = (project: typeof projects[0]) => {
    const ts = project.techStack;
    if (!ts) return [];
    return [
      ...(ts.frontend ?? []),
      ...(ts.backend ?? []),
      ...(ts.design ?? []),
      ...(ts.others ?? []),
    ];
  };

  const renderCards = (list: typeof projects) =>
    list.map((project) => {
      const techNames = getTechNames(project);
      return (
        <CardWrapper key={project.id} onClick={handleCardClick(project.id)}>
          <ImageContainer>
            <ImageWithFallback src={project.image} alt={project.title[language]} />
            <ImageOverlay>
              <OverlayDescription>{project.description[language]}</OverlayDescription>
              <OverlayTechIcons>
                {techNames.slice(0, 8).map((tech, i) =>
                  resolveIcon(tech) ? (
                    <TechIcon key={i} title={tech}>
                      <img src={resolveIcon(tech)} alt={tech} loading="lazy" />
                    </TechIcon>
                  ) : null,
                )}
              </OverlayTechIcons>
            </ImageOverlay>
          </ImageContainer>
          <CardMeta>
            <ProjectTitle $isDark={isDark}>{project.title[language]}</ProjectTitle>
            {(project.year || project.role) && (
              <ProjectMeta $isDark={isDark}>
                {[project.year, project.role?.[language]].filter(Boolean).join(' · ')}
              </ProjectMeta>
            )}
          </CardMeta>
        </CardWrapper>
      );
    });

  const renderSkeletons = (count: number) =>
    Array.from({ length: count }).map((_, i) => (
      <div key={i}>
        <SkeletonBox $isDark={isDark} />
        <CardMeta>
          <SkeletonLine $isDark={isDark} $width="50%" style={{ height: 14, marginBottom: 6 }} />
          <SkeletonLine $isDark={isDark} $width="30%" style={{ height: 11 }} />
        </CardMeta>
      </div>
    ));

  return (
    <>
      <BackButton $isDark={isDark} onClick={onBack}>
        <ArrowLeft />
        {t.back}
      </BackButton>

      {/* ── CLIENT WORK — full viewport ── */}
      {(loading || freelance.length > 0) && (
        <FirstSection $isDark={isDark}>
          <Container>
            <GroupEyebrow $isDark={isDark}>{t.freelanceEyebrow}</GroupEyebrow>
            <GroupTitle $isDark={isDark}>{t.freelanceTitle}</GroupTitle>
            <Grid>
              {loading ? renderSkeletons(3) : renderCards(freelance)}
            </Grid>
          </Container>
        </FirstSection>
      )}

      {/* ── PERSONAL — full viewport ── */}
      {!loading && personal.length > 0 && (
        <GroupSection $isDark={isDark}>
          <Container>
            <GroupEyebrow $isDark={isDark}>{t.personalEyebrow}</GroupEyebrow>
            <GroupTitle $isDark={isDark}>{t.personalTitle}</GroupTitle>
            <Grid>
              {renderCards(personal)}
            </Grid>
          </Container>
        </GroupSection>
      )}
    </>
  );
}
