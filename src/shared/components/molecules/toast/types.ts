/**
 * Toast variant options
 */
export type ToastVariant = "error";

/**
 * Toast component props interface
 */
export interface ToastProps {
  /**
   * Toast variant
   * @default "error"
   */
  variant?: ToastVariant;
  /**
   * Toast title
   */
  title: string;
  /**
   * Toast description
   */
  description?: string;
}

