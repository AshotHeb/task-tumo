import type { CarouselProps, CarouselAutoplay } from "./types";

/**
 * Normalizes autoplay configuration
 * @param autoplay - Autoplay prop value
 * @returns Normalized autoplay configuration
 */
export function normalizeAutoplay(
  autoplay: CarouselProps["autoplay"]
): CarouselAutoplay | null {
  if (!autoplay) {
    return null;
  }

  if (typeof autoplay === "boolean") {
    return {
      enabled: autoplay,
      interval: 3000,
      pauseOnHover: true,
    };
  }

  return {
    enabled: autoplay.enabled,
    interval: autoplay.interval ?? 3000,
    pauseOnHover: autoplay.pauseOnHover ?? true,
  };
}

/**
 * Calculates the total number of slides based on items per view
 * @param totalItems - Total number of items
 * @param itemsPerView - Number of items to show at once
 * @returns Total number of slides
 */
export function calculateTotalSlides(
  totalItems: number,
  itemsPerView: number
): number {
  if (itemsPerView >= totalItems) {
    return 1;
  }
  return Math.ceil(totalItems / itemsPerView);
}

/**
 * Gets the slide index for a given item index
 * @param itemIndex - Item index
 * @param itemsPerView - Number of items per view
 * @returns Slide index
 */
export function getSlideIndex(itemIndex: number, itemsPerView: number): number {
  return Math.floor(itemIndex / itemsPerView);
}
