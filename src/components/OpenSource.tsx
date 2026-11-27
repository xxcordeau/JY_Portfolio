'use client';

import type { MouseEvent } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { useLanguage } from '../contexts/LanguageContext';
import { useOpenSource } from '../hooks/useOpenSource';
import type { OpenSourceProject } from '../data/types';

/* 오픈소스는 포트폴리오에서 비중이 작은 편이라 홍보 카드 대신 조용한 목록으로 둔다.
   톤은 홈(HomeView)과 같은 PUUS 토큰만 쓴다. */

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

// 다른 화면에 끼워 넣을 때는 페이지 여백 없이 섹션으로만 쓴다
const Embedded = styled.section`
  color: var(--k-text);
`;

const PageHead = styled.header`
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
    word-break: keep-all;
  }
`;

const SectionHead = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: var(--k-space-5);

  h2 {
    font-size: var(--k-text-lg);
    font-weight: 700;
  }

  button {
    padding: 0;
    border: none;
    background: none;
    font: inherit;
    font-size: var(--k-text-sm);
    color: var(--k-text-weak);
    cursor: pointer;
  }

  button:hover { color: var(--k-text); }
`;

const List = styled.ul`
  list-style: none;
  border-top: 1px solid var(--k-line);
`;

const Row = styled.li`
  border-bottom: 1px solid var(--k-line);
  animation: k-enter 0.25s var(--k-ease) both;

  a {
    display: block;
    padding: var(--k-space-5) 0;
    color: inherit;
    text-decoration: none;
  }

  .name {
    font-size: var(--k-text-lg);
    font-weight: 600;
  }

  .desc {
    margin-top: var(--k-space-1);
    font-size: var(--k-text-md);
    line-height: 1.6;
    color: var(--k-text-sub);
    word-break: keep-all;
    text-wrap: pretty;
  }

  .meta {
    margin-top: 6px;
    font-size: var(--k-text-sm);
    color: var(--k-text-weak);
    font-variant-numeric: tabular-nums;
  }

  a:hover .name {
    text-decoration: underline;
    text-underline-offset: 4px;
  }
`;

const SkeletonRow = styled.li`
  padding: var(--k-space-5) 0;
  border-bottom: 1px solid var(--k-line);

  span {
    display: block;
    height: 14px;
    border-radius: var(--k-radius-sm);
    background: var(--k-bg-sub);
  }

  span + span { margin-top: var(--k-space-2); }
`;

const Empty = styled.p`
  padding: var(--k-space-10) 0;
  font-size: var(--k-text-md);
  color: var(--k-text-weak);
  border-top: 1px solid var(--k-line);
  border-bottom: 1px solid var(--k-line);
`;

const translations = {
  ko: {
    title: '오픈소스',
    desc: '직접 만들어 npm에 공개한 React 컴포넌트 라이브러리예요.',
    viewAll: '전체 보기',
    components: (n: string) => `${n}개 컴포넌트`,
    empty: '아직 공개한 라이브러리가 없어요.',
  },
  en: {
    title: 'Open source',
    desc: 'React component libraries I built and published on npm.',
    viewAll: 'View all',
    components: (n: string) => `${n} components`,
    empty: 'No published libraries yet.',
  },
};

// DB 문자열의 긴 대시는 가운뎃점으로 바꿔 보여 준다
const undash = (s: string) => s.replace(/\s*[—–]\s*/g, ' · ');

// '-', '0', 빈 값은 의미 없는 수치라 표시하지 않는다
const hasValue = (v?: string) => !!v && !['-', '0'].includes(v.trim());

interface OpenSourceProps {
  onProjectClick: (id: string) => void;
  compact?: boolean;
  limit?: number;
  onViewAll?: () => void;
  // 목록 페이지는 헤더 메뉴로 돌아갈 수 있어 뒤로가기를 그리지 않는다. 호출 쪽 호환용으로만 남김
  onBack?: () => void;
}

export default function OpenSource({
  onProjectClick,
  compact = false,
  limit,
  onViewAll,
}: OpenSourceProps) {
  const { language } = useLanguage();
  const { projects: openSourceProjects, loading } = useOpenSource();
  const t = translations[language];

  const displayProjects =
    compact && typeof limit === 'number'
      ? openSourceProjects.slice(0, limit)
      : openSourceProjects;

  const skeletonCount = compact && typeof limit === 'number' ? limit : 2;

  const metaOf = (p: OpenSourceProject) =>
    [
      p.category[language],
      hasValue(p.stats.components) ? t.components(p.stats.components!) : '',
      p.year,
    ]
      .filter(Boolean)
      .join(' · ');

  // 진짜 링크로 두되(새 탭 열기 가능) 일반 클릭은 기존 onProjectClick 흐름을 탄다
  const handleClick = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    onProjectClick(id);
  };

  const list = (
    <List>
      {loading
        ? Array.from({ length: skeletonCount }).map((_, i) => (
            <SkeletonRow key={i} aria-hidden>
              <span style={{ width: '30%' }} />
              <span style={{ width: '60%' }} />
            </SkeletonRow>
          ))
        : displayProjects.map((project, i) => (
            <Row key={project.id} style={{ animationDelay: `${i * 30}ms` }}>
              <Link href={`/opensource/${project.id}`} onClick={e => handleClick(e, project.id)}>
                <div className="name">{project.name}</div>
                <div className="desc">{undash(project.description[language])}</div>
                <div className="meta">{metaOf(project)}</div>
              </Link>
            </Row>
          ))}
    </List>
  );

  const empty = !loading && displayProjects.length === 0 ? <Empty>{t.empty}</Empty> : null;

  if (compact) {
    return (
      <Embedded>
        <SectionHead>
          <h2 id="dot-opensource" data-dot-anchor>{t.title}</h2>
          {onViewAll && <button onClick={onViewAll}>{t.viewAll}</button>}
        </SectionHead>
        {empty ?? list}
      </Embedded>
    );
  }

  return (
    <Page>
      <PageHead>
        <h1 id="dot-opensource" data-dot-anchor>{t.title}</h1>
        <p>{t.desc}</p>
      </PageHead>
      {empty ?? list}
    </Page>
  );
}
