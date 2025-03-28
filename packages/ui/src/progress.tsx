'use client';

import * as React from 'react';
import {
  Box,
  CircularProgress,
  LinearProgress,
  Typography,
  styled,
  alpha,
  useTheme,
} from '@mui/material';

export interface ProgressProps {
  /**
   * The variant of the progress indicator
   * @default "linear"
   */
  variant?: 'linear' | 'circular' | 'dots';

  /**
   * The current value of the progress indicator (0-100)
   */
  value?: number;

  /**
   * The size of the progress indicator
   * @default "md"
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * If true, shows the value as a percentage
   * @default false
   */
  showValue?: boolean;

  /**
   * Custom color for the progress indicator
   */
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';

  /**
   * If true, the progress indicator will be indeterminate
   * @default false
   */
  loading?: boolean;

  /**
   * Custom label to display
   */
  label?: string;

  /**
   * Custom className
   */
  className?: string;
}

const StyledLinearProgress = styled(LinearProgress, {
  shouldForwardProp: (prop) => !['customSize'].includes(prop as string),
})<{ customSize?: ProgressProps['size'] }>(({ theme, customSize }) => ({
  borderRadius: theme.shape.borderRadius,
  height: customSize === 'sm' ? 4 : customSize === 'md' ? 8 : 12,
  backgroundColor: alpha(theme.palette.primary.main, 0.12),

  '& .MuiLinearProgress-bar': {
    borderRadius: theme.shape.borderRadius,
  },
}));

const StyledCircularProgress = styled(CircularProgress, {
  shouldForwardProp: (prop) => !['customSize'].includes(prop as string),
})<{ customSize?: ProgressProps['size'] }>(({ customSize }) => ({
  width: customSize === 'sm' ? 24 : customSize === 'md' ? 40 : 56,
  height: customSize === 'sm' ? 24 : customSize === 'md' ? 40 : 56,
}));

const DotContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
}));

const Dot = styled('span', {
  shouldForwardProp: (prop) => !['customSize', 'delay'].includes(prop as string),
})<{ customSize?: ProgressProps['size']; delay: number }>(
  ({ theme, customSize, delay }) => ({
    width: customSize === 'sm' ? 8 : customSize === 'md' ? 12 : 16,
    height: customSize === 'sm' ? 8 : customSize === 'md' ? 12 : 16,
    backgroundColor: theme.palette.primary.main,
    borderRadius: '50%',
    display: 'inline-block',
    animation: 'pulse 1.4s infinite ease-in-out both',
    animationDelay: `${delay}s`,

    '@keyframes pulse': {
      0%, 80%, 100% {
        transform: 'scale(0)',
        opacity: 0.3,
      },
      40% {
        transform: 'scale(1)',
        opacity: 1,
      },
    },
  })
);

export const progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({
    variant = 'linear',
    value = 0,
    size = 'md',
    showValue = false,
    color = 'primary',
    loading = false,
    label,
    className,
    ...props
  }, ref) => {
    const theme = useTheme();

    const renderProgress = () => {
      switch (variant) {
        case 'circular':
          return (
            <Box
              sx={{
                position: 'relative',
                display: 'inline-flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <StyledCircularProgress
                variant={loading ? 'indeterminate' : 'determinate'}
                value={value}
                customSize={size}
                color={color}
              />
              {showValue && !loading && (
                <Typography
                  variant="caption"
                  component="div"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  {`${Math.round(value)}%`}
                </Typography>
              )}
            </Box>
          );

        case 'dots':
          return (
            <DotContainer>
              {[0, 1, 2].map((index) => (
                <Dot key={index} customSize={size} delay={index * 0.16} />
              ))}
            </DotContainer>
          );

        default:
          return (
            <Box sx={{ width: '100%' }}>
              {(label || showValue) && (
                <Box
                  sx={{
                    mb: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  {label && (
                    <Typography variant="body2" color="text.secondary">
                      {label}
                    </Typography>
                  )}
                  {showValue && !loading && (
                    <Typography variant="body2" color="text.secondary">
                      {`${Math.round(value)}%`}
                    </Typography>
                  )}
                </Box>
              )}
              <StyledLinearProgress
                variant={loading ? 'indeterminate' : 'determinate'}
                value={value}
                customSize={size}
                color={color}
              />
            </Box>
          );
      }
    };

    return (
      <Box
        ref={ref}
        className={className}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        {...props}
      >
        {renderProgress()}
      </Box>
    );
  }
);

progress.displayName = 'progress';
