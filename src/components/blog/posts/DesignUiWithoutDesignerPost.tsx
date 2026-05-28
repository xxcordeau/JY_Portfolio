import styled from 'styled-components';

const Content = styled.div``;

interface PostProps {
  language: 'ko' | 'en';
}

export const DesignUiWithoutDesignerPost = ({ language }: PostProps) => {
  if (language === 'ko') {
    return (
      <Content>
        <h1>디자이너에서 개발자로 — UI를 바라보는 시선이 달라진 순간</h1>

        <h2>배경</h2>

        <p>저는 원래 디자이너로 시작했어요. Figma에서 화면을 그리고, 컬러 팔레트를 만들고, 타이포그래피 위계를 잡는 게 일이었죠. 그러다 프론트엔드 개발을 시작하면서 UI를 바라보는 시선이 완전히 달라졌어요.</p>

        <p>디자이너일 때는 '이 화면이 얼마나 좋아 보이는가'가 기준이었는데, 개발자가 되고 나서는 '이 화면이 얼마나 잘 작동하는가'가 기준이 됐어요. 둘 다 중요한 건 맞지만, 무게중심이 바뀌니까 만드는 방식 자체가 달라졌어요.</p>

        <h2>디자이너 시절에는 몰랐던 것들</h2>

        <p><strong>상태(state)라는 개념이 없었어요.</strong> 디자인할 때는 '완성된 화면'만 그렸거든요. 버튼은 항상 활성 상태, 리스트에는 항상 데이터가 있고, 에러는 별도 시안으로 따로 만들었어요. 그런데 개발을 시작하니까 — 로딩 중일 때, 데이터가 없을 때, 에러가 났을 때, 권한이 없을 때 — 한 컴포넌트가 가질 수 있는 상태가 너무 많았어요. 디자인 시안에는 2~3개 화면이지만, 실제 코드에서는 10가지 이상의 경우를 처리해야 했어요.</p>

        <p>이 경험 이후로 화면을 설계할 때 처음부터 모든 상태를 같이 생각하게 됐어요. Figma에서 시안을 만들 때도 default, loading, empty, error, disabled를 한 세트로 만들어요.</p>

        <p><strong>반복 가능한 구조의 중요성을 몰랐어요.</strong> 디자이너일 때는 화면마다 조금씩 다르게 만들어도 괜찮았어요. 이 카드는 패딩 16px, 저 카드는 20px — '이 화면에서는 이게 더 예뻐 보이니까'라는 이유로요. 그런데 컴포넌트로 구현할 때 이런 미세한 차이는 재사용을 어렵게 만들고, 결국 비슷한 컴포넌트가 여러 개 생기는 원인이 됐어요.</p>

        <p>지금은 디자인 단계에서부터 '이건 하나의 컴포넌트로 만들 수 있는가?'를 고민해요. 만약 두 화면에서 같은 역할을 하는 요소라면, 시각적으로 약간 다르더라도 하나의 변형(variant)으로 다룰 수 있게 설계해요.</p>

        <h2>디자인 감각이 개발에서 무기가 되는 순간</h2>

        <p>반대로, 디자이너 출신이라서 개발할 때 유리한 점도 확실히 있어요.</p>

        <p><strong>레퍼런스를 분석하는 눈이 달라요.</strong> 다른 서비스의 UI를 볼 때 '예쁘다'에서 끝나지 않고, '왜 이 여백인지', '왜 이 색상 조합인지', '이 타이포그래피 위계가 어떻게 시선을 유도하는지'를 바로 파악할 수 있어요. 새로운 화면을 만들 때 레퍼런스에서 규칙을 추출하는 속도가 빨라요.</p>

        <p><strong>여백과 정렬에 대한 감각이 있어요.</strong> 개발하면서 '이 정도면 되겠지'로 넘어가기 쉬운 부분이 여백과 정렬인데, 디자인 훈련이 있으면 4px 차이도 눈에 들어와요. 이게 사용자가 의식하지 못하는 '깔끔한 느낌'을 만드는 데 큰 차이를 줘요.</p>

        <p><strong>Figma에서 개발까지 혼자 끊김 없이 할 수 있어요.</strong> 디자인 → 개발 핸드오프 과정에서 생기는 '시안이랑 다른데요' 문제가 없어요. 머릿속에 있는 그대로 코드로 옮길 수 있으니까, 의도한 UX가 그대로 구현돼요.</p>

        <h2>지금의 프로세스</h2>

        <p>디자이너와 개발자 양쪽 경험이 합쳐지면서, 제 UI 제작 프로세스는 이렇게 정리됐어요.</p>

        <p><strong>1. 구조를 먼저 잡아요.</strong> Figma에서 흑백(gray)으로만 레이아웃을 만들어요. 색 없이도 정보 위계가 읽히면 구조가 잘 잡힌 거예요.</p>

        <p><strong>2. 상태를 전부 정의해요.</strong> default, hover, loading, empty, error, disabled — 한 컴포넌트의 모든 상태를 시안 단계에서 만들어요.</p>

        <p><strong>3. 컴포넌트 단위로 생각해요.</strong> '이 화면'이 아니라 '이 컴포넌트'를 만든다는 관점으로 설계해요. 다른 곳에서도 재사용될 수 있게요.</p>

        <p><strong>4. 실제 데이터로 검증해요.</strong> Lorem ipsum이 아니라 진짜 데이터로 화면을 채워봐요. 제목이 두 줄이 되면 레이아웃이 깨지는지, 이미지 비율이 다르면 어떻게 보이는지를 확인해요.</p>

        <h2>배운 점</h2>

        <p>디자이너에서 개발자로 전향하면서 가장 크게 배운 건, '예쁜 화면'과 '좋은 UI'는 다르다는 거예요. 예쁜 화면은 감각으로 만들 수 있지만, 좋은 UI는 시스템으로 만들어야 해요. 모든 상태를 커버하고, 일관되게 동작하고, 누가 봐도 다음에 뭘 해야 하는지 알 수 있는 화면.</p>

        <p><strong>디자인 감각과 개발의 구조적 사고가 만나면, 둘 중 하나만 할 때보다 훨씬 단단한 UI가 나와요.</strong></p>
      </Content>
    );
  }

  return (
    <Content>
      <h1>From Designer to Developer — When My Perspective on UI Changed</h1>

      <h2>Background</h2>

      <p>I started as a designer. My job was drawing screens in Figma, creating color palettes, and establishing typographic hierarchy. When I transitioned to frontend development, the way I looked at UI changed completely.</p>

      <p>As a designer, my standard was "how good does this screen look?" After becoming a developer, it shifted to "how well does this screen work?" Both matter, but the shift in focus fundamentally changed how I build things.</p>

      <h2>What I Didn't Know as a Designer</h2>

      <p><strong>I had no concept of state.</strong> When designing, I only drew "finished screens." Buttons were always active, lists always had data, and errors were separate mockups. But once I started coding — loading states, empty states, error states, unauthorized states — a single component could have so many states. A design file had 2-3 screens, but the actual code needed to handle 10+ cases.</p>

      <p>After this experience, I started thinking about all states from the very beginning when designing screens. Even in Figma, I now create default, loading, empty, error, and disabled as a complete set.</p>

      <p><strong>I didn't understand the importance of repeatable structure.</strong> As a designer, making things slightly different per screen was fine. This card has 16px padding, that card has 20px — "because this looks better on this screen." But when implementing as components, these subtle differences made reuse difficult and led to multiple similar components proliferating.</p>

      <p>Now I ask "Can this be made as a single component?" during the design phase. If elements serve the same role across two screens, I design them as variants of one component, even if they look slightly different.</p>

      <h2>When Design Sense Becomes a Weapon in Development</h2>

      <p>Conversely, coming from a design background definitely gives advantages when developing.</p>

      <p><strong>I analyze references differently.</strong> When looking at other services' UIs, I don't just stop at "that's pretty." I can immediately identify "why this whitespace," "why this color combination," "how this typographic hierarchy guides the eye." When building new screens, I can extract rules from references much faster.</p>

      <p><strong>I have an instinct for spacing and alignment.</strong> Spacing and alignment are easy to gloss over with "close enough" during development, but with design training, even a 4px difference catches my eye. This makes a huge difference in creating that "clean feeling" users can't consciously identify.</p>

      <p><strong>I can go from Figma to code seamlessly.</strong> The "this doesn't match the mockup" problem that happens during design-to-development handoff doesn't exist. Since I can translate what's in my head directly to code, the intended UX is implemented exactly as designed.</p>

      <h2>My Current Process</h2>

      <p>With experience from both sides combined, my UI creation process has settled into this:</p>

      <p><strong>1. Structure first.</strong> I create layouts in Figma using only grayscale. If the information hierarchy reads well without color, the structure is solid.</p>

      <p><strong>2. Define all states.</strong> Default, hover, loading, empty, error, disabled — I create all states of a component during the mockup phase.</p>

      <p><strong>3. Think in components.</strong> I design from the perspective of "this component" not "this screen." So it can be reused elsewhere.</p>

      <p><strong>4. Verify with real data.</strong> I fill screens with actual data, not Lorem ipsum. I check whether the layout breaks when a title wraps to two lines, or how things look when image ratios differ.</p>

      <h2>Lessons Learned</h2>

      <p>The biggest lesson from transitioning from designer to developer is that a "pretty screen" and a "good UI" are different things. A pretty screen can be made with intuition, but a good UI needs to be built as a system. One that covers every state, behaves consistently, and makes it obvious what to do next.</p>

      <p><strong>When design intuition meets development's structural thinking, the UI that emerges is far more solid than what either discipline produces alone.</strong></p>
    </Content>
  );
};
