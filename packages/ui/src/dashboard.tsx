'use client';

import * as React from 'react';
import {
  Box,
  Container,
  Grid as MuiGrid, // Import as MuiGrid to avoid conflicts
  Paper,
  Typography,
  Card,
  CardContent,
  IconButton,
  Button,
  Chip,
  useTheme,
  useMediaQuery,
  styled,
  alpha,
} from '@mui/material';
import {
  Memory,
  Speed,
  Timer,
  BarChart,
  TrendingUp,
  TrendingDown,
  Psychology,
  CloudQueue,
} from '@mui/icons-material';

export interface PromptMetrics {
  id: string;
  name: string;
  totalCalls: number;
  avgLatency: number;
  successRate: number;
  costPerCall: number;
  lastUsed: string;
}

export interface ModelMetrics {
  id: string;
  name: string;
  provider: string;
  totalTokens: number;
  avgResponseTime: number;
  totalCost: number;
  status: 'active' | 'inactive';
}

export interface DashboardProps {
  /**
   * Dashboard title
   */
  title?: string;

  /**
   * User data
   */
  user?: {
    name: string;
    avatar?: string;
    role?: string;
  };

  /**
   * Key metrics
   */
  metrics?: {
    totalCalls: number;
    avgLatency: number;
    successRate: number;
    totalCost: number;
  };

  /**
   * Prompt usage data
   */
  prompts?: PromptMetrics[];

  /**
   * Model performance data
   */
  models?: ModelMetrics[];

  /**
   * Custom className
   */
  className?: string;
}

const StyledMetricCard = styled(Card)(({ theme }) => ({
  height: '100%',
  background: alpha(theme.palette.primary.main, 0.05),
  backdropFilter: 'blur(10px)',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
  },
}));

const MetricValue = styled(Typography)(({ theme }) => ({
  fontSize: '2rem',
  fontWeight: 600,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(1),
}));

const StatusChip = styled(Chip)<{ status?: 'success' | 'warning' | 'error' }>(
  ({ theme, status = 'success' }) => ({
    backgroundColor: alpha(
      status === 'success'
        ? theme.palette.success.main
        : status === 'warning'
        ? theme.palette.warning.main
        : theme.palette.error.main,
      0.1
    ),
    color: status === 'success'
      ? theme.palette.success.main
      : status === 'warning'
      ? theme.palette.warning.main
      : theme.palette.error.main,
    fontWeight: 500,
  })
);

// Create styled Grid components that maintain the original Grid's functionality
// In MUI v7, the API for Grid has changed
const Grid = styled(MuiGrid)(({ theme }) => ({}));

export const Dashboard = React.forwardRef<HTMLDivElement, DashboardProps>(
  ({
    title = 'AI Analytics Dashboard',
    user,
    metrics,
    prompts = [],
    models = [],
    className,
    ...props
  }, ref) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const formatNumber = (num: number) => {
      return new Intl.NumberFormat('en-US', {
        notation: 'compact',
        maximumFractionDigits: 1,
      }).format(num);
    };

    const metricCards = [
      {
        title: 'Total API Calls',
        value: formatNumber(metrics?.totalCalls || 0),
        icon: <Speed />,
        trend: 10.2,
      },
      {
        title: 'Avg. Latency',
        value: `${metrics?.avgLatency || 0}ms`,
        icon: <Timer />,
        trend: -5.3,
      },
      {
        title: 'Success Rate',
        value: `${metrics?.successRate || 0}%`,
        icon: <TrendingUp />,
        trend: 2.1,
      },
      {
        title: 'Total Cost',
        value: `$${metrics?.totalCost || 0}`,
        icon: <BarChart />,
        trend: 15.8,
      },
    ];

    return (
      <Box ref={ref} className={className} sx={{ p: 3 }} {...props}>
        <Container maxWidth="xl">
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              {title}
            </Typography>
            {user && (
              <Typography variant="subtitle1" color="text.secondary">
                Welcome back, {user.name}
              </Typography>
            )}
          </Box>

          {/* Metrics Grid */}
          <MuiGrid container spacing={3} sx={{ mb: 4 }}>
            {metricCards.map((metric, index) => (
              <MuiGrid item xs={12} sm={6} md={3} key={index}>
                <StyledMetricCard>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box
                        sx={{
                          p: 1,
                          borderRadius: 1,
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                          color: theme.palette.primary.main,
                        }}
                      >
                        {metric.icon}
                      </Box>
                    </Box>
                    <MetricValue>{metric.value}</MetricValue>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        {metric.title}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {metric.trend > 0 ? (
                          <TrendingUp fontSize="small" color="success" />
                        ) : (
                          <TrendingDown fontSize="small" color="error" />
                        )}
                        <Typography
                          variant="caption"
                          color={metric.trend > 0 ? 'success.main' : 'error.main'}
                        >
                          {Math.abs(metric.trend)}%
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </StyledMetricCard>
              </MuiGrid>
            ))}
          </MuiGrid>

          {/* Prompts and Models Section */}
          <MuiGrid container spacing={3}>
            <MuiGrid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Psychology sx={{ mr: 1 }} />
                  <Typography variant="h6">Prompt Templates</Typography>
                </Box>
                {/* Prompts table or list would go here */}
              </Paper>
            </MuiGrid>

            <MuiGrid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <CloudQueue sx={{ mr: 1 }} />
                  <Typography variant="h6">Model Performance</Typography>
                </Box>
                {/* Models table or list would go here */}
              </Paper>
            </MuiGrid>
          </MuiGrid>
        </Container>
      </Box>
    );
  }
);

Dashboard.displayName = 'Dashboard';
