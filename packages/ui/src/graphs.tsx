'use client';

import * as React from 'react';
import { Box, Paper } from '@mui/material';
import { useTheme } from '/ThemeProvider';

import type { Layout, Config } from 'plotly.js';

// Use React.lazy instead of next/dynamic
const Plot = React.lazy(() => import('react-plotly.js'));

export interface GraphProps {
  /**
   * The type of graph to render
   */
  type: 'line' | 'bar' | 'scatter' | 'pie' | 'heatmap' | 'candlestick';

  /**
   * The data to be plotted
   */
  data: any[];

  /**
   * Layout configuration for the plot
   */
  layout?: Partial<Layout>;

  /**
   * Plot configuration options
   */
  config?: Partial<Config>;

  /**
   * Width of the graph
   * @default '100%'
   */
  width?: number | string;

  /**
   * Height of the graph
   * @default 400
   */
  height?: number | string;

  /**
   * Enable cross-linking with other plots
   * @default false
   */
  crossLink?: boolean;

  /**
   * Callback when range is updated (for cross-linking)
   */
  onRangeChange?: (range: [Date, Date]) => void;
}

export const Graphs = React.forwardRef<HTMLDivElement, GraphProps>(
  ({
    type,
    data,
    layout = {},
    config = {},
    width = '100%',
    height = 400,
    crossLink = false,
    onRangeChange,
    ...props
  }, ref) => {
    const theme = useTheme();

    // Add Suspense boundary inside the component
    return (
      <Box ref={ref} {...props}>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            backgroundColor: 'transparent',
            backdropFilter: 'blur(8px)',
          }}
        >
          <React.Suspense fallback={<div>Loading graph...</div>}>
            <Plot
              data={data}
              layout={{
                width,
                height,
                paper_bgcolor: 'transparent',
                plot_bgcolor: 'transparent',
                font: {
                  family: theme.typography.fontFamily,
                  color: theme.palette.text.primary,
                },
                margin: { t: 30, r: 10, l: 10, b: 30 },
                xaxis: {
                  gridcolor: theme.palette.divider,
                  zerolinecolor: theme.palette.divider,
                },
                yaxis: {
                  gridcolor: theme.palette.divider,
                  zerolinecolor: theme.palette.divider,
                },
                ...layout,
              }}
              config={{
                responsive: true,
                displayModeBar: true,
                displaylogo: false,
                modeBarButtonsToRemove: ['lasso2d', 'select2d'],
                ...config,
              }}
              onRelayout={(eventData: any) => {
                if (crossLink && onRangeChange && eventData['xaxis.range']) {
                  onRangeChange(eventData['xaxis.range']);
                }
              }}
            />
          </React.Suspense>
        </Paper>
      </Box>
    );
  }
);

Graphs.displayName = 'Graphs';
