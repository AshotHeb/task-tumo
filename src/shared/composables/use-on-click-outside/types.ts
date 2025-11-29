import type { Ref } from "vue";

export interface UseOnClickOutsideOptions {
  elementRef: Ref<HTMLElement | null | undefined>;
  handler: (event: MouseEvent | TouchEvent) => void;
  enabled?: Ref<boolean> | boolean;
}
