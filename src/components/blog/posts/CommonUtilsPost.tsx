import styled from 'styled-components';

const Content = styled.div``;

interface PostProps {
  language: 'ko' | 'en';
}

export const CommonUtilsPost = ({ language }: PostProps) => {
  if (language === 'ko') {
    return (
      <Content>
        <h1>공통 유틸/컴포저블 분리 사례</h1>
        
        <h2>원인</h2>
        
        <p>같은 로직(i18n 접미사 처리, 권한 체크, 파일 유형/용량 포맷, 아이콘 스타일)이 <strong>여러 화면에 중복</strong>되어 있었고, 페이지마다 미세하게 달라 <strong>UX/정책 불일치</strong>가 발생했어요.</p>
        
        <ul>
          <li>동일한 로직(i18n 접미사, 권한 체크, 파일 포맷, 아이콘 스타일)이 <strong>여러 화면에 중복</strong></li>
          <li>화면마다 표현이 조금씩 달라 <strong>UX 불일치</strong></li>
          <li>로직이 템플릿에 섞여 <strong>가독성·테스트성 저하</strong>, 수정 시 <strong>광범위한 리팩터링 필요</strong></li>
          <li>팀 컨벤션상 <code>watch</code> 없이 <strong>onMounted 순서 제어 + arrow 함수 명시 호출</strong>을 지향하기 때문에, 흩어진 로직을 <strong>명시적으로 호출 가능한 유틸/컴포저블로 정리</strong>할 필요가 있었어요.</li>
        </ul>
        
        <h2>과정과 문제 탐색</h2>
        
        <h3>A. i18n 옵션 문자열 빌더 — useBuildOptionText</h3>
        
        <h4>문제</h4>
        
        <p>선택 옵션 뒤에 "Page/쪽" 같은 <strong>고정 접미사</strong>를 화면마다 임의로 붙이면서 다국어 불일치가 발생했어요.</p>
        
        <h4>설계</h4>
        
        <p>Nuxt의 <code>useNuxtApp()</code>에서 i18n 인스턴스를 받아 하나의 함수로 라벨 생성을 통합했습니다.</p>
        
        <pre><code>{`const nuxtApp = useNuxtApp()
const buildOptionText = (text) => {
  const t = nuxtApp.$i18n.t
  return \`\${text.value} \${t('Page')}\`
}
export const useBuildOptionText = () => buildOptionText`}</code></pre>
        
        <h4>효과</h4>
        
        <p>템플릿에서는 <code>useBuildOptionText()(option)</code> 한 줄이면 끝. 모든 문구와 포맷이 통일되고 SSR/CSR 환경에서도 안전해졌어요.</p>
        
        <h3>B. 메뉴 권한 탐색 — useFindPermissionValue, useFindPermissionValueInput</h3>
        
        <h4>문제</h4>
        
        <p>버튼/입력/라우팅에서 권한 분기가 <strong>중복</strong>되고, 트리 하위 메뉴 권한을 찾기 위해 <strong>화면마다 재귀 구현</strong>을 반복했어요.</p>
        
        <h4>설계</h4>
        
        <p><code>useMenuItemTree().value</code>를 기본 트리로 사용하고, 재귀 탐색을 하나의 composable로 캡슐화했습니다.</p>
        
        <pre><code>{`export const useFindPermissionValue = (menuId, type, menuPage = useMenuItemTree().value) => {
  // 재귀 탐색, Y → false / N → true
}
export const useFindPermissionValueInput = (menuId, type, menuPage = useMenuItemTree().value) => {
  // 재귀 탐색, Y → true / N → false
}`}</code></pre>
        
        <ul>
          <li><strong>트리 주입 가능:</strong> 기본은 전역 트리, 테스트 환경에서는 임의 트리 전달 가능</li>
          <li><strong>반환 의미 명시:</strong> 주석으로 Y/N 기준을 명확히 (<code>shouldHide</code>, <code>canUse</code>처럼 분리 권장)</li>
        </ul>
        
        <h4>효과</h4>
        
        <p>권한 로직이 한 곳으로 통합되고, 화면별 분기나 예외 처리가 크게 줄었습니다.</p>
        
        <h3>C. 파일 유형·용량 포맷 — useMimetypeCheck, useFileSizeFormat</h3>
        
        <h4>문제</h4>
        
        <p>업로드/미리보기에서 mimetype·확장자·사이즈 포맷이 제각각이라 <strong>UI 일관성이 깨지고 버그가 잦았어요.</strong></p>
        
        <h4>설계</h4>
        
        <ul>
          <li><code>useMimetypeCheck(mimetype, ext)</code> → 확장자 우선 규칙으로 <strong>정수 타입 코드</strong> 반환 (0: unknown, 1: text, 2: image, 3: pdf, 4: office 등)</li>
          <li><code>useFileSizeFormat(bytes)</code> → <strong>1024 단위 포맷 (소수점 2자리)</strong>으로 변환</li>
        </ul>
        
        <pre><code>{`export const useMimetypeCheck = (mimetype, fileExtension) => { /* 우선순위 + 정규식 매핑 */ }
export const useFileSizeFormat = (size) => { /* 1024 단위 포맷 */ }`}</code></pre>
        
        <h4>효과</h4>
        
        <p>미리보기/아이콘/버튼 활성화 로직이 <strong>하나의 결과값(타입 코드, 포맷 문자열)</strong>을 공유하게 되어 UI와 정책이 완전히 일치했습니다.</p>
        
        <h3>D. 아이콘 표준화 &lt;Icon&gt; + useIcon (iconPack / getIconColor)</h3>
        
        <h4>문제</h4>
        
        <p>아이콘 색상·크기·여백이 화면마다 인라인으로 다르게 지정되어 <strong>디자인 드리프트(Drift)</strong>가 심했어요.</p>
        
        <h4>설계</h4>
        
        <p><code>iconPack</code>에 이름 → 메타데이터(iconName, color, size, marginRight)를 선언하고 한 컴포넌트에서만 관리하도록 했습니다.</p>
        
        <p>props가 들어오면 우선 적용, 없으면 pack 기본값 사용. <code>disabledType</code>일 땐 회색 고정.</p>
        
        <pre><code>{`<Icon
  :name="\`my-icon:\${iconPack[name].iconName}\`"
  :size="computedSize"
  :style="\`color:\${computedColor}\`"
/>`}</code></pre>
        
        <h4>효과</h4>
        
        <p>테마 변경 시 iconPack만 수정하면 전체 반영, 템플릿에서는 <strong>의미 있는 이름만 사용</strong>해서 코드 가독성이 높아졌어요.</p>
        
        <h2>결과</h2>
        
        <p>중복 제거와 유지보수성이 높아졌으며, i18n 접미사, 권한 처리, 파일 표기, 아이콘 스타일이 서비스 전반에서 동일하여 <strong>UX 일관성을 확보</strong>할 수 있었어요. 또 권한·포맷 같은 순수 함수형 composable 구조 덕분에 <strong>단위 테스트가 쉬워지고 회귀 버그도 줄었어요</strong>.</p>
        
        <h2>배운 점</h2>
        
        <p>작은 유틸도 <strong>명확한 책임과 재사용 가능 설계</strong>로 분리하면 프로젝트 전체 품질이 올라간다는 걸 다시 확인했어요. 특히 <strong>명시적 함수 호출 패턴</strong>이 watch보다 훨씬 예측 가능하고, 테스트·유지보수가 수월하다는 점을 팀 전체가 체감했습니다.</p>
      </Content>
    );
  }

  return (
    <Content>
      <h1>Common Utility/Composable Separation Case Study</h1>
      
      <h2>Background</h2>
      
      <p>The same logic (i18n suffix handling, permission checks, file type/size formatting, icon styles) was <strong>duplicated across multiple screens</strong>, and subtle differences by page caused <strong>UX/policy inconsistency</strong>.</p>
      
      <ul>
        <li>Same logic (i18n suffix, permission check, file format, icon style) <strong>duplicated across multiple screens</strong></li>
        <li>Expressions slightly different by screen → <strong>UX inconsistency</strong></li>
        <li>Logic mixed in templates → <strong>Reduced readability/testability</strong>, <strong>Extensive refactoring needed</strong> when modifying</li>
        <li>Due to team convention of <strong>onMounted order control + arrow function explicit calls</strong> without <code>watch</code>, there was a need to <strong>organize scattered logic into explicitly callable utils/composables</strong>.</li>
      </ul>
      
      <h2>Process and Problem Exploration</h2>
      
      <h3>A. i18n Option String Builder — useBuildOptionText</h3>
      
      <h4>Problem</h4>
      
      <p><strong>Fixed suffixes</strong> like "Page/쪽" were arbitrarily attached after selection options on each screen, causing multilingual inconsistency.</p>
      
      <h4>Design</h4>
      
      <p>We received the i18n instance from Nuxt's <code>useNuxtApp()</code> and integrated label generation into one function.</p>
      
      <pre><code>{`const nuxtApp = useNuxtApp()
const buildOptionText = (text) => {
  const t = nuxtApp.$i18n.t
  return \`\${text.value} \${t('Page')}\`
}
export const useBuildOptionText = () => buildOptionText`}</code></pre>
      
      <h4>Effect</h4>
      
      <p>In templates, <code>useBuildOptionText()(option)</code> in one line is enough. All wording and formats are unified and safe even in SSR/CSR environments.</p>
      
      <h3>B. Menu Permission Search — useFindPermissionValue, useFindPermissionValueInput</h3>
      
      <h4>Problem</h4>
      
      <p>Permission branching in buttons/inputs/routing was <strong>duplicated</strong>, and <strong>recursive implementation was repeated on each screen</strong> to find tree submenu permissions.</p>
      
      <h4>Design</h4>
      
      <p>We used <code>useMenuItemTree().value</code> as the default tree and encapsulated recursive search into one composable.</p>
      
      <pre><code>{`export const useFindPermissionValue = (menuId, type, menuPage = useMenuItemTree().value) => {
  // Recursive search, Y → false / N → true
}
export const useFindPermissionValueInput = (menuId, type, menuPage = useMenuItemTree().value) => {
  // Recursive search, Y → true / N → false
}`}</code></pre>
      
      <ul>
        <li><strong>Tree injection possible:</strong> Default is global tree, arbitrary tree can be passed in test environment</li>
        <li><strong>Clear return meaning:</strong> Y/N criteria clearly specified in comments (recommended to separate like <code>shouldHide</code>, <code>canUse</code>)</li>
      </ul>
      
      <h4>Effect</h4>
      
      <p>Permission logic was integrated in one place, and screen-specific branching or exception handling was greatly reduced.</p>
      
      <h3>C. File Type/Size Format — useMimetypeCheck, useFileSizeFormat</h3>
      
      <h4>Problem</h4>
      
      <p>Mimetype, extension, and size formats in upload/preview were inconsistent, <strong>breaking UI consistency and causing frequent bugs.</strong></p>
      
      <h4>Design</h4>
      
      <ul>
        <li><code>useMimetypeCheck(mimetype, ext)</code> → Returns <strong>integer type code</strong> based on extension priority rule (0: unknown, 1: text, 2: image, 3: pdf, 4: office, etc.)</li>
        <li><code>useFileSizeFormat(bytes)</code> → Converts to <strong>1024 unit format (2 decimal places)</strong></li>
      </ul>
      
      <pre><code>{`export const useMimetypeCheck = (mimetype, fileExtension) => { /* Priority + regex mapping */ }
export const useFileSizeFormat = (size) => { /* 1024 unit format */ }`}</code></pre>
      
      <h4>Effect</h4>
      
      <p>Preview/icon/button activation logic shared <strong>one result value (type code, format string)</strong>, fully aligning UI and policy.</p>
      
      <h3>D. Icon Standardization &lt;Icon&gt; + useIcon (iconPack / getIconColor)</h3>
      
      <h4>Problem</h4>
      
      <p>Icon colors, sizes, and margins were specified inline differently on each screen, causing severe <strong>design drift</strong>.</p>
      
      <h4>Design</h4>
      
      <p>We declared name → metadata (iconName, color, size, marginRight) in <code>iconPack</code> and managed it in only one component.</p>
      
      <p>Props take priority if provided, otherwise pack defaults are used. For <code>disabledType</code>, gray is fixed.</p>
      
      <pre><code>{`<Icon
  :name="\`my-icon:\${iconPack[name].iconName}\`"
  :size="computedSize"
  :style="\`color:\${computedColor}\`"
/>`}</code></pre>
      
      <h4>Effect</h4>
      
      <p>When changing themes, modifying only iconPack applies to all, and templates use <strong>only meaningful names</strong>, improving code readability.</p>
      
      <h2>Results</h2>
      
      <p>Duplication was eliminated and maintainability improved, and i18n suffixes, permission handling, file notation, and icon styles were consistent throughout the service, <strong>securing UX consistency</strong>. Also, thanks to the pure functional composable structure like permissions and formats, <strong>unit testing became easier and regression bugs decreased</strong>.</p>
      
      <h2>Key Takeaways</h2>
      
      <p>I confirmed again that even small utilities, when separated with <strong>clear responsibility and reusable design</strong>, improve overall project quality. In particular, the entire team felt that <strong>explicit function call patterns</strong> are much more predictable than watch, and easier to test and maintain.</p>
    </Content>
  );
};
