/**
 * Tooltip position options
 */
export type TooltipPosition = "top" | "bottom" | "left" | "right";

/**
 * Tooltip component props interface
 */
export interface TooltipProps {
  /**
   * Tooltip content text
   */
  content?: string;
  /**
   * Tooltip position
   * @default "top"
   */
  position?: TooltipPosition;
  /**
   * Delay before showing tooltip (in milliseconds)
   * @default 0
   */
  delay?: number;
  /**
   * Whether the tooltip is disabled
   * @default false
   */
  disabled?: boolean;
}

