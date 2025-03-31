'use client';

import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Footer } from './footer';

export default function RowAndColumnSpacing() {
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid size={6}>
          <Item>1</Item>
        </Grid>
        <Grid size={6}>
          <Item>2</Item>
        </Grid>
        <Grid size={6}>
          <Item>3</Item>
        </Grid>
        <Grid size={6}>
          <Item>4</Item>
        </Grid>
      </Grid>
    </Box>
  );
}

Footer.displayName = 'Footer';
