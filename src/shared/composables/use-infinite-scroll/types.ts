import type { Ref } from "vue";

/**
 * Infinite scroll composable options
 */
export interface UseInfiniteScrollOptions {
  /**
   * Reference to the element to observe
   */
  elementRef: Ref<HTMLElement | null | undefined>;
  /**
   * Handler function to call when element enters viewport
   */
  handler: () => void;
  /**
   * Whether infinite scroll is enabled
   * @default true
   */
  enabled?: Ref<boolean> | boolean;
  /**
   * Intersection Observer threshold (0-1)
   * @default 0.1
   */
  threshold?: number;
}

