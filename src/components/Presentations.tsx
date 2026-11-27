'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { FileText, X, Loader, ArrowUpRight } from 'lucide-react';
import type { PDFDocumentProxy, RenderTask } from 'pdfjs-dist';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';
import type { DbPresentation } from '../lib/types/database';

// pdfjs worker — public/ 에 복사된 파일을 절대 경로로 참조.
// (Vite의 new URL(..., import.meta.url) 패턴은 Next 정적 빌드에서 동작하지 않음.
//  worker 파일은 postinstall/prebuild 스크립트가 node_modules에서 public/으로 복사한다.)
// pdf.js는 뷰어를 열 때만 불러온다. 목록 화면 첫 로딩을 가볍게 하고,
// 개발 서버에서 모듈 평가 오류가 나도 목록은 보이게 하려는 것.
let pdfjsPromise: Promise<typeof import('pdfjs-dist')> | null = null;
const loadPdfjs = () => {
  if (!pdfjsPromise) {
    pdfjsPromise = import('pdfjs-dist').then(m => {
      m.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
      return m;
    });
  }
  return pdfjsPromise;
};

const spin = keyframes`from { transform: rotate(0deg); } to { transform: rotate(360deg); }`;

// DB 문자열의 긴 줄표는 가운뎃점으로 바꿔 보여 준다
const tidy = (s: string) => s.replace(/\s*[—–]\s*/g, ' · ');

// ─── Layout ───────────────────────────────────────────────────────────────────
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
    word-break: keep-all;
  }
`;

/* 밑줄 탭: 활성 탭만 굵게 + 2px 검정 막대 */
const Tabs = styled.div`
  display: flex;
  gap: var(--k-space-6);
  margin-bottom: var(--k-space-8);
  border-bottom: 1px solid var(--k-line);
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

// ─── Cards ────────────────────────────────────────────────────────────────────
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

  button {
    display: block;
    width: 100%;
    padding: 0;
    border: none;
    background: none;
    font: inherit;
    color: inherit;
    text-align: left;
    cursor: pointer;
  }

  .shot {
    position: relative;
    aspect-ratio: 4 / 3;
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

  .shot svg {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 28px;
    height: 28px;
    transform: translate(-50%, -50%);
    color: var(--k-text-disabled);
  }

  .title {
    margin-top: var(--k-space-3);
    font-size: 15px;
    font-weight: 600;
    line-height: 1.5;
    word-break: keep-all;
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
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  button:hover .title {
    text-decoration: underline;
    text-underline-offset: 4px;
  }

  button:focus-visible {
    outline: 2px solid var(--k-accent);
    outline-offset: 4px;
    border-radius: var(--k-radius-lg);
  }
`;

const EmptyMsg = styled.p`
  padding: var(--k-space-12) 0;
  border-top: 1px solid var(--k-line);
  font-size: var(--k-text-md);
  color: var(--k-text-weak);
`;

// ─── PDF Viewer ───────────────────────────────────────────────────────────────
const ViewerOverlay = styled.div`
  position: fixed; inset: 0; z-index: 9000;
  background: var(--k-bg-sub);
  display: flex; flex-direction: column; overflow: hidden;
  color: var(--k-text);
  animation: viewer-fade 0.15s var(--k-ease);

  @keyframes viewer-fade { from { opacity: 0; } to { opacity: 1; } }
`;

const Toolbar = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: var(--k-space-3);
  height: 56px;
  padding: 0 var(--k-space-3) 0 var(--k-space-6);
  background: var(--k-bg);
  border-bottom: 1px solid var(--k-line);

  .title {
    flex: 1;
    min-width: 0;
    font-size: 15px;
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .count {
    flex: none;
    font-size: var(--k-text-sm);
    color: var(--k-text-weak);
    font-variant-numeric: tabular-nums;
  }

  @media (max-width: 768px) {
    padding-left: var(--k-space-4);
    gap: var(--k-space-2);
  }
`;

const SecondaryLink = styled.a`
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: var(--k-control-sm);
  padding: 0 var(--k-space-3);
  border: 1px solid var(--k-line-strong);
  border-radius: var(--k-radius);
  background: var(--k-bg);
  color: var(--k-text);
  font-size: var(--k-text-sm);
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
  transition: background 0.15s var(--k-ease);

  svg { width: 14px; height: 14px; }
  &:hover { background: var(--k-bg-hover); }

  @media (max-width: 768px) {
    .text { display: none; }
    padding: 0 var(--k-space-2);
  }
`;

const GhostIcon = styled.button`
  flex: none;
  display: flex; align-items: center; justify-content: center;
  width: var(--k-control-sm); height: var(--k-control-sm);
  border: none; border-radius: var(--k-radius);
  background: transparent;
  color: var(--k-text-sub);
  cursor: pointer;
  transition: background 0.15s var(--k-ease), color 0.15s var(--k-ease);

  svg { width: 18px; height: 18px; }
  &:hover { background: var(--k-bg-hover); color: var(--k-text); }
`;

const PagesScroll = styled.div`
  flex: 1; overflow-y: auto; overscroll-behavior: contain;
  padding: var(--k-space-8) var(--k-space-6) 60px;
  display: flex; flex-direction: column; align-items: center; gap: var(--k-space-5);

  @media (max-width: 768px) {
    padding: var(--k-space-4) var(--k-space-4) 48px;
  }
`;

// 떠 있는 요소가 아니라서 그림자 대신 1px 선으로 종이 경계를 보여 준다
const PageCanvasWrap = styled.div`
  border: 1px solid var(--k-line);
  border-radius: var(--k-radius-sm);
  overflow: hidden; max-width: 100%;
  background: #ffffff;

  canvas { display: block; }
`;

const PageLabel = styled.div`
  text-align: center;
  font-size: var(--k-text-xs);
  color: var(--k-text-weak);
  margin-top: 6px;
  font-variant-numeric: tabular-nums;
`;

const LoadingBox = styled.div`
  flex: 1; display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: var(--k-space-3);
  font-size: var(--k-text-md);
  color: var(--k-text-weak);
  .spin { animation: ${spin} 1s linear infinite; }
`;

// ─── Single PDF Page Canvas ───────────────────────────────────────────────────
function PdfPageCanvas({
  pdf,
  pageNum,
  maxWidth,
}: {
  pdf: PDFDocumentProxy;
  pageNum: number;
  maxWidth: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderTask = useRef<RenderTask | null>(null);

  useEffect(() => {
    let cancelled = false;
    const render = async () => {
      const page = await pdf.getPage(pageNum);
      if (cancelled) return;
      const dpr = window.devicePixelRatio || 1;
      const baseViewport = page.getViewport({ scale: 1 });
      const scale = Math.min((maxWidth / baseViewport.width) * dpr, 3);
      const viewport = page.getViewport({ scale });

      const canvas = canvasRef.current;
      if (!canvas || cancelled) return;
      // alpha: false → 투명도 없이 렌더링 → 색상 정확도 향상
      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) return;

      // Cancel any previous render
      if (renderTask.current) renderTask.current.cancel();

      canvas.width = viewport.width;
      canvas.height = viewport.height;
      canvas.style.width = `${viewport.width / dpr}px`;
      canvas.style.height = `${viewport.height / dpr}px`;

      // 흰 배경 먼저 채워서 투명 레이어로 인한 색 왜곡 방지
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      renderTask.current = page.render({ canvas, canvasContext: ctx, viewport, intent: 'display' });
      await renderTask.current.promise.catch(() => {});
    };
    render();
    return () => {
      cancelled = true;
      renderTask.current?.cancel();
    };
  }, [pdf, pageNum, maxWidth]);

  return (
    <div data-page={pageNum}>
      <PageCanvasWrap>
        <canvas ref={canvasRef} />
      </PageCanvasWrap>
      <PageLabel>{pageNum}</PageLabel>
    </div>
  );
}

// ─── PDF Viewer Modal ─────────────────────────────────────────────────────────
const VIEWER_T = {
  ko: { loading: 'PDF를 불러오는 중이에요', error: 'PDF를 불러오지 못했어요. 잠시 후 다시 열어 주세요.', newTab: '새 탭에서 열기', close: '닫기' },
  en: { loading: 'Loading the PDF', error: 'Could not load the PDF. Please try again later.', newTab: 'Open in new tab', close: 'Close' },
};

function PdfViewer({
  presentation,
  language,
  onClose,
  t,
}: {
  presentation: DbPresentation;
  language: 'ko' | 'en';
  onClose: () => void;
  t: (ko: string | null, en: string | null) => string;
}) {
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [current, setCurrent] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [maxWidth, setMaxWidth] = useState(860);
  const vt = VIEWER_T[language];

  // Measure available width
  useEffect(() => {
    const update = () => {
      if (scrollRef.current) {
        setMaxWidth(Math.min(scrollRef.current.clientWidth - 48, 1000));
      }
    };
    update();
    const ro = new ResizeObserver(update);
    if (scrollRef.current) ro.observe(scrollRef.current);
    return () => ro.disconnect();
  }, []);

  // Load PDF
  useEffect(() => {
    setLoading(true);
    setError('');
    setPdf(null);
    setCurrent(1);
    let cancelled = false;
    let task: ReturnType<(typeof import('pdfjs-dist'))['getDocument']> | null = null;
    loadPdfjs()
      .then(pdfjs => {
        if (cancelled) return null;
        task = pdfjs.getDocument({ url: presentation.file_url, withCredentials: false });
        return task.promise;
      })
      .then(doc => {
        if (cancelled || !doc) return;
        setPdf(doc);
        setNumPages(doc.numPages);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setError('load');
        setLoading(false);
      });
    return () => {
      cancelled = true;
      task?.destroy();
    };
  }, [presentation.file_url]);

  // ESC to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // 뷰어가 열려 있는 동안 뒤 페이지가 같이 스크롤되지 않게
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  // 화면 위쪽 1/3 지점을 지난 마지막 쪽을 지금 보는 쪽으로 친다
  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const line = el.scrollTop + el.clientHeight / 3;
    let page = 1;
    el.querySelectorAll<HTMLElement>('[data-page]').forEach(node => {
      if (node.offsetTop <= line) page = Number(node.dataset.page);
    });
    setCurrent(page);
  };

  const title = tidy(t(presentation.title_ko, presentation.title_en));

  return (
    <ViewerOverlay role="dialog" aria-modal="true" aria-label={title}>
      <Toolbar>
        <span className="title">{title}</span>
        {numPages > 0 && <span className="count">{current} / {numPages}</span>}
        <SecondaryLink href={presentation.file_url} target="_blank" rel="noopener noreferrer" aria-label={vt.newTab}>
          <span className="text">{vt.newTab}</span>
          <ArrowUpRight />
        </SecondaryLink>
        <GhostIcon type="button" onClick={onClose} aria-label={vt.close}><X /></GhostIcon>
      </Toolbar>

      <PagesScroll ref={scrollRef} onScroll={handleScroll}>
        {loading && (
          <LoadingBox>
            <Loader size={24} className="spin" />
            <span>{vt.loading}</span>
          </LoadingBox>
        )}
        {error && (
          <LoadingBox>
            <FileText size={28} />
            <span>{vt.error}</span>
          </LoadingBox>
        )}
        {pdf && !loading &&
          Array.from({ length: numPages }, (_, i) => i + 1).map(num => (
            <PdfPageCanvas
              key={num}
              pdf={pdf}
              pageNum={num}
              maxWidth={maxWidth}
            />
          ))
        }
      </PagesScroll>
    </ViewerOverlay>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
interface Props {
  // 예전 호출부 호환용. 헤더 메뉴가 있어서 따로 뒤로가기 버튼은 그리지 않는다
  onBack?: () => void;
}

const T = {
  ko: {
    title: 'PT 자료',
    desc: '발표에 쓴 자료를 모았어요. 누르면 바로 PDF로 볼 수 있어요.',
    all: '전체',
    loading: '불러오는 중이에요',
    empty: '아직 올린 자료가 없어요',
  },
  en: {
    title: 'Talks',
    desc: 'Slides from my talks. Click one to read the PDF.',
    all: 'All',
    loading: 'Loading',
    empty: 'No talks yet',
  },
};

export default function Presentations(_props: Props) {
  const { language } = useLanguage();
  const [presentations, setPresentations] = useState<DbPresentation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string | null>(null);
  const [viewing, setViewing] = useState<DbPresentation | null>(null);
  const copy = T[language];

  useEffect(() => {
    supabase
      .from('presentations')
      .select('*')
      .eq('is_public', true)
      .order('sort_order')
      .then(({ data }) => {
        setPresentations((data as DbPresentation[]) ?? []);
        setLoading(false);
      });
  }, []);

  const categories = [
    ...new Set(presentations.map(p => p.category_tag).filter(Boolean)),
  ] as string[];

  const filtered = filter
    ? presentations.filter(p => p.category_tag === filter)
    : presentations;

  const t = useCallback(
    (ko: string | null, en: string | null) =>
      language === 'ko' ? (ko ?? en ?? '') : (en ?? ko ?? ''),
    [language]
  );

  const closeViewer = useCallback(() => setViewing(null), []);

  return (
    <>
      <Page>
        <PageHead>
          <h1>{copy.title}</h1>
          <p>{copy.desc}</p>
        </PageHead>

        {categories.length > 0 && (
          <Tabs role="tablist">
            <Tab role="tab" aria-selected={filter === null} $active={filter === null} onClick={() => setFilter(null)}>
              {copy.all}
              <span className="count">{presentations.length}</span>
            </Tab>
            {categories.map(cat => (
              <Tab key={cat} role="tab" aria-selected={filter === cat} $active={filter === cat} onClick={() => setFilter(cat)}>
                {cat}
                <span className="count">{presentations.filter(p => p.category_tag === cat).length}</span>
              </Tab>
            ))}
          </Tabs>
        )}

        {loading ? (
          <EmptyMsg>{copy.loading}</EmptyMsg>
        ) : filtered.length === 0 ? (
          <EmptyMsg>{copy.empty}</EmptyMsg>
        ) : (
          <Grid>
            {filtered.map((p, i) => {
              const desc = t(p.description_ko, p.description_en);
              const meta = [p.category_tag, p.date?.replace(/-/g, '.')].filter(Boolean).join(' · ');
              return (
                <Card key={p.id} style={{ animationDelay: `${Math.min(i, 8) * 30}ms` }}>
                  <button type="button" onClick={() => setViewing(p)}>
                    <div className="shot">
                      {p.thumbnail_url ? <img src={p.thumbnail_url} alt="" loading="lazy" /> : <FileText />}
                    </div>
                    <div className="title">{tidy(t(p.title_ko, p.title_en))}</div>
                    {meta && <div className="meta">{meta}</div>}
                    {desc && <div className="desc">{tidy(desc)}</div>}
                  </button>
                </Card>
              );
            })}
          </Grid>
        )}
      </Page>

      {viewing && (
        <PdfViewer
          presentation={viewing}
          language={language}
          onClose={closeViewer}
          t={t}
        />
      )}
    </>
  );
}
