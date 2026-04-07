import * as React from "react";
import styled from "styled-components";

const StyledDivider = styled.div<{ 
  $isDark?: boolean;
  $orientation?: 'horizontal' | 'vertical';
  $withText?: boolean;
}>`
  ${props => props.$orientation === 'vertical' ? `
    width: 1px;
    height: 100%;
    min-height: 20px;
  ` : `
    height: 1px;
    width: 100%;
  `}
  
  ${props => !props.$withText && `
    background: ${props.$isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  `}
  
  ${props => props.$withText && `
    display: flex;
    align-items: center;
    gap: 16px;
    color: ${props.$isDark ? '#86868b' : '#6e6e73'};
    font-size: 13px;
    
    &::before,
    &::after {
      content: '';
      flex: 1;
      height: 1px;
      background: ${props.$isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
    }
  `}
`;

interface DividerProps extends React.ComponentProps<"div"> {
  isDark?: boolean;
  orientation?: 'horizontal' | 'vertical';
  children?: React.ReactNode;
}

function Divider({ 
  className, 
  isDark, 
  orientation = 'horizontal',
  children,
  ...props 
}: DividerProps) {
  return (
    <StyledDivider
      $isDark={isDark}
      $orientation={orientation}
      $withText={!!children}
      className={className}
      {...props}
    >
      {children}
    </StyledDivider>
  );
}

export { Divider };
