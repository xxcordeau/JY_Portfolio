import styled from 'styled-components';
import React, { useState } from 'react';
import { Search, Filter, X, ChevronDown } from 'lucide-react';

const SearchContainer = styled.div<{ $isDark?: boolean }>`
  position: relative;
  width: 100%;
`;

const SearchInputWrapper = styled.div<{ $isDark?: boolean; $focused?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
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
  transition: all 0.2s;

  &:hover {
    background: ${props => props.$isDark 
      ? 'rgba(255, 255, 255, 0.08)' 
      : 'rgba(0, 0, 0, 0.02)'};
  }
`;

const SearchIcon = styled.div<{ $isDark?: boolean }>`
  display: flex;
  align-items: center;
  color: ${props => props.$isDark ? '#86868b' : '#6e6e73'};

  svg {
    width: 18px;
    height: 18px;
  }
`;

const SearchInput = styled.input<{ $isDark?: boolean }>`
  flex: 1;
  border: none;
  background: transparent;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  font-size: 14px;
  outline: none;

  &::placeholder {
    color: ${props => props.$isDark ? '#86868b' : '#6e6e73'};
  }
`;

const ClearButton = styled.button<{ $isDark?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: none;
  background: ${props => props.$isDark 
    ? 'rgba(255, 255, 255, 0.15)' 
    : 'rgba(0, 0, 0, 0.1)'};
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.$isDark 
      ? 'rgba(255, 255, 255, 0.2)' 
      : 'rgba(0, 0, 0, 0.15)'};
  }

  svg {
    width: 12px;
    height: 12px;
  }
`;

const FilterButton = styled.button<{ $isDark?: boolean; $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border-radius: 12px;
  border: 1px solid ${props => {
    if (props.$active) return '#007AFF';
    return props.$isDark 
      ? 'rgba(255, 255, 255, 0.2)' 
      : 'rgba(0, 0, 0, 0.2)';
  }};
  background: ${props => {
    if (props.$active) return props.$isDark 
      ? 'rgba(0, 122, 255, 0.15)' 
      : 'rgba(0, 122, 255, 0.08)';
    return props.$isDark 
      ? 'rgba(255, 255, 255, 0.05)' 
      : 'rgba(255, 255, 255, 1)';
  }};
  color: ${props => props.$active ? '#007AFF' : props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => {
      if (props.$active) return props.$isDark 
        ? 'rgba(0, 122, 255, 0.2)' 
        : 'rgba(0, 122, 255, 0.12)';
      return props.$isDark 
        ? 'rgba(255, 255, 255, 0.08)' 
        : 'rgba(0, 0, 0, 0.02)';
    }};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const SearchFilterContainer = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  width: 100%;
`;

const FilterDropdown = styled.div<{ $isDark?: boolean; $show?: boolean }>`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  z-index: 9999;
  min-width: 250px;
  padding: 12px;
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

const FilterSection = styled.div`
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const FilterLabel = styled.div<{ $isDark?: boolean }>`
  font-size: 12px;
  font-weight: 600;
  color: ${props => props.$isDark ? '#86868b' : '#6e6e73'};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
`;

const FilterOption = styled.button<{ $isDark?: boolean; $selected?: boolean }>`
  display: block;
  width: 100%;
  padding: 8px 12px;
  border-radius: 6px;
  border: none;
  background: ${props => {
    if (props.$selected) return '#007AFF';
    return 'transparent';
  }};
  color: ${props => {
    if (props.$selected) return '#ffffff';
    return props.$isDark ? '#f5f5f7' : '#1d1d1f';
  }};
  font-size: 14px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 4px;

  &:hover {
    background: ${props => {
      if (props.$selected) return '#0051D5';
      return props.$isDark 
        ? 'rgba(255, 255, 255, 0.05)' 
        : 'rgba(0, 0, 0, 0.03)';
    }};
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const FilterActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid ${props => props.theme.$isDark 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.1)'};
`;

const FilterActionButton = styled.button<{ $isDark?: boolean; $primary?: boolean }>`
  flex: 1;
  padding: 8px 12px;
  border-radius: 6px;
  border: none;
  background: ${props => {
    if (props.$primary) return '#007AFF';
    return props.$isDark 
      ? 'rgba(255, 255, 255, 0.1)' 
      : 'rgba(0, 0, 0, 0.05)';
  }};
  color: ${props => {
    if (props.$primary) return '#ffffff';
    return props.$isDark ? '#f5f5f7' : '#1d1d1f';
  }};
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => {
      if (props.$primary) return '#0051D5';
      return props.$isDark 
        ? 'rgba(255, 255, 255, 0.15)' 
        : 'rgba(0, 0, 0, 0.08)';
    }};
  }
`;

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isDark?: boolean;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search...',
  isDark = false,
  className
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <SearchContainer className={className}>
      <SearchInputWrapper $isDark={isDark} $focused={focused}>
        <SearchIcon $isDark={isDark}>
          <Search />
        </SearchIcon>
        <SearchInput
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          $isDark={isDark}
        />
        {value && (
          <ClearButton
            $isDark={isDark}
            onClick={() => onChange('')}
          >
            <X />
          </ClearButton>
        )}
      </SearchInputWrapper>
    </SearchContainer>
  );
};

export interface FilterGroup {
  id: string;
  label: string;
  options: Array<{
    id: string;
    label: string;
  }>;
}

export interface SearchFilterProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  filterGroups: FilterGroup[];
  selectedFilters: Record<string, string>;
  onFilterChange: (groupId: string, optionId: string) => void;
  onClearFilters: () => void;
  searchPlaceholder?: string;
  isDark?: boolean;
  className?: string;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
  searchValue,
  onSearchChange,
  filterGroups,
  selectedFilters,
  onFilterChange,
  onClearFilters,
  searchPlaceholder = 'Search...',
  isDark = false,
  className
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [focused, setFocused] = useState(false);

  const hasActiveFilters = Object.keys(selectedFilters).length > 0;

  return (
    <SearchFilterContainer className={className} style={{ position: 'relative' }}>
      <SearchContainer style={{ flex: 1 }}>
        <SearchInputWrapper $isDark={isDark} $focused={focused}>
          <SearchIcon $isDark={isDark}>
            <Search />
          </SearchIcon>
          <SearchInput
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={searchPlaceholder}
            $isDark={isDark}
          />
          {searchValue && (
            <ClearButton
              $isDark={isDark}
              onClick={() => onSearchChange('')}
            >
              <X />
            </ClearButton>
          )}
        </SearchInputWrapper>
      </SearchContainer>

      <div style={{ position: 'relative' }}>
        <FilterButton
          $isDark={isDark}
          $active={hasActiveFilters}
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter />
          Filters
          <ChevronDown style={{ opacity: 0.6 }} />
        </FilterButton>

        <FilterDropdown $isDark={isDark} $show={showFilters}>
          {filterGroups.map(group => (
            <FilterSection key={group.id}>
              <FilterLabel $isDark={isDark}>{group.label}</FilterLabel>
              {group.options.map(option => (
                <FilterOption
                  key={option.id}
                  $isDark={isDark}
                  $selected={selectedFilters[group.id] === option.id}
                  onClick={() => onFilterChange(group.id, option.id)}
                >
                  {option.label}
                </FilterOption>
              ))}
            </FilterSection>
          ))}
          
          {hasActiveFilters && (
            <FilterActions theme={{ $isDark: isDark }}>
              <FilterActionButton
                $isDark={isDark}
                onClick={onClearFilters}
              >
                Clear All
              </FilterActionButton>
              <FilterActionButton
                $isDark={isDark}
                $primary
                onClick={() => setShowFilters(false)}
              >
                Apply
              </FilterActionButton>
            </FilterActions>
          )}
        </FilterDropdown>
      </div>
    </SearchFilterContainer>
  );
};
