<template>
  <div class="toast" :class="toastClasses">
    <div class="toast__content">
      <Text as="h3" size="base" weight="semibold" class="toast__title">
        {{ title }}
      </Text>
      <Text v-if="description" as="p" size="sm" class="toast__description">
        {{ description }}
      </Text>
    </div>
    <button
      type="button"
      class="toast__close"
      @click="$emit('close')"
      aria-label="Close toast"
    >
      <X :size="18" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { X } from "lucide-vue-next";
import type { ToastProps } from "./types";
import { getToastVariantClasses } from "./utils";
import { Text } from "@/shared/components/atoms/text";

const props = withDefaults(defineProps<ToastProps>(), {
  variant: "error",
});

defineEmits<{
  close: [];
}>();

const toastClasses = computed(() => {
  return getToastVariantClasses(props.variant);
});
</script>

<style scoped lang="scss">
@import "./styles.scss";
</style>
