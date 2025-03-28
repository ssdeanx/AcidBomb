'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import { Box, Paper, useTheme } from '@mui/material';

// Dynamic import for Plotly to avoid SSR issues
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

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
  layout?: Partial<Plotly.Layout>;

  /**
   * Plot configuration options
   */
  config?: Partial<Plotly.Config>;

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

export const graphs = React.forwardRef<HTMLDivElement, GraphProps>(
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

    // Default configuration
    const defaultConfig = {
      responsive: true,
      displayModeBar: true,
      displaylogo: false,
      modeBarButtonsToRemove: ['lasso2d', 'select2d'],
      ...config,
    };

    // Default layout based on theme
    const defaultLayout = {
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
    };

    // Handle range selection for cross-linking
    const handleRelayout = (eventData: any) => {
      if (crossLink && onRangeChange && eventData['xaxis.range']) {
        onRangeChange(eventData['xaxis.range']);
      }
    };

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
          <Plot
            data={data}
            layout={defaultLayout}
            config={defaultConfig}
            onRelayout={handleRelayout}
          />
        </Paper>
      </Box>
    );
  }
);

graphs.displayName = 'graphs';
