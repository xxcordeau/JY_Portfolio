import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
`;

const Title = styled.h2<{ $isDark: boolean }>`
  font-size: 32px;
  font-weight: 600;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  margin: 0 0 16px 0;
  letter-spacing: -0.5px;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const Description = styled.p`
  font-size: 17px;
  color: #86868b;
  line-height: 1.6;
  margin: 0 0 32px 0;
`;

const InfoCard = styled.div<{ $isDark: boolean }>`
  background: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(255, 255, 255, 0.8)'};
  border: 1px solid ${props => props.$isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'};
  border-radius: 16px;
  padding: 32px;
  backdrop-filter: blur(20px);
`;

const InfoText = styled.p<{ $isDark: boolean }>`
  font-size: 16px;
  color: ${props => props.$isDark ? '#d4d4d8' : '#6e6e73'};
  line-height: 1.7;
  margin: 0;

  code {
    background: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)'};
    padding: 2px 8px;
    border-radius: 4px;
    font-family: 'Monaco', 'Courier New', monospace;
    font-size: 14px;
    color: ${props => props.$isDark ? '#4ECDC4' : '#007AFF'};
  }
`;

interface ProjectEditorProps {
  isDark: boolean;
  language: 'ko' | 'en';
}

export default function ProjectEditor({ isDark, language }: ProjectEditorProps) {
  return (
    <Container>
      <Title $isDark={isDark}>프로젝트 관리</Title>
      <Description>
        포트폴리오 프로젝트를 추가, 수정, 삭제할 수 있습니다.
      </Description>

      <InfoCard $isDark={isDark}>
        <InfoText $isDark={isDark}>
          프로젝트 데이터는 <code>/data/projectsData.ts</code> 파일에서 직접 수정할 수 있습니다.
          <br /><br />
          각 프로젝트는 다음 정보를 포함합니다:
          <br />• <strong>id</strong>: 고유 식별자
          <br />• <strong>title</strong>: 프로젝트 제목 (한국어/영어)
          <br />• <strong>category</strong>: 카테고리 (한국어/영어)
          <br />• <strong>year</strong>: 제작 연도
          <br />• <strong>description</strong>: 프로젝트 설명 (한국어/영어)
          <br />• <strong>image</strong>: 대표 이미지 URL
          <br />• <strong>tags</strong>: 기술 스택 태그
          <br />• <strong>role</strong>: 담당 역할 (한국어/영어)
          <br />• <strong>period</strong>: 작업 기간
          <br />• <strong>team</strong>: 팀 구성
          <br />• <strong>features</strong>: 주요 기능 목록 (한국어/영어)
          <br />• <strong>results</strong>: 프로젝트 성과 (한국어/영어)
          <br />• <strong>demoComponent</strong>: 인터랙티브 데모 (선택사항)
        </InfoText>
      </InfoCard>
    </Container>
  );
}
