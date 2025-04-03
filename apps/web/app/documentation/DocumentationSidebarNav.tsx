'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
  alpha,
} from '@mui/material';

/**
 * Navigation items for the documentation sidebar
 */
const navItems = [
  { title: 'Overview', href: '/documentation' },
  { title: 'Getting Started', href: '/documentation/getting-started' },
  { title: 'Core Concepts', href: '/documentation/core-concepts' },
  { title: 'Architecture', href: '/documentation/architecture' },
  { title: 'API Reference', href: '/documentation/api-reference' },
  { title: 'Guides', href: '/documentation/guides' },
  { title: 'Examples', href: '/documentation/examples' },
];

/**
 * Sidebar navigation for the documentation section
 * Implements responsive behavior and accessibility features
 */
export function DocumentationSidebarNav() {
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // On mobile, we hide the sidebar completely
  if (isMobile) {
    return null;
  }

  return (
    <Box
      component="aside"
      sx={{
        width: 240,
        flexShrink: 0
      }}
    >
      <Paper
        variant="outlined"
        sx={{
          position: 'sticky',
          top: 80,
          height: 'calc(100vh - 100px)',
          overflowY: 'auto',
          p: 1.5,
          bgcolor: 'background.default',
          border: 0,
          borderRight: 1,
          borderColor: 'divider'
        }}
      >
        <Typography
          variant="overline"
          sx={{
            px: 1.5,
            py: 1,
            display: 'block',
            color: 'text.secondary',
            fontWeight: 'medium'
          }}
        >
          Documentation
        </Typography>
        <List dense component="nav" aria-label="Documentation Sections">
          {navItems.map((item) => (
            <ListItemButton
              key={item.href}
              component={Link}
              href={item.href}
              selected={pathname === item.href}
              aria-current={pathname === item.href ? 'page' : undefined}
              sx={{
                '&.Mui-selected': {
                  bgcolor: alpha(theme.palette.primary.main, 0.15),
                  color: 'primary.light',
                  '& .MuiListItemText-primary': {
                    fontWeight: 500
                  },
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.25)
                  }
                },
                '&:hover': {
                  bgcolor: alpha(theme.palette.action.hover, 0.08)
                },
                borderRadius: 1,
                mb: 0.5
              }}
            >
              <ListItemText primary={item.title} />
            </ListItemButton>
          ))}
        </List>
      </Paper>
    </Box>
  );
}
