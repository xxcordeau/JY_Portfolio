"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import styled from "styled-components";

const StyledAvatarRoot = styled(AvatarPrimitive.Root)`
  position: relative;
  display: flex;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 50%;
`;

const StyledAvatarImage = styled(AvatarPrimitive.Image)`
  aspect-ratio: 1;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const StyledAvatarFallback = styled(AvatarPrimitive.Fallback)<{ $isDark?: boolean }>`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  font-size: 14px;
  font-weight: 600;
`;

interface AvatarProps extends React.ComponentProps<typeof AvatarPrimitive.Root> {
  size?: number;
}

interface AvatarFallbackProps extends React.ComponentProps<typeof AvatarPrimitive.Fallback> {
  isDark?: boolean;
}

function Avatar({ className, size, style, ...props }: AvatarProps) {
  return (
    <StyledAvatarRoot 
      className={className} 
      style={{ 
        width: size ? `${size}px` : '40px',
        height: size ? `${size}px` : '40px',
        ...style 
      }}
      {...props} 
    />
  );
}

function AvatarImage({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return <StyledAvatarImage className={className} {...props} />;
}

function AvatarFallback({ className, isDark, ...props }: AvatarFallbackProps) {
  return <StyledAvatarFallback $isDark={isDark} className={className} {...props} />;
}

export { Avatar, AvatarImage, AvatarFallback };
