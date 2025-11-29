<template>
  <div :class="loaderClasses" v-bind="$attrs">
    <span class="loader__dot"></span>
    <span class="loader__dot"></span>
    <span class="loader__dot"></span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { LoaderProps } from "./types";
import { getLoaderClasses } from "./utils";

const props = withDefaults(defineProps<LoaderProps>(), {
  size: "md",
});

const loaderClasses = computed(() => {
  return getLoaderClasses(props);
});
</script>

<style scoped lang="scss">
@import "./styles.scss";
</style>
