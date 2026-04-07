"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import styled from "styled-components";

const StyledContent = styled(PopoverPrimitive.Content)<{ $isDark?: boolean }>`
  z-index: 50;
  width: 288px;
  border-radius: 12px;
  border: 1px solid ${props => props.$isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'};
  padding: 16px;
  background: ${props => props.$isDark ? 'rgba(20, 20, 20, 0.98)' : 'rgba(255, 255, 255, 0.98)'};
  backdrop-filter: blur(40px);
  box-shadow: ${props => props.$isDark 
    ? '0 10px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.03)' 
    : '0 10px 40px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.02)'};
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  outline: none;
  
  &[data-state="open"] {
    animation: popoverIn 0.15s ease-out;
  }
  
  &[data-state="closed"] {
    animation: popoverOut 0.15s ease-in;
  }
  
  @keyframes popoverIn {
    from {
      opacity: 0;
      transform: scale(0.96);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  @keyframes popoverOut {
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
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes slideFromBottom {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes slideFromLeft {
    from {
      opacity: 0;
      transform: translateX(-8px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes slideFromRight {
    from {
      opacity: 0;
      transform: translateX(8px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

interface PopoverContentProps extends React.ComponentProps<typeof PopoverPrimitive.Content> {
  isDark?: boolean;
}

function Popover(props: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root {...props} />;
}

function PopoverTrigger(props: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger {...props} />;
}

function PopoverContent({
  className,
  isDark,
  align = "center",
  sideOffset = 4,
  ...props
}: PopoverContentProps) {
  return (
    <PopoverPrimitive.Portal>
      <StyledContent
        $isDark={isDark}
        align={align}
        sideOffset={sideOffset}
        className={className}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}

function PopoverAnchor(props: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor {...props} />;
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
