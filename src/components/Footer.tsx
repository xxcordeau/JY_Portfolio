'use client';

import styled from 'styled-components';
import { useLanguage } from '../contexts/LanguageContext';
import { useContactModal } from './app/ContactModalContext';

const GITHUB_URL = 'https://github.com/xxcordeau';

/* 페이지 끝을 알리는 정도로만. 본문 폭에 맞춘 1px 윗선 + 작은 회색 글자 */
const Bar = styled.footer`
  max-width: var(--k-page-max);
  margin: 0 auto;
  border-top: 1px solid var(--k-line);
  padding: var(--k-space-8) var(--k-space-6);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--k-space-4);
  font-size: var(--k-text-sm);
  color: var(--k-text-weak);

  @media (max-width: 768px) {
    padding: var(--k-space-6) var(--k-space-4);
    flex-wrap: wrap;
  }
`;

const Links = styled.div`
  display: flex;
  align-items: center;
  gap: var(--k-space-5);

  a, button {
    padding: 0;
    border: none;
    background: none;
    font: inherit;
    color: var(--k-text-weak);
    text-decoration: none;
    cursor: pointer;
    transition: color 0.15s var(--k-ease);
  }

  a:hover, button:hover { color: var(--k-text); }
`;

interface FooterProps {
  onContactClick?: () => void;
}

const T = {
  ko: { name: '허정연', contact: '연락하기' },
  en: { name: 'Heo JeongYeon', contact: 'Contact' },
};

export default function Footer({ onContactClick }: FooterProps) {
  const { language } = useLanguage();
  const { open: openContact } = useContactModal();
  const t = T[language];
  // 호출하는 쪽에서 안 넘겨도 셸의 연락 모달을 연다
  const handleContact = onContactClick ?? openContact;

  return (
    <Bar>
      <span suppressHydrationWarning>© {new Date().getFullYear()} {t.name}</span>
      <Links>
        <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">GitHub</a>
        <button type="button" onClick={handleContact}>{t.contact}</button>
      </Links>
    </Bar>
  );
}
