import styled from 'styled-components';
import React, { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { LiveProvider, LiveEditor, LivePreview, LiveError } from 'react-live';
import { themes as prismThemes } from 'prism-react-renderer';
import ComponentShowcase from './ComponentShowcase';
import { Package, Code, Eye, ChevronDown, ChevronUp, Play, Copy, Check } from 'lucide-react';

// === Playground Components (scope) ===
import * as AwesomeUI from '../../../packages/awesome-ui/src';
import * as DataUI from '../../../packages/data-ui-kit/src';
import * as LucideIcons from 'lucide-react';

// === Playground Security ===
const BLOCKED_PATTERNS = [
  // 브라우저 전역 객체
  /\bwindow\b/, /\bdocument\b/, /\blocation\b/, /\bnavigator\b/,
  /\bself\b/, /\btop\b/, /\bparent\b/, /\bframes\b/, /\bglobalThis\b/,
  // 네트워크
  /\bfetch\s*\(/, /\bXMLHttpRequest\b/, /\bWebSocket\b/, /\bEventSource\b/,
  // 동적 코드 실행
  /\beval\b/, /\bFunction\s*\(/, /\bsetTimeout\b/, /\bsetInterval\b/,
  /\brequestAnimationFrame\b/, /\brequestIdleCallback\b/,
  // 스토리지 & 쿠키
  /\blocalStorage\b/, /\bsessionStorage\b/, /\bcookie\b/, /\bindexedDB\b/,
  // DOM 조작
  /\binnerHTML\b/, /\bouterHTML\b/, /\binsertAdjacentHTML\b/,
  /\bcreateElement\b/, /\bgetElementBy\b/, /\bquerySelector\b/,
  // 프로토타입 오염 & constructor 체인
  /\b__proto__\b/, /\bprototype\b/, /\bconstructor\b/,
  /\bObject\s*\.\s*(defineProperty|assign|create|getPrototypeOf|setPrototypeOf|getOwnPropertyDescriptor)\b/,
  /\bReflect\b/, /\bProxy\b/,
  // 모듈 시스템 & 서버
  /\bimport\s*\(/, /\brequire\s*\(/, /\bprocess\b/, /\bglobal\b/,
  /\bmodule\b/, /\bexports\b/,
  // 스크립트 태그
  /<\s*script/i, /<\s*iframe/i, /<\s*object/i, /<\s*embed/i, /<\s*link/i,
  // 문자열 조합 우회 차단 (obj['prop'] 형태의 프로퍼티 접근만 차단, 배열 리터럴은 허용)
  /\w\s*\[\s*['"`]/, /['"`]\s*\+\s*['"`]/,
  // 위험 이벤트 핸들러 (HTML 인라인 XSS만 차단, React JSX props는 허용)
  /\bon(error|load|unload|beforeunload|abort)\s*=/i,
  // 기타
  /\bdebugger\b/, /\bwith\s*\(/, /\bvoid\s*\(/,
  /\balert\s*\(/, /\bconfirm\s*\(/, /\bprompt\s*\(/,
];

function validatePlaygroundCode(code: string): string | null {
  // 1단계: 정규식 패턴 검사
  for (const pattern of BLOCKED_PATTERNS) {
    const match = code.match(pattern);
    if (match) return `보안: "${match[0]}" 사용 불가`;
  }

  // 2단계: 문자열 인코딩 우회 차단 (\\x, \\u, atob 등)
  if (/\\x[0-9a-fA-F]{2}/.test(code)) return '보안: hex escape 사용 불가';
  if (/\\u\{?[0-9a-fA-F]+\}?/.test(code)) return '보안: unicode escape 사용 불가';
  if (/\batob\s*\(/.test(code)) return '보안: "atob()" 사용 불가';
  if (/\bbtoa\s*\(/.test(code)) return '보안: "btoa()" 사용 불가';
  if (/\bString\s*\.\s*fromCharCode/.test(code)) return '보안: "String.fromCharCode" 사용 불가';
  if (/\bcharCodeAt\b/.test(code)) return '보안: "charCodeAt" 사용 불가';

  // 3단계: this 키워드를 통한 글로벌 접근 차단
  if (/\bthis\s*\[/.test(code)) return '보안: "this[...]" 접근 불가';
  if (/\bthis\s*\./.test(code) && !/\bthis\s*\.\s*(props|state|setState|forceUpdate|render)\b/.test(code)) {
    return '보안: "this" 접근 제한';
  }

  return null;
}

// Code transformation: usageCode → react-live compatible
function buildLiveCode(usageCode: string): { code: string; noInline: boolean } {
  const lines = usageCode.split('\n');
  const decls: string[] = [];
  const jsx: string[] = [];
  let bracketDepth = 0;
  let inDecl = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('import ')) continue;
    if (trimmed === '' && !inDecl) { jsx.push(''); continue; }
    if (trimmed.startsWith('//')) { jsx.push(line); continue; }

    if (inDecl) {
      decls.push(line);
      bracketDepth += (line.match(/[\[{(]/g) || []).length;
      bracketDepth -= (line.match(/[\]})]/g) || []).length;
      if (bracketDepth <= 0) inDecl = false;
      continue;
    }

    if (trimmed.startsWith('const ') || trimmed.startsWith('let ') || trimmed.startsWith('var ') || trimmed.startsWith('function ')) {
      decls.push(line);
      bracketDepth = 0;
      bracketDepth += (line.match(/[\[{(]/g) || []).length;
      bracketDepth -= (line.match(/[\]})]/g) || []).length;
      if (bracketDepth > 0) inDecl = true;
      continue;
    }

    jsx.push(line);
  }

  const jsxCode = jsx.join('\n').trim();

  if (decls.length > 0) {
    return {
      noInline: true,
      code: `function Demo() {\n${decls.map(d => '  ' + d).join('\n')}\n\n  return (\n    <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>\n${jsxCode.split('\n').map(l => '      ' + l).join('\n')}\n    </div>\n  );\n}\nrender(<Demo />);`
    };
  }

  return {
    noInline: false,
    code: `<div style={{display:'flex',flexDirection:'column',gap:'16px'}}>\n${jsxCode}\n</div>`
  };
}

const DocContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;

  @media (max-width: 768px) {
    padding: 0 20px;
  }
`;

const Section = styled.section`
  margin-bottom: 60px;

  @media (max-width: 768px) {
    margin-bottom: 40px;
  }
`;

const SectionTitle = styled.h2<{ $isDark: boolean }>`
  font-size: 32px;
  font-weight: 700;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  margin: 0 0 24px 0;
  letter-spacing: -0.5px;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const CategoryTitle = styled.h3<{ $isDark: boolean }>`
  font-size: 24px;
  font-weight: 600;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  margin: 40px 0 20px 0;
  letter-spacing: -0.3px;
  display: flex;
  align-items: center;
  gap: 12px;

  &::before {
    content: '';
    width: 4px;
    height: 24px;
    background: ${props => props.$isDark 
      ? 'linear-gradient(135deg, #4ECDC4 0%, #45B7D1 100%)'
      : 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)'};
    border-radius: 2px;
  }

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const ComponentGrid = styled.div`
  display: grid;
  gap: 24px;
`;

const ComponentCard = styled.div<{ $isDark: boolean }>`
  background: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)'};
  border: 1px solid ${props => props.$isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'};
  border-radius: 16px;
  padding: 24px;
  backdrop-filter: blur(20px);
  transition: all 0.3s ease;
  max-width: 100%;
  overflow: visible;

  &:hover {
    background: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
  }
`;

const ComponentHeader = styled.div`
  margin-bottom: 16px;
`;

const ComponentName = styled.h4<{ $isDark: boolean }>`
  font-size: 20px;
  font-weight: 600;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  margin: 0 0 8px 0;
`;

const ComponentDescription = styled.p<{ $isDark: boolean }>`
  font-size: 14px;
  color: ${props => props.$isDark ? '#86868b' : '#6e6e73'};
  margin: 0;
  line-height: 1.5;
`;

const TabButtons = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  border-bottom: 1px solid rgba(128, 128, 128, 0.2);
`;

const TabButton = styled.button<{ $isDark: boolean; $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: transparent;
  border: none;
  border-bottom: 2px solid ${props => props.$active 
    ? props.$isDark ? '#4ECDC4' : '#007AFF'
    : 'transparent'};
  color: ${props => props.$active 
    ? props.$isDark ? '#4ECDC4' : '#007AFF'
    : props.$isDark ? '#86868b' : '#6e6e73'};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: -1px;

  svg {
    width: 14px;
    height: 14px;
  }

  &:hover {
    color: ${props => props.$isDark ? '#4ECDC4' : '#007AFF'};
  }
`;

const CodeBlock = styled.div<{ $isDark: boolean }>`
  background: ${props => props.$isDark ? '#1a1a1a' : '#f8f8f8'};
  border: 1px solid ${props => props.$isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  border-radius: 8px;
  overflow-x: auto;
  overflow-y: hidden;
  margin-bottom: 16px;
  max-width: 100%;
`;

const CodeHeader = styled.div<{ $isDark: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: ${props => props.$isDark ? '#0f0f0f' : '#efefef'};
  border-bottom: 1px solid ${props => props.$isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
`;

const CodeTitle = styled.span<{ $isDark: boolean }>`
  font-size: 12px;
  font-weight: 600;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  display: flex;
  align-items: center;
  gap: 6px;

  svg {
    width: 14px;
    height: 14px;
  }
`;

const ToggleButton = styled.button<{ $isDark: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: transparent;
  border: 1px solid ${props => props.$isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'};
  border-radius: 6px;
  color: ${props => props.$isDark ? '#86868b' : '#6e6e73'};
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
  }

  svg {
    width: 12px;
    height: 12px;
  }
`;

const PlaygroundContainer = styled.div<{ $isDark: boolean }>`
  border: 1px solid ${props => props.$isDark ? '#333' : '#e0e0e0'};
  border-radius: 12px;
  overflow: hidden;
  display: flex;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const PlaygroundCodeArea = styled.div<{ $isDark: boolean }>`
  position: relative;
  flex: 1;
  min-width: 0;
  background: ${props => props.$isDark ? '#1e1e1e' : '#f5f5f7'};
  border-right: 1px solid ${props => props.$isDark ? '#333' : '#e0e0e0'};
  display: flex;
  flex-direction: column;
  overflow: hidden;

  /* react-live pre 태그 인라인 배경색 강제 오버라이드 */
  pre, div[class*="live-editor"] {
    background: transparent !important;
  }

  @media (max-width: 768px) {
    border-right: none;
    border-bottom: 1px solid ${props => props.$isDark ? '#333' : '#e0e0e0'};
  }
`;

const PlaygroundPreview = styled.div<{ $isDark: boolean }>`
  flex: 1;
  min-width: 0;
  padding: 24px;
  background: ${props => props.$isDark ? '#1e1e1e' : '#f5f5f7'};
  display: flex;
  align-items: flex-start;
  justify-content: center;
  overflow: auto;
`;

const PlaygroundCodeHeader = styled.div<{ $isDark: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  background: ${props => props.$isDark ? '#1e1e1e' : '#f5f5f7'};
  border-bottom: 1px solid ${props => props.$isDark ? '#333' : '#e0e0e0'};
`;

const PlaygroundLabel = styled.span<{ $isDark: boolean }>`
  font-size: 11px;
  font-weight: 600;
  color: ${props => props.$isDark ? '#86868b' : '#6e6e73'};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const CopyButton = styled.button<{ $isDark: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: transparent;
  border: 1px solid ${props => props.$isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.12)'};
  border-radius: 6px;
  color: ${props => props.$isDark ? '#86868b' : '#6e6e73'};
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  svg { width: 12px; height: 12px; }

  &:hover {
    background: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
    color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  }
`;

const PlaygroundEditor = styled.textarea<{ $isDark: boolean }>`
  width: 100%;
  flex: 1;
  min-height: 300px;
  padding: 16px;
  border: none;
  outline: none;
  resize: none;
  font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.7;
  tab-size: 2;
  background: ${props => props.$isDark ? '#0f0f0f' : '#f8f8f8'};
  color: ${props => props.$isDark ? '#e0e0e0' : '#1d1d1f'};
  white-space: pre;
  overflow: auto;

  &::placeholder {
    color: ${props => props.$isDark ? '#555' : '#aaa'};
  }

  &:focus {
    background: ${props => props.$isDark ? '#111' : '#f5f5f5'};
  }
`;

const CodeContent = styled.div<{ $expanded: boolean; $isDark?: boolean }>`
  max-height: ${props => props.$expanded ? '1000px' : '200px'};
  overflow-y: hidden;
  overflow-x: auto;
  transition: max-height 0.3s ease;
  position: relative;

  ${props => !props.$expanded && `
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 60px;
      background: linear-gradient(to bottom, transparent, ${props.$isDark ? '#1a1a1a' : '#f8f8f8'});
      pointer-events: none;
    }
  `}
`;

const InstallCommand = styled.div<{ $isDark: boolean }>`
  background: ${props => props.$isDark ? '#1a1a1a' : '#f8f8f8'};
  border: 1px solid ${props => props.$isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  border-radius: 8px;
  padding: 16px;
  font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
  font-size: 13px;
  color: ${props => props.$isDark ? '#4ECDC4' : '#007AFF'};
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;

  svg {
    width: 18px;
    height: 18px;
  }
`;

interface LibraryDocDemoProps {
  isDark: boolean;
  language: 'ko' | 'en';
  projectId?: string;
}

interface ComponentInfo {
  name: string;
  description: {
    ko: string;
    en: string;
  };
  category: string;
  importCode: string;
  usageCode: string;
}

const components: ComponentInfo[] = [
  {
    name: 'Input',
    description: {
      ko: '다양한 타입을 지원하는 텍스트 입력 필드',
      en: 'Text input field supporting various types'
    },
    category: 'Form Inputs',
    importCode: `import { Input } from 'jy-awesome-ui';`,
    usageCode: `// Text Input
<Input 
  type="text" 
  placeholder="Enter your name..." 
  isDark={isDark}
/>

// Email Input
<Input 
  type="email" 
  placeholder="your@email.com" 
  isDark={isDark}
/>

// Password Input
<Input 
  type="password" 
  placeholder="Enter password" 
  isDark={isDark}
/>

// Search Input
<Input 
  type="search" 
  placeholder="Search..." 
  isDark={isDark}
/>

// Number Input
<Input 
  type="number" 
  placeholder="Enter amount" 
  isDark={isDark}
/>

// Disabled Input
<Input
  type="text"
  placeholder="Disabled input"
  disabled
  isDark={isDark}
/>`
  },
  {
    name: 'Textarea',
    description: {
      ko: '여러 줄의 텍스트를 입력할 수 있는 필드',
      en: 'Multi-line text input field'
    },
    category: 'Form Inputs',
    importCode: `import { Textarea } from 'jy-awesome-ui';`,
    usageCode: `// Default Textarea
<Textarea 
  placeholder="Enter your message..." 
  isDark={isDark}
/>

// Large Textarea
<Textarea 
  placeholder="Write a detailed description..." 
  isDark={isDark}
  style={{ minHeight: "180px" }}
/>

// Disabled Textarea
<Textarea
  placeholder="This textarea is disabled"
  disabled
  isDark={isDark}
/>`
  },
  {
    name: 'Button',
    description: {
      ko: '다양한 스타일과 크기를 지원하는 버튼',
      en: 'Button with various styles and sizes'
    },
    category: 'Buttons',
    importCode: `import { Button } from 'jy-awesome-ui';`,
    usageCode: `// Default Button
<Button isDark={isDark}>
  Click Me
</Button>

// Button Sizes
<Button isDark={isDark} size="sm">Small</Button>
<Button isDark={isDark}>Default</Button>
<Button isDark={isDark} size="lg">Large</Button>

// Button Variants
<Button isDark={isDark} variant="default">Default</Button>
<Button isDark={isDark} variant="outline">Outline</Button>
<Button isDark={isDark} variant="ghost">Ghost</Button>
<Button isDark={isDark} variant="destructive">Destructive</Button>

// Button with Icon
import { Search } from 'lucide-react';

<Button isDark={isDark}>
  <Search />
  Search
</Button>

// Disabled Button
<Button isDark={isDark} disabled>
  Disabled
</Button>`
  },
  {
    name: 'Radio',
    description: {
      ko: '여러 옵션 중 하나를 선택하는 라디오 버튼',
      en: 'Radio button for selecting one option from many'
    },
    category: 'Form Inputs',
    importCode: `import { RadioGroup, RadioGroupItem } from 'jy-awesome-ui';`,
    usageCode: `const [value, setValue] = useState("option1");

<RadioGroup value={value} onValueChange={setValue} isDark={isDark}>
  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
    <RadioGroupItem value="option1" id="r1" isDark={isDark} />
    <label htmlFor="r1">Option 1</label>
  </div>
  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
    <RadioGroupItem value="option2" id="r2" isDark={isDark} />
    <label htmlFor="r2">Option 2</label>
  </div>
</RadioGroup>`
  },
  {
    name: 'Select',
    description: {
      ko: '드롭다운 형태의 선택 메뉴',
      en: 'Dropdown selection menu'
    },
    category: 'Form Inputs',
    importCode: `import { 
  Select, 
  SelectContent, 
  SelectGroup,
  SelectItem, 
  SelectLabel,
  SelectTrigger, 
  SelectValue 
} from 'jy-awesome-ui';`,
    usageCode: `const [value, setValue] = useState("");

<Select value={value} onValueChange={setValue}>
  <SelectTrigger isDark={isDark}>
    <SelectValue placeholder="Select a fruit..." />
  </SelectTrigger>
  <SelectContent isDark={isDark}>
    <SelectGroup>
      <SelectLabel isDark={isDark}>Fruits</SelectLabel>
      <SelectItem value="apple" isDark={isDark}>Apple</SelectItem>
      <SelectItem value="banana" isDark={isDark}>Banana</SelectItem>
      <SelectItem value="orange" isDark={isDark}>Orange</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>`
  },
  {
    name: 'Switch',
    description: {
      ko: '온/오프 상태를 전환하는 스위치',
      en: 'Switch for toggling on/off state'
    },
    category: 'Buttons',
    importCode: `import { Switch } from 'jy-awesome-ui';`,
    usageCode: `const [checked, setChecked] = useState(false);

// Basic Switch
<Switch 
  checked={checked} 
  onCheckedChange={setChecked} 
  isDark={isDark}
/>

// With Label
<div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
  <Switch 
    checked={checked} 
    onCheckedChange={setChecked} 
    isDark={isDark}
    id="s1"
  />
  <label htmlFor="s1">Enable notifications</label>
</div>

// Disabled
<Switch isDark={isDark} disabled />`
  },
  {
    name: 'Toggle',
    description: {
      ko: '눌렀다 뗄 수 있는 토글 버튼',
      en: 'Toggle button that can be pressed and released'
    },
    category: 'Buttons',
    importCode: `import { Toggle } from 'jy-awesome-ui';
import { Bold } from 'lucide-react';`,
    usageCode: `// Default Toggle
<Toggle isDark={isDark}>
  <Bold />
</Toggle>

// Outline Variant
<Toggle isDark={isDark} variant="outline">
  <Bold />
</Toggle>

// Sizes
<Toggle isDark={isDark} size="sm">Small</Toggle>
<Toggle isDark={isDark}>Default</Toggle>
<Toggle isDark={isDark} size="lg">Large</Toggle>

// Controlled
const [pressed, setPressed] = useState(false);

<Toggle
  pressed={pressed}
  onPressedChange={setPressed}
  isDark={isDark}
>
  Toggle Me
</Toggle>`
  },
  {
    name: 'Slider',
    description: {
      ko: '값을 조절하는 슬라이더',
      en: 'Slider for adjusting values'
    },
    category: 'Form Inputs',
    importCode: `import { Slider } from 'jy-awesome-ui';`,
    usageCode: `const [value, setValue] = useState([50]);

// Single Value
<Slider 
  value={value} 
  onValueChange={setValue}
  max={100}
  step={1}
  isDark={isDark}
/>

// Range Slider
<Slider 
  defaultValue={[25, 75]} 
  max={100}
  step={1}
  isDark={isDark}
/>

// Disabled
<Slider
  defaultValue={[50]}
  disabled
  isDark={isDark}
/>`
  },
  {
    name: 'Avatar',
    description: {
      ko: '프로필 이미지를 표시하는 아바타',
      en: 'Avatar for displaying profile images'
    },
    category: 'Display',
    importCode: `import { Avatar, AvatarImage, AvatarFallback } from 'jy-awesome-ui';`,
    usageCode: `// With Image
<Avatar>
  <AvatarImage src="https://example.com/avatar.jpg" />
  <AvatarFallback isDark={isDark}>JD</AvatarFallback>
</Avatar>

// Custom Size
<Avatar size={56}>
  <AvatarImage src="https://example.com/avatar.jpg" />
  <AvatarFallback isDark={isDark}>JD</AvatarFallback>
</Avatar>

// Fallback Only
<Avatar>
  <AvatarFallback isDark={isDark}>AB</AvatarFallback>
</Avatar>

// With Icon
import { User } from 'lucide-react';

<Avatar>
  <AvatarFallback isDark={isDark}>
    <User />
  </AvatarFallback>
</Avatar>`
  },
  {
    name: 'Badge',
    description: {
      ko: '상태나 카테고리를 표시하는 뱃지',
      en: 'Badge for displaying status or categories'
    },
    category: 'Display',
    importCode: `import { Badge } from 'jy-awesome-ui';`,
    usageCode: `// Badge Variants
<Badge isDark={isDark}>Default</Badge>
<Badge isDark={isDark} variant="secondary">Secondary</Badge>
<Badge isDark={isDark} variant="outline">Outline</Badge>
<Badge isDark={isDark} variant="destructive">Destructive</Badge>

// With Icons
import { Star } from 'lucide-react';

<Badge isDark={isDark}>
  <Star />
  Featured
</Badge>`
  },
  {
    name: 'Card',
    description: {
      ko: '콘텐츠를 그룹화하는 카드',
      en: 'Card for grouping content'
    },
    category: 'Layout',
    importCode: `import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from 'jy-awesome-ui';`,
    usageCode: `<Card isDark={isDark}>
  <CardHeader>
    <CardTitle isDark={isDark}>Card Title</CardTitle>
    <CardDescription isDark={isDark}>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button isDark={isDark}>Action</Button>
  </CardFooter>
</Card>`
  },
  {
    name: 'Panel',
    description: {
      ko: '간단한 콘텐츠 패널',
      en: 'Simple content panel'
    },
    category: 'Layout',
    importCode: `import { Panel } from 'jy-awesome-ui';`,
    usageCode: `<Panel isDark={isDark}>
  <h4>Panel Title</h4>
  <p>Panel content</p>
</Panel>`
  },
  {
    name: 'Layout',
    description: {
      ko: 'Grid, Stack, Flex 레이아웃 컴포넌트',
      en: 'Grid, Stack, and Flex layout components'
    },
    category: 'Layout',
    importCode: `import { Grid, Stack, Flex } from 'jy-awesome-ui';`,
    usageCode: `// Grid Layout - Fixed columns
<Grid columns={3} gap="16px">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Grid>

// Grid Layout - Responsive
<Grid minColumnWidth="250px" gap="20px">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Grid>

// Stack Layout - Vertical
<Stack gap="12px" align="center">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Stack>

// Flex Layout - Horizontal
<Flex gap="12px" align="center" justify="space-between" wrap>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</Flex>`
  },
  {
    name: 'Divider',
    description: {
      ko: '텍스트가 있는 구분선',
      en: 'Divider with optional text'
    },
    category: 'Layout',
    importCode: `import { Divider } from 'jy-awesome-ui';`,
    usageCode: `// Simple divider
<Divider isDark={isDark} />

// With text
<Divider isDark={isDark}>OR</Divider>

// Vertical
<Divider isDark={isDark} orientation="vertical" />`
  },
  {
    name: 'Dialog',
    description: {
      ko: '모달 다이얼로그',
      en: 'Modal dialog'
    },
    category: 'Overlay',
    importCode: `import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from 'jy-awesome-ui';`,
    usageCode: `<Dialog>
  <DialogTrigger asChild>
    <Button isDark={isDark}>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent isDark={isDark}>
    <DialogHeader>
      <DialogTitle isDark={isDark}>Dialog Title</DialogTitle>
      <DialogDescription isDark={isDark}>
        Dialog description
      </DialogDescription>
    </DialogHeader>
    <div>Content</div>
    <DialogFooter>
      <Button isDark={isDark}>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`
  },
  {
    name: 'Drawer',
    description: {
      ko: '슬라이드 드로어',
      en: 'Slide drawer'
    },
    category: 'Overlay',
    importCode: `import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from 'jy-awesome-ui';`,
    usageCode: `<Drawer>
  <DrawerTrigger asChild>
    <Button isDark={isDark}>Open Drawer</Button>
  </DrawerTrigger>
  <DrawerContent isDark={isDark}>
    <DrawerHeader>
      <DrawerTitle isDark={isDark}>Drawer Title</DrawerTitle>
      <DrawerDescription isDark={isDark}>
        Drawer description
      </DrawerDescription>
    </DrawerHeader>
    <div style={{ padding: "16px" }}>Content</div>
    <DrawerFooter>
      <Button isDark={isDark}>Submit</Button>
      <DrawerClose asChild>
        <Button isDark={isDark} variant="outline">Close</Button>
      </DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>`
  },
  {
    name: 'Popover',
    description: {
      ko: '팝오버 컨텍스트 메뉴',
      en: 'Popover context menu'
    },
    category: 'Overlay',
    importCode: `import { Popover, PopoverContent, PopoverTrigger } from 'jy-awesome-ui';`,
    usageCode: `<Popover>
  <PopoverTrigger asChild>
    <Button isDark={isDark}>Open Popover</Button>
  </PopoverTrigger>
  <PopoverContent isDark={isDark}>
    <div>Popover content</div>
  </PopoverContent>
</Popover>`
  },
  {
    name: 'Tooltip',
    description: {
      ko: '툴팁',
      en: 'Tooltip'
    },
    category: 'Overlay',
    importCode: `import { Tooltip, TooltipContent, TooltipTrigger } from 'jy-awesome-ui';`,
    usageCode: `<Tooltip>
  <TooltipTrigger asChild>
    <Button isDark={isDark}>Hover me</Button>
  </TooltipTrigger>
  <TooltipContent isDark={isDark}>
    <p>Tooltip text</p>
  </TooltipContent>
</Tooltip>`
  },
  {
    name: 'Accordion',
    description: {
      ko: '접이식 컨텐츠',
      en: 'Collapsible content'
    },
    category: 'Display',
    importCode: `import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from 'jy-awesome-ui';`,
    usageCode: `<Accordion type="single" collapsible>
  <AccordionItem value="item-1" isDark={isDark}>
    <AccordionTrigger isDark={isDark}>Question 1</AccordionTrigger>
    <AccordionContent>Answer 1</AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2" isDark={isDark}>
    <AccordionTrigger isDark={isDark}>Question 2</AccordionTrigger>
    <AccordionContent>Answer 2</AccordionContent>
  </AccordionItem>
</Accordion>`
  },
  {
    name: 'Tabs',
    description: {
      ko: '탭 네비게이션',
      en: 'Tab navigation'
    },
    category: 'Navigation',
    importCode: `import { Tabs, TabsContent, TabsList, TabsTrigger } from 'jy-awesome-ui';`,
    usageCode: `<Tabs defaultValue="tab1">
  <TabsList isDark={isDark}>
    <TabsTrigger value="tab1" isDark={isDark}>Tab 1</TabsTrigger>
    <TabsTrigger value="tab2" isDark={isDark}>Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">
    Tab 1 content
  </TabsContent>
  <TabsContent value="tab2">
    Tab 2 content
  </TabsContent>
</Tabs>`
  },
  {
    name: 'Stepper',
    description: {
      ko: '단계별 프로세스 표시',
      en: 'Step-by-step process indicator'
    },
    category: 'Navigation',
    importCode: `import { Stepper } from 'jy-awesome-ui';`,
    usageCode: `<Stepper
  steps={[
    { label: "Step 1" },
    { label: "Step 2" },
    { label: "Step 3" },
  ]}
  currentStep={1}
  isDark={isDark}
>
  <div>Current step content</div>
</Stepper>`
  },
  {
    name: 'Navbar',
    description: {
      ko: '상단 네비게이션 바',
      en: 'Top navigation bar'
    },
    category: 'Navigation',
    importCode: `import { Navbar, NavbarBrand, NavbarContent, NavbarMenu, NavbarItem, NavbarLink, NavbarActions } from 'jy-awesome-ui';`,
    usageCode: `<Navbar isDark={isDark} sticky>
  <NavbarBrand isDark={isDark}>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="10" />
    </svg>
    Brand
  </NavbarBrand>
  <NavbarContent>
    <NavbarMenu>
      <NavbarItem>
        <NavbarLink isDark={isDark} active href="#">
          Home
        </NavbarLink>
      </NavbarItem>
      <NavbarItem>
        <NavbarLink isDark={isDark} href="#">
          Products
        </NavbarLink>
      </NavbarItem>
      <NavbarItem>
        <NavbarLink isDark={isDark} href="#">
          About
        </NavbarLink>
      </NavbarItem>
    </NavbarMenu>
  </NavbarContent>
  <NavbarActions>
    <Button isDark={isDark} variant="ghost" size="sm">
      Sign In
    </Button>
    <Button isDark={isDark} size="sm">
      Sign Up
    </Button>
  </NavbarActions>
</Navbar>`
  },
  {
    name: 'Header',
    description: {
      ko: '확장된 헤더 (상단 및 하단)',
      en: 'Extended header with top and bottom sections'
    },
    category: 'Navigation',
    importCode: `import { Header, HeaderTop, HeaderBottom, NavbarBrand, NavbarActions } from 'jy-awesome-ui';`,
    usageCode: `<Header isDark={isDark}>
  <HeaderTop>
    <NavbarBrand isDark={isDark}>
      Brand
    </NavbarBrand>
    <NavbarActions>
      <Button isDark={isDark} variant="ghost" size="sm">
        Account
      </Button>
    </NavbarActions>
  </HeaderTop>
  <HeaderBottom isDark={isDark}>
    <Button isDark={isDark} variant="ghost" size="sm">
      Dashboard
    </Button>
    <Button isDark={isDark} variant="ghost" size="sm">
      Projects
    </Button>
    <Button isDark={isDark} variant="ghost" size="sm">
      Team
    </Button>
  </HeaderBottom>
</Header>`
  },
  {
    name: 'Breadcrumb',
    description: {
      ko: '경로 네비게이션',
      en: 'Breadcrumb navigation'
    },
    category: 'Navigation',
    importCode: `import { BreadcrumbStyled, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from 'jy-awesome-ui';`,
    usageCode: `<BreadcrumbStyled>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink isDark={isDark} href="#">
        Home
      </BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator isDark={isDark} />
    <BreadcrumbItem>
      <BreadcrumbLink isDark={isDark} href="#">
        Projects
      </BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator isDark={isDark} />
    <BreadcrumbItem>
      <BreadcrumbPage isDark={isDark}>
        Current Page
      </BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</BreadcrumbStyled>`
  },
  {
    name: 'Pagination',
    description: {
      ko: '페이지네이션',
      en: 'Pagination navigation'
    },
    category: 'Navigation',
    importCode: `import { PaginationStyled, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis } from 'jy-awesome-ui';`,
    usageCode: `<PaginationStyled>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious isDark={isDark} href="#" />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink isDark={isDark} href="#" active>
        1
      </PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink isDark={isDark} href="#">
        2
      </PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink isDark={isDark} href="#">
        3
      </PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationEllipsis isDark={isDark} />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink isDark={isDark} href="#">
        10
      </PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationNext isDark={isDark} href="#" />
    </PaginationItem>
  </PaginationContent>
</PaginationStyled>`
  },
  {
    name: 'Sidebar',
    description: {
      ko: '사이드바 네비게이션',
      en: 'Sidebar navigation'
    },
    category: 'Navigation',
    importCode: `import { SidebarStyledProvider, SidebarStyled, SidebarHeader, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarToggle, SidebarInset } from 'jy-awesome-ui';`,
    usageCode: `// Helper component to access sidebar state
function SidebarHeaderContent({ isDark }) {
  const { state } = useSidebarStyled();
  const isCollapsed = state === "collapsed";
  
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: isCollapsed ? 'center' : 'space-between',
      width: '100%' 
    }}>
      {!isCollapsed && <span style={{ fontWeight: 600 }}>Menu</span>}
      <SidebarToggle isDark={isDark} />
    </div>
  );
}

<SidebarStyledProvider>
  <SidebarStyled isDark={isDark} variant="sidebar">
    <SidebarHeader isDark={isDark}>
      <SidebarHeaderContent isDark={isDark} />
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel isDark={isDark}>
          Main
        </SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton isDark={isDark} active>
              <span>Dashboard</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton isDark={isDark}>
              <span>Projects</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton isDark={isDark}>
              <span>Team</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter isDark={isDark}>
      <SidebarMenuButton isDark={isDark}>
        <span>Settings</span>
      </SidebarMenuButton>
    </SidebarFooter>
  </SidebarStyled>
  <SidebarInset>
    <div style={{ padding: '24px' }}>
      Main content area
    </div>
  </SidebarInset>
</SidebarStyledProvider>`
  },
  {
    name: 'BottomNavigation',
    description: {
      ko: '모바일 하단 네비게이션',
      en: 'Mobile bottom navigation'
    },
    category: 'Navigation',
    importCode: `import { BottomNavigation } from 'jy-awesome-ui';
import { Home, Search, Bell, User } from 'lucide-react';`,
    usageCode: `const [activeId, setActiveId] = useState('home');

const navItems = [
  {
    id: 'home',
    label: 'Home',
    icon: <Home />,
  },
  {
    id: 'search',
    label: 'Search',
    icon: <Search />,
  },
  {
    id: 'notifications',
    label: 'Alerts',
    icon: <Bell />,
    badge: 3
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: <User />,
  }
];

<BottomNavigation
  items={navItems}
  activeId={activeId}
  isDark={isDark}
  onItemClick={(id) => setActiveId(id)}
/>`
  },
  {
    name: 'Chip',
    description: {
      ko: '태그, 레이블, 필터에 사용되는 칩',
      en: 'Chip for tags, labels, and filters'
    },
    category: 'Data Display',
    importCode: `import { Chip } from 'jy-awesome-ui';
import { Star, Zap } from 'lucide-react';`,
    usageCode: `// Basic Chips
<Chip label="Default" isDark={isDark} />
<Chip label="Primary" variant="primary" isDark={isDark} />
<Chip label="Success" variant="success" isDark={isDark} />
<Chip label="Warning" variant="warning" isDark={isDark} />
<Chip label="Error" variant="error" isDark={isDark} />

// Sizes
<Chip label="Small" size="sm" isDark={isDark} />
<Chip label="Medium" size="md" isDark={isDark} />
<Chip label="Large" size="lg" isDark={isDark} />

// With Icons
<Chip 
  label="Featured" 
  icon={<Star />} 
  variant="primary" 
  isDark={isDark} 
/>
<Chip 
  label="New" 
  icon={<Zap />} 
  variant="warning" 
  isDark={isDark} 
/>

// Deletable
<Chip 
  label="Removable" 
  isDark={isDark}
  onDelete={() => console.log('Deleted')} 
/>

// Clickable
<Chip 
  label="Click Me" 
  variant="primary"
  isDark={isDark}
  onClick={() => alert('Clicked!')}
/>`
  },
  {
    name: 'Toast',
    description: {
      ko: '일시적인 알림 메시지',
      en: 'Temporary notification message'
    },
    category: 'Feedback',
    importCode: `import { toast, ToastProvider } from 'jy-awesome-ui';`,
    usageCode: `// First, add ToastProvider to your app
<ToastProvider isDark={isDark} />

// Then use toast methods anywhere
<Button 
  isDark={isDark}
  onClick={() => toast.success('Success!', 'Operation completed successfully')}
>
  Show Success Toast
</Button>

<Button 
  isDark={isDark}
  onClick={() => toast.error('Error!', 'Something went wrong')}
>
  Show Error Toast
</Button>

<Button 
  isDark={isDark}
  onClick={() => toast.warning('Warning!', 'Please check this')}
>
  Show Warning Toast
</Button>

<Button 
  isDark={isDark}
  onClick={() => toast.info('Info', 'Here is some information')}
>
  Show Info Toast
</Button>`
  },
  {
    name: 'Banner',
    description: {
      ko: '페이지 상단의 공지사항 배너',
      en: 'Page-level notice banner'
    },
    category: 'Feedback',
    importCode: `import { Banner } from 'jy-awesome-ui';`,
    usageCode: `// Basic Banners
<Banner
  variant="info"
  title="Information"
  description="This is an informational message."
  isDark={isDark}
/>

<Banner
  variant="success"
  title="Success"
  description="Your changes have been saved successfully."
  isDark={isDark}
/>

<Banner
  variant="warning"
  title="Warning"
  description="Your trial period will expire in 3 days."
  isDark={isDark}
/>

<Banner
  variant="error"
  title="Error"
  description="Unable to connect to the server."
  isDark={isDark}
/>

// Dismissible Banner
<Banner
  variant="info"
  title="New Feature"
  description="Check out our new dashboard!"
  isDark={isDark}
  dismissible
  onDismiss={() => console.log('Dismissed')}
/>

// Banner with Action
<Banner
  variant="warning"
  title="Update Available"
  description="A new version is available. Please update."
  isDark={isDark}
  action={{
    label: 'Update Now',
    onClick: () => alert('Updating...')
  }}
/>`
  },
  {
    name: 'ProgressBar',
    description: {
      ko: '진행률 표시 바',
      en: 'Progress indicator bar'
    },
    category: 'Feedback',
    importCode: `import { ProgressBar } from 'jy-awesome-ui';`,
    usageCode: `// Basic Progress
<ProgressBar progress={30} isDark={isDark} />
<ProgressBar progress={60} isDark={isDark} />
<ProgressBar progress={100} isDark={isDark} />

// Variants
<ProgressBar progress={50} variant="default" isDark={isDark} />
<ProgressBar progress={75} variant="success" isDark={isDark} />
<ProgressBar progress={40} variant="warning" isDark={isDark} />
<ProgressBar progress={20} variant="error" isDark={isDark} />`
  },
  {
    name: 'Spinner',
    description: {
      ko: '로딩 스피너',
      en: 'Loading spinner'
    },
    category: 'Feedback',
    importCode: `import { Spinner } from 'jy-awesome-ui';`,
    usageCode: `// Sizes
<Spinner size="sm" isDark={isDark} />
<Spinner size="md" isDark={isDark} />
<Spinner size="lg" isDark={isDark} />

// Variants
<Spinner variant="default" isDark={isDark} />
<Spinner variant="success" isDark={isDark} />
<Spinner variant="warning" isDark={isDark} />
<Spinner variant="error" isDark={isDark} />`
  },
  {
    name: 'LinearProgress',
    description: {
      ko: '무한 진행률 표시',
      en: 'Indeterminate progress indicator'
    },
    category: 'Feedback',
    importCode: `import { LinearProgress } from 'jy-awesome-ui';`,
    usageCode: `// Basic Linear Progress
<LinearProgress isDark={isDark} />

// Variants
<LinearProgress variant="default" isDark={isDark} />
<LinearProgress variant="success" isDark={isDark} />
<LinearProgress variant="warning" isDark={isDark} />
<LinearProgress variant="error" isDark={isDark} />`
  },
  {
    name: 'Timeline',
    description: {
      ko: '시간순 이벤트 표시',
      en: 'Chronological event display'
    },
    category: 'Data Display',
    importCode: `import { Timeline } from 'jy-awesome-ui';
import { CheckCircle, Circle, AlertCircle } from 'lucide-react';`,
    usageCode: `const timelineItems = [
  {
    id: '1',
    title: 'Project Started',
    time: '2 hours ago',
    description: 'The project has been initialized with basic setup.',
    variant: 'success',
    icon: <CheckCircle />
  },
  {
    id: '2',
    title: 'First Milestone',
    time: '1 hour ago',
    description: 'Completed the first phase of development.',
    variant: 'primary',
    icon: <Circle />
  },
  {
    id: '3',
    title: 'Review Pending',
    time: '30 minutes ago',
    description: 'Waiting for code review from the team.',
    variant: 'warning',
    icon: <AlertCircle />
  },
  {
    id: '4',
    title: 'In Progress',
    time: 'Just now',
    description: 'Currently working on the final features.',
    variant: 'default'
  }
];

<Timeline items={timelineItems} isDark={isDark} />`
  },
  {
    name: 'EmptyState',
    description: {
      ko: '빈 상태 플레이스홀더',
      en: 'Empty state placeholder'
    },
    category: 'Data Display',
    importCode: `import { EmptyState } from 'jy-awesome-ui';
import { Inbox } from 'lucide-react';`,
    usageCode: `// Basic Empty State
<EmptyState
  variant="empty"
  title="No items found"
  description="There are no items to display at the moment."
  isDark={isDark}
/>

// Search Empty State
<EmptyState
  variant="search"
  title="No results"
  description="Try adjusting your search to find what you're looking for."
  isDark={isDark}
/>

// Error State
<EmptyState
  variant="error"
  title="Something went wrong"
  description="We couldn't load the data. Please try again."
  isDark={isDark}
/>

// With Actions
<EmptyState
  variant="empty"
  title="No projects yet"
  description="Get started by creating your first project."
  isDark={isDark}
  actions={[
    {
      label: 'Create Project',
      onClick: () => alert('Creating...'),
      primary: true
    },
    {
      label: 'Learn More',
      onClick: () => alert('Learning...')
    }
  ]}
/>

// Custom Icon
<EmptyState
  variant="custom"
  title="Inbox Zero"
  description="You're all caught up!"
  icon={<Inbox />}
  isDark={isDark}
/>`
  },
  {
    name: 'StatusIndicator',
    description: {
      ko: '상태 표시 점',
      en: 'Status indicator dot'
    },
    category: 'Data Display',
    importCode: `import { StatusIndicator, OnlineStatus } from 'jy-awesome-ui';`,
    usageCode: `// Basic Status Dots
<StatusIndicator variant="success" isDark={isDark} />
<StatusIndicator variant="warning" isDark={isDark} />
<StatusIndicator variant="error" isDark={isDark} />
<StatusIndicator variant="info" isDark={isDark} />
<StatusIndicator variant="offline" isDark={isDark} />

// With Labels
<StatusIndicator variant="success" label="Active" isDark={isDark} />
<StatusIndicator variant="warning" label="Pending" isDark={isDark} />
<StatusIndicator variant="error" label="Failed" isDark={isDark} />

// With Pulse Animation
<StatusIndicator variant="success" pulse isDark={isDark} />
<StatusIndicator variant="info" label="Live" pulse isDark={isDark} />

// As Badge
<StatusIndicator 
  variant="success" 
  label="Online" 
  showBadge 
  isDark={isDark} 
/>

// Sizes
<StatusIndicator variant="success" size="sm" isDark={isDark} />
<StatusIndicator variant="success" size="md" isDark={isDark} />
<StatusIndicator variant="success" size="lg" isDark={isDark} />

// Online Status
<OnlineStatus online isDark={isDark} />
<OnlineStatus online={false} isDark={isDark} />`
  },
  {
    name: 'DataTable',
    description: {
      ko: '정렬, 필터링, 검색 기능이 있는 고급 데이터 테이블',
      en: 'Advanced data table with sorting, filtering, and search'
    },
    category: 'Data Visualization',
    importCode: `import { DataTable } from 'jy-data-ui-kit';`,
    usageCode: `const columns = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'email', header: 'Email', sortable: true },
  { key: 'role', header: 'Role', sortable: true },
  { key: 'status', header: 'Status', sortable: true }
];

const data = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Editor', status: 'Active' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'Inactive' }
];

<DataTable
  title="User Management"
  columns={columns}
  data={data}
  pageSize={10}
  searchable
  searchPlaceholder="Search users..."
  isDark={isDark}
/>`
  },
  {
    name: 'StatCard',
    description: {
      ko: '통계 및 KPI를 표시하는 카드 컴포넌트',
      en: 'Card component for displaying statistics and KPIs'
    },
    category: 'Data Visualization',
    importCode: `import { StatCard, KPICard } from 'jy-data-ui-kit';`,
    usageCode: `import { Users, DollarSign, TrendingUp, Activity } from 'lucide-react';

// Basic Stat Card
<StatCard
  title="Total Users"
  value="12,543"
  change={{ value: '+12.5%', trend: 'up', label: 'vs last month' }}
  icon={<Users />}
  iconColor="blue"
  isDark={isDark}
/>

// Revenue Card
<StatCard
  title="Revenue"
  value="$45,231"
  change={{ value: '+8.2%', trend: 'up', label: 'vs last month' }}
  icon={<DollarSign />}
  iconColor="green"
  isDark={isDark}
/>

// Negative Trend
<StatCard
  title="Bounce Rate"
  value="42.3%"
  change={{ value: '-3.1%', trend: 'down', label: 'vs last month' }}
  icon={<Activity />}
  iconColor="red"
  isDark={isDark}
/>

// KPI Card with Metrics
<KPICard
  title="Sales Performance"
  subtitle="Q4 2024"
  value="$124,563"
  change={{ value: '+23.4%', trend: 'up', label: 'vs Q3 2024' }}
  metrics={[
    { label: 'Orders', value: '1,234' },
    { label: 'Avg. Order', value: '$101' },
    { label: 'Conversion', value: '3.2%' },
    { label: 'Customers', value: '892' }
  ]}
  isDark={isDark}
/>`
  },
  {
    name: 'DataChart',
    description: {
      ko: 'Line, Bar, Area, Pie 차트 컴포넌트',
      en: 'Line, Bar, Area, and Pie chart components'
    },
    category: 'Data Visualization',
    importCode: `import { DataLineChart, DataBarChart, DataAreaChart, DataPieChart } from 'jy-data-ui-kit';`,
    usageCode: `const lineData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 700 }
];

// Line Chart
<DataLineChart
  title="Monthly Revenue"
  subtitle="Last 6 months"
  data={lineData}
  dataKey="value"
  xAxisKey="name"
  color="blue"
  height={300}
  showGrid
  isDark={isDark}
/>

// Bar Chart
<DataBarChart
  title="Sales by Month"
  data={lineData}
  dataKey="value"
  xAxisKey="name"
  color="green"
  height={300}
  isDark={isDark}
/>

// Area Chart
<DataAreaChart
  title="User Growth"
  data={lineData}
  dataKey="value"
  xAxisKey="name"
  color="purple"
  height={300}
  isDark={isDark}
/>

const pieData = [
  { name: 'Desktop', value: 400 },
  { name: 'Mobile', value: 300 },
  { name: 'Tablet', value: 200 }
];

// Pie Chart
<DataPieChart
  title="Device Distribution"
  data={pieData}
  dataKey="value"
  nameKey="name"
  colors={['blue', 'green', 'orange']}
  height={300}
  isDark={isDark}
/>`
  },
  {
    name: 'DataList',
    description: {
      ko: '리스트 및 그리드 레이아웃 데이터 표시',
      en: 'List and grid layout data display'
    },
    category: 'Data Visualization',
    importCode: `import { DataList, GridList } from 'jy-data-ui-kit';`,
    usageCode: `import { Users, FileText, Image } from 'lucide-react';

const items = [
  {
    id: 1,
    title: 'John Doe',
    description: 'Software Engineer',
    icon: <Users />,
    meta: 'Active'
  },
  {
    id: 2,
    title: 'Jane Smith',
    description: 'Product Designer',
    icon: <Users />,
    meta: 'Active'
  }
];

// List View
<DataList
  title="Team Members"
  items={items}
  onItemClick={(item) => console.log(item)}
  showActions
  onActionClick={(item) => console.log('Action:', item)}
  isDark={isDark}
/>

// Grid View
<GridList
  items={items}
  columns={3}
  onItemClick={(item) => console.log(item)}
  isDark={isDark}
/>`
  },
  {
    name: 'TreeView',
    description: {
      ko: '계층 구조 데이터 트리 뷰',
      en: 'Hierarchical data tree view'
    },
    category: 'Data Visualization',
    importCode: `import { TreeView } from 'jy-data-ui-kit';`,
    usageCode: `import { Folder, File } from 'lucide-react';

const treeData = [
  {
    id: '1',
    label: 'src',
    icon: <Folder />,
    children: [
      {
        id: '1-1',
        label: 'components',
        children: [
          { id: '1-1-1', label: 'Button.tsx', icon: <File /> },
          { id: '1-1-2', label: 'Input.tsx', icon: <File /> }
        ]
      },
      { id: '1-2', label: 'utils', children: [] }
    ]
  },
  {
    id: '2',
    label: 'public',
    children: [
      { id: '2-1', label: 'index.html', icon: <File /> }
    ]
  }
];

<TreeView
  title="Project Structure"
  data={treeData}
  defaultExpandedIds={['1']}
  onSelect={(node) => console.log(node)}
  isDark={isDark}
/>`
  },
  {
    name: 'DateTimePicker',
    description: {
      ko: '날짜 및 시간 선택 컴포넌트',
      en: 'Date and time picker components'
    },
    category: 'Data Visualization',
    importCode: `import { DatePicker, TimePicker } from 'jy-data-ui-kit';`,
    usageCode: `const [date, setDate] = useState(new Date());
const [time, setTime] = useState(new Date());

// Date Picker
<DatePicker
  value={date}
  onChange={setDate}
  placeholder="Select date"
  isDark={isDark}
/>

// Time Picker
<TimePicker
  value={time}
  onChange={setTime}
  placeholder="Select time"
  isDark={isDark}
/>`
  },
  {
    name: 'SearchFilter',
    description: {
      ko: '검색 및 필터 컴포넌트',
      en: 'Search and filter components'
    },
    category: 'Data Visualization',
    importCode: `import { SearchBar, SearchFilter } from 'jy-data-ui-kit';`,
    usageCode: `const [search, setSearch] = useState('');
const [filters, setFilters] = useState({});

const filterGroups = [
  {
    id: 'status',
    label: 'Status',
    options: [
      { id: 'active', label: 'Active' },
      { id: 'inactive', label: 'Inactive' }
    ]
  },
  {
    id: 'role',
    label: 'Role',
    options: [
      { id: 'admin', label: 'Admin' },
      { id: 'user', label: 'User' }
    ]
  }
];

// Simple Search Bar
<SearchBar
  value={search}
  onChange={setSearch}
  placeholder="Search..."
  isDark={isDark}
/>

// Search with Filters
<SearchFilter
  searchValue={search}
  onSearchChange={setSearch}
  filterGroups={filterGroups}
  selectedFilters={filters}
  onFilterChange={(groupId, optionId) => {
    setFilters({ ...filters, [groupId]: optionId });
  }}
  onClearFilters={() => setFilters({})}
  isDark={isDark}
/>`
  },
  {
    name: 'MultiSelect',
    description: {
      ko: '다중 선택 및 태그 선택 컴포넌트',
      en: 'Multi-select and tag selector components'
    },
    category: 'Data Visualization',
    importCode: `import { MultiSelect, TagSelector } from 'jy-data-ui-kit';`,
    usageCode: `const options = [
  { id: '1', label: 'React' },
  { id: '2', label: 'TypeScript' },
  { id: '3', label: 'JavaScript' },
  { id: '4', label: 'Node.js' },
  { id: '5', label: 'Python' }
];

const [selected, setSelected] = useState([]);

// Multi-Select Dropdown
<MultiSelect
  options={options}
  value={selected}
  onChange={setSelected}
  placeholder="Select technologies..."
  searchable
  maxTags={3}
  isDark={isDark}
/>

// Tag Selector
<TagSelector
  options={options}
  value={selected}
  onChange={setSelected}
  multiSelect
  isDark={isDark}
/>`
  }
];

const playgroundScope = {
  // React
  React,
  useState,
  useEffect,
  // awesome-ui components
  ...AwesomeUI,
  // data-ui-kit components
  ...DataUI,
  // Icons
  ...LucideIcons,
};

const liveEditorBaseStyle: React.CSSProperties = {
  fontFamily: "'Monaco', 'Menlo', 'Courier New', monospace",
  fontSize: '13px',
  lineHeight: '1.7',
  padding: '16px',
  minHeight: '280px',
  outline: 'none',
  overflow: 'auto',
  background: 'transparent',
};

const LiveErrorStyled = styled.div<{ $isDark: boolean }>`
  padding: 12px 16px;
  background: ${props => props.$isDark ? 'rgba(255,59,48,0.1)' : 'rgba(255,59,48,0.06)'};
  color: #FF3B30;
  font-size: 12px;
  font-family: 'Monaco', 'Menlo', monospace;
  white-space: pre-wrap;
  border-top: 1px solid rgba(255,59,48,0.15);
  max-height: 80px;
  overflow: auto;
`;

function PlaygroundView({ component, isDark }: { component: ComponentInfo; isDark: boolean }) {
  const [copied, setCopied] = useState(false);
  const [securityError, setSecurityError] = useState<string | null>(null);

  const { code: initialCode, noInline } = buildLiveCode(component.usageCode);

  const scope = { ...playgroundScope, isDark };

  const handleCopy = () => {
    const editorEl = document.querySelector('.playground-active textarea, .playground-active [contenteditable]');
    const text = editorEl ? (editorEl as HTMLTextAreaElement).value || editorEl.textContent || '' : initialCode;
    navigator.clipboard.writeText(component.importCode + '\n\n' + text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <LiveProvider
      code={initialCode}
      scope={scope}
      noInline={noInline}
      theme={isDark ? prismThemes.vsDark : prismThemes.vsLight}
      transformCode={(code) => {
        const err = validatePlaygroundCode(code);
        if (err) {
          setSecurityError(err);
          return noInline ? 'render(null);' : '<></>';
        }
        setSecurityError(null);
        return code;
      }}
    >
      <PlaygroundContainer $isDark={isDark} className="playground-active">
        <PlaygroundCodeArea $isDark={isDark}>
          <PlaygroundCodeHeader $isDark={isDark}>
            <PlaygroundLabel $isDark={isDark}>React / TypeScript</PlaygroundLabel>
            <CopyButton $isDark={isDark} onClick={handleCopy}>
              {copied ? <><Check /> Copied</> : <><Copy /> Copy</>}
            </CopyButton>
          </PlaygroundCodeHeader>
          <div style={{ flex: 1, overflow: 'auto' }}>
            <LiveEditor
              style={liveEditorBaseStyle}
            />
          </div>
          {securityError && (
            <LiveErrorStyled $isDark={isDark}>
              🔒 {securityError}
            </LiveErrorStyled>
          )}
        </PlaygroundCodeArea>
        <PlaygroundPreview $isDark={isDark}>
          <div style={{ width: '100%' }}>
            <LivePreview />
            <LiveError style={{
              color: '#FF3B30',
              fontSize: '12px',
              fontFamily: "'Monaco', monospace",
              padding: '12px',
              whiteSpace: 'pre-wrap',
            }} />
          </div>
        </PlaygroundPreview>
      </PlaygroundContainer>
    </LiveProvider>
  );
}

export default function LibraryDocDemo({ isDark, language, projectId = 'awesome-ui-kit' }: LibraryDocDemoProps) {
  const [expandedCode, setExpandedCode] = useState<{ [key: string]: boolean }>({});
  const [activeTab, setActiveTab] = useState<{ [key: string]: 'preview' | 'code' | 'playground' }>({});

  const toggleCode = (componentName: string) => {
    setExpandedCode(prev => ({
      ...prev,
      [componentName]: !prev[componentName]
    }));
  };

  const setTab = (componentName: string, tab: 'preview' | 'code' | 'playground') => {
    setActiveTab(prev => ({
      ...prev,
      [componentName]: tab
    }));
  };

  const getActiveTab = (componentName: string) => {
    return activeTab[componentName] || 'preview';
  };

  // Filter components based on projectId
  const filteredComponents = projectId === 'data-ui-kit'
    ? components.filter(c => 
        c.category === 'Data Visualization' && 
        ['DataTable', 'DataList', 'TreeView', 'DataChart', 'DateTimePicker', 'SearchFilter', 'MultiSelect'].includes(c.name)
      )
    : components.filter(c => c.category !== 'Data Visualization');

  const groupedComponents = filteredComponents.reduce((acc, component) => {
    if (!acc[component.category]) {
      acc[component.category] = [];
    }
    acc[component.category].push(component);
    return acc;
  }, {} as { [key: string]: ComponentInfo[] });

  const translations = {
    ko: {
      installation: '설치',
      usage: '사용법',
      preview: '미리보기',
      code: '코드',
      import: 'Import',
      example: '예제',
      expand: '펼치기',
      collapse: '접기'
    },
    en: {
      installation: 'Installation',
      usage: 'Usage',
      preview: 'Preview',
      code: 'Code',
      import: 'Import',
      example: 'Example',
      expand: 'Expand',
      collapse: 'Collapse'
    }
  };

  const t = translations[language];

  const packageName = projectId === 'data-ui-kit' ? 'jy-data-ui-kit' : 'jy-awesome-ui';

  return (
    <DocContainer>
      <Section>
        <SectionTitle $isDark={isDark}>{t.installation}</SectionTitle>
        <InstallCommand $isDark={isDark}>
          <Package />
          npm install {packageName}
        </InstallCommand>
      </Section>

      <Section>
        <SectionTitle $isDark={isDark}>{t.usage}</SectionTitle>
        
        {Object.entries(groupedComponents).map(([category, categoryComponents]) => (
          <div key={category}>
            <CategoryTitle $isDark={isDark}>{category}</CategoryTitle>
            
            <ComponentGrid>
              {categoryComponents.map((component) => {
                const currentTab = getActiveTab(component.name);
                const isExpanded = expandedCode[component.name] || false;

                return (
                  <ComponentCard key={component.name} $isDark={isDark}>
                    <ComponentHeader>
                      <ComponentName $isDark={isDark}>{component.name}</ComponentName>
                      <ComponentDescription $isDark={isDark}>
                        {component.description[language]}
                      </ComponentDescription>
                    </ComponentHeader>

                    <TabButtons>
                      <TabButton
                        $isDark={isDark}
                        $active={currentTab === 'preview'}
                        onClick={() => setTab(component.name, 'preview')}
                      >
                        <Eye />
                        {t.preview}
                      </TabButton>
                      <TabButton
                        $isDark={isDark}
                        $active={currentTab === 'code'}
                        onClick={() => setTab(component.name, 'code')}
                      >
                        <Code />
                        {t.code}
                      </TabButton>
                      <TabButton
                        $isDark={isDark}
                        $active={currentTab === 'playground'}
                        onClick={() => setTab(component.name, 'playground')}
                      >
                        <Play />
                        Playground
                      </TabButton>
                    </TabButtons>

                    {currentTab === 'playground' ? (
                      <PlaygroundView
                        component={component}
                        isDark={isDark}
                      />
                    ) : currentTab === 'preview' ? (
                      <ComponentShowcase componentName={component.name} isDark={isDark} />
                    ) : (
                      <>
                        <CodeBlock $isDark={isDark}>
                          <CodeHeader $isDark={isDark}>
                            <CodeTitle $isDark={isDark}>
                              <Package />
                              {t.import}
                            </CodeTitle>
                          </CodeHeader>
                          <SyntaxHighlighter
                            language="typescript"
                            style={isDark ? vscDarkPlus : vs}
                            wrapLongLines={true}
                            customStyle={{
                              margin: 0,
                              borderRadius: 0,
                              background: 'transparent',
                              fontSize: '13px',
                              padding: '16px',
                              whiteSpace: 'pre-wrap',
                              wordBreak: 'break-word'
                            }}
                          >
                            {component.importCode}
                          </SyntaxHighlighter>
                        </CodeBlock>

                        <CodeBlock $isDark={isDark}>
                          <CodeHeader $isDark={isDark}>
                            <CodeTitle $isDark={isDark}>
                              <Code />
                              {t.example}
                            </CodeTitle>
                            <ToggleButton
                              $isDark={isDark}
                              onClick={() => toggleCode(component.name)}
                            >
                              {isExpanded ? (
                                <>
                                  <ChevronUp />
                                  {t.collapse}
                                </>
                              ) : (
                                <>
                                  <ChevronDown />
                                  {t.expand}
                                </>
                              )}
                            </ToggleButton>
                          </CodeHeader>
                          <CodeContent $expanded={isExpanded} $isDark={isDark}>
                            <SyntaxHighlighter
                              language="tsx"
                              style={isDark ? vscDarkPlus : vs}
                              wrapLongLines={true}
                              customStyle={{
                                margin: 0,
                                borderRadius: 0,
                                background: 'transparent',
                                fontSize: '13px',
                                padding: '16px',
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word'
                              }}
                            >
                              {component.usageCode}
                            </SyntaxHighlighter>
                          </CodeContent>
                        </CodeBlock>
                      </>
                    )}
                  </ComponentCard>
                );
              })}
            </ComponentGrid>
          </div>
        ))}
      </Section>
    </DocContainer>
  );
}
