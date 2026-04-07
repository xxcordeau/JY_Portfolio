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

interface BlogEditorProps {
  isDark: boolean;
  language: 'ko' | 'en';
}

export default function BlogEditor({ isDark, language }: BlogEditorProps) {
  return (
    <Container>
      <Title $isDark={isDark}>블로그 관리</Title>
      <Description>
        기술 블로그 포스트를 추가, 수정, 삭제할 수 있습니다.
      </Description>

      <InfoCard $isDark={isDark}>
        <InfoText $isDark={isDark}>
          블로그 포스트는 두 부분으로 구성됩니다:
          <br /><br />
          <strong>1. 메타데이터 (<code>/data/blogData.ts</code>)</strong>
          <br />• <strong>id</strong>: 고유 식별자
          <br />• <strong>title</strong>: 포스트 제목 (한국어/영어)
          <br />• <strong>excerpt</strong>: 요약 (한국어/영어)
          <br />• <strong>date</strong>: 작성 날짜
          <br />• <strong>category</strong>: 카테고리 (한국어/영어)
          <br />• <strong>tags</strong>: 기술 태그
          <br />• <strong>readTime</strong>: 예상 읽기 시간
          <br />• <strong>image</strong>: 썸네일 이미지
          <br /><br />
          <strong>2. 포스트 컴포넌트 (<code>/components/blog/posts/</code>)</strong>
          <br />각 포스트는 독립적인 React 컴포넌트로 작성되며, 코드 하이라이팅, 이미지, 
          인터랙티브 요소 등을 포함할 수 있습니다.
          <br /><br />
          새 포스트를 추가하려면:
          <br />1. <code>/components/blog/posts/</code>에 새 컴포넌트 생성
          <br />2. <code>/components/blog/posts/index.ts</code>에 export 추가
          <br />3. <code>/data/blogData.ts</code>에 메타데이터 추가
        </InfoText>
      </InfoCard>
    </Container>
  );
}
