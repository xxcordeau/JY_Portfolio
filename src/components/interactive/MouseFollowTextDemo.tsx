import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const DemoContainer = styled.div<{ $isDark: boolean }>`
  background: ${props => props.$isDark ? '#0a0a0a' : '#f5f5f7'};
  border-radius: 16px;
  padding: 40px;
  margin: 40px 0;
  transition: background 0.3s ease;
  min-height: 500px;
  position: relative;
  overflow: hidden;
  cursor: none;

  @media (max-width: 768px) {
    padding: 24px;
    margin: 24px 0;
    min-height: 400px;
  }
`;

const Instructions = styled.p`
  font-size: 14px;
  color: #86868b;
  text-align: center;
  margin-bottom: 24px;
  position: relative;
  z-index: 10;
`;

const FollowText = styled.div<{ $isDark: boolean; $x: number; $y: number }>`
  position: absolute;
  left: ${props => props.$x}px;
  top: ${props => props.$y}px;
  font-size: 32px;
  font-weight: 700;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  pointer-events: none;
  transform: translate(-50%, -50%);
  transition: left 0.1s ease-out, top 0.1s ease-out;
  text-shadow: 0 4px 12px ${props => props.$isDark ? 'rgba(245, 245, 247, 0.3)' : 'rgba(29, 29, 31, 0.2)'};
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const Trail = styled.div<{ $isDark: boolean; $x: number; $y: number; $delay: number }>`
  position: absolute;
  left: ${props => props.$x}px;
  top: ${props => props.$y}px;
  font-size: 24px;
  font-weight: 600;
  color: ${props => props.$isDark ? '#86868b' : '#86868b'};
  pointer-events: none;
  transform: translate(-50%, -50%);
  opacity: ${props => 1 - props.$delay * 0.2};
  transition: left ${props => 0.15 + props.$delay * 0.05}s ease-out,
              top ${props => 0.15 + props.$delay * 0.05}s ease-out;
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const CustomCursor = styled.div<{ $isDark: boolean; $x: number; $y: number }>`
  position: absolute;
  left: ${props => props.$x}px;
  top: ${props => props.$y}px;
  width: 20px;
  height: 20px;
  border: 2px solid ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  border-radius: 50%;
  pointer-events: none;
  transform: translate(-50%, -50%);
  transition: left 0.05s ease-out, top 0.05s ease-out;

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 4px;
    height: 4px;
    background: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
    border-radius: 50%;
  }
`;

const FloatingEmoji = styled.div<{ $x: number; $y: number; $index: number }>`
  position: absolute;
  left: ${props => props.$x}%;
  top: ${props => props.$y}%;
  font-size: 48px;
  opacity: 0.3;
  animation: float ${props => 3 + props.$index * 0.5}s ease-in-out infinite;
  animation-delay: ${props => props.$index * 0.2}s;
  pointer-events: none;

  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-20px);
    }
  }

  @media (max-width: 768px) {
    font-size: 32px;
  }
`;

interface MouseFollowTextDemoProps {
  isDark: boolean;
  language: 'ko' | 'en';
}

const translations = {
  ko: {
    instruction: '마우스를 움직여보세요!',
    follow: '따라와요'
  },
  en: {
    instruction: 'Move your mouse!',
    follow: 'Follow Me'
  }
};

const emojis = ['✨', '🎨', '💫', '⭐', '🌟'];
const emojiPositions = [
  { x: 20, y: 30 },
  { x: 80, y: 20 },
  { x: 15, y: 70 },
  { x: 85, y: 65 },
  { x: 50, y: 50 },
];

export default function MouseFollowTextDemo({ isDark, language }: MouseFollowTextDemoProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [trails, setTrails] = useState<Array<{ x: number; y: number; id: string }>>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const trailIdCounter = useRef(0);
  const t = translations[language];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setMousePos({ x, y });

      // Add trail with unique ID
      setTrails(prev => {
        trailIdCounter.current += 1;
        const newTrails = [{ x, y, id: `trail-${trailIdCounter.current}-${Date.now()}` }, ...prev.slice(0, 4)];
        return newTrails;
      });
    };

    container.addEventListener('mousemove', handleMouseMove);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <DemoContainer ref={containerRef} $isDark={isDark}>
      <Instructions>{t.instruction}</Instructions>

      {emojiPositions.map((pos, index) => (
        <FloatingEmoji key={index} $x={pos.x} $y={pos.y} $index={index}>
          {emojis[index]}
        </FloatingEmoji>
      ))}

      {trails.map((trail, index) => (
        <Trail
          key={trail.id}
          $isDark={isDark}
          $x={trail.x}
          $y={trail.y}
          $delay={index}
        >
          {t.follow}
        </Trail>
      ))}

      <FollowText $isDark={isDark} $x={mousePos.x} $y={mousePos.y}>
        {t.follow}
      </FollowText>

      <CustomCursor $isDark={isDark} $x={mousePos.x} $y={mousePos.y} />
    </DemoContainer>
  );
}
