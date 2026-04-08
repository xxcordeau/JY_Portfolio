import styled from 'styled-components';

const Content = styled.div``;

interface PostProps {
  language: 'ko' | 'en';
}

export const HiddenDivPost = ({ language }: PostProps) => {
  if (language === 'ko') {
    return (
      <Content>
        <h1>숨겨진 div의 역습 — React에서 hidden 클래스는 조건부 렌더링이 아니에요</h1>

        <h2>발단</h2>

        <p>탭 UI를 만들면서 비활성 탭의 내용을 숨기기 위해 이렇게 작성했어요.</p>

        <pre><code>{`<div className={activeTab === 'list' ? '' : 'hidden'}>
  <DataTable data={items.map(item => processItem(item))} />
</div>`}</code></pre>

        <p>화면에서는 잘 숨겨졌습니다. 그런데 콘솔에서 경고가 계속 떴고, 성능 프로파일을 보니 숨겨진 탭의 연산이 여전히 실행되고 있었어요.</p>

        <h2>원인</h2>

        <p>CSS <code>display: none</code>은 요소를 화면에서 숨기는 것뿐이에요. 브라우저 렌더링에서 레이아웃을 건너뛰지만, <strong>JavaScript 실행은 막지 않습니다.</strong></p>

        <p>JSX는 브라우저가 화면을 그리기 전에 평가(evaluate)됩니다. 즉 <code>className="hidden"</code>이 붙더라도:</p>

        <ul>
          <li><code>items.map(item =&gt; processItem(item))</code>는 실행됩니다</li>
          <li>컴포넌트는 마운트됩니다</li>
          <li>컴포넌트 내부의 <code>useEffect</code>가 실행됩니다</li>
          <li>API 호출이 발생할 수 있습니다</li>
        </ul>

        <p>화면에 보이지 않을 뿐, 모든 JS 연산은 그대로 돌아가고 있어요.</p>

        <h2>과정과 탐색</h2>

        <p>처음에는 <code>hidden</code> 클래스 이름이 문제인가 싶었어요. Tailwind의 <code>hidden</code>이 <code>display: none !important</code>라서 뭔가 다를 거라 생각했지만, CSS가 어떤 방식으로 숨기든 JS 실행과는 무관합니다.</p>

        <p>React DevTools로 컴포넌트 트리를 보니 숨겨진 탭의 컴포넌트가 마운트된 상태로 존재하고 있었어요. 내부의 <code>useEffect</code>가 데이터를 fetch하고 있었던 거죠.</p>

        <pre><code>{`// 이건 숨겨도 여전히 실행됨
<div className="hidden">
  <HeavyComponent /> {/* 마운트됨, useEffect 실행됨 */}
</div>`}</code></pre>

        <h2>해결 방안</h2>

        <p>조건부 렌더링을 사용해야 합니다. JSX 단락 평가(short-circuit evaluation)를 쓰면 조건이 <code>false</code>일 때 컴포넌트 자체가 마운트되지 않아요.</p>

        <pre><code>{`{/* 단락 평가 — false면 아무것도 마운트되지 않음 */}
{activeTab === 'list' && (
  <DataTable data={items.map(item => processItem(item))} />
)}

{/* 또는 삼항 연산자 */}
{activeTab === 'list' ? (
  <DataTable data={items.map(item => processItem(item))} />
) : null}`}</code></pre>

        <p>이 방식은 조건이 <code>false</code>일 때 React가 해당 컴포넌트를 DOM에 마운트하지 않아요. 따라서 <code>useEffect</code>도 실행되지 않고, <code>.map()</code>도 호출되지 않습니다.</p>

        <h2>주의사항</h2>

        <p>조건부 렌더링은 탭 전환 시 컴포넌트가 언마운트/마운트됩니다. 즉 상태가 초기화돼요. 탭 간에 내부 상태를 유지해야 한다면 두 가지 선택지가 있어요.</p>

        <pre><code>{`// 1. 상태를 상위 컴포넌트로 올리기 (lifting state up)
const [listData, setListData] = useState([]);
// 상위에서 관리하고 props로 내려주기

// 2. CSS로 숨기되, 비용이 큰 연산은 조건부로 처리
<div className={activeTab === 'list' ? '' : 'hidden'}>
  <DataTable data={activeTab === 'list' ? items.map(processItem) : []} />
</div>`}</code></pre>

        <p>상태 유지가 중요하지 않은 경우에는 조건부 렌더링이 더 성능에 유리합니다. 무거운 컴포넌트가 불필요하게 마운트되지 않으니까요.</p>

        <h2>배운 점</h2>

        <p>CSS는 화면에 무엇을 보여줄지를 제어하고, React 조건부 렌더링은 무엇을 DOM에 존재시킬지를 제어합니다. 두 개념은 다른 레이어에서 동작해요.</p>

        <p>CSS로 숨기는 건 "눈에 보이지 않게" 하는 것이고, 조건부 렌더링은 "존재하지 않게" 하는 거예요. 성능이 중요한 컴포넌트는 존재 자체를 제어해야 합니다.</p>
      </Content>
    );
  }

  return (
    <Content>
      <h1>The Hidden Div Strike Back — CSS hidden Is Not Conditional Rendering in React</h1>

      <h2>The Problem</h2>

      <p>While building a tab UI, I wrote this to hide inactive tab content:</p>

      <pre><code>{`<div className={activeTab === 'list' ? '' : 'hidden'}>
  <DataTable data={items.map(item => processItem(item))} />
</div>`}</code></pre>

      <p>It looked hidden on screen. But warnings kept appearing in the console, and the performance profiler showed the hidden tab's computations were still running.</p>

      <h2>The Cause</h2>

      <p>CSS <code>display: none</code> only hides an element visually. It skips layout in browser rendering, but <strong>it does not stop JavaScript execution.</strong></p>

      <p>JSX is evaluated before the browser paints the screen. Even with <code>className="hidden"</code>:</p>

      <ul>
        <li><code>items.map(item =&gt; processItem(item))</code> still executes</li>
        <li>Components still mount</li>
        <li><code>useEffect</code> inside components still runs</li>
        <li>API calls can still fire</li>
      </ul>

      <p>It's invisible on screen, but all JavaScript runs as normal.</p>

      <h2>Investigation</h2>

      <p>At first I wondered if the class name was the issue. I thought Tailwind's <code>hidden</code> (<code>display: none !important</code>) might behave differently — but however CSS hides something, it's unrelated to JS execution.</p>

      <p>Looking at the component tree in React DevTools, the hidden tab's components were mounted and present. Their <code>useEffect</code> hooks were fetching data.</p>

      <pre><code>{`// Still runs even when hidden
<div className="hidden">
  <HeavyComponent /> {/* Mounted, useEffect fires */}
</div>`}</code></pre>

      <h2>Solution</h2>

      <p>Use conditional rendering. JSX short-circuit evaluation means when the condition is <code>false</code>, the component never mounts:</p>

      <pre><code>{`{/* Short-circuit — nothing mounts when false */}
{activeTab === 'list' && (
  <DataTable data={items.map(item => processItem(item))} />
)}

{/* Or ternary */}
{activeTab === 'list' ? (
  <DataTable data={items.map(item => processItem(item))} />
) : null}`}</code></pre>

      <p>When the condition is <code>false</code>, React doesn't mount the component to the DOM at all. So <code>useEffect</code> doesn't run, and <code>.map()</code> doesn't get called.</p>

      <h2>Caveats</h2>

      <p>With conditional rendering, components unmount and remount on tab switches — meaning internal state resets. If you need to preserve state between tabs, two options:</p>

      <pre><code>{`// 1. Lift state up
const [listData, setListData] = useState([]);
// Manage at parent level, pass down as props

// 2. Keep CSS hiding, but make expensive operations conditional
<div className={activeTab === 'list' ? '' : 'hidden'}>
  <DataTable data={activeTab === 'list' ? items.map(processItem) : []} />
</div>`}</code></pre>

      <p>When state preservation isn't important, conditional rendering performs better — heavy components don't mount unnecessarily.</p>

      <h2>Lessons Learned</h2>

      <p>CSS controls what gets shown on screen. React conditional rendering controls what exists in the DOM. They operate at different layers.</p>

      <p>Hiding with CSS means "invisible." Conditional rendering means "non-existent." For performance-sensitive components, control existence — not just visibility.</p>
    </Content>
  );
};
