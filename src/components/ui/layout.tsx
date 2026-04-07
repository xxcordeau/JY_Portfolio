import * as React from "react";
import styled from "styled-components";

// Panel - Card와 비슷하지만 더 간단한 패널
const StyledPanel = styled.div<{ $isDark?: boolean }>`
  border-radius: 12px;
  padding: 20px;
  background: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)'};
  backdrop-filter: blur(20px);
  border: 1px solid ${props => props.$isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'};
`;

// Section - 큰 영역 구분
const StyledSection = styled.section<{ $isDark?: boolean }>`
  width: 100%;
  padding: 60px 20px;
  
  @media (max-width: 768px) {
    padding: 40px 20px;
  }
`;

// Grid - CSS Grid 레이아웃
const StyledGrid = styled.div<{ 
  $columns?: number;
  $gap?: string;
  $minColumnWidth?: string;
}>`
  display: grid;
  grid-template-columns: ${props => 
    props.$minColumnWidth 
      ? `repeat(auto-fit, minmax(${props.$minColumnWidth}, 1fr))` 
      : `repeat(${props.$columns || 1}, 1fr)`};
  gap: ${props => props.$gap || '16px'};
`;

// Stack - Flex 세로 레이아웃
const StyledStack = styled.div<{ 
  $gap?: string;
  $align?: string;
  $justify?: string;
}>`
  display: flex;
  flex-direction: column;
  gap: ${props => props.$gap || '16px'};
  align-items: ${props => props.$align || 'stretch'};
  justify-content: ${props => props.$justify || 'flex-start'};
`;

// Flex - Flex 가로 레이아웃
const StyledFlex = styled.div<{ 
  $gap?: string;
  $align?: string;
  $justify?: string;
  $wrap?: boolean;
}>`
  display: flex;
  flex-direction: row;
  gap: ${props => props.$gap || '16px'};
  align-items: ${props => props.$align || 'center'};
  justify-content: ${props => props.$justify || 'flex-start'};
  flex-wrap: ${props => props.$wrap ? 'wrap' : 'nowrap'};
`;

// Container - 최대 너비 제한 컨테이너
const StyledContainer = styled.div<{ $maxWidth?: string }>`
  width: 100%;
  max-width: ${props => props.$maxWidth || '1200px'};
  margin: 0 auto;
  padding: 0 20px;
`;

// Component Props Interfaces
interface PanelProps extends React.ComponentProps<"div"> {
  isDark?: boolean;
}

interface SectionProps extends React.ComponentProps<"section"> {
  isDark?: boolean;
}

interface GridProps extends React.ComponentProps<"div"> {
  columns?: number;
  gap?: string;
  minColumnWidth?: string;
}

interface StackProps extends React.ComponentProps<"div"> {
  gap?: string;
  align?: string;
  justify?: string;
}

interface FlexProps extends React.ComponentProps<"div"> {
  gap?: string;
  align?: string;
  justify?: string;
  wrap?: boolean;
}

interface ContainerProps extends React.ComponentProps<"div"> {
  maxWidth?: string;
}

// Panel Component
function Panel({ className, isDark, ...props }: PanelProps) {
  return <StyledPanel $isDark={isDark} className={className} {...props} />;
}

// Section Component
function Section({ className, isDark, ...props }: SectionProps) {
  return <StyledSection $isDark={isDark} className={className} {...props} />;
}

// Grid Component
function Grid({ className, columns, gap, minColumnWidth, ...props }: GridProps) {
  return (
    <StyledGrid
      $columns={columns}
      $gap={gap}
      $minColumnWidth={minColumnWidth}
      className={className}
      {...props}
    />
  );
}

// Stack Component
function Stack({ className, gap, align, justify, ...props }: StackProps) {
  return (
    <StyledStack
      $gap={gap}
      $align={align}
      $justify={justify}
      className={className}
      {...props}
    />
  );
}

// Flex Component
function Flex({ className, gap, align, justify, wrap, ...props }: FlexProps) {
  return (
    <StyledFlex
      $gap={gap}
      $align={align}
      $justify={justify}
      $wrap={wrap}
      className={className}
      {...props}
    />
  );
}

// Container Component
function Container({ className, maxWidth, ...props }: ContainerProps) {
  return (
    <StyledContainer
      $maxWidth={maxWidth}
      className={className}
      {...props}
    />
  );
}

export {
  Panel,
  Section,
  Grid,
  Stack,
  Flex,
  Container,
};
