"use client";

import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";
import styled from "styled-components";

const StyledOverlay = styled(DrawerPrimitive.Overlay)<{ $isDark?: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 50;
  background: rgba(0, 0, 0, 0.5);
  
  &[data-state="open"] {
    animation: fadeIn 0.2s ease-out;
  }
  
  &[data-state="closed"] {
    animation: fadeOut 0.2s ease-in;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
`;

const StyledContent = styled(DrawerPrimitive.Content)<{ $isDark?: boolean }>`
  position: fixed;
  z-index: 50;
  display: flex;
  height: auto;
  flex-direction: column;
  background: ${props => props.$isDark ? 'rgba(20, 20, 20, 0.98)' : 'rgba(255, 255, 255, 0.98)'};
  border: 1px solid ${props => props.$isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'};
  backdrop-filter: blur(40px);
  box-shadow: ${props => props.$isDark 
    ? '0 20px 60px rgba(0, 0, 0, 0.5)' 
    : '0 20px 60px rgba(0, 0, 0, 0.15)'};
  
  /* Bottom drawer (default) */
  &[data-vaul-drawer-direction="bottom"] {
    inset-left: 0;
    inset-right: 0;
    bottom: 0;
    margin-top: 96px;
    max-height: 80vh;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
  }
  
  /* Top drawer */
  &[data-vaul-drawer-direction="top"] {
    inset-left: 0;
    inset-right: 0;
    top: 0;
    margin-bottom: 96px;
    max-height: 80vh;
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
  }
  
  /* Right drawer */
  &[data-vaul-drawer-direction="right"] {
    inset-top: 0;
    inset-bottom: 0;
    right: 0;
    width: 75%;
    border-left: 1px solid ${props => props.$isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'};
    border-top-left-radius: 12px;
    border-bottom-left-radius: 12px;
    
    @media (min-width: 640px) {
      max-width: 384px;
    }
  }
  
  /* Left drawer */
  &[data-vaul-drawer-direction="left"] {
    inset-top: 0;
    inset-bottom: 0;
    left: 0;
    width: 75%;
    border-right: 1px solid ${props => props.$isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'};
    border-top-right-radius: 12px;
    border-bottom-right-radius: 12px;
    
    @media (min-width: 640px) {
      max-width: 384px;
    }
  }
`;

const DrawerHandle = styled.div<{ $isDark?: boolean }>`
  margin: 16px auto 0;
  display: none;
  height: 8px;
  width: 100px;
  flex-shrink: 0;
  border-radius: 4px;
  background: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'};
  
  [data-vaul-drawer-direction="bottom"] & {
    display: block;
  }
`;

const StyledHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 16px;
`;

const StyledFooter = styled.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
`;

const StyledTitle = styled(DrawerPrimitive.Title)<{ $isDark?: boolean }>`
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
`;

const StyledDescription = styled(DrawerPrimitive.Description)<{ $isDark?: boolean }>`
  font-size: 14px;
  color: ${props => props.$isDark ? '#86868b' : '#6e6e73'};
`;

interface DrawerContentProps extends React.ComponentProps<typeof DrawerPrimitive.Content> {
  isDark?: boolean;
}

interface DrawerTitleProps extends React.ComponentProps<typeof DrawerPrimitive.Title> {
  isDark?: boolean;
}

interface DrawerDescriptionProps extends React.ComponentProps<typeof DrawerPrimitive.Description> {
  isDark?: boolean;
}

function Drawer(props: React.ComponentProps<typeof DrawerPrimitive.Root>) {
  return <DrawerPrimitive.Root {...props} />;
}

function DrawerTrigger(props: React.ComponentProps<typeof DrawerPrimitive.Trigger>) {
  return <DrawerPrimitive.Trigger {...props} />;
}

function DrawerPortal(props: React.ComponentProps<typeof DrawerPrimitive.Portal>) {
  return <DrawerPrimitive.Portal {...props} />;
}

function DrawerClose(props: React.ComponentProps<typeof DrawerPrimitive.Close>) {
  return <DrawerPrimitive.Close {...props} />;
}

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay> & { isDark?: boolean }
>(({ className, isDark, ...props }, ref) => {
  return (
    <StyledOverlay
      ref={ref}
      $isDark={isDark}
      className={className}
      {...props}
    />
  );
});
DrawerOverlay.displayName = "DrawerOverlay";

function DrawerContent({ className, isDark, children, ...props }: DrawerContentProps) {
  return (
    <DrawerPortal>
      <DrawerOverlay isDark={isDark} />
      <StyledContent $isDark={isDark} className={className} {...props}>
        <DrawerHandle $isDark={isDark} />
        {children}
      </StyledContent>
    </DrawerPortal>
  );
}

function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <StyledHeader className={className} {...props} />;
}

function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <StyledFooter className={className} {...props} />;
}

function DrawerTitle({ className, isDark, ...props }: DrawerTitleProps) {
  return <StyledTitle $isDark={isDark} className={className} {...props} />;
}

function DrawerDescription({ className, isDark, ...props }: DrawerDescriptionProps) {
  return <StyledDescription $isDark={isDark} className={className} {...props} />;
}

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
