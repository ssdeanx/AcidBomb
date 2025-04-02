'use client';

import * as React from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse,
  IconButton,
  Divider,
  Tooltip,
  Chip,
  CircularProgress,
  styled,
  alpha,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Done as DoneIcon,
  Error as ErrorIcon,
  Pending as PendingIcon,
  PlayArrow as PlayArrowIcon,
  Refresh as RefreshIcon,
  Code as CodeIcon,
  RocketLaunch as AgentIcon,
  Build as ToolIcon,
  Troubleshoot as ProcessingIcon,
  CallSplit as WorkflowIcon,
} from '@mui/icons-material';

/**
 * Status types for workflow steps
 */
export type StepStatus = 'idle' | 'running' | 'completed' | 'failed';

/**
 * Type of workflow step
 */
export type StepType = 'agent' | 'tool' | 'process' | 'workflow';

/**
 * Interface for a workflow step
 */
export interface WorkflowStep {
  /**
   * Unique identifier for the step
   */
  id: string;

  /**
   * Display name of the step
   */
  name: string;

  /**
   * Type of step (agent, tool, process, or workflow)
   */
  type: StepType;

  /**
   * Current status of the step
   */
  status: StepStatus;

  /**
   * Optional description of what the step does
   */
  description?: string;

  /**
   * Optional output or result of the step
   */
  output?: string;

  /**
   * Optional input parameters for the step
   */
  inputs?: Record<string, any>;

  /**
   * Optional error message if step failed
   */
  error?: string;

  /**
   * Optional execution time in ms
   */
  executionTime?: number;

  /**
   * Optional sub-steps for nested workflows
   */
  steps?: WorkflowStep[];

  /**
   * Optional metadata for the step
   */
  metadata?: Record<string, any>;
}

/**
 * Props for the ChatWorkflowPanel component
 */
export interface ChatWorkflowPanelProps {
  /**
   * Array of workflow steps to display
   */
  steps: WorkflowStep[];

  /**
   * Optional callback when a step is clicked
   */
  onStepClick?: (step: WorkflowStep) => void;

  /**
   * Optional callback to retry a failed step
   */
  onRetryStep?: (stepId: string) => void;

  /**
   * Optional callback to run a step manually
   */
  onRunStep?: (stepId: string) => void;

  /**
   * If true, all step details are expanded by default
   * @default false
   */
  defaultExpanded?: boolean;

  /**
   * Optional title for the panel
   * @default "Workflow"
   */
  title?: string;

  /**
   * Optional CSS class name
   */
  className?: string;

  /**
   * If true, the panel is collapsed to show minimal information
   * @default false
   */
  collapsed?: boolean;

  /**
   * Optional callback when panel is toggled between collapsed and expanded
   */
  onToggleCollapse?: (collapsed: boolean) => void;
}

const WorkflowPanelContainer = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  boxShadow: theme.shadows[2],
  transition: theme.transitions.create(['height', 'max-height']),
}));

const WorkflowHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(1, 2),
  backgroundColor: alpha(theme.palette.primary.main, 0.05),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const WorkflowContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  overflow: 'auto',
  maxHeight: '400px',
}));

const StepItem = styled(ListItem, {
  shouldForwardProp: (prop) => prop !== 'depth',
})<{ depth: number }>(({ theme, depth = 0 }) => ({
  padding: theme.spacing(0.75, 1),
  paddingLeft: theme.spacing(2 + depth * 2),
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(0.5),
  transition: theme.transitions.create(['background-color']),
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
  },
}));

const StepDetail = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1, 2, 1, 4),
  backgroundColor: alpha(theme.palette.background.default, 0.5),
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1),
}));

const StatusChip = styled(Chip)(({ theme }) => ({
  height: '24px',
  borderRadius: '12px',
  fontSize: '0.75rem',
}));

/**
 * Component that renders workflow steps including agents and tools
 */
export const ChatWorkflowPanel: React.FC<ChatWorkflowPanelProps> = ({
  steps,
  onStepClick,
  onRetryStep,
  onRunStep,
  defaultExpanded = false,
  title = 'Workflow',
  className,
  collapsed = false,
  onToggleCollapse,
}) => {
  const [expandedSteps, setExpandedSteps] = React.useState<Record<string, boolean>>({});
  const [panelCollapsed, setPanelCollapsed] = React.useState<boolean>(collapsed);

  // Set initial expanded state based on defaultExpanded prop
  React.useEffect(() => {
    if (defaultExpanded) {
      const expanded: Record<string, boolean> = {};
      const setAllExpanded = (workflowSteps: WorkflowStep[]) => {
        workflowSteps.forEach(step => {
          expanded[step.id] = true;
          if (step.steps?.length) {
            setAllExpanded(step.steps);
          }
        });
      };
      setAllExpanded(steps);
      setExpandedSteps(expanded);
    }
  }, [defaultExpanded, steps]);

  // Update when collapsed prop changes
  React.useEffect(() => {
    setPanelCollapsed(collapsed);
  }, [collapsed]);

  /**
   * Toggle the expanded state of a step
   *
   * @param stepId - ID of the step to toggle
   */
  const toggleStepExpand = (stepId: string) => {
    setExpandedSteps(prev => ({
      ...prev,
      [stepId]: !prev[stepId],
    }));
  };

  /**
   * Toggle the collapsed state of the panel
   */
  const togglePanelCollapse = () => {
    const newState = !panelCollapsed;
    setPanelCollapsed(newState);
    if (onToggleCollapse) {
      onToggleCollapse(newState);
    }
  };

  /**
   * Get the appropriate icon based on step type
   *
   * @param type - Type of the workflow step
   * @returns React element with the appropriate icon
   */
  const getStepTypeIcon = (type: StepType) => {
    switch (type) {
      case 'agent':
        return <AgentIcon />;
      case 'tool':
        return <ToolIcon />;
      case 'process':
        return <ProcessingIcon />;
      case 'workflow':
        return <WorkflowIcon />;
      default:
        return <CodeIcon />;
    }
  };

  /**
   * Get the appropriate icon and color based on step status
   *
   * @param status - Status of the workflow step
   * @returns Object with icon and color information
   */
  const getStatusInfo = (status: StepStatus) => {
    switch (status) {
      case 'completed':
        return { icon: <DoneIcon fontSize="small" />, color: 'success', label: 'Completed' };
      case 'running':
        return { icon: <CircularProgress size={16} />, color: 'info', label: 'Running' };
      case 'failed':
        return { icon: <ErrorIcon fontSize="small" />, color: 'error', label: 'Failed' };
      case 'idle':
      default:
        return { icon: <PendingIcon fontSize="small" />, color: 'default', label: 'Idle' };
    }
  };

  /**
   * Format execution time in a human-readable format
   *
   * @param ms - Time in milliseconds
   * @returns Formatted time string
   */
  const formatExecutionTime = (ms?: number): string => {
    if (!ms) return '';

    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(2)}s`;

    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  /**
   * Renders a single workflow step and its children recursively
   *
   * @param step - The workflow step to render
   * @param depth - Depth level for indentation
   * @returns React element representing the step
   */
  const renderWorkflowStep = (step: WorkflowStep, depth = 0) => {
    const isExpanded = !!expandedSteps[step.id];
    const statusInfo = getStatusInfo(step.status);
    const hasChildren = step.steps && step.steps.length > 0;
    const hasDetails = !!(step.description || step.output || step.error || step.inputs);

    return (
      <React.Fragment key={step.id}>
        <StepItem
          depth={depth}
          onClick={() => onStepClick?.(step)}
          secondaryAction={
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {step.status === 'failed' && onRetryStep && (
                <Tooltip title="Retry">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRetryStep(step.id);
                    }}
                  >
                    <RefreshIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}

              {step.status === 'idle' && onRunStep && (
                <Tooltip title="Run">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRunStep(step.id);
                    }}
                  >
                    <PlayArrowIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}

              {(hasDetails || hasChildren) && (
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleStepExpand(step.id);
                  }}
                >
                  {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
              )}
            </Box>
          }
        >
          <ListItemIcon sx={{ minWidth: 36 }}>
            {getStepTypeIcon(step.type)}
          </ListItemIcon>
          <ListItemText
            primary={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Typography variant="body2" component="span" sx={{ fontWeight: 500 }}>
                  {step.name}
                </Typography>
                <StatusChip
                  size="small"
                  label={statusInfo.label}
                  color={statusInfo.color as any}
                  icon={statusInfo.icon}
                />
                {step.executionTime && step.status === 'completed' && (
                  <Typography variant="caption" component="span" sx={{ color: 'text.secondary' }}>
                    {formatExecutionTime(step.executionTime)}
                  </Typography>
                )}
              </Box>
            }
          />
        </StepItem>

        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
          {/* Step details */}
          {hasDetails && (
            <StepDetail>
              {step.description && (
                <Typography variant="body2" sx={{ mb: 1 }} color="text.secondary">
                  {step.description}
                </Typography>
              )}

              {step.inputs && Object.keys(step.inputs).length > 0 && (
                <>
                  <Typography variant="caption" sx={{ fontWeight: 500, display: 'block', mb: 0.5 }}>
                    Inputs:
                  </Typography>
                  <Box component="pre" sx={{
                    fontSize: '0.75rem',
                    p: 1,
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    overflow: 'auto',
                    maxHeight: '100px',
                    mb: 1,
                  }}>
                    {JSON.stringify(step.inputs, null, 2)}
                  </Box>
                </>
              )}

              {step.output && (
                <>
                  <Typography variant="caption" sx={{ fontWeight: 500, display: 'block', mb: 0.5 }}>
                    Output:
                  </Typography>
                  <Box component="pre" sx={{
                    fontSize: '0.75rem',
                    p: 1,
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    overflow: 'auto',
                    maxHeight: '100px',
                    mb: 1,
                  }}>
                    {typeof step.output === 'string' ? step.output : JSON.stringify(step.output, null, 2)}
                  </Box>
                </>
              )}

              {step.error && (
                <>
                  <Typography variant="caption" sx={{ fontWeight: 500, display: 'block', mb: 0.5, color: 'error.main' }}>
                    Error:
                  </Typography>
                  <Box component="pre" sx={{
                    fontSize: '0.75rem',
                    p: 1,
                    bgcolor: alpha('#f44336', 0.05),
                    color: 'error.main',
                    borderRadius: 1,
                    overflow: 'auto',
                    maxHeight: '100px',
                  }}>
                    {step.error}
                  </Box>
                </>
              )}
            </StepDetail>
          )}

          {/* Child steps */}
          {hasChildren && (
            <List disablePadding>
              {step.steps!.map(childStep => renderWorkflowStep(childStep, depth + 1))}
            </List>
          )}
        </Collapse>

        {depth === 0 && <Divider sx={{ my: 0.5 }} />}
      </React.Fragment>
    );
  };

  return (
    <WorkflowPanelContainer className={className}>
      <WorkflowHeader onClick={togglePanelCollapse} sx={{ cursor: 'pointer' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WorkflowIcon fontSize="small" color="primary" />
          <Typography variant="subtitle2">{title}</Typography>
        </Box>
        {panelCollapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
      </WorkflowHeader>

      <Collapse in={!panelCollapsed}>
        <WorkflowContent>
          {steps.length > 0 ? (
            <List disablePadding>
              {steps.map(step => renderWorkflowStep(step))}
            </List>
          ) : (
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <Typography color="text.secondary" variant="body2">
                No workflow steps available
              </Typography>
            </Box>
          )}
        </WorkflowContent>
      </Collapse>
    </WorkflowPanelContainer>
  );
};

ChatWorkflowPanel.displayName = 'ChatWorkflowPanel';
export default ChatWorkflowPanel;
