"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import styled from "styled-components";
import { X } from "lucide-react";

const StyledOverlay = styled(DialogPrimitive.Overlay)<{ $isDark?: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 50;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  
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

const StyledContent = styled(DialogPrimitive.Content)<{ $isDark?: boolean }>`
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 50;
  width: calc(100% - 32px);
  max-width: 500px;
  transform: translate(-50%, -50%);
  display: grid;
  gap: 16px;
  border-radius: 12px;
  border: 1px solid;
  padding: 24px;
  background: ${props => props.$isDark ? '#1a1a1a' : '#ffffff'};
  border-color: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  box-shadow: ${props => props.$isDark 
    ? '0 20px 60px rgba(0, 0, 0, 0.6)' 
    : '0 20px 60px rgba(0, 0, 0, 0.15)'};
  backdrop-filter: blur(20px);
  
  &[data-state="open"] {
    animation: dialogIn 0.2s ease-out;
  }
  
  &[data-state="closed"] {
    animation: dialogOut 0.2s ease-in;
  }
  
  @keyframes dialogIn {
    from {
      opacity: 0;
      transform: translate(-50%, -48%) scale(0.96);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }
  
  @keyframes dialogOut {
    from {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
    to {
      opacity: 0;
      transform: translate(-50%, -48%) scale(0.96);
    }
  }
`;

const StyledCloseButton = styled(DialogPrimitive.Close)<{ $isDark?: boolean }>`
  position: absolute;
  top: 16px;
  right: 16px;
  opacity: 0.7;
  border-radius: 6px;
  padding: 4px;
  transition: all 0.2s ease;
  border: none;
  background: transparent;
  cursor: pointer;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  
  &:hover {
    opacity: 1;
    background: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${props => props.$isDark ? 'rgba(78, 205, 196, 0.3)' : 'rgba(0, 122, 255, 0.3)'};
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const StyledHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: center;
  
  @media (min-width: 640px) {
    text-align: left;
  }
`;

const StyledFooter = styled.div`
  display: flex;
  flex-direction: column-reverse;
  gap: 8px;
  
  @media (min-width: 640px) {
    flex-direction: row;
    justify-content: flex-end;
  }
`;

const StyledTitle = styled(DialogPrimitive.Title)<{ $isDark?: boolean }>`
  font-size: 18px;
  font-weight: 600;
  line-height: 1.3;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
`;

const StyledDescription = styled(DialogPrimitive.Description)<{ $isDark?: boolean }>`
  font-size: 14px;
  line-height: 1.5;
  color: ${props => props.$isDark ? '#86868b' : '#6e6e73'};
`;

interface DialogContentProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  isDark?: boolean;
}

interface DialogTitleProps extends React.ComponentProps<typeof DialogPrimitive.Title> {
  isDark?: boolean;
}

interface DialogDescriptionProps extends React.ComponentProps<typeof DialogPrimitive.Description> {
  isDark?: boolean;
}

function Dialog(props: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root {...props} />;
}

function DialogTrigger(props: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger {...props} />;
}

function DialogPortal(props: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal {...props} />;
}

function DialogClose(props: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close {...props} />;
}

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> & { isDark?: boolean }
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
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(({ className, isDark, children, ...props }, ref) => {
  return (
    <DialogPortal>
      <DialogOverlay isDark={isDark} />
      <StyledContent
        ref={ref}
        $isDark={isDark}
        className={className}
        {...props}
      >
        {children}
        <StyledCloseButton $isDark={isDark}>
          <X />
          <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden' }}>
            Close
          </span>
        </StyledCloseButton>
      </StyledContent>
    </DialogPortal>
  );
});
DialogContent.displayName = DialogPrimitive.Content.displayName;

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <StyledHeader className={className} {...props} />;
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <StyledFooter className={className} {...props} />;
}

function DialogTitle({ className, isDark, ...props }: DialogTitleProps) {
  return <StyledTitle $isDark={isDark} className={className} {...props} />;
}

function DialogDescription({ className, isDark, ...props }: DialogDescriptionProps) {
  return <StyledDescription $isDark={isDark} className={className} {...props} />;
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
