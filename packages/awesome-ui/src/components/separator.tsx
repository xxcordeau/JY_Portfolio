"use client";

import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";
import styled from "styled-components";

const StyledSeparator = styled(SeparatorPrimitive.Root)<{ $isDark?: boolean }>`
  flex-shrink: 0;
  background: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  
  &[data-orientation="horizontal"] {
    height: 1px;
    width: 100%;
  }
  
  &[data-orientation="vertical"] {
    height: 100%;
    width: 1px;
  }
`;

interface SeparatorProps extends React.ComponentProps<typeof SeparatorPrimitive.Root> {
  isDark?: boolean;
}

function Separator({
  className,
  isDark,
  orientation = "horizontal",
  decorative = true,
  ...props
}: SeparatorProps) {
  return (
    <StyledSeparator
      $isDark={isDark}
      decorative={decorative}
      orientation={orientation}
      className={className}
      {...props}
    />
  );
}

export { Separator };
