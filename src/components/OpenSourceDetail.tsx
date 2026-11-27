'use client';

import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import Link from 'next/link';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useOpenSource } from '../hooks/useOpenSource';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { ArrowUpRight, Loader2 } from 'lucide-react';

// 데모는 무거워서 코드 분할로 따로 불러온다
const LibraryDocDemo = lazy(() => import('./interactive/LibraryDocDemo'));
const DataUIKitGuide = lazy(() => import('./interactive/DataUIKitGuide'));

/* 홈과 같은 PUUS 톤. 라이브러리는 포트폴리오에서 작은 부분이라
   통계 카드나 강조 배지 없이 제목, 설명, 설치 한 줄, 기능 목록만 담담하게 보여 준다. */

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

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

const BackLink = styled(Link)`
  display: inline-block;
  margin-bottom: var(--k-space-6);
  font-size: var(--k-text-sm);
  color: var(--k-text-weak);
  text-decoration: none;
  transition: color 0.15s var(--k-ease);

  &:hover { color: var(--k-text); }
`;

const Column = styled.div`
  max-width: 720px;
`;

const Title = styled.h1`
  font-size: var(--k-text-2xl);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.3;
`;

const Lead = styled.p`
  margin-top: var(--k-space-2);
  font-size: var(--k-text-lg);
  line-height: 1.7;
  color: var(--k-text-sub);
  word-break: keep-all;
  text-wrap: pretty;
`;

const Meta = styled.p`
  margin-top: var(--k-space-2);
  font-size: var(--k-text-sm);
  color: var(--k-text-weak);
  font-variant-numeric: tabular-nums;
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--k-space-2);
  margin-top: var(--k-space-5);
`;

const SecondaryButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 2px;
  height: var(--k-control-sm);
  padding: 0 var(--k-space-3);
  border: 1px solid var(--k-line-strong);
  border-radius: var(--k-radius);
  background: var(--k-bg);
  color: var(--k-text);
  font-size: var(--k-text-md);
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
  transition: background 0.15s var(--k-ease);

  svg { width: 14px; height: 14px; color: var(--k-text-weak); }

  &:hover { background: var(--k-bg-hover); }
`;

/* PUUS copy-line: 회색 칸 한 줄 + 오른쪽 작은 복사 버튼 */
const CopyLine = styled.div`
  display: flex;
  align-items: center;
  gap: var(--k-space-2);
  min-height: 52px;
  margin-top: var(--k-space-4);
  padding: 0 8px 0 16px;
  border-radius: 8px;
  background: var(--k-bg-sub);

  code {
    flex: 1;
    min-width: 0;
    overflow-x: auto;
    white-space: nowrap;
    font-family: var(--k-font-mono);
    font-size: var(--k-text-sm);
    color: var(--k-text);
  }

  .prompt {
    color: var(--k-text-weak);
    user-select: none;
  }
`;

const GhostButton = styled.button`
  flex: none;
  height: var(--k-control-sm);
  padding: 0 var(--k-space-3);
  border: none;
  border-radius: var(--k-radius);
  background: transparent;
  color: var(--k-text-sub);
  font: inherit;
  font-size: var(--k-text-sm);
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s var(--k-ease), color 0.15s var(--k-ease);

  &:hover {
    background: var(--k-bg-hover);
    color: var(--k-text);
  }
`;

const Section = styled.section`
  margin-top: var(--k-space-12);

  h2 {
    font-size: var(--k-text-lg);
    font-weight: 700;
    margin-bottom: var(--k-space-4);
  }
`;

const Body = styled.div`
  font-size: var(--k-text-lg);
  line-height: 1.8;
  color: var(--k-text);
  white-space: pre-line;
  word-break: keep-all;
  text-wrap: pretty;
`;

const Features = styled.ul`
  list-style: none;
  border-top: 1px solid var(--k-line);

  li {
    padding: var(--k-space-3) 0;
    border-bottom: 1px solid var(--k-line);
    font-size: 15px;
    line-height: 1.6;
    color: var(--k-text);
    word-break: keep-all;
  }
`;

// 태그는 기술 스택처럼 회색 라벨 + 가운뎃점으로 이어 쓴다
const TagRow = styled.dl`
  display: flex;
  gap: var(--k-space-4);
  margin-top: var(--k-space-6);
  font-size: var(--k-text-md);

  dt {
    flex: none;
    width: 48px;
    color: var(--k-text-weak);
  }

  dd {
    color: var(--k-text-sub);
    word-break: keep-all;
  }
`;

const DemoSection = styled.section`
  margin-top: 64px;
  padding-top: var(--k-space-10);
  border-top: 1px solid var(--k-line);
  /* 해시 링크(#awesome-ui-kit)로 내려올 때 sticky 헤더에 가리지 않게 */
  scroll-margin-top: 80px;

  > h2 {
    font-size: var(--k-text-xl);
    font-weight: 700;
    margin-bottom: var(--k-space-6);
  }
`;

// 데모 컴포넌트는 손대지 않고, 자체 좌우 여백만 이 페이지 폭에 맞춰 없앤다
const DemoFrame = styled.div`
  && > * {
    max-width: none;
    padding-left: 0;
    padding-right: 0;
  }
`;

const FallbackWrap = styled.div`
  min-height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--k-text-weak);

  svg {
    width: 24px;
    height: 24px;
    animation: ${spin} 0.9s linear infinite;
  }
`;

const DemoFallback = () => (
  <FallbackWrap>
    <Loader2 />
  </FallbackWrap>
);

const Notice = styled.p`
  font-size: var(--k-text-md);
  color: var(--k-text-weak);
`;

interface OpenSourceDetailProps {
  projectId: string;
  // 호출 쪽 호환용. 뒤로가기는 history 대신 목록으로 가는 링크로 그린다
  onBack: () => void;
}

const translations = {
  ko: {
    back: '← 오픈소스',
    overview: '소개',
    features: '기능',
    tags: '태그',
    docs: '문서와 예제',
    demo: '데모',
    copy: '복사',
    copied: '복사됨',
    components: (n: string) => `${n}개 컴포넌트`,
    stars: (n: string) => `GitHub 스타 ${n}`,
    downloads: (n: string) => `다운로드 ${n}`,
    notFound: '라이브러리를 찾을 수 없어요.',
  },
  en: {
    back: '← Open source',
    overview: 'Overview',
    features: 'Features',
    tags: 'Tags',
    docs: 'Docs and examples',
    demo: 'Demo',
    copy: 'Copy',
    copied: 'Copied',
    components: (n: string) => `${n} components`,
    stars: (n: string) => `${n} GitHub stars`,
    downloads: (n: string) => `${n} downloads`,
    notFound: 'Library not found.',
  },
};

// DB 문자열의 긴 대시는 가운뎃점으로 바꿔 보여 준다
const undash = (s: string) => s.replace(/\s*[—–]\s*/g, ' · ');

// '-', '0', 빈 값은 의미 없는 수치라 표시하지 않는다
const hasValue = (v?: string) => !!v && !['-', '0'].includes(v.trim());

// https://www.npmjs.com/package/jy-awesome-ui → jy-awesome-ui (스코프 패키지도 그대로)
const packageNameOf = (npmUrl?: string) => {
  if (!npmUrl) return null;
  const m = npmUrl.match(/\/package\/(.+?)\/?(?:[?#].*)?$/);
  return m ? decodeURIComponent(m[1]) : null;
};

export default function OpenSourceDetail({ projectId }: OpenSourceDetailProps) {
  const { isDark } = useTheme();
  const { language } = useLanguage();
  const { projects: openSourceProjects, loading } = useOpenSource();
  const t = translations[language];
  const project = openSourceProjects.find(p => p.id === projectId);

  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => clearTimeout(copyTimer.current), []);

  useDocumentMeta({
    title: project?.name,
    description: project?.description[language],
    ogImage: project?.image,
  });

  if (!project) {
    return (
      <Page>
        <BackLink href="/opensource">{t.back}</BackLink>
        {!loading && <Notice>{t.notFound}</Notice>}
      </Page>
    );
  }

  const pkg = packageNameOf(project.links.npm);
  const installCmd = pkg ? `npm install ${pkg}` : null;

  // AppShell이 방문자 화면에서 copy 이벤트를 막지만, clipboard API는 copy 이벤트를 거치지 않아 그대로 동작한다
  const handleCopy = async () => {
    if (!installCmd) return;
    try {
      await navigator.clipboard.writeText(installCmd);
      setCopied(true);
      clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 1500);
    } catch {
      // 보안 컨텍스트가 아니면 clipboard API가 없을 수 있다. 조용히 넘긴다
    }
  };

  const meta = [
    project.category[language],
    hasValue(project.stats.components) ? t.components(project.stats.components!) : '',
    hasValue(project.stats.stars) ? t.stars(project.stats.stars) : '',
    hasValue(project.stats.downloads) ? t.downloads(project.stats.downloads) : '',
    project.year,
  ].filter(Boolean).join(' · ');

  const demo = project.links.demo;
  const demoIsAnchor = !!demo && demo.startsWith('#');
  const features = project.features[language];
  const hasDocs = project.id === 'awesome-ui-kit' || project.id === 'data-ui-kit';

  return (
    <Page>
      <BackLink href="/opensource">{t.back}</BackLink>

      <Column>
        <Title>{project.name}</Title>
        <Lead>{undash(project.description[language])}</Lead>
        {meta && <Meta>{meta}</Meta>}

        <Actions>
          {project.links.github && (
            <SecondaryButton href={project.links.github} target="_blank" rel="noopener noreferrer">
              GitHub <ArrowUpRight />
            </SecondaryButton>
          )}
          {project.links.npm && (
            <SecondaryButton href={project.links.npm} target="_blank" rel="noopener noreferrer">
              npm <ArrowUpRight />
            </SecondaryButton>
          )}
          {demo && (
            demoIsAnchor ? (
              <SecondaryButton href={demo}>{t.demo}</SecondaryButton>
            ) : (
              <SecondaryButton href={demo} target="_blank" rel="noopener noreferrer">
                {t.demo} <ArrowUpRight />
              </SecondaryButton>
            )
          )}
        </Actions>

        {installCmd && (
          <CopyLine>
            <code><span className="prompt">$ </span>{installCmd}</code>
            <GhostButton type="button" onClick={handleCopy} aria-live="polite">
              {copied ? t.copied : t.copy}
            </GhostButton>
          </CopyLine>
        )}

        {project.fullDescription[language] && (
          <Section>
            <h2>{t.overview}</h2>
            <Body>{undash(project.fullDescription[language])}</Body>
          </Section>
        )}

        {features.length > 0 && (
          <Section>
            <h2>{t.features}</h2>
            <Features>
              {features.map((feature, index) => (
                <li key={index}>{undash(feature)}</li>
              ))}
            </Features>
          </Section>
        )}

        {project.tags.length > 0 && (
          <TagRow>
            <dt>{t.tags}</dt>
            <dd>{project.tags.join(' · ')}</dd>
          </TagRow>
        )}
      </Column>

      {hasDocs && (
        <DemoSection id={project.id}>
          <h2>{t.docs}</h2>
          <DemoFrame>
            <Suspense fallback={<DemoFallback />}>
              {project.id === 'data-ui-kit' && <DataUIKitGuide isDark={isDark} language={language} />}
              <LibraryDocDemo isDark={isDark} language={language} projectId={project.id} />
            </Suspense>
          </DemoFrame>
        </DemoSection>
      )}
    </Page>
  );
}
