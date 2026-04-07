import * as React from "react";
import styled from "styled-components";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";

const StyledPagination = styled.nav`
  display: flex;
  width: 100%;
  justify-content: center;
  margin: 0 auto;
`;

const StyledPaginationContent = styled.ul`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  list-style: none;
  margin: 0;
  padding: 0;
`;

const StyledPaginationItem = styled.li`
  display: flex;
  align-items: center;
`;

const StyledPaginationLink = styled.a<{ 
  $isDark?: boolean; 
  $active?: boolean;
  $size?: 'default' | 'sm' | 'lg';
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-width: ${props => props.$size === 'sm' ? '32px' : '36px'};
  height: ${props => props.$size === 'sm' ? '32px' : '36px'};
  padding: ${props => props.$size === 'sm' ? '0 8px' : '0 12px'};
  border-radius: 10px;
  border: 1px solid transparent;
  font-size: ${props => props.$size === 'sm' ? '13px' : '14px'};
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  outline: none;
  white-space: nowrap;
  
  background: ${props => {
    if (props.$active) {
      return props.$isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';
    }
    return 'transparent';
  }};
  
  border-color: ${props => {
    if (props.$active) {
      return props.$isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)';
    }
    return 'transparent';
  }};
  
  color: ${props => {
    if (props.$active) {
      return props.$isDark ? '#f5f5f7' : '#1d1d1f';
    }
    return props.$isDark ? '#86868b' : '#6e6e73';
  }};

  &:hover:not([aria-disabled="true"]) {
    background: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)'};
    color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  }

  &:focus-visible {
    box-shadow: 0 0 0 3px ${props => props.$isDark ? 'rgba(78, 205, 196, 0.3)' : 'rgba(0, 122, 255, 0.3)'};
  }

  &[aria-disabled="true"] {
    pointer-events: none;
    opacity: 0.4;
    cursor: not-allowed;
  }

  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }

  span {
    @media (max-width: 640px) {
      &.pagination-text {
        display: none;
      }
    }
  }
`;

const StyledPaginationEllipsis = styled.span<{ $isDark?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  color: ${props => props.$isDark ? '#86868b' : '#6e6e73'};

  svg {
    width: 16px;
    height: 16px;
  }
`;

interface PaginationLinkProps extends React.ComponentProps<"a"> {
  isDark?: boolean;
  active?: boolean;
  size?: 'default' | 'sm' | 'lg';
}

interface PaginationEllipsisProps extends React.ComponentProps<"span"> {
  isDark?: boolean;
}

function PaginationStyled({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <StyledPagination
      role="navigation"
      aria-label="pagination"
      className={className}
      {...props}
    />
  );
}

function PaginationContent({ className, ...props }: React.ComponentProps<"ul">) {
  return <StyledPaginationContent className={className} {...props} />;
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <StyledPaginationItem {...props} />;
}

function PaginationLink({
  className,
  isDark,
  active,
  size = 'default',
  ...props
}: PaginationLinkProps) {
  return (
    <StyledPaginationLink
      aria-current={active ? "page" : undefined}
      $isDark={isDark}
      $active={active}
      $size={size}
      className={className}
      {...props}
    />
  );
}

function PaginationPrevious({
  className,
  isDark,
  disabled,
  ...props
}: PaginationLinkProps & { disabled?: boolean }) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      aria-disabled={disabled}
      isDark={isDark}
      className={className}
      {...props}
    >
      <ChevronLeftIcon />
      <span className="pagination-text">Previous</span>
    </PaginationLink>
  );
}

function PaginationNext({
  className,
  isDark,
  disabled,
  ...props
}: PaginationLinkProps & { disabled?: boolean }) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      aria-disabled={disabled}
      isDark={isDark}
      className={className}
      {...props}
    >
      <span className="pagination-text">Next</span>
      <ChevronRightIcon />
    </PaginationLink>
  );
}

function PaginationEllipsis({
  className,
  isDark,
  ...props
}: PaginationEllipsisProps) {
  return (
    <StyledPaginationEllipsis
      aria-hidden
      $isDark={isDark}
      className={className}
      {...props}
    >
      <MoreHorizontalIcon />
      <span style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', borderWidth: 0 }}>
        More pages
      </span>
    </StyledPaginationEllipsis>
  );
}

export {
  PaginationStyled,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
