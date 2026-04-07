import { OpenSourceProject } from '../openSourceData';

export const awesomeUIKit: OpenSourceProject = {
  id: 'awesome-ui-kit',
  name: 'Awesome UI Kit',
  description: {
    ko: '개발자를 위한 아름답고 접근성 높은 React 컴포넌트 라이브러리',
    en: 'Beautiful and accessible React component library for developers'
  },
  fullDescription: {
    ko: '개발자들이 쉽고 빠르게 아름다운 UI를 구축할 수 있도록 설계된 React 컴포넌트 라이브러리입니다. Radix UI 기반으로 접근성(WAI-ARIA)을 보장하며, styled-components와 다크 모드를 기본 지원합니다.\n\nnpm에 jy-awesome-ui로 배포되어 누구나 설치 가능합니다. Accordion, Button, Card, Dialog, Tabs 등 62개의 프로덕션 레디 컴포넌트를 포함하며, Tree-shaking을 지원하여 번들 사이즈를 최소화합니다.',
    en: 'A React component library designed to help developers build beautiful UIs quickly and easily. Built on Radix UI primitives for WAI-ARIA accessibility, with styled-components and built-in dark mode support.\n\nPublished on npm as jy-awesome-ui for anyone to install. Includes 62 production-ready components such as Accordion, Button, Card, Dialog, Tabs, and more. Supports tree-shaking for minimal bundle size.'
  },
  category: {
    ko: 'UI 컴포넌트',
    en: 'UI Components'
  },
  tags: ['React', 'TypeScript', 'UI Library', 'Components'],
  stats: {
    stars: '-',
    downloads: '-',
    components: '62',
    contributors: '1'
  },
  links: {
    github: 'https://github.com/xxcordeau/jy-awesome-ui',
    npm: 'https://www.npmjs.com/package/jy-awesome-ui',
    demo: '#awesome-ui-kit'
  },
  features: {
    ko: [
      'TypeScript 기반 완전한 타입 지원',
      '다크 모드 기본 지원',
      '62개의 프로덕션 레디 컴포넌트',
      '접근성(a11y) 최적화',
      '코드 하이라이팅이 적용된 인터랙티브 문서',
      '실시간 미리보기 기능',
      'Tree-shaking 지원으로 번들 사이즈 최소화'
    ],
    en: [
      'Full TypeScript support',
      'Built-in dark mode support',
      '62 production-ready components',
      'Accessibility (a11y) optimized',
      'Interactive documentation with code highlighting',
      'Live preview feature',
      'Tree-shaking support for minimal bundle size'
    ]
  },
  image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  year: '2026'
};
