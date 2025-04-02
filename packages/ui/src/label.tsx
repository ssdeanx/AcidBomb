'use client';

import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import { Typography, TypographyProps, Box } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';
import * as LabelPrimitive from '@radix-ui/react-label';

export interface LabelProps extends Omit<LabelPrimitive.LabelProps, 'asChild'> {
  /**
   * The label text content
   */
  children: React.ReactNode;

  /**
   * Optional hint text to be displayed below the label
   */
  helperText?: string;

  /**
   * Whether the associated form control is required
   */
  required?: boolean;

  /**
   * Whether the label should indicate an error state
   */
  error?: boolean;

  /**
   * Error message to display when error is true
   */
  errorText?: string;

  /**
   * Whether the label should be disabled
   */
  disabled?: boolean;

  /**
   * Optional HTML for attribute to associate the label with a form control
   */
  htmlFor?: string;

  /**
   * Typography variant for the label
   * @default body2
   */
  variant?: TypographyProps['variant'];

  /**
   * Additional CSS classes
   */
  className?: string;
}

const StyledLabel = styled(LabelPrimitive.Root)<{ error?: boolean; disabled?: boolean }>(
  ({ theme, error, disabled }) => ({
    display: 'inline-flex',
    flexDirection: 'column',
    fontSize: theme.typography.body2.fontSize,
    fontWeight: theme.typography.fontWeightMedium,
    color: disabled
      ? theme.palette.text.disabled
      : error
        ? theme.palette.error.main
        : theme.palette.text.primary,
    cursor: disabled ? 'not-allowed' : 'default',
    gap: theme.spacing(0.5),

    '&[data-required]::after': {
      content: '"*"',
      marginLeft: theme.spacing(0.5),
      color: theme.palette.error.main,
    },

    '&:hover': {
      color: !disabled && !error
        ? theme.palette.text.primary
        : undefined,
    },
  })
);

const HelperText = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  marginTop: theme.spacing(0.5),
  color: theme.palette.text.secondary,
}));

const ErrorContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  marginTop: theme.spacing(0.5),
  color: theme.palette.error.main,
  fontSize: '0.75rem',
}));

/**
 * Label component for form controls with support for helper text and error states
 *
 * @component
 * @example
 * ```tsx
 * <Label htmlFor="email" required>Email Address</Label>
 * <Input id="email" type="email" />
 *
 * <Label error errorText="Invalid phone number">Phone</Label>
 * <Input error />
 *
 * <Label helperText="We'll never share your email">Email</Label>
 * ```
 */
export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  (
    {
      children,
      helperText,
      required = false,
      error = false,
      errorText,
      disabled = false,
      htmlFor,
      variant = 'body2',
      className,
      ...props
    },
    ref
  ) => {
    return (
      <StyledLabel
        ref={ref}
        className={className}
        htmlFor={htmlFor}
        error={error}
        disabled={disabled}
        data-required={required ? true : undefined}
        {...props}
      >
        <Typography
          component="span"
          variant={variant}
          fontWeight="medium"
          color="inherit"
        >
          {children}
        </Typography>

        {helperText && !error && (
          <HelperText variant="caption">{helperText}</HelperText>
        )}

        {error && errorText && (
          <ErrorContainer>
            <ErrorOutline fontSize="inherit" />
            <Typography variant="caption" component="span">
              {errorText}
            </Typography>
          </ErrorContainer>
        )}
      </StyledLabel>
    );
  }
);

Label.displayName = 'Label';

export default Label;
