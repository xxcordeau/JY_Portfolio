'use client';

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useProjects } from '../hooks/useProjects';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { supabase } from '../lib/supabase';
import type { DbProjectImage } from '../lib/types/database';
import { ExternalLink, Github } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import Footer from './Footer';
import BookCollectionDemo from './interactive/BookCollectionDemo';
import DrawingToolDemo from './interactive/DrawingToolDemo';
import TextHighlightDemo from './interactive/TextHighlightDemo';
import TextHoverDemo from './interactive/TextHoverDemo';
import MouseFollowTextDemo from './interactive/MouseFollowTextDemo';

/* 제목과 대표 이미지는 페이지 폭을 쓰고, 긴 글은 720px 단으로 읽게 한다.
   장식 없이 글자 크기와 간격만으로 위계를 만든다. */

const Page = styled.main`
  max-width: var(--k-page-max);
  margin: 0 auto;
  padding: var(--k-space-10) var(--k-space-6) 96px;
  color: var(--k-text);
  animation: k-enter 0.25s var(--k-ease) both;

  @media (max-width: 768px) {
    padding: var(--k-space-6) var(--k-space-4) 72px;
  }
`;

const BackLink = styled(Link)`
  display: inline-block;
  margin-bottom: var(--k-space-6);
  font-size: var(--k-text-sm);
  color: var(--k-text-weak);
  text-decoration: none;
  transition: color 0.15s var(--k-ease);

  &:hover { color: var(--k-text); }
`;

const TitleBlock = styled.header`
  max-width: 720px;

  h1 {
    font-size: var(--k-text-2xl);
    font-weight: 700;
    letter-spacing: -0.03em;
    line-height: 1.35;
    word-break: keep-all;
  }

  .desc {
    margin-top: var(--k-space-2);
    font-size: var(--k-text-lg);
    line-height: 1.6;
    color: var(--k-text-sub);
    word-break: keep-all;
    text-wrap: pretty;
  }

  .meta {
    display: flex;
    flex-wrap: wrap;
    gap: 2px var(--k-space-4);
    margin-top: var(--k-space-3);
    font-size: var(--k-text-sm);
    color: var(--k-text-weak);
    font-variant-numeric: tabular-nums;
  }

  .meta b {
    font-weight: 500;
    color: var(--k-text-sub);
    margin-right: 6px;
  }
`;

const Links = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--k-space-2);
  margin-top: var(--k-space-5);
`;

const LinkButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: var(--k-control-sm);
  padding: 0 var(--k-space-3);
  background: var(--k-bg);
  border: 1px solid var(--k-line-strong);
  border-radius: var(--k-radius);
  color: var(--k-text);
  font-size: var(--k-text-md);
  font-weight: 600;
  text-decoration: none;
  transition: background 0.15s var(--k-ease);

  svg { width: 14px; height: 14px; }

  &:hover { background: var(--k-bg-hover); }
`;

const Cover = styled.div`
  margin-top: var(--k-space-8);
  aspect-ratio: 16 / 9;
  border: 1px solid var(--k-line);
  border-radius: var(--k-radius-lg);
  background: var(--k-bg-sub);
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

const Section = styled.section<{ $wide?: boolean }>`
  max-width: ${p => (p.$wide ? 'none' : '720px')};
  margin-top: 56px;

  h2 {
    font-size: 18px;
    font-weight: 700;
    letter-spacing: -0.02em;
    margin-bottom: var(--k-space-4);
  }

  @media (max-width: 768px) {
    margin-top: var(--k-space-10);
  }
`;

const Body = styled.p`
  font-size: var(--k-text-lg);
  line-height: 1.8;
  color: var(--k-text);
  white-space: pre-line;
  word-break: keep-all;
  text-wrap: pretty;

  @media (max-width: 768px) {
    font-size: 15px;
  }
`;

/* 주요 작업: 점 대신 가는 선으로 항목을 나눈다 */
const Highlights = styled.ul`
  list-style: none;
  border-top: 1px solid var(--k-line);

  li {
    padding: var(--k-space-3) 0;
    border-bottom: 1px solid var(--k-line);
    font-size: 15px;
    line-height: 1.7;
    color: var(--k-text);
    word-break: keep-all;
    text-wrap: pretty;
  }
`;

const SubBlock = styled.div`
  & + & { margin-top: var(--k-space-6); }

  h3 {
    font-size: var(--k-text-md);
    font-weight: 700;
    color: var(--k-text-sub);
    margin-bottom: 6px;
  }
`;

/* 기술: 왼쪽 회색 분류 + 오른쪽 이름을 쉼표로 이어 쓴다 */
const TechRows = styled.dl`
  border-top: 1px solid var(--k-line);

  div {
    display: grid;
    grid-template-columns: 96px minmax(0, 1fr);
    gap: var(--k-space-4);
    padding: var(--k-space-3) 0;
    border-bottom: 1px solid var(--k-line);
    font-size: var(--k-text-md);
    line-height: 1.6;
  }

  dt { color: var(--k-text-weak); }
  dd { color: var(--k-text); }

  @media (max-width: 480px) {
    div { grid-template-columns: 76px minmax(0, 1fr); gap: var(--k-space-3); }
  }
`;

const Shots = styled.div`
  display: grid;
  gap: var(--k-space-10);

  figure { margin: 0; }

  img {
    width: 100%;
    display: block;
    border: 1px solid var(--k-line);
    border-radius: var(--k-radius-lg);
    background: var(--k-bg-sub);
  }

  figcaption {
    margin-top: var(--k-space-2);
    font-size: var(--k-text-sm);
    line-height: 1.5;
    color: var(--k-text-weak);
  }
`;

const Notice = styled.p`
  padding: var(--k-space-12) 0;
  font-size: var(--k-text-md);
  color: var(--k-text-weak);
`;

interface ProjectDetailProps {
  projectId: string;
  onBack: () => void;
}

const translations = {
  ko: {
    back: '← 프로젝트',
    role: '역할',
    period: '기간',
    overview: '개요',
    screens: '화면',
    tryDemo: '직접 써 보기',
    highlights: '주요 작업',
    problemSolution: '문제와 해결',
    challenge: '문제',
    solution: '해결',
    techStack: '기술',
    viewDemo: '데모 보기',
    viewGithub: 'GitHub',
    viewWebsite: '웹사이트',
    loading: '불러오는 중이에요.',
    notFound: '프로젝트를 찾을 수 없어요.',
  },
  en: {
    back: '← Projects',
    role: 'Role',
    period: 'Period',
    overview: 'Overview',
    screens: 'Screens',
    tryDemo: 'Try it',
    highlights: 'What I did',
    problemSolution: 'Problem and solution',
    challenge: 'Problem',
    solution: 'Solution',
    techStack: 'Tech',
    viewDemo: 'View demo',
    viewGithub: 'GitHub',
    viewWebsite: 'Website',
    loading: 'Loading...',
    notFound: 'Project not found.',
  },
};

const categoryTranslations = {
  ko: { frontend: '프론트엔드', backend: '백엔드', design: '디자인', others: '기타' },
  en: { frontend: 'Frontend', backend: 'Backend', design: 'Design', others: 'Others' },
};

// 제목 뒤 " - 부제"는 설명 줄이 대신하므로 앞부분만 쓴다 (홈 카드와 같은 규칙)
const shortName = (title: string) => title.split(/\s+[-—–]\s+/)[0].trim();
const subtitle = (title: string) => title.split(/\s+[-—–]\s+/).slice(1).join(' · ').trim();
const clean = (s: string) => s.replace(/\s*[—–]\s*/g, ' · ');
const cleanYear = (s: string) => s.replace(/[–—]/g, '-');

const TECH_KEYS = ['frontend', 'backend', 'design', 'others'] as const;

export default function ProjectDetail({ projectId }: ProjectDetailProps) {
  const { isDark } = useTheme();
  const { language } = useLanguage();
  const { projects, loading: projectsLoading } = useProjects();
  const project = projects.find(p => p.id === projectId);
  const t = translations[language];
  const ct = categoryTranslations[language];

  const [projectImages, setProjectImages] = useState<DbProjectImage[]>([]);

  useDocumentMeta({
    title: project?.title[language],
    description: project?.description[language],
    ogImage: project?.image,
  });

  useEffect(() => {
    supabase.from('project_images')
      .select('*')
      .eq('project_id', projectId)
      .order('sort_order')
      .then(({ data }) => {
        if (data) setProjectImages(data as DbProjectImage[]);
      });
  }, [projectId]);

  // 뒤로가기는 직접 들어온 경우에도 목록으로 가도록 경로 링크로 둔다
  const back = <BackLink href="/projects">{t.back}</BackLink>;

  if (projectsLoading) {
    return (
      <Page>
        {back}
        <Notice>{t.loading}</Notice>
      </Page>
    );
  }

  if (!project) {
    return (
      <Page>
        {back}
        <Notice>{t.notFound}</Notice>
      </Page>
    );
  }

  const interactiveProjects = ['book-collection', 'drawing-tool', 'text-highlight', 'text-hover-highlight', 'mouse-follow-text'];
  const hasInteractiveDemo = interactiveProjects.includes(projectId);

  const renderInteractiveDemo = () => {
    switch (projectId) {
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

  const title = project.title[language];
  const desc = project.description[language] || subtitle(title);
  const role = project.role?.[language];
  const highlights = project.highlights[language] ?? [];
  const challenge = project.challenge?.[language];
  const solution = project.solution?.[language];
  const techRows = TECH_KEYS
    .map(key => ({ key, names: project.techStack?.[key] ?? [] }))
    .filter(row => row.names.length > 0);
  const links = project.links;
  const hasLinks = !!(links && (links.website || links.demo || links.github));

  return (
    <>
      <Page>
        {back}

        <TitleBlock>
          <h1>{shortName(title)}</h1>
          {desc && <p className="desc">{clean(desc)}</p>}
          {(role || project.year) && (
            <div className="meta">
              {role && <span><b>{t.role}</b>{clean(role)}</span>}
              {project.year && <span><b>{t.period}</b>{cleanYear(project.year)}</span>}
            </div>
          )}
          {hasLinks && (
            <Links>
              {links?.website && (
                <LinkButton href={links.website} target="_blank" rel="noopener noreferrer">
                  <ExternalLink />
                  {t.viewWebsite}
                </LinkButton>
              )}
              {links?.demo && (
                <LinkButton href={links.demo} target="_blank" rel="noopener noreferrer">
                  <ExternalLink />
                  {t.viewDemo}
                </LinkButton>
              )}
              {links?.github && (
                <LinkButton href={links.github} target="_blank" rel="noopener noreferrer">
                  <Github />
                  {t.viewGithub}
                </LinkButton>
              )}
            </Links>
          )}
        </TitleBlock>

        {project.image && (
          <Cover>
            <ImageWithFallback src={project.image} alt={clean(title)} />
          </Cover>
        )}

        {project.fullDescription[language] && (
          <Section>
            <h2>{t.overview}</h2>
            <Body>{clean(project.fullDescription[language])}</Body>
          </Section>
        )}

        {projectImages.length > 0 && (
          <Section $wide>
            <h2>{t.screens}</h2>
            <Shots>
              {projectImages.map(img => {
                const caption = language === 'ko' ? img.caption_ko : img.caption_en;
                return (
                  <figure key={img.id}>
                    <img src={img.url} alt={caption ? clean(caption) : ''} loading="lazy" />
                    {caption && <figcaption>{clean(caption)}</figcaption>}
                  </figure>
                );
              })}
            </Shots>
          </Section>
        )}

        {hasInteractiveDemo && (
          <Section $wide>
            <h2>{t.tryDemo}</h2>
            {renderInteractiveDemo()}
          </Section>
        )}

        {highlights.length > 0 && (
          <Section>
            <h2>{t.highlights}</h2>
            <Highlights>
              {highlights.map((h, i) => (
                <li key={i}>{clean(h)}</li>
              ))}
            </Highlights>
          </Section>
        )}

        {(challenge || solution) && (
          <Section>
            <h2>{t.problemSolution}</h2>
            {challenge && (
              <SubBlock>
                <h3>{t.challenge}</h3>
                <Body>{clean(challenge)}</Body>
              </SubBlock>
            )}
            {solution && (
              <SubBlock>
                <h3>{t.solution}</h3>
                <Body>{clean(solution)}</Body>
              </SubBlock>
            )}
          </Section>
        )}

        {techRows.length > 0 && (
          <Section>
            <h2>{t.techStack}</h2>
            <TechRows>
              {techRows.map(row => (
                <div key={row.key}>
                  <dt>{ct[row.key]}</dt>
                  <dd>{row.names.join(', ')}</dd>
                </div>
              ))}
            </TechRows>
          </Section>
        )}
      </Page>

      <Footer />
    </>
  );
}
