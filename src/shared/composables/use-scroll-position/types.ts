import type { Ref } from "vue";

/**
 * Options for useScrollPosition composable
 */
export interface UseScrollPositionOptions {
  /**
   * Key to identify the scroll position (e.g., route path)
   */
  key: string | Ref<string>;
  /**
   * Element reference to save/restore scroll position for
   * If not provided, uses window
   */
  elementRef?: Ref<HTMLElement | null | undefined>;
  /**
   * Whether to save scroll position on unmount
   * @default true
   */
  saveOnUnmount?: boolean;
  /**
   * Whether to restore scroll position on mount
   * @default true
   */
  restoreOnMount?: boolean;
}

/**
 * Return type for useScrollPosition composable
 */
export interface UseScrollPositionReturn {
  /**
   * Save current scroll position
   */
  savePosition: () => void;
  /**
   * Restore scroll position if exists
   */
  restorePosition: () => void;
  /**
   * Get current scroll position
   */
  getCurrentPosition: () => number;
}
