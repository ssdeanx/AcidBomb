'use client';

import * as React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  Divider,
  Tabs,
  Tab,
  Chip,
  FormGroup,
  FormControlLabel,
  Switch,
  Slider,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  IconButton,
  Tooltip,
  styled,
  alpha,
  Alert,
  Grid,
  Paper,
  OutlinedInput,
  InputAdornment,
} from '@mui/material';
import {
  ExpandMore,
  Settings,
  Code,
  AutoAwesome,
  Storage,
  Thermostat,
  Search,
  AddCircleOutline,
  LinkOff,
  Link,
  Delete,
  AttachFile,
  CloudUpload,
  Tungsten,
  ApiOutlined,
  Info,
  Speed,
  Psychology,
  ModelTraining as ModelIcon,
  DataObject,
  BubbleChart,
} from '@mui/icons-material';

// Define types for model providers and models
export interface ModelOption {
  id: string;
  name: string;
  provider: string;
  description?: string;
  contextSize?: number;
  releaseDate?: string;
  capabilities?: {
    vision?: boolean;
    function?: boolean;
    code?: boolean;
    retrieval?: boolean;
    rag?: boolean;
    audio?: boolean;
  };
  price?: {
    input?: number;
    output?: number;
    unit?: 'token' | 'character';
    currency?: string;
  };
}

export interface ModelProviderOption {
  id: string;
  name: string;
  logo?: string;
  apiKeyRequired?: boolean;
  models: ModelOption[];
  endpointUrl?: string;
}

export interface ChatGroundingSource {
  id: string;
  name: string;
  type: 'file' | 'website' | 'database' | 'api' | 'vector-store';
  connected: boolean;
  size?: number;
  lastUpdated?: Date;
  metadata?: Record<string, any>;
}

export interface ChatAccordionProps {
  /**
   * Available model providers
   */
  providers: ModelProviderOption[];

  /**
   * Currently selected model ID
   */
  selectedModelId?: string;

  /**
   * Callback when model is changed
   */
  onModelChange?: (modelId: string) => void;

  /**
   * Current temperature setting
   */
  temperature?: number;

  /**
   * Callback when temperature is changed
   */
  onTemperatureChange?: (value: number) => void;

  /**
   * Current system prompt
   */
  systemPrompt?: string;

  /**
   * Callback when system prompt is changed
   */
  onSystemPromptChange?: (value: string) => void;

  /**
   * If true, enables code execution
   */
  enableCodeExecution?: boolean;

  /**
   * Callback when code execution setting is changed
   */
  onCodeExecutionChange?: (enabled: boolean) => void;

  /**
   * Available grounding sources
   */
  groundingSources?: ChatGroundingSource[];

  /**
   * Callback when a grounding source is toggled
   */
  onGroundingSourceToggle?: (sourceId: string, enabled: boolean) => void;

  /**
   * Callback when a grounding source is added
   */
  onGroundingSourceAdd?: (source: Omit<ChatGroundingSource, 'id'>) => void;

  /**
   * Callback when a grounding source is removed
   */
  onGroundingSourceRemove?: (sourceId: string) => void;

  /**
   * Current max tokens setting
   */
  maxTokens?: number;

  /**
   * Callback when max tokens is changed
   */
  onMaxTokensChange?: (value: number) => void;

  /**
   * If true, enables web search capability
   */
  enableWebSearch?: boolean;

  /**
   * Callback when web search setting is changed
   */
  onWebSearchChange?: (enabled: boolean) => void;

  /**
   * Current API key for selected provider
   */
  apiKey?: string;

  /**
   * Callback when API key is changed
   */
  onApiKeyChange?: (provider: string, key: string) => void;

  /**
   * Key-value pairs for additional model parameters
   */
  additionalParams?: Record<string, any>;

  /**
   * Callback when additional parameters are changed
   */
  onAdditionalParamsChange?: (params: Record<string, any>) => void;

  /**
   * Callback when accordion is expanded/collapsed
   */
  onAccordionChange?: (expanded: boolean) => void;
}

// Define the source type union for better type checking
type SourceType = 'file' | 'website' | 'database' | 'api' | 'vector-store';

// Define the new source state type
interface NewSourceState {
  name: string;
  type: SourceType;
  url: string;
  file: File | null;
}

// Styled components
const StyledAccordion = styled(Accordion)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.background.paper, 0.8),
  backdropFilter: 'blur(10px)',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  '&:before': {
    display: 'none',
  },
  '&.Mui-expanded': {
    margin: 0,
  },
}));

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  padding: theme.spacing(0, 2),
  '& .MuiAccordionSummary-content': {
    margin: theme.spacing(1, 0),
  },
}));

const StyledAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: alpha(theme.palette.background.default, 0.6),
}));

const ModelCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  border: '1px solid transparent',
  transition: 'all 0.2s ease-in-out',
  cursor: 'pointer',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    boxShadow: theme.shadows[3],
    borderColor: alpha(theme.palette.primary.main, 0.3),
  },
  '&.selected': {
    borderColor: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
  },
}));

const CapabilityChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  fontSize: '0.7rem',
  height: 24,
}));

const SourceCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1.5),
  marginBottom: theme.spacing(1.5),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderLeft: `4px solid ${theme.palette.primary.main}`,
}));

const ProviderButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ theme, active }) => ({
  marginRight: theme.spacing(1),
  marginBottom: theme.spacing(1),
  borderColor: active ? theme.palette.primary.main : theme.palette.divider,
  backgroundColor: active ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
  '&:hover': {
    backgroundColor: active ? alpha(theme.palette.primary.main, 0.2) : alpha(theme.palette.action.hover, 0.1),
  },
}));

/**
 * Formats bytes into a human-readable string with appropriate unit
 */
const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
};

/**
 * ChatAccordion component for advanced chat settings and model selection
 *
 * A comprehensive accordion component for chat settings including model selection,
 * temperature adjustment, system prompt configuration, and knowledge source management.
 *
 * @example
 * ```tsx
 * <ChatAccordion
 *   providers={modelProviders}
 *   selectedModelId="gpt-4o"
 *   onModelChange={handleModelChange}
 *   temperature={0.7}
 *   onTemperatureChange={handleTemperatureChange}
 * />
 * ```
 */
export const ChatAccordion: React.FC<ChatAccordionProps> = ({
  providers = [],
  selectedModelId,
  onModelChange,
  temperature = 0.7,
  onTemperatureChange,
  systemPrompt = '',
  onSystemPromptChange,
  enableCodeExecution = false,
  onCodeExecutionChange,
  groundingSources = [],
  onGroundingSourceToggle,
  onGroundingSourceAdd,
  onGroundingSourceRemove,
  maxTokens = 2048,
  onMaxTokensChange,
  enableWebSearch = false,
  onWebSearchChange,
  apiKey,
  onApiKeyChange,
  additionalParams = {},
  onAdditionalParamsChange,
  onAccordionChange,
}) => {
  // State for active tab
  const [activeTab, setActiveTab] = React.useState<number>(0);

  // State for selected provider
  const [selectedProvider, setSelectedProvider] = React.useState<string | null>(() => {
    if (providers.length > 0) {
      if (selectedModelId) {
        const providerWithModel = providers.find(p => p.models.some(m => m.id === selectedModelId));
        return providerWithModel?.id ?? providers[0]?.id ?? null;
      }
      return providers[0]?.id ?? null;
    }
    return null;
  });

  // Find the currently selected model
  const currentModel = React.useMemo(() => {
    if (!selectedModelId) return null;

    for (const provider of providers) {
      const model = provider.models.find(m => m.id === selectedModelId);
      if (model) return model;
    }

    return null;
  }, [selectedModelId, providers]);

  // State for new source form
  const [newSource, setNewSource] = React.useState<NewSourceState>({
    name: '',
    type: 'file',
    url: '',
    file: null,
  });

  // State for accordion expansion
  const [expanded, setExpanded] = React.useState<boolean>(false);

  // Handle accordion expansion
  const handleAccordionChange = (
    _event: React.SyntheticEvent,
    isExpanded: boolean
  ) => {
    setExpanded(isExpanded);
    onAccordionChange?.(isExpanded);
  };

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Handle provider change
  const handleProviderChange = (providerId: string) => {
    setSelectedProvider(providerId);
    // Optionally auto-select first model of new provider
    const provider = providers.find(p => p.id === providerId);
    // Check provider, models array, first model, and callback existence
    if (provider && provider.models.length > 0 && provider.models[0] && onModelChange) {
      onModelChange(provider.models[0].id);
    }
  };

  // Handle model change
  const handleModelChange = (modelId: string) => {
    if (onModelChange) {
      onModelChange(modelId);
    }
  };

  // Handle temperature change
  const handleTemperatureChange = (_event: Event, value: number | number[]) => {
    if (onTemperatureChange) {
      onTemperatureChange(value as number);
    }
  };

  // Handle system prompt change
  const handleSystemPromptChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onSystemPromptChange) {
      onSystemPromptChange(event.target.value);
    }
  };

  // Handle code execution toggle
  const handleCodeExecutionToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onCodeExecutionChange) {
      onCodeExecutionChange(event.target.checked);
    }
  };

  // Handle web search toggle
  const handleWebSearchToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onWebSearchChange) {
      onWebSearchChange(event.target.checked);
    }
  };

  // Handle max tokens change
  const handleMaxTokensChange = (_event: Event, value: number | number[]) => {
    if (onMaxTokensChange) {
      onMaxTokensChange(value as number);
    }
  };

  // Handle source toggle
  const handleSourceToggle = (sourceId: string, enabled: boolean) => {
    if (onGroundingSourceToggle) {
      onGroundingSourceToggle(sourceId, enabled);
    }
  };

  // Handle new source form change
  const handleNewSourceChange = (field: keyof NewSourceState, value: any) => {
    setNewSource(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle file upload
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const currentFile = event.target.files[0];
      // Explicitly type the updater function and its return value to ensure compatibility
      setNewSource((prev: NewSourceState): NewSourceState => ({
        ...prev,
        file: currentFile ?? null, // Assign File or null
        name: currentFile ? currentFile.name : prev.name, // Update name only if file exists
      }));
    } else {
      // Handle case where no file is selected or files are cleared
      setNewSource((prev: NewSourceState): NewSourceState => ({
        ...prev,
        file: null,
        name: '', // Reset name if file is removed
      }));
    }
  };

  // Handle source add
  const handleSourceAdd = () => {
    if (!onGroundingSourceAdd) return;

    if (newSource.type === 'file' && newSource.file) {
      onGroundingSourceAdd({
        name: newSource.name || newSource.file.name,
        type: newSource.type,
        connected: true,
        size: newSource.file.size,
        metadata: {
          file: newSource.file
        },
      });
    } else if ((newSource.type === 'website' || newSource.type === 'api' || newSource.type === 'database' || newSource.type === 'vector-store') && newSource.url) {
      onGroundingSourceAdd({
        name: newSource.name || (() => {
          try {
            return new URL(newSource.url).hostname;
          } catch (e) {
            return newSource.url;
          }
        })(),
        type: newSource.type,
        connected: true,
        metadata: {
          url: newSource.url
        },
      });
    }

    // Reset form
    setNewSource({
      name: '',
      type: 'file',
      url: '',
      file: null,
    });
  };

  // Handle API key change
  const handleApiKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onApiKeyChange && selectedProvider) {
      onApiKeyChange(selectedProvider, event.target.value);
    }
  };

  const renderModelsTab = () => (
    <Box sx={{ mt: 2 }}>
      {/* Provider buttons */}
      <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap' }}>
        {providers.map((provider) => (
          <ProviderButton
            key={provider.id}
            variant="outlined"
            size="small"
            active={provider.id === selectedProvider}
            onClick={() => handleProviderChange(provider.id)}
            startIcon={provider.id === 'openai' ? <AutoAwesome /> :
                      provider.id === 'anthropic' ? <Psychology /> :
                      provider.id === 'google' ? <BubbleChart /> :
                      provider.id === 'mastra' ? <DataObject /> :
                      <ModelIcon />}
          >
            {provider.name}
          </ProviderButton>
        ))}
      </Box>

      {/* Show API key field if required */}
      {selectedProvider && providers.find(p => p.id === selectedProvider)?.apiKeyRequired && (
        <FormControl fullWidth variant="outlined" size="small" sx={{ mb: 2 }}>
          <InputLabel htmlFor="api-key-input">API Key</InputLabel>
          <OutlinedInput
            id="api-key-input"
            type="password"
            value={apiKey || ''}
            onChange={handleApiKeyChange}
            label="API Key"
            endAdornment={
              <InputAdornment position="end">
                <IconButton edge="end" size="small">
                  <ApiOutlined fontSize="small" />
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
      )}

      {/* Models grid */}
      <Grid container spacing={2}>
        {selectedProvider &&
         providers.find(p => p.id === selectedProvider)?.models.map((model) => (
          <Grid size={{ xs: 12, md: 6, lg: 4 }} key={model.id}>
            <ModelCard
              elevation={1}
              className={selectedModelId === model.id ? 'selected' : ''}
              onClick={() => handleModelChange(model.id)}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle1" fontWeight="medium">
                  {model.name}
                </Typography>
                {selectedModelId === model.id && (
                  <Chip
                    size="small"
                    label="Selected"
                    color="primary"
                    sx={{ height: 20, fontSize: '0.7rem' }}
                  />
                )}
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {model.description || `A model by ${providers.find(p => p.id === selectedProvider)?.name}`}
              </Typography>

              {model.contextSize && (
                <Typography variant="caption" color="text.secondary">
                  Context: {model.contextSize.toLocaleString()} tokens
                </Typography>
              )}

              <Box sx={{ mt: 'auto', pt: 1 }}>
                {model.capabilities && Object.entries(model.capabilities)
                  .filter(([_, enabled]) => enabled)
                  .map(([capability]) => (
                    <CapabilityChip
                      key={capability}
                      size="small"
                      label={capability}
                      variant="outlined"
                      color="primary"
                    />
                  ))
                }
              </Box>
            </ModelCard>
          </Grid>
        ))}
      </Grid>

      {(!selectedProvider || providers.find(p => p.id === selectedProvider)?.models.length === 0) && (
        <Alert severity="info" sx={{ mt: 2 }}>
          No models available for the selected provider. Please check your API key or select a different provider.
        </Alert>
      )}
    </Box>
  );

  const renderSettingsTab = () => (
    <Box sx={{ mt: 2 }}>
      {/* Temperature */}
      <Typography id="temperature-slider" gutterBottom>
        Temperature: {temperature}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Thermostat color="primary" sx={{ mr: 2 }} />
        <Slider
          aria-labelledby="temperature-slider"
          value={temperature}
          onChange={handleTemperatureChange}
          step={0.05}
          marks
          min={0}
          max={1}
          valueLabelDisplay="auto"
        />
      </Box>

      {/* Max tokens */}
      <Typography id="max-tokens-slider" gutterBottom>
        Max Tokens: {maxTokens}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Storage color="primary" sx={{ mr: 2 }} />
        <Slider
          aria-labelledby="max-tokens-slider"
          value={maxTokens}
          onChange={handleMaxTokensChange}
          step={100}
          marks
          min={100}
          max={currentModel?.contextSize || 8192}
          valueLabelDisplay="auto"
        />
      </Box>

      {/* System Prompt */}
      <Typography gutterBottom>System Prompt</Typography>
      <TextField
        fullWidth
        multiline
        rows={4}
        variant="outlined"
        placeholder="Enter system instructions for the AI..."
        value={systemPrompt}
        onChange={handleSystemPromptChange}
        sx={{ mb: 3 }}
      />

      {/* Advanced toggles */}
      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              checked={enableCodeExecution}
              onChange={handleCodeExecutionToggle}
              color="primary"
            />
          }
          label={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Code sx={{ mr: 1 }} />
              <Typography>Enable code execution</Typography>
            </Box>
          }
        />

        <FormControlLabel
          control={
            <Switch
              checked={enableWebSearch}
              onChange={handleWebSearchToggle}
              color="primary"
            />
          }
          label={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Search sx={{ mr: 1 }} />
              <Typography>Enable web search</Typography>
            </Box>
          }
        />
      </FormGroup>

      {/* Advanced parameters */}
      {onAdditionalParamsChange && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" gutterBottom>Advanced Parameters</Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Top P</InputLabel>
                <Select
                  value={additionalParams.topP?.toString() || '0.9'}
                  label="Top P"
                  onChange={(e) => onAdditionalParamsChange({
                    ...additionalParams,
                    topP: parseFloat(e.target.value as string)
                  })}
                >
                  {[0.1, 0.3, 0.5, 0.7, 0.9, 1].map(value => (
                    <MenuItem key={value} value={value.toString()}>
                      {value}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Frequency Penalty</InputLabel>
                <Select
                  value={additionalParams.frequencyPenalty?.toString() || '0'}
                  label="Frequency Penalty"
                  onChange={(e) => onAdditionalParamsChange({
                    ...additionalParams,
                    frequencyPenalty: parseFloat(e.target.value as string)
                  })}
                >
                  {[0, 0.1, 0.3, 0.5, 0.7, 0.9].map(value => (
                    <MenuItem key={value} value={value.toString()}>
                      {value}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );

  const renderGroundingTab = () => (
    <Box sx={{ mt: 2 }}>
      {/* Add new grounding source */}
      <Typography variant="subtitle2" gutterBottom>Add Knowledge Source</Typography>
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Source Type</InputLabel>
              <Select
                value={newSource.type}
                label="Source Type"
                onChange={(e) => handleNewSourceChange('type', e.target.value as SourceType)}
              >
                <MenuItem value="file">File</MenuItem>
                <MenuItem value="website">Website</MenuItem>
                <MenuItem value="api">API</MenuItem>
                <MenuItem value="vector-store">Vector Store</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 5 }}>
            {newSource.type === 'file' ? (
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUpload />}
                fullWidth
              >
                {newSource.file ? newSource.file.name : 'Upload File'}
                <input
                  type="file"
                  hidden
                  onChange={handleFileChange}
                />
              </Button>
            ) : (
              <TextField
                fullWidth
                size="small"
                label={newSource.type === 'website' ? 'URL' : 'Endpoint URL'}
                value={newSource.url}
                onChange={(e) => handleNewSourceChange('url', e.target.value)}
                placeholder={
                  newSource.type === 'website'
                    ? 'https://example.com'
                    : 'https://api.example.com/data'
                }
              />
            )}
          </Grid>

          <Grid size={{ xs: 12, sm: 3 }}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<AddCircleOutline />}
              onClick={handleSourceAdd}
              disabled={
                (newSource.type === 'file' && !newSource.file) ||
                ((newSource.type !== 'file') && !newSource.url)
              }
            >
              Add Source
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Grounding sources list */}
      <Typography variant="subtitle2" gutterBottom>Knowledge Sources</Typography>
      <Box>
        {groundingSources.length > 0 ? (
          groundingSources.map((source) => (
            <SourceCard key={source.id} elevation={1}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {source.type === 'file' ? <AttachFile color="primary" /> :
                 source.type === 'website' ? <Search color="primary" /> :
                 source.type === 'api' ? <ApiOutlined color="primary" /> :
                 source.type === 'vector-store' ? <Storage color="primary" /> :
                 <Info color="primary" />}
                <Box sx={{ ml: 1 }}>
                  <Typography variant="body2">{source.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {source.type}
                    {source.size && ` • ${formatBytes(source.size)}`}
                    {source.lastUpdated && ` • Updated ${source.lastUpdated.toLocaleDateString()}`}
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Tooltip title={source.connected ? 'Disconnect' : 'Connect'}>
                  <IconButton
                    size="small"
                    onClick={() => handleSourceToggle(source.id, !source.connected)}
                  >
                    {source.connected ? <Link /> : <LinkOff />}
                  </IconButton>
                </Tooltip>
                {onGroundingSourceRemove && (
                  <Tooltip title="Remove">
                    <IconButton
                      size="small"
                      onClick={() => onGroundingSourceRemove(source.id)}
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </SourceCard>
          ))
        ) : (
          <Alert severity="info" sx={{ mt: 1 }}>
            No knowledge sources added yet. Add sources to improve AI responses with relevant context.
          </Alert>
        )}
      </Box>
    </Box>
  );

  const renderToolsTab = () => (
    <Box sx={{ mt: 2 }}>
      <Alert severity="info" sx={{ mb: 2 }}>
        Tools allow your AI assistant to perform actions and access external data. Enable the tools you want the AI to use.
      </Alert>

      <FormGroup>
        <FormControlLabel
          control={<Switch checked={enableWebSearch} onChange={handleWebSearchToggle} />}
          label={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Search sx={{ mr: 1 }} />
              <Box>
                <Typography>Web Search</Typography>
                <Typography variant="caption" color="text.secondary">
                  Search the web for up-to-date information
                </Typography>
              </Box>
            </Box>
          }
        />

        <FormControlLabel
          control={<Switch checked={enableCodeExecution} onChange={handleCodeExecutionToggle} />}
          label={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Code sx={{ mr: 1 }} />
              <Box>
                <Typography>Code Execution</Typography>
                <Typography variant="caption" color="text.secondary">
                  Run code snippets in a secure environment
                </Typography>
              </Box>
            </Box>
          }
        />

        <FormControlLabel
          control={<Switch />}
          label={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Speed sx={{ mr: 1 }} />
              <Box>
                <Typography>API Access</Typography>
                <Typography variant="caption" color="text.secondary">
                  Allow access to external APIs
                </Typography>
              </Box>
            </Box>
          }
        />

        <FormControlLabel
          control={<Switch />}
          label={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Tungsten sx={{ mr: 1 }} />
              <Box>
                <Typography>Image Generation</Typography>
                <Typography variant="caption" color="text.secondary">
                  Generate images based on text descriptions
                </Typography>
              </Box>
            </Box>
          }
        />
      </FormGroup>

      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle2" gutterBottom>Function Calling</Typography>
        <Alert severity="warning">
          Function calling allows the AI to execute predefined functions. This is an advanced feature and should be used carefully.
        </Alert>
      </Box>
    </Box>
  );

  // Main render
  return (
    <StyledAccordion expanded={expanded} onChange={handleAccordionChange}>
      <StyledAccordionSummary
        expandIcon={<ExpandMore />}
        aria-controls="chat-settings-content"
        id="chat-settings-header"
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Settings sx={{ mr: 1 }} />
          <Typography>
            {currentModel ? `${currentModel.name} (${providers.find(p => p.models.some(m => m.id === currentModel.id))?.name})` : 'AI Model & Settings'}
          </Typography>
        </Box>
      </StyledAccordionSummary>
      <StyledAccordionDetails>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="settings tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Models" icon={<ModelIcon />} iconPosition="start" />
          <Tab label="Settings" icon={<Settings />} iconPosition="start" />
          <Tab label="Grounding" icon={<Link />} iconPosition="start" />
          <Tab label="Tools" icon={<Tungsten />} iconPosition="start" />
        </Tabs>
        <Divider sx={{ my: 1 }} />

        {activeTab === 0 && renderModelsTab()}
        {activeTab === 1 && renderSettingsTab()}
        {activeTab === 2 && renderGroundingTab()}
        {activeTab === 3 && renderToolsTab()}
      </StyledAccordionDetails>
    </StyledAccordion>
  );
};


ChatAccordion.displayName = 'ChatAccordion';
