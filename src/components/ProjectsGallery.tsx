'use client';

import { useState, type MouseEvent } from 'react';
import styled from 'styled-components';
import { useLanguage } from '../contexts/LanguageContext';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useProjects } from '../hooks/useProjects';
import type { Project } from '../data/projectsData';

/* 홈의 작업 카드와 같은 모양으로, 실무/개인을 밑줄 탭으로만 나눈다 */

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

const PageHead = styled.div`
  margin-bottom: var(--k-space-8);

  h1 {
    font-size: var(--k-text-2xl);
    font-weight: 700;
    letter-spacing: -0.03em;
  }

  p {
    margin-top: 6px;
    font-size: var(--k-text-md);
    color: var(--k-text-weak);
  }
`;

const Tabs = styled.div`
  display: flex;
  gap: var(--k-space-6);
  border-bottom: 1px solid var(--k-line);
  margin-bottom: var(--k-space-8);
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar { display: none; }
`;

const Tab = styled.button<{ $active: boolean }>`
  position: relative;
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: var(--k-control-md);
  padding: 0;
  border: none;
  background: none;
  font: inherit;
  font-size: var(--k-text-md);
  font-weight: ${p => (p.$active ? 700 : 500)};
  color: ${p => (p.$active ? 'var(--k-text)' : 'var(--k-text-sub)')};
  cursor: pointer;
  transition: color 0.15s var(--k-ease);

  .count {
    font-weight: 500;
    color: var(--k-text-weak);
    font-variant-numeric: tabular-nums;
  }

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -1px;
    height: 2px;
    background: var(--k-accent);
    transform: scaleX(${p => (p.$active ? 1 : 0)});
    transition: transform 0.2s var(--k-ease);
  }

  &:hover { color: var(--k-text); }
`;

const Grid = styled.ul`
  list-style: none;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--k-space-10) var(--k-space-6);

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: var(--k-space-8);
  }
`;

const Card = styled.li`
  animation: k-enter 0.25s var(--k-ease) both;

  a {
    display: block;
    color: inherit;
    text-decoration: none;
  }

  .shot {
    aspect-ratio: 16 / 10;
    border-radius: var(--k-radius-lg);
    border: 1px solid var(--k-line);
    background: var(--k-bg-sub);
    overflow: hidden;
  }

  .shot img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .title {
    margin-top: var(--k-space-3);
    font-size: var(--k-text-lg);
    font-weight: 600;
  }

  .meta {
    margin-top: 2px;
    font-size: var(--k-text-sm);
    color: var(--k-text-weak);
    font-variant-numeric: tabular-nums;
  }

  .desc {
    margin-top: var(--k-space-2);
    font-size: var(--k-text-md);
    line-height: 1.6;
    color: var(--k-text-sub);
    word-break: keep-all;
    text-wrap: pretty;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  a:hover .title {
    text-decoration: underline;
    text-underline-offset: 4px;
  }
`;

/* 불러오는 동안 카드 자리만 잡아 둔다. 반짝이는 효과 없이 회색 칸만 */
const Skeleton = styled.li`
  .shot {
    aspect-ratio: 16 / 10;
    border-radius: var(--k-radius-lg);
    border: 1px solid var(--k-line);
    background: var(--k-bg-sub);
  }

  .line {
    height: 14px;
    margin-top: var(--k-space-3);
    border-radius: var(--k-radius-sm);
    background: var(--k-bg-sub);
  }
`;

const Notice = styled.p`
  padding: var(--k-space-12) 0;
  font-size: var(--k-text-md);
  color: var(--k-text-weak);
  text-align: center;
`;

interface ProjectsGalleryProps {
  onProjectClick: (projectId: string) => void;
  onBack: () => void;
}

type Filter = 'all' | 'freelance' | 'personal';

const translations = {
  ko: {
    title: '프로젝트',
    desc: '실무로 만든 서비스와 개인 작업이에요.',
    all: '전체',
    freelance: '실무',
    personal: '개인',
    empty: '아직 올린 프로젝트가 없어요.',
    error: '프로젝트를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.',
  },
  en: {
    title: 'Projects',
    desc: 'Client services I built at work, plus personal projects.',
    all: 'All',
    freelance: 'Client',
    personal: 'Personal',
    empty: 'No projects yet.',
    error: 'Could not load projects. Please try again later.',
  },
};

// "SnapClub - 포토부스 키오스크 시스템" → "SnapClub" (홈 카드와 같은 규칙)
const shortName = (title: string) => title.split(/\s+[-—–]\s+/)[0].trim();
const subtitle = (title: string) => title.split(/\s+[-—–]\s+/).slice(1).join(' · ').trim();
const clean = (s: string) => s.replace(/\s*[—–]\s*/g, ' · ');
const cleanYear = (s: string) => s.replace(/[–—]/g, '-');

export default function ProjectsGallery({ onProjectClick }: ProjectsGalleryProps) {
  const { language } = useLanguage();
  const { projects, loading, error } = useProjects();
  const t = translations[language];
  const [filter, setFilter] = useState<Filter>('all');

  // 실무를 먼저, 그 안에서는 DB 순서를 그대로 둔다
  const freelance = projects.filter(p => p.type === 'freelance');
  const personal = projects.filter(p => p.type !== 'freelance');
  const groups: Record<Filter, Project[]> = {
    all: [...freelance, ...personal],
    freelance,
    personal,
  };
  const list = groups[filter];

  // 진짜 링크로 두어 새 탭 열기도 되게 하고, 일반 클릭만 앱 안에서 이동시킨다
  const handleClick = (id: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    onProjectClick(id);
  };

  const tabs: Filter[] = ['all', 'freelance', 'personal'];

  return (
    <Page>
      <PageHead>
        <h1>{t.title}</h1>
        <p>{t.desc}</p>
      </PageHead>

      <Tabs role="tablist">
        {tabs.map(key => (
          <Tab
            key={key}
            role="tab"
            aria-selected={filter === key}
            $active={filter === key}
            onClick={() => setFilter(key)}
          >
            {t[key]}
            {!loading && <span className="count">{groups[key].length}</span>}
          </Tab>
        ))}
      </Tabs>

      {loading ? (
        <Grid aria-busy="true">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i}>
              <div className="shot" />
              <div className="line" style={{ width: '40%' }} />
              <div className="line" style={{ width: '70%' }} />
            </Skeleton>
          ))}
        </Grid>
      ) : error ? (
        <Notice>{t.error}</Notice>
      ) : list.length === 0 ? (
        <Notice>{t.empty}</Notice>
      ) : (
        <Grid key={filter}>
          {list.map((p, i) => {
            const title = p.title[language];
            const desc = p.description[language] || subtitle(title);
            const meta = [p.role?.[language] && clean(p.role[language]), p.year && cleanYear(p.year)]
              .filter(Boolean)
              .join(' · ');
            return (
              <Card key={p.id} style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}>
                <a href={`/projects/${p.id}`} onClick={handleClick(p.id)} title={clean(title)}>
                  <div className="shot">
                    {p.image && <ImageWithFallback src={p.image} alt="" loading="lazy" />}
                  </div>
                  <div className="title">{shortName(title)}</div>
                  {meta && <div className="meta">{meta}</div>}
                  {desc && <div className="desc">{clean(desc)}</div>}
                </a>
              </Card>
            );
          })}
        </Grid>
      )}
    </Page>
  );
}
