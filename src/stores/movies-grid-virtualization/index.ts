import { defineStore } from "pinia";
import { ref } from "vue";
import type { MoviesGridVirtualizationState } from "./types";

export const useMoviesGridVirtualizationStore = defineStore(
  "moviesGridVirtualization",
  () => {
    // State
    const gridRowHeight =
      ref<MoviesGridVirtualizationState["gridRowHeight"]>(0);
    const rowGridItemsCount =
      ref<MoviesGridVirtualizationState["rowGridItemsCount"]>(0);
    const gridVerticalGap =
      ref<MoviesGridVirtualizationState["gridVerticalGap"]>(0);
    const gridHorizontalGap =
      ref<MoviesGridVirtualizationState["gridHorizontalGap"]>(0);
    const columnWidth = ref<MoviesGridVirtualizationState["columnWidth"]>(0);
    const isCalculationLoading =
      ref<MoviesGridVirtualizationState["isCalculationLoading"]>(true);

    // Actions
    function setGridRowHeight(height: number): void {
      gridRowHeight.value = height;
    }

    function setRowGridItemsCount(count: number): void {
      rowGridItemsCount.value = count;
    }

    function setGridVerticalGap(gap: number): void {
      gridVerticalGap.value = gap;
    }

    function setGridHorizontalGap(gap: number): void {
      gridHorizontalGap.value = gap;
    }

    function setColumnWidth(width: number): void {
      columnWidth.value = width;
    }

    function setIsCalculationLoading(loading: boolean): void {
      isCalculationLoading.value = loading;
    }

    return {
      // State
      gridRowHeight,
      rowGridItemsCount,
      gridVerticalGap,
      gridHorizontalGap,
      columnWidth,
      isCalculationLoading,
      // Actions
      setGridRowHeight,
      setRowGridItemsCount,
      setGridVerticalGap,
      setGridHorizontalGap,
      setColumnWidth,
      setIsCalculationLoading,
    };
  }
);

export type {
  MoviesGridVirtualizationStore,
  MoviesGridVirtualizationState,
  MoviesGridVirtualizationGetters,
  MoviesGridVirtualizationActions,
} from "./types";
