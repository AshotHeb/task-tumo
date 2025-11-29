<template>
  <div class="input-wrapper">
    <input
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="inputClasses"
      v-bind="$attrs"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
    />
    <button
      v-if="showClearButton"
      type="button"
      class="input__clear"
      @click="handleClear"
      aria-label="Clear input"
    >
      <X :size="16" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { X } from "lucide-vue-next";
import type { InputProps } from "./types";

const props = withDefaults(defineProps<InputProps>(), {
  type: "text",
  modelValue: "",
  placeholder: "",
  disabled: false,
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
}>();

const showClearButton = computed(() => {
  return props.type === "search" && props.modelValue.length > 0;
});

const inputClasses = computed(() => {
  return ["input", `input--${props.type}`];
});

function handleInput(event: Event): void {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", target.value);
}

function handleClear(): void {
  emit("update:modelValue", "");
}

function handleFocus(event: FocusEvent): void {
  emit("focus", event);
}

function handleBlur(event: FocusEvent): void {
  emit("blur", event);
}
</script>

<style scoped lang="scss">
@import "./styles.scss";
</style>

