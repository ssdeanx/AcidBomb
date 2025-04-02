'use client';
import {
  createTheme,
  PaletteColorOptions,
  ThemeOptions,
} from '@mui/material/styles';

/**
 * Extended palette with custom color definitions for the application
 */
declare module '@mui/material/styles' {
  interface Palette {
    customPrimary: PaletteColorOptions;
    customSecondary: {
      main: string;
      light: string;
      dark: string;
      contrastText: string;
    };
    customBackground: {
      default: string;
      paper: string;
      light: string;
    };
  }

  interface Theme {
    displayName?: string;
  }

  interface PaletteOptions {
    customPrimary?: {
      main: string;
      light: string;
      dark: string;
      contrastText: string;
    };
    customSecondary?: {
      main: string;
      light: string;
      dark: string;
      contrastText: string;
    };
    customBackground?: {
      default: string;
      paper: string;
      light: string;
    };
  }
}

/**
 * Base theme options shared between light and dark themes
 */
const baseThemeOptions: ThemeOptions = {
  typography: {
    fontFamily: 'Inter, Roboto, "Helvetica Neue", Arial, sans-serif',
    h1: { fontSize: '2.5rem', fontWeight: 700, lineHeight: 1.2 },
    h2: { fontSize: '2rem', fontWeight: 600, lineHeight: 1.3 },
    h3: { fontSize: '1.75rem', fontWeight: 600, lineHeight: 1.4 },
    h4: { fontSize: '1.5rem', fontWeight: 600, lineHeight: 1.4 },
    h5: { fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.5 },
    h6: { fontSize: '1rem', fontWeight: 600, lineHeight: 1.5 },
    body1: { fontSize: '1rem', lineHeight: 1.5 },
    body2: { fontSize: '0.875rem', lineHeight: 1.5 },
    button: { textTransform: 'none', fontWeight: 500 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
        },
      },
      variants: [
        {
          props: { variant: 'contained' },
          style: {
            boxShadow: 'none',
            '&:hover': { boxShadow: 'none' },
          },
        },
      ],
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: { root: { borderRadius: 12 } },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': { borderRadius: 8 },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 10px 0 rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
};

/**
 * Light theme configuration – modern, professional, and edgy.
 */
export const lightTheme = createTheme({
  ...baseThemeOptions,
  palette: {
    mode: 'light',
    primary: {
      main: '#14213D', // Deep, professional navy-blue
      light: '#3A506B', // Muted blue for lighter accents
      dark: '#0F1B33', // Dark navy-blue
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#FCA311', // Bold burnt orange accent
      light: '#FDAE55',
      dark: '#D97900',
      contrastText: '#ffffff',
    },
    customPrimary: {
      main: '#1F2937', // Dark slate for an edgy look
      light: '#4B5563',
      dark: '#111827',
      contrastText: '#ffffff',
    },
    customSecondary: {
      main: '#E63946', // Striking assertive red
      light: '#F1707A',
      dark: '#B22233',
      contrastText: '#ffffff',
    },
    customBackground: {
      default: '#F0F2F5', // Clean light neutral gray
      paper: '#ffffff',
      light: '#F7F9FC',
    },
    background: {
      default: '#F0F2F5',
      paper: '#ffffff',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
    },
  },
});

/**
 * Dark theme configuration – refined, modern, and assertive.
 */
export const darkTheme = createTheme({
  ...baseThemeOptions,
  palette: {
    mode: 'dark',
    primary: {
      main: '#1F2937', // Deep charcoal-blue
      light: '#4B5563',
      dark: '#111827',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#FB923C', // Bold, vivid burnt orange
      light: '#FFB74D',
      dark: '#BF360C',
      contrastText: 'rgba(0, 0, 0, 0.87)',
    },
    customPrimary: {
      main: '#2D3748', // Dark, masculine slate
      light: '#4A5568',
      dark: '#1A202C',
      contrastText: 'rgba(255, 255, 255, 0.87)',
    },
    customSecondary: {
      main: '#E11D48', // Intense, assertive red
      light: '#F56565',
      dark: '#9B1C1C',
      contrastText: 'rgba(0, 0, 0, 0.87)',
    },
    customBackground: {
      default: '#0D0D0D', // Near-black for a modern dark feel
      paper: '#1A1A1A',
      light: '#2E2E2E',
    },
    background: {
      default: '#0D0D0D',
      paper: '#1A1A1A',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
});

export type ThemeType = 'light' | 'dark';
export const theme = {
  light: lightTheme,
  dark: darkTheme,
};

lightTheme.displayName = 'lightTheme';
darkTheme.displayName = 'darkTheme';
theme.light.displayName = 'lightTheme';
theme.dark.displayName = 'darkTheme';

export const themeOptions = {
  light: lightTheme,
  dark: darkTheme,
};

export const themeNames = {
  light: 'lightTheme',
  dark: 'darkTheme',
};

export const themeList = Object.keys(themeNames);
