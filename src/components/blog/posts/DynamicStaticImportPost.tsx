'use client';

import styled from 'styled-components';

const Content = styled.div``;

interface PostProps {
  language: 'ko' | 'en';
}

export const DynamicStaticImportPost = ({ language }: PostProps) => {
  if (language === 'ko') {
    return (
      <Content>
        <h2>배경</h2>

        <p>코드 스플리팅을 적용하고 빌드를 돌렸더니 경고가 쏟아졌어요.</p>

        <pre><code>{`(!) /src/lib/api/file.ts is dynamically imported by
  product-detail.tsx
but also statically imported by
  banner-management-tab.tsx, channel-detail.tsx, product-management.tsx ...
dynamic import will not move module into another chunk.`}</code></pre>

        <p>상황은 이랬어요. <code>file.ts</code>를 어떤 파일은 static import로, 어떤 파일은 dynamic import(lazy)로 참조하고 있었어요. Vite는 두 방식이 섞여 있으면 그 모듈을 별도 청크로 나누지 못하고, 그러면 코드 스플리팅이 의도한 대로 동작하지 않을 수 있어요.</p>

        <h2>원인 찾기</h2>

        <p>원인은 구조에 있었어요. 파일 업로드 API를 맡은 <code>lib/api/file.ts</code>가 두 가지 방식으로 import되고 있었어요.</p>

        <pre><code>{`// banner-management-tab.tsx - static import
import { uploadFile } from "@/lib/api/file";

// product-detail.tsx - React.lazy로 페이지 자체가 dynamic import
// → 내부에서 file.ts를 import하면 간접적으로 dynamic이 됨`}</code></pre>

        <p>Vite는 <code>file.ts</code>가 static import 경로에도 들어 있으니 메인 청크에 넣어야 하는 모듈로 판단해요. 그래서 lazy로 불러오는 페이지 안에서 같은 파일을 참조해도 따로 빠지지 않았어요.</p>

        <p><code>data/products.ts</code>, <code>data/channels.ts</code>, <code>data/hooks/useShopStore.ts</code> 등 여러 파일에서 같은 패턴이 반복되고 있었어요.</p>

        <h2>해결</h2>

        <h3>a. 공유 모듈은 static import로 정리</h3>

        <p><code>lib/api/file.ts</code>처럼 여러 페이지에서 같이 쓰는 모듈은 static import로 통일했어요. 어차피 메인 청크에 들어갈 모듈이라면, 혼용 경고를 남기기보다 처음부터 static으로 관리하는 편이 나았어요.</p>

        <h3>b. 분리가 필요한 모듈은 static 참조를 없애기</h3>

        <p>페이지 단위로 따로 떼고 싶은 모듈은, 그 모듈을 static으로 참조하는 파일이 남아 있는지부터 확인했어요. static 참조가 하나라도 있으면 Vite는 그 모듈을 메인 청크에서 분리하지 않아요.</p>

        <h3>c. manualChunks로 직접 분리</h3>

        <p>Recharts나 xlsx처럼 큰 서드파티 라이브러리는 <code>vite.config.ts</code>에서 직접 분리했어요.</p>

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

        <p>빌드 결과 <code>PieChart-BD8Tbips.js</code>(420 KB)와 <code>xlsx-jhNyNcYQ.js</code>(283 KB)가 별도 청크로 나왔어요. 이 두 라이브러리를 쓰지 않는 페이지에서는 아예 불러오지 않아요.</p>

        <h2>결과</h2>

        <p>경고를 전부 없애지는 않았어요. 공유 API 모듈은 여러 페이지에서 쓰이니 메인 청크에 있는 게 맞다고 봤고, 경고는 번들 구조를 보여주는 신호로 읽었어요.</p>

        <p>대신 크기가 큰 모듈이 어느 청크에 들어가는지 확인하고, 그중 분리할 수 있는 것만 직접 분리했어요.</p>

        <h2>정리</h2>

        <p>Vite의 코드 스플리팅 결과는 import 방식과 의존 관계에 따라 달라졌어요. 경고를 없애는 데만 집중했다면 오히려 의도하지 않은 번들 구조가 됐을 거예요. 다음에도 경고가 나오면 어떤 모듈이 어느 청크에 있어야 하는지부터 정하고 손댈 생각이에요.</p>
      </Content>
    );
  }

  return (
    <Content>
      <h2>Background</h2>

      <p>After applying code splitting and running the build, a pile of warnings showed up.</p>

      <pre><code>{`(!) /src/lib/api/file.ts is dynamically imported by
  product-detail.tsx
but also statically imported by
  banner-management-tab.tsx, channel-detail.tsx, product-management.tsx ...
dynamic import will not move module into another chunk.`}</code></pre>

      <p>Some files imported <code>file.ts</code> statically, and others reached it through a dynamic (lazy) import. When the two are mixed, Vite can't move that module into its own chunk, so code splitting may not behave the way you expect.</p>

      <h2>Finding the cause</h2>

      <p>The cause was in the structure. <code>lib/api/file.ts</code>, which handles file uploads, was imported in two different ways.</p>

      <pre><code>{`// banner-management-tab.tsx - static import
import { uploadFile } from "@/lib/api/file";

// product-detail.tsx - the page itself is dynamically imported via React.lazy
// → importing file.ts inside it indirectly makes it dynamic`}</code></pre>

      <p>Because <code>file.ts</code> is also on a static import path, Vite decides it belongs in the main chunk. So even when a lazily loaded page references the same file, it doesn't get split out.</p>

      <p>The same pattern showed up in <code>data/products.ts</code>, <code>data/channels.ts</code>, <code>data/hooks/useShopStore.ts</code>, and several other files.</p>

      <h2>Fix</h2>

      <h3>a. Keep shared modules as static imports</h3>

      <p>Modules used across many pages, like <code>lib/api/file.ts</code>, now use static imports everywhere. If a module ends up in the main chunk anyway, managing it as static from the start is better than leaving a mixed-import warning.</p>

      <h3>b. Remove static references from modules that should be split</h3>

      <p>For modules I wanted to split per page, I first checked whether any file still imported them statically. If even one static reference remains, Vite keeps the module in the main chunk.</p>

      <h3>c. Split explicitly with manualChunks</h3>

      <p>Large third-party libraries like Recharts and xlsx are split directly in <code>vite.config.ts</code>.</p>

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

      <p>The build now outputs <code>PieChart-BD8Tbips.js</code> (420 KB) and <code>xlsx-jhNyNcYQ.js</code> (283 KB) as separate chunks. Pages that don't use these libraries never load them.</p>

      <h2>Results</h2>

      <p>I didn't remove every warning. Shared API modules are used across many pages, so the main chunk is the right place for them, and I read the warnings as a view into the bundle structure.</p>

      <p>What I did was check which chunk each large module landed in and split out only the ones that could be separated.</p>

      <h2>Takeaway</h2>

      <p>How Vite splits code depended on import patterns and dependencies. If I had focused only on silencing the warnings, I could have ended up with a bundle structure I didn't intend. Next time a warning like this shows up, I'll decide where each module should live before changing anything.</p>
    </Content>
  );
};
