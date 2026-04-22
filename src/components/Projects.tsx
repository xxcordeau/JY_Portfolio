import { useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useProjects } from '../hooks/useProjects';
import { ArrowRight } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

/** 기술 이름 → devicon CDN URL 매핑 */
const TECH_ICONS: Record<string, string> = {
  'JavaScript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
  'TypeScript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
  'React': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
  'Next.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
  'Vue.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg',
  'Vue 3': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg',
  'HTML/CSS': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
  'Styled-Components': 'https://cdn.simpleicons.org/styledcomponents/DB7093',
  'Tailwind CSS': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg',
  'Sass': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg',
  'SCSS': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg',
  'Ant Design': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/antdesign/antdesign-original.svg',
  'Storybook': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/storybook/storybook-original.svg',
  'Node.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
  'Express': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg',
  'Supabase': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg',
  'Firebase': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg',
  'Webpack': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/webpack/webpack-original.svg',
  'Vite': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg',
  'Git': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
  'Figma': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg',
  'Redux': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg',
  'Nest.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nestjs/nestjs-original.svg',
  'NestJS': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nestjs/nestjs-original.svg',
  'PostgreSQL': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
  'MongoDB': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
  'MySQL': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
  'Docker': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
  'Python': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
  'AWS': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg',
  'Vercel': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg',
  'Photoshop': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-original.svg',
  'Illustrator': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/illustrator/illustrator-plain.svg',
  'Swagger': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swagger/swagger-original.svg',
  'Postman': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg',
};

/* ── Keyframes ── */

const shimmer = keyframes`
  0% { background-position: -400% 0; }
  100% { background-position: 400% 0; }
`;

/* ── Layout ── */

const ProjectsSection = styled.section<{ $isDark: boolean }>`
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

/* ── Header ── */

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
  margin: 0 0 48px 0;
  letter-spacing: -1px;
  line-height: 1.15;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 30px;
    margin-bottom: 36px;
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

/* ── View All (bottom) ── */

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

/* ── Component ── */

interface ProjectsProps {
  onProjectClick: (projectId: string) => void;
  onViewAll?: () => void;
  showAll?: boolean;
}

const translations = {
  ko: { eyebrow: 'PROJECTS', title: '프로젝트', viewAll: '전체 보기' },
  en: { eyebrow: 'PROJECTS', title: 'Projects', viewAll: 'View All' },
};

export default function Projects({ onProjectClick, onViewAll, showAll = false }: ProjectsProps) {
  const { isDark } = useTheme();
  const { language } = useLanguage();
  const { projects, loading } = useProjects();
  const t = translations[language];
  const displayProjects = showAll ? projects : projects.slice(0, 6);

  const handleCardClick = useCallback(
    (projectId: string) => () => onProjectClick(projectId),
    [onProjectClick]
  );

  /** Collect all tech names from a project's techStack */
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

  return (
    <ProjectsSection id="projects" $isDark={isDark}>
      <Container>
        <SectionEyebrow id="dot-projects" $isDark={isDark} data-dot-anchor>{t.eyebrow}</SectionEyebrow>
        <SectionTitle $isDark={isDark}>{t.title}</SectionTitle>

        <Grid>
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i}>
                  <SkeletonBox $isDark={isDark} />
                  <CardMeta>
                    <SkeletonLine $isDark={isDark} $width="50%" style={{ height: 14, marginBottom: 6 }} />
                    <SkeletonLine $isDark={isDark} $width="30%" style={{ height: 11 }} />
                  </CardMeta>
                </div>
              ))
            : displayProjects.map((project) => {
                const techNames = getTechNames(project);
                return (
                  <CardWrapper key={project.id} onClick={handleCardClick(project.id)}>
                    <ImageContainer>
                      <ImageWithFallback src={project.image} alt={project.title[language]} />
                      <ImageOverlay>
                        <OverlayDescription>{project.description[language]}</OverlayDescription>
                        <OverlayTechIcons>
                          {techNames.slice(0, 8).map((tech, i) =>
                            TECH_ICONS[tech] ? (
                              <TechIcon key={i} title={tech}>
                                <img src={TECH_ICONS[tech]} alt={tech} loading="lazy" />
                              </TechIcon>
                            ) : null
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
              })
          }
        </Grid>

        {onViewAll && (
          <ViewAllBottom>
            <ViewAllButton $isDark={isDark} onClick={onViewAll}>
              {t.viewAll}
              <ArrowRight />
            </ViewAllButton>
          </ViewAllBottom>
        )}
      </Container>
    </ProjectsSection>
  );
}
