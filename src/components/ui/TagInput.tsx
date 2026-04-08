import { useState, type KeyboardEvent } from 'react';
import styled from 'styled-components';
import { X, Plus } from 'lucide-react';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label<{ $isDark: boolean }>`
  font-size: 13px;
  font-weight: 600;
  color: ${p => p.$isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.55)'};
`;

const InputRow = styled.div`
  display: flex;
  gap: 8px;
`;

const Input = styled.input<{ $isDark: boolean }>`
  flex: 1;
  height: 36px;
  padding: 0 12px;
  font-size: 14px;
  background: ${p => p.$isDark ? 'rgba(255,255,255,0.05)' : '#f3f3f5'};
  border: 1px solid ${p => p.$isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'};
  border-radius: 8px;
  color: ${p => p.$isDark ? '#f5f5f7' : '#1d1d1f'};
  font-family: inherit;
  transition: border-color 0.15s ease;

  &:focus {
    outline: none;
    border-color: #0c8ce9;
  }

  &::placeholder {
    color: #86868b;
  }
`;

const AddButton = styled.button<{ $isDark: boolean }>`
  height: 36px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  border: 1px solid ${p => p.$isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'};
  border-radius: 8px;
  background: ${p => p.$isDark ? 'rgba(255,255,255,0.05)' : '#ffffff'};
  color: ${p => p.$isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)'};
  cursor: pointer;
  font-size: 13px;
  font-family: inherit;
  transition: all 0.15s ease;
  white-space: nowrap;

  &:hover {
    border-color: #0c8ce9;
    color: #0c8ce9;
  }

  svg { width: 14px; height: 14px; }
`;

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const Tag = styled.span<{ $isDark: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: ${p => p.$isDark ? 'rgba(12,140,233,0.15)' : 'rgba(12,140,233,0.08)'};
  color: #0c8ce9;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;

  button {
    display: flex;
    align-items: center;
    background: none;
    border: none;
    color: inherit;
    cursor: pointer;
    padding: 0;
    opacity: 0.6;
    transition: opacity 0.15s;

    &:hover { opacity: 1; }
    svg { width: 14px; height: 14px; }
  }
`;

interface TagInputProps {
  label?: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  isDark: boolean;
}

export default function TagInput({ label, tags, onChange, placeholder = '태그 입력', isDark }: TagInputProps) {
  const [value, setValue] = useState('');

  const addTag = () => {
    const trimmed = value.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
      setValue('');
    }
  };

  const removeTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <Wrapper>
      {label && <Label $isDark={isDark}>{label}</Label>}
      <InputRow>
        <Input
          $isDark={isDark}
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
        />
        <AddButton $isDark={isDark} type="button" onClick={addTag}>
          <Plus /> 추가
        </AddButton>
      </InputRow>
      {tags.length > 0 && (
        <TagList>
          {tags.map((tag, i) => (
            <Tag key={`${tag}-${i}`} $isDark={isDark}>
              {tag}
              <button type="button" onClick={() => removeTag(i)}><X /></button>
            </Tag>
          ))}
        </TagList>
      )}
    </Wrapper>
  );
}
