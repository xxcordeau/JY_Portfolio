import type { Metadata } from 'next';
import BlogView from '../../src/components/app/views/BlogView';

export const metadata: Metadata = {
  title: '블로그 | 허정연 포트폴리오',
  description: '프론트엔드 개발과 디자인 시스템에 대해 쓴 글들.',
};

export default function Page() {
  return <BlogView />;
}
