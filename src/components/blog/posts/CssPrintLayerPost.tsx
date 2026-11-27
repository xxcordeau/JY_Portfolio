'use client';

import styled from 'styled-components';

const Content = styled.div``;

interface PostProps {
  language: 'ko' | 'en';
}

export const CssPrintLayerPost = ({ language }: PostProps) => {
  if (language === 'ko') {
    return (
      <Content>
        <h2>발단</h2>

        <p>인쇄 기능을 만들면서 헤더를 숨기는 코드를 작성했어요.</p>

        <pre><code>{`@layer base {
  @media print {
    .header {
      display: none;
    }
  }
}`}</code></pre>

        <p>CSS는 맞게 썼는데, 인쇄 미리보기를 열어 보면 헤더가 그대로 출력됐어요. <code>display: none</code>이 적용되지 않았던 거예요.</p>

        <h2>원인</h2>

        <p>CSS <code>@layer</code>는 캐스케이드 레이어를 만들어서 스타일 우선순위를 명시적으로 관리하게 해 줘요. 여기에는 꼭 알아야 할 규칙이 하나 있어요. 레이어 안의 스타일은 레이어 밖의 스타일보다 항상 우선순위가 낮아요.</p>

        <p>명시도(specificity)가 아무리 높아도 마찬가지예요. 레이어 밖에 작성된 스타일이 레이어 안의 스타일을 덮어써요.</p>

        <pre><code>{`/* @layer 밖: 항상 우선순위 높음 */
.header {
  display: block;
}

/* @layer base 안: 항상 우선순위 낮음 */
@layer base {
  @media print {
    .header {
      display: none; /* 이 규칙이 위의 .header { display: block }에 덮어쓰임 */
    }
  }
}`}</code></pre>

        <p>프로젝트에서 헤더의 기본 스타일이 <code>@layer</code> 밖에 있었기 때문에, <code>@layer base</code> 안의 <code>@media print</code> 규칙은 아무리 정확해도 무시됐어요.</p>

        <h2>과정과 탐색</h2>

        <p>처음에는 선택자 문제인 줄 알았어요. <code>.header</code> 말고 다른 선택자를 써야 하는지 한참 찾아봤어요.</p>

        <p>다음으로 <code>@media print</code> 안에서 <code>!important</code>를 쓰면 될 거라고 생각했어요. 레이어 안의 <code>!important</code>는 레이어 밖의 <code>!important</code>보다 우선순위가 높아지는 역전 규칙이 있거든요. <code>!important</code>가 붙으면 레이어 우선순위가 뒤집혀요.</p>

        <pre><code>{`@layer base {
  @media print {
    .header {
      display: none !important; /* 이건 동작하지만 권장하지 않음 */
    }
  }
}`}</code></pre>

        <p>동작은 했지만 <code>!important</code>를 남발하고 싶지는 않았어요. 원인을 제대로 이해한 다음 다른 방법을 찾았어요.</p>

        <h2>해결 방안</h2>

        <p>가장 깔끔한 방법은 <code>@media print</code> 스타일을 <code>@layer</code> 밖으로 꺼내는 거예요.</p>

        <pre><code>{`/* @layer 밖에서 직접 선언 */
@media print {
  .header {
    display: none;
  }
}`}</code></pre>

        <p>인쇄 스타일용 레이어를 따로 만들어 가장 마지막에 선언하는 방법도 있어요.</p>

        <pre><code>{`/* 레이어 순서 선언: 나중에 선언된 레이어가 우선순위 높음 */
@layer base, components, print;

@layer print {
  @media print {
    .header {
      display: none;
    }
  }
}`}</code></pre>

        <p>레이어는 선언 순서가 중요해요. 나중에 선언된 레이어가 우선순위가 높아요. <code>print</code> 레이어를 마지막에 두면 인쇄 스타일이 다른 레이어를 덮어쓸 수 있어요.</p>

        <h2>결과</h2>

        <p><code>@media print</code> 스타일을 <code>@layer</code> 밖으로 꺼내고 나서 인쇄 미리보기에서 헤더가 제대로 사라졌어요.</p>

        <h2>배운 점</h2>

        <p><code>@layer</code>를 쓰면서 레이어 밖 스타일이 항상 레이어 안 스타일을 이긴다는 규칙을 모르면, 이번처럼 예상하지 못한 결과를 만나게 돼요.</p>

        <p>인쇄 스타일처럼 특정 상황에서만 적용되는 스타일은 레이어 구조를 보고 위치를 정해야 해요. 레이어 밖에 직접 선언하거나, 인쇄 전용 레이어를 선언 순서 마지막에 두는 방식이 안전해요.</p>
      </Content>
    );
  }

  return (
    <Content>
      <h2>The Problem</h2>

      <p>While building a print feature, I wrote code to hide the header:</p>

      <pre><code>{`@layer base {
  @media print {
    .header {
      display: none;
    }
  }
}`}</code></pre>

      <p>The CSS looked right, but print preview still showed the header. The <code>display: none</code> wasn't being applied.</p>

      <h2>The Cause</h2>

      <p>CSS <code>@layer</code> creates cascade layers so you can manage style priority explicitly. There's one rule you have to know: styles inside a layer always have lower priority than styles outside any layer.</p>

      <p>Specificity doesn't change that. Styles written outside layers override styles inside them.</p>

      <pre><code>{`/* Outside @layer: always higher priority */
.header {
  display: block;
}

/* Inside @layer base: always lower priority */
@layer base {
  @media print {
    .header {
      display: none; /* Overridden by .header { display: block } above */
    }
  }
}`}</code></pre>

      <p>The header's base styles were written outside <code>@layer</code>, so the <code>@media print</code> rules inside <code>@layer base</code> were ignored no matter how correct they were.</p>

      <h2>Investigation</h2>

      <p>At first I thought it was a selector issue and spent a while checking whether I needed something other than <code>.header</code>.</p>

      <p>Then I figured <code>!important</code> inside <code>@media print</code> would do it. There's a reversal rule here: <code>!important</code> inside a layer beats <code>!important</code> outside it. For <code>!important</code> declarations, layer priority flips.</p>

      <pre><code>{`@layer base {
  @media print {
    .header {
      display: none !important; /* Works, but not recommended */
    }
  }
}`}</code></pre>

      <p>It worked, but I didn't want to scatter <code>!important</code> around. I went back, understood the actual cause, and looked for another way.</p>

      <h2>Solution</h2>

      <p>The cleanest fix is to move the <code>@media print</code> styles outside of <code>@layer</code>:</p>

      <pre><code>{`/* Declared directly outside @layer */
@media print {
  .header {
    display: none;
  }
}`}</code></pre>

      <p>Another option is a dedicated print layer declared last in the layer order:</p>

      <pre><code>{`/* Layer order declaration: later layers have higher priority */
@layer base, components, print;

@layer print {
  @media print {
    .header {
      display: none;
    }
  }
}`}</code></pre>

      <p>Declaration order matters for layers. Layers declared later have higher priority, so putting the <code>print</code> layer last lets print styles override the others.</p>

      <h2>Result</h2>

      <p>After moving the <code>@media print</code> styles outside of <code>@layer</code>, the header disappeared in print preview as expected.</p>

      <h2>Lessons Learned</h2>

      <p>If you use <code>@layer</code> without knowing that styles outside layers always beat styles inside them, you run into surprises like this one.</p>

      <p>Styles that only apply in a specific context, like print styles, need to be placed with the layer structure in mind. Declaring them directly outside any layer, or putting a dedicated print layer last in the declaration order, is the safe approach.</p>
    </Content>
  );
};
