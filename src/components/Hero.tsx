import { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'motion/react';
import { Paintbrush, Eraser, Trash2, Palette, PenTool } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

const HeroSection = styled.section<{ $isDark: boolean }>`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 40px;
  text-align: center;
  background: ${props => props.$isDark ? '#000000' : '#ffffff'};
  transition: background 0.3s ease;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 0 20px;
  }
`;

const DrawingCanvas = styled.canvas<{ $isDrawingMode: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: ${props => props.$isDrawingMode ? 'crosshair' : 'default'};
  touch-action: ${props => props.$isDrawingMode ? 'none' : 'auto'};
  pointer-events: ${props => props.$isDrawingMode ? 'auto' : 'none'};
  z-index: 0;
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 2;
  pointer-events: none;
`;

const Title = styled.h1<{ $isDark: boolean }>`
  font-size: 80px;
  font-weight: 600;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  margin: 0;
  letter-spacing: -2px;
  line-height: 1.1;
  transition: color 0.3s ease;

  @media (max-width: 768px) {
    font-size: 48px;
    letter-spacing: -1px;
  }
`;

const AnimatedChar = styled(motion.span)<{ $isDark: boolean }>`
  display: inline-block;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
`;

const Subtitle = styled.p<{ $isDark: boolean }>`
  font-size: 24px;
  color: ${props => props.$isDark ? '#86868b' : '#86868b'};
  margin: 20px 0 0 0;
  font-weight: 400;
  letter-spacing: -0.5px;
  transition: color 0.3s ease;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const Description = styled(motion.div)<{ $isDark: boolean }>`
  font-size: 18px;
  color: ${props => props.$isDark ? '#a1a1a6' : '#1d1d1f'};
  max-width: 600px;
  margin: 40px auto 0;
  line-height: 1.6;
  font-weight: 400;
  letter-spacing: -0.3px;
  transition: color 0.3s ease;
  cursor: default;

  @media (max-width: 768px) {
    font-size: 16px;
    margin-top: 30px;
  }
`;

const AnimatedDescChar = styled(motion.span)<{ $isDark: boolean }>`
  display: inline-block;
  color: ${props => props.$isDark ? '#a1a1a6' : '#1d1d1f'};
  transition: color 0.3s ease;
`;

const DrawingTools = styled.div<{ $isDark: boolean; $isVisible: boolean }>`
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%) translateY(${props => props.$isVisible ? '0' : '150px'});
  background: ${props => props.$isDark ? 'rgba(29, 29, 31, 0.8)' : 'rgba(255, 255, 255, 0.8)'};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 16px 24px;
  display: flex;
  gap: 16px;
  align-items: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid ${props => props.$isDark ? 'rgba(245, 245, 247, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  z-index: 100;
  pointer-events: ${props => props.$isVisible ? 'auto' : 'none'};
  opacity: ${props => props.$isVisible ? '1' : '0'};
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  @media (max-width: 768px) {
    bottom: 20px;
    padding: 12px 16px;
    gap: 12px;
    flex-wrap: wrap;
    max-width: calc(100% - 40px);
  }
`;

const DrawingModeToggle = styled.button<{ $isDark: boolean; $isDrawingMode: boolean; $isVisible: boolean }>`
  position: absolute;
  top: 100px;
  right: 40px;
  background: ${props => props.$isDrawingMode
    ? (props.$isDark ? '#f5f5f7' : '#1d1d1f')
    : (props.$isDark ? 'rgba(29, 29, 31, 0.8)' : 'rgba(255, 255, 255, 0.8)')};
  color: ${props => props.$isDrawingMode
    ? (props.$isDark ? '#1d1d1f' : '#f5f5f7')
    : (props.$isDark ? '#f5f5f7' : '#1d1d1f')};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid ${props => props.$isDark ? 'rgba(245, 245, 247, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  border-radius: 12px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  z-index: 10;
  pointer-events: ${props => props.$isVisible ? 'auto' : 'none'};
  opacity: ${props => props.$isVisible ? '1' : '0'};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }

  svg {
    width: 18px;
    height: 18px;
  }

  @media (max-width: 768px) {
    top: 80px;
    right: 20px;
    padding: 10px 16px;
    font-size: 13px;
  }
`;

const ToolButton = styled.button<{ $isDark: boolean; $active?: boolean }>`
  background: ${props => props.$active
    ? (props.$isDark ? '#f5f5f7' : '#1d1d1f')
    : 'transparent'};
  color: ${props => props.$active
    ? (props.$isDark ? '#1d1d1f' : '#f5f5f7')
    : (props.$isDark ? '#f5f5f7' : '#1d1d1f')};
  border: none;
  border-radius: 12px;
  padding: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.$isDark ? 'rgba(245, 245, 247, 0.2)' : 'rgba(29, 29, 31, 0.1)'};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const ColorPicker = styled.input`
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  background: transparent;

  &::-webkit-color-swatch-wrapper {
    padding: 0;
    border-radius: 12px;
  }

  &::-webkit-color-swatch {
    border: 2px solid rgba(0, 0, 0, 0.1);
    border-radius: 12px;
  }
`;

const Slider = styled.input<{ $isDark: boolean }>`
  -webkit-appearance: none;
  width: 100px;
  height: 6px;
  border-radius: 3px;
  background: ${props => props.$isDark ? 'rgba(245, 245, 247, 0.2)' : 'rgba(29, 29, 31, 0.1)'};
  outline: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
    cursor: pointer;
    border: none;
  }

  @media (max-width: 768px) {
    width: 80px;
  }
`;

const DrawingHint = styled.p<{ $isDark: boolean; $visible: boolean }>`
  position: absolute;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 15px;
  color: ${props => props.$isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.2)'};
  letter-spacing: 0.5px;
  font-weight: 400;
  pointer-events: none;
  opacity: ${props => props.$visible ? 1 : 0};
  transition: opacity 0.5s ease;
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 13px;
    bottom: 80px;
  }
`;

const translations = {
  ko: {
    title: '안녕하세요',
    subtitle: '디자인과 코드를 잇는 프론트엔드 개발자',
    description: '감각적인 디자인과 견고한 구조로 아름다움과 기능이 공존하는 인터페이스를 만듭니다.',
    drawingHint: 'Try doodling on this blank canvas!'
  },
  en: {
    title: 'Hello',
    subtitle: 'Frontend Developer Bridging Design and Code',
    description: 'Creating interfaces where beauty and functionality coexist through sophisticated design and robust architecture.',
    drawingHint: 'Try doodling on this blank canvas!'
  }
};

const charVariants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.5,
    rotate: -10
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    rotate: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.5,
      ease: [0.6, 0.05, 0.01, 0.9],
      type: 'spring',
      stiffness: 100
    }
  })
};

const descContainerVariants = {
  rest: {},
  hover: {
    transition: {
      staggerChildren: 0.02
    }
  }
};

const descCharVariants = {
  rest: {
    y: 0
  },
  hover: {
    y: [0, -8, 0, 8, 0, -5, 0, 3, 0],
    transition: {
      duration: 0.6,
      ease: 'easeInOut'
    }
  }
};

export default function Hero() {
  const { isDark } = useTheme();
  const { language } = useLanguage();
  const t = translations[language];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'brush' | 'eraser'>('brush');
  const [color, setColor] = useState('#3b82f6');
  const [brushSize, setBrushSize] = useState(3);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 캔버스 크기 설정
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    updateCanvasSize();

    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateCanvasSize, 150);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      {
        threshold: 0.1, // 10% 이상 보이면 활성화
      }
    );

    observer.observe(section);

    return () => {
      observer.unobserve(section);
    };
  }, []);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (tool === 'brush') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = color;
    } else {
      ctx.globalCompositeOperation = 'destination-out';
    }

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const renderAnimatedText = (text: string) => {
    return text.split('').map((char, index) => (
      <AnimatedChar
        key={`${char}-${index}`}
        $isDark={isDark}
        custom={index}
        initial="hidden"
        animate="visible"
        variants={charVariants}
      >
        {char === ' ' ? '\u00A0' : char}
      </AnimatedChar>
    ));
  };

  const renderWavyText = (text: string) => {
    return text.split('').map((char, index) => (
      <AnimatedDescChar
        key={`desc-${char}-${index}`}
        $isDark={isDark}
        variants={descCharVariants}
      >
        {char === ' ' ? '\u00A0' : char}
      </AnimatedDescChar>
    ));
  };

  return (
    <HeroSection ref={sectionRef} $isDark={isDark}>
      <DrawingCanvas
        ref={canvasRef}
        $isDrawingMode={isDrawingMode}
        aria-label="Drawing canvas"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />

      <ContentWrapper>
        <Title $isDark={isDark}>
          {renderAnimatedText(t.title)}
        </Title>
        <Subtitle $isDark={isDark}>{t.subtitle}</Subtitle>
        <Description
          $isDark={isDark}
          initial="rest"
          whileHover="hover"
          variants={descContainerVariants}
        >
          {renderWavyText(t.description)}
        </Description>
      </ContentWrapper>

      <DrawingHint $isDark={isDark} $visible={!isDrawingMode}>
        {t.drawingHint}
      </DrawingHint>

      <DrawingModeToggle
        $isDark={isDark}
        $isDrawingMode={isDrawingMode}
        $isVisible={isVisible}
        onClick={() => setIsDrawingMode(!isDrawingMode)}
      >
        <PenTool />
        {isDrawingMode ? (language === 'ko' ? '그리기 종료' : 'Exit Drawing') : (language === 'ko' ? '그리기 시작' : 'Start Drawing')}
      </DrawingModeToggle>

      <DrawingTools $isDark={isDark} $isVisible={isVisible && isDrawingMode}>
        <ToolButton
          $isDark={isDark}
          $active={tool === 'brush'}
          onClick={() => setTool('brush')}
          title="브러시"
        >
          <Paintbrush />
        </ToolButton>

        <ToolButton
          $isDark={isDark}
          $active={tool === 'eraser'}
          onClick={() => setTool('eraser')}
          title="지우개"
        >
          <Eraser />
        </ToolButton>

        <ColorPicker
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          title="색상 선택"
        />

        <Slider
          $isDark={isDark}
          type="range"
          min="1"
          max="20"
          value={brushSize}
          onChange={(e) => setBrushSize(Number(e.target.value))}
          title={`브러시 크기: ${brushSize}`}
        />

        <ToolButton
          $isDark={isDark}
          onClick={clearCanvas}
          title="전체 지우기"
        >
          <Trash2 />
        </ToolButton>
      </DrawingTools>
    </HeroSection>
  );
}
