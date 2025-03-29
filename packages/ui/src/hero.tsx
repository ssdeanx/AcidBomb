'use client';

import * as React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  useTheme,
  styled,
  alpha,
  useMediaQuery,
} from '@mui/material';
import { motion } from 'framer-motion';

export interface HeroProps {
  /**
   * The main title text
   */
  title: string;

  /**
   * The subtitle or description text
   */
  description?: string;

  /**
   * The primary CTA button text
   */
  primaryCta?: string;

  /**
   * The secondary CTA button text
   */
  secondaryCta?: string;

  /**
   * Handler for primary CTA click
   */
  onPrimaryClick?: () => void;

  /**
   * Handler for secondary CTA click
   */
  onSecondaryClick?: () => void;

  /**
   * Optional background image URL
   */
  backgroundImage?: string;

  /**
   * Optional highlight text in title
   */
  highlightText?: string;

  /**
   * Additional className to be applied
   */
  className?: string;
}

const StyledHero = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'backgroundImage',
})<{ backgroundImage?: string }>(({ theme, backgroundImage }) => ({
  position: 'relative',
  overflow: 'hidden',
  minHeight: '80vh',
  display: 'flex',
  alignItems: 'center',
  background: backgroundImage
    ? `linear-gradient(to bottom, ${alpha(theme.palette.background.default, 0.8)}, ${alpha(theme.palette.background.default, 0.8)}), url(${backgroundImage})`
    : `linear-gradient(45deg, ${theme.palette.background.default} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',

  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
    opacity: 0.1,
    zIndex: 0,
  },
}));

const HighlightText = styled('span')(({ theme }) => ({
  background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  color: 'transparent',
}));

const AnimatedBox = motion(Box);

export const Hero = React.forwardRef<HTMLDivElement, HeroProps>(
  ({
    title,
    description,
    primaryCta = 'Get Started',
    secondaryCta = 'Learn More',
    onPrimaryClick,
    onSecondaryClick,
    backgroundImage,
    highlightText,
    className,
    ...props
  }, ref) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const titleArray = highlightText
      ? title.split(highlightText)
      : [title];

    return (
      <StyledHero
        ref={ref}
        backgroundImage={backgroundImage}
        className={className}
        {...props}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <AnimatedBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            sx={{
              textAlign: isMobile ? 'center' : 'left',
              maxWidth: '800px',
              mx: isMobile ? 'auto' : 'inherit',
            }}
          >
            <Typography
              variant="h1"
              component="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '4rem' },
                fontWeight: 800,
                lineHeight: 1.2,
                mb: 3,
              }}
            >
              {titleArray.map((part, index) => (
                <React.Fragment key={index}>
                  {part}
                  {index < titleArray.length - 1 && (
                    <HighlightText>{highlightText}</HighlightText>
                  )}
                </React.Fragment>
              ))}
            </Typography>

            {description && (
              <AnimatedBox
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              >
                <Typography
                  variant="h5"
                  color="text.secondary"
                  sx={{
                    mb: 4,
                    maxWidth: '600px',
                    mx: isMobile ? 'auto' : 'inherit',
                  }}
                >
                  {description}
                </Typography>
              </AnimatedBox>
            )}

            <AnimatedBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
              sx={{
                display: 'flex',
                gap: 2,
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: isMobile ? 'stretch' : 'center',
              }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={onPrimaryClick}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: '50px',
                  background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[4],
                  },
                }}
              >
                {primaryCta}
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={onSecondaryClick}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: '50px',
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2,
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                {secondaryCta}
              </Button>
            </AnimatedBox>
          </AnimatedBox>
        </Container>
      </StyledHero>
    );
  }
);

Hero.displayName = 'Hero';
