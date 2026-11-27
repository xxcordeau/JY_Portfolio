'use client';

import styled from 'styled-components';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, CornerDownLeft } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useProjects } from '../hooks/useProjects';
import { useBlogPosts } from '../hooks/useBlogPosts';
import { useOpenSource } from '../hooks/useOpenSource';

/* Ctrl K 검색창. PUUS의 검색 팝업과 같은 규칙:
   어둡게 깐 배경 위에 그림자가 있는 팝업 하나, 키보드만으로 끝까지 쓸 수 있게. */
const Dim = styled.div`
  position: fixed;
  inset: 0;
  z-index: 3000;
  background: var(--k-dim);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 12vh var(--k-space-4) 0;
  animation: fade 0.15s var(--k-ease);

  @keyframes fade { from { opacity: 0; } to { opacity: 1; } }
`;

const Panel = styled.div`
  width: 100%;
  max-width: 560px;
  background: var(--k-bg-pop);
  border: 1px solid var(--k-line);
  border-radius: var(--k-radius-lg);
  box-shadow: var(--k-shadow-pop);
  overflow: hidden;
  animation: k-enter 0.2s var(--k-ease);
`;

const InputRow = styled.label`
  display: flex;
  align-items: center;
  gap: var(--k-space-3);
  height: 52px;
  padding: 0 var(--k-space-4);
  border-bottom: 1px solid var(--k-line);
  color: var(--k-text-weak);

  svg { width: 16px; height: 16px; flex-shrink: 0; }

  input {
    flex: 1;
    min-width: 0;
    border: none;
    outline: none;
    background: transparent;
    color: var(--k-text);
    font: inherit;
    font-size: var(--k-text-lg);
  }

  input::placeholder { color: var(--k-text-weak); }
`;

const List = styled.div`
  max-height: min(56vh, 420px);
  overflow-y: auto;
  padding: var(--k-space-2);
`;

const Group = styled.div`
  padding: var(--k-space-2) var(--k-space-2) var(--k-space-1);
  font-size: var(--k-text-xs);
  font-weight: 600;
  color: var(--k-text-weak);
`;

const Item = styled.button<{ $active: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: var(--k-space-3);
  padding: 0 var(--k-space-2);
  height: 40px;
  border: none;
  border-radius: var(--k-radius);
  background: ${p => (p.$active ? 'var(--k-bg-hover)' : 'transparent')};
  color: var(--k-text);
  font: inherit;
  font-size: var(--k-text-md);
  text-align: left;
  cursor: pointer;

  .title {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .meta {
    font-size: var(--k-text-xs);
    color: var(--k-text-weak);
    white-space: nowrap;
  }

  svg {
    width: 14px;
    height: 14px;
    color: var(--k-text-weak);
    opacity: ${p => (p.$active ? 1 : 0)};
  }
`;

const Empty = styled.p`
  padding: var(--k-space-8) var(--k-space-4);
  text-align: center;
  font-size: var(--k-text-md);
  color: var(--k-text-weak);
`;

const Foot = styled.div`
  display: flex;
  gap: var(--k-space-4);
  padding: var(--k-space-2) var(--k-space-4);
  border-top: 1px solid var(--k-line);
  font-size: var(--k-text-xs);
  color: var(--k-text-weak);

  kbd {
    font-family: inherit;
    padding: 0 5px;
    margin-right: 4px;
    border: 1px solid var(--k-line);
    border-radius: var(--k-radius-sm);
    color: var(--k-text-sub);
  }

  @media (max-width: 768px) { display: none; }
`;

interface Entry {
  id: string;
  group: string;
  title: string;
  meta?: string;
  keywords: string;
  run: () => void;
}

const T = {
  ko: {
    placeholder: '페이지, 프로젝트, 글 검색',
    pages: '페이지', actions: '바로 하기', projects: '프로젝트', posts: '블로그', libs: '오픈소스',
    empty: '맞는 결과가 없어요',
    move: '이동', open: '열기', close: '닫기',
    home: '요약', projectsPage: '프로젝트', opensource: '오픈소스', blog: '블로그', talks: 'PT 자료',
    contact: '연락하기', theme: '테마 바꾸기', lang: 'English로 보기', github: 'GitHub 열기',
    work: '실무', personal: '개인',
  },
  en: {
    placeholder: 'Search pages, projects, posts',
    pages: 'Pages', actions: 'Actions', projects: 'Projects', posts: 'Blog', libs: 'Open source',
    empty: 'No results',
    move: 'Move', open: 'Open', close: 'Close',
    home: 'Overview', projectsPage: 'Projects', opensource: 'Open source', blog: 'Blog', talks: 'Talks',
    contact: 'Contact', theme: 'Toggle theme', lang: '한국어로 보기', github: 'Open GitHub',
    work: 'Work', personal: 'Personal',
  },
};

function PaletteBody({ onClose, onContact }: { onClose: () => void; onContact: () => void }) {
  const router = useRouter();
  const { language, toggleLanguage } = useLanguage();
  const { toggleDarkMode } = useTheme();
  const { projects } = useProjects();
  const { posts } = useBlogPosts();
  const { projects: libs } = useOpenSource();
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const t = T[language];

  const go = (href: string) => () => { onClose(); router.push(href); };

  const entries = useMemo<Entry[]>(() => [
    { id: 'p-home', group: t.pages, title: t.home, keywords: 'home summary 요약 홈', run: go('/') },
    { id: 'p-projects', group: t.pages, title: t.projectsPage, keywords: 'projects 프로젝트', run: go('/projects') },
    { id: 'p-os', group: t.pages, title: t.opensource, keywords: 'open source library 오픈소스 라이브러리', run: go('/opensource') },
    { id: 'p-blog', group: t.pages, title: t.blog, keywords: 'blog posts 블로그 글', run: go('/blog') },
    { id: 'p-talks', group: t.pages, title: t.talks, keywords: 'presentations talks pt 발표', run: go('/presentations') },
    { id: 'a-contact', group: t.actions, title: t.contact, keywords: 'contact email 연락 메일', run: () => { onClose(); onContact(); } },
    { id: 'a-theme', group: t.actions, title: t.theme, keywords: 'theme dark light 다크 라이트 테마', run: () => { onClose(); toggleDarkMode(); } },
    { id: 'a-lang', group: t.actions, title: t.lang, keywords: 'language english korean 언어 영어 한국어', run: () => { onClose(); toggleLanguage(); } },
    { id: 'a-gh', group: t.actions, title: t.github, keywords: 'github code 깃허브', run: () => { onClose(); window.open('https://github.com/xxcordeau', '_blank', 'noopener'); } },
    ...projects.map(p => ({
      id: `pr-${p.id}`,
      group: t.projects,
      title: p.title[language].replace(/\s*[—–]\s*/g, ' · '),
      meta: `${p.type === 'freelance' ? t.work : t.personal} · ${p.year}`,
      keywords: [p.title.ko, p.title.en, p.description.ko, ...Object.values(p.techStack).flat().filter(Boolean)].join(' '),
      run: go(`/projects/${p.id}`),
    })),
    ...libs.map(l => ({
      id: `os-${l.id}`,
      group: t.libs,
      title: l.name,
      meta: l.category[language],
      keywords: [l.name, l.description.ko, ...l.tags].join(' '),
      run: go(`/opensource/${l.id}`),
    })),
    ...posts.map(b => ({
      id: `bl-${b.id}`,
      group: t.posts,
      title: b.title[language],
      meta: b.date,
      keywords: [b.title.ko, b.title.en, b.category.ko, ...b.tags].join(' '),
      run: go(`/blog/${b.id}`),
    })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [projects, posts, libs, language]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries.filter(e => e.group === t.pages || e.group === t.actions);
    const words = q.split(/\s+/);
    return entries
      .filter(e => {
        const hay = `${e.title} ${e.keywords}`.toLowerCase();
        return words.every(w => hay.includes(w));
      })
      .slice(0, 30);
  }, [entries, query, t]);

  useEffect(() => { setCursor(0); }, [query]);

  // 키보드로 고른 줄이 목록 밖으로 나가지 않게
  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${cursor}"]`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [cursor]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setCursor(c => Math.min(c + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setCursor(c => Math.max(c - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      results[cursor]?.run();
    }
  };

  let lastGroup = '';

  return (
    <Panel role="dialog" aria-modal="true" aria-label={t.placeholder} onClick={e => e.stopPropagation()}>
      <InputRow>
        <Search />
        <input
          autoFocus
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={t.placeholder}
          aria-controls="k-palette-list"
          aria-activedescendant={results[cursor] ? `k-pal-${results[cursor].id}` : undefined}
        />
      </InputRow>
      <List ref={listRef} id="k-palette-list" role="listbox">
        {results.length === 0 && <Empty>{t.empty}</Empty>}
        {results.map((r, i) => {
          const head = r.group !== lastGroup ? r.group : null;
          lastGroup = r.group;
          return (
            <div key={r.id}>
              {head && <Group>{head}</Group>}
              <Item
                id={`k-pal-${r.id}`}
                role="option"
                aria-selected={i === cursor}
                data-index={i}
                $active={i === cursor}
                onMouseMove={() => setCursor(i)}
                onClick={r.run}
              >
                <span className="title">{r.title}</span>
                {r.meta && <span className="meta">{r.meta}</span>}
                <CornerDownLeft />
              </Item>
            </div>
          );
        })}
      </List>
      <Foot>
        <span><kbd>↑↓</kbd>{t.move}</span>
        <span><kbd>Enter</kbd>{t.open}</span>
        <span><kbd>Esc</kbd>{t.close}</span>
      </Foot>
    </Panel>
  );
}

export default function CommandPalette({
  open, onOpenChange, onContact,
}: { open: boolean; onOpenChange: (v: boolean) => void; onContact: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onOpenChange(!open);
      } else if (e.key === 'Escape' && open) {
        onOpenChange(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  if (!open) return null;

  // 열릴 때만 본문을 붙여서 데이터 요청도 그때 한다
  return (
    <Dim onClick={() => onOpenChange(false)}>
      <PaletteBody onClose={() => onOpenChange(false)} onContact={onContact} />
    </Dim>
  );
}
