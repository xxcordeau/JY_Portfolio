"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import styled from "styled-components";
import { Circle } from "lucide-react";

const StyledRadioGroupRoot = styled(RadioGroupPrimitive.Root)`
  display: grid;
  gap: 12px;
`;

const StyledRadioItem = styled(RadioGroupPrimitive.Item)<{ $isDark?: boolean }>`
  aspect-ratio: 1;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  border-radius: 50%;
  border: 2px solid;
  transition: all 0.2s ease;
  outline: none;
  cursor: pointer;
  
  background: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)'};
  border-color: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'};
  
  &:hover {
    border-color: ${props => props.$isDark ? 'rgba(78, 205, 196, 0.5)' : 'rgba(0, 122, 255, 0.5)'};
  }
  
  &:focus {
    border-color: ${props => props.$isDark ? 'rgba(78, 205, 196, 0.8)' : 'rgba(0, 122, 255, 0.8)'};
    box-shadow: 0 0 0 3px ${props => props.$isDark ? 'rgba(78, 205, 196, 0.15)' : 'rgba(0, 122, 255, 0.15)'};
  }
  
  &[data-state="checked"] {
    border-color: ${props => props.$isDark ? '#4ECDC4' : '#007AFF'};
    background: ${props => props.$isDark ? 'rgba(78, 205, 196, 0.1)' : 'rgba(0, 122, 255, 0.1)'};
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const StyledIndicator = styled(RadioGroupPrimitive.Indicator)`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledCircle = styled(Circle)<{ $isDark?: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 10px;
  height: 10px;
  transform: translate(-50%, -50%);
  fill: ${props => props.$isDark ? '#4ECDC4' : '#007AFF'};
  color: ${props => props.$isDark ? '#4ECDC4' : '#007AFF'};
`;

interface RadioGroupProps extends React.ComponentProps<typeof RadioGroupPrimitive.Root> {
  isDark?: boolean;
}

interface RadioGroupItemProps extends React.ComponentProps<typeof RadioGroupPrimitive.Item> {
  isDark?: boolean;
}

function RadioGroup({ className, isDark, ...props }: RadioGroupProps) {
  return <StyledRadioGroupRoot className={className} {...props} />;
}

function RadioGroupItem({ className, isDark, ...props }: RadioGroupItemProps) {
  return (
    <StyledRadioItem $isDark={isDark} className={className} {...props}>
      <StyledIndicator>
        <StyledCircle $isDark={isDark} />
      </StyledIndicator>
    </StyledRadioItem>
  );
}

export { RadioGroup, RadioGroupItem };
