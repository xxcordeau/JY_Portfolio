"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import styled from "styled-components";

const StyledSwitchRoot = styled(SwitchPrimitive.Root)<{ $isDark?: boolean }>`
  display: inline-flex;
  height: 24px;
  width: 44px;
  flex-shrink: 0;
  align-items: center;
  border-radius: 12px;
  border: 1px solid transparent;
  transition: all 0.2s ease;
  outline: none;
  cursor: pointer;
  position: relative;
  
  background: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  
  &[data-state="checked"] {
    background: ${props => props.$isDark ? '#4ECDC4' : '#007AFF'};
  }
  
  &:focus-visible {
    box-shadow: 0 0 0 3px ${props => props.$isDark ? 'rgba(78, 205, 196, 0.3)' : 'rgba(0, 122, 255, 0.3)'};
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const StyledSwitchThumb = styled(SwitchPrimitive.Thumb)<{ $isDark?: boolean }>`
  pointer-events: none;
  display: block;
  width: 20px;
  height: 20px;
  border-radius: 10px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
  
  &[data-state="checked"] {
    transform: translateX(20px);
  }
  
  &[data-state="unchecked"] {
    transform: translateX(2px);
  }
`;

interface SwitchProps extends React.ComponentProps<typeof SwitchPrimitive.Root> {
  isDark?: boolean;
}

function Switch({ className, isDark, ...props }: SwitchProps) {
  return (
    <StyledSwitchRoot $isDark={isDark} className={className} {...props}>
      <StyledSwitchThumb $isDark={isDark} />
    </StyledSwitchRoot>
  );
}

export { Switch };
