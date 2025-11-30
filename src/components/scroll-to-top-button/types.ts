import type { Ref } from "vue";

/**
 * Scroll behavior options
 */
export type ScrollBehavior = "smooth" | "instant" | "auto";

/**
 * Type that accepts either a value or a ref to that value
 */
export type MaybeRef<T> = T | Ref<T>;

/**
 * ScrollToTopButton component props interface
 */
export interface ScrollToTopButtonProps {
  /**
   * Optional container element ref to scroll instead of window
   */
  containerRef?: MaybeRef<HTMLElement | null | undefined>;
  /**
   * Scroll threshold in pixels before button becomes visible
   * @default 300
   */
  threshold?: number;
  /**
   * Scroll behavior when button is clicked
   * @default "smooth"
   */
  behavior?: ScrollBehavior;
}

