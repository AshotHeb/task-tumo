import type { TextProps } from "./types";

const TEXT_SIZE_MAP: Record<NonNullable<TextProps["size"]>, string> = {
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "4xl": "text-4xl",
};

const TEXT_WEIGHT_MAP: Record<NonNullable<TextProps["weight"]>, string> = {
  thin: "font-thin",
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
  extrabold: "font-extrabold",
};

const TEXT_COLOR_MAP: Record<NonNullable<TextProps["color"]>, string> = {
  default: "text-gray-900",
  primary: "text-indigo-600",
  secondary: "text-gray-600",
  success: "text-green-600",
  warning: "text-yellow-600",
  error: "text-red-600",
  muted: "text-gray-500",
};

const TEXT_ALIGN_MAP: Record<NonNullable<TextProps["align"]>, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
  justify: "text-justify",
};

export function getTextClasses(props: TextProps): string {
  const classes: string[] = [];

  if (props.size) {
    classes.push(TEXT_SIZE_MAP[props.size]);
  }

  if (props.weight) {
    classes.push(TEXT_WEIGHT_MAP[props.weight]);
  }

  if (props.color) {
    classes.push(TEXT_COLOR_MAP[props.color]);
  }

  if (props.align) {
    classes.push(TEXT_ALIGN_MAP[props.align]);
  }

  if (props.truncate) {
    classes.push("truncate");
  }

  return classes.join(" ");
}

export function mergeTextClasses(
  baseClasses: string,
  attrsClass?: string | string[] | Record<string, boolean>
): (string | Record<string, boolean>)[] {
  const classes: (string | Record<string, boolean>)[] = [baseClasses];

  if (attrsClass) {
    classes.push(attrsClass as string | Record<string, boolean>);
  }

  return classes;
}

export function filterClassFromAttrs(
  attrs: Record<string, unknown>
): Record<string, unknown> {
  const { class: _, ...rest } = attrs;
  return rest;
}
