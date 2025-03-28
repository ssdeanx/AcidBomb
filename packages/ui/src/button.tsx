'use client';

import * as React from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps, styled, CircularProgress } from '@mui/material';

// Define custom variant type
type CustomButtonVariant = 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link';

// Create a type for the styled component props
interface StyledButtonProps {
  customVariant?: CustomButtonVariant;
  customSize?: 'sm' | 'md' | 'lg' | 'icon';
}

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
   */
  isLoading?: boolean;

  /**
   * If true, the button will take up the full width of its container
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

const StyledButton = styled(MuiButton, {
  shouldForwardProp: (prop) => !['customVariant', 'customSize'].includes(prop as string),
})<StyledButtonProps>(({ theme, customVariant, customSize }) => ({
  borderRadius: '8px',
  textTransform: 'none',
  fontWeight: 500,
  transition: 'all 150ms ease',

  [`&.size-${customSize}`]: {
    padding: customSize === 'sm' ? '6px 12px' : customSize === 'md' ? '8px 16px' : customSize === 'lg' ? '12px 24px' : '8px',
    fontSize: customSize === 'sm' ? '0.875rem' : customSize === 'md' ? '1rem' : customSize === 'lg' ? '1.125rem' : 'inherit',
    minWidth: customSize === 'icon' ? 'auto' : 'inherit',
    width: customSize === 'icon' ? '40px' : 'inherit',
    height: customSize === 'icon' ? '40px' : 'inherit',
  },

  [`&.variant-${customVariant}`]: {
    backgroundColor: customVariant === 'primary' ? theme.palette.primary.main : customVariant === 'secondary' ? theme.palette.secondary.main : customVariant === 'destructive' ? theme.palette.error.main : customVariant === 'outline' ? 'transparent' : customVariant === 'ghost' ? 'transparent' : 'transparent',
    color: customVariant === 'primary' ? theme.palette.primary.contrastText : customVariant === 'secondary' ? theme.palette.secondary.contrastText : customVariant === 'destructive' ? theme.palette.error.contrastText : customVariant === 'outline' ? theme.palette.primary.main : customVariant === 'ghost' ? theme.palette.text.primary : theme.palette.primary.main,
    border: customVariant === 'outline' ? `2px solid ${theme.palette.primary.main}` : 'none',
    '&:hover': {
      backgroundColor: customVariant === 'primary' ? theme.palette.primary.dark : customVariant === 'secondary' ? theme.palette.secondary.dark : customVariant === 'destructive' ? theme.palette.error.dark : customVariant === 'outline' ? theme.palette.primary.main : customVariant === 'ghost' ? theme.palette.action.hover : 'transparent',
      color: customVariant === 'outline' ? theme.palette.primary.contrastText : 'inherit',
      textDecoration: customVariant === 'link' ? 'underline' : 'none',
    },
    padding: customVariant === 'link' ? 0 : 'inherit',
  },
}));

export const button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    fullWidth = false,
    startIcon,
    endIcon,
    disabled,
    className,
    ...props
  }, ref) => {
    const getMuiVariant = (customVariant: CustomButtonVariant) => {
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

    return (
      <StyledButton
        ref={ref}
        customVariant={variant}
        customSize={size}
        className={`size-${size} variant-${variant} ${className || ''}`}
        disabled={disabled || isLoading}
        fullWidth={fullWidth}
        variant={getMuiVariant(variant)}
        {...props}
      >
        {isLoading && (
          <CircularProgress
            size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20}
            className="mr-2"
            color="inherit"
          />
        )}
        {!isLoading && startIcon && (
          <span className="mr-2">{startIcon}</span>
        )}
        {children}
        {!isLoading && endIcon && (
          <span className="ml-2">{endIcon}</span>
        )}
      </StyledButton>
    );
  }
);

button.displayName = 'button';
