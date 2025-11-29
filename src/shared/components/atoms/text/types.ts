/**
 * Text component HTML tag options
 */
export type TextTag =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "p"
  | "span"
  | "div"
  | "label";

/**
 * Text size variant options
 */
export type TextSize =
  | "xs"
  | "sm"
  | "base"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl";

/**
 * Text weight variant options
 */
export type TextWeight =
  | "thin"
  | "normal"
  | "medium"
  | "semibold"
  | "bold"
  | "extrabold";

/**
 * Text color variant options
 */
export type TextColor =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "error"
  | "muted";

/**
 * Text alignment options
 */
export type TextAlign = "left" | "center" | "right" | "justify";

/**
 * Text component props interface
 */
export interface TextProps {
  /**
   * HTML tag to render (h1, h2, p, span, etc.)
   */
  tag?: TextTag;
  /**
   * Text size variant
   */
  size?: TextSize;
  /**
   * Text weight variant
   */
  weight?: TextWeight;
  /**
   * Text color variant
   */
  color?: TextColor;
  /**
   * Text alignment
   */
  align?: TextAlign;
  /**
   * Truncate text with ellipsis
   */
  truncate?: boolean;
}

