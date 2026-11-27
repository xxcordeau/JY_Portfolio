'use client';

import styled from 'styled-components';

const Content = styled.div``;

interface PostProps {
  language: 'ko' | 'en';
}

export const RolePermissionPost = ({ language }: PostProps) => {
  if (language === 'ko') {
    return (
      <Content>
        <h2>원인</h2>

        <p>저희 솔루션은 프로젝트 안에서 관리자(Admin), 일반 사용자(User), 외부 게스트(Guest)처럼 역할에 따라 접근할 수 있는 페이지와 기능이 달랐어요.</p>

        <p>그런데 이런 문제가 있었어요.</p>

        <blockquote>
          <ul>
            <li>버튼, 탭, 라우트 노출 조건이 화면마다 제각각 하드코딩됨</li>
            <li>비로그인 상태에서 URL로 직접 들어오는 경우의 예외 처리가 빠져 있음</li>
            <li>컴포넌트, 라우터, 템플릿에서 같은 권한 검증 로직을 반복함</li>
            <li>API 호출에도 권한 필터가 중복돼 있어 유지보수가 불가능한 수준이었음</li>
          </ul>
        </blockquote>

        <p>누가 무엇을 보고 실행할 수 있는지를 한 곳에서 정의하는 권한 제어 시스템이 필요했어요.</p>

        <h2>과정과 문제 탐색</h2>

        <h3>a) 기존 구조의 한계</h3>

        <p>기존에는 컴포넌트 안에 이런 조건이 흩어져 있었어요.</p>

        <pre><code>{`<a-button v-if="userRole === 'ADMIN'">관리자 설정</a-button>`}</code></pre>

        <p>라우터에서 직접 검사하기도 했고요.</p>

        <pre><code>{`if (userRole !== 'ADMIN') next('/403')`}</code></pre>

        <p>그래서 역할이 추가되거나 정책이 바뀌면 모든 화면의 버튼과 설정 로직을 하나하나 고쳐야 했어요. 로직이 여기저기 흩어져 있으니 테스트와 유지보수도 힘들었어요.</p>

        <h2>해결 방안</h2>

        <p>그래서 방향을 이렇게 잡았어요.</p>

        <blockquote>
          <ul>
            <li>모든 권한 검증을 중앙 composable 하나로 모으기</li>
            <li>UI 노출, 라우팅, API 호출에서 같은 로직 재사용</li>
            <li>로그인 상태에 따라 라우팅을 동적으로 필터링</li>
            <li>Role을 타입으로 정의해 자동완성과 안정성 확보</li>
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

        <p>흩어져 있던 권한 검증을 composable 하나로 모았어요.</p>

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

        <p>라우트에 들어갈 때 접근 가능한 페이지인지 검사하는 전역 가드를 추가했어요.</p>

        <pre><code>{`// plugins/route-guard.client.ts
import { usePermission } from '@/composables/usePermission'

export default defineNuxtPlugin((nuxtApp) => {
  const { hasPageAccess } = usePermission()

  nuxtApp.$router.beforeEach((to, _from, next) => {
    if (!hasPageAccess(to.path)) return next('/403')
    next()
  })
})`}</code></pre>

        <p>접근 검증을 전역에서 한 번에 처리하니 페이지마다 중복되던 조건문을 지울 수 있었어요.</p>

        <h3>d. 템플릿 단 접근 제어</h3>

        <p>UI에서는 헬퍼 함수를 바로 써서 코드를 읽기 쉽게 했어요.</p>

        <pre><code>{`<a-button v-if="can('EDIT')">수정</a-button>
<a-button v-if="can('DELETE')">삭제</a-button>`}</code></pre>

        <h3>e. API 단 권한 필터</h3>

        <p>API를 호출할 때도 같은 권한 검증을 재사용해서 불필요한 조건문을 줄였어요.</p>

        <pre><code>{`const { can } = usePermission()
if (can('DELETE')) await useRestPost('/api/user/delete', { id })
else message.warning('삭제 권한이 없습니다.')`}</code></pre>

        <h2>결과</h2>

        <p>페이지, 라우터, API, UI가 모두 같은 권한 로직을 쓰게 되면서 중복 코드가 사라졌어요. 로그인 후 Role이 바뀌면 라우터에도 바로 반영돼요.</p>

        <h2>배운 점</h2>

        <p>처음엔 권한 시스템을 어떤 사용자에게 무엇을 허용할지 정하는 기능 정도로 생각했어요. 막상 구현해 보니 데이터와 UI 흐름을 어떻게 제어할지에 관한 구조 문제에 더 가까웠어요.</p>
      </Content>
    );
  }

  return (
    <Content>
      <h2>Background</h2>

      <p>In our solution, what you could access inside a project depended on your role: Admin, User, or Guest each saw different pages and features.</p>

      <p>That caused a few problems.</p>

      <blockquote>
        <ul>
          <li>Visibility conditions for buttons, tabs, and routes were hardcoded differently on each screen</li>
          <li>There was no exception handling when a logged-out user opened a URL directly</li>
          <li>The same permission checks were repeated across components, the router, and templates</li>
          <li>API calls had their own duplicated permission filters, which made maintenance close to impossible</li>
        </ul>
      </blockquote>

      <p>I needed one place to define who can see and do what.</p>

      <h2>Process and Problem Exploration</h2>

      <h3>a) Limitations of Existing Structure</h3>

      <p>Before, checks like this were scattered across components.</p>

      <pre><code>{`<a-button v-if="userRole === 'ADMIN'">Admin Settings</a-button>`}</code></pre>

      <p>Or the router checked the role directly.</p>

      <pre><code>{`if (userRole !== 'ADMIN') next('/403')`}</code></pre>

      <p>So whenever a role was added or a policy changed, I had to edit the button and settings logic on every screen by hand. With the logic spread out like that, testing and maintenance were painful.</p>

      <h2>Solution</h2>

      <p>Here's the direction I took.</p>

      <blockquote>
        <ul>
          <li>Move every permission check into one central composable</li>
          <li>Reuse the same logic for UI visibility, routing, and API calls</li>
          <li>Filter routes dynamically based on login state</li>
          <li>Define Role as a type for autocomplete and safety</li>
        </ul>
      </blockquote>

      <h3>a. Permission Model Definition</h3>

      <p>First, I spelled out the roles and the resources each one can access.</p>

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

      <p>All the scattered checks went into a single composable.</p>

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

      <p>I added a global guard that checks whether a page is accessible before entering the route.</p>

      <pre><code>{`// plugins/route-guard.client.ts
import { usePermission } from '@/composables/usePermission'

export default defineNuxtPlugin((nuxtApp) => {
  const { hasPageAccess } = usePermission()

  nuxtApp.$router.beforeEach((to, _from, next) => {
    if (!hasPageAccess(to.path)) return next('/403')
    next()
  })
})`}</code></pre>

      <p>With access checks handled globally, I could delete the duplicated conditionals on each page.</p>

      <h3>d. Template-Level Access Control</h3>

      <p>In the UI, the helper functions are used directly, which keeps templates easy to read.</p>

      <pre><code>{`<a-button v-if="can('EDIT')">Edit</a-button>
<a-button v-if="can('DELETE')">Delete</a-button>`}</code></pre>

      <h3>e. API-Level Permission Filter</h3>

      <p>API calls reuse the same check, so I could drop a lot of redundant conditionals.</p>

      <pre><code>{`const { can } = usePermission()
if (can('DELETE')) await useRestPost('/api/user/delete', { id })
else message.warning('You do not have delete permission.')`}</code></pre>

      <h2>Results</h2>

      <p>Pages, the router, APIs, and the UI now share one permission logic, and the duplicated code is gone. When the Role changes after login, the router picks it up right away.</p>

      <h2>Key Takeaways</h2>

      <p>I used to think a permission system was mostly about deciding what a given user is allowed to do. Once I built it, it turned out to be more of a structural question about how data and UI flow are controlled.</p>
    </Content>
  );
};
