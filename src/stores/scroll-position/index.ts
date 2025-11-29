import { defineStore } from "pinia";
import { ref } from "vue";
import type { ScrollPositionState } from "./types";

export const useScrollPositionStore = defineStore("scrollPosition", () => {
  // State
  const positions = ref<ScrollPositionState["positions"]>({});

  // Getters
  function getPosition(key: string): number | undefined {
    return positions.value[key];
  }

  // Actions
  function savePosition(key: string, position: number): void {
    positions.value[key] = position;
  }

  function getAndRemovePosition(key: string): number | undefined {
    const position = positions.value[key];
    if (position !== undefined) {
      delete positions.value[key];
    }
    return position;
  }

  function removePosition(key: string): void {
    delete positions.value[key];
  }

  function clearAllPositions(): void {
    positions.value = {};
  }

  return {
    // State
    positions,
    // Getters
    getPosition,
    // Actions
    savePosition,
    getAndRemovePosition,
    removePosition,
    clearAllPositions,
  };
});

export type {
  ScrollPositionStore,
  ScrollPositionState,
  ScrollPositionGetters,
  ScrollPositionActions,
} from "./types";
