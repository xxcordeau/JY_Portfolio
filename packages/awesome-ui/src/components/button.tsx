import * as React from "react";
import styled from "styled-components";
import { cva, type VariantProps } from "class-variance-authority";

const StyledButton = styled.button<{ 
  $isDark?: boolean;
  $variant?: 'default' | 'outline' | 'ghost' | 'destructive';
  $size?: 'default' | 'sm' | 'lg';
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  white-space: nowrap;
  border-radius: 12px;
  font-weight: 500;
  transition: all 0.2s ease;
  outline: none;
  cursor: pointer;
  border: 1px solid transparent;
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif;
  
  /* Size Variants */
  ${props => {
    switch (props.$size) {
      case 'sm':
        return `
          height: 36px;
          padding: 0 20px;
          font-size: 13px;
        `;
      case 'lg':
        return `
          height: 52px;
          padding: 0 32px;
          font-size: 16px;
        `;
      default:
        return `
          height: 44px;
          padding: 0 24px;
          font-size: 15px;
        `;
    }
  }}
  
  /* Variant Styles */
  ${props => {
    const isDark = props.$isDark;
    
    switch (props.$variant) {
      case 'outline':
        return `
          background: ${isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)'};
          border-color: ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'};
          color: ${isDark ? '#f5f5f7' : '#1d1d1f'};
          backdrop-filter: blur(20px);
          
          &:hover:not(:disabled) {
            background: ${isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)'};
            border-color: ${isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.1)'};
          }
          
          &:active:not(:disabled) {
            background: ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'};
          }
        `;
      
      case 'ghost':
        return `
          background: transparent;
          color: ${isDark ? '#f5f5f7' : '#1d1d1f'};
          
          &:hover:not(:disabled) {
            background: ${isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)'};
          }
          
          &:active:not(:disabled) {
            background: ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'};
          }
        `;
      
      case 'destructive':
        return `
          background: ${isDark ? '#ff3b30' : '#ff3b30'};
          color: white;
          
          &:hover:not(:disabled) {
            background: ${isDark ? '#ff453a' : '#ff2d20'};
            box-shadow: 0 4px 12px rgba(255, 59, 48, 0.3);
          }
          
          &:active:not(:disabled) {
            background: ${isDark ? '#ff5247' : '#e02b1f'};
          }
        `;
      
      default: // 'default'
        return `
          background: ${isDark ? '#4ECDC4' : '#007AFF'};
          color: white;
          
          &:hover:not(:disabled) {
            background: ${isDark ? '#5DD4CB' : '#0066DD'};
            box-shadow: 0 4px 12px ${isDark ? 'rgba(78, 205, 196, 0.3)' : 'rgba(0, 122, 255, 0.3)'};
            transform: translateY(-1px);
          }
          
          &:active:not(:disabled) {
            background: ${isDark ? '#3DC4BB' : '#0055CC'};
            transform: translateY(0);
          }
        `;
    }
  }}
  
  /* Focus State */
  &:focus-visible {
    box-shadow: 0 0 0 3px ${props => props.$isDark ? 'rgba(78, 205, 196, 0.3)' : 'rgba(0, 122, 255, 0.3)'};
  }
  
  /* Disabled State */
  &:disabled {
    pointer-events: none;
    cursor: not-allowed;
    opacity: 0.5;
  }
  
  /* SVG Icons */
  svg {
    width: 16px;
    height: 16px;
  }
  
  @media (max-width: 768px) {
    ${props => props.$size === 'lg' ? 'font-size: 15px;' : ''}
    ${props => props.$size === 'default' ? 'font-size: 14px;' : ''}
  }
`;

interface ButtonProps extends React.ComponentProps<"button"> {
  isDark?: boolean;
  variant?: 'default' | 'outline' | 'ghost' | 'destructive';
  size?: 'default' | 'sm' | 'lg';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ 
  className, 
  isDark, 
  variant = 'default',
  size = 'default',
  children,
  ...props 
}, ref) => {
  return (
    <StyledButton
      ref={ref}
      $isDark={isDark}
      $variant={variant}
      $size={size}
      className={className}
      {...props}
    >
      {children}
    </StyledButton>
  );
});

Button.displayName = "Button";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export { Button, buttonVariants };
