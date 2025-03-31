'use client';

import * as React from 'react';
import { Box, Container, Typography, styled } from '@mui/material';

const StyledFooter = styled('footer')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderTop: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(3),
  position: 'relative',
  bottom: 0,
  width: '100%',
}));

export interface FooterProps {
  /**
   * Company or website name
   */
  companyName?: string;

  /**
   * Additional className to be applied
   */
  className?: string;
}

export const Footer = React.forwardRef<HTMLDivElement, FooterProps>(
  ({ companyName = 'DeanMachines', className, ...props }, ref) => {
    const currentYear = new Date().getFullYear();

    return (
      <StyledFooter ref={ref} className={className} {...props}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              © {currentYear} {companyName}. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </StyledFooter>
    );
  },
);

Footer.displayName = 'Footer';
