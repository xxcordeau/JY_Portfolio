'use client';

import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { ChevronLeft } from 'lucide-react';
import { useChatbot } from '../hooks/useChatbot';
import type { ChatCategory, ChatQuestion } from '../data/chatbotData';
import { useLanguage } from '../contexts/LanguageContext';

const EMAIL = 'qazseeszaq3219@gmail.com';

/* 바깥을 누르면 닫히도록 깔아 두는 투명한 판. 채팅은 페이지를 가리지 않게 어둡게 하지 않는다 */
const ClickAway = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9998;
`;

const Dock = styled.div`
  position: fixed;
  right: var(--k-space-6);
  bottom: var(--k-space-6);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 14px;

  @media (max-width: 768px) {
    left: var(--k-space-4);
    right: var(--k-space-4);
    bottom: var(--k-space-4);
    align-items: stretch;

    & > button { align-self: flex-end; }
  }
`;

const Panel = styled.div`
  width: 360px;
  max-height: min(520px, calc(100dvh - 120px));
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--k-bg-pop);
  border: 1px solid var(--k-line);
  border-radius: var(--k-radius-lg);
  box-shadow: var(--k-shadow-pop);
  color: var(--k-text);

  @media (max-width: 768px) {
    width: 100%;
    max-height: min(480px, calc(100dvh - 140px));
  }
`;

/* 얼굴이 말하는 것처럼 보이게 패널 아래에 꼬리를 단다.
   패널은 안쪽 스크롤 때문에 overflow: hidden이라 꼬리는 바깥 상자에 둔다 */
const Speech = styled.div`
  position: relative;
  min-width: 0;
  transform-origin: bottom right;
  animation: k-enter 0.2s var(--k-ease);

  &::after {
    content: '';
    position: absolute;
    right: 24px; /* 얼굴(64px) 가운데 */
    bottom: -8px;
    width: 16px;
    height: 16px;
    background: var(--k-bg-pop);
    border-right: 1px solid var(--k-line);
    border-bottom: 1px solid var(--k-line);
    border-bottom-right-radius: 3px;
    transform: rotate(45deg);
  }
`;

const PanelHead = styled.div`
  flex: none;
  display: flex;
  align-items: center;
  gap: var(--k-space-1);
  height: 52px;
  padding: 0 var(--k-space-2) 0 var(--k-space-4);
  border-bottom: 1px solid var(--k-line);

  h3 {
    flex: 1;
    min-width: 0;
    font-size: 15px;
    font-weight: 700;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const GhostIcon = styled.button`
  flex: none;
  width: var(--k-control-sm);
  height: var(--k-control-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: var(--k-radius);
  background: transparent;
  color: var(--k-text-sub);
  cursor: pointer;
  transition: background 0.15s var(--k-ease), color 0.15s var(--k-ease);

  svg { width: 16px; height: 16px; }
  &:hover { background: var(--k-bg-hover); color: var(--k-text); }
`;

const BackIcon = styled(GhostIcon)`
  margin-left: calc(var(--k-space-2) * -1);
`;

const Thread = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
  padding: var(--k-space-4);
  display: flex;
  flex-direction: column;
  gap: var(--k-space-2);
`;

const Bubble = styled.div<{ $from: 'bot' | 'user' }>`
  max-width: 85%;
  align-self: ${p => (p.$from === 'user' ? 'flex-end' : 'flex-start')};
  padding: 10px 14px;
  border-radius: var(--k-radius-lg);
  background: ${p => (p.$from === 'user' ? 'var(--k-accent)' : 'var(--k-bg-sub)')};
  color: ${p => (p.$from === 'user' ? 'var(--k-on-accent)' : 'var(--k-text)')};
  font-size: var(--k-text-md);
  line-height: 1.6;
  white-space: pre-line;
  word-break: keep-all;
  overflow-wrap: anywhere;
  animation: k-enter 0.2s var(--k-ease) both;
`;

const Chips = styled.div<{ $stack?: boolean }>`
  display: flex;
  flex-wrap: wrap;
  flex-direction: ${p => (p.$stack ? 'column' : 'row')};
  align-items: flex-start;
  gap: var(--k-space-2);
  margin-top: var(--k-space-1);
`;

/* 빠른 답: 작은 보조 버튼. 질문 문장이 길면 줄바꿈되게 높이는 최소값만 둔다 */
const Chip = styled.button`
  max-width: 100%;
  min-height: var(--k-control-sm);
  padding: 6px var(--k-space-3);
  border: 1px solid var(--k-line-strong);
  border-radius: var(--k-radius);
  background: var(--k-bg);
  color: var(--k-text);
  font: inherit;
  font-size: var(--k-text-sm);
  font-weight: 600;
  line-height: 1.5;
  text-align: left;
  word-break: keep-all;
  cursor: pointer;
  transition: background 0.15s var(--k-ease);

  &:hover { background: var(--k-bg-hover); }
`;

const EmailLink = styled.button`
  display: inline;
  padding: 0;
  border: none;
  background: none;
  font: inherit;
  font-weight: 600;
  color: inherit;
  text-decoration: underline;
  text-decoration-color: var(--k-line-strong);
  text-underline-offset: 3px;
  overflow-wrap: anywhere;
  cursor: pointer;

  &:hover { text-decoration-color: var(--k-text); }
`;

/* 평소에는 동그라미 없이 얼굴만 떠 있고, 패널을 열면 검은 닫기 버튼이 된다 */
const Launcher = styled.button`
  position: relative;
  width: 64px;
  height: 64px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: transparent;
  cursor: pointer;
  transition: transform 0.2s var(--k-ease);

  &:hover { transform: scale(1.06); }
  &:active { transform: scale(0.96); }
`;

/* 버튼 속 얼굴. 움직이지 않으니 3D 대신 같은 조명으로 찍어 둔 이미지를 쓴다(7KB).
   패널을 열어도 그대로 있어서 얼굴이 말하는 것처럼 보인다 */
const Face = styled.img<{ $theme: 'light' | 'dark' }>`
  display: ${p => (p.$theme === 'light' ? 'block' : 'none')};
  width: 100%;
  height: 100%;
  pointer-events: none;
  user-select: none;

  :root[data-theme='dark'] & {
    display: ${p => (p.$theme === 'dark' ? 'block' : 'none')};
  }
`;

interface ChatbotProps {
  onContactClick: () => void;
}

type ViewMode = 'categories' | 'questions' | 'answer';

export default function Chatbot({ onContactClick }: ChatbotProps) {
  const { language } = useLanguage();
  const { categories: chatbotData } = useChatbot();
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('categories');
  const [selectedCategory, setSelectedCategory] = useState<ChatCategory | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<ChatQuestion | null>(null);
  const threadRef = useRef<HTMLDivElement>(null);

  const translations = {
    ko: {
      welcome: '안녕하세요, 허정연이에요! 시각디자인을 전공한 프론트엔드 개발자예요. 궁금한 걸 골라 주시면 제가 답해 드릴게요.',
      pickQuestion: '어떤 게 궁금하세요?',
      chatTitle: '허정연',
      open: '질문하기 열기',
      close: '닫기',
      back: '뒤로',
    },
    en: {
      welcome: "Hi, I'm JeongYeon! I'm a frontend developer with a visual design background. Pick anything you're curious about and I'll answer.",
      pickQuestion: 'What would you like to know?',
      chatTitle: 'Heo JeongYeon',
      open: 'Open chat',
      close: 'Close',
      back: 'Back',
    }
  };

  const t = translations[language];

  const handleCategoryClick = (category: ChatCategory) => {
    setSelectedCategory(category);
    setViewMode('questions');
  };

  const handleQuestionClick = (question: ChatQuestion) => {
    // 액션이 있는 경우 즉시 실행
    if (question.action === 'openContact') {
      onContactClick();
      handleClose();
      return;
    }

    setSelectedQuestion(question);
    setViewMode('answer');
  };

  const handleBack = () => {
    if (viewMode === 'answer') {
      setViewMode('questions');
      setSelectedQuestion(null);
    } else if (viewMode === 'questions') {
      setViewMode('categories');
      setSelectedCategory(null);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    // 초기 상태로 리셋
    setViewMode('categories');
    setSelectedCategory(null);
    setSelectedQuestion(null);
  };

  // 답이 바뀌면 처음부터 읽게 맨 위로
  useEffect(() => {
    threadRef.current?.scrollTo({ top: 0 });
  }, [viewMode, selectedCategory, selectedQuestion]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // 답을 보는 중에도 위에는 고른 주제를 보여 준다. 질문 문장은 말풍선으로 보인다
  const getHeaderTitle = () => {
    if (viewMode !== 'categories' && selectedCategory) {
      return selectedCategory.title[language];
    }
    return t.chatTitle;
  };

  const renderContent = () => {
    if (viewMode === 'categories') {
      return (
        <>
          <Bubble $from="bot">{t.welcome}</Bubble>
          <Chips>
            {chatbotData.map((category) => (
              <Chip key={category.id} type="button" onClick={() => handleCategoryClick(category)}>
                {category.title[language]}
              </Chip>
            ))}
          </Chips>
        </>
      );
    }

    if (viewMode === 'questions' && selectedCategory) {
      return (
        <>
          <Bubble $from="user">{selectedCategory.title[language]}</Bubble>
          <Bubble $from="bot">{t.pickQuestion}</Bubble>
          <Chips $stack>
            {selectedCategory.questions.map((question, index) => (
              <Chip key={index} type="button" onClick={() => handleQuestionClick(question)}>
                {question.question[language]}
              </Chip>
            ))}
          </Chips>
        </>
      );
    }

    if (viewMode === 'answer' && selectedQuestion) {
      const answer = selectedQuestion.answer[language];
      const isContactAnswer = answer.includes(EMAIL);

      const handleEmailClick = () => {
        onContactClick();
        handleClose();
      };

      return (
        <>
          <Bubble $from="user">{selectedQuestion.question[language]}</Bubble>
          <Bubble $from="bot">
            {isContactAnswer ? (
              <>
                {answer.split(EMAIL)[0]}
                <EmailLink type="button" onClick={handleEmailClick}>{EMAIL}</EmailLink>
              </>
            ) : (
              answer
            )}
          </Bubble>
        </>
      );
    }

    return null;
  };

  return (
    <>
      {isOpen && <ClickAway onClick={handleClose} />}
      <Dock>
        {isOpen && (
          <Speech>
          <Panel role="dialog" aria-label={getHeaderTitle()}>
            <PanelHead>
              {viewMode !== 'categories' && (
                <BackIcon type="button" onClick={handleBack} aria-label={t.back}>
                  <ChevronLeft />
                </BackIcon>
              )}
              <h3>{getHeaderTitle()}</h3>
            </PanelHead>
            <Thread ref={threadRef}>
              {renderContent()}
            </Thread>
          </Panel>
          </Speech>
        )}

        <Launcher
          type="button"
          onClick={() => (isOpen ? handleClose() : setIsOpen(true))}
          aria-label={isOpen ? t.close : t.open}
          aria-expanded={isOpen}
        >
          <Face $theme="light" src="/models/posters/head-light.webp" alt="" width={64} height={64} loading="lazy" />
          <Face $theme="dark" src="/models/posters/head-dark.webp" alt="" width={64} height={64} loading="lazy" />
        </Launcher>
      </Dock>
    </>
  );
}
