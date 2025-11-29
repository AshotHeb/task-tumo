import type { LoaderProps, LoaderSize } from "./types";

const SIZE_MAP: Record<LoaderSize, string> = {
  sm: "loader--sm",
  md: "loader--md",
  lg: "loader--lg",
};

/**
 * Generates CSS classes for loader component
 * @param props - Component props
 * @returns Space-separated string of CSS classes
 */
export function getLoaderClasses(props: LoaderProps): string {
  const classes: string[] = ["loader"];

  if (props.size) {
    classes.push(SIZE_MAP[props.size]);
  }

  return classes.join(" ");
}

