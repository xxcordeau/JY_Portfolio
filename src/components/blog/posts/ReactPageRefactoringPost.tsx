'use client';

import styled from 'styled-components';

const Content = styled.div``;

interface PostProps {
  language: 'ko' | 'en';
}

export const ReactPageRefactoringPost = ({ language }: PostProps) => {
  if (language === 'ko') {
    return (
      <Content>
        <h2>원인</h2>

        <p>티켓 판매 플랫폼을 개발하다 보니 어느 순간부터 프론트엔드 파일 구조가 감당이 안 되기 시작했어요.</p>

        <ul>
          <li><code>src/components/pages/</code> 한 폴더에 어드민 페이지, 쇼핑몰 페이지, 주문 페이지가 전부 섞여 있었어요.</li>
          <li>파일명만 보고는 어드민 전용인지 쇼핑몰용인지 구분할 수 없었어요.</li>
          <li>빌드 결과물이 2,647 KB짜리 단일 청크 <code>index.js</code> 하나라서 초기 로딩이 느렸어요.</li>
          <li>새 페이지를 추가할 때 파일을 어디에 둘지 기준이 없었어요.</li>
        </ul>

        <p>해야 할 일은 두 가지였어요.</p>

        <ul>
          <li>파일 구조를 도메인 기준으로 다시 나누기</li>
          <li>코드 스플리팅으로 초기 번들 크기 줄이기</li>
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

        <p>페이지 파일 73개가 한 폴더에 있으니 관련 파일끼리 찾기가 어려웠어요. <code>product-detail.tsx</code>가 어드민 상품 상세인지 쇼핑몰 상품 상세인지 헷갈릴 때도 있었고요.</p>

        <p>코드 스플리팅 쪽 문제는 더 분명했어요.</p>

        <pre><code>{`// App.tsx - 기존 방식
import { ProductManagement } from "./components/pages/product-management";
import { Dashboard } from "./components/pages/dashboard";
import { ShopCart } from "./components/pages/shop/shop-cart";
// ... 70개 이상의 static import`}</code></pre>

        <p>로그인 페이지 하나만 열어도 어드민 대시보드, 상품 관리, 쇼핑몰 코드를 전부 내려받는 구조였어요.</p>

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
          <li>기능 안에 파일이 여러 개면 <code>index.tsx</code>를 진입점으로</li>
        </ul>

        <h3>b. React.lazy()로 코드 스플리팅 적용</h3>

        <p>static import를 모두 lazy import로 바꿨어요.</p>

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

        <p>파일을 옮기면서 상대 경로가 <code>../../../lib/api</code>처럼 깊어졌어요. <code>vite.config.ts</code>에 alias를 설정해서 전부 <code>@/</code>로 맞췄어요.</p>

        <pre><code>{`// vite.config.ts
resolve: {
  alias: {
    "@": path.resolve(__dirname, "./src"),
  },
},`}</code></pre>

        <h2>결과</h2>

        <p>빌드 결과가 꽤 달라졌어요.</p>

        <ul>
          <li>초기 번들: 2,647 KB에서 561 KB로</li>
          <li>청크 수: 1개에서 여러 청크로 분리</li>
          <li>초기 번들 감소율: 약 79%</li>
        </ul>

        <p>이제 로그인 페이지에 들어갈 때 어드민 코드를 받지 않고, 사용자가 방문하지 않는 페이지의 코드는 아예 내려받지 않아요.</p>

        <p>새 페이지를 어디에 둘지도 분명해졌어요. 어드민 주문 관련 화면이면 <code>pages/admin/order/</code> 아래에 두면 됐어요.</p>

        <h2>배운 점</h2>

        <p>파일 구조 문제는 당장 기능에 영향이 없어서 미루기 쉬운데, 쌓이면 팀 전체의 속도를 늦춰요.</p>

        <p>코드 스플리팅은 설정 한 줄로 끝나는 일이 아니었어요. import 방식 자체를 바꾸는 작업이었고, 구조가 먼저 정리되어 있지 않으면 lazy import를 어디에 적용할지도 흐려져요.</p>

        <p>그래서 이번 작업에서는 구조 정리와 성능 개선을 함께 진행했어요.</p>
      </Content>
    );
  }

  return (
    <Content>
      <h2>The Problem</h2>

      <p>While building a ticket sales platform, the frontend file structure reached a point where I couldn't keep it under control.</p>

      <ul>
        <li>Admin pages, shop pages, and order pages were all mixed in a single <code>src/components/pages/</code> directory.</li>
        <li>You couldn't tell admin-only components from shop components by filename alone.</li>
        <li>The build output was a single 2,647 KB <code>index.js</code> chunk, so the initial load was slow.</li>
        <li>There was no convention for where new page files should go.</li>
      </ul>

      <p>I had two goals:</p>

      <ul>
        <li>Reorganize the file structure by domain</li>
        <li>Shrink the initial bundle with code splitting</li>
      </ul>

      <h2>Investigation</h2>

      <p>The existing structure had every page listed in a single directory:</p>

      <pre><code>{`src/components/pages/
  admin-orders-new.tsx
  banner-management.tsx
  shop/shop-cart.tsx
  shop/shop-product-detail.tsx
  product-detail.tsx
  product-management.tsx
  ...`}</code></pre>

      <p>With 73 page files in one folder, finding related files was hard. Sometimes I couldn't tell whether <code>product-detail.tsx</code> was the admin product detail or the shop product detail.</p>

      <p>The code splitting problem was even more obvious:</p>

      <pre><code>{`// App.tsx - before
import { ProductManagement } from "./components/pages/product-management";
import { Dashboard } from "./components/pages/dashboard";
import { ShopCart } from "./components/pages/shop/shop-cart";
// ... 70+ static imports`}</code></pre>

      <p>Opening just the login page downloaded all the admin dashboard, product management, and shop code.</p>

      <h2>Solution</h2>

      <h3>a. Domain-based directory reorganization</h3>

      <p>I split folders by domain under <code>src/pages/</code>:</p>

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
        <li>If a feature has multiple files, <code>index.tsx</code> is the entry point</li>
      </ul>

      <h3>b. Code splitting with React.lazy()</h3>

      <p>I converted every static import to a lazy import:</p>

      <pre><code>{`// App.tsx - after
const Dashboard = lazy(() => import("@/pages/admin/dashboard"));
const ProductManagement = lazy(() => import("@/pages/admin/product"));
const ShopCart = lazy(() => import("@/pages/shop/cart"));`}</code></pre>

      <p>Then I wrapped the whole router in <code>Suspense</code>:</p>

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

      <h3>c. Unified absolute path imports</h3>

      <p>Moving files made relative paths nest deeply, like <code>../../../lib/api</code>. I set an alias in <code>vite.config.ts</code> so everything uses <code>@/</code>:</p>

      <pre><code>{`// vite.config.ts
resolve: {
  alias: {
    "@": path.resolve(__dirname, "./src"),
  },
},`}</code></pre>

      <h2>Results</h2>

      <p>The build output changed quite a bit:</p>

      <ul>
        <li>Initial bundle: from 2,647 KB to 561 KB</li>
        <li>Chunks: from 1 to multiple separate chunks</li>
        <li>Initial bundle reduction: about 79%</li>
      </ul>

      <p>The login page no longer pulls in any admin code, and code for pages a user never visits is never downloaded.</p>

      <p>It's also clear where new pages belong now. An admin order screen simply goes under <code>pages/admin/order/</code>.</p>

      <h2>Lessons Learned</h2>

      <p>File structure problems don't break features right away, so they're easy to put off. But they slow the whole team down over time.</p>

      <p>Code splitting wasn't a one-line config change. It meant changing how imports work in the first place, and without an organized structure it's hard to even tell where lazy imports belong.</p>

      <p>That's why this project handled the structure cleanup and the performance work together.</p>
    </Content>
  );
};
