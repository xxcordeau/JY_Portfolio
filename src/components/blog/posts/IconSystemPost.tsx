'use client';

import styled from 'styled-components';

const Content = styled.div``;

interface PostProps {
  language: 'ko' | 'en';
}

export const IconSystemPost = ({ language }: PostProps) => {
  if (language === 'ko') {
    return (
      <Content>
        <h2>원인</h2>

        <p>저희 솔루션은 수십 개 화면에서 상태, 행동, 결과를 나타내는 아이콘을 여러 가지 쓰고 있었어요. 문제는 이랬어요.</p>

        <ul>
          <li>화면마다 아이콘 색상, 크기, 여백이 달라서 디자인 일관성이 무너졌어요.</li>
          <li>인라인 스타일이나 CSS로 색을 직접 지정해서, 테마를 바꾸려면 전부 고쳐야 했어요.</li>
          <li>비활성, 경고 같은 상태별 색상 규칙이 정해져 있지 않았어요.</li>
          <li>아이콘 파일 관리도 불규칙했어요(이름 중복, 경로 혼선).</li>
        </ul>

        <p>아이콘 하나 바꾸려면 전체 페이지를 뒤져야 하는 구조였던 거죠.</p>

        <p>그래서 <code>useIcon</code> composable과 <code>AppIcon</code> 전역 컴포넌트를 만들어서, 이름으로 의미만 선언하면 색상, 크기, 간격이 자동으로 적용되게 정리했어요.</p>

        <h2>과정과 문제 탐색</h2>

        <p>처음엔 Ant Design Vue 기반의 <code>Icon</code> 컴포넌트를 그대로 썼는데, 상태에 따라 색이 바뀌거나 테마가 어두워질 때 색 대비가 맞지 않는 문제가 반복됐어요.</p>

        <p>스타일을 한곳에서 통제할 수 있는 단일 진입점이 필요했고, 모든 아이콘 메타데이터를 <code>iconPack</code>으로 관리하기로 했어요.</p>

        <h2>구현</h2>

        <h3>a. 아이콘 메타데이터 (useIcon.ts)</h3>

        <pre><code>{`export const iconPack = {
  SUCCESS: { iconName: 'check-circle', iconColor: '#27ae60', size: '16', marginRight: '4px' },
  ERROR:   { iconName: 'alert-triangle', iconColor: '#e74c3c', size: '16', marginRight: '4px' },
  INFO:    { iconName: 'info-circle', iconColor: '#2980b9', size: '16', marginRight: '4px' },
}

export const getIconColor = (name: string) => iconPack[name]?.iconColor || '#333'`}</code></pre>

        <p>아이콘마다 색상, 크기, 여백을 정의해 두고 <code>name</code>으로 꺼내 쓰게 만들었어요. 디자인 토큰처럼, 같은 이름이면 어느 화면에서나 같은 모습으로 보여요.</p>

        <h3>b. 전역 아이콘 컴포넌트 (AppIcon)</h3>

        <pre><code>{`<template>
  <span v-if="iconPack[props.name]" :style="\`margin-right:\${computedMargin}!important;\`">
    <Icon
      :name="\`my-icon:\${iconPack[props.name].iconName}\`"
      :size="computedSize"
      :style="\`color:\${computedColor}; vertical-align:\${props.verticalAlign};\`"
    />
  </span>
</template>

<script setup lang="ts">
import { getIconColor, iconPack } from '~/composables/common/useIcon'

const props = defineProps({
  name: { type: String, required: true },
  color: String,
  size: String,
  verticalAlign: { type: String, default: 'middle' },
  marginRight: String,
  disabledType: { type: Boolean, default: false },
})

// 1️⃣ 상태에 따른 색상
const computedColor = computed(() =>
  props.disabledType ? '#cdcdcd' : props.color ?? getIconColor(props.name)
)

// 2️⃣ 사이즈·여백 계산
const computedSize = computed(() => props.size ?? iconPack[props.name]?.size ?? '16')
const computedMargin = computed(() => props.marginRight ?? iconPack[props.name]?.marginRight ?? '0px')
</script>`}</code></pre>

        <p>동작 방식은 이래요.</p>

        <ul>
          <li>외부에서 props를 넘기면 그 값을 먼저 쓰고, 없으면 pack 기본값을 써요.</li>
          <li><code>disabledType</code>이면 자동으로 회색 처리돼요.</li>
          <li>인라인 스타일은 계산된 값으로 한데 모았어요.</li>
        </ul>

        <h3>c. 아이콘 관리 가이드라인</h3>

        <ul>
          <li>SVG를 저장할 때 <code>currentColor</code>를 유지해요(색상은 CSS로 제어).</li>
          <li>경로는 <code>assets/my-icons</code>로 고정해요.</li>
          <li>이름은 소문자로 통일해요.</li>
          <li>시각 스타일은 HugeIcons 기준으로 맞춰요.</li>
        </ul>

        <p>참고: <a href="https://icones.js.org/collection/hugeicons" target="_blank" rel="noopener noreferrer">https://icones.js.org/collection/hugeicons</a></p>

        <h2>결과</h2>

        <ul>
          <li>상태별 색상 규칙과 스타일이 통일됐어요.</li>
          <li>테마를 바꿀 때 색상 값만 바꾸면 전체에 반영돼요.</li>
          <li>AppIcon 한 줄이면 색상, 크기, 여백이 따라와서 개발이 빨라졌어요.</li>
          <li>인라인 색상/크기 지정이 사라져서 코드가 깔끔해졌어요.</li>
        </ul>

        <h2>배운 점</h2>

        <p>아이콘의 의미와 스타일을 데이터로 정의해 두면, 화면 쪽 코드는 이름만 알면 된다는 걸 배웠어요. 이 구조 덕분에 디자인 시스템의 일관성과 유지보수성을 함께 챙길 수 있었어요.</p>
      </Content>
    );
  }

  return (
    <Content>
      <h2>Problem</h2>

      <p>Our product used a wide range of state, action, and result icons across dozens of screens. Here's what went wrong:</p>

      <ul>
        <li>Icon colors, sizes, and margins differed from screen to screen, so the design stopped feeling consistent.</li>
        <li>Colors were set directly with inline styles or CSS, so changing the theme meant editing everything.</li>
        <li>There were no shared color rules for states like disabled or warning.</li>
        <li>Icon files were managed loosely, with duplicate names and confusing paths.</li>
      </ul>

      <p>Changing a single icon meant digging through every page.</p>

      <p>So I built a <code>useIcon</code> composable and an <code>AppIcon</code> global component. You declare an icon's meaning by name, and color, size, and spacing are applied automatically.</p>

      <h2>Process</h2>

      <p>At first I used the <code>Icon</code> component (based on Ant Design Vue) as is. I kept hitting the same issues: colors changing with state, and contrast breaking when the theme went dark.</p>

      <p>I needed a single entry point for icon styles, so I decided to keep all icon metadata in <code>iconPack</code>.</p>

      <h2>Implementation</h2>

      <h3>a. Icon metadata (useIcon.ts)</h3>

      <pre><code>{`export const iconPack = {
  SUCCESS: { iconName: 'check-circle', iconColor: '#27ae60', size: '16', marginRight: '4px' },
  ERROR:   { iconName: 'alert-triangle', iconColor: '#e74c3c', size: '16', marginRight: '4px' },
  INFO:    { iconName: 'info-circle', iconColor: '#2980b9', size: '16', marginRight: '4px' },
}

export const getIconColor = (name: string) => iconPack[name]?.iconColor || '#333'`}</code></pre>

      <p>Each icon has its color, size, and margin defined up front, and you access it by <code>name</code>. Like design tokens, the same name looks the same on every screen.</p>

      <h3>b. Global icon component (AppIcon)</h3>

      <pre><code>{`<template>
  <span v-if="iconPack[props.name]" :style="\`margin-right:\${computedMargin}!important;\`">
    <Icon
      :name="\`my-icon:\${iconPack[props.name].iconName}\`"
      :size="computedSize"
      :style="\`color:\${computedColor}; vertical-align:\${props.verticalAlign};\`"
    />
  </span>
</template>

<script setup lang="ts">
import { getIconColor, iconPack } from '~/composables/common/useIcon'

const props = defineProps({
  name: { type: String, required: true },
  color: String,
  size: String,
  verticalAlign: { type: String, default: 'middle' },
  marginRight: String,
  disabledType: { type: Boolean, default: false },
})

// 1️⃣ Color based on state
const computedColor = computed(() =>
  props.disabledType ? '#cdcdcd' : props.color ?? getIconColor(props.name)
)

// 2️⃣ Size and margin calculation
const computedSize = computed(() => props.size ?? iconPack[props.name]?.size ?? '16')
const computedMargin = computed(() => props.marginRight ?? iconPack[props.name]?.marginRight ?? '0px')
</script>`}</code></pre>

      <p>How it works:</p>

      <ul>
        <li>Props passed from outside take priority; otherwise the pack defaults apply.</li>
        <li>With <code>disabledType</code>, the icon turns gray automatically.</li>
        <li>Inline styles all come from computed values.</li>
      </ul>

      <h3>c. Icon management guidelines</h3>

      <ul>
        <li>Keep <code>currentColor</code> when saving SVGs (color is controlled by CSS).</li>
        <li>Store files under <code>assets/my-icons</code>.</li>
        <li>Use lowercase names.</li>
        <li>Follow the HugeIcons style for visual consistency.</li>
      </ul>

      <p>Reference: <a href="https://icones.js.org/collection/hugeicons" target="_blank" rel="noopener noreferrer">https://icones.js.org/collection/hugeicons</a></p>

      <h2>Results</h2>

      <ul>
        <li>State color rules and styles are unified.</li>
        <li>Changing a theme color updates every icon.</li>
        <li>One line of AppIcon brings color, size, and margin with it, which speeds up development.</li>
        <li>With inline color and size gone, the code is cleaner.</li>
      </ul>

      <h2>Takeaways</h2>

      <p>Once an icon's meaning and style are defined as data, screen code only needs to know the name. That structure helped with both design system consistency and maintainability.</p>
    </Content>
  );
};
