import type { Metadata } from 'next';
import DesignPortfolio from '../../src/components/design/DesignPortfolio';

export const metadata: Metadata = {
  title: '허정연 - 경력기술서 (프로덕트 UI/UX 디자이너)',
  description:
    '시각디자인을 전공하고 화면 설계부터 구현까지 직접 해온 허정연의 경력기술서. 회사별 프로젝트, 맡은 역할, 결과를 정리했습니다.',
  openGraph: {
    title: '허정연 - 경력기술서',
    description: '디자인을 전공하고, 화면을 설계해서 직접 만들어 온 기록',
    url: '/design/',
  },
};

export default function Page() {
  return <DesignPortfolio />;
}
