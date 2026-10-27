import type { Metadata } from 'next';
import InfraPortfolio from '../../src/components/infra/InfraPortfolio';

export const metadata: Metadata = {
  title: '허정연 - IT 고객 엔지니어 포트폴리오',
  description:
    '장비에 붙은 컴퓨팅 시스템을 진단·복구하고 재발을 막아온 엔지니어 허정연. 키오스크 하드웨어 연동, 서버 운영, 장애 대응 사례.',
  openGraph: {
    title: '허정연 - IT 고객 엔지니어 포트폴리오',
    description: '장비 옆의 컴퓨터가 멈추지 않게 — 장애 대응과 서버 운영 사례',
    url: '/infra/',
  },
};

export default function Page() {
  return <InfraPortfolio />;
}
