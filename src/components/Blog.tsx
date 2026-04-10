import styled, { keyframes } from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useBlogPosts } from '../hooks/useBlogPosts';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Footer from './Footer';

const BlogContainer = styled.div<{ $isDark: boolean }>`
  min-height: 100vh;
  background: ${props => props.$isDark ? '#000000' : '#ffffff'};
  padding-top: 80px;
  transition: background 0.3s ease;
`;

const BackButton = styled.button<{ $isDark: boolean }>`
  position: fixed;
  top: 100px;
  left: 40px;
  background: ${props => props.$isDark ? '#1d1d1f' : '#f5f5f7'};
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  border: none;
  padding: 12px 24px;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  z-index: 100;

  &:hover {
    opacity: 0.8;
  }

  @media (max-width: 768px) {
    position: fixed;
    top: auto;
    bottom: 24px;
    left: 20px;
    padding: 10px 18px;
    font-size: 13px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  }
`;

const Hero = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 40px 80px;

  @media (max-width: 768px) {
    padding: 40px 20px 60px;
  }
`;

const Title = styled.h1<{ $isDark: boolean }>`
  font-size: 64px;
  font-weight: 600;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  margin: 0 0 24px 0;
  letter-spacing: -2px;
  transition: color 0.3s ease;

  @media (max-width: 768px) {
    font-size: 36px;
    letter-spacing: -1px;
  }
`;

const Subtitle = styled.p`
  font-size: 20px;
  color: #86868b;
  margin: 0;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 17px;
  }
`;

const PostsSection = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px 120px;

  @media (max-width: 768px) {
    padding: 0 20px 80px;
  }
`;

const PostsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 40px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 30px;
  }
`;

const PostCard = styled.article<{ $isDark: boolean }>`
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-8px);

    img {
      transform: scale(1.05);
    }
  }
`;

const PostThumbnail = styled.div`
  width: 100%;
  aspect-ratio: 16 / 10;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 20px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
`;

const PostMeta = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
`;

const Category = styled.span<{ $isDark: boolean }>`
  font-size: 12px;
  color: ${props => props.$isDark ? '#a1a1a6' : '#86868b'};
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 500;
`;

const Date = styled.span`
  font-size: 12px;
  color: #86868b;
  letter-spacing: 0.5px;
`;

const PostTitle = styled.h2<{ $isDark: boolean }>`
  font-size: 24px;
  font-weight: 600;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  margin: 0 0 12px 0;
  letter-spacing: -0.5px;
  line-height: 1.3;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  transition: color 0.3s ease;

  svg {
    flex-shrink: 0;
    margin-top: 4px;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  ${PostCard}:hover & svg {
    opacity: 1;
  }

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const PostExcerpt = styled.p`
  font-size: 15px;
  color: #86868b;
  line-height: 1.6;
  margin: 0 0 12px 0;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const ReadTime = styled.span`
  font-size: 13px;
  color: #86868b;
  font-weight: 500;
`;

// ── Skeleton ─────────────────────────────────────
const shimmer = keyframes`
  0%   { background-position: -600px 0; }
  100% { background-position:  600px 0; }
`;

const skeletonBg = (isDark: boolean) => `
  background: linear-gradient(
    90deg,
    ${isDark ? '#1d1d1f' : '#e8e8ed'} 25%,
    ${isDark ? '#2a2a2d' : '#f0f0f5'} 50%,
    ${isDark ? '#1d1d1f' : '#e8e8ed'} 75%
  );
  background-size: 600px 100%;
  animation: ${shimmer} 1.4s infinite linear;
`;

const SkeletonCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SkeletonThumb = styled.div<{ $isDark: boolean }>`
  width: 100%;
  aspect-ratio: 16 / 10;
  border-radius: 16px;
  ${p => skeletonBg(p.$isDark)}
`;

const SkeletonLine = styled.div<{ $isDark: boolean; $w?: string }>`
  height: 14px;
  border-radius: 6px;
  width: ${p => p.$w ?? '100%'};
  ${p => skeletonBg(p.$isDark)}
`;
// ─────────────────────────────────────────────────

interface BlogProps {
  onPostClick: (blogId: string) => void;
  onBack: () => void;
}

const translations = {
  ko: {
    back: '뒤로가기',
    title: '블로그',
    subtitle: '디자인과 개발에 대한 생각을 공유합니다.'
  },
  en: {
    back: 'Back',
    title: 'Blog',
    subtitle: 'Sharing thoughts on design and development.'
  }
};

export default function Blog({ onPostClick, onBack }: BlogProps) {
  const { isDark } = useTheme();
  const { language } = useLanguage();
  const { posts: blogPosts, loading } = useBlogPosts();
  const t = translations[language];

  return (
    <BlogContainer $isDark={isDark}>
      <BackButton $isDark={isDark} onClick={onBack}>
        <ArrowLeft size={16} />
        {t.back}
      </BackButton>

      <Hero>
        <Title $isDark={isDark}>{t.title}</Title>
        <Subtitle>{t.subtitle}</Subtitle>
      </Hero>

      <PostsSection>
        <PostsGrid>
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i}>
                <SkeletonThumb $isDark={isDark} />
                <SkeletonLine $isDark={isDark} $w="40%" />
                <SkeletonLine $isDark={isDark} $w="80%" style={{ height: 20 }} />
                <SkeletonLine $isDark={isDark} $w="95%" />
                <SkeletonLine $isDark={isDark} $w="30%" />
              </SkeletonCard>
            ))
          ) : blogPosts.map((post) => (
            <PostCard 
              key={post.id} 
              $isDark={isDark}
              onClick={() => onPostClick(post.id)}
            >
              <PostThumbnail>
                <ImageWithFallback 
                  src={post.thumbnail} 
                  alt={post.title[language]} 
                />
              </PostThumbnail>
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
            </PostCard>
          ))}
        </PostsGrid>
      </PostsSection>

      <Footer language={language} isDark={isDark} />
    </BlogContainer>
  );
}
