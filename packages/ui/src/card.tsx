'use client';

import * as React from 'react';
import {
  Card as MuiCard,
  CardContent,
  CardHeader,
  CardActions,
  CardMedia,
  Typography,
  styled,
  alpha,
  CardProps as MuiCardProps
} from '@mui/material';
import { ChevronRight } from '@mui/icons-material';

// Define custom variant type
type CustomVariant = 'default' | 'elevated' | 'dots' | 'plus' | 'neubrutalism' | 'inner' | 'lifted' | 'corners';

// Create a type for the styled component props
interface StyledCardProps {
  customVariant?: CustomVariant;
}

export interface CardProps extends Omit<MuiCardProps, 'variant'> {
  /**
   * The variant of the card
   * @default "default"
   */
  variant?: CustomVariant;

  /**
   * The title of the card
   */
  title?: string;

  /**
   * The description text below the title
   */
  description?: string;

  /**
   * The URL the card links to
   */
  href?: string;

  /**
   * The footer content of the card
   */
  footer?: React.ReactNode;

  /**
   * The image source URL
   */
  image?: string;

  /**
   * The call-to-action element
   */
  action?: React.ReactNode;

  /**
   * The main content of the card
   */
  children?: React.ReactNode;
}

const StyledCard = styled(MuiCard, {
  shouldForwardProp: (prop) => prop !== 'customVariant',
})<StyledCardProps>(({ theme, customVariant }) => ({
  position: 'relative',
  transition: 'all 150ms ease-in-out',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,

  ...(customVariant === 'default' && {
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: theme.shadows[1],
  }),

  ...(customVariant === 'elevated' && {
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: theme.shadows[4],
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: theme.shadows[8],
    },
  }),

  ...(customVariant === 'neubrutalism' && {
    border: `2px solid ${theme.palette.text.primary}`,
    boxShadow: `4px 4px 0px 0px ${theme.palette.text.primary}`,
    '&:hover': {
      transform: 'translate(-2px, -2px)',
      boxShadow: `6px 6px 0px 0px ${theme.palette.text.primary}`,
    },
  }),

  ...(customVariant === 'inner' && {
    padding: theme.spacing(1),
    background: alpha(theme.palette.primary.main, 0.04),
    border: `1px solid ${theme.palette.divider}`,
  }),

  ...(customVariant === 'lifted' && {
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.spacing(2),
    boxShadow: `0px 5px 0px 0px ${alpha(theme.palette.text.primary, 0.7)}`,
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: `0px 7px 0px 0px ${alpha(theme.palette.text.primary, 0.7)}`,
    },
  }),

  ...(customVariant === 'corners' && {
    border: `2px solid ${theme.palette.divider}`,
    borderRadius: theme.spacing(1),
    '&::before': {
      content: '""',
      position: 'absolute',
      top: -4,
      left: -4,
      right: -4,
      bottom: -4,
      border: `2px solid ${theme.palette.primary.main}`,
      borderRadius: theme.spacing(1.5),
      opacity: 0,
      transition: 'opacity 150ms ease-in-out',
    },
    '&:hover::before': {
      opacity: 1,
    },
  }),
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  '&:last-child': {
    paddingBottom: theme.spacing(2),
  },
}));

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({
    variant = 'default',
    title,
    description,
    href,
    footer,
    image,
    action,
    className,
    children,
    ...props
  }, ref) => {
    const cardContent = (
      <>
        {image && (
          <CardMedia
            component="img"
            height="200"
            image={image}
            alt={title}
            sx={{ objectFit: 'cover' }}
          />
        )}

        {(title || description) && (
          <CardHeader
            title={
              title && (
                <Typography variant="h6" component="h2" gutterBottom={!!description}>
                  {title}
                </Typography>
              )
            }
            subheader={
              description && (
                <Typography variant="body2" color="text.secondary">
                  {description}
                </Typography>
              )
            }
          />
        )}

        {children && (
          <StyledCardContent>
            {typeof children === 'string' ? (
              <Typography variant="body2">{children}</Typography>
            ) : (
              children
            )}
          </StyledCardContent>
        )}

        {(footer || action) && (
          <CardActions sx={{ justifyContent: 'space-between', px: 2 }}>
            {footer}
            {action && (
              <Typography
                variant="button"
                color="primary"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  cursor: 'pointer',
                  '&:hover': { opacity: 0.8 }
                }}
              >
                {action}
                <ChevronRight fontSize="small" />
              </Typography>
            )}
          </CardActions>
        )}
      </>
    );

    const card = (
      <StyledCard
        ref={ref}
        customVariant={variant} // Pass variant as customVariant
        className={className}
        {...props}
      >
        {cardContent}
      </StyledCard>
    );

    if (href) {
      return (
        <a
          href={href}
          style={{ textDecoration: 'none' }}
          rel="noopener noreferrer"
          target="_blank"
        >
          {card}
        </a>
      );
    }

    return card;
  }
);

Card.displayName = 'Card';
