import styled from 'styled-components';
import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const ChartContainer = styled.div<{ $isDark?: boolean }>`
  width: 100%;
  padding: 20px;
  border-radius: 12px;
  background: ${props => props.$isDark 
    ? 'rgba(255, 255, 255, 0.05)' 
    : 'rgba(255, 255, 255, 1)'};
  border: 1px solid ${props => props.$isDark 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.1)'};
  backdrop-filter: blur(20px);
`;

const ChartHeader = styled.div`
  margin-bottom: 20px;
`;

const ChartTitle = styled.h3<{ $isDark?: boolean }>`
  margin: 0 0 4px 0;
  font-size: 17px;
  font-weight: 600;
  color: ${props => props.$isDark ? '#f5f5f7' : '#1d1d1f'};
`;

const ChartSubtitle = styled.p<{ $isDark?: boolean }>`
  margin: 0;
  font-size: 13px;
  color: ${props => props.$isDark ? '#86868b' : '#6e6e73'};
`;

const COLORS = {
  blue: '#007AFF',
  green: '#34C759',
  red: '#FF3B30',
  orange: '#FF9500',
  purple: '#AF52DE',
  pink: '#FF2D55',
  yellow: '#FFCC00',
  teal: '#5AC8FA',
};

export interface ChartData {
  [key: string]: string | number;
}

interface BaseChartProps {
  title?: string;
  subtitle?: string;
  data: ChartData[];
  height?: number;
  isDark?: boolean;
  className?: string;
}

export interface LineChartProps extends BaseChartProps {
  dataKey: string;
  xAxisKey?: string;
  color?: keyof typeof COLORS;
  showGrid?: boolean;
  showLegend?: boolean;
}

export const DataLineChart: React.FC<LineChartProps> = ({
  title,
  subtitle,
  data,
  dataKey,
  xAxisKey = 'name',
  color = 'blue',
  height = 300,
  showGrid = true,
  showLegend = false,
  isDark = false,
  className
}) => {
  const axisColor = isDark ? '#86868b' : '#6e6e73';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

  return (
    <ChartContainer $isDark={isDark} className={className}>
      {(title || subtitle) && (
        <ChartHeader>
          {title && <ChartTitle $isDark={isDark}>{title}</ChartTitle>}
          {subtitle && <ChartSubtitle $isDark={isDark}>{subtitle}</ChartSubtitle>}
        </ChartHeader>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />}
          <XAxis dataKey={xAxisKey} stroke={axisColor} style={{ fontSize: 12 }} />
          <YAxis stroke={axisColor} style={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)',
              border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'}`,
              borderRadius: '8px',
              color: isDark ? '#f5f5f7' : '#1d1d1f',
              fontSize: 12
            }}
          />
          {showLegend && <Legend />}
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={COLORS[color]}
            strokeWidth={2}
            dot={{ fill: COLORS[color], r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export interface BarChartProps extends BaseChartProps {
  dataKey: string;
  xAxisKey?: string;
  color?: keyof typeof COLORS;
  showGrid?: boolean;
  showLegend?: boolean;
}

export const DataBarChart: React.FC<BarChartProps> = ({
  title,
  subtitle,
  data,
  dataKey,
  xAxisKey = 'name',
  color = 'blue',
  height = 300,
  showGrid = true,
  showLegend = false,
  isDark = false,
  className
}) => {
  const axisColor = isDark ? '#86868b' : '#6e6e73';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

  return (
    <ChartContainer $isDark={isDark} className={className}>
      {(title || subtitle) && (
        <ChartHeader>
          {title && <ChartTitle $isDark={isDark}>{title}</ChartTitle>}
          {subtitle && <ChartSubtitle $isDark={isDark}>{subtitle}</ChartSubtitle>}
        </ChartHeader>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />}
          <XAxis dataKey={xAxisKey} stroke={axisColor} style={{ fontSize: 12 }} />
          <YAxis stroke={axisColor} style={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)',
              border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'}`,
              borderRadius: '8px',
              color: isDark ? '#f5f5f7' : '#1d1d1f',
              fontSize: 12
            }}
          />
          {showLegend && <Legend />}
          <Bar dataKey={dataKey} fill={COLORS[color]} radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export interface AreaChartProps extends BaseChartProps {
  dataKey: string;
  xAxisKey?: string;
  color?: keyof typeof COLORS;
  showGrid?: boolean;
  showLegend?: boolean;
}

export const DataAreaChart: React.FC<AreaChartProps> = ({
  title,
  subtitle,
  data,
  dataKey,
  xAxisKey = 'name',
  color = 'blue',
  height = 300,
  showGrid = true,
  showLegend = false,
  isDark = false,
  className
}) => {
  const axisColor = isDark ? '#86868b' : '#6e6e73';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

  return (
    <ChartContainer $isDark={isDark} className={className}>
      {(title || subtitle) && (
        <ChartHeader>
          {title && <ChartTitle $isDark={isDark}>{title}</ChartTitle>}
          {subtitle && <ChartSubtitle $isDark={isDark}>{subtitle}</ChartSubtitle>}
        </ChartHeader>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />}
          <XAxis dataKey={xAxisKey} stroke={axisColor} style={{ fontSize: 12 }} />
          <YAxis stroke={axisColor} style={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)',
              border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'}`,
              borderRadius: '8px',
              color: isDark ? '#f5f5f7' : '#1d1d1f',
              fontSize: 12
            }}
          />
          {showLegend && <Legend />}
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={COLORS[color]}
            fill={COLORS[color]}
            fillOpacity={0.3}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export interface PieChartProps extends BaseChartProps {
  dataKey: string;
  nameKey?: string;
  colors?: Array<keyof typeof COLORS>;
  showLegend?: boolean;
}

export const DataPieChart: React.FC<PieChartProps> = ({
  title,
  subtitle,
  data,
  dataKey,
  nameKey = 'name',
  colors = ['blue', 'green', 'orange', 'red', 'purple', 'pink'],
  height = 300,
  showLegend = true,
  isDark = false,
  className
}) => {
  const chartColors = colors.map(c => COLORS[c]);

  return (
    <ChartContainer $isDark={isDark} className={className}>
      {(title || subtitle) && (
        <ChartHeader>
          {title && <ChartTitle $isDark={isDark}>{title}</ChartTitle>}
          {subtitle && <ChartSubtitle $isDark={isDark}>{subtitle}</ChartSubtitle>}
        </ChartHeader>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            dataKey={dataKey}
            nameKey={nameKey}
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={(entry) => entry[nameKey]}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)',
              border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'}`,
              borderRadius: '8px',
              color: isDark ? '#f5f5f7' : '#1d1d1f',
              fontSize: 12
            }}
          />
          {showLegend && <Legend />}
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
