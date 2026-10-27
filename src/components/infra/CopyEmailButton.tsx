'use client';

import { useEffect, useRef, useState } from 'react';
import s from './infra.module.css';

/**
 * 메일 주소 복사 버튼.
 * mailto:는 기본 메일 앱이 없는 PC에서 아무 반응이 없어서, 주소를 복사하고 토스트로 알린다.
 */
export default function CopyEmailButton({ email, label }: { email: string; label: string }) {
  const [shown, setShown] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      // 클립보드 API를 못 쓰는 환경(비보안 컨텍스트 등) 폴백
      const ta = document.createElement('textarea');
      ta.value = email;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    setShown(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setShown(false), 2000);
  };

  return (
    <>
      <button type="button" className={s.btnPrimary} onClick={copy}>
        {label}
      </button>
      <div className={`${s.toast} ${shown ? s.toastShow : ''}`} role="status" aria-live="polite">
        {shown && `${email} 복사했어요`}
      </div>
    </>
  );
}
