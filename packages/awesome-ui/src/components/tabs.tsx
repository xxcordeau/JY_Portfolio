"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import styled from "styled-components";

const StyledTabs = styled(TabsPrimitive.Root)`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StyledTabsList = styled(TabsPrimitive.List)<{ $isDark?: boolean }>`
  display: inline-flex;
  height: 40px;
  width: fit-content;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  padding: 3px;
  background: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
  color: ${props => props.$isDark ? '#86868b' : '#6e6e73'};
`;

const StyledTabsTrigger = styled(TabsPrimitive.Trigger)<{ $isDark?: boolean }>`
  display: inline-flex;
  height: calc(100% - 2px);
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border-radius: 10px;
  border: 1px solid transparent;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  transition: all 0.2s ease;
  outline: none;
  cursor: pointer;
  background: transparent;
  color: ${props => props.$isDark ? '#86868b' : '#6e6e73'};
  
  &[data-state="active"] {
    background: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.08)' : '#ffffff'};
    color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
    border-color: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)'};
    box-shadow: ${props => props.$isDark 
      ? '0 2px 8px rgba(0, 0, 0, 0.2)' 
      : '0 2px 8px rgba(0, 0, 0, 0.05)'};
  }
  
  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px ${props => props.$isDark ? 'rgba(78, 205, 196, 0.3)' : 'rgba(0, 122, 255, 0.3)'};
  }
  
  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }
  
  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    pointer-events: none;
  }
`;

const StyledTabsContent = styled(TabsPrimitive.Content)`
  flex: 1;
  outline: none;
`;

interface TabsListProps extends React.ComponentProps<typeof TabsPrimitive.List> {
  isDark?: boolean;
}

interface TabsTriggerProps extends React.ComponentProps<typeof TabsPrimitive.Trigger> {
  isDark?: boolean;
}

function Tabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return <StyledTabs className={className} {...props} />;
}

function TabsList({ className, isDark, ...props }: TabsListProps) {
  return (
    <StyledTabsList
      $isDark={isDark}
      className={className}
      {...props}
    />
  );
}

function TabsTrigger({ className, isDark, ...props }: TabsTriggerProps) {
  return (
    <StyledTabsTrigger
      $isDark={isDark}
      className={className}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <StyledTabsContent
      className={className}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
