/**
 * ScrollToTop component props interface
 */
export interface ScrollToTopProps {
  /**
   * Scroll threshold in pixels before showing the button
   * @default 300
   */
  threshold?: number;
  /**
   * Element reference to find scrollable parent
   * If not provided, will use window
   */
  elementRef?: HTMLElement | null;
  /**
   * Button position from bottom
   * @default "2rem"
   */
  bottom?: string;
  /**
   * Button position from right
   * @default "2rem"
   */
  right?: string;
}

