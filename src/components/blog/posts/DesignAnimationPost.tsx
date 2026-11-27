'use client';

import styled from 'styled-components';

const Content = styled.div``;

interface PostProps {
  language: 'ko' | 'en';
}

export const DesignAnimationPost = ({ language }: PostProps) => {
  if (language === 'ko') {
    return (
      <Content>
        <h2>배경</h2>

        <p>이 포트폴리오 사이트의 히어로 섹션을 만들면서 애니메이션에 꽤 오랜 시간을 썼어요. 얼굴 이미지가 파티클로 분해되고, 인사말로 모였다가 흩어지고, 텍스트로 다시 모인 다음 마지막에 별처럼 날아가는 스크롤 기반 애니메이션이에요.</p>

        <p>완성하고 나서 뿌듯했지만 한편으로 '이게 정말 필요한가?' 싶었어요. 멋있긴 한데, 포트폴리오를 보러 온 사람이 원하는 건 프로젝트 경력과 기술 스택이지 애니메이션 구경은 아니니까요.</p>

        <p>이 질문을 붙잡고 있다 보니 애니메이션에 대한 생각이 정리됐어요.</p>

        <h2>과정과 탐색</h2>

        <p>저는 애니메이션을 크게 두 종류로 나눠서 봐요.</p>

        <p>하나는 기능적 애니메이션이에요. 페이지 전환, 모달 열기/닫기, 데이터 로딩, 토스트 알림 같은 곳에 붙는 애니메이션이요. 이건 장식보다 정보에 가까워요. 모달이 아래에서 올라오면 사용자는 새 레이어가 위에 생겼다는 걸 바로 알아채요. 이런 애니메이션이 없으면 화면이 갑자기 바뀌는 느낌이 들고, 사용자는 지금 상태를 파악하는 데 인지 비용을 써야 해요.</p>

        <p>기능적 애니메이션에는 주로 이런 기준을 써요.</p>

        <pre><code>{`/* 상태 전환 (hover, focus, color change) */
transition: 150ms ease;

/* 요소 등장/퇴장 (modal, dropdown, toast) */
transition: 200ms ~ 300ms ease-out;

/* 레이아웃 변경 (accordion, expand/collapse) */
transition: 300ms ~ 400ms ease-in-out;`}</code></pre>

        <p>150ms보다 짧으면 변화를 알아차리기 어렵고, 400ms보다 길면 느리다고 느껴요. 이 범위 안에서 성격에 맞게 고르면 대부분 자연스러워요.</p>

        <p>다른 하나는 표현적 애니메이션이에요. 이 포트폴리오의 히어로 파티클 같은 거요. 기능적으로는 없어도 되지만 감정이나 인상을 전달해요. 그래서 넣을지 말지 기준이 분명해야 한다고 생각해요.</p>

        <p>제 기준은 "이 애니메이션을 빼면 사용자가 뭘 잃는가?"예요.</p>

        <p>히어로 파티클은 빼면 '이 개발자는 인터랙티브한 걸 만들 수 있구나' 하는 첫인상이 사라져요. 프론트엔드 포트폴리오에서는 첫 화면 인상이 중요하다고 봤고, 그래서 넣었어요. 반대로 프로젝트 목록 페이지에 화려한 진입 애니메이션을 넣을지 고민했을 때는 빼도 잃을 게 없다고 판단해서 간단한 fade-up만 남겼어요.</p>

        <h2>성능과 접근성</h2>

        <p>표현적 애니메이션을 넣기로 했다면 따라오는 책임이 있어요.</p>

        <p>먼저 60fps를 유지해야 해요. Canvas나 requestAnimationFrame을 쓸 때 파티클이 많으면 저사양 기기에서 프레임이 떨어져요. 이 사이트에서는 파티클 수를 최대 5000개로 제한하고, 위치 데이터를 Float32Array로 관리해서 GC 부담을 줄였어요.</p>

        <p>모션에 민감한 사용자도 고려해야 해요. prefers-reduced-motion 미디어 쿼리가 있으면 애니메이션을 줄이거나 정적인 화면으로 바꿔야 해요. 접근성에서 기본으로 챙겨야 하는 부분이에요.</p>

        <p>로딩 성능에 영향을 줘서도 안 돼요. 애니메이션 라이브러리가 번들 사이즈를 100KB 늘린다면, 그 애니메이션이 100KB만큼의 값어치를 하는지 따져봐야 해요. 이 사이트의 히어로 애니메이션은 번들 영향을 줄이려고 외부 라이브러리 없이 순수 Canvas API로 만들었어요.</p>

        <h2>배운 점</h2>

        <p>애니메이션을 넣을 때 제가 먼저 묻는 건 얼마나 멋있게 만들지보다 왜 여기에 있어야 하는지예요. 기능적 애니메이션은 사용성을 높이고, 표현적 애니메이션은 인상을 남겨요. 어느 쪽이든 목적 없이 넣으면 소음이 돼요.</p>

        <p>제가 바라는 건 사용자가 애니메이션이 있었다는 걸 의식하지 못할 만큼 자연스러운 인터랙션이에요.</p>
      </Content>
    );
  }

  return (
    <Content>
      <h2>Background</h2>

      <p>I spent a lot of time on animation while building the hero section of this portfolio site. The face image breaks into particles, gathers into a greeting, scatters, reassembles into text, and finally flies off like stars. It's a fairly involved scroll-driven animation.</p>

      <p>I was proud of it when it was done, but I also caught myself asking whether it was necessary. It looks cool, but people visiting a portfolio want to see project experience and tech stacks, not watch an animation.</p>

      <p>Sitting with that question helped me sort out how I think about animation.</p>

      <h2>Process and Exploration</h2>

      <p>I split animations into two broad groups.</p>

      <p>The first is functional animation: the kind attached to page transitions, modals opening and closing, data loading, and toast notifications. These are closer to information than decoration. When a modal slides up from the bottom, users understand right away that a new layer has appeared on top. Without that motion the screen seems to change abruptly, and users have to spend effort working out the current state.</p>

      <p>For functional animations I usually go by these numbers.</p>

      <pre><code>{`/* State transitions (hover, focus, color change) */
transition: 150ms ease;

/* Element enter/exit (modal, dropdown, toast) */
transition: 200ms ~ 300ms ease-out;

/* Layout changes (accordion, expand/collapse) */
transition: 300ms ~ 400ms ease-in-out;`}</code></pre>

      <p>Shorter than 150ms and the change is hard to notice; longer than 400ms and it feels slow. Picking within this range based on the kind of interaction feels natural in most cases.</p>

      <p>The second is expressive animation, like the hero particles on this portfolio. You could remove it without breaking anything, but it carries a mood or an impression. That's why I think the bar for including it should be clear.</p>

      <p>My test is simple: "If I remove this animation, what does the user lose?"</p>

      <p>Without the hero particles, the first impression of "this developer can build interactive things" disappears. For a frontend portfolio I decided that first screen matters, so I kept it. When I considered a flashy entrance animation for the project list page, though, nothing would be lost without it, so I kept only a simple fade-up.</p>

      <h2>Performance and Accessibility</h2>

      <p>Once you decide to use expressive animation, some responsibilities come with it.</p>

      <p>Keep it at 60fps. With Canvas or requestAnimationFrame and lots of particles, low-end devices start dropping frames. On this site I capped the particle count at 5,000 and stored position data in a Float32Array to reduce GC overhead.</p>

      <p>Think about motion-sensitive users. If prefers-reduced-motion is set, animations should be reduced or replaced with something static. That's basic accessibility.</p>

      <p>Don't hurt loading performance. If an animation library adds 100KB to the bundle, ask whether the animation is worth 100KB. I built the hero animation here with the plain Canvas API and no external libraries, specifically to keep the bundle impact small.</p>

      <h2>Lessons Learned</h2>

      <p>When I add animation now, the first question is why it belongs there, before how good it looks. Functional animations improve usability, expressive ones leave an impression, and either kind turns into noise when it has no purpose.</p>

      <p>What I'm aiming for is interaction so natural that users don't notice there was an animation at all.</p>
    </Content>
  );
};
