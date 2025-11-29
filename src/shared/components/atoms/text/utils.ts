import type { TextProps, TextSize, TextWeight } from "./types";

const SIZE_MAP: Record<TextSize, string> = {
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
};

const WEIGHT_MAP: Record<TextWeight, string> = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
};

/**
 * Generates CSS classes for text component
 * @param props - Component props
 * @returns Space-separated string of CSS classes
 */
export function getTextClasses(props: TextProps): string {
  const classes: string[] = ["text"];

  if (props.size) {
    classes.push(SIZE_MAP[props.size]);
  }

  if (props.weight) {
    classes.push(WEIGHT_MAP[props.weight]);
  }

  return classes.join(" ");
}
