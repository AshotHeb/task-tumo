import { onMounted, ref, watch, computed } from "vue";
import { useWindowResize } from "../use-window-resize";
import { useScroll } from "../use-scroll";
import {
  UseVirtualizedRenderingProps,
  UseVirtualizedRenderingState,
} from "./types";

export function useVirtualizedRendering(
  props: UseVirtualizedRenderingProps
): UseVirtualizedRenderingState {
  const { containerElement, rowHeight, rowGap } = props;

  const visibleRange = ref<{ start: number; end: number }>({
    start: 0,
    end: 0,
  });

  const windowHeight = ref(window.innerHeight);
  useWindowResize({
    handler: () => {
      windowHeight.value = window.innerHeight;
    },
  });

  // Get rowHeight value reactively
  const rowHeightValue = computed(() => {
    return typeof rowHeight === "number" ? rowHeight : rowHeight.value;
  });

  const rowGapValue = computed(() => {
    return typeof rowGap === "number" ? rowGap : rowGap.value;
  });

  const calculateVisibleRange = () => {
    const currentRowHeight = rowHeightValue.value + rowGapValue.value;
    if (currentRowHeight === 0) {
      return;
    }

    const containerScrollTop = containerElement.value?.scrollTop || 0;
    const T = Math.floor(containerScrollTop + windowHeight.value / 2);
    const RangePoint = Math.floor(T / currentRowHeight);
    const start = RangePoint - 3;
    const end = RangePoint + 3;
    visibleRange.value = { start, end };
  };

  // Watch for rowHeight changes and recalculate
  if (typeof rowHeight !== "number") {
    watch(rowHeightValue, () => {
      calculateVisibleRange();
    });
  }

  // Use scroll composable to track scroll/wheel events
  useScroll({
    elementRef: containerElement,
    handler: () => {
      calculateVisibleRange();
    },
  });

  onMounted(() => {
    calculateVisibleRange();
  });

  return { visibleRange };
}
