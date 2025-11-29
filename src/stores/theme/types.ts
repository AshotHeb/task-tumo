/**
 * Theme mode options
 */
export type ThemeMode = "light" | "dark";

/**
 * Theme store state interface
 */
export interface ThemeState {
  mode: ThemeMode;
}

/**
 * Theme store getters interface
 */
export interface ThemeGetters {
  isDark: boolean;
  isLight: boolean;
}

/**
 * Theme store actions interface
 */
export interface ThemeActions {
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  initializeTheme: () => void;
}

/**
 * Complete theme store type
 */
export type ThemeStore = ThemeState & ThemeGetters & ThemeActions;
