import styled from 'styled-components';

const Content = styled.div``;

interface PostProps {
  language: 'ko' | 'en';
}

export const ReactPageRefactoringPost = ({ language }: PostProps) => {
  if (language === 'ko') {
    return (
      <Content>
        <h1>React 페이지 구조 리팩토링과 코드 스플리팅 적용 경험</h1>

        <h2>원인</h2>

        <p>티켓 판매 플랫폼을 개발하면서, 어느 순간부터 프론트엔드 파일 구조가 감당이 안 되기 시작했어요.</p>

        <ul>
          <li><code>src/components/pages/</code> 하나에 어드민 페이지, 쇼핑몰 페이지, 주문 페이지가 전부 뒤섞여 있음</li>
          <li>어드민 전용 컴포넌트인지, 쇼핑몰용인지 파일명만으로는 구분 불가</li>
          <li>빌드 결과물이 단일 청크 <code>index.js</code> 하나에 2,647 KB → 초기 로딩이 느림</li>
          <li>새 페이지를 추가할 때마다 어디에 파일을 두어야 할지 기준이 없음</li>
        </ul>

        <p>요약하면 두 가지였어요.</p>

        <ul>
          <li><strong>파일 구조를 도메인 기준으로 재편</strong></li>
          <li><strong>코드 스플리팅으로 초기 번들 크기 줄이기</strong></li>
        </ul>

        <h2>과정과 문제 탐색</h2>

        <p>기존 구조는 아래처럼 모든 페이지가 한 디렉토리에 나열되어 있었어요.</p>

        <pre><code>{`src/components/pages/
  admin-orders-new.tsx
  banner-management.tsx
  shop/shop-cart.tsx
  shop/shop-product-detail.tsx
  product-detail.tsx
  product-management.tsx
  ...`}</code></pre>

        <p>73개의 페이지 파일이 한 폴더에 있다 보니, 관련 있는 파일끼리 찾기가 어려웠고 <code>product-detail.tsx</code> 하나가 어드민 상품 상세인지, 쇼핑몰 상품 상세인지 헷갈리는 경우도 있었어요.</p>

        <p>코드 스플리팅 문제는 더 명확했는데요.</p>

        <pre><code>{`// App.tsx - 기존 방식
import { ProductManagement } from "./components/pages/product-management";
import { Dashboard } from "./components/pages/dashboard";
import { ShopCart } from "./components/pages/shop/shop-cart";
// ... 70개 이상의 static import`}</code></pre>

        <p>로그인 페이지 하나를 열어도 어드민 대시보드, 상품 관리, 쇼핑몰 코드가 전부 다운로드되는 구조였습니다.</p>

        <h2>해결 방안</h2>

        <h3>a. 도메인 기반 디렉토리 재편</h3>

        <p><code>src/pages/</code> 아래에 관심사 단위로 폴더를 나눴어요.</p>

        <pre><code>{`src/pages/
  admin/
    dashboard/index.tsx
    product/
      index.tsx         # 상품 목록
      detail.tsx        # 상품 상세
      detail-options.tsx
      detail-seasons.tsx
      content-editor.tsx
    order/
      index.tsx
      detail.tsx
    partner/
      index.tsx
      detail.tsx
      coupon-detail.tsx
    banner/index.tsx
    channel/index.tsx
    community/
      index.tsx
      notice/
      event/
  shop/
    home/index.tsx
    product/
      detail.tsx
      category.tsx
      search.tsx
    order/index.tsx
    cart/index.tsx
    payment/
      info.tsx
      success.tsx
      callback.tsx
  auth/
    login.tsx
  field/
    ticket-scanner.tsx`}</code></pre>

        <p>규칙은 단순했어요.</p>

        <ul>
          <li>어드민 페이지는 <code>pages/admin/기능/</code></li>
          <li>쇼핑몰 페이지는 <code>pages/shop/기능/</code></li>
          <li>기능 안에 여러 파일이 있으면 <code>index.tsx</code>를 진입점으로</li>
        </ul>

        <h3>b. React.lazy()로 코드 스플리팅 적용</h3>

        <p>모든 static import를 lazy import로 변경했어요.</p>

        <pre><code>{`// App.tsx - 변경 후
const Dashboard = lazy(() => import("@/pages/admin/dashboard"));
const ProductManagement = lazy(() => import("@/pages/admin/product"));
const ShopCart = lazy(() => import("@/pages/shop/cart"));`}</code></pre>

        <p>그리고 라우터 전체를 <code>Suspense</code>로 감쌌어요.</p>

        <pre><code>{`<Suspense fallback={
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-8 w-8
      border-b-2 border-gray-900" />
  </div>
}>
  <Routes>
    {/* ... */}
  </Routes>
</Suspense>`}</code></pre>

        <h3>c. 절대 경로 import 통일</h3>

        <p>파일이 이동되면서 상대 경로가 <code>../../../lib/api</code>처럼 깊어지는 문제가 있었어요. <code>vite.config.ts</code>에 alias를 설정해서 전부 <code>@/</code>로 통일했어요.</p>

        <pre><code>{`// vite.config.ts
resolve: {
  alias: {
    "@": path.resolve(__dirname, "./src"),
  },
},`}</code></pre>

        <h2>결과</h2>

        <p>빌드 결과가 꽤 달라졌어요.</p>

        <ul>
          <li><strong>초기 번들:</strong> 2,647 KB → 561 KB</li>
          <li><strong>청크 수:</strong> 1개 → 여러 청크 분리</li>
          <li><strong>초기 번들 감소율:</strong> 약 79%</li>
        </ul>

        <p>로그인 페이지 접속 시 불필요한 어드민 코드를 전혀 받지 않아도 되고, 사용자가 방문하지 않는 페이지의 코드는 아예 다운로드되지 않아요.</p>

        <p>파일 구조도 새 페이지를 어디에 두어야 할지 명확해졌어요. 어드민 주문 관련 화면이면 <code>pages/admin/order/</code> 아래에 두면 그만이었습니다.</p>

        <h2>배운 점</h2>

        <p>파일 구조 문제는 당장 기능에 영향을 주지 않다 보니 미루기 쉬운데, 결국 팀 전체의 속도에 영향을 줘요.</p>

        <p>코드 스플리팅은 설정 한 줄이 아니라 import 방식 자체를 바꾸는 작업이었어요. 구조가 먼저 정리되어 있지 않으면 lazy import를 어디에 적용해야 할지도 흐려집니다.</p>

        <p>결국 <strong>구조 정리와 성능 개선은 같이 가는 작업</strong>이었어요.</p>
      </Content>
    );
  }

  return (
    <Content>
      <h1>React Page Structure Refactoring and Code Splitting Experience</h1>

      <h2>The Problem</h2>

      <p>While developing a ticket sales platform, the frontend file structure became unmanageable at some point.</p>

      <ul>
        <li>Admin pages, shop pages, and order pages were all mixed in a single <code>src/components/pages/</code> directory</li>
        <li>Impossible to distinguish admin-only components from shop components by filename alone</li>
        <li>Build output was a single chunk <code>index.js</code> at 2,647 KB — slow initial load</li>
        <li>No clear convention for where to place new page files</li>
      </ul>

      <p>It boiled down to two goals:</p>

      <ul>
        <li><strong>Reorganize file structure by domain</strong></li>
        <li><strong>Reduce initial bundle size with code splitting</strong></li>
      </ul>

      <h2>Investigation</h2>

      <p>The existing structure had all pages listed in a single directory:</p>

      <pre><code>{`src/components/pages/
  admin-orders-new.tsx
  banner-management.tsx
  shop/shop-cart.tsx
  shop/shop-product-detail.tsx
  product-detail.tsx
  product-management.tsx
  ...`}</code></pre>

      <p>With 73 page files in one folder, finding related files was difficult. Sometimes it was unclear whether <code>product-detail.tsx</code> was the admin product detail or the shop product detail.</p>

      <p>The code splitting issue was even more clear-cut:</p>

      <pre><code>{`// App.tsx - before
import { ProductManagement } from "./components/pages/product-management";
import { Dashboard } from "./components/pages/dashboard";
import { ShopCart } from "./components/pages/shop/shop-cart";
// ... 70+ static imports`}</code></pre>

      <p>Even opening just the login page would download all admin dashboard, product management, and shop code.</p>

      <h2>Solution</h2>

      <h3>a. Domain-based Directory Reorganization</h3>

      <p>Folders were organized by domain under <code>src/pages/</code>:</p>

      <pre><code>{`src/pages/
  admin/
    dashboard/index.tsx
    product/
      index.tsx         # Product list
      detail.tsx        # Product detail
      detail-options.tsx
      detail-seasons.tsx
      content-editor.tsx
    order/
      index.tsx
      detail.tsx
    partner/
      index.tsx
      detail.tsx
      coupon-detail.tsx
    banner/index.tsx
    channel/index.tsx
    community/
      index.tsx
      notice/
      event/
  shop/
    home/index.tsx
    product/
      detail.tsx
      category.tsx
      search.tsx
    order/index.tsx
    cart/index.tsx
    payment/
      info.tsx
      success.tsx
      callback.tsx
  auth/
    login.tsx
  field/
    ticket-scanner.tsx`}</code></pre>

      <p>The rules were simple:</p>

      <ul>
        <li>Admin pages go under <code>pages/admin/feature/</code></li>
        <li>Shop pages go under <code>pages/shop/feature/</code></li>
        <li>If a feature has multiple files, use <code>index.tsx</code> as the entry point</li>
      </ul>

      <h3>b. Code Splitting with React.lazy()</h3>

      <p>All static imports were converted to lazy imports:</p>

      <pre><code>{`// App.tsx - after
const Dashboard = lazy(() => import("@/pages/admin/dashboard"));
const ProductManagement = lazy(() => import("@/pages/admin/product"));
const ShopCart = lazy(() => import("@/pages/shop/cart"));`}</code></pre>

      <p>The entire router was wrapped with <code>Suspense</code>:</p>

      <pre><code>{`<Suspense fallback={
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-8 w-8
      border-b-2 border-gray-900" />
  </div>
}>
  <Routes>
    {/* ... */}
  </Routes>
</Suspense>`}</code></pre>

      <h3>c. Unified Absolute Path Imports</h3>

      <p>Moving files caused relative paths to become deeply nested like <code>../../../lib/api</code>. An alias was set in <code>vite.config.ts</code> to unify everything with <code>@/</code>:</p>

      <pre><code>{`// vite.config.ts
resolve: {
  alias: {
    "@": path.resolve(__dirname, "./src"),
  },
},`}</code></pre>

      <h2>Results</h2>

      <p>The build results changed significantly:</p>

      <ul>
        <li><strong>Initial bundle:</strong> 2,647 KB → 561 KB</li>
        <li><strong>Chunks:</strong> 1 → multiple separated chunks</li>
        <li><strong>Initial bundle reduction:</strong> approximately 79%</li>
      </ul>

      <p>When accessing the login page, no unnecessary admin code is downloaded at all. Code for pages the user never visits is never downloaded.</p>

      <p>The file structure also made it clear where to place new pages. If it's an admin order-related screen, just put it under <code>pages/admin/order/</code>.</p>

      <h2>Lessons Learned</h2>

      <p>File structure issues don't immediately affect functionality, making them easy to postpone — but they ultimately impact the entire team's velocity.</p>

      <p>Code splitting isn't a one-line config change — it's about changing the import approach itself. If the structure isn't organized first, it's hard to even determine where to apply lazy imports.</p>

      <p>In the end, <strong>structure cleanup and performance improvement go hand in hand</strong>.</p>
    </Content>
  );
};
