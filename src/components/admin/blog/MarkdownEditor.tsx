import { useRef, useCallback, useState } from 'react';
import styled from 'styled-components';
import { Bold, Heading1, Heading2, Heading3, Code, List, Link, ImageIcon, Loader2 } from 'lucide-react';
import { uploadFile } from '../../../lib/uploadFile';

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
  align-items: center;
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

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  svg { width: 16px; height: 16px; }
`;

const UploadHint = styled.span<{ $isDark: boolean }>`
  font-size: 11px;
  color: ${p => p.$isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.3)'};
  margin-left: 4px;
`;

const Divider = styled.div<{ $isDark: boolean }>`
  width: 1px;
  height: 20px;
  margin: 6px 4px;
  background: ${p => p.$isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'};
`;

const TextArea = styled.textarea<{ $isDark: boolean; $isDragging: boolean }>`
  padding: 16px;
  font-size: 14px;
  line-height: 1.8;
  font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
  background: ${p => p.$isDark ? 'rgba(255,255,255,0.05)' : '#f3f3f5'};
  border: 1px solid ${p =>
    p.$isDragging
      ? '#0c8ce9'
      : p.$isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'};
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
  /** 이미지를 저장할 Supabase Storage 버킷 이름 */
  imageBucket?: string;
}

export default function MarkdownEditor({
  value,
  onChange,
  isDark,
  placeholder,
  imageBucket = 'blog-thumbnails',
}: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  // 항상 최신 value를 참조하기 위한 ref
  const valueRef = useRef(value);
  valueRef.current = value;

  // 커서 위치에 텍스트 삽입
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

  // 이미지 파일 업로드 → 마크다운 삽입
  const uploadAndInsert = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) return;

    setUploading(true);
    const ta = textareaRef.current;
    const cursorPos = ta?.selectionStart ?? valueRef.current.length;

    // 업로드 중 플레이스홀더 삽입
    const uploadingPlaceholder = `![업로드 중...](uploading)`;
    const cur = valueRef.current;
    const withPlaceholder = cur.substring(0, cursorPos) + '\n' + uploadingPlaceholder + '\n' + cur.substring(cursorPos);
    onChange(withPlaceholder);

    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const path = `content/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const url = await uploadFile(imageBucket, path, file);

      // 플레이스홀더를 실제 URL로 교체 (최신 valueRef 사용)
      onChange(valueRef.current.replace(uploadingPlaceholder, `![이미지](${url})`));
    } catch (e) {
      // 실패 시 플레이스홀더 제거
      onChange(valueRef.current.replace('\n' + uploadingPlaceholder + '\n', '\n'));
      alert('이미지 업로드 실패: ' + (e instanceof Error ? e.message : String(e)));
    } finally {
      setUploading(false);
    }
  }, [onChange, imageBucket]);

  // 파일 인풋 클릭
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadAndInsert(file);
    e.target.value = '';
  };

  // 붙여넣기로 이미지 삽입
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = Array.from(e.clipboardData.items);
    const imageItem = items.find(item => item.type.startsWith('image/'));
    if (imageItem) {
      e.preventDefault();
      const file = imageItem.getAsFile();
      if (file) uploadAndInsert(file);
    }
  };

  // 드래그앤드롭
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith('image/')) uploadAndInsert(file);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      insertAt('  ');
    }
  };

  return (
    <Wrapper>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

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
        <Divider $isDark={isDark} />
        <ToolBtn
          $isDark={isDark}
          onClick={handleImageClick}
          disabled={uploading}
          title="이미지 업로드 (클릭 / 드래그앤드롭 / Ctrl+V)"
        >
          {uploading ? <Loader2 style={{ animation: 'spin 1s linear infinite' }} /> : <ImageIcon />}
        </ToolBtn>
        <UploadHint $isDark={isDark}>클릭·드래그·붙여넣기</UploadHint>
      </Toolbar>

      <TextArea
        ref={textareaRef}
        $isDark={isDark}
        $isDragging={isDragging}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        placeholder={placeholder ?? '마크다운으로 작성하세요...\n\n이미지: 툴바 버튼 클릭, 드래그앤드롭, 또는 Ctrl+V로 붙여넣기'}
      />

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </Wrapper>
  );
}
