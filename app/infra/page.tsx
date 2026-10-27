import type { Metadata } from 'next';
import InfraPortfolio from '../../src/components/infra/InfraPortfolio';

export const metadata: Metadata = {
  title: '허정연 - IT 고객 엔지니어 포트폴리오',
  description:
    '장비 연동과 서버 운영, 장애 대응을 맡아온 개발자 허정연의 인프라 직무 포트폴리오.',
  openGraph: {
    title: '허정연 - IT 고객 엔지니어 포트폴리오',
    description: '코드부터 장비까지, 장애 원인을 끝까지 찾는 개발자 허정연',
    url: '/infra/',
  },
};

export default function Page() {
  return <InfraPortfolio />;
}
