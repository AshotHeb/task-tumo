export { default as Text } from "./Text.vue";
export type {
  TextTag,
  TextSize,
  TextWeight,
  TextColor,
  TextAlign,
  TextProps,
} from "./types";
export {
  getTextClasses,
  mergeTextClasses,
  filterClassFromAttrs,
} from "./utils";
