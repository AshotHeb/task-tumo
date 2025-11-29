import type { ComputedRef } from "vue";
import type { ThemeMode } from "@/stores/theme/types";

export interface UseThemeReturn {
  mode: ComputedRef<ThemeMode>;
  isDark: ComputedRef<boolean>;
  isLight: ComputedRef<boolean>;
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

