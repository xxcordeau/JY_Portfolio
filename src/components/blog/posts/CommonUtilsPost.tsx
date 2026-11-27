'use client';

import styled from 'styled-components';

const Content = styled.div``;

interface PostProps {
  language: 'ko' | 'en';
}

export const CommonUtilsPost = ({ language }: PostProps) => {
  if (language === 'ko') {
    return (
      <Content>
        <h2>배경</h2>

        <p>i18n 접미사 처리, 권한 체크, 파일 유형/용량 포맷, 아이콘 스타일 같은 로직이 여러 화면에 중복돼 있었어요. 페이지마다 조금씩 달라서 UX와 정책도 서로 맞지 않았어요.</p>

        <ul>
          <li>화면마다 표현이 조금씩 달라 UX가 일관되지 않았어요.</li>
          <li>로직이 템플릿에 섞여 있어서 읽기도 테스트하기도 어려웠고, 고칠 때마다 손댈 범위가 넓었어요.</li>
          <li>팀 컨벤션상 <code>watch</code> 없이 onMounted 순서 제어와 arrow 함수 명시 호출을 지향했기 때문에, 흩어진 로직을 명시적으로 호출할 수 있는 유틸/컴포저블로 정리할 필요가 있었어요.</li>
        </ul>

        <h2>진행 과정</h2>

        <h3>A. i18n 옵션 문자열 빌더 (useBuildOptionText)</h3>

        <p>선택 옵션 뒤에 "Page/쪽" 같은 고정 접미사를 화면마다 제각각 붙이다 보니 다국어 표기가 어긋났어요.</p>

        <p>그래서 Nuxt의 <code>useNuxtApp()</code>에서 i18n 인스턴스를 받아, 라벨 만드는 일을 함수 하나로 모았어요.</p>

        <pre><code>{`const nuxtApp = useNuxtApp()
const buildOptionText = (text) => {
  const t = nuxtApp.$i18n.t
  return \`\${text.value} \${t('Page')}\`
}
export const useBuildOptionText = () => buildOptionText`}</code></pre>

        <p>템플릿에서는 <code>useBuildOptionText()(option)</code> 한 줄이면 돼요. 문구와 포맷이 통일됐고 SSR/CSR 환경에서도 안전하게 동작했어요.</p>

        <h3>B. 메뉴 권한 탐색 (useFindPermissionValue, useFindPermissionValueInput)</h3>

        <p>버튼, 입력, 라우팅에서 권한 분기가 중복됐고, 트리 하위 메뉴 권한을 찾으려고 화면마다 재귀를 새로 구현하고 있었어요.</p>

        <p><code>useMenuItemTree().value</code>를 기본 트리로 두고, 재귀 탐색을 composable 하나로 감쌌어요.</p>

        <pre><code>{`export const useFindPermissionValue = (menuId, type, menuPage = useMenuItemTree().value) => {
  // 재귀 탐색, Y → false / N → true
}
export const useFindPermissionValueInput = (menuId, type, menuPage = useMenuItemTree().value) => {
  // 재귀 탐색, Y → true / N → false
}`}</code></pre>

        <ul>
          <li>기본값은 전역 트리지만, 테스트 환경에서는 원하는 트리를 넘길 수 있어요.</li>
          <li>Y/N 기준은 주석으로 적어 뒀어요. 이름을 <code>shouldHide</code>, <code>canUse</code>처럼 나누는 것도 권장해요.</li>
        </ul>

        <p>권한 로직이 한 곳으로 모이면서 화면별 분기와 예외 처리가 많이 줄었어요.</p>

        <h3>C. 파일 유형·용량 포맷 (useMimetypeCheck, useFileSizeFormat)</h3>

        <p>업로드와 미리보기에서 mimetype, 확장자, 사이즈 포맷이 제각각이라 UI가 들쭉날쭉했고 버그도 자주 났어요.</p>

        <ul>
          <li><code>useMimetypeCheck(mimetype, ext)</code>: 확장자 우선 규칙으로 정수 타입 코드를 반환해요 (0: unknown, 1: text, 2: image, 3: pdf, 4: office 등).</li>
          <li><code>useFileSizeFormat(bytes)</code>: 1024 단위 포맷(소수점 2자리)으로 변환해요.</li>
        </ul>

        <pre><code>{`export const useMimetypeCheck = (mimetype, fileExtension) => { /* 우선순위 + 정규식 매핑 */ }
export const useFileSizeFormat = (size) => { /* 1024 단위 포맷 */ }`}</code></pre>

        <p>미리보기, 아이콘, 버튼 활성화 로직이 같은 결과값(타입 코드, 포맷 문자열)을 쓰게 되면서 UI와 정책이 서로 맞아떨어졌어요.</p>

        <h3>D. 아이콘 표준화와 useIcon (iconPack / getIconColor)</h3>

        <p>아이콘 색상, 크기, 여백이 화면마다 인라인으로 따로 지정돼 있어서 디자인 드리프트가 심했어요.</p>

        <p><code>iconPack</code>에 이름별 메타데이터(iconName, color, size, marginRight)를 선언하고, 컴포넌트 하나에서만 관리하게 했어요. props가 들어오면 그 값을 먼저 쓰고, 없으면 pack 기본값을 써요. <code>disabledType</code>일 때는 회색으로 고정돼요.</p>

        <pre><code>{`<Icon
  :name="\`my-icon:\${iconPack[name].iconName}\`"
  :size="computedSize"
  :style="\`color:\${computedColor}\`"
/>`}</code></pre>

        <p>테마를 바꿀 땐 iconPack만 고치면 전체에 반영되고, 템플릿에는 의미 있는 이름만 남아서 코드 읽기가 쉬워졌어요.</p>

        <h2>결과</h2>

        <p>중복이 줄고 유지보수가 편해졌어요. i18n 접미사, 권한 처리, 파일 표기, 아이콘 스타일이 서비스 전체에서 같게 나오니 UX도 일관돼졌어요. 권한이나 포맷처럼 순수 함수에 가까운 composable은 단위 테스트가 쉬워졌고 회귀 버그도 줄었어요.</p>

        <h2>돌아보며</h2>

        <p>작은 유틸이라도 책임을 분명히 나눠 재사용할 수 있게 만들어 두면 프로젝트 전체 품질에 도움이 된다는 걸 다시 확인했어요. 명시적으로 함수를 호출하는 패턴이 watch보다 동작을 예측하기 쉽고 테스트와 유지보수도 수월하다는 건 팀 전체가 체감한 부분이에요.</p>
      </Content>
    );
  }

  return (
    <Content>
      <h2>Background</h2>

      <p>The same logic (i18n suffix handling, permission checks, file type/size formatting, icon styles) was duplicated across multiple screens, and small differences from page to page left the UX and policies out of step with each other.</p>

      <ul>
        <li>Each screen expressed things slightly differently, so the UX wasn't consistent.</li>
        <li>Logic was mixed into templates, which hurt readability and testability, and any change meant a wide refactor.</li>
        <li>Our team convention favors controlling order with onMounted and calling arrow functions explicitly instead of using <code>watch</code>, so the scattered logic needed to become utils/composables you call explicitly.</li>
      </ul>

      <h2>Process</h2>

      <h3>A. i18n Option String Builder (useBuildOptionText)</h3>

      <p>Each screen was tacking fixed suffixes like "Page/쪽" onto selection options in its own way, so the translations didn't line up.</p>

      <p>I took the i18n instance from Nuxt's <code>useNuxtApp()</code> and moved label generation into a single function.</p>

      <pre><code>{`const nuxtApp = useNuxtApp()
const buildOptionText = (text) => {
  const t = nuxtApp.$i18n.t
  return \`\${text.value} \${t('Page')}\`
}
export const useBuildOptionText = () => buildOptionText`}</code></pre>

      <p>In templates, <code>useBuildOptionText()(option)</code> is all it takes. Wording and format are now the same everywhere, and it works safely in both SSR and CSR.</p>

      <h3>B. Menu Permission Search (useFindPermissionValue, useFindPermissionValueInput)</h3>

      <p>Permission branching was duplicated across buttons, inputs, and routing, and every screen reimplemented its own recursion to find permissions for submenus in the tree.</p>

      <p>I used <code>useMenuItemTree().value</code> as the default tree and wrapped the recursive search in one composable.</p>

      <pre><code>{`export const useFindPermissionValue = (menuId, type, menuPage = useMenuItemTree().value) => {
  // Recursive search, Y → false / N → true
}
export const useFindPermissionValueInput = (menuId, type, menuPage = useMenuItemTree().value) => {
  // Recursive search, Y → true / N → false
}`}</code></pre>

      <ul>
        <li>The global tree is the default, but tests can pass in any tree they want.</li>
        <li>The Y/N meaning is written down in comments. Splitting names like <code>shouldHide</code> and <code>canUse</code> is also recommended.</li>
      </ul>

      <p>With permission logic in one place, screen-specific branching and exception handling went down a lot.</p>

      <h3>C. File Type/Size Format (useMimetypeCheck, useFileSizeFormat)</h3>

      <p>Mimetype, extension, and size formatting differed between upload and preview, so the UI was inconsistent and bugs came up often.</p>

      <ul>
        <li><code>useMimetypeCheck(mimetype, ext)</code> returns an integer type code using an extension-first rule (0: unknown, 1: text, 2: image, 3: pdf, 4: office, etc.)</li>
        <li><code>useFileSizeFormat(bytes)</code> converts to a 1024-based format with 2 decimal places</li>
      </ul>

      <pre><code>{`export const useMimetypeCheck = (mimetype, fileExtension) => { /* Priority + regex mapping */ }
export const useFileSizeFormat = (size) => { /* 1024 unit format */ }`}</code></pre>

      <p>Preview, icon, and button-enable logic now share the same result values (type code, format string), so the UI and the policy finally match.</p>

      <h3>D. Icon Standardization with useIcon (iconPack / getIconColor)</h3>

      <p>Icon colors, sizes, and margins were set inline and differently on each screen, and the design was drifting badly.</p>

      <p>I declared metadata for each name (iconName, color, size, marginRight) in <code>iconPack</code> and managed it in a single component. Props win if they're passed; otherwise the pack defaults apply. For <code>disabledType</code>, the color is fixed to gray.</p>

      <pre><code>{`<Icon
  :name="\`my-icon:\${iconPack[name].iconName}\`"
  :size="computedSize"
  :style="\`color:\${computedColor}\`"
/>`}</code></pre>

      <p>Changing the theme now only means editing iconPack, and templates only carry meaningful names, which makes the code easier to read.</p>

      <h2>Results</h2>

      <p>There's less duplication and maintenance is easier. i18n suffixes, permission handling, file notation, and icon styles look the same across the whole service, so the UX is consistent. Composables that are close to pure functions, like permissions and formatting, became easy to unit test, and regression bugs went down.</p>

      <h2>Looking Back</h2>

      <p>This confirmed again that even small utilities pay off for the whole project when each one has a clear responsibility and is built for reuse. The whole team also noticed that explicit function calls are more predictable than watch, and easier to test and maintain.</p>
    </Content>
  );
};
