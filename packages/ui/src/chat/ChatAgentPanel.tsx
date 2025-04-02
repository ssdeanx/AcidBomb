'use client';

import * as React from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Tooltip,
  styled,
  alpha,
  Collapse,
  Avatar,
  Chip,
  Badge,
  Rating,
  Divider,
  CircularProgress,
  useTheme
} from '@mui/material';
import {
  Search as SearchIcon,
  Settings as SettingsIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
  Star as StarIcon,
  Info as InfoIcon,
  History as HistoryIcon,
  SmartToy as AgentIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Check as CheckIcon,
  Psychology as PsychologyIcon,
  Code as CodeIcon,
  Storage as DatabaseIcon,
  Cloud as CloudIcon,
  Language as LanguageIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';

/**
 * Interface for agent configuration
 */
export interface Agent {
  /** Unique identifier for the agent */
  id: string;

  /** Display name for the agent */
  name: string;

  /** Description of agent capabilities and purpose */
  description?: string;

  /** Category for grouping agents */
  category?: string;

  /** URL to agent avatar/icon */
  avatar?: string;

  /** Whether the agent is currently active/selected */
  active?: boolean;

  /** Agent status (online, offline, busy) */
  status?: 'online' | 'offline' | 'busy';

  /** Agent capabilities */
  capabilities?: {
    /** Can process code */
    code?: boolean;

    /** Can handle data/database tasks */
    data?: boolean;

    /** Can search the web */
    web?: boolean;

    /** Can process images */
    vision?: boolean;

    /** Can process or generate audio */
    audio?: boolean;

    /** Has specialized knowledge in certain domains */
    specialized?: boolean;
  };

  /** User rating of the agent (1-5) */
  rating?: number;

  /** Last used timestamp */
  lastUsed?: Date;

  /** Model used by the agent */
  model?: string;

  /** Provider of the agent (e.g., OpenAI, Anthropic) */
  provider?: string;

  /** Additional agent metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Props for the ChatAgentPanel component
 */
export interface ChatAgentPanelProps {
  /**
   * Whether the panel is currently open
   */
  open: boolean;

  /**
   * Handler for when the panel is closed
   */
  onClose: () => void;

  /**
   * Available agents
   */
  agents: Agent[];

  /**
   * Currently selected agent ID
   */
  selectedAgentId?: string;

  /**
   * Handler for when an agent is selected
   */
  onAgentSelect?: (agent: Agent) => void;

  /**
   * Handler for when an agent is configured/settings changed
   */
  onAgentConfigure?: (agent: Agent, settings: Record<string, unknown>) => void;

  /**
   * Position of the panel
   * @default 'right'
   */
  position?: 'right' | 'left';

  /**
   * Width of the panel
   * @default 320
   */
  width?: number;

  /**
   * Title for the panel
   * @default 'Agents'
   */
  title?: string;

  /**
   * Whether to show a loading state
   * @default false
   */
  loading?: boolean;

  /**
   * Whether agents can be added/created
   * @default false
   */
  canAddAgents?: boolean;

  /**
   * Handler for creating a new agent
   */
  onAgentCreate?: () => void;

  /**
   * Custom class name
   */
  className?: string;
}

// Styled components
const AgentPanelContainer = styled(Paper, {
  shouldForwardProp: (prop) => !['panelPosition', 'panelWidth'].includes(prop as string),
})<{
  panelPosition: 'right' | 'left';
  panelWidth: number;
}>(({ theme, panelPosition, panelWidth }) => ({
  position: 'absolute',
  zIndex: theme.zIndex.drawer,
  top: 0,
  bottom: 0,
  width: panelWidth,
  display: 'flex',
  flexDirection: 'column',
  boxShadow: theme.shadows[8],
  overflow: 'hidden',
  background: alpha(theme.palette.background.paper, 0.95),
  backdropFilter: 'blur(10px)',

  ...(panelPosition === 'right' && {
    right: 0,
    borderTopLeftRadius: theme.shape.borderRadius * 2,
    borderBottomLeftRadius: theme.shape.borderRadius * 2,
  }),

  ...(panelPosition === 'left' && {
    left: 0,
    borderTopRightRadius: theme.shape.borderRadius * 2,
    borderBottomRightRadius: theme.shape.borderRadius * 2,
  }),
}));

const AgentPanelHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const AgentPanelContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
}));

const AgentList = styled(List)(({ theme }) => ({
  overflow: 'auto',
  padding: theme.spacing(1),
}));

const AgentItem = styled(ListItem, {
  shouldForwardProp: (prop) => prop !== 'selected',
})<{ selected?: boolean }>(({ theme, selected }) => ({
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(0.5),
  ...(selected && {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  }),
}));

const CategoryHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1, 2),
  cursor: 'pointer',
}));

const AgentAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.2),
  color: theme.palette.primary.main,
}));

const CapabilityChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  height: 24,
  fontSize: '0.75rem',
}));

const StatusBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    width: 10,
    height: 10,
    borderRadius: '50%',
    minWidth: 'auto',
    padding: 0,
  },
}));

/**
 * ChatAgentPanel provides a sidebar panel for browsing and selecting AI agents
 *
 * @component
 */
export const ChatAgentPanel = React.forwardRef<HTMLDivElement, ChatAgentPanelProps>(
  ({
    open,
    onClose,
    agents,
    selectedAgentId,
    onAgentSelect,
    onAgentConfigure,
    position = 'right',
    width = 320,
    title = 'Agents',
    loading = false,
    canAddAgents = false,
    onAgentCreate,
    className,
  }, ref) => {
    const theme = useTheme();
    const [activeTab, setActiveTab] = React.useState(0);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [configureAgentId, setConfigureAgentId] = React.useState<string | null>(null);
    const [expandedCategories, setExpandedCategories] = React.useState<Record<string, boolean>>({});
    const [agentDetailId, setAgentDetailId] = React.useState<string | null>(null);

    // Filter and group agents
    const filteredAndGroupedAgents = React.useMemo(() => {
      // Filter by search and tab
      const filtered = agents.filter(agent => {
        // Search filter
        const matchesSearch = !searchQuery ||
          agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          agent.description?.toLowerCase().includes(searchQuery.toLowerCase());

        // Tab filter
        if (activeTab === 0) return matchesSearch; // All agents
        if (activeTab === 1) return matchesSearch && agent.active; // Active agents
        if (activeTab === 2) {
          // Recent agents - within last 7 days
          if (!agent.lastUsed) return false;
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          return matchesSearch && agent.lastUsed >= sevenDaysAgo;
        }
        return matchesSearch;
      });

      // Group by category
      const grouped: Record<string, Agent[]> = {};
      filtered.forEach(agent => {
        const category = agent.category || 'General';
        if (!grouped[category]) {
          grouped[category] = [];
        }
        grouped[category].push(agent);
      });

      return grouped;
    }, [agents, searchQuery, activeTab]);

    // Find agent for configuration dialog
    const agentToConfig = React.useMemo(() => {
      if (!configureAgentId) return null;
      return agents.find(a => a.id === configureAgentId) || null;
    }, [configureAgentId, agents]);

    // Find agent for detailed view
    const agentDetail = React.useMemo(() => {
      if (!agentDetailId) return null;
      return agents.find(a => a.id === agentDetailId) || null;
    }, [agentDetailId, agents]);

    // Handle agent configuration form state
    const [configValues, setConfigValues] = React.useState<Record<string, unknown>>({});

    // Initialize expanded categories
    React.useEffect(() => {
      const categories = Object.keys(filteredAndGroupedAgents);
      const initialExpandedState: Record<string, boolean> = {};

      categories.forEach(category => {
        initialExpandedState[category] = true; // Default to expanded
      });

      setExpandedCategories(initialExpandedState);
    }, []);

    // Reset config values when agent changes
    React.useEffect(() => {
      if (agentToConfig) {
        setConfigValues(agentToConfig.metadata || {});
      } else {
        setConfigValues({});
      }
    }, [agentToConfig]);

    // Handle agent selection
    const handleAgentSelect = (agent: Agent) => {
      if (onAgentSelect) {
        onAgentSelect(agent);
      }
    };

    // Handle agent configuration
    const handleAgentConfigure = (agent: Agent) => {
      setConfigureAgentId(agent.id);
    };

    // Handle saving agent configuration
    const handleSaveConfig = () => {
      if (agentToConfig && onAgentConfigure) {
        onAgentConfigure(agentToConfig, configValues);
      }
      setConfigureAgentId(null);
    };

    // Handle showing agent details
    const handleShowAgentDetail = (agent: Agent) => {
      setAgentDetailId(agent.id);
    };

    // Toggle category expansion
    const toggleCategory = (category: string) => {
      setExpandedCategories(prev => ({
        ...prev,
        [category]: !prev[category],
      }));
    };

    // Get badge color based on status
    const getBadgeColor = (status?: 'online' | 'offline' | 'busy') => {
      switch (status) {
        case 'online': return theme.palette.success.main;
        case 'busy': return theme.palette.warning.main;
        case 'offline': return theme.palette.text.disabled;
        default: return theme.palette.text.disabled;
      }
    };

    // Render capability chips
    const renderCapabilities = (capabilities?: Agent['capabilities']) => {
      if (!capabilities) return null;

      const chips = [];
      if (capabilities.code) chips.push(<CapabilityChip key="code" icon={<CodeIcon fontSize="small" />} label="Code" size="small" variant="outlined" />);
      if (capabilities.data) chips.push(<CapabilityChip key="data" icon={<DatabaseIcon fontSize="small" />} label="Data" size="small" variant="outlined" />);
      if (capabilities.web) chips.push(<CapabilityChip key="web" icon={<CloudIcon fontSize="small" />} label="Web" size="small" variant="outlined" />);
      if (capabilities.vision) chips.push(<CapabilityChip key="vision" icon={<LanguageIcon fontSize="small" />} label="Vision" size="small" variant="outlined" />);
      if (capabilities.audio) chips.push(<CapabilityChip key="audio" icon={<LanguageIcon fontSize="small" />} label="Audio" size="small" variant="outlined" />);
      if (capabilities.specialized) chips.push(<CapabilityChip key="specialized" icon={<PsychologyIcon fontSize="small" />} label="Specialized" size="small" variant="outlined" />);

      return <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 1 }}>{chips}</Box>;
    };

    // Configuration dialog
    const renderConfigDialog = () => (
      <Dialog
        open={!!configureAgentId}
        onClose={() => setConfigureAgentId(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Configure {agentToConfig?.name}
          <IconButton
            aria-label="close"
            onClick={() => setConfigureAgentId(null)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {agentToConfig && (
            <>
              <TextField
                label="Agent Name"
                value={configValues.displayName || agentToConfig.name}
                onChange={(e) => setConfigValues(prev => ({ ...prev, displayName: e.target.value }))}
                fullWidth
                margin="normal"
                variant="outlined"
              />

              <TextField
                label="Description"
                value={configValues.customDescription || agentToConfig.description}
                onChange={(e) => setConfigValues(prev => ({ ...prev, customDescription: e.target.value }))}
                fullWidth
                multiline
                rows={3}
                margin="normal"
                variant="outlined"
              />

              <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>Agent Preferences</Typography>

              <TextField
                label="System Instructions"
                value={configValues.systemInstructions || ''}
                onChange={(e) => setConfigValues(prev => ({ ...prev, systemInstructions: e.target.value }))}
                fullWidth
                multiline
                rows={4}
                margin="normal"
                variant="outlined"
                placeholder="Enter custom instructions for the agent..."
                helperText="These instructions help define how the agent behaves"
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfigureAgentId(null)}>Cancel</Button>
          <Button onClick={handleSaveConfig} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    );

    // Agent detail dialog
    const renderAgentDetailDialog = () => (
      <Dialog
        open={!!agentDetailId}
        onClose={() => setAgentDetailId(null)}
        maxWidth="sm"
        fullWidth
      >
        {agentDetail && (
          <>
            <DialogTitle>
              {agentDetail.name}
              <IconButton
                aria-label="close"
                onClick={() => setAgentDetailId(null)}
                sx={{ position: 'absolute', right: 8, top: 8 }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <StatusBadge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  variant="dot"
                  sx={{
                    mr: 2,
                    '& .MuiBadge-badge': {
                      backgroundColor: getBadgeColor(agentDetail.status),
                      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`, // Keep shadow if needed
                    }
                  }}
                  badgeContent=""
                >
                  {agentDetail.avatar ? (
                    <Avatar src={agentDetail.avatar} alt={agentDetail.name} sx={{ width: 64, height: 64 }} />
                  ) : (
                    <AgentAvatar sx={{ width: 64, height: 64 }}>
                      <AgentIcon fontSize="large" />
                    </AgentAvatar>
                  )}
                </StatusBadge>

                <Box>
                  <Typography variant="h6">{agentDetail.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {agentDetail.category || 'General Agent'}
                  </Typography>
                  {agentDetail.model && (
                    <Typography variant="caption" color="text.secondary">
                      Powered by {agentDetail.model}
                    </Typography>
                  )}
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="body1" paragraph>
                {agentDetail.description || 'No description available.'}
              </Typography>

              <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>Capabilities</Typography>
              {renderCapabilities(agentDetail.capabilities)}

              {agentDetail.rating !== undefined && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2">User Rating</Typography>
                  <Rating
                    value={agentDetail.rating}
                    readOnly
                    precision={0.5}
                  />
                </Box>
              )}

              {agentDetail.lastUsed && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Last used: {agentDetail.lastUsed.toLocaleDateString()}
                </Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  setAgentDetailId(null);
                  handleAgentConfigure(agentDetail);
                }}
                startIcon={<EditIcon />}
              >
                Configure
              </Button>
              <Button
                onClick={() => {
                  setAgentDetailId(null);
                  handleAgentSelect(agentDetail);
                }}
                variant="contained"
                startIcon={<CheckIcon />}
              >
                Select Agent
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    );

    // Tabs for agent views
    const tabs = [
      { label: 'All Agents', icon: <AgentIcon /> },
      { label: 'Active', icon: <CheckIcon /> },
      { label: 'Recent', icon: <HistoryIcon /> }
    ];

    // If not open, don't render
    if (!open) {
      return null;
    }

    return (
      <>
        <AgentPanelContainer
          ref={ref}
          className={className}
          panelPosition={position}
          panelWidth={width}
        >
          <AgentPanelHeader>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>{title}</Typography>
            {canAddAgents && (
              <Tooltip title="Add New Agent">
                <IconButton onClick={onAgentCreate} disabled={loading}>
                  <AddIcon />
                </IconButton>
              </Tooltip>
            )}
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </AgentPanelHeader>

          <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search agents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                endAdornment: searchQuery ? (
                  <IconButton
                    size="small"
                    onClick={() => setSearchQuery('')}
                    edge="end"
                    sx={{ mr: -1 }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                ) : (
                  <FilterIcon sx={{ color: 'text.secondary' }} />
                ),
              }}
            />
          </Box>

          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
            sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}
          >
            {tabs.map((tab, index) => (
              <Tab
                key={index}
                icon={tab.icon}
                label={tab.label}
                iconPosition="start"
                sx={{
                  minHeight: '48px',
                  textTransform: 'none',
                  fontSize: '0.875rem',
                }}
              />
            ))}
          </Tabs>

          <AgentPanelContent>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <CircularProgress size={40} />
              </Box>
            ) : (
              <AgentList>
                {Object.keys(filteredAndGroupedAgents).length === 0 ? (
                  <Box sx={{ p: 2, textAlign: 'center' }}>
                    <Typography color="text.secondary">
                      {searchQuery ? 'No matching agents found' : 'No agents available'}
                    </Typography>
                  </Box>
                ) : (
                  Object.entries(filteredAndGroupedAgents).map(([category, categoryAgents]) => (
                    <Box key={category} sx={{ mb: 2 }}>
                      <CategoryHeader onClick={() => toggleCategory(category)}>
                        {expandedCategories[category] ? (
                          <ExpandMoreIcon fontSize="small" sx={{ mr: 1 }} />
                        ) : (
                          <ChevronRightIcon fontSize="small" sx={{ mr: 1 }} />
                        )}
                        <Typography variant="subtitle2">{category}</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                          ({categoryAgents.length})
                        </Typography>
                      </CategoryHeader>

                      <Collapse in={expandedCategories[category] || false}>
                        {categoryAgents.map((agent) => (
                          <AgentItem
                            key={agent.id}
                            disablePadding
                            selected={agent.id === selectedAgentId}
                          >
                            <ListItemButton
                              onClick={() => handleAgentSelect(agent)}
                              dense
                            >
                              <StatusBadge
                                overlap="circular"
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                variant="dot"
                                sx={{
                                  mr: 1,
                                  '& .MuiBadge-badge': {
                                    backgroundColor: getBadgeColor(agent.status),
                                    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`, // Keep shadow if needed
                                  }
                                }}
                                badgeContent=""
                              >
                                <ListItemIcon sx={{ minWidth: 40 }}>
                                  {agent.avatar ? (
                                    <Avatar src={agent.avatar} alt={agent.name} />
                                  ) : (
                                    <AgentAvatar>
                                      <AgentIcon />
                                    </AgentAvatar>
                                  )}
                                </ListItemIcon>
                              </StatusBadge>
                              <ListItemText
                                primary={
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    {agent.name}
                                    {agent.rating && (
                                      <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                                        <StarIcon sx={{ color: theme.palette.warning.main, fontSize: '0.875rem' }} />
                                        <Typography variant="caption" sx={{ ml: 0.25 }}>
                                          {agent.rating.toFixed(1)}
                                        </Typography>
                                      </Box>
                                    )}
                                  </Box>
                                }
                                secondary={
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      display: '-webkit-box',
                                      WebkitLineClamp: 2,
                                      WebkitBoxOrient: 'vertical',
                                      overflow: 'hidden',
                                    }}
                                  >
                                    {agent.description || 'No description available'}
                                  </Typography>
                                }
                              />
                              <Box sx={{ display: 'flex', ml: 1 }}>
                                <Tooltip title="Agent Details">
                                  <IconButton
                                    size="small"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleShowAgentDetail(agent);
                                    }}
                                  >
                                    <InfoIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Configure Agent">
                                  <IconButton
                                    size="small"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleAgentConfigure(agent);
                                    }}
                                  >
                                    <SettingsIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            </ListItemButton>
                          </AgentItem>
                        ))}
                      </Collapse>
                    </Box>
                  ))
                )}
              </AgentList>
            )}
          </AgentPanelContent>
        </AgentPanelContainer>

        {renderConfigDialog()}
        {renderAgentDetailDialog()}
      </>
    );
  }
);

ChatAgentPanel.displayName = 'ChatAgentPanel';

export default ChatAgentPanel;
