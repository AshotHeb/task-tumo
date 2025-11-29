/**
 * Gets the scrollable element (parent container or window)
 * @param elementRef - Reference element to find scrollable parent
 * @returns Scrollable element (HTMLElement or Window)
 */
export function getScrollElement(
  elementRef: HTMLElement | null | undefined
): HTMLElement | Window {
  if (elementRef) {
    let parent = elementRef.parentElement;
    while (parent) {
      const style = window.getComputedStyle(parent);
      if (style.overflowY === "auto" || style.overflowY === "scroll") {
        return parent;
      }
      parent = parent.parentElement;
    }
  }
  return window;
}

/**
 * Gets current scroll position
 * @param scrollElement - Scrollable element
 * @returns Current scroll position in pixels
 */
export function getScrollPosition(scrollElement: HTMLElement | Window): number {
  if (scrollElement === window) {
    return window.scrollY || window.pageYOffset || 0;
  }
  return (scrollElement as HTMLElement).scrollTop || 0;
}

/**
 * Scrolls to top with smooth behavior
 * @param scrollElement - Scrollable element
 */
export function scrollToTop(scrollElement: HTMLElement | Window): void {
  if (scrollElement === window) {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  } else {
    (scrollElement as HTMLElement).scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
}
