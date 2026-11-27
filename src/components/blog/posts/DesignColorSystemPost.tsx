'use client';

import styled from 'styled-components';

const Content = styled.div``;

interface PostProps {
  language: 'ko' | 'en';
}

export const DesignColorSystemPost = ({ language }: PostProps) => {
  if (language === 'ko') {
    return (
      <Content>
        <h2>배경</h2>

        <p>Keyrke 프로젝트에서 디자인 시스템을 만들 때 가장 먼저 막힌 게 색상이었어요. 메인 컬러를 뭘로 할지 같은 큰 고민은 아니었고, 더 실무적인 문제였어요. 버튼 hover 색은 뭘로 할지, disabled 상태엔 어떤 회색을 쓸지, 에러 메시지의 빨간색을 배경이 어두울 때도 같은 값으로 쓸지 같은 것들이요.</p>

        <p>처음엔 매번 눈으로 보면서 '이 정도면 되겠지' 하고 골랐어요. 그랬더니 화면마다 미묘하게 다른 회색이 쓰이고, 같은 '비활성' 상태인데 이 화면에선 opacity 0.4, 저 화면에선 opacity 0.5인 상황이 생겼어요. 혼자 작업할 땐 감으로 맞출 수 있었는데, 팀원이 같이 쓰기 시작하자 바로 무너졌어요.</p>

        <h2>과정</h2>

        <p>그래서 색상을 감으로 고르지 않고 규칙으로 정해 두기로 했어요.</p>

        <p>먼저 색상 팔레트를 단계별로 나눴어요. 색상 하나(예: blue)를 50부터 900까지 10단계로 나누고, 단계마다 용도를 미리 정했어요.</p>

        <pre><code>{`blue-50:  배경 (알림 배너, 선택된 행 등)
blue-100: 보더 (선택 상태)
blue-200: 보더 (hover)
blue-500: 기본 텍스트/아이콘
blue-600: 버튼 배경
blue-700: 버튼 hover
blue-900: 강조 텍스트`}</code></pre>

        <p>이렇게 정해 두면 새 화면을 만들 때 버튼 hover를 무슨 색으로 할지 고민할 필요가 없어요. blue-700이에요. 다른 사람이 작업해도 같은 결과가 나와요.</p>

        <p>gray도 같은 방식으로 나눴어요. UI에서 가장 많이 쓰이는 색이 사실 gray거든요. 배경, 보더, 비활성 텍스트, 구분선, placeholder가 전부 gray의 변형이에요. gray를 규칙 없이 쓰면 화면이 탁해 보이고, 규칙대로 쓰면 깔끔해 보여요. 값 차이는 미세한데 인상은 꽤 달라요.</p>

        <p>다크 모드 색상은 따로 매핑했어요. 라이트 모드에서 gray-100이 배경이라면 다크 모드에서는 gray-900이 배경이 돼요. 단계를 그냥 뒤집지 않고, 역할(배경, 표면, 텍스트, 보더)별로 라이트/다크 매핑 테이블을 만들었어요. 이 작업을 하면서 색상 이름은 값보다 역할로 붙여야 한다는 걸 배웠어요.</p>

        <pre><code>{`/* 값이 아니라 역할로 이름 붙이기 */
--color-bg-primary      /* 라이트: white, 다크: gray-950 */
--color-bg-secondary    /* 라이트: gray-50, 다크: gray-900 */
--color-text-primary    /* 라이트: gray-900, 다크: gray-50 */
--color-text-secondary  /* 라이트: gray-500, 다크: gray-400 */
--color-border-default  /* 라이트: gray-200, 다크: gray-700 */`}</code></pre>

        <p>이렇게 해 두면 컴포넌트 코드에서는 <code>var(--color-bg-primary)</code>만 쓰면 돼요. 다크 모드든 라이트 모드든 맞는 색이 자동으로 들어가요.</p>

        <h2>돌아보며</h2>

        <p>색상을 시스템으로 만든 뒤 가장 크게 달라진 건 디자인 결정 속도였어요. 예전에는 새 화면 하나를 만들 때마다 Figma에서 색을 고르느라 30분씩 썼는데, 시스템이 생긴 뒤로는 5분이면 끝났어요. 선택지가 줄어드니 오히려 빨라졌어요.</p>

        <p>'좋은 디자인은 선택을 잘 하는 것'이라는 말이 있어요. 색상 시스템을 만들고 나서는 매번 잘 고르려고 애쓰기보다 고를 일 자체를 줄여 두는 쪽이 저한테 더 잘 맞았어요.</p>
      </Content>
    );
  }

  return (
    <Content>
      <h2>Background</h2>

      <p>When I was building the design system for the Keyrke project, the first thing I got stuck on was color. Not a big question like "What should our primary color be?" but much more practical ones. What color should a button's hover state be? Which gray goes on a disabled state? Should the red for error messages keep the same value on a dark background? That kind of thing.</p>

      <p>At first I picked colors by eye every time, going with whatever "looked about right." I ended up with subtly different grays on every screen, and the same "disabled" state was opacity 0.4 on one screen and 0.5 on another. Working alone, I could keep things consistent by feel. The moment a teammate started using the same components, it fell apart.</p>

      <h2>Process</h2>

      <p>So I decided to stop picking colors by feel and set rules instead.</p>

      <p>First, I broke the palette into steps. I divided a single hue (say, blue) into 10 levels from 50 to 900 and decided up front what each level was for.</p>

      <pre><code>{`blue-50:  Backgrounds (notification banners, selected rows, etc.)
blue-100: Borders (selected state)
blue-200: Borders (hover)
blue-500: Default text/icons
blue-600: Button backgrounds
blue-700: Button hover
blue-900: Emphasis text`}</code></pre>

      <p>With this in place, there's no need to wonder what color a button's hover should be. It's blue-700. Done. Someone else working on the project lands on the same answer.</p>

      <p>I did the same with gray. Gray is actually the most-used color in any UI. Backgrounds, borders, disabled text, dividers, and placeholders are all variations of it. Gray used without rules makes a screen look muddy; used with rules, it looks clean. The differences in value are small, but the impression is noticeably different.</p>

      <p>Dark mode got its own mapping. If gray-100 is the background in light mode, gray-900 becomes the background in dark mode. Instead of just inverting the scale, I built a light/dark mapping table for each role (background, surface, text, border). Doing this taught me to name colors by role rather than by value.</p>

      <pre><code>{`/* Name by role, not by value */
--color-bg-primary      /* light: white, dark: gray-950 */
--color-bg-secondary    /* light: gray-50, dark: gray-900 */
--color-text-primary    /* light: gray-900, dark: gray-50 */
--color-text-secondary  /* light: gray-500, dark: gray-400 */
--color-border-default  /* light: gray-200, dark: gray-700 */`}</code></pre>

      <p>With this setup, component code only needs <code>var(--color-bg-primary)</code>. In dark mode or light mode, the right color is applied automatically.</p>

      <h2>Looking Back</h2>

      <p>The biggest change after turning color into a system was how fast design decisions got made. I used to spend 30 minutes picking colors in Figma every time I built a new screen. Once the system was in place, it took five minutes. Having fewer choices made things faster.</p>

      <p>There's a saying that "good design is about making the right choices." After building this color system, I found that cutting down how often I have to choose at all works better for me than trying to choose well every time.</p>
    </Content>
  );
};
