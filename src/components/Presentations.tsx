import { useState, useEffect, useRef, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { FileText, ChevronLeft, X, Loader } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import { supabase } from '../lib/supabase';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import type { DbPresentation } from '../lib/types/database';

// pdfjs worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

const spin = keyframes`from { transform: rotate(0deg); } to { transform: rotate(360deg); }`;

// ─── Layout ───────────────────────────────────────────────────────────────────
const PageWrap = styled.div<{ $isDark: boolean }>`
  min-height: 100vh;
  background: ${p => p.$isDark ? '#000' : '#fff'};
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 120px 24px 80px;
`;

const BackBtn = styled.button<{ $isDark: boolean }>`
  display: inline-flex; align-items: center; gap: 6px;
  background: none; border: none;
  color: ${p => p.$isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'};
  font-size: 14px; cursor: pointer; font-family: inherit;
  padding: 6px 0; margin-bottom: 28px; transition: color 0.15s;
  &:hover { color: #0c8ce9; }
  svg { width: 18px; height: 18px; }
`;

const PageTitle = styled.h1<{ $isDark: boolean }>`
  font-size: 42px; font-weight: 700;
  color: ${p => p.$isDark ? '#f5f5f7' : '#1d1d1f'};
  letter-spacing: -1px; margin-bottom: 8px;
`;

const PageSubtitle = styled.p`
  font-size: 17px; color: #86868b; margin-bottom: 40px;
`;

const FilterRow = styled.div`
  display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 32px;
`;

const FilterTag = styled.button<{ $isDark: boolean; $active: boolean }>`
  height: 34px; padding: 0 16px; font-size: 13px;
  font-weight: ${p => p.$active ? '600' : '500'};
  border-radius: 99px;
  border: 1px solid ${p => p.$active ? '#0c8ce9' : p.$isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'};
  background: ${p => p.$active ? 'rgba(12,140,233,0.1)' : 'transparent'};
  color: ${p => p.$active ? '#0c8ce9' : p.$isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)'};
  cursor: pointer; font-family: inherit; transition: all 0.15s;
  &:hover { border-color: #0c8ce9; }
`;

// ─── Cards ────────────────────────────────────────────────────────────────────
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
`;

const Card = styled.div<{ $isDark: boolean }>`
  background: ${p => p.$isDark ? 'rgba(255,255,255,0.04)' : '#ffffff'};
  border: 1px solid ${p => p.$isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'};
  border-radius: 16px; overflow: hidden; cursor: pointer; transition: all 0.25s;
  box-shadow: ${p => p.$isDark ? 'none' : '0 2px 12px rgba(0,0,0,0.04)'};
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 48px ${p => p.$isDark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.1)'};
    border-color: ${p => p.$isDark ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.14)'};
  }
`;

const CardThumb = styled.div<{ $isDark: boolean }>`
  width: 100%; height: 180px;
  background: ${p => p.$isDark ? 'rgba(255,255,255,0.05)' : '#f5f5f7'};
  display: flex; align-items: center; justify-content: center; overflow: hidden;
  img { width: 100%; height: 100%; object-fit: cover; }
  svg { width: 44px; height: 44px; color: ${p => p.$isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'}; }
`;

const CardBody = styled.div` padding: 16px 18px 20px; `;

const CardTitle = styled.h3<{ $isDark: boolean }>`
  font-size: 15px; font-weight: 600;
  color: ${p => p.$isDark ? '#f5f5f7' : '#1d1d1f'};
  margin-bottom: 6px; letter-spacing: -0.3px;
`;

const CardDesc = styled.p`
  font-size: 13px; color: #86868b; line-height: 1.5;
  display: -webkit-box; -webkit-line-clamp: 2;
  -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 10px;
`;

const CardMeta = styled.div` display: flex; gap: 8px; align-items: center; `;
const MetaTag = styled.span`
  padding: 2px 10px; font-size: 11px; font-weight: 600;
  border-radius: 99px; background: rgba(12,140,233,0.1); color: #0c8ce9;
`;
const MetaDate = styled.span` font-size: 12px; color: #86868b; `;

const EmptyMsg = styled.div<{ $isDark: boolean }>`
  text-align: center; padding: 80px 20px; color: #86868b; font-size: 16px;
`;

// ─── PDF Viewer ───────────────────────────────────────────────────────────────
const ViewerOverlay = styled.div<{ $isDark: boolean }>`
  position: fixed; inset: 0; z-index: 9000;
  background: ${p => p.$isDark ? '#111' : '#e8e8e8'};
  display: flex; flex-direction: column; overflow: hidden;
`;

const ViewerHeader = styled.div<{ $isDark: boolean }>`
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 24px;
  background: ${p => p.$isDark ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.92)'};
  border-bottom: 1px solid ${p => p.$isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'};
  backdrop-filter: blur(12px); flex-shrink: 0; z-index: 1;
`;

const ViewerTitle = styled.span<{ $isDark: boolean }>`
  font-size: 15px; font-weight: 600;
  color: ${p => p.$isDark ? '#f5f5f7' : '#1d1d1f'};
  letter-spacing: -0.3px;
`;

const ViewerPageInfo = styled.span`
  font-size: 13px; color: #86868b; margin-left: 10px;
`;

const CloseBtn = styled.button<{ $isDark: boolean }>`
  display: flex; align-items: center; justify-content: center;
  width: 36px; height: 36px; border-radius: 8px; border: none;
  background: ${p => p.$isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'};
  color: ${p => p.$isDark ? '#f5f5f7' : '#1d1d1f'};
  cursor: pointer; transition: background 0.15s;
  &:hover { background: ${p => p.$isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'}; }
  svg { width: 18px; height: 18px; }
`;

const PagesScroll = styled.div`
  flex: 1; overflow-y: auto; padding: 32px 24px 60px;
  display: flex; flex-direction: column; align-items: center; gap: 20px;
`;

const PageCanvasWrap = styled.div<{ $isDark: boolean }>`
  box-shadow: 0 8px 40px ${p => p.$isDark ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.18)'};
  border-radius: 3px; overflow: hidden; max-width: 100%;
`;

const PageLabel = styled.div<{ $isDark: boolean }>`
  text-align: center; font-size: 12px;
  color: ${p => p.$isDark ? 'rgba(255,255,255,0.28)' : 'rgba(0,0,0,0.3)'};
  margin-top: 6px; font-family: inherit;
`;

const LoadingBox = styled.div`
  flex: 1; display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 14px; color: #86868b;
  svg { animation: ${spin} 1s linear infinite; }
`;

// ─── Single PDF Page Canvas ───────────────────────────────────────────────────
function PdfPageCanvas({
  pdf,
  pageNum,
  maxWidth,
  isDark,
}: {
  pdf: pdfjsLib.PDFDocumentProxy;
  pageNum: number;
  maxWidth: number;
  isDark: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderTask = useRef<pdfjsLib.RenderTask | null>(null);

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
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Cancel any previous render
      if (renderTask.current) renderTask.current.cancel();

      canvas.width = viewport.width;
      canvas.height = viewport.height;
      canvas.style.width = `${viewport.width / dpr}px`;
      canvas.style.height = `${viewport.height / dpr}px`;

      renderTask.current = page.render({ canvasContext: ctx, viewport });
      await renderTask.current.promise.catch(() => {});
    };
    render();
    return () => {
      cancelled = true;
      renderTask.current?.cancel();
    };
  }, [pdf, pageNum, maxWidth]);

  return (
    <div>
      <PageCanvasWrap $isDark={isDark}>
        <canvas ref={canvasRef} />
      </PageCanvasWrap>
      <PageLabel $isDark={isDark}>{pageNum}</PageLabel>
    </div>
  );
}

// ─── PDF Viewer Modal ─────────────────────────────────────────────────────────
function PdfViewer({
  presentation,
  isDark,
  onClose,
  t,
}: {
  presentation: DbPresentation;
  isDark: boolean;
  onClose: () => void;
  t: (ko: string | null, en: string | null) => string;
}) {
  const [pdf, setPdf] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const [maxWidth, setMaxWidth] = useState(860);

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
    const task = pdfjsLib.getDocument({ url: presentation.file_url, withCredentials: false });
    task.promise
      .then(doc => {
        setPdf(doc);
        setNumPages(doc.numPages);
        setLoading(false);
      })
      .catch(() => {
        setError('PDF를 불러오지 못했습니다. URL을 확인해주세요.');
        setLoading(false);
      });
    return () => { task.destroy(); };
  }, [presentation.file_url]);

  // ESC to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <ViewerOverlay $isDark={isDark}>
      <ViewerHeader $isDark={isDark}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ViewerTitle $isDark={isDark}>{t(presentation.title_ko, presentation.title_en)}</ViewerTitle>
          {numPages > 0 && <ViewerPageInfo>{numPages}페이지</ViewerPageInfo>}
        </div>
        <CloseBtn $isDark={isDark} onClick={onClose}><X /></CloseBtn>
      </ViewerHeader>

      <PagesScroll ref={scrollRef}>
        {loading && (
          <LoadingBox>
            <Loader size={32} />
            <span style={{ fontSize: 14, color: '#86868b' }}>PDF 불러오는 중...</span>
          </LoadingBox>
        )}
        {error && (
          <LoadingBox>
            <FileText size={40} style={{ color: '#86868b' }} />
            <span style={{ fontSize: 14, color: '#86868b' }}>{error}</span>
          </LoadingBox>
        )}
        {pdf && !loading &&
          Array.from({ length: numPages }, (_, i) => i + 1).map(num => (
            <PdfPageCanvas
              key={num}
              pdf={pdf}
              pageNum={num}
              maxWidth={maxWidth}
              isDark={isDark}
            />
          ))
        }
      </PagesScroll>
    </ViewerOverlay>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
interface Props {
  onBack?: () => void;
}

export default function Presentations({ onBack }: Props) {
  const { isDark } = useTheme();
  const { language } = useLanguage();
  const [presentations, setPresentations] = useState<DbPresentation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string | null>(null);
  const [viewing, setViewing] = useState<DbPresentation | null>(null);

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

  return (
    <>
      <PageWrap $isDark={isDark}>
        <Container>
          {onBack && (
            <BackBtn $isDark={isDark} onClick={onBack}>
              <ChevronLeft /> 돌아가기
            </BackBtn>
          )}

          <PageTitle $isDark={isDark}>
            {language === 'ko' ? 'PT 자료' : 'Presentations'}
          </PageTitle>
          <PageSubtitle>
            {language === 'ko'
              ? '발표 자료와 디자인 작업물을 모아봤습니다'
              : 'A collection of my presentations and design works'}
          </PageSubtitle>

          {categories.length > 0 && (
            <FilterRow>
              <FilterTag $isDark={isDark} $active={filter === null} onClick={() => setFilter(null)}>
                전체
              </FilterTag>
              {categories.map(cat => (
                <FilterTag key={cat} $isDark={isDark} $active={filter === cat} onClick={() => setFilter(cat)}>
                  {cat}
                </FilterTag>
              ))}
            </FilterRow>
          )}

          {loading ? (
            <EmptyMsg $isDark={isDark}>불러오는 중...</EmptyMsg>
          ) : filtered.length === 0 ? (
            <EmptyMsg $isDark={isDark}>
              {language === 'ko' ? 'PT 자료가 없습니다' : 'No presentations yet'}
            </EmptyMsg>
          ) : (
            <Grid>
              {filtered.map(p => (
                <Card key={p.id} $isDark={isDark} onClick={() => setViewing(p)}>
                  <CardThumb $isDark={isDark}>
                    {p.thumbnail_url ? <img src={p.thumbnail_url} alt="" /> : <FileText />}
                  </CardThumb>
                  <CardBody>
                    <CardTitle $isDark={isDark}>{t(p.title_ko, p.title_en)}</CardTitle>
                    {(p.description_ko || p.description_en) && (
                      <CardDesc>{t(p.description_ko, p.description_en)}</CardDesc>
                    )}
                    <CardMeta>
                      {p.category_tag && <MetaTag>{p.category_tag}</MetaTag>}
                      <MetaDate>{p.date}</MetaDate>
                    </CardMeta>
                  </CardBody>
                </Card>
              ))}
            </Grid>
          )}
        </Container>
      </PageWrap>

      {viewing && (
        <PdfViewer
          presentation={viewing}
          isDark={isDark}
          onClose={() => setViewing(null)}
          t={t}
        />
      )}
    </>
  );
}
