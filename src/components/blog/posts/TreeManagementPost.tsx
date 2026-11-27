'use client';

import styled from 'styled-components';

const Content = styled.div``;

interface PostProps {
  language: 'ko' | 'en';
}

export const TreeManagementPost = ({ language }: PostProps) => {
  if (language === 'ko') {
    return (
      <Content>
        <h2>배경</h2>

        <p>프로젝트에서 사용자나 디바이스 데이터를 조직 구조 트리로 보여줘야 했어요. 트리를 그리기만 하면 되는 게 아니라 요구사항이 꽤 많았어요.</p>

        <ul>
          <li>상위 노드를 펼치면 하위 노드를 API로 Lazy-loading</li>
          <li>특정 유저를 클릭하면 트리가 해당 노드까지 자동으로 펼쳐짐</li>
          <li>같은 노드에 대한 중복 요청 방지</li>
          <li>트리 선택 상태를 테이블, 상세 패널 같은 외부 컴포넌트와 양방향으로 동기화</li>
          <li>데이터가 수천 개 단위여도 렌더링 성능 유지</li>
        </ul>

        <p>재귀 렌더링만으로는 감당이 안 돼서, 트리 상태를 어떻게 관리할지 따로 고민해야 했어요.</p>

        <h2>진행 과정</h2>

        <h3>a. 처음 시도한 단순 재귀 렌더링</h3>

        <p>처음엔 기본 <code>&lt;a-tree&gt;</code> 컴포넌트를 그대로 썼어요.</p>

        <pre><code>{`<a-tree
  :load-data="onTreeNodeLoad"
  :tree-data="treeData"
  @select="onSelect"
/>`}</code></pre>

        <p>노드를 펼칠 때마다 API를 호출하는 단순한 구조였는데, 금방 문제가 생겼어요.</p>

        <ul>
          <li>같은 노드를 다시 클릭하면 중복 호출</li>
          <li>하위 노드가 쌓이면서 중복 렌더링</li>
          <li>다른 컴포넌트에서 유저를 클릭하면 해당 노드를 찾지 못함</li>
          <li>Lazy-loading 도중에 확장 명령이 들어오면 트리 구조가 깨짐</li>
        </ul>

        <p>비동기 순서 문제와 중복 상태 관리가 한데 얽혀 있었어요.</p>

        <h3>b. 원인 분석</h3>

        <p>가장 큰 원인은 트리 데이터와 로딩 상태를 나눠 두지 않은 데 있었어요. <code>treeData</code> 배열만 관리하다 보니 각 노드에 대해 아래 내용을 판단할 방법이 없었어요.</p>

        <ol>
          <li>로딩 중인지</li>
          <li>이미 불러온 적이 있는지</li>
          <li>확장 가능한지</li>
        </ol>

        <p>그래서 트리 확장, 비동기 로딩, 선택 노드 탐색이 이 순서대로 일어난다는 보장이 없었어요. 부모 노드가 아직 로드되지 않았는데 자식 노드를 찾으려다 실패하는 경우가 많았어요.</p>

        <h3>c. 노드 상태 관리와 Lazy-loading 제어</h3>

        <p>먼저 노드가 자기 상태를 직접 갖도록 모델링했어요.</p>

        <pre><code>{`interface TreeNode {
  id: string
  name: string
  children?: TreeNode[]
  loaded?: boolean
  loading?: boolean
  expanded?: boolean
  parentId?: string
}`}</code></pre>

        <p>이 모델을 기준으로 Lazy-loading 로직을 고쳤어요.</p>

        <pre><code>{`const onTreeNodeLoad = async (node: TreeNode) => {
  if (node.loaded) return // 이미 불러온 노드는 재호출 X
  node.loading = true
  const data = await api.getChildren(node.id)
  node.children = data
  node.loaded = true
  node.loading = false
}`}</code></pre>

        <p>이렇게 바꾸고 나니 중복 로딩이 없어졌고, Lazy-loading 순서와 비동기 꼬임도 제어할 수 있었어요.</p>

        <h3>d. 자동 확장 로직</h3>

        <p>다음은 테이블에서 유저를 클릭하면 트리에서 그 노드까지 자동으로 펼치는 기능이었어요. 상위 노드가 아직 로드되지 않았을 수 있다는 게 걸림돌이었고, 그래서 경로를 따라 내려가며 비동기로 탐색하는 로직을 만들었어요.</p>

        <pre><code>{`const expandToUserNode = async (pathIds: string[]) => {
  let currentLevel = treeData
  for (const id of pathIds) {
    const node = currentLevel.find(n => n.id === id)
    if (!node) break
    if (!node.loaded) await onTreeNodeLoad(node)
    node.expanded = true
    currentLevel = node.children || []
  }
}`}</code></pre>

        <p>부모부터 자식 순서로 Lazy-load를 하면서 트리를 펼치기 때문에, 사용자가 클릭한 유저까지 정확히 열려요.</p>

        <h3>e. 트리와 테이블 상태 동기화</h3>

        <p>트리에서 고른 유저가 테이블에 반영되고, 테이블에서 유저를 클릭하면 트리에서도 그 노드가 선택돼야 했어요. 그래서 선택 상태를 composable 단일 인스턴스로 공유했어요.</p>

        <pre><code>{`// composables/useTreeSelection.ts
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
}`}</code></pre>

        <p>트리와 테이블 양쪽에서 이 composable을 불러와 <code>inject</code>처럼 썼어요.</p>

        <ul>
          <li>트리에서 노드 클릭: <code>selectUser(node.id)</code></li>
          <li>테이블에서 행 클릭: <code>selectUser(record.id)</code></li>
        </ul>

        <p>양쪽이 같은 상태를 바라보니 선택이 양방향으로 맞춰졌어요.</p>

        <h2>결과</h2>

        <p>노드가 많아도 렌더링이 부드럽게 유지됐고 네트워크 호출 횟수도 줄었어요. 자동 확장과 선택도 정확하게 동작했어요.</p>

        <h2>돌아보며</h2>

        <p>트리 UI는 데이터를 계층으로 그리는 일보다, 데이터 로딩과 확장과 선택 상태가 서로 얽힌 상태 관리 문제에 가까웠어요. Vue의 반응형 구조는 단순하게 두고 상태를 노드 단위로 나눠 제어한 게 효과가 있었어요. 다음에 비슷한 트리를 만들면 알아서 돌아가는 자동화보다 제가 직접 제어할 수 있는 구조부터 잡으려고 해요.</p>
      </Content>
    );
  }

  return (
    <Content>
      <h2>Background</h2>

      <p>The project needed user or device data shown as an organizational tree. Drawing the tree was the easy part. The requirements went further:</p>

      <ul>
        <li>Lazy-load child nodes from the API when a parent is expanded</li>
        <li>Clicking a specific user auto-expands the tree down to that node</li>
        <li>No duplicate requests for the same node</li>
        <li>Keep tree selection in sync both ways with outside components like tables and detail panels</li>
        <li>Keep rendering smooth even with thousands of entries</li>
      </ul>

      <p>Plain recursive rendering couldn't handle all of that, so I had to think through how to manage the tree's state.</p>

      <h2>Process</h2>

      <h3>a. Starting with Simple Recursive Rendering</h3>

      <p>At first I used the basic <code>&lt;a-tree&gt;</code> component as is.</p>

      <pre><code>{`<a-tree
  :load-data="onTreeNodeLoad"
  :tree-data="treeData"
  @select="onSelect"
/>`}</code></pre>

      <p>Every time a node was expanded it called the API. Simple enough, but problems showed up quickly:</p>

      <ul>
        <li>Clicking the same node again fired duplicate calls</li>
        <li>Child nodes piled up and rendered twice</li>
        <li>Clicking a user from another component couldn't find the matching node</li>
        <li>An expand command arriving during lazy-loading broke the tree structure</li>
      </ul>

      <p>Async ordering and duplicated state had gotten tangled together.</p>

      <h3>b. Root Cause</h3>

      <p>The main cause was that tree data and loading state weren't kept separate. I was only managing a <code>treeData</code> array, so for any given node I couldn't tell:</p>

      <ol>
        <li>Whether it's currently loading</li>
        <li>Whether it's already been loaded</li>
        <li>Whether it's expandable</li>
      </ol>

      <p>That meant nothing guaranteed the order of tree expansion, then async loading, then searching for the selected node. I often ended up looking for a child node before its parent had loaded.</p>

      <h3>c. Node State and Lazy-loading Control</h3>

      <p>First, I modeled each node so it carries its own state:</p>

      <pre><code>{`interface TreeNode {
  id: string
  name: string
  children?: TreeNode[]
  loaded?: boolean
  loading?: boolean
  expanded?: boolean
  parentId?: string
}`}</code></pre>

      <p>Then I changed the lazy-loading logic to work like this:</p>

      <pre><code>{`const onTreeNodeLoad = async (node: TreeNode) => {
  if (node.loaded) return // Don't reload already loaded nodes
  node.loading = true
  const data = await api.getChildren(node.id)
  node.children = data
  node.loaded = true
  node.loading = false
}`}</code></pre>

      <p>After this change, duplicate loads went away and I could control both the loading order and the async timing.</p>

      <h3>d. Auto-expansion</h3>

      <p>Next was auto-expanding the tree to a user clicked in the table. Parent nodes might not be loaded yet, so I wrote a path-based async search that walks down level by level:</p>

      <pre><code>{`const expandToUserNode = async (pathIds: string[]) => {
  let currentLevel = treeData
  for (const id of pathIds) {
    const node = currentLevel.find(n => n.id === id)
    if (!node) break
    if (!node.loaded) await onTreeNodeLoad(node)
    node.expanded = true
    currentLevel = node.children || []
  }
}`}</code></pre>

      <p>It lazy-loads from parent to child in order while expanding, so the tree opens exactly down to the clicked user.</p>

      <h3>e. Syncing the Tree with the Table</h3>

      <p>A user selected in the tree had to show up in the table, and clicking a user in the table had to select the same node in the tree. I shared the selection state through a single composable instance:</p>

      <pre><code>{`// composables/useTreeSelection.ts
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
}`}</code></pre>

      <p>Both the tree and the table import it, and I used it a bit like dependency injection:</p>

      <ul>
        <li>Tree node click: <code>selectUser(node.id)</code></li>
        <li>Table row click: <code>selectUser(record.id)</code></li>
      </ul>

      <p>Since both sides read the same state, selection stays in sync in both directions.</p>

      <h2>Results</h2>

      <p>Rendering stayed smooth even with many nodes, and the number of network calls dropped. Auto-expansion and selection both behaved accurately.</p>

      <h2>Looking Back</h2>

      <p>Tree UI turned out to be less about drawing hierarchical data and more about state management, with loading, expansion, and selection all tangled together. Keeping Vue's reactivity simple and splitting state per node is what worked. Next time I build a tree like this, I'll start from a structure I can control directly rather than one that tries to automate everything.</p>
    </Content>
  );
};
