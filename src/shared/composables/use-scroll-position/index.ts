import {
  onMounted,
  onBeforeUnmount,
  computed,
  unref,
  watch,
  nextTick,
} from "vue";
import { useScrollPositionStore } from "@/stores/scroll-position";
import type {
  UseScrollPositionOptions,
  UseScrollPositionReturn,
} from "./types";

export function useScrollPosition(
  options: UseScrollPositionOptions
): UseScrollPositionReturn {
  const {
    key,
    elementRef,
    saveOnUnmount = true,
    restoreOnMount = true,
    waitForCondition,
  } = options;

  const scrollPositionStore = useScrollPositionStore();
  const keyValue = computed(() => unref(key));

  const getScrollElement = (): HTMLElement | Window => {
    if (elementRef?.value) {
      return elementRef.value;
    }
    return window;
  };

  const getCurrentPosition = (): number => {
    const element = getScrollElement();
    if (element === window) {
      return window.scrollY || window.pageYOffset || 0;
    }
    return (element as HTMLElement).scrollTop || 0;
  };

  const savePosition = (): void => {
    const position = getCurrentPosition();
    scrollPositionStore.savePosition(keyValue.value, position);
  };

  const restorePosition = (): void => {
    const savedPosition = scrollPositionStore.getAndRemovePosition(
      keyValue.value
    );
    if (savedPosition !== undefined) {
      const element = getScrollElement();
      if (element === window) {
        window.scrollTo({
          top: savedPosition,
          behavior: "instant",
        });
      } else {
        requestAnimationFrame(() => {
          (element as HTMLElement).scrollTo({
            top: savedPosition,
            behavior: "instant",
          });
        });
      }
    }
  };

  onMounted(() => {
    if (restoreOnMount) {
      if (waitForCondition) {
        // Wait for condition to become falsy (e.g., calculation complete)
        const stopWatcher = watch(
          waitForCondition,
          (isWaiting) => {
            if (!isWaiting) {
              // Wait for next tick to ensure DOM is updated
              nextTick(() => {
                restorePosition();
                stopWatcher();
              });
            }
          },
          { immediate: true }
        );
      } else {
        restorePosition();
      }
    }
  });

  onBeforeUnmount(() => {
    if (saveOnUnmount) {
      savePosition();
    }
  });

  return {
    savePosition,
    restorePosition,
    getCurrentPosition,
  };
}
