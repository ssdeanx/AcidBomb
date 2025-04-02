'use client';

import * as React from 'react';
import {
  Popover as MuiPopover,
  PopoverProps as MuiPopoverProps,
  styled,
  alpha,
  Box,
  useTheme,
} from '@mui/material';

/**
 * Extended props for the Popover component
 * @interface PopoverProps
 * @extends {Omit<MuiPopoverProps, 'children'>}
 */
export interface PopoverProps extends Omit<MuiPopoverProps, 'children'> {
  /**
   * The content of the popover
   */
  children: React.ReactNode;

  /**
   * The anchor element to attach the popover to
   */
  anchorEl: HTMLElement | null;

  /**
   * If true, the popover is visible
   */
  open: boolean;

  /**
   * Callback fired when the component requests to be closed
   */
  onClose: () => void;

  /**
   * The width of the popover
   * @default 'auto'
   */
  width?: number | string;

  /**
   * The maximum height of the popover
   * @default 'auto'
   */
  maxHeight?: number | string;

  /**
   * If true, the popover has an arrow
   * @default false
   */
  arrow?: boolean;

  /**
   * Custom CSS class for the popover
   */
  className?: string;

  /**
   * Animation duration in milliseconds
   * @default 225
   */
  transitionDuration?: number;

  /**
   * The elevation of the popover
   * @default 8
   */
  elevation?: number;

  /**
   * The position of the popover
   * @default 'bottom'
   */
  position?: 'top' | 'bottom' | 'left' | 'right';
}

/**
 * Styled arrow element for the popover
 */
const Arrow = styled('span')(({ theme }) => ({
  position: 'absolute',
  width: 12,
  height: 12,
  backgroundColor: theme.palette.background.paper,
  transform: 'rotate(45deg)',
  zIndex: -1,
  boxShadow: theme.shadows[1],
}));

/**
 * Styled popover container
 */
const StyledPopoverContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
}));

/**
 * Enhanced Popover component built on MUI's Popover with additional functionality
 *
 * @component
 * @example
 * ```tsx
 * const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
 *
 * const handleClick = (event: React.MouseEvent<HTMLElement>) => {
 *   setAnchorEl(event.currentTarget);
 * };
 *
 * const handleClose = () => {
 *   setAnchorEl(null);
 * };
 *
 * return (
 *   <>
 *     <Button onClick={handleClick}>Open Popover</Button>
 *     <Popover
 *       open={Boolean(anchorEl)}
 *       anchorEl={anchorEl}
 *       onClose={handleClose}
 *       arrow
 *       width={300}
 *     >
 *       <Typography>Popover content goes here</Typography>
 *     </Popover>
 *   </>
 * );
 * ```
 */
export const Popover = React.forwardRef<HTMLDivElement, PopoverProps>(
  (
    {
      children,
      anchorEl,
      open,
      onClose,
      width = 'auto',
      maxHeight = 'auto',
      arrow = false,
      className,
      transitionDuration = 225,
      elevation = 8,
      position = 'bottom',
      ...props
    },
    ref
  ) => {
    const theme = useTheme();

    // Determine anchor origin and transform origin based on position prop
    const getPositionProps = () => {
      const positions = {
        top: {
          anchorOrigin: {
            vertical: 'top' as const,
            horizontal: 'center' as const,
          },
          transformOrigin: {
            vertical: 'bottom' as const,
            horizontal: 'center' as const,
          },
          marginThreshold: 16,
        },
        bottom: {
          anchorOrigin: {
            vertical: 'bottom' as const,
            horizontal: 'center' as const,
          },
          transformOrigin: {
            vertical: 'top' as const,
            horizontal: 'center' as const,
          },
          marginThreshold: 16,
        },
        left: {
          anchorOrigin: {
            vertical: 'center' as const,
            horizontal: 'left' as const,
          },
          transformOrigin: {
            vertical: 'center' as const,
            horizontal: 'right' as const,
          },
          marginThreshold: 16,
        },
        right: {
          anchorOrigin: {
            vertical: 'center' as const,
            horizontal: 'right' as const,
          },
          transformOrigin: {
            vertical: 'center' as const,
            horizontal: 'left' as const,
          },
          marginThreshold: 16,
        },
      };

      return positions[position];
    };

    // Get arrow placement based on position
    const getArrowPlacement = () => {
      const placements = {
        top: {
          top: 1,
          left: '50%',
          transform: 'translateX(-50%) rotate(45deg)',
        },
        bottom: {
          bottom: 1,
          left: '50%',
          transform: 'translateX(-50%) rotate(45deg)',
        },
        left: {
          left: 1,
          top: '50%',
          transform: 'translateY(-50%) rotate(45deg)',
        },
        right: {
          right: 1,
          top: '50%',
          transform: 'translateY(-50%) rotate(45deg)',
        },
      };

      return placements[position];
    };

    // Get position props based on position prop
    const positionProps = getPositionProps();
    const arrowPlacement = getArrowPlacement();

    return (
      <MuiPopover
        ref={ref}
        open={open}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={positionProps.anchorOrigin}
        transformOrigin={positionProps.transformOrigin}
        marginThreshold={positionProps.marginThreshold}
        className={className}
        transitionDuration={transitionDuration}
        elevation={elevation}
        {...props}
      >
        {arrow && <Arrow style={arrowPlacement} />}
        <StyledPopoverContent
          sx={{
            width,
            maxHeight,
            overflow: 'auto',
          }}
        >
          {children}
        </StyledPopoverContent>
      </MuiPopover>
    );
  }
);

Popover.displayName = 'Popover';

export default Popover;
