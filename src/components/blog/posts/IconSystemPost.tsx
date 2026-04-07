import styled from 'styled-components';

const Content = styled.div``;

interface PostProps {
  language: 'ko' | 'en';
}

export const IconSystemPost = ({ language }: PostProps) => {
  if (language === 'ko') {
    return (
      <Content>
        <h1>전역 아이콘 시스템 구축 경험</h1>
        
        <h2>원인</h2>
        
        <p>당사 솔루션은 수십 개 화면에 걸쳐 다양한 상태/행동/결과 아이콘을 사용하고 있었어요. 하지만 문제는 아래와 같았어요.</p>
        
        <ul>
          <li>화면마다 아이콘 색상·크기·여백이 제각각 → <strong>디자인 일관성 붕괴</strong></li>
          <li>인라인 스타일이나 CSS로 직접 색을 지정 → <strong>테마 변경 시 전체 수정 필요</strong></li>
          <li>비활성 상태나 경고 상태 등 <strong>상태별 색상 규칙이 통일되지 않음</strong></li>
          <li>아이콘 파일 관리도 불규칙 (이름 중복, 경로 혼선)</li>
        </ul>
        
        <p>즉, "아이콘 하나 바꾸려면 전체 페이지를 뒤져야 하는 구조"가 되어 있었죠.</p>
        
        <p>그래서 <code>useIcon</code> composable + <code>AppIcon</code> 전역 컴포넌트를 만들어 <strong>이름 기반으로 의미만 선언하면 색상·크기·간격이 자동 적용되는 구조</strong>로 정리했습니다.</p>
        
        <h2>과정과 문제 탐색</h2>
        
        <p>초기엔 <code>Icon</code>(Ant Design Vue 기반) 컴포넌트를 그대로 사용했는데, 상태에 따라 색이 바뀌거나, 테마가 어두워질 때 색 대비가 맞지 않는 문제가 반복됐어요.</p>
        
        <p>결국 <strong>스타일을 전역적으로 통제할 수 있는 단일 진입점</strong>이 필요했고, 모든 아이콘 메타데이터를 <code>iconPack</code>으로 관리하기로 했습니다.</p>
        
        <h2>구현</h2>
        
        <h3>a. 아이콘 메타 데이터 — useIcon.ts</h3>
        
        <pre><code>{`export const iconPack = {
  SUCCESS: { iconName: 'check-circle', iconColor: '#27ae60', size: '16', marginRight: '4px' },
  ERROR:   { iconName: 'alert-triangle', iconColor: '#e74c3c', size: '16', marginRight: '4px' },
  INFO:    { iconName: 'info-circle', iconColor: '#2980b9', size: '16', marginRight: '4px' },
}

export const getIconColor = (name: string) => iconPack[name]?.iconColor || '#333'`}</code></pre>
        
        <p>아이콘마다 색상, 크기, 여백을 정의한 뒤 <code>name</code>으로 접근하도록 만들었어요.</p>
        
        <p>이 덕분에 <strong>디자인 토큰처럼 일관된 시각 표현</strong>이 가능해졌습니다.</p>
        
        <h3>b. 전역 아이콘 컴포넌트 — AppIcon</h3>
        
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
        
        <p><strong>💡 핵심 포인트</strong></p>
        
        <ul>
          <li>외부 props가 있으면 우선 적용, 없으면 pack 기본값</li>
          <li><code>disabledType</code> 시 자동 회색 처리</li>
          <li>인라인 스타일을 계산된 값으로 일원화</li>
        </ul>
        
        <h3>c. 아이콘 관리 가이드라인</h3>
        
        <ul>
          <li>SVG 저장 시 <code>currentColor</code> 유지 (색상은 CSS로 제어)</li>
          <li>경로는 <code>assets/my-icons</code>로 고정</li>
          <li>이름은 소문자로 통일</li>
          <li><strong>HugeIcons</strong> 스타일 기준으로 시각 일관성 유지
            <blockquote>
              <p><a href="https://icones.js.org/collection/hugeicons" target="_blank" rel="noopener noreferrer">https://icones.js.org/collection/hugeicons</a></p>
            </blockquote>
          </li>
        </ul>
        
        <h2>결과</h2>
        
        <ul>
          <li><strong>디자인 일관성 확보</strong>: 상태별 색상 규칙 통일, 스타일 표준화</li>
          <li><strong>테마 변경 용이</strong>: 색상만 바꿔도 전체 반영</li>
          <li><strong>개발 생산성 향상</strong>: AppIcon 컴포넌트 한 줄로 모든 속성 자동화</li>
          <li><strong>UI 가독성 향상</strong>: 인라인 색상/크기 지정 제거로 코드가 훨씬 깔끔</li>
        </ul>
        
        <h2>배운 점</h2>
        
        <p>아이콘 시스템은 단순히 그림을 넣는 게 아니라 의미와 스타일을 데이터로 추상화하는 설계라는 걸 배웠어요.</p>
        
        <p>결국 이 구조는 단순한 UI 개선이 아니라, <strong>디자인 시스템의 일관성과 유지보수성</strong>을 함께 해결한 사례가 되었어요.</p>
      </Content>
    );
  }

  return (
    <Content>
      <h1>Global Icon System Implementation Experience</h1>
      
      <h2>Problem</h2>
      
      <p>Our solution used various state/action/result icons across dozens of screens. However, the problems were as follows:</p>
      
      <ul>
        <li>Icon colors, sizes, and margins varied across screens → <strong>Design consistency breakdown</strong></li>
        <li>Colors specified directly via inline styles or CSS → <strong>Entire codebase needs modification for theme changes</strong></li>
        <li><strong>No unified color rules for states</strong> like inactive or warning states</li>
        <li>Irregular icon file management (duplicate names, path confusion)</li>
      </ul>
      
      <p>In other words, "to change one icon, you had to search through entire pages."</p>
      
      <p>So I created a <code>useIcon</code> composable + <code>AppIcon</code> global component where <strong>declaring just the semantic name automatically applies color, size, and spacing</strong>.</p>
      
      <h2>Process and Problem Exploration</h2>
      
      <p>Initially, I used the <code>Icon</code> component (based on Ant Design Vue) as is, but problems repeatedly occurred where colors changed based on state, or color contrast didn't match when the theme became dark.</p>
      
      <p>Eventually, I needed a <strong>single entry point that could globally control styles</strong>, and decided to manage all icon metadata in <code>iconPack</code>.</p>
      
      <h2>Implementation</h2>
      
      <h3>a. Icon Metadata — useIcon.ts</h3>
      
      <pre><code>{`export const iconPack = {
  SUCCESS: { iconName: 'check-circle', iconColor: '#27ae60', size: '16', marginRight: '4px' },
  ERROR:   { iconName: 'alert-triangle', iconColor: '#e74c3c', size: '16', marginRight: '4px' },
  INFO:    { iconName: 'info-circle', iconColor: '#2980b9', size: '16', marginRight: '4px' },
}

export const getIconColor = (name: string) => iconPack[name]?.iconColor || '#333'`}</code></pre>
      
      <p>I defined color, size, and margin for each icon, then made them accessible by <code>name</code>.</p>
      
      <p>Thanks to this, <strong>consistent visual representation like design tokens</strong> became possible.</p>
      
      <h3>b. Global Icon Component — AppIcon</h3>
      
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
      
      <p><strong>💡 Key Points</strong></p>
      
      <ul>
        <li>External props take priority; otherwise, pack defaults are used</li>
        <li>Automatic gray treatment for <code>disabledType</code></li>
        <li>Unified inline styles with computed values</li>
      </ul>
      
      <h3>c. Icon Management Guidelines</h3>
      
      <ul>
        <li>Maintain <code>currentColor</code> when saving SVG (color controlled via CSS)</li>
        <li>Fix path to <code>assets/my-icons</code></li>
        <li>Unify names to lowercase</li>
        <li><strong>HugeIcons</strong> style maintained for visual consistency
          <blockquote>
            <p><a href="https://icones.js.org/collection/hugeicons" target="_blank" rel="noopener noreferrer">https://icones.js.org/collection/hugeicons</a></p>
          </blockquote>
        </li>
      </ul>
      
      <h2>Results</h2>
      
      <ul>
        <li><strong>Design consistency secured</strong>: Unified state-based color rules, standardized styles</li>
        <li><strong>Easy theme changes</strong>: Changing colors reflects across entire application</li>
        <li><strong>Improved development productivity</strong>: All attributes automated with AppIcon component in one line</li>
        <li><strong>Enhanced UI readability</strong>: Code much cleaner with inline color/size specifications removed</li>
      </ul>
      
      <h2>Key Takeaways</h2>
      
      <p>I learned that an icon system is not simply about inserting images, but about designing to abstract meaning and style as data.</p>
      
      <p>Ultimately, this structure became a case that solved not just UI improvement, but <strong>design system consistency and maintainability</strong> together.</p>
    </Content>
  );
};
