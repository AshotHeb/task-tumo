import type { Ref } from "vue";

export interface UseScrollOptions {
  /**
   * Element reference to attach scroll/wheel listeners to
   */
  elementRef: Ref<HTMLElement | null>;
  /**
   * Handler function called when scroll or wheel events occur
   */
  handler: () => void;
  /**
   * Whether the scroll observer is enabled
   */
  enabled?: Ref<boolean> | boolean;
}

