'use client';

import styled from 'styled-components';
import Link from 'next/link';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useBlogPosts, useBlogPost, type BlogPost } from '../hooks/useBlogPosts';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import Footer from './Footer';
import { useState } from 'react';

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

/* 읽기 화면: 1040px 페이지 안에 720px 읽기 칸 하나. 색과 크기는 전부 토큰 */

const Page = styled.main`
  max-width: var(--k-page-max);
  margin: 0 auto;
  padding: var(--k-space-10) var(--k-space-6) 96px;
  color: var(--k-text);
  animation: k-enter 0.25s var(--k-ease) both;

  @media (max-width: 768px) {
    padding: var(--k-space-6) var(--k-space-4) 72px;
  }
`;

const Column = styled.article`
  max-width: 720px;
  margin: 0 auto;
  min-width: 0;
`;

const BackLink = styled(Link)`
  display: inline-block;
  margin-bottom: var(--k-space-8);
  font-size: var(--k-text-sm);
  color: var(--k-text-weak);
  text-decoration: none;
  transition: color 0.15s var(--k-ease);

  &:hover { color: var(--k-text); }
`;

const Meta = styled.div`
  font-size: var(--k-text-sm);
  color: var(--k-text-weak);
  font-variant-numeric: tabular-nums;
`;

const Title = styled.h1`
  margin-top: var(--k-space-2);
  font-size: 28px;
  font-weight: 700;
  line-height: 1.4;
  letter-spacing: -0.03em;
  word-break: keep-all;
  text-wrap: balance;

  @media (max-width: 768px) {
    font-size: var(--k-text-2xl);
  }
`;

/* 썸네일은 읽기 칸 폭 그대로, 원본 비율로 보여 준다 (잘리지 않게 height: auto) */
const Cover = styled.figure`
  margin: var(--k-space-8) 0 0;
  border: 1px solid var(--k-line);
  border-radius: var(--k-radius-lg);
  background: var(--k-bg-sub);
  overflow: hidden;

  img {
    display: block;
    width: 100%;
    height: auto;
  }
`;

const Body = styled.div`
  margin-top: var(--k-space-10);
  font-size: var(--k-text-lg);
  line-height: 1.8;
  color: var(--k-text);
  word-break: keep-all;
  overflow-wrap: break-word;

  > :first-child { margin-top: 0; }

  p { margin: 0 0 var(--k-space-5); }

  h1, h2 {
    margin: var(--k-space-12) 0 var(--k-space-4);
    font-size: var(--k-text-xl);
    font-weight: 700;
    line-height: 1.45;
    letter-spacing: -0.02em;
  }

  h3 {
    margin: var(--k-space-8) 0 var(--k-space-3);
    font-size: var(--k-text-lg);
    font-weight: 700;
    line-height: 1.5;
  }

  h4, h5, h6 {
    margin: var(--k-space-6) 0 var(--k-space-2);
    font-size: 15px;
    font-weight: 700;
    line-height: 1.5;
  }

  ul, ol {
    margin: 0 0 var(--k-space-5);
    padding-left: var(--k-space-5);
  }

  ul { list-style: disc; }
  ol { list-style: decimal; }

  li { margin: 6px 0; }
  li::marker { color: var(--k-text-weak); }
  li > ul, li > ol { margin: 6px 0 0; }
  li > p { margin: 0; }

  blockquote {
    margin: var(--k-space-6) 0;
    padding: 2px 0 2px var(--k-space-4);
    border-left: 2px solid var(--k-line-strong);
    color: var(--k-text-sub);

    p:last-child { margin-bottom: 0; }
  }

  a {
    color: var(--k-text);
    text-decoration: underline;
    text-decoration-color: var(--k-line-strong);
    text-underline-offset: 3px;
    transition: text-decoration-color 0.15s var(--k-ease);
  }

  a:hover { text-decoration-color: var(--k-text); }

  strong { font-weight: 700; }

  hr {
    margin: var(--k-space-10) 0;
    border: none;
    border-top: 1px solid var(--k-line);
  }

  img {
    display: block;
    max-width: 100%;
    height: auto;
    margin: var(--k-space-6) 0;
    border: 1px solid var(--k-line);
    border-radius: var(--k-radius);
  }

  /* 표는 칸 폭을 넘으면 표 안에서만 가로로 넘긴다 */
  table {
    display: block;
    max-width: 100%;
    overflow-x: auto;
    margin: var(--k-space-6) 0;
    border-collapse: collapse;
    font-size: var(--k-text-md);
    line-height: 1.6;
  }

  th, td {
    padding: 10px var(--k-space-3);
    border-bottom: 1px solid var(--k-line);
    text-align: left;
    vertical-align: top;
  }

  th {
    font-weight: 600;
    color: var(--k-text-sub);
    border-bottom-color: var(--k-line-strong);
    white-space: nowrap;
  }
`;

const CodeBlock = styled.div`
  margin: var(--k-space-6) 0;
  border-radius: var(--k-radius);
  background: var(--k-bg-sub);
  overflow: hidden;
`;

const CodeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 36px;
  padding: 0 var(--k-space-2) 0 var(--k-space-4);
  border-bottom: 1px solid var(--k-line);
`;

const CodeLanguage = styled.span`
  font-family: var(--k-font-mono);
  font-size: var(--k-text-xs);
  color: var(--k-text-weak);
`;

const CopyButton = styled.button`
  height: 24px;
  padding: 0 var(--k-space-2);
  border: none;
  border-radius: var(--k-radius-sm);
  background: transparent;
  font: inherit;
  font-size: var(--k-text-xs);
  font-weight: 600;
  color: var(--k-text-sub);
  cursor: pointer;
  transition: background 0.15s var(--k-ease), color 0.15s var(--k-ease);

  &:hover {
    background: var(--k-bg-hover);
    color: var(--k-text);
  }
`;

const InlineCode = styled.code`
  padding: 2px 6px;
  border-radius: var(--k-radius-sm);
  background: var(--k-bg-hover);
  font-family: var(--k-font-mono);
  font-size: 0.875em;
  color: var(--k-text);
  word-break: break-word;
`;

/* 태그: 본문 끝에 옅은 작은 태그로만 */
const Tags = styled.ul`
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: var(--k-space-12);
  padding-top: var(--k-space-6);
  border-top: 1px solid var(--k-line);

  li {
    padding: 2px var(--k-space-2);
    border-radius: var(--k-radius-sm);
    background: var(--k-bg-hover);
    font-size: var(--k-text-xs);
    line-height: 1.6;
    color: var(--k-text-sub);
  }
`;

const Notice = styled.p`
  padding: var(--k-space-10) 0;
  font-size: var(--k-text-md);
  color: var(--k-text-weak);
`;

const SkeletonLine = styled.div<{ $w?: string; $h?: number }>`
  width: ${p => p.$w ?? '100%'};
  height: ${p => p.$h ?? 14}px;
  margin-top: var(--k-space-3);
  border-radius: var(--k-radius-sm);
  background: var(--k-bg-sub);
`;

interface BlogDetailProps {
  blogId: string;
  onBack: () => void;
}

const translations = {
  ko: {
    back: '← 블로그',
    copy: '복사',
    copied: '복사했어요',
    notFound: '글을 찾을 수 없어요.',
    empty: '아직 본문이 없어요.',
  },
  en: {
    back: '← Blog',
    copy: 'Copy',
    copied: 'Copied',
    notFound: 'Post not found.',
    empty: 'No content yet.',
  },
};

// 목록 쿼리가 늦거나 실패해도 단건 쿼리만으로 화면을 그릴 수 있게 같은 모양으로 맞춘다
function fromDbRow(row: NonNullable<ReturnType<typeof useBlogPost>['post']>): BlogPost {
  return {
    id: row.id,
    title: { ko: row.title_ko, en: row.title_en },
    excerpt: { ko: row.excerpt_ko, en: row.excerpt_en },
    category: { ko: row.category_ko, en: row.category_en },
    date: row.date,
    readTime: { ko: row.read_time_ko, en: row.read_time_en },
    tags: row.tags ?? [],
    thumbnail: row.thumbnail_url ?? '',
  };
}

// DB 문자열의 줄표는 가운뎃점으로 바꿔 보여 준다
const undash = (s: string) => s.replace(/\s*[—–]\s*/g, ' · ');

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

function MarkdownCodeBlock({ children, className, isDark, onCopy, copyIndex, copiedIndex, labels }: {
  children: string;
  className?: string;
  isDark: boolean;
  onCopy: (code: string, idx: number) => void;
  copyIndex: number;
  copiedIndex: number | null;
  labels: { copy: string; copied: string };
}) {
  const rawLang = className?.replace('language-', '') ?? '';
  const lang = detectLanguage(children, rawLang);
  const isCopied = copiedIndex === copyIndex;
  return (
    <CodeBlock>
      <CodeHeader>
        <CodeLanguage>{rawLang || lang || 'code'}</CodeLanguage>
        <CopyButton type="button" onClick={() => onCopy(children, copyIndex)}>
          {isCopied ? labels.copied : labels.copy}
        </CopyButton>
      </CodeHeader>
      {/* 구문 색만 테마별 팔레트를 쓰고, 배경과 글꼴은 토큰을 따른다 */}
      <SyntaxHighlighter
        language={lang}
        style={isDark ? atomOneDark : atomOneLight}
        customStyle={{
          margin: 0,
          padding: '16px',
          background: 'transparent',
          fontSize: '13px',
          lineHeight: '1.7',
          fontFamily: 'var(--k-font-mono)',
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

export default function BlogDetail({ blogId }: BlogDetailProps) {
  const { isDark } = useTheme();
  const { language } = useLanguage();
  const { posts: blogPosts, loading: listLoading } = useBlogPosts();
  const { post: dbPost, loading: postLoading } = useBlogPost(blogId); // DB에서 full content 가져오기
  const t = translations[language];
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [failedCover, setFailedCover] = useState<string | null>(null);

  // 목록에 있으면 그 값을, 아직 없으면 공개된 단건 값을 쓴다 (초안은 보여 주지 않는다)
  const listPost = blogPosts.find(p => p.id === blogId);
  const post = listPost ?? (dbPost && dbPost.status === 'published' ? fromDbRow(dbPost) : undefined);

  // 썸네일은 단건 행의 thumbnail_url을 먼저 본다
  const cover = dbPost?.thumbnail_url || post?.thumbnail || '';

  useDocumentMeta({
    title: post?.title[language],
    description: post?.excerpt[language],
    ogImage: post?.thumbnail,
  });

  if (!post) {
    const stillLoading = listLoading || postLoading;
    return (
      <>
        <Page>
          <Column>
            <BackLink href="/blog">{t.back}</BackLink>
            {stillLoading ? (
              <div aria-busy="true">
                <SkeletonLine $w="30%" $h={13} />
                <SkeletonLine $w="80%" $h={28} />
              </div>
            ) : (
              <Notice>{t.notFound}</Notice>
            )}
          </Column>
        </Page>
        <Footer />
      </>
    );
  }

  const handleCopy = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  let codeBlockCounter = 0;

  const renderPostContent = () => {
    // 페이지 상단에 제목이 이미 크게 나오므로, 본문 맨 앞의 H1(# 제목)은 빼고 보여준다.
    const dbContent = (language === 'ko' ? dbPost?.content_ko : dbPost?.content_en)
      ?.replace(/^\s*#\s+[^\n]*\n+/, '');
    if (dbContent && dbContent.trim().length > 0) {
      codeBlockCounter = 0;
      return (
        <ReactMarkdown
          components={{
            // pre를 그대로 통과시켜 code 컴포넌트가 직접 블록을 렌더링하게 함
            pre({ children }) {
              return <>{children}</>;
            },
            code({ className, children }) {
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
                    labels={t}
                  >
                    {codeStr}
                  </MarkdownCodeBlock>
                );
              }
              // inline code
              return <InlineCode>{children}</InlineCode>;
            },
            img({ src, alt }) {
              if (!src) return null;
              return <img src={src} alt={alt ?? ''} loading="lazy" />;
            },
          }}
        >
          {dbContent}
        </ReactMarkdown>
      );
    }

    // 단건을 아직 불러오는 중이면 빈 안내 대신 자리만 잡아 둔다
    if (postLoading) {
      return (
        <div aria-busy="true">
          <SkeletonLine />
          <SkeletonLine />
          <SkeletonLine $w="60%" />
        </div>
      );
    }

    return <Notice>{t.empty}</Notice>;
  };

  const date = post.date ? post.date.replace(/-/g, '.') : '';
  const meta = [post.category[language], date, post.readTime[language]].filter(Boolean).join(' · ');

  return (
    <>
      <Page>
        <Column>
          <BackLink href="/blog">{t.back}</BackLink>

          <Meta>{meta}</Meta>
          <Title>{undash(post.title[language])}</Title>

          {cover && failedCover !== cover && (
            <Cover>
              <img
                src={cover}
                alt=""
                width={1600}
                height={1200}
                onError={() => setFailedCover(cover)}
              />
            </Cover>
          )}

          <Body>{renderPostContent()}</Body>

          {post.tags.length > 0 && (
            <Tags>
              {post.tags.map(tag => (
                <li key={tag}>{tag}</li>
              ))}
            </Tags>
          )}
        </Column>
      </Page>

      <Footer />
    </>
  );
}
