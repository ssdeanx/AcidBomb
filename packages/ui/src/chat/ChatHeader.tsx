'use client';

import * as React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Slider,
  TextField,
  FormControl,
  FormLabel,
  Select,
  SelectChangeEvent,
  InputLabel,
  alpha,
  styled,
  Divider,
} from '@mui/material';
import {
  Settings,
  MoreVert,
  AutoAwesome,
  RestartAlt,
  Download,
  ContentCopy,
  History,
  Save,
  Thermostat,
  Storage,
} from '@mui/icons-material';
import type { ChatSettings, ModelOption } from './types';

export interface ChatHeaderProps {
  /**
   * Chat title
   */
  title?: string;

  /**
   * Current model being used
   */
  model?: string;

  /**
   * Available models for selection
   */
  availableModels?: ModelOption[];

  /**
   * Current settings
   */
  settings?: ChatSettings;

  /**
   * Callback when model is changed
   */
  onModelChange?: (modelId: string) => void;

  /**
   * Callback when settings are changed
   */
  onSettingsChange?: (settings: ChatSettings) => void;

  /**
   * Callback for clearing chat history
   */
  onClearChat?: () => void;

  /**
   * Callback for exporting chat
   */
  onExportChat?: () => void;

  /**
   * Callback for copying chat content
   */
  onCopyChat?: () => void;
}

const StyledHeaderContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const StyledModelSelect = styled(Select)(({ theme }) => ({
  minWidth: 150,
  '& .MuiSelect-select': {
    padding: theme.spacing(1, 2),
  },
}));

const StyledSlider = styled(Slider)(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(1),
}));

/**
 * ChatHeader displays the title, model selector and action buttons
 */
export const ChatHeader: React.FC<ChatHeaderProps> = ({
  title = 'AI Chat',
  model,
  availableModels = [],
  settings = {},
  onModelChange,
  onSettingsChange,
  onClearChat,
  onExportChat,
  onCopyChat,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [localSettings, setLocalSettings] = React.useState<ChatSettings>(settings);

  // Update local settings when props change
  React.useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleClearChat = () => {
    onClearChat?.();
    handleMenuClose();
  };

  const handleExportChat = () => {
    onExportChat?.();
    handleMenuClose();
  };

  const handleCopyChat = () => {
    onCopyChat?.();
    handleMenuClose();
  };

  const handleModelChange = (event: SelectChangeEvent<unknown>) => {
    // The value from SelectChangeEvent is unknown, cast it to string
    onModelChange?.(event.target.value as string);
  };

  const handleSettingChange = <K extends keyof ChatSettings>(
    setting: K,
    value: ChatSettings[K]
  ) => {
    setLocalSettings(prev => ({
      ...prev,
      [setting]: value,
    }));
  };

  const handleSaveSettings = () => {
    onSettingsChange?.(localSettings);
    setSettingsOpen(false);
  };

  const renderSettingsDialog = () => (
    <Dialog
      open={settingsOpen}
      onClose={() => setSettingsOpen(false)}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Chat Settings</DialogTitle>
      <DialogContent>
        <Box sx={{ py: 2 }}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <FormLabel id="temperature-slider-label" sx={{ mb: 1 }}>
              Temperature: {localSettings.temperature?.toFixed(2) || '0.70'}
            </FormLabel>
            <StyledSlider
              aria-labelledby="temperature-slider-label"
              value={localSettings.temperature ?? 0.7}
              onChange={(_, value) => handleSettingChange('temperature', value as number)}
              min={0}
              max={1}
              step={0.01}
              marks={[
                { value: 0, label: 'Precise' },
                { value: 0.5, label: 'Balanced' },
                { value: 1, label: 'Creative' },
              ]}
            />
            <Typography variant="caption" color="text.secondary">
              Controls randomness: Lower values are more deterministic, higher values more creative
            </Typography>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <FormLabel id="max-tokens-slider-label" sx={{ mb: 1 }}>
              Max Tokens: {localSettings.maxTokens || '1024'}
            </FormLabel>
            <StyledSlider
              aria-labelledby="max-tokens-slider-label"
              value={localSettings.maxTokens ?? 1024}
              onChange={(_, value) => handleSettingChange('maxTokens', value as number)}
              min={64}
              max={4096}
              step={64}
              marks={[
                { value: 256, label: '256' },
                { value: 1024, label: '1024' },
                { value: 2048, label: '2048' },
                { value: 4096, label: '4096' },
              ]}
            />
            <Typography variant="caption" color="text.secondary">
              Maximum length of the model's response
            </Typography>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <FormLabel id="top-p-slider-label" sx={{ mb: 1 }}>
              Top P: {localSettings.topP?.toFixed(2) || '1.00'}
            </FormLabel>
            <StyledSlider
              aria-labelledby="top-p-slider-label"
              value={localSettings.topP ?? 1}
              onChange={(_, value) => handleSettingChange('topP', value as number)}
              min={0.1}
              max={1}
              step={0.01}
            />
            <Typography variant="caption" color="text.secondary">
              Controls token selection diversity (nucleus sampling)
            </Typography>
          </FormControl>

          <TextField
            fullWidth
            label="System Prompt"
            multiline
            rows={4}
            value={localSettings.systemPrompt || ''}
            onChange={(e) => handleSettingChange('systemPrompt', e.target.value)}
            sx={{ mb: 2 }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setSettingsOpen(false)}>Cancel</Button>
        <Button onClick={handleSaveSettings} variant="contained">
          Save Settings
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <>
      <StyledHeaderContainer>
        <AutoAwesome color="primary" />
        <Typography variant="h6" sx={{ flex: 1 }}>
          {title}
        </Typography>

        {availableModels.length > 0 && (
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel id="model-select-label">Model</InputLabel>
            <StyledModelSelect
              labelId="model-select-label"
              value={model || ''}
              label="Model"
              onChange={handleModelChange}
            >
              {availableModels.map((modelOption) => (
                <MenuItem key={modelOption.id} value={modelOption.id}>
                  <ListItemText
                    primary={modelOption.name}
                    secondary={modelOption.provider}
                    slotProps={{ primary: { variant: 'body2' }, secondary: { variant: 'caption' } }}
                  />
                </MenuItem>
              ))}
            </StyledModelSelect>
          </FormControl>
        )}

        <Tooltip title="Settings">
          <IconButton onClick={() => setSettingsOpen(true)}>
            <Settings />
          </IconButton>
        </Tooltip>

        <Tooltip title="More options">
          <IconButton onClick={handleMenuClick}>
            <MoreVert />
          </IconButton>
        </Tooltip>
      </StyledHeaderContainer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleClearChat} disabled={!onClearChat}>
          <ListItemIcon><RestartAlt /></ListItemIcon>
          <ListItemText>Clear chat</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleExportChat} disabled={!onExportChat}>
          <ListItemIcon><Download /></ListItemIcon>
          <ListItemText>Export chat</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleCopyChat} disabled={!onCopyChat}>
          <ListItemIcon><ContentCopy /></ListItemIcon>
          <ListItemText>Copy all</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon><History /></ListItemIcon>
          <ListItemText>View chat history</ListItemText>
        </MenuItem>
      </Menu>

      {renderSettingsDialog()}
    </>
  );
};

ChatHeader.displayName = 'ChatHeader';
