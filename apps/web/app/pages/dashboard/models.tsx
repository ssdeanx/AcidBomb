'use client';

import { useState } from 'react';
import { Box, Grid, Paper, Typography, LinearProgress, Chip, Button } from '@mui/material';
import { Table } from '@repo/ui/Table';
import { Charts } from '@repo/ui/Charts';
import { Graphs } from '@repo/ui/Graphs';

interface ModelStats {
  id: string;
  name: string;
  provider: string;
  version: string;
  status: 'active' | 'inactive';
  performance: {
    avgLatency: number;
    throughput: number;
    errorRate: number;
    costPer1k: number;
    utilizationRate: number;
  };
  limits: {
    current: number;
    max: number;
  };
}

const sampleModels: ModelStats[] = [
  {
    id: 'gpt-4',
    name: 'GPT-4',
    provider: 'OpenAI',
    version: '1.0',
    status: 'active',
    performance: {
      avgLatency: 850,
      throughput: 250,
      errorRate: 0.5,
      costPer1k: 0.03,
      utilizationRate: 78
    },
    limits: {
      current: 78,
      max: 100
    }
  },
  {
    id: 'gpt-3.5',
    name: 'GPT-3.5',
    provider: 'OpenAI',
    version: '2.0',
    status: 'active',
    performance: {
      avgLatency: 450,
      throughput: 500,
      errorRate: 0.8,
      costPer1k: 0.01,
      utilizationRate: 65
    },
    limits: {
      current: 65,
      max: 100
    }
  }
];

export default function ModelsPage() {
  const [selectedModel, setSelectedModel] = useState<ModelStats | null>(null);

  const columns = [
    { id: 'name', label: 'Model' },
    { id: 'provider', label: 'Provider' },
    {
      id: 'status',
      label: 'Status',
      render: (row: ModelStats) => (
        <Chip
          label={row.status}
          color={row.status === 'active' ? 'success' : 'default'}
          size="small"
        />
      )
    },
    {
      id: 'performance',
      label: 'Latency',
      render: (row: ModelStats) => `${row.performance.avgLatency}ms`
    },
    {
      id: 'performance',
      label: 'Cost/1K tokens',
      render: (row: ModelStats) => `$${row.performance.costPer1k}`
    },
    {
      id: 'performance',
      label: 'Error Rate',
      render: (row: ModelStats) => `${row.performance.errorRate}%`
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Model Performance Overview */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Model Performance
            </Typography>
            <Grid container spacing={3}>
              {sampleModels.map((model) => (
                <Grid item xs={12} md={6} key={model.id}>
                  <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="subtitle1">
                        {model.name}
                      </Typography>
                      <Chip
                        label={model.status}
                        color={model.status === 'active' ? 'success' : 'default'}
                        size="small"
                      />
                    </Box>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Utilization
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={model.performance.utilizationRate}
                      sx={{ mb: 1, height: 8, borderRadius: 4 }}
                    />
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="caption" color="textSecondary">
                        {model.performance.utilizationRate}% used
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {model.limits.max - model.limits.current} requests remaining
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Model Comparison */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Model Comparison
            </Typography>
            <Table
              data={sampleModels}
              columns={columns}
              onRowClick={(row) => setSelectedModel(row as ModelStats)}
            />
          </Paper>
        </Grid>

        {/* Performance Metrics */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Response Time Distribution
            </Typography>
            <Graphs
              type="histogram"
              data={[
                { model: 'GPT-4', latency: 850, frequency: 120 },
                { model: 'GPT-4', latency: 900, frequency: 80 },
                { model: 'GPT-4', latency: 950, frequency: 40 },
                { model: 'GPT-3.5', latency: 450, frequency: 200 },
                { model: 'GPT-3.5', latency: 500, frequency: 150 },
                { model: 'GPT-3.5', latency: 550, frequency: 100 },
              ]}
              xAxis="latency"
              yAxis="frequency"
              groupBy="model"
            />
          </Paper>
        </Grid>

        {/* Cost Analysis */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Cost Trends
            </Typography>
            <Charts
              type="line"
              height={300}
              data={[
                { date: '2025-03-23', gpt4Cost: 0.03, gpt35Cost: 0.01 },
                { date: '2025-03-24', gpt4Cost: 0.032, gpt35Cost: 0.011 },
                { date: '2025-03-25', gpt4Cost: 0.029, gpt35Cost: 0.01 },
                { date: '2025-03-26', gpt4Cost: 0.031, gpt35Cost: 0.012 },
                { date: '2025-03-27', gpt4Cost: 0.03, gpt35Cost: 0.01 }
              ]}
              dataKeys={['gpt4Cost', 'gpt35Cost']}
            />
          </Paper>
        </Grid>

        {/* Budget Controls */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">
                Budget Controls
              </Typography>
              <Button variant="contained" color="primary">
                Configure Limits
              </Button>
            </Box>
            {sampleModels.map((model) => (
              <Box key={model.id} sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  {model.name} Usage
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={(model.limits.current / model.limits.max) * 100}
                  sx={{ height: 8, borderRadius: 4 }}
                />
                <Box display="flex" justifyContent="space-between" mt={0.5}>
                  <Typography variant="caption" color="textSecondary">
                    ${model.performance.costPer1k} per 1K tokens
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {model.limits.current}/{model.limits.max} requests
                  </Typography>
                </Box>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
