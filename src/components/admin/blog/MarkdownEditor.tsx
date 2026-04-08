import { useRef, useCallback } from 'react';
import styled from 'styled-components';
import { Bold, Heading1, Heading2, Heading3, Code, List, Link, ImageIcon } from 'lucide-react';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const Toolbar = styled.div<{ $isDark: boolean }>`
  display: flex;
  gap: 2px;
  padding: 8px 12px;
  background: ${p => p.$isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'};
  border: 1px solid ${p => p.$isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'};
  border-bottom: none;
  border-radius: 8px 8px 0 0;
  flex-wrap: wrap;
`;

const ToolBtn = styled.button<{ $isDark: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: ${p => p.$isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)'};
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: ${p => p.$isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'};
    color: ${p => p.$isDark ? '#f5f5f7' : '#1d1d1f'};
  }

  svg { width: 16px; height: 16px; }
`;

const Divider = styled.div<{ $isDark: boolean }>`
  width: 1px;
  height: 20px;
  margin: 6px 4px;
  background: ${p => p.$isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'};
`;

const TextArea = styled.textarea<{ $isDark: boolean }>`
  padding: 16px;
  font-size: 14px;
  line-height: 1.8;
  font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
  background: ${p => p.$isDark ? 'rgba(255,255,255,0.05)' : '#f3f3f5'};
  border: 1px solid ${p => p.$isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'};
  border-top: none;
  border-radius: 0 0 8px 8px;
  color: ${p => p.$isDark ? '#f5f5f7' : '#1d1d1f'};
  resize: vertical;
  min-height: 400px;
  tab-size: 2;
  transition: border-color 0.15s ease;

  &:focus {
    outline: none;
    border-color: #0c8ce9;
  }

  &::placeholder { color: #86868b; }
`;

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  isDark: boolean;
  placeholder?: string;
}

export default function MarkdownEditor({ value, onChange, isDark, placeholder }: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertAt = useCallback((before: string, after: string = '', defaultText: string = '') => {
    const ta = textareaRef.current;
    if (!ta) return;

    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = value.substring(start, end) || defaultText;
    const newValue = value.substring(0, start) + before + selected + after + value.substring(end);
    onChange(newValue);

    requestAnimationFrame(() => {
      ta.focus();
      const cursorPos = start + before.length + selected.length;
      ta.setSelectionRange(cursorPos, cursorPos);
    });
  }, [value, onChange]);

  const insertLine = useCallback((prefix: string) => {
    const ta = textareaRef.current;
    if (!ta) return;

    const start = ta.selectionStart;
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    const lineEnd = value.indexOf('\n', start);
    const actualEnd = lineEnd === -1 ? value.length : lineEnd;
    const line = value.substring(lineStart, actualEnd);

    const newLine = prefix + line;
    const newValue = value.substring(0, lineStart) + newLine + value.substring(actualEnd);
    onChange(newValue);

    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(lineStart + newLine.length, lineStart + newLine.length);
    });
  }, [value, onChange]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      insertAt('  ');
    }
  };

  return (
    <Wrapper>
      <Toolbar $isDark={isDark}>
        <ToolBtn $isDark={isDark} onClick={() => insertLine('# ')} title="Heading 1">
          <Heading1 />
        </ToolBtn>
        <ToolBtn $isDark={isDark} onClick={() => insertLine('## ')} title="Heading 2">
          <Heading2 />
        </ToolBtn>
        <ToolBtn $isDark={isDark} onClick={() => insertLine('### ')} title="Heading 3">
          <Heading3 />
        </ToolBtn>
        <Divider $isDark={isDark} />
        <ToolBtn $isDark={isDark} onClick={() => insertAt('**', '**', '텍스트')} title="Bold">
          <Bold />
        </ToolBtn>
        <ToolBtn $isDark={isDark} onClick={() => insertAt('`', '`', 'code')} title="Inline Code">
          <Code />
        </ToolBtn>
        <Divider $isDark={isDark} />
        <ToolBtn $isDark={isDark} onClick={() => insertAt('```\n', '\n```', '// code here')} title="Code Block">
          <Code style={{ strokeWidth: 2.5 }} />
        </ToolBtn>
        <ToolBtn $isDark={isDark} onClick={() => insertLine('- ')} title="Bullet List">
          <List />
        </ToolBtn>
        <ToolBtn $isDark={isDark} onClick={() => insertAt('[', '](url)', '링크 텍스트')} title="Link">
          <Link />
        </ToolBtn>
        <ToolBtn $isDark={isDark} onClick={() => insertAt('![', '](image_url)', 'alt text')} title="Image">
          <ImageIcon />
        </ToolBtn>
      </Toolbar>
      <TextArea
        ref={textareaRef}
        $isDark={isDark}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder ?? '마크다운으로 작성하세요...'}
      />
    </Wrapper>
  );
}
