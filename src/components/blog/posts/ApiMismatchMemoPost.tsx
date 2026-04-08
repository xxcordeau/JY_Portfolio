import styled from 'styled-components';

const Content = styled.div``;

interface PostProps {
  language: 'ko' | 'en';
}

export const ApiMismatchMemoPost = ({ language }: PostProps) => {
  if (language === 'ko') {
    return (
      <Content>
        <h1>API 응답 형식 불일치와 useMemo 크래시 — undefined는 조용히 퍼져요</h1>

        <h2>발단</h2>

        <p>특정 화면에서 갑자기 흰 화면이 떴어요. 콘솔에는 이런 에러가 있었습니다.</p>

        <pre><code>{`TypeError: Cannot read properties of undefined (reading 'filter')
  at useMemo (ProductList.tsx:34)`}</code></pre>

        <p><code>useMemo</code> 안에서 <code>.filter()</code>를 호출했는데 대상이 <code>undefined</code>라는 거였어요.</p>

        <h2>원인</h2>

        <p>API 응답 형식이 예상과 달랐습니다. 페이지네이션이 있는 API는 보통 이런 형식이에요.</p>

        <pre><code>{`// 예상한 응답 형식
{
  "content": [...],
  "totalPages": 10,
  "totalElements": 100
}`}</code></pre>

        <p>그래서 코드에서 <code>response.data.content</code>로 접근했어요. 그런데 이 API는 배열을 직접 반환하고 있었습니다.</p>

        <pre><code>{`// 실제 응답 형식
[
  { id: 1, name: "..." },
  { id: 2, name: "..." }
]`}</code></pre>

        <p><code>response.data.content</code>는 배열에 <code>content</code> 프로퍼티가 없으니 <code>undefined</code>가 됩니다. 이 <code>undefined</code>가 상태에 저장되고, 그걸 <code>useMemo</code>가 받아서 <code>.filter()</code>를 시도하다가 크래시.</p>

        <h2>과정과 탐색</h2>

        <p>에러 메시지만 봐서는 어디서 <code>undefined</code>가 왔는지 바로 알기 어려웠어요. <code>useMemo</code>가 직접 API를 호출하는 게 아니라, 어딘가에서 온 상태를 받아서 사용하는 구조였거든요.</p>

        <p>바이너리 서치 방식으로 좁혀갔습니다. <code>window.__omStep</code>에 단계별로 값을 찍어서 어느 지점에서 <code>undefined</code>가 됐는지 추적했어요.</p>

        <pre><code>{`// API 호출 직후
window.__omStep = 1;
window.__omData = response.data;
console.log('[step1] response.data:', response.data); // 배열 출력됨

// content 접근 후
window.__omStep = 2;
window.__omData = response.data.content;
console.log('[step2] content:', response.data.content); // undefined 출력됨`}</code></pre>

        <p>Step 2에서 <code>undefined</code>가 됐어요. <code>response.data</code>는 정상인데 <code>response.data.content</code>가 <code>undefined</code>인 거였습니다. API가 배열을 직접 반환하고 있었기 때문이에요.</p>

        <p>이 <code>undefined</code>가 <code>useState</code>에 저장됐고, 렌더링 때 <code>useMemo</code>가 이 상태를 받아서 <code>.filter()</code>를 호출하려다 터진 거였어요.</p>

        <h2>해결 방안</h2>

        <p>API 응답이 배열인지 페이지네이션 형식인지 확인하는 코드를 추가했습니다.</p>

        <pre><code>{`const fetchProducts = async () => {
  const response = await api.get('/products');

  // 응답 형식에 따라 분기
  const items = Array.isArray(response.data)
    ? response.data
    : response.data.content ?? [];

  setProducts(items);
};`}</code></pre>

        <p><code>useMemo</code>에도 방어 코드를 추가했어요.</p>

        <pre><code>{`const filtered = useMemo(() => {
  if (!Array.isArray(products)) return [];
  return products.filter(p => p.status === 'active');
}, [products]);`}</code></pre>

        <h2>결과</h2>

        <p>크래시가 사라졌고, 데이터가 정상적으로 렌더링됐습니다. 방어 코드 덕분에 이후에 API 응답 형식이 바뀌어도 흰 화면 대신 빈 목록이 보이게 됐어요.</p>

        <h2>배운 점</h2>

        <p><code>undefined</code>는 에러를 바로 던지지 않아요. 상태에 조용히 저장되고, 여러 컴포넌트를 거치다가 가장 마지막 지점에서 터집니다. 에러가 발생한 곳과 원인이 발생한 곳이 달라서 추적이 어려워요.</p>

        <p>API 연동 코드에서는 응답 형식을 과신하지 않는 게 좋습니다. 백엔드와 약속한 형식이 맞는지 방어적으로 확인하고, <code>Array.isArray</code>나 옵셔널 체이닝으로 명시적으로 처리하는 습관이 이런 조용한 버그를 막아줍니다.</p>
      </Content>
    );
  }

  return (
    <Content>
      <h1>API Response Mismatch and useMemo Crash — undefined Spreads Silently</h1>

      <h2>The Problem</h2>

      <p>A white screen appeared suddenly on a specific page. The console showed:</p>

      <pre><code>{`TypeError: Cannot read properties of undefined (reading 'filter')
  at useMemo (ProductList.tsx:34)`}</code></pre>

      <p><code>.filter()</code> was being called inside <code>useMemo</code> on something that was <code>undefined</code>.</p>

      <h2>The Cause</h2>

      <p>The API response format didn't match expectations. Paginated APIs typically return something like this:</p>

      <pre><code>{`// Expected response format
{
  "content": [...],
  "totalPages": 10,
  "totalElements": 100
}`}</code></pre>

      <p>So the code accessed <code>response.data.content</code>. But this particular API returned an array directly:</p>

      <pre><code>{`// Actual response format
[
  { id: 1, name: "..." },
  { id: 2, name: "..." }
]`}</code></pre>

      <p><code>response.data.content</code> is <code>undefined</code> because arrays don't have a <code>content</code> property. That <code>undefined</code> got stored in state, <code>useMemo</code> received it and tried calling <code>.filter()</code> — crash.</p>

      <h2>Investigation</h2>

      <p>The error message alone didn't make it obvious where <code>undefined</code> came from. <code>useMemo</code> wasn't calling the API directly — it received state from somewhere upstream.</p>

      <p>I narrowed it down with binary search, logging values into <code>window.__omStep</code> at each stage to track where <code>undefined</code> appeared:</p>

      <pre><code>{`// Right after API call
window.__omStep = 1;
window.__omData = response.data;
console.log('[step1] response.data:', response.data); // Array printed

// After accessing .content
window.__omStep = 2;
window.__omData = response.data.content;
console.log('[step2] content:', response.data.content); // undefined printed`}</code></pre>

      <p><code>undefined</code> appeared at step 2. <code>response.data</code> was fine, but <code>response.data.content</code> was <code>undefined</code> because the API returned an array directly.</p>

      <p>That <code>undefined</code> got saved into <code>useState</code>, and during rendering, <code>useMemo</code> received it and tried calling <code>.filter()</code> — boom.</p>

      <h2>Solution</h2>

      <p>Added a check for whether the API response is an array or a paginated format:</p>

      <pre><code>{`const fetchProducts = async () => {
  const response = await api.get('/products');

  // Handle both response formats
  const items = Array.isArray(response.data)
    ? response.data
    : response.data.content ?? [];

  setProducts(items);
};`}</code></pre>

      <p>Also added a defensive guard in <code>useMemo</code>:</p>

      <pre><code>{`const filtered = useMemo(() => {
  if (!Array.isArray(products)) return [];
  return products.filter(p => p.status === 'active');
}, [products]);`}</code></pre>

      <h2>Result</h2>

      <p>The crash disappeared and data rendered correctly. Thanks to the defensive code, if the API response format ever changes again, you'll see an empty list instead of a white screen.</p>

      <h2>Lessons Learned</h2>

      <p><code>undefined</code> doesn't throw immediately. It gets quietly stored in state, passes through multiple components, and explodes at the furthest point downstream. The error location and the cause location are different — that's what makes it hard to trace.</p>

      <p>Don't blindly trust API response shapes in integration code. Defensively verify the format you agreed on with the backend, and use <code>Array.isArray</code> or optional chaining to handle it explicitly. That habit catches these silent bugs before they become white screens.</p>
    </Content>
  );
};
