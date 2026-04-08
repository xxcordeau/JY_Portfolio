import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { blogPosts } from '../data/blogData';
import { ArrowLeft, Copy, Check } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import Footer from './Footer';
import { useState } from 'react';
import { TreeManagementPost, FilterSystemPost, TableComponentPost, RolePermissionPost, ViewStatePost, DashboardWidgetPost, CommonUtilsPost, IconSystemPost, ReactPageRefactoringPost, DynamicStaticImportPost, CssPrintLayerPost, HiddenDivPost, ApiMismatchMemoPost } from './blog/posts';

const DetailContainer = styled.div<{ $isDark: boolean }>`
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
  border-radius: 24px;
  overflow: hidden;
  margin-bottom: 60px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 768px) {
    border-radius: 16px;
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

const ReadTime = styled.span`
  font-size: 12px;
  color: #86868b;
  letter-spacing: 0.5px;
`;

const Title = styled.h1<{ $isDark: boolean }>`
  font-size: 48px;
  font-weight: 600;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  margin: 0 0 40px 0;
  letter-spacing: -1.5px;
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
  gap: 8px;
  margin-bottom: 60px;
  flex-wrap: wrap;
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
  padding: 24px;
  margin: 0;
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

function CodeBlockComponent({ code, language: codeLang, isDark, onCopy, copied }: {
  code: string;
  language: string;
  isDark: boolean;
  onCopy: () => void;
  copied: boolean;
}) {
  return (
    <CodeBlock $isDark={isDark}>
      <CodeHeader $isDark={isDark}>
        <CodeLanguage>{codeLang}</CodeLanguage>
        <CopyButton $isDark={isDark} onClick={onCopy}>
          {copied ? <Check /> : <Copy />}
          {copied ? '복사됨!' : '복사'}
        </CopyButton>
      </CodeHeader>
      <CodeContent $isDark={isDark}>
        <code>{code}</code>
      </CodeContent>
    </CodeBlock>
  );
}

export default function BlogDetail({ blogId, onBack }: BlogDetailProps) {
  const { isDark } = useTheme();
  const { language } = useLanguage();
  const post = blogPosts.find(p => p.id === blogId);
  const t = translations[language];
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!post) {
    return <div>Post not found</div>;
  }

  const handleCopy = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Render the appropriate post component
  const renderPostContent = () => {
    switch(post.component) {
      case 'TreeManagementPost':
        return <TreeManagementPost language={language} />;
      case 'FilterSystemPost':
        return <FilterSystemPost language={language} />;
      case 'TableComponentPost':
        return <TableComponentPost language={language} />;
      case 'RolePermissionPost':
        return <RolePermissionPost language={language} />;
      case 'ViewStatePost':
        return <ViewStatePost language={language} />;
      case 'DashboardWidgetPost':
        return <DashboardWidgetPost language={language} />;
      case 'CommonUtilsPost':
        return <CommonUtilsPost language={language} />;
      case 'IconSystemPost':
        return <IconSystemPost language={language} />;
      case 'ReactPageRefactoringPost':
        return <ReactPageRefactoringPost language={language} />;
      case 'DynamicStaticImportPost':
        return <DynamicStaticImportPost language={language} />;
      case 'CssPrintLayerPost':
        return <CssPrintLayerPost language={language} />;
      case 'HiddenDivPost':
        return <HiddenDivPost language={language} />;
      case 'ApiMismatchMemoPost':
        return <ApiMismatchMemoPost language={language} />;
      default:
        return <div>Content not found</div>;
    }
  };

  // Legacy parse content function (keeping for backwards compatibility)
  const parseContent = (text: string) => {
    const lines = text.split('\n');
    const elements: JSX.Element[] = [];
    let inCodeBlock = false;
    let codeContent = '';
    let codeLanguage = '';
    let currentText: string[] = [];
    let codeBlockIndex = 0;

    const flushText = () => {
      if (currentText.length > 0) {
        const textContent = currentText.join('\n');
        textContent.split('\n').forEach((line, index) => {
          if (line.startsWith('# ')) {
            elements.push(<h1 key={`h1-${elements.length}-${index}`}>{line.slice(2)}</h1>);
          } else if (line.startsWith('## ')) {
            elements.push(<h2 key={`h2-${elements.length}-${index}`}>{line.slice(3)}</h2>);
          } else if (line.startsWith('### ')) {
            elements.push(<h3 key={`h3-${elements.length}-${index}`}>{line.slice(4)}</h3>);
          } else if (line.trim() === '') {
            elements.push(<br key={`br-${elements.length}-${index}`} />);
          } else if (line.startsWith('- ')) {
            // List items - we'll handle them simply for now
            elements.push(<p key={`p-${elements.length}-${index}`}>{line}</p>);
          } else {
            // Check for inline code
            const parts = line.split('`');
            if (parts.length > 1) {
              const formatted = parts.map((part, i) => 
                i % 2 === 0 ? part : <InlineCode key={`code-${i}`} $isDark={isDark}>{part}</InlineCode>
              );
              elements.push(<p key={`p-${elements.length}-${index}`}>{formatted}</p>);
            } else {
              elements.push(<p key={`p-${elements.length}-${index}`}>{line}</p>);
            }
          }
        });
        currentText = [];
      }
    };

    lines.forEach((line, index) => {
      if (line.startsWith('```')) {
        if (!inCodeBlock) {
          // Start of code block
          flushText();
          inCodeBlock = true;
          codeLanguage = line.slice(3) || 'plaintext';
          codeContent = '';
        } else {
          // End of code block
          elements.push(
            <CodeBlockComponent
              key={`code-${codeBlockIndex}`}
              code={codeContent}
              language={codeLanguage}
              isDark={isDark}
              onCopy={() => handleCopy(codeContent, codeBlockIndex)}
              copied={copiedIndex === codeBlockIndex}
            />
          );
          codeBlockIndex++;
          inCodeBlock = false;
          codeContent = '';
          codeLanguage = '';
        }
      } else if (inCodeBlock) {
        codeContent += (codeContent ? '\n' : '') + line;
      } else {
        currentText.push(line);
      }
    });

    flushText();

    return elements;
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
          {post.tags.map((tag, index) => (
            <Tag key={index} $isDark={isDark}>{tag}</Tag>
          ))}
        </Tags>

        <Content $isDark={isDark}>
          {renderPostContent()}
        </Content>
      </Article>

      <Footer language={language} isDark={isDark} />
    </DetailContainer>
  );
}
