import type { HeadingVariant } from "../../types";
import type { VariantConfig } from "./types";

/**
 * Variant-based style configuration mapping
 */
export const VARIANT_CONFIG: Record<HeadingVariant, VariantConfig> = {
  primary: {
    title: { tag: "h1", size: "3xl", weight: "bold", align: "center" },
    subtitle: { tag: "h2", size: "lg", weight: "medium", align: "left" },
  },
  secondary: {
    title: { tag: "h2", size: "2xl", weight: "semibold", align: "left" },
    subtitle: { tag: "h3", size: "base", weight: "normal", align: "left" },
  },
  tertiary: {
    title: { tag: "h3", size: "xl", weight: "medium", align: "left" },
    subtitle: { tag: "h4", size: "sm", weight: "normal", align: "left" },
  },
  muted: {
    title: { tag: "h4", size: "lg", weight: "normal", align: "left" },
    subtitle: { tag: "p", size: "sm", weight: "normal", align: "left" },
  },
};

/**
 * Get variant configuration for a given variant
 * @param variant - Heading variant
 * @returns Variant configuration
 */
export function getVariantConfig(variant: HeadingVariant): VariantConfig {
  return VARIANT_CONFIG[variant];
}


