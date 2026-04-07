import styled from 'styled-components';
import React from 'react';

const BottomNavContainer = styled.nav<{ $isDark?: boolean }>`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: ${props => props.$isDark 
    ? 'rgba(30, 30, 30, 0.8)' 
    : 'rgba(255, 255, 255, 0.8)'};
  backdrop-filter: blur(20px);
  border-top: 1px solid ${props => props.$isDark 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.1)'};
  padding: 8px 0 max(8px, env(safe-area-inset-bottom));
  z-index: 1000;
  display: flex;
  justify-content: space-around;
  align-items: center;

  @media (min-width: 769px) {
    display: none;
  }
`;

const NavItem = styled.button<{ $isDark?: boolean; $active?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: transparent;
  border: none;
  padding: 8px 16px;
  cursor: pointer;
  color: ${props => {
    if (props.$active) {
      return props.$isDark ? '#4ECDC4' : '#007AFF';
    }
    return props.$isDark ? '#86868b' : '#6e6e73';
  }};
  transition: all 0.2s ease;
  position: relative;
  flex: 1;
  max-width: 100px;

  &:active {
    transform: scale(0.95);
  }

  svg {
    width: 24px;
    height: 24px;
  }
`;

const NavLabel = styled.span`
  font-size: 10px;
  font-weight: 500;
  letter-spacing: -0.2px;
`;

const Badge = styled.span<{ $isDark?: boolean }>`
  position: absolute;
  top: 4px;
  right: 8px;
  background: ${props => props.$isDark 
    ? '#FF453A' 
    : '#FF3B30'};
  color: white;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
`;

export interface BottomNavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  onClick?: () => void;
}

export interface BottomNavigationProps {
  items: BottomNavigationItem[];
  activeId?: string;
  isDark?: boolean;
  onItemClick?: (id: string) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  items,
  activeId,
  isDark = false,
  onItemClick
}) => {
  return (
    <BottomNavContainer $isDark={isDark}>
      {items.map((item) => (
        <NavItem
          key={item.id}
          $isDark={isDark}
          $active={activeId === item.id}
          onClick={() => {
            item.onClick?.();
            onItemClick?.(item.id);
          }}
        >
          {item.badge !== undefined && item.badge > 0 && (
            <Badge $isDark={isDark}>
              {item.badge > 99 ? '99+' : item.badge}
            </Badge>
          )}
          {item.icon}
          <NavLabel>{item.label}</NavLabel>
        </NavItem>
      ))}
    </BottomNavContainer>
  );
};
