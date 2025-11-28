import type {
  TextTag,
  TextSize,
  TextWeight,
  TextAlign,
} from "@/shared/components/atoms/text/types";

/**
 * Variant configuration type for heading component
 */
export type VariantConfig = {
  title: {
    tag: TextTag;
    size: TextSize;
    weight: TextWeight;
    align: TextAlign;
  };
  subtitle: {
    tag: TextTag;
    size: TextSize;
    weight: TextWeight;
    align: TextAlign;
  };
};
