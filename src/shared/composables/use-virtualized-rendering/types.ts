import { Ref, ComputedRef } from "vue";

export interface UseVirtualizedRenderingState {
  visibleRange: Ref<{
    start: number;
    end: number;
  }>;
}

export interface UseVirtualizedRenderingProps {
  containerElement: Ref<HTMLElement | null>;
  rowHeight: Ref<number> | ComputedRef<number> | number;
}
