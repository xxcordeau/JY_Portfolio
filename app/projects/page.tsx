import type { Metadata } from 'next';
import ProjectsView from '../../src/components/app/views/ProjectsView';

export const metadata: Metadata = {
  title: '프로젝트 | 허정연 포트폴리오',
  description: '실무와 프리랜서로 만든 프로젝트들 — 티켓 커머스, 포토부스 키오스크, 계약 관리 시스템 등.',
};

export default function Page() {
  return <ProjectsView />;
}
