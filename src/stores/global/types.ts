import type { ToastVariant } from "@/shared/components/molecules/toast";

/**
 * Active toast data
 */
export interface ActiveToast {
  /**
   * Toast title
   */
  title: string;
  /**
   * Toast description
   */
  description?: string;
  /**
   * Toast variant
   */
  variant: ToastVariant;
}

/**
 * Global store state interface
 */
export interface GlobalState {
  /**
   * Active toast to display
   */
  activeToast: ActiveToast | null;
}

/**
 * Global store getters interface
 */
export interface GlobalGetters {
  /**
   * Check if there is an active toast
   */
  hasActiveToast: boolean;
}

/**
 * Global store actions interface
 */
export interface GlobalActions {
  /**
   * Set active toast
   */
  setActiveToast: (toast: ActiveToast | null) => void;
  /**
   * Clear active toast
   */
  clearActiveToast: () => void;
}

/**
 * Complete global store type
 */
export type GlobalStore = GlobalState & GlobalGetters & GlobalActions;

