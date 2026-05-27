import styled from 'styled-components';

const Content = styled.div``;

interface PostProps {
  language: 'ko' | 'en';
}

export const DesignWhitespacePost = ({ language }: PostProps) => {
  if (language === 'ko') {
    return (
      <Content>
        <h1>여백이 두려웠던 시절 — 빈 공간은 비어 있는 게 아니에요</h1>

        <h2>배경</h2>

        <p>처음 UI를 만들기 시작했을 때, 화면에 빈 공간이 보이면 불안했어요. '여기에 뭘 더 넣어야 하지?' 하는 생각이 자동으로 들었거든요. 카드 사이의 간격이 넓으면 '너무 허전한 거 아닌가', 섹션 아래에 여백이 크면 '콘텐츠가 부족해 보이지 않나' — 그런 고민을 계속 했어요.</p>

        <p>그래서 초기에 만들었던 화면들은 하나같이 빽빽했어요. 정보는 많이 담겨 있는데, 어디를 먼저 봐야 할지 모르겠는 화면. 텍스트와 버튼과 아이콘이 서로 숨 쉴 틈 없이 붙어 있는 레이아웃. 기능적으로는 문제가 없었지만, 화면을 열었을 때 '편하다'는 느낌이 전혀 들지 않았어요.</p>

        <h2>과정과 탐색</h2>

        <p>변화가 온 건 통인익스프레스 프로젝트에서였어요. 이사 신청서를 태블릿으로 작성하는 화면을 설계해야 했는데, 사용자가 40대~60대 고객이었거든요. 화면을 빽빽하게 채우면 당연히 안 되겠다는 생각에 여백을 크게 잡았어요.</p>

        <p>근데 신기한 게, 여백을 넓히니까 오히려 화면이 더 '많아' 보였어요. 정보량은 줄었는데, 각 요소가 눈에 더 잘 들어왔거든요. 입력 필드 사이에 24px 대신 40px을 주니까 사용자가 다음 필드로 자연스럽게 시선을 옮겼고, 섹션 타이틀 위에 64px 여백을 주니까 '여기서부터 새로운 내용이 시작되는구나'라는 게 말 안 해도 느껴졌어요.</p>

        <p>그때부터 여백을 '빈 공간'이 아니라 '구분선 없는 구분선'으로 생각하기 시작했어요.</p>

        <h2>제가 정리한 여백 기준</h2>

        <p>이후 프로젝트들을 거치면서 나름의 기준이 생겼어요.</p>

        <p><strong>요소 간 관계가 가까울수록 간격이 좁아야 해요.</strong> 라벨과 입력 필드 사이는 4~8px이면 충분해요. 하지만 입력 필드 그룹과 다음 그룹 사이는 최소 24px, 섹션과 섹션 사이는 48~80px 정도가 필요해요. 이걸 게슈탈트 심리학에서는 '근접성의 원리'라고 하는데, 이름은 어려워도 원리는 단순해요. 가까이 있으면 같은 것, 멀리 있으면 다른 것.</p>

        <p><strong>여백은 일정한 단위로 움직여야 해요.</strong> 저는 보통 4px 또는 8px을 기본 단위로 쓰는데, 모든 간격이 이 배수로 떨어지게 해요. 12px, 16px, 24px, 32px, 48px, 64px — 이렇게요. 규칙 없이 '이 정도면 되겠지' 하고 넣으면 화면 전체에서 미묘한 불일치가 쌓이거든요. 사용자가 의식하진 못하지만 '뭔가 정돈 안 된 느낌'을 받게 돼요.</p>

        <p><strong>모바일에서의 여백은 단순히 줄이는 게 아니에요.</strong> 데스크톱에서 섹션 간격이 80px이라고 해서 모바일에서 40px로 반으로 줄이면 비례가 깨져요. 모바일은 화면 자체가 좁으니까, 비율로 생각해야 해요. 저는 보통 데스크톱 여백의 60~70% 정도를 모바일에 적용하는데, 이것도 화면을 직접 보면서 조정하는 게 맞아요.</p>

        <h2>배운 점</h2>

        <p>여백은 콘텐츠가 부족해서 생기는 게 아니라, 콘텐츠가 제대로 보이게 하기 위해 의도적으로 만드는 거예요. '화면을 채우는 것'과 '화면을 설계하는 것'은 완전히 다른 작업이에요. 빈 공간을 두려워하지 않게 된 이후로, 만드는 화면의 느낌이 확실히 달라졌어요.</p>

        <p>지금도 화면을 만들 때 가장 먼저 하는 건, '여기에 뭘 넣을까'가 아니라 '여기에 뭘 안 넣을까'를 정하는 거예요.</p>
      </Content>
    );
  }

  return (
    <Content>
      <h1>When I Was Afraid of Whitespace — Empty Space Isn't Really Empty</h1>

      <h2>Background</h2>

      <p>When I first started building UIs, seeing empty space on the screen made me anxious. My mind would automatically jump to "What else should I put here?" If the gap between cards was too wide, I'd worry it looked barren. If the margin below a section was large, I'd fret that it seemed like there wasn't enough content.</p>

      <p>So everything I built early on was packed tight. Screens crammed with information where you couldn't tell what to look at first. Layouts where text, buttons, and icons were pressed together with no room to breathe. Functionally nothing was wrong, but opening the screen never felt "comfortable."</p>

      <h2>Investigation</h2>

      <p>The shift came during the Tongin Express project. I was designing a screen for filling out a moving application on a tablet, and the target users were customers in their 40s through 60s. Packing the screen tight was clearly out of the question, so I gave the layout generous whitespace.</p>

      <p>The surprising thing was that adding more whitespace actually made the screen feel like it had <em>more</em> on it. The amount of information decreased, but each element became easier to notice. When I changed the spacing between input fields from 24px to 40px, users' eyes moved naturally to the next field. When I added 64px of margin above section titles, people could feel "a new section starts here" without being told.</p>

      <p>From that point on, I started thinking of whitespace not as "empty space" but as "a divider without a divider line."</p>

      <h2>My Whitespace Rules</h2>

      <p>Through subsequent projects, I developed my own set of guidelines.</p>

      <p><strong>The closer the relationship between elements, the tighter the spacing should be.</strong> Between a label and its input field, 4-8px is plenty. But between one input group and the next, you need at least 24px, and between sections, 48-80px. In Gestalt psychology this is called the "principle of proximity" — fancy name, simple idea. Things close together seem related; things far apart seem separate.</p>

      <p><strong>Whitespace should move in consistent increments.</strong> I typically use 4px or 8px as my base unit, and every spacing value is a multiple of it: 12px, 16px, 24px, 32px, 48px, 64px. When you eyeball it with "that looks about right," subtle inconsistencies accumulate across the whole screen. Users can't consciously spot them, but they get a sense that "something feels unpolished."</p>

      <p><strong>Whitespace on mobile isn't just about making things smaller.</strong> If section spacing is 80px on desktop, cutting it in half to 40px on mobile breaks the proportions. Mobile screens are narrower, so you need to think in ratios. I usually apply about 60-70% of the desktop whitespace on mobile, but even that needs fine-tuning by actually looking at the screen.</p>

      <h2>Lessons Learned</h2>

      <p>Whitespace doesn't exist because there's not enough content — it's deliberately created so that content can be seen properly. "Filling the screen" and "designing the screen" are completely different tasks. After I stopped being afraid of empty space, the feel of everything I built changed dramatically.</p>

      <p>Even now, the first thing I do when building a screen isn't deciding "what to put here" — it's deciding "what <em>not</em> to put here."</p>
    </Content>
  );
};
