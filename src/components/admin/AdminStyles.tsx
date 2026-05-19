import { useState, useRef, useEffect, Children, isValidElement } from 'react';
import type { ReactNode } from 'react';
import styled, { keyframes } from 'styled-components';

// ============================================
// Shared admin styled-components
// Used across all admin CRUD pages
// winnticket-style design in styled-components
// ============================================

export const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 24px;
`;

export const PageTitle = styled.h1<{ $isDark: boolean }>`
  font-size: 22px;
  font-weight: 700;
  color: ${p => p.$isDark ? '#f5f5f7' : '#1d1d1f'};
  letter-spacing: -0.5px;
`;

export const PageSubtitle = styled.p`
  font-size: 13px;
  color: #86868b;
  margin-top: 4px;
`;

// --- Cards ---

export const Card = styled.div<{ $isDark: boolean }>`
  background: ${p => p.$isDark ? '#1a1a1a' : '#ffffff'};
  border: 1px solid ${p => p.$isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'};
  border-radius: 12px;
  overflow: hidden;
`;

export const CardHeader = styled.div<{ $isDark: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid ${p => p.$isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'};
`;

export const CardBody = styled.div`
  padding: 24px;
`;

// --- Buttons ---

export const PrimaryButton = styled.button<{ $isDark?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 36px;
  padding: 0 16px;
  background: #0c8ce9;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: inherit;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background: #0a7ad4;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg { width: 16px; height: 16px; }
`;

export const SecondaryButton = styled.button<{ $isDark: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 36px;
  padding: 0 16px;
  background: ${p => p.$isDark ? 'rgba(255,255,255,0.05)' : '#ffffff'};
  color: ${p => p.$isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)'};
  border: 1px solid ${p => p.$isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'};
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: inherit;
  white-space: nowrap;

  &:hover {
    background: ${p => p.$isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.03)'};
  }

  svg { width: 16px; height: 16px; }
`;

export const DestructiveButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 36px;
  padding: 0 16px;
  background: rgba(212, 24, 61, 0.1);
  color: #d4183d;
  border: 1px solid rgba(212, 24, 61, 0.2);
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: inherit;
  white-space: nowrap;

  &:hover {
    background: rgba(212, 24, 61, 0.15);
  }

  svg { width: 16px; height: 16px; }
`;

export const GhostButton = styled.button<{ $isDark: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: ${p => p.$isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)'};
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: ${p => p.$isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'};
    color: ${p => p.$isDark ? '#f5f5f7' : '#1d1d1f'};
  }

  svg { width: 16px; height: 16px; }
`;

// --- Form Elements ---

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const FormLabel = styled.label<{ $isDark: boolean }>`
  font-size: 13px;
  font-weight: 600;
  color: ${p => p.$isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.55)'};
`;

export const FormInput = styled.input<{ $isDark: boolean }>`
  height: 40px;
  padding: 0 14px;
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

  &::placeholder { color: #86868b; }
`;

export const FormTextarea = styled.textarea<{ $isDark: boolean }>`
  padding: 12px 14px;
  font-size: 14px;
  line-height: 1.6;
  background: ${p => p.$isDark ? 'rgba(255,255,255,0.05)' : '#f3f3f5'};
  border: 1px solid ${p => p.$isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'};
  border-radius: 8px;
  color: ${p => p.$isDark ? '#f5f5f7' : '#1d1d1f'};
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
  transition: border-color 0.15s ease;

  &:focus {
    outline: none;
    border-color: #0c8ce9;
  }

  &::placeholder { color: #86868b; }
`;

/* ── Custom Select (replaces native <select>) ── */

const dropIn = keyframes`
  from { opacity: 0; transform: translateY(-6px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`;

const SelectWrap = styled.div`
  position: relative;
`;

const SelectTrigger = styled.button<{ $isDark: boolean; $open: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 40px;
  padding: 0 14px;
  font-size: 14px;
  background: ${p => p.$isDark ? 'rgba(255,255,255,0.05)' : '#f3f3f5'};
  border: 1px solid ${p =>
    p.$open ? '#0c8ce9'
    : p.$isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'};
  border-radius: 8px;
  color: ${p => p.$isDark ? '#f5f5f7' : '#1d1d1f'};
  font-family: inherit;
  cursor: pointer;
  transition: border-color 0.15s ease;
  text-align: left;

  &:hover {
    border-color: ${p => p.$open ? '#0c8ce9' : p.$isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)'};
  }

  svg {
    width: 16px;
    height: 16px;
    color: #86868b;
    flex-shrink: 0;
    transition: transform 0.2s ease;
    transform: rotate(${p => p.$open ? '180deg' : '0deg'});
  }
`;

const SelectMenu = styled.div<{ $isDark: boolean }>`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  z-index: 500;
  background: ${p => p.$isDark ? '#252525' : '#ffffff'};
  border: 1px solid ${p => p.$isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'};
  border-radius: 10px;
  padding: 4px;
  box-shadow: ${p => p.$isDark
    ? '0 8px 32px rgba(0,0,0,0.5)'
    : '0 8px 32px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.03)'};
  animation: ${dropIn} 0.15s ease;
  overflow: hidden;
`;

const SelectItem = styled.div<{ $isDark: boolean; $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 9px 12px;
  font-size: 14px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.1s ease;
  color: ${p => p.$active ? '#0c8ce9' : p.$isDark ? '#f5f5f7' : '#1d1d1f'};
  font-weight: ${p => p.$active ? '600' : '400'};
  background: ${p => p.$active
    ? (p.$isDark ? 'rgba(12,140,233,0.12)' : 'rgba(12,140,233,0.06)')
    : 'transparent'};

  &:hover {
    background: ${p => p.$isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'};
  }

  svg {
    width: 14px;
    height: 14px;
    color: #0c8ce9;
    flex-shrink: 0;
  }
`;

interface FormSelectProps {
  $isDark: boolean;
  value?: string;
  onChange?: (e: { target: { value: string } }) => void;
  children: ReactNode;
  style?: React.CSSProperties;
}

export function FormSelect({ $isDark, value, onChange, children, style }: FormSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const options: { value: string; label: string }[] = [];
  Children.forEach(children, child => {
    if (isValidElement(child) && child.type === 'option') {
      const props = child.props as { value?: string; children?: string };
      options.push({
        value: props.value ?? String(props.children ?? ''),
        label: String(props.children ?? ''),
      });
    }
  });

  const selectedLabel = options.find(o => o.value === value)?.label ?? options[0]?.label ?? '';

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <SelectWrap ref={ref} style={style}>
      <SelectTrigger $isDark={$isDark} $open={open} type="button" onClick={() => setOpen(v => !v)}>
        <span>{selectedLabel}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </SelectTrigger>
      {open && (
        <SelectMenu $isDark={$isDark}>
          {options.map(opt => (
            <SelectItem
              key={opt.value}
              $isDark={$isDark}
              $active={opt.value === value}
              onClick={() => {
                onChange?.({ target: { value: opt.value } });
                setOpen(false);
              }}
            >
              <span>{opt.label}</span>
              {opt.value === value && (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              )}
            </SelectItem>
          ))}
        </SelectMenu>
      )}
    </SelectWrap>
  );
}

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const FormSection = styled.div<{ $isDark: boolean }>`
  padding: 24px;
  border-bottom: 1px solid ${p => p.$isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'};
  display: flex;
  flex-direction: column;
  gap: 16px;

  &:last-child {
    border-bottom: none;
  }
`;

export const SectionTitle = styled.h3<{ $isDark: boolean }>`
  font-size: 15px;
  font-weight: 600;
  color: ${p => p.$isDark ? '#f5f5f7' : '#1d1d1f'};
  letter-spacing: -0.3px;
`;

// --- Tabs ---

export const TabRow = styled.div<{ $isDark: boolean }>`
  display: flex;
  gap: 0;
  border-bottom: 1px solid ${p => p.$isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'};
`;

export const Tab = styled.button<{ $isDark: boolean; $active: boolean }>`
  padding: 10px 20px;
  font-size: 14px;
  font-weight: ${p => p.$active ? '600' : '500'};
  color: ${p => p.$active ? '#0c8ce9' : p.$isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)'};
  background: none;
  border: none;
  border-bottom: 2px solid ${p => p.$active ? '#0c8ce9' : 'transparent'};
  cursor: pointer;
  font-family: inherit;
  transition: all 0.15s ease;
  margin-bottom: -1px;

  &:hover {
    color: ${p => p.$active ? '#0c8ce9' : p.$isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)'};
  }
`;

// --- Table ---

export const Table = styled.table<{ $isDark: boolean }>`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;

  th {
    text-align: left;
    padding: 12px 16px;
    font-weight: 600;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: ${p => p.$isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)'};
    border-bottom: 1px solid ${p => p.$isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'};
  }

  td {
    padding: 14px 16px;
    color: ${p => p.$isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.75)'};
    border-bottom: 1px solid ${p => p.$isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'};
    vertical-align: middle;
  }

  tr:last-child td {
    border-bottom: none;
  }

  tr:hover td {
    background: ${p => p.$isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)'};
  }
`;

// --- Badge ---

export const Badge = styled.span<{ $variant?: 'default' | 'success' | 'warning' | 'danger'; $isDark?: boolean }>`
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 99px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;

  ${p => {
    switch (p.$variant) {
      case 'success': return `background: rgba(16,185,129,0.12); color: #10b981;`;
      case 'warning': return `background: rgba(245,158,11,0.12); color: #f59e0b;`;
      case 'danger':  return `background: rgba(212,24,61,0.12); color: #d4183d;`;
      default:        return `background: ${p.$isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}; color: #86868b;`;
    }
  }}
`;

// --- Toggle ---

export const ToggleWrapper = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
`;

export const ToggleSwitch = styled.div<{ $on: boolean }>`
  width: 40px;
  height: 22px;
  border-radius: 11px;
  background: ${p => p.$on ? '#0c8ce9' : 'rgba(128,128,128,0.3)'};
  position: relative;
  transition: background 0.2s ease;

  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${p => p.$on ? '20px' : '2px'};
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: white;
    transition: left 0.2s ease;
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  }
`;

export const ToggleLabel = styled.span<{ $isDark: boolean }>`
  font-size: 14px;
  color: ${p => p.$isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)'};
`;

// --- Empty state ---

export const EmptyState = styled.div<{ $isDark: boolean }>`
  text-align: center;
  padding: 60px 20px;
  color: ${p => p.$isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'};
  font-size: 14px;
`;

// --- Search ---

export const SearchInput = styled.div<{ $isDark: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  padding: 0 12px;
  background: ${p => p.$isDark ? 'rgba(255,255,255,0.05)' : '#f3f3f5'};
  border: 1px solid transparent;
  border-radius: 8px;
  transition: all 0.15s ease;

  &:focus-within {
    border-color: #0c8ce9;
    box-shadow: 0 0 0 3px rgba(12,140,233,0.1);
  }

  svg {
    width: 16px;
    height: 16px;
    color: #86868b;
    flex-shrink: 0;
  }

  input {
    flex: 1;
    height: 100%;
    background: none;
    border: none;
    font-size: 14px;
    color: ${p => p.$isDark ? '#f5f5f7' : '#1d1d1f'};
    font-family: inherit;

    &:focus { outline: none; }
    &::placeholder { color: #86868b; }
  }
`;

// --- Actions row ---

export const ActionsRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

// --- File upload ---

export const FileUploadArea = styled.label<{ $isDark: boolean; $hasFile?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 32px;
  border: 2px dashed ${p => p.$hasFile ? '#0c8ce9' : p.$isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'};
  border-radius: 12px;
  background: ${p => p.$isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)'};
  cursor: pointer;
  transition: all 0.15s ease;
  text-align: center;

  &:hover {
    border-color: #0c8ce9;
    background: ${p => p.$isDark ? 'rgba(12,140,233,0.05)' : 'rgba(12,140,233,0.03)'};
  }

  input {
    display: none;
  }

  svg {
    width: 24px;
    height: 24px;
    color: #86868b;
  }

  span {
    font-size: 13px;
    color: #86868b;
  }
`;
