/**
 * Counter store state interface
 */
export interface CounterState {
  count: number;
  step: number;
}

/**
 * Counter store getters interface
 */
export interface CounterGetters {
  doubleCount: number;
  isEven: boolean;
}

/**
 * Counter store actions interface
 */
export interface CounterActions {
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  incrementBy: (amount: number) => void;
  setStep: (step: number) => void;
}

/**
 * Complete counter store type
 */
export type CounterStore = CounterState & CounterGetters & CounterActions;
