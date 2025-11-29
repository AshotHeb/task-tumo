import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { GlobalState, GlobalGetters, ActiveToast } from "./types";

export const useGlobalStore = defineStore("global", () => {
  // State
  const activeToast = ref<GlobalState["activeToast"]>(null);

  // Getters
  const hasActiveToast = computed<GlobalGetters["hasActiveToast"]>(
    () => activeToast.value !== null
  );

  // Actions
  function setActiveToast(toast: ActiveToast | null): void {
    activeToast.value = toast;
  }

  function clearActiveToast(): void {
    activeToast.value = null;
  }

  return {
    // State
    activeToast,
    // Getters
    hasActiveToast,
    // Actions
    setActiveToast,
    clearActiveToast,
  };
});

export type {
  GlobalStore,
  GlobalState,
  GlobalGetters,
  GlobalActions,
  ActiveToast,
} from "./types";

