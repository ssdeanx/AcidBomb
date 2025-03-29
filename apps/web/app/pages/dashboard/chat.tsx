'use client';

import { useState } from 'react';
import { Box, Grid, Paper, Typography, useTheme } from '@mui/material';
import { ChatWindow } from '@repo/ui/Chatwindow';
import { ModelSelector } from '@repo/ui/ModelSelector';
import { Charts } from '@repo/ui/Charts';
import { Table } from '@repo/ui/Table';

interface ChatMetrics {
  totalMessages: number;
  avgResponseTime: number;
  totalCost: number;
  successRate: number;
}

interface ChatSession {
  id: string;
  model: string;
  messages: number;
  timestamp: string;
  cost: number;
}

const sampleMetrics: ChatMetrics = {
  totalMessages: 1250,
  avgResponseTime: 2.3,
  totalCost: 15.75,
  successRate: 98.5
};

const sampleSessions: ChatSession[] = [
  { id: '1', model: 'gpt-4', messages: 25, timestamp: '2025-03-29T10:00:00', cost: 0.45 },
  { id: '2', model: 'gpt-3.5', messages: 15, timestamp: '2025-03-29T09:30:00', cost: 0.15 },
];

export default function ChatDashboard() {
  const theme = useTheme();
  const [selectedModel, setSelectedModel] = useState('gpt-4');

  // Columns for the sessions table
  const columns = [
    { id: 'id', label: 'Session ID' },
    { id: 'model', label: 'Model' },
    { id: 'messages', label: 'Messages' },
    { id: 'timestamp', label: 'Time' },
    { id: 'cost', label: 'Cost ($)' },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Model Selection */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Model Selection
            </Typography>
            <ModelSelector
              value={selectedModel}
              onChange={(model) => setSelectedModel(model)}
              models={[
                { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI' },
                { id: 'gpt-3.5', name: 'GPT-3.5', provider: 'OpenAI' },
                { id: 'claude-2', name: 'Claude 2', provider: 'Anthropic' },
              ]}
            />
          </Paper>
        </Grid>

        {/* Metrics Overview */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Chat Metrics
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} md={3}>
                <Typography variant="subtitle2" color="textSecondary">
                  Total Messages
                </Typography>
                <Typography variant="h4">
                  {sampleMetrics.totalMessages}
                </Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="subtitle2" color="textSecondary">
                  Avg Response Time
                </Typography>
                <Typography variant="h4">
                  {sampleMetrics.avgResponseTime}s
                </Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="subtitle2" color="textSecondary">
                  Total Cost
                </Typography>
                <Typography variant="h4">
                  ${sampleMetrics.totalCost}
                </Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="subtitle2" color="textSecondary">
                  Success Rate
                </Typography>
                <Typography variant="h4">
                  {sampleMetrics.successRate}%
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Chat Interface */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
            <ChatWindow
              messages={[]}
              onSendMessage={(message) => console.log('Sending:', message)}
              model={selectedModel}
              stream={true}
            />
          </Paper>
        </Grid>

        {/* Chat History & Analytics */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '600px', overflow: 'auto' }}>
            <Typography variant="h6" gutterBottom>
              Chat Sessions
            </Typography>
            <Table
              data={sampleSessions}
              columns={columns.map(col => ({
                id: col.id,
                label: col.label,
                render: (row: ChatSession) => row[col.id as keyof ChatSession]
              }))}
            />
          </Paper>
        </Grid>

        {/* Usage Charts */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Usage Analytics
            </Typography>
            <Charts
              type="line"
              height={300}
              data={[
                { date: '2025-03-23', messages: 150, cost: 2.5 },
                { date: '2025-03-24', messages: 230, cost: 3.8 },
                { date: '2025-03-25', messages: 180, cost: 3.0 },
                { date: '2025-03-26', messages: 290, cost: 4.8 },
                { date: '2025-03-27', messages: 320, cost: 5.3 },
              ]}
              dataKeys={['messages', 'cost']}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
