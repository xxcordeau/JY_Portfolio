import styled from 'styled-components';
import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const Card = styled.div<{ $isDark?: boolean }>`
  padding: 20px;
  border-radius: 12px;
  background: ${props => props.$isDark 
    ? 'rgba(255, 255, 255, 0.05)' 
    : 'rgba(255, 255, 255, 1)'};
  border: 1px solid ${props => props.$isDark 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.1)'};
  backdrop-filter: blur(20px);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.$isDark 
      ? '0 8px 16px rgba(0, 0, 0, 0.3)' 
      : '0 8px 16px rgba(0, 0, 0, 0.1)'};
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const Title = styled.h4<{ $isDark?: boolean }>`
  margin: 0;
  font-size: 13px;
  font-weight: 500;
  color: ${props => props.$isDark ? '#86868b' : '#6e6e73'};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const IconWrapper = styled.div<{ $isDark?: boolean; $color?: string }>`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => {
    if (props.$color === 'blue') return 'rgba(0, 122, 255, 0.15)';
    if (props.$color === 'green') return 'rgba(52, 199, 89, 0.15)';
    if (props.$color === 'red') return 'rgba(255, 59, 48, 0.15)';
    if (props.$color === 'orange') return 'rgba(255, 149, 0, 0.15)';
    return props.$isDark 
      ? 'rgba(255, 255, 255, 0.1)' 
      : 'rgba(0, 0, 0, 0.05)';
  }};

  svg {
    width: 20px;
    height: 20px;
    color: ${props => {
      if (props.$color === 'blue') return '#007AFF';
      if (props.$color === 'green') return '#34C759';
      if (props.$color === 'red') return '#FF3B30';
      if (props.$color === 'orange') return '#FF9500';
      return props.$isDark ? '#f5f5f7' : '#1d1d1f';
    }};
  }
`;

const Value = styled.div<{ $isDark?: boolean }>`
  font-size: 32px;
  font-weight: 600;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  margin-bottom: 8px;
  line-height: 1.2;
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Change = styled.div<{ $trend?: 'up' | 'down' | 'neutral'; $isDark?: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 500;
  color: ${props => {
    if (props.$trend === 'up') return '#34C759';
    if (props.$trend === 'down') return '#FF3B30';
    return props.$isDark ? '#86868b' : '#6e6e73';
  }};

  svg {
    width: 14px;
    height: 14px;
  }
`;

const ChangeText = styled.span<{ $isDark?: boolean }>`
  font-size: 13px;
  color: ${props => props.$isDark ? '#86868b' : '#6e6e73'};
`;

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    trend: 'up' | 'down' | 'neutral';
    label?: string;
  };
  icon?: React.ReactNode;
  iconColor?: 'blue' | 'green' | 'red' | 'orange';
  isDark?: boolean;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon,
  iconColor,
  isDark = false,
  className
}) => {
  return (
    <Card $isDark={isDark} className={className}>
      <CardHeader>
        <Title $isDark={isDark}>{title}</Title>
        {icon && (
          <IconWrapper $isDark={isDark} $color={iconColor}>
            {icon}
          </IconWrapper>
        )}
      </CardHeader>
      <Value $isDark={isDark}>{value}</Value>
      {change && (
        <Footer>
          <Change $trend={change.trend} $isDark={isDark}>
            {change.trend === 'up' && <TrendingUp />}
            {change.trend === 'down' && <TrendingDown />}
            {change.trend === 'neutral' && <Minus />}
            {change.value}
          </Change>
          {change.label && (
            <ChangeText $isDark={isDark}>{change.label}</ChangeText>
          )}
        </Footer>
      )}
    </Card>
  );
};

// KPI Card - More detailed version
const KPICardContainer = styled(Card)`
  padding: 24px;
`;

const KPITitle = styled.h3<{ $isDark?: boolean }>`
  margin: 0 0 4px 0;
  font-size: 15px;
  font-weight: 600;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
`;

const KPISubtitle = styled.p<{ $isDark?: boolean }>`
  margin: 0 0 16px 0;
  font-size: 13px;
  color: ${props => props.$isDark ? '#86868b' : '#6e6e73'};
`;

const KPIValue = styled.div<{ $isDark?: boolean }>`
  font-size: 40px;
  font-weight: 700;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
  margin-bottom: 12px;
  line-height: 1;
`;

const KPIMetrics = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid ${props => props.theme.$isDark 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.1)'};
`;

const KPIMetric = styled.div``;

const MetricLabel = styled.div<{ $isDark?: boolean }>`
  font-size: 12px;
  color: ${props => props.$isDark ? '#86868b' : '#6e6e73'};
  margin-bottom: 4px;
`;

const MetricValue = styled.div<{ $isDark?: boolean }>`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
`;

export interface KPICardProps {
  title: string;
  subtitle?: string;
  value: string | number;
  change?: {
    value: string;
    trend: 'up' | 'down' | 'neutral';
    label?: string;
  };
  metrics?: Array<{
    label: string;
    value: string | number;
  }>;
  isDark?: boolean;
  className?: string;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  subtitle,
  value,
  change,
  metrics,
  isDark = false,
  className
}) => {
  return (
    <KPICardContainer $isDark={isDark} className={className}>
      <KPITitle $isDark={isDark}>{title}</KPITitle>
      {subtitle && <KPISubtitle $isDark={isDark}>{subtitle}</KPISubtitle>}
      <KPIValue $isDark={isDark}>{value}</KPIValue>
      {change && (
        <Footer>
          <Change $trend={change.trend} $isDark={isDark}>
            {change.trend === 'up' && <TrendingUp />}
            {change.trend === 'down' && <TrendingDown />}
            {change.trend === 'neutral' && <Minus />}
            {change.value}
          </Change>
          {change.label && (
            <ChangeText $isDark={isDark}>{change.label}</ChangeText>
          )}
        </Footer>
      )}
      {metrics && metrics.length > 0 && (
        <KPIMetrics theme={{ $isDark: isDark }}>
          {metrics.map((metric, index) => (
            <KPIMetric key={index}>
              <MetricLabel $isDark={isDark}>{metric.label}</MetricLabel>
              <MetricValue $isDark={isDark}>{metric.value}</MetricValue>
            </KPIMetric>
          ))}
        </KPIMetrics>
      )}
    </KPICardContainer>
  );
};
