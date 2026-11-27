'use client';

import styled from 'styled-components';

const Content = styled.div``;

interface PostProps {
  language: 'ko' | 'en';
}

export const DesignWhitespacePost = ({ language }: PostProps) => {
  if (language === 'ko') {
    return (
      <Content>
        <h2>배경</h2>

        <p>처음 UI를 만들 때는 화면에 빈 공간이 보이면 불안했어요. '여기에 뭘 더 넣어야 하지?' 하는 생각이 저절로 들었거든요. 카드 사이 간격이 넓으면 너무 허전한 건 아닌지, 섹션 아래 여백이 크면 콘텐츠가 부족해 보이지는 않는지 계속 고민했어요.</p>

        <p>그래서 초기에 만든 화면들은 하나같이 빽빽했어요. 정보는 많은데 어디부터 봐야 할지 모르겠는 화면, 텍스트와 버튼과 아이콘이 틈 없이 붙어 있는 레이아웃이었어요. 기능에는 문제가 없었지만 화면을 열었을 때 편하다는 느낌은 들지 않았어요.</p>

        <h2>과정과 탐색</h2>

        <p>생각이 바뀐 건 통인익스프레스 프로젝트에서였어요. 이사 신청서를 태블릿으로 작성하는 화면을 설계해야 했는데, 사용자가 40대~60대 고객이었어요. 화면을 빽빽하게 채우면 안 되겠다 싶어서 여백을 크게 잡았어요.</p>

        <p>그런데 여백을 넓히니 오히려 화면에 더 '많이' 담긴 것처럼 보였어요. 정보량은 줄었는데 요소 하나하나가 눈에 더 잘 들어왔거든요. 입력 필드 사이를 24px 대신 40px로 주니 사용자의 시선이 다음 필드로 자연스럽게 옮겨 갔고, 섹션 타이틀 위에 64px 여백을 주니 말하지 않아도 '여기서부터 새로운 내용이 시작되는구나' 하는 게 느껴졌어요.</p>

        <p>그때부터 여백을 '구분선 없는 구분선'으로 생각하게 됐어요.</p>

        <h2>제가 정리한 여백 기준</h2>

        <p>이후 프로젝트를 거치면서 나름의 기준이 생겼어요.</p>

        <p>관계가 가까운 요소일수록 간격을 좁혀요. 라벨과 입력 필드 사이는 4~8px이면 충분해요. 입력 필드 그룹과 다음 그룹 사이는 최소 24px, 섹션과 섹션 사이는 48~80px 정도가 필요해요. 게슈탈트 심리학에서 말하는 '근접성의 원리'인데, 이름은 어려워도 원리는 단순해요. 가까이 있으면 같은 것, 멀리 있으면 다른 것으로 읽혀요.</p>

        <p>여백은 일정한 단위로 움직여야 해요. 저는 보통 4px이나 8px을 기본 단위로 쓰고, 모든 간격을 그 배수로 맞춰요. 12px, 16px, 24px, 32px, 48px, 64px처럼요. 규칙 없이 '이 정도면 되겠지' 하고 넣으면 화면 곳곳에 미묘한 불일치가 쌓여요. 사용자는 의식하지 못해도 뭔가 정돈이 안 된 느낌을 받게 돼요.</p>

        <p>모바일 여백은 그냥 줄이면 되는 게 아니에요. 데스크톱 섹션 간격이 80px이라고 모바일에서 40px로 반을 잘라 버리면 비례가 깨져요. 모바일은 화면이 좁으니 비율로 생각해야 해요. 저는 보통 데스크톱 여백의 60~70% 정도를 모바일에 적용하는데, 이것도 화면을 직접 보면서 조정해요.</p>

        <h2>배운 점</h2>

        <p>여백은 콘텐츠가 모자라서 남는 공간이 아니에요. 콘텐츠가 제대로 보이도록 일부러 만드는 공간이에요. 화면을 채우는 일과 화면을 설계하는 일은 서로 다른 작업이었고, 빈 공간을 두려워하지 않게 된 뒤로 제가 만드는 화면의 느낌도 달라졌어요.</p>

        <p>지금도 화면을 만들 때 제일 먼저 정하는 건 여기에 뭘 넣을지보다 뭘 넣지 않을지예요.</p>
      </Content>
    );
  }

  return (
    <Content>
      <h2>Background</h2>

      <p>When I first started building UIs, empty space on the screen made me anxious. My mind would jump straight to "What else should I put here?" If the gap between cards was wide, I worried it looked barren. If the margin below a section was large, I worried it looked like there wasn't enough content.</p>

      <p>So everything I built early on was packed tight. Screens full of information where you couldn't tell what to look at first, and layouts where text, buttons, and icons were pressed together with no room to breathe. Nothing was broken, but opening those screens never felt comfortable.</p>

      <h2>Investigation</h2>

      <p>The shift came during the Tongin Express project. I was designing a tablet screen for filling out a moving application, and the users were customers in their 40s through 60s. Packing that screen tight was clearly out of the question, so I gave the layout generous whitespace.</p>

      <p>The surprising part was that more whitespace made the screen feel like it held <em>more</em>. There was less information, but each element was easier to notice. When I changed the spacing between input fields from 24px to 40px, users' eyes moved naturally to the next field. When I added 64px above section titles, people could tell a new section started there without being told.</p>

      <p>From then on, I started thinking of whitespace as a divider without the line.</p>

      <h2>My Whitespace Rules</h2>

      <p>Over the following projects, I settled on a few rules of my own.</p>

      <p>The closer two elements are related, the tighter the spacing. Between a label and its input, 4-8px is plenty. Between one input group and the next you need at least 24px, and between sections, 48-80px. Gestalt psychology calls this the "principle of proximity." The name sounds fancy, but the idea is simple: things close together read as related, things far apart read as separate.</p>

      <p>Whitespace should move in consistent steps. I usually use 4px or 8px as the base unit and make every spacing value a multiple of it: 12px, 16px, 24px, 32px, 48px, 64px. If you eyeball it with "that looks about right," small inconsistencies pile up across the screen. Users can't point to them, but they sense that something feels unpolished.</p>

      <p>Mobile whitespace isn't just a smaller version of desktop. If section spacing is 80px on desktop, cutting it in half to 40px on mobile breaks the proportions. Mobile screens are narrower, so you have to think in ratios. I usually apply about 60-70% of the desktop whitespace on mobile, and even then I adjust it by looking at the actual screen.</p>

      <h2>Lessons Learned</h2>

      <p>Whitespace isn't what's left over when there's not enough content. It's space I create on purpose so the content can be seen. Filling a screen and designing a screen turned out to be different jobs, and once I stopped being afraid of empty space, the screens I built started to feel different.</p>

      <p>Even now, the first thing I decide when building a screen is less about what to put in and more about what to leave out.</p>
    </Content>
  );
};
