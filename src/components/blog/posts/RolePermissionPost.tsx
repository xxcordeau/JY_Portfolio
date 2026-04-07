import styled from 'styled-components';

const Content = styled.div``;

interface PostProps {
  language: 'ko' | 'en';
}

export const RolePermissionPost = ({ language }: PostProps) => {
  if (language === 'ko') {
    return (
      <Content>
        <h1>권한(Role)별 접근 제어 시스템</h1>
        
        <h2>원인</h2>
        
        <p>당사 솔루션에서 프로젝트 내에서 관리자(Admin), 일반 사용자(User), 외부 게스트(Guest) 등 사용자의 역할에 따라 접근 가능한 페이지와 기능이 달랐습니다.</p>
        
        <p>그로인한 문제는 다음과 같았어요.</p>
        
        <blockquote>
          <ul>
            <li>화면 단에서 <strong>버튼·탭·라우트 노출 조건</strong>이 제각각 하드코딩</li>
            <li>비로그인 상태에서 <strong>직접 URL 접근 시 예외 처리 누락</strong></li>
            <li>컴포넌트/라우터/템플릿 모두에서 같은 권한 검증 로직을 반복</li>
            <li>API 호출 시에도 권한 필터가 중복되어, 유지보수가 불가능</li>
          </ul>
        </blockquote>
        
        <p>누가 무엇을 볼 수 있고 실행할 수 있는가를 <strong>한 곳에서 정의</strong>할 수 있는 권한 제어 시스템이 필요했어요</p>
        
        <h2>과정과 문제 탐색</h2>
        
        <h3>a) 기존 구조의 한계</h3>
        
        <p>기존엔 컴포넌트 내부에 이런 조건이 흩어져 있었어요</p>
        
        <pre><code>{`<a-button v-if="userRole === 'ADMIN'">관리자 설정</a-button>`}</code></pre>
        
        <p>혹은 라우터에서 직접 검사했어요</p>
        
        <pre><code>{`if (userRole !== 'ADMIN') next('/403')`}</code></pre>
        
        <p>결국 역할이 추가되거나 정책이 바뀌면 <strong>모든 화면, 모든 버튼 등 설정 로직을 직접 수정</strong>해야 했고, 로직이 분산되어 테스트와 유지보수가 아주 힘든 상황이었어요.</p>
        
        <h2>해결 방안</h2>
        
        <p>그로 인해 문제를 해결하기 위한 해결책을 세웠어요.</p>
        
        <blockquote>
          <ul>
            <li>모든 권한 검증을 <strong>한 중앙 composable</strong>로 통합</li>
            <li>UI 노출·라우팅·API 호출에서 동일 로직 재사용</li>
            <li>로그인 상태에 따라 <strong>동적 라우팅 필터링</strong></li>
            <li>타입 기반 Role 정의로 <strong>코드 자동완성/안정성 확보</strong></li>
          </ul>
        </blockquote>
        
        <h3>a. 권한 모델 정의</h3>
        
        <p>먼저 역할과 접근 가능한 자원을 명시적으로 구조화했어요.</p>
        
        <pre><code>{`export type Role = 'ADMIN' | 'USER' | 'GUEST'

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
}`}</code></pre>
        
        <h3>b. composable 기반 접근 제어</h3>
        
        <p>기존에 흩어져 있던 모든 권한 검증을 한 composable로 통합하였습니다.</p>
        
        <pre><code>{`// composables/usePermission.ts
import { ref } from 'vue'

const currentRole = ref<Role>('GUEST')

export const usePermission = () => {
  const setRole = (role: Role) => (currentRole.value = role)
  const hasPageAccess = (path: string) =>
    rolePermissionMap[currentRole.value].pages.includes(path)
  const can = (action: string) =>
    rolePermissionMap[currentRole.value].actions.includes(action)

  return { currentRole, setRole, hasPageAccess, can }
}`}</code></pre>
        
        <h3>c. 라우터 가드 통합</h3>
        
        <p>라우터 진입 시, 접근 가능한 페이지인지 검사하는 전역 가드를 추가했습니다.</p>
        
        <pre><code>{`// plugins/route-guard.client.ts
import { usePermission } from '@/composables/usePermission'

export default defineNuxtPlugin((nuxtApp) => {
  const { hasPageAccess } = usePermission()

  nuxtApp.$router.beforeEach((to, _from, next) => {
    if (!hasPageAccess(to.path)) return next('/403')
    next()
  })
})`}</code></pre>
        
        <p>모든 접근 검증을 전역에서 일관 처리하고 페이지 당 중복되어있는 조건문을 제거하였어요.</p>
        
        <h3>d. 템플릿 단 접근 제어</h3>
        
        <p>UI 레벨에서는 헬퍼 함수를 바로 사용하여 코드 가독성을 높였어요.</p>
        
        <pre><code>{`<a-button v-if="can('EDIT')">수정</a-button>
<a-button v-if="can('DELETE')">삭제</a-button>`}</code></pre>
        
        <h3>e. API 단 권한 필터</h3>
        
        <p>API 호출 시에도 권한 검증을 재사용할 수 있어 불필요한 조건문을 줄일 수 있었습니다.</p>
        
        <pre><code>{`const { can } = usePermission()
if (can('DELETE')) await useRestPost('/api/user/delete', { id })
else message.warning('삭제 권한이 없습니다.')`}</code></pre>
        
        <h2>결과</h2>
        
        <p>페이지, 라우터, API, UI 모든 영역이 동일한 권한 로직으로 통합되어 중복 코드를 제거하고, 로그인 후 Role 변경 시 라우터 반영이 즉시 이루어지는 안정적인 접근 제어 흐름을 완성할 수 있었습니다.</p>
        
        <h2>배운 점</h2>
        
        <p>저는 권한 시스템은 단순히 어떠한 사용자에게 &lt; 보여줄지 말지 &gt;정도를 결정하는 부분이라고 생각했었는데요. 막상 코드를 구현하다보니 권한시스템은 데이터, 그리고 UI흐름을 제어하는 구조 문제라는 것을 배우게 되었습니다.</p>
      </Content>
    );
  }

  return (
    <Content>
      <h1>Role-Based Access Control System</h1>
      
      <h2>Background</h2>
      
      <p>In our solution, accessible pages and features varied depending on user roles such as Admin, User, and Guest within the project.</p>
      
      <p>The resulting problems were as follows:</p>
      
      <blockquote>
        <ul>
          <li><strong>Button, tab, and route visibility conditions</strong> were hardcoded inconsistently at the UI level</li>
          <li><strong>Direct URL access exception handling was missing</strong> in non-logged-in states</li>
          <li>Same permission verification logic repeated across components/routers/templates</li>
          <li>Permission filters duplicated even in API calls, making maintenance impossible</li>
        </ul>
      </blockquote>
      
      <p>We needed a permission control system that could <strong>define in one place</strong> who can see what and execute what</p>
      
      <h2>Process and Problem Exploration</h2>
      
      <h3>a) Limitations of Existing Structure</h3>
      
      <p>Previously, such conditions were scattered inside components</p>
      
      <pre><code>{`<a-button v-if="userRole === 'ADMIN'">Admin Settings</a-button>`}</code></pre>
      
      <p>Or checked directly in the router</p>
      
      <pre><code>{`if (userRole !== 'ADMIN') next('/403')`}</code></pre>
      
      <p>Eventually, when roles were added or policies changed, <strong>all screens and button configuration logic had to be modified directly</strong>, and the distributed logic made testing and maintenance very difficult.</p>
      
      <h2>Solution</h2>
      
      <p>We established solutions to solve the problems:</p>
      
      <blockquote>
        <ul>
          <li>Integrate all permission verification into <strong>one central composable</strong></li>
          <li>Reuse the same logic for UI exposure, routing, and API calls</li>
          <li><strong>Dynamic routing filtering</strong> based on login state</li>
          <li>Ensure <strong>code autocomplete/stability</strong> with type-based Role definition</li>
        </ul>
      </blockquote>
      
      <h3>a. Permission Model Definition</h3>
      
      <p>First, we explicitly structured roles and accessible resources.</p>
      
      <pre><code>{`export type Role = 'ADMIN' | 'USER' | 'GUEST'

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
}`}</code></pre>
      
      <h3>b. Composable-Based Access Control</h3>
      
      <p>We integrated all scattered permission verification into one composable.</p>
      
      <pre><code>{`// composables/usePermission.ts
import { ref } from 'vue'

const currentRole = ref<Role>('GUEST')

export const usePermission = () => {
  const setRole = (role: Role) => (currentRole.value = role)
  const hasPageAccess = (path: string) =>
    rolePermissionMap[currentRole.value].pages.includes(path)
  const can = (action: string) =>
    rolePermissionMap[currentRole.value].actions.includes(action)

  return { currentRole, setRole, hasPageAccess, can }
}`}</code></pre>
      
      <h3>c. Router Guard Integration</h3>
      
      <p>We added a global guard to check if the page is accessible when entering a route.</p>
      
      <pre><code>{`// plugins/route-guard.client.ts
import { usePermission } from '@/composables/usePermission'

export default defineNuxtPlugin((nuxtApp) => {
  const { hasPageAccess } = usePermission()

  nuxtApp.$router.beforeEach((to, _from, next) => {
    if (!hasPageAccess(to.path)) return next('/403')
    next()
  })
})`}</code></pre>
      
      <p>All access verification was handled consistently globally, eliminating duplicate conditional statements per page.</p>
      
      <h3>d. Template-Level Access Control</h3>
      
      <p>At the UI level, we improved code readability by using helper functions directly.</p>
      
      <pre><code>{`<a-button v-if="can('EDIT')">Edit</a-button>
<a-button v-if="can('DELETE')">Delete</a-button>`}</code></pre>
      
      <h3>e. API-Level Permission Filter</h3>
      
      <p>Permission verification could be reused even in API calls, reducing unnecessary conditional statements.</p>
      
      <pre><code>{`const { can } = usePermission()
if (can('DELETE')) await useRestPost('/api/user/delete', { id })
else message.warning('You do not have delete permission.')`}</code></pre>
      
      <h2>Results</h2>
      
      <p>All areas including pages, routers, APIs, and UI were integrated with the same permission logic, eliminating duplicate code and completing a stable access control flow where router changes are immediately reflected after Role changes following login.</p>
      
      <h2>Key Takeaways</h2>
      
      <p>I used to think that the permission system was just about deciding &lt;whether to show it or not&gt; to a certain user. But as I implemented the code, I learned that the permission system is a structural problem that controls data and UI flow.</p>
    </Content>
  );
};
