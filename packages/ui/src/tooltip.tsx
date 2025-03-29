// Version 2: Modifying 'content' prop to 'string'
'use client';

import * as React from 'react';
import {
  Tooltip as MuiTooltip,
  TooltipProps as MuiTooltipProps,
  tooltipClasses,
  styled,
} from '@mui/material';

// Base interface defining your custom props and inheriting allowed props
export interface TooltipProps extends Omit<MuiTooltipProps, 'title' | 'children'> {
  /**
   * The variant of the tooltip
   * @default "default"
   */
  variant?: 'default' | 'light' | 'rich';

  /**
   * The content to be displayed in the tooltip (Limited to strings)
   */
  content: string; // <-- Changed to string

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

// Interface for the props passed directly to the styled MuiTooltip
// This ensures the styled component itself knows about MuiTooltipProps
interface StyledTooltipWrapperProps extends MuiTooltipProps {
  className?: string;
}

// Styled component wrapper around MuiTooltip
const StyledTooltip = styled(({ className, ...props }: StyledTooltipWrapperProps) => (
  <MuiTooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  // --- Styling for different variants ---
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
    color: 'inherit', // Use background color for arrow
  },
}));

// Your custom Tooltip component implementation
export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  ({ variant = 'default', content, children, arrow = false, className, ...props }, ref) => {
    // 'content' is now guaranteed to be a string, matching the TS error's expectation
    return (
      <StyledTooltip
        ref={ref}
        title={content} // <-- Assignment is valid if TS expects string | undefined
        arrow={arrow}
        className={`variant-${variant} ${className || ''}`}
        // Spread remaining compatible props
        {...props}
      >
        {children}
      </StyledTooltip>
    );
  }
);

Tooltip.displayName = 'Tooltip';

export default Tooltip;
