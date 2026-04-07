"use client";

import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle@1.1.2";
import styled from "styled-components";

const StyledToggle = styled(TogglePrimitive.Root)<{ 
  $isDark?: boolean;
  $variant?: 'default' | 'outline';
  $size?: 'default' | 'sm' | 'lg';
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  transition: all 0.2s ease;
  outline: none;
  cursor: pointer;
  border: 1px solid transparent;
  
  /* Size Variants */
  ${props => {
    switch (props.$size) {
      case 'sm':
        return `
          height: 32px;
          padding: 0 12px;
          min-width: 32px;
        `;
      case 'lg':
        return `
          height: 40px;
          padding: 0 20px;
          min-width: 40px;
        `;
      default:
        return `
          height: 36px;
          padding: 0 16px;
          min-width: 36px;
        `;
    }
  }}
  
  /* Variant Styles */
  ${props => {
    const isDark = props.$isDark;
    
    if (props.$variant === 'outline') {
      return `
        background: transparent;
        border-color: ${isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'};
        color: ${isDark ? '#f5f5f7' : '#1d1d1f'};
        
        &:hover {
          background: ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
        }
        
        &[data-state="on"] {
          background: ${isDark ? 'rgba(78, 205, 196, 0.15)' : 'rgba(0, 122, 255, 0.15)'};
          border-color: ${isDark ? '#4ECDC4' : '#007AFF'};
          color: ${isDark ? '#4ECDC4' : '#007AFF'};
        }
      `;
    }
    
    return `
      background: transparent;
      color: ${isDark ? '#f5f5f7' : '#1d1d1f'};
      
      &:hover {
        background: ${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
      }
      
      &[data-state="on"] {
        background: ${isDark ? 'rgba(78, 205, 196, 0.15)' : 'rgba(0, 122, 255, 0.15)'};
        color: ${isDark ? '#4ECDC4' : '#007AFF'};
      }
    `;
  }}
  
  &:focus-visible {
    box-shadow: 0 0 0 3px ${props => props.$isDark ? 'rgba(78, 205, 196, 0.3)' : 'rgba(0, 122, 255, 0.3)'};
  }
  
  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }
  
  svg {
    width: 16px;
    height: 16px;
    pointer-events: none;
  }
`;

interface ToggleProps extends React.ComponentProps<typeof TogglePrimitive.Root> {
  isDark?: boolean;
  variant?: 'default' | 'outline';
  size?: 'default' | 'sm' | 'lg';
}

function Toggle({
  className,
  isDark,
  variant = 'default',
  size = 'default',
  ...props
}: ToggleProps) {
  return (
    <StyledToggle
      $isDark={isDark}
      $variant={variant}
      $size={size}
      className={className}
      {...props}
    />
  );
}

export { Toggle };
