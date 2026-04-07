import { useState } from 'react';
import styled from 'styled-components';
import { Highlighter, Trash2 } from 'lucide-react';

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

const Instructions = styled.p`
  font-size: 14px;
  color: #86868b;
  margin-bottom: 24px;
  text-align: center;
`;

const ColorPalette = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  justify-content: center;
  flex-wrap: wrap;
`;

const ColorButton = styled.button<{ $color: string; $active: boolean }>`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  border: 3px solid ${props => props.$active ? '#1d1d1f' : 'transparent'};
  background: ${props => props.$color};
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: scale(1.1);
  }
`;

const TextContainer = styled.div<{ $isDark: boolean }>`
  background: ${props => props.$isDark ? '#1d1d1f' : '#ffffff'};
  border-radius: 12px;
  padding: 32px;
  font-size: 16px;
  line-height: 1.8;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  user-select: text;
  min-height: 300px;

  @media (max-width: 768px) {
    padding: 24px;
    font-size: 15px;
  }
`;

const Highlight = styled.mark<{ $color: string }>`
  background: ${props => props.$color};
  padding: 2px 0;
  border-radius: 3px;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.7;
  }
`;

const ClearButton = styled.button<{ $isDark: boolean }>`
  display: block;
  margin: 24px auto 0;
  padding: 10px 20px;
  border-radius: 10px;
  border: 1px solid ${props => props.$isDark ? '#2d2d2d' : '#d2d2d7'};
  background: ${props => props.$isDark ? '#1d1d1f' : '#ffffff'};
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  margin-left: auto;
  margin-right: auto;

  &:hover {
    opacity: 0.8;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

interface TextHighlightDemoProps {
  isDark: boolean;
  language: 'ko' | 'en';
}

const colors = [
  '#FFE066', // Yellow
  '#66D9EF', // Cyan
  '#A6E22E', // Green
  '#F92672', // Pink
  '#AE81FF', // Purple
  '#FD971F', // Orange
];

const sampleText = {
  ko: `디자인 시스템은 단순히 컴포넌트 라이브러리가 아닙니다. 조직 전체가 일관된 제품 경험을 만들기 위한 공통 언어이자 도구입니다.

좋은 디자인 시스템은 다음과 같은 특징을 가집니다: 재사용 가능한 컴포넌트, 명확한 가이드라인, 접근성 준수, 그리고 지속적인 진화.

텍스트를 드래그하여 하이라이트해보세요. 다양한 색상으로 중요한 내용을 표시할 수 있습니다. 하이라이트된 텍스트를 클릭하면 제거됩니다.`,
  en: `A design system is not just a component library. It's a common language and tool for the entire organization to create a consistent product experience.

A good design system has the following characteristics: reusable components, clear guidelines, accessibility compliance, and continuous evolution.

Try highlighting text by dragging. You can mark important content with various colors. Click on highlighted text to remove it.`
};

const translations = {
  ko: {
    instruction: '텍스트를 드래그하여 선택하고 원하는 색상을 클릭하세요',
    clear: '모든 하이라이트 제거'
  },
  en: {
    instruction: 'Select text by dragging and click a color to highlight',
    clear: 'Clear All Highlights'
  }
};

export default function TextHighlightDemo({ isDark, language }: TextHighlightDemoProps) {
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [highlights, setHighlights] = useState<Array<{ id: number; color: string; text: string }>>([]);
  const t = translations[language];

  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (!selection || selection.toString().trim() === '') return;

    const range = selection.getRangeAt(0);
    const selectedText = selection.toString();

    const mark = document.createElement('mark');
    mark.style.backgroundColor = selectedColor;
    mark.style.padding = '2px 0';
    mark.style.borderRadius = '3px';
    mark.style.cursor = 'pointer';
    mark.dataset.highlightId = String(Date.now());
    
    const newHighlight = {
      id: Date.now(),
      color: selectedColor,
      text: selectedText
    };

    mark.addEventListener('click', () => {
      const parent = mark.parentNode;
      if (parent) {
        parent.replaceChild(document.createTextNode(mark.textContent || ''), mark);
        setHighlights(prev => prev.filter(h => h.id !== newHighlight.id));
      }
    });

    try {
      range.surroundContents(mark);
      setHighlights(prev => [...prev, newHighlight]);
    } catch (e) {
      // Handle complex selections
      console.log('Complex selection detected');
    }

    selection.removeAllRanges();
  };

  const clearAllHighlights = () => {
    const marks = document.querySelectorAll('[data-highlight-id]');
    marks.forEach(mark => {
      const parent = mark.parentNode;
      if (parent) {
        parent.replaceChild(document.createTextNode(mark.textContent || ''), mark);
      }
    });
    setHighlights([]);
  };

  return (
    <DemoContainer $isDark={isDark}>
      <Instructions>{t.instruction}</Instructions>
      
      <ColorPalette>
        {colors.map(color => (
          <ColorButton
            key={color}
            $color={color}
            $active={selectedColor === color}
            onClick={() => setSelectedColor(color)}
            aria-label={`Select ${color} highlight color`}
          />
        ))}
      </ColorPalette>

      <TextContainer 
        $isDark={isDark}
        onMouseUp={handleMouseUp}
      >
        {sampleText[language]}
      </TextContainer>

      {highlights.length > 0 && (
        <ClearButton $isDark={isDark} onClick={clearAllHighlights}>
          <Trash2 />
          {t.clear}
        </ClearButton>
      )}
    </DemoContainer>
  );
}
