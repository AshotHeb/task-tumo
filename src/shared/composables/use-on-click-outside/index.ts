import { onMounted, onUnmounted } from "vue";
import type { UseOnClickOutsideOptions } from "./types";

export function useOnClickOutside(options: UseOnClickOutsideOptions): void {
  const { elementRef, handler, enabled = true } = options;

  const isEnabled = (): boolean => {
    return typeof enabled === "boolean" ? enabled : enabled.value;
  };

  const handleClickOutside = (event: MouseEvent | TouchEvent): void => {
    if (!isEnabled()) {
      return;
    }

    const element = elementRef.value;
    if (!element) {
      return;
    }

    const target = event.target as Node | null;
    if (!target) {
      return;
    }

    // Check if click is outside the element
    if (!element.contains(target)) {
      handler(event);
    }
  };

  onMounted(() => {
    // Use capture phase to catch events before they bubble
    document.addEventListener("mousedown", handleClickOutside, true);
    document.addEventListener("touchstart", handleClickOutside, true);
  });

  onUnmounted(() => {
    document.removeEventListener("mousedown", handleClickOutside, true);
    document.removeEventListener("touchstart", handleClickOutside, true);
  });
}
