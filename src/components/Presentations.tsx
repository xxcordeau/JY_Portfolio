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
  background: ${p => p.$isDark ? '#000' : '#ffffff'};
  transition: background 0.3s ease;
`;

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 160px 40px 80px;

  @media (max-width: 768px) {
    padding: 120px 20px 60px;
  }
`;

const BackBtn = styled.button<{ $isDark: boolean }>`
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

  svg { width: 16px; height: 16px; transition: transform 0.2s ease; }

  &:hover {
    color: ${p => p.$isDark ? '#f5f5f7' : '#1d1d1f'};
    border-color: ${p => p.$isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.25)'};
    svg { transform: translateX(-3px); }
  }

  @media (max-width: 768px) {
    top: 16px; left: 16px;
    padding: 8px 18px; font-size: 13px;
  }
`;

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

const PageTitle = styled.h1<{ $isDark: boolean }>`
  font-size: 40px;
  font-weight: 700;
  color: ${p => p.$isDark ? '#f5f5f7' : '#1d1d1f'};
  letter-spacing: -1px;
  margin: 0 0 16px 0;
  line-height: 1.15;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 30px;
  }
`;

const PageSubtitle = styled.p<{ $isDark: boolean }>`
  font-size: 16px;
  color: ${p => p.$isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)'};
  margin: 0 0 48px 0;
  line-height: 1.5;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 14px;
    margin-bottom: 36px;
  }
`;

const FilterRow = styled.div<{ $isDark: boolean }>`
  display: inline-flex;
  gap: 0;
  margin-bottom: 36px;
  border-radius: 100px;
  overflow: hidden;
  border: 1px solid ${p => p.$isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'};
`;

const FilterTag = styled.button<{ $isDark: boolean; $active: boolean }>`
  padding: 10px 24px;
  border: none;
  background: ${p => p.$active
    ? p.$isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)'
    : 'transparent'};
  color: ${p => p.$active
    ? p.$isDark ? '#f5f5f7' : '#1d1d1f'
    : p.$isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)'};
  font-size: 14px;
  font-weight: ${p => p.$active ? 600 : 400};
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;

  &:hover {
    background: ${p => !p.$active
      ? p.$isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'
      : ''};
  }

  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 13px;
  }
`;

// ─── Cards ────────────────────────────────────────────────────────────────────
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

const CardWrapper = styled.div`
  cursor: pointer;
`;

const CardThumb = styled.div<{ $isDark: boolean }>`
  position: relative;
  border-radius: 14px;
  overflow: hidden;
  aspect-ratio: 4 / 3;
  background: ${p => p.$isDark ? 'rgba(255,255,255,0.05)' : '#f5f5f7'};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.4s ease, filter 0.4s ease;
  }

  svg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 44px;
    height: 44px;
    color: ${p => p.$isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'};
  }

  ${CardWrapper}:hover & img {
    transform: scale(1.04);
    filter: blur(3px) brightness(0.65);
  }
`;

const ThumbOverlay = styled.div`
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

const CardTitle = styled.h3<{ $isDark: boolean }>`
  font-size: 15px;
  font-weight: 600;
  color: ${p => p.$isDark ? '#f5f5f7' : '#1d1d1f'};
  margin: 0;
  letter-spacing: -0.2px;
`;

const CardInfo = styled.div<{ $isDark: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
`;

const MetaTag = styled.span<{ $isDark: boolean }>`
  font-size: 12px;
  color: ${p => p.$isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)'};
  font-weight: 400;
`;

const MetaDate = styled.span<{ $isDark: boolean }>`
  font-size: 12px;
  color: ${p => p.$isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)'};
  font-weight: 400;
`;

const EmptyMsg = styled.div<{ $isDark: boolean }>`
  text-align: center;
  padding: 80px 20px;
  color: ${p => p.$isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)'};
  font-size: 16px;
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

      renderTask.current = page.render({ canvasContext: ctx, viewport, intent: 'display' });
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
        {onBack && (
          <BackBtn $isDark={isDark} onClick={onBack}>
            <ChevronLeft />
            {language === 'ko' ? '홈으로' : 'Back to Home'}
          </BackBtn>
        )}

        <Container>
          <SectionEyebrow $isDark={isDark}>PRESENTATIONS</SectionEyebrow>
          <PageTitle $isDark={isDark}>
            {language === 'ko' ? 'PT 자료' : 'Presentations'}
          </PageTitle>
          <PageSubtitle $isDark={isDark}>
            {language === 'ko'
              ? '발표 자료와 디자인 작업물을 모아봤습니다'
              : 'A collection of my presentations and design works'}
          </PageSubtitle>

          {categories.length > 0 && (
            <FilterRow $isDark={isDark}>
              <FilterTag $isDark={isDark} $active={filter === null} onClick={() => setFilter(null)}>
                {language === 'ko' ? '전체' : 'All'}
              </FilterTag>
              {categories.map(cat => (
                <FilterTag key={cat} $isDark={isDark} $active={filter === cat} onClick={() => setFilter(cat)}>
                  {cat}
                </FilterTag>
              ))}
            </FilterRow>
          )}

          {loading ? (
            <EmptyMsg $isDark={isDark}>
              {language === 'ko' ? '불러오는 중...' : 'Loading...'}
            </EmptyMsg>
          ) : filtered.length === 0 ? (
            <EmptyMsg $isDark={isDark}>
              {language === 'ko' ? 'PT 자료가 없습니다' : 'No presentations yet'}
            </EmptyMsg>
          ) : (
            <Grid>
              {filtered.map(p => (
                <CardWrapper key={p.id} onClick={() => setViewing(p)}>
                  <CardThumb $isDark={isDark}>
                    {p.thumbnail_url ? <img src={p.thumbnail_url} alt="" /> : <FileText />}
                    {(p.description_ko || p.description_en) && (
                      <ThumbOverlay>
                        <OverlayText>{t(p.description_ko, p.description_en)}</OverlayText>
                      </ThumbOverlay>
                    )}
                  </CardThumb>
                  <CardMeta>
                    <CardTitle $isDark={isDark}>{t(p.title_ko, p.title_en)}</CardTitle>
                    <CardInfo $isDark={isDark}>
                      {p.category_tag && <MetaTag $isDark={isDark}>{p.category_tag}</MetaTag>}
                      {p.category_tag && p.date && <span style={{ color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)' }}>·</span>}
                      <MetaDate $isDark={isDark}>{p.date}</MetaDate>
                    </CardInfo>
                  </CardMeta>
                </CardWrapper>
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
