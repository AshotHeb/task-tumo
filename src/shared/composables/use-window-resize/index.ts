import { onMounted, onUnmounted } from "vue";
import type { UseWindowResizeOptions } from "./types";

/**
 * Composable for observing window resize events
 * @param options - Configuration options for the resize observer
 */
export function useWindowResize(options: UseWindowResizeOptions): void {
  const { handler, enabled = true } = options;

  const isEnabled = (): boolean => {
    return typeof enabled === "boolean" ? enabled : enabled.value;
  };

  const handleResize = (event: UIEvent): void => {
    if (!isEnabled()) {
      return;
    }

    handler(event);
  };

  onMounted(() => {
    window.addEventListener("resize", handleResize);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", handleResize);
  });
}

