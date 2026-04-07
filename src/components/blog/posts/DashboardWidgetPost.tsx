import styled from 'styled-components';

const Content = styled.div``;

interface PostProps {
  language: 'ko' | 'en';
}

export const DashboardWidgetPost = ({ language }: PostProps) => {
  if (language === 'ko') {
    return (
      <Content>
        <h1>모듈형 대시보드 위젯 시스템</h1>
        
        <h2>원인</h2>
        
        <p>대시보드 페이지에서 여러 기능(보안 현황, 저장소 용량, 작업 진행률, 최근 로그 등)을 한 화면에 보여줘야 했습니다. 그런데 문제는 다음과 같은 문제가 생겼습니다.</p>
        
        <ul>
          <li>각 위젯이 서로 다른 API, 갱신 주기, 렌더 타입(차트/리스트/카드)을 가짐</li>
          <li>일부 위젯은 사용자가 직접 추가·삭제·배치 순서를 바꿔야 함</li>
          <li>공통으로 로딩/에러/빈 상태 처리 필요</li>
          <li>새 위젯을 추가할 때마다 <strong>라우트와 템플릿을 수정</strong>해야 해서 확장성이 떨어짐</li>
        </ul>
        
        <p>한 페이지에 여러 개의 독립 모듈이 공존하면서도 일관된 UX를 유지해야 하는 <strong>모듈형 대시보드 위젯 시스템</strong>이 필요했어요</p>
        
        <h2>과정과 문제 탐색</h2>
        
        <p>초기 구현은 단순 반복 렌더링 구조였는데요</p>
        
        <pre><code>{`<SecurityCard />
<StorageUsage />
<JobProgress />
<RecentLogs />`}</code></pre>
        
        <p>하지만 이 방식은 다음 문제가 있었어요</p>
        
        <ul>
          <li>각 컴포넌트마다 <strong>fetch 로직, 로딩 상태, 에러 상태</strong>를 중복 관리</li>
          <li>위젯 순서를 바꾸려면 <code>&lt;template&gt;</code> 구조를 수정해야 함</li>
          <li>새 위젯을 추가하면 router, layout, i18n 등 여러 곳을 손대야 함</li>
        </ul>
        
        <p>그래서 아예 위젯을 <strong>데이터로 선언하고, 공통 위젯 엔진이 렌더링하는 구조</strong>로 바꾸고자 했어요</p>
        
        <h2>해결 방안</h2>
        
        <h3>a. 위젯 메타 데이터 기반 렌더링</h3>
        
        <p>모든 위젯은 하나의 메타 객체로 정의했는데요</p>
        
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
        
        <p>이제 새 위젯을 추가하려면 <strong>객체 1개 등록</strong>으로 쉽게 마무리 할 수 있었어요</p>
        
        <h3>b. 공통 위젯 래퍼 (로딩/에러/빈 상태 일원화)</h3>
        
        <p>모든 위젯은 <code>useViewState</code> composable을 이용해 로딩/에러/빈 상태를 통일했어요</p>
        
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
        
        <p>위젯 내부의 데이터 구조가 달라도 wrapper가 모든 상태를 일관되게 관리할 수 있게 되었어요. 각 위젯은 data props만 받아서 렌더에 집중할 수 있어요.</p>
        
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
        
        <p>이제 <strong>모듈 등록 기반 동적 렌더링</strong>과 <strong>공통 래퍼를 통한 상태/로딩/에러 UI 일원화</strong>를 해결할 수 있었어요</p>
        
        <p>(향후 drag-and-drop 정렬, 위젯 숨김, 사용자 저장 기능도 추가할 예정이에요.)</p>
        
        <h2>결과</h2>
        
        <p>새 위젯 추가 시 템플릿 수정 없이 등록만으로 자동렌더링이 될 수 있도록 하고, 동일한 정책을 공유하여 운영 효율을 개선할 수 있었습니다.</p>
        
        <h2>배운 점</h2>
        
        <p>대시보드는 단순 컴포넌트 모음이 아니라 <strong>모듈 엔진 구조</strong>로 설계해야 쉬운 유지보수가 가능하고 Vue의 <code>component</code> 동적 바인딩과 composable 패턴을 활용하면 <strong>확장성과 일관성</strong>을 얻을 수 있다는 것을 배우게 되었습니다.</p>
      </Content>
    );
  }

  return (
    <Content>
      <h1>Modular Dashboard Widget System</h1>
      
      <h2>Background</h2>
      
      <p>On the dashboard page, multiple features (security status, storage capacity, job progress, recent logs, etc.) had to be displayed on one screen. However, the following problems occurred.</p>
      
      <ul>
        <li>Each widget had different APIs, refresh cycles, and render types (chart/list/card)</li>
        <li>Some widgets needed users to directly add, delete, and rearrange them</li>
        <li>Common loading/error/empty state handling needed</li>
        <li>Every time a new widget was added, <strong>routes and templates had to be modified</strong>, reducing scalability</li>
      </ul>
      
      <p>We needed a <strong>modular dashboard widget system</strong> where multiple independent modules coexist on one page while maintaining consistent UX</p>
      
      <h2>Process and Problem Exploration</h2>
      
      <p>The initial implementation was a simple repetitive rendering structure</p>
      
      <pre><code>{`<SecurityCard />
<StorageUsage />
<JobProgress />
<RecentLogs />`}</code></pre>
      
      <p>But this approach had the following problems</p>
      
      <ul>
        <li>Each component duplicated <strong>fetch logic, loading state, error state</strong> management</li>
        <li>To change widget order, <code>&lt;template&gt;</code> structure had to be modified</li>
        <li>Adding a new widget required touching multiple places like router, layout, i18n</li>
      </ul>
      
      <p>So we decided to <strong>declare widgets as data and have a common widget engine render them</strong></p>
      
      <h2>Solution</h2>
      
      <h3>a. Widget Metadata-Based Rendering</h3>
      
      <p>All widgets were defined as a single meta object</p>
      
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
      
      <p>Now adding a new widget was easily finished by <strong>registering one object</strong></p>
      
      <h3>b. Common Widget Wrapper (Unifying Loading/Error/Empty States)</h3>
      
      <p>All widgets unified loading/error/empty states using the <code>useViewState</code> composable</p>
      
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
      
      <p>Even if the data structure inside widgets differs, the wrapper can consistently manage all states. Each widget can just focus on rendering by receiving data props.</p>
      
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
      
      <p>Now we could solve <strong>module registration-based dynamic rendering</strong> and <strong>state/loading/error UI unification through common wrapper</strong></p>
      
      <p>(Future plans include drag-and-drop sorting, widget hiding, and user save functionality.)</p>
      
      <h2>Results</h2>
      
      <p>When adding a new widget, auto-rendering is possible just by registration without template modification, and operational efficiency was improved by sharing the same policy.</p>
      
      <h2>Key Takeaways</h2>
      
      <p>Dashboards are not just a collection of components but need to be designed as a <strong>module engine structure</strong> for easy maintenance, and utilizing Vue's <code>component</code> dynamic binding and composable pattern can provide <strong>scalability and consistency</strong>.</p>
    </Content>
  );
};
