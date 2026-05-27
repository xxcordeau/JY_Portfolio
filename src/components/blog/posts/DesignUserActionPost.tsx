import styled from 'styled-components';

const Content = styled.div``;

interface PostProps {
  language: 'ko' | 'en';
}

export const DesignUserActionPost = ({ language }: PostProps) => {
  if (language === 'ko') {
    return (
      <Content>
        <h1>사용자는 '예쁜 화면'이 아니라 '다음에 뭘 해야 하는지'를 원해요</h1>

        <h2>배경</h2>

        <p>WinnTicket 쇼핑몰 화면을 만들 때 있었던 일이에요. 첫 번째 버전에서 상품 상세 페이지를 꽤 신경 써서 만들었어요. 큰 이미지, 깔끔한 타이포그래피, 여유 있는 레이아웃. 시각적으로는 만족스러웠는데, 실제로 테스트해보니 사용자들이 '구매하기' 버튼을 찾는 데 시간이 걸리더라고요.</p>

        <p>이유를 분석해보니, 페이지가 '보여주기'에 최적화되어 있었지 '행동하기'에 최적화되어 있지 않았어요. 상품 설명은 예쁘게 정리되어 있는데, 정작 '이걸 사려면 어디를 눌러야 하지?'가 직관적이지 않았던 거예요.</p>

        <h2>과정과 탐색</h2>

        <p>이 경험 이후로 화면을 설계할 때 가장 먼저 하는 질문이 바뀌었어요.</p>

        <p>예전: "이 화면에 어떤 정보를 보여줄까?"</p>
        <p>지금: <strong>"사용자가 이 화면에서 할 행동은 뭘까?"</strong></p>

        <p>상품 상세 페이지의 경우, 사용자의 행동은 '구매하기' 또는 '옵션 선택하기'예요. 그러면 그 행동으로 향하는 경로가 가장 명확해야 해요. 정보는 그 행동을 돕는 역할이지, 그 자체가 목적이 아니거든요.</p>

        <p>이 관점으로 다시 설계하니까 구조가 완전히 달라졌어요.</p>

        <p><strong>CTA(Call to Action)의 위치를 먼저 정했어요.</strong> 모바일에서는 하단 고정, 데스크톱에서는 우측 사이드 고정. 스크롤을 아무리 내려도 '구매하기' 버튼은 항상 보이게 했어요.</p>

        <p><strong>정보의 순서를 행동 기준으로 재배치했어요.</strong> 사용자가 구매 결정을 내리는 데 필요한 정보 순서로 — 가격 → 옵션 → 주요 특징 → 상세 설명 → 리뷰. '상세 설명'은 예쁘지만, 실제로 그걸 끝까지 읽는 사용자는 많지 않아요.</p>

        <p><strong>시각적 무게를 행동에 집중시켰어요.</strong> '구매하기' 버튼이 primary 색상에 큰 사이즈로, '장바구니' 버튼은 outlined로. 둘 다 같은 크기에 같은 스타일이면 사용자가 0.5초 더 고민하게 돼요. 그 0.5초가 전환율에 영향을 줘요.</p>

        <h2>다른 화면에도 적용한 사례</h2>

        <p>이 원칙을 다른 화면에도 적용해봤어요.</p>

        <p><strong>관리자 대시보드</strong>에서는 사용자의 행동이 '오늘 처리할 건 확인하기'예요. 그래서 미처리 주문 수, 오늘 문의 수를 가장 위에 큰 숫자로 배치했어요. 그래프나 통계는 그 아래에 넣었고요.</p>

        <p><strong>계약 관리 화면</strong>(통인익스프레스)에서는 사용자의 행동이 '다음 단계로 넘기기'예요. 그래서 계약 상태별 진행 바를 상단에 두고, '다음 단계' 버튼을 가장 눈에 띄는 곳에 배치했어요.</p>

        <p><strong>이 포트폴리오</strong>에서는 방문자의 행동이 '프로젝트 보기' 또는 '연락하기'예요. 그래서 히어로 섹션 다음에 바로 프로젝트가 나오고, 연락 버튼은 플로팅으로 항상 접근 가능하게 했어요.</p>

        <p>어떤 화면이든, 사용자의 '다음 행동'을 먼저 정의하면 레이아웃이 자연스럽게 따라왔어요.</p>

        <h2>배운 점</h2>

        <p>화면을 만들 때 '어떻게 보일까'만 생각하면 갤러리가 되고, '어떻게 쓰일까'를 같이 생각하면 서비스가 돼요. 포트폴리오를 만드는 경우에도 마찬가지예요. 프로젝트 카드를 예쁘게 만드는 것보다, 클릭했을 때 궁금한 정보가 바로 보이는 게 더 중요해요.</p>

        <p><strong>디자인은 보이는 것을 다루는 일이지만, 좋은 디자인은 보이지 않는 사용자의 행동을 설계하는 일이에요.</strong></p>
      </Content>
    );
  }

  return (
    <Content>
      <h1>Users Want to Know What to Do Next, Not Just See Pretty Screens</h1>

      <h2>Background</h2>

      <p>This happened while I was building the WinnTicket shopping mall screens. In the first version, I put a lot of care into the product detail page. Large images, clean typography, generous layout. It looked great visually, but when we actually tested it, users were taking time to find the "Buy Now" button.</p>

      <p>When I analyzed why, I realized the page had been optimized for "showing" rather than "doing." The product descriptions were neatly organized, but the answer to "Where do I click to buy this?" wasn't intuitive at all.</p>

      <h2>Investigation</h2>

      <p>After that experience, the first question I ask when designing a screen completely changed.</p>

      <p>Before: "What information should I show on this screen?"</p>
      <p>Now: <strong>"What action will the user take on this screen?"</strong></p>

      <p>For a product detail page, the user's action is "Buy" or "Select Options." That means the path toward that action needs to be the clearest thing on the page. Information exists to support the action — it's not the goal itself.</p>

      <p>When I redesigned with this perspective, the structure changed completely.</p>

      <p><strong>I decided the CTA (Call to Action) placement first.</strong> Fixed to the bottom on mobile, fixed to the right side on desktop. No matter how far you scrolled, the "Buy Now" button was always visible.</p>

      <p><strong>I reordered information based on the action.</strong> In the order users need to make a purchase decision — price, options, key features, detailed description, reviews. The "detailed description" section looks nice, but in reality, not many users read it all the way through.</p>

      <p><strong>I concentrated visual weight on the action.</strong> The "Buy Now" button got the primary color and a large size, while the "Add to Cart" button was outlined. If both buttons are the same size and style, the user hesitates for an extra 0.5 seconds. That 0.5 seconds affects conversion rates.</p>

      <h2>Applied to Other Screens</h2>

      <p>I applied this principle to other screens as well.</p>

      <p>On the <strong>admin dashboard</strong>, the user's action is "Check what needs to be handled today." So I placed the number of unprocessed orders and today's inquiries at the very top in large numbers. Charts and statistics went below that.</p>

      <p>On the <strong>contract management screen</strong> (Tongin Express), the user's action is "Move to the next step." So I put a progress bar by contract status at the top and placed the "Next Step" button in the most prominent position.</p>

      <p>On <strong>this portfolio</strong>, the visitor's action is "View projects" or "Get in touch." So projects appear right after the hero section, and the contact button floats so it's always accessible.</p>

      <p>For any screen, once I defined the user's "next action" first, the layout naturally followed.</p>

      <h2>Lessons Learned</h2>

      <p>When you build a screen thinking only about "how it looks," you end up with a gallery. When you also think about "how it's used," you end up with a service. The same applies when building a portfolio. Making project cards look pretty matters less than making sure the information people are curious about is immediately visible when they click.</p>

      <p><strong>Design is about handling what's visible, but good design is about shaping the invisible actions of the user.</strong></p>
    </Content>
  );
};
