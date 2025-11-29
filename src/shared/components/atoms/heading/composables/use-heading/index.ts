import { computed, type ComputedRef } from "vue";
import type { HeadingVariant } from "../../types";
import { getVariantConfig } from "./utils";

/**
 * Composable for Heading component logic
 * @param variant - Heading variant prop (can be ComputedRef or direct value)
 * @returns Computed properties for heading styles and classes
 */
export function useHeading(
  variant: ComputedRef<HeadingVariant> | HeadingVariant
) {
  const variantValue = computed(() =>
    typeof variant === "object" && "value" in variant ? variant.value : variant
  );

  const config = computed(() => getVariantConfig(variantValue.value));

  const containerClass = computed(() => [
    "heading__container",
    `heading--${variantValue.value}`,
  ]);

  const titleTag = computed(() => config.value.title.tag);
  const titleSize = computed(() => config.value.title.size);
  const titleWeight = computed(() => config.value.title.weight);
  const titleAlign = computed(() => config.value.title.align);

  const subtitleTag = computed(() => config.value.subtitle.tag);
  const subtitleSize = computed(() => config.value.subtitle.size);
  const subtitleWeight = computed(() => config.value.subtitle.weight);
  const subtitleAlign = computed(() => config.value.subtitle.align);

  return {
    containerClass,
    titleTag,
    titleSize,
    titleWeight,
    titleAlign,
    subtitleTag,
    subtitleSize,
    subtitleWeight,
    subtitleAlign,
  };
}


