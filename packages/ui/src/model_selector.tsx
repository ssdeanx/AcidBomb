'use client';

import * as React from 'react';
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Box,
  Typography,
  styled,
  SelectChangeEvent,
} from '@mui/material';

export interface ModelOption {
  id: string;
  name: string;
  provider: 'openai' | 'anthropic' | 'google' | 'ollama' | 'mistral' | 'local';
  contextWindow?: number;
  pricing?: {
    input: number;
    output: number;
  };
}

export interface ModelSelectorProps {
  /**
   * Available models
   */
  models: ModelOption[];

  /**
   * Currently selected model
   */
  selectedModel?: string;

  /**
   * Callback when model is changed
   */
  onModelChange?: (modelId: string) => void;

  /**
   * If true, shows advanced model info
   */
  showDetails?: boolean;
}

const StyledSelect = styled(Select)(({ theme }) => ({
  minWidth: 200,
  '& .MuiSelect-select': {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
  },
}));

const ProviderChip = styled(Chip)(({ theme }) => ({
  height: 24,
  fontSize: '0.75rem',
}));

export const modelSelector = React.forwardRef<HTMLDivElement, ModelSelectorProps>(
  ({
    models,
    selectedModel,
    onModelChange,
    showDetails = false,
    ...props
  }, ref) => {
    const handleChange = (event: SelectChangeEvent<unknown>) => {
      onModelChange?.(String(event.target.value));
    };

    const selectedModelDetails = models.find(m => m.id === selectedModel);

    return (
      <FormControl ref={ref} fullWidth {...props}>
        <InputLabel>Model</InputLabel>
        <StyledSelect
          value={selectedModel || ''}
          label="Model"
          onChange={handleChange}
          renderValue={(selected) => {
            const model = models.find(m => m.id === selected);
            if (!model) return null;

            return (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography>{model.name}</Typography>
                <ProviderChip
                  label={model.provider}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </Box>
            );
          }}
        >
          {models.map((model) => (
            <MenuItem key={model.id} value={model.id}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography>{model.name}</Typography>
                  <ProviderChip
                    label={model.provider}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </Box>

                {showDetails && (
                  <Typography variant="caption" color="text.secondary">
                    {model.contextWindow?.toLocaleString()} tokens
                    {model.pricing && ` • $${model.pricing.output}/1K tokens`}
                  </Typography>
                )}
              </Box>
            </MenuItem>
          ))}
        </StyledSelect>
      </FormControl>
    );
  }
);

modelSelector.displayName = 'modelSelector';
