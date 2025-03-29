'use client';

import { useState } from 'react';
import { Box, Grid, Paper, Typography, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { Charts } from '@repo/ui/Charts';
import { Graphs } from '@repo/ui/Graphs';

type TimeRange = '1h' | '24h' | '7d' | '30d' | 'custom';
type MetricType = 'latency' | 'cost' | 'requests' | 'errors';

interface MetricData {
  timestamp: string;
  value: number;
  model: string;
}

const sampleMetrics = {
  latency: [
    { timestamp: '2025-03-29T10:00', value: 450, model: 'gpt-4' },
    { timestamp: '2025-03-29T10:15', value: 480, model: 'gpt-4' },
    { timestamp: '2025-03-29T10:30', value: 420, model: 'gpt-4' },
    { timestamp: '2025-03-29T10:45', value: 460, model: 'gpt-4' },
  ],
  cost: [
    { timestamp: '2025-03-29T10:00', value: 0.15, model: 'gpt-4' },
    { timestamp: '2025-03-29T10:15', value: 0.18, model: 'gpt-4' },
    { timestamp: '2025-03-29T10:30', value: 0.12, model: 'gpt-4' },
    { timestamp: '2025-03-29T10:45', value: 0.16, model: 'gpt-4' },
  ],
  requests: [
    { timestamp: '2025-03-29T10:00', value: 250, model: 'gpt-4' },
    { timestamp: '2025-03-29T10:15', value: 280, model: 'gpt-4' },
    { timestamp: '2025-03-29T10:30', value: 220, model: 'gpt-4' },
    { timestamp: '2025-03-29T10:45', value: 260, model: 'gpt-4' },
  ],
  errors: [
    { timestamp: '2025-03-29T10:00', value: 5, model: 'gpt-4' },
    { timestamp: '2025-03-29T10:15', value: 8, model: 'gpt-4' },
    { timestamp: '2025-03-29T10:30', value: 3, model: 'gpt-4' },
    { timestamp: '2025-03-29T10:45', value: 6, model: 'gpt-4' },
  ],
};

export default function MetricsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('24h');
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('latency');

  const getMetricTitle = (metric: MetricType): string => {
    switch (metric) {
      case 'latency':
        return 'Response Time (ms)';
      case 'cost':
        return 'Cost ($)';
      case 'requests':
        return 'Request Count';
      case 'errors':
        return 'Error Count';
      default:
        return '';
    }
  };

  const getMetricData = (metric: MetricType) => {
    return sampleMetrics[metric];
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Time Range Selector */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Metrics Dashboard</Typography>
              <ToggleButtonGroup
                value={timeRange}
                exclusive
                onChange={(_, value) => value && setTimeRange(value)}
                size="small"
              >
                <ToggleButton value="1h">1H</ToggleButton>
                <ToggleButton value="24h">24H</ToggleButton>
                <ToggleButton value="7d">7D</ToggleButton>
                <ToggleButton value="30d">30D</ToggleButton>
                <ToggleButton value="custom">Custom</ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Paper>
        </Grid>

        {/* Key Metrics Overview */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              Avg Response Time
            </Typography>
            <Typography variant="h4">456ms</Typography>
            <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
              ↓ 12% from last period
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              Total Requests
            </Typography>
            <Typography variant="h4">1,234</Typography>
            <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
              ↑ 23% from last period
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              Total Cost
            </Typography>
            <Typography variant="h4">$45.67</Typography>
            <Typography variant="body2" color="error.main" sx={{ mt: 1 }}>
              ↑ 8% from last period
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              Error Rate
            </Typography>
            <Typography variant="h4">1.2%</Typography>
            <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
              ↓ 30% from last period
            </Typography>
          </Paper>
        </Grid>

        {/* Main Metric Chart */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {getMetricTitle(selectedMetric)}
            </Typography>
            <Charts
              type="line"
              height={400}
              data={getMetricData(selectedMetric)}
              dataKeys={['value']}
            />
          </Paper>
        </Grid>

        {/* Distribution Charts */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Response Time Distribution
            </Typography>
            <Graphs
              type="histogram"
              data={[
                { range: '0-200ms', count: 150 },
                { range: '201-400ms', count: 300 },
                { range: '401-600ms', count: 200 },
                { range: '601-800ms', count: 100 },
                { range: '801ms+', count: 50 }
              ]}
              xAxis="range"
              yAxis="count"
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Cost Distribution by Model
            </Typography>
            <Charts
              type="pie"
              height={300}
              data={[
                { model: 'GPT-4', value: 456.78 },
                { model: 'GPT-3.5', value: 234.56 },
                { model: 'Claude-2', value: 345.67 }
              ]}
              dataKeys={['value']}
            />
          </Paper>
        </Grid>

        {/* Metric Type Selector */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <ToggleButtonGroup
              value={selectedMetric}
              exclusive
              onChange={(_, value) => value && setSelectedMetric(value)}
              fullWidth
            >
              <ToggleButton value="latency">Response Time</ToggleButton>
              <ToggleButton value="requests">Requests</ToggleButton>
              <ToggleButton value="cost">Cost</ToggleButton>
              <ToggleButton value="errors">Errors</ToggleButton>
            </ToggleButtonGroup>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
