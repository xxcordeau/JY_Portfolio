import * as React from "react";
import styled from "styled-components";

const StyledInput = styled.input<{ $isDark?: boolean }>`
  display: flex;
  height: 44px;
  width: 100%;
  min-width: 0;
  border-radius: 12px;
  border: 1px solid;
  padding: 16px;
  font-size: 15px;
  outline: none;
  transition: all 0.2s ease;
  
  /* Background & Border - Card 스타일과 동일 */
  background: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)'};
  border-color: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'};
  backdrop-filter: blur(20px);
  
  /* Text Colors */
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  
  /* Placeholder */
  &::placeholder {
    color: ${props => props.$isDark ? '#86868b' : '#6e6e73'};
    opacity: 0.8;
  }
  
  /* Focus State */
  &:focus {
    border-color: ${props => props.$isDark ? 'rgba(78, 205, 196, 0.5)' : 'rgba(0, 122, 255, 0.5)'};
    box-shadow: 0 0 0 3px ${props => props.$isDark ? 'rgba(78, 205, 196, 0.15)' : 'rgba(0, 122, 255, 0.15)'};
  }
  
  /* Disabled State */
  &:disabled {
    pointer-events: none;
    cursor: not-allowed;
    opacity: 0.5;
  }
  
  /* Selection */
  &::selection {
    background: ${props => props.$isDark ? '#4ECDC4' : '#007AFF'};
    color: white;
  }
  
  /* File Input */
  &[type="file"]::file-selector-button {
    display: inline-flex;
    height: 28px;
    border: 0;
    background: transparent;
    font-size: 13px;
    font-weight: 500;
    color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  }
  
  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

interface InputProps extends React.ComponentProps<"input"> {
  isDark?: boolean;
}

function Input({ className, type, isDark, ...props }: InputProps) {
  return (
    <StyledInput
      type={type}
      $isDark={isDark}
      className={className}
      {...props}
    />
  );
}

export { Input };
