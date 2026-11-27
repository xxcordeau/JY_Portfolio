'use client';

import styled from 'styled-components';
import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';

const EMAIL = 'qazseeszaq3219@gmail.com';

/* 검색창(CommandPalette)과 같은 팝업 규칙: 어둡게 깐 배경 + 그림자 있는 패널 하나 */
const Dim = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9998;
  background: var(--k-dim);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 10vh var(--k-space-4) var(--k-space-4);
  overflow-y: auto;
  animation: contact-fade 0.15s var(--k-ease);

  @keyframes contact-fade { from { opacity: 0; } to { opacity: 1; } }

  @media (max-width: 768px) {
    padding-top: var(--k-space-6);
  }
`;

const Panel = styled.div`
  width: 100%;
  max-width: 480px;
  background: var(--k-bg-pop);
  border: 1px solid var(--k-line);
  border-radius: var(--k-radius-lg);
  box-shadow: var(--k-shadow-pop);
  color: var(--k-text);
  animation: k-enter 0.2s var(--k-ease);
`;

const PanelHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  padding: 0 var(--k-space-3) 0 var(--k-space-6);
  border-bottom: 1px solid var(--k-line);

  h2 {
    font-size: var(--k-text-lg);
    font-weight: 700;
  }
`;

const GhostIcon = styled.button`
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

const Body = styled.div`
  padding: var(--k-space-6);

  @media (max-width: 768px) {
    padding: var(--k-space-5) var(--k-space-4);
  }
`;

const Description = styled.p`
  font-size: var(--k-text-md);
  line-height: 1.6;
  color: var(--k-text-sub);
  margin-bottom: var(--k-space-5);
  word-break: keep-all;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--k-space-4);
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-size: var(--k-text-sm);
    font-weight: 600;
    color: var(--k-text);
  }
`;

const fieldBase = `
  width: 100%;
  border: 1px solid var(--k-line-strong);
  border-radius: var(--k-radius);
  background: var(--k-bg);
  color: var(--k-text);
  font: inherit;
  font-size: var(--k-text-md);
  transition: border-color 0.15s var(--k-ease), box-shadow 0.15s var(--k-ease);

  &::placeholder { color: var(--k-text-weak); }

  &:focus {
    outline: none;
    border-color: var(--k-accent);
    box-shadow: 0 0 0 1px var(--k-accent);
  }

  &[aria-invalid='true'] { border-color: var(--k-text); }
`;

const Input = styled.input`
  ${fieldBase}
  height: var(--k-control-md);
  padding: 0 var(--k-space-3);
`;

const TextArea = styled.textarea`
  ${fieldBase}
  min-height: 120px;
  padding: 10px var(--k-space-3);
  line-height: 1.6;
  resize: vertical;
`;

/* 따로 쓸 빨간 토큰이 없어서 글자색 대신 굵기로 눈에 띄게 한다 */
const FieldError = styled.p`
  font-size: var(--k-text-xs);
  font-weight: 600;
  color: var(--k-text);
`;

const PrimaryButton = styled.button`
  height: var(--k-control-md);
  padding: 0 var(--k-space-4);
  border: none;
  border-radius: var(--k-radius);
  background: var(--k-accent);
  color: var(--k-on-accent);
  font: inherit;
  font-size: var(--k-text-md);
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s var(--k-ease);

  &:hover:not(:disabled) { background: var(--k-accent-hover); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const Notice = styled.p`
  padding: 10px var(--k-space-3);
  border-radius: var(--k-radius);
  background: var(--k-bg-sub);
  font-size: var(--k-text-sm);
  line-height: 1.5;
  color: var(--k-text);
`;

const Alt = styled.div`
  margin-top: var(--k-space-6);
  padding-top: var(--k-space-5);
  border-top: 1px solid var(--k-line);

  .label {
    font-size: var(--k-text-sm);
    color: var(--k-text-weak);
  }
`;

const EmailRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--k-space-2);
  margin-top: var(--k-space-2);

  span {
    min-width: 0;
    font-size: var(--k-text-md);
    font-weight: 600;
    overflow-wrap: anywhere;
  }
`;

const AltLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--k-space-2);
  margin-top: var(--k-space-3);
`;

const SecondaryButton = styled.a`
  display: inline-flex;
  align-items: center;
  height: var(--k-control-sm);
  padding: 0 var(--k-space-3);
  border: 1px solid var(--k-line-strong);
  border-radius: var(--k-radius);
  background: var(--k-bg);
  color: var(--k-text);
  font: inherit;
  font-size: var(--k-text-sm);
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  transition: background 0.15s var(--k-ease);

  &:hover { background: var(--k-bg-hover); }
`;

const GhostButton = styled.button`
  flex: none;
  height: var(--k-control-sm);
  padding: 0 var(--k-space-3);
  border: none;
  border-radius: var(--k-radius);
  background: transparent;
  color: var(--k-text-sub);
  font: inherit;
  font-size: var(--k-text-sm);
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s var(--k-ease), color 0.15s var(--k-ease);

  &:hover { background: var(--k-bg-hover); color: var(--k-text); }
`;

interface ContactProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const translations = {
  ko: {
    title: '연락하기',
    description: '새 프로젝트나 협업 이야기가 있으면 편하게 남겨 주세요.',
    nameLabel: '이름',
    namePlaceholder: '홍길동',
    emailLabel: '이메일',
    emailPlaceholder: 'your@email.com',
    messageLabel: '메시지',
    messagePlaceholder: '하고 싶은 이야기를 적어 주세요',
    submit: '메시지 보내기',
    sending: '보내는 중',
    successMessage: '메시지를 보냈어요.',
    errorMessage: '보내지 못했어요. 잠시 후 다시 시도해 주세요.',
    altLabel: '메일로 바로 보내도 돼요',
    copy: '복사',
    copied: '복사했어요',
    directEmail: '메일 앱으로 보내기',
    directGmail: 'Gmail에서 보내기',
    github: 'GitHub 보기',
    close: '닫기',
    errName: '이름을 입력해 주세요.',
    errEmail: '이메일 주소를 입력해 주세요.',
    errEmailFmt: '이메일 형식이 맞지 않아요.',
    errMessage: '메시지를 입력해 주세요.',
  },
  en: {
    title: 'Get in touch',
    description: 'Feel free to reach out about new projects or collaboration.',
    nameLabel: 'Name',
    namePlaceholder: 'John Doe',
    emailLabel: 'Email',
    emailPlaceholder: 'your@email.com',
    messageLabel: 'Message',
    messagePlaceholder: 'Write your message here',
    submit: 'Send message',
    sending: 'Sending',
    successMessage: 'Your message was sent.',
    errorMessage: 'Could not send the message. Please try again.',
    altLabel: 'Or email me directly',
    copy: 'Copy',
    copied: 'Copied',
    directEmail: 'Email app',
    directGmail: 'Gmail',
    github: 'GitHub',
    close: 'Close',
    errName: 'Please enter your name.',
    errEmail: 'Please enter your email.',
    errEmailFmt: 'Please enter a valid email address.',
    errMessage: 'Please enter a message.',
  }
};

export default function Contact({ isOpen = false, onOpenChange }: ContactProps) {
  const { language } = useLanguage();
  const t = translations[language];
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout>>();

  const validate = () => {
    const next = { name: '', email: '', message: '' };
    if (!formData.name.trim()) next.name = t.errName;
    if (!formData.email.trim()) next.email = t.errEmail;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) next.email = t.errEmailFmt;
    if (!formData.message.trim()) next.message = t.errMessage;
    setErrors(next);
    return !next.name && !next.email && !next.message;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus('loading');
    const { error } = await supabase.from('contact_messages').insert({
      name: formData.name,
      email: formData.email,
      message: formData.message,
    });
    if (error) {
      setStatus('error');
      setErrorMessage(error.message);
    } else {
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setErrors({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 3000);
    }
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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // 클립보드 권한이 없으면 메일 앱 링크로 대신한다
      window.location.href = `mailto:${EMAIL}`;
    }
  };

  useEffect(() => () => clearTimeout(copyTimer.current), []);

  // Esc로 닫기 + 열려 있는 동안 뒤 페이지 스크롤 막기
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onOpenChange?.(false); };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, onOpenChange]);

  // 입력값은 이 컴포넌트 state에 남아 있어서 닫았다 열어도 그대로 보인다
  if (!isOpen) return null;

  return (
    <Dim onClick={handleOverlayClick}>
      <Panel role="dialog" aria-modal="true" aria-labelledby="k-contact-title">
        <PanelHead>
          <h2 id="k-contact-title">{t.title}</h2>
          <GhostIcon type="button" onClick={handleClose} aria-label={t.close}>
            <X />
          </GhostIcon>
        </PanelHead>

        <Body>
          <Description>{t.description}</Description>

          <Form onSubmit={handleSubmit} noValidate>
            <Field>
              <label htmlFor="k-contact-name">{t.nameLabel}</label>
              <Input
                id="k-contact-name"
                type="text"
                name="name"
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t.namePlaceholder}
                aria-invalid={!!errors.name}
              />
              {errors.name && <FieldError>{errors.name}</FieldError>}
            </Field>

            <Field>
              <label htmlFor="k-contact-email">{t.emailLabel}</label>
              <Input
                id="k-contact-email"
                type="email"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t.emailPlaceholder}
                aria-invalid={!!errors.email}
              />
              {errors.email && <FieldError>{errors.email}</FieldError>}
            </Field>

            <Field>
              <label htmlFor="k-contact-message">{t.messageLabel}</label>
              <TextArea
                id="k-contact-message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder={t.messagePlaceholder}
                aria-invalid={!!errors.message}
              />
              {errors.message && <FieldError>{errors.message}</FieldError>}
            </Field>

            <PrimaryButton type="submit" disabled={status === 'loading'}>
              {status === 'loading' ? t.sending : t.submit}
            </PrimaryButton>

            {status === 'success' && <Notice role="status">{t.successMessage}</Notice>}
            {status === 'error' && <Notice role="alert">{errorMessage || t.errorMessage}</Notice>}
          </Form>

          <Alt>
            <div className="label">{t.altLabel}</div>
            <EmailRow>
              <span>{EMAIL}</span>
              <GhostButton type="button" onClick={handleCopy}>
                {copied ? t.copied : t.copy}
              </GhostButton>
            </EmailRow>
            <AltLinks>
              <SecondaryButton href={`mailto:${EMAIL}`}>{t.directEmail}</SecondaryButton>
              <SecondaryButton
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t.directGmail}
              </SecondaryButton>
              <SecondaryButton href="https://github.com/xxcordeau" target="_blank" rel="noopener noreferrer">
                {t.github}
              </SecondaryButton>
            </AltLinks>
          </Alt>
        </Body>
      </Panel>
    </Dim>
  );
}
