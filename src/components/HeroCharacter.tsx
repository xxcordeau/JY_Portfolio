'use client';

import styled, { keyframes } from 'styled-components';
import { useEffect, useRef, useState } from 'react';
import Model3D from './Model3D';
import { useLanguage } from '../contexts/LanguageContext';

/* 소개 오른쪽의 큰 캐릭터. 누르면 머리 위에 말풍선으로 한마디씩 한다.
   말 순서를 섞어 한 바퀴를 다 한 뒤에야 다시 섞는다. 그래서 같은 말이 자주 나오지 않는다.
   잠시 뒤 말풍선은 사라진다. */

const LINES = {
  ko: [
    '안녕하세요!',
    '허정연입니다',
    '프론트엔드 개발자예요',
    '디자인도 해요',
    '커버도 제가 만들었어요',
    '천천히 둘러보세요',
    '제가 궁금하세요?',
    '오른쪽 아래로 물어보세요',
  ],
  en: [
    'Hello!',
    "I'm JeongYeon",
    "I'm a frontend developer",
    'I design too',
    'I made the covers',
    'Take your time',
    'Curious about me?',
    'Ask me at the bottom right',
  ],
};

const SHOW_MS = 2500;

const pop = keyframes`
  from { opacity: 0; transform: translate(-50%, calc(-100% + 4px)); }
  to { opacity: 1; transform: translate(-50%, -100%); }
`;

const Wrap = styled.button`
  position: relative;
  display: block;
  width: 100%;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;

  &:focus-visible {
    outline: 2px solid var(--k-accent);
    outline-offset: 4px;
    border-radius: var(--k-radius-lg);
  }
`;

/* 발밑 그림자. 모델은 칸 높이의 약 93%를 차지해서 발바닥이 아래에서 3~4% 지점에 온다 */
const Shadow = styled.div`
  position: absolute;
  left: 50%;
  bottom: 0;
  width: 42%;
  height: 6%;
  border-radius: 50%;
  background: radial-gradient(closest-side, rgba(0, 0, 0, 0.32), rgba(0, 0, 0, 0.12) 55%, transparent);
  transform: translateX(-50%);
  pointer-events: none;

  :root[data-theme='dark'] & {
    background: radial-gradient(closest-side, rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.3) 55%, transparent);
  }
`;

/* 3D가 준비되기 전까지 보여 주는 이미지. 같은 조명/카메라로 찍어서 바뀌는 순간이 티 나지 않는다.
   lazy라서 지금 테마에서 숨겨진(display: none) 쪽은 받지 않는다 */
const Poster = styled.img<{ $theme: 'light' | 'dark'; $hide: boolean }>`
  position: absolute;
  inset: 0;
  display: ${p => (p.$theme === 'light' ? 'block' : 'none')};
  width: 100%;
  height: 100%;
  opacity: ${p => (p.$hide ? 0 : 1)};
  transition: opacity 0.4s var(--k-ease);
  pointer-events: none;
  user-select: none;

  :root[data-theme='dark'] & {
    display: ${p => (p.$theme === 'dark' ? 'block' : 'none')};
  }
`;

/* 머리 바로 위 가운데에 한 줄로 뜬다. 뒤가 살짝 비치는 반투명 */
const Say = styled.div`
  --say-bg: color-mix(in srgb, var(--k-bg-pop) 72%, transparent);
  position: absolute;
  top: 1%;
  left: 50%;
  padding: 8px 14px;
  background: var(--say-bg);
  -webkit-backdrop-filter: blur(12px) saturate(1.4);
  backdrop-filter: blur(12px) saturate(1.4);
  border-radius: 999px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  color: var(--k-text);
  font-size: var(--k-text-md);
  font-weight: 500;
  line-height: 1.4;
  white-space: nowrap;
  pointer-events: none;
  transform: translate(-50%, -100%);
  animation: ${pop} 0.18s var(--k-ease) both;

  /* 꼬리: 아래 가운데에서 머리를 가리킨다 */
  &::after {
    content: '';
    position: absolute;
    left: 50%;
    top: 100%;
    width: 14px;
    height: 7px;
    background: var(--say-bg);
    -webkit-backdrop-filter: blur(12px) saturate(1.4);
    backdrop-filter: blur(12px) saturate(1.4);
    clip-path: polygon(0 0, 100% 0, 50% 100%);
    transform: translateX(-50%);
  }
`;

const shuffle = (arr: number[]) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export default function HeroCharacter() {
  const { language } = useLanguage();
  const lines = LINES[language === 'en' ? 'en' : 'ko'];
  const [count, setCount] = useState(0); // 누른 횟수. 말풍선 애니메이션을 다시 재생하는 key로 쓴다
  const [index, setIndex] = useState(-1); // 지금 하는 말
  const [live, setLive] = useState(false); // 3D가 다 불러와졌는지
  const [showing, setShowing] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(timer.current), []);

  const bag = useRef<number[]>([]); // 이번 바퀴에 남은 말 번호

  const talk = () => {
    if (bag.current.length === 0) {
      const order = shuffle(lines.map((_, i) => i));
      // 바퀴가 바뀌는 순간 방금 한 말이 첫 번째로 오지 않게
      if (order[0] === index && order.length > 1) [order[0], order[1]] = [order[1], order[0]];
      bag.current = order;
    }
    setIndex(bag.current.shift()!);
    setCount(c => c + 1);
    setShowing(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setShowing(false), SHOW_MS);
  };

  const line = index >= 0 ? lines[index] : '';
  const label = language === 'en' ? 'Say hi' : '인사 듣기';

  return (
    <Wrap type="button" onClick={talk} aria-label={label}>
      <Shadow />
      <Poster $theme="light" $hide={live} src="/models/posters/girl-light.webp" alt="" width={480} height={480} loading="lazy" />
      <Poster $theme="dark" $hide={live} src="/models/posters/girl-dark.webp" alt="" width={480} height={480} loading="lazy" />
      <Model3D src="/models/hero-girl.glb" onReady={() => setLive(true)} />
      {showing && (
        <Say key={count} role="status">
          {line}
        </Say>
      )}
    </Wrap>
  );
}
