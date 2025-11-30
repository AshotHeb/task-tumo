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
    const moviesRowsCount =
      ref<MoviesGridVirtualizationState["moviesRowsCount"]>(0);
    console.log("🚀 ~ moviesRowsCount:", moviesRowsCount);

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

    function setMoviesRowsCount(count: number): void {
      moviesRowsCount.value = count;
    }

    return {
      // State
      gridRowHeight,
      rowGridItemsCount,
      gridVerticalGap,
      gridHorizontalGap,
      columnWidth,
      isCalculationLoading,
      moviesRowsCount,
      // Actions
      setGridRowHeight,
      setRowGridItemsCount,
      setGridVerticalGap,
      setGridHorizontalGap,
      setColumnWidth,
      setIsCalculationLoading,
      setMoviesRowsCount,
    };
  }
);

export type {
  MoviesGridVirtualizationStore,
  MoviesGridVirtualizationState,
  MoviesGridVirtualizationGetters,
  MoviesGridVirtualizationActions,
} from "./types";
