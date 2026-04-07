import styled from 'styled-components';

const Content = styled.div``;

interface PostProps {
  language: 'ko' | 'en';
}

export const ViewStatePost = ({ language }: PostProps) => {
  if (language === 'ko') {
    return (
      <Content>
        <h1>에러/로딩/빈 상태 UI의 전역 표준화</h1>
        
        <p><strong>스택:</strong> Nuxt 3, Vue 3, TypeScript, Ant Design Vue</p>
        
        <p><strong>원칙:</strong> 전역 컴포넌트 + 경량 composable + 명시적 함수 호출(arrow only) + onMounted 초기 순서 고정</p>
        
        <h2>원인</h2>
        
        <p>각 화면에서 로딩·에러·빈 상태를 제각각 구현하면서 UX는 들쭉날쭉하고, 코드 복붙이 늘어났어요.</p>
        
        <p>특히 에러 핸들링 구조가 불균형해 운영 단계에서 혼선이 컸습니다.</p>
        
        <ul>
          <li>페이지/테이블/카드마다 <strong>로딩/에러/빈 상태 UI</strong>가 제각각 → UX 불일관, 중복 코드 증가</li>
          <li>컴포넌트마다 <code>try/catch</code>와 스피너/경고문 복붙 → <strong>수정 비용↑</strong></li>
          <li>일부 화면은 빈 상태에서 <strong>다음 액션(추가/불러오기/필터 해제)</strong> 가이드 부재 → 전환율 저하</li>
          <li>에러 메시지 문구/에러코드 처리/재시도 버튼 정책이 페이지마다 달라 <strong>운영 혼선</strong></li>
        </ul>
        
        <p>이로인해 어디서나 같은 경험을 보장하는 <strong>전역 상태 뷰 표준</strong>과 <strong>경량 API</strong> 확립을 하고자 했어요.</p>
        
        <h2>과정과 문제 탐색</h2>
        
        <p>데이터 상태 관리와 UI 표현을 분리하고, 로딩→호출→표시 순서를 <code>onMounted</code>에서 명시적으로 고정했습니다. watch 의존은 제거하고, 모든 상태 전환을 명시적 함수로 제어했어요</p>
        
        <ul>
          <li>화면별로 섞여 있던 상태 분기를 <strong>표준 상태 모델</strong>로 통합</li>
          <li>상태 렌더는 전역 컴포넌트로, <strong>데이터 로딩 흐름</strong>은 composable로 분리</li>
          <li>onMounted에서 <strong>초기 순서(설정→호출→표시)</strong>를 고정하고, 상태 전환은 <strong>명시적 함수</strong>로만</li>
        </ul>
        
        <h2>해결 방안</h2>
        
        <h3>a. 상태 모델 표준화</h3>
        
        <p>페이지마다 다른 로딩·에러·빈 분기를 통일하기 위해 <code>ViewPhase</code>라는 단일 상태 흐름을 정의했어요.</p>
        
        <pre><code>{`// types/view-state.ts
export type ViewPhase = 'idle' | 'loading' | 'success' | 'empty' | 'error'

export interface ViewState<T> {
  phase: ViewPhase
  data: T | null
  error: { code?: string; message: string } | null
}`}</code></pre>
        
        <h3>b. 공통 composable</h3>
        
        <p>상태 변경 로직을 composable 하나로 통합하고, 명시적 호출만 허용 후 내부에서 상태 객체를 완전히 교체하도록 했어요.</p>
        
        <pre><code>{`// composables/useViewState.ts
import { ref } from 'vue'

export const useViewState = <T>() => {
  const state = ref<ViewState<T>>({ phase: 'idle', data: null, error: null })

  const setLoading = () => { state.value = { phase: 'loading', data: null, error: null } }
  const setSuccess = (data: T) => { state.value = { phase: 'success', data, error: null } }
  const setEmpty = () => { state.value = { phase: 'empty', data: null, error: null } }
  const setError = (message: string, code?: string) => {
    state.value = { phase: 'error', data: null, error: { message, code } }
  }

  return { state, setLoading, setSuccess, setEmpty, setError }
}`}</code></pre>
        
        <p><code>state.phase</code>를 기준으로 뷰를 렌더링하고, <code>setLoading(),setSuccess(),setError()</code> 등으로만 상태를 바꾸게 됩니다. <code>watch</code>가 사라지면서 코드 가독성과 제어력이 좋아졌어요.</p>
        
        <h3>c. 전역 상태 컴포넌트 3종</h3>
        
        <p>페이지별로 제각각 쓰이던 로딩/에러/빈 UI를 전역화하여 <strong>사용자가 어디서든 같은 피드백을 받도록</strong> 정리했습니다.</p>
        
        <h4>(1) 스켈레톤(로딩)</h4>
        
        <p>단순 스피너 대신 Ant Design의 Skeleton을 래핑했습니다. 화면 크기나 스타일에 맞춰 rows만 다르게 넘기면 될 수 있도록 하였어요</p>
        
        <pre><code>{`<!-- components/AppSkeleton.vue -->
<template>
  <a-skeleton :loading="true" active :paragraph="{ rows: rows }" />
</template>
<script setup lang="ts">
const props = defineProps<{ rows?: number }>()
</script>`}</code></pre>
        
        <h4>(2) 에러 패널(재시도 포함)</h4>
        
        <p>재시도 버튼과 에러 문구 구조를 통일했습니다. (i18n사용)</p>
        
        <pre><code>{`<!-- components/AppError.vue -->
<template>
  <a-result status="error" :title="title" :sub-title="subtitle">
    <template #extra>
      <a-button type="primary" @click="onRetry">재시도</a-button>
    </template>
  </a-result>
</template>
<script setup lang="ts">
const props = defineProps<{ title?: string; subtitle?: string; onRetry: () => void }>()
const onRetry = () => props.onRetry()
</script>`}</code></pre>
        
        <h4>(3) 빈 상태(다음 액션 제안)</h4>
        
        <p>단순 No data UI로 끝내지 않고, 다음 액션(생성·필터 해제 등)을 바로 안내하도록 설계했어요</p>
        
        <pre><code>{`<!-- components/AppEmpty.vue -->
<template>
  <a-result status="info" :title="title" :sub-title="subtitle">
    <template #extra>
      <slot name="actions">
        <a-button type="primary" @click="onPrimary">아이템 추가</a-button>
      </slot>
    </template>
  </a-result>
</template>
<script setup lang="ts">
const props = defineProps<{ title?: string; subtitle?: string; onPrimary?: () => void }>()
const onPrimary = () => props.onPrimary?.()
</script>`}</code></pre>
        
        <h4>(4) 페이지 패턴 (onMounted로 순서 고정)</h4>
        
        <p>각 상태별로 UI가 분리되어 있지만, <strong>로딩 → 데이터 확인 → 성공/빈/에러 분기</strong>의 패턴이 완전히 고정된 구조로 수정하였어요</p>
        
        <pre><code>{`<!-- pages/Logs.vue (요지) -->
<script setup lang="ts">
import { useViewState } from '@/composables/useViewState'
import type { Pagination } from '@/types'
import { onMounted } from 'vue'

type Row = { id: number; message: string }
const { state, setLoading, setSuccess, setEmpty, setError } = useViewState<{ items: Row[]; total: number }>()

const fetchLogs = async (q: Pagination, signal?: AbortSignal) =>
  $fetch('/api/logs', { method: 'POST', body: q, signal })

const load = async () => {
  setLoading()
  try {
    const res = await fetchLogs({ pageNo: 1, pageSize: 20 })
    if (!res.items?.length) return setEmpty()
    setSuccess(res)
  } catch (e: any) {
    setError(e?.data?.message || e?.message || '알 수 없는 오류', e?.data?.code)
  }
}

onMounted(async () => { await load() })
</script>

<template>
  <AppSkeleton v-if="state.phase === 'loading'" :rows="6" />
  <AppEmpty
    v-else-if="state.phase === 'empty'"
    title="데이터가 없어요"
    subtitle="필터를 변경하거나 새로 생성해보세요."
    :onPrimary="() => $router.push('/logs/create')"
  />
  <AppError
    v-else-if="state.phase === 'error'"
    :title="state.error?.message || '오류가 발생했습니다'"
    :subtitle="state.error?.code"
    :onRetry="load"
  />
  <div v-else>
    <!-- 정상 컨텐츠 -->
    <LogTable :rows="state.data!.items" />
  </div>
</template>`}</code></pre>
        
        <h3>d. 테이블/카드/모달 어디서나 동일 패턴</h3>
        
        <p><strong>결과적으로</strong> 상태 렌더링이 완전히 일관되기 시작했습니다.</p>
        
        <ul>
          <li><strong>테이블</strong>: 데이터 없음 → <code>&lt;AppEmpty&gt;</code>로 "필터 초기화"/"새로 만들기" 제안</li>
          <li><strong>카드 그리드</strong>: API 실패 → <code>&lt;AppError onRetry=…&gt;</code>로 즉시 재시도</li>
          <li><strong>모달</strong>: 제출 중 → <code>&lt;AppSkeleton rows=2&gt;</code>로 피드백</li>
        </ul>
        
        <p>모든 UI 단위가 동일한 로직 패턴을 따르기 때문에 유지보수 시 상태 흐름을 따로 고민할 일이 사라지게 되었어요.</p>
        
        <h2>결과</h2>
        
        <p>중복 코드를 대폭 감소하고 UX 일관성 확보와 전환율 개선으로 운영 효율이 올라갔다고 판단하였습니다.</p>
        
        <h2>배운 점</h2>
        
        <p>에러 문구·재시도·가이드 액션을 <strong>정책으로 표준화</strong>하면서, 기능보다 먼저 <strong>UX 품질을 높이는 구조적 개선</strong>의 중요성을 다시 느꼈어요. 이 패턴 이후로 새 페이지를 만들 때마다 <strong>상태 설계</strong>부터 생각하게 되는 계기가 되었습니다.</p>
      </Content>
    );
  }

  return (
    <Content>
      <h1>Global Standardization of Error/Loading/Empty State UI</h1>
      
      <p><strong>Stack:</strong> Nuxt 3, Vue 3, TypeScript, Ant Design Vue</p>
      
      <p><strong>Principles:</strong> Global components + lightweight composable + explicit function calls (arrow only) + fixed onMounted initial order</p>
      
      <h2>Background</h2>
      
      <p>As each screen implemented loading, error, and empty states inconsistently, UX became uneven and code duplication increased.</p>
      
      <p>Especially, the imbalanced error handling structure caused confusion at the operational stage.</p>
      
      <ul>
        <li><strong>Loading/error/empty state UI</strong> inconsistent across pages/tables/cards → Inconsistent UX, increased duplicate code</li>
        <li><code>try/catch</code> and spinner/warning duplication in each component → <strong>High modification cost↑</strong></li>
        <li>Some screens lacked <strong>next action guides (add/reload/clear filter)</strong> in empty state → Lower conversion rate</li>
        <li>Error message wording/error code handling/retry button policies varied by page → <strong>Operational confusion</strong></li>
      </ul>
      
      <p>This led to the need to establish <strong>global state view standards</strong> and <strong>lightweight APIs</strong> that ensure the same experience everywhere.</p>
      
      <h2>Process and Problem Exploration</h2>
      
      <p>We separated data state management and UI representation, explicitly fixing the loading→call→display order in <code>onMounted</code>. We removed watch dependencies and controlled all state transitions with explicit functions</p>
      
      <ul>
        <li>Integrated state branches scattered across screens into a <strong>standard state model</strong></li>
        <li>Separated state rendering into global components and <strong>data loading flow</strong> into composables</li>
        <li>Fixed <strong>initial order (setup→call→display)</strong> in onMounted, state transitions only through <strong>explicit functions</strong></li>
      </ul>
      
      <h2>Solution</h2>
      
      <h3>a. State Model Standardization</h3>
      
      <p>To unify different loading, error, and empty branches across pages, we defined a single state flow called <code>ViewPhase</code>.</p>
      
      <pre><code>{`// types/view-state.ts
export type ViewPhase = 'idle' | 'loading' | 'success' | 'empty' | 'error'

export interface ViewState<T> {
  phase: ViewPhase
  data: T | null
  error: { code?: string; message: string } | null
}`}</code></pre>
      
      <h3>b. Common Composable</h3>
      
      <p>We integrated state change logic into one composable, allowing only explicit calls and completely replacing the state object internally.</p>
      
      <pre><code>{`// composables/useViewState.ts
import { ref } from 'vue'

export const useViewState = <T>() => {
  const state = ref<ViewState<T>>({ phase: 'idle', data: null, error: null })

  const setLoading = () => { state.value = { phase: 'loading', data: null, error: null } }
  const setSuccess = (data: T) => { state.value = { phase: 'success', data, error: null } }
  const setEmpty = () => { state.value = { phase: 'empty', data: null, error: null } }
  const setError = (message: string, code?: string) => {
    state.value = { phase: 'error', data: null, error: { message, code } }
  }

  return { state, setLoading, setSuccess, setEmpty, setError }
}`}</code></pre>
      
      <p>Views are rendered based on <code>state.phase</code>, and state is changed only through <code>setLoading(),setSuccess(),setError()</code>. With <code>watch</code> removed, code readability and control improved.</p>
      
      <h3>c. Three Global State Components</h3>
      
      <p>We globalized loading/error/empty UI that was used inconsistently across pages so that <strong>users receive the same feedback everywhere</strong>.</p>
      
      <h4>(1) Skeleton (Loading)</h4>
      
      <p>We wrapped Ant Design's Skeleton instead of a simple spinner. You can just pass different rows according to screen size or style</p>
      
      <pre><code>{`<!-- components/AppSkeleton.vue -->
<template>
  <a-skeleton :loading="true" active :paragraph="{ rows: rows }" />
</template>
<script setup lang="ts">
const props = defineProps<{ rows?: number }>()
</script>`}</code></pre>
      
      <h4>(2) Error Panel (with Retry)</h4>
      
      <p>We unified the retry button and error message structure. (using i18n)</p>
      
      <pre><code>{`<!-- components/AppError.vue -->
<template>
  <a-result status="error" :title="title" :sub-title="subtitle">
    <template #extra>
      <a-button type="primary" @click="onRetry">Retry</a-button>
    </template>
  </a-result>
</template>
<script setup lang="ts">
const props = defineProps<{ title?: string; subtitle?: string; onRetry: () => void }>()
const onRetry = () => props.onRetry()
</script>`}</code></pre>
      
      <h4>(3) Empty State (Suggesting Next Action)</h4>
      
      <p>We designed it to guide next actions (create, clear filters, etc.) immediately, not just ending with No data UI</p>
      
      <pre><code>{`<!-- components/AppEmpty.vue -->
<template>
  <a-result status="info" :title="title" :sub-title="subtitle">
    <template #extra>
      <slot name="actions">
        <a-button type="primary" @click="onPrimary">Add Item</a-button>
      </slot>
    </template>
  </a-result>
</template>
<script setup lang="ts">
const props = defineProps<{ title?: string; subtitle?: string; onPrimary?: () => void }>()
const onPrimary = () => props.onPrimary?.()
</script>`}</code></pre>
      
      <h4>(4) Page Pattern (Order Fixed with onMounted)</h4>
      
      <p>Although UI is separated by each state, the pattern of <strong>loading → data check → success/empty/error branch</strong> was modified into a completely fixed structure</p>
      
      <pre><code>{`<!-- pages/Logs.vue (summary) -->
<script setup lang="ts">
import { useViewState } from '@/composables/useViewState'
import type { Pagination } from '@/types'
import { onMounted } from 'vue'

type Row = { id: number; message: string }
const { state, setLoading, setSuccess, setEmpty, setError } = useViewState<{ items: Row[]; total: number }>()

const fetchLogs = async (q: Pagination, signal?: AbortSignal) =>
  $fetch('/api/logs', { method: 'POST', body: q, signal })

const load = async () => {
  setLoading()
  try {
    const res = await fetchLogs({ pageNo: 1, pageSize: 20 })
    if (!res.items?.length) return setEmpty()
    setSuccess(res)
  } catch (e: any) {
    setError(e?.data?.message || e?.message || 'Unknown error', e?.data?.code)
  }
}

onMounted(async () => { await load() })
</script>

<template>
  <AppSkeleton v-if="state.phase === 'loading'" :rows="6" />
  <AppEmpty
    v-else-if="state.phase === 'empty'"
    title="No data"
    subtitle="Change filters or create new."
    :onPrimary="() => $router.push('/logs/create')"
  />
  <AppError
    v-else-if="state.phase === 'error'"
    :title="state.error?.message || 'An error occurred'"
    :subtitle="state.error?.code"
    :onRetry="load"
  />
  <div v-else>
    <!-- Normal content -->
    <LogTable :rows="state.data!.items" />
  </div>
</template>`}</code></pre>
      
      <h3>d. Same Pattern in Tables/Cards/Modals Everywhere</h3>
      
      <p><strong>As a result,</strong> state rendering became completely consistent.</p>
      
      <ul>
        <li><strong>Table</strong>: No data → <code>&lt;AppEmpty&gt;</code> suggests "Reset filter"/"Create new"</li>
        <li><strong>Card Grid</strong>: API failure → <code>&lt;AppError onRetry=…&gt;</code> for immediate retry</li>
        <li><strong>Modal</strong>: During submission → <code>&lt;AppSkeleton rows=2&gt;</code> for feedback</li>
      </ul>
      
      <p>Since all UI units follow the same logic pattern, there's no need to think about state flow separately during maintenance.</p>
      
      <h2>Results</h2>
      
      <p>Duplicate code was significantly reduced, UX consistency was secured, and operational efficiency improved through conversion rate improvement.</p>
      
      <h2>Key Takeaways</h2>
      
      <p>By <strong>standardizing error messages, retries, and guide actions as policies</strong>, I felt again the importance of <strong>structural improvements that enhance UX quality</strong> before features. After this pattern, I started thinking about <strong>state design</strong> first whenever creating a new page.</p>
    </Content>
  );
};
