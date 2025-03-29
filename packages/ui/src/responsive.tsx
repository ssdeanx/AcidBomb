'use client';

import { useMediaQuery, useTheme as useMuiTheme } from '@mui/material';
import { JSX, useEffect, useState } from 'react';

/**
 * Breakpoint type supported by the useResponsive hook
 */
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Responsive utilities return object
 */
export interface ResponsiveUtils {
  /**
   * Current breakpoint (xs, sm, md, lg, xl)
   */
  breakpoint: Breakpoint;

  /**
   * True if the current viewport is smaller than or equal to the 'sm' breakpoint
   */
  isMobile: boolean;

  /**
   * True if the current viewport is larger than 'sm' and smaller than or equal to 'md'
   */
  isTablet: boolean;

  /**
   * True if the current viewport is larger than 'md' and smaller than or equal to 'lg'
   */
  isDesktop: boolean;

  /**
   * True if the current viewport is larger than 'lg'
   */
  isLargeScreen: boolean;

  /**
   * Utility function to check if the current viewport is up to (inclusive) the specified breakpoint
   * @param breakpoint - The breakpoint to check against
   */
  down: (breakpoint: Breakpoint) => boolean;

  /**
   * Utility function to check if the current viewport is at least (inclusive) the specified breakpoint
   * @param breakpoint - The breakpoint to check against
   */
  up: (breakpoint: Breakpoint) => boolean;

  /**
   * Utility function to check if the current viewport is between the specified breakpoints (inclusive)
   * @param start - The starting breakpoint
   * @param end - The ending breakpoint
   */
  between: (start: Breakpoint, end: Breakpoint) => boolean;

  /**
   * Utility function to check if the current viewport matches exactly the specified breakpoint
   * @param breakpoint - The breakpoint to check against
   */
  only: (breakpoint: Breakpoint) => boolean;
}

/**
 * Hook that provides responsive design utilities based on Material UI's useMediaQuery
 *
 * @returns Object with various responsive utility functions and properties
 *
 * @example
 * ```tsx
 * function ResponsiveComponent() {
 *   const { isMobile, isTablet, isDesktop, up, down } = useResponsive();
 *
 *   return (
 *     <div>
 *       {isMobile && <MobileView />}
 *       {isTablet && <TabletView />}
 *       {isDesktop && <DesktopView />}
 *       {up('md') && <ShowOnMediumAndUp />}
 *       {down('sm') && <ShowOnSmallAndDown />}
 *     </div>
 *   );
 * }
 * ```
 */
export function useResponsive(): ResponsiveUtils {
  const theme = useMuiTheme();
  const [mounted, setMounted] = useState(false);

  // These will only be used on the client side
  const xsMatch = useMediaQuery(theme.breakpoints.only('xs'));
  const smMatch = useMediaQuery(theme.breakpoints.only('sm'));
  const mdMatch = useMediaQuery(theme.breakpoints.only('md'));
  const lgMatch = useMediaQuery(theme.breakpoints.only('lg'));
  const xlMatch = useMediaQuery(theme.breakpoints.only('xl'));

  // Determine current breakpoint
  let breakpoint: Breakpoint = 'md'; // Default for SSR

  if (mounted) {
    if (xsMatch) breakpoint = 'xs';
    else if (smMatch) breakpoint = 'sm';
    else if (mdMatch) breakpoint = 'md';
    else if (lgMatch) breakpoint = 'lg';
    else if (xlMatch) breakpoint = 'xl';
  }

  // Helper functions
  const down = (bp: Breakpoint): boolean => {
    if (!mounted) return false;
    const breakpointValue = theme.breakpoints.values[bp];
    const currentValue = theme.breakpoints.values[breakpoint];
    return currentValue <= breakpointValue;
  };

  const up = (bp: Breakpoint): boolean => {
    if (!mounted) return false;
    const breakpointValue = theme.breakpoints.values[bp];
    const currentValue = theme.breakpoints.values[breakpoint];
    return currentValue >= breakpointValue;
  };

  const between = (start: Breakpoint, end: Breakpoint): boolean => {
    if (!mounted) return false;
    const startValue = theme.breakpoints.values[start];
    const endValue = theme.breakpoints.values[end];
    const currentValue = theme.breakpoints.values[breakpoint];
    return currentValue >= startValue && currentValue <= endValue;
  };

  const only = (bp: Breakpoint): boolean => {
    if (!mounted) return false;
    return breakpoint === bp;
  };

  // Handle mounting state to avoid hydration mismatch issues
  useEffect(() => {
    setMounted(true);
  }, []);

  return {
    breakpoint,
    isMobile: down('sm'),
    isTablet: between('sm', 'md'),
    isDesktop: between('md', 'lg'),
    isLargeScreen: up('lg'),
    down,
    up,
    between,
    only,
  };
}

/**
 * Responsive layout component that renders different content based on the current breakpoint
 */
export interface ResponsiveProps {
  /**
   * Content to show only on mobile devices (xs, sm)
   */
  mobile?: React.ReactNode;

  /**
   * Content to show only on tablet devices (md)
   */
  tablet?: React.ReactNode;

  /**
   * Content to show only on desktop devices (lg, xl)
   */
  desktop?: React.ReactNode;

  /**
   * Content to show on screens larger than or equal to the specified breakpoint
   */
  from?: {
    breakpoint: Breakpoint;
    content: React.ReactNode;
  };

  /**
   * Content to show on screens smaller than or equal to the specified breakpoint
   */
  to?: {
    breakpoint: Breakpoint;
    content: React.ReactNode;
  };
}

/**
 * Component that conditionally renders content based on the current screen size
 *
 * @example
 * ```tsx
 * <Responsive
 *   mobile={<MobileView />}
 *   tablet={<TabletView />}
 *   desktop={<DesktopView />}
 * />
 *
 * // Or using from/to
 * <Responsive
 *   from={{ breakpoint: 'md', content: <TabletAndUp /> }}
 *   to={{ breakpoint: 'sm', content: <MobileOnly /> }}
 * />
 * ```
 */
export function Responsive({ mobile, tablet, desktop, from, to }: ResponsiveProps): JSX.Element | null {
  const { isMobile, isTablet, isLargeScreen, up, down } = useResponsive();
  const [mounted, setMounted] = useState(false);

  // Handle mounting state to avoid hydration mismatch issues
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return null on server to avoid hydration mismatch
    return null;
  }

  // Handle from/to props
  if (from && up(from.breakpoint)) {
    return <>{from.content}</>;
  }

  if (to && down(to.breakpoint)) {
    return <>{to.content}</>;
  }

  // Handle device-specific props
  if (isMobile && mobile) {
    return <>{mobile}</>;
  }

  if (isTablet && tablet) {
    return <>{tablet}</>;
  }

  if (isLargeScreen && desktop) {
    return <>{desktop}</>;
  }

  return null;
}
