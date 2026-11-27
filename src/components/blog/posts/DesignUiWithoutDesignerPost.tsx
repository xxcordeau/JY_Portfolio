'use client';

import styled from 'styled-components';

const Content = styled.div``;

interface PostProps {
  language: 'ko' | 'en';
}

export const DesignUiWithoutDesignerPost = ({ language }: PostProps) => {
  if (language === 'ko') {
    return (
      <Content>
        <h2>배경</h2>

        <p>저는 디자이너로 일을 시작했어요. Figma에서 화면을 그리고, 컬러 팔레트를 만들고, 타이포그래피 위계를 잡는 게 일이었죠. 그러다 프론트엔드 개발을 시작하면서 UI를 보는 시선이 크게 바뀌었어요.</p>

        <p>디자이너일 때는 '이 화면이 얼마나 좋아 보이는가'가 기준이었는데, 개발자가 되고 나서는 '이 화면이 얼마나 잘 작동하는가'가 기준이 됐어요. 둘 다 필요하지만 무게중심이 옮겨가니 만드는 방식도 달라졌어요.</p>

        <h2>디자이너 시절에는 몰랐던 것들</h2>

        <p>디자인할 때는 상태(state)라는 개념이 없었어요. '완성된 화면'만 그렸거든요. 버튼은 늘 활성 상태, 리스트에는 늘 데이터가 있고, 에러는 별도 시안으로 따로 만들었어요. 그런데 개발을 시작하니 로딩 중일 때, 데이터가 없을 때, 에러가 났을 때, 권한이 없을 때처럼 컴포넌트 하나가 가질 수 있는 상태가 너무 많았어요. 시안에는 2~3개 화면뿐인데 실제 코드에서는 10가지 이상의 경우를 처리해야 했어요.</p>

        <p>그 뒤로는 화면을 설계할 때 처음부터 모든 상태를 같이 생각해요. Figma에서 시안을 만들 때도 default, loading, empty, error, disabled를 한 세트로 만들어요.</p>

        <p>반복 가능한 구조가 왜 필요한지도 몰랐어요. 디자이너일 때는 화면마다 조금씩 다르게 만들어도 괜찮았어요. 이 카드는 패딩 16px, 저 카드는 20px. '이 화면에서는 이게 더 예뻐 보이니까'라는 이유로요. 그런데 컴포넌트로 구현하려고 보니 이런 미세한 차이가 재사용을 어렵게 했고, 비슷한 컴포넌트가 여러 개 생기는 원인이 됐어요.</p>

        <p>지금은 디자인 단계에서부터 '이걸 컴포넌트 하나로 만들 수 있을까?'를 따져 봐요. 두 화면에서 같은 역할을 하는 요소라면, 보기에 조금 달라도 하나의 변형(variant)으로 다룰 수 있게 설계해요.</p>

        <h2>디자인 감각이 개발에서 도움이 될 때</h2>

        <p>반대로 디자이너 출신이라 개발할 때 유리한 점도 있어요.</p>

        <p>먼저 레퍼런스를 보는 눈이 달라요. 다른 서비스의 UI를 보면 '예쁘다'에서 멈추지 않고, 왜 이 여백인지, 왜 이 색 조합인지, 타이포그래피 위계가 시선을 어떻게 끌고 가는지를 바로 읽어요.</p>

        <p>여백과 정렬에도 예민해요. 개발하다 보면 '이 정도면 되겠지' 하고 넘어가기 쉬운 부분이 여백과 정렬인데, 디자인 훈련을 받았으니 4px 차이도 눈에 들어와요. 사용자가 의식하지 못하는 '깔끔한 느낌'은 이런 차이에서 나와요.</p>

        <p>Figma에서 개발까지 혼자 이어서 할 수 있다는 점도 있어요. 디자인에서 개발로 넘길 때 흔히 생기는 '시안이랑 다른데요' 문제가 없어요. 머릿속에 있는 그대로 코드로 옮기니까 의도한 UX가 그대로 구현돼요.</p>

        <h2>지금의 프로세스</h2>

        <p>두 경험이 합쳐지면서 UI를 만드는 순서가 이렇게 정리됐어요.</p>

        <ol>
          <li>구조를 먼저 잡아요. Figma에서 흑백(gray)으로만 레이아웃을 만들어요. 색 없이도 정보 위계가 읽히면 구조가 잘 잡힌 거예요.</li>
          <li>상태를 전부 정의해요. default, hover, loading, empty, error, disabled까지 컴포넌트 하나의 모든 상태를 시안 단계에서 만들어요.</li>
          <li>컴포넌트 단위로 생각해요. '이 화면'이 아니라 '이 컴포넌트'를 만든다는 관점으로, 다른 곳에서도 쓸 수 있게 설계해요.</li>
          <li>실제 데이터로 확인해요. Lorem ipsum 대신 진짜 데이터로 화면을 채워 봐요. 제목이 두 줄이 되면 레이아웃이 깨지는지, 이미지 비율이 다르면 어떻게 보이는지 확인해요.</li>
        </ol>

        <h2>배운 점</h2>

        <p>디자이너에서 개발자로 넘어오면서 가장 크게 배운 건 '예쁜 화면'과 '좋은 UI'가 다르다는 거예요. 예쁜 화면은 감각으로 만들 수 있지만, 좋은 UI는 시스템으로 만들어야 해요. 모든 상태를 다루고, 일관되게 동작하고, 다음에 뭘 해야 하는지 누구나 알 수 있는 화면이요.</p>

        <p>그래서 지금은 시안을 그릴 때부터 코드로 옮길 구조를 같이 생각하면서 작업해요.</p>
      </Content>
    );
  }

  return (
    <Content>
      <h2>Background</h2>

      <p>I started out as a designer. My job was drawing screens in Figma, building color palettes, and setting typographic hierarchy. When I moved into frontend development, the way I looked at UI changed a lot.</p>

      <p>As a designer, my question was "how good does this screen look?" As a developer, it became "how well does this screen work?" Both matter, but once the weight shifted, so did the way I build things.</p>

      <h2>What I Didn't Know as a Designer</h2>

      <p>I had no concept of state. When designing, I only drew finished screens. Buttons were always active, lists always had data, and errors lived in a separate mockup. Once I started coding, a single component turned out to have loading, empty, error, and unauthorized states, and more. A design file had 2-3 screens, but the actual code had to handle 10+ cases.</p>

      <p>Since then I think about every state from the start when designing a screen. Even in Figma, I now make default, loading, empty, error, and disabled as one set.</p>

      <p>I also didn't see why repeatable structure mattered. As a designer, making things slightly different per screen was fine. This card gets 16px padding, that one gets 20px, "because it looks better on this screen." But when I implemented them as components, those small differences got in the way of reuse and left me with several near-identical components.</p>

      <p>Now I ask "Can this be one component?" during the design phase. If elements play the same role on two screens, I design them as variants of one component, even if they look a little different.</p>

      <h2>Where Design Sense Helps in Development</h2>

      <p>On the other hand, a design background does give me some advantages as a developer.</p>

      <p>I read references differently. When I look at another service's UI, I don't stop at "that's pretty." I can see why this whitespace, why this color combination, and how the typographic hierarchy guides the eye.</p>

      <p>I'm sensitive to spacing and alignment. They're easy to wave through with "close enough" during development, but with design training even a 4px difference catches my eye. That's where the "clean feeling" users can't quite name comes from.</p>

      <p>I can also take a screen from Figma to code on my own. The "this doesn't match the mockup" problem from design-to-development handoff doesn't come up. I translate what's in my head straight into code, so the UX I intended is what gets built.</p>

      <h2>My Current Process</h2>

      <p>With both backgrounds combined, my UI process has settled into this order:</p>

      <ol>
        <li>Structure first. I lay out screens in Figma in grayscale only. If the information hierarchy reads without color, the structure is solid.</li>
        <li>Define every state. I make every state of a component (default, hover, loading, empty, error, disabled) at the mockup stage.</li>
        <li>Think in components. I design from the view of "this component," not "this screen," so it can be reused elsewhere.</li>
        <li>Check with real data. I fill screens with actual data instead of Lorem ipsum, and check whether the layout breaks when a title wraps to two lines or how things look when image ratios differ.</li>
      </ol>

      <h2>Lessons Learned</h2>

      <p>The biggest thing I learned moving from design to development is that a pretty screen and a good UI are different things. A pretty screen can come from intuition, but a good UI has to be built as a system: one that covers every state, behaves consistently, and makes it obvious what to do next.</p>

      <p>So these days I think about the code structure from the moment I start a mockup.</p>
    </Content>
  );
};
