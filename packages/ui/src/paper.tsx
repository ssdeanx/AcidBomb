'use client';

import * as React from 'react';
import {
  Paper as MuiPaper,
  PaperProps as MuiPaperProps,
  styled,
  alpha,
  useTheme,
} from '@mui/material';

export interface PaperProps extends Omit<MuiPaperProps, 'variant'> {
  /**
   * The variant of the paper
   * @default "default"
   */
  variant?: 'default' | 'outlined' | 'glass' | 'gradient' | 'neubrutalism';

  /**
   * If true, the paper will have hover effects
   * @default false
   */
  interactive?: boolean;

  /**
   * If true, adds a subtle border
   * @default false
   */
  bordered?: boolean;

  /**
   * Custom background color (uses theme colors)
   */
  bgColor?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';

  /**
   * Custom className
   */
  className?: string;
}

const StyledPaper = styled(MuiPaper, {
  shouldForwardProp: (prop) =>
    !['variant', 'interactive', 'bordered', 'bgColor'].includes(prop as string),
})<{
  customVariant?: PaperProps['variant'];
  interactive?: boolean;
  bordered?: boolean;
  bgColor?: PaperProps['bgColor'];
}>(({ theme, customVariant, interactive, bordered, bgColor }) => ({
  position: 'relative',
  transition: 'all 200ms ease-in-out',
  backdropFilter: customVariant === 'glass' ? 'blur(8px)' : 'none',

  // Base styles
  ...(customVariant === 'default' && {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[1],
  }),

  // Outlined variant
  ...(customVariant === 'outlined' && {
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: 'none',
  }),

  // Glass variant
  ...(customVariant === 'glass' && {
    backgroundColor: alpha(theme.palette.background.paper, 0.7),
    border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
    boxShadow: `0 4px 30px ${alpha(theme.palette.common.black, 0.1)}`,
  }),

  // Gradient variant
  ...(customVariant === 'gradient' && {
    background: `linear-gradient(135deg, ${
      bgColor
        ? alpha(theme.palette[bgColor].main, 0.1)
        : alpha(theme.palette.primary.main, 0.1)
    } 0%, ${
      bgColor
        ? alpha(theme.palette[bgColor].dark, 0.2)
        : alpha(theme.palette.primary.dark, 0.2)
    } 100%)`,
    border: `1px solid ${alpha(
      bgColor ? theme.palette[bgColor].main : theme.palette.primary.main,
      0.1
    )}`,
  }),

  // Neubrutalism variant
  ...(customVariant === 'neubrutalism' && {
    backgroundColor: theme.palette.background.paper,
    border: `2px solid ${theme.palette.text.primary}`,
    boxShadow: `4px 4px 0 ${theme.palette.text.primary}`,
    borderRadius: theme.shape.borderRadius * 1.5,
  }),

  // Interactive states
  ...(interactive && {
    cursor: 'pointer',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows[customVariant === 'neubrutalism' ? 1 : 4],
      ...(customVariant === 'neubrutalism' && {
        transform: 'translate(-2px, -2px)',
        boxShadow: `6px 6px 0 ${theme.palette.text.primary}`,
      }),
    },
  }),

  // Bordered state
  ...(bordered && {
    border: `1px solid ${theme.palette.divider}`,
  }),

  // Background color variations
  ...(bgColor && {
    backgroundColor: alpha(theme.palette[bgColor].main, 0.1),
    borderColor: alpha(theme.palette[bgColor].main, 0.2),
  }),
}));

export const Paper = React.forwardRef<HTMLDivElement, PaperProps>(
  ({
    variant = 'default',
    interactive = false,
    bordered = false,
    bgColor,
    className,
    children,
    ...props
  }, ref) => {
    return (
      <StyledPaper
        ref={ref}
        customVariant={variant}
        interactive={interactive}
        bordered={bordered}
        bgColor={bgColor}
        className={className}
        {...props}
      >
        {children}
      </StyledPaper>
    );
  }
);

Paper.displayName = 'Paper';
