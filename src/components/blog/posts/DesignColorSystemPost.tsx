import styled from 'styled-components';

const Content = styled.div``;

interface PostProps {
  language: 'ko' | 'en';
}

export const DesignColorSystemPost = ({ language }: PostProps) => {
  if (language === 'ko') {
    return (
      <Content>
        <h1>색을 고르는 건 감각이 아니라 시스템이에요</h1>

        <h2>배경</h2>

        <p>Keyrke 프로젝트에서 디자인 시스템을 만들 때, 가장 처음 막힌 게 색상이었어요. '메인 컬러를 뭘로 하지?' 같은 거창한 고민이 아니라, 훨씬 실무적인 문제였어요. 버튼의 hover 색은 뭘로 할 건지, disabled 상태는 어떤 회색을 쓸 건지, 에러 메시지의 빨간색은 배경이 어두울 때도 같은 값을 쓸 건지 — 이런 것들이요.</p>

        <p>처음엔 매번 눈으로 보면서 '이 정도면 되겠지' 하고 색을 골랐어요. 그랬더니 화면마다 미묘하게 다른 회색이 쓰이고, 같은 '비활성' 상태인데 이 화면에선 opacity 0.4이고 저 화면에선 opacity 0.5인 상황이 생겼어요. 혼자 작업할 땐 감으로 맞출 수 있었는데, 팀원이 같이 쓰기 시작하니까 바로 무너졌어요.</p>

        <h2>과정과 탐색</h2>

        <p>그래서 색상을 '감각'이 아니라 '시스템'으로 접근하기로 했어요.</p>

        <p>가장 먼저 한 건 색상 팔레트를 단계별로 나누는 작업이었어요. 하나의 색상(예: blue)을 50부터 900까지 10단계로 나누고, 각 단계가 어떤 용도인지를 미리 정했어요.</p>

        <pre><code>{`blue-50:  배경 (알림 배너, 선택된 행 등)
blue-100: 보더 (선택 상태)
blue-200: 보더 (hover)
blue-500: 기본 텍스트/아이콘
blue-600: 버튼 배경
blue-700: 버튼 hover
blue-900: 강조 텍스트`}</code></pre>

        <p>이렇게 정해두면 새 화면을 만들 때 '이 버튼 hover를 어떤 색으로 하지?' 같은 고민이 사라져요. blue-700이에요. 끝. 다른 사람이 작업해도 같은 결과가 나와요.</p>

        <p><strong>gray도 같은 방식으로 나눴어요.</strong> 사실 UI에서 가장 많이 쓰이는 건 gray거든요. 배경, 보더, 비활성 텍스트, 구분선, placeholder — 전부 gray의 변형이에요. gray를 체계 없이 쓰면 화면이 탁해 보이고, 체계적으로 쓰면 깔끔해 보여요. 차이는 미세한데, 느낌은 확연히 달라요.</p>

        <p><strong>다크 모드 색상은 별도로 매핑했어요.</strong> 라이트 모드에서 gray-100이 배경이라면, 다크 모드에서는 gray-900이 배경이 돼요. 단순히 뒤집는 게 아니라, 각 역할(배경, 표면, 텍스트, 보더)별로 라이트/다크 매핑 테이블을 만들었어요. 이 과정에서 '색상은 값이 아니라 역할'이라는 걸 확실히 배웠어요.</p>

        <pre><code>{`/* 값이 아니라 역할로 이름 붙이기 */
--color-bg-primary      /* 라이트: white, 다크: gray-950 */
--color-bg-secondary    /* 라이트: gray-50, 다크: gray-900 */
--color-text-primary    /* 라이트: gray-900, 다크: gray-50 */
--color-text-secondary  /* 라이트: gray-500, 다크: gray-400 */
--color-border-default  /* 라이트: gray-200, 다크: gray-700 */`}</code></pre>

        <p>이렇게 하면 컴포넌트 코드에서 <code>var(--color-bg-primary)</code>만 쓰면 돼요. 다크 모드든 라이트 모드든 자동으로 맞는 색이 들어가요.</p>

        <h2>배운 점</h2>

        <p>색상을 시스템으로 만들고 나서 가장 크게 달라진 건, 디자인 의사결정 속도였어요. 예전에는 새 화면 하나 만들 때마다 Figma에서 색을 고르느라 30분씩 썼는데, 시스템이 생기고 나서는 5분이면 끝났어요. 선택지가 줄어드니까 오히려 빨라진 거예요.</p>

        <p>'좋은 디자인은 선택을 잘 하는 것'이라는 말이 있는데, 저는 여기에 하나 더 붙이고 싶어요. <strong>좋은 시스템은 선택할 필요를 없애주는 것</strong>이라고요.</p>
      </Content>
    );
  }

  return (
    <Content>
      <h1>Choosing Colors Is a System, Not a Sense</h1>

      <h2>Background</h2>

      <p>When I was building the design system for the Keyrke project, the very first thing I got stuck on was color. It wasn't a grand question like "What should our primary color be?" — it was far more practical. What color should a button's hover state be? Which gray goes on a disabled state? Should the red for error messages stay the same value on a dark background? Those kinds of things.</p>

      <p>At first, I picked colors by eye every time — "this looks about right." The result was subtly different grays on every screen, and the same "disabled" state showing up as opacity 0.4 on one screen and 0.5 on another. When I was working alone, I could keep things consistent by feel. The moment a teammate started using the same components, it all fell apart.</p>

      <h2>Investigation</h2>

      <p>So I decided to approach color as a "system" rather than a "sense."</p>

      <p>The first thing I did was break the color palette into graduated steps. I divided a single hue (say, blue) into 10 levels from 50 to 900, and predefined what each level was meant for.</p>

      <pre><code>{`blue-50:  Backgrounds (notification banners, selected rows, etc.)
blue-100: Borders (selected state)
blue-200: Borders (hover)
blue-500: Default text/icons
blue-600: Button backgrounds
blue-700: Button hover
blue-900: Emphasis text`}</code></pre>

      <p>With this in place, questions like "What color should this button's hover be?" simply disappear. It's blue-700. Done. Someone else working on the project arrives at the same result.</p>

      <p><strong>I applied the same approach to gray.</strong> Gray is actually the most-used color in any UI. Backgrounds, borders, disabled text, dividers, placeholders — they're all variations of gray. When gray is used without a system the screen looks muddy; when it's used systematically, it looks clean. The differences are subtle, but the impression is strikingly different.</p>

      <p><strong>Dark mode colors were mapped separately.</strong> If gray-100 is the background in light mode, then gray-900 becomes the background in dark mode. Rather than simply inverting the scale, I built a light/dark mapping table for each role — background, surface, text, border. This process made it crystal clear that "color is a role, not a value."</p>

      <pre><code>{`/* Name by role, not by value */
--color-bg-primary      /* light: white, dark: gray-950 */
--color-bg-secondary    /* light: gray-50, dark: gray-900 */
--color-text-primary    /* light: gray-900, dark: gray-50 */
--color-text-secondary  /* light: gray-500, dark: gray-400 */
--color-border-default  /* light: gray-200, dark: gray-700 */`}</code></pre>

      <p>With this setup, component code only needs <code>var(--color-bg-primary)</code>. Whether it's dark mode or light mode, the right color is applied automatically.</p>

      <h2>Lessons Learned</h2>

      <p>The biggest change after turning color into a system was the speed of design decisions. I used to spend 30 minutes picking colors in Figma every time I built a new screen. After the system was in place, it took five minutes. Fewer choices actually made things faster.</p>

      <p>There's a saying that "good design is about making the right choices." I'd add one more thing to that: <strong>a good system eliminates the need to choose at all.</strong></p>
    </Content>
  );
};
