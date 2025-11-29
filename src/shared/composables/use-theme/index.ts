import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useThemeStore } from "@/stores/theme";
import type { UseThemeReturn } from "./types";
import type { ThemeMode } from "@/stores/theme/types";

export function useTheme(): UseThemeReturn {
  const store = useThemeStore();
  const { mode, isDark, isLight } = storeToRefs(store);
  const { setTheme, toggleTheme } = store;

  return {
    mode: computed(() => mode.value),
    isDark: computed(() => isDark.value),
    isLight: computed(() => isLight.value),
    setTheme: (newMode: ThemeMode) => {
      setTheme(newMode);
    },
    toggleTheme: () => {
      toggleTheme();
    },
  };
}

