'use client';

import { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { DOT_SIZE, DOT_ARRIVED_EVENT } from '../lib/dot';

/**
 * 마지막 섹션.
 * 히어로부터 페이지를 안내해 온 점(ScrollDot)이 '연락하기' 자리에 내려앉으면,
 * 점은 사라지고 버튼이 그 점에서부터 펼쳐진다.
 *
 * 버튼 상태는 data-dot-state 속성으로 표현한다.
 *  waiting — 자리만 차지하고 보이지 않음 (점이 내려앉기를 기다림)
 *  open    — 점 크기에서 알약 모양으로 펼쳐짐
 * ScrollDot도 이 속성을 읽어, 이미 펼쳐진 버튼 위에는 점을 띄우지 않는다.
 */
type DotState = 'waiting' | 'open';

const Section = styled.section<{ $isDark: boolean }>`
  min-height: 100vh;
  scroll-snap-align: start;
  scroll-snap-stop: normal;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${p => p.$isDark ? '#000' : '#ffffff'};
  text-align: center;
  transition: background 0.3s ease;
  padding: 80px 0;

  @media (max-width: 768px) {
    min-height: auto;
    scroll-snap-align: none;
    padding: 80px 0;
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

const ThankYouText = styled.h2<{ $isDark: boolean }>`
  font-size: 36px;
  font-weight: 700;
  color: ${p => p.$isDark ? '#f5f5f7' : '#1d1d1f'};
  margin: 0 0 16px 0;
  letter-spacing: -1px;
  line-height: 1.3;

  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const SubText = styled.p<{ $isDark: boolean }>`
  font-size: 16px;
  color: ${p => p.$isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)'};
  margin: 0 0 40px 0;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
`;

/* 점(지름 DOT_SIZE) → 알약 버튼 */
const dotToPill = keyframes`
  from { clip-path: circle(${DOT_SIZE / 2}px at 50% 50%); }
  to   { clip-path: circle(75% at 50% 50%); }
`;

const ContactBtn = styled.button<{ $isDark: boolean }>`
  padding: 12px 28px;
  border-radius: 100px;
  border: none;
  background: ${p => p.$isDark ? '#f5f5f7' : '#1d1d1f'};
  color: ${p => p.$isDark ? '#000' : '#fff'};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s ease, transform 0.2s ease;
  font-family: inherit;
  letter-spacing: -0.2px;

  & > span {
    display: inline-block;
  }

  &[data-dot-state='waiting'] {
    clip-path: circle(0px at 50% 50%);
    pointer-events: none;
  }

  &[data-dot-state='waiting'] > span {
    opacity: 0;
  }

  &[data-dot-state='open'] {
    animation: ${dotToPill} 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  &[data-dot-state='open'] > span {
    opacity: 1;
    transition: opacity 0.3s ease 0.28s;
  }

  &:hover {
    opacity: 0.82;
    transform: scale(0.98);
  }

  @media (prefers-reduced-motion: reduce) {
    &[data-dot-state] {
      clip-path: none;
      animation: none;
      pointer-events: auto;
    }
    &[data-dot-state] > span {
      opacity: 1;
      transition: none;
    }
  }
`;

const GithubBtn = styled.a<{ $isDark: boolean }>`
  padding: 12px 28px;
  border-radius: 100px;
  background: transparent;
  border: 1px solid ${p => p.$isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)'};
  color: ${p => p.$isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)'};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease, opacity 0.4s ease 0.45s;
  font-family: inherit;
  letter-spacing: -0.2px;
  text-decoration: none;
  display: inline-block;

  /* 연락하기 버튼이 펼쳐진 뒤에 따라 나타난다 */
  ${ContactBtn}[data-dot-state='waiting'] ~ & {
    opacity: 0;
    pointer-events: none;
    transition: none;
  }

  &:hover {
    background: ${p => p.$isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'};
    color: ${p => p.$isDark ? '#f5f5f7' : '#1d1d1f'};
    border-color: ${p => p.$isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.2)'};
  }

  @media (prefers-reduced-motion: reduce) {
    ${ContactBtn}[data-dot-state] ~ & {
      opacity: 1;
      pointer-events: auto;
    }
  }
`;

const translations = {
  ko: {
    thanks: '감사합니다',
    sub: '더 궁금한 점이 있다면 언제든 물어보세요',
    contact: '연락하기',
    github: 'GitHub',
  },
  en: {
    thanks: 'Thank You',
    sub: 'Feel free to ask if you have any questions',
    contact: 'Contact',
    github: 'GitHub',
  },
};

interface ThankYouCTAProps {
  onContactClick?: () => void;
  githubUrl?: string;
}

export default function ThankYouCTA({ onContactClick, githubUrl = 'https://github.com' }: ThankYouCTAProps) {
  const { isDark } = useTheme();
  const { language } = useLanguage();
  const t = translations[language];

  const [dotState, setDotState] = useState<DotState>('waiting');
  const sectionRef = useRef<HTMLElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  // 점이 내려앉은 프레임에 바로 펼친다.
  // (React 재렌더를 기다리면 점이 사라진 뒤 한두 프레임 빈 화면이 생겨서 속성을 직접 바꾼다)
  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;
    const onArrive = () => {
      btn.dataset.dotState = 'open';
      setDotState('open');
    };
    btn.addEventListener(DOT_ARRIVED_EVENT, onArrive);
    return () => btn.removeEventListener(DOT_ARRIVED_EVENT, onArrive);
  }, [onContactClick]);

  // 화면에서 완전히 벗어나면 다시 접어 두고(다시 오면 점이 또 내려앉는다),
  // 충분히 보이는데도 점이 오지 않으면 그냥 펼친다.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDotState('open');
      return;
    }

    const section = sectionRef.current;
    if (!section) return;

    let fallback: ReturnType<typeof setTimeout> | null = null;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          if (fallback) { clearTimeout(fallback); fallback = null; }
          setDotState('waiting');
          return;
        }
        if (entry.intersectionRatio >= 0.6 && !fallback) {
          fallback = setTimeout(() => setDotState('open'), 2400);
        }
      },
      { threshold: [0, 0.6] },
    );
    io.observe(section);

    return () => {
      io.disconnect();
      if (fallback) clearTimeout(fallback);
    };
  }, []);

  return (
    <Section ref={sectionRef} $isDark={isDark}>
      <Container>
        <ThankYouText $isDark={isDark}>{t.thanks}</ThankYouText>
        <SubText $isDark={isDark}>{t.sub}</SubText>
        {/* 키보드로 들어온 경우엔 점을 기다리지 않고 바로 펼친다 */}
        <ButtonRow onFocusCapture={() => setDotState('open')}>
          {onContactClick && (
            <ContactBtn
              ref={btnRef}
              id="dot-contact"
              data-dot-mode="center"
              data-dot-state={dotState}
              $isDark={isDark}
              onClick={onContactClick}
            >
              <span>{t.contact}</span>
            </ContactBtn>
          )}
          <GithubBtn
            $isDark={isDark}
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.github}
          </GithubBtn>
        </ButtonRow>
      </Container>
    </Section>
  );
}
