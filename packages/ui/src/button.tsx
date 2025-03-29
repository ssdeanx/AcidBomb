'use client';

import * as React from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps, styled, CircularProgress } from '@mui/material';

/**
 * Custom button variants extend MUI's standard variants
 */
type CustomButtonVariant = 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link';

/**
 * Props for the styled button component
 */
interface StyledButtonProps {
  customVariant?: CustomButtonVariant;
  customSize?: 'sm' | 'md' | 'lg' | 'icon';
}

/**
 * Button component props
 */
export interface ButtonProps extends Omit<MuiButtonProps, 'variant' | 'size'> {
  /**
   * The variant of the button
   * @default "primary"
   */
  variant?: CustomButtonVariant;

  /**
   * The size of the button
   * @default "md"
   */
  size?: 'sm' | 'md' | 'lg' | 'icon';

  /**
   * If true, the button will be rendered in a loading state
   * @default false
   */
  isLoading?: boolean;

  /**
   * If true, the button will take up the full width of its container
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Optional icon to display before the button text
   */
  startIcon?: React.ReactNode;

  /**
   * Optional icon to display after the button text
   */
  endIcon?: React.ReactNode;
}

/**
 * Styled button with custom variants and sizes
 */
const StyledButton = styled(MuiButton, {
  shouldForwardProp: (prop) => !['customVariant', 'customSize'].includes(prop as string),
})<StyledButtonProps>(({ theme, customVariant, customSize }) => ({
  borderRadius: '8px',
  textTransform: 'none',
  fontWeight: 500,
  transition: 'all 150ms ease',
  position: 'relative',

  // Sizes
  ...(customSize === 'sm' && {
    padding: '6px 12px',
    fontSize: '0.875rem',
  }),
  ...(customSize === 'md' && {
    padding: '8px 16px',
    fontSize: '1rem',
  }),
  ...(customSize === 'lg' && {
    padding: '12px 24px',
    fontSize: '1.125rem',
  }),
  ...(customSize === 'icon' && {
    padding: '8px',
    minWidth: 'auto',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
  }),

  // Variants
  ...(customVariant === 'primary' && {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
    '&:focus-visible': {
      outline: `3px solid ${theme.palette.primary.light}`,
      outlineOffset: '2px',
    },
  }),
  ...(customVariant === 'secondary' && {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.secondary.dark,
    },
    '&:focus-visible': {
      outline: `3px solid ${theme.palette.secondary.light}`,
      outlineOffset: '2px',
    },
  }),
  ...(customVariant === 'destructive' && {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.error.dark,
    },
    '&:focus-visible': {
      outline: `3px solid ${theme.palette.error.light}`,
      outlineOffset: '2px',
    },
  }),
  ...(customVariant === 'outline' && {
    backgroundColor: 'transparent',
    color: theme.palette.primary.main,
    border: `2px solid ${theme.palette.primary.main}`,
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    },
    '&:focus-visible': {
      outline: `3px solid ${theme.palette.primary.light}`,
      outlineOffset: '2px',
    },
  }),
  ...(customVariant === 'ghost' && {
    backgroundColor: 'transparent',
    color: theme.palette.text.primary,
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:focus-visible': {
      outline: `3px solid ${theme.palette.action.focus}`,
      outlineOffset: '2px',
    },
  }),
  ...(customVariant === 'link' && {
    backgroundColor: 'transparent',
    color: theme.palette.primary.main,
    padding: 0,
    '&:hover': {
      backgroundColor: 'transparent',
      textDecoration: 'underline',
    },
    '&:focus-visible': {
      outline: `3px solid ${theme.palette.primary.light}`,
      outlineOffset: '2px',
    },
  }),

  // Disabled state
  '&.Mui-disabled': {
    opacity: 0.6,
    pointerEvents: 'none',
  },

  // Loading state
  '&.loading': {
    pointerEvents: 'none',
  },
}));

/**
 * Button component with various variants, sizes, and states
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="md" onClick={() => console.log('Clicked!')}>
 *   Click Me
 * </Button>
 * ```
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    fullWidth = false,
    startIcon,
    endIcon,
    disabled,
    className = '',
    ...props
  }, ref) => {
    const getMuiVariant = (customVariant: CustomButtonVariant): MuiButtonProps['variant'] => {
      switch (customVariant) {
        case 'primary':
        case 'secondary':
        case 'destructive':
          return 'contained';
        case 'outline':
          return 'outlined';
        case 'ghost':
        case 'link':
          return 'text';
        default:
          return 'contained';
      }
    };

    const loadingClass = isLoading ? 'loading' : '';
    const combinedClassName = `${loadingClass} ${className}`.trim();

    return (
      <StyledButton
        ref={ref}
        customVariant={variant}
        customSize={size}
        className={combinedClassName}
        disabled={disabled || isLoading}
        fullWidth={fullWidth}
        variant={getMuiVariant(variant)}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading && (
          <CircularProgress
            size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20}
            sx={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              marginTop: '-0.5em',
              marginLeft: '-0.5em',
            }}
            color="inherit"
          />
        )}
        {!isLoading && startIcon && (
          <span className="mr-2">{startIcon}</span>
        )}
        <span style={{ visibility: isLoading ? 'hidden' : 'visible' }}>
          {children}
        </span>
        {!isLoading && endIcon && (
          <span className="ml-2">{endIcon}</span>
        )}
      </StyledButton>
    );
  }
);

Button.displayName = 'Button';
