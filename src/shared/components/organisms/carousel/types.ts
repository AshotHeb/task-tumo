/**
 * Carousel autoplay options
 */
export interface CarouselAutoplay {
  /**
   * Enable autoplay
   */
  enabled: boolean;
  /**
   * Autoplay interval in milliseconds
   * @default 3000
   */
  interval?: number;
  /**
   * Pause autoplay on hover
   * @default true
   */
  pauseOnHover?: boolean;
}

/**
 * Carousel component props interface
 */
export interface CarouselProps<T = unknown> {
  /**
   * Array of items to display in the carousel
   */
  items: T[];
  /**
   * Number of items to show at once
   * @default 1
   */
  itemsPerView?: number;
  /**
   * Enable autoplay
   * @default false
   */
  autoplay?: boolean | CarouselAutoplay;
  /**
   * Show navigation arrows
   * @default true
   */
  showArrows?: boolean;
  /**
   * Show indicator dots
   * @default true
   */
  showIndicators?: boolean;
  /**
   * Enable swipe gestures
   * @default true
   */
  swipeable?: boolean;
  /**
   * Transition duration in milliseconds
   * @default 300
   */
  transitionDuration?: number;
  /**
   * Loop carousel (go from last to first)
   * @default true
   */
  loop?: boolean;
}
