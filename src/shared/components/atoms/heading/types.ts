/**
 * Heading variant options
 */
export type HeadingVariant = "primary" | "secondary" | "tertiary" | "muted";

/**
 * Heading component props interface
 */
export interface HeadingProps {
  /**
   * Heading title text
   */
  title: string;
  /**
   * Heading subtitle text
   */
  subtitle?: string;
  /**
   * Heading variant style
   */
  variant?: HeadingVariant;
}

