"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import styled from "styled-components";

const StyledContent = styled(TooltipPrimitive.Content)<{ $isDark?: boolean }>`
  z-index: 50;
  width: fit-content;
  max-width: 280px;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 12px;
  line-height: 1.4;
  text-align: center;
  background: ${props => props.$isDark ? 'rgba(30, 30, 30, 0.95)' : 'rgba(30, 30, 30, 0.95)'};
  color: #ffffff;
  backdrop-filter: blur(20px);
  box-shadow: ${props => props.$isDark 
    ? '0 4px 16px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.08)' 
    : '0 4px 16px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05)'};
  
  animation: tooltipIn 0.15s ease-out;
  
  &[data-state="closed"] {
    animation: tooltipOut 0.1s ease-in;
  }
  
  @keyframes tooltipIn {
    from {
      opacity: 0;
      transform: scale(0.96);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  @keyframes tooltipOut {
    from {
      opacity: 1;
      transform: scale(1);
    }
    to {
      opacity: 0;
      transform: scale(0.96);
    }
  }
  
  &[data-side="bottom"] {
    animation: slideFromTop 0.15s ease-out;
  }
  
  &[data-side="left"] {
    animation: slideFromRight 0.15s ease-out;
  }
  
  &[data-side="right"] {
    animation: slideFromLeft 0.15s ease-out;
  }
  
  &[data-side="top"] {
    animation: slideFromBottom 0.15s ease-out;
  }
  
  @keyframes slideFromTop {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes slideFromBottom {
    from {
      opacity: 0;
      transform: translateY(4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes slideFromLeft {
    from {
      opacity: 0;
      transform: translateX(-4px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes slideFromRight {
    from {
      opacity: 0;
      transform: translateX(4px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

const StyledArrow = styled(TooltipPrimitive.Arrow)<{ $isDark?: boolean }>`
  fill: rgba(30, 30, 30, 0.95);
  z-index: 50;
  width: 10px;
  height: 5px;
  transform: translateY(calc(-50% - 2px));
`;

interface TooltipContentProps extends React.ComponentProps<typeof TooltipPrimitive.Content> {
  isDark?: boolean;
}

function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      delayDuration={delayDuration}
      {...props}
    />
  );
}

function Tooltip(props: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root {...props} />
    </TooltipProvider>
  );
}

function TooltipTrigger(props: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger {...props} />;
}

function TooltipContent({
  className,
  isDark,
  sideOffset = 4,
  children,
  ...props
}: TooltipContentProps) {
  return (
    <TooltipPrimitive.Portal>
      <StyledContent
        $isDark={isDark}
        sideOffset={sideOffset}
        className={className}
        {...props}
      >
        {children}
        <StyledArrow $isDark={isDark} />
      </StyledContent>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
