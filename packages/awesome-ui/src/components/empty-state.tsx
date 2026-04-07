import styled from 'styled-components';
import React from 'react';
import { Search, Inbox, FileQuestion, WifiOff, AlertCircle } from 'lucide-react';

const EmptyStateContainer = styled.div<{ $isDark?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 40px;
  text-align: center;
  background: ${props => props.$isDark 
    ? 'rgba(255, 255, 255, 0.02)' 
    : 'rgba(0, 0, 0, 0.02)'};
  border: 1px dashed ${props => props.$isDark 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.1)'};
  border-radius: 12px;
  min-height: 300px;

  @media (max-width: 768px) {
    padding: 40px 24px;
    min-height: 250px;
  }
`;

const IconWrapper = styled.div<{ $isDark?: boolean; $variant?: string }>`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => {
    switch (props.$variant) {
      case 'search': 
        return props.$isDark 
          ? 'rgba(78, 205, 196, 0.1)' 
          : 'rgba(0, 122, 255, 0.1)';
      case 'error':
        return props.$isDark 
          ? 'rgba(255, 69, 58, 0.1)' 
          : 'rgba(255, 59, 48, 0.1)';
      case 'offline':
        return props.$isDark 
          ? 'rgba(255, 159, 10, 0.1)' 
          : 'rgba(255, 149, 0, 0.1)';
      default:
        return props.$isDark 
          ? 'rgba(255, 255, 255, 0.05)' 
          : 'rgba(0, 0, 0, 0.05)';
    }
  }};
  color: ${props => {
    switch (props.$variant) {
      case 'search': return props.$isDark ? '#4ECDC4' : '#007AFF';
      case 'error': return props.$isDark ? '#FF453A' : '#FF3B30';
      case 'offline': return props.$isDark ? '#FF9F0A' : '#FF9500';
      default: return props.$isDark ? '#86868b' : '#6e6e73';
    }
  }};
  margin-bottom: 20px;

  svg {
    width: 40px;
    height: 40px;
  }

  @media (max-width: 768px) {
    width: 64px;
    height: 64px;
    
    svg {
      width: 32px;
      height: 32px;
    }
  }
`;

const Title = styled.h3<{ $isDark?: boolean }>`
  font-size: 20px;
  font-weight: 600;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  margin: 0 0 8px 0;
  letter-spacing: -0.3px;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const Description = styled.p<{ $isDark?: boolean }>`
  font-size: 14px;
  color: ${props => props.$isDark ? '#86868b' : '#6e6e73'};
  margin: 0 0 24px 0;
  max-width: 400px;
  line-height: 1.5;

  @media (max-width: 768px) {
    font-size: 13px;
    max-width: 300px;
  }
`;

const ActionButton = styled.button<{ $isDark?: boolean; $primary?: boolean }>`
  padding: 10px 20px;
  background: ${props => {
    if (props.$primary) {
      return props.$isDark 
        ? 'linear-gradient(135deg, #4ECDC4 0%, #45B7D1 100%)'
        : 'linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%)';
    }
    return 'transparent';
  }};
  border: 1px solid ${props => {
    if (props.$primary) {
      return 'transparent';
    }
    return props.$isDark 
      ? 'rgba(255, 255, 255, 0.2)' 
      : 'rgba(0, 0, 0, 0.2)';
  }};
  border-radius: 12px;
  color: ${props => {
    if (props.$primary) {
      return 'white';
    }
    return props.$isDark ? '#f5f5f7' : '#1d1d1f';
  }};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    font-size: 13px;
    padding: 8px 16px;
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
`;

export interface EmptyStateAction {
  label: string;
  onClick: () => void;
  primary?: boolean;
}

export interface EmptyStateProps {
  variant?: 'empty' | 'search' | 'error' | 'offline' | 'custom';
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actions?: EmptyStateAction[];
  isDark?: boolean;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  variant = 'empty',
  title,
  description,
  icon,
  actions,
  isDark = false,
  className
}) => {
  const getDefaultIcon = () => {
    switch (variant) {
      case 'search': return <Search />;
      case 'error': return <AlertCircle />;
      case 'offline': return <WifiOff />;
      case 'empty': return <Inbox />;
      default: return <FileQuestion />;
    }
  };

  return (
    <EmptyStateContainer $isDark={isDark} className={className}>
      <IconWrapper $isDark={isDark} $variant={variant}>
        {icon || getDefaultIcon()}
      </IconWrapper>
      <Title $isDark={isDark}>{title}</Title>
      {description && (
        <Description $isDark={isDark}>{description}</Description>
      )}
      {actions && actions.length > 0 && (
        <ActionsContainer>
          {actions.map((action, index) => (
            <ActionButton
              key={index}
              $isDark={isDark}
              $primary={action.primary}
              onClick={action.onClick}
            >
              {action.label}
            </ActionButton>
          ))}
        </ActionsContainer>
      )}
    </EmptyStateContainer>
  );
};

// Placeholder is an alias for EmptyState
export const Placeholder = EmptyState;
