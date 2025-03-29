'use client';

import { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  IconButton,
  Alert,
} from '@mui/material';
import { Add, ContentCopy, Delete } from '@mui/icons-material';
import { Table } from '@repo/ui/Table';

interface APIKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed: string;
}

interface WebhookConfig {
  id: string;
  url: string;
  events: string[];
  active: boolean;
}

const sampleAPIKeys: APIKey[] = [
  {
    id: '1',
    name: 'Production API Key',
    key: 'sk_prod_123456789',
    createdAt: '2025-03-01T10:00:00',
    lastUsed: '2025-03-29T11:20:00'
  },
  {
    id: '2',
    name: 'Development API Key',
    key: 'sk_dev_987654321',
    createdAt: '2025-03-15T14:30:00',
    lastUsed: '2025-03-29T10:45:00'
  }
];

const sampleWebhooks: WebhookConfig[] = [
  {
    id: '1',
    url: 'https://api.example.com/webhook',
    events: ['completion.success', 'completion.error'],
    active: true
  }
];

export default function SettingsPage() {
  const [showNewKeyForm, setShowNewKeyForm] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [notifications, setNotifications] = useState({
    email: true,
    slack: false,
    discord: false
  });

  const apiKeyColumns = [
    { id: 'name', label: 'Name' },
    {
      id: 'key',
      label: 'API Key',
      render: (row: APIKey) => (
        <Box display="flex" alignItems="center">
          <Typography sx={{ fontFamily: 'monospace' }}>
            {row.key.slice(0, 8)}...{row.key.slice(-4)}
          </Typography>
          <IconButton size="small" sx={{ ml: 1 }}>
            <ContentCopy />
          </IconButton>
        </Box>
      )
    },
    { id: 'createdAt', label: 'Created' },
    { id: 'lastUsed', label: 'Last Used' },
    {
      id: 'actions',
      label: 'Actions',
      render: (row: APIKey) => (
        <IconButton color="error" size="small">
          <Delete />
        </IconButton>
      )
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* API Keys Section */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">API Keys</Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setShowNewKeyForm(true)}
              >
                Create New Key
              </Button>
            </Box>

            {showNewKeyForm && (
              <Box sx={{ mb: 3 }}>
                <Alert severity="info" sx={{ mb: 2 }}>
                  The API key will only be shown once upon creation. Please store it securely.
                </Alert>
                <Box display="flex" gap={2}>
                  <TextField
                    label="Key Name"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    size="small"
                  />
                  <Button variant="contained" disabled={!newKeyName}>
                    Create
                  </Button>
                  <Button variant="outlined" onClick={() => setShowNewKeyForm(false)}>
                    Cancel
                  </Button>
                </Box>
              </Box>
            )}

            <Table
              data={sampleAPIKeys}
              columns={apiKeyColumns}
            />
          </Paper>
        </Grid>

        {/* Model Provider Settings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Model Providers
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                OpenAI Configuration
              </Typography>
              <TextField
                fullWidth
                label="API Key"
                type="password"
                margin="normal"
                size="small"
              />
              <TextField
                fullWidth
                label="Organization ID"
                margin="normal"
                size="small"
              />
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Anthropic Configuration
              </Typography>
              <TextField
                fullWidth
                label="API Key"
                type="password"
                margin="normal"
                size="small"
              />
            </Box>
          </Paper>
        </Grid>

        {/* Usage Limits */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Usage Limits
            </Typography>
            <TextField
              fullWidth
              label="Monthly Budget ($)"
              type="number"
              margin="normal"
              size="small"
              defaultValue={100}
            />
            <TextField
              fullWidth
              label="Max Requests per Minute"
              type="number"
              margin="normal"
              size="small"
              defaultValue={60}
            />
            <TextField
              fullWidth
              label="Max Tokens per Request"
              type="number"
              margin="normal"
              size="small"
              defaultValue={2000}
            />
          </Paper>
        </Grid>

        {/* Notifications */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Notifications
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={notifications.email}
                  onChange={(e) => setNotifications(prev => ({
                    ...prev,
                    email: e.target.checked
                  }))}
                />
              }
              label="Email Notifications"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={notifications.slack}
                  onChange={(e) => setNotifications(prev => ({
                    ...prev,
                    slack: e.target.checked
                  }))}
                />
              }
              label="Slack Notifications"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={notifications.discord}
                  onChange={(e) => setNotifications(prev => ({
                    ...prev,
                    discord: e.target.checked
                  }))}
                />
              }
              label="Discord Notifications"
            />
          </Paper>
        </Grid>

        {/* Webhooks */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Webhooks
            </Typography>
            {sampleWebhooks.map(webhook => (
              <Box key={webhook.id} sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="Webhook URL"
                  value={webhook.url}
                  size="small"
                  sx={{ mb: 1 }}
                />
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="caption" color="textSecondary">
                    Events: {webhook.events.join(', ')}
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        size="small"
                        checked={webhook.active}
                      />
                    }
                    label="Active"
                  />
                </Box>
              </Box>
            ))}
            <Button
              variant="outlined"
              startIcon={<Add />}
              fullWidth
              sx={{ mt: 2 }}
            >
              Add Webhook
            </Button>
          </Paper>
        </Grid>

        {/* Save Changes */}
        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button variant="outlined">
              Cancel Changes
            </Button>
            <Button variant="contained" color="primary">
              Save Changes
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
