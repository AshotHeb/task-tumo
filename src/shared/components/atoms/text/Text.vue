<template>
  <component :is="tag" :class="mergedClasses" v-bind="$attrs">
    <slot>{{ text }}</slot>
  </component>
</template>

<script setup lang="ts">
import { computed, useAttrs } from "vue";
import type { TextProps } from "./types";
import { getTextClasses } from "./utils";

const props = withDefaults(defineProps<TextProps>(), {
  as: "p",
  size: "base",
  weight: "normal",
  text: "",
});

const attrs = useAttrs();

const tag = computed(() => props.as);

const mergedClasses = computed(() => {
  const baseClasses = getTextClasses(props);
  const userClasses = (attrs.class as string) || "";
  return [baseClasses, userClasses].filter(Boolean).join(" ");
});
</script>

<style scoped lang="scss">
@import "./styles.scss";
</style>
