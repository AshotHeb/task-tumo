import type { ToastVariant } from "./types";

/**
 * Gets CSS classes for toast variant
 * @param variant - Toast variant
 * @returns CSS class string
 */
export function getToastVariantClasses(variant: ToastVariant): string {
  return `toast--${variant}`;
}
