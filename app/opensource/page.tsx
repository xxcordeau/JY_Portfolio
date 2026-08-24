import type { Metadata } from 'next';
import OpenSourceView from '../../src/components/app/views/OpenSourceView';

export const metadata: Metadata = {
  title: '오픈소스 | 허정연 포트폴리오',
  description: '직접 만들어 공개한 React UI 컴포넌트 라이브러리.',
};

export default function Page() {
  return <OpenSourceView />;
}
