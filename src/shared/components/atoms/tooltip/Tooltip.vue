<template>
  <div
    class="tooltip-wrapper"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @focusin="handleFocusIn"
    @focusout="handleFocusOut"
  >
    <slot />
    <Transition name="tooltip">
      <div
        v-if="isVisible && !disabled"
        :class="tooltipClasses"
        role="tooltip"
        :aria-hidden="!isVisible"
      >
        <slot name="content">
          <span v-if="content">{{ content }}</span>
        </slot>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { TooltipProps } from "./types";
import { getTooltipPositionClasses } from "./utils";

const props = withDefaults(defineProps<TooltipProps>(), {
  position: "top",
  delay: 0,
  disabled: false,
});

const isVisible = ref(false);
let showTimeout: ReturnType<typeof setTimeout> | null = null;
let hideTimeout: ReturnType<typeof setTimeout> | null = null;

const tooltipClasses = computed(() => {
  return ["tooltip", getTooltipPositionClasses(props.position)];
});

function clearTimeouts(): void {
  if (showTimeout) {
    clearTimeout(showTimeout);
    showTimeout = null;
  }
  if (hideTimeout) {
    clearTimeout(hideTimeout);
    hideTimeout = null;
  }
}

function handleMouseEnter(): void {
  if (props.disabled) return;
  clearTimeouts();
  if (props.delay > 0) {
    showTimeout = setTimeout(() => {
      isVisible.value = true;
    }, props.delay);
  } else {
    isVisible.value = true;
  }
}

function handleMouseLeave(): void {
  clearTimeouts();
  isVisible.value = false;
}

function handleFocusIn(): void {
  if (props.disabled) return;
  clearTimeouts();
  if (props.delay > 0) {
    showTimeout = setTimeout(() => {
      isVisible.value = true;
    }, props.delay);
  } else {
    isVisible.value = true;
  }
}

function handleFocusOut(): void {
  clearTimeouts();
  isVisible.value = false;
}
</script>

<style scoped lang="scss">
@import "./styles.scss";
</style>

