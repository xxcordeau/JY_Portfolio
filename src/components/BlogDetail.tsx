import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useBlogPosts, useBlogPost } from '../hooks/useBlogPosts';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { ArrowLeft } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import Footer from './Footer';
import { useState } from 'react';

import { FILLED_ICONS, DARK_INVERT_ICONS, resolveIcon } from '../lib/techIcons';
import ReactMarkdown from 'react-markdown';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark, atomOneLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import typescript from 'react-syntax-highlighter/dist/esm/languages/hljs/typescript';
import javascript from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import tsx from 'react-syntax-highlighter/dist/esm/languages/hljs/typescript';
import jsx from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import css from 'react-syntax-highlighter/dist/esm/languages/hljs/css';
import scss from 'react-syntax-highlighter/dist/esm/languages/hljs/scss';
import json from 'react-syntax-highlighter/dist/esm/languages/hljs/json';
import bash from 'react-syntax-highlighter/dist/esm/languages/hljs/bash';
import shell from 'react-syntax-highlighter/dist/esm/languages/hljs/shell';
import sql from 'react-syntax-highlighter/dist/esm/languages/hljs/sql';
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python';
import markdown from 'react-syntax-highlighter/dist/esm/languages/hljs/markdown';
import xml from 'react-syntax-highlighter/dist/esm/languages/hljs/xml';

SyntaxHighlighter.registerLanguage('typescript', typescript);
SyntaxHighlighter.registerLanguage('ts', typescript);
SyntaxHighlighter.registerLanguage('javascript', javascript);
SyntaxHighlighter.registerLanguage('js', javascript);
SyntaxHighlighter.registerLanguage('tsx', tsx);
SyntaxHighlighter.registerLanguage('jsx', jsx);
SyntaxHighlighter.registerLanguage('css', css);
SyntaxHighlighter.registerLanguage('scss', scss);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('bash', bash);
SyntaxHighlighter.registerLanguage('sh', bash);
SyntaxHighlighter.registerLanguage('shell', shell);
SyntaxHighlighter.registerLanguage('sql', sql);
SyntaxHighlighter.registerLanguage('python', python);
SyntaxHighlighter.registerLanguage('py', python);
SyntaxHighlighter.registerLanguage('markdown', markdown);
SyntaxHighlighter.registerLanguage('md', markdown);
SyntaxHighlighter.registerLanguage('html', xml);
SyntaxHighlighter.registerLanguage('xml', xml);

const DetailContainer = styled.div<{ $isDark: boolean }>`
  min-height: 100vh;
  background: ${props => props.$isDark ? '#000000' : '#ffffff'};
  padding-top: 80px;
  transition: background 0.3s ease;
`;

const BackButton = styled.button<{ $isDark: boolean }>`
  position: fixed;
  top: 80px;
  left: 40px;
  background: ${props => props.$isDark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)'};
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  border: 1px solid ${props => props.$isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)'};
  padding: 10px 22px;
  border-radius: 100px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
  z-index: 100;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  font-family: inherit;

  &:hover {
    border-color: ${props => props.$isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.25)'};
  }

  @media (max-width: 768px) {
    position: fixed;
    top: auto;
    bottom: 24px;
    left: 20px;
    padding: 10px 18px;
    font-size: 13px;
  }
`;

const Article = styled.article`
  max-width: 800px;
  margin: 0 auto;
  padding: 60px 40px 120px;

  @media (max-width: 768px) {
    padding: 40px 20px 80px;
  }
`;

const HeaderImage = styled.div`
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 14px;
  overflow: hidden;
  margin-bottom: 60px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 768px) {
    border-radius: 14px;
    margin-bottom: 40px;
  }
`;

const Meta = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const Category = styled.span<{ $isDark: boolean }>`
  font-size: 13px;
  color: ${props => props.$isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)'};
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-weight: 600;
`;

const Date = styled.span`
  font-size: 12px;
  color: #86868b;
  letter-spacing: 0.5px;
`;

const ReadTime = styled.span`
  font-size: 12px;
  color: #86868b;
  letter-spacing: 0.5px;
`;

const Title = styled.h1<{ $isDark: boolean }>`
  font-size: 40px;
  font-weight: 700;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  margin: 0 0 40px 0;
  letter-spacing: -1px;
  line-height: 1.2;
  transition: color 0.3s ease;

  @media (max-width: 768px) {
    font-size: 32px;
    letter-spacing: -1px;
    margin-bottom: 30px;
  }
`;

const Tags = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 60px;
  flex-wrap: wrap;
  align-items: center;
`;

const Tag = styled.span<{ $isDark: boolean }>`
  background: ${props => props.$isDark ? '#1d1d1f' : '#f5f5f7'};
  color: ${props => props.$isDark ? '#a1a1a6' : '#1d1d1f'};
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.3s ease;
`;

const TagIconWrapper = styled.div<{ $isDark: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: default;
  background: ${p => p.$isDark ? 'rgba(255,255,255,0.06)' : '#ffffff'};
  box-shadow: ${p => p.$isDark
    ? '0 2px 8px rgba(0,0,0,0.3)'
    : '0 2px 8px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.03)'};
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.15);
    z-index: 10;
  }

  &:hover > span {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }

  img.icon-filled {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 9px;
  }

  img.icon-plain {
    width: 24px;
    height: 24px;
    object-fit: contain;
  }

  img.icon-dark-invert {
    width: 24px;
    height: 24px;
    object-fit: contain;
    filter: ${p => p.$isDark ? 'invert(1) brightness(2)' : 'none'};
    transition: filter 0.3s ease;
  }
`;

const TagIconTooltip = styled.span<{ $isDark: boolean }>`
  position: absolute;
  bottom: -26px;
  left: 50%;
  transform: translateX(-50%) translateY(4px);
  font-size: 11px;
  font-weight: 500;
  color: ${p => p.$isDark ? '#f5f5f7' : '#ffffff'};
  background: ${p => p.$isDark ? '#333' : '#1d1d1f'};
  padding: 4px 10px;
  border-radius: 6px;
  white-space: nowrap;
  opacity: 0;
  transition: all 0.15s ease;
  pointer-events: none;
`;

const Content = styled.div<{ $isDark: boolean }>`
  font-size: 17px;
  line-height: 1.8;
  color: ${props => props.$isDark ? '#a1a1a6' : '#1d1d1f'};
  transition: color 0.3s ease;

  h1, h2, h3, h4, h5, h6 {
    color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
    font-weight: 600;
    letter-spacing: -0.5px;
    margin: 48px 0 24px 0;
    line-height: 1.3;

    &:first-child {
      margin-top: 0;
    }
  }

  h1 {
    font-size: 40px;
    letter-spacing: -1.2px;
  }

  h2 {
    font-size: 32px;
    letter-spacing: -1px;
  }

  h3 {
    font-size: 24px;
    letter-spacing: -0.7px;
  }

  p {
    margin: 0 0 24px 0;
  }

  ul, ol {
    margin: 24px 0;
    padding-left: 24px;

    li {
      margin-bottom: 12px;
    }
  }

  blockquote {
    border-left: 3px solid ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
    padding-left: 24px;
    margin: 32px 0;
    color: #86868b;
    font-style: italic;
  }

  pre {
    background: ${props => props.$isDark ? '#1a1a1a' : '#f5f5f7'};
    border: 1px solid ${props => props.$isDark ? '#2d2d2d' : '#e5e5e7'};
    border-radius: 12px;
    padding: 24px;
    margin: 24px 0;
    overflow-x: auto;
    font-family: 'SF Mono', Monaco, Consolas, 'Courier New', monospace;
    font-size: 14px;
    line-height: 1.7;

    /* Custom scrollbar */
    &::-webkit-scrollbar {
      height: 8px;
    }

    &::-webkit-scrollbar-track {
      background: ${props => props.$isDark ? '#0a0a0a' : '#e5e5e7'};
      border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background: ${props => props.$isDark ? '#3d3d3d' : '#c5c5c7'};
      border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: ${props => props.$isDark ? '#4d4d4d' : '#b5b5b7'};
    }

    code {
      background: transparent;
      padding: 0;
      border: none;
      border-radius: 0;
      font-size: inherit;
      color: ${props => props.$isDark ? '#d4d4d8' : '#1d1d1f'};
    }
  }

  code {
    background: ${props => props.$isDark ? '#1a1a1a' : '#f0f0f2'};
    padding: 3px 8px;
    border-radius: 6px;
    font-family: 'SF Mono', Monaco, Consolas, 'Courier New', monospace;
    font-size: 0.9em;
    color: ${props => props.$isDark ? '#e879f9' : '#e879f9'};
    border: 1px solid ${props => props.$isDark ? '#2d2d2d' : '#e5e5e7'};
  }

  strong {
    font-weight: 600;
    color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  }

  @media (max-width: 768px) {
    font-size: 16px;

    h1 {
      font-size: 32px;
    }

    h2 {
      font-size: 26px;
    }

    h3 {
      font-size: 20px;
    }

    pre {
      padding: 16px;
      margin: 20px -20px;
      border-radius: 0;
      border-left: none;
      border-right: none;
      font-size: 13px;
    }

    code {
      font-size: 0.85em;
    }
  }
`;

const CodeBlock = styled.div<{ $isDark: boolean }>`
  position: relative;
  background: ${props => props.$isDark ? '#0a0a0a' : '#f5f5f7'};
  border: 1px solid ${props => props.$isDark ? '#1d1d1f' : '#e5e5e7'};
  border-radius: 12px;
  overflow: hidden;
  margin: 32px 0;

  @media (max-width: 768px) {
    margin: 24px -20px;
    border-radius: 0;
    border-left: none;
    border-right: none;
  }
`;

const CodeHeader = styled.div<{ $isDark: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background: ${props => props.$isDark ? '#1d1d1f' : '#ececf0'};
  border-bottom: 1px solid ${props => props.$isDark ? '#2d2d2d' : '#d2d2d7'};

  @media (max-width: 768px) {
    padding: 10px 20px;
  }
`;

const CodeLanguage = styled.span`
  font-size: 12px;
  color: #86868b;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
  font-family: 'SF Mono', Monaco, Consolas, monospace;
`;

const CopyButton = styled.button<{ $isDark: boolean }>`
  background: transparent;
  border: 1px solid ${props => props.$isDark ? '#3d3d3d' : '#c5c5c7'};
  color: ${props => props.$isDark ? '#a1a1a6' : '#1d1d1f'};
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
  font-weight: 500;

  &:hover {
    background: ${props => props.$isDark ? '#2d2d2d' : '#e5e5e7'};
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const CodeContent = styled.pre<{ $isDark: boolean }>`
  /* Content styled-component의 pre 규칙이 캐스케이드되지 않도록 높은 specificity로 리셋 */
  && {
    border: none;
    background: transparent;
    border-radius: 0;
    margin: 0;
  }
  padding: 24px;
  overflow-x: auto;
  font-family: 'SF Mono', Monaco, Consolas, monospace;
  font-size: 14px;
  line-height: 1.7;
  color: ${props => props.$isDark ? '#d4d4d8' : '#1d1d1f'};

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.$isDark ? '#0a0a0a' : '#e5e5e7'};
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.$isDark ? '#3d3d3d' : '#c5c5c7'};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${props => props.$isDark ? '#4d4d4d' : '#b5b5b7'};
  }

  code {
    background: transparent;
    padding: 0;
    font-size: inherit;
    line-height: inherit;
    color: inherit;
  }

  @media (max-width: 768px) {
    padding: 16px 20px;
    font-size: 13px;
  }
`;

const InlineCode = styled.code<{ $isDark: boolean }>`
  background: ${props => props.$isDark ? '#1d1d1f' : '#f5f5f7'};
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  padding: 3px 8px;
  border-radius: 6px;
  font-family: 'SF Mono', Monaco, Consolas, monospace;
  font-size: 0.9em;
  border: 1px solid ${props => props.$isDark ? '#2d2d2d' : '#e5e5e7'};
`;

interface BlogDetailProps {
  blogId: string;
  onBack: () => void;
}

const translations = {
  ko: {
    back: '목록으로',
    copy: '복사',
    copied: '복사됨!'
  },
  en: {
    back: 'Back to list',
    copy: 'Copy',
    copied: 'Copied!'
  }
};

// 언어 명시가 없을 때 코드 내용으로 언어 추측
function detectLanguage(code: string, hint: string): string {
  if (hint) return hint;
  // JSX/TSX: import/export + JSX 태그
  if (/import\s+.+\s+from\s+['"]|export\s+(default|const|function)|<[A-Z][a-zA-Z]*\s|className=/.test(code)) return 'tsx';
  // JS/TS: 주요 키워드
  if (/const\s+|let\s+|var\s+|function\s+|=>\s*\{|async\s+|await\s+/.test(code)) return 'typescript';
  // CSS
  if (/[.#][a-zA-Z-]+\s*\{|:\s*[a-zA-Z]+;|@media|@layer/.test(code)) return 'css';
  // SQL
  if (/SELECT\s+|INSERT\s+|CREATE\s+TABLE|ALTER\s+TABLE/i.test(code)) return 'sql';
  // Shell/파일구조 (파일명 패턴만 있고 JS 키워드 없음)
  return 'text';
}

function MarkdownCodeBlock({ children, className, isDark, onCopy, copyIndex, copiedIndex }: {
  children: string;
  className?: string;
  isDark: boolean;
  onCopy: (code: string, idx: number) => void;
  copyIndex: number;
  copiedIndex: number | null;
}) {
  const rawLang = className?.replace('language-', '') ?? '';
  const lang = detectLanguage(children, rawLang);
  const isCopied = copiedIndex === copyIndex;
  return (
    <CodeBlock $isDark={isDark}>
      <CodeHeader $isDark={isDark}>
        <CodeLanguage>{rawLang || lang || 'code'}</CodeLanguage>
        <CopyButton $isDark={isDark} onClick={() => onCopy(children, copyIndex)}>
          {isCopied ? '복사됨!' : '복사'}
        </CopyButton>
      </CodeHeader>
      <SyntaxHighlighter
        language={lang}
        style={isDark ? atomOneDark : atomOneLight}
        customStyle={{
          margin: 0,
          padding: '24px',
          background: 'transparent',
          fontSize: '14px',
          lineHeight: '1.7',
          fontFamily: "'SF Mono', Monaco, Consolas, monospace",
          border: 'none',
          borderRadius: 0,
          overflowX: 'auto',
        }}
        codeTagProps={{ style: { fontFamily: 'inherit' } }}
      >
        {children}
      </SyntaxHighlighter>
    </CodeBlock>
  );
}

export default function BlogDetail({ blogId, onBack }: BlogDetailProps) {
  const { isDark } = useTheme();
  const { language } = useLanguage();
  const { posts: blogPosts } = useBlogPosts();
  const post = blogPosts.find(p => p.id === blogId);
  const { post: dbPost } = useBlogPost(blogId); // DB에서 full content 가져오기
  const t = translations[language];
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useDocumentMeta({
    title: post?.title[language],
    description: post?.excerpt[language],
    ogImage: post?.thumbnail,
  });

  if (!post) {
    return <div>Post not found</div>;
  }

  const handleCopy = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // DB에 content가 있으면 react-markdown으로 렌더링, 없으면 React 컴포넌트 fallback
  let codeBlockCounter = 0;

  const renderPostContent = () => {
    const dbContent = language === 'ko' ? dbPost?.content_ko : dbPost?.content_en;
    if (dbContent && dbContent.trim().length > 0) {
      codeBlockCounter = 0;
      return (
        <ReactMarkdown
          components={{
            // pre를 그대로 통과시켜 code 컴포넌트가 직접 블록을 렌더링하게 함
            pre({ children }) {
              return <>{children}</>;
            },
            code({ className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              const codeStr = String(children).replace(/\n$/, '');
              // fenced code blocks: has language class or multiline
              if (match || codeStr.includes('\n')) {
                const idx = codeBlockCounter++;
                return (
                  <MarkdownCodeBlock
                    isDark={isDark}
                    className={className}
                    onCopy={handleCopy}
                    copyIndex={idx}
                    copiedIndex={copiedIndex}
                  >
                    {codeStr}
                  </MarkdownCodeBlock>
                );
              }
              // inline code
              return <InlineCode $isDark={isDark}>{children}</InlineCode>;
            },
            img({ src, alt }) {
              if (!src) return null;
              return (
                <img
                  src={src}
                  alt={alt ?? ''}
                  style={{ maxWidth: '100%', borderRadius: 12, margin: '24px 0', display: 'block' }}
                />
              );
            },
          }}
        >
          {dbContent}
        </ReactMarkdown>
      );
    }

    // No markdown content in DB → show empty state
    return (
      <div style={{ padding: '40px 0', color: isDark ? '#86868b' : '#86868b', textAlign: 'center' }}>
        {language === 'ko' ? '아직 본문이 작성되지 않았습니다.' : 'No content yet.'}
      </div>
    );
  };

  return (
    <DetailContainer $isDark={isDark}>
      <BackButton $isDark={isDark} onClick={onBack}>
        <ArrowLeft size={16} />
        {t.back}
      </BackButton>

      <Article>
        <HeaderImage>
          <ImageWithFallback src={post.thumbnail} alt={post.title[language]} />
        </HeaderImage>

        <Meta>
          <Category $isDark={isDark}>{post.category[language]}</Category>
          <Date>{post.date}</Date>
          <ReadTime>{post.readTime[language]}</ReadTime>
        </Meta>

        <Title $isDark={isDark}>{post.title[language]}</Title>

        <Tags>
          {post.tags.map((tag, index) =>
            resolveIcon(tag) ? (
              <TagIconWrapper key={index} $isDark={isDark}>
                <img src={resolveIcon(tag)} alt={tag} loading="lazy" className={FILLED_ICONS.has(tag) ? 'icon-filled' : DARK_INVERT_ICONS.has(tag) ? 'icon-dark-invert' : 'icon-plain'} />
                <TagIconTooltip $isDark={isDark}>{tag}</TagIconTooltip>
              </TagIconWrapper>
            ) : (
              <Tag key={index} $isDark={isDark}>{tag}</Tag>
            )
          )}
        </Tags>

        <Content $isDark={isDark}>
          {renderPostContent()}
        </Content>
      </Article>

      <Footer language={language} isDark={isDark} />
    </DetailContainer>
  );
}
