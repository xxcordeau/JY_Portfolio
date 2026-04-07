import styled, { keyframes } from 'styled-components';
import React from 'react';

// Progress Bar
const ProgressBarContainer = styled.div<{ $isDark?: boolean }>`
  width: 100%;
  height: 8px;
  background: ${props => props.$isDark 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.1)'};
  border-radius: 12px;
  overflow: hidden;
`;

const ProgressBarFill = styled.div<{ 
  $isDark?: boolean; 
  $progress: number;
  $variant?: 'default' | 'success' | 'warning' | 'error';
}>`
  height: 100%;
  width: ${props => props.$progress}%;
  background: ${props => {
    switch (props.$variant) {
      case 'success': return props.$isDark ? '#32D74B' : '#34C759';
      case 'warning': return props.$isDark ? '#FF9F0A' : '#FF9500';
      case 'error': return props.$isDark ? '#FF453A' : '#FF3B30';
      default: return props.$isDark 
        ? 'linear-gradient(90deg, #4ECDC4 0%, #45B7D1 100%)'
        : 'linear-gradient(90deg, #007AFF 0%, #5AC8FA 100%)';
    }
  }};
  border-radius: 12px;
  transition: width 0.3s ease;
`;

export interface ProgressBarProps {
  progress: number;
  variant?: 'default' | 'success' | 'warning' | 'error';
  isDark?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  variant = 'default',
  isDark = false,
  className
}) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));
  
  return (
    <ProgressBarContainer $isDark={isDark} className={className}>
      <ProgressBarFill 
        $isDark={isDark} 
        $progress={clampedProgress}
        $variant={variant}
      />
    </ProgressBarContainer>
  );
};

// Spinner
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerContainer = styled.div<{ 
  $size?: 'sm' | 'md' | 'lg';
}>`
  display: inline-block;
  width: ${props => {
    switch (props.$size) {
      case 'sm': return '16px';
      case 'lg': return '32px';
      default: return '24px';
    }
  }};
  height: ${props => {
    switch (props.$size) {
      case 'sm': return '16px';
      case 'lg': return '32px';
      default: return '24px';
    }
  }};
`;

const SpinnerCircle = styled.div<{ 
  $isDark?: boolean;
  $variant?: 'default' | 'success' | 'warning' | 'error';
}>`
  width: 100%;
  height: 100%;
  border: 2px solid ${props => {
    switch (props.$variant) {
      case 'success': return props.$isDark ? 'rgba(50, 215, 75, 0.2)' : 'rgba(52, 199, 89, 0.2)';
      case 'warning': return props.$isDark ? 'rgba(255, 159, 10, 0.2)' : 'rgba(255, 149, 0, 0.2)';
      case 'error': return props.$isDark ? 'rgba(255, 69, 58, 0.2)' : 'rgba(255, 59, 48, 0.2)';
      default: return props.$isDark ? 'rgba(78, 205, 196, 0.2)' : 'rgba(0, 122, 255, 0.2)';
    }
  }};
  border-top-color: ${props => {
    switch (props.$variant) {
      case 'success': return props.$isDark ? '#32D74B' : '#34C759';
      case 'warning': return props.$isDark ? '#FF9F0A' : '#FF9500';
      case 'error': return props.$isDark ? '#FF453A' : '#FF3B30';
      default: return props.$isDark ? '#4ECDC4' : '#007AFF';
    }
  }};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'error';
  isDark?: boolean;
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  variant = 'default',
  isDark = false,
  className
}) => {
  return (
    <SpinnerContainer $size={size} className={className}>
      <SpinnerCircle $isDark={isDark} $variant={variant} />
    </SpinnerContainer>
  );
};

// Linear Progress (indeterminate)
const progressAnimation = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(400%); }
`;

const LinearProgressContainer = styled.div<{ $isDark?: boolean }>`
  width: 100%;
  height: 4px;
  background: ${props => props.$isDark 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.1)'};
  border-radius: 12px;
  overflow: hidden;
  position: relative;
`;

const LinearProgressBar = styled.div<{ 
  $isDark?: boolean;
  $variant?: 'default' | 'success' | 'warning' | 'error';
}>`
  position: absolute;
  width: 25%;
  height: 100%;
  background: ${props => {
    switch (props.$variant) {
      case 'success': return props.$isDark ? '#32D74B' : '#34C759';
      case 'warning': return props.$isDark ? '#FF9F0A' : '#FF9500';
      case 'error': return props.$isDark ? '#FF453A' : '#FF3B30';
      default: return props.$isDark ? '#4ECDC4' : '#007AFF';
    }
  }};
  border-radius: 12px;
  animation: ${progressAnimation} 1.5s ease-in-out infinite;
`;

export interface LinearProgressProps {
  variant?: 'default' | 'success' | 'warning' | 'error';
  isDark?: boolean;
  className?: string;
}

export const LinearProgress: React.FC<LinearProgressProps> = ({
  variant = 'default',
  isDark = false,
  className
}) => {
  return (
    <LinearProgressContainer $isDark={isDark} className={className}>
      <LinearProgressBar $isDark={isDark} $variant={variant} />
    </LinearProgressContainer>
  );
};
