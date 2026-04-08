import styled from 'styled-components';
import { useState } from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

const Overlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9998;
  opacity: ${props => props.$isOpen ? '1' : '0'};
  pointer-events: ${props => props.$isOpen ? 'auto' : 'none'};
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(4px);
`;

const ModalContainer = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) ${props => props.$isOpen ? 'scale(1)' : 'scale(0.9)'};
  z-index: 9999;
  opacity: ${props => props.$isOpen ? '1' : '0'};
  pointer-events: ${props => props.$isOpen ? 'auto' : 'none'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow: hidden;

  @media (max-width: 768px) {
    width: calc(100% - 40px);
    max-height: 85vh;
  }
`;

const ModalWindow = styled.div<{ $isDark: boolean }>`
  background: ${props => props.$isDark ? '#1d1d1f' : '#ffffff'};
  border-radius: 20px;
  box-shadow: 0 8px 32px ${props => props.$isDark ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.12)'};
  border: 1px solid ${props => props.$isDark ? '#2d2d2d' : '#e5e5e7'};
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ModalHeader = styled.div<{ $isDark: boolean }>`
  padding: 20px 24px;
  background: ${props => props.$isDark ? '#0a0a0a' : '#f5f5f7'};
  border-bottom: 1px solid ${props => props.$isDark ? '#2d2d2d' : '#e5e5e7'};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ModalTitle = styled.h3<{ $isDark: boolean }>`
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

const ModalBody = styled.div`
  padding: 24px;
  overflow-y: auto;
  max-height: calc(90vh - 100px);

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

  @media (max-width: 768px) {
    max-height: calc(85vh - 100px);
  }
`;

const Description = styled.p`
  font-size: 14px;
  color: #86868b;
  margin: 0 0 20px 0;
  line-height: 1.6;
  font-weight: 400;
  letter-spacing: -0.2px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label<{ $isDark: boolean }>`
  font-size: 13px;
  font-weight: 500;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  letter-spacing: -0.2px;
`;

const Input = styled.input<{ $isDark: boolean }>`
  padding: 12px 14px;
  background: ${props => props.$isDark ? '#0a0a0a' : '#f5f5f7'};
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  border: 1px solid ${props => props.$isDark ? '#2d2d2d' : '#e5e5e7'};
  border-radius: 12px;
  font-size: 14px;
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
    background: ${props => props.$isDark ? '#1a1a1a' : '#ffffff'};
  }

  &::placeholder {
    color: #86868b;
  }
`;

const TextArea = styled.textarea<{ $isDark: boolean }>`
  padding: 12px 14px;
  background: ${props => props.$isDark ? '#0a0a0a' : '#f5f5f7'};
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  border: 1px solid ${props => props.$isDark ? '#2d2d2d' : '#e5e5e7'};
  border-radius: 12px;
  font-size: 14px;
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif;
  min-height: 120px;
  resize: vertical;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
    background: ${props => props.$isDark ? '#1a1a1a' : '#ffffff'};
  }

  &::placeholder {
    color: #86868b;
  }
`;

const SubmitButton = styled.button<{ $isDark: boolean; disabled?: boolean }>`
  padding: 14px 24px;
  background: ${props => props.disabled ? '#86868b' : (props.$isDark ? '#f5f5f7' : '#1d1d1f')};
  color: ${props => props.disabled ? '#f5f5f7' : (props.$isDark ? '#1d1d1f' : '#ffffff')};
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 500;
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  letter-spacing: -0.2px;

  &:hover {
    opacity: ${props => props.disabled ? 1 : 0.85};
  }

  &:active {
    transform: ${props => props.disabled ? 'none' : 'scale(0.98)'};
  }
`;

const Message = styled.div<{ $isDark: boolean; $isError?: boolean }>`
  padding: 12px 16px;
  background: ${props => props.$isError 
    ? (props.$isDark ? '#3a1a1a' : '#fff0f0')
    : (props.$isDark ? '#1a3a1a' : '#f0fff0')
  };
  color: ${props => props.$isError 
    ? (props.$isDark ? '#ff6b6b' : '#d32f2f')
    : (props.$isDark ? '#6bff6b' : '#2f8d2f')
  };
  border-radius: 12px;
  font-size: 13px;
  text-align: center;
  letter-spacing: -0.2px;
  line-height: 1.5;
`;

const Divider = styled.div<{ $isDark: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 20px 0;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${props => props.$isDark ? '#2d2d2d' : '#e5e5e7'};
  }
  
  span {
    color: #86868b;
    font-size: 13px;
    font-weight: 400;
  }
`;

const DirectEmailButton = styled.a<{ $isDark: boolean }>`
  display: block;
  width: 100%;
  padding: 14px 24px;
  background: ${props => props.$isDark ? '#0a0a0a' : '#f5f5f7'};
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  text-decoration: none;
  border: 1px solid ${props => props.$isDark ? '#2d2d2d' : '#e5e5e7'};
  border-radius: 12px;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.2s ease;
  letter-spacing: -0.2px;
  cursor: pointer;
  text-align: center;

  &:hover {
    background: ${props => props.$isDark ? '#2d2d2d' : '#e5e5e7'};
  }

  &:active {
    transform: scale(0.98);
  }
`;

interface ContactProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const translations = {
  ko: {
    title: '연락하기',
    description: '새로운 프로젝트나 협업 기회에 대해 이야기 나누고 싶으시다면 언제든 연락주세요.',
    nameLabel: '이름',
    namePlaceholder: '홍길동',
    emailLabel: '이메일',
    emailPlaceholder: 'your@email.com',
    messageLabel: '메시지',
    messagePlaceholder: '문의하실 내용을 작성해주세요...',
    submit: '메시지 보내기',
    sending: '전송 중...',
    successMessage: '메시지가 성공적으로 전송되었습니다!',
    errorMessage: '메시지 전송에 실패했습니다. 다시 시도해주세요.',
    directEmail: '이메일 앱으로 보내기',
    directGmail: 'Gmail 웹에서 보내기',
    or: '또는'
  },
  en: {
    title: 'Get in Touch',
    description: 'Feel free to reach out if you want to discuss new projects or collaboration opportunities.',
    nameLabel: 'Name',
    namePlaceholder: 'John Doe',
    emailLabel: 'Email',
    emailPlaceholder: 'your@email.com',
    messageLabel: 'Message',
    messagePlaceholder: 'Write your message here...',
    submit: 'Send Message',
    sending: 'Sending...',
    successMessage: 'Message sent successfully!',
    errorMessage: 'Failed to send message. Please try again.',
    directEmail: 'Send via Email App',
    directGmail: 'Send via Gmail Web',
    or: 'or'
  }
};

export default function Contact({ isOpen = false, onOpenChange }: ContactProps) {
  const { isDark } = useTheme();
  const { language } = useLanguage();
  const t = translations[language];
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`[Portfolio] ${formData.name}님의 메시지`);
    const body = encodeURIComponent(`이름: ${formData.name}\n이메일: ${formData.email}\n\n${formData.message}`);
    window.location.href = `mailto:qazseeszaq3219@gmail.com?subject=${subject}&body=${body}`;
    setStatus('success');
    setFormData({ name: '', email: '', message: '' });
    setTimeout(() => setStatus('idle'), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleClose = () => {
    if (onOpenChange) {
      onOpenChange(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <>
      <Overlay $isOpen={isOpen} onClick={handleOverlayClick} />
      <ModalContainer $isOpen={isOpen}>
        <ModalWindow $isDark={isDark}>
          <ModalHeader $isDark={isDark}>
            <ModalTitle $isDark={isDark}>{t.title}</ModalTitle>
            <CloseButton $isDark={isDark} onClick={handleClose}>
              <X />
            </CloseButton>
          </ModalHeader>
          
          <ModalBody>
            <Description>{t.description}</Description>
            
            <Form onSubmit={handleSubmit}>
              <InputGroup>
                <Label $isDark={isDark}>{t.nameLabel}</Label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t.namePlaceholder}
                  $isDark={isDark}
                  required
                />
              </InputGroup>

              <InputGroup>
                <Label $isDark={isDark}>{t.emailLabel}</Label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t.emailPlaceholder}
                  $isDark={isDark}
                  required
                />
              </InputGroup>

              <InputGroup>
                <Label $isDark={isDark}>{t.messageLabel}</Label>
                <TextArea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={t.messagePlaceholder}
                  $isDark={isDark}
                  required
                />
              </InputGroup>

              <SubmitButton 
                type="submit" 
                $isDark={isDark}
                disabled={status === 'loading'}
              >
                {status === 'loading' ? t.sending : t.submit}
              </SubmitButton>

              {status === 'success' && (
                <Message $isDark={isDark}>{t.successMessage}</Message>
              )}
              
              {status === 'error' && (
                <Message $isDark={isDark} $isError>{errorMessage || t.errorMessage}</Message>
              )}
            </Form>

            <Divider $isDark={isDark}>
              <span>{t.or}</span>
            </Divider>

            <DirectEmailButton
              $isDark={isDark}
              href="mailto:qazseeszaq3219@gmail.com"
            >
              {t.directEmail}
            </DirectEmailButton>

            <DirectEmailButton
              $isDark={isDark}
              href="https://mail.google.com/mail/?view=cm&fs=1&to=qazseeszaq3219@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ marginTop: '8px' }}
            >
              {t.directGmail}
            </DirectEmailButton>
          </ModalBody>
        </ModalWindow>
      </ModalContainer>
    </>
  );
}
