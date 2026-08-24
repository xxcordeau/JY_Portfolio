'use client';

import { createContext, useContext } from 'react';

/**
 * 셸이 소유한 Contact 모달을 하위 페이지에서 열기 위한 컨텍스트.
 * (Vite 시절 prop drilling으로 넘기던 onContactClick 대체)
 */
export const ContactModalContext = createContext<{ open: () => void }>({ open: () => {} });

export const useContactModal = () => useContext(ContactModalContext);
