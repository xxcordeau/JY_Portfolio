'use client';

import styled from 'styled-components';

const Content = styled.div``;

interface PostProps {
  language: 'ko' | 'en';
}

export const ApiMismatchMemoPost = ({ language }: PostProps) => {
  if (language === 'ko') {
    return (
      <Content>
        <h2>발단</h2>

        <p>특정 화면에서 갑자기 흰 화면이 떴어요. 콘솔에는 이런 에러가 찍혀 있었어요.</p>

        <pre><code>{`TypeError: Cannot read properties of undefined (reading 'filter')
  at useMemo (ProductList.tsx:34)`}</code></pre>

        <p><code>useMemo</code> 안에서 <code>.filter()</code>를 호출했는데 대상이 <code>undefined</code>였어요.</p>

        <h2>원인</h2>

        <p>API 응답 형식이 예상과 달랐어요. 페이지네이션이 있는 API는 보통 이런 형식이에요.</p>

        <pre><code>{`// 예상한 응답 형식
{
  "content": [...],
  "totalPages": 10,
  "totalElements": 100
}`}</code></pre>

        <p>그래서 코드에서 <code>response.data.content</code>로 접근했는데, 이 API는 배열을 그대로 반환하고 있었어요.</p>

        <pre><code>{`// 실제 응답 형식
[
  { id: 1, name: "..." },
  { id: 2, name: "..." }
]`}</code></pre>

        <p>배열에는 <code>content</code> 프로퍼티가 없으니 <code>response.data.content</code>는 <code>undefined</code>가 돼요. 이 값이 상태에 저장되고, <code>useMemo</code>가 그걸 받아 <code>.filter()</code>를 호출하다가 크래시가 났어요.</p>

        <h2>추적 과정</h2>

        <p>에러 메시지만으로는 <code>undefined</code>가 어디서 왔는지 바로 알기 어려웠어요. <code>useMemo</code>가 API를 직접 부르는 게 아니라, 어딘가에서 넘어온 상태를 받아 쓰는 구조였거든요.</p>

        <p>그래서 바이너리 서치 방식으로 범위를 좁혔어요. <code>window.__omStep</code>에 단계별로 값을 찍어서 어느 지점에서 <code>undefined</code>가 되는지 확인했어요.</p>

        <pre><code>{`// API 호출 직후
window.__omStep = 1;
window.__omData = response.data;
console.log('[step1] response.data:', response.data); // 배열 출력됨

// content 접근 후
window.__omStep = 2;
window.__omData = response.data.content;
console.log('[step2] content:', response.data.content); // undefined 출력됨`}</code></pre>

        <p>Step 2에서 <code>undefined</code>가 나왔어요. <code>response.data</code>는 정상이었고 <code>response.data.content</code>만 <code>undefined</code>였어요. API가 배열을 직접 반환하고 있었기 때문이에요.</p>

        <p>이 <code>undefined</code>가 <code>useState</code>에 들어갔고, 렌더링 때 <code>useMemo</code>가 이 상태로 <code>.filter()</code>를 호출하다 터진 거였어요.</p>

        <h2>해결</h2>

        <p>응답이 배열인지 페이지네이션 형식인지 확인하는 코드를 넣었어요.</p>

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

        <p>크래시가 사라지고 데이터가 제대로 렌더링됐어요. 방어 코드가 있으니 나중에 API 응답 형식이 바뀌어도 흰 화면 대신 빈 목록이 보여요.</p>

        <h2>돌아보며</h2>

        <p><code>undefined</code>는 그 자리에서 에러를 던지지 않아요. 상태에 조용히 저장된 채 여러 컴포넌트를 거치다가 가장 마지막 지점에서 터져요. 에러가 난 곳과 원인이 생긴 곳이 달라서 추적이 어려웠어요.</p>

        <p>그래서 API 연동 코드에서는 응답 형식을 너무 믿지 않으려고 해요. 백엔드와 약속한 형식이 맞는지 한 번 더 확인하고, <code>Array.isArray</code>나 옵셔널 체이닝으로 명시적으로 처리해 두면 이런 조용한 버그를 미리 막을 수 있어요.</p>
      </Content>
    );
  }

  return (
    <Content>
      <h2>The Problem</h2>

      <p>A specific page suddenly went white. The console showed this:</p>

      <pre><code>{`TypeError: Cannot read properties of undefined (reading 'filter')
  at useMemo (ProductList.tsx:34)`}</code></pre>

      <p><code>.filter()</code> was being called inside <code>useMemo</code> on something that was <code>undefined</code>.</p>

      <h2>The Cause</h2>

      <p>The API response format wasn't what I expected. Paginated APIs usually return something like this:</p>

      <pre><code>{`// Expected response format
{
  "content": [...],
  "totalPages": 10,
  "totalElements": 100
}`}</code></pre>

      <p>So the code read <code>response.data.content</code>. But this particular API returned an array directly:</p>

      <pre><code>{`// Actual response format
[
  { id: 1, name: "..." },
  { id: 2, name: "..." }
]`}</code></pre>

      <p>Arrays don't have a <code>content</code> property, so <code>response.data.content</code> is <code>undefined</code>. That <code>undefined</code> got stored in state, <code>useMemo</code> picked it up and tried calling <code>.filter()</code>, and the page crashed.</p>

      <h2>Investigation</h2>

      <p>The error message alone didn't tell me where <code>undefined</code> came from. <code>useMemo</code> wasn't calling the API itself. It was reading state that came from somewhere upstream.</p>

      <p>I narrowed it down binary-search style, logging values into <code>window.__omStep</code> at each stage to see where <code>undefined</code> first appeared:</p>

      <pre><code>{`// Right after API call
window.__omStep = 1;
window.__omData = response.data;
console.log('[step1] response.data:', response.data); // Array printed

// After accessing .content
window.__omStep = 2;
window.__omData = response.data.content;
console.log('[step2] content:', response.data.content); // undefined printed`}</code></pre>

      <p><code>undefined</code> showed up at step 2. <code>response.data</code> was fine, but <code>response.data.content</code> was <code>undefined</code> because the API returned an array directly.</p>

      <p>That <code>undefined</code> went into <code>useState</code>, and during render <code>useMemo</code> took it and tried calling <code>.filter()</code>. Boom.</p>

      <h2>Solution</h2>

      <p>I added a check for whether the response is an array or a paginated object:</p>

      <pre><code>{`const fetchProducts = async () => {
  const response = await api.get('/products');

  // Handle both response formats
  const items = Array.isArray(response.data)
    ? response.data
    : response.data.content ?? [];

  setProducts(items);
};`}</code></pre>

      <p>I also added a guard inside <code>useMemo</code>:</p>

      <pre><code>{`const filtered = useMemo(() => {
  if (!Array.isArray(products)) return [];
  return products.filter(p => p.status === 'active');
}, [products]);`}</code></pre>

      <h2>Result</h2>

      <p>The crash went away and the data rendered correctly. With the guard in place, if the API response format changes again, you'll get an empty list instead of a white screen.</p>

      <h2>Looking Back</h2>

      <p><code>undefined</code> doesn't throw right away. It sits quietly in state, passes through several components, and blows up at the last point downstream. The place where it fails and the place where it starts are different, which is what made it hard to trace.</p>

      <p>So in API integration code I try not to trust response shapes too much. I double-check that the format matches what we agreed on with the backend, and handle it explicitly with <code>Array.isArray</code> or optional chaining. That habit stops this kind of silent bug before it turns into a white screen.</p>
    </Content>
  );
};
