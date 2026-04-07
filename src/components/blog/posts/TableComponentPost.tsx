import styled from 'styled-components';
import { ImageWithFallback } from '../../figma/ImageWithFallback';

const Content = styled.div``;

const ArticleImage = styled.div`
  width: 100%;
  border-radius: 16px;
  overflow: hidden;
  margin: 40px 0;
  
  img {
    width: 100%;
    height: auto;
    display: block;
  }

  @media (max-width: 768px) {
    border-radius: 12px;
    margin: 32px 0;
  }
`;

const ImageCaption = styled.p`
  font-size: 14px;
  color: #86868b;
  text-align: center;
  margin-top: 12px;
  font-style: italic;
`;

interface PostProps {
  language: 'ko' | 'en';
}

export const TableComponentPost = ({ language }: PostProps) => {
  if (language === 'ko') {
    return (
      <Content>
        <h1>공통 테이블 컴포넌트 구조화 경험</h1>
        
        <h2>원인</h2>
        
        <p>당사 솔루션 특성상, 거의 모든 화면이 데이터를 테이블 형태로 보여주고 있었어요.</p>
        
        <p>그런데 각 페이지마다 <strong>페이지네이션, 정렬, 컬럼 정의, API 호출 로직</strong>이 반복되면서 코드가 비슷한데도 조금씩 달라지는 문제가 쌓였어요.</p>
        
        <ul>
          <li>페이지마다 테이블 로직이 중복 → 유지보수 부담 증가</li>
          <li><code>searchOption</code> 초기화 시 <strong>기본값 덮어쓰기 / 상태 불일치</strong> 발생</li>
          <li>서버 요청 스펙과 화면 전용 필드가 혼재 → <strong>타입 불안정, 불필요 전송</strong></li>
          <li>대용량 응답에서 로딩 UX 불일치, 깜빡임 발생</li>
        </ul>
        
        <p>결국 <strong>한 번 정의하면 어디서든 재사용 가능한 테이블 구조</strong>를 만드는 게 목표였어요. 요약하자면 아래 세 가지였는데요</p>
        
        <ul>
          <li>범용 composable(<code>useTable</code>)로 통합</li>
          <li>요청 스펙 최소화</li>
          <li>URL 기반 상태 동기화 + 일관된 UX 확보</li>
        </ul>
        
        <h2>과정과 문제 탐색</h2>
        
        <p>테이블마다 같은 코드가 반복되던 패턴을 <code>useTable</code> composable 하나로 통합했어요.</p>
        
        <ArticleImage>
          <ImageWithFallback 
            src="https://images.unsplash.com/photo-1701099153647-bf447f0a855a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwdGFibGUlMjBkYXNoYm9hcmR8ZW58MXx8fHwxNzYxMTM0ODgxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" 
            alt="데이터 테이블 구조" 
          />
          <ImageCaption>테이블 컴포넌트 구조 개선 과정</ImageCaption>
        </ArticleImage>
        
        <p>핵심은 <strong>명시적 실행 순서 고정(onMounted)</strong> 과 <strong>watch 없는 상태 제어</strong>였습니다.</p>
        
        <blockquote>
          <p><strong>순서 고정 흐름</strong></p>
          <ol>
            <li>URL → 상태 주입</li>
            <li>URL 정규화 (선택)</li>
            <li>첫 fetch 실행</li>
          </ol>
        </blockquote>
        
        <h2>구현</h2>
        
        <ArticleImage>
          <ImageWithFallback 
            src="https://images.unsplash.com/photo-1566966215403-93b38ff16b7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2RlJTIwc3RydWN0dXJlJTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc2MTEzNDg4MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" 
            alt="코드 구조" 
          />
          <ImageCaption>재사용 가능한 컴포넌트 아키텍처</ImageCaption>
        </ArticleImage>
        
        <h3>a. 타입/요청 규약</h3>
        
        <pre><code>{`export interface Pagination {
  pageNo: number
  pageSize: number
  sortField?: string
  sortOrder?: 'ascend' | 'descend' | ''
}`}</code></pre>
        
        <p>API에는 오직 <code>pageNo/pageSize/sortField/sortOrder</code>만 전송하고, UI 전용 필드는 <code>TablePagination</code>에서만 관리하도록 분리했어요.</p>
        
        <h3>b. 공통 composable - useTable</h3>
        
        <pre><code>{`export const useTable = <TQuery extends Pagination, TRow>(
  apiList: (q: Pagination, signal?: AbortSignal) => Promise<{ items: TRow[]; total: number }>
) => {
  // controller.abort()로 진행 중 요청 중단
  // 뒤늦은 응답이 화면을 덮는 레이스 버그 차단
}`}</code></pre>
        
        <ul>
          <li>중복 요청을 <code>AbortController</code>로 차단</li>
          <li>fetch 시점은 onMounted에서만 명시적으로 호출</li>
          <li><code>lastKey</code>로 중복 쿼리 방지</li>
        </ul>
        
        <p>이 구조로 중복 로딩과 깜빡임이 거의 사라졌어요.</p>
        
        <h3>c. 공통 UI - &lt;AppTable /&gt;</h3>
        
        <p>양방향 바인딩을 완전히 제거하고, 모든 상태를 부모가 직접 제어하도록 만들었어요.</p>
        
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
        
        <p><code>applyPg()</code> 같은 로컬 핸들러에서만 fetch를 트리거하도록 해서 <strong>명시적 제어 흐름</strong>을 유지했어요.</p>
        
        <p>이 방식으로 새로고침, 공유, 뒤로가기 시에도 동일한 검색 조건을 복원할 수 있었습니다.</p>
        
        <h2>결과</h2>
        
        <p>테이블 관련 중복 코드와 신규 페이지 구축 시간을 감소시키고 SSR/CSR 혼합에서도 안정적 데이터 일관성 확보했어요. 또한 빈값 덮어쓰기 및 상태 꼬임 완전 제거할 수 있었습니다.</p>
        
        <h2>배운 점</h2>
        
        <p>단순히 <strong>테이블을 재사용한다</strong> 정도로 그치는 것이 아니라, <strong>데이터 흐름 전체를 통제하는 구조로 바꾸는 게 핵심</strong>이었어요.</p>
        
        <p>vue에서 <code>watch</code> 없이 명시적 호출만으로도 충분히 예측 가능한 상태 제어가 가능하다는 걸 확신했습니다.</p>
      </Content>
    );
  }

  return (
    <Content>
      <h1>Common Table Component Structuring Experience</h1>
      
      <h2>Background</h2>
      
      <p>Due to the nature of our solution, almost every screen displays data in table format.</p>
      
      <p>However, as <strong>pagination, sorting, column definitions, and API call logic</strong> were repeated on each page, similar but slightly different code accumulated, creating problems.</p>
      
      <ul>
        <li>Duplicate table logic on each page → Increased maintenance burden</li>
        <li><strong>Default value overwriting / state inconsistency</strong> when initializing <code>searchOption</code></li>
        <li>Server request specs and UI-only fields mixed → <strong>Type instability, unnecessary transmission</strong></li>
        <li>Inconsistent loading UX and flickering in large responses</li>
      </ul>
      
      <p>The goal was to create <strong>a table structure that can be defined once and reused anywhere</strong>. In summary, three key objectives:</p>
      
      <ul>
        <li>Integrate with a universal composable (<code>useTable</code>)</li>
        <li>Minimize request specifications</li>
        <li>URL-based state synchronization + consistent UX</li>
      </ul>
      
      <h2>Process and Problem Exploration</h2>
      
      <p>I integrated the pattern of repeated code across tables into a single <code>useTable</code> composable.</p>
      
      <ArticleImage>
        <ImageWithFallback 
          src="https://images.unsplash.com/photo-1701099153647-bf447f0a855a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwdGFibGUlMjBkYXNoYm9hcmR8ZW58MXx8fHwxNzYxMTM0ODgxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" 
          alt="Data table structure" 
        />
        
        <ImageCaption>Table component structure improvement process</ImageCaption>
      </ArticleImage>
      
      <p>The key was <strong>fixed explicit execution order (onMounted)</strong> and <strong>state control without watch</strong>.</p>
      
      <blockquote>
        <p><strong>Fixed Order Flow</strong></p>
        <ol>
          <li>URL → State injection</li>
          <li>URL normalization (optional)</li>
          <li>Execute first fetch</li>
        </ol>
      </blockquote>
      
      <h2>Implementation</h2>
      
      <ArticleImage>
        <ImageWithFallback 
          src="https://images.unsplash.com/photo-1566966215403-93b38ff16b7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2RlJTIwc3RydWN0dXJlJTIwYXJjaGl0ZWN0dXJlfGVufDF8fHx8MTc2MTEzNDg4MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" 
          alt="Code structure" 
        />
        <ImageCaption>Reusable component architecture</ImageCaption>
      </ArticleImage>
      
      <h3>a. Type/Request Contract</h3>
      
      <pre><code>{`export interface Pagination {
  pageNo: number
  pageSize: number
  sortField?: string
  sortOrder?: 'ascend' | 'descend' | ''
}`}</code></pre>
      
      <p>Only <code>pageNo/pageSize/sortField/sortOrder</code> are sent to the API, while UI-only fields are managed separately in <code>TablePagination</code>.</p>
      
      <h3>b. Common Composable - useTable</h3>
      
      <pre><code>{`export const useTable = <TQuery extends Pagination, TRow>(
  apiList: (q: Pagination, signal?: AbortSignal) => Promise<{ items: TRow[]; total: number }>
) => {
  // Cancel in-progress requests with controller.abort()
  // Block race bugs where delayed responses overwrite the screen
}`}</code></pre>
      
      <ul>
        <li>Block duplicate requests with <code>AbortController</code></li>
        <li>Fetch timing is explicitly called only in onMounted</li>
        <li>Prevent duplicate queries with <code>lastKey</code></li>
      </ul>
      
      <p>With this structure, duplicate loading and flickering almost disappeared.</p>
      
      <h3>c. Common UI - &lt;AppTable /&gt;</h3>
      
      <p>Completely removed two-way binding, making the parent directly control all state.</p>
      
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
      
      <p>Maintained <strong>explicit control flow</strong> by triggering fetch only from local handlers like <code>applyPg()</code>.</p>
      
      <p>With this approach, the same search conditions could be restored even after refresh, sharing, or going back.</p>
      
      <h2>Results</h2>
      
      <p>Reduced table-related duplicate code and new page construction time, and secured stable data consistency even in SSR/CSR mix. Also completely eliminated blank value overwriting and state entanglement.</p>
      
      <h2>Key Takeaways</h2>
      
      <p>It wasn't just about <strong>reusing tables</strong>, but <strong>changing the structure to control the entire data flow was the key</strong>.</p>
      
      <p>I became convinced that predictable state control is possible in Vue with just explicit calls, without <code>watch</code>.</p>
    </Content>
  );
};
