"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import styled from "styled-components";
import { ChevronDown } from "lucide-react";

const StyledItem = styled(AccordionPrimitive.Item)<{ $isDark?: boolean }>`
  border-bottom: 1px solid;
  border-color: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  
  &:last-child {
    border-bottom: 0;
  }
`;

const StyledHeader = styled(AccordionPrimitive.Header)`
  display: flex;
`;

const StyledTrigger = styled(AccordionPrimitive.Trigger)<{ $isDark?: boolean }>`
  display: flex;
  flex: 1;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  border-radius: 8px;
  padding: 16px 0;
  text-align: left;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.2s ease;
  outline: none;
  background: transparent;
  border: none;
  cursor: pointer;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  
  &:hover {
    text-decoration: underline;
  }
  
  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px ${props => props.$isDark ? 'rgba(78, 205, 196, 0.3)' : 'rgba(0, 122, 255, 0.3)'};
  }
  
  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }
  
  &[data-state="open"] svg {
    transform: rotate(180deg);
  }
  
  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    transform: rotate(0deg);
    transition: transform 0.2s ease;
    color: ${props => props.$isDark ? '#86868b' : '#6e6e73'};
    pointer-events: none;
    margin-top: 2px;
  }
`;

const StyledContent = styled(AccordionPrimitive.Content)`
  overflow: hidden;
  font-size: 14px;
  transition: all 0.2s ease;
  
  &[data-state="closed"] {
    animation: slideUp 0.2s ease-out;
  }
  
  &[data-state="open"] {
    animation: slideDown 0.2s ease-out;
  }
  
  @keyframes slideDown {
    from {
      height: 0;
    }
    to {
      height: var(--radix-accordion-content-height);
    }
  }
  
  @keyframes slideUp {
    from {
      height: var(--radix-accordion-content-height);
    }
    to {
      height: 0;
    }
  }
`;

const ContentInner = styled.div`
  padding: 0 0 16px;
`;

interface AccordionItemProps extends React.ComponentProps<typeof AccordionPrimitive.Item> {
  isDark?: boolean;
}

interface AccordionTriggerProps extends React.ComponentProps<typeof AccordionPrimitive.Trigger> {
  isDark?: boolean;
}

function Accordion(props: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root {...props} />;
}

function AccordionItem({ className, isDark, ...props }: AccordionItemProps) {
  return (
    <StyledItem
      $isDark={isDark}
      className={className}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  isDark,
  children,
  ...props
}: AccordionTriggerProps) {
  return (
    <StyledHeader>
      <StyledTrigger
        $isDark={isDark}
        className={className}
        {...props}
      >
        {children}
        <ChevronDown />
      </StyledTrigger>
    </StyledHeader>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <StyledContent {...props}>
      <ContentInner className={className}>{children}</ContentInner>
    </StyledContent>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
