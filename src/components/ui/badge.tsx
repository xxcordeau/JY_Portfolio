import * as React from "react";
import styled from "styled-components";

const StyledBadge = styled.span<{ 
  $isDark?: boolean;
  $variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 1px solid;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 600;
  width: fit-content;
  white-space: nowrap;
  flex-shrink: 0;
  gap: 4px;
  transition: all 0.2s ease;
  
  svg {
    width: 12px;
    height: 12px;
  }
  
  /* Variant Styles */
  ${props => {
    const isDark = props.$isDark;
    
    switch (props.$variant) {
      case 'secondary':
        return `
          background: ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
          border-color: ${isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)'};
          color: ${isDark ? '#f5f5f7' : '#1d1d1f'};
        `;
      
      case 'destructive':
        return `
          background: #ff3b30;
          border-color: transparent;
          color: white;
        `;
      
      case 'outline':
        return `
          background: transparent;
          border-color: ${isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'};
          color: ${isDark ? '#f5f5f7' : '#1d1d1f'};
        `;
      
      default: // 'default'
        return `
          background: ${isDark ? '#4ECDC4' : '#007AFF'};
          border-color: transparent;
          color: white;
        `;
    }
  }}
`;

interface BadgeProps extends React.ComponentProps<"span"> {
  isDark?: boolean;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

function Badge({ 
  className, 
  isDark,
  variant = 'default',
  children,
  ...props 
}: BadgeProps) {
  return (
    <StyledBadge
      $isDark={isDark}
      $variant={variant}
      className={className}
      {...props}
    >
      {children}
    </StyledBadge>
  );
}

export { Badge };
