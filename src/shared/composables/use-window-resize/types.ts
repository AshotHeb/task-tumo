import type { Ref } from "vue";

export interface UseWindowResizeOptions {
  /**
   * Handler function called when window is resized
   */
  handler: (event: UIEvent) => void;
  /**
   * Whether the resize observer is enabled
   */
  enabled?: Ref<boolean> | boolean;
}

