import styled from 'styled-components';
import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronDown, Check } from 'lucide-react';

const SelectContainer = styled.div`
  position: relative;
  width: 100%;
`;

const SelectTrigger = styled.button<{ $isDark?: boolean; $focused?: boolean; $hasValue?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 12px;
  border: 1px solid ${props => {
    if (props.$focused) return '#007AFF';
    return props.$isDark 
      ? 'rgba(255, 255, 255, 0.2)' 
      : 'rgba(0, 0, 0, 0.2)';
  }};
  background: ${props => props.$isDark 
    ? 'rgba(255, 255, 255, 0.05)' 
    : 'rgba(255, 255, 255, 1)'};
  color: ${props => props.$hasValue 
    ? props.$isDark ? '#f5f5f7' : '#1d1d1f'
    : props.$isDark ? '#86868b' : '#6e6e73'};
  font-size: 14px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.$isDark 
      ? 'rgba(255, 255, 255, 0.08)' 
      : 'rgba(0, 0, 0, 0.02)'};
  }

  svg {
    width: 16px;
    height: 16px;
    opacity: 0.6;
    flex-shrink: 0;
  }
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  flex: 1;
  min-width: 0;
`;

const Tag = styled.div<{ $isDark?: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 6px;
  background: ${props => props.$isDark 
    ? 'rgba(0, 122, 255, 0.2)' 
    : 'rgba(0, 122, 255, 0.12)'};
  color: ${props => props.$isDark ? '#5AC8FA' : '#007AFF'};
  font-size: 13px;
  font-weight: 500;

  span[role="button"] {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: none;
    background: transparent;
    color: inherit;
    cursor: pointer;
    transition: opacity 0.2s;

    &:hover {
      opacity: 0.7;
    }

    svg {
      width: 12px;
      height: 12px;
    }
  }
`;

const Dropdown = styled.div<{ $isDark?: boolean; $show?: boolean }>`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  z-index: 9999;
  max-height: 300px;
  overflow-y: auto;
  padding: 8px;
  border-radius: 12px;
  background: ${props => props.$isDark 
    ? 'rgba(30, 30, 30, 0.98)' 
    : 'rgba(255, 255, 255, 0.98)'};
  border: 1px solid ${props => props.$isDark 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.1)'};
  backdrop-filter: blur(20px);
  box-shadow: ${props => props.$isDark 
    ? '0 8px 32px rgba(0, 0, 0, 0.5)' 
    : '0 8px 32px rgba(0, 0, 0, 0.15)'};
  opacity: ${props => props.$show ? 1 : 0};
  visibility: ${props => props.$show ? 'visible' : 'hidden'};
  transform: translateY(${props => props.$show ? 0 : -10}px);
  transition: all 0.2s;
`;

const Option = styled.button<{ $isDark?: boolean; $selected?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 8px;
  border: none;
  background: ${props => {
    if (props.$selected) return props.$isDark 
      ? 'rgba(0, 122, 255, 0.15)' 
      : 'rgba(0, 122, 255, 0.08)';
    return 'transparent';
  }};
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  font-size: 14px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => {
      if (props.$selected) return props.$isDark 
        ? 'rgba(0, 122, 255, 0.2)' 
        : 'rgba(0, 122, 255, 0.12)';
      return props.$isDark 
        ? 'rgba(255, 255, 255, 0.05)' 
        : 'rgba(0, 0, 0, 0.03)';
    }};
  }

  svg {
    width: 16px;
    height: 16px;
    color: #007AFF;
    flex-shrink: 0;
  }
`;

const SearchInput = styled.input<{ $isDark?: boolean }>`
  width: 100%;
  padding: 10px 12px;
  margin-bottom: 8px;
  border-radius: 8px;
  border: 1px solid ${props => props.$isDark 
    ? 'rgba(255, 255, 255, 0.2)' 
    : 'rgba(0, 0, 0, 0.2)'};
  background: ${props => props.$isDark 
    ? 'rgba(255, 255, 255, 0.05)' 
    : 'rgba(255, 255, 255, 1)'};
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  font-size: 14px;
  outline: none;

  &::placeholder {
    color: ${props => props.$isDark ? '#86868b' : '#6e6e73'};
  }

  &:focus {
    border-color: #007AFF;
  }
`;

const EmptyState = styled.div<{ $isDark?: boolean }>`
  padding: 20px;
  text-align: center;
  font-size: 13px;
  color: ${props => props.$isDark ? '#86868b' : '#6e6e73'};
`;

export interface MultiSelectOption {
  id: string;
  label: string;
}

export interface MultiSelectProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  maxTags?: number;
  isDark?: boolean;
  className?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select items...',
  searchable = true,
  searchPlaceholder = 'Search...',
  maxTags,
  isDark = false,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = searchable
    ? options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const selectedOptions = options.filter(opt => value.includes(opt.id));

  const handleToggle = (optionId: string) => {
    if (value.includes(optionId)) {
      onChange(value.filter(id => id !== optionId));
    } else {
      onChange([...value, optionId]);
    }
  };

  const handleRemove = (optionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter(id => id !== optionId));
  };

  const displayTags = maxTags && selectedOptions.length > maxTags
    ? selectedOptions.slice(0, maxTags)
    : selectedOptions;

  const remainingCount = maxTags && selectedOptions.length > maxTags
    ? selectedOptions.length - maxTags
    : 0;

  return (
    <SelectContainer ref={containerRef} className={className}>
      <SelectTrigger
        $isDark={isDark}
        $focused={isOpen}
        $hasValue={value.length > 0}
        onClick={() => setIsOpen(!isOpen)}
      >
        {value.length > 0 ? (
          <TagContainer>
            {displayTags.map(option => (
              <Tag key={option.id} $isDark={isDark}>
                {option.label}
                <span role="button" tabIndex={0} onClick={(e) => handleRemove(option.id, e)} onKeyDown={(e) => { if (e.key === 'Enter') handleRemove(option.id, e as any); }}>
                  <X />
                </span>
              </Tag>
            ))}
            {remainingCount > 0 && (
              <Tag $isDark={isDark}>+{remainingCount}</Tag>
            )}
          </TagContainer>
        ) : (
          <span>{placeholder}</span>
        )}
        <ChevronDown />
      </SelectTrigger>

      <Dropdown $isDark={isDark} $show={isOpen}>
        {searchable && (
          <SearchInput
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={searchPlaceholder}
            $isDark={isDark}
            onClick={(e) => e.stopPropagation()}
          />
        )}
        {filteredOptions.length > 0 ? (
          filteredOptions.map(option => (
            <Option
              key={option.id}
              $isDark={isDark}
              $selected={value.includes(option.id)}
              onClick={() => handleToggle(option.id)}
            >
              {option.label}
              {value.includes(option.id) && <Check />}
            </Option>
          ))
        ) : (
          <EmptyState $isDark={isDark}>
            No options found
          </EmptyState>
        )}
      </Dropdown>
    </SelectContainer>
  );
};

// Tag Selector - Alternative simpler version
const TagSelectorContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const TagOption = styled.button<{ $isDark?: boolean; $selected?: boolean }>`
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid ${props => {
    if (props.$selected) return '#007AFF';
    return props.$isDark 
      ? 'rgba(255, 255, 255, 0.2)' 
      : 'rgba(0, 0, 0, 0.2)';
  }};
  background: ${props => {
    if (props.$selected) return '#007AFF';
    return 'transparent';
  }};
  color: ${props => {
    if (props.$selected) return '#ffffff';
    return props.$isDark ? '#f5f5f7' : '#1d1d1f';
  }};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => {
      if (props.$selected) return '#0051D5';
      return props.$isDark 
        ? 'rgba(255, 255, 255, 0.05)' 
        : 'rgba(0, 0, 0, 0.03)';
    }};
  }
`;

export interface TagSelectorProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  multiSelect?: boolean;
  isDark?: boolean;
  className?: string;
}

export const TagSelector: React.FC<TagSelectorProps> = ({
  options,
  value,
  onChange,
  multiSelect = true,
  isDark = false,
  className
}) => {
  const handleToggle = (optionId: string) => {
    if (multiSelect) {
      if (value.includes(optionId)) {
        onChange(value.filter(id => id !== optionId));
      } else {
        onChange([...value, optionId]);
      }
    } else {
      onChange([optionId]);
    }
  };

  return (
    <TagSelectorContainer className={className}>
      {options.map(option => (
        <TagOption
          key={option.id}
          $isDark={isDark}
          $selected={value.includes(option.id)}
          onClick={() => handleToggle(option.id)}
        >
          {option.label}
        </TagOption>
      ))}
    </TagSelectorContainer>
  );
};
