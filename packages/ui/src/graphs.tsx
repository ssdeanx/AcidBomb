'use client';

import * as React from 'react';
import { Box, Paper } from '@mui/material';
import { useTheme } from './theme/ThemeProvider';
import type { Layout, Config } from 'plotly.js';
import type { PlotParams } from 'react-plotly.js'; // Import PlotParams type

// Explicitly type the lazy loaded component
const Plot = React.lazy(() =>
  import('react-plotly.js').then(module => ({ default: module.default as unknown as React.ComponentType<PlotParams> }))
);

interface GraphProps {
  type: 'line' | 'bar' | 'scatter' | 'pie' | 'heatmap' | 'candlestick';
  data: any[];
  layout?: Partial<Layout>;
  config?: Partial<Config>;
  width?: number | string;
  height?: number | string;
  crossLink?: boolean;
  onRangeChange?: (range: [Date, Date]) => void;
}

class GraphErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return <Box sx={{ p: 2, color: 'error.main' }}>Error loading graph.</Box>;
    }
    return this.props.children;
  }
}

export const Graphs = React.forwardRef<HTMLDivElement, GraphProps>(
  (props, ref) => {
    const {
      type,
      data,
      layout = {},
      config = {},
      width = '100%',
      height = 400,
      crossLink = false,
      onRangeChange,
      ...rest
    } = props;

    const theme = useTheme();

    return (
      <Box ref={ref} {...rest}>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            backgroundColor: 'transparent',
            backdropFilter: 'blur(8px)',
          }}
        >
          <React.Suspense fallback={<Box sx={{ p: 2 }}>Loading graph...</Box>}>
            <GraphErrorBoundary>
              <Plot
                data={data}
                layout={{
                  width: typeof width === 'number' ? width : undefined,
                  height: typeof height === 'number' ? height : undefined,
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
            </GraphErrorBoundary>
          </React.Suspense>
        </Paper>
      </Box>
    );
  }
);

Graphs.displayName = 'Graphs';
