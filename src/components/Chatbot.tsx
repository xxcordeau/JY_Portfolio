import { useState } from 'react';
import styled from 'styled-components';
import { MessageCircle, X, ChevronLeft, Mail } from 'lucide-react';
import { useChatbot } from '../hooks/useChatbot';
import type { ChatCategory, ChatQuestion } from '../data/chatbotData';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

const Overlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 999;
  opacity: ${props => props.$isOpen ? '1' : '0'};
  pointer-events: ${props => props.$isOpen ? 'auto' : 'none'};
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(2px);
`;

const ChatbotContainer = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  bottom: 40px;
  right: 40px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 16px;

  @media (max-width: 768px) {
    bottom: 20px;
    right: 20px;
  }
`;

const ChatWindow = styled.div<{ $isDark: boolean; $isOpen: boolean }>`
  width: 360px;
  max-height: 580px;
  background: ${props => props.$isDark
    ? 'rgba(22, 22, 24, 0.88)'
    : 'rgba(255, 255, 255, 0.88)'};
  backdrop-filter: blur(28px) saturate(1.6);
  -webkit-backdrop-filter: blur(28px) saturate(1.6);
  border-radius: 24px;
  box-shadow: ${props => props.$isDark
    ? '0 16px 48px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)'
    : '0 16px 48px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.05)'};
  border: 1px solid ${props => props.$isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.07)'};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transform: ${props => props.$isOpen ? 'scale(1) translateY(0)' : 'scale(0.92) translateY(12px)'};
  opacity: ${props => props.$isOpen ? '1' : '0'};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  pointer-events: ${props => props.$isOpen ? 'auto' : 'none'};
  position: ${props => props.$isOpen ? 'relative' : 'absolute'};
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  transform-origin: bottom right;

  @media (max-width: 768px) {
    width: calc(100vw - 40px);
    max-width: 360px;
    max-height: 70vh;
  }
`;

const ChatHeader = styled.div<{ $isDark: boolean }>`
  padding: 18px 20px;
  background: transparent;
  border-bottom: 1px solid ${props => props.$isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)'};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ChatHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const BackButton = styled.button<{ $isDark: boolean }>`
  background: transparent;
  border: none;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.$isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const ChatTitle = styled.h3<{ $isDark: boolean }>`
  font-size: 17px;
  font-weight: 600;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  margin: 0;
`;

const CloseButton = styled.button<{ $isDark: boolean }>`
  background: transparent;
  border: none;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.$isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const ChatBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #86868b;
    border-radius: 3px;
  }
`;

const CategoryButton = styled.button<{ $isDark: boolean }>`
  width: 100%;
  padding: 14px 18px;
  background: ${props => props.$isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'};
  border: 1px solid ${props => props.$isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)'};
  border-radius: 16px;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 12px;
  text-align: left;
  font-family: inherit;

  &:hover {
    background: ${props => props.$isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'};
    border-color: ${props => props.$isDark ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.12)'};
  }

  &:active {
    transform: scale(0.98);
  }
`;

const CategoryIcon = styled.span`
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
`;

const QuestionButton = styled.button<{ $isDark: boolean }>`
  width: 100%;
  padding: 12px 16px;
  background: ${props => props.$isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'};
  border: 1px solid ${props => props.$isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)'};
  border-radius: 14px;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  font-size: 13.5px;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  line-height: 1.55;
  font-family: inherit;
  letter-spacing: -0.1px;

  &:hover {
    background: ${props => props.$isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'};
    border-color: ${props => props.$isDark ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.12)'};
  }

  &:active {
    transform: scale(0.99);
  }
`;

const AnswerBox = styled.div<{ $isDark: boolean }>`
  width: 100%;
  padding: 18px 20px;
  background: ${props => props.$isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'};
  border: 1px solid ${props => props.$isDark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.07)'};
  border-radius: 16px;
  color: ${props => props.$isDark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.7)'};
  font-size: 14px;
  line-height: 1.75;
  white-space: pre-line;
  letter-spacing: -0.1px;
`;

const ToggleButton = styled.button<{ $isDark: boolean; $isOpen: boolean }>`
  width: 48px;
  height: 48px;
  padding: 0;
  border-radius: 100px;
  background: ${props => props.$isDark
    ? 'rgba(22, 22, 24, 0.85)'
    : 'rgba(255, 255, 255, 0.85)'};
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  border: 1px solid ${props => props.$isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)'};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  font-family: inherit;
  box-shadow: ${props => props.$isDark
    ? '0 4px 24px rgba(0,0,0,0.4), 0 1px 4px rgba(0,0,0,0.3)'
    : '0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.05)'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: scale(1.02);
    border-color: ${props => props.$isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.2)'};
  }

  &:active {
    transform: scale(0.97);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const WelcomeText = styled.div<{ $isDark: boolean }>`
  padding: 0 0 16px 0;
  color: ${props => props.$isDark ? '#d4d4d8' : '#1d1d1f'};
  font-size: 14px;
  line-height: 1.7;
  margin-bottom: 12px;
  text-align: center;
`;

const EmailLink = styled.button<{ $isDark: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: ${props => props.$isDark ? '#4ECDC4' : '#1d1d1f'};
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  font-size: 14px;

  &:hover {
    opacity: 0.8;
    text-decoration: underline;
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

interface ChatbotProps {
  onContactClick: () => void;
}

type ViewMode = 'categories' | 'questions' | 'answer';

export default function Chatbot({ onContactClick }: ChatbotProps) {
  const { isDark } = useTheme();
  const { language } = useLanguage();
  const { categories: chatbotData } = useChatbot();
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('categories');
  const [selectedCategory, setSelectedCategory] = useState<ChatCategory | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<ChatQuestion | null>(null);

  const translations = {
    ko: {
      welcome: '안녕하세요! 궁금한 것을 선택해주세요 😊',
      chatTitle: '무엇이 궁금하신가요?'
    },
    en: {
      welcome: 'Hello! Please select what you\'re curious about 😊',
      chatTitle: 'What are you curious about?'
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

  const getHeaderTitle = () => {
    if (viewMode === 'answer' && selectedQuestion) {
      return selectedQuestion.question[language];
    }
    if (viewMode === 'questions' && selectedCategory) {
      return selectedCategory.title[language];
    }
    return t.chatTitle;
  };

  const renderContent = () => {
    if (viewMode === 'categories') {
      return (
        <>
          <WelcomeText $isDark={isDark}>
            {t.welcome}
          </WelcomeText>
          {chatbotData.map((category) => (
            <CategoryButton
              key={category.id}
              $isDark={isDark}
              onClick={() => handleCategoryClick(category)}
            >
              <CategoryIcon>{category.icon}</CategoryIcon>
              <span>{category.title[language]}</span>
            </CategoryButton>
          ))}
        </>
      );
    }

    if (viewMode === 'questions' && selectedCategory) {
      return (
        <>
          {selectedCategory.questions.map((question, index) => (
            <QuestionButton
              key={index}
              $isDark={isDark}
              onClick={() => handleQuestionClick(question)}
            >
              Q. {question.question[language]}
            </QuestionButton>
          ))}
        </>
      );
    }

    if (viewMode === 'answer' && selectedQuestion) {
      const answer = selectedQuestion.answer[language];
      const isContactAnswer = answer.includes('qazseeszaq3219@gmail.com');

      const handleEmailClick = () => {
        onContactClick();
        handleClose();
      };

      return (
        <AnswerBox $isDark={isDark}>
          {isContactAnswer ? (
            <>
              {answer.split('qazseeszaq3219@gmail.com')[0]}
              <EmailLink 
                $isDark={isDark} 
                onClick={handleEmailClick}
              >
                <Mail />
                qazseeszaq3219@gmail.com
              </EmailLink>
            </>
          ) : (
            answer
          )}
        </AnswerBox>
      );
    }

    return null;
  };

  return (
    <>
      {isOpen && <Overlay $isOpen={isOpen} onClick={handleClose} />}
      <ChatbotContainer $isOpen={isOpen}>
        <ChatWindow $isDark={isDark} $isOpen={isOpen}>
        <ChatHeader $isDark={isDark}>
          <ChatHeaderLeft>
            {viewMode !== 'categories' && (
              <BackButton $isDark={isDark} onClick={handleBack}>
                <ChevronLeft />
              </BackButton>
            )}
            <ChatTitle $isDark={isDark}>{getHeaderTitle()}</ChatTitle>
          </ChatHeaderLeft>
          <CloseButton $isDark={isDark} onClick={handleClose}>
            <X />
          </CloseButton>
        </ChatHeader>
        <ChatBody>
          {renderContent()}
        </ChatBody>
      </ChatWindow>
      
        <ToggleButton
          $isDark={isDark}
          $isOpen={isOpen}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <MessageCircle />}
        </ToggleButton>
      </ChatbotContainer>
    </>
  );
}
