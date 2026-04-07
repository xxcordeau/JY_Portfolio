import styled from 'styled-components';
import { Package, Terminal, Code, Book } from 'lucide-react';

const GuideContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 40px;

  @media (max-width: 768px) {
    padding: 40px 20px;
  }
`;

const Section = styled.section`
  margin-bottom: 60px;

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    margin-bottom: 40px;
  }
`;

const Title = styled.h2<{ $isDark: boolean }>`
  font-size: 32px;
  font-weight: 700;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  margin: 0 0 24px 0;
  display: flex;
  align-items: center;
  gap: 12px;

  svg {
    width: 28px;
    height: 28px;
    color: #007AFF;
  }

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const SubTitle = styled.h3<{ $isDark: boolean }>`
  font-size: 24px;
  font-weight: 600;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  margin: 32px 0 16px 0;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const Description = styled.p<{ $isDark: boolean }>`
  font-size: 16px;
  color: ${props => props.$isDark ? '#86868b' : '#6e6e73'};
  line-height: 1.7;
  margin-bottom: 24px;
`;

const CodeBlock = styled.div<{ $isDark: boolean }>`
  background: ${props => props.$isDark ? '#1a1a1a' : '#f8f8f8'};
  border: 1px solid ${props => props.$isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
  font-size: 14px;
  overflow-x: auto;

  pre {
    margin: 0;
    color: ${props => props.$isDark ? '#4ECDC4' : '#007AFF'};
  }
`;

const ComponentGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 24px;
`;

const ComponentCard = styled.div<{ $isDark: boolean }>`
  padding: 20px;
  background: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)'};
  border: 1px solid ${props => props.$isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'};
  border-radius: 12px;
  backdrop-filter: blur(20px);
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
    transform: translateY(-2px);
  }
`;

const ComponentName = styled.h4<{ $isDark: boolean }>`
  font-size: 17px;
  font-weight: 600;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  margin: 0 0 8px 0;
`;

const ComponentDesc = styled.p<{ $isDark: boolean }>`
  font-size: 14px;
  color: ${props => props.$isDark ? '#86868b' : '#6e6e73'};
  margin: 0;
  line-height: 1.5;
`;

const FeatureList = styled.ul<{ $isDark: boolean }>`
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    padding: 12px 0;
    border-bottom: 1px solid ${props => props.$isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)'};
    color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
    font-size: 15px;

    &:last-child {
      border-bottom: none;
    }

    &::before {
      content: '✓';
      color: #007AFF;
      font-weight: bold;
      margin-right: 12px;
    }
  }
`;

interface DataUIKitGuideProps {
  isDark: boolean;
  language: 'ko' | 'en';
}

const components = {
  ko: [
    { name: 'Table / DataGrid', desc: '정렬, 필터링, 페이지네이션이 있는 고급 데이터 테이블' },
    { name: 'List / Item List', desc: '리스트 및 그리드 레이아웃으로 데이터 표시' },
    { name: 'Tree / Hierarchy', desc: '계층 구조 데이터를 위한 트리 뷰' },
    { name: 'Chart / Graph', desc: 'Line, Bar, Area, Pie 차트 컴포넌트' },
    { name: 'Calendar / DatePicker / TimePicker', desc: '날짜 및 시간 선택 컴포넌트' },
    { name: 'SearchBar / Filter', desc: '검색 및 고급 필터링 시스템' },
    { name: 'TagSelector / MultiSelect', desc: '다중 선택 드롭다운 및 태그 선택기' }
  ],
  en: [
    { name: 'Table / DataGrid', desc: 'Advanced data table with sorting, filtering, and pagination' },
    { name: 'List / Item List', desc: 'Display data in list and grid layouts' },
    { name: 'Tree / Hierarchy', desc: 'Tree view for hierarchical data structures' },
    { name: 'Chart / Graph', desc: 'Line, Bar, Area, and Pie chart components' },
    { name: 'Calendar / DatePicker / TimePicker', desc: 'Date and time picker components' },
    { name: 'SearchBar / Filter', desc: 'Search and advanced filtering system' },
    { name: 'TagSelector / MultiSelect', desc: 'Multi-select dropdown and tag selector' }
  ]
};

export default function DataUIKitGuide({ isDark, language }: DataUIKitGuideProps) {
  return (
    <GuideContainer>
      <Section>
        <Title $isDark={isDark}>
          <Package />
          {language === 'ko' ? '설치 방법' : 'Installation'}
        </Title>
        <Description $isDark={isDark}>
          {language === 'ko' 
            ? 'npm 또는 yarn을 사용하여 Data UI Kit을 설치할 수 있습니다.'
            : 'Install Data UI Kit using npm or yarn.'}
        </Description>
        <CodeBlock $isDark={isDark}>
          <pre>npm install jy-data-ui-kit</pre>
        </CodeBlock>
        <CodeBlock $isDark={isDark}>
          <pre>yarn add jy-data-ui-kit</pre>
        </CodeBlock>
      </Section>

      <Section>
        <Title $isDark={isDark}>
          <Code />
          {language === 'ko' ? '기본 사용법' : 'Basic Usage'}
        </Title>
        <Description $isDark={isDark}>
          {language === 'ko'
            ? '필요한 컴포넌트를 import하여 사용하세요.'
            : 'Import the components you need.'}
        </Description>
        <CodeBlock $isDark={isDark}>
          <pre>{`import { DataTable, DataLineChart, DatePicker } from 'jy-data-ui-kit';

// Use in your component
function Dashboard() {
  const data = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 600 }
  ];

  return (
    <div>
      <DataLineChart
        title="Monthly Revenue"
        data={data}
        dataKey="value"
        isDark={false}
      />
      
      <DataTable
        columns={columns}
        data={tableData}
        isDark={false}
      />
    </div>
  );
}`}</pre>
        </CodeBlock>
      </Section>

      <Section>
        <Title $isDark={isDark}>
          <Book />
          {language === 'ko' ? '포함된 컴포넌트' : 'Included Components'}
        </Title>
        <ComponentGrid>
          {components[language].map((component, index) => (
            <ComponentCard key={index} $isDark={isDark}>
              <ComponentName $isDark={isDark}>{component.name}</ComponentName>
              <ComponentDesc $isDark={isDark}>{component.desc}</ComponentDesc>
            </ComponentCard>
          ))}
        </ComponentGrid>
      </Section>

      <Section>
        <Title $isDark={isDark}>
          <Terminal />
          {language === 'ko' ? '주요 기능' : 'Key Features'}
        </Title>
        <FeatureList $isDark={isDark}>
          <li>{language === 'ko' ? 'TypeScript 완벽 지원' : 'Full TypeScript support'}</li>
          <li>{language === 'ko' ? 'Apple 스타일의 미니멀한 디자인' : 'Apple-style minimal design'}</li>
          <li>{language === 'ko' ? '다크 모드 기본 지원' : 'Built-in dark mode support'}</li>
          <li>{language === 'ko' ? 'Recharts 기반 차트 컴포넌트' : 'Chart components based on Recharts'}</li>
          <li>{language === 'ko' ? '반응형 디자인' : 'Responsive design'}</li>
          <li>{language === 'ko' ? 'Tree-shaking 지원' : 'Tree-shaking support'}</li>
          <li>{language === 'ko' ? '커스터마이징 가능한 스타일' : 'Customizable styles'}</li>
          <li>{language === 'ko' ? '접근성 고려' : 'Accessibility considerations'}</li>
        </FeatureList>
      </Section>

      <Section>
        <SubTitle $isDark={isDark}>
          {language === 'ko' ? '피어 디펜던시' : 'Peer Dependencies'}
        </SubTitle>
        <Description $isDark={isDark}>
          {language === 'ko'
            ? 'Data UI Kit은 다음 패키지들을 피어 디펜던시로 사용합니다:'
            : 'Data UI Kit uses the following peer dependencies:'}
        </Description>
        <CodeBlock $isDark={isDark}>
          <pre>{`{
  "react": "^18.0.0",
  "react-dom": "^18.0.0",
  "styled-components": "^6.0.0",
  "recharts": "^2.0.0",
  "lucide-react": "^0.400.0"
}`}</pre>
        </CodeBlock>
      </Section>

      <Section>
        <SubTitle $isDark={isDark}>
          {language === 'ko' ? '예제' : 'Examples'}
        </SubTitle>
        <Description $isDark={isDark}>
          {language === 'ko'
            ? '아래에서 모든 컴포넌트의 실제 동작 예제를 확인할 수 있습니다.'
            : 'See live examples of all components below.'}
        </Description>
      </Section>
    </GuideContainer>
  );
}
