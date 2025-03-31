import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  JSX,
} from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { lightTheme, darkTheme } from './index';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultMode?: ThemeMode;
}

/**
 * Custom theme provider that wraps MUI's ThemeProvider and provides theme toggle functionality
 *
 * @param props - Component props
 * @param props.children - Child components
 * @param props.defaultMode - Initial theme mode ('light' or 'dark')
 * @returns A theme provider component
 */
export function ThemeProvider({
  children,
  defaultMode = 'light',
}: ThemeProviderProps): JSX.Element {
  const [mode, setMode] = useState<ThemeMode>(defaultMode);

  // Toggle between light and dark themes
  const toggleTheme = (): void => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  // Memoize the theme to prevent unnecessary re-renders
  const theme = useMemo(() => {
    return mode === 'light' ? lightTheme : darkTheme;
  }, [mode]);

  // Context value
  const themeContextValue = useMemo(
    () => ({
      mode,
      toggleTheme,
    }),
    [mode],
  );

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}

/**
 * Hook to access the theme context
 * @returns The theme context value containing the current mode and toggle function
 * @throws Error if used outside of a ThemeProvider
 */
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}

ThemeProvider.displayName = 'ThemeProvider';
