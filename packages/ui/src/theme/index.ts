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
    customPrimary: {
      main: string;
      light: string;
      dark: string;
      contrastText: string;
    };
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
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
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
            '&:hover': {
              boxShadow: 'none',
            },
          },
        },
      ],
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 10px 0 rgba(0, 0, 0, 0.05)',
        },
      },
    },
  },
};

/**
 * Light theme configuration
 */
export const lightTheme = createTheme({
  ...baseThemeOptions,
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#9c27b0',
      light: '#ba68c8',
      dark: '#7b1fa2',
      contrastText: '#ffffff',
    },
    customPrimary: {
      main: '#3f51b5',
      light: '#757de8',
      dark: '#002984',
      contrastText: '#ffffff',
    },
    customSecondary: {
      main: '#f50057',
      light: '#ff4081',
      dark: '#c51162',
      contrastText: '#ffffff',
    },
    customBackground: {
      default: '#f5f5f5',
      paper: '#ffffff',
      light: '#fafafa',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
    },
  },
});

/**
 * Dark theme configuration
 */
export const darkTheme = createTheme({
  ...baseThemeOptions,
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
      light: '#e3f2fd',
      dark: '#42a5f5',
      contrastText: 'rgba(0, 0, 0, 0.87)',
    },
    secondary: {
      main: '#ce93d8',
      light: '#f3e5f5',
      dark: '#ab47bc',
      contrastText: 'rgba(0, 0, 0, 0.87)',
    },
    customPrimary: {
      main: '#7986cb',
      light: '#9fa8da',
      dark: '#5c6bc0',
      contrastText: 'rgba(0, 0, 0, 0.87)',
    },
    customSecondary: {
      main: '#ff80ab',
      light: '#ffc1e3',
      dark: '#f06292',
      contrastText: 'rgba(0, 0, 0, 0.87)',
    },
    customBackground: {
      default: '#121212',
      paper: '#1e1e1e',
      light: '#2d2d2d',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
});

export default lightTheme;
