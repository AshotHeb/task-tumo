import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { ThemeState, ThemeGetters, ThemeMode } from "./types";
import { getInitialTheme, applyTheme, THEME_STORAGE_KEY } from "./utils";

export const useThemeStore = defineStore("theme", () => {
  // State
  const mode = ref<ThemeState["mode"]>(getInitialTheme());

  // Getters
  const isDark = computed<ThemeGetters["isDark"]>(() => mode.value === "dark");
  const isLight = computed<ThemeGetters["isLight"]>(
    () => mode.value === "light"
  );

  // Actions
  function setTheme(newMode: ThemeMode): void {
    mode.value = newMode;
    applyTheme(newMode);
    localStorage.setItem(THEME_STORAGE_KEY, newMode);
  }

  function toggleTheme(): void {
    const newMode: ThemeMode = mode.value === "light" ? "dark" : "light";
    setTheme(newMode);
  }

  function initializeTheme(): void {
    const initialTheme = getInitialTheme();
    mode.value = initialTheme;
    applyTheme(initialTheme);
  }

  return {
    // State
    mode,
    // Getters
    isDark,
    isLight,
    // Actions
    setTheme,
    toggleTheme,
    initializeTheme,
  };
});

export type {
  ThemeStore,
  ThemeState,
  ThemeGetters,
  ThemeActions,
  ThemeMode,
} from "./types";
