'use client';

import styled from 'styled-components';

const Content = styled.div``;

interface PostProps {
  language: 'ko' | 'en';
}

export const ViewStatePost = ({ language }: PostProps) => {
  if (language === 'ko') {
    return (
      <Content>
        <p>Nuxt 3, Vue 3, TypeScript, Ant Design Vue 환경에서 작업했어요. 원칙은 전역 컴포넌트와 가벼운 composable을 쓰고, 상태는 명시적 함수 호출(arrow 함수만)로 바꾸고, onMounted에서 초기 순서를 고정하는 것이었어요.</p>

        <h2>원인</h2>

        <p>화면마다 로딩, 에러, 빈 상태를 따로 구현하다 보니 UX가 들쭉날쭉했고 복붙한 코드도 늘어났어요. 에러 처리 구조가 화면마다 달라서 운영할 때 혼선이 컸어요.</p>

        <ul>
          <li>페이지, 테이블, 카드마다 로딩/에러/빈 상태 UI가 달라서 UX가 맞지 않고 중복 코드가 늘었어요.</li>
          <li>컴포넌트마다 <code>try/catch</code>와 스피너, 경고문을 복붙해 둬서 하나를 고치려면 여러 파일을 손대야 했어요.</li>
          <li>일부 화면은 빈 상태에서 다음 액션(추가, 불러오기, 필터 해제) 안내가 없어서 전환율이 떨어졌어요.</li>
          <li>에러 문구, 에러코드 처리, 재시도 버튼 정책이 페이지마다 달라 운영 중에 헷갈렸어요.</li>
        </ul>

        <p>그래서 어느 화면에서든 같은 경험을 주는 전역 상태 뷰 표준과 가벼운 API를 만들기로 했어요.</p>

        <h2>과정과 문제 탐색</h2>

        <p>데이터 상태 관리와 UI 표현을 나누고, 로딩, 호출, 표시 순서를 <code>onMounted</code>에서 명시적으로 고정했어요. watch 의존은 없애고 상태 전환은 모두 명시적 함수로 처리했어요.</p>

        <ul>
          <li>화면별로 섞여 있던 상태 분기를 표준 상태 모델 하나로 합쳤어요.</li>
          <li>상태 렌더링은 전역 컴포넌트가, 데이터 로딩 흐름은 composable이 맡도록 나눴어요.</li>
          <li>onMounted에서 초기 순서(설정, 호출, 표시)를 고정하고, 상태는 명시적 함수로만 바꾸게 했어요.</li>
        </ul>

        <h2>해결 방안</h2>

        <h3>a. 상태 모델 표준화</h3>

        <p>페이지마다 다른 로딩, 에러, 빈 분기를 통일하려고 <code>ViewPhase</code>라는 단일 상태 흐름을 정의했어요.</p>

        <pre><code>{`// types/view-state.ts
export type ViewPhase = 'idle' | 'loading' | 'success' | 'empty' | 'error'

export interface ViewState<T> {
  phase: ViewPhase
  data: T | null
  error: { code?: string; message: string } | null
}`}</code></pre>

        <h3>b. 공통 composable</h3>

        <p>상태 변경 로직을 composable 하나에 모았어요. 명시적 호출만 허용하고, 호출할 때마다 내부에서 상태 객체를 통째로 교체해요.</p>

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

        <p>뷰는 <code>state.phase</code>를 보고 렌더링하고, 상태는 <code>setLoading(),setSuccess(),setError()</code> 같은 함수로만 바꿔요. <code>watch</code>가 빠지니 코드를 읽기 쉬워졌고, 상태가 언제 바뀌는지 따라가기도 편해졌어요.</p>

        <h3>c. 전역 상태 컴포넌트 3종</h3>

        <p>페이지마다 따로 쓰던 로딩/에러/빈 UI를 전역 컴포넌트로 만들어서, 사용자가 어디서든 같은 피드백을 받도록 했어요.</p>

        <h4>(1) 스켈레톤(로딩)</h4>

        <p>단순 스피너 대신 Ant Design의 Skeleton을 감쌌어요. 화면 크기나 스타일에 맞춰 rows 값만 다르게 넘기면 돼요.</p>

        <pre><code>{`<!-- components/AppSkeleton.vue -->
<template>
  <a-skeleton :loading="true" active :paragraph="{ rows: rows }" />
</template>
<script setup lang="ts">
const props = defineProps<{ rows?: number }>()
</script>`}</code></pre>

        <h4>(2) 에러 패널(재시도 포함)</h4>

        <p>재시도 버튼과 에러 문구 구조를 통일했어요. 문구는 i18n으로 관리해요.</p>

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

        <p>"No data"만 보여주고 끝내지 않고, 생성이나 필터 해제 같은 다음 액션을 바로 안내하도록 만들었어요.</p>

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

        <p>상태별 UI는 컴포넌트로 나뉘어 있지만, 페이지에서는 로딩, 데이터 확인, 성공/빈/에러 분기 순서를 늘 같은 구조로 고정했어요.</p>

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

        <p>이렇게 바꾸고 나니 상태를 렌더링하는 방식이 화면마다 같아졌어요.</p>

        <ul>
          <li>테이블: 데이터가 없으면 빈 상태 컴포넌트로 "필터 초기화"나 "새로 만들기"를 제안해요.</li>
          <li>카드 그리드: API 호출이 실패하면 에러 패널에서 바로 재시도할 수 있어요.</li>
          <li>모달: 제출 중에는 로딩 상태로 피드백을 줘요.</li>
        </ul>

        <p>모든 UI 단위가 같은 로직 패턴을 따르니까, 유지보수할 때 상태 흐름을 따로 고민할 일이 없어졌어요.</p>

        <h2>정리</h2>

        <p>중복 코드가 크게 줄었고, UX가 일관되고 전환율도 나아져서 운영 효율이 올라갔다고 판단했어요.</p>

        <p>에러 문구, 재시도, 가이드 액션을 정책으로 정해 두면서, 기능을 더하기 전에 구조부터 손보는 쪽이 UX 품질에 더 도움이 된다는 걸 다시 느꼈어요. 이 작업 이후로는 새 페이지를 만들 때 상태 설계부터 해요.</p>
      </Content>
    );
  }

  return (
    <Content>
      <p>I built this on Nuxt 3, Vue 3, TypeScript, and Ant Design Vue. The ground rules were global components, a lightweight composable, explicit function calls (arrow functions only) for state changes, and a fixed initial order in onMounted.</p>

      <h2>Background</h2>

      <p>Each screen implemented loading, error, and empty states its own way, so the UX was uneven and copy-pasted code kept piling up. Error handling in particular differed from screen to screen, which caused a lot of confusion once we were in operation.</p>

      <ul>
        <li>Pages, tables, and cards each had their own loading/error/empty UI, so the UX didn't match and duplicate code grew.</li>
        <li>Every component repeated the same <code>try/catch</code> plus a spinner or warning text, so one change meant touching many files.</li>
        <li>Some screens gave no hint about the next action (add, reload, clear filters) in the empty state, and conversion suffered.</li>
        <li>Error wording, error code handling, and retry button rules varied by page, which confused the operations side.</li>
      </ul>

      <p>So I set out to build a global standard for state views, with a small API, so users get the same experience everywhere.</p>

      <h2>Process</h2>

      <p>I separated data state management from UI rendering and fixed the order of loading, fetching, and displaying explicitly in <code>onMounted</code>. I dropped the watch dependencies and moved every state transition into explicit functions.</p>

      <ul>
        <li>Merged the state branches scattered across screens into one standard state model.</li>
        <li>Global components handle state rendering, and a composable handles the data loading flow.</li>
        <li>onMounted fixes the initial order (setup, fetch, display), and state only changes through explicit functions.</li>
      </ul>

      <h2>Solution</h2>

      <h3>a. Standard state model</h3>

      <p>To unify the different loading, error, and empty branches across pages, I defined a single state flow called <code>ViewPhase</code>.</p>

      <pre><code>{`// types/view-state.ts
export type ViewPhase = 'idle' | 'loading' | 'success' | 'empty' | 'error'

export interface ViewState<T> {
  phase: ViewPhase
  data: T | null
  error: { code?: string; message: string } | null
}`}</code></pre>

      <h3>b. Shared composable</h3>

      <p>All state change logic lives in one composable. Only explicit calls are allowed, and each call replaces the whole state object.</p>

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

      <p>Views render based on <code>state.phase</code>, and state only changes through functions like <code>setLoading(),setSuccess(),setError()</code>. With <code>watch</code> gone, the code is easier to read and it's easier to see when state changes.</p>

      <h3>c. Three global state components</h3>

      <p>I turned the loading, error, and empty UI that each page had built separately into global components, so users get the same feedback wherever they are.</p>

      <h4>(1) Skeleton (loading)</h4>

      <p>Instead of a plain spinner, I wrapped Ant Design's Skeleton. You only pass a different rows value depending on screen size or style.</p>

      <pre><code>{`<!-- components/AppSkeleton.vue -->
<template>
  <a-skeleton :loading="true" active :paragraph="{ rows: rows }" />
</template>
<script setup lang="ts">
const props = defineProps<{ rows?: number }>()
</script>`}</code></pre>

      <h4>(2) Error panel (with retry)</h4>

      <p>I unified the retry button and the error message structure. Messages go through i18n.</p>

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

      <h4>(3) Empty state (suggesting the next action)</h4>

      <p>Rather than stopping at a "No data" screen, it points the user straight to the next action, like creating an item or clearing filters.</p>

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

      <h4>(4) Page pattern (order fixed in onMounted)</h4>

      <p>The UI for each state lives in its own component, but every page follows the same fixed sequence: loading, checking the data, then branching to success, empty, or error.</p>

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

      <h3>d. Same pattern in tables, cards, and modals</h3>

      <p>After this, state rendering worked the same way on every screen.</p>

      <ul>
        <li>Table: when there's no data, the empty state component suggests "Reset filter" or "Create new".</li>
        <li>Card grid: when the API call fails, the error panel offers an immediate retry.</li>
        <li>Modal: while submitting, a loading state gives feedback.</li>
      </ul>

      <p>Since every UI unit follows the same logic pattern, I no longer have to think about state flow separately during maintenance.</p>

      <h2>Wrap-up</h2>

      <p>Duplicate code dropped a lot, and with consistent UX and better conversion, I judged that operational efficiency went up.</p>

      <p>Turning error messages, retries, and guide actions into policy reminded me that fixing the structure before adding features does a lot for UX quality. Since then, whenever I create a new page, I start with the state design.</p>
    </Content>
  );
};
