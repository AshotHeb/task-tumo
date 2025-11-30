import { defineStore } from "pinia";
import { ref } from "vue";
import type { MoviesGridVirtualizationState } from "./types";

export const useMoviesGridVirtualizationStore = defineStore(
  "moviesGridVirtualization",
  () => {
    // State
    const gridRowHeight =
      ref<MoviesGridVirtualizationState["gridRowHeight"]>(0);
    const columnsCount = ref<MoviesGridVirtualizationState["columnsCount"]>(0);
    const gridVerticalGap =
      ref<MoviesGridVirtualizationState["gridVerticalGap"]>(0);
    const gridHorizontalGap =
      ref<MoviesGridVirtualizationState["gridHorizontalGap"]>(0);
    const columnWidth = ref<MoviesGridVirtualizationState["columnWidth"]>(0);
    const isCalculationLoading =
      ref<MoviesGridVirtualizationState["isCalculationLoading"]>(true);
    const moviesRowsCount =
      ref<MoviesGridVirtualizationState["moviesRowsCount"]>(0);

    // Actions
    function setGridRowHeight(height: number): void {
      gridRowHeight.value = height;
    }

    function setColumnsCount(count: number): void {
      columnsCount.value = count;
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
      columnsCount,
      gridVerticalGap,
      gridHorizontalGap,
      columnWidth,
      isCalculationLoading,
      moviesRowsCount,
      // Actions
      setGridRowHeight,
      setColumnsCount,
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
