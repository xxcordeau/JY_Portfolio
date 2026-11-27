'use client';

import styled from 'styled-components';

const Content = styled.div``;

interface PostProps {
  language: 'ko' | 'en';
}

export const DesignUserActionPost = ({ language }: PostProps) => {
  if (language === 'ko') {
    return (
      <Content>
        <h2>배경</h2>

        <p>WinnTicket 쇼핑몰 화면을 만들 때 있었던 일이에요. 첫 번째 버전에서 상품 상세 페이지를 꽤 신경 써서 만들었어요. 큰 이미지에 깔끔한 타이포그래피, 여유 있는 레이아웃이었죠. 보기에는 만족스러웠는데, 실제로 테스트해 보니 사용자들이 '구매하기' 버튼을 찾는 데 시간이 걸렸어요.</p>

        <p>이유를 따져보니 페이지가 보여주기에 맞춰져 있었고, 행동하기에는 맞춰져 있지 않았어요. 상품 설명은 예쁘게 정리돼 있는데 정작 '이걸 사려면 어디를 눌러야 하지?'가 바로 보이지 않았던 거예요.</p>

        <h2>과정과 탐색</h2>

        <p>그 뒤로 화면을 설계할 때 처음 던지는 질문이 바뀌었어요.</p>

        <ul>
          <li>예전: "이 화면에 어떤 정보를 보여줄까?"</li>
          <li>지금: "사용자가 이 화면에서 할 행동은 뭘까?"</li>
        </ul>

        <p>상품 상세 페이지라면 사용자의 행동은 '구매하기' 또는 '옵션 선택하기'예요. 그러면 그 행동으로 가는 길이 가장 분명해야 해요. 정보는 그 행동을 돕는 역할이고, 그 자체가 목적은 아니에요.</p>

        <p>이 관점으로 다시 설계하니 구조가 많이 달라졌어요.</p>

        <p>CTA(Call to Action) 위치부터 정했어요. 모바일에서는 하단 고정, 데스크톱에서는 우측 사이드 고정이에요. 스크롤을 아무리 내려도 '구매하기' 버튼이 항상 보이게 했어요.</p>

        <p>정보 순서는 행동을 기준으로 다시 배치했어요. 사용자가 구매를 결정하는 데 필요한 순서에 맞춰 가격, 옵션, 주요 특징, 상세 설명, 리뷰 순으로 바꿨어요. 상세 설명은 보기엔 좋지만 실제로 끝까지 읽는 사용자는 많지 않아요.</p>

        <p>시각적 무게도 행동 쪽으로 몰았어요. '구매하기' 버튼은 primary 색상에 큰 사이즈로, '장바구니' 버튼은 outlined로 했어요. 두 버튼이 같은 크기에 같은 스타일이면 사용자가 0.5초 더 고민하게 되고, 그 0.5초가 전환율에 영향을 줘요.</p>

        <h2>다른 화면에도 적용한 사례</h2>

        <p>이 원칙을 다른 화면에도 적용해 봤어요.</p>

        <p>관리자 대시보드에서 사용자가 할 일은 '오늘 처리할 것 확인하기'예요. 그래서 미처리 주문 수와 오늘 문의 수를 맨 위에 큰 숫자로 두고, 그래프와 통계는 그 아래에 넣었어요.</p>

        <p>통인익스프레스의 계약 관리 화면에서는 '다음 단계로 넘기기'가 사용자의 행동이에요. 그래서 계약 상태별 진행 바를 상단에 두고, '다음 단계' 버튼을 가장 눈에 띄는 곳에 배치했어요.</p>

        <p>이 포트폴리오에서 방문자가 할 행동은 '프로젝트 보기' 아니면 '연락하기'예요. 그래서 히어로 섹션 바로 다음에 프로젝트가 나오고, 연락 버튼은 플로팅으로 띄워 언제든 누를 수 있게 했어요.</p>

        <p>어떤 화면이든 사용자의 다음 행동을 먼저 정하면 레이아웃은 따라왔어요.</p>

        <h2>배운 점</h2>

        <p>화면을 '어떻게 보일까'만 생각하고 만들면 갤러리가 되고, '어떻게 쓰일까'까지 생각하면 서비스가 돼요. 포트폴리오도 마찬가지예요. 프로젝트 카드를 예쁘게 다듬는 것보다, 클릭했을 때 궁금한 정보가 바로 보이는 게 더 중요했어요.</p>
      </Content>
    );
  }

  return (
    <Content>
      <h2>Background</h2>

      <p>This happened while I was building the WinnTicket shopping mall screens. In the first version I put a lot of care into the product detail page: large images, clean typography, a roomy layout. I was happy with how it looked, but when we tested it, users took a while to find the "Buy Now" button.</p>

      <p>Looking into why, I realized the page was built for showing, not for doing. The product descriptions were neatly laid out, but "Where do I click to buy this?" wasn't obvious.</p>

      <h2>Investigation</h2>

      <p>After that, the first question I ask when designing a screen changed.</p>

      <ul>
        <li>Before: "What information should I show on this screen?"</li>
        <li>Now: "What action will the user take on this screen?"</li>
      </ul>

      <p>On a product detail page, the user's action is "Buy" or "Select Options," so the path to that action has to be the clearest thing on the page. Information is there to support the action. It isn't the goal.</p>

      <p>Redesigning from that angle changed the structure a lot.</p>

      <p>I placed the CTA (Call to Action) first. It's fixed to the bottom on mobile and to the right side on desktop. However far you scroll, the "Buy Now" button stays visible.</p>

      <p>I reordered the information around the action, following the order people need to make a purchase decision: price, options, key features, detailed description, then reviews. The detailed description looks nice, but not many users read it to the end.</p>

      <p>I put the visual weight on the action. "Buy Now" got the primary color and a large size, and "Add to Cart" was outlined. If both buttons share the same size and style, users hesitate for an extra 0.5 seconds, and that 0.5 seconds affects conversion rates.</p>

      <h2>Applied to Other Screens</h2>

      <p>I applied the same principle to other screens.</p>

      <p>On the admin dashboard, the user's action is "Check what needs handling today." So the number of unprocessed orders and today's inquiries sit at the very top in large numbers, with charts and statistics below.</p>

      <p>On the contract management screen (Tongin Express), the user's action is "Move to the next step." So a progress bar by contract status sits at the top, and the "Next Step" button is in the most prominent spot.</p>

      <p>On this portfolio, a visitor's action is "View projects" or "Get in touch." So projects come right after the hero section, and the contact button floats so it's always within reach.</p>

      <p>On every screen, once I'd defined the user's next action, the layout followed.</p>

      <h2>Lessons Learned</h2>

      <p>If you only think about how a screen looks, you end up with a gallery. If you also think about how it's used, you end up with a service. Portfolios are no different: making project cards pretty mattered less than making sure people see what they're curious about as soon as they click.</p>
    </Content>
  );
};
