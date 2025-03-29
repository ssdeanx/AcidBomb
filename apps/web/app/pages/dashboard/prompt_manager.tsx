'use client';

import { useState } from 'react';
import { Box, Grid, Paper, Typography, TextField, Button } from '@mui/material';
import { Table } from '@repo/ui/Table';
import { Charts } from '@repo/ui/Charts';
import { ModelSelector } from '@repo/ui/ModelSelector';
import { ChatWindow } from '@repo/ui/Chatwindow';

interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
  version: string;
  createdAt: string;
  performance: {
    successRate: number;
    avgLatency: number;
    costPerUse: number;
  };
}

const sampleTemplates: PromptTemplate[] = [
  {
    id: '1',
    name: 'Customer Support',
    description: 'Template for handling customer inquiries',
    template: 'You are a helpful customer service agent. {{input}}',
    version: '1.0.0',
    createdAt: '2025-03-29T10:00:00',
    performance: {
      successRate: 98.5,
      avgLatency: 1.2,
      costPerUse: 0.015
    }
  },
  {
    id: '2',
    name: 'Code Review',
    description: 'Template for reviewing code changes',
    template: 'Review this code and provide feedback: {{code}}',
    version: '1.1.0',
    createdAt: '2025-03-29T09:30:00',
    performance: {
      successRate: 95.0,
      avgLatency: 2.1,
      costPerUse: 0.025
    }
  }
];

export default function PromptManager() {
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(null);
  const [testInput, setTestInput] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-4');

  const columns = [
    { id: 'name', label: 'Name' },
    { id: 'version', label: 'Version' },
    {
      id: 'performance',
      label: 'Success Rate',
      render: (row: PromptTemplate) => `${row.performance.successRate}%`
    },
    {
      id: 'performance',
      label: 'Avg. Latency',
      render: (row: PromptTemplate) => `${row.performance.avgLatency}s`
    },
    {
      id: 'performance',
      label: 'Cost/Use',
      render: (row: PromptTemplate) => `$${row.performance.costPerUse}`
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Templates List */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Prompt Templates
            </Typography>
            <Table
              data={sampleTemplates}
              columns={columns}
              onRowClick={(row) => setSelectedTemplate(row as PromptTemplate)}
            />
          </Paper>
        </Grid>

        {/* Template Editor */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Template Editor
            </Typography>
            <TextField
              fullWidth
              label="Name"
              value={selectedTemplate?.name || ''}
              margin="normal"
              disabled={!selectedTemplate}
            />
            <TextField
              fullWidth
              label="Description"
              value={selectedTemplate?.description || ''}
              margin="normal"
              multiline
              rows={2}
              disabled={!selectedTemplate}
            />
            <TextField
              fullWidth
              label="Template"
              value={selectedTemplate?.template || ''}
              margin="normal"
              multiline
              rows={4}
              disabled={!selectedTemplate}
            />
          </Paper>
        </Grid>

        {/* Template Testing */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Template Testing
            </Typography>
            <ModelSelector
              value={selectedModel}
              onChange={(model) => setSelectedModel(model)}
              models={[
                { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI' },
                { id: 'gpt-3.5', name: 'GPT-3.5', provider: 'OpenAI' },
                { id: 'claude-2', name: 'Claude 2', provider: 'Anthropic' }
              ]}
            />
            <TextField
              fullWidth
              label="Test Input"
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              margin="normal"
              multiline
              rows={4}
            />
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              disabled={!selectedTemplate || !testInput}
            >
              Test Template
            </Button>
          </Paper>
        </Grid>

        {/* Performance Analytics */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Template Performance
            </Typography>
            <Charts
              type="line"
              height={300}
              data={[
                { date: '2025-03-23', successRate: 98, latency: 1.2, cost: 0.015 },
                { date: '2025-03-24', successRate: 97, latency: 1.3, cost: 0.016 },
                { date: '2025-03-25', successRate: 99, latency: 1.1, cost: 0.014 },
                { date: '2025-03-26', successRate: 98, latency: 1.2, cost: 0.015 },
                { date: '2025-03-27', successRate: 97, latency: 1.4, cost: 0.017 }
              ]}
              dataKeys={['successRate', 'latency', 'cost']}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
