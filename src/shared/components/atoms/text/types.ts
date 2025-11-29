/**
 * Text size options
 */
export type TextSize = "xs" | "sm" | "base" | "lg" | "xl" | "2xl";

/**
 * Text weight options
 */
export type TextWeight = "normal" | "medium" | "semibold" | "bold";

/**
 * Text component props interface
 */
export interface TextProps {
  /**
   * Text content
   */
  text?: string;
  /**
   * HTML tag to render the text as
   * @default "p"
   */
  as?: "p" | "span" | "div" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  /**
   * Text size
   * @default "base"
   */
  size?: TextSize;
  /**
   * Text weight
   * @default "normal"
   */
  weight?: TextWeight;
}
