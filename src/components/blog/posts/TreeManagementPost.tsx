import styled from 'styled-components';

const Content = styled.div``;

interface PostProps {
  language: 'ko' | 'en';
}

export const TreeManagementPost = ({ language }: PostProps) => {
  if (language === 'ko') {
    return (
      <Content>
        <h1>트리 구조 기반 사용자/자산 관리 화면 구현 경험</h1>
        
        <h2>원인</h2>
        
        <p>프로젝트에서 사용자 또는 디바이스 데이터를 <strong>조직 구조 트리 형태로 시각화</strong>해야 했습니다.</p>
        
        <p>이 트리에는 단순히 트리를 그리는 수준이 아니라, 다음과 같은 복잡한 요구사항이 있었어요.</p>
        
        <ul>
          <li>상위 노드를 펼치면 하위 노드를 <strong>API로 Lazy-loading</strong></li>
          <li><strong>특정 유저 클릭 시 트리가 자동으로 확장</strong>되어 해당 노드까지 열림</li>
          <li>동일 노드 <strong>중복 요청 방지</strong></li>
          <li>트리 선택 상태가 <strong>테이블, 상세 패널 등 외부 컴포넌트와 양방향 동기화</strong></li>
          <li>데이터가 수천 개 단위일 때도 <strong>렌더링 성능 유지</strong></li>
        </ul>
        
        <p>이러한 요구사항들 때문에 단순 재귀 렌더링만으로는 감당이 안 됐고, <strong>&lt;트리 구조를 상태로 어떻게 관리할 것인가?&gt;</strong>에 대해 고민했습니다.</p>
        
        <h2>과정과 문제 탐색</h2>
        
        <h3>a. 초기 접근 – 단순 재귀 렌더링</h3>
        
        <p>처음엔 Vue의 기본 <code>&lt;a-tree&gt;</code> 컴포넌트를 그대로 사용했어요.</p>
        
        <pre><code>{`<a-tree
  :load-data="onTreeNodeLoad"
  :tree-data="treeData"
  @select="onSelect"
/>`}</code></pre>
        
        <p>노드를 펼칠 때마다 API를 호출하는 단순 구조였지만, 곧 문제들이 터졌는데요.</p>
        
        <ul>
          <li>동일 노드를 다시 클릭하면 <strong>중복 호출</strong></li>
          <li>하위 노드가 누적되어 <strong>중복 렌더링</strong></li>
          <li>다른 컴포넌트에서 유저 클릭 시 <strong>해당 노드를 탐색 불가</strong></li>
          <li>Lazy-loading 도중 확장 명령이 들어오면 <strong>트리 구조 깨짐</strong></li>
        </ul>
        
        <p>즉, 비동기 순서 문제와 중복 상태 관리가 얽혀버리게 되었어요.</p>
        
        <h3>b. 원인 분석</h3>
        
        <p>가장 큰 원인은 <strong>트리 데이터와 로딩 상태가 분리되어 있지 않는 것</strong>이었어요.</p>
        
        <p>단순히 <code>treeData</code> 배열만 관리했기 때문에, 각 노드가</p>
        
        <ol>
          <li>로딩 중인지</li>
          <li>이미 불러온 적이 있는지</li>
          <li>확장 가능한지</li>
        </ol>
        
        <p>이 세 가지를 판단할 방법이 없었고</p>
        
        <blockquote>
          <p>트리 확장 → 비동기 로딩 → 선택 노드 탐색</p>
        </blockquote>
        
        <p>이 순서가 보장되지 않는다는 것이었죠.</p>
        
        <p>때문에 부모 노드가 아직 로드되지 않았는데 자식 노드를 찾으려다 실패하는 경우가 많았어요.</p>
        
        <h3>c. 해결 전략 – 노드 상태 관리 + Lazy-loading 제어</h3>
        
        <p>우선 노드가 자체 상태를 가지도록 명확히 모델링했어요</p>
        
        <pre><code>{`interface TreeNode {
  id: string
  name: string
  children?: TreeNode[]
  loaded?: boolean
  loading?: boolean
  expanded?: boolean
  parentId?: string
}`}</code></pre>
        
        <p>모델링을 기반으로 Lazy-loading 로직은 다음처럼 작동하도록 수정하였습니다.</p>
        
        <pre><code>{`const onTreeNodeLoad = async (node: TreeNode) => {
  if (node.loaded) return // 이미 불러온 노드는 재호출 X
  node.loading = true
  const data = await api.getChildren(node.id)
  node.children = data
  node.loaded = true
  node.loading = false
}`}</code></pre>
        
        <p>이 구조로 바꾸면서 중복 로딩이 사라지고, Lazy-loading 순서와 비동기 꼬임 모두 안정적으로 제어할 수 있었어요.</p>
        
        <h3>d. 자동 확장 로직 구현</h3>
        
        <p>다음 문제는 <strong>테이블에서 유저 클릭 시 트리에서 해당 노드를 자동 확장</strong>하는 기능이었는데요.</p>
        
        <p>문제는 상위 노드가 아직 로드되지 않았을 수 있다는 점이었고 이를 해결하기 위해 <strong>경로 기반 비동기 재귀 탐색</strong> 로직을 만들었어요</p>
        
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
        
        <p>이 로직으로 수정한 후 부모부터 자식 순서대로 Lazy-load를 수행하며, 트리를 자동 확장해 사용자가 클릭한 유저까지 정확히 펼쳐줄 수 있었어요.</p>
        
        <h3>e. 트리와 외부 상태(테이블)의 동기화</h3>
        
        <p>트리에서 선택한 유저가 테이블에 반영되고, 테이블에서 유저를 클릭하면 트리에서도 해당 노드가 선택되어야 했기 때문에 <strong>composable 단일 인스턴스</strong>로 선택 상태를 공유했어요</p>
        
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
        
        <p>이걸 트리와 테이블 양쪽에서 불러와 <code>inject</code>하듯 사용하였습니다.</p>
        
        <ul>
          <li>트리에서 노드 클릭 → <code>selectUser(node.id)</code></li>
          <li>테이블에서 행 클릭 → <code>selectUser(record.id)</code></li>
        </ul>
        
        <p>이로 인해 자연스럽게 <strong>양방향 반응형 동기화</strong>를 사용할 수 있었어요.</p>
        
        <h2>결과</h2>
        
        <p>결과적으로 많은 노드에서도 부드러운 렌더링을 유지하고 네트워크 호출 횟수를 감소시킬 수 있었습니다. 또한 자동 확장과 선택에 있어 정확하게 유지할 수 있게 되었어요.</p>
        
        <h2>배운 점</h2>
        
        <p>이 경험을 통해 배운 건, 트리 UI는 단순히 데이터를 계층적으로만 그리는 것이 아니라 <strong>데이터 로딩, 확장, 선택 상태가 서로 얽힌 복합적인 상태 관리 문제</strong>라는 것을 알게 되었고</p>
        
        <p>Vue의 반응형 구조를 단순하게 유지하면서 노드 단위로 상태를 분리·제어한 것이 핵심이었고, 단순 자동화보다 제어 가능한 구조의 중요성을 더욱 깨닫게 되었습니다.</p>
      </Content>
    );
  }

  return (
    <Content>
      <h1>Tree-Based User/Asset Management UI Implementation Experience</h1>
      
      <h2>Background</h2>
      
      <p>In the project, I needed to <strong>visualize user or device data in an organizational tree structure</strong>.</p>
      
      <p>This tree had complex requirements beyond just rendering a tree:</p>
      
      <ul>
        <li><strong>API-based Lazy-loading</strong> of child nodes when expanding parent nodes</li>
        <li><strong>Auto-expansion of the tree</strong> to the target node when clicking a specific user</li>
        <li><strong>Prevention of duplicate requests</strong> for the same node</li>
        <li><strong>Bi-directional synchronization</strong> of tree selection state with external components like tables and detail panels</li>
        <li><strong>Maintaining rendering performance</strong> even with thousands of data entries</li>
      </ul>
      
      <p>These requirements meant simple recursive rendering wasn't enough, and I had to think about <strong>&lt;How to manage tree structure as state?&gt;</strong></p>
      
      <h2>Process and Problem Exploration</h2>
      
      <h3>a. Initial Approach – Simple Recursive Rendering</h3>
      
      <p>Initially, I used Vue's basic <code>&lt;a-tree&gt;</code> component as is.</p>
      
      <pre><code>{`<a-tree
  :load-data="onTreeNodeLoad"
  :tree-data="treeData"
  @select="onSelect"
/>`}</code></pre>
      
      <p>It was a simple structure that called the API whenever a node was expanded, but problems soon emerged:</p>
      
      <ul>
        <li><strong>Duplicate calls</strong> when clicking the same node again</li>
        <li><strong>Duplicate rendering</strong> as child nodes accumulated</li>
        <li><strong>Unable to navigate to nodes</strong> when users clicked from other components</li>
        <li><strong>Tree structure breaks</strong> when expansion commands come during Lazy-loading</li>
      </ul>
      
      <p>In other words, async ordering issues and duplicate state management became intertwined.</p>
      
      <h3>b. Root Cause Analysis</h3>
      
      <p>The main cause was that <strong>tree data and loading state were not separated</strong>.</p>
      
      <p>Since I was only managing a <code>treeData</code> array, there was no way to determine for each node:</p>
      
      <ol>
        <li>Whether it's currently loading</li>
        <li>Whether it's already been loaded</li>
        <li>Whether it's expandable</li>
      </ol>
      
      <p>And the sequence:</p>
      
      <blockquote>
        <p>Tree expansion → Async loading → Node selection search</p>
      </blockquote>
      
      <p>was not guaranteed.</p>
      
      <p>This often led to failures when trying to find child nodes before parent nodes were loaded.</p>
      
      <h3>c. Solution Strategy – Node State Management + Lazy-loading Control</h3>
      
      <p>First, I clearly modeled nodes to have their own state:</p>
      
      <pre><code>{`interface TreeNode {
  id: string
  name: string
  children?: TreeNode[]
  loaded?: boolean
  loading?: boolean
  expanded?: boolean
  parentId?: string
}`}</code></pre>
      
      <p>Based on this modeling, I modified the Lazy-loading logic to work as follows:</p>
      
      <pre><code>{`const onTreeNodeLoad = async (node: TreeNode) => {
  if (node.loaded) return // Don't reload already loaded nodes
  node.loading = true
  const data = await api.getChildren(node.id)
  node.children = data
  node.loaded = true
  node.loading = false
}`}</code></pre>
      
      <p>With this structure, duplicate loading disappeared, and I could stably control both Lazy-loading order and async entanglement.</p>
      
      <h3>d. Auto-expansion Logic Implementation</h3>
      
      <p>The next problem was <strong>auto-expanding the tree to the target node when clicking a user from the table</strong>.</p>
      
      <p>The issue was that parent nodes might not be loaded yet, so I created a <strong>path-based async recursive search</strong> logic:</p>
      
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
      
      <p>After this modification, I could perform Lazy-loading from parent to child in order and auto-expand the tree to precisely show the user that was clicked.</p>
      
      <h3>e. Synchronizing Tree with External State (Table)</h3>
      
      <p>The selected user from the tree needed to be reflected in the table, and clicking a user in the table should select the corresponding node in the tree. I used a <strong>composable singleton instance</strong> to share the selection state:</p>
      
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
      
      <p>I imported this in both the tree and table, using it like dependency injection:</p>
      
      <ul>
        <li>Tree node click → <code>selectUser(node.id)</code></li>
        <li>Table row click → <code>selectUser(record.id)</code></li>
      </ul>
      
      <p>This naturally enabled <strong>bi-directional reactive synchronization</strong>.</p>
      
      <h2>Results</h2>
      
      <p>As a result, I was able to maintain smooth rendering even with many nodes and reduce the number of network calls. Additionally, auto-expansion and selection were maintained accurately.</p>
      
      <h2>Key Takeaways</h2>
      
      <p>What I learned from this experience is that tree UI is not just about hierarchically rendering data, but rather a <strong>complex state management problem where data loading, expansion, and selection states are intertwined</strong>.</p>
      
      <p>The key was to keep Vue's reactive structure simple while separating and controlling state at the node level, and I gained a deeper appreciation for the importance of controllable structures over simple automation.</p>
    </Content>
  );
};
