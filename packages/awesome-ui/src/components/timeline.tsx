import styled from 'styled-components';
import React from 'react';

const TimelineContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const TimelineItem = styled.div<{ $isLast?: boolean }>`
  position: relative;
  display: flex;
  gap: 16px;
  padding-bottom: ${props => props.$isLast ? '0' : '32px'};
`;

const TimelineMarker = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
`;

const TimelineDot = styled.div<{ 
  $isDark?: boolean;
  $variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  $size?: 'sm' | 'md' | 'lg';
}>`
  width: ${props => {
    switch (props.$size) {
      case 'sm': return '8px';
      case 'lg': return '16px';
      default: return '12px';
    }
  }};
  height: ${props => {
    switch (props.$size) {
      case 'sm': return '8px';
      case 'lg': return '16px';
      default: return '12px';
    }
  }};
  border-radius: 50%;
  background: ${props => {
    switch (props.$variant) {
      case 'primary': return props.$isDark ? '#4ECDC4' : '#007AFF';
      case 'success': return props.$isDark ? '#32D74B' : '#34C759';
      case 'warning': return props.$isDark ? '#FF9F0A' : '#FF9500';
      case 'error': return props.$isDark ? '#FF453A' : '#FF3B30';
      default: return props.$isDark ? '#86868b' : '#6e6e73';
    }
  }};
  border: 2px solid ${props => props.$isDark 
    ? 'rgba(30, 30, 30, 1)' 
    : 'rgba(255, 255, 255, 1)'};
  z-index: 1;
  flex-shrink: 0;
`;

const TimelineIcon = styled.div<{ 
  $isDark?: boolean;
  $variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
}>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => {
    switch (props.$variant) {
      case 'primary': 
        return props.$isDark 
          ? 'rgba(78, 205, 196, 0.15)' 
          : 'rgba(0, 122, 255, 0.15)';
      case 'success': 
        return 'rgba(52, 199, 89, 0.15)';
      case 'warning': 
        return 'rgba(255, 159, 10, 0.15)';
      case 'error': 
        return props.$isDark 
          ? 'rgba(255, 69, 58, 0.15)' 
          : 'rgba(255, 59, 48, 0.15)';
      default: 
        return props.$isDark 
          ? 'rgba(255, 255, 255, 0.1)' 
          : 'rgba(0, 0, 0, 0.08)';
    }
  }};
  color: ${props => {
    switch (props.$variant) {
      case 'primary': return props.$isDark ? '#4ECDC4' : '#007AFF';
      case 'success': return props.$isDark ? '#32D74B' : '#34C759';
      case 'warning': return props.$isDark ? '#FF9F0A' : '#FF9500';
      case 'error': return props.$isDark ? '#FF453A' : '#FF3B30';
      default: return props.$isDark ? '#86868b' : '#6e6e73';
    }
  }};
  z-index: 1;
  flex-shrink: 0;

  svg {
    width: 16px;
    height: 16px;
  }
`;

const TimelineLine = styled.div<{ $isDark?: boolean; $isLast?: boolean }>`
  position: absolute;
  top: ${props => props.$isLast ? '0' : '12px'};
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  height: ${props => props.$isLast ? '0' : 'calc(100% - 12px)'};
  background: ${props => props.$isDark 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.1)'};
`;

const TimelineContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TimelineHeader = styled.div`
  display: flex;
  align-items: baseline;
  gap: 12px;
  flex-wrap: wrap;
`;

const TimelineTitle = styled.div<{ $isDark?: boolean }>`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
`;

const TimelineTime = styled.div<{ $isDark?: boolean }>`
  font-size: 12px;
  color: ${props => props.$isDark ? '#86868b' : '#6e6e73'};
`;

const TimelineDescription = styled.div<{ $isDark?: boolean }>`
  font-size: 13px;
  color: ${props => props.$isDark ? '#86868b' : '#6e6e73'};
  line-height: 1.5;
`;

export interface TimelineItemData {
  id: string;
  title: string;
  time?: string;
  description?: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  icon?: React.ReactNode;
  dotSize?: 'sm' | 'md' | 'lg';
}

export interface TimelineProps {
  items: TimelineItemData[];
  isDark?: boolean;
  className?: string;
}

export const Timeline: React.FC<TimelineProps> = ({
  items,
  isDark = false,
  className
}) => {
  return (
    <TimelineContainer className={className}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        return (
          <TimelineItem key={item.id ?? index} $isLast={isLast}>
            <TimelineMarker>
              {item.icon ? (
                <TimelineIcon $isDark={isDark} $variant={item.variant}>
                  {item.icon}
                </TimelineIcon>
              ) : (
                <TimelineDot 
                  $isDark={isDark} 
                  $variant={item.variant}
                  $size={item.dotSize || 'md'}
                />
              )}
              <TimelineLine $isDark={isDark} $isLast={isLast} />
            </TimelineMarker>
            
            <TimelineContent>
              <TimelineHeader>
                <TimelineTitle $isDark={isDark}>{item.title}</TimelineTitle>
                {item.time && (
                  <TimelineTime $isDark={isDark}>{item.time}</TimelineTime>
                )}
              </TimelineHeader>
              {item.description && (
                <TimelineDescription $isDark={isDark}>
                  {item.description}
                </TimelineDescription>
              )}
            </TimelineContent>
          </TimelineItem>
        );
      })}
    </TimelineContainer>
  );
};
