'use client';

import styled from 'styled-components';

const Content = styled.div``;

interface PostProps {
  language: 'ko' | 'en';
}

export const TableComponentPost = ({ language }: PostProps) => {
  if (language === 'ko') {
    return (
      <Content>
        <h2>원인</h2>

        <p>저희 솔루션은 특성상 거의 모든 화면이 데이터를 테이블로 보여줘요.</p>

        <p>그런데 페이지마다 페이지네이션, 정렬, 컬럼 정의, API 호출 로직이 반복되면서 비슷하지만 조금씩 다른 코드가 쌓였어요.</p>

        <ul>
          <li>페이지마다 테이블 로직이 중복돼 유지보수 부담이 커짐</li>
          <li><code>searchOption</code>을 초기화할 때 기본값이 덮어써지거나 상태가 어긋남</li>
          <li>서버 요청 스펙과 화면 전용 필드가 섞여 타입이 불안정하고 불필요한 값까지 전송됨</li>
          <li>응답이 클 때 로딩 UX가 들쭉날쭉하고 화면이 깜빡임</li>
        </ul>

        <p>목표는 한 번 정의하면 어디서든 재사용할 수 있는 테이블 구조였어요. 정리하면 이래요.</p>

        <ul>
          <li>범용 composable(<code>useTable</code>)로 통합</li>
          <li>요청 스펙 최소화</li>
          <li>URL 기반 상태 동기화와 일관된 UX</li>
        </ul>

        <h2>과정과 문제 탐색</h2>

        <p>테이블마다 반복되던 코드를 <code>useTable</code> composable 하나로 모았어요.</p>

        <p>이때 신경 쓴 건 실행 순서를 onMounted 안에 명시적으로 고정하는 것, 그리고 watch 없이 상태를 제어하는 것이었어요. 순서는 이렇게 고정했어요.</p>

        <blockquote>
          <ol>
            <li>URL 값을 상태에 주입</li>
            <li>URL 정규화 (선택)</li>
            <li>첫 fetch 실행</li>
          </ol>
        </blockquote>

        <h2>구현</h2>

        <h3>a. 타입/요청 규약</h3>

        <pre><code>{`export interface Pagination {
  pageNo: number
  pageSize: number
  sortField?: string
  sortOrder?: 'ascend' | 'descend' | ''
}`}</code></pre>

        <p>API에는 <code>pageNo/pageSize/sortField/sortOrder</code>만 보내고, UI 전용 필드는 <code>TablePagination</code>에서만 관리하도록 분리했어요.</p>

        <h3>b. 공통 composable (useTable)</h3>

        <pre><code>{`export const useTable = <TQuery extends Pagination, TRow>(
  apiList: (q: Pagination, signal?: AbortSignal) => Promise<{ items: TRow[]; total: number }>
) => {
  // controller.abort()로 진행 중 요청 중단
  // 뒤늦은 응답이 화면을 덮는 레이스 버그 차단
}`}</code></pre>

        <ul>
          <li><code>AbortController</code>로 중복 요청 차단</li>
          <li>fetch는 onMounted에서만 명시적으로 호출</li>
          <li><code>lastKey</code>로 같은 쿼리 중복 방지</li>
        </ul>

        <p>이 구조로 바꾸고 나서 중복 로딩과 깜빡임이 거의 사라졌어요.</p>

        <h3>c. 공통 UI (<code>&lt;AppTable /&gt;</code>)</h3>

        <p>양방향 바인딩을 없애고, 모든 상태를 부모가 직접 제어하게 했어요.</p>

        <pre><code>{`<a-table
  :columns="columns"
  :data-source="rows"
  :loading="loading"
  :pagination="{ current: pg.pageNo, pageSize: pg.pageSize, total: pg.total }"
  row-key="id"
  @change="onChange"
/>`}</code></pre>

        <h3>d. 페이지 예시</h3>

        <pre><code>{`onMounted(async () => {
  initFromUrlOnce()   // 1. URL → 상태
  await syncUrlFromPg() // 2. 정규화
  await fetch()         // 3. 데이터 호출
})`}</code></pre>

        <p>fetch는 <code>applyPg()</code> 같은 로컬 핸들러에서만 트리거해서, 언제 데이터를 부르는지가 코드에 그대로 드러나게 했어요.</p>

        <p>덕분에 새로고침, 링크 공유, 뒤로가기 후에도 같은 검색 조건이 복원돼요.</p>

        <h2>결과</h2>

        <p>테이블 관련 중복 코드가 줄었고 신규 페이지를 만드는 시간도 짧아졌어요. SSR/CSR이 섞인 환경에서도 데이터가 일관되게 유지됐고, 빈 값 덮어쓰기와 상태 꼬임도 없어졌어요.</p>

        <h2>배운 점</h2>

        <p>테이블을 재사용 가능하게 만드는 것보다 데이터 흐름 전체를 어디서 통제할지 정하는 게 더 큰 일이었어요. Vue에서 <code>watch</code> 없이 명시적인 호출만으로도 상태를 충분히 예측 가능하게 다룰 수 있다는 것도 확인했어요.</p>
      </Content>
    );
  }

  return (
    <Content>
      <h2>Background</h2>

      <p>Because of what our solution does, almost every screen shows its data in a table.</p>

      <p>Each page repeated its own pagination, sorting, column definitions, and API calls, so we ended up with lots of code that was similar but never quite the same.</p>

      <ul>
        <li>Table logic duplicated on every page, which made maintenance heavier</li>
        <li>Defaults got overwritten or state fell out of sync when <code>searchOption</code> was initialized</li>
        <li>Server request specs and UI-only fields were mixed, so types were shaky and extra values were sent</li>
        <li>Loading UX was inconsistent and the screen flickered on large responses</li>
      </ul>

      <p>The goal was a table structure I could define once and reuse anywhere. In short:</p>

      <ul>
        <li>Integrate with a universal composable (<code>useTable</code>)</li>
        <li>Minimize request specifications</li>
        <li>URL-based state sync and consistent UX</li>
      </ul>

      <h2>Process and Problem Exploration</h2>

      <p>I pulled the code that every table repeated into a single <code>useTable</code> composable.</p>

      <p>Two things mattered most: fixing the execution order explicitly in onMounted, and controlling state without watch. The order looks like this.</p>

      <blockquote>
        <ol>
          <li>Inject URL values into state</li>
          <li>URL normalization (optional)</li>
          <li>Execute first fetch</li>
        </ol>
      </blockquote>

      <h2>Implementation</h2>

      <h3>a. Type/Request Contract</h3>

      <pre><code>{`export interface Pagination {
  pageNo: number
  pageSize: number
  sortField?: string
  sortOrder?: 'ascend' | 'descend' | ''
}`}</code></pre>

      <p>Only <code>pageNo/pageSize/sortField/sortOrder</code> go to the API. UI-only fields live separately in <code>TablePagination</code>.</p>

      <h3>b. Common Composable (useTable)</h3>

      <pre><code>{`export const useTable = <TQuery extends Pagination, TRow>(
  apiList: (q: Pagination, signal?: AbortSignal) => Promise<{ items: TRow[]; total: number }>
) => {
  // Cancel in-progress requests with controller.abort()
  // Block race bugs where delayed responses overwrite the screen
}`}</code></pre>

      <ul>
        <li>Block duplicate requests with <code>AbortController</code></li>
        <li>Call fetch explicitly, only in onMounted</li>
        <li>Prevent duplicate queries with <code>lastKey</code></li>
      </ul>

      <p>After this change, the duplicate loading and flickering were almost gone.</p>

      <h3>c. Common UI (<code>&lt;AppTable /&gt;</code>)</h3>

      <p>I removed two-way binding entirely so the parent controls all of the state.</p>

      <pre><code>{`<a-table
  :columns="columns"
  :data-source="rows"
  :loading="loading"
  :pagination="{ current: pg.pageNo, pageSize: pg.pageSize, total: pg.total }"
  row-key="id"
  @change="onChange"
/>`}</code></pre>

      <h3>d. Page Example</h3>

      <pre><code>{`onMounted(async () => {
  initFromUrlOnce()   // 1. URL → State
  await syncUrlFromPg() // 2. Normalization
  await fetch()         // 3. Data call
})`}</code></pre>

      <p>Fetch is triggered only from local handlers like <code>applyPg()</code>, so it's always clear from the code when data gets loaded.</p>

      <p>This way the same search conditions come back after a refresh, a shared link, or going back.</p>

      <h2>Results</h2>

      <p>There's less duplicated table code, and new pages take less time to build. Data stays consistent even with mixed SSR/CSR, and the blank-value overwrites and tangled state are gone.</p>

      <h2>Key Takeaways</h2>

      <p>Making the table reusable turned out to be the smaller part. Deciding where the whole data flow is controlled was the real work. I also confirmed that in Vue, explicit calls without <code>watch</code> are enough to keep state predictable.</p>
    </Content>
  );
};
