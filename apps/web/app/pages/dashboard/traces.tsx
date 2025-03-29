'use client';

import { useState } from 'react';
import { Box, Grid, Paper, Typography, TextField, Chip, IconButton } from '@mui/material';
import { Search, FilterList, Download } from '@mui/icons-material';
import { Table } from '@repo/ui/Table';
import { Charts } from '@repo/ui/Charts';
import { Code } from '@repo/ui/Code';

interface Trace {
  id: string;
  timestamp: string;
  model: string;
  prompt: string;
  completion: string;
  latency: number;
  tokenCount: number;
  cost: number;
  status: 'success' | 'error' | 'timeout';
}

const sampleTraces: Trace[] = [
  {
    id: 'trace_1',
    timestamp: '2025-03-29T11:20:00',
    model: 'gpt-4',
    prompt: 'Explain quantum computing',
    completion: 'Quantum computing is...',
    latency: 850,
    tokenCount: 245,
    cost: 0.12,
    status: 'success'
  },
  {
    id: 'trace_2',
    timestamp: '2025-03-29T11:15:00',
    model: 'gpt-3.5',
    prompt: 'Generate a poem about AI',
    completion: 'In silicon dreams...',
    latency: 450,
    tokenCount: 180,
    cost: 0.05,
    status: 'success'
  }
];

export default function TracesViewer() {
  const [selectedTrace, setSelectedTrace] = useState<Trace | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const columns = [
    { id: 'id', label: 'Trace ID' },
    { id: 'timestamp', label: 'Time' },
    { id: 'model', label: 'Model' },
    {
      id: 'status',
      label: 'Status',
      render: (row: Trace) => (
        <Chip
          label={row.status}
          color={row.status === 'success' ? 'success' : 'error'}
          size="small"
        />
      )
    },
    {
      id: 'latency',
      label: 'Latency',
      render: (row: Trace) => `${row.latency}ms`
    },
    {
      id: 'cost',
      label: 'Cost',
      render: (row: Trace) => `$${row.cost}`
    }
  ];

  const performanceData = [
    { time: '11:00', latency: 450, success: 98, cost: 0.05 },
    { time: '11:05', latency: 480, success: 97, cost: 0.06 },
    { time: '11:10', latency: 520, success: 99, cost: 0.04 },
    { time: '11:15', latency: 450, success: 100, cost: 0.05 },
    { time: '11:20', latency: 850, success: 98, cost: 0.12 }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Search and Filters */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box display="flex" gap={2} alignItems="center">
              <TextField
                fullWidth
                placeholder="Search traces..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
              <IconButton>
                <FilterList />
              </IconButton>
              <IconButton>
                <Download />
              </IconButton>
            </Box>
          </Paper>
        </Grid>

        {/* Performance Metrics */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Real-time Performance
            </Typography>
            <Charts
              type="line"
              height={250}
              data={performanceData}
              dataKeys={['latency', 'success', 'cost']}
            />
          </Paper>
        </Grid>

        {/* Traces List */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Traces
            </Typography>
            <Table
              data={sampleTraces}
              columns={columns}
              onRowClick={(row) => setSelectedTrace(row as Trace)}
            />
          </Paper>
        </Grid>

        {/* Trace Inspector */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Trace Inspector
            </Typography>
            {selectedTrace ? (
              <Box>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Prompt
                </Typography>
                <Code>
                  {selectedTrace.prompt}
                </Code>

                <Typography variant="subtitle2" color="textSecondary" gutterBottom sx={{ mt: 2 }}>
                  Completion
                </Typography>
                <Code>
                  {selectedTrace.completion}
                </Code>

                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={6} md={3}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Latency
                    </Typography>
                    <Typography variant="h6">
                      {selectedTrace.latency}ms
                    </Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Tokens
                    </Typography>
                    <Typography variant="h6">
                      {selectedTrace.tokenCount}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Cost
                    </Typography>
                    <Typography variant="h6">
                      ${selectedTrace.cost}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Status
                    </Typography>
                    <Chip
                      label={selectedTrace.status}
                      color={selectedTrace.status === 'success' ? 'success' : 'error'}
                    />
                  </Grid>
                </Grid>
              </Box>
            ) : (
              <Typography color="textSecondary">
                Select a trace to inspect
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
