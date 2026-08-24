'use client';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';

// pdfjs-dist는 모듈 평가 시점에 DOMMatrix 등 브라우저 API를 참조하므로
// 서버 프리렌더에서 제외하고 클라이언트에서만 로드한다.
const Presentations = dynamic(() => import('../../Presentations'), {
  ssr: false,
});

export default function PresentationsView() {
  const router = useRouter();
  return <Presentations onBack={() => router.push('/')} />;
}
