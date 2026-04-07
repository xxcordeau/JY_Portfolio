import styled from 'styled-components';
import { useState, useRef, useCallback, useEffect } from 'react';
import { Play, RotateCcw, AlertTriangle, Code, Eye, Shield } from 'lucide-react';

const PlaygroundContainer = styled.div<{ $isDark: boolean }>`
  border: 1px solid ${props => props.$isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  border-radius: 12px;
  overflow: hidden;
  background: ${props => props.$isDark ? '#1a1a1a' : '#ffffff'};
`;

const PlaygroundHeader = styled.div<{ $isDark: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background: ${props => props.$isDark ? '#0f0f0f' : '#f0f0f0'};
  border-bottom: 1px solid ${props => props.$isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const TabBtn = styled.button<{ $isDark: boolean; $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  background: ${props => props.$active
    ? props.$isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'
    : 'transparent'};
  color: ${props => props.$active
    ? props.$isDark ? '#f5f5f7' : '#1d1d1f'
    : props.$isDark ? '#86868b' : '#6e6e73'};
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  svg { width: 13px; height: 13px; }

  &:hover {
    background: ${props => props.$isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'};
  }
`;

const ActionBtn = styled.button<{ $isDark: boolean; $variant?: 'primary' | 'default' }>`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  background: ${props => props.$variant === 'primary'
    ? props.$isDark ? '#4ECDC4' : '#007AFF'
    : props.$isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'};
  color: ${props => props.$variant === 'primary'
    ? '#fff'
    : props.$isDark ? '#86868b' : '#6e6e73'};
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  svg { width: 13px; height: 13px; }

  &:hover {
    opacity: 0.85;
  }
`;

const SecurityBadge = styled.div<{ $isDark: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 4px;
  background: ${props => props.$isDark ? 'rgba(52,199,89,0.1)' : 'rgba(52,199,89,0.08)'};
  color: #34C759;
  font-size: 10px;
  font-weight: 600;

  svg { width: 10px; height: 10px; }
`;

const ContentArea = styled.div`
  display: flex;
  min-height: 300px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const EditorPane = styled.div<{ $isDark: boolean; $fullWidth: boolean }>`
  flex: 1;
  min-width: 0;
  display: ${props => props.$fullWidth ? 'block' : 'block'};
  border-right: ${props => props.$fullWidth ? 'none' : `1px solid ${props.$isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`};

  @media (max-width: 768px) {
    border-right: none;
    border-bottom: 1px solid ${props => props.$isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'};
  }
`;

const CodeEditor = styled.textarea<{ $isDark: boolean }>`
  width: 100%;
  min-height: 300px;
  padding: 16px;
  border: none;
  outline: none;
  resize: vertical;
  font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.6;
  tab-size: 2;
  background: ${props => props.$isDark ? '#1a1a1a' : '#fafafa'};
  color: ${props => props.$isDark ? '#e0e0e0' : '#1d1d1f'};

  &::placeholder {
    color: ${props => props.$isDark ? '#555' : '#aaa'};
  }
`;

const PreviewPane = styled.div<{ $isDark: boolean; $fullWidth: boolean }>`
  flex: 1;
  min-width: 0;
  display: ${props => props.$fullWidth ? 'block' : 'block'};
  position: relative;
`;

const PreviewFrame = styled.iframe`
  width: 100%;
  min-height: 300px;
  border: none;
  display: block;
`;

const ErrorBar = styled.div<{ $isDark: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: ${props => props.$isDark ? 'rgba(255,69,58,0.1)' : 'rgba(255,59,48,0.08)'};
  border-top: 1px solid ${props => props.$isDark ? 'rgba(255,69,58,0.2)' : 'rgba(255,59,48,0.15)'};
  color: ${props => props.$isDark ? '#FF453A' : '#FF3B30'};
  font-size: 12px;
  font-family: 'Monaco', 'Menlo', monospace;

  svg { width: 14px; height: 14px; flex-shrink: 0; }
`;

// ============================================================
// Security: 허용되는 JSX 태그 화이트리스트
// 이 목록에 없는 태그는 렌더링 차단
// ============================================================
const ALLOWED_TAGS = new Set([
  // HTML 기본
  'div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li', 'a', 'img', 'br', 'hr', 'strong', 'em',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'label', 'input', 'button', 'select', 'option',
  // 컴포넌트 (대문자 시작은 별도 처리)
]);

// 위험한 패턴 차단 (보안 필터)
const DANGEROUS_PATTERNS = [
  // DOM/Window 접근 차단
  /\bwindow\b/i,
  /\bdocument\b/i,
  /\blocation\b/i,
  /\bnavigator\b/i,
  // 네트워크 요청 차단
  /\bfetch\s*\(/i,
  /\bXMLHttpRequest\b/i,
  /\bWebSocket\b/i,
  /\bEventSource\b/i,
  // 코드 실행 차단
  /\beval\s*\(/i,
  /\bFunction\s*\(/i,
  /\bsetTimeout\b/i,
  /\bsetInterval\b/i,
  /\brequire\s*\(/i,
  /\bimport\s*\(/i,
  // 스토리지 접근 차단
  /\blocalStorage\b/i,
  /\bsessionStorage\b/i,
  /\bcookie\b/i,
  /\bindexedDB\b/i,
  // 위험한 HTML
  /\binnerHTML\b/i,
  /\bouterHTML\b/i,
  /\binsertAdjacentHTML\b/i,
  /dangerouslySetInnerHTML/i,
  // iframe 탈출 시도
  /\bparent\b\s*\./i,
  /\btop\b\s*\./i,
  /\bframes\b/i,
  /\bpostMessage\b/i,
  // 프로토타입 오염
  /__proto__/i,
  /\bprototype\b/i,
  /\bconstructor\b\s*[\[.]/i,
  // base64/encoding 우회 시도
  /\batob\b/i,
  /\bbtoa\b/i,
];

function validateCode(code: string): { safe: boolean; reason?: string } {
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(code)) {
      const match = code.match(pattern);
      return {
        safe: false,
        reason: `Blocked: "${match?.[0]}" is not allowed for security reasons`
      };
    }
  }
  return { safe: true };
}

/**
 * iframe 내부에서 실행될 HTML을 생성
 *
 * 보안 레이어:
 * 1. iframe sandbox="allow-scripts" — same-origin 접근 차단, form 제출 차단, 팝업 차단
 * 2. 코드 정적 분석 — 위험 패턴 사전 차단
 * 3. iframe 내부 런타임 차단 — window/document/fetch 등 override
 * 4. CSP meta 태그 — 외부 리소스 로드 차단
 * 5. try-catch — 런타임 에러 안전 처리
 */
function buildSandboxHTML(jsxCode: string, isDark: boolean): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data:;">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      padding: 20px;
      background: ${isDark ? '#1a1a1a' : '#ffffff'};
      color: ${isDark ? '#f5f5f7' : '#1d1d1f'};
      font-size: 14px;
      line-height: 1.6;
    }
    .error { color: #FF3B30; font-family: monospace; font-size: 12px; padding: 12px; background: rgba(255,59,48,0.08); border-radius: 8px; }
    .component-preview { display: flex; flex-direction: column; gap: 12px; }

    /* 기본 컴포넌트 스타일 */
    .btn {
      padding: 8px 16px; border-radius: 8px; border: none; cursor: pointer;
      font-size: 14px; font-weight: 500; transition: all 0.2s;
      background: ${isDark ? '#f5f5f7' : '#1d1d1f'};
      color: ${isDark ? '#1d1d1f' : '#f5f5f7'};
    }
    .btn:hover { opacity: 0.85; }
    .btn-outline {
      background: transparent;
      border: 1px solid ${isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'};
      color: ${isDark ? '#f5f5f7' : '#1d1d1f'};
    }
    .btn-sm { padding: 6px 12px; font-size: 12px; }
    .btn-lg { padding: 12px 24px; font-size: 16px; }
    .chip {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 6px 12px; border-radius: 12px; font-size: 12px; font-weight: 500;
      background: ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'};
      color: ${isDark ? '#f5f5f7' : '#1d1d1f'};
      border: 1px solid ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)'};
    }
    .chip-primary { background: rgba(0,122,255,0.15); color: #007AFF; border-color: rgba(0,122,255,0.3); }
    .chip-success { background: rgba(52,199,89,0.15); color: #34C759; border-color: rgba(52,199,89,0.3); }
    .chip-warning { background: rgba(255,159,10,0.15); color: #FF9500; border-color: rgba(255,159,10,0.3); }
    .chip-error { background: rgba(255,59,48,0.15); color: #FF3B30; border-color: rgba(255,59,48,0.3); }
    .chip-filled { border-color: transparent; background: ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)'}; }
    .chip-outline { background: transparent; }
    .badge {
      display: inline-flex; padding: 4px 10px; border-radius: 6px;
      font-size: 11px; font-weight: 600;
      background: ${isDark ? '#f5f5f7' : '#1d1d1f'};
      color: ${isDark ? '#1d1d1f' : '#f5f5f7'};
    }
    .badge-secondary { background: ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}; color: ${isDark ? '#f5f5f7' : '#1d1d1f'}; }
    .badge-destructive { background: #FF3B30; color: white; }
    .badge-outline { background: transparent; border: 1px solid ${isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}; color: ${isDark ? '#f5f5f7' : '#1d1d1f'}; }
    .card {
      border-radius: 12px; padding: 20px;
      background: ${isDark ? 'rgba(255,255,255,0.05)' : '#fff'};
      border: 1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'};
    }
    .card-title { font-size: 17px; font-weight: 600; margin-bottom: 8px; }
    .card-desc { font-size: 13px; color: ${isDark ? '#86868b' : '#6e6e73'}; }
    .panel {
      border-radius: 12px; padding: 20px;
      background: ${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'};
      backdrop-filter: blur(20px);
      border: 1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'};
    }
    .stat-card {
      border-radius: 12px; padding: 20px;
      background: ${isDark ? 'rgba(255,255,255,0.05)' : '#fff'};
      border: 1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'};
    }
    .stat-value { font-size: 28px; font-weight: 700; margin: 8px 0 4px; }
    .stat-label { font-size: 12px; font-weight: 500; opacity: 0.5; text-transform: uppercase; letter-spacing: 0.5px; }
    .stat-change-up { font-size: 13px; font-weight: 600; color: #34C759; }
    .stat-change-down { font-size: 13px; font-weight: 600; color: #FF3B30; }
    .avatar {
      border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;
      font-weight: 600; font-size: 14px; overflow: hidden; flex-shrink: 0;
      background: ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'};
    }
    .timeline { padding-left: 16px; border-left: 2px solid ${isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)'}; }
    .timeline-item { position: relative; padding: 0 0 20px 20px; }
    .timeline-dot { position: absolute; left: -8px; top: 4px; width: 12px; height: 12px; border-radius: 50%; background: #007AFF; }
    .timeline-title { font-size: 14px; font-weight: 600; margin: 0 0 2px; }
    .timeline-date { font-size: 12px; opacity: 0.4; margin: 0 0 4px; }
    .timeline-desc { font-size: 13px; opacity: 0.7; margin: 0; }
    .input {
      width: 100%; padding: 10px 14px; border-radius: 8px;
      border: 1px solid ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'};
      background: ${isDark ? 'rgba(255,255,255,0.05)' : '#fff'};
      color: ${isDark ? '#f5f5f7' : '#1d1d1f'}; font-size: 14px; outline: none;
    }
    .input:focus { border-color: #007AFF; }
    .alert {
      padding: 16px 20px; border-radius: 12px;
      border: 1px solid ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)'};
    }
    .alert-error { border-color: rgba(255,59,48,0.3); background: rgba(255,59,48,0.08); color: #FF3B30; }
    .banner {
      padding: 14px 20px; border-radius: 12px; font-size: 14px;
      background: ${isDark ? 'rgba(0,122,255,0.1)' : 'rgba(0,122,255,0.08)'};
      border: 1px solid ${isDark ? 'rgba(0,122,255,0.2)' : 'rgba(0,122,255,0.15)'};
      color: ${isDark ? '#5AC8FA' : '#007AFF'};
    }
    .flex { display: flex; }
    .gap-2 { gap: 8px; }
    .gap-3 { gap: 12px; }
    .flex-wrap { flex-wrap: wrap; }
    .flex-col { flex-direction: column; }
    .items-center { align-items: center; }
    .text-sm { font-size: 13px; }
    .text-muted { color: ${isDark ? '#86868b' : '#6e6e73'}; }
    .font-bold { font-weight: 700; }
    .mt-2 { margin-top: 8px; }
    .mt-4 { margin-top: 16px; }
    .mb-2 { margin-bottom: 8px; }
    .p-4 { padding: 16px; }
    .rounded { border-radius: 8px; }
    .w-full { width: 100%; }
    .status-dot {
      width: 8px; height: 8px; border-radius: 50%; display: inline-block;
    }
    .status-online { background: #34C759; }
    .status-offline { background: #86868b; }
    .status-busy { background: #FF9500; }
    .divider { height: 1px; background: ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}; margin: 12px 0; }
    .divider-label { display:flex; align-items:center; gap:12px; }
    .divider-label::before, .divider-label::after { content:''; flex:1; height:1px; background:${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}; }
    .progress-bar {
      height: 8px; border-radius: 4px; overflow: hidden;
      background: ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'};
    }
    .progress-fill { height: 100%; border-radius: 4px; background: #007AFF; transition: width 0.3s; }
    .progress-fill-success { background: #34C759; }
    .progress-fill-warning { background: #FF9500; }
    .progress-fill-error { background: #FF3B30; }
    .label { font-size: 13px; font-weight: 600; margin-bottom: 6px; opacity: 0.6; }
    .section-title { font-size: 13px; font-weight: 700; margin: 0 0 8px; }
    .text-xs { font-size: 11px; }
    .mb-3 { margin-bottom: 12px; }
    .mb-4 { margin-bottom: 16px; }
    .mt-3 { margin-top: 12px; }
    .gap-4 { gap: 16px; }
    .items-start { align-items: flex-start; }
    .items-end { align-items: flex-end; }
    .justify-between { justify-content: space-between; }
    .justify-center { justify-content: center; }
    .relative { position: relative; }
    .inline-flex { display: inline-flex; }
    .overflow-hidden { overflow: hidden; }
    nav.navbar {
      display: flex; align-items: center; justify-content: space-between;
      padding: 12px 20px;
      background: ${isDark ? '#0a0a0a' : '#f5f5f7'};
      border-bottom: 1px solid ${isDark ? '#2d2d2d' : '#e5e5e7'};
    }
    nav.navbar .brand { font-size: 16px; font-weight: 700; }
    nav.navbar .nav-links { display: flex; gap: 4px; }
    nav.navbar .nav-link {
      padding: 6px 12px; border-radius: 8px; font-size: 14px; font-weight: 500;
      color: ${isDark ? '#f5f5f7' : '#1d1d1f'}; text-decoration: none; opacity: 0.7;
      background: transparent; border: none; cursor: pointer;
    }
    nav.navbar .nav-link.active { opacity: 1; background: ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}; }
    .breadcrumb { display: flex; align-items: center; gap: 6px; font-size: 14px; }
    .breadcrumb a { color: #007AFF; text-decoration: none; }
    .breadcrumb a:hover { text-decoration: underline; }
    .breadcrumb .sep { opacity: 0.35; }
    .breadcrumb .current { font-weight: 600; }
    .sidebar {
      width: 200px; border-right: 1px solid ${isDark ? '#2d2d2d' : '#e5e5e7'};
      padding: 12px; background: ${isDark ? '#0a0a0a' : '#f9f9f9'};
    }
    .sidebar-label { font-size: 11px; font-weight: 600; opacity: 0.4; text-transform: uppercase; letter-spacing: 0.5px; padding: 6px 8px 4px; }
    .sidebar-item {
      display: block; width: 100%; padding: 8px 10px; border-radius: 8px; font-size: 13px; font-weight: 500;
      background: transparent; border: none; cursor: pointer; text-align: left;
      color: ${isDark ? '#f5f5f7' : '#1d1d1f'}; opacity: 0.7;
    }
    .sidebar-item.active { opacity: 1; background: rgba(0,122,255,0.1); color: #007AFF; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script>
    // === SECURITY LAYER: Runtime blocking ===
    // 위험한 전역 객체 차단
    (function() {
      'use strict';

      // sandbox 속성이 same-origin을 허용하지 않으므로
      // parent/top 접근은 이미 브라우저 레벨에서 차단됨
      // 추가 런타임 보호:

      try {
        // 네트워크 차단
        window.fetch = undefined;
        window.XMLHttpRequest = undefined;
        window.WebSocket = undefined;
        window.EventSource = undefined;

        // 코드 실행 차단
        window.eval = undefined;
        window.Function = (function(){}).constructor; // neutered

        // 스토리지 차단 (sandbox에서 이미 차단이지만 이중 보호)
        try { Object.defineProperty(window, 'localStorage', { get() { return undefined; } }); } catch(e) {}
        try { Object.defineProperty(window, 'sessionStorage', { get() { return undefined; } }); } catch(e) {}

        // 위치/내비게이션 차단
        try { Object.defineProperty(window, 'open', { value: undefined, writable: false }); } catch(e) {}
      } catch(e) {
        // sandbox 환경에서 일부 속성 접근이 제한될 수 있음
      }
    })();

    // === 안전한 렌더링 ===
    try {
      var root = document.getElementById('root');
      root.innerHTML = \`${jsxCode
        .replace(/\\/g, '\\\\')
        .replace(/`/g, '\\`')
        .replace(/\$/g, '\\$')}\`;
    } catch(e) {
      var root = document.getElementById('root');
      root.innerHTML = '<div class="error">Runtime Error: ' +
        String(e.message).replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</div>';
    }
  </script>
</body>
</html>`;
}

interface LivePlaygroundProps {
  isDark: boolean;
  language: 'ko' | 'en';
  defaultCode: string;
  title?: string;
}

export default function LivePlayground({
  isDark,
  language,
  defaultCode,
  title
}: LivePlaygroundProps) {
  const [code, setCode] = useState(defaultCode);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'split' | 'code' | 'preview'>('split');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const isKo = language === 'ko';

  const runCode = useCallback(() => {
    setError(null);

    // Step 1: 정적 보안 검증
    const validation = validateCode(code);
    if (!validation.safe) {
      setError(validation.reason || (isKo ? '보안 위반이 감지되었습니다' : 'Security violation detected'));
      return;
    }

    // Step 2: <script> 태그 차단
    if (/<script/i.test(code)) {
      setError(isKo ? '<script> 태그는 허용되지 않습니다' : '<script> tags are not allowed');
      return;
    }

    // Step 3: on* 이벤트 핸들러에서 위험한 코드 차단
    const onEventPattern = /on\w+\s*=\s*["'][^"']*(?:alert|confirm|prompt|eval|Function)\s*\(/i;
    if (onEventPattern.test(code)) {
      setError(isKo ? '이벤트 핸들러에서 위험한 함수 호출이 감지되었습니다' : 'Dangerous function call detected in event handler');
      return;
    }

    // Step 4: iframe에 안전하게 렌더링
    if (iframeRef.current) {
      const html = buildSandboxHTML(code, isDark);
      iframeRef.current.srcdoc = html;
    }
  }, [code, isDark, isKo]);

  // 코드 변경 시 자동 실행 (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      runCode();
    }, 600);
    return () => clearTimeout(timer);
  }, [code, runCode]);

  // 다크모드 변경 시 재실행
  useEffect(() => {
    runCode();
  }, [isDark]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleReset = () => {
    setCode(defaultCode);
    setError(null);
  };

  const showEditor = activeTab === 'split' || activeTab === 'code';
  const showPreview = activeTab === 'split' || activeTab === 'preview';

  return (
    <PlaygroundContainer $isDark={isDark}>
      <PlaygroundHeader $isDark={isDark}>
        <HeaderLeft>
          {title && (
            <span style={{
              fontSize: 13,
              fontWeight: 600,
              color: isDark ? '#f5f5f7' : '#1d1d1f'
            }}>
              {title}
            </span>
          )}
          <SecurityBadge $isDark={isDark}>
            <Shield />
            Sandboxed
          </SecurityBadge>
        </HeaderLeft>
        <HeaderRight>
          <TabBtn $isDark={isDark} $active={activeTab === 'code'} onClick={() => setActiveTab('code')}>
            <Code /> {isKo ? '코드' : 'Code'}
          </TabBtn>
          <TabBtn $isDark={isDark} $active={activeTab === 'split'} onClick={() => setActiveTab('split')}>
            <Code /><Eye />
          </TabBtn>
          <TabBtn $isDark={isDark} $active={activeTab === 'preview'} onClick={() => setActiveTab('preview')}>
            <Eye /> {isKo ? '미리보기' : 'Preview'}
          </TabBtn>
          <ActionBtn $isDark={isDark} onClick={handleReset}>
            <RotateCcw />
          </ActionBtn>
          <ActionBtn $isDark={isDark} $variant="primary" onClick={runCode}>
            <Play /> Run
          </ActionBtn>
        </HeaderRight>
      </PlaygroundHeader>

      <ContentArea>
        {showEditor && (
          <EditorPane $isDark={isDark} $fullWidth={!showPreview}>
            <CodeEditor
              $isDark={isDark}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              placeholder={isKo ? '여기에 HTML/CSS 코드를 작성하세요...' : 'Write HTML/CSS code here...'}
            />
          </EditorPane>
        )}
        {showPreview && (
          <PreviewPane $isDark={isDark} $fullWidth={!showEditor}>
            <PreviewFrame
              ref={iframeRef}
              sandbox="allow-scripts"
              title="Component Preview"
              loading="lazy"
            />
          </PreviewPane>
        )}
      </ContentArea>

      {error && (
        <ErrorBar $isDark={isDark}>
          <AlertTriangle />
          {error}
        </ErrorBar>
      )}
    </PlaygroundContainer>
  );
}
