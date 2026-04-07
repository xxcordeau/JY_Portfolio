import { useState } from 'react';
import styled from 'styled-components';
import { MessageCircle, X, ChevronLeft, Mail } from 'lucide-react';
import { chatbotData, ChatCategory, ChatQuestion } from '../data/chatbotData';

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
  width: 380px;
  max-height: 600px;
  background: ${props => props.$isDark ? '#1d1d1f' : '#ffffff'};
  border-radius: 20px;
  box-shadow: 0 8px 32px ${props => props.$isDark ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.12)'};
  border: 1px solid ${props => props.$isDark ? '#2d2d2d' : '#e5e5e7'};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transform: ${props => props.$isOpen ? 'scale(1)' : 'scale(0.8)'};
  opacity: ${props => props.$isOpen ? '1' : '0'};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  pointer-events: ${props => props.$isOpen ? 'auto' : 'none'};
  position: ${props => props.$isOpen ? 'relative' : 'absolute'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: bottom right;

  @media (max-width: 768px) {
    width: calc(100vw - 40px);
    max-width: 380px;
    max-height: 70vh;
  }
`;

const ChatHeader = styled.div<{ $isDark: boolean }>`
  padding: 20px 24px;
  background: ${props => props.$isDark ? '#0a0a0a' : '#f5f5f7'};
  border-bottom: 1px solid ${props => props.$isDark ? '#2d2d2d' : '#e5e5e7'};
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
    background: ${props => props.$isDark ? '#2d2d2d' : '#e5e5e7'};
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
    background: ${props => props.$isDark ? '#2d2d2d' : '#e5e5e7'};
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
  padding: 16px 20px;
  background: ${props => props.$isDark ? '#0a0a0a' : '#f5f5f7'};
  border: 1px solid ${props => props.$isDark ? '#2d2d2d' : '#e5e5e7'};
  border-radius: 12px;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 12px;
  text-align: left;

  &:hover {
    background: ${props => props.$isDark ? '#2d2d2d' : '#e5e5e7'};
    transform: translateX(4px);
  }

  &:active {
    transform: translateX(4px) scale(0.98);
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
  padding: 14px 16px;
  background: ${props => props.$isDark ? '#0a0a0a' : '#f5f5f7'};
  border: 1px solid ${props => props.$isDark ? '#2d2d2d' : '#e5e5e7'};
  border-radius: 12px;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  line-height: 1.5;

  &:hover {
    background: ${props => props.$isDark ? '#2d2d2d' : '#e5e5e7'};
    transform: translateX(4px);
  }

  &:active {
    transform: translateX(4px) scale(0.98);
  }
`;

const AnswerBox = styled.div<{ $isDark: boolean }>`
  width: 100%;
  padding: 20px;
  background: ${props => props.$isDark ? '#0a0a0a' : '#f5f5f7'};
  border: 1px solid ${props => props.$isDark ? '#2d2d2d' : '#e5e5e7'};
  border-radius: 12px;
  color: ${props => props.$isDark ? '#d4d4d8' : '#1d1d1f'};
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-line;
`;

const ToggleButton = styled.button<{ $isDark: boolean; $isOpen: boolean }>`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  color: ${props => props.$isDark ? '#1d1d1f' : '#f5f5f7'};
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px ${props => props.$isDark ? 'rgba(245, 245, 247, 0.3)' : 'rgba(0, 0, 0, 0.15)'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: ${props => props.$isOpen ? 'rotate(90deg)' : 'rotate(0deg)'};

  &:hover {
    transform: ${props => props.$isOpen ? 'rotate(90deg) scale(1.05)' : 'scale(1.05)'};
    box-shadow: 0 6px 24px ${props => props.$isDark ? 'rgba(245, 245, 247, 0.4)' : 'rgba(0, 0, 0, 0.2)'};
  }

  &:active {
    transform: ${props => props.$isOpen ? 'rotate(90deg) scale(0.95)' : 'scale(0.95)'};
  }

  svg {
    width: 28px;
    height: 28px;
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
  language: 'ko' | 'en';
  isDark: boolean;
  onContactClick: () => void;
}

type ViewMode = 'categories' | 'questions' | 'answer';

export default function Chatbot({ language, isDark, onContactClick }: ChatbotProps) {
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
