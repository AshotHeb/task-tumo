import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { CounterState, CounterGetters } from "./types";

export const useCounterStore = defineStore("counter", () => {
  // State
  const count = ref<CounterState["count"]>(0);
  const step = ref<CounterState["step"]>(1);

  // Getters
  const doubleCount = computed<CounterGetters["doubleCount"]>(
    () => count.value * 2
  );
  const isEven = computed<CounterGetters["isEven"]>(
    () => count.value % 2 === 0
  );

  // Actions
  function increment(): void {
    count.value += step.value;
  }

  function decrement(): void {
    count.value -= step.value;
  }

  function reset(): void {
    count.value = 0;
  }

  function incrementBy(amount: number): void {
    count.value += amount;
  }

  function setStep(newStep: number): void {
    step.value = newStep;
  }

  return {
    // State
    count,
    step,
    // Getters
    doubleCount,
    isEven,
    // Actions
    increment,
    decrement,
    reset,
    incrementBy,
    setStep,
  };
});

export type {
  CounterStore,
  CounterState,
  CounterGetters,
  CounterActions,
} from "./types";
