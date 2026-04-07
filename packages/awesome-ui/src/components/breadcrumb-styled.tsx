import * as React from "react";
import styled from "styled-components";
import { ChevronRight, MoreHorizontal } from "lucide-react";

const StyledBreadcrumb = styled.nav`
  width: 100%;
`;

const StyledBreadcrumbList = styled.ol`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  list-style: none;
  margin: 0;
  padding: 0;
  font-size: 14px;

  @media (max-width: 640px) {
    gap: 6px;
  }
`;

const StyledBreadcrumbItem = styled.li`
  display: inline-flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 640px) {
    gap: 6px;
  }
`;

const StyledBreadcrumbLink = styled.a<{ $isDark?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 8px;
  color: ${props => props.$isDark ? '#86868b' : '#6e6e73'};
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
    background: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)'};
  }

  svg {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
  }
`;

const StyledBreadcrumbPage = styled.span<{ $isDark?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  font-weight: 500;

  svg {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
  }
`;

const StyledBreadcrumbSeparator = styled.li<{ $isDark?: boolean }>`
  display: flex;
  align-items: center;
  color: ${props => props.$isDark ? '#86868b' : '#6e6e73'};

  svg {
    width: 14px;
    height: 14px;
  }
`;

const StyledBreadcrumbEllipsis = styled.span<{ $isDark?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  color: ${props => props.$isDark ? '#86868b' : '#6e6e73'};

  svg {
    width: 16px;
    height: 16px;
  }
`;

interface BreadcrumbLinkProps extends React.ComponentProps<"a"> {
  isDark?: boolean;
}

interface BreadcrumbPageProps extends React.ComponentProps<"span"> {
  isDark?: boolean;
}

interface BreadcrumbSeparatorProps extends React.ComponentProps<"li"> {
  isDark?: boolean;
}

interface BreadcrumbEllipsisProps extends React.ComponentProps<"span"> {
  isDark?: boolean;
}

function BreadcrumbStyled({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <StyledBreadcrumb
      aria-label="breadcrumb"
      className={className}
      {...props}
    />
  );
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
  return <StyledBreadcrumbList className={className} {...props} />;
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  return <StyledBreadcrumbItem className={className} {...props} />;
}

function BreadcrumbLink({ className, isDark, ...props }: BreadcrumbLinkProps) {
  return (
    <StyledBreadcrumbLink
      $isDark={isDark}
      className={className}
      {...props}
    />
  );
}

function BreadcrumbPage({ className, isDark, ...props }: BreadcrumbPageProps) {
  return (
    <StyledBreadcrumbPage
      $isDark={isDark}
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={className}
      {...props}
    />
  );
}

function BreadcrumbSeparator({
  children,
  className,
  isDark,
  ...props
}: BreadcrumbSeparatorProps) {
  return (
    <StyledBreadcrumbSeparator
      $isDark={isDark}
      role="presentation"
      aria-hidden="true"
      className={className}
      {...props}
    >
      {children ?? <ChevronRight />}
    </StyledBreadcrumbSeparator>
  );
}

function BreadcrumbEllipsis({
  className,
  isDark,
  ...props
}: BreadcrumbEllipsisProps) {
  return (
    <StyledBreadcrumbEllipsis
      $isDark={isDark}
      role="presentation"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <MoreHorizontal />
      <span style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', borderWidth: 0 }}>
        More
      </span>
    </StyledBreadcrumbEllipsis>
  );
}

export {
  BreadcrumbStyled,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};
