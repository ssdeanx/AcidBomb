'use client';
import { createTheme, ThemeOptions } from '@mui/material/styles';

/**
 * Base theme options shared between light and dark themes
 */
const baseThemeOptions: ThemeOptions = {
  typography: {
    fontFamily: 'var(--font-sans)', // OK to use var here
    h1: { fontSize: '2.5rem', fontWeight: 700, lineHeight: 1.2 },
    h2: { fontSize: '2rem', fontWeight: 600, lineHeight: 1.3 },
    h3: { fontSize: '1.75rem', fontWeight: 600, lineHeight: 1.4 },
    h4: { fontSize: '1.5rem', fontWeight: 600, lineHeight: 1.4 },
    h5: { fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.5 },
    h6: { fontSize: '1rem', fontWeight: 600, lineHeight: 1.5 },
    body1: { fontSize: '1rem', lineHeight: 1.5 },
    body2: { fontSize: '0.875rem', lineHeight: 1.5 },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      fontFamily: 'var(--font-sans)', // OK to use var here
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        code, pre, kbd, samp {
          font-family: var(--font-mono); /* Use CSS variable */
          font-size: 0.9em;
        }
        body {
          font-family: var(--font-sans); // OK to use var here
        }
      `,
    },
    MuiButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 'var(--radius-pill)',
          padding: '10px 20px',
          boxShadow: theme.palette.mode === 'dark' ? 'none' : 'var(--shadow-sm-light)',
        }),
        containedPrimary: ({ theme }) => ({
          '&:hover': {
            backgroundColor: theme.palette.mode === 'dark' ? 'var(--primary-dark-hover)' : 'var(--primary-light-hover)',
            boxShadow: theme.palette.mode === 'dark' ? 'var(--shadow-md-dark)' : 'var(--shadow-md-light)',
          },
        }),
        containedSecondary: ({ theme }) => ({
          '&:hover': {
            backgroundColor: theme.palette.mode === 'dark' ? 'var(--secondary-dark-hover)' : 'var(--secondary-light-hover)',
            boxShadow: theme.palette.mode === 'dark' ? 'var(--shadow-md-dark)' : 'var(--shadow-md-light)',
          },
        }),
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 'var(--radius-lg)',
          boxShadow: theme.palette.mode === 'dark' ? 'var(--shadow-md-dark)' : 'var(--shadow-md-light)',
          border: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
        }),
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 'var(--radius-lg)',
          backgroundColor: theme.palette.background.paper,
        }),
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: ({ theme }) => ({
          '& .MuiOutlinedInput-root': {
            borderRadius: 'var(--radius-md)',
            '& fieldset': {
              borderColor: theme.palette.mode === 'dark'
                ? 'hsla(var(--color-neutral-hue), 15%, 50%, 0.3)'
                : 'hsla(var(--color-neutral-hue), 15%, 50%, 0.3)',
            },
            '&:hover fieldset': {
              borderColor: theme.palette.mode === 'dark'
                ? 'hsla(var(--color-neutral-hue), 15%, 70%, 0.5)'
                : 'hsla(var(--color-neutral-hue), 15%, 70%, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: theme.palette.primary.main,
              borderWidth: '1px',
            },
          },
        }),
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: ({ theme }) => ({
          boxShadow: 'none',
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
        }),
      },
    },
    MuiLink: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.primary.main,
          '&:hover': {
            color: theme.palette.mode === 'dark' ? 'var(--primary-dark-hover)' : 'var(--primary-light-hover)',
          },
        }),
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.text.primary,
          '&.MuiTypography-colorTextSecondary': {
            color: theme.palette.text.secondary,
          },
        }),
      },
    },
  },
};

/**
 * Light theme configuration - Using direct HSL values from globals.css
 */
export const lightTheme = createTheme({
  ...baseThemeOptions,
  palette: {
    mode: 'light',
    primary: {
      main: 'hsl(190, 75%, 48%)',
    },
    secondary: {
      main: 'hsl(35, 90%, 55%)',
    },
    error: {
      main: 'hsl(0, 80%, 55%)',
    },
    background: {
      default: 'hsl(215, 25%, 97%)',
      paper: '#ffffff',
    },
    text: {
      primary: 'hsl(215, 20%, 10%)',
      secondary: 'hsl(215, 15%, 30%)',
    },
    divider: 'hsla(215, 15%, 50%, 0.15)',
  },
  components: {
    ...baseThemeOptions.components,
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'var(--shadow-sm-light)',
        },
      },
    },
  },
});

/**
 * Dark theme configuration - Using direct HSL values from globals.css
 */
export const darkTheme = createTheme({
  ...baseThemeOptions,
  palette: {
    mode: 'dark',
    primary: {
      main: 'hsl(190, 70%, 55%)',
    },
    secondary: {
      main: 'hsl(35, 75%, 60%)',
    },
    error: {
      main: 'hsl(0, 75%, 60%)',
    },
    background: {
      default: 'hsl(215, 15%, 10%)',
      paper: 'hsl(215, 13%, 15%)',
    },
    text: {
      primary: 'hsl(215, 20%, 96%)',
      secondary: 'hsl(215, 15%, 75%)',
    },
    divider: 'hsla(215, 15%, 50%, 0.15)',
  },
  components: {
    ...baseThemeOptions.components,
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
        },
      },
    },
  },
});

export type ThemeType = 'light' | 'dark';
export const theme = {
  light: lightTheme,
  dark: darkTheme,
};

export const themeOptions = {
  light: lightTheme,
  dark: darkTheme,
};

export const themeNames = {
  light: 'lightTheme',
  dark: 'darkTheme',
};

export const themeList = Object.keys(themeNames);

(themeList as any).displayName = 'theme';
