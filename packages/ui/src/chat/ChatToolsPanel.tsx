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
  FormControlLabel,
  Switch,
  Divider,
  useTheme
} from '@mui/material';
import {
  Search as SearchIcon,
  SettingsSuggest as SettingsSuggestIcon,
  InsertDriveFile as FileIcon,
  Code as CodeIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
  Check as CheckIcon,
  AddCircleOutline as AddIcon,
  Delete as DeleteIcon,
  MiscellaneousServices as ServicesIcon,
  MoreVert as MoreIcon
} from '@mui/icons-material';

/**
 * Interface for tool configuration
 */
export interface Tool {
  /** Unique identifier for the tool */
  id: string;

  /** Display name for the tool */
  name: string;

  /** Description of what the tool does */
  description?: string;

  /** Category for grouping tools */
  category?: string;

  /** Icon to represent the tool */
  icon?: React.ReactNode;

  /** Whether the tool is currently enabled */
  enabled?: boolean;

  /** Whether the tool requires authentication */
  requiresAuth?: boolean;

  /** Any configuration parameters for the tool */
  parameters?: Record<string, unknown>;

  /** Custom metadata for the tool */
  metadata?: Record<string, unknown>;
}

/**
 * Props for the ChatToolsPanel component
 */
export interface ChatToolsPanelProps {
  /**
   * Whether the panel is currently open
   */
  open: boolean;

  /**
   * Handler for when the panel is closed
   */
  onClose: () => void;

  /**
   * Available tools
   */
  tools: Tool[];

  /**
   * Handler for when a tool is toggled
   */
  onToolToggle?: (tool: Tool, enabled: boolean) => void;

  /**
   * Handler for when a tool is configured
   */
  onToolConfigure?: (tool: Tool, config: Record<string, unknown>) => void;

  /**
   * Handler for when a tool is selected for use
   */
  onToolSelect?: (tool: Tool) => void;

  /**
   * Position of the panel
   * @default 'right'
   */
  position?: 'right' | 'left' | 'bottom';

  /**
   * Width of the panel when in right/left position
   * @default 320
   */
  width?: number;

  /**
   * Height of the panel when in bottom position
   * @default 300
   */
  height?: number;

  /**
   * Title for the panel
   * @default 'Tools'
   */
  title?: string;

  /**
   * Custom class name
   */
  className?: string;
}

// Styled components
const ToolsPanelContainer = styled(Paper, {
  shouldForwardProp: (prop) => !['panelPosition', 'panelWidth', 'panelHeight'].includes(prop as string),
})<{
  panelPosition: 'right' | 'left' | 'bottom';
  panelWidth: number;
  panelHeight: number;
}>(({ theme, panelPosition, panelWidth, panelHeight }) => ({
  position: 'absolute',
  zIndex: theme.zIndex.drawer,
  display: 'flex',
  flexDirection: 'column',
  boxShadow: theme.shadows[8],
  overflow: 'hidden',

  ...(panelPosition === 'right' && {
    top: 0,
    right: 0,
    bottom: 0,
    width: panelWidth,
    borderTopLeftRadius: theme.shape.borderRadius * 2,
    borderBottomLeftRadius: theme.shape.borderRadius * 2,
  }),

  ...(panelPosition === 'left' && {
    top: 0,
    left: 0,
    bottom: 0,
    width: panelWidth,
    borderTopRightRadius: theme.shape.borderRadius * 2,
    borderBottomRightRadius: theme.shape.borderRadius * 2,
  }),

  ...(panelPosition === 'bottom' && {
    left: 0,
    right: 0,
    bottom: 0,
    height: panelHeight,
    borderTopLeftRadius: theme.shape.borderRadius * 2,
    borderTopRightRadius: theme.shape.borderRadius * 2,
  }),
}));

const ToolsPanelHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const ToolsPanelContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
}));

const ToolList = styled(List)(({ theme }) => ({
  overflow: 'auto',
  padding: theme.spacing(1),
}));

const ToolItem = styled(ListItem, {
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

/**
 * ChatToolsPanel provides a sidebar or panel to manage and access AI tools
 *
 * @component
 */
export const ChatToolsPanel = React.forwardRef<HTMLDivElement, ChatToolsPanelProps>(
  ({
    open,
    onClose,
    tools,
    onToolToggle,
    onToolConfigure,
    onToolSelect,
    position = 'right',
    width = 320,
    height = 300,
    title = 'Tools',
    className,
  }, ref) => {
    const theme = useTheme();
    const [activeTab, setActiveTab] = React.useState(0);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [configureToolId, setConfigureToolId] = React.useState<string | null>(null);
    const [expandedCategories, setExpandedCategories] = React.useState<Record<string, boolean>>({});

    // Group tools by category
    const toolsByCategory = React.useMemo(() => {
      const categories: Record<string, Tool[]> = {};

      // Filter tools by search query if present
      const filteredTools = searchQuery
        ? tools.filter(tool =>
            tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tool.description?.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : tools;

      // Group by category
      filteredTools.forEach(tool => {
        const category = tool.category || 'General';
        if (!categories[category]) {
          categories[category] = [];
        }
        categories[category].push(tool);
      });

      return categories;
    }, [tools, searchQuery]);

    // Find the tool being configured
    const toolToConfig = React.useMemo(() => {
      if (!configureToolId) return null;
      return tools.find(t => t.id === configureToolId) || null;
    }, [configureToolId, tools]);

    // Handle tool configuration form state
    const [configValues, setConfigValues] = React.useState<Record<string, unknown>>({});

    // Reset config values when tool changes
    React.useEffect(() => {
      if (toolToConfig && toolToConfig.parameters) {
        setConfigValues(toolToConfig.parameters);
      } else {
        setConfigValues({});
      }
    }, [toolToConfig]);

    // Handle tool toggle
    const handleToolToggle = (tool: Tool) => {
      if (onToolToggle) {
        onToolToggle(tool, !tool.enabled);
      }
    };

    // Handle tool configuration
    const handleToolConfigure = (tool: Tool) => {
      setConfigureToolId(tool.id);
    };

    // Handle saving tool configuration
    const handleSaveConfig = () => {
      if (toolToConfig && onToolConfigure) {
        onToolConfigure(toolToConfig, configValues);
      }
      setConfigureToolId(null);
    };

    // Handle tool selection
    const handleToolSelect = (tool: Tool) => {
      if (onToolSelect) {
        onToolSelect(tool);
      }
    };

    // Toggle category expansion
    const toggleCategory = (category: string) => {
      setExpandedCategories(prev => ({
        ...prev,
        [category]: !prev[category],
      }));
    };

    // Initialize expanded state for all categories
    React.useEffect(() => {
      const categories = Object.keys(toolsByCategory);
      const initialExpandedState: Record<string, boolean> = {};

      categories.forEach(category => {
        initialExpandedState[category] = true; // Default to expanded
      });

      setExpandedCategories(initialExpandedState);
    }, []);

    // Render configuration dialog
    const renderConfigDialog = () => (
      <Dialog
        open={!!configureToolId}
        onClose={() => setConfigureToolId(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Configure {toolToConfig?.name}
          <IconButton
            aria-label="close"
            onClick={() => setConfigureToolId(null)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {toolToConfig?.description && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {toolToConfig.description}
            </Typography>
          )}

          {toolToConfig?.parameters && Object.entries(toolToConfig.parameters).map(([key, value]) => (
            <TextField
              key={key}
              label={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
              value={configValues[key] || ''}
              onChange={(e) => setConfigValues(prev => ({ ...prev, [key]: e.target.value }))}
              fullWidth
              margin="normal"
              variant="outlined"
              size="small"
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfigureToolId(null)}>Cancel</Button>
          <Button onClick={handleSaveConfig} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    );

    // Tabs for different tool views
    const tabs = [
      { label: 'All Tools', icon: <ServicesIcon /> },
      { label: 'Enabled', icon: <CheckIcon /> },
      { label: 'Recent', icon: <MoreIcon /> }
    ];

    // If not open, don't render
    if (!open) {
      return null;
    }

    return (
      <>
        <ToolsPanelContainer
          ref={ref}
          className={className}
          panelPosition={position}
          panelWidth={width}
          panelHeight={height}
        >
          <ToolsPanelHeader>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>{title}</Typography>
            <IconButton onClick={onClose} edge="end">
              <CloseIcon />
            </IconButton>
          </ToolsPanelHeader>

          <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
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

          <ToolsPanelContent>
            <ToolList>
              {Object.keys(toolsByCategory).length === 0 ? (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <Typography color="text.secondary">
                    {searchQuery ? 'No matching tools found' : 'No tools available'}
                  </Typography>
                </Box>
              ) : (
                Object.entries(toolsByCategory).map(([category, categoryTools]) => (
                  <Box key={category} sx={{ mb: 2 }}>
                    <CategoryHeader onClick={() => toggleCategory(category)}>
                      {expandedCategories[category] ? (
                        <ExpandMoreIcon fontSize="small" sx={{ mr: 1 }} />
                      ) : (
                        <ChevronRightIcon fontSize="small" sx={{ mr: 1 }} />
                      )}
                      <Typography variant="subtitle2">{category}</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                        ({categoryTools.length})
                      </Typography>
                    </CategoryHeader>

                    <Collapse in={expandedCategories[category] || false}>
                      {categoryTools.map((tool) => (
                        <ToolItem key={tool.id} disablePadding>
                          <ListItemButton
                            onClick={() => handleToolSelect(tool)}
                            dense
                          >
                            <ListItemIcon sx={{ minWidth: 40 }}>
                              {tool.icon || <SettingsSuggestIcon />}
                            </ListItemIcon>
                            <ListItemText
                              primary={tool.name}
                              secondary={tool.description}
                              primaryTypographyProps={{ variant: 'body2' }}
                              secondaryTypographyProps={{
                                variant: 'caption',
                                sx: {
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                }
                              }}
                            />
                            <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                              <FormControlLabel
                                control={
                                  <Switch
                                    size="small"
                                    checked={tool.enabled || false}
                                    onChange={(e) => {
                                      e.stopPropagation();
                                      handleToolToggle(tool);
                                    }}
                                  />
                                }
                                label=""
                                sx={{ mr: 0 }}
                                onClick={(e) => e.stopPropagation()}
                              />
                              <Tooltip title="Configure">
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToolConfigure(tool);
                                  }}
                                >
                                  <SettingsSuggestIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </ListItemButton>
                        </ToolItem>
                      ))}
                    </Collapse>
                  </Box>
                ))
              )}
            </ToolList>
          </ToolsPanelContent>
        </ToolsPanelContainer>

        {renderConfigDialog()}
      </>
    );
  }
);

ChatToolsPanel.displayName = 'ChatToolsPanel';

export default ChatToolsPanel;
