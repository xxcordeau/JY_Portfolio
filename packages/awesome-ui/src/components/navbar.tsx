import * as React from "react";
import styled from "styled-components";

const StyledNavbar = styled.nav<{ $isDark?: boolean; $transparent?: boolean; $sticky?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  height: 64px;
  padding: 0 24px;
  position: ${props => props.$sticky ? 'sticky' : 'relative'};
  top: 0;
  z-index: 100;
  background: ${props => {
    if (props.$transparent) return 'transparent';
    return props.$isDark ? 'rgba(20, 20, 20, 0.8)' : 'rgba(255, 255, 255, 0.8)';
  }};
  border-bottom: 1px solid ${props => props.$isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'};
  backdrop-filter: blur(20px);
  transition: all 0.2s ease;

  @media (max-width: 768px) {
    height: 56px;
    padding: 0 16px;
    gap: 12px;
  }
`;

const StyledNavbarBrand = styled.div<{ $isDark?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  text-decoration: none;
  transition: opacity 0.2s ease;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }

  svg {
    width: 28px;
    height: 28px;
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    font-size: 16px;
    
    svg {
      width: 24px;
      height: 24px;
    }
  }
`;

const StyledNavbarContent = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
`;

const StyledNavbarMenu = styled.ul`
  display: flex;
  align-items: center;
  gap: 4px;
  list-style: none;
  margin: 0;
  padding: 0;

  @media (max-width: 768px) {
    display: none;
  }
`;

const StyledNavbarItem = styled.li`
  display: flex;
  align-items: center;
`;

const StyledNavbarLink = styled.a<{ $isDark?: boolean; $active?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 36px;
  padding: 0 16px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  color: ${props => {
    if (props.$active) return props.$isDark ? '#f5f5f7' : '#1d1d1f';
    return props.$isDark ? '#86868b' : '#6e6e73';
  }};
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
  background: ${props => props.$active 
    ? (props.$isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)')
    : 'transparent'
  };

  &:hover {
    background: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)'};
    color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  }

  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    font-size: 13px;
    padding: 0 12px;
    height: 32px;
  }
`;

const StyledNavbarActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
`;

const StyledAppBar = styled(StyledNavbar)`
  height: 56px;
  padding: 0 20px;

  @media (max-width: 768px) {
    height: 52px;
    padding: 0 16px;
  }
`;

const StyledHeader = styled.header<{ $isDark?: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  background: ${props => props.$isDark ? 'rgba(20, 20, 20, 0.8)' : 'rgba(255, 255, 255, 0.8)'};
  border-bottom: 1px solid ${props => props.$isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'};
  backdrop-filter: blur(20px);
`;

const StyledHeaderTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  height: 56px;
  padding: 0 24px;

  @media (max-width: 768px) {
    height: 52px;
    padding: 0 16px;
    gap: 12px;
  }
`;

const StyledHeaderBottom = styled.div<{ $isDark?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  border-top: 1px solid ${props => props.$isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'};

  @media (max-width: 768px) {
    padding: 12px 16px;
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
    
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

interface NavbarProps extends Omit<React.ComponentProps<"nav">, 'ref'> {
  isDark?: boolean;
  transparent?: boolean;
  sticky?: boolean;
}

interface NavbarBrandProps extends React.ComponentProps<"div"> {
  isDark?: boolean;
  asChild?: boolean;
}

interface NavbarLinkProps extends React.ComponentProps<"a"> {
  isDark?: boolean;
  active?: boolean;
  asChild?: boolean;
}

interface HeaderProps extends React.ComponentProps<"header"> {
  isDark?: boolean;
}

interface HeaderBottomProps extends React.ComponentProps<"div"> {
  isDark?: boolean;
}

function Navbar({ className, isDark, transparent, sticky, children, ...props }: NavbarProps) {
  return (
    <StyledNavbar
      $isDark={isDark}
      $transparent={transparent}
      $sticky={sticky}
      className={className}
      {...props}
    >
      {children}
    </StyledNavbar>
  );
}

function NavbarBrand({ className, isDark, children, ...props }: NavbarBrandProps) {
  return (
    <StyledNavbarBrand
      $isDark={isDark}
      className={className}
      {...props}
    >
      {children}
    </StyledNavbarBrand>
  );
}

function NavbarContent({ className, ...props }: React.ComponentProps<"div">) {
  return <StyledNavbarContent className={className} {...props} />;
}

function NavbarMenu({ className, ...props }: React.ComponentProps<"ul">) {
  return <StyledNavbarMenu className={className} {...props} />;
}

function NavbarItem({ className, ...props }: React.ComponentProps<"li">) {
  return <StyledNavbarItem className={className} {...props} />;
}

function NavbarLink({ className, isDark, active, children, ...props }: NavbarLinkProps) {
  return (
    <StyledNavbarLink
      $isDark={isDark}
      $active={active}
      className={className}
      {...props}
    >
      {children}
    </StyledNavbarLink>
  );
}

function NavbarActions({ className, ...props }: React.ComponentProps<"div">) {
  return <StyledNavbarActions className={className} {...props} />;
}

function AppBar({ className, isDark, transparent, sticky, children, ...props }: NavbarProps) {
  return (
    <StyledAppBar
      as="header"
      $isDark={isDark}
      $transparent={transparent}
      $sticky={sticky}
      className={className}
      {...props}
    >
      {children}
    </StyledAppBar>
  );
}

function Header({ className, isDark, children, ...props }: HeaderProps) {
  return (
    <StyledHeader
      $isDark={isDark}
      className={className}
      {...props}
    >
      {children}
    </StyledHeader>
  );
}

function HeaderTop({ className, ...props }: React.ComponentProps<"div">) {
  return <StyledHeaderTop className={className} {...props} />;
}

function HeaderBottom({ className, isDark, ...props }: HeaderBottomProps) {
  return (
    <StyledHeaderBottom
      $isDark={isDark}
      className={className}
      {...props}
    />
  );
}

export {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarMenu,
  NavbarItem,
  NavbarLink,
  NavbarActions,
  AppBar,
  Header,
  HeaderTop,
  HeaderBottom,
};
