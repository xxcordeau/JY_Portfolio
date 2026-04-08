import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FileText, X, ChevronLeft, Filter } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import type { DbPresentation } from '../lib/types/database';

const Container = styled.div<{ $isDark: boolean }>`
  max-width: 1200px;
  margin: 0 auto;
  padding: 120px 24px 80px;
  min-height: 100vh;
`;

const BackBtn = styled.button<{ $isDark: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  color: ${p => p.$isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'};
  font-size: 14px;
  cursor: pointer;
  font-family: inherit;
  padding: 6px 0;
  margin-bottom: 24px;

  &:hover { color: #0c8ce9; }
  svg { width: 18px; height: 18px; }
`;

const PageTitle = styled.h1<{ $isDark: boolean }>`
  font-size: 42px;
  font-weight: 700;
  color: ${p => p.$isDark ? '#f5f5f7' : '#1d1d1f'};
  letter-spacing: -1px;
  margin-bottom: 8px;
`;

const PageSubtitle = styled.p`
  font-size: 17px;
  color: #86868b;
  margin-bottom: 32px;
`;

const FilterRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 32px;
`;

const FilterTag = styled.button<{ $isDark: boolean; $active: boolean }>`
  height: 34px;
  padding: 0 16px;
  font-size: 13px;
  font-weight: ${p => p.$active ? '600' : '500'};
  border-radius: 99px;
  border: 1px solid ${p => p.$active ? '#0c8ce9' : p.$isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'};
  background: ${p => p.$active ? 'rgba(12,140,233,0.1)' : 'transparent'};
  color: ${p => p.$active ? '#0c8ce9' : p.$isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)'};
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s ease;

  &:hover { border-color: #0c8ce9; }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const Card = styled.div<{ $isDark: boolean }>`
  background: ${p => p.$isDark ? 'rgba(255,255,255,0.03)' : '#ffffff'};
  border: 1px solid ${p => p.$isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'};
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px ${p => p.$isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.08)'};
    border-color: ${p => p.$isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)'};
  }
`;

const CardThumb = styled.div<{ $isDark: boolean }>`
  width: 100%;
  height: 180px;
  background: ${p => p.$isDark ? 'rgba(255,255,255,0.04)' : '#f5f5f7'};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  svg {
    width: 48px;
    height: 48px;
    color: ${p => p.$isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'};
  }
`;

const CardBody = styled.div`
  padding: 16px 20px 20px;
`;

const CardTitle = styled.h3<{ $isDark: boolean }>`
  font-size: 16px;
  font-weight: 600;
  color: ${p => p.$isDark ? '#f5f5f7' : '#1d1d1f'};
  margin-bottom: 6px;
  letter-spacing: -0.3px;
`;

const CardDesc = styled.p`
  font-size: 13px;
  color: #86868b;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 10px;
`;

const CardMeta = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const MetaTag = styled.span<{ $isDark: boolean }>`
  padding: 2px 10px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 99px;
  background: rgba(12,140,233,0.1);
  color: #0c8ce9;
`;

const MetaDate = styled.span`
  font-size: 12px;
  color: #86868b;
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: rgba(0,0,0,0.85);
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background: rgba(0,0,0,0.5);
`;

const ModalTitle = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: #ffffff;
`;

const CloseBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: none;
  background: rgba(255,255,255,0.1);
  color: #ffffff;
  cursor: pointer;
  transition: background 0.15s;

  &:hover { background: rgba(255,255,255,0.2); }
  svg { width: 20px; height: 20px; }
`;

const PdfViewer = styled.iframe`
  flex: 1;
  width: 100%;
  border: none;
`;

const EmptyMsg = styled.div<{ $isDark: boolean }>`
  text-align: center;
  padding: 80px 20px;
  color: #86868b;
  font-size: 16px;
`;

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
    supabase.from('presentations').select('*')
      .eq('is_public', true)
      .order('sort_order')
      .then(({ data }) => {
        setPresentations((data as DbPresentation[]) ?? []);
        setLoading(false);
      });
  }, []);

  const categories = [...new Set(presentations.map(p => p.category_tag).filter(Boolean))] as string[];

  const filtered = filter
    ? presentations.filter(p => p.category_tag === filter)
    : presentations;

  const t = (ko: string | null, en: string | null) => language === 'ko' ? (ko ?? en ?? '') : (en ?? ko ?? '');

  return (
    <Container $isDark={isDark}>
      {onBack && (
        <BackBtn $isDark={isDark} onClick={onBack}>
          <ChevronLeft /> 돌아가기
        </BackBtn>
      )}

      <PageTitle $isDark={isDark}>
        {language === 'ko' ? 'PT 자료' : 'Presentations'}
      </PageTitle>
      <PageSubtitle>
        {language === 'ko' ? '발표 자료와 디자인 작업물을 모아봤습니다' : 'A collection of my presentations and design works'}
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
                  {p.category_tag && <MetaTag $isDark={isDark}>{p.category_tag}</MetaTag>}
                  <MetaDate>{p.date}</MetaDate>
                </CardMeta>
              </CardBody>
            </Card>
          ))}
        </Grid>
      )}

      {viewing && (
        <ModalOverlay onClick={() => setViewing(null)}>
          <ModalHeader onClick={e => e.stopPropagation()}>
            <ModalTitle>{t(viewing.title_ko, viewing.title_en)}</ModalTitle>
            <CloseBtn onClick={() => setViewing(null)}><X /></CloseBtn>
          </ModalHeader>
          <PdfViewer src={viewing.file_url} onClick={e => e.stopPropagation()} />
        </ModalOverlay>
      )}
    </Container>
  );
}
