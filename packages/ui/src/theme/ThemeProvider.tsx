'use client';

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useCallback,
  useEffect,
  JSX,
} from 'react';
import {
  ThemeProvider as MuiThemeProvider,
  useTheme as useMuiTheme,
  Theme,
} from '@mui/material/styles';
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
 * Retrieves the initial theme mode from localStorage if available,
 * otherwise returns the provided default.
 */
function getInitialMode(defaultMode: ThemeMode): ThemeMode {
  try {
    if (typeof window !== 'undefined') {
      const storedMode = localStorage.getItem('themeMode');
      return (storedMode as ThemeMode) || defaultMode;
    }
  } catch (error) {
    console.error('Error reading themeMode from localStorage:', error);
  }
  return defaultMode;
}

/**
 * Custom ThemeProvider component that wraps MUI's ThemeProvider.
 * It provides theme toggle functionality and persists the selected mode.
 */
export function ThemeProvider({
  children,
  defaultMode = 'light',
}: ThemeProviderProps): JSX.Element {
  const [mode, setMode] = useState<ThemeMode>(() => getInitialMode(defaultMode));

  // Memoize the toggle function to prevent unnecessary re-renders.
  const toggleTheme = useCallback((): void => {
    setMode((prevMode) => {
      const newMode: ThemeMode = prevMode === 'light' ? 'dark' : 'light';
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('themeMode', newMode);
        }
      } catch (error) {
        console.error('Error saving themeMode to localStorage:', error);
      }
      return newMode;
    });
  }, []);

  // Optionally, you could add a system preference listener here.
  // For example:
  // useEffect(() => {
  //   const media = window.matchMedia('(prefers-color-scheme: dark)');
  //   const handleChange = () => {
  //     if (!storedTheme) setMode(media.matches ? 'dark' : 'light');
  //   };
  //   media.addEventListener('change', handleChange);
  //   return () => media.removeEventListener('change', handleChange);
  // }, []);

  // Memoize the MUI theme based on the current mode.
  const muiTheme = useMemo(() => (mode === 'light' ? lightTheme : darkTheme), [mode]);

  // Memoize the context value.
  const contextValue = useMemo(() => ({ mode, toggleTheme }), [mode, toggleTheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}

/**
 * Custom hook that returns the merged MUI theme along with custom properties:
 * `mode` and `toggleTheme`.
 *
 * @throws Error if used outside of a ThemeProvider.
 */
export function useTheme(): Theme & { mode: ThemeMode; toggleTheme: () => void } {
  const muiTheme = useMuiTheme();
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return { ...muiTheme, mode: context.mode, toggleTheme: context.toggleTheme };
}

ThemeProvider.displayName = 'ThemeProvider';
