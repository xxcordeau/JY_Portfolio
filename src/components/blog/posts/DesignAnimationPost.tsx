import styled from 'styled-components';

const Content = styled.div``;

interface PostProps {
  language: 'ko' | 'en';
}

export const DesignAnimationPost = ({ language }: PostProps) => {
  if (language === 'ko') {
    return (
      <Content>
        <h1>애니메이션을 넣기 전에 물어봐야 할 한 가지 — '이걸 빼면 뭘 잃는가'</h1>

        <h2>배경</h2>

        <p>이 포트폴리오 사이트의 히어로 섹션을 만들면서 꽤 긴 시간을 애니메이션에 썼어요. 얼굴 이미지가 파티클로 분해되고, 인사말로 모였다가 흩어지고, 텍스트로 다시 모이고, 마지막에 별처럼 날아가는 — 꽤 복잡한 스크롤 기반 애니메이션이에요.</p>

        <p>만들고 나서 뿌듯했는데, 동시에 이런 생각도 했어요. '이게 정말 필요한 건가?' 멋있긴 한데, 포트폴리오를 보러 온 사람이 원하는 건 프로젝트 경력과 기술 스택이지 애니메이션 구경이 아니잖아요.</p>

        <p>이 질문을 스스로에게 던지면서, 애니메이션에 대한 제 생각이 정리됐어요.</p>

        <h2>과정과 탐색</h2>

        <p><strong>애니메이션은 크게 두 종류가 있다고 생각해요.</strong></p>

        <p>하나는 <strong>기능적 애니메이션</strong>이에요. 페이지 전환, 모달 열기/닫기, 데이터 로딩, 토스트 알림 — 이런 것들에 붙는 애니메이션이요. 이건 '장식'이 아니라 '정보'에 가까워요. 모달이 아래에서 올라오면 사용자는 '새로운 레이어가 위에 생겼구나'라고 직감적으로 이해하거든요. 이런 애니메이션이 없으면 화면이 '갑자기' 바뀌는 느낌이 들어서 사용자가 현재 상태를 파악하는 데 인지 비용이 들어요.</p>

        <p>기능적 애니메이션에 제가 주로 쓰는 기준이 있어요.</p>

        <pre><code>{`/* 상태 전환 (hover, focus, color change) */
transition: 150ms ease;

/* 요소 등장/퇴장 (modal, dropdown, toast) */
transition: 200ms ~ 300ms ease-out;

/* 레이아웃 변경 (accordion, expand/collapse) */
transition: 300ms ~ 400ms ease-in-out;`}</code></pre>

        <p>150ms보다 짧으면 변화를 인식하기 어렵고, 400ms보다 길면 '느리다'는 느낌을 줘요. 이 범위 안에서 성격에 맞게 고르면 대부분의 상황에서 자연스럽게 느껴져요.</p>

        <p>다른 하나는 <strong>표현적 애니메이션</strong>이에요. 이 포트폴리오의 히어로 파티클 같은 거예요. 기능적으로는 없어도 되지만, 감정이나 인상을 전달하는 역할을 해요. 이런 애니메이션은 넣고 안 넣고의 기준이 명확해야 한다고 생각해요.</p>

        <p>저는 이 기준으로 판단해요: <strong>"이 애니메이션을 빼면 사용자가 뭘 잃는가?"</strong></p>

        <p>히어로 파티클의 경우, 빼면 '이 개발자는 인터랙티브한 걸 만들 수 있는 사람이구나'라는 첫인상이 사라져요. 프론트엔드 포트폴리오에서 첫 화면의 인상은 중요하다고 판단했고, 그래서 넣었어요. 하지만 프로젝트 목록 페이지에 화려한 진입 애니메이션을 넣을까 고민했을 때는, 빼도 잃을 게 없다고 판단해서 간단한 fade-up만 남겼어요.</p>

        <h2>성능과 접근성</h2>

        <p>표현적 애니메이션을 넣기로 했다면, 반드시 따라오는 책임이 있어요.</p>

        <p><strong>60fps를 유지해야 해요.</strong> Canvas나 requestAnimationFrame을 쓸 때 파티클 수가 많으면 저사양 기기에서 프레임이 떨어져요. 이 사이트에서는 파티클 수를 최대 5000개로 제한하고, Float32Array로 위치 데이터를 관리해서 GC 부담을 줄였어요.</p>

        <p><strong>모션에 민감한 사용자를 고려해야 해요.</strong> prefers-reduced-motion 미디어 쿼리가 있으면 애니메이션을 줄이거나 정적으로 대체해야 해요. 이건 선택이 아니라 접근성 기본이에요.</p>

        <p><strong>로딩 성능에 영향을 주면 안 돼요.</strong> 애니메이션 라이브러리가 번들 사이즈를 100KB 늘린다면, 그 애니메이션이 100KB의 가치가 있는지 따져봐야 해요. 이 사이트의 히어로 애니메이션은 외부 라이브러리 없이 순수 Canvas API로 만들었는데, 번들 영향을 최소화하려는 의도가 있었어요.</p>

        <h2>배운 점</h2>

        <p>결국 애니메이션의 핵심은 '얼마나 멋있게'가 아니라 '왜 여기에'라는 질문이에요. 기능적 애니메이션은 사용성을 높이고, 표현적 애니메이션은 인상을 만들어요. 둘 다 목적 없이 넣으면 그냥 소음이 돼요.</p>

        <p><strong>좋은 애니메이션은 사용자가 '애니메이션이 있었다'는 걸 인식하지 못하는 거라고 생각해요.</strong> 자연스러워서 의식하지 못하는 것. 그게 제가 지향하는 인터랙션이에요.</p>
      </Content>
    );
  }

  return (
    <Content>
      <h1>One Question Before Adding Animation — What Do We Lose Without It?</h1>

      <h2>Background</h2>

      <p>While building the hero section of this portfolio site, I spent a considerable amount of time on animation. The face image breaks apart into particles, gathers into a greeting, scatters, reassembles into text, and finally flies away like stars — it's a fairly complex scroll-driven animation.</p>

      <p>I felt proud after finishing it, but at the same time, a thought crossed my mind: "Is this really necessary?" It looks cool, sure, but people visiting a portfolio want to see project experience and tech stacks, not watch an animation show.</p>

      <p>Asking myself this question helped me organize my thinking about animation.</p>

      <h2>Process and Exploration</h2>

      <p><strong>I think animations fall into two broad categories.</strong></p>

      <p>The first is <strong>functional animation</strong>. Page transitions, modal open/close, data loading, toast notifications — animations attached to these kinds of interactions. These aren't "decoration" but closer to "information." When a modal slides up from the bottom, users intuitively understand that a new layer has appeared on top. Without these animations, the screen feels like it changes "abruptly," and users have to spend cognitive effort figuring out the current state.</p>

      <p>I have guidelines I typically follow for functional animations.</p>

      <pre><code>{`/* State transitions (hover, focus, color change) */
transition: 150ms ease;

/* Element enter/exit (modal, dropdown, toast) */
transition: 200ms ~ 300ms ease-out;

/* Layout changes (accordion, expand/collapse) */
transition: 300ms ~ 400ms ease-in-out;`}</code></pre>

      <p>Shorter than 150ms and the change is hard to perceive; longer than 400ms and it feels "slow." Choosing within this range based on the nature of the interaction makes most situations feel natural.</p>

      <p>The second is <strong>expressive animation</strong>. Like the hero particles on this portfolio. Functionally unnecessary, but it serves the role of conveying emotion or making an impression. I believe the criteria for whether to include this type of animation should be crystal clear.</p>

      <p>Here's how I decide: <strong>"If I remove this animation, what does the user lose?"</strong></p>

      <p>For the hero particles, removing them would erase the first impression of "this developer can build interactive things." I decided that the first-screen impression matters for a frontend portfolio, so I kept it. But when I considered adding a flashy entrance animation to the project list page, I concluded there was nothing to lose by removing it, so I kept just a simple fade-up.</p>

      <h2>Performance and Accessibility</h2>

      <p>Once you decide to include expressive animation, certain responsibilities inevitably follow.</p>

      <p><strong>You need to maintain 60fps.</strong> When using Canvas or requestAnimationFrame with a large number of particles, frames drop on low-end devices. On this site, I capped the particle count at 5,000 and managed position data with Float32Array to reduce GC overhead.</p>

      <p><strong>You need to consider motion-sensitive users.</strong> If the prefers-reduced-motion media query is active, animations should be reduced or replaced with static alternatives. This isn't optional — it's an accessibility baseline.</p>

      <p><strong>It shouldn't impact loading performance.</strong> If an animation library adds 100KB to the bundle size, you need to ask whether the animation is worth that 100KB. The hero animation on this site was built with the native Canvas API without any external libraries, intentionally to minimize the bundle impact.</p>

      <h2>Lessons Learned</h2>

      <p>Ultimately, the essence of animation isn't "how cool can I make it" but "why does it belong here." Functional animations improve usability, and expressive animations create impressions. Add either without purpose, and they just become noise.</p>

      <p><strong>I believe the best animation is one where users don't even realize an animation was there.</strong> So natural that it goes unnoticed. That's the kind of interaction I aim for.</p>
    </Content>
  );
};
