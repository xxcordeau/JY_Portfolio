import type { Metadata } from 'next';
import PresentationsView from '../../src/components/app/views/PresentationsView';

export const metadata: Metadata = {
  title: 'PT 자료 | 허정연 포트폴리오',
  description: '발표 자료 모음.',
};

export default function Page() {
  return <PresentationsView />;
}
