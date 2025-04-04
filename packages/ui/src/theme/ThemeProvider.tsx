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

// Keep ThemeMode from appbar.tsx or define locally if preferred
import type { ThemeMode } from '../appbar'; // Assuming ThemeMode is exported from appbar

type AppliedThemeMode = 'light' | 'dark';

interface ThemeContextType {
  /** The currently selected theme mode ('light', 'dark', or 'system') */
  mode: ThemeMode;
  /** Function to set the desired theme mode */
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  /** Optional user ID for Supabase persistence */
  userId?: string;
  /** Optional function to fetch user theme preference */
  getUserTheme?: (userId: string) => Promise<ThemeMode>;
  /** Optional function to save user theme preference */
  setUserTheme?: (userId: string, theme: ThemeMode) => Promise<boolean>;
  /** Default mode if nothing else is found */
  defaultMode?: ThemeMode;
}

/**
 * Gets the system's preferred color scheme.
 * @returns 'dark' or 'light'
 */
function getSystemPreference(): AppliedThemeMode {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light'; // Default if window/matchMedia is not available (SSR)
}

/**
 * Custom ThemeProvider component that wraps MUI's ThemeProvider.
 * It provides theme selection ('light', 'dark', 'system'),
 * handles system preference, and optionally persists the selected mode via Supabase.
 */
export function ThemeProvider({
  children,
  userId,
  getUserTheme,
  setUserTheme,
  defaultMode = 'dark', // Default to dark mode
}: ThemeProviderProps): JSX.Element {
  const [mode, setModeState] = useState<ThemeMode>(defaultMode);
  const [appliedMode, setAppliedMode] = useState<AppliedThemeMode>(() =>
    defaultMode === 'system' ? getSystemPreference() : defaultMode === 'light' ? 'light' : 'dark'
  );
  const [isInitialized, setIsInitialized] = useState(false);

  // Effect to fetch initial theme from Supabase if available
  useEffect(() => {
    if (userId && getUserTheme && !isInitialized) {
      let isMounted = true;
      getUserTheme(userId)
        .then((fetchedMode) => {
          if (isMounted) {
            setModeState(fetchedMode);
            setIsInitialized(true);
            console.log(`Fetched theme for user ${userId}: ${fetchedMode}`);
          }
        })
        .catch((error) => {
          console.error('Error fetching initial theme:', error);
          // Fallback to default if fetch fails
          if (isMounted) {
            setModeState(defaultMode);
            setIsInitialized(true);
          }
        });
      return () => { isMounted = false; };
    } else {
      // If no Supabase integration, consider initialization done
      setIsInitialized(true);
    }
  }, [userId, getUserTheme, defaultMode, isInitialized]);

  // Effect to update the applied theme based on mode and system preference
  useEffect(() => {
    if (!isInitialized) return; // Don't run until initial mode is set

    const calculateAppliedMode = (): AppliedThemeMode => {
      return mode === 'system' ? getSystemPreference() : mode;
    };

    setAppliedMode(calculateAppliedMode());

    // Listener for system preference changes only if mode is 'system'
    if (mode === 'system' && typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        setAppliedMode(getSystemPreference());
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [mode, isInitialized]);

  // Callback to set the theme mode and persist it
  const setMode = useCallback((newMode: ThemeMode): void => {
    setModeState(newMode);
    if (userId && setUserTheme) {
      setUserTheme(userId, newMode)
        .then(success => {
          if (!success) console.error('Failed to save theme preference.');
          else console.log(`Saved theme preference for user ${userId}: ${newMode}`);
        })
        .catch(error => console.error('Error saving theme preference:', error));
    } else {
      // Optional: Fallback to localStorage if Supabase is not configured
      // try { localStorage.setItem('themeMode', newMode); } catch (e) {}
      console.warn('ThemeProvider: setUserTheme function not provided. Theme not persisted.');
    }
  }, [userId, setUserTheme]);

  // Memoize the MUI theme based on the *applied* mode.
  const muiTheme = useMemo(() => (appliedMode === 'light' ? lightTheme : darkTheme), [appliedMode]);

  // Memoize the context value.
  const contextValue = useMemo(() => ({ mode, setMode }), [mode, setMode]);

  // Apply theme class to root element for potential non-MUI styling
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      const currentApplied = appliedMode;

      root.classList.remove('light-theme', 'dark-theme');
      root.classList.add(currentApplied === 'light' ? 'light-theme' : 'dark-theme');
      root.style.colorScheme = currentApplied;

      // Also set a data attribute for easier CSS targeting if needed
      root.setAttribute('data-theme', currentApplied);
    }
  }, [appliedMode]);

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline enableColorScheme /> {/* Ensure CssBaseline respects color-scheme */}
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}

/**
 * Custom hook that returns the merged MUI theme along with custom properties:
 * `mode` ('light', 'dark', 'system') and `setMode` function.
 *
 * @throws Error if used outside of a ThemeProvider.
 */
export function useTheme(): Theme & ThemeContextType {
  const muiTheme = useMuiTheme();
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  // Ensure muiTheme is included, even if context is defined
  return { ...muiTheme, ...context };
}

ThemeProvider.displayName = 'ThemeProvider';
