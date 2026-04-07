import styled from 'styled-components';

const Content = styled.div``;

interface PostProps {
  language: 'ko' | 'en';
}

export const FilterSystemPost = ({ language }: PostProps) => {
  if (language === 'ko') {
    return (
      <Content>
        <h1>블로그 검색 필터 시스템 구현 경험</h1>
        
        <h2>배경</h2>
        
        <p>초기에는 단순한 조건 검색만 지원했지만, 프로젝트가 커지면서 다음과 같은 복잡한 요구사항이 생겼습니다.</p>
        
        <ul>
          <li>다중 조건(날짜, 상태, 사용자, 태그 등) 조합 검색</li>
          <li>각 조건의 동적 추가/삭제</li>
          <li>선택된 필터를 태그 형태로 시각화해 직관적으로 제거</li>
          <li>페이지 이동 및 새로고침 후에도 검색 상태 유지</li>
          <li>API 쿼리와 UI 필터의 완전한 동기화</li>
        </ul>
        
        <h2>문제 원인</h2>
        
        <p>모든 필터를 하나의 reactive 객체로 관리했습니다.</p>
        
        <pre><code>{`const searchOption = reactive({
  keyword: '',
  dateRange: [],
  status: '',
  tags: []
})`}</code></pre>
        
        <p>처음엔 단순해 보였지만, 곧 다음 문제가 드러났습니다.</p>
        
        <ul>
          <li>일부 필터만 변경해도 전체 watch가 반응 → 불필요한 렌더링과 중복 호출</li>
          <li>router 이동 시 빈 객체로 초기화되어 필터 상태가 사라짐</li>
          <li>특정 필터만 지워도 전체 필터가 리셋됨</li>
        </ul>
        
        <p>즉, <strong>부분 업데이트와 전체 초기화가 충돌하는 구조</strong>였습니다.</p>
        
        <h2>해결 과정</h2>
        
        <h3>1️⃣ 구조 재설계 — 독립형 상태 관리</h3>
        
        <p>문제의 핵심이 전역 의존성이었어요. 그래서 각 필터를 독립적으로 관리하는 useFilter composable을 설계했습니다.</p>
        
        <pre><code>{`export const useFilter = () => {
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
}`}</code></pre>
        
        <p>이제 필터가 서로 독립적으로 작동하며, 특정 필터만 초기화해도 다른 필터는 영향을 받지 않습니다.</p>
        
        <h3>2️⃣ 검색 태그 시스템</h3>
        
        <p>선택된 필터를 태그 형태로 표시하고, 닫기 버튼으로 해당 필터를 제거할 수 있도록 했습니다.</p>
        
        <pre><code>{`<a-tag
  v-for="(value, key) in activeFilters"
  :key="key"
  closable
  @close="resetField(key)"
>
  {{ key }}: {{ value }}
</a-tag>`}</code></pre>
        
        <p>사용자가 필터를 직관적으로 조작할 수 있어 UX가 훨씬 자연스러워졌습니다.</p>
        
        <h2>결과</h2>
        
        <ul>
          <li>✅ 필터 추가/삭제 시 상태 꼬임 완전히 제거</li>
          <li>✅ 페이지 이동 및 새로고침 후에도 상태 유지</li>
          <li>✅ 불필요한 렌더링 및 API 호출 감소</li>
          <li>✅ 테스트 및 유지보수 용이</li>
        </ul>
        
        <h2>배운 점</h2>
        
        <p>이 경험을 통해 "UI·상태·라우터는 서로 독립된 책임 단위로 분리돼야 한다"는 걸 체감했습니다. 복잡한 UI일수록 관계를 느슨하게 만드는 게 유지보수를 쉽게 합니다. 트리 구조나 상태 설계 모두 결국 "의존성을 끊는 설계"가 핵심이었습니다.</p>
      </Content>
    );
  }

  return (
    <Content>
      <h1>Blog Search Filter System Implementation Experience</h1>
      
      <h2>Background</h2>
      
      <p>Initially, I only supported simple conditional searches, but as the project grew, the following complex requirements emerged.</p>
      
      <ul>
        <li>Combined search with multiple conditions (date, status, user, tags, etc.)</li>
        <li>Dynamic addition/removal of each condition</li>
        <li>Visualize selected filters as tags for intuitive removal</li>
        <li>Maintain search state even after page navigation and refresh</li>
        <li>Complete synchronization between API queries and UI filters</li>
      </ul>
      
      <h2>Problem Cause</h2>
      
      <p>I managed all filters as a single reactive object.</p>
      
      <pre><code>{`const searchOption = reactive({
  keyword: '',
  dateRange: [],
  status: '',
  tags: []
})`}</code></pre>
      
      <p>At first, it seemed simple, but soon the following problems became apparent.</p>
      
      <ul>
        <li>Even changing a single filter triggered the entire watch → unnecessary rendering and duplicate calls</li>
        <li>Filter state disappeared when router navigation initialized to an empty object</li>
        <li>Deleting a specific filter would reset all filters</li>
      </ul>
      
      <p>In other words, <strong>partial updates and full initialization conflicted</strong>.</p>
      
      <h2>Solution Process</h2>
      
      <h3>1️⃣ Structural Redesign — Independent State Management</h3>
      
      <p>The core of the problem was global dependency. So I designed a useFilter composable that manages each filter independently.</p>
      
      <pre><code>{`export const useFilter = () => {
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
}`}</code></pre>
      
      <p>Now filters work independently, and initializing a specific filter doesn't affect other filters.</p>
      
      <h3>2️⃣ Search Tag System</h3>
      
      <p>I displayed selected filters as tags and enabled removal of specific filters with a close button.</p>
      
      <pre><code>{`<a-tag
  v-for="(value, key) in activeFilters"
  :key="key"
  closable
  @close="resetField(key)"
>
  {{ key }}: {{ value }}
</a-tag>`}</code></pre>
      
      <p>Users can now manipulate filters intuitively, making the UX much more natural.</p>
      
      <h2>Results</h2>
      
      <ul>
        <li>✅ Completely eliminated state entanglement when adding/removing filters</li>
        <li>✅ State maintained even after page navigation and refresh</li>
        <li>✅ Reduced unnecessary rendering and API calls</li>
        <li>✅ Easy to test and maintain</li>
      </ul>
      
      <h2>Key Takeaways</h2>
      
      <p>Through this experience, I realized that "UI, state, and router should be separated as independent units of responsibility." The more complex the UI, the easier it is to maintain when relationships are loosely coupled. Both tree structure and state design ultimately come down to "designing to break dependencies."</p>
    </Content>
  );
};
