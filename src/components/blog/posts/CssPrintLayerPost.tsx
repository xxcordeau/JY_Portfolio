import styled from 'styled-components';

const Content = styled.div``;

interface PostProps {
  language: 'ko' | 'en';
}

export const CssPrintLayerPost = ({ language }: PostProps) => {
  if (language === 'ko') {
    return (
      <Content>
        <h1>@media print과 CSS 레이어의 충돌 — 인쇄 헤더가 사라지지 않던 이유</h1>

        <h2>발단</h2>

        <p>인쇄 기능을 만들면서 헤더를 숨기는 코드를 작성했어요.</p>

        <pre><code>{`@layer base {
  @media print {
    .header {
      display: none;
    }
  }
}`}</code></pre>

        <p>분명히 맞는 CSS인데, 인쇄 미리보기를 열어보면 헤더가 여전히 출력됐어요. <code>display: none</code>이 적용되지 않는 거였습니다.</p>

        <h2>원인</h2>

        <p>CSS <code>@layer</code>는 캐스케이드 레이어를 만들어서 스타일의 우선순위를 명시적으로 관리할 수 있게 해줘요. 그런데 핵심 규칙이 하나 있습니다.</p>

        <p><strong>레이어 안의 스타일은 레이어 밖의 스타일보다 항상 우선순위가 낮습니다.</strong></p>

        <p>명시도(specificity)가 아무리 높아도 상관없어요. 레이어 밖에 작성된 스타일이 레이어 안의 스타일을 덮어씁니다.</p>

        <pre><code>{`/* @layer 밖 — 항상 우선순위 높음 */
.header {
  display: block;
}

/* @layer base 안 — 항상 우선순위 낮음 */
@layer base {
  @media print {
    .header {
      display: none; /* 이 규칙이 위의 .header { display: block }에 덮어쓰임 */
    }
  }
}`}</code></pre>

        <p>프로젝트에서 헤더의 기본 스타일이 <code>@layer</code> 밖에 작성되어 있었기 때문에, <code>@layer base</code> 안의 <code>@media print</code> 규칙이 아무리 정확해도 무시된 거예요.</p>

        <h2>과정과 탐색</h2>

        <p>처음에는 선택자 문제인 줄 알았어요. <code>.header</code>가 아닌 다른 선택자를 써야 하는지 한참 찾았습니다.</p>

        <p>그 다음은 <code>@media print</code> 안에서 <code>!important</code>를 쓰면 될 거라고 생각했는데, 레이어 안의 <code>!important</code>는 레이어 밖의 <code>!important</code>보다 우선순위가 높아지는 특수한 역전 규칙이 적용돼요. 즉, <code>!important</code>가 붙으면 레이어 우선순위가 반전됩니다.</p>

        <pre><code>{`@layer base {
  @media print {
    .header {
      display: none !important; /* 이건 동작하지만 권장하지 않음 */
    }
  }
}`}</code></pre>

        <p>동작은 했지만 <code>!important</code>를 남발하는 건 좋지 않아요. 근본적인 원인을 이해하고 다른 방법을 찾았습니다.</p>

        <h2>해결 방안</h2>

        <p>가장 깔끔한 해결책은 <code>@media print</code> 스타일을 <code>@layer</code> 밖으로 꺼내는 거예요.</p>

        <pre><code>{`/* @layer 밖에서 직접 선언 */
@media print {
  .header {
    display: none;
  }
}`}</code></pre>

        <p>혹은 인쇄 스타일을 위한 별도 레이어를 가장 마지막에 선언하는 방법도 있어요.</p>

        <pre><code>{`/* 레이어 순서 선언 — 나중에 선언된 레이어가 우선순위 높음 */
@layer base, components, print;

@layer print {
  @media print {
    .header {
      display: none;
    }
  }
}`}</code></pre>

        <p>레이어는 선언 순서가 중요해요. 나중에 나온 레이어가 우선순위가 높습니다. <code>print</code> 레이어를 마지막에 두면 인쇄 스타일이 다른 레이어를 덮어쓸 수 있어요.</p>

        <h2>결과</h2>

        <p><code>@media print</code> 스타일을 <code>@layer</code> 밖으로 꺼내고 나서 인쇄 미리보기에서 헤더가 정상적으로 사라졌습니다.</p>

        <h2>배운 점</h2>

        <p>CSS <code>@layer</code>는 강력한 도구지만, 레이어 밖 스타일이 항상 레이어 안 스타일을 이긴다는 규칙을 모르면 예상치 못한 결과를 만납니다.</p>

        <p>인쇄 스타일처럼 특정 컨텍스트에서만 적용되는 스타일은 레이어 구조를 신경 써서 배치해야 해요. 레이어 밖에 직접 선언하거나, 인쇄 전용 레이어를 레이어 선언 순서의 마지막에 두는 방식이 안전합니다.</p>
      </Content>
    );
  }

  return (
    <Content>
      <h1>@media print vs CSS Layers Conflict — Why the Print Header Wouldn't Hide</h1>

      <h2>The Problem</h2>

      <p>While building a print feature, I wrote code to hide the header:</p>

      <pre><code>{`@layer base {
  @media print {
    .header {
      display: none;
    }
  }
}`}</code></pre>

      <p>The CSS looked correct, but opening print preview showed the header still appearing. The <code>display: none</code> wasn't being applied.</p>

      <h2>The Cause</h2>

      <p>CSS <code>@layer</code> creates cascade layers that let you explicitly manage style priority. But there's one key rule:</p>

      <p><strong>Styles inside a layer always have lower priority than styles outside any layer.</strong></p>

      <p>Specificity doesn't matter. Styles written outside layers override styles inside layers.</p>

      <pre><code>{`/* Outside @layer — always higher priority */
.header {
  display: block;
}

/* Inside @layer base — always lower priority */
@layer base {
  @media print {
    .header {
      display: none; /* Overridden by .header { display: block } above */
    }
  }
}`}</code></pre>

      <p>Since the header's base styles were written outside <code>@layer</code>, the <code>@media print</code> rules inside <code>@layer base</code> were ignored no matter how correct they were.</p>

      <h2>Investigation</h2>

      <p>At first I thought it was a selector issue — spent a while checking if I needed a different selector than <code>.header</code>.</p>

      <p>Then I thought using <code>!important</code> inside <code>@media print</code> would work. There's actually a special reversal rule: <code>!important</code> inside a layer has higher priority than <code>!important</code> outside — the layer priority flips for <code>!important</code> declarations.</p>

      <pre><code>{`@layer base {
  @media print {
    .header {
      display: none !important; /* Works, but not recommended */
    }
  }
}`}</code></pre>

      <p>It worked, but sprinkling <code>!important</code> around isn't good practice. I went back to understand the root cause properly.</p>

      <h2>Solution</h2>

      <p>The cleanest fix is moving <code>@media print</code> styles outside of <code>@layer</code>:</p>

      <pre><code>{`/* Declared directly outside @layer */
@media print {
  .header {
    display: none;
  }
}`}</code></pre>

      <p>Alternatively, declare a dedicated print layer last in the layer order:</p>

      <pre><code>{`/* Layer order declaration — later layers have higher priority */
@layer base, components, print;

@layer print {
  @media print {
    .header {
      display: none;
    }
  }
}`}</code></pre>

      <p>Layer declaration order matters — layers declared later have higher priority. Placing the <code>print</code> layer last lets print styles override other layers.</p>

      <h2>Result</h2>

      <p>After moving the <code>@media print</code> styles outside of <code>@layer</code>, the header correctly disappeared in print preview.</p>

      <h2>Lessons Learned</h2>

      <p>CSS <code>@layer</code> is a powerful tool, but without knowing that styles outside layers always beat styles inside layers, you'll get unexpected results.</p>

      <p>Styles that apply only in specific contexts — like print styles — need careful placement in the layer structure. Declaring them directly outside any layer, or placing a dedicated print layer last in the layer order, is the safe approach.</p>
    </Content>
  );
};
