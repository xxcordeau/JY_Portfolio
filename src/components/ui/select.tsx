"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import styled from "styled-components";
import { Check, ChevronDown, ChevronUp } from "lucide-react";

const StyledSelectTrigger = styled(SelectPrimitive.Trigger)<{ $isDark?: boolean }>`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  border-radius: 12px;
  border: 1px solid;
  padding: 16px;
  font-size: 15px;
  white-space: nowrap;
  transition: all 0.2s ease;
  outline: none;
  cursor: pointer;
  height: 44px;
  
  /* Background & Border - Input 스타일과 동일 */
  background: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)'};
  border-color: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'};
  backdrop-filter: blur(20px);
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  
  &[data-placeholder] {
    color: ${props => props.$isDark ? '#86868b' : '#6e6e73'};
  }
  
  &:hover {
    background: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
  }
  
  &:focus {
    border-color: ${props => props.$isDark ? 'rgba(78, 205, 196, 0.5)' : 'rgba(0, 122, 255, 0.5)'};
    box-shadow: 0 0 0 3px ${props => props.$isDark ? 'rgba(78, 205, 196, 0.15)' : 'rgba(0, 122, 255, 0.15)'};
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
  
  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    opacity: 0.5;
  }
`;

const StyledSelectContent = styled(SelectPrimitive.Content)<{ $isDark?: boolean }>`
  position: relative;
  z-index: 50;
  max-height: 384px;
  min-width: 8rem;
  overflow: auto;
  border-radius: 12px;
  border: 1px solid;
  background: ${props => props.$isDark ? '#1a1a1a' : '#ffffff'};
  border-color: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  box-shadow: ${props => props.$isDark 
    ? '0 10px 40px rgba(0, 0, 0, 0.5)' 
    : '0 10px 40px rgba(0, 0, 0, 0.1)'};
  backdrop-filter: blur(20px);
  
  &[data-state="open"] {
    animation: fadeIn 0.15s ease-out;
  }
  
  &[data-state="closed"] {
    animation: fadeOut 0.15s ease-in;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  @keyframes fadeOut {
    from {
      opacity: 1;
      transform: scale(1);
    }
    to {
      opacity: 0;
      transform: scale(0.95);
    }
  }
`;

const StyledSelectViewport = styled(SelectPrimitive.Viewport)`
  padding: 4px;
`;

const StyledSelectLabel = styled(SelectPrimitive.Label)<{ $isDark?: boolean }>`
  padding: 6px 8px;
  font-size: 12px;
  font-weight: 600;
  color: ${props => props.$isDark ? '#86868b' : '#6e6e73'};
`;

const StyledSelectItem = styled(SelectPrimitive.Item)<{ $isDark?: boolean }>`
  position: relative;
  display: flex;
  width: 100%;
  cursor: pointer;
  align-items: center;
  gap: 8px;
  border-radius: 8px;
  padding: 8px 32px 8px 8px;
  font-size: 14px;
  outline: none;
  user-select: none;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  
  &:hover,
  &:focus {
    background: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)'};
  }
  
  &[data-disabled] {
    pointer-events: none;
    opacity: 0.5;
  }
  
  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    pointer-events: none;
  }
`;

const StyledSelectItemIndicator = styled.span<{ $isDark?: boolean }>`
  position: absolute;
  right: 8px;
  display: flex;
  width: 14px;
  height: 14px;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 16px;
    height: 16px;
    color: ${props => props.$isDark ? '#4ECDC4' : '#007AFF'};
  }
`;

const StyledSelectSeparator = styled(SelectPrimitive.Separator)<{ $isDark?: boolean }>`
  margin: 4px -4px;
  height: 1px;
  background: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  pointer-events: none;
`;

const StyledScrollButton = styled.div<{ $isDark?: boolean }>`
  display: flex;
  cursor: default;
  align-items: center;
  justify-content: center;
  padding: 4px 0;
  
  svg {
    width: 16px;
    height: 16px;
    color: ${props => props.$isDark ? '#86868b' : '#6e6e73'};
  }
`;

interface SelectTriggerProps extends React.ComponentProps<typeof SelectPrimitive.Trigger> {
  isDark?: boolean;
}

interface SelectContentProps extends React.ComponentProps<typeof SelectPrimitive.Content> {
  isDark?: boolean;
}

interface SelectLabelProps extends React.ComponentProps<typeof SelectPrimitive.Label> {
  isDark?: boolean;
}

interface SelectItemProps extends React.ComponentProps<typeof SelectPrimitive.Item> {
  isDark?: boolean;
}

interface SelectSeparatorProps extends React.ComponentProps<typeof SelectPrimitive.Separator> {
  isDark?: boolean;
}

interface ScrollButtonProps extends React.ComponentProps<typeof SelectPrimitive.ScrollUpButton> {
  isDark?: boolean;
}

function Select(props: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root {...props} />;
}

function SelectGroup(props: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group {...props} />;
}

function SelectValue(props: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value {...props} />;
}

function SelectTrigger({ className, isDark, children, ...props }: SelectTriggerProps) {
  return (
    <StyledSelectTrigger $isDark={isDark} className={className} {...props}>
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown />
      </SelectPrimitive.Icon>
    </StyledSelectTrigger>
  );
}

function SelectContent({
  className,
  isDark,
  children,
  position = "popper",
  ...props
}: SelectContentProps) {
  return (
    <SelectPrimitive.Portal>
      <StyledSelectContent $isDark={isDark} className={className} position={position} {...props}>
        <SelectScrollUpButton isDark={isDark} />
        <StyledSelectViewport>
          {children}
        </StyledSelectViewport>
        <SelectScrollDownButton isDark={isDark} />
      </StyledSelectContent>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({ className, isDark, ...props }: SelectLabelProps) {
  return <StyledSelectLabel $isDark={isDark} className={className} {...props} />;
}

function SelectItem({ className, isDark, children, ...props }: SelectItemProps) {
  return (
    <StyledSelectItem $isDark={isDark} className={className} {...props}>
      <StyledSelectItemIndicator $isDark={isDark}>
        <SelectPrimitive.ItemIndicator>
          <Check />
        </SelectPrimitive.ItemIndicator>
      </StyledSelectItemIndicator>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </StyledSelectItem>
  );
}

function SelectSeparator({ className, isDark, ...props }: SelectSeparatorProps) {
  return <StyledSelectSeparator $isDark={isDark} className={className} {...props} />;
}

function SelectScrollUpButton({ className, isDark, ...props }: ScrollButtonProps) {
  return (
    <SelectPrimitive.ScrollUpButton asChild>
      <StyledScrollButton $isDark={isDark} className={className} {...props}>
        <ChevronUp />
      </StyledScrollButton>
    </SelectPrimitive.ScrollUpButton>
  );
}

function SelectScrollDownButton({ className, isDark, ...props }: ScrollButtonProps) {
  return (
    <SelectPrimitive.ScrollDownButton asChild>
      <StyledScrollButton $isDark={isDark} className={className} {...props}>
        <ChevronDown />
      </StyledScrollButton>
    </SelectPrimitive.ScrollDownButton>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
