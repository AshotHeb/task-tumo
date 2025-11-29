import type { ThemeMode } from "./types";

export const THEME_STORAGE_KEY = "theme-preference";

/**
 * Get system theme preference
 */
export function getSystemTheme(): ThemeMode {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/**
 * Get stored theme preference from localStorage
 */
export function getStoredTheme(): ThemeMode | null {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "light" || stored === "dark") {
    return stored;
  }

  return null;
}

/**
 * Apply theme to document
 */
export function applyTheme(mode: ThemeMode): void {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.setAttribute("data-theme", mode);
}

/**
 * Get initial theme (stored preference or system preference)
 */
export function getInitialTheme(): ThemeMode {
  const stored = getStoredTheme();
  if (stored) {
    return stored;
  }

  return getSystemTheme();
}
