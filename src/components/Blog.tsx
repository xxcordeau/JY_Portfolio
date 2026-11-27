'use client';

import { useMemo, useState } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { useLanguage } from '../contexts/LanguageContext';
import { useBlogPosts } from '../hooks/useBlogPosts';
import Footer from './Footer';

/* 홈의 글 카드와 같은 규칙: 썸네일 + 제목 + 메타, 장식 없이 토큰만 쓴다 */

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

/* 분류 탭: 밑줄 탭, 개수는 옅게 */
const Tabs = styled.div`
  display: flex;
  gap: var(--k-space-6);
  margin-bottom: var(--k-space-8);
  border-bottom: 1px solid var(--k-line);
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar { display: none; }

  @media (max-width: 768px) {
    gap: var(--k-space-5);
  }
`;

const Tab = styled.button<{ $active: boolean }>`
  position: relative;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: var(--k-space-1);
  height: var(--k-control-md);
  padding: 0;
  border: none;
  background: none;
  font: inherit;
  font-size: var(--k-text-md);
  font-weight: ${p => (p.$active ? 700 : 500)};
  color: ${p => (p.$active ? 'var(--k-text)' : 'var(--k-text-sub)')};
  white-space: nowrap;
  cursor: pointer;
  transition: color 0.15s var(--k-ease);

  &:hover { color: var(--k-text); }

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

  span {
    font-weight: 500;
    color: var(--k-text-weak);
    font-variant-numeric: tabular-nums;
  }
`;

const Grid = styled.ul`
  list-style: none;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--k-space-8) var(--k-space-5);

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.li`
  animation: k-enter 0.25s var(--k-ease) both;

  a {
    display: block;
    color: inherit;
    text-decoration: none;
  }

  /* 썸네일 원본이 16:9라 같은 비율 상자에 넣어 잘리는 곳이 없게 한다 */
  .shot {
    aspect-ratio: 16 / 9;
    border: 1px solid var(--k-line);
    border-radius: var(--k-radius-lg);
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
    font-size: 15px;
    font-weight: 600;
    line-height: 1.5;
    word-break: keep-all;
    text-wrap: pretty;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .meta {
    margin-top: 2px;
    font-size: var(--k-text-sm);
    color: var(--k-text-weak);
    font-variant-numeric: tabular-nums;
  }

  a:hover .title {
    text-decoration: underline;
    text-underline-offset: 4px;
  }
`;

const SkeletonCard = styled.li`
  .shot {
    aspect-ratio: 16 / 9;
    border-radius: var(--k-radius-lg);
    background: var(--k-bg-sub);
  }

  .line {
    height: 14px;
    margin-top: var(--k-space-3);
    border-radius: var(--k-radius-sm);
    background: var(--k-bg-sub);
  }

  .line + .line {
    width: 40%;
    margin-top: var(--k-space-2);
  }
`;

const Notice = styled.p`
  padding: var(--k-space-12) 0;
  font-size: var(--k-text-md);
  color: var(--k-text-weak);
  text-align: center;
`;

const translations = {
  ko: {
    title: '블로그',
    subtitle: '일하면서 겪은 문제와 디자인에 대한 생각을 적어요.',
    all: '전체',
    empty: '아직 글이 없어요.',
    error: '글을 불러오지 못했어요. 잠시 뒤에 다시 열어 주세요.',
  },
  en: {
    title: 'Blog',
    subtitle: 'Notes on problems I ran into at work and how I think about design.',
    all: 'All',
    empty: 'No posts yet.',
    error: 'Could not load posts. Please try again in a moment.',
  },
};

// DB 문자열의 줄표는 가운뎃점으로 바꿔 보여 준다
const undash = (s: string) => s.replace(/\s*[—–]\s*/g, ' · ');

const ALL = '__all__';

interface BlogProps {
  onPostClick: (blogId: string) => void;
  onBack: () => void;
}

// 카드 이동은 Link로 처리한다 (새 탭 열기, 미리 불러오기). props 계약은 그대로 둔다.
export default function Blog(_props: BlogProps) {
  const { language } = useLanguage();
  const { posts, loading, error } = useBlogPosts();
  const t = translations[language];
  const [active, setActive] = useState(ALL);

  // 분류는 데이터에서 뽑고, 글이 많은 순서로 둔다. 키는 언어와 상관없이 ko 값
  const categories = useMemo(() => {
    const map = new Map<string, { label: { ko: string; en: string }; count: number }>();
    posts.forEach(p => {
      const key = p.category.ko;
      if (!key) return;
      const prev = map.get(key);
      if (prev) prev.count += 1;
      else map.set(key, { label: p.category, count: 1 });
    });
    return [...map.entries()]
      .map(([key, v]) => ({ key, ...v }))
      .sort((a, b) => b.count - a.count);
  }, [posts]);

  const visible = active === ALL ? posts : posts.filter(p => p.category.ko === active);

  return (
    <>
      <Page>
        <PageHead>
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </PageHead>

        {!loading && categories.length > 1 && (
          <Tabs role="tablist">
            <Tab
              type="button"
              role="tab"
              aria-selected={active === ALL}
              $active={active === ALL}
              onClick={() => setActive(ALL)}
            >
              {t.all} <span>{posts.length}</span>
            </Tab>
            {categories.map(c => (
              <Tab
                key={c.key}
                type="button"
                role="tab"
                aria-selected={active === c.key}
                $active={active === c.key}
                onClick={() => setActive(c.key)}
              >
                {c.label[language] || c.key} <span>{c.count}</span>
              </Tab>
            ))}
          </Tabs>
        )}

        {loading ? (
          <Grid aria-busy="true">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i}>
                <div className="shot" />
                <div className="line" />
                <div className="line" />
              </SkeletonCard>
            ))}
          </Grid>
        ) : error ? (
          <Notice>{t.error}</Notice>
        ) : visible.length === 0 ? (
          <Notice>{t.empty}</Notice>
        ) : (
          <Grid>
            {visible.map((post, i) => (
              <Card key={post.id} style={{ animationDelay: `${Math.min(i, 8) * 30}ms` }}>
                <Link href={`/blog/${post.id}`}>
                  <div className="shot">
                    {post.thumbnail && <img src={post.thumbnail} alt="" loading="lazy" />}
                  </div>
                  <div className="title">{undash(post.title[language])}</div>
                  <div className="meta">
                    {post.category[language]} · {post.date.replace(/-/g, '.')}
                  </div>
                </Link>
              </Card>
            ))}
          </Grid>
        )}
      </Page>

      <Footer />
    </>
  );
}
