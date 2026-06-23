import { useRef, useState, useEffect } from 'react';
import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useBlogPosts } from '../hooks/useBlogPosts';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ArrowRight } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

/* ── InView hook (toggles so animations replay) ── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const prevVisible = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        if (visible && !prevVisible.current) setAnimKey(k => k + 1);
        prevVisible.current = visible;
        setInView(visible);
      },
      { threshold, rootMargin: '-15% 0px -15% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, inView, animKey] as const;
}

/* ── Character reveal animation ── */
const charReveal = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const CharSpan = styled.span<{ $delay: number }>`
  display: inline-block;
  opacity: 0;
  animation: ${charReveal} 0.4s ease forwards;
  animation-delay: ${p => p.$delay}ms;
`;

/* ── Keyframes ── */
const shimmer = keyframes`
  0% { background-position: -400% 0; }
  100% { background-position: 400% 0; }
`;

/* ── Layout (matches Projects) ── */
const BlogSection = styled.section<{ $isDark: boolean }>`
  padding: 120px 0 80px;
  background: ${p => p.$isDark ? '#000000' : '#ffffff'};
  transition: background 0.3s ease;

  @media (max-width: 768px) {
    padding: 80px 0 60px;
  }
`;

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 40px;

  @media (max-width: 768px) {
    padding: 0 20px;
  }
`;

/* ── Header (same as Projects) ── */
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

const SectionTitle = styled.h2<{ $isDark: boolean }>`
  font-size: 40px;
  font-weight: 700;
  color: ${p => p.$isDark ? '#f5f5f7' : '#1d1d1f'};
  margin: 0 0 48px 0;
  letter-spacing: -1px;
  line-height: 1.15;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 30px;
    margin-bottom: 36px;
  }
`;

/* ── Grid (3 columns, same as Projects) ── */
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

/* ── Card (same hover pattern as Projects) ── */
const CardWrapper = styled.article`
  cursor: pointer;
`;

const ImageContainer = styled.div`
  position: relative;
  border-radius: 14px;
  overflow: hidden;
  aspect-ratio: 4 / 3;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.4s ease, filter 0.4s ease;
  }

  ${CardWrapper}:hover & img {
    transform: scale(1.04);
    filter: blur(3px) brightness(0.65);
  }
`;

const ImageOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 20px;
  opacity: 0;
  transition: opacity 0.35s ease;

  ${CardWrapper}:hover & {
    opacity: 1;
  }
`;

const OverlayExcerpt = styled.p`
  font-size: 13px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CardMeta = styled.div`
  padding: 12px 2px 0;
`;

const PostTitle = styled.h3<{ $isDark: boolean }>`
  font-size: 15px;
  font-weight: 600;
  color: ${p => p.$isDark ? '#f5f5f7' : '#1d1d1f'};
  margin: 0;
  letter-spacing: -0.2px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const PostInfo = styled.span<{ $isDark: boolean }>`
  display: block;
  font-size: 12px;
  color: ${p => p.$isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)'};
  margin-top: 3px;
  font-weight: 400;
`;

/* ── Fade overlay to hint more posts ── */
const GridWrapper = styled.div`
  position: relative;
  overflow: hidden;
`;

const FadeOverlay = styled.div<{ $isDark: boolean }>`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 20%;
  background: linear-gradient(
    to bottom,
    ${p => p.$isDark ? 'rgba(0,0,0,0)' : 'rgba(255,255,255,0)'} 0%,
    ${p => p.$isDark ? 'rgba(0,0,0,1)' : 'rgba(255,255,255,1)'} 100%
  );
  pointer-events: none;
  z-index: 1;
`;

const MoreCount = styled.span<{ $isDark: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  padding: 0 7px;
  border-radius: 11px;
  font-size: 12px;
  font-weight: 600;
  background: ${p => p.$isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)'};
  color: ${p => p.$isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)'};
`;

/* ── View All (bottom, same as Projects) ── */
const ViewAllBottom = styled.div`
  text-align: center;
  margin-top: 32px;
  position: relative;
  z-index: 2;
`;

const ViewAllButton = styled.button<{ $isDark: boolean }>`
  background: none;
  border: 1px solid ${p => p.$isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)'};
  padding: 12px 32px;
  border-radius: 100px;
  font-size: 14px;
  font-weight: 500;
  color: ${p => p.$isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)'};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  font-family: inherit;

  svg { width: 16px; height: 16px; transition: transform 0.2s ease; }

  &:hover {
    color: ${p => p.$isDark ? '#f5f5f7' : '#1d1d1f'};
    border-color: ${p => p.$isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.25)'};
    svg { transform: translateX(3px); }
  }
`;

/* ── Skeleton ── */
const SkeletonBox = styled.div<{ $isDark: boolean }>`
  border-radius: 14px;
  aspect-ratio: 4 / 3;
  background: linear-gradient(
    90deg,
    ${p => p.$isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'} 25%,
    ${p => p.$isDark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.09)'} 50%,
    ${p => p.$isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'} 75%
  );
  background-size: 400% 100%;
  animation: ${shimmer} 1.4s ease infinite;
`;

const SkeletonLine = styled.div<{ $isDark: boolean; $width?: string }>`
  height: 14px;
  border-radius: 7px;
  width: ${p => p.$width ?? '100%'};
  background: linear-gradient(
    90deg,
    ${p => p.$isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'} 25%,
    ${p => p.$isDark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.09)'} 50%,
    ${p => p.$isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'} 75%
  );
  background-size: 400% 100%;
  animation: ${shimmer} 1.4s ease infinite;
`;

/* ── Component ── */
interface BlogPreviewProps {
  onPostClick: (blogId: string) => void;
  onViewAll: () => void;
}

const translations = {
  ko: { eyebrow: 'BLOG', title: '블로그', viewAll: '전체 보기' },
  en: { eyebrow: 'BLOG', title: 'Blog', viewAll: 'View All' },
};

export default function BlogPreview({ onPostClick, onViewAll }: BlogPreviewProps) {
  const { isDark } = useTheme();
  const { language } = useLanguage();
  const { posts: blogPosts, loading } = useBlogPosts();
  const t = translations[language];
  const recentPosts = blogPosts.slice(0, 9);
  const remaining = blogPosts.length - recentPosts.length;
  const hasMore = remaining > 0;

  const [sectionRef, inView, animKey] = useInView(0.15);

  /* ── clip 3rd row at 50% height ── */
  const gridRef = useRef<HTMLDivElement>(null);
  const [clipHeight, setClipHeight] = useState<number | undefined>();

  useEffect(() => {
    const measure = () => {
      const grid = gridRef.current;
      if (!grid || loading || recentPosts.length <= 6) {
        setClipHeight(undefined);
        return;
      }
      const cards = Array.from(grid.children);
      if (cards.length <= 6) { setClipHeight(undefined); return; }
      const card7 = cards[6] as HTMLElement;
      const gridTop = grid.getBoundingClientRect().top;
      const cardRect = card7.getBoundingClientRect();
      setClipHeight(cardRect.top - gridTop + cardRect.height * 0.5);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [loading, recentPosts.length]);

  const renderAnimatedTitle = (text: string) =>
    inView
      ? text.split('').map((c, i) => c === ' ' ? <span key={i}>&nbsp;</span> : <CharSpan key={i} $delay={i * 40}>{c}</CharSpan>)
      : text;

  return (
    <BlogSection id="blog" $isDark={isDark} ref={sectionRef as React.RefObject<HTMLElement>}>
      <Container>
        <SectionEyebrow id="dot-blog" $isDark={isDark} data-dot-anchor>{t.eyebrow}</SectionEyebrow>
        <SectionTitle key={`blog-${animKey}`} as="div" $isDark={isDark}>{renderAnimatedTitle(t.title)}</SectionTitle>

        <GridWrapper style={clipHeight ? { maxHeight: clipHeight } : undefined}>
          <Grid ref={gridRef}>
            {loading
              ? Array.from({ length: 9 }).map((_, i) => (
                  <div key={i}>
                    <SkeletonBox $isDark={isDark} />
                    <CardMeta>
                      <SkeletonLine $isDark={isDark} $width="60%" style={{ height: 14, marginBottom: 6 }} />
                      <SkeletonLine $isDark={isDark} $width="40%" style={{ height: 11 }} />
                    </CardMeta>
                  </div>
                ))
              : recentPosts.map((post) => (
                  <CardWrapper key={post.id} onClick={() => onPostClick(post.id)}>
                    <ImageContainer>
                      <ImageWithFallback src={post.thumbnail} alt={post.title[language]} />
                      <ImageOverlay>
                        <OverlayExcerpt>{post.excerpt[language]}</OverlayExcerpt>
                      </ImageOverlay>
                    </ImageContainer>
                    <CardMeta>
                      <PostTitle $isDark={isDark}>{post.title[language]}</PostTitle>
                      <PostInfo $isDark={isDark}>
                        {post.category[language]} · {post.date}
                      </PostInfo>
                    </CardMeta>
                  </CardWrapper>
                ))
            }
          </Grid>
          {hasMore && <FadeOverlay $isDark={isDark} />}
        </GridWrapper>

        <ViewAllBottom>
          <ViewAllButton $isDark={isDark} onClick={onViewAll}>
            {t.viewAll}
            {hasMore && <MoreCount $isDark={isDark}>+{remaining}</MoreCount>}
            <ArrowRight />
          </ViewAllButton>
        </ViewAllBottom>
      </Container>
    </BlogSection>
  );
}
