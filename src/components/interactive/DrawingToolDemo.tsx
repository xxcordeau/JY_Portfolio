import { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { Pencil, Eraser, Download, Trash2 } from 'lucide-react';

const DemoContainer = styled.div<{ $isDark: boolean }>`
  background: ${props => props.$isDark ? '#0a0a0a' : '#f5f5f7'};
  border-radius: 16px;
  padding: 40px;
  margin: 40px 0;
  transition: background 0.3s ease;

  @media (max-width: 768px) {
    padding: 24px;
    margin: 24px 0;
  }
`;

const Controls = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  align-items: center;
`;

const ToolButton = styled.button<{ $isDark: boolean; $active?: boolean }>`
  padding: 10px;
  border-radius: 10px;
  border: 1px solid ${props => props.$isDark ? '#2d2d2d' : '#d2d2d7'};
  background: ${props => props.$active 
    ? props.$isDark ? '#f5f5f7' : '#1d1d1f'
    : props.$isDark ? '#1d1d1f' : '#ffffff'};
  color: ${props => props.$active
    ? props.$isDark ? '#1d1d1f' : '#f5f5f7'
    : props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.8;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const ColorPicker = styled.input`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  padding: 0;

  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  &::-webkit-color-swatch {
    border-radius: 8px;
    border: 2px solid #d2d2d7;
  }
`;

const SizeControl = styled.div<{ $isDark: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: ${props => props.$isDark ? '#1d1d1f' : '#ffffff'};
  border-radius: 10px;
  border: 1px solid ${props => props.$isDark ? '#2d2d2d' : '#d2d2d7'};

  label {
    font-size: 13px;
    color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
    font-weight: 500;
  }

  input[type="range"] {
    width: 100px;
    cursor: pointer;
  }
`;

const CanvasContainer = styled.div<{ $isDark: boolean }>`
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background: ${props => props.$isDark ? '#1d1d1f' : '#ffffff'};
  border: 2px solid ${props => props.$isDark ? '#2d2d2d' : '#d2d2d7'};
  box-shadow: 0 4px 12px ${props => props.$isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.1)'};
`;

const Canvas = styled.canvas`
  display: block;
  cursor: crosshair;
  width: 100%;
  height: auto;
`;

interface DrawingToolDemoProps {
  isDark: boolean;
  language: 'ko' | 'en';
}

const translations = {
  ko: {
    draw: '그리기',
    erase: '지우기',
    clear: '전체 지우기',
    download: '다운로드',
    size: '크기'
  },
  en: {
    draw: 'Draw',
    erase: 'Erase',
    clear: 'Clear All',
    download: 'Download',
    size: 'Size'
  }
};

export default function DrawingToolDemo({ isDark, language }: DrawingToolDemoProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'draw' | 'erase'>('draw');
  const [color, setColor] = useState('#000000');
  const [size, setSize] = useState(3);
  const t = translations[language];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 800;
    canvas.height = 500;

    // Set white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (tool === 'erase') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = size * 3;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = color;
      ctx.lineWidth = size;
    }

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
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

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'drawing.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <DemoContainer $isDark={isDark}>
      <Controls>
        <ToolButton
          $isDark={isDark}
          $active={tool === 'draw'}
          onClick={() => setTool('draw')}
          title={t.draw}
        >
          <Pencil />
        </ToolButton>
        <ToolButton
          $isDark={isDark}
          $active={tool === 'erase'}
          onClick={() => setTool('erase')}
          title={t.erase}
        >
          <Eraser />
        </ToolButton>
        <ColorPicker
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
        <SizeControl $isDark={isDark}>
          <label>{t.size}</label>
          <input
            type="range"
            min="1"
            max="20"
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
          />
        </SizeControl>
        <ToolButton $isDark={isDark} onClick={clearCanvas} title={t.clear}>
          <Trash2 />
        </ToolButton>
        <ToolButton $isDark={isDark} onClick={downloadImage} title={t.download}>
          <Download />
        </ToolButton>
      </Controls>

      <CanvasContainer $isDark={isDark}>
        <Canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
      </CanvasContainer>
    </DemoContainer>
  );
}
