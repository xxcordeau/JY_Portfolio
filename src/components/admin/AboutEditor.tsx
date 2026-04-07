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

interface AboutEditorProps {
  isDark: boolean;
  language: 'ko' | 'en';
}

export default function AboutEditor({ isDark, language }: AboutEditorProps) {
  return (
    <Container>
      <Title $isDark={isDark}>About 관리</Title>
      <Description>
        프로필, 기술 스택, 학력, 경력 정보를 관리합니다.
      </Description>

      <InfoCard $isDark={isDark}>
        <InfoText $isDark={isDark}>
          About 섹션의 데이터는 <code>/data/aboutData.ts</code> 파일에서 직접 수정할 수 있습니다.
          <br /><br />
          파일 구조:
          <br />• <strong>skills</strong>: 기술 스택 및 숙련도 (프론트엔드, 백엔드, 디자인, 기타)
          <br />• <strong>education</strong>: 학력 정보
          <br />• <strong>experiences</strong>: 경력 정보
          <br /><br />
          각 항목은 한국어/영어 데이터를 모두 포함하고 있어 언어 전환 시 자동으로 표시됩니다.
        </InfoText>
      </InfoCard>
    </Container>
  );
}
