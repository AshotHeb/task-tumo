/**
 * Scroll position state interface
 */
export interface ScrollPositionState {
  /**
   * Saved scroll position for a given key
   */
  positions: Record<string, number>;
}

/**
 * Scroll position getters interface
 */
export interface ScrollPositionGetters {
  /**
   * Get scroll position for a key
   */
  getPosition: (key: string) => number | undefined;
}

/**
 * Scroll position actions interface
 */
export interface ScrollPositionActions {
  /**
   * Save scroll position for a key
   */
  savePosition: (key: string, position: number) => void;
  /**
   * Get and remove scroll position for a key
   */
  getAndRemovePosition: (key: string) => number | undefined;
  /**
   * Remove scroll position for a key
   */
  removePosition: (key: string) => void;
  /**
   * Clear all saved scroll positions
   */
  clearAllPositions: () => void;
}

/**
 * Scroll position store type
 */
export type ScrollPositionStore = ScrollPositionState &
  ScrollPositionGetters &
  ScrollPositionActions;
