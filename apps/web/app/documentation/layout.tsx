import { PropsWithChildren } from 'react';
import { Box, Container } from '@mui/material';
import { DocumentationSidebarNav } from './DocumentationSidebarNav';

/**
 * Documentation section layout that provides a consistent structure for all documentation pages
 * Uses semantic HTML with article element for the main content area
 */
export default function DocumentationLayout({ children }: PropsWithChildren) {
  return (
    <Container
      maxWidth="xl"
      sx={{
        display: 'flex',
        py: { xs: 3, md: 5 },
        gap: { xs: 0, md: 5 }
      }}
    >
      <DocumentationSidebarNav />
      <Box
        component="article"
        sx={{
          flexGrow: 1,
          minWidth: 0
        }}
      >
        {children}
      </Box>
    </Container>
  );
}
