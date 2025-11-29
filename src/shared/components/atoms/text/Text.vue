<template>
  <component :is="tag" :class="mergedClasses" v-bind="filteredAttrs">
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed, useAttrs } from "vue";
import type { TextProps } from "./types";
import {
  getTextClasses,
  mergeTextClasses,
  filterClassFromAttrs,
} from "./utils";

const props = withDefaults(defineProps<TextProps>(), {
  tag: "p",
  size: "base",
  weight: "normal",
  color: "default",
  align: "left",
  truncate: false,
});

const attrs = useAttrs();

const textClasses = computed(() => getTextClasses(props));

const mergedClasses = computed(() =>
  mergeTextClasses(
    textClasses.value,
    attrs.class as string | string[] | Record<string, boolean>
  )
);

const filteredAttrs = computed(() =>
  filterClassFromAttrs(attrs as Record<string, unknown>)
);
</script>

