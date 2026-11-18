-- 블로그 글 18개 AI 티 정리
-- 굵은 글씨(**), 줄표, 본문 맨 앞의 중복 제목(# 제목), 공백만 있는 줄, 테이블 글의 Unsplash 사진 2장을 빼고 문장을 다듬었습니다.
-- 코드 블록과 숫자는 원문 그대로입니다.
BEGIN;

UPDATE blog_posts SET
  title_ko = $md$에러/로딩/빈 상태 UI의 전역 표준화$md$,
  title_en = $md$Global Standardization of Error/Loading/Empty State UI$md$,
  excerpt_ko = $md$모든 화면에서 로딩, 에러, 빈 상태를 같은 방식으로 보여주려고 전역 컴포넌트와 composable 패턴을 만든 과정을 정리했어요.$md$,
  excerpt_en = $md$How I built global components and a composable pattern so every screen handles loading, error, and empty states the same way.$md$,
  content_ko = $md$Nuxt 3, Vue 3, TypeScript, Ant Design Vue 환경에서 작업했어요. 원칙은 전역 컴포넌트와 가벼운 composable을 쓰고, 상태는 명시적 함수 호출(arrow 함수만)로 바꾸고, onMounted에서 초기 순서를 고정하는 것이었어요.

## 원인

화면마다 로딩, 에러, 빈 상태를 따로 구현하다 보니 UX가 들쭉날쭉했고 복붙한 코드도 늘어났어요. 에러 처리 구조가 화면마다 달라서 운영할 때 혼선이 컸어요.

- 페이지, 테이블, 카드마다 로딩/에러/빈 상태 UI가 달라서 UX가 맞지 않고 중복 코드가 늘었어요.
- 컴포넌트마다 `try/catch`와 스피너, 경고문을 복붙해 둬서 하나를 고치려면 여러 파일을 손대야 했어요.
- 일부 화면은 빈 상태에서 다음 액션(추가, 불러오기, 필터 해제) 안내가 없어서 전환율이 떨어졌어요.
- 에러 문구, 에러코드 처리, 재시도 버튼 정책이 페이지마다 달라 운영 중에 헷갈렸어요.

그래서 어느 화면에서든 같은 경험을 주는 전역 상태 뷰 표준과 가벼운 API를 만들기로 했어요.

## 과정과 문제 탐색

데이터 상태 관리와 UI 표현을 나누고, 로딩, 호출, 표시 순서를 `onMounted`에서 명시적으로 고정했어요. watch 의존은 없애고 상태 전환은 모두 명시적 함수로 처리했어요.

- 화면별로 섞여 있던 상태 분기를 표준 상태 모델 하나로 합쳤어요.
- 상태 렌더링은 전역 컴포넌트가, 데이터 로딩 흐름은 composable이 맡도록 나눴어요.
- onMounted에서 초기 순서(설정, 호출, 표시)를 고정하고, 상태는 명시적 함수로만 바꾸게 했어요.

## 해결 방안

### a. 상태 모델 표준화

페이지마다 다른 로딩, 에러, 빈 분기를 통일하려고 `ViewPhase`라는 단일 상태 흐름을 정의했어요.

```
// types/view-state.ts
export type ViewPhase = 'idle' | 'loading' | 'success' | 'empty' | 'error'

export interface ViewState<T> {
  phase: ViewPhase
  data: T | null
  error: { code?: string; message: string } | null
}
```

### b. 공통 composable

상태 변경 로직을 composable 하나에 모았어요. 명시적 호출만 허용하고, 호출할 때마다 내부에서 상태 객체를 통째로 교체해요.

```
// composables/useViewState.ts
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
}
```

뷰는 `state.phase`를 보고 렌더링하고, 상태는 `setLoading(),setSuccess(),setError()` 같은 함수로만 바꿔요. `watch`가 빠지니 코드를 읽기 쉬워졌고, 상태가 언제 바뀌는지 따라가기도 편해졌어요.

### c. 전역 상태 컴포넌트 3종

페이지마다 따로 쓰던 로딩/에러/빈 UI를 전역 컴포넌트로 만들어서, 사용자가 어디서든 같은 피드백을 받도록 했어요.

#### (1) 스켈레톤(로딩)

단순 스피너 대신 Ant Design의 Skeleton을 감쌌어요. 화면 크기나 스타일에 맞춰 rows 값만 다르게 넘기면 돼요.

```
<!-- components/AppSkeleton.vue -->
<template>
  <a-skeleton :loading="true" active :paragraph="{ rows: rows }" />
</template>
<script setup lang="ts">
const props = defineProps<{ rows?: number }>()
</script>
```

#### (2) 에러 패널(재시도 포함)

재시도 버튼과 에러 문구 구조를 통일했어요. 문구는 i18n으로 관리해요.

```
<!-- components/AppError.vue -->
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
</script>
```

#### (3) 빈 상태(다음 액션 제안)

"No data"만 보여주고 끝내지 않고, 생성이나 필터 해제 같은 다음 액션을 바로 안내하도록 만들었어요.

```
<!-- components/AppEmpty.vue -->
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
</script>
```

#### (4) 페이지 패턴 (onMounted로 순서 고정)

상태별 UI는 컴포넌트로 나뉘어 있지만, 페이지에서는 로딩, 데이터 확인, 성공/빈/에러 분기 순서를 늘 같은 구조로 고정했어요.

```
<!-- pages/Logs.vue (요지) -->
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
</template>
```

### d. 테이블/카드/모달 어디서나 동일 패턴

이렇게 바꾸고 나니 상태를 렌더링하는 방식이 화면마다 같아졌어요.

- 테이블: 데이터가 없으면 빈 상태 컴포넌트로 "필터 초기화"나 "새로 만들기"를 제안해요.
- 카드 그리드: API 호출이 실패하면 에러 패널에서 바로 재시도할 수 있어요.
- 모달: 제출 중에는 로딩 상태로 피드백을 줘요.

모든 UI 단위가 같은 로직 패턴을 따르니까, 유지보수할 때 상태 흐름을 따로 고민할 일이 없어졌어요.

## 정리

중복 코드가 크게 줄었고, UX가 일관되고 전환율도 나아져서 운영 효율이 올라갔다고 판단했어요.

에러 문구, 재시도, 가이드 액션을 정책으로 정해 두면서, 기능을 더하기 전에 구조부터 손보는 쪽이 UX 품질에 더 도움이 된다는 걸 다시 느꼈어요. 이 작업 이후로는 새 페이지를 만들 때 상태 설계부터 해요.$md$,
  content_en = $md$I built this on Nuxt 3, Vue 3, TypeScript, and Ant Design Vue. The ground rules were global components, a lightweight composable, explicit function calls (arrow functions only) for state changes, and a fixed initial order in onMounted.

## Background

Each screen implemented loading, error, and empty states its own way, so the UX was uneven and copy-pasted code kept piling up. Error handling in particular differed from screen to screen, which caused a lot of confusion once we were in operation.

- Pages, tables, and cards each had their own loading/error/empty UI, so the UX didn't match and duplicate code grew.
- Every component repeated the same `try/catch` plus a spinner or warning text, so one change meant touching many files.
- Some screens gave no hint about the next action (add, reload, clear filters) in the empty state, and conversion suffered.
- Error wording, error code handling, and retry button rules varied by page, which confused the operations side.

So I set out to build a global standard for state views, with a small API, so users get the same experience everywhere.

## Process

I separated data state management from UI rendering and fixed the order of loading, fetching, and displaying explicitly in `onMounted`. I dropped the watch dependencies and moved every state transition into explicit functions.

- Merged the state branches scattered across screens into one standard state model.
- Global components handle state rendering, and a composable handles the data loading flow.
- onMounted fixes the initial order (setup, fetch, display), and state only changes through explicit functions.

## Solution

### a. Standard state model

To unify the different loading, error, and empty branches across pages, I defined a single state flow called `ViewPhase`.

```
// types/view-state.ts
export type ViewPhase = 'idle' | 'loading' | 'success' | 'empty' | 'error'

export interface ViewState<T> {
  phase: ViewPhase
  data: T | null
  error: { code?: string; message: string } | null
}
```

### b. Shared composable

All state change logic lives in one composable. Only explicit calls are allowed, and each call replaces the whole state object.

```
// composables/useViewState.ts
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
}
```

Views render based on `state.phase`, and state only changes through functions like `setLoading(),setSuccess(),setError()`. With `watch` gone, the code is easier to read and it's easier to see when state changes.

### c. Three global state components

I turned the loading, error, and empty UI that each page had built separately into global components, so users get the same feedback wherever they are.

#### (1) Skeleton (loading)

Instead of a plain spinner, I wrapped Ant Design's Skeleton. You only pass a different rows value depending on screen size or style.

```
<!-- components/AppSkeleton.vue -->
<template>
  <a-skeleton :loading="true" active :paragraph="{ rows: rows }" />
</template>
<script setup lang="ts">
const props = defineProps<{ rows?: number }>()
</script>
```

#### (2) Error panel (with retry)

I unified the retry button and the error message structure. Messages go through i18n.

```
<!-- components/AppError.vue -->
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
</script>
```

#### (3) Empty state (suggesting the next action)

Rather than stopping at a "No data" screen, it points the user straight to the next action, like creating an item or clearing filters.

```
<!-- components/AppEmpty.vue -->
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
</script>
```

#### (4) Page pattern (order fixed in onMounted)

The UI for each state lives in its own component, but every page follows the same fixed sequence: loading, checking the data, then branching to success, empty, or error.

```
<!-- pages/Logs.vue (summary) -->
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
</template>
```

### d. Same pattern in tables, cards, and modals

After this, state rendering worked the same way on every screen.

- Table: when there's no data, the empty state component suggests "Reset filter" or "Create new".
- Card grid: when the API call fails, the error panel offers an immediate retry.
- Modal: while submitting, a loading state gives feedback.

Since every UI unit follows the same logic pattern, I no longer have to think about state flow separately during maintenance.

## Wrap-up

Duplicate code dropped a lot, and with consistent UX and better conversion, I judged that operational efficiency went up.

Turning error messages, retries, and guide actions into policy reminded me that fixing the structure before adding features does a lot for UX quality. Since then, whenever I create a new page, I start with the state design.$md$,
  updated_at = now()
WHERE id = 'view-state-standardization';

UPDATE blog_posts SET
  title_ko = $md$React 페이지 구조 리팩토링과 코드 스플리팅 적용 경험$md$,
  title_en = $md$React Page Structure Refactoring and Code Splitting Experience$md$,
  excerpt_ko = $md$페이지 파일 73개가 뒤섞여 있던 구조를 도메인 기준으로 다시 나누고, React.lazy와 Suspense로 초기 번들을 79% 줄인 과정이에요.$md$,
  excerpt_en = $md$I reorganized 73 mixed page files by domain and cut the initial bundle by 79% with React.lazy and Suspense.$md$,
  content_ko = $md$## 원인

티켓 판매 플랫폼을 개발하다 보니 어느 순간부터 프론트엔드 파일 구조가 감당이 안 되기 시작했어요.

- `src/components/pages/` 한 폴더에 어드민 페이지, 쇼핑몰 페이지, 주문 페이지가 전부 섞여 있었어요.
- 파일명만 보고는 어드민 전용인지 쇼핑몰용인지 구분할 수 없었어요.
- 빌드 결과물이 2,647 KB짜리 단일 청크 `index.js` 하나라서 초기 로딩이 느렸어요.
- 새 페이지를 추가할 때 파일을 어디에 둘지 기준이 없었어요.

해야 할 일은 두 가지였어요.

- 파일 구조를 도메인 기준으로 다시 나누기
- 코드 스플리팅으로 초기 번들 크기 줄이기

## 과정과 문제 탐색

기존 구조는 아래처럼 모든 페이지가 한 디렉토리에 나열되어 있었어요.

```
src/components/pages/
  admin-orders-new.tsx
  banner-management.tsx
  shop/shop-cart.tsx
  shop/shop-product-detail.tsx
  product-detail.tsx
  product-management.tsx
  ...
```

페이지 파일 73개가 한 폴더에 있으니 관련 파일끼리 찾기가 어려웠어요. `product-detail.tsx`가 어드민 상품 상세인지 쇼핑몰 상품 상세인지 헷갈릴 때도 있었고요.

코드 스플리팅 쪽 문제는 더 분명했어요.

```
// App.tsx - 기존 방식
import { ProductManagement } from "./components/pages/product-management";
import { Dashboard } from "./components/pages/dashboard";
import { ShopCart } from "./components/pages/shop/shop-cart";
// ... 70개 이상의 static import
```

로그인 페이지 하나만 열어도 어드민 대시보드, 상품 관리, 쇼핑몰 코드를 전부 내려받는 구조였어요.

## 해결 방안

### a. 도메인 기반 디렉토리 재편

`src/pages/` 아래에 관심사 단위로 폴더를 나눴어요.

```
src/pages/
  admin/
    dashboard/index.tsx
    product/
      index.tsx         # 상품 목록
      detail.tsx        # 상품 상세
      detail-options.tsx
      detail-seasons.tsx
      content-editor.tsx
    order/
      index.tsx
      detail.tsx
    partner/
      index.tsx
      detail.tsx
      coupon-detail.tsx
    banner/index.tsx
    channel/index.tsx
    community/
      index.tsx
      notice/
      event/
  shop/
    home/index.tsx
    product/
      detail.tsx
      category.tsx
      search.tsx
    order/index.tsx
    cart/index.tsx
    payment/
      info.tsx
      success.tsx
      callback.tsx
  auth/
    login.tsx
  field/
    ticket-scanner.tsx
```

규칙은 단순했어요.

- 어드민 페이지는 `pages/admin/기능/`
- 쇼핑몰 페이지는 `pages/shop/기능/`
- 기능 안에 파일이 여러 개면 `index.tsx`를 진입점으로

### b. React.lazy()로 코드 스플리팅 적용

static import를 모두 lazy import로 바꿨어요.

```
// App.tsx - 변경 후
const Dashboard = lazy(() => import("@/pages/admin/dashboard"));
const ProductManagement = lazy(() => import("@/pages/admin/product"));
const ShopCart = lazy(() => import("@/pages/shop/cart"));
```

그리고 라우터 전체를 `Suspense`로 감쌌어요.

```
<Suspense fallback={
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-8 w-8
      border-b-2 border-gray-900" />
  </div>
}>
  <Routes>
    {/* ... */}
  </Routes>
</Suspense>
```

### c. 절대 경로 import 통일

파일을 옮기면서 상대 경로가 `../../../lib/api`처럼 깊어졌어요. `vite.config.ts`에 alias를 설정해서 전부 `@/`로 맞췄어요.

```
// vite.config.ts
resolve: {
  alias: {
    "@": path.resolve(__dirname, "./src"),
  },
},
```

## 결과

빌드 결과가 꽤 달라졌어요.

- 초기 번들: 2,647 KB에서 561 KB로
- 청크 수: 1개에서 여러 청크로 분리
- 초기 번들 감소율: 약 79%

이제 로그인 페이지에 들어갈 때 어드민 코드를 받지 않고, 사용자가 방문하지 않는 페이지의 코드는 아예 내려받지 않아요.

새 페이지를 어디에 둘지도 분명해졌어요. 어드민 주문 관련 화면이면 `pages/admin/order/` 아래에 두면 됐어요.

## 배운 점

파일 구조 문제는 당장 기능에 영향이 없어서 미루기 쉬운데, 쌓이면 팀 전체의 속도를 늦춰요.

코드 스플리팅은 설정 한 줄로 끝나는 일이 아니었어요. import 방식 자체를 바꾸는 작업이었고, 구조가 먼저 정리되어 있지 않으면 lazy import를 어디에 적용할지도 흐려져요.

그래서 이번 작업에서는 구조 정리와 성능 개선을 함께 진행했어요.$md$,
  content_en = $md$## The Problem

While building a ticket sales platform, the frontend file structure reached a point where I couldn't keep it under control.

- Admin pages, shop pages, and order pages were all mixed in a single `src/components/pages/` directory.
- You couldn't tell admin-only components from shop components by filename alone.
- The build output was a single 2,647 KB `index.js` chunk, so the initial load was slow.
- There was no convention for where new page files should go.

I had two goals:

- Reorganize the file structure by domain
- Shrink the initial bundle with code splitting

## Investigation

The existing structure had every page listed in a single directory:

```
src/components/pages/
  admin-orders-new.tsx
  banner-management.tsx
  shop/shop-cart.tsx
  shop/shop-product-detail.tsx
  product-detail.tsx
  product-management.tsx
  ...
```

With 73 page files in one folder, finding related files was hard. Sometimes I couldn't tell whether `product-detail.tsx` was the admin product detail or the shop product detail.

The code splitting problem was even more obvious:

```
// App.tsx - before
import { ProductManagement } from "./components/pages/product-management";
import { Dashboard } from "./components/pages/dashboard";
import { ShopCart } from "./components/pages/shop/shop-cart";
// ... 70+ static imports
```

Opening just the login page downloaded all the admin dashboard, product management, and shop code.

## Solution

### a. Domain-based directory reorganization

I split folders by domain under `src/pages/`:

```
src/pages/
  admin/
    dashboard/index.tsx
    product/
      index.tsx         # Product list
      detail.tsx        # Product detail
      detail-options.tsx
      detail-seasons.tsx
      content-editor.tsx
    order/
      index.tsx
      detail.tsx
    partner/
      index.tsx
      detail.tsx
      coupon-detail.tsx
    banner/index.tsx
    channel/index.tsx
    community/
      index.tsx
      notice/
      event/
  shop/
    home/index.tsx
    product/
      detail.tsx
      category.tsx
      search.tsx
    order/index.tsx
    cart/index.tsx
    payment/
      info.tsx
      success.tsx
      callback.tsx
  auth/
    login.tsx
  field/
    ticket-scanner.tsx
```

The rules were simple:

- Admin pages go under `pages/admin/feature/`
- Shop pages go under `pages/shop/feature/`
- If a feature has multiple files, `index.tsx` is the entry point

### b. Code splitting with React.lazy()

I converted every static import to a lazy import:

```
// App.tsx - after
const Dashboard = lazy(() => import("@/pages/admin/dashboard"));
const ProductManagement = lazy(() => import("@/pages/admin/product"));
const ShopCart = lazy(() => import("@/pages/shop/cart"));
```

Then I wrapped the whole router in `Suspense`:

```
<Suspense fallback={
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-8 w-8
      border-b-2 border-gray-900" />
  </div>
}>
  <Routes>
    {/* ... */}
  </Routes>
</Suspense>
```

### c. Unified absolute path imports

Moving files made relative paths nest deeply, like `../../../lib/api`. I set an alias in `vite.config.ts` so everything uses `@/`:

```
// vite.config.ts
resolve: {
  alias: {
    "@": path.resolve(__dirname, "./src"),
  },
},
```

## Results

The build output changed quite a bit:

- Initial bundle: from 2,647 KB to 561 KB
- Chunks: from 1 to multiple separate chunks
- Initial bundle reduction: about 79%

The login page no longer pulls in any admin code, and code for pages a user never visits is never downloaded.

It's also clear where new pages belong now. An admin order screen simply goes under `pages/admin/order/`.

## Lessons Learned

File structure problems don't break features right away, so they're easy to put off. But they slow the whole team down over time.

Code splitting wasn't a one-line config change. It meant changing how imports work in the first place, and without an organized structure it's hard to even tell where lazy imports belong.

That's why this project handled the structure cleanup and the performance work together.$md$,
  updated_at = now()
WHERE id = 'react-page-refactoring';

UPDATE blog_posts SET
  title_ko = $md$전역 아이콘 시스템 구축 경험$md$,
  title_en = $md$Global Icon System Implementation Experience$md$,
  excerpt_ko = $md$수십 개 화면에 걸친 아이콘의 색상, 크기, 상태를 한곳에서 관리하려고 메타데이터 기반 전역 아이콘 시스템을 만든 경험이에요.$md$,
  excerpt_en = $md$How I built a metadata-based global icon system to keep icon colors, sizes, and states consistent across dozens of screens.$md$,
  content_ko = $md$## 원인

저희 솔루션은 수십 개 화면에서 상태, 행동, 결과를 나타내는 아이콘을 여러 가지 쓰고 있었어요. 문제는 이랬어요.

- 화면마다 아이콘 색상, 크기, 여백이 달라서 디자인 일관성이 무너졌어요.
- 인라인 스타일이나 CSS로 색을 직접 지정해서, 테마를 바꾸려면 전부 고쳐야 했어요.
- 비활성, 경고 같은 상태별 색상 규칙이 정해져 있지 않았어요.
- 아이콘 파일 관리도 불규칙했어요(이름 중복, 경로 혼선).

아이콘 하나 바꾸려면 전체 페이지를 뒤져야 하는 구조였던 거죠.

그래서 `useIcon` composable과 `AppIcon` 전역 컴포넌트를 만들어서, 이름으로 의미만 선언하면 색상, 크기, 간격이 자동으로 적용되게 정리했어요.

## 과정과 문제 탐색

처음엔 Ant Design Vue 기반의 `Icon` 컴포넌트를 그대로 썼는데, 상태에 따라 색이 바뀌거나 테마가 어두워질 때 색 대비가 맞지 않는 문제가 반복됐어요.

스타일을 한곳에서 통제할 수 있는 단일 진입점이 필요했고, 모든 아이콘 메타데이터를 `iconPack`으로 관리하기로 했어요.

## 구현

### a. 아이콘 메타데이터 (useIcon.ts)

```
export const iconPack = {
  SUCCESS: { iconName: 'check-circle', iconColor: '#27ae60', size: '16', marginRight: '4px' },
  ERROR:   { iconName: 'alert-triangle', iconColor: '#e74c3c', size: '16', marginRight: '4px' },
  INFO:    { iconName: 'info-circle', iconColor: '#2980b9', size: '16', marginRight: '4px' },
}

export const getIconColor = (name: string) => iconPack[name]?.iconColor || '#333'
```

아이콘마다 색상, 크기, 여백을 정의해 두고 `name`으로 꺼내 쓰게 만들었어요. 디자인 토큰처럼, 같은 이름이면 어느 화면에서나 같은 모습으로 보여요.

### b. 전역 아이콘 컴포넌트 (AppIcon)

```
<template>
  <span v-if="iconPack[props.name]" :style="`margin-right:${computedMargin}!important;`">
    <Icon
      :name="`my-icon:${iconPack[props.name].iconName}`"
      :size="computedSize"
      :style="`color:${computedColor}; vertical-align:${props.verticalAlign};`"
    />
  </span>
</template>

<script setup lang="ts">
import { getIconColor, iconPack } from '~/composables/common/useIcon'

const props = defineProps({
  name: { type: String, required: true },
  color: String,
  size: String,
  verticalAlign: { type: String, default: 'middle' },
  marginRight: String,
  disabledType: { type: Boolean, default: false },
})

// 1️⃣ 상태에 따른 색상
const computedColor = computed(() =>
  props.disabledType ? '#cdcdcd' : props.color ?? getIconColor(props.name)
)

// 2️⃣ 사이즈·여백 계산
const computedSize = computed(() => props.size ?? iconPack[props.name]?.size ?? '16')
const computedMargin = computed(() => props.marginRight ?? iconPack[props.name]?.marginRight ?? '0px')
</script>
```

동작 방식은 이래요.

- 외부에서 props를 넘기면 그 값을 먼저 쓰고, 없으면 pack 기본값을 써요.
- `disabledType`이면 자동으로 회색 처리돼요.
- 인라인 스타일은 계산된 값으로 한데 모았어요.

### c. 아이콘 관리 가이드라인

- SVG를 저장할 때 `currentColor`를 유지해요(색상은 CSS로 제어).
- 경로는 `assets/my-icons`로 고정해요.
- 이름은 소문자로 통일해요.
- 시각 스타일은 HugeIcons 기준으로 맞춰요.

참고: [https://icones.js.org/collection/hugeicons](https://icones.js.org/collection/hugeicons)

## 결과

- 상태별 색상 규칙과 스타일이 통일됐어요.
- 테마를 바꿀 때 색상 값만 바꾸면 전체에 반영돼요.
- AppIcon 한 줄이면 색상, 크기, 여백이 따라와서 개발이 빨라졌어요.
- 인라인 색상/크기 지정이 사라져서 코드가 깔끔해졌어요.

## 배운 점

아이콘의 의미와 스타일을 데이터로 정의해 두면, 화면 쪽 코드는 이름만 알면 된다는 걸 배웠어요. 이 구조 덕분에 디자인 시스템의 일관성과 유지보수성을 함께 챙길 수 있었어요.$md$,
  content_en = $md$## Problem

Our product used a wide range of state, action, and result icons across dozens of screens. Here's what went wrong:

- Icon colors, sizes, and margins differed from screen to screen, so the design stopped feeling consistent.
- Colors were set directly with inline styles or CSS, so changing the theme meant editing everything.
- There were no shared color rules for states like disabled or warning.
- Icon files were managed loosely, with duplicate names and confusing paths.

Changing a single icon meant digging through every page.

So I built a `useIcon` composable and an `AppIcon` global component. You declare an icon's meaning by name, and color, size, and spacing are applied automatically.

## Process

At first I used the `Icon` component (based on Ant Design Vue) as is. I kept hitting the same issues: colors changing with state, and contrast breaking when the theme went dark.

I needed a single entry point for icon styles, so I decided to keep all icon metadata in `iconPack`.

## Implementation

### a. Icon metadata (useIcon.ts)

```
export const iconPack = {
  SUCCESS: { iconName: 'check-circle', iconColor: '#27ae60', size: '16', marginRight: '4px' },
  ERROR:   { iconName: 'alert-triangle', iconColor: '#e74c3c', size: '16', marginRight: '4px' },
  INFO:    { iconName: 'info-circle', iconColor: '#2980b9', size: '16', marginRight: '4px' },
}

export const getIconColor = (name: string) => iconPack[name]?.iconColor || '#333'
```

Each icon has its color, size, and margin defined up front, and you access it by `name`. Like design tokens, the same name looks the same on every screen.

### b. Global icon component (AppIcon)

```
<template>
  <span v-if="iconPack[props.name]" :style="`margin-right:${computedMargin}!important;`">
    <Icon
      :name="`my-icon:${iconPack[props.name].iconName}`"
      :size="computedSize"
      :style="`color:${computedColor}; vertical-align:${props.verticalAlign};`"
    />
  </span>
</template>

<script setup lang="ts">
import { getIconColor, iconPack } from '~/composables/common/useIcon'

const props = defineProps({
  name: { type: String, required: true },
  color: String,
  size: String,
  verticalAlign: { type: String, default: 'middle' },
  marginRight: String,
  disabledType: { type: Boolean, default: false },
})

// 1️⃣ Color based on state
const computedColor = computed(() =>
  props.disabledType ? '#cdcdcd' : props.color ?? getIconColor(props.name)
)

// 2️⃣ Size and margin calculation
const computedSize = computed(() => props.size ?? iconPack[props.name]?.size ?? '16')
const computedMargin = computed(() => props.marginRight ?? iconPack[props.name]?.marginRight ?? '0px')
</script>
```

How it works:

- Props passed from outside take priority; otherwise the pack defaults apply.
- With `disabledType`, the icon turns gray automatically.
- Inline styles all come from computed values.

### c. Icon management guidelines

- Keep `currentColor` when saving SVGs (color is controlled by CSS).
- Store files under `assets/my-icons`.
- Use lowercase names.
- Follow the HugeIcons style for visual consistency.

Reference: [https://icones.js.org/collection/hugeicons](https://icones.js.org/collection/hugeicons)

## Results

- State color rules and styles are unified.
- Changing a theme color updates every icon.
- One line of AppIcon brings color, size, and margin with it, which speeds up development.
- With inline color and size gone, the code is cleaner.

## Takeaways

Once an icon's meaning and style are defined as data, screen code only needs to know the name. That structure helped with both design system consistency and maintainability.$md$,
  updated_at = now()
WHERE id = 'icon-system-implementation';

UPDATE blog_posts SET
  title_ko = $md$인쇄할 때 헤더가 사라지지 않던 이유, @media print와 CSS 레이어의 충돌$md$,
  title_en = $md$Why the Print Header Wouldn't Hide: @media print vs CSS Layers$md$,
  excerpt_ko = $md$@layer 안에 쓴 @media print 규칙이 왜 무시되는지, CSS 캐스케이드 레이어의 우선순위 구조를 따라가며 정리했어요.$md$,
  excerpt_en = $md$Why @media print rules inside @layer get ignored, and how CSS cascade layer priority actually works.$md$,
  content_ko = $md$## 발단

인쇄 기능을 만들면서 헤더를 숨기는 코드를 작성했어요.

```
@layer base {
  @media print {
    .header {
      display: none;
    }
  }
}
```

CSS는 맞게 썼는데, 인쇄 미리보기를 열어 보면 헤더가 그대로 출력됐어요. `display: none`이 적용되지 않았던 거예요.

## 원인

CSS `@layer`는 캐스케이드 레이어를 만들어서 스타일 우선순위를 명시적으로 관리하게 해 줘요. 여기에는 꼭 알아야 할 규칙이 하나 있어요. 레이어 안의 스타일은 레이어 밖의 스타일보다 항상 우선순위가 낮아요.

명시도(specificity)가 아무리 높아도 마찬가지예요. 레이어 밖에 작성된 스타일이 레이어 안의 스타일을 덮어써요.

```
/* @layer 밖: 항상 우선순위 높음 */
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
}
```

프로젝트에서 헤더의 기본 스타일이 `@layer` 밖에 있었기 때문에, `@layer base` 안의 `@media print` 규칙은 아무리 정확해도 무시됐어요.

## 과정과 탐색

처음에는 선택자 문제인 줄 알았어요. `.header` 말고 다른 선택자를 써야 하는지 한참 찾아봤어요.

다음으로 `@media print` 안에서 `!important`를 쓰면 될 거라고 생각했어요. 레이어 안의 `!important`는 레이어 밖의 `!important`보다 우선순위가 높아지는 역전 규칙이 있거든요. `!important`가 붙으면 레이어 우선순위가 뒤집혀요.

```
@layer base {
  @media print {
    .header {
      display: none !important; /* 이건 동작하지만 권장하지 않음 */
    }
  }
}
```

동작은 했지만 `!important`를 남발하고 싶지는 않았어요. 원인을 제대로 이해한 다음 다른 방법을 찾았어요.

## 해결 방안

가장 깔끔한 방법은 `@media print` 스타일을 `@layer` 밖으로 꺼내는 거예요.

```
/* @layer 밖에서 직접 선언 */
@media print {
  .header {
    display: none;
  }
}
```

인쇄 스타일용 레이어를 따로 만들어 가장 마지막에 선언하는 방법도 있어요.

```
/* 레이어 순서 선언: 나중에 선언된 레이어가 우선순위 높음 */
@layer base, components, print;

@layer print {
  @media print {
    .header {
      display: none;
    }
  }
}
```

레이어는 선언 순서가 중요해요. 나중에 선언된 레이어가 우선순위가 높아요. `print` 레이어를 마지막에 두면 인쇄 스타일이 다른 레이어를 덮어쓸 수 있어요.

## 결과

`@media print` 스타일을 `@layer` 밖으로 꺼내고 나서 인쇄 미리보기에서 헤더가 제대로 사라졌어요.

## 배운 점

`@layer`를 쓰면서 레이어 밖 스타일이 항상 레이어 안 스타일을 이긴다는 규칙을 모르면, 이번처럼 예상하지 못한 결과를 만나게 돼요.

인쇄 스타일처럼 특정 상황에서만 적용되는 스타일은 레이어 구조를 보고 위치를 정해야 해요. 레이어 밖에 직접 선언하거나, 인쇄 전용 레이어를 선언 순서 마지막에 두는 방식이 안전해요.$md$,
  content_en = $md$## The Problem

While building a print feature, I wrote code to hide the header:

```
@layer base {
  @media print {
    .header {
      display: none;
    }
  }
}
```

The CSS looked right, but print preview still showed the header. The `display: none` wasn't being applied.

## The Cause

CSS `@layer` creates cascade layers so you can manage style priority explicitly. There's one rule you have to know: styles inside a layer always have lower priority than styles outside any layer.

Specificity doesn't change that. Styles written outside layers override styles inside them.

```
/* Outside @layer: always higher priority */
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
}
```

The header's base styles were written outside `@layer`, so the `@media print` rules inside `@layer base` were ignored no matter how correct they were.

## Investigation

At first I thought it was a selector issue and spent a while checking whether I needed something other than `.header`.

Then I figured `!important` inside `@media print` would do it. There's a reversal rule here: `!important` inside a layer beats `!important` outside it. For `!important` declarations, layer priority flips.

```
@layer base {
  @media print {
    .header {
      display: none !important; /* Works, but not recommended */
    }
  }
}
```

It worked, but I didn't want to scatter `!important` around. I went back, understood the actual cause, and looked for another way.

## Solution

The cleanest fix is to move the `@media print` styles outside of `@layer`:

```
/* Declared directly outside @layer */
@media print {
  .header {
    display: none;
  }
}
```

Another option is a dedicated print layer declared last in the layer order:

```
/* Layer order declaration: later layers have higher priority */
@layer base, components, print;

@layer print {
  @media print {
    .header {
      display: none;
    }
  }
}
```

Declaration order matters for layers. Layers declared later have higher priority, so putting the `print` layer last lets print styles override the others.

## Result

After moving the `@media print` styles outside of `@layer`, the header disappeared in print preview as expected.

## Lessons Learned

If you use `@layer` without knowing that styles outside layers always beat styles inside them, you run into surprises like this one.

Styles that only apply in a specific context, like print styles, need to be placed with the layer structure in mind. Declaring them directly outside any layer, or putting a dedicated print layer last in the declaration order, is the safe approach.$md$,
  updated_at = now()
WHERE id = 'css-print-layer-conflict';

UPDATE blog_posts SET
  title_ko = $md$디자이너에서 개발자로, UI를 보는 시선이 달라진 순간$md$,
  title_en = $md$How Moving from Design to Development Changed the Way I See UI$md$,
  excerpt_ko = $md$디자인을 하던 시절의 감각과 개발자로서의 구조적 사고가 만나면서 UI를 만드는 방식이 어떻게 달라졌는지 적었어요.$md$,
  excerpt_en = $md$How my way of building UI changed when design intuition from my designer days met a developer's structural thinking.$md$,
  content_ko = $md$## 배경

저는 디자이너로 일을 시작했어요. Figma에서 화면을 그리고, 컬러 팔레트를 만들고, 타이포그래피 위계를 잡는 게 일이었죠. 그러다 프론트엔드 개발을 시작하면서 UI를 보는 시선이 크게 바뀌었어요.

디자이너일 때는 '이 화면이 얼마나 좋아 보이는가'가 기준이었는데, 개발자가 되고 나서는 '이 화면이 얼마나 잘 작동하는가'가 기준이 됐어요. 둘 다 필요하지만 무게중심이 옮겨가니 만드는 방식도 달라졌어요.

## 디자이너 시절에는 몰랐던 것들

디자인할 때는 상태(state)라는 개념이 없었어요. '완성된 화면'만 그렸거든요. 버튼은 늘 활성 상태, 리스트에는 늘 데이터가 있고, 에러는 별도 시안으로 따로 만들었어요. 그런데 개발을 시작하니 로딩 중일 때, 데이터가 없을 때, 에러가 났을 때, 권한이 없을 때처럼 컴포넌트 하나가 가질 수 있는 상태가 너무 많았어요. 시안에는 2~3개 화면뿐인데 실제 코드에서는 10가지 이상의 경우를 처리해야 했어요.

그 뒤로는 화면을 설계할 때 처음부터 모든 상태를 같이 생각해요. Figma에서 시안을 만들 때도 default, loading, empty, error, disabled를 한 세트로 만들어요.

반복 가능한 구조가 왜 필요한지도 몰랐어요. 디자이너일 때는 화면마다 조금씩 다르게 만들어도 괜찮았어요. 이 카드는 패딩 16px, 저 카드는 20px. '이 화면에서는 이게 더 예뻐 보이니까'라는 이유로요. 그런데 컴포넌트로 구현하려고 보니 이런 미세한 차이가 재사용을 어렵게 했고, 비슷한 컴포넌트가 여러 개 생기는 원인이 됐어요.

지금은 디자인 단계에서부터 '이걸 컴포넌트 하나로 만들 수 있을까?'를 따져 봐요. 두 화면에서 같은 역할을 하는 요소라면, 보기에 조금 달라도 하나의 변형(variant)으로 다룰 수 있게 설계해요.

## 디자인 감각이 개발에서 도움이 될 때

반대로 디자이너 출신이라 개발할 때 유리한 점도 있어요.

먼저 레퍼런스를 보는 눈이 달라요. 다른 서비스의 UI를 보면 '예쁘다'에서 멈추지 않고, 왜 이 여백인지, 왜 이 색 조합인지, 타이포그래피 위계가 시선을 어떻게 끌고 가는지를 바로 읽어요.

여백과 정렬에도 예민해요. 개발하다 보면 '이 정도면 되겠지' 하고 넘어가기 쉬운 부분이 여백과 정렬인데, 디자인 훈련을 받았으니 4px 차이도 눈에 들어와요. 사용자가 의식하지 못하는 '깔끔한 느낌'은 이런 차이에서 나와요.

Figma에서 개발까지 혼자 이어서 할 수 있다는 점도 있어요. 디자인에서 개발로 넘길 때 흔히 생기는 '시안이랑 다른데요' 문제가 없어요. 머릿속에 있는 그대로 코드로 옮기니까 의도한 UX가 그대로 구현돼요.

## 지금의 프로세스

두 경험이 합쳐지면서 UI를 만드는 순서가 이렇게 정리됐어요.

1. 구조를 먼저 잡아요. Figma에서 흑백(gray)으로만 레이아웃을 만들어요. 색 없이도 정보 위계가 읽히면 구조가 잘 잡힌 거예요.
2. 상태를 전부 정의해요. default, hover, loading, empty, error, disabled까지 컴포넌트 하나의 모든 상태를 시안 단계에서 만들어요.
3. 컴포넌트 단위로 생각해요. '이 화면'이 아니라 '이 컴포넌트'를 만든다는 관점으로, 다른 곳에서도 쓸 수 있게 설계해요.
4. 실제 데이터로 확인해요. Lorem ipsum 대신 진짜 데이터로 화면을 채워 봐요. 제목이 두 줄이 되면 레이아웃이 깨지는지, 이미지 비율이 다르면 어떻게 보이는지 확인해요.

## 배운 점

디자이너에서 개발자로 넘어오면서 가장 크게 배운 건 '예쁜 화면'과 '좋은 UI'가 다르다는 거예요. 예쁜 화면은 감각으로 만들 수 있지만, 좋은 UI는 시스템으로 만들어야 해요. 모든 상태를 다루고, 일관되게 동작하고, 다음에 뭘 해야 하는지 누구나 알 수 있는 화면이요.

그래서 지금은 시안을 그릴 때부터 코드로 옮길 구조를 같이 생각하면서 작업해요.$md$,
  content_en = $md$## Background

I started out as a designer. My job was drawing screens in Figma, building color palettes, and setting typographic hierarchy. When I moved into frontend development, the way I looked at UI changed a lot.

As a designer, my question was "how good does this screen look?" As a developer, it became "how well does this screen work?" Both matter, but once the weight shifted, so did the way I build things.

## What I Didn't Know as a Designer

I had no concept of state. When designing, I only drew finished screens. Buttons were always active, lists always had data, and errors lived in a separate mockup. Once I started coding, a single component turned out to have loading, empty, error, and unauthorized states, and more. A design file had 2-3 screens, but the actual code had to handle 10+ cases.

Since then I think about every state from the start when designing a screen. Even in Figma, I now make default, loading, empty, error, and disabled as one set.

I also didn't see why repeatable structure mattered. As a designer, making things slightly different per screen was fine. This card gets 16px padding, that one gets 20px, "because it looks better on this screen." But when I implemented them as components, those small differences got in the way of reuse and left me with several near-identical components.

Now I ask "Can this be one component?" during the design phase. If elements play the same role on two screens, I design them as variants of one component, even if they look a little different.

## Where Design Sense Helps in Development

On the other hand, a design background does give me some advantages as a developer.

I read references differently. When I look at another service's UI, I don't stop at "that's pretty." I can see why this whitespace, why this color combination, and how the typographic hierarchy guides the eye.

I'm sensitive to spacing and alignment. They're easy to wave through with "close enough" during development, but with design training even a 4px difference catches my eye. That's where the "clean feeling" users can't quite name comes from.

I can also take a screen from Figma to code on my own. The "this doesn't match the mockup" problem from design-to-development handoff doesn't come up. I translate what's in my head straight into code, so the UX I intended is what gets built.

## My Current Process

With both backgrounds combined, my UI process has settled into this order:

1. Structure first. I lay out screens in Figma in grayscale only. If the information hierarchy reads without color, the structure is solid.
2. Define every state. I make every state of a component (default, hover, loading, empty, error, disabled) at the mockup stage.
3. Think in components. I design from the view of "this component," not "this screen," so it can be reused elsewhere.
4. Check with real data. I fill screens with actual data instead of Lorem ipsum, and check whether the layout breaks when a title wraps to two lines or how things look when image ratios differ.

## Lessons Learned

The biggest thing I learned moving from design to development is that a pretty screen and a good UI are different things. A pretty screen can come from intuition, but a good UI has to be built as a system: one that covers every state, behaves consistently, and makes it obvious what to do next.

So these days I think about the code structure from the moment I start a mockup.$md$,
  updated_at = now()
WHERE id = 'design-ui-without-designer';

UPDATE blog_posts SET
  title_ko = $md$여백이 두려웠던 시절, 빈 공간은 비어 있는 게 아니었어요$md$,
  title_en = $md$I Used to Be Afraid of Whitespace. Empty Space Isn't Really Empty$md$,
  excerpt_ko = $md$화면에 빈 공간이 보이면 불안했던 때가 있었어요. 여백을 '구분선 없는 구분선'으로 보게 된 과정을 적었어요.$md$,
  excerpt_en = $md$Blank space on screen used to make me anxious. This is how I came to see whitespace as an invisible divider.$md$,
  content_ko = $md$## 배경

처음 UI를 만들 때는 화면에 빈 공간이 보이면 불안했어요. '여기에 뭘 더 넣어야 하지?' 하는 생각이 저절로 들었거든요. 카드 사이 간격이 넓으면 너무 허전한 건 아닌지, 섹션 아래 여백이 크면 콘텐츠가 부족해 보이지는 않는지 계속 고민했어요.

그래서 초기에 만든 화면들은 하나같이 빽빽했어요. 정보는 많은데 어디부터 봐야 할지 모르겠는 화면, 텍스트와 버튼과 아이콘이 틈 없이 붙어 있는 레이아웃이었어요. 기능에는 문제가 없었지만 화면을 열었을 때 편하다는 느낌은 들지 않았어요.

## 과정과 탐색

생각이 바뀐 건 통인익스프레스 프로젝트에서였어요. 이사 신청서를 태블릿으로 작성하는 화면을 설계해야 했는데, 사용자가 40대~60대 고객이었어요. 화면을 빽빽하게 채우면 안 되겠다 싶어서 여백을 크게 잡았어요.

그런데 여백을 넓히니 오히려 화면에 더 '많이' 담긴 것처럼 보였어요. 정보량은 줄었는데 요소 하나하나가 눈에 더 잘 들어왔거든요. 입력 필드 사이를 24px 대신 40px로 주니 사용자의 시선이 다음 필드로 자연스럽게 옮겨 갔고, 섹션 타이틀 위에 64px 여백을 주니 말하지 않아도 '여기서부터 새로운 내용이 시작되는구나' 하는 게 느껴졌어요.

그때부터 여백을 '구분선 없는 구분선'으로 생각하게 됐어요.

## 제가 정리한 여백 기준

이후 프로젝트를 거치면서 나름의 기준이 생겼어요.

관계가 가까운 요소일수록 간격을 좁혀요. 라벨과 입력 필드 사이는 4~8px이면 충분해요. 입력 필드 그룹과 다음 그룹 사이는 최소 24px, 섹션과 섹션 사이는 48~80px 정도가 필요해요. 게슈탈트 심리학에서 말하는 '근접성의 원리'인데, 이름은 어려워도 원리는 단순해요. 가까이 있으면 같은 것, 멀리 있으면 다른 것으로 읽혀요.

여백은 일정한 단위로 움직여야 해요. 저는 보통 4px이나 8px을 기본 단위로 쓰고, 모든 간격을 그 배수로 맞춰요. 12px, 16px, 24px, 32px, 48px, 64px처럼요. 규칙 없이 '이 정도면 되겠지' 하고 넣으면 화면 곳곳에 미묘한 불일치가 쌓여요. 사용자는 의식하지 못해도 뭔가 정돈이 안 된 느낌을 받게 돼요.

모바일 여백은 그냥 줄이면 되는 게 아니에요. 데스크톱 섹션 간격이 80px이라고 모바일에서 40px로 반을 잘라 버리면 비례가 깨져요. 모바일은 화면이 좁으니 비율로 생각해야 해요. 저는 보통 데스크톱 여백의 60~70% 정도를 모바일에 적용하는데, 이것도 화면을 직접 보면서 조정해요.

## 배운 점

여백은 콘텐츠가 모자라서 남는 공간이 아니에요. 콘텐츠가 제대로 보이도록 일부러 만드는 공간이에요. 화면을 채우는 일과 화면을 설계하는 일은 서로 다른 작업이었고, 빈 공간을 두려워하지 않게 된 뒤로 제가 만드는 화면의 느낌도 달라졌어요.

지금도 화면을 만들 때 제일 먼저 정하는 건 여기에 뭘 넣을지보다 뭘 넣지 않을지예요.$md$,
  content_en = $md$## Background

When I first started building UIs, empty space on the screen made me anxious. My mind would jump straight to "What else should I put here?" If the gap between cards was wide, I worried it looked barren. If the margin below a section was large, I worried it looked like there wasn't enough content.

So everything I built early on was packed tight. Screens full of information where you couldn't tell what to look at first, and layouts where text, buttons, and icons were pressed together with no room to breathe. Nothing was broken, but opening those screens never felt comfortable.

## Investigation

The shift came during the Tongin Express project. I was designing a tablet screen for filling out a moving application, and the users were customers in their 40s through 60s. Packing that screen tight was clearly out of the question, so I gave the layout generous whitespace.

The surprising part was that more whitespace made the screen feel like it held *more*. There was less information, but each element was easier to notice. When I changed the spacing between input fields from 24px to 40px, users' eyes moved naturally to the next field. When I added 64px above section titles, people could tell a new section started there without being told.

From then on, I started thinking of whitespace as a divider without the line.

## My Whitespace Rules

Over the following projects, I settled on a few rules of my own.

The closer two elements are related, the tighter the spacing. Between a label and its input, 4-8px is plenty. Between one input group and the next you need at least 24px, and between sections, 48-80px. Gestalt psychology calls this the "principle of proximity." The name sounds fancy, but the idea is simple: things close together read as related, things far apart read as separate.

Whitespace should move in consistent steps. I usually use 4px or 8px as the base unit and make every spacing value a multiple of it: 12px, 16px, 24px, 32px, 48px, 64px. If you eyeball it with "that looks about right," small inconsistencies pile up across the screen. Users can't point to them, but they sense that something feels unpolished.

Mobile whitespace isn't just a smaller version of desktop. If section spacing is 80px on desktop, cutting it in half to 40px on mobile breaks the proportions. Mobile screens are narrower, so you have to think in ratios. I usually apply about 60-70% of the desktop whitespace on mobile, and even then I adjust it by looking at the actual screen.

## Lessons Learned

Whitespace isn't what's left over when there's not enough content. It's space I create on purpose so the content can be seen. Filling a screen and designing a screen turned out to be different jobs, and once I stopped being afraid of empty space, the screens I built started to feel different.

Even now, the first thing I decide when building a screen is less about what to put in and more about what to leave out.$md$,
  updated_at = now()
WHERE id = 'design-whitespace';

UPDATE blog_posts SET
  title_ko = $md$모듈형 대시보드 위젯 시스템$md$,
  title_en = $md$Modular Dashboard Widget System$md$,
  excerpt_ko = $md$여러 독립 모듈이 한 화면에 모이는 대시보드를 메타 데이터 기반 동적 렌더링과 공통 상태 관리로 정리한 과정이에요.$md$,
  excerpt_en = $md$How I restructured a dashboard full of independent modules around metadata-driven dynamic rendering and shared state handling.$md$,
  content_ko = $md$## 원인

대시보드 한 화면에 보안 현황, 저장소 용량, 작업 진행률, 최근 로그 같은 여러 기능을 보여줘야 했어요. 만들다 보니 이런 문제가 생겼어요.

- 위젯마다 API, 갱신 주기, 렌더 타입(차트/리스트/카드)이 다름
- 일부 위젯은 사용자가 직접 추가, 삭제하고 순서를 바꿀 수 있어야 함
- 로딩/에러/빈 상태 처리는 공통으로 필요함
- 새 위젯을 넣을 때마다 라우트와 템플릿을 고쳐야 해서 확장이 어려움

독립된 모듈 여러 개가 한 페이지에 있으면서도 UX는 일관돼야 했어요. 그래서 모듈형 대시보드 위젯 시스템을 만들기로 했어요.

## 과정과 문제 탐색

처음에는 컴포넌트를 그대로 나열하는 구조였어요.

```
<SecurityCard />
<StorageUsage />
<JobProgress />
<RecentLogs />
```

이 방식에는 문제가 있었어요.

- 컴포넌트마다 fetch 로직, 로딩 상태, 에러 상태를 따로 관리함
- 위젯 순서를 바꾸려면 템플릿의 컴포넌트 배치를 직접 고쳐야 함
- 새 위젯을 추가하면 router, layout, i18n 등 여러 곳을 손대야 함

그래서 위젯을 데이터로 선언하고, 공통 위젯 엔진이 렌더링하는 구조로 바꾸기로 했어요.

## 해결 방안

### a. 위젯 메타 데이터 기반 렌더링

모든 위젯을 하나의 메타 객체로 정의했어요.

```
// types/dashboard-widget.ts
export interface DashboardWidget {
  id: string
  title: string
  component: Component
  api?: string
  refreshInterval?: number
}
```

```
// widgets/index.ts
import SecurityCard from '@/widgets/SecurityCard.vue'
import StorageUsage from '@/widgets/StorageUsage.vue'
import JobProgress from '@/widgets/JobProgress.vue'
import RecentLogs from '@/widgets/RecentLogs.vue'

export const widgetList: DashboardWidget[] = [
  { id: 'security', title: '보안 현황', component: SecurityCard, api: '/api/security', refreshInterval: 60, viewType: 'chart' },
  { id: 'storage', title: '저장소 사용량', component: StorageUsage, api: '/api/storage', viewType: 'card' },
  { id: 'job', title: '작업 진행률', component: JobProgress, api: '/api/jobs', viewType: 'chart' },
  { id: 'logs', title: '최근 로그', component: RecentLogs, api: '/api/logs', viewType: 'list' },
]
```

이제 새 위젯은 객체 하나만 등록하면 돼요.

### b. 공통 위젯 래퍼 (로딩/에러/빈 상태 일원화)

로딩/에러/빈 상태는 모든 위젯이 `useViewState` composable로 똑같이 처리해요.

```
<!-- components/DashboardWidgetWrapper.vue -->
<template>
  <a-card :title="title" class="dashboard-widget">
    <AppSkeleton v-if="state.phase === 'loading'" :rows="4" />
    <AppError v-else-if="state.phase === 'error'" :title="state.error?.message" :onRetry="load" />
    <AppEmpty v-else-if="state.phase === 'empty'" title="데이터 없음" />
    <component v-else :is="component" v-bind="{ data: state.data, viewType }" />
  </a-card>
</template>

<script setup lang="ts">
import { useViewState } from '@/composables/useViewState'

const props = defineProps<{ title: string; api?: string; component: any; viewType?: string }>()
const { state, setLoading, setSuccess, setEmpty, setError } = useViewState<any>()

const load = async () => {
  if (!props.api) return setEmpty()
  setLoading()
  try {
    const res = await $fetch(props.api)
    if (!res || !Object.keys(res).length) return setEmpty()
    setSuccess(res)
  } catch (e: any) {
    setError(e?.message || '데이터를 불러오지 못했습니다.')
  }
}

onMounted(async () => { await load() })
</script>

<style scoped>
.dashboard-widget { height: 100%; }
</style>
```

위젯마다 데이터 구조가 달라도 상태 관리는 래퍼가 맡아요. 각 위젯은 data props만 받아서 그리는 데 집중하면 돼요.

### c. 메인 대시보드 구성

```
<!-- pages/dashboard.vue -->
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { widgetList } from '@/widgets'
import DashboardWidgetWrapper from '@/components/DashboardWidgetWrapper.vue'

const activeWidgets = ref([...widgetList]) // 추후 drag-sort 기반 커스터마이징 가능
const layoutReady = ref(false)

onMounted(() => {
  layoutReady.value = true
})
</script>

<template>
  <div v-if="layoutReady" class="dashboard-grid">
    <DashboardWidgetWrapper
      v-for="w in activeWidgets"
      :key="w.id"
      :title="w.title"
      :component="w.component"
      :api="w.api"
      :viewType="w.viewType"
    />
  </div>
</template>

<style scoped>
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 16px;
}
</style>
```

이렇게 모듈 등록 기반 동적 렌더링과, 공통 래퍼를 통한 상태/로딩/에러 UI 통일을 함께 해결했어요.

drag-and-drop 정렬, 위젯 숨김, 사용자별 저장 기능은 앞으로 추가할 예정이에요.

## 결과

새 위젯은 템플릿을 고치지 않고 등록만 하면 자동으로 렌더링돼요. 모든 위젯이 같은 상태 처리 정책을 쓰니 운영도 수월해졌어요.

## 배운 점

대시보드는 컴포넌트를 모아두는 방식보다 모듈 엔진처럼 설계했을 때 유지보수가 쉬웠어요. Vue의 `component` 동적 바인딩과 composable 패턴을 같이 쓰니 위젯을 늘리기도 쉽고 화면 동작도 일관되게 맞출 수 있었어요.$md$,
  content_en = $md$## Background

The dashboard had to show several features on one screen: security status, storage capacity, job progress, recent logs, and so on. As I built it, a few problems came up.

- Each widget had its own API, refresh cycle, and render type (chart/list/card)
- Some widgets had to be added, removed, and reordered by the user
- Every widget needed loading, error, and empty state handling
- Adding a new widget meant editing routes and templates every time, which made it hard to scale

Independent modules had to live on one page and still feel consistent. So I set out to build a modular dashboard widget system.

## Process and Problem Exploration

The first version just listed the components one after another.

```
<SecurityCard />
<StorageUsage />
<JobProgress />
<RecentLogs />
```

That approach had problems.

- Every component managed its own fetch logic, loading state, and error state
- Changing the widget order meant editing the component layout in the template by hand
- A new widget meant touching the router, layout, i18n, and more

So I decided to declare widgets as data and let a shared widget engine render them.

## Solution

### a. Widget Metadata-Based Rendering

Every widget is defined as a single meta object.

```
// types/dashboard-widget.ts
export interface DashboardWidget {
  id: string
  title: string
  component: Component
  api?: string
  refreshInterval?: number
}
```

```
// widgets/index.ts
import SecurityCard from '@/widgets/SecurityCard.vue'
import StorageUsage from '@/widgets/StorageUsage.vue'
import JobProgress from '@/widgets/JobProgress.vue'
import RecentLogs from '@/widgets/RecentLogs.vue'

export const widgetList: DashboardWidget[] = [
  { id: 'security', title: 'Security Status', component: SecurityCard, api: '/api/security', refreshInterval: 60, viewType: 'chart' },
  { id: 'storage', title: 'Storage Usage', component: StorageUsage, api: '/api/storage', viewType: 'card' },
  { id: 'job', title: 'Job Progress', component: JobProgress, api: '/api/jobs', viewType: 'chart' },
  { id: 'logs', title: 'Recent Logs', component: RecentLogs, api: '/api/logs', viewType: 'list' },
]
```

Adding a widget now takes one registered object.

### b. Common Widget Wrapper (Unifying Loading/Error/Empty States)

All widgets handle loading, error, and empty states the same way through the `useViewState` composable.

```
<!-- components/DashboardWidgetWrapper.vue -->
<template>
  <a-card :title="title" class="dashboard-widget">
    <AppSkeleton v-if="state.phase === 'loading'" :rows="4" />
    <AppError v-else-if="state.phase === 'error'" :title="state.error?.message" :onRetry="load" />
    <AppEmpty v-else-if="state.phase === 'empty'" title="No data" />
    <component v-else :is="component" v-bind="{ data: state.data, viewType }" />
  </a-card>
</template>

<script setup lang="ts">
import { useViewState } from '@/composables/useViewState'

const props = defineProps<{ title: string; api?: string; component: any; viewType?: string }>()
const { state, setLoading, setSuccess, setEmpty, setError } = useViewState<any>()

const load = async () => {
  if (!props.api) return setEmpty()
  setLoading()
  try {
    const res = await $fetch(props.api)
    if (!res || !Object.keys(res).length) return setEmpty()
    setSuccess(res)
  } catch (e: any) {
    setError(e?.message || 'Failed to load data.')
  }
}

onMounted(async () => { await load() })
</script>

<style scoped>
.dashboard-widget { height: 100%; }
</style>
```

Even when widgets use different data shapes, the wrapper owns the state. Each widget just receives data props and renders.

### c. Main Dashboard Composition

```
<!-- pages/dashboard.vue -->
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { widgetList } from '@/widgets'
import DashboardWidgetWrapper from '@/components/DashboardWidgetWrapper.vue'

const activeWidgets = ref([...widgetList]) // Future drag-sort based customization possible
const layoutReady = ref(false)

onMounted(() => {
  layoutReady.value = true
})
</script>

<template>
  <div v-if="layoutReady" class="dashboard-grid">
    <DashboardWidgetWrapper
      v-for="w in activeWidgets"
      :key="w.id"
      :title="w.title"
      :component="w.component"
      :api="w.api"
      :viewType="w.viewType"
    />
  </div>
</template>

<style scoped>
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 16px;
}
</style>
```

With this, module registration drives the rendering, and the shared wrapper keeps the state, loading, and error UI the same everywhere.

Drag-and-drop sorting, hiding widgets, and saving per-user layouts are next on the list.

## Results

A new widget renders automatically once it's registered, with no template changes. Since every widget follows the same state policy, day-to-day operation got easier too.

## Key Takeaways

The dashboard was much easier to maintain once I treated it as a module engine instead of a pile of components. Combining Vue's `component` dynamic binding with composables let me add widgets easily while keeping their behavior consistent.$md$,
  updated_at = now()
WHERE id = 'dashboard-widget-system';

UPDATE blog_posts SET
  title_ko = $md$권한(Role)별 접근 제어 시스템$md$,
  title_en = $md$Role-Based Access Control System$md$,
  excerpt_ko = $md$역할마다 다른 페이지/기능 접근 조건을 중앙 composable 하나로 모아 라우터, UI, API가 같은 권한 로직을 쓰게 만든 과정이에요.$md$,
  excerpt_en = $md$How I pulled role-based page and feature access checks into one central composable so the router, UI, and API calls all share the same permission logic.$md$,
  content_ko = $md$## 원인

저희 솔루션은 프로젝트 안에서 관리자(Admin), 일반 사용자(User), 외부 게스트(Guest)처럼 역할에 따라 접근할 수 있는 페이지와 기능이 달랐어요.

그런데 이런 문제가 있었어요.

> - 버튼, 탭, 라우트 노출 조건이 화면마다 제각각 하드코딩됨
> - 비로그인 상태에서 URL로 직접 들어오는 경우의 예외 처리가 빠져 있음
> - 컴포넌트, 라우터, 템플릿에서 같은 권한 검증 로직을 반복함
> - API 호출에도 권한 필터가 중복돼 있어 유지보수가 불가능한 수준이었음

누가 무엇을 보고 실행할 수 있는지를 한 곳에서 정의하는 권한 제어 시스템이 필요했어요.

## 과정과 문제 탐색

### a) 기존 구조의 한계

기존에는 컴포넌트 안에 이런 조건이 흩어져 있었어요.

```
<a-button v-if="userRole === 'ADMIN'">관리자 설정</a-button>
```

라우터에서 직접 검사하기도 했고요.

```
if (userRole !== 'ADMIN') next('/403')
```

그래서 역할이 추가되거나 정책이 바뀌면 모든 화면의 버튼과 설정 로직을 하나하나 고쳐야 했어요. 로직이 여기저기 흩어져 있으니 테스트와 유지보수도 힘들었어요.

## 해결 방안

그래서 방향을 이렇게 잡았어요.

> - 모든 권한 검증을 중앙 composable 하나로 모으기
> - UI 노출, 라우팅, API 호출에서 같은 로직 재사용
> - 로그인 상태에 따라 라우팅을 동적으로 필터링
> - Role을 타입으로 정의해 자동완성과 안정성 확보

### a. 권한 모델 정의

먼저 역할과 접근 가능한 자원을 명시적으로 구조화했어요.

```
export type Role = 'ADMIN' | 'USER' | 'GUEST'

export interface Permission {
  pages: string[]
  actions: string[]
}

export const rolePermissionMap: Record<Role, Permission> = {
  ADMIN: {
    pages: ['/dashboard', '/users', '/settings'],
    actions: ['CREATE', 'EDIT', 'DELETE', 'VIEW']
  },
  USER: {
    pages: ['/dashboard', '/profile'],
    actions: ['VIEW']
  },
  GUEST: {
    pages: ['/login', '/register'],
    actions: []
  },
}
```

### b. composable 기반 접근 제어

흩어져 있던 권한 검증을 composable 하나로 모았어요.

```
// composables/usePermission.ts
import { ref } from 'vue'

const currentRole = ref<Role>('GUEST')

export const usePermission = () => {
  const setRole = (role: Role) => (currentRole.value = role)
  const hasPageAccess = (path: string) =>
    rolePermissionMap[currentRole.value].pages.includes(path)
  const can = (action: string) =>
    rolePermissionMap[currentRole.value].actions.includes(action)

  return { currentRole, setRole, hasPageAccess, can }
}
```

### c. 라우터 가드 통합

라우트에 들어갈 때 접근 가능한 페이지인지 검사하는 전역 가드를 추가했어요.

```
// plugins/route-guard.client.ts
import { usePermission } from '@/composables/usePermission'

export default defineNuxtPlugin((nuxtApp) => {
  const { hasPageAccess } = usePermission()

  nuxtApp.$router.beforeEach((to, _from, next) => {
    if (!hasPageAccess(to.path)) return next('/403')
    next()
  })
})
```

접근 검증을 전역에서 한 번에 처리하니 페이지마다 중복되던 조건문을 지울 수 있었어요.

### d. 템플릿 단 접근 제어

UI에서는 헬퍼 함수를 바로 써서 코드를 읽기 쉽게 했어요.

```
<a-button v-if="can('EDIT')">수정</a-button>
<a-button v-if="can('DELETE')">삭제</a-button>
```

### e. API 단 권한 필터

API를 호출할 때도 같은 권한 검증을 재사용해서 불필요한 조건문을 줄였어요.

```
const { can } = usePermission()
if (can('DELETE')) await useRestPost('/api/user/delete', { id })
else message.warning('삭제 권한이 없습니다.')
```

## 결과

페이지, 라우터, API, UI가 모두 같은 권한 로직을 쓰게 되면서 중복 코드가 사라졌어요. 로그인 후 Role이 바뀌면 라우터에도 바로 반영돼요.

## 배운 점

처음엔 권한 시스템을 어떤 사용자에게 무엇을 허용할지 정하는 기능 정도로 생각했어요. 막상 구현해 보니 데이터와 UI 흐름을 어떻게 제어할지에 관한 구조 문제에 더 가까웠어요.$md$,
  content_en = $md$## Background

In our solution, what you could access inside a project depended on your role: Admin, User, or Guest each saw different pages and features.

That caused a few problems.

> - Visibility conditions for buttons, tabs, and routes were hardcoded differently on each screen
> - There was no exception handling when a logged-out user opened a URL directly
> - The same permission checks were repeated across components, the router, and templates
> - API calls had their own duplicated permission filters, which made maintenance close to impossible

I needed one place to define who can see and do what.

## Process and Problem Exploration

### a) Limitations of Existing Structure

Before, checks like this were scattered across components.

```
<a-button v-if="userRole === 'ADMIN'">Admin Settings</a-button>
```

Or the router checked the role directly.

```
if (userRole !== 'ADMIN') next('/403')
```

So whenever a role was added or a policy changed, I had to edit the button and settings logic on every screen by hand. With the logic spread out like that, testing and maintenance were painful.

## Solution

Here's the direction I took.

> - Move every permission check into one central composable
> - Reuse the same logic for UI visibility, routing, and API calls
> - Filter routes dynamically based on login state
> - Define Role as a type for autocomplete and safety

### a. Permission Model Definition

First, I spelled out the roles and the resources each one can access.

```
export type Role = 'ADMIN' | 'USER' | 'GUEST'

export interface Permission {
  pages: string[]
  actions: string[]
}

export const rolePermissionMap: Record<Role, Permission> = {
  ADMIN: {
    pages: ['/dashboard', '/users', '/settings'],
    actions: ['CREATE', 'EDIT', 'DELETE', 'VIEW']
  },
  USER: {
    pages: ['/dashboard', '/profile'],
    actions: ['VIEW']
  },
  GUEST: {
    pages: ['/login', '/register'],
    actions: []
  },
}
```

### b. Composable-Based Access Control

All the scattered checks went into a single composable.

```
// composables/usePermission.ts
import { ref } from 'vue'

const currentRole = ref<Role>('GUEST')

export const usePermission = () => {
  const setRole = (role: Role) => (currentRole.value = role)
  const hasPageAccess = (path: string) =>
    rolePermissionMap[currentRole.value].pages.includes(path)
  const can = (action: string) =>
    rolePermissionMap[currentRole.value].actions.includes(action)

  return { currentRole, setRole, hasPageAccess, can }
}
```

### c. Router Guard Integration

I added a global guard that checks whether a page is accessible before entering the route.

```
// plugins/route-guard.client.ts
import { usePermission } from '@/composables/usePermission'

export default defineNuxtPlugin((nuxtApp) => {
  const { hasPageAccess } = usePermission()

  nuxtApp.$router.beforeEach((to, _from, next) => {
    if (!hasPageAccess(to.path)) return next('/403')
    next()
  })
})
```

With access checks handled globally, I could delete the duplicated conditionals on each page.

### d. Template-Level Access Control

In the UI, the helper functions are used directly, which keeps templates easy to read.

```
<a-button v-if="can('EDIT')">Edit</a-button>
<a-button v-if="can('DELETE')">Delete</a-button>
```

### e. API-Level Permission Filter

API calls reuse the same check, so I could drop a lot of redundant conditionals.

```
const { can } = usePermission()
if (can('DELETE')) await useRestPost('/api/user/delete', { id })
else message.warning('You do not have delete permission.')
```

## Results

Pages, the router, APIs, and the UI now share one permission logic, and the duplicated code is gone. When the Role changes after login, the router picks it up right away.

## Key Takeaways

I used to think a permission system was mostly about deciding what a given user is allowed to do. Once I built it, it turned out to be more of a structural question about how data and UI flow are controlled.$md$,
  updated_at = now()
WHERE id = 'role-permission-system';

UPDATE blog_posts SET
  title_ko = $md$공통 테이블 컴포넌트 구조화 경험$md$,
  title_en = $md$Common Table Component Structuring Experience$md$,
  excerpt_ko = $md$페이지네이션, 정렬, URL 동기화가 필요한 테이블들을 공통 컴포넌트로 묶으면서 데이터 흐름을 어떻게 통제했는지 정리했어요.$md$,
  excerpt_en = $md$Notes on how I controlled data flow while turning tables that needed pagination, sorting, and URL sync into one common component.$md$,
  content_ko = $md$## 원인

저희 솔루션은 특성상 거의 모든 화면이 데이터를 테이블로 보여줘요.

그런데 페이지마다 페이지네이션, 정렬, 컬럼 정의, API 호출 로직이 반복되면서 비슷하지만 조금씩 다른 코드가 쌓였어요.

- 페이지마다 테이블 로직이 중복돼 유지보수 부담이 커짐
- `searchOption`을 초기화할 때 기본값이 덮어써지거나 상태가 어긋남
- 서버 요청 스펙과 화면 전용 필드가 섞여 타입이 불안정하고 불필요한 값까지 전송됨
- 응답이 클 때 로딩 UX가 들쭉날쭉하고 화면이 깜빡임

목표는 한 번 정의하면 어디서든 재사용할 수 있는 테이블 구조였어요. 정리하면 이래요.

- 범용 composable(`useTable`)로 통합
- 요청 스펙 최소화
- URL 기반 상태 동기화와 일관된 UX

## 과정과 문제 탐색

테이블마다 반복되던 코드를 `useTable` composable 하나로 모았어요.

이때 신경 쓴 건 실행 순서를 onMounted 안에 명시적으로 고정하는 것, 그리고 watch 없이 상태를 제어하는 것이었어요. 순서는 이렇게 고정했어요.

> 1. URL 값을 상태에 주입
> 2. URL 정규화 (선택)
> 3. 첫 fetch 실행

## 구현

### a. 타입/요청 규약

```
export interface Pagination {
  pageNo: number
  pageSize: number
  sortField?: string
  sortOrder?: 'ascend' | 'descend' | ''
}
```

API에는 `pageNo/pageSize/sortField/sortOrder`만 보내고, UI 전용 필드는 `TablePagination`에서만 관리하도록 분리했어요.

### b. 공통 composable (useTable)

```
export const useTable = <TQuery extends Pagination, TRow>(
  apiList: (q: Pagination, signal?: AbortSignal) => Promise<{ items: TRow[]; total: number }>
) => {
  // controller.abort()로 진행 중 요청 중단
  // 뒤늦은 응답이 화면을 덮는 레이스 버그 차단
}
```

- `AbortController`로 중복 요청 차단
- fetch는 onMounted에서만 명시적으로 호출
- `lastKey`로 같은 쿼리 중복 방지

이 구조로 바꾸고 나서 중복 로딩과 깜빡임이 거의 사라졌어요.

### c. 공통 UI (`<AppTable />`)

양방향 바인딩을 없애고, 모든 상태를 부모가 직접 제어하게 했어요.

```
<a-table
  :columns="columns"
  :data-source="rows"
  :loading="loading"
  :pagination="{ current: pg.pageNo, pageSize: pg.pageSize, total: pg.total }"
  row-key="id"
  @change="onChange"
/>
```

### d. 페이지 예시

```
onMounted(async () => {
  initFromUrlOnce()   // 1. URL → 상태
  await syncUrlFromPg() // 2. 정규화
  await fetch()         // 3. 데이터 호출
})
```

fetch는 `applyPg()` 같은 로컬 핸들러에서만 트리거해서, 언제 데이터를 부르는지가 코드에 그대로 드러나게 했어요.

덕분에 새로고침, 링크 공유, 뒤로가기 후에도 같은 검색 조건이 복원돼요.

## 결과

테이블 관련 중복 코드가 줄었고 신규 페이지를 만드는 시간도 짧아졌어요. SSR/CSR이 섞인 환경에서도 데이터가 일관되게 유지됐고, 빈 값 덮어쓰기와 상태 꼬임도 없어졌어요.

## 배운 점

테이블을 재사용 가능하게 만드는 것보다 데이터 흐름 전체를 어디서 통제할지 정하는 게 더 큰 일이었어요. Vue에서 `watch` 없이 명시적인 호출만으로도 상태를 충분히 예측 가능하게 다룰 수 있다는 것도 확인했어요.$md$,
  content_en = $md$## Background

Because of what our solution does, almost every screen shows its data in a table.

Each page repeated its own pagination, sorting, column definitions, and API calls, so we ended up with lots of code that was similar but never quite the same.

- Table logic duplicated on every page, which made maintenance heavier
- Defaults got overwritten or state fell out of sync when `searchOption` was initialized
- Server request specs and UI-only fields were mixed, so types were shaky and extra values were sent
- Loading UX was inconsistent and the screen flickered on large responses

The goal was a table structure I could define once and reuse anywhere. In short:

- Integrate with a universal composable (`useTable`)
- Minimize request specifications
- URL-based state sync and consistent UX

## Process and Problem Exploration

I pulled the code that every table repeated into a single `useTable` composable.

Two things mattered most: fixing the execution order explicitly in onMounted, and controlling state without watch. The order looks like this.

> 1. Inject URL values into state
> 2. URL normalization (optional)
> 3. Execute first fetch

## Implementation

### a. Type/Request Contract

```
export interface Pagination {
  pageNo: number
  pageSize: number
  sortField?: string
  sortOrder?: 'ascend' | 'descend' | ''
}
```

Only `pageNo/pageSize/sortField/sortOrder` go to the API. UI-only fields live separately in `TablePagination`.

### b. Common Composable (useTable)

```
export const useTable = <TQuery extends Pagination, TRow>(
  apiList: (q: Pagination, signal?: AbortSignal) => Promise<{ items: TRow[]; total: number }>
) => {
  // Cancel in-progress requests with controller.abort()
  // Block race bugs where delayed responses overwrite the screen
}
```

- Block duplicate requests with `AbortController`
- Call fetch explicitly, only in onMounted
- Prevent duplicate queries with `lastKey`

After this change, the duplicate loading and flickering were almost gone.

### c. Common UI (`<AppTable />`)

I removed two-way binding entirely so the parent controls all of the state.

```
<a-table
  :columns="columns"
  :data-source="rows"
  :loading="loading"
  :pagination="{ current: pg.pageNo, pageSize: pg.pageSize, total: pg.total }"
  row-key="id"
  @change="onChange"
/>
```

### d. Page Example

```
onMounted(async () => {
  initFromUrlOnce()   // 1. URL → State
  await syncUrlFromPg() // 2. Normalization
  await fetch()         // 3. Data call
})
```

Fetch is triggered only from local handlers like `applyPg()`, so it's always clear from the code when data gets loaded.

This way the same search conditions come back after a refresh, a shared link, or going back.

## Results

There's less duplicated table code, and new pages take less time to build. Data stays consistent even with mixed SSR/CSR, and the blank-value overwrites and tangled state are gone.

## Key Takeaways

Making the table reusable turned out to be the smaller part. Deciding where the whole data flow is controlled was the real work. I also confirmed that in Vue, explicit calls without `watch` are enough to keep state predictable.$md$,
  updated_at = now()
WHERE id = 'table-component-structuring';

UPDATE blog_posts SET
  title_ko = $md$숨겨진 div의 역습, React에서 hidden 클래스는 조건부 렌더링이 아니에요$md$,
  title_en = $md$The Hidden Div Strikes Back, or Why CSS hidden Isn't Conditional Rendering in React$md$,
  excerpt_ko = $md$className="hidden"으로 숨긴 컴포넌트가 여전히 JS를 실행하고 있었어요. display:none과 조건부 렌더링이 어떻게 다른지 정리했어요.$md$,
  excerpt_en = $md$A component hidden with className="hidden" was still running JavaScript. Here is how display:none differs from conditional rendering.$md$,
  content_ko = $md$## 발단

탭 UI를 만들면서 비활성 탭 내용을 숨기려고 이렇게 작성했어요.

```
<div className={activeTab === 'list' ? '' : 'hidden'}>
  <DataTable data={items.map(item => processItem(item))} />
</div>
```

화면에서는 잘 숨겨졌어요. 그런데 콘솔 경고가 계속 떴고, 성능 프로파일을 보니 숨겨진 탭의 연산이 그대로 실행되고 있었어요.

## 원인

CSS `display: none`은 요소를 화면에서 숨길 뿐이에요. 브라우저가 레이아웃 계산은 건너뛰지만 JavaScript 실행까지 막지는 않아요.

JSX는 브라우저가 화면을 그리기 전에 평가(evaluate)돼요. 그래서 `className="hidden"`이 붙어 있어도 이런 일이 일어나요.

- `items.map(item => processItem(item))`가 실행됨
- 컴포넌트가 마운트됨
- 컴포넌트 안의 `useEffect`가 실행됨
- API 호출이 발생할 수 있음

눈에 안 보일 뿐 JS 연산은 전부 돌아가고 있었던 거예요.

## 과정과 탐색

처음엔 `hidden`이라는 클래스 이름이 문제인가 싶었어요. Tailwind의 `hidden`은 `display: none !important`라서 뭔가 다르게 동작할 줄 알았는데, CSS로 어떻게 숨기든 JS 실행과는 상관이 없었어요.

React DevTools로 컴포넌트 트리를 보니 숨겨진 탭의 컴포넌트가 마운트된 채로 있었어요. 그 안의 `useEffect`가 데이터를 fetch하고 있었고요.

```
// 이건 숨겨도 여전히 실행됨
<div className="hidden">
  <HeavyComponent /> {/* 마운트됨, useEffect 실행됨 */}
</div>
```

## 해결 방안

조건부 렌더링을 써야 해요. JSX 단락 평가(short-circuit evaluation)를 쓰면 조건이 `false`일 때 컴포넌트가 아예 마운트되지 않아요.

```
{/* 단락 평가: false면 아무것도 마운트되지 않음 */}
{activeTab === 'list' && (
  <DataTable data={items.map(item => processItem(item))} />
)}

{/* 또는 삼항 연산자 */}
{activeTab === 'list' ? (
  <DataTable data={items.map(item => processItem(item))} />
) : null}
```

조건이 `false`면 React는 해당 컴포넌트를 DOM에 마운트하지 않아요. 그러니 `useEffect`도 실행되지 않고 `.map()`도 호출되지 않아요.

## 주의사항

조건부 렌더링을 쓰면 탭을 바꿀 때마다 컴포넌트가 언마운트됐다가 다시 마운트되고, 내부 상태도 초기화돼요. 탭 사이에서 상태를 유지해야 한다면 선택지는 두 가지예요.

```
// 1. 상태를 상위 컴포넌트로 올리기 (lifting state up)
const [listData, setListData] = useState([]);
// 상위에서 관리하고 props로 내려주기

// 2. CSS로 숨기되, 비용이 큰 연산은 조건부로 처리
<div className={activeTab === 'list' ? '' : 'hidden'}>
  <DataTable data={activeTab === 'list' ? items.map(processItem) : []} />
</div>
```

상태 유지가 중요하지 않다면 조건부 렌더링이 성능 면에서 유리해요. 무거운 컴포넌트가 쓸데없이 마운트되지 않으니까요.

## 배운 점

CSS는 화면에 무엇을 보여줄지를 정하고, React 조건부 렌더링은 무엇을 DOM에 둘지를 정해요. 두 개념은 서로 다른 레이어에서 동작해요.

CSS로 숨기면 눈에 안 보일 뿐이고, 조건부 렌더링을 쓰면 아예 존재하지 않아요. 앞으로 무거운 컴포넌트를 숨길 때는 보이는지보다 마운트되는지부터 확인하려고 해요.$md$,
  content_en = $md$## The Problem

While building a tab UI, I wrote this to hide the inactive tab's content:

```
<div className={activeTab === 'list' ? '' : 'hidden'}>
  <DataTable data={items.map(item => processItem(item))} />
</div>
```

It looked hidden on screen. But warnings kept showing up in the console, and the performance profiler showed the hidden tab's computations were still running.

## The Cause

CSS `display: none` only hides an element visually. The browser skips layout for it, but that does nothing to stop JavaScript from running.

JSX is evaluated before the browser paints the screen. So even with `className="hidden"`:

- `items.map(item => processItem(item))` still executes
- Components still mount
- `useEffect` inside components still runs
- API calls can still fire

You can't see it, but all of that JavaScript is running anyway.

## Investigation

At first I wondered if the class name was the issue. Tailwind's `hidden` is `display: none !important`, so I thought it might behave differently. It doesn't. However CSS hides something, it has nothing to do with whether JS runs.

In React DevTools, the hidden tab's components were mounted and sitting in the tree, and their `useEffect` hooks were fetching data.

```
// Still runs even when hidden
<div className="hidden">
  <HeavyComponent /> {/* Mounted, useEffect fires */}
</div>
```

## Solution

Use conditional rendering. With JSX short-circuit evaluation, the component never mounts when the condition is `false`:

```
{/* Short-circuit: nothing mounts when false */}
{activeTab === 'list' && (
  <DataTable data={items.map(item => processItem(item))} />
)}

{/* Or ternary */}
{activeTab === 'list' ? (
  <DataTable data={items.map(item => processItem(item))} />
) : null}
```

When the condition is `false`, React doesn't mount the component to the DOM at all. So `useEffect` doesn't run, and `.map()` doesn't get called.

## Caveats

With conditional rendering, components unmount and remount on every tab switch, so their internal state resets. If you need to keep state between tabs, you have two options:

```
// 1. Lift state up
const [listData, setListData] = useState([]);
// Manage at parent level, pass down as props

// 2. Keep CSS hiding, but make expensive operations conditional
<div className={activeTab === 'list' ? '' : 'hidden'}>
  <DataTable data={activeTab === 'list' ? items.map(processItem) : []} />
</div>
```

When you don't need to keep state, conditional rendering performs better because heavy components don't mount for nothing.

## Lessons Learned

CSS controls what gets shown on screen. React conditional rendering controls what exists in the DOM. They work at different layers.

Hiding with CSS makes something invisible. Conditional rendering makes it not exist. Next time I hide a heavy component, I'll check whether it mounts, not just whether it shows.$md$,
  updated_at = now()
WHERE id = 'hidden-div-react-rendering';

UPDATE blog_posts SET
  title_ko = $md$애니메이션을 넣기 전에 '이걸 빼면 뭘 잃지?'부터 물어봐요$md$,
  title_en = $md$Before Adding Animation, Ask What You'd Lose Without It$md$,
  excerpt_ko = $md$포트폴리오 히어로 파티클 애니메이션을 만들면서 고민한 것들과, 기능적 애니메이션과 표현적 애니메이션을 어떻게 구분하는지 정리했어요.$md$,
  excerpt_en = $md$What I thought about while building the portfolio hero particle animation, and how I tell functional animation apart from expressive animation.$md$,
  content_ko = $md$## 배경

이 포트폴리오 사이트의 히어로 섹션을 만들면서 애니메이션에 꽤 오랜 시간을 썼어요. 얼굴 이미지가 파티클로 분해되고, 인사말로 모였다가 흩어지고, 텍스트로 다시 모인 다음 마지막에 별처럼 날아가는 스크롤 기반 애니메이션이에요.

완성하고 나서 뿌듯했지만 한편으로 '이게 정말 필요한가?' 싶었어요. 멋있긴 한데, 포트폴리오를 보러 온 사람이 원하는 건 프로젝트 경력과 기술 스택이지 애니메이션 구경은 아니니까요.

이 질문을 붙잡고 있다 보니 애니메이션에 대한 생각이 정리됐어요.

## 과정과 탐색

저는 애니메이션을 크게 두 종류로 나눠서 봐요.

하나는 기능적 애니메이션이에요. 페이지 전환, 모달 열기/닫기, 데이터 로딩, 토스트 알림 같은 곳에 붙는 애니메이션이요. 이건 장식보다 정보에 가까워요. 모달이 아래에서 올라오면 사용자는 새 레이어가 위에 생겼다는 걸 바로 알아채요. 이런 애니메이션이 없으면 화면이 갑자기 바뀌는 느낌이 들고, 사용자는 지금 상태를 파악하는 데 인지 비용을 써야 해요.

기능적 애니메이션에는 주로 이런 기준을 써요.

```css
/* 상태 전환 (hover, focus, color change) */
transition: 150ms ease;

/* 요소 등장/퇴장 (modal, dropdown, toast) */
transition: 200ms ~ 300ms ease-out;

/* 레이아웃 변경 (accordion, expand/collapse) */
transition: 300ms ~ 400ms ease-in-out;
```

150ms보다 짧으면 변화를 알아차리기 어렵고, 400ms보다 길면 느리다고 느껴요. 이 범위 안에서 성격에 맞게 고르면 대부분 자연스러워요.

다른 하나는 표현적 애니메이션이에요. 이 포트폴리오의 히어로 파티클 같은 거요. 기능적으로는 없어도 되지만 감정이나 인상을 전달해요. 그래서 넣을지 말지 기준이 분명해야 한다고 생각해요.

제 기준은 "이 애니메이션을 빼면 사용자가 뭘 잃는가?"예요.

히어로 파티클은 빼면 '이 개발자는 인터랙티브한 걸 만들 수 있구나' 하는 첫인상이 사라져요. 프론트엔드 포트폴리오에서는 첫 화면 인상이 중요하다고 봤고, 그래서 넣었어요. 반대로 프로젝트 목록 페이지에 화려한 진입 애니메이션을 넣을지 고민했을 때는 빼도 잃을 게 없다고 판단해서 간단한 fade-up만 남겼어요.

## 성능과 접근성

표현적 애니메이션을 넣기로 했다면 따라오는 책임이 있어요.

먼저 60fps를 유지해야 해요. Canvas나 requestAnimationFrame을 쓸 때 파티클이 많으면 저사양 기기에서 프레임이 떨어져요. 이 사이트에서는 파티클 수를 최대 5000개로 제한하고, 위치 데이터를 Float32Array로 관리해서 GC 부담을 줄였어요.

모션에 민감한 사용자도 고려해야 해요. prefers-reduced-motion 미디어 쿼리가 있으면 애니메이션을 줄이거나 정적인 화면으로 바꿔야 해요. 접근성에서 기본으로 챙겨야 하는 부분이에요.

로딩 성능에 영향을 줘서도 안 돼요. 애니메이션 라이브러리가 번들 사이즈를 100KB 늘린다면, 그 애니메이션이 100KB만큼의 값어치를 하는지 따져봐야 해요. 이 사이트의 히어로 애니메이션은 번들 영향을 줄이려고 외부 라이브러리 없이 순수 Canvas API로 만들었어요.

## 배운 점

애니메이션을 넣을 때 제가 먼저 묻는 건 얼마나 멋있게 만들지보다 왜 여기에 있어야 하는지예요. 기능적 애니메이션은 사용성을 높이고, 표현적 애니메이션은 인상을 남겨요. 어느 쪽이든 목적 없이 넣으면 소음이 돼요.

제가 바라는 건 사용자가 애니메이션이 있었다는 걸 의식하지 못할 만큼 자연스러운 인터랙션이에요.$md$,
  content_en = $md$## Background

I spent a lot of time on animation while building the hero section of this portfolio site. The face image breaks into particles, gathers into a greeting, scatters, reassembles into text, and finally flies off like stars. It's a fairly involved scroll-driven animation.

I was proud of it when it was done, but I also caught myself asking whether it was necessary. It looks cool, but people visiting a portfolio want to see project experience and tech stacks, not watch an animation.

Sitting with that question helped me sort out how I think about animation.

## Process and Exploration

I split animations into two broad groups.

The first is functional animation: the kind attached to page transitions, modals opening and closing, data loading, and toast notifications. These are closer to information than decoration. When a modal slides up from the bottom, users understand right away that a new layer has appeared on top. Without that motion the screen seems to change abruptly, and users have to spend effort working out the current state.

For functional animations I usually go by these numbers.

```css
/* State transitions (hover, focus, color change) */
transition: 150ms ease;

/* Element enter/exit (modal, dropdown, toast) */
transition: 200ms ~ 300ms ease-out;

/* Layout changes (accordion, expand/collapse) */
transition: 300ms ~ 400ms ease-in-out;
```

Shorter than 150ms and the change is hard to notice; longer than 400ms and it feels slow. Picking within this range based on the kind of interaction feels natural in most cases.

The second is expressive animation, like the hero particles on this portfolio. You could remove it without breaking anything, but it carries a mood or an impression. That's why I think the bar for including it should be clear.

My test is simple: "If I remove this animation, what does the user lose?"

Without the hero particles, the first impression of "this developer can build interactive things" disappears. For a frontend portfolio I decided that first screen matters, so I kept it. When I considered a flashy entrance animation for the project list page, though, nothing would be lost without it, so I kept only a simple fade-up.

## Performance and Accessibility

Once you decide to use expressive animation, some responsibilities come with it.

Keep it at 60fps. With Canvas or requestAnimationFrame and lots of particles, low-end devices start dropping frames. On this site I capped the particle count at 5,000 and stored position data in a Float32Array to reduce GC overhead.

Think about motion-sensitive users. If prefers-reduced-motion is set, animations should be reduced or replaced with something static. That's basic accessibility.

Don't hurt loading performance. If an animation library adds 100KB to the bundle, ask whether the animation is worth 100KB. I built the hero animation here with the plain Canvas API and no external libraries, specifically to keep the bundle impact small.

## Lessons Learned

When I add animation now, the first question is why it belongs there, before how good it looks. Functional animations improve usability, expressive ones leave an impression, and either kind turns into noise when it has no purpose.

What I'm aiming for is interaction so natural that users don't notice there was an animation at all.$md$,
  updated_at = now()
WHERE id = 'design-animation-philosophy';

UPDATE blog_posts SET
  title_ko = $md$사용자는 '예쁜 화면'이 아니라 '다음에 뭘 해야 하는지'를 원해요$md$,
  title_en = $md$Users Want to Know What to Do Next, Not Just See Pretty Screens$md$,
  excerpt_ko = $md$보기엔 만족스러웠던 상품 페이지에서 사용자들이 구매 버튼을 못 찾는 걸 보고, 화면을 설계할 때 처음 던지는 질문을 바꿨어요.$md$,
  excerpt_en = $md$After users struggled to find the buy button on a product page I was happy with visually, I changed the first question I ask when designing a screen.$md$,
  content_ko = $md$## 배경

WinnTicket 쇼핑몰 화면을 만들 때 있었던 일이에요. 첫 번째 버전에서 상품 상세 페이지를 꽤 신경 써서 만들었어요. 큰 이미지에 깔끔한 타이포그래피, 여유 있는 레이아웃이었죠. 보기에는 만족스러웠는데, 실제로 테스트해 보니 사용자들이 '구매하기' 버튼을 찾는 데 시간이 걸렸어요.

이유를 따져보니 페이지가 보여주기에 맞춰져 있었고, 행동하기에는 맞춰져 있지 않았어요. 상품 설명은 예쁘게 정리돼 있는데 정작 '이걸 사려면 어디를 눌러야 하지?'가 바로 보이지 않았던 거예요.

## 과정과 탐색

그 뒤로 화면을 설계할 때 처음 던지는 질문이 바뀌었어요.

- 예전: "이 화면에 어떤 정보를 보여줄까?"
- 지금: "사용자가 이 화면에서 할 행동은 뭘까?"

상품 상세 페이지라면 사용자의 행동은 '구매하기' 또는 '옵션 선택하기'예요. 그러면 그 행동으로 가는 길이 가장 분명해야 해요. 정보는 그 행동을 돕는 역할이고, 그 자체가 목적은 아니에요.

이 관점으로 다시 설계하니 구조가 많이 달라졌어요.

CTA(Call to Action) 위치부터 정했어요. 모바일에서는 하단 고정, 데스크톱에서는 우측 사이드 고정이에요. 스크롤을 아무리 내려도 '구매하기' 버튼이 항상 보이게 했어요.

정보 순서는 행동을 기준으로 다시 배치했어요. 사용자가 구매를 결정하는 데 필요한 순서에 맞춰 가격, 옵션, 주요 특징, 상세 설명, 리뷰 순으로 바꿨어요. 상세 설명은 보기엔 좋지만 실제로 끝까지 읽는 사용자는 많지 않아요.

시각적 무게도 행동 쪽으로 몰았어요. '구매하기' 버튼은 primary 색상에 큰 사이즈로, '장바구니' 버튼은 outlined로 했어요. 두 버튼이 같은 크기에 같은 스타일이면 사용자가 0.5초 더 고민하게 되고, 그 0.5초가 전환율에 영향을 줘요.

## 다른 화면에도 적용한 사례

이 원칙을 다른 화면에도 적용해 봤어요.

관리자 대시보드에서 사용자가 할 일은 '오늘 처리할 것 확인하기'예요. 그래서 미처리 주문 수와 오늘 문의 수를 맨 위에 큰 숫자로 두고, 그래프와 통계는 그 아래에 넣었어요.

통인익스프레스의 계약 관리 화면에서는 '다음 단계로 넘기기'가 사용자의 행동이에요. 그래서 계약 상태별 진행 바를 상단에 두고, '다음 단계' 버튼을 가장 눈에 띄는 곳에 배치했어요.

이 포트폴리오에서 방문자가 할 행동은 '프로젝트 보기' 아니면 '연락하기'예요. 그래서 히어로 섹션 바로 다음에 프로젝트가 나오고, 연락 버튼은 플로팅으로 띄워 언제든 누를 수 있게 했어요.

어떤 화면이든 사용자의 다음 행동을 먼저 정하면 레이아웃은 따라왔어요.

## 배운 점

화면을 '어떻게 보일까'만 생각하고 만들면 갤러리가 되고, '어떻게 쓰일까'까지 생각하면 서비스가 돼요. 포트폴리오도 마찬가지예요. 프로젝트 카드를 예쁘게 다듬는 것보다, 클릭했을 때 궁금한 정보가 바로 보이는 게 더 중요했어요.$md$,
  content_en = $md$## Background

This happened while I was building the WinnTicket shopping mall screens. In the first version I put a lot of care into the product detail page: large images, clean typography, a roomy layout. I was happy with how it looked, but when we tested it, users took a while to find the "Buy Now" button.

Looking into why, I realized the page was built for showing, not for doing. The product descriptions were neatly laid out, but "Where do I click to buy this?" wasn't obvious.

## Investigation

After that, the first question I ask when designing a screen changed.

- Before: "What information should I show on this screen?"
- Now: "What action will the user take on this screen?"

On a product detail page, the user's action is "Buy" or "Select Options," so the path to that action has to be the clearest thing on the page. Information is there to support the action. It isn't the goal.

Redesigning from that angle changed the structure a lot.

I placed the CTA (Call to Action) first. It's fixed to the bottom on mobile and to the right side on desktop. However far you scroll, the "Buy Now" button stays visible.

I reordered the information around the action, following the order people need to make a purchase decision: price, options, key features, detailed description, then reviews. The detailed description looks nice, but not many users read it to the end.

I put the visual weight on the action. "Buy Now" got the primary color and a large size, and "Add to Cart" was outlined. If both buttons share the same size and style, users hesitate for an extra 0.5 seconds, and that 0.5 seconds affects conversion rates.

## Applied to Other Screens

I applied the same principle to other screens.

On the admin dashboard, the user's action is "Check what needs handling today." So the number of unprocessed orders and today's inquiries sit at the very top in large numbers, with charts and statistics below.

On the contract management screen (Tongin Express), the user's action is "Move to the next step." So a progress bar by contract status sits at the top, and the "Next Step" button is in the most prominent spot.

On this portfolio, a visitor's action is "View projects" or "Get in touch." So projects come right after the hero section, and the contact button floats so it's always within reach.

On every screen, once I'd defined the user's next action, the layout followed.

## Lessons Learned

If you only think about how a screen looks, you end up with a gallery. If you also think about how it's used, you end up with a service. Portfolios are no different: making project cards pretty mattered less than making sure people see what they're curious about as soon as they click.$md$,
  updated_at = now()
WHERE id = 'design-user-action';

UPDATE blog_posts SET
  title_ko = $md$트리 구조 기반 사용자/자산 관리 화면 구현 경험$md$,
  title_en = $md$Tree-Based User/Asset Management UI Implementation Experience$md$,
  excerpt_ko = $md$Lazy-loading, 자동 확장, 양방향 동기화가 얽힌 트리 UI를 만들면서 노드 상태를 어떻게 나눠 관리했는지 정리했어요.$md$,
  excerpt_en = $md$Notes from building a tree UI that needed lazy-loading, auto-expansion, and two-way sync, and how I split state per node to keep it under control.$md$,
  content_ko = $md$## 배경

프로젝트에서 사용자나 디바이스 데이터를 조직 구조 트리로 보여줘야 했어요. 트리를 그리기만 하면 되는 게 아니라 요구사항이 꽤 많았어요.

- 상위 노드를 펼치면 하위 노드를 API로 Lazy-loading
- 특정 유저를 클릭하면 트리가 해당 노드까지 자동으로 펼쳐짐
- 같은 노드에 대한 중복 요청 방지
- 트리 선택 상태를 테이블, 상세 패널 같은 외부 컴포넌트와 양방향으로 동기화
- 데이터가 수천 개 단위여도 렌더링 성능 유지

재귀 렌더링만으로는 감당이 안 돼서, 트리 상태를 어떻게 관리할지 따로 고민해야 했어요.

## 진행 과정

### a. 처음 시도한 단순 재귀 렌더링

처음엔 기본 `<a-tree>` 컴포넌트를 그대로 썼어요.

```
<a-tree
  :load-data="onTreeNodeLoad"
  :tree-data="treeData"
  @select="onSelect"
/>
```

노드를 펼칠 때마다 API를 호출하는 단순한 구조였는데, 금방 문제가 생겼어요.

- 같은 노드를 다시 클릭하면 중복 호출
- 하위 노드가 쌓이면서 중복 렌더링
- 다른 컴포넌트에서 유저를 클릭하면 해당 노드를 찾지 못함
- Lazy-loading 도중에 확장 명령이 들어오면 트리 구조가 깨짐

비동기 순서 문제와 중복 상태 관리가 한데 얽혀 있었어요.

### b. 원인 분석

가장 큰 원인은 트리 데이터와 로딩 상태를 나눠 두지 않은 데 있었어요. `treeData` 배열만 관리하다 보니 각 노드에 대해 아래 내용을 판단할 방법이 없었어요.

1. 로딩 중인지
2. 이미 불러온 적이 있는지
3. 확장 가능한지

그래서 트리 확장, 비동기 로딩, 선택 노드 탐색이 이 순서대로 일어난다는 보장이 없었어요. 부모 노드가 아직 로드되지 않았는데 자식 노드를 찾으려다 실패하는 경우가 많았어요.

### c. 노드 상태 관리와 Lazy-loading 제어

먼저 노드가 자기 상태를 직접 갖도록 모델링했어요.

```
interface TreeNode {
  id: string
  name: string
  children?: TreeNode[]
  loaded?: boolean
  loading?: boolean
  expanded?: boolean
  parentId?: string
}
```

이 모델을 기준으로 Lazy-loading 로직을 고쳤어요.

```
const onTreeNodeLoad = async (node: TreeNode) => {
  if (node.loaded) return // 이미 불러온 노드는 재호출 X
  node.loading = true
  const data = await api.getChildren(node.id)
  node.children = data
  node.loaded = true
  node.loading = false
}
```

이렇게 바꾸고 나니 중복 로딩이 없어졌고, Lazy-loading 순서와 비동기 꼬임도 제어할 수 있었어요.

### d. 자동 확장 로직

다음은 테이블에서 유저를 클릭하면 트리에서 그 노드까지 자동으로 펼치는 기능이었어요. 상위 노드가 아직 로드되지 않았을 수 있다는 게 걸림돌이었고, 그래서 경로를 따라 내려가며 비동기로 탐색하는 로직을 만들었어요.

```
const expandToUserNode = async (pathIds: string[]) => {
  let currentLevel = treeData
  for (const id of pathIds) {
    const node = currentLevel.find(n => n.id === id)
    if (!node) break
    if (!node.loaded) await onTreeNodeLoad(node)
    node.expanded = true
    currentLevel = node.children || []
  }
}
```

부모부터 자식 순서로 Lazy-load를 하면서 트리를 펼치기 때문에, 사용자가 클릭한 유저까지 정확히 열려요.

### e. 트리와 테이블 상태 동기화

트리에서 고른 유저가 테이블에 반영되고, 테이블에서 유저를 클릭하면 트리에서도 그 노드가 선택돼야 했어요. 그래서 선택 상태를 composable 단일 인스턴스로 공유했어요.

```
// composables/useTreeSelection.ts
import { ref } from 'vue'

let _state: { selectedUserId: string | null }

export const useTreeSelection = () => {
  if (!_state) _state = { selectedUserId: null }

  const selectedUserId = ref(_state.selectedUserId)
  const selectUser = (id: string | null) => {
    _state.selectedUserId = id
    selectedUserId.value = id
  }

  return { selectedUserId, selectUser }
}
```

트리와 테이블 양쪽에서 이 composable을 불러와 `inject`처럼 썼어요.

- 트리에서 노드 클릭: `selectUser(node.id)`
- 테이블에서 행 클릭: `selectUser(record.id)`

양쪽이 같은 상태를 바라보니 선택이 양방향으로 맞춰졌어요.

## 결과

노드가 많아도 렌더링이 부드럽게 유지됐고 네트워크 호출 횟수도 줄었어요. 자동 확장과 선택도 정확하게 동작했어요.

## 돌아보며

트리 UI는 데이터를 계층으로 그리는 일보다, 데이터 로딩과 확장과 선택 상태가 서로 얽힌 상태 관리 문제에 가까웠어요. Vue의 반응형 구조는 단순하게 두고 상태를 노드 단위로 나눠 제어한 게 효과가 있었어요. 다음에 비슷한 트리를 만들면 알아서 돌아가는 자동화보다 제가 직접 제어할 수 있는 구조부터 잡으려고 해요.$md$,
  content_en = $md$## Background

The project needed user or device data shown as an organizational tree. Drawing the tree was the easy part. The requirements went further:

- Lazy-load child nodes from the API when a parent is expanded
- Clicking a specific user auto-expands the tree down to that node
- No duplicate requests for the same node
- Keep tree selection in sync both ways with outside components like tables and detail panels
- Keep rendering smooth even with thousands of entries

Plain recursive rendering couldn't handle all of that, so I had to think through how to manage the tree's state.

## Process

### a. Starting with Simple Recursive Rendering

At first I used the basic `<a-tree>` component as is.

```
<a-tree
  :load-data="onTreeNodeLoad"
  :tree-data="treeData"
  @select="onSelect"
/>
```

Every time a node was expanded it called the API. Simple enough, but problems showed up quickly:

- Clicking the same node again fired duplicate calls
- Child nodes piled up and rendered twice
- Clicking a user from another component couldn't find the matching node
- An expand command arriving during lazy-loading broke the tree structure

Async ordering and duplicated state had gotten tangled together.

### b. Root Cause

The main cause was that tree data and loading state weren't kept separate. I was only managing a `treeData` array, so for any given node I couldn't tell:

1. Whether it's currently loading
2. Whether it's already been loaded
3. Whether it's expandable

That meant nothing guaranteed the order of tree expansion, then async loading, then searching for the selected node. I often ended up looking for a child node before its parent had loaded.

### c. Node State and Lazy-loading Control

First, I modeled each node so it carries its own state:

```
interface TreeNode {
  id: string
  name: string
  children?: TreeNode[]
  loaded?: boolean
  loading?: boolean
  expanded?: boolean
  parentId?: string
}
```

Then I changed the lazy-loading logic to work like this:

```
const onTreeNodeLoad = async (node: TreeNode) => {
  if (node.loaded) return // Don't reload already loaded nodes
  node.loading = true
  const data = await api.getChildren(node.id)
  node.children = data
  node.loaded = true
  node.loading = false
}
```

After this change, duplicate loads went away and I could control both the loading order and the async timing.

### d. Auto-expansion

Next was auto-expanding the tree to a user clicked in the table. Parent nodes might not be loaded yet, so I wrote a path-based async search that walks down level by level:

```
const expandToUserNode = async (pathIds: string[]) => {
  let currentLevel = treeData
  for (const id of pathIds) {
    const node = currentLevel.find(n => n.id === id)
    if (!node) break
    if (!node.loaded) await onTreeNodeLoad(node)
    node.expanded = true
    currentLevel = node.children || []
  }
}
```

It lazy-loads from parent to child in order while expanding, so the tree opens exactly down to the clicked user.

### e. Syncing the Tree with the Table

A user selected in the tree had to show up in the table, and clicking a user in the table had to select the same node in the tree. I shared the selection state through a single composable instance:

```
// composables/useTreeSelection.ts
import { ref } from 'vue'

let _state: { selectedUserId: string | null }

export const useTreeSelection = () => {
  if (!_state) _state = { selectedUserId: null }

  const selectedUserId = ref(_state.selectedUserId)
  const selectUser = (id: string | null) => {
    _state.selectedUserId = id
    selectedUserId.value = id
  }

  return { selectedUserId, selectUser }
}
```

Both the tree and the table import it, and I used it a bit like dependency injection:

- Tree node click: `selectUser(node.id)`
- Table row click: `selectUser(record.id)`

Since both sides read the same state, selection stays in sync in both directions.

## Results

Rendering stayed smooth even with many nodes, and the number of network calls dropped. Auto-expansion and selection both behaved accurately.

## Looking Back

Tree UI turned out to be less about drawing hierarchical data and more about state management, with loading, expansion, and selection all tangled together. Keeping Vue's reactivity simple and splitting state per node is what worked. Next time I build a tree like this, I'll start from a structure I can control directly rather than one that tries to automate everything.$md$,
  updated_at = now()
WHERE id = 'tree-structure-management';

UPDATE blog_posts SET
  title_ko = $md$공통 유틸/컴포저블 분리 사례$md$,
  title_en = $md$Common Utility/Composable Separation Case Study$md$,
  excerpt_ko = $md$i18n 처리, 권한 체크, 파일 포맷, 아이콘 스타일처럼 화면마다 중복되던 로직을 명시적으로 호출하는 유틸/컴포저블로 분리한 기록이에요.$md$,
  excerpt_en = $md$How I pulled duplicated logic (i18n handling, permission checks, file formats, icon styles) out of individual screens into explicitly called utils and composables.$md$,
  content_ko = $md$## 배경

i18n 접미사 처리, 권한 체크, 파일 유형/용량 포맷, 아이콘 스타일 같은 로직이 여러 화면에 중복돼 있었어요. 페이지마다 조금씩 달라서 UX와 정책도 서로 맞지 않았어요.

- 화면마다 표현이 조금씩 달라 UX가 일관되지 않았어요.
- 로직이 템플릿에 섞여 있어서 읽기도 테스트하기도 어려웠고, 고칠 때마다 손댈 범위가 넓었어요.
- 팀 컨벤션상 `watch` 없이 onMounted 순서 제어와 arrow 함수 명시 호출을 지향했기 때문에, 흩어진 로직을 명시적으로 호출할 수 있는 유틸/컴포저블로 정리할 필요가 있었어요.

## 진행 과정

### A. i18n 옵션 문자열 빌더 (useBuildOptionText)

선택 옵션 뒤에 "Page/쪽" 같은 고정 접미사를 화면마다 제각각 붙이다 보니 다국어 표기가 어긋났어요.

그래서 Nuxt의 `useNuxtApp()`에서 i18n 인스턴스를 받아, 라벨 만드는 일을 함수 하나로 모았어요.

```
const nuxtApp = useNuxtApp()
const buildOptionText = (text) => {
  const t = nuxtApp.$i18n.t
  return `${text.value} ${t('Page')}`
}
export const useBuildOptionText = () => buildOptionText
```

템플릿에서는 `useBuildOptionText()(option)` 한 줄이면 돼요. 문구와 포맷이 통일됐고 SSR/CSR 환경에서도 안전하게 동작했어요.

### B. 메뉴 권한 탐색 (useFindPermissionValue, useFindPermissionValueInput)

버튼, 입력, 라우팅에서 권한 분기가 중복됐고, 트리 하위 메뉴 권한을 찾으려고 화면마다 재귀를 새로 구현하고 있었어요.

`useMenuItemTree().value`를 기본 트리로 두고, 재귀 탐색을 composable 하나로 감쌌어요.

```
export const useFindPermissionValue = (menuId, type, menuPage = useMenuItemTree().value) => {
  // 재귀 탐색, Y → false / N → true
}
export const useFindPermissionValueInput = (menuId, type, menuPage = useMenuItemTree().value) => {
  // 재귀 탐색, Y → true / N → false
}
```

- 기본값은 전역 트리지만, 테스트 환경에서는 원하는 트리를 넘길 수 있어요.
- Y/N 기준은 주석으로 적어 뒀어요. 이름을 `shouldHide`, `canUse`처럼 나누는 것도 권장해요.

권한 로직이 한 곳으로 모이면서 화면별 분기와 예외 처리가 많이 줄었어요.

### C. 파일 유형·용량 포맷 (useMimetypeCheck, useFileSizeFormat)

업로드와 미리보기에서 mimetype, 확장자, 사이즈 포맷이 제각각이라 UI가 들쭉날쭉했고 버그도 자주 났어요.

- `useMimetypeCheck(mimetype, ext)`: 확장자 우선 규칙으로 정수 타입 코드를 반환해요 (0: unknown, 1: text, 2: image, 3: pdf, 4: office 등).
- `useFileSizeFormat(bytes)`: 1024 단위 포맷(소수점 2자리)으로 변환해요.

```
export const useMimetypeCheck = (mimetype, fileExtension) => { /* 우선순위 + 정규식 매핑 */ }
export const useFileSizeFormat = (size) => { /* 1024 단위 포맷 */ }
```

미리보기, 아이콘, 버튼 활성화 로직이 같은 결과값(타입 코드, 포맷 문자열)을 쓰게 되면서 UI와 정책이 서로 맞아떨어졌어요.

### D. 아이콘 표준화와 useIcon (iconPack / getIconColor)

아이콘 색상, 크기, 여백이 화면마다 인라인으로 따로 지정돼 있어서 디자인 드리프트가 심했어요.

`iconPack`에 이름별 메타데이터(iconName, color, size, marginRight)를 선언하고, 컴포넌트 하나에서만 관리하게 했어요. props가 들어오면 그 값을 먼저 쓰고, 없으면 pack 기본값을 써요. `disabledType`일 때는 회색으로 고정돼요.

```
<Icon
  :name="`my-icon:${iconPack[name].iconName}`"
  :size="computedSize"
  :style="`color:${computedColor}`"
/>
```

테마를 바꿀 땐 iconPack만 고치면 전체에 반영되고, 템플릿에는 의미 있는 이름만 남아서 코드 읽기가 쉬워졌어요.

## 결과

중복이 줄고 유지보수가 편해졌어요. i18n 접미사, 권한 처리, 파일 표기, 아이콘 스타일이 서비스 전체에서 같게 나오니 UX도 일관돼졌어요. 권한이나 포맷처럼 순수 함수에 가까운 composable은 단위 테스트가 쉬워졌고 회귀 버그도 줄었어요.

## 돌아보며

작은 유틸이라도 책임을 분명히 나눠 재사용할 수 있게 만들어 두면 프로젝트 전체 품질에 도움이 된다는 걸 다시 확인했어요. 명시적으로 함수를 호출하는 패턴이 watch보다 동작을 예측하기 쉽고 테스트와 유지보수도 수월하다는 건 팀 전체가 체감한 부분이에요.$md$,
  content_en = $md$## Background

The same logic (i18n suffix handling, permission checks, file type/size formatting, icon styles) was duplicated across multiple screens, and small differences from page to page left the UX and policies out of step with each other.

- Each screen expressed things slightly differently, so the UX wasn't consistent.
- Logic was mixed into templates, which hurt readability and testability, and any change meant a wide refactor.
- Our team convention favors controlling order with onMounted and calling arrow functions explicitly instead of using `watch`, so the scattered logic needed to become utils/composables you call explicitly.

## Process

### A. i18n Option String Builder (useBuildOptionText)

Each screen was tacking fixed suffixes like "Page/쪽" onto selection options in its own way, so the translations didn't line up.

I took the i18n instance from Nuxt's `useNuxtApp()` and moved label generation into a single function.

```
const nuxtApp = useNuxtApp()
const buildOptionText = (text) => {
  const t = nuxtApp.$i18n.t
  return `${text.value} ${t('Page')}`
}
export const useBuildOptionText = () => buildOptionText
```

In templates, `useBuildOptionText()(option)` is all it takes. Wording and format are now the same everywhere, and it works safely in both SSR and CSR.

### B. Menu Permission Search (useFindPermissionValue, useFindPermissionValueInput)

Permission branching was duplicated across buttons, inputs, and routing, and every screen reimplemented its own recursion to find permissions for submenus in the tree.

I used `useMenuItemTree().value` as the default tree and wrapped the recursive search in one composable.

```
export const useFindPermissionValue = (menuId, type, menuPage = useMenuItemTree().value) => {
  // Recursive search, Y → false / N → true
}
export const useFindPermissionValueInput = (menuId, type, menuPage = useMenuItemTree().value) => {
  // Recursive search, Y → true / N → false
}
```

- The global tree is the default, but tests can pass in any tree they want.
- The Y/N meaning is written down in comments. Splitting names like `shouldHide` and `canUse` is also recommended.

With permission logic in one place, screen-specific branching and exception handling went down a lot.

### C. File Type/Size Format (useMimetypeCheck, useFileSizeFormat)

Mimetype, extension, and size formatting differed between upload and preview, so the UI was inconsistent and bugs came up often.

- `useMimetypeCheck(mimetype, ext)` returns an integer type code using an extension-first rule (0: unknown, 1: text, 2: image, 3: pdf, 4: office, etc.)
- `useFileSizeFormat(bytes)` converts to a 1024-based format with 2 decimal places

```
export const useMimetypeCheck = (mimetype, fileExtension) => { /* Priority + regex mapping */ }
export const useFileSizeFormat = (size) => { /* 1024 unit format */ }
```

Preview, icon, and button-enable logic now share the same result values (type code, format string), so the UI and the policy finally match.

### D. Icon Standardization with useIcon (iconPack / getIconColor)

Icon colors, sizes, and margins were set inline and differently on each screen, and the design was drifting badly.

I declared metadata for each name (iconName, color, size, marginRight) in `iconPack` and managed it in a single component. Props win if they're passed; otherwise the pack defaults apply. For `disabledType`, the color is fixed to gray.

```
<Icon
  :name="`my-icon:${iconPack[name].iconName}`"
  :size="computedSize"
  :style="`color:${computedColor}`"
/>
```

Changing the theme now only means editing iconPack, and templates only carry meaningful names, which makes the code easier to read.

## Results

There's less duplication and maintenance is easier. i18n suffixes, permission handling, file notation, and icon styles look the same across the whole service, so the UX is consistent. Composables that are close to pure functions, like permissions and formatting, became easy to unit test, and regression bugs went down.

## Looking Back

This confirmed again that even small utilities pay off for the whole project when each one has a clear responsibility and is built for reuse. The whole team also noticed that explicit function calls are more predictable than watch, and easier to test and maintain.$md$,
  updated_at = now()
WHERE id = 'common-utils-composable';

UPDATE blog_posts SET
  title_ko = $md$API 응답 형식이 어긋나 터진 useMemo, undefined는 조용히 퍼져요$md$,
  title_en = $md$How an API Response Mismatch Crashed useMemo, and Why undefined Spreads Silently$md$,
  excerpt_ko = $md$API가 배열을 바로 반환하는데 response.data.content로 접근하면 undefined가 돼요. 그 undefined가 useMemo까지 흘러가 크래시를 낸 과정을 기록했어요.$md$,
  excerpt_en = $md$When an API returns an array directly but you read response.data.content, you get undefined. This is how that undefined made its way into useMemo and caused a crash.$md$,
  content_ko = $md$## 발단

특정 화면에서 갑자기 흰 화면이 떴어요. 콘솔에는 이런 에러가 찍혀 있었어요.

```
TypeError: Cannot read properties of undefined (reading 'filter')
  at useMemo (ProductList.tsx:34)
```

`useMemo` 안에서 `.filter()`를 호출했는데 대상이 `undefined`였어요.

## 원인

API 응답 형식이 예상과 달랐어요. 페이지네이션이 있는 API는 보통 이런 형식이에요.

```
// 예상한 응답 형식
{
  "content": [...],
  "totalPages": 10,
  "totalElements": 100
}
```

그래서 코드에서 `response.data.content`로 접근했는데, 이 API는 배열을 그대로 반환하고 있었어요.

```
// 실제 응답 형식
[
  { id: 1, name: "..." },
  { id: 2, name: "..." }
]
```

배열에는 `content` 프로퍼티가 없으니 `response.data.content`는 `undefined`가 돼요. 이 값이 상태에 저장되고, `useMemo`가 그걸 받아 `.filter()`를 호출하다가 크래시가 났어요.

## 추적 과정

에러 메시지만으로는 `undefined`가 어디서 왔는지 바로 알기 어려웠어요. `useMemo`가 API를 직접 부르는 게 아니라, 어딘가에서 넘어온 상태를 받아 쓰는 구조였거든요.

그래서 바이너리 서치 방식으로 범위를 좁혔어요. `window.__omStep`에 단계별로 값을 찍어서 어느 지점에서 `undefined`가 되는지 확인했어요.

```
// API 호출 직후
window.__omStep = 1;
window.__omData = response.data;
console.log('[step1] response.data:', response.data); // 배열 출력됨

// content 접근 후
window.__omStep = 2;
window.__omData = response.data.content;
console.log('[step2] content:', response.data.content); // undefined 출력됨
```

Step 2에서 `undefined`가 나왔어요. `response.data`는 정상이었고 `response.data.content`만 `undefined`였어요. API가 배열을 직접 반환하고 있었기 때문이에요.

이 `undefined`가 `useState`에 들어갔고, 렌더링 때 `useMemo`가 이 상태로 `.filter()`를 호출하다 터진 거였어요.

## 해결

응답이 배열인지 페이지네이션 형식인지 확인하는 코드를 넣었어요.

```
const fetchProducts = async () => {
  const response = await api.get('/products');

  // 응답 형식에 따라 분기
  const items = Array.isArray(response.data)
    ? response.data
    : response.data.content ?? [];

  setProducts(items);
};
```

`useMemo`에도 방어 코드를 추가했어요.

```
const filtered = useMemo(() => {
  if (!Array.isArray(products)) return [];
  return products.filter(p => p.status === 'active');
}, [products]);
```

## 결과

크래시가 사라지고 데이터가 제대로 렌더링됐어요. 방어 코드가 있으니 나중에 API 응답 형식이 바뀌어도 흰 화면 대신 빈 목록이 보여요.

## 돌아보며

`undefined`는 그 자리에서 에러를 던지지 않아요. 상태에 조용히 저장된 채 여러 컴포넌트를 거치다가 가장 마지막 지점에서 터져요. 에러가 난 곳과 원인이 생긴 곳이 달라서 추적이 어려웠어요.

그래서 API 연동 코드에서는 응답 형식을 너무 믿지 않으려고 해요. 백엔드와 약속한 형식이 맞는지 한 번 더 확인하고, `Array.isArray`나 옵셔널 체이닝으로 명시적으로 처리해 두면 이런 조용한 버그를 미리 막을 수 있어요.$md$,
  content_en = $md$## The Problem

A specific page suddenly went white. The console showed this:

```
TypeError: Cannot read properties of undefined (reading 'filter')
  at useMemo (ProductList.tsx:34)
```

`.filter()` was being called inside `useMemo` on something that was `undefined`.

## The Cause

The API response format wasn't what I expected. Paginated APIs usually return something like this:

```
// Expected response format
{
  "content": [...],
  "totalPages": 10,
  "totalElements": 100
}
```

So the code read `response.data.content`. But this particular API returned an array directly:

```
// Actual response format
[
  { id: 1, name: "..." },
  { id: 2, name: "..." }
]
```

Arrays don't have a `content` property, so `response.data.content` is `undefined`. That `undefined` got stored in state, `useMemo` picked it up and tried calling `.filter()`, and the page crashed.

## Investigation

The error message alone didn't tell me where `undefined` came from. `useMemo` wasn't calling the API itself. It was reading state that came from somewhere upstream.

I narrowed it down binary-search style, logging values into `window.__omStep` at each stage to see where `undefined` first appeared:

```
// Right after API call
window.__omStep = 1;
window.__omData = response.data;
console.log('[step1] response.data:', response.data); // Array printed

// After accessing .content
window.__omStep = 2;
window.__omData = response.data.content;
console.log('[step2] content:', response.data.content); // undefined printed
```

`undefined` showed up at step 2. `response.data` was fine, but `response.data.content` was `undefined` because the API returned an array directly.

That `undefined` went into `useState`, and during render `useMemo` took it and tried calling `.filter()`. Boom.

## Solution

I added a check for whether the response is an array or a paginated object:

```
const fetchProducts = async () => {
  const response = await api.get('/products');

  // Handle both response formats
  const items = Array.isArray(response.data)
    ? response.data
    : response.data.content ?? [];

  setProducts(items);
};
```

I also added a guard inside `useMemo`:

```
const filtered = useMemo(() => {
  if (!Array.isArray(products)) return [];
  return products.filter(p => p.status === 'active');
}, [products]);
```

## Result

The crash went away and the data rendered correctly. With the guard in place, if the API response format changes again, you'll get an empty list instead of a white screen.

## Looking Back

`undefined` doesn't throw right away. It sits quietly in state, passes through several components, and blows up at the last point downstream. The place where it fails and the place where it starts are different, which is what made it hard to trace.

So in API integration code I try not to trust response shapes too much. I double-check that the format matches what we agreed on with the backend, and handle it explicitly with `Array.isArray` or optional chaining. That habit stops this kind of silent bug before it turns into a white screen.$md$,
  updated_at = now()
WHERE id = 'api-mismatch-usememo-crash';

UPDATE blog_posts SET
  title_ko = $md$검색 필터 시스템 구현 경험$md$,
  title_en = $md$Search Filter System Implementation Experience$md$,
  excerpt_ko = $md$다중 조건 조합, 태그 시각화, 상태 유지가 필요한 필터 시스템을 만들면서 필터마다 상태를 따로 관리하도록 바꾼 과정을 정리했어요.$md$,
  excerpt_en = $md$Building a filter system with combined conditions, tag display, and persisted state, and why I ended up managing each filter's state on its own.$md$,
  content_ko = $md$## 배경

처음에는 단순한 조건 검색만 지원했는데, 프로젝트가 커지면서 요구사항이 늘었어요.

- 다중 조건(날짜, 상태, 사용자, 태그 등) 조합 검색
- 조건별 동적 추가/삭제
- 선택된 필터를 태그로 보여주고 바로 제거
- 페이지 이동이나 새로고침 후에도 검색 상태 유지
- API 쿼리와 UI 필터 동기화

## 문제

모든 필터를 reactive 객체 하나로 관리하고 있었어요.

```
const searchOption = reactive({
  keyword: '',
  dateRange: [],
  status: '',
  tags: []
})
```

처음엔 단순해 보였는데, 곧 문제가 드러났어요.

- 필터 하나만 바꿔도 전체 watch가 반응해서 불필요한 렌더링과 중복 호출이 생겼어요.
- router로 이동하면 빈 객체로 초기화돼서 필터 상태가 사라졌어요.
- 특정 필터만 지워도 전체 필터가 리셋됐어요.

부분 업데이트와 전체 초기화가 서로 부딪히는 구조였어요.

## 해결 과정

### 1. 필터별 독립 상태로 재설계

모든 필터가 객체 하나에 묶여 서로 의존하고 있는 게 문제였어요. 그래서 필터를 각각 따로 관리하는 useFilter composable을 만들었어요.

```
export const useFilter = () => {
  const keyword = ref('')
  const dateRange = ref<[string, string] | []>([])
  const status = ref('')
  const tags = ref<string[]>([])

  const resetField = (field: 'keyword' | 'dateRange' | 'status' | 'tags') => {
    if (field === 'keyword') keyword.value = ''
    else if (field === 'dateRange') dateRange.value = []
    else if (field === 'status') status.value = ''
    else if (field === 'tags') tags.value = []
  }

  const activeFilters = computed(() => ({
    ...(keyword.value && { keyword: keyword.value }),
    ...(dateRange.value.length && { dateRange: dateRange.value }),
    ...(status.value && { status: status.value }),
    ...(tags.value.length && { tags: tags.value })
  }))

  return { keyword, dateRange, status, tags, resetField, activeFilters }
}
```

이제 필터끼리 독립적으로 동작해서, 특정 필터만 초기화해도 다른 필터는 그대로예요.

### 2. 검색 태그

선택된 필터를 태그로 보여주고, 닫기 버튼으로 해당 필터를 지울 수 있게 했어요.

```
<a-tag
  v-for="(value, key) in activeFilters"
  :key="key"
  closable
  @close="resetField(key)"
>
  {{ key }}: {{ value }}
</a-tag>
```

어떤 필터가 걸려 있는지 보고 그 자리에서 지울 수 있으니 조작이 자연스러워졌어요.

## 결과

- 필터를 추가하거나 지울 때 상태가 꼬이지 않아요.
- 페이지 이동이나 새로고침 후에도 상태가 유지돼요.
- 불필요한 렌더링과 API 호출이 줄었어요.
- 테스트와 유지보수가 쉬워졌어요.

## 돌아보며

UI, 상태, 라우터는 각자 책임을 나눠 따로 두는 편이 낫다는 걸 이번에 체감했어요. UI가 복잡할수록 서로의 관계를 느슨하게 만들어 둬야 유지보수가 편했어요. 트리 구조 작업도, 이번 필터 작업도 의존성을 끊는 쪽으로 설계를 바꾸면서 풀렸어요.$md$,
  content_en = $md$## Background

At first the search only supported simple conditions, but as the project grew, the requirements piled up:

- Combined search across multiple conditions (date, status, user, tags, etc.)
- Adding and removing conditions on the fly
- Showing selected filters as tags that can be removed with one click
- Keeping the search state after page navigation and refresh
- Keeping API queries and UI filters in sync

## The Problem

I was managing every filter in a single reactive object.

```
const searchOption = reactive({
  keyword: '',
  dateRange: [],
  status: '',
  tags: []
})
```

It looked simple at first, but problems soon showed up:

- Changing just one filter triggered the whole watch, causing unnecessary renders and duplicate calls
- Router navigation reset the object to empty, so the filter state disappeared
- Clearing one filter reset all of them

Partial updates and full resets were fighting each other.

## Fixing It

### 1. Redesigning Around Independent State

The problem was that every filter was tied to one shared object and depended on it. So I wrote a useFilter composable that manages each filter separately.

```
export const useFilter = () => {
  const keyword = ref('')
  const dateRange = ref<[string, string] | []>([])
  const status = ref('')
  const tags = ref<string[]>([])

  const resetField = (field: 'keyword' | 'dateRange' | 'status' | 'tags') => {
    if (field === 'keyword') keyword.value = ''
    else if (field === 'dateRange') dateRange.value = []
    else if (field === 'status') status.value = ''
    else if (field === 'tags') tags.value = []
  }

  const activeFilters = computed(() => ({
    ...(keyword.value && { keyword: keyword.value }),
    ...(dateRange.value.length && { dateRange: dateRange.value }),
    ...(status.value && { status: status.value }),
    ...(tags.value.length && { tags: tags.value })
  }))

  return { keyword, dateRange, status, tags, resetField, activeFilters }
}
```

Now filters work independently, and resetting one doesn't touch the others.

### 2. Search Tags

I showed the selected filters as tags, each with a close button that removes that filter.

```
<a-tag
  v-for="(value, key) in activeFilters"
  :key="key"
  closable
  @close="resetField(key)"
>
  {{ key }}: {{ value }}
</a-tag>
```

Users can see which filters are active and remove them right there, which feels much more natural.

## Results

- Adding or removing filters no longer tangles the state
- State survives page navigation and refresh
- Fewer unnecessary renders and API calls
- Easier to test and maintain

## Looking Back

This made it clear to me that UI, state, and the router work better as separate units, each with its own responsibility. The more complex the UI, the more it helped to keep those relationships loose. Both the tree work and this filter work got solved by redesigning to cut dependencies.$md$,
  updated_at = now()
WHERE id = 'filter-system-implementation';

UPDATE blog_posts SET
  title_ko = $md$색을 고르는 건 감각이 아니라 시스템이에요$md$,
  title_en = $md$Choosing Colors Is a System, Not a Sense$md$,
  excerpt_ko = $md$매번 눈으로 보면서 색을 고르다가 화면마다 미묘하게 다른 회색이 쓰이게 됐어요. 그래서 색상을 단계와 역할로 정리한 시스템으로 바꿨어요.$md$,
  excerpt_en = $md$Picking colors by eye left me with subtly different grays on every screen, so I rebuilt our colors as a system of steps and roles.$md$,
  content_ko = $md$## 배경

Keyrke 프로젝트에서 디자인 시스템을 만들 때 가장 먼저 막힌 게 색상이었어요. 메인 컬러를 뭘로 할지 같은 큰 고민은 아니었고, 더 실무적인 문제였어요. 버튼 hover 색은 뭘로 할지, disabled 상태엔 어떤 회색을 쓸지, 에러 메시지의 빨간색을 배경이 어두울 때도 같은 값으로 쓸지 같은 것들이요.

처음엔 매번 눈으로 보면서 '이 정도면 되겠지' 하고 골랐어요. 그랬더니 화면마다 미묘하게 다른 회색이 쓰이고, 같은 '비활성' 상태인데 이 화면에선 opacity 0.4, 저 화면에선 opacity 0.5인 상황이 생겼어요. 혼자 작업할 땐 감으로 맞출 수 있었는데, 팀원이 같이 쓰기 시작하자 바로 무너졌어요.

## 과정

그래서 색상을 감으로 고르지 않고 규칙으로 정해 두기로 했어요.

먼저 색상 팔레트를 단계별로 나눴어요. 색상 하나(예: blue)를 50부터 900까지 10단계로 나누고, 단계마다 용도를 미리 정했어요.

```
blue-50:  배경 (알림 배너, 선택된 행 등)
blue-100: 보더 (선택 상태)
blue-200: 보더 (hover)
blue-500: 기본 텍스트/아이콘
blue-600: 버튼 배경
blue-700: 버튼 hover
blue-900: 강조 텍스트
```

이렇게 정해 두면 새 화면을 만들 때 버튼 hover를 무슨 색으로 할지 고민할 필요가 없어요. blue-700이에요. 다른 사람이 작업해도 같은 결과가 나와요.

gray도 같은 방식으로 나눴어요. UI에서 가장 많이 쓰이는 색이 사실 gray거든요. 배경, 보더, 비활성 텍스트, 구분선, placeholder가 전부 gray의 변형이에요. gray를 규칙 없이 쓰면 화면이 탁해 보이고, 규칙대로 쓰면 깔끔해 보여요. 값 차이는 미세한데 인상은 꽤 달라요.

다크 모드 색상은 따로 매핑했어요. 라이트 모드에서 gray-100이 배경이라면 다크 모드에서는 gray-900이 배경이 돼요. 단계를 그냥 뒤집지 않고, 역할(배경, 표면, 텍스트, 보더)별로 라이트/다크 매핑 테이블을 만들었어요. 이 작업을 하면서 색상 이름은 값보다 역할로 붙여야 한다는 걸 배웠어요.

```css
/* 값이 아니라 역할로 이름 붙이기 */
--color-bg-primary      /* 라이트: white, 다크: gray-950 */
--color-bg-secondary    /* 라이트: gray-50, 다크: gray-900 */
--color-text-primary    /* 라이트: gray-900, 다크: gray-50 */
--color-text-secondary  /* 라이트: gray-500, 다크: gray-400 */
--color-border-default  /* 라이트: gray-200, 다크: gray-700 */
```

이렇게 해 두면 컴포넌트 코드에서는 `var(--color-bg-primary)`만 쓰면 돼요. 다크 모드든 라이트 모드든 맞는 색이 자동으로 들어가요.

## 돌아보며

색상을 시스템으로 만든 뒤 가장 크게 달라진 건 디자인 결정 속도였어요. 예전에는 새 화면 하나를 만들 때마다 Figma에서 색을 고르느라 30분씩 썼는데, 시스템이 생긴 뒤로는 5분이면 끝났어요. 선택지가 줄어드니 오히려 빨라졌어요.

'좋은 디자인은 선택을 잘 하는 것'이라는 말이 있어요. 색상 시스템을 만들고 나서는 매번 잘 고르려고 애쓰기보다 고를 일 자체를 줄여 두는 쪽이 저한테 더 잘 맞았어요.$md$,
  content_en = $md$## Background

When I was building the design system for the Keyrke project, the first thing I got stuck on was color. Not a big question like "What should our primary color be?" but much more practical ones. What color should a button's hover state be? Which gray goes on a disabled state? Should the red for error messages keep the same value on a dark background? That kind of thing.

At first I picked colors by eye every time, going with whatever "looked about right." I ended up with subtly different grays on every screen, and the same "disabled" state was opacity 0.4 on one screen and 0.5 on another. Working alone, I could keep things consistent by feel. The moment a teammate started using the same components, it fell apart.

## Process

So I decided to stop picking colors by feel and set rules instead.

First, I broke the palette into steps. I divided a single hue (say, blue) into 10 levels from 50 to 900 and decided up front what each level was for.

```
blue-50:  Backgrounds (notification banners, selected rows, etc.)
blue-100: Borders (selected state)
blue-200: Borders (hover)
blue-500: Default text/icons
blue-600: Button backgrounds
blue-700: Button hover
blue-900: Emphasis text
```

With this in place, there's no need to wonder what color a button's hover should be. It's blue-700. Done. Someone else working on the project lands on the same answer.

I did the same with gray. Gray is actually the most-used color in any UI. Backgrounds, borders, disabled text, dividers, and placeholders are all variations of it. Gray used without rules makes a screen look muddy; used with rules, it looks clean. The differences in value are small, but the impression is noticeably different.

Dark mode got its own mapping. If gray-100 is the background in light mode, gray-900 becomes the background in dark mode. Instead of just inverting the scale, I built a light/dark mapping table for each role (background, surface, text, border). Doing this taught me to name colors by role rather than by value.

```css
/* Name by role, not by value */
--color-bg-primary      /* light: white, dark: gray-950 */
--color-bg-secondary    /* light: gray-50, dark: gray-900 */
--color-text-primary    /* light: gray-900, dark: gray-50 */
--color-text-secondary  /* light: gray-500, dark: gray-400 */
--color-border-default  /* light: gray-200, dark: gray-700 */
```

With this setup, component code only needs `var(--color-bg-primary)`. In dark mode or light mode, the right color is applied automatically.

## Looking Back

The biggest change after turning color into a system was how fast design decisions got made. I used to spend 30 minutes picking colors in Figma every time I built a new screen. Once the system was in place, it took five minutes. Having fewer choices made things faster.

There's a saying that "good design is about making the right choices." After building this color system, I found that cutting down how often I have to choose at all works better for me than trying to choose well every time.$md$,
  updated_at = now()
WHERE id = 'design-color-system';

UPDATE blog_posts SET
  title_ko = $md$포트폴리오를 만들다 어드민 페이지까지 만들게 된 이유$md$,
  title_en = $md$Why I Ended Up Building an Admin Panel for My Portfolio$md$,
  excerpt_ko = $md$정적 파일로 시작한 포트폴리오가 Supabase + 관리자 페이지까지 갖추게 된 과정을 기록했어요.$md$,
  excerpt_en = $md$How a static portfolio turned into a small Supabase-backed CMS with its own admin panel.$md$,
  content_ko = $md$## 시작

처음엔 별 생각 없었어요. 이력서에 링크 하나 넣을 수 있는 페이지면 충분하다고 생각했거든요. React로 레이아웃 잡고, 프로젝트 카드 몇 개 넣고, 배포하면 끝이라고 봤어요.

그런데 막상 만들다 보니 문제가 생겼어요.

- 프로젝트 설명을 고치려면 TypeScript 파일을 열어서 문자열을 바꿔야 했어요.
- 블로그 글을 새로 쓰려면 컴포넌트를 직접 만들어서 라우터에 등록해야 했어요.
- 기술스택을 추가하거나 빼려면 배열을 찾아서 편집해야 했어요.

배포하고 나서 오타 하나를 발견했는데, 그걸 고치려고 코드 수정, 빌드, 배포 사이클을 또 돌아야 했어요. 콘텐츠를 관리한다기보다 코드를 관리하고 있었던 거예요.

## 과정

처음에는 JSON 파일이나 별도 데이터 파일로 분리해 볼까 했어요. 그런데 그렇게 해도 파일을 직접 열어야 하는 건 똑같았어요.

그러다 Supabase가 떠올랐어요. 다른 프로젝트에서 이미 써 봤고, 무료 티어로도 충분했거든요.

설계를 시작하니 범위가 자연스럽게 커졌어요.

- 프로젝트: `projects` 테이블
- 블로그: `blog_posts` 테이블
- 기술스택: `skills` 테이블
- 챗봇 Q&A: `chatbot_categories`, `chatbot_questions` 테이블
- 문의 메시지: `contact_messages` 테이블

RLS 정책을 붙이니 익명 읽기는 되고, 쓰기는 인증된 사용자만 할 수 있게 됐어요. 그러면 인증된 사용자가 편하게 쓸 UI가 필요했고, 그게 어드민 페이지로 이어졌어요.

```
/admin
/mail → 문의 메시지 관리
/projects → 프로젝트 CRUD
/blog → 블로그 글 작성·수정
/about → 기술스택·학력·경력 편집
/chatbot → Q&A 관리
/settings → 네비게이션 on/off, 연락처 정보
```

처음엔 탭 기반으로 만들었는데, 항목이 많아지면서 중첩 라우트로 바꿨어요.

## 만들면서 생긴 것들

마크다운 에디터를 새로 만들어야 했어요. 블로그 글을 DB에 저장하려면 텍스트 형태여야 했는데, 기존 블로그 글은 JSX로 작성된 컴포넌트였거든요. 13개 글을 전부 마크다운으로 마이그레이션하면서 `MarkdownRenderer`도 직접 구현했어요.

기술 아이콘 공유 모듈도 생겼어요. 프로젝트 상세, 블로그 상세, 어바웃 섹션 세 곳에서 아이콘을 따로 관리하다 보니 빠지는 게 생겼어요. `GitHub`, `Netlify`, `Tailwind CSS v4` 같은 이름이 텍스트 뱃지로 나오고 있었거든요. `resolveIcon()` 함수 하나로 합치고, 버전 suffix를 떼는 로직도 넣었어요.

파티클 히어로 애니메이션은 포트폴리오 첫인상이 너무 밋밋하다 싶어서 넣었어요. 얼굴 이미지를 픽셀 샘플링해서 dot 파티클로 바꾸고, 그걸 텍스트로 모핑하는 캔버스 애니메이션이에요. 모바일에서 샘플링 간격을 달리해 밀도를 맞추는 부분이 은근히 까다로웠어요.

## 결과

지금은 코드를 열지 않고도 모든 콘텐츠를 관리할 수 있어요.

포트폴리오를 만들다가 작은 CMS를 하나 만든 셈이에요. 처음 목표였던 "링크 하나 넣을 수 있는 페이지"에서 꽤 멀리 왔지만, 이 과정 자체가 포트폴리오가 됐다고 생각해요. 새로 쓴 코드, 고쳐야 했던 설계, 모바일에서 이상하게 보여서 다시 손댄 UI까지 전부 실제로 겪은 문제들이에요.

어드민 페이지를 만드는 게 처음엔 번거로웠는데, 돌아보면 가장 잘한 결정이었어요.$md$,
  content_en = $md$## The Problem

I didn't plan for any of this. I just wanted a page with a link I could put on my resume. Layout in React, a few project cards, deploy, done.

But problems crept in almost immediately.

- Editing a project description meant opening a TypeScript file and changing a string
- Writing a new blog post meant building a component and registering it in the router
- Adding or removing a skill meant hunting down an array and editing it directly

After deploying, I found a typo. Fixing it meant editing the code, rebuilding, and redeploying. The whole cycle, for a single character. I wasn't managing content. I was managing code.

## The Process

My first instinct was to move the data into JSON files. But that still meant opening files by hand, so it only moved the problem somewhere else.

Then I thought of Supabase. I'd used it before, and the free tier was more than enough.

Once I started designing the schema, the scope grew on its own.

- Projects: `projects` table
- Blog posts: `blog_posts` table
- Skills: `skills` table
- Chatbot Q&A: `chatbot_categories`, `chatbot_questions` tables
- Contact messages: `contact_messages` table

With RLS policies in place, public reads worked but writes required an authenticated user. That meant I needed a UI for that user, which led straight to an admin panel.

```
/admin
/mail → Contact message inbox
/projects → Project CRUD
/blog → Write and edit posts
/about → Skills, education, experience
/chatbot → Q&A management
/settings → Nav visibility, contact info
```

I started with a tab-based layout, but as the sections grew, I switched to nested routes.

## Things That Came Out of It

A markdown editor became necessary. Blog posts needed to be stored as text in the DB, but the existing posts were JSX components. I migrated all 13 posts to markdown and built a custom `MarkdownRenderer` along the way.

A shared tech icon module came out of a real bug. Three sections (project detail, blog detail, about) each kept their own icon maps, and things fell through the cracks. `GitHub`, `Netlify`, and `Tailwind CSS v4` were all showing up as plain text badges. I consolidated everything into a single `resolveIcon()` function that also strips version suffixes.

The particle hero animation went in because the first impression felt too flat. It samples a face image into dot particles and morphs them into text on a canvas. Adjusting the sampling density for mobile screens turned out to be the trickiest part.

## The Result

Now I can manage all content without touching the code.

The portfolio became a small CMS. It's a long way from the "just a link on my resume" I started with, but I think the process itself became the portfolio. The new code, the design decisions I had to revisit, the UI that looked wrong on mobile: those were all real problems I ran into and solved.

Building the admin panel felt like a detour at the time. Looking back, it was the best call I made.$md$,
  updated_at = now()
WHERE id = 'portfolio-admin-journey';

COMMIT;

SELECT count(*) AS posts,
  count(*) FILTER (WHERE content_ko LIKE '%**%' OR content_en LIKE '%**%') AS bold_left,
  count(*) FILTER (WHERE content_ko ~ '^\s*# ' OR content_en ~ '^\s*# ') AS h1_left,
  count(*) FILTER (WHERE content_ko LIKE '%unsplash%' OR content_en LIKE '%unsplash%') AS stock_photo_left
FROM blog_posts;
