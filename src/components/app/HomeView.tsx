'use client';

import styled from 'styled-components';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useProjects } from '../../hooks/useProjects';
import { useBlogPosts } from '../../hooks/useBlogPosts';
import { useContactModal } from './ContactModalContext';
import HeroCharacter from '../HeroCharacter';

const GITHUB_URL = 'https://github.com/xxcordeau';

/* 톤은 PUUS 토큰(회색 + 검정, Pretendard, 4px 간격)을 쓰고,
   내용은 숫자 대신 실제 작업 화면과 직접 만든 글 썸네일로 채운다. */

const Main = styled.main`
  max-width: var(--k-page-max);
  margin: 0 auto;
  padding: 72px var(--k-space-6) 96px;
  color: var(--k-text);

  @media (max-width: 768px) {
    padding: var(--k-space-10) var(--k-space-4) 72px;
  }
`;

/* 소개 글 왼쪽, 직접 만든 3D 캐릭터 오른쪽 */
const Hero = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 480px);
  align-items: center;
  gap: var(--k-space-10);

  @media (max-width: 900px) {
    grid-template-columns: minmax(0, 1fr) minmax(0, 300px);
    gap: var(--k-space-6);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: var(--k-space-4);
  }
`;

const ModelSlot = styled.div`
  justify-self: end;
  width: 100%;
  /* 위쪽은 말풍선이 머리 위에 뜰 자리를 남긴다 */
  margin: -8px 0 -32px;

  @media (max-width: 900px) {
    margin: 16px 0 -24px;
  }

  @media (max-width: 640px) {
    justify-self: center;
    max-width: 300px;
    margin: 0;
    order: -1;
  }
`;

const Intro = styled.section`
  max-width: 620px;
  animation: k-enter 0.3s var(--k-ease) both;

  h1 {
    font-size: var(--k-text-2xl);
    font-weight: 700;
    letter-spacing: -0.03em;
    margin-bottom: var(--k-space-4);
  }

  p {
    font-size: var(--k-text-lg);
    line-height: 1.75;
    color: var(--k-text-sub);
    word-break: keep-all;
    text-wrap: balance;
  }

  p + p { margin-top: var(--k-space-3); }

  strong {
    font-weight: 600;
    color: var(--k-text);
    white-space: nowrap;
  }

  @media (max-width: 768px) {
    p { font-size: 15px; }
  }
`;

const IntroLinks = styled.div`
  display: flex;
  gap: var(--k-space-5);
  margin-top: var(--k-space-6);

  a, button {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    padding: 0;
    border: none;
    background: none;
    font: inherit;
    font-size: var(--k-text-md);
    font-weight: 600;
    color: var(--k-text);
    text-decoration: underline;
    text-decoration-color: var(--k-line-strong);
    text-underline-offset: 4px;
    cursor: pointer;
    transition: text-decoration-color 0.15s var(--k-ease);
  }

  a:hover, button:hover { text-decoration-color: var(--k-text); }
  svg { width: 14px; height: 14px; }
`;

const Section = styled.section`
  margin-top: 88px;

  @media (max-width: 768px) {
    margin-top: 64px;
  }
`;

const Head = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: var(--k-space-5);

  h2 {
    font-size: var(--k-text-lg);
    font-weight: 700;
  }

  h2 span {
    margin-left: var(--k-space-2);
    font-size: var(--k-text-sm);
    font-weight: 400;
    color: var(--k-text-weak);
  }

  a {
    font-size: var(--k-text-sm);
    color: var(--k-text-weak);
    text-decoration: none;
  }

  a:hover { color: var(--k-text); }
`;

/* 할 수 있는 일: 아이콘이나 막대 없이 문장으로. 근거가 되는 작업을 같이 적는다 */
const Abilities = styled.ul`
  list-style: none;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  column-gap: var(--k-space-8);
  border-top: 1px solid var(--k-line);

  li {
    padding: var(--k-space-5) 0;
    border-bottom: 1px solid var(--k-line);
    animation: k-enter 0.25s var(--k-ease) both;
  }

  h3 {
    font-size: 15px;
    font-weight: 700;
  }

  p {
    margin-top: 6px;
    font-size: var(--k-text-md);
    line-height: 1.65;
    color: var(--k-text-sub);
    word-break: keep-all;
    text-wrap: pretty;
  }

  small {
    display: block;
    margin-top: var(--k-space-2);
    font-size: var(--k-text-sm);
    color: var(--k-text-weak);
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const WorkGrid = styled.ul`
  list-style: none;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--k-space-10) var(--k-space-6);

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: var(--k-space-8);
  }
`;

const PostGrid = styled(WorkGrid)`
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--k-space-8) var(--k-space-5);

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.li`
  animation: k-enter 0.25s var(--k-ease) both;

  a {
    display: block;
    color: inherit;
    text-decoration: none;
  }

  .shot {
    aspect-ratio: 16 / 10;
    border-radius: var(--k-radius-lg);
    border: 1px solid var(--k-line);
    background: var(--k-bg-sub);
    overflow: hidden;
  }

  .shot img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .title {
    margin-top: var(--k-space-3);
    font-size: var(--k-text-lg);
    font-weight: 600;
  }

  .desc {
    margin-top: var(--k-space-2);
    font-size: var(--k-text-md);
    line-height: 1.6;
    color: var(--k-text-sub);
    word-break: keep-all;
    text-wrap: pretty;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .meta {
    margin-top: 2px;
    font-size: var(--k-text-sm);
    color: var(--k-text-weak);
    font-variant-numeric: tabular-nums;
  }

  a:hover .title {
    text-decoration: underline;
    text-underline-offset: 4px;
  }
`;

const PostCard = styled(Card)`
  .shot {
    aspect-ratio: 16 / 9;
    border-radius: var(--k-radius);
  }

  .title {
    font-size: 15px;
    line-height: 1.5;
    word-break: keep-all;
    text-wrap: pretty;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

const T = {
  ko: {
    name: '허정연',
    p1: (
      <>
        동훈아이텍에서 <strong>보안 자산관리 플랫폼 Keyrke</strong>의 프론트엔드를 맡고 있어요.
        시각디자인을 전공하고 웹 퍼블리셔로 일을 시작해서, 화면을 만드는 일과 디자인하는 일을 같이 해요.
      </>
    ),
    p2: (
      <>
        올해는 골프장 운영 시스템 <strong>HILLMARU</strong>를 현장 요구사항 수집부터 시연까지 맡았고,
        시연 후 실제 운영에 채택됐어요. 호주 멜버른 포토부스 <strong>SnapClub</strong>의 키오스크도
        다시 만들어 지금 매장에서 운영 중이에요.
      </>
    ),
    contact: '연락하기',
    can: '할 수 있는 일',
    abilities: [
      {
        title: '디자인 시스템과 공통 컴포넌트',
        desc: '색, 간격, 글자 크기 규칙을 먼저 정하고 그 위에 컴포넌트를 쌓아요. Keyrke에 쓰는 공통 컴포넌트를 직접 만들었고, 매장마다 색과 글꼴만 바꿔 쓰는 키오스크 테마 시스템도 설계했어요.',
        tech: 'Figma · Vue 3 · TypeScript',
      },
      {
        title: '복잡한 관리 화면',
        desc: '노드가 500개 넘는 조직도 트리(Keyrke), 결재 단계에 따라 보이는 지점과 권한이 달라지는 운영 화면(HILLMARU)처럼 관리 화면에서 까다로운 부분을 만들어 왔어요.',
        tech: 'Vue 3 · Nuxt 3 · React',
      },
      {
        title: '화면부터 서버까지',
        desc: '화면에 필요한 API를 직접 설계하고, Spring Boot나 NestJS로 서버까지 만들어요. 화면과 서버를 같이 만들면 데이터 모양을 처음부터 화면에 맞게 정할 수 있어요.',
        tech: 'Spring Boot · NestJS · PostgreSQL',
      },
    ],
    work: '실무 프로젝트', workNote: '커버 이미지도 직접 디자인했어요', moreWork: '개인 작업까지 보기',
    writing: '기술 글', moreWriting: '디자인 글까지 전체 보기',
  },
  en: {
    name: 'Heo JeongYeon',
    p1: (
      <>
        I build the frontend of <strong>Keyrke</strong>, a security asset management platform at Donghun ITech.
        I studied visual design and started out as a web publisher, so I design screens as well as build them.
      </>
    ),
    p2: (
      <>
        This year I took the golf course operations system <strong>HILLMARU</strong> from on-site requirements to a
        live demo, and it was adopted for real operations. I also rebuilt the kiosk for <strong>SnapClub</strong>,
        a self photo booth brand in Melbourne, and it runs in their stores today.
      </>
    ),
    contact: 'Contact',
    can: 'What I can do',
    abilities: [
      {
        title: 'Design systems and shared components',
        desc: 'I set the rules first (color, spacing, type) and build components on top. I built the shared components Keyrke runs on, and designed a kiosk theme system that swaps only colors and fonts per store.',
        tech: 'Figma · Vue 3 · TypeScript',
      },
      {
        title: 'Complex admin screens',
        desc: 'Org-chart trees with 500+ nodes (Keyrke) and operations screens where visible branches and permissions change by approval step (HILLMARU): the hard parts of admin screens.',
        tech: 'Vue 3 · Nuxt 3 · React',
      },
      {
        title: 'From screens to the server',
        desc: 'I design the APIs a screen needs and build the server too, with Spring Boot or NestJS. Building both lets me shape the data for the screen from the start.',
        tech: 'Spring Boot · NestJS · PostgreSQL',
      },
    ],
    work: 'Client work', workNote: 'I designed the cover images too', moreWork: 'See personal work too',
    writing: 'Technical writing', moreWriting: 'All posts, including design',
  },
};

/* 홈 카드에는 제품 소개 대신 "내가 한 일"을 쓴다. 근거는 DB의 highlights / challenge / solution.
   여기 없는 프로젝트는 DB 설명으로 대신한다. */
const WORK: Record<string, { ko: { role: string; did: string }; en: { role: string; did: string } }> = {
  keyrke: {
    ko: { role: '프론트엔드 · 5인 팀', did: '보안 자산관리 플랫폼의 화면 설계와 개발을 맡고 있어요. 공통 컴포넌트 62종을 만들었고, 현대모비스, 현대오토에버, 현대케피코에서 운영 중이에요.' },
    en: { role: 'Frontend · team of 5', did: 'I design and build the screens of this security asset management platform. I built 62 shared components, and it runs in production at Hyundai Mobis, Hyundai AutoEver and Hyundai Kefico.' },
  },
  snapclub: {
    ko: { role: '풀스택 · 2인 팀', did: '실행 파일과 로그만 남은 WPF 키오스크를 분석해 Electron과 NestJS로 다시 만들었어요. 부스 앱, 관리자 화면, 서버를 맡았어요.' },
    en: { role: 'Fullstack · team of 2', did: 'I reverse engineered a legacy WPF kiosk from its binaries and logs, then rebuilt it with Electron and NestJS. I owned the booth app, the admin screens and the server.' },
  },
  winnticket: {
    ko: { role: '풀스택 · 3인 팀', did: '쇼핑몰, 관리자, 현장관리자 세 시스템을 React 앱 하나로 만들고 Spring Boot API까지 짰어요. 코드 스플리팅으로 초기 번들을 580KB에서 336KB로 줄였어요.' },
    en: { role: 'Fullstack · team of 3', did: 'I built the shop, admin and on-site manager systems as one React app, plus the Spring Boot API. Code splitting cut the initial bundle from 580KB to 336KB.' },
  },
  'tongin-express': {
    ko: { role: '프론트엔드 단독 · 3인 팀', did: '종이 계약서를 태블릿 웹앱으로 바꿨어요. 고객이 문자로 받은 링크에서 서명하면 영업사원 화면에 바로 반영되게 만들었어요.' },
    en: { role: 'Sole frontend · team of 3', did: 'I moved paper contracts to a tablet web app. When a customer signs from the SMS link, the sales rep sees it on screen right away.' },
  },
};
const WORK_ORDER = ['keyrke', 'snapclub', 'winnticket', 'tongin-express'];

// 홈에는 개발 글 중 문제를 풀어 간 글을 먼저 보여 준다
const FEATURED_POSTS = ['api-mismatch-usememo-crash', 'css-print-layer-conflict', 'react-page-refactoring'];
const HOME_POSTS = 6;

// "SnapClub - 포토부스 키오스크 시스템" → "SnapClub"
const shortName = (title: string) => title.split(/\s+[-—–]\s+/)[0].trim();

export default function HomeView() {
  const { language } = useLanguage();
  const t = T[language];
  const { open: openContact } = useContactModal();
  const { projects } = useProjects();
  const { posts } = useBlogPosts();

  const work = projects
    .filter(p => p.type === 'freelance')
    .sort((a, b) => {
      const ia = WORK_ORDER.indexOf(a.id);
      const ib = WORK_ORDER.indexOf(b.id);
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
    });

  // 고른 글 3개에 최신 개발 글을 더해 6개. 3열이든 2열이든 빈칸 없이 채워진다
  const featured = FEATURED_POSTS
    .map(id => posts.find(p => p.id === id))
    .filter((p): p is NonNullable<typeof p> => !!p);
  const latestDev = posts
    .filter(p => p.category.ko === '개발' && !FEATURED_POSTS.includes(p.id))
    .sort((a, b) => b.date.localeCompare(a.date));
  const techPosts = [...featured, ...latestDev]
    .slice(0, HOME_POSTS)
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <Main>
      <Hero>
      <Intro>
        <h1>{t.name}</h1>
        <p>{t.p1}</p>
        <p>{t.p2}</p>
        <IntroLinks>
          <button onClick={openContact}>{t.contact}</button>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
            GitHub <ArrowUpRight />
          </a>
        </IntroLinks>
      </Intro>
      <ModelSlot>
        <HeroCharacter />
      </ModelSlot>
      </Hero>

      <Section>
        <Head>
          <h2>{t.can}</h2>
        </Head>
        <Abilities>
          {t.abilities.map((a, i) => (
            <li key={a.title} style={{ animationDelay: `${i * 30}ms` }}>
              <h3>{a.title}</h3>
              <p>{a.desc}</p>
              <small>{a.tech}</small>
            </li>
          ))}
        </Abilities>
      </Section>

      <Section>
        <Head>
          <h2>{t.work}<span>{t.workNote}</span></h2>
          <Link href="/projects">{t.moreWork}</Link>
        </Head>
        <WorkGrid>
          {work.map((p, i) => {
            const copy = WORK[p.id]?.[language];
            return (
              <Card key={p.id} style={{ animationDelay: `${i * 40}ms` }}>
                <Link href={`/projects/${p.id}`}>
                  <div className="shot">
                    {p.image && <img src={p.image} alt="" loading="lazy" />}
                  </div>
                  <div className="title">{shortName(p.title[language])}</div>
                  <div className="meta">
                    {copy ? `${copy.role} · ` : ''}{p.year.replace(/[–—]/g, '-')}
                  </div>
                  <div className="desc">{copy ? copy.did : p.description[language]}</div>
                </Link>
              </Card>
            );
          })}
        </WorkGrid>
      </Section>

      <Section>
        <Head>
          <h2>{t.writing}</h2>
          <Link href="/blog">{t.moreWriting}</Link>
        </Head>
        <PostGrid>
          {techPosts.map((b, i) => (
            <PostCard key={b.id} style={{ animationDelay: `${i * 40}ms` }}>
              <Link href={`/blog/${b.id}`}>
                <div className="shot">
                  {b.thumbnail && <img src={b.thumbnail} alt="" loading="lazy" />}
                </div>
                <div className="title">{b.title[language]}</div>
                <div className="meta">{b.date.replace(/-/g, '.')}</div>
              </Link>
            </PostCard>
          ))}
        </PostGrid>
      </Section>
    </Main>
  );
}
