import { useState, useEffect, useRef } from 'react';
import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useAbout } from '../hooks/useAbout';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Mail, Phone, Calendar, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../lib/supabase';

/* ── Full-screen sub-section ── */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const SubScreen = styled.section<{ $isDark: boolean; $inView: boolean; $align?: 'center' | 'start' }>`
  min-height: 100vh;
  scroll-snap-align: start;
  scroll-snap-stop: normal;
  display: flex;
  align-items: ${p => p.$align === 'start' ? 'flex-start' : 'center'};
  justify-content: center;
  background: ${p => p.$isDark ? '#000' : '#ffffff'};
  transition: background 0.3s ease;
  padding: ${p => p.$align === 'start' ? '120px 0 80px' : '80px 0'};
  width: 100%;

  opacity: 0;
  ${p => p.$inView && css`
    animation: ${fadeUp} 0.9s ease forwards;
  `}

  @media (max-width: 768px) {
    min-height: auto;
    scroll-snap-align: none;
    padding: 60px 0;
    align-items: flex-start;
    opacity: 1;
    animation: none;
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

/* ── 섹션 헤더 ── */
const SectionEyebrow = styled.span<{ $isDark: boolean }>`
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: ${p => p.$isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)'};
  display: block;
  margin-bottom: 12px;
`;

const SectionTitle = styled.h2<{ $isDark: boolean }>`
  font-size: 40px;
  font-weight: 700;
  color: ${p => p.$isDark ? '#f5f5f7' : '#1d1d1f'};
  margin: 0 0 48px 0;
  letter-spacing: -1px;
  line-height: 1.15;

  @media (max-width: 768px) {
    font-size: 30px;
    margin-bottom: 36px;
  }
`;

/* ── 자기 소개 블록 ── */
const IntroBlock = styled.div`
  margin-bottom: 48px;
  text-align: center;
`;

const IntroText = styled.p<{ $isDark: boolean }>`
  font-size: 18px;
  line-height: 1.75;
  color: ${p => p.$isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.6)'};
  margin: 0 auto 24px;
  max-width: 640px;
  letter-spacing: -0.2px;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const InfoRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin-top: 20px;
  justify-content: center;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const InfoIcon = styled.div<{ $isDark: boolean }>`
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: ${p => p.$isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 13px;
    height: 13px;
    color: ${p => p.$isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)'};
  }
`;

const InfoValue = styled.span<{ $isDark: boolean }>`
  font-size: 13px;
  color: ${p => p.$isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.55)'};
  letter-spacing: -0.1px;
`;

/* ── 구분선 ── */
const Divider = styled.div<{ $isDark: boolean }>`
  height: 1px;
  background: ${p => p.$isDark
    ? 'linear-gradient(to right, transparent, rgba(255,255,255,0.08), transparent)'
    : 'linear-gradient(to right, transparent, rgba(0,0,0,0.08), transparent)'};
  margin: 48px 0;
`;

/* ── 기술 스택 (가운데 정렬 + 아이콘 그리드) ── */
const SkillSection = styled.div`
  text-align: center;
`;

const SkillEyebrow = styled.span<{ $isDark: boolean }>`
  display: block;
  font-size: 13px;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: ${p => p.$isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)'};
  margin-bottom: 12px;
`;

const SkillTitle = styled.h2<{ $isDark: boolean }>`
  font-size: 40px;
  font-weight: 700;
  color: ${p => p.$isDark ? '#f5f5f7' : '#1d1d1f'};
  margin: 0 0 48px 0;
  letter-spacing: -1px;
  line-height: 1.15;

  @media (max-width: 768px) {
    font-size: 30px;
    margin-bottom: 36px;
  }
`;

const TabRow = styled.div<{ $isDark: boolean }>`
  display: inline-flex;
  gap: 0;
  margin-bottom: 36px;
  border-radius: 100px;
  overflow: hidden;
  border: 1px solid ${p => p.$isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'};
`;

const Tab = styled.button<{ $isDark: boolean; $active: boolean }>`
  padding: 10px 24px;
  border: none;
  background: ${p => p.$active
    ? p.$isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)'
    : 'transparent'};
  color: ${p => p.$active
    ? p.$isDark ? '#f5f5f7' : '#1d1d1f'
    : p.$isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)'};
  font-size: 14px;
  font-weight: ${p => p.$active ? 600 : 400};
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;

  &:hover {
    background: ${p => !p.$active
      ? p.$isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'
      : ''};
  }

  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 13px;
  }
`;

const IconGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
  max-width: 376px; /* 5 × 56px + 4 × 16px gap */
  margin: 0 auto;
  padding-bottom: 28px;

  @media (max-width: 768px) {
    max-width: 312px; /* 5 × 48px + 4 × 12px gap */
    gap: 12px;
  }
`;

const IconItem = styled.div<{ $isDark: boolean; $faded?: boolean }>`
  width: 56px;
  height: 56px;
  flex-shrink: 0;
  border-radius: 10px;

  @media (max-width: 768px) {
    width: 48px;
    height: 48px;
  }
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease, opacity 0.3s ease, filter 0.3s ease;
  cursor: default;
  position: relative;
  background: ${p => p.$isDark ? 'rgba(255,255,255,0.06)' : '#ffffff'};
  box-shadow: ${p => p.$isDark
    ? '0 2px 8px rgba(0,0,0,0.3)'
    : '0 2px 8px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.03)'};
  opacity: ${p => p.$faded ? 0.2 : 1};
  filter: ${p => p.$faded ? 'grayscale(1)' : 'none'};

  &:hover {
    transform: scale(1.15);
    z-index: 10;
    box-shadow: ${p => p.$isDark
      ? '0 4px 16px rgba(0,0,0,0.4)'
      : '0 4px 16px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.04)'};
  }

  &:hover > span {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }

  img.icon-filled {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 10px;
  }

  img.icon-plain {
    width: 38px;
    height: 38px;
    object-fit: contain;
  }

  @media (max-width: 768px) {
    width: 48px;
    height: 48px;

    img.icon-plain {
      width: 32px;
      height: 32px;
    }
  }
`;

const IconTooltip = styled.span<{ $isDark: boolean }>`
  position: absolute;
  bottom: -28px;
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

/** SVG 자체에 배경색이 있는 아이콘들 — 박스를 꽉 채움 */
const FILLED_ICONS = new Set([
  'JavaScript', 'TypeScript', 'HTML/CSS', 'HTML', 'CSS',
  'Sass', 'SCSS',
  'Photoshop', 'Illustrator', 'Storybook',
  'Swagger', 'Postman',
]);

const SubTitle = styled.h3<{ $isDark: boolean }>`
  font-size: 22px;
  font-weight: 600;
  color: ${p => p.$isDark ? '#f5f5f7' : '#1d1d1f'};
  margin: 0 0 24px 0;
  letter-spacing: -0.5px;

  @media (max-width: 768px) {
    font-size: 19px;
  }
`;

/** 기술 이름 → devicon/simpleicons CDN URL 매핑 */
const SKILL_ICONS: Record<string, string> = {
  'JavaScript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
  'TypeScript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
  'React': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
  'Next.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
  'Vue.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg',
  'HTML': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
  'CSS': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
  'HTML/CSS': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
  'Styled-Components': 'https://cdn.simpleicons.org/styledcomponents/DB7093',
  'Tailwind CSS': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg',
  'Sass': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg',
  'SCSS': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg',
  'Ant Design': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/antdesign/antdesign-original.svg',
  'Storybook': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/storybook/storybook-original.svg',
  'Node.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
  'Express': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg',
  'Supabase': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg',
  'Firebase': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg',
  'Webpack': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/webpack/webpack-original.svg',
  'Vite': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg',
  'npm': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/npm/npm-original-wordmark.svg',
  'Git': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
  'Vercel': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg',
  'Figma': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg',
  'Photoshop': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-original.svg',
  'Illustrator': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/illustrator/illustrator-plain.svg',
  'Vue 3': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg',
  'Redux': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg',
  'Nest.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nestjs/nestjs-original.svg',
  'NestJS': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nestjs/nestjs-original.svg',
  'PostgreSQL': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
  'Swagger': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swagger/swagger-original.svg',
  'Postman': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg',
  'Jira': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jira/jira-original.svg',
  'Notion': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/notion/notion-original.svg',
  'Slack': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/slack/slack-original.svg',
  'Docker': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
  'MongoDB': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
  'MySQL': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
  'Python': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
  'GitHub': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
  'GitLab': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gitlab/gitlab-original.svg',
  'AWS': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg',
  'Zustand': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
  'Swagger / Postman': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swagger/swagger-original.svg',
  'Jira / Notion / Slack': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jira/jira-original.svg',
};

/* ── 경력 타임라인 ── */
const Timeline = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const TimelineItem = styled.div<{ $isDark: boolean }>`
  display: flex;
  gap: 20px;
  position: relative;

  @media (max-width: 768px) {
    gap: 16px;
  }
`;

const TimelineLine = styled.div<{ $isDark: boolean; $isLast: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 20px;
  flex-shrink: 0;
  padding-top: 6px;
`;

const TimelineDot = styled.div<{ $isDark: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${p => p.$isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.3)'};
  flex-shrink: 0;
`;

const TimelineConnector = styled.div<{ $isDark: boolean; $isLast: boolean }>`
  width: 1px;
  flex: 1;
  background: ${p => p.$isLast ? 'transparent' : p.$isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'};
  margin-top: 4px;
`;

const TimelineContent = styled.div`
  flex: 1;
  padding-bottom: 32px;
`;

const TimelineHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 4px;
  flex-wrap: wrap;
`;

const TimelineTitle = styled.div<{ $isDark: boolean }>`
  font-size: 16px;
  font-weight: 600;
  color: ${p => p.$isDark ? '#f5f5f7' : '#1d1d1f'};
  letter-spacing: -0.3px;
`;

const TimelinePeriod = styled.span<{ $isDark: boolean }>`
  font-size: 12px;
  color: ${p => p.$isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)'};
  font-weight: 500;
  white-space: nowrap;
  flex-shrink: 0;
`;

const TimelineSub = styled.div`
  font-size: 13px;
  color: #86868b;
  margin-bottom: 8px;
`;

const TimelineDesc = styled.p`
  font-size: 13px;
  color: #86868b;
  line-height: 1.65;
  margin: 0 0 8px 0;
`;

const DetailToggle = styled.button<{ $isDark: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0;
  border: none;
  background: none;
  font-size: 12px;
  font-weight: 500;
  color: ${p => p.$isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)'};
  cursor: pointer;
  font-family: inherit;
  margin-top: 4px;
  transition: color 0.15s;

  &:hover {
    color: ${p => p.$isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.55)'};
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const slideDown = keyframes`
  from { opacity: 0; max-height: 0; }
  to   { opacity: 1; max-height: 300px; }
`;

const AchievementList = styled.ul<{ $open: boolean }>`
  list-style: none;
  padding: 0;
  margin: 8px 0 0 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow: hidden;
  ${p => p.$open
    ? css`animation: ${slideDown} 0.3s ease forwards;`
    : 'max-height: 0; opacity: 0;'}
`;

const AchievementItem = styled.li<{ $isDark: boolean }>`
  font-size: 12px;
  color: ${p => p.$isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)'};
  padding-left: 14px;
  position: relative;
  line-height: 1.6;

  &::before {
    content: '–';
    position: absolute;
    left: 0;
    color: #86868b;
  }
`;

/* ── Skeleton ── */
const shimmer = keyframes`
  0%   { background-position: -400% 0; }
  100% { background-position:  400% 0; }
`;

const Skeleton = styled.div<{ $isDark: boolean; $w?: string; $h?: string }>`
  height: ${p => p.$h ?? '14px'};
  border-radius: 8px;
  width: ${p => p.$w ?? '100%'};
  background: linear-gradient(90deg,
    ${p => p.$isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'} 25%,
    ${p => p.$isDark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.09)'} 50%,
    ${p => p.$isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'} 75%
  );
  background-size: 400% 100%;
  animation: ${shimmer} 1.4s ease infinite;
`;

/* ── Translations ── */
const translations = {
  ko: {
    eyebrow: 'ABOUT',
    title: '안녕하세요,\n허정연입니다.',
    bio: '사용자 중심의 인터페이스를 설계하고, 섬세한 UI와 부드러운 경험을 만드는 프론트엔드 개발자입니다. React와 TypeScript를 기반으로 웹 프론트엔드를 개발합니다.',
    skillsEyebrow: 'SKILLS',
    skills: '기술 스택',
    education: '학력',
    experience: '경력',
    detail: '상세',
    collapse: '접기',
    all: '전체',
  },
  en: {
    eyebrow: 'ABOUT',
    title: 'Hello,\nI\'m Jungyeon Heo.',
    bio: 'A frontend developer who designs user-centered interfaces and crafts delicate UI with smooth, thoughtful experiences. I build web frontends based on React and TypeScript.',
    skillsEyebrow: 'SKILLS',
    skills: 'Skills & Tools',
    education: 'Education',
    experience: 'Experience',
    detail: 'Details',
    collapse: 'Collapse',
    all: 'All',
  },
};

const categoryLabels = {
  ko: { frontend: '프론트엔드', backend: '백엔드', design: '디자인', other: '기타' },
  en: { frontend: 'Frontend', backend: 'Backend', design: 'Design', other: 'Other' },
};

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); io.disconnect(); } },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, inView] as [React.RefObject<HTMLElement>, boolean];
}

export default function About() {
  const { isDark } = useTheme();
  const { language } = useLanguage();
  const { skills, education, experiences, loading } = useAbout();
  const t = translations[language];
  const cl = categoryLabels[language];

  const [activeTab, setActiveTab] = useState<string>('all');
  const [openExp, setOpenExp] = useState<Set<number>>(new Set());

  const groupedSkills = skills.reduce((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {} as Record<string, typeof skills>);

  const categories = Object.keys(groupedSkills);

  const toggleExp = (i: number) => {
    setOpenExp(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const [introRef, introInView] = useInView(0.1);
  const [skillsRef, skillsInView] = useInView(0.1);
  const [expRef, expInView] = useInView(0.1);

  return (
    <>
      {/* ── Screen 1: Intro ── */}
      <SubScreen
        id="about"
        $isDark={isDark}
        $inView={introInView}
        ref={introRef as React.RefObject<HTMLElement>}
      >
        <Container>
          <IntroBlock>
            <SectionEyebrow $isDark={isDark}>{t.eyebrow}</SectionEyebrow>
            <SectionTitle $isDark={isDark} style={{ whiteSpace: 'pre-line' }}>{t.title}</SectionTitle>
            <IntroText $isDark={isDark}>{t.bio}</IntroText>
            <InfoRow>
              {[
                { icon: <Calendar />, value: '2000.01.28' },
                { icon: <Mail />, value: 'qazseeszaq3219@gmail.com' },
                { icon: <Phone />, value: '010-2863-7447' },
                { icon: <MapPin />, value: language === 'ko' ? '서울, 대한민국' : 'Seoul, Korea' },
              ].map(({ icon, value }) => (
                <InfoItem key={value}>
                  <InfoIcon $isDark={isDark}>{icon}</InfoIcon>
                  <InfoValue $isDark={isDark}>{value}</InfoValue>
                </InfoItem>
              ))}
            </InfoRow>
          </IntroBlock>
        </Container>
      </SubScreen>

      {/* ── Screen 2: Skills ── */}
      <SubScreen
        $isDark={isDark}
        $inView={skillsInView}
        ref={skillsRef as React.RefObject<HTMLElement>}
      >
        <Container>
          <SkillSection>
            <SkillEyebrow $isDark={isDark}>{t.skillsEyebrow}</SkillEyebrow>
            <SkillTitle $isDark={isDark}>{t.skills}</SkillTitle>
            {loading ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
                {Array.from({ length: 10 }).map((_, i) => (
                  <Skeleton key={i} $isDark={isDark} $w="56px" $h="56px" style={{ borderRadius: 14 }} />
                ))}
              </div>
            ) : (
              <>
                <TabRow $isDark={isDark}>
                  <Tab $isDark={isDark} $active={activeTab === 'all'} onClick={() => setActiveTab('all')}>
                    {t.all}
                  </Tab>
                  {categories.map(cat => (
                    <Tab
                      key={cat}
                      $isDark={isDark}
                      $active={activeTab === cat}
                      onClick={() => setActiveTab(cat)}
                    >
                      {cl[cat as keyof typeof cl] || cat}
                    </Tab>
                  ))}
                </TabRow>
                <IconGrid>
                  {skills.map((s, i) => {
                    const isFaded = activeTab !== 'all' && s.category !== activeTab;
                    return (
                      <IconItem key={i} $isDark={isDark} $faded={isFaded}>
                        {SKILL_ICONS[s.name] ? (
                          <img
                            src={SKILL_ICONS[s.name]}
                            alt={s.name}
                            loading="lazy"
                            className={FILLED_ICONS.has(s.name) ? 'icon-filled' : 'icon-plain'}
                          />
                        ) : (
                          <span style={{ fontSize: 12, color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}>{s.name}</span>
                        )}
                        <IconTooltip $isDark={isDark}>{s.name}</IconTooltip>
                      </IconItem>
                    );
                  })}
                </IconGrid>
              </>
            )}
          </SkillSection>
        </Container>
      </SubScreen>

      {/* ── Screen 3: Experience + Education ── */}
      <SubScreen
        $isDark={isDark}
        $inView={expInView}
        $align="start"
        ref={expRef as React.RefObject<HTMLElement>}
      >
        <Container>
          {/* 경력 */}
          <div>
            <SubTitle $isDark={isDark}>{t.experience}</SubTitle>
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {[1, 2].map(i => (
                  <div key={i}>
                    <Skeleton $isDark={isDark} $w="50%" $h="16px" style={{ marginBottom: 8 }} />
                    <Skeleton $isDark={isDark} $w="35%" $h="13px" style={{ marginBottom: 8 }} />
                    <Skeleton $isDark={isDark} $w="90%" $h="12px" />
                  </div>
                ))}
              </div>
            ) : (
              <Timeline>
                {experiences.map((exp, i) => (
                  <TimelineItem key={i} $isDark={isDark}>
                    <TimelineLine $isDark={isDark} $isLast={i === experiences.length - 1}>
                      <TimelineDot $isDark={isDark} />
                      <TimelineConnector $isDark={isDark} $isLast={i === experiences.length - 1} />
                    </TimelineLine>
                    <TimelineContent>
                      <TimelineHeader>
                        <TimelineTitle $isDark={isDark}>{exp.company[language]}</TimelineTitle>
                        <TimelinePeriod $isDark={isDark}>{exp.period}</TimelinePeriod>
                      </TimelineHeader>
                      <TimelineSub>{exp.position[language]}</TimelineSub>
                      {exp.description[language] && (
                        <TimelineDesc>{exp.description[language]}</TimelineDesc>
                      )}
                      {exp.achievements[language].length > 0 && (
                        <>
                          <DetailToggle $isDark={isDark} onClick={() => toggleExp(i)}>
                            {openExp.has(i) ? t.collapse : t.detail}
                            {openExp.has(i) ? <ChevronUp /> : <ChevronDown />}
                          </DetailToggle>
                          <AchievementList $open={openExp.has(i)}>
                            {exp.achievements[language].map((a, idx) => (
                              <AchievementItem key={idx} $isDark={isDark}>{a}</AchievementItem>
                            ))}
                          </AchievementList>
                        </>
                      )}
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            )}
          </div>

          <Divider $isDark={isDark} />

          {/* 학력 */}
          <div>
            <SubTitle $isDark={isDark}>{t.education}</SubTitle>
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {[1, 2].map(i => (
                  <div key={i}>
                    <Skeleton $isDark={isDark} $w="55%" $h="16px" style={{ marginBottom: 8 }} />
                    <Skeleton $isDark={isDark} $w="40%" $h="13px" />
                  </div>
                ))}
              </div>
            ) : (
              <Timeline>
                {education.map((edu, i) => (
                  <TimelineItem key={i} $isDark={isDark}>
                    <TimelineLine $isDark={isDark} $isLast={i === education.length - 1}>
                      <TimelineDot $isDark={isDark} />
                      <TimelineConnector $isDark={isDark} $isLast={i === education.length - 1} />
                    </TimelineLine>
                    <TimelineContent>
                      <TimelineHeader>
                        <TimelineTitle $isDark={isDark}>{edu.school[language]}</TimelineTitle>
                        <TimelinePeriod $isDark={isDark}>{edu.period}</TimelinePeriod>
                      </TimelineHeader>
                      <TimelineSub>{edu.degree[language]} · {edu.major[language]}</TimelineSub>
                      {edu.description[language] && (
                        <TimelineDesc>{edu.description[language]}</TimelineDesc>
                      )}
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            )}
          </div>
        </Container>
      </SubScreen>
    </>
  );
}
