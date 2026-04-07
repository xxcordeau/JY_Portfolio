import * as React from "react";
import styled from "styled-components";

const StyledTextarea = styled.textarea<{ $isDark?: boolean }>`
  display: flex;
  min-height: 120px;
  width: 100%;
  min-width: 0;
  border-radius: 12px;
  border: 1px solid;
  padding: 16px;
  font-size: 15px;
  outline: none;
  transition: all 0.2s ease;
  resize: vertical;
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif;
  line-height: 1.6;
  
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
  
  @media (max-width: 768px) {
    font-size: 14px;
    min-height: 100px;
  }
`;

interface TextareaProps extends React.ComponentProps<"textarea"> {
  isDark?: boolean;
}

function Textarea({ className, isDark, ...props }: TextareaProps) {
  return (
    <StyledTextarea
      $isDark={isDark}
      className={className}
      {...props}
    />
  );
}

export { Textarea };
