'use client';

import * as React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { styled, useTheme, alpha } from '@mui/material';

export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number; // Allow additional data points
}

export interface ChartProps {
  /**
   * The type of chart to render
   */
  type: 'line' | 'bar' | 'area' | 'pie';

  /**
   * The data to display in the chart
   */
  data: ChartDataPoint[];

  /**
   * The height of the chart container
   * @default 300
   */
  height?: number;

  /**
   * Keys to plot on the chart (except 'name')
   */
  dataKeys?: string[];

  /**
   * Custom colors for the chart elements
   */
  colors?: string[];

  /**
   * Whether to show the grid
   * @default true
   */
  grid?: boolean;

  /**
   * Whether to animate the chart
   * @default true
   */
  animate?: boolean;

  /**
   * Custom className
   */
  className?: string;
}

const ChartContainer = styled('div')({
  width: '100%',
  height: '100%',
});

export const charts = React.forwardRef<HTMLDivElement, ChartProps>(
  ({
    type = 'line',
    data,
    height = 300,
    dataKeys,
    colors,
    grid = true,
    animate = true,
    className,
    ...props
  }, ref) => {
    const theme = useTheme();

    // Default colors using theme
    const defaultColors = [
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.success.main,
      theme.palette.warning.main,
      theme.palette.error.main,
    ];

    // Use provided colors or defaults
    const chartColors = colors || defaultColors;

    // Extract data keys if not provided
    const keys = dataKeys || Object.keys(data[0] || {}).filter(key => key !== 'name');

    const commonProps = {
      data,
      margin: { top: 10, right: 30, left: 0, bottom: 0 },
    };

    const renderChart = () => {
      switch (type) {
        case 'line':
          return (
            <LineChart {...commonProps}>
              {grid && <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.text.primary, 0.1)} />}
              <XAxis
                dataKey="name"
                stroke={theme.palette.text.secondary}
                tick={{ fill: theme.palette.text.secondary }}
              />
              <YAxis
                stroke={theme.palette.text.secondary}
                tick={{ fill: theme.palette.text.secondary }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: theme.shape.borderRadius,
                }}
              />
              <Legend />
              {keys.map((key, index) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={chartColors[index % chartColors.length] || theme.palette.primary.main}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  isAnimationActive={animate}
                />
              ))}
            </LineChart>
          );

        case 'bar':
          return (
            <BarChart {...commonProps}>
              {grid && <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.text.primary, 0.1)} />}
              <XAxis
                dataKey="name"
                stroke={theme.palette.text.secondary}
                tick={{ fill: theme.palette.text.secondary }}
              />
              <YAxis
                stroke={theme.palette.text.secondary}
                tick={{ fill: theme.palette.text.secondary }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: theme.shape.borderRadius,
                }}
              />
              <Legend />
              {keys.map((key, index) => (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={chartColors[index % chartColors.length] || theme.palette.primary.main}
                  radius={[4, 4, 0, 0]}
                  isAnimationActive={animate}
                />
              ))}
            </BarChart>
          );

        case 'area':
          return (
            <AreaChart {...commonProps}>
              {grid && <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.text.primary, 0.1)} />}
              <XAxis
                dataKey="name"
                stroke={theme.palette.text.secondary}
                tick={{ fill: theme.palette.text.secondary }}
              />
              <YAxis
                stroke={theme.palette.text.secondary}
                tick={{ fill: theme.palette.text.secondary }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: theme.shape.borderRadius,
                }}
              />
              <Legend />
              {keys.map((key, index) => (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  fill={alpha(chartColors[index % chartColors.length] || theme.palette.primary.main, 0.2)}
                  stroke={chartColors[index % chartColors.length] || theme.palette.primary.main}
                  isAnimationActive={animate}
                />
              ))}
            </AreaChart>
          );

        case 'pie':
          return (
            <PieChart>
              <Pie
                data={data}
                dataKey={keys[0] || 'value'}
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                isAnimationActive={animate}
                label
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={chartColors[index % chartColors.length] || theme.palette.primary.main}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: theme.shape.borderRadius,
                }}
              />
              <Legend />
            </PieChart>
          );
      }
    };

    return (
      <ChartContainer ref={ref} className={className} {...props}>
        <ResponsiveContainer width="100%" height={height}>
          {renderChart()}
        </ResponsiveContainer>
      </ChartContainer>
    );
  }
);

charts.displayName = 'Charts';
