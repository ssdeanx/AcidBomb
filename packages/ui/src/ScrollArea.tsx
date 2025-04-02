'use client';

import * as React from 'react';
import { styled, alpha, useTheme } from '@mui/material';
import { Box, BoxProps } from '@mui/material';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';

/**
 * Interface for ScrollArea component props
 * @interface ScrollAreaProps
 * @extends {BoxProps}
 */
export interface ScrollAreaProps extends BoxProps {
  /**
   * The content to be scrolled
   */
  children: React.ReactNode;

  /**
   * Maximum height of the scroll area
   * @default undefined
   */
  maxHeight?: string | number;

  /**
   * Maximum width of the scroll area
   * @default undefined
   */
  maxWidth?: string | number;

  /**
   * If true, the scrollbars will be visible even when not scrolling
   * @default false
   */
  alwaysShowScrollbar?: boolean;

  /**
   * Scrollbar size in pixels
   * @default 8
   */
  scrollbarSize?: number;

  /**
   * Type of scrolling (both axes, vertical only, or horizontal only)
   * @default 'vertical'
   */
  type?: 'auto' | 'always' | 'scroll' | 'hover' | 'never';

  /**
   * Orientation of the scrollbar
   * @default 'vertical'
   */
  orientation?: 'vertical' | 'horizontal' | 'both';

  /**
   * Time in ms until scrollbars auto-hide (only when type is 'auto')
   * @default 600
   */
  scrollHideDelay?: number;

  /**
   * Custom CSS class
   */
  className?: string;
}

// Root component that contains the viewport and scrollbars
const ScrollAreaRoot = styled(ScrollAreaPrimitive.Root)(({ theme }) => ({
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  borderRadius: theme.shape.borderRadius,
}));

// Viewport component that contains the content
const ScrollAreaViewport = styled(ScrollAreaPrimitive.Viewport)(({ theme }) => ({
  width: '100%',
  height: '100%',
  borderRadius: theme.shape.borderRadius,
}));

// Scrollbar component
const ScrollAreaScrollbar = styled(ScrollAreaPrimitive.Scrollbar)(
  ({ theme, orientation = 'vertical' }) => ({
    display: 'flex',
    userSelect: 'none',
    touchAction: 'none',
    background: alpha(theme.palette.text.primary, 0.05),
    transition: 'background 160ms ease-out',
    padding: 2,

    '&:hover': {
      background: alpha(theme.palette.text.primary, 0.1),
    },

    ...(orientation === 'vertical' && {
      width: 10,
    }),

    ...(orientation === 'horizontal' && {
      flexDirection: 'column',
      height: 10,
    }),
  })
);

// Thumb component (the draggable part of the scrollbar)
const ScrollAreaThumb = styled(ScrollAreaPrimitive.Thumb)(({ theme }) => ({
  position: 'relative',
  flex: 1,
  background: alpha(theme.palette.text.primary, 0.25),
  borderRadius: 5,

  '&:hover': {
    background: alpha(theme.palette.primary.main, 0.5),
  },

  '&:active': {
    background: theme.palette.primary.main,
  },

  // Increase target size for touch devices
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    height: '100%',
    minWidth: 44,
    minHeight: 44,
  },
}));

// Corner component (where vertical and horizontal scrollbars meet)
const ScrollAreaCorner = styled(ScrollAreaPrimitive.Corner)(({ theme }) => ({
  background: alpha(theme.palette.text.primary, 0.1),
}));

/**
 * ScrollArea component for creating stylized scrollable content areas
 * Built using Radix UI ScrollArea primitive with Material UI styling
 *
 * @component
 * @example
 * ```tsx
 * <ScrollArea maxHeight="400px">
 *   <Typography>
 *     This is a long text that will scroll...
 *   </Typography>
 * </ScrollArea>
 *
 * // With custom scrollbar size
 * <ScrollArea maxHeight="400px" scrollbarSize={12} type="hover">
 *   <Typography>
 *     Content with larger scrollbars that show on hover
 *   </Typography>
 * </ScrollArea>
 *
 * // With horizontal scrolling
 * <ScrollArea orientation="horizontal" maxWidth="500px">
 *   <Box sx={{ width: '1000px' }}>
 *     Horizontally scrollable content
 *   </Box>
 * </ScrollArea>
 * ```
 */
export const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  (
    {
      children,
      maxHeight,
      maxWidth,
      alwaysShowScrollbar = false,
      scrollbarSize = 8,
      type = 'hover',
      orientation = 'vertical',
      scrollHideDelay = 600,
      className,
      sx,
      ...props
    },
    ref
  ) => {
    const theme = useTheme();

    // Map component type prop to Radix ScrollArea type prop
    const getRadixScrollType = (): 'auto' | 'always' | 'scroll' | 'hover' => {
      switch (type) {
        case 'always':
          return 'always';
        case 'scroll':
          return 'scroll';
        case 'hover':
          return 'hover';
        case 'never':
        // Radix doesn't have 'hidden'. We handle this by not rendering scrollbars below.
        // Return 'auto' for the Root component's type prop.
        case 'auto':
        default:
          return 'auto';
      }
    };

    const showScrollbars = type !== 'never';

    return (
      <Box
        ref={ref}
        className={className}
        sx={sx}
        {...props}
      >
        <ScrollAreaRoot
          type={getRadixScrollType()}
          scrollHideDelay={scrollHideDelay}
        >
          <ScrollAreaViewport style={{ maxHeight, maxWidth }}>
            {children}
          </ScrollAreaViewport>

          {showScrollbars && (orientation === 'vertical' || orientation === 'both') ? (
            <ScrollAreaScrollbar
              orientation="vertical"
              style={{ width: scrollbarSize }}
            >
              <ScrollAreaThumb />
            </ScrollAreaScrollbar>
          ) : null}

          {showScrollbars && (orientation === 'horizontal' || orientation === 'both') ? (
            <ScrollAreaScrollbar
              orientation="horizontal"
              style={{ height: scrollbarSize }}
            >
              <ScrollAreaThumb />
            </ScrollAreaScrollbar>
          ) : null}

          {showScrollbars && orientation === 'both' && <ScrollAreaCorner />}
        </ScrollAreaRoot>
      </Box>
    );
  }
);

ScrollArea.displayName = 'ScrollArea';

export default ScrollArea;
