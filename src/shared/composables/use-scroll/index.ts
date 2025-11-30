import { onMounted, onUnmounted, watch, unref } from "vue";
import type { UseScrollOptions } from "./types";

/**
 * Composable for tracking scroll and wheel events on an element
 * Uses requestAnimationFrame to throttle event handling
 * @param options - Configuration options for the scroll observer
 */
export function useScroll(options: UseScrollOptions): void {
  const { elementRef, handler, enabled = true } = options;

  const isEnabled = (): boolean => {
    return typeof enabled === "boolean" ? enabled : enabled.value;
  };

  // Throttle scroll/wheel events using requestAnimationFrame
  let rafId: number | null = null;

  const handleScrollOrWheel = (): void => {
    if (!isEnabled()) {
      return;
    }

    if (rafId !== null) {
      return;
    }

    rafId = requestAnimationFrame(() => {
      handler();
      rafId = null;
    });
  };

  const setupEventListeners = (element: HTMLElement | null): void => {
    if (!element) {
      return;
    }

    element.addEventListener("scroll", handleScrollOrWheel, { passive: true });
    element.addEventListener("wheel", handleScrollOrWheel, { passive: true });
  };

  const removeEventListeners = (element: HTMLElement | null): void => {
    if (!element) {
      return;
    }

    element.removeEventListener("scroll", handleScrollOrWheel);
    element.removeEventListener("wheel", handleScrollOrWheel);
  };

  onMounted(() => {
    // Setup initial event listeners
    const element = unref(elementRef);
    setupEventListeners(element);

    // Watch for elementRef changes
    watch(
      elementRef,
      (newElement, oldElement) => {
        if (oldElement) {
          removeEventListeners(oldElement);
        }
        if (newElement) {
          setupEventListeners(newElement);
        }
      },
      { immediate: false }
    );

    // Watch for enabled state changes
    if (typeof enabled !== "boolean") {
      watch(enabled, () => {
        const element = unref(elementRef);
        if (isEnabled() && element) {
          setupEventListeners(element);
        } else if (!isEnabled() && element) {
          removeEventListeners(element);
        }
      });
    }
  });

  onUnmounted(() => {
    // Clean up event listeners
    const element = unref(elementRef);
    removeEventListeners(element);

    // Cancel pending animation frame
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  });
}

