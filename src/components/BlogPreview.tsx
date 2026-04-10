import { useRef, useCallback } from 'react';
import styled from 'styled-components';
import { useBlogPosts } from '../hooks/useBlogPosts';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ArrowRight } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

const BlogSection = styled.section<{ $isDark: boolean }>`
  min-height: 100vh;
  padding: 120px 0;
  background: ${props => props.$isDark ? '#0a0a0a' : '#f5f5f7'};
  transition: background 0.3s ease;
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    padding: 80px 0;
    display: block;
  }
`;

const Inner = styled.div`
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 0 12vw;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    padding: 0 20px;
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;
    margin-bottom: 40px;
  }
`;

const SectionTitle = styled.h2<{ $isDark: boolean }>`
  font-size: 52px;
  font-weight: 700;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  margin: 0;
  letter-spacing: -1.5px;
  line-height: 1;
  transition: color 0.3s ease;

  @media (max-width: 768px) {
    font-size: 36px;
  }
`;

const ViewAllButton = styled.button<{ $isDark: boolean }>`
  background: transparent;
  border: 2px solid ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  padding: 12px 24px;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  margin-bottom: 6px;

  &:hover {
    background: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
    color: ${props => props.$isDark ? '#1d1d1f' : '#f5f5f7'};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

/* ── 가로 스크롤 트랙 ── */
const ScrollTrack = styled.div`
  display: flex;
  gap: 20px;
  overflow-x: auto;
  padding: 10px 0 20px 12vw;
  scrollbar-width: none;
  -ms-overflow-style: none;
  cursor: grab;
  user-select: none;
  &::-webkit-scrollbar { display: none; }

  @media (max-width: 768px) {
    padding: 0 0 0 20px;
  }
`;

const PostCard = styled.article<{ $isDark: boolean }>`
  flex: 0 0 380px;
  scroll-snap-align: start;
  cursor: pointer;
  border-radius: 24px;
  overflow: hidden;
  background: ${props => props.$isDark ? '#111111' : '#f5f5f7'};
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-6px);

    img {
      transform: scale(1.04);
    }
  }
`;

const PostThumbnail = styled.div`
  width: 100%;
  aspect-ratio: 4 / 3;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
  }
`;

const PostInfo = styled.div`
  padding: 20px 22px 24px;
`;

const PostMeta = styled.div`
  display: flex;
  gap: 14px;
  margin-bottom: 8px;
`;

const Category = styled.span<{ $isDark: boolean }>`
  font-size: 11px;
  color: ${props => props.$isDark ? '#a1a1a6' : '#86868b'};
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 500;
`;

const Date = styled.span`
  font-size: 11px;
  color: #86868b;
  letter-spacing: 0.5px;
`;

const PostTitle = styled.h3<{ $isDark: boolean }>`
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  margin: 0 0 8px 0;
  letter-spacing: -0.4px;
  line-height: 1.3;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  transition: color 0.3s ease;

  svg {
    flex-shrink: 0;
    margin-top: 2px;
    opacity: 0;
    transition: opacity 0.3s ease;
    width: 16px;
    height: 16px;
  }

  ${PostCard}:hover & svg {
    opacity: 1;
  }

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const PostExcerpt = styled.p`
  font-size: 13px;
  color: #86868b;
  line-height: 1.5;
  margin: 0 0 8px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

const ReadTime = styled.span`
  font-size: 12px;
  color: #86868b;
  font-weight: 500;
`;

interface BlogPreviewProps {
  onPostClick: (blogId: string) => void;
  onViewAll: () => void;
}

const translations = {
  ko: {
    title: '블로그',
    viewAll: '전체 보기'
  },
  en: {
    title: 'Blog',
    viewAll: 'View All'
  }
};

export default function BlogPreview({ onPostClick, onViewAll }: BlogPreviewProps) {
  const { isDark } = useTheme();
  const { language } = useLanguage();
  const { posts: blogPosts } = useBlogPosts();
  const t = translations[language];
  const recentPosts = blogPosts.slice(0, 8);

  const trackRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.pageX - (trackRef.current?.offsetLeft ?? 0);
    scrollLeft.current = trackRef.current?.scrollLeft ?? 0;
    if (trackRef.current) trackRef.current.style.cursor = 'grabbing';
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current || !trackRef.current) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.2;
    trackRef.current.scrollLeft = scrollLeft.current - walk;
  }, []);

  const onMouseUp = useCallback(() => {
    isDragging.current = false;
    if (trackRef.current) trackRef.current.style.cursor = 'grab';
  }, []);

  return (
    <BlogSection id="blog" $isDark={isDark}>
      <Inner>
        <Header>
          <SectionTitle $isDark={isDark}>{t.title}</SectionTitle>
          <ViewAllButton $isDark={isDark} onClick={onViewAll}>
            {t.viewAll}
            <ArrowRight />
          </ViewAllButton>
        </Header>
        <ScrollTrack
          ref={trackRef}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        >
          {recentPosts.map((post) => (
            <PostCard
              key={post.id}
              $isDark={isDark}
              onClick={() => { if (!isDragging.current) onPostClick(post.id); }}
            >
              <PostThumbnail>
                <ImageWithFallback
                  src={post.thumbnail}
                  alt={post.title[language]}
                />
              </PostThumbnail>
              <PostInfo>
                <PostMeta>
                  <Category $isDark={isDark}>{post.category[language]}</Category>
                  <Date>{post.date}</Date>
                </PostMeta>
                <PostTitle $isDark={isDark}>
                  <span>{post.title[language]}</span>
                  <ArrowRight size={20} />
                </PostTitle>
                <PostExcerpt>{post.excerpt[language]}</PostExcerpt>
                <ReadTime>{post.readTime[language]}</ReadTime>
              </PostInfo>
            </PostCard>
          ))}
        </ScrollTrack>
      </Inner>
    </BlogSection>
  );
}
