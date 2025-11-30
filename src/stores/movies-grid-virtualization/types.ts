/**
 * Movies grid virtualization store state interface
 */
export interface MoviesGridVirtualizationState {
  /**
   * Grid row height in pixels
   */
  gridRowHeight: number;
  /**
   * Number of items per row in the grid
   */
  rowGridItemsCount: number;
  /**
   * Vertical gap between grid rows in pixels
   */
  gridVerticalGap: number;
  /**
   * Horizontal gap between grid columns in pixels
   */
  gridHorizontalGap: number;
  /**
   * Column width in pixels
   */
  columnWidth: number;
  /**
   * Loading state for grid calculations
   */
  isCalculationLoading: boolean;
}

/**
 * Movies grid virtualization store getters interface
 */
export interface MoviesGridVirtualizationGetters {
  // Add getters here if needed in the future
}

/**
 * Movies grid virtualization store actions interface
 */
export interface MoviesGridVirtualizationActions {
  /**
   * Set grid row height in pixels
   */
  setGridRowHeight: (height: number) => void;
  /**
   * Set number of items per row in the grid
   */
  setRowGridItemsCount: (count: number) => void;
  /**
   * Set vertical gap between grid rows in pixels
   */
  setGridVerticalGap: (gap: number) => void;
  /**
   * Set horizontal gap between grid columns in pixels
   */
  setGridHorizontalGap: (gap: number) => void;
  /**
   * Set column width in pixels
   */
  setColumnWidth: (width: number) => void;
  /**
   * Set calculation loading state
   */
  setIsCalculationLoading: (loading: boolean) => void;
}

/**
 * Complete movies grid virtualization store type
 */
export type MoviesGridVirtualizationStore = MoviesGridVirtualizationState &
  MoviesGridVirtualizationGetters &
  MoviesGridVirtualizationActions;
