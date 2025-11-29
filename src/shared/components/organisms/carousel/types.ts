import type { Component } from "vue";

/**
 * Carousel component props
 */
export interface CarouselProps {
  /**
   * Array of Vue components to display in the carousel
   */
  items: Component[];
  /**
   * Show navigation arrows
   * @default true
   */
  showArrows?: boolean;
  /**
   * Number of items visible at once
   * @default 3
   */
  itemsPerView?: number;
}

