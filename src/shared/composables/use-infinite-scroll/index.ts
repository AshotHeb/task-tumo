import { onMounted, onUnmounted, watch } from "vue";
import type { UseInfiniteScrollOptions } from "./types";

export function useInfiniteScroll(options: UseInfiniteScrollOptions): void {
  const { elementRef, handler, enabled = true, threshold = 0.1 } = options;

  let observer: IntersectionObserver | null = null;

  const isEnabled = (): boolean => {
    return typeof enabled === "boolean" ? enabled : enabled.value;
  };

  const createObserver = (): void => {
    if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") {
      return;
    }

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && isEnabled()) {
            handler();
          }
        });
      },
      {
        threshold,
        rootMargin: "0px",
      }
    );

    const element = elementRef.value;
    if (element) {
      observer.observe(element);
    }
  };

  const destroyObserver = (): void => {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  };

  const updateObserver = (): void => {
    destroyObserver();
    if (isEnabled()) {
      createObserver();
    }
  };

  onMounted(() => {
    // Watch for element changes
    watch(
      elementRef,
      (newElement, oldElement) => {
        if (observer) {
          if (oldElement) {
            observer.unobserve(oldElement);
          }
          if (newElement && isEnabled()) {
            observer.observe(newElement);
          }
        } else if (newElement && isEnabled()) {
          createObserver();
        }
      },
      { immediate: true }
    );

    // Watch for enabled state changes
    if (typeof enabled !== "boolean") {
      watch(enabled, () => {
        updateObserver();
      });
    }
  });

  onUnmounted(() => {
    destroyObserver();
  });
}

