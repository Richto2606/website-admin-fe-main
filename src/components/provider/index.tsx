'use client';

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

type Theme = 'light' | 'dark' | 'system';

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
  systemTheme: 'light' | 'dark';
};

export type AppProviderProps = {
  children: ReactNode;
  attribute?: 'class';
  defaultTheme?: Theme;
  enableSystem?: boolean;
  storageKey?: string;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: 'light' | 'dark', attribute: AppProviderProps['attribute']) {
  const root = document.documentElement;

  if (attribute === 'class') {
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    root.style.colorScheme = theme;
  }
}

function ThemeProvider({
  children,
  attribute = 'class',
  defaultTheme = 'light',
  enableSystem = true,
  storageKey = 'theme',
}: AppProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const storedTheme = localStorage.getItem(storageKey) as Theme | null;

    if (storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'system') {
      setThemeState(storedTheme);
    }

    setSystemTheme(getSystemTheme());
  }, [storageKey]);

  useEffect(() => {
    if (!enableSystem) {
      return;
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const updateSystemTheme = () => setSystemTheme(getSystemTheme());

    updateSystemTheme();
    media.addEventListener('change', updateSystemTheme);

    return () => media.removeEventListener('change', updateSystemTheme);
  }, [enableSystem]);

  const resolvedTheme = theme === 'system' ? systemTheme : theme;

  useEffect(() => {
    applyTheme(resolvedTheme, attribute);
  }, [attribute, resolvedTheme]);

  const setTheme = useCallback((nextTheme: Theme) => {
    setThemeState(nextTheme);
    localStorage.setItem(storageKey, nextTheme);
  }, [storageKey]);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      resolvedTheme,
      systemTheme,
    }),
    [resolvedTheme, setTheme, systemTheme, theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within Provider');
  }

  return context;
}

export default function Provider(props: AppProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider {...props} />
    </QueryClientProvider>
  );
}
