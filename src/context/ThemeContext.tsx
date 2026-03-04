import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import DefaultTheme, {DarkTheme, LightTheme} from '../constants/Colors.ts';
import {storage} from '../utility/mmkvInstance.ts';

// Define the type for your theme
type Theme = typeof DefaultTheme | typeof DarkTheme | typeof LightTheme;

// Define the type for display mode
type DisplayMode = 'dark' | 'default' | 'light';

// Create a theme context with initial default theme
const ThemeContext = createContext<Theme>(DefaultTheme);

// Custom hook to use the theme context
export const useTheme = (): Theme => {
  const theme = useContext(ThemeContext);
  if (!theme) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return theme;
};

// Define props type for ThemeProvider
type ThemeProviderProps = {
  children: ReactNode;
};

// Theme provider component
export const ThemeProvider: React.FC<ThemeProviderProps> = ({children}) => {
  // Initialize displayMode from MMKV storage
  const [displayMode, setDisplayMode] = useState<DisplayMode>(
    (storage?.getString('displayMode') as DisplayMode) || 'default',
  );

  // Define initial state using DefaultTheme
  const [theme, setTheme] = useState<Theme>(DefaultTheme);

  // Function to update theme based on display mode
  const updateTheme = (mode: DisplayMode): Theme => {
    switch (mode) {
      case 'dark':
        return DarkTheme;
      case 'light':
        return LightTheme;
      default:
        return DefaultTheme;
    }
  };

  // Listen for changes to displayMode in MMKV
  useEffect(() => {
    // Add MMKV listener for displayMode changes
    const listener = storage?.addOnValueChangedListener(changedKey => {
      if (changedKey === 'displayMode') {
        const newMode = storage?.getString('displayMode') as DisplayMode;
        setDisplayMode(newMode || 'default'); // Update state when displayMode changes
      }
    });

    // Update theme when displayMode changes
    setTheme(updateTheme(displayMode));

    // Cleanup listener on unmount
    return () => {
      listener?.remove();
    };
  }, [displayMode]); // Depend on displayMode state

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};
