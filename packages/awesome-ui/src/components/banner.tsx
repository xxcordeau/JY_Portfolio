import styled from 'styled-components';
import React from 'react';
import { Info, AlertTriangle, CheckCircle, XCircle, X } from 'lucide-react';

const BannerContainer = styled.div<{ 
  $isDark?: boolean; 
  $variant?: 'info' | 'success' | 'warning' | 'error';
  $dismissible?: boolean;
}>`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: ${props => {
    switch (props.$variant) {
      case 'success':
        return props.$isDark 
          ? 'rgba(52, 199, 89, 0.1)' 
          : 'rgba(52, 199, 89, 0.1)';
      case 'warning':
        return props.$isDark 
          ? 'rgba(255, 159, 10, 0.1)' 
          : 'rgba(255, 159, 10, 0.1)';
      case 'error':
        return props.$isDark 
          ? 'rgba(255, 69, 58, 0.1)' 
          : 'rgba(255, 59, 48, 0.1)';
      case 'info':
      default:
        return props.$isDark 
          ? 'rgba(78, 205, 196, 0.1)' 
          : 'rgba(0, 122, 255, 0.1)';
    }
  }};
  border: 1px solid ${props => {
    switch (props.$variant) {
      case 'success':
        return props.$isDark 
          ? 'rgba(52, 199, 89, 0.3)' 
          : 'rgba(52, 199, 89, 0.3)';
      case 'warning':
        return props.$isDark 
          ? 'rgba(255, 159, 10, 0.3)' 
          : 'rgba(255, 159, 10, 0.3)';
      case 'error':
        return props.$isDark 
          ? 'rgba(255, 69, 58, 0.3)' 
          : 'rgba(255, 59, 48, 0.3)';
      case 'info':
      default:
        return props.$isDark 
          ? 'rgba(78, 205, 196, 0.3)' 
          : 'rgba(0, 122, 255, 0.3)';
    }
  }};
  border-radius: 12px;
  backdrop-filter: blur(10px);
`;

const IconWrapper = styled.div<{ 
  $variant?: 'info' | 'success' | 'warning' | 'error';
  $isDark?: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: ${props => {
    switch (props.$variant) {
      case 'success': return props.$isDark ? '#32D74B' : '#34C759';
      case 'warning': return props.$isDark ? '#FF9F0A' : '#FF9500';
      case 'error': return props.$isDark ? '#FF453A' : '#FF3B30';
      case 'info':
      default: return props.$isDark ? '#4ECDC4' : '#007AFF';
    }
  }};

  svg {
    width: 20px;
    height: 20px;
  }
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Title = styled.div<{ $isDark?: boolean }>`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
`;

const Description = styled.div<{ $isDark?: boolean }>`
  font-size: 13px;
  color: ${props => props.$isDark ? '#86868b' : '#6e6e73'};
  line-height: 1.5;
`;

const CloseButton = styled.button<{ $isDark?: boolean }>`
  background: transparent;
  border: none;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${props => props.$isDark ? '#86868b' : '#6e6e73'};
  transition: all 0.2s ease;
  flex-shrink: 0;
  border-radius: 6px;

  &:hover {
    background: ${props => props.$isDark 
      ? 'rgba(255, 255, 255, 0.1)' 
      : 'rgba(0, 0, 0, 0.05)'};
    color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const ActionButton = styled.button<{ $isDark?: boolean }>`
  background: transparent;
  border: 1px solid ${props => props.$isDark 
    ? 'rgba(255, 255, 255, 0.2)' 
    : 'rgba(0, 0, 0, 0.2)'};
  padding: 6px 12px;
  border-radius: 8px;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 8px;

  &:hover {
    background: ${props => props.$isDark 
      ? 'rgba(255, 255, 255, 0.1)' 
      : 'rgba(0, 0, 0, 0.05)'};
  }

  &:active {
    transform: scale(0.98);
  }
`;

export interface BannerProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  description: string;
  isDark?: boolean;
  dismissible?: boolean;
  onDismiss?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const Banner: React.FC<BannerProps> = ({
  variant = 'info',
  title,
  description,
  isDark = false,
  dismissible = false,
  onDismiss,
  action,
  className
}) => {
  const getIcon = () => {
    switch (variant) {
      case 'success': return <CheckCircle />;
      case 'warning': return <AlertTriangle />;
      case 'error': return <XCircle />;
      case 'info':
      default: return <Info />;
    }
  };

  return (
    <BannerContainer
      $isDark={isDark}
      $variant={variant}
      $dismissible={dismissible}
      className={className}
    >
      <IconWrapper $variant={variant} $isDark={isDark}>
        {getIcon()}
      </IconWrapper>
      <Content>
        {title && <Title $isDark={isDark}>{title}</Title>}
        <Description $isDark={isDark}>{description}</Description>
        {action && (
          <ActionButton $isDark={isDark} onClick={action.onClick}>
            {action.label}
          </ActionButton>
        )}
      </Content>
      {dismissible && (
        <CloseButton $isDark={isDark} onClick={onDismiss}>
          <X />
        </CloseButton>
      )}
    </BannerContainer>
  );
};

// Notice is an alias for Banner
export const Notice = Banner;
