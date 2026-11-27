'use client';

import styled from 'styled-components';

const Content = styled.div``;

interface PostProps {
  language: 'ko' | 'en';
}

export const FilterSystemPost = ({ language }: PostProps) => {
  if (language === 'ko') {
    return (
      <Content>
        <h2>배경</h2>

        <p>처음에는 단순한 조건 검색만 지원했는데, 프로젝트가 커지면서 요구사항이 늘었어요.</p>

        <ul>
          <li>다중 조건(날짜, 상태, 사용자, 태그 등) 조합 검색</li>
          <li>조건별 동적 추가/삭제</li>
          <li>선택된 필터를 태그로 보여주고 바로 제거</li>
          <li>페이지 이동이나 새로고침 후에도 검색 상태 유지</li>
          <li>API 쿼리와 UI 필터 동기화</li>
        </ul>

        <h2>문제</h2>

        <p>모든 필터를 reactive 객체 하나로 관리하고 있었어요.</p>

        <pre><code>{`const searchOption = reactive({
  keyword: '',
  dateRange: [],
  status: '',
  tags: []
})`}</code></pre>

        <p>처음엔 단순해 보였는데, 곧 문제가 드러났어요.</p>

        <ul>
          <li>필터 하나만 바꿔도 전체 watch가 반응해서 불필요한 렌더링과 중복 호출이 생겼어요.</li>
          <li>router로 이동하면 빈 객체로 초기화돼서 필터 상태가 사라졌어요.</li>
          <li>특정 필터만 지워도 전체 필터가 리셋됐어요.</li>
        </ul>

        <p>부분 업데이트와 전체 초기화가 서로 부딪히는 구조였어요.</p>

        <h2>해결 과정</h2>

        <h3>1. 필터별 독립 상태로 재설계</h3>

        <p>모든 필터가 객체 하나에 묶여 서로 의존하고 있는 게 문제였어요. 그래서 필터를 각각 따로 관리하는 useFilter composable을 만들었어요.</p>

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

        <p>이제 필터끼리 독립적으로 동작해서, 특정 필터만 초기화해도 다른 필터는 그대로예요.</p>

        <h3>2. 검색 태그</h3>

        <p>선택된 필터를 태그로 보여주고, 닫기 버튼으로 해당 필터를 지울 수 있게 했어요.</p>

        <pre><code>{`<a-tag
  v-for="(value, key) in activeFilters"
  :key="key"
  closable
  @close="resetField(key)"
>
  {{ key }}: {{ value }}
</a-tag>`}</code></pre>

        <p>어떤 필터가 걸려 있는지 보고 그 자리에서 지울 수 있으니 조작이 자연스러워졌어요.</p>

        <h2>결과</h2>

        <ul>
          <li>필터를 추가하거나 지울 때 상태가 꼬이지 않아요.</li>
          <li>페이지 이동이나 새로고침 후에도 상태가 유지돼요.</li>
          <li>불필요한 렌더링과 API 호출이 줄었어요.</li>
          <li>테스트와 유지보수가 쉬워졌어요.</li>
        </ul>

        <h2>돌아보며</h2>

        <p>UI, 상태, 라우터는 각자 책임을 나눠 따로 두는 편이 낫다는 걸 이번에 체감했어요. UI가 복잡할수록 서로의 관계를 느슨하게 만들어 둬야 유지보수가 편했어요. 트리 구조 작업도, 이번 필터 작업도 의존성을 끊는 쪽으로 설계를 바꾸면서 풀렸어요.</p>
      </Content>
    );
  }

  return (
    <Content>
      <h2>Background</h2>

      <p>At first the search only supported simple conditions, but as the project grew, the requirements piled up:</p>

      <ul>
        <li>Combined search across multiple conditions (date, status, user, tags, etc.)</li>
        <li>Adding and removing conditions on the fly</li>
        <li>Showing selected filters as tags that can be removed with one click</li>
        <li>Keeping the search state after page navigation and refresh</li>
        <li>Keeping API queries and UI filters in sync</li>
      </ul>

      <h2>The Problem</h2>

      <p>I was managing every filter in a single reactive object.</p>

      <pre><code>{`const searchOption = reactive({
  keyword: '',
  dateRange: [],
  status: '',
  tags: []
})`}</code></pre>

      <p>It looked simple at first, but problems soon showed up:</p>

      <ul>
        <li>Changing just one filter triggered the whole watch, causing unnecessary renders and duplicate calls</li>
        <li>Router navigation reset the object to empty, so the filter state disappeared</li>
        <li>Clearing one filter reset all of them</li>
      </ul>

      <p>Partial updates and full resets were fighting each other.</p>

      <h2>Fixing It</h2>

      <h3>1. Redesigning Around Independent State</h3>

      <p>The problem was that every filter was tied to one shared object and depended on it. So I wrote a useFilter composable that manages each filter separately.</p>

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

      <p>Now filters work independently, and resetting one doesn't touch the others.</p>

      <h3>2. Search Tags</h3>

      <p>I showed the selected filters as tags, each with a close button that removes that filter.</p>

      <pre><code>{`<a-tag
  v-for="(value, key) in activeFilters"
  :key="key"
  closable
  @close="resetField(key)"
>
  {{ key }}: {{ value }}
</a-tag>`}</code></pre>

      <p>Users can see which filters are active and remove them right there, which feels much more natural.</p>

      <h2>Results</h2>

      <ul>
        <li>Adding or removing filters no longer tangles the state</li>
        <li>State survives page navigation and refresh</li>
        <li>Fewer unnecessary renders and API calls</li>
        <li>Easier to test and maintain</li>
      </ul>

      <h2>Looking Back</h2>

      <p>This made it clear to me that UI, state, and the router work better as separate units, each with its own responsibility. The more complex the UI, the more it helped to keep those relationships loose. Both the tree work and this filter work got solved by redesigning to cut dependencies.</p>
    </Content>
  );
};
