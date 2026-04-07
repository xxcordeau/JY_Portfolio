"use client";

import * as React from "react";
import styled from "styled-components";
import { PanelLeftIcon, X } from "lucide-react";

// Sidebar Context
type SidebarContextProps = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContextProps | null>(null);

function useSidebarStyled() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebarStyled must be used within a SidebarStyledProvider.");
  }
  return context;
}

// Styled Components
const StyledSidebarWrapper = styled.div`
  display: flex;
  min-height: 100%;
  height: 100%;
  width: 100%;
  position: relative;
`;

const StyledSidebar = styled.div<{ 
  $isDark?: boolean; 
  $state?: "expanded" | "collapsed";
  $side?: "left" | "right";
  $variant?: "sidebar" | "floating" | "inset";
}>`
  position: absolute;
  ${props => props.$side === "right" ? "right: 0;" : "left: 0;"}
  top: 0;
  height: 100%;
  width: ${props => props.$state === "collapsed" ? "60px" : "256px"};
  background: ${props => props.$isDark ? 'rgba(20, 20, 20, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
  border-${props => props.$side === "right" ? "left" : "right"}: 1px solid ${props => props.$isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'};
  backdrop-filter: blur(20px);
  transition: width 0.2s ease;
  z-index: 50;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  ${props => props.$variant === "floating" && `
    margin: 8px;
    height: calc(100vh - 16px);
    border-radius: 12px;
    border: 1px solid ${props.$isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'};
    box-shadow: ${props.$isDark ? '0 8px 32px rgba(0, 0, 0, 0.4)' : '0 8px 32px rgba(0, 0, 0, 0.08)'};
  `}

  @media (max-width: 768px) {
    transform: translateX(${props => {
      if (props.$side === "right") {
        return "100%";
      }
      return "-100%";
    }});
    width: 288px;
  }
`;

const StyledSidebarMobileOverlay = styled.div<{ $visible?: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 40;
  opacity: ${props => props.$visible ? 1 : 0};
  pointer-events: ${props => props.$visible ? 'auto' : 'none'};
  transition: opacity 0.2s ease;

  @media (min-width: 769px) {
    display: none;
  }
`;

const StyledSidebarMobile = styled(StyledSidebar)<{ $open?: boolean }>`
  @media (max-width: 768px) {
    transform: translateX(${props => {
      if (props.$open) return "0";
      if (props.$side === "right") return "100%";
      return "-100%";
    }});
  }
`;

const StyledSidebarHeader = styled.div<{ $isDark?: boolean; $collapsed?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: ${props => props.$collapsed ? '16px 10px' : '16px'};
  border-bottom: 1px solid ${props => props.$isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'};
  flex-shrink: 0;
  align-items: ${props => props.$collapsed ? 'center' : 'stretch'};
  transition: padding 0.2s ease;
`;

const StyledSidebarContent = styled.div<{ $collapsed?: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: ${props => props.$collapsed ? '16px 10px' : '16px'};
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0;
  align-items: ${props => props.$collapsed ? 'center' : 'stretch'};
  transition: padding 0.2s ease;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(128, 128, 128, 0.3);
    border-radius: 2px;
  }
`;

const StyledSidebarFooter = styled.div<{ $isDark?: boolean; $collapsed?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: ${props => props.$collapsed ? '16px 10px' : '16px'};
  border-top: 1px solid ${props => props.$isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'};
  flex-shrink: 0;
  align-items: ${props => props.$collapsed ? 'center' : 'stretch'};
  transition: padding 0.2s ease;
`;

const StyledSidebarGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
`;

const StyledSidebarGroupLabel = styled.div<{ $isDark?: boolean; $collapsed?: boolean }>`
  display: flex;
  align-items: center;
  height: 32px;
  padding: 0 12px;
  font-size: 12px;
  font-weight: 600;
  color: ${props => props.$isDark ? '#86868b' : '#6e6e73'};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  overflow: hidden;
  white-space: nowrap;
  opacity: ${props => props.$collapsed ? 0 : 1};
  transition: opacity 0.2s ease;
`;

const StyledSidebarMenu = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 2px;
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;
`;

const StyledSidebarMenuItem = styled.li`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const StyledSidebarMenuButton = styled.button<{ 
  $isDark?: boolean; 
  $active?: boolean;
  $collapsed?: boolean;
}>`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  height: 40px;
  padding: ${props => props.$collapsed ? '0' : '0 12px'};
  border-radius: 10px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  outline: none;
  justify-content: ${props => props.$collapsed ? 'center' : 'flex-start'};
  background: ${props => {
    if (props.$active) {
      return props.$isDark ? 'rgba(78, 205, 196, 0.15)' : 'rgba(0, 122, 255, 0.1)';
    }
    return 'transparent';
  }};
  color: ${props => {
    if (props.$active) {
      return props.$isDark ? '#4ECDC4' : '#007AFF';
    }
    return props.$isDark ? '#f5f5f7' : '#1d1d1f';
  }};

  &:hover {
    background: ${props => {
      if (props.$active) {
        return props.$isDark ? 'rgba(78, 205, 196, 0.2)' : 'rgba(0, 122, 255, 0.15)';
      }
      return props.$isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)';
    }};
  }

  &:focus-visible {
    box-shadow: 0 0 0 3px ${props => props.$isDark ? 'rgba(78, 205, 196, 0.3)' : 'rgba(0, 122, 255, 0.3)'};
  }

  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }

  span {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: ${props => props.$collapsed ? 'none' : 'block'};
  }
`;

const StyledSidebarMenuSub = styled.ul<{ $isDark?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 2px;
  list-style: none;
  margin: 4px 0 0 32px;
  padding: 0;
  border-left: 1px solid ${props => props.$isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'};
  padding-left: 12px;
`;

const StyledSidebarToggle = styled.button<{ $isDark?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: none;
  background: transparent;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  cursor: pointer;
  transition: all 0.2s ease;
  outline: none;

  &:hover {
    background: ${props => props.$isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)'};
  }

  &:focus-visible {
    box-shadow: 0 0 0 3px ${props => props.$isDark ? 'rgba(78, 205, 196, 0.3)' : 'rgba(0, 122, 255, 0.3)'};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const StyledSidebarInset = styled.main<{ $sidebarWidth?: string; $collapsed?: boolean }>`
  flex: 1;
  margin-left: ${props => props.$collapsed ? '60px' : (props.$sidebarWidth || '256px')};
  transition: margin-left 0.2s ease;

  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

// Provider Component
interface SidebarStyledProviderProps extends React.ComponentProps<"div"> {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function SidebarStyledProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  children,
  ...props
}: SidebarStyledProviderProps) {
  const [isMobile, setIsMobile] = React.useState(false);
  const [openMobile, setOpenMobile] = React.useState(false);
  const [_open, _setOpen] = React.useState(defaultOpen);
  
  const open = openProp ?? _open;
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }
    },
    [setOpenProp, open]
  );

  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open);
  }, [isMobile, setOpen, setOpenMobile]);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const state = open ? "expanded" : "collapsed";

  const contextValue = React.useMemo<SidebarContextProps>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <StyledSidebarWrapper className={className} {...props}>
        {children}
      </StyledSidebarWrapper>
    </SidebarContext.Provider>
  );
}

// Component Props Interfaces
interface SidebarStyledProps extends React.ComponentProps<"div"> {
  isDark?: boolean;
  side?: "left" | "right";
  variant?: "sidebar" | "floating" | "inset";
  collapsible?: boolean;
}

interface SidebarHeaderProps extends React.ComponentProps<"div"> {
  isDark?: boolean;
}

interface SidebarFooterProps extends React.ComponentProps<"div"> {
  isDark?: boolean;
}

interface SidebarGroupLabelProps extends React.ComponentProps<"div"> {
  isDark?: boolean;
}

interface SidebarMenuButtonProps extends React.ComponentProps<"button"> {
  isDark?: boolean;
  active?: boolean;
}

interface SidebarMenuSubProps extends React.ComponentProps<"ul"> {
  isDark?: boolean;
}

interface SidebarToggleProps extends React.ComponentProps<"button"> {
  isDark?: boolean;
}

interface SidebarInsetProps extends React.ComponentProps<"main"> {
  sidebarWidth?: string;
}

// Main Components
function SidebarStyled({
  className,
  isDark,
  side = "left",
  variant = "sidebar",
  collapsible = true,
  children,
  ...props
}: SidebarStyledProps) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebarStyled();

  if (isMobile) {
    return (
      <>
        <StyledSidebarMobileOverlay 
          $visible={openMobile} 
          onClick={() => setOpenMobile(false)}
        />
        <StyledSidebarMobile
          $isDark={isDark}
          $side={side}
          $variant={variant}
          $state="expanded"
          $open={openMobile}
          className={className}
          {...props}
        >
          <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
            <StyledSidebarToggle
              $isDark={isDark}
              onClick={() => setOpenMobile(false)}
              aria-label="Close sidebar"
            >
              <X />
            </StyledSidebarToggle>
          </div>
          {children}
        </StyledSidebarMobile>
      </>
    );
  }

  if (!collapsible) {
    return (
      <StyledSidebar
        $isDark={isDark}
        $side={side}
        $variant={variant}
        $state="expanded"
        className={className}
        {...props}
      >
        {children}
      </StyledSidebar>
    );
  }

  return (
    <StyledSidebar
      $isDark={isDark}
      $side={side}
      $variant={variant}
      $state={state}
      className={className}
      {...props}
    >
      {children}
    </StyledSidebar>
  );
}

function SidebarHeader({ className, isDark, ...props }: SidebarHeaderProps) {
  const { state } = useSidebarStyled();
  return <StyledSidebarHeader $isDark={isDark} $collapsed={state === "collapsed"} className={className} {...props} />;
}

function SidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  const { state } = useSidebarStyled();
  return <StyledSidebarContent $collapsed={state === "collapsed"} className={className} {...props} />;
}

function SidebarFooter({ className, isDark, ...props }: SidebarFooterProps) {
  const { state } = useSidebarStyled();
  return <StyledSidebarFooter $isDark={isDark} $collapsed={state === "collapsed"} className={className} {...props} />;
}

function SidebarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <StyledSidebarGroup className={className} {...props} />;
}

function SidebarGroupLabel({ className, isDark, ...props }: SidebarGroupLabelProps) {
  const { state } = useSidebarStyled();
  return <StyledSidebarGroupLabel $isDark={isDark} $collapsed={state === "collapsed"} className={className} {...props} />;
}

function SidebarMenu({ className, ...props }: React.ComponentProps<"ul">) {
  return <StyledSidebarMenu className={className} {...props} />;
}

function SidebarMenuItem({ className, ...props }: React.ComponentProps<"li">) {
  return <StyledSidebarMenuItem className={className} {...props} />;
}

function SidebarMenuButton({
  className,
  isDark,
  active,
  children,
  ...props
}: SidebarMenuButtonProps) {
  const { state } = useSidebarStyled();
  
  return (
    <StyledSidebarMenuButton
      $isDark={isDark}
      $active={active}
      $collapsed={state === "collapsed"}
      className={className}
      {...props}
    >
      {children}
    </StyledSidebarMenuButton>
  );
}

function SidebarMenuSub({ className, isDark, ...props }: SidebarMenuSubProps) {
  return <StyledSidebarMenuSub $isDark={isDark} className={className} {...props} />;
}

function SidebarToggle({ className, isDark, onClick, ...props }: SidebarToggleProps) {
  const { toggleSidebar } = useSidebarStyled();

  return (
    <StyledSidebarToggle
      $isDark={isDark}
      onClick={(e) => {
        onClick?.(e);
        toggleSidebar();
      }}
      aria-label="Toggle Sidebar"
      className={className}
      {...props}
    >
      <PanelLeftIcon />
    </StyledSidebarToggle>
  );
}

function SidebarInset({ className, sidebarWidth, ...props }: SidebarInsetProps) {
  const { state } = useSidebarStyled();
  
  return (
    <StyledSidebarInset
      $sidebarWidth={sidebarWidth}
      $collapsed={state === "collapsed"}
      className={className}
      {...props}
    />
  );
}

export {
  SidebarStyled,
  SidebarStyledProvider,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarToggle,
  SidebarInset,
  useSidebarStyled,
};
