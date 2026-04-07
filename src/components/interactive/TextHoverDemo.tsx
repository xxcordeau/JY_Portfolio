import styled, { keyframes } from 'styled-components';

const DemoContainer = styled.div<{ $isDark: boolean }>`
  background: ${props => props.$isDark ? '#0a0a0a' : '#f5f5f7'};
  border-radius: 16px;
  padding: 60px 40px;
  margin: 40px 0;
  transition: background 0.3s ease;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 40px;

  @media (max-width: 768px) {
    padding: 40px 24px;
    margin: 24px 0;
    gap: 30px;
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const HoverText1 = styled.h2<{ $isDark: boolean }>`
  font-size: 48px;
  font-weight: 700;
  background: linear-gradient(
    90deg,
    ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'} 0%,
    ${props => props.$isDark ? '#FFD700' : '#FF6B6B'} 50%,
    ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'} 100%
  );
  background-size: 200% auto;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  cursor: pointer;
  transition: all 0.5s ease;
  text-align: center;

  &:hover {
    animation: ${shimmer} 2s linear infinite;
  }

  @media (max-width: 768px) {
    font-size: 32px;
  }
`;

const HoverText2 = styled.h2<{ $isDark: boolean }>`
  font-size: 48px;
  font-weight: 700;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  cursor: pointer;
  position: relative;
  display: inline-block;
  text-align: center;

  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 0;
    height: 4px;
    background: linear-gradient(90deg, #FF6B6B, #4ECDC4, #45B7D1);
    transition: width 0.4s ease;
    border-radius: 2px;
  }

  &:hover::after {
    width: 100%;
  }

  @media (max-width: 768px) {
    font-size: 32px;
  }
`;

const HoverText3 = styled.h2<{ $isDark: boolean }>`
  font-size: 48px;
  font-weight: 700;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  cursor: pointer;
  position: relative;
  padding: 12px 24px;
  text-align: center;
  transition: all 0.3s ease;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(45deg, #FF6B6B, #4ECDC4, #45B7D1, #FFD93D);
    border-radius: 12px;
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: -1;
    filter: blur(20px);
  }

  &:hover {
    color: #ffffff;
    transform: translateY(-4px);
    text-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    
    &::before {
      opacity: 0.8;
    }
  }

  @media (max-width: 768px) {
    font-size: 32px;
    padding: 10px 20px;
  }
`;

const WordContainer = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
`;

const Word = styled.span<{ $isDark: boolean; $delay: number }>`
  font-size: 42px;
  font-weight: 700;
  color: ${props => props.$isDark ? '#86868b' : '#86868b'};
  cursor: pointer;
  transition: all 0.3s ease;
  transition-delay: ${props => props.$delay}s;

  &:hover {
    color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
    transform: scale(1.2) rotate(-5deg);
  }

  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

interface TextHoverDemoProps {
  isDark: boolean;
  language: 'ko' | 'en';
}

const demoTexts = {
  ko: {
    text1: '마우스를 올려보세요',
    text2: '인터랙티브 효과',
    text3: '빛나는 텍스트',
    words: ['디자인', '은', '중요', '합니다']
  },
  en: {
    text1: 'Hover Over Me',
    text2: 'Interactive Effect',
    text3: 'Glowing Text',
    words: ['Design', 'Matters', 'A', 'Lot']
  }
};

export default function TextHoverDemo({ isDark, language }: TextHoverDemoProps) {
  const texts = demoTexts[language];

  return (
    <DemoContainer $isDark={isDark}>
      <HoverText1 $isDark={isDark}>
        {texts.text1}
      </HoverText1>

      <HoverText2 $isDark={isDark}>
        {texts.text2}
      </HoverText2>

      <HoverText3 $isDark={isDark}>
        {texts.text3}
      </HoverText3>

      <WordContainer>
        {texts.words.map((word, index) => (
          <Word key={index} $isDark={isDark} $delay={index * 0.05}>
            {word}
          </Word>
        ))}
      </WordContainer>
    </DemoContainer>
  );
}
