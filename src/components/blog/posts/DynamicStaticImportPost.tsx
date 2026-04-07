import styled from 'styled-components';

const Content = styled.div``;

interface PostProps {
  language: 'ko' | 'en';
}

export const DynamicStaticImportPost = ({ language }: PostProps) => {
  if (language === 'ko') {
    return (
      <Content>
        <h1>React.lazy + Suspense 적용 시 마주친 dynamic/static import 혼용 문제</h1>

        <h2>원인</h2>

        <p>코드 스플리팅을 적용하고 빌드를 돌렸더니 경고가 쏟아졌어요.</p>

        <pre><code>{`(!) /src/lib/api/file.ts is dynamically imported by
  product-detail.tsx
but also statically imported by
  banner-management-tab.tsx, channel-detail.tsx, product-management.tsx ...
dynamic import will not move module into another chunk.`}</code></pre>

        <p>요약하면 이런 상황이었어요.</p>

        <ul>
          <li><code>file.ts</code>를 어떤 파일은 static import로, 어떤 파일은 dynamic import(lazy)로 참조 중</li>
          <li>Vite가 두 방식이 혼재하면 해당 모듈을 별도 청크로 분리하지 못함</li>
          <li>코드 스플리팅의 효과가 의도한 대로 나오지 않을 수 있음</li>
        </ul>

        <h2>과정과 문제 탐색</h2>

        <p>문제의 원인은 구조에 있었어요.</p>

        <p><code>lib/api/file.ts</code>는 파일 업로드 API를 담당하는 모듈인데, 두 가지 방식으로 import되고 있었습니다.</p>

        <pre><code>{`// banner-management-tab.tsx - static import
import { uploadFile } from "@/lib/api/file";

// product-detail.tsx - React.lazy로 페이지 자체가 dynamic import
// → 내부에서 file.ts를 import하면 간접적으로 dynamic이 됨`}</code></pre>

        <p>Vite 입장에서는 <code>file.ts</code>가 static import 경로에도 포함되어 있기 때문에, 이미 메인 청크에 들어가야 하는 모듈로 판단해요. 그래서 lazy로 불러지는 페이지 안에서 같은 파일을 참조해도 별도 청크로 빠지지 않는다는 거였어요.</p>

        <p><code>data/products.ts</code>, <code>data/channels.ts</code>, <code>data/hooks/useShopStore.ts</code> 등 여러 파일에서 같은 패턴이 반복되고 있었습니다.</p>

        <h2>해결 방안</h2>

        <h3>a. 공유 모듈은 static import 기준으로 정리</h3>

        <p><code>lib/api/file.ts</code>처럼 여러 페이지에서 공통으로 쓰이는 모듈은 static import 방식으로 통일했어요. 어차피 메인 청크에 포함될 수밖에 없는 모듈이라면, 혼용 경고를 만드는 것보다 명시적으로 static으로 관리하는 편이 나아요.</p>

        <h3>b. 청크 분리가 필요한 모듈은 의존 관계를 끊기</h3>

        <p>페이지 단위로 독립적으로 분리하고 싶은 모듈이라면, 해당 모듈을 static으로 참조하는 파일이 없는지 먼저 확인했어요. static 참조가 하나라도 남아 있으면 Vite는 그 모듈을 메인 청크에서 분리하지 않습니다.</p>

        <h3>c. manualChunks로 명시적 청크 분리</h3>

        <p>Recharts나 xlsx처럼 크기가 큰 서드파티 라이브러리는 <code>vite.config.ts</code>에서 직접 분리했어요.</p>

        <pre><code>{`build: {
  rollupOptions: {
    output: {
      manualChunks: {
        "recharts": ["recharts"],
        "xlsx": ["xlsx"],
      },
    },
  },
},`}</code></pre>

        <p>빌드 결과에서 <code>PieChart-BD8Tbips.js</code> (420 KB), <code>xlsx-jhNyNcYQ.js</code> (283 KB)가 별도 청크로 분리됐어요. 이 두 라이브러리를 쓰지 않는 페이지에서는 전혀 로드하지 않아도 됩니다.</p>

        <h2>결과</h2>

        <p>경고는 완전히 없애지 않았어요. 공유 API 모듈은 어차피 여러 페이지에서 쓰이기 때문에 메인 청크에 있는 게 맞고, 경고 자체가 문제라기보다 <strong>번들 구조를 이해하는 신호</strong>로 읽었습니다.</p>

        <p>핵심은 크기가 큰 모듈이 어느 청크에 포함되는지 파악하고, 그 중 분리 가능한 것만 명시적으로 분리한 거예요.</p>

        <h2>배운 점</h2>

        <p>Vite의 코드 스플리팅은 자동으로 최적화해주는 게 아니라, <strong>import 방식과 의존 관계에 따라 결과가 달라져요.</strong></p>

        <p>경고를 단순히 없애려고 접근하면 오히려 의도치 않은 번들 구조가 될 수 있어요. 경고가 발생하는 원인을 이해하고, 어떤 모듈을 어떤 청크에 두는 게 맞는지 판단하는 게 먼저였습니다.</p>
      </Content>
    );
  }

  return (
    <Content>
      <h1>Dynamic vs Static Import Mixing Issues with React.lazy + Suspense</h1>

      <h2>The Problem</h2>

      <p>After applying code splitting and running the build, warnings started pouring in:</p>

      <pre><code>{`(!) /src/lib/api/file.ts is dynamically imported by
  product-detail.tsx
but also statically imported by
  banner-management-tab.tsx, channel-detail.tsx, product-management.tsx ...
dynamic import will not move module into another chunk.`}</code></pre>

      <p>In summary, the situation was:</p>

      <ul>
        <li>Some files referenced <code>file.ts</code> via static import, others via dynamic import (lazy)</li>
        <li>When both methods coexist, Vite cannot separate that module into a separate chunk</li>
        <li>Code splitting may not work as intended</li>
      </ul>

      <h2>Investigation</h2>

      <p>The root cause was in the structure.</p>

      <p><code>lib/api/file.ts</code> handles file upload APIs and was being imported in two different ways:</p>

      <pre><code>{`// banner-management-tab.tsx - static import
import { uploadFile } from "@/lib/api/file";

// product-detail.tsx - the page itself is dynamically imported via React.lazy
// → importing file.ts inside it indirectly makes it dynamic`}</code></pre>

      <p>From Vite's perspective, since <code>file.ts</code> is also included in a static import path, it determines the module must go into the main chunk. So even when the same file is referenced inside a lazily-loaded page, it won't be split into a separate chunk.</p>

      <p>The same pattern was repeated across <code>data/products.ts</code>, <code>data/channels.ts</code>, <code>data/hooks/useShopStore.ts</code>, and several other files.</p>

      <h2>Solution</h2>

      <h3>a. Unify Shared Modules as Static Imports</h3>

      <p>Modules commonly used across multiple pages, like <code>lib/api/file.ts</code>, were unified as static imports. If a module will inevitably be included in the main chunk anyway, it's better to explicitly manage it as static rather than creating mixed-import warnings.</p>

      <h3>b. Break Dependency Chains for Modules That Need Splitting</h3>

      <p>For modules that should be independently split per page, I first checked whether any file still statically references them. As long as even one static reference remains, Vite won't separate that module from the main chunk.</p>

      <h3>c. Explicit Chunk Splitting with manualChunks</h3>

      <p>Large third-party libraries like Recharts and xlsx were explicitly separated in <code>vite.config.ts</code>:</p>

      <pre><code>{`build: {
  rollupOptions: {
    output: {
      manualChunks: {
        "recharts": ["recharts"],
        "xlsx": ["xlsx"],
      },
    },
  },
},`}</code></pre>

      <p>In the build output, <code>PieChart-BD8Tbips.js</code> (420 KB) and <code>xlsx-jhNyNcYQ.js</code> (283 KB) were split into separate chunks. Pages that don't use these libraries don't load them at all.</p>

      <h2>Results</h2>

      <p>The warnings weren't completely eliminated. Shared API modules belong in the main chunk since they're used across multiple pages. The warnings weren't problems themselves — they were <strong>signals for understanding the bundle structure</strong>.</p>

      <p>The key was identifying which large modules were in which chunks, and explicitly splitting only those that could be separated.</p>

      <h2>Lessons Learned</h2>

      <p>Vite's code splitting doesn't automatically optimize everything — <strong>the results depend on import patterns and dependency relationships.</strong></p>

      <p>Approaching warnings with the sole goal of eliminating them can lead to unintended bundle structures. Understanding why warnings occur and determining which modules belong in which chunks should come first.</p>
    </Content>
  );
};
