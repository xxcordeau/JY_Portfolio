'use client';

import styled from 'styled-components';

const Content = styled.div``;

interface PostProps {
  language: 'ko' | 'en';
}

export const HiddenDivPost = ({ language }: PostProps) => {
  if (language === 'ko') {
    return (
      <Content>
        <h2>발단</h2>

        <p>탭 UI를 만들면서 비활성 탭 내용을 숨기려고 이렇게 작성했어요.</p>

        <pre><code>{`<div className={activeTab === 'list' ? '' : 'hidden'}>
  <DataTable data={items.map(item => processItem(item))} />
</div>`}</code></pre>

        <p>화면에서는 잘 숨겨졌어요. 그런데 콘솔 경고가 계속 떴고, 성능 프로파일을 보니 숨겨진 탭의 연산이 그대로 실행되고 있었어요.</p>

        <h2>원인</h2>

        <p>CSS <code>display: none</code>은 요소를 화면에서 숨길 뿐이에요. 브라우저가 레이아웃 계산은 건너뛰지만 JavaScript 실행까지 막지는 않아요.</p>

        <p>JSX는 브라우저가 화면을 그리기 전에 평가(evaluate)돼요. 그래서 <code>className="hidden"</code>이 붙어 있어도 이런 일이 일어나요.</p>

        <ul>
          <li><code>items.map(item =&gt; processItem(item))</code>가 실행됨</li>
          <li>컴포넌트가 마운트됨</li>
          <li>컴포넌트 안의 <code>useEffect</code>가 실행됨</li>
          <li>API 호출이 발생할 수 있음</li>
        </ul>

        <p>눈에 안 보일 뿐 JS 연산은 전부 돌아가고 있었던 거예요.</p>

        <h2>과정과 탐색</h2>

        <p>처음엔 <code>hidden</code>이라는 클래스 이름이 문제인가 싶었어요. Tailwind의 <code>hidden</code>은 <code>display: none !important</code>라서 뭔가 다르게 동작할 줄 알았는데, CSS로 어떻게 숨기든 JS 실행과는 상관이 없었어요.</p>

        <p>React DevTools로 컴포넌트 트리를 보니 숨겨진 탭의 컴포넌트가 마운트된 채로 있었어요. 그 안의 <code>useEffect</code>가 데이터를 fetch하고 있었고요.</p>

        <pre><code>{`// 이건 숨겨도 여전히 실행됨
<div className="hidden">
  <HeavyComponent /> {/* 마운트됨, useEffect 실행됨 */}
</div>`}</code></pre>

        <h2>해결 방안</h2>

        <p>조건부 렌더링을 써야 해요. JSX 단락 평가(short-circuit evaluation)를 쓰면 조건이 <code>false</code>일 때 컴포넌트가 아예 마운트되지 않아요.</p>

        <pre><code>{`{/* 단락 평가: false면 아무것도 마운트되지 않음 */}
{activeTab === 'list' && (
  <DataTable data={items.map(item => processItem(item))} />
)}

{/* 또는 삼항 연산자 */}
{activeTab === 'list' ? (
  <DataTable data={items.map(item => processItem(item))} />
) : null}`}</code></pre>

        <p>조건이 <code>false</code>면 React는 해당 컴포넌트를 DOM에 마운트하지 않아요. 그러니 <code>useEffect</code>도 실행되지 않고 <code>.map()</code>도 호출되지 않아요.</p>

        <h2>주의사항</h2>

        <p>조건부 렌더링을 쓰면 탭을 바꿀 때마다 컴포넌트가 언마운트됐다가 다시 마운트되고, 내부 상태도 초기화돼요. 탭 사이에서 상태를 유지해야 한다면 선택지는 두 가지예요.</p>

        <pre><code>{`// 1. 상태를 상위 컴포넌트로 올리기 (lifting state up)
const [listData, setListData] = useState([]);
// 상위에서 관리하고 props로 내려주기

// 2. CSS로 숨기되, 비용이 큰 연산은 조건부로 처리
<div className={activeTab === 'list' ? '' : 'hidden'}>
  <DataTable data={activeTab === 'list' ? items.map(processItem) : []} />
</div>`}</code></pre>

        <p>상태 유지가 중요하지 않다면 조건부 렌더링이 성능 면에서 유리해요. 무거운 컴포넌트가 쓸데없이 마운트되지 않으니까요.</p>

        <h2>배운 점</h2>

        <p>CSS는 화면에 무엇을 보여줄지를 정하고, React 조건부 렌더링은 무엇을 DOM에 둘지를 정해요. 두 개념은 서로 다른 레이어에서 동작해요.</p>

        <p>CSS로 숨기면 눈에 안 보일 뿐이고, 조건부 렌더링을 쓰면 아예 존재하지 않아요. 앞으로 무거운 컴포넌트를 숨길 때는 보이는지보다 마운트되는지부터 확인하려고 해요.</p>
      </Content>
    );
  }

  return (
    <Content>
      <h2>The Problem</h2>

      <p>While building a tab UI, I wrote this to hide the inactive tab's content:</p>

      <pre><code>{`<div className={activeTab === 'list' ? '' : 'hidden'}>
  <DataTable data={items.map(item => processItem(item))} />
</div>`}</code></pre>

      <p>It looked hidden on screen. But warnings kept showing up in the console, and the performance profiler showed the hidden tab's computations were still running.</p>

      <h2>The Cause</h2>

      <p>CSS <code>display: none</code> only hides an element visually. The browser skips layout for it, but that does nothing to stop JavaScript from running.</p>

      <p>JSX is evaluated before the browser paints the screen. So even with <code>className="hidden"</code>:</p>

      <ul>
        <li><code>items.map(item =&gt; processItem(item))</code> still executes</li>
        <li>Components still mount</li>
        <li><code>useEffect</code> inside components still runs</li>
        <li>API calls can still fire</li>
      </ul>

      <p>You can't see it, but all of that JavaScript is running anyway.</p>

      <h2>Investigation</h2>

      <p>At first I wondered if the class name was the issue. Tailwind's <code>hidden</code> is <code>display: none !important</code>, so I thought it might behave differently. It doesn't. However CSS hides something, it has nothing to do with whether JS runs.</p>

      <p>In React DevTools, the hidden tab's components were mounted and sitting in the tree, and their <code>useEffect</code> hooks were fetching data.</p>

      <pre><code>{`// Still runs even when hidden
<div className="hidden">
  <HeavyComponent /> {/* Mounted, useEffect fires */}
</div>`}</code></pre>

      <h2>Solution</h2>

      <p>Use conditional rendering. With JSX short-circuit evaluation, the component never mounts when the condition is <code>false</code>:</p>

      <pre><code>{`{/* Short-circuit: nothing mounts when false */}
{activeTab === 'list' && (
  <DataTable data={items.map(item => processItem(item))} />
)}

{/* Or ternary */}
{activeTab === 'list' ? (
  <DataTable data={items.map(item => processItem(item))} />
) : null}`}</code></pre>

      <p>When the condition is <code>false</code>, React doesn't mount the component to the DOM at all. So <code>useEffect</code> doesn't run, and <code>.map()</code> doesn't get called.</p>

      <h2>Caveats</h2>

      <p>With conditional rendering, components unmount and remount on every tab switch, so their internal state resets. If you need to keep state between tabs, you have two options:</p>

      <pre><code>{`// 1. Lift state up
const [listData, setListData] = useState([]);
// Manage at parent level, pass down as props

// 2. Keep CSS hiding, but make expensive operations conditional
<div className={activeTab === 'list' ? '' : 'hidden'}>
  <DataTable data={activeTab === 'list' ? items.map(processItem) : []} />
</div>`}</code></pre>

      <p>When you don't need to keep state, conditional rendering performs better because heavy components don't mount for nothing.</p>

      <h2>Lessons Learned</h2>

      <p>CSS controls what gets shown on screen. React conditional rendering controls what exists in the DOM. They work at different layers.</p>

      <p>Hiding with CSS makes something invisible. Conditional rendering makes it not exist. Next time I hide a heavy component, I'll check whether it mounts, not just whether it shows.</p>
    </Content>
  );
};
