import styled, { keyframes, css } from 'styled-components';
import React from 'react';

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
`;

const StatusDot = styled.div<{ 
  $isDark?: boolean;
  $variant?: 'success' | 'warning' | 'error' | 'info' | 'default' | 'offline';
  $size?: 'sm' | 'md' | 'lg';
  $pulse?: boolean;
}>`
  width: ${props => {
    switch (props.$size) {
      case 'sm': return '6px';
      case 'lg': return '12px';
      default: return '8px';
    }
  }};
  height: ${props => {
    switch (props.$size) {
      case 'sm': return '6px';
      case 'lg': return '12px';
      default: return '8px';
    }
  }};
  border-radius: 50%;
  background: ${props => {
    switch (props.$variant) {
      case 'success': return props.$isDark ? '#32D74B' : '#34C759';
      case 'warning': return props.$isDark ? '#FF9F0A' : '#FF9500';
      case 'error': return props.$isDark ? '#FF453A' : '#FF3B30';
      case 'info': return props.$isDark ? '#4ECDC4' : '#007AFF';
      case 'offline': return props.$isDark ? '#636366' : '#8E8E93';
      default: return props.$isDark ? '#86868b' : '#6e6e73';
    }
  }};
  flex-shrink: 0;
  ${props => props.$pulse && css`
    animation: ${pulse} 2s ease-in-out infinite;
  `}
`;

const StatusContainer = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
`;

const StatusLabel = styled.span<{ $isDark?: boolean }>`
  font-size: 13px;
  font-weight: 500;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
`;

const StatusBadge = styled.div<{ 
  $isDark?: boolean;
  $variant?: 'success' | 'warning' | 'error' | 'info' | 'default' | 'offline';
}>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background: ${props => {
    switch (props.$variant) {
      case 'success': 
        return props.$isDark 
          ? 'rgba(52, 199, 89, 0.15)' 
          : 'rgba(52, 199, 89, 0.15)';
      case 'warning': 
        return props.$isDark 
          ? 'rgba(255, 159, 10, 0.15)' 
          : 'rgba(255, 159, 10, 0.15)';
      case 'error': 
        return props.$isDark 
          ? 'rgba(255, 69, 58, 0.15)' 
          : 'rgba(255, 59, 48, 0.15)';
      case 'info': 
        return props.$isDark 
          ? 'rgba(78, 205, 196, 0.15)' 
          : 'rgba(0, 122, 255, 0.15)';
      case 'offline': 
        return props.$isDark 
          ? 'rgba(99, 99, 102, 0.15)' 
          : 'rgba(142, 142, 147, 0.15)';
      default: 
        return props.$isDark 
          ? 'rgba(255, 255, 255, 0.1)' 
          : 'rgba(0, 0, 0, 0.08)';
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
        return props.$isDark 
          ? 'rgba(78, 205, 196, 0.3)' 
          : 'rgba(0, 122, 255, 0.3)';
      case 'offline': 
        return props.$isDark 
          ? 'rgba(99, 99, 102, 0.3)' 
          : 'rgba(142, 142, 147, 0.3)';
      default: 
        return props.$isDark 
          ? 'rgba(255, 255, 255, 0.15)' 
          : 'rgba(0, 0, 0, 0.12)';
    }
  }};
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  color: ${props => {
    switch (props.$variant) {
      case 'success': return props.$isDark ? '#32D74B' : '#34C759';
      case 'warning': return props.$isDark ? '#FF9F0A' : '#FF9500';
      case 'error': return props.$isDark ? '#FF453A' : '#FF3B30';
      case 'info': return props.$isDark ? '#4ECDC4' : '#007AFF';
      case 'offline': return props.$isDark ? '#636366' : '#8E8E93';
      default: return props.$isDark ? '#f5f5f7' : '#1d1d1f';
    }
  }};
`;

const OnlineIndicator = styled.div<{ 
  $isDark?: boolean;
  $online?: boolean;
  $size?: 'sm' | 'md' | 'lg';
}>`
  position: relative;
  width: ${props => {
    switch (props.$size) {
      case 'sm': return '8px';
      case 'lg': return '14px';
      default: return '10px';
    }
  }};
  height: ${props => {
    switch (props.$size) {
      case 'sm': return '8px';
      case 'lg': return '14px';
      default: return '10px';
    }
  }};
  
  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: ${props => props.$online 
      ? props.$isDark ? '#32D74B' : '#34C759'
      : props.$isDark ? '#636366' : '#8E8E93'};
    border: 2px solid ${props => props.$isDark 
      ? 'rgba(30, 30, 30, 1)' 
      : 'rgba(255, 255, 255, 1)'};
  }
  
  ${props => props.$online && css`
    &::after {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: ${props.$isDark ? '#32D74B' : '#34C759'};
      animation: ${pulse} 2s ease-in-out infinite;
      opacity: 0.5;
    }
  `}
`;

export interface StatusIndicatorProps {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default' | 'offline';
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
  showBadge?: boolean;
  isDark?: boolean;
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  variant = 'default',
  label,
  size = 'md',
  pulse = false,
  showBadge = false,
  isDark = false,
  className
}) => {
  if (showBadge && label) {
    return (
      <StatusBadge $isDark={isDark} $variant={variant} className={className}>
        <StatusDot $isDark={isDark} $variant={variant} $size="sm" $pulse={pulse} />
        {label}
      </StatusBadge>
    );
  }

  if (label) {
    return (
      <StatusContainer className={className}>
        <StatusDot $isDark={isDark} $variant={variant} $size={size} $pulse={pulse} />
        <StatusLabel $isDark={isDark}>{label}</StatusLabel>
      </StatusContainer>
    );
  }

  return (
    <StatusDot 
      $isDark={isDark} 
      $variant={variant} 
      $size={size} 
      $pulse={pulse}
      className={className}
    />
  );
};

export interface OnlineStatusProps {
  online?: boolean;
  size?: 'sm' | 'md' | 'lg';
  isDark?: boolean;
  className?: string;
}

export const OnlineStatus: React.FC<OnlineStatusProps> = ({
  online = true,
  size = 'md',
  isDark = false,
  className
}) => {
  return (
    <OnlineIndicator 
      $isDark={isDark} 
      $online={online} 
      $size={size}
      className={className}
    />
  );
};

// Dot is an alias for StatusIndicator
export const Dot = StatusIndicator;
