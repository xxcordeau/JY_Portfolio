import styled from 'styled-components';
import { blogPosts } from '../data/blogData';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ArrowRight } from 'lucide-react';

const BlogSection = styled.section<{ $isDark: boolean }>`
  min-height: 100vh;
  padding: 120px 40px;
  background: ${props => props.$isDark ? '#0a0a0a' : '#f5f5f7'};
  transition: background 0.3s ease;

  @media (max-width: 768px) {
    padding: 80px 20px;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 80px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;
    margin-bottom: 50px;
  }
`;

const SectionTitle = styled.h2<{ $isDark: boolean }>`
  font-size: 56px;
  font-weight: 600;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  margin: 0;
  letter-spacing: -1.5px;
  transition: color 0.3s ease;

  @media (max-width: 768px) {
    font-size: 36px;
    letter-spacing: -1px;
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

  &:hover {
    background: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
    color: ${props => props.$isDark ? '#1d1d1f' : '#f5f5f7'};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const PostsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
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

const PostTitle = styled.h3<{ $isDark: boolean }>`
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

interface BlogPreviewProps {
  language: 'ko' | 'en';
  isDark: boolean;
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

export default function BlogPreview({ language, isDark, onPostClick, onViewAll }: BlogPreviewProps) {
  const t = translations[language];
  // 최신 6개 포스트만 표시
  const recentPosts = blogPosts.slice(0, 6);

  return (
    <BlogSection id="blog" $isDark={isDark}>
      <Container>
        <Header>
          <SectionTitle $isDark={isDark}>{t.title}</SectionTitle>
          <ViewAllButton $isDark={isDark} onClick={onViewAll}>
            {t.viewAll}
            <ArrowRight />
          </ViewAllButton>
        </Header>
        <PostsGrid>
          {recentPosts.map((post) => (
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
      </Container>
    </BlogSection>
  );
}
