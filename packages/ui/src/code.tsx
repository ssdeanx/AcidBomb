'use client';

import * as React from 'react';
import { styled } from '@mui/material/styles';

export interface CodeProps {
  /**
   * The content to be displayed within the code block
   */
  children: React.ReactNode;

  /**
   * Additional className to be applied
   */
  className?: string;

  /**
   * The variant of the code block
   * @default "inline"
   */
  variant?: 'inline' | 'block';

  /**
   * If true, enables syntax highlighting
   * @default false
   */
  highlight?: boolean;
}

const StyledCode = styled('code', {
  shouldForwardProp: (prop) => !['variant', 'highlight'].includes(prop as string),
})<{ variant?: CodeProps['variant']; highlight?: boolean }>(({ theme, variant, highlight }) => ({
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  fontSize: '0.875em',
  fontWeight: 500,
  backgroundColor: theme.palette.mode === 'light'
    ? 'rgba(0, 0, 0, 0.04)'
    : 'rgba(255, 255, 255, 0.04)',
  color: theme.palette.mode === 'light'
    ? 'rgb(36, 41, 47)'
    : 'rgb(201, 209, 217)',
  borderRadius: theme.shape.borderRadius,
  border: highlight
    ? `1px solid ${theme.palette.divider}`
    : 'none',
  padding: variant === 'block'
    ? theme.spacing(2)
    : '0.2em 0.4em',
  margin: 0,
  display: variant === 'block' ? 'block' : 'inline',
  width: variant === 'block' ? '100%' : 'auto',
  overflowX: variant === 'block' ? 'auto' : 'visible',
  whiteSpace: variant === 'block' ? 'pre' : 'pre-wrap',
  transition: theme.transitions.create([
    'background-color',
    'border-color',
    'box-shadow',
  ]),

  '&:hover': highlight ? {
    backgroundColor: theme.palette.mode === 'light'
      ? 'rgba(0, 0, 0, 0.06)'
      : 'rgba(255, 255, 255, 0.06)',
    boxShadow: theme.shadows[1],
  } : {},
}));

export const code = React.forwardRef<HTMLElement, CodeProps>(
  ({ children, className, variant = 'inline', highlight = false, ...props }, ref) => {
    return (
      <StyledCode
        ref={ref}
        className={className}
        variant={variant}
        highlight={highlight}
        {...props}
      >
        {children}
      </StyledCode>
    );
  }
);

code.displayName = 'code';
