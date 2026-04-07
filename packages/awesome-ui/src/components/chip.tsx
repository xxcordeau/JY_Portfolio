import styled from 'styled-components';
import React from 'react';
import { X } from 'lucide-react';

const ChipContainer = styled.div<{
  $isDark?: boolean;
  $variant?: 'default' | 'filled' | 'outline' | 'primary' | 'success' | 'warning' | 'error';
  $size?: 'sm' | 'md' | 'lg';
  $clickable?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: ${props => {
    switch (props.$size) {
      case 'sm': return '4px 10px';
      case 'lg': return '10px 16px';
      default: return '6px 12px';
    }
  }};
  background: ${props => {
    if (props.$variant === 'outline') return 'transparent';
    if (props.$variant === 'filled') {
      return props.$isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.12)';
    }
    if (props.$variant === 'primary') {
      return props.$isDark ? 'rgba(78, 205, 196, 0.15)' : 'rgba(0, 122, 255, 0.15)';
    }
    if (props.$variant === 'success') {
      return props.$isDark ? 'rgba(52, 199, 89, 0.15)' : 'rgba(52, 199, 89, 0.15)';
    }
    if (props.$variant === 'warning') {
      return props.$isDark ? 'rgba(255, 159, 10, 0.15)' : 'rgba(255, 159, 10, 0.15)';
    }
    if (props.$variant === 'error') {
      return props.$isDark ? 'rgba(255, 69, 58, 0.15)' : 'rgba(255, 59, 48, 0.15)';
    }
    return props.$isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)';
  }};
  color: ${props => {
    if (props.$variant === 'outline') {
      return props.$isDark ? '#86868b' : '#6e6e73';
    }
    if (props.$variant === 'filled') {
      return props.$isDark ? '#f5f5f7' : '#1d1d1f';
    }
    if (props.$variant === 'primary') {
      return props.$isDark ? '#4ECDC4' : '#007AFF';
    }
    if (props.$variant === 'success') {
      return props.$isDark ? '#32D74B' : '#34C759';
    }
    if (props.$variant === 'warning') {
      return props.$isDark ? '#FF9F0A' : '#FF9500';
    }
    if (props.$variant === 'error') {
      return props.$isDark ? '#FF453A' : '#FF3B30';
    }
    return props.$isDark ? '#f5f5f7' : '#1d1d1f';
  }};
  border: 1px solid ${props => {
    if (props.$variant === 'outline') {
      return props.$isDark ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.2)';
    }
    if (props.$variant === 'filled') {
      return 'transparent';
    }
    if (props.$variant === 'primary') {
      return props.$isDark ? 'rgba(78, 205, 196, 0.3)' : 'rgba(0, 122, 255, 0.3)';
    }
    if (props.$variant === 'success') {
      return props.$isDark ? 'rgba(52, 199, 89, 0.3)' : 'rgba(52, 199, 89, 0.3)';
    }
    if (props.$variant === 'warning') {
      return props.$isDark ? 'rgba(255, 159, 10, 0.3)' : 'rgba(255, 159, 10, 0.3)';
    }
    if (props.$variant === 'error') {
      return props.$isDark ? 'rgba(255, 69, 58, 0.3)' : 'rgba(255, 59, 48, 0.3)';
    }
    return props.$isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.12)';
  }};
  border-radius: 12px;
  font-size: ${props => {
    switch (props.$size) {
      case 'sm': return '11px';
      case 'lg': return '14px';
      default: return '12px';
    }
  }};
  font-weight: 500;
  cursor: ${props => props.$clickable ? 'pointer' : 'default'};
  transition: all 0.2s ease;
  user-select: none;

  ${props => props.$clickable && `
    &:hover {
      background: ${
        props.$variant === 'filled'
          ? props.$isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.16)'
          : props.$variant === 'primary'
          ? props.$isDark ? 'rgba(78, 205, 196, 0.2)' : 'rgba(0, 122, 255, 0.2)'
          : props.$variant === 'success'
          ? 'rgba(52, 199, 89, 0.2)'
          : props.$variant === 'warning'
          ? 'rgba(255, 159, 10, 0.2)'
          : props.$variant === 'error'
          ? 'rgba(255, 69, 58, 0.2)'
          : props.$isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.12)'
      };
    }

    &:active {
      transform: scale(0.95);
    }
  `}

  svg {
    width: ${props => {
      switch (props.$size) {
        case 'sm': return '12px';
        case 'lg': return '16px';
        default: return '14px';
      }
    }};
    height: ${props => {
      switch (props.$size) {
        case 'sm': return '12px';
        case 'lg': return '16px';
        default: return '14px';
      }
    }};
  }
`;

const DeleteButton = styled.button<{ $isDark?: boolean }>`
  background: transparent;
  border: none;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: inherit;
  opacity: 0.7;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 1;
  }
`;

const Avatar = styled.img`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  object-fit: cover;
`;

export interface ChipProps {
  label: string;
  variant?: 'default' | 'filled' | 'outline' | 'primary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  isDark?: boolean;
  icon?: React.ReactNode;
  avatar?: string;
  onDelete?: () => void;
  onClick?: () => void;
  className?: string;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  variant = 'default',
  size = 'md',
  isDark = false,
  icon,
  avatar,
  onDelete,
  onClick,
  className
}) => {
  return (
    <ChipContainer
      $isDark={isDark}
      $variant={variant}
      $size={size}
      $clickable={!!onClick}
      onClick={onClick}
      className={className}
    >
      {avatar && <Avatar src={avatar} alt="" />}
      {icon && icon}
      {label}
      {onDelete && (
        <DeleteButton
          $isDark={isDark}
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <X />
        </DeleteButton>
      )}
    </ChipContainer>
  );
};

// Tag and Pill are aliases for Chip
export const Tag = Chip;
export const Pill = Chip;
