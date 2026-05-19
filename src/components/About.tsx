import { useState, useEffect, useRef, useCallback } from 'react';
import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useAbout } from '../hooks/useAbout';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Mail, Calendar, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { resolveIcon, FILLED_ICONS as SHARED_FILLED, DARK_INVERT_ICONS } from '../lib/techIcons';

/* ── Text Scramble Hook ── */
const CHARS = '가나다라마바사아자차카타파하ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&';
function useTextScramble(target: string, trigger: boolean, duration = 800) {
  const [text, setText] = useState(target);
  const frameRef = useRef(0);
  useEffect(() => {
    if (!trigger) { setText(target); return; }
    const len = target.length;
    const startTime = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const resolved = Math.floor(progress * len);
      let result = '';
      for (let i = 0; i < len; i++) {
        if (target[i] === '\n') { result += '\n'; continue; }
        if (i < resolved) { result += target[i]; }
        else { result += CHARS[Math.floor(Math.random() * CHARS.length)]; }
      }
      setText(result);
      if (progress < 1) frameRef.current = requestAnimationFrame(step);
    };
    frameRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target, trigger, duration]);
  return text;
}

/* ── Character Fade-In Component ── */
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

const underlineDraw = keyframes`
  from { background-size: 0% 6px; }
  to   { background-size: 100% 6px; }
`;

const IntroText = styled.p<{ $isDark: boolean; $inView?: boolean }>`
  font-size: 18px;
  line-height: 1.75;
  color: ${p => p.$isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.6)'};
  margin: 0 auto 24px;
  max-width: 640px;
  letter-spacing: -0.2px;

  strong {
    font-weight: 600;
    color: ${p => p.$isDark ? '#f5f5f7' : '#1d1d1f'};
    background-image: linear-gradient(
      ${p => p.$isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)'},
      ${p => p.$isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)'}
    );
    background-repeat: no-repeat;
    background-position: left bottom;
    background-size: 0% 6px;
    padding-bottom: 2px;
    ${p => p.$inView && css`
      animation: ${underlineDraw} 0.8s ease forwards;
      animation-delay: 0.3s;
    `}
  }

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
  gap: 14px;
  max-width: 490px; /* 7 × 56px + 6 × 14px gap */
  margin: 0 auto;
  padding-bottom: 28px;

  @media (max-width: 768px) {
    max-width: 400px; /* 7 × 44px + 6 × 10px gap */
    gap: 10px;
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

  img.icon-dark-invert {
    width: 38px;
    height: 38px;
    object-fit: contain;
    ${p => p.$isDark ? 'filter: invert(1);' : ''}
  }

  @media (max-width: 768px) {
    width: 48px;
    height: 48px;

    img.icon-plain,
    img.icon-dark-invert {
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

/** Use SHARED_FILLED from techIcons.ts */

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

/** resolveIcon from shared techIcons.ts — no duplicate map needed */

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
  color: ${p => p.$isDark ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.85)'};
  cursor: pointer;
  font-family: inherit;
  margin-top: 4px;
  transition: color 0.15s;

  &:hover {
    color: ${p => p.$isDark ? '#ffffff' : '#000000'};
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const slideDown = keyframes`
  from { opacity: 0; max-height: 0; }
  to   { opacity: 1; max-height: 600px; }
`;

const AchievementList = styled.ul<{ $open: boolean }>`
  list-style: none;
  padding: 0;
  margin: 12px 0 0 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow: hidden;
  ${p => p.$open
    ? css`animation: ${slideDown} 0.3s ease forwards;`
    : 'max-height: 0; opacity: 0;'}
`;

const AchievementItem = styled.li<{ $isDark: boolean }>`
  font-size: 13px;
  color: ${p => p.$isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.6)'};
  padding-left: 16px;
  position: relative;
  line-height: 1.7;

  &::before {
    content: '–';
    position: absolute;
    left: 0;
    color: ${p => p.$isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.3)'};
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
    bio: '<strong>사용자 중심</strong>의 인터페이스를 설계하고,<br/><strong>섬세한 UI</strong>와 부드러운 경험을 만드는 프론트엔드 개발자입니다.<br/><strong>React</strong>와 <strong>TypeScript</strong>를 기반으로 웹 프론트엔드를 개발합니다.',
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
    bio: 'Designing <strong>user-centered</strong> interfaces,<br/>crafting <strong>delicate UI</strong> with smooth, thoughtful experiences.<br/>I build web frontends based on <strong>React</strong> and <strong>TypeScript</strong>.',
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

  const scrambledTitle = useTextScramble(t.title, introInView, 1000);

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
            <SectionEyebrow id="dot-about" $isDark={isDark} data-dot-anchor>{t.eyebrow}</SectionEyebrow>
            <SectionTitle $isDark={isDark} style={{ whiteSpace: 'pre-line' }}>{scrambledTitle}</SectionTitle>
            <IntroText $isDark={isDark} $inView={introInView} dangerouslySetInnerHTML={{ __html: t.bio }} />
            <InfoRow>
              {[
                { icon: <Calendar />, value: '2000.01.28' },
                { icon: <Mail />, value: 'qazseeszaq3219@gmail.com' },
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
        id="skills"
        $isDark={isDark}
        $inView={skillsInView}
        ref={skillsRef as React.RefObject<HTMLElement>}
      >
        <Container>
          <SkillSection>
            <SkillEyebrow id="dot-skills" $isDark={isDark} data-dot-anchor>{t.skillsEyebrow}</SkillEyebrow>
            <SkillTitle as="div" $isDark={isDark}>
              {skillsInView
                ? t.skills.split('').map((c, i) => c === ' ' ? <span key={i}>&nbsp;</span> : <CharSpan key={i} $delay={i * 50}>{c}</CharSpan>)
                : t.skills}
            </SkillTitle>
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
                    const iconUrl = resolveIcon(s.name);
                    const iconClass = SHARED_FILLED.has(s.name) ? 'icon-filled'
                      : DARK_INVERT_ICONS.has(s.name) ? 'icon-dark-invert'
                      : 'icon-plain';
                    return (
                      <IconItem key={i} $isDark={isDark} $faded={isFaded}>
                        {iconUrl ? (
                          <img
                            src={iconUrl}
                            alt={s.name}
                            loading="lazy"
                            className={iconClass}
                          />
                        ) : (
                          <span style={{ fontSize: 11, fontWeight: 600, color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)', textAlign: 'center', lineHeight: 1.2 }}>{s.name}</span>
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
        id="experience"
        $isDark={isDark}
        $inView={expInView}
        $align="start"
        ref={expRef as React.RefObject<HTMLElement>}
      >
        <Container>
          {/* 경력 */}
          <div>
            <SubTitle as="div" $isDark={isDark}>
              {expInView
                ? t.experience.split('').map((c, i) => c === ' ' ? <span key={i}>&nbsp;</span> : <CharSpan key={i} $delay={i * 50}>{c}</CharSpan>)
                : t.experience}
            </SubTitle>
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
            <SubTitle as="div" $isDark={isDark}>
              {expInView
                ? t.education.split('').map((c, i) => c === ' ' ? <span key={i}>&nbsp;</span> : <CharSpan key={i} $delay={i * 50}>{c}</CharSpan>)
                : t.education}
            </SubTitle>
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
