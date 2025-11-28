<template>
  <div :class="containerClass">
    <Text
      :tag="titleTag"
      :size="titleSize"
      :weight="titleWeight"
      :align="titleAlign"
      class="heading__title"
    >
      {{ title }}
    </Text>

    <Text
      v-if="subtitle"
      :tag="subtitleTag"
      :size="subtitleSize"
      :weight="subtitleWeight"
      :align="subtitleAlign"
      class="heading__subtitle"
    >
      {{ subtitle }}
    </Text>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Text } from "@/shared/components/atoms/text";
import type { HeadingProps } from "./types";
import { useHeading } from "./composables/use-heading";

const props = withDefaults(defineProps<HeadingProps>(), {
  subtitle: "",
  variant: "primary",
});

const {
  containerClass,
  titleTag,
  titleSize,
  titleWeight,
  titleAlign,
  subtitleTag,
  subtitleSize,
  subtitleWeight,
  subtitleAlign,
} = useHeading(computed(() => props.variant));
</script>

<style scoped lang="scss">
@import "./styles.scss";
</style>
