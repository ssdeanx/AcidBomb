'use client';

import * as React from 'react';
import {
  Tooltip as MuiTooltip,
  TooltipProps as MuiTooltipProps,
  tooltipClasses,
  styled,
  Typography,
  Button
} from '@mui/material';

export interface TooltipProps extends Omit<MuiTooltipProps, 'children' | 'title'> {
  /**
   * The variant of the tooltip
   * @default "default"
   */
  variant?: 'default' | 'light' | 'rich';

  /**
   * The content to be displayed in the tooltip
   */
  content: React.ReactNode;

  /**
   * The element that triggers the tooltip
   */
  children: React.ReactElement;

  /**
   * If true, adds an arrow to the tooltip
   * @default false
   */
  arrow?: boolean;
}

const StyledTooltip = styled(({ className, ...props }: MuiTooltipProps) => (
  <MuiTooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`&.variant-default .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.grey[800],
    color: theme.palette.common.white,
    fontSize: theme.typography.pxToRem(12),
    padding: theme.spacing(1, 1.5),
    borderRadius: theme.shape.borderRadius,
  },

  [`&.variant-light .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.text.primary,
    boxShadow: theme.shadows[1],
    fontSize: theme.typography.pxToRem(12),
    border: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(1, 1.5),
    borderRadius: theme.shape.borderRadius,
  },

  [`&.variant-rich .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    maxWidth: 300,
    fontSize: theme.typography.pxToRem(12),
    border: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(1.5),
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[2],
  },

  [`& .${tooltipClasses.arrow}`]: {
    color: 'inherit',
  },
}));

export const tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  ({ variant = 'default', content, children, arrow = false, className, ...props }, ref) => {
    return (
      <StyledTooltip
        ref={ref}
        title={content}
        arrow={arrow}
        className={`variant-${variant} ${className || ''}`}
        {...props}
      >
        {children}
      </StyledTooltip>
    );
  }
);

tooltip.displayName = 'tooltip';

// Remove the default export and create a separate example component
export const TooltipExample = () => {
  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <tooltip variant="light" content="Add">
        <Button>Light</Button>
      </tooltip>
      <tooltip variant="default" content="Add">
        <Button>Bootstrap</Button>
      </tooltip>
      <tooltip
        variant="rich"
        content={
          <>
            <Typography color="inherit">Tooltip with HTML</Typography>
            <em>And here&apos;s</em> <b>some</b> <u>amazing content</u>.{' '}
            It&apos;s very engaging. Right?
          </>
        }
      >
        <Button>HTML</Button>
      </tooltip>
    </div>
  );
};
