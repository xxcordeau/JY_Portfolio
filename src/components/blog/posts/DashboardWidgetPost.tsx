'use client';

import styled from 'styled-components';

const Content = styled.div``;

interface PostProps {
  language: 'ko' | 'en';
}

export const DashboardWidgetPost = ({ language }: PostProps) => {
  if (language === 'ko') {
    return (
      <Content>
        <h2>원인</h2>

        <p>대시보드 한 화면에 보안 현황, 저장소 용량, 작업 진행률, 최근 로그 같은 여러 기능을 보여줘야 했어요. 만들다 보니 이런 문제가 생겼어요.</p>

        <ul>
          <li>위젯마다 API, 갱신 주기, 렌더 타입(차트/리스트/카드)이 다름</li>
          <li>일부 위젯은 사용자가 직접 추가, 삭제하고 순서를 바꿀 수 있어야 함</li>
          <li>로딩/에러/빈 상태 처리는 공통으로 필요함</li>
          <li>새 위젯을 넣을 때마다 라우트와 템플릿을 고쳐야 해서 확장이 어려움</li>
        </ul>

        <p>독립된 모듈 여러 개가 한 페이지에 있으면서도 UX는 일관돼야 했어요. 그래서 모듈형 대시보드 위젯 시스템을 만들기로 했어요.</p>

        <h2>과정과 문제 탐색</h2>

        <p>처음에는 컴포넌트를 그대로 나열하는 구조였어요.</p>

        <pre><code>{`<SecurityCard />
<StorageUsage />
<JobProgress />
<RecentLogs />`}</code></pre>

        <p>이 방식에는 문제가 있었어요.</p>

        <ul>
          <li>컴포넌트마다 fetch 로직, 로딩 상태, 에러 상태를 따로 관리함</li>
          <li>위젯 순서를 바꾸려면 템플릿의 컴포넌트 배치를 직접 고쳐야 함</li>
          <li>새 위젯을 추가하면 router, layout, i18n 등 여러 곳을 손대야 함</li>
        </ul>

        <p>그래서 위젯을 데이터로 선언하고, 공통 위젯 엔진이 렌더링하는 구조로 바꾸기로 했어요.</p>

        <h2>해결 방안</h2>

        <h3>a. 위젯 메타 데이터 기반 렌더링</h3>

        <p>모든 위젯을 하나의 메타 객체로 정의했어요.</p>

        <pre><code>{`// types/dashboard-widget.ts
export interface DashboardWidget {
  id: string
  title: string
  component: Component
  api?: string
  refreshInterval?: number
}`}</code></pre>

        <pre><code>{`// widgets/index.ts
import SecurityCard from '@/widgets/SecurityCard.vue'
import StorageUsage from '@/widgets/StorageUsage.vue'
import JobProgress from '@/widgets/JobProgress.vue'
import RecentLogs from '@/widgets/RecentLogs.vue'

export const widgetList: DashboardWidget[] = [
  { id: 'security', title: '보안 현황', component: SecurityCard, api: '/api/security', refreshInterval: 60, viewType: 'chart' },
  { id: 'storage', title: '저장소 사용량', component: StorageUsage, api: '/api/storage', viewType: 'card' },
  { id: 'job', title: '작업 진행률', component: JobProgress, api: '/api/jobs', viewType: 'chart' },
  { id: 'logs', title: '최근 로그', component: RecentLogs, api: '/api/logs', viewType: 'list' },
]`}</code></pre>

        <p>이제 새 위젯은 객체 하나만 등록하면 돼요.</p>

        <h3>b. 공통 위젯 래퍼 (로딩/에러/빈 상태 일원화)</h3>

        <p>로딩/에러/빈 상태는 모든 위젯이 <code>useViewState</code> composable로 똑같이 처리해요.</p>

        <pre><code>{`<!-- components/DashboardWidgetWrapper.vue -->
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
</style>`}</code></pre>

        <p>위젯마다 데이터 구조가 달라도 상태 관리는 래퍼가 맡아요. 각 위젯은 data props만 받아서 그리는 데 집중하면 돼요.</p>

        <h3>c. 메인 대시보드 구성</h3>

        <pre><code>{`<!-- pages/dashboard.vue -->
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
</style>`}</code></pre>

        <p>이렇게 모듈 등록 기반 동적 렌더링과, 공통 래퍼를 통한 상태/로딩/에러 UI 통일을 함께 해결했어요.</p>

        <p>drag-and-drop 정렬, 위젯 숨김, 사용자별 저장 기능은 앞으로 추가할 예정이에요.</p>

        <h2>결과</h2>

        <p>새 위젯은 템플릿을 고치지 않고 등록만 하면 자동으로 렌더링돼요. 모든 위젯이 같은 상태 처리 정책을 쓰니 운영도 수월해졌어요.</p>

        <h2>배운 점</h2>

        <p>대시보드는 컴포넌트를 모아두는 방식보다 모듈 엔진처럼 설계했을 때 유지보수가 쉬웠어요. Vue의 <code>component</code> 동적 바인딩과 composable 패턴을 같이 쓰니 위젯을 늘리기도 쉽고 화면 동작도 일관되게 맞출 수 있었어요.</p>
      </Content>
    );
  }

  return (
    <Content>
      <h2>Background</h2>

      <p>The dashboard had to show several features on one screen: security status, storage capacity, job progress, recent logs, and so on. As I built it, a few problems came up.</p>

      <ul>
        <li>Each widget had its own API, refresh cycle, and render type (chart/list/card)</li>
        <li>Some widgets had to be added, removed, and reordered by the user</li>
        <li>Every widget needed loading, error, and empty state handling</li>
        <li>Adding a new widget meant editing routes and templates every time, which made it hard to scale</li>
      </ul>

      <p>Independent modules had to live on one page and still feel consistent. So I set out to build a modular dashboard widget system.</p>

      <h2>Process and Problem Exploration</h2>

      <p>The first version just listed the components one after another.</p>

      <pre><code>{`<SecurityCard />
<StorageUsage />
<JobProgress />
<RecentLogs />`}</code></pre>

      <p>That approach had problems.</p>

      <ul>
        <li>Every component managed its own fetch logic, loading state, and error state</li>
        <li>Changing the widget order meant editing the component layout in the template by hand</li>
        <li>A new widget meant touching the router, layout, i18n, and more</li>
      </ul>

      <p>So I decided to declare widgets as data and let a shared widget engine render them.</p>

      <h2>Solution</h2>

      <h3>a. Widget Metadata-Based Rendering</h3>

      <p>Every widget is defined as a single meta object.</p>

      <pre><code>{`// types/dashboard-widget.ts
export interface DashboardWidget {
  id: string
  title: string
  component: Component
  api?: string
  refreshInterval?: number
}`}</code></pre>

      <pre><code>{`// widgets/index.ts
import SecurityCard from '@/widgets/SecurityCard.vue'
import StorageUsage from '@/widgets/StorageUsage.vue'
import JobProgress from '@/widgets/JobProgress.vue'
import RecentLogs from '@/widgets/RecentLogs.vue'

export const widgetList: DashboardWidget[] = [
  { id: 'security', title: 'Security Status', component: SecurityCard, api: '/api/security', refreshInterval: 60, viewType: 'chart' },
  { id: 'storage', title: 'Storage Usage', component: StorageUsage, api: '/api/storage', viewType: 'card' },
  { id: 'job', title: 'Job Progress', component: JobProgress, api: '/api/jobs', viewType: 'chart' },
  { id: 'logs', title: 'Recent Logs', component: RecentLogs, api: '/api/logs', viewType: 'list' },
]`}</code></pre>

      <p>Adding a widget now takes one registered object.</p>

      <h3>b. Common Widget Wrapper (Unifying Loading/Error/Empty States)</h3>

      <p>All widgets handle loading, error, and empty states the same way through the <code>useViewState</code> composable.</p>

      <pre><code>{`<!-- components/DashboardWidgetWrapper.vue -->
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
</style>`}</code></pre>

      <p>Even when widgets use different data shapes, the wrapper owns the state. Each widget just receives data props and renders.</p>

      <h3>c. Main Dashboard Composition</h3>

      <pre><code>{`<!-- pages/dashboard.vue -->
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
</style>`}</code></pre>

      <p>With this, module registration drives the rendering, and the shared wrapper keeps the state, loading, and error UI the same everywhere.</p>

      <p>Drag-and-drop sorting, hiding widgets, and saving per-user layouts are next on the list.</p>

      <h2>Results</h2>

      <p>A new widget renders automatically once it's registered, with no template changes. Since every widget follows the same state policy, day-to-day operation got easier too.</p>

      <h2>Key Takeaways</h2>

      <p>The dashboard was much easier to maintain once I treated it as a module engine instead of a pile of components. Combining Vue's <code>component</code> dynamic binding with composables let me add widgets easily while keeping their behavior consistent.</p>
    </Content>
  );
};
