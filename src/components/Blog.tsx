import styled, { keyframes } from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useBlogPosts } from '../hooks/useBlogPosts';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ArrowLeft } from 'lucide-react';
import Footer from './Footer';

/* ── Animations ──────────────────────────────────── */

const shimmer = keyframes`
  0%   { background-position: -400% 0; }
  100% { background-position:  400% 0; }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

/* ── Layout ──────────────────────────────────────── */

const Page = styled.div<{ $isDark: boolean }>`
  min-height: 100vh;
  background: ${p => (p.$isDark ? '#000000' : '#ffffff')};
  display: flex;
  flex-direction: column;
  transition: background 0.3s ease;
`;

const Container = styled.div`
  max-width: 1100px;
  width: 100%;
  margin: 0 auto;
  padding: 0 40px;

  @media (max-width: 768px) {
    padding: 0 20px;
  }
`;

/* ── Back Button ─────────────────────────────────── */

const BackButton = styled.button<{ $isDark: boolean }>`
  position: fixed;
  top: 36px;
  left: 36px;
  z-index: 100;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 22px;
  border: 1px solid ${p => (p.$isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)')};
  border-radius: 100px;
  background: ${p => (p.$isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.7)')};
  color: ${p => (p.$isDark ? '#f5f5f7' : '#1d1d1f')};
  font-size: 14px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transition: background 0.25s ease, border-color 0.25s ease;

  &:hover {
    background: ${p => (p.$isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)')};
  }

  @media (max-width: 768px) {
    top: auto;
    bottom: 24px;
    left: 20px;
    padding: 10px 18px;
    font-size: 13px;
  }
`;

/* ── Header ──────────────────────────────────────── */

const Header = styled.header`
  padding: 140px 0 0;

  @media (max-width: 768px) {
    padding: 110px 0 0;
  }
`;

const Eyebrow = styled.span<{ $isDark: boolean }>`
  display: block;
  font-size: 13px;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: ${p => (p.$isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)')};
  margin-bottom: 12px;
`;

const Title = styled.h1<{ $isDark: boolean }>`
  font-size: 40px;
  font-weight: 700;
  color: ${p => (p.$isDark ? '#f5f5f7' : '#1d1d1f')};
  margin: 0 0 8px;
  letter-spacing: -1px;
  line-height: 1.15;
  transition: color 0.3s ease;

  @media (max-width: 768px) {
    font-size: 30px;
  }
`;

const Subtitle = styled.p<{ $isDark: boolean }>`
  font-size: 16px;
  color: ${p => (p.$isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)')};
  margin: 0 0 48px;
  line-height: 1.5;
`;

/* ── Grid ────────────────────────────────────────── */

const GridSection = styled.section`
  flex: 1;
  padding-bottom: 120px;

  @media (max-width: 768px) {
    padding-bottom: 80px;
  }
`;

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

/* ── Card ────────────────────────────────────────── */

const CardWrapper = styled.article`
  cursor: pointer;
  animation: ${fadeIn} 0.45s ease both;
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
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CardMeta = styled.div`
  padding: 12px 2px 0;
`;

const PostTitle = styled.h3<{ $isDark: boolean }>`
  font-size: 15px;
  font-weight: 600;
  color: ${p => (p.$isDark ? '#f5f5f7' : '#1d1d1f')};
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
  color: ${p => (p.$isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)')};
  margin-top: 3px;
  font-weight: 400;
`;

/* ── Skeleton ────────────────────────────────────── */

const SkeletonBox = styled.div<{ $isDark: boolean }>`
  border-radius: 14px;
  aspect-ratio: 4 / 3;
  background: linear-gradient(
    90deg,
    ${p => (p.$isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)')} 25%,
    ${p => (p.$isDark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.09)')} 50%,
    ${p => (p.$isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)')} 75%
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
    ${p => (p.$isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)')} 25%,
    ${p => (p.$isDark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.09)')} 50%,
    ${p => (p.$isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)')} 75%
  );
  background-size: 400% 100%;
  animation: ${shimmer} 1.4s ease infinite;
`;

/* ── Translations ────────────────────────────────── */

const translations = {
  ko: {
    back: '뒤로가기',
    eyebrow: 'BLOG',
    title: '블로그',
    subtitle: '디자인과 개발에 대한 생각을 공유합니다.',
  },
  en: {
    back: 'Back',
    eyebrow: 'BLOG',
    title: 'Blog',
    subtitle: 'Sharing thoughts on design and development.',
  },
};

/* ── Component ───────────────────────────────────── */

interface BlogProps {
  onPostClick: (blogId: string) => void;
  onBack: () => void;
}

export default function Blog({ onPostClick, onBack }: BlogProps) {
  const { isDark } = useTheme();
  const { language } = useLanguage();
  const { posts: blogPosts, loading } = useBlogPosts();
  const t = translations[language];

  return (
    <Page $isDark={isDark}>
      <BackButton $isDark={isDark} onClick={onBack}>
        <ArrowLeft size={16} />
        {t.back}
      </BackButton>

      <Container>
        <Header>
          <Eyebrow $isDark={isDark}>{t.eyebrow}</Eyebrow>
          <Title $isDark={isDark}>{t.title}</Title>
          <Subtitle $isDark={isDark}>{t.subtitle}</Subtitle>
        </Header>

        <GridSection>
          <Grid>
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i}>
                    <SkeletonBox $isDark={isDark} />
                    <CardMeta>
                      <SkeletonLine $isDark={isDark} $width="60%" style={{ height: 14, marginBottom: 6 }} />
                      <SkeletonLine $isDark={isDark} $width="40%" style={{ height: 11 }} />
                    </CardMeta>
                  </div>
                ))
              : blogPosts.map((post, i) => (
                  <CardWrapper
                    key={post.id}
                    style={{ animationDelay: `${i * 60}ms` }}
                    onClick={() => onPostClick(post.id)}
                  >
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
                ))}
          </Grid>
        </GridSection>
      </Container>

      <Footer />
    </Page>
  );
}
