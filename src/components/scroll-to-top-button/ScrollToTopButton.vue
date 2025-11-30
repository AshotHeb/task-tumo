<template>
  <button
    type="button"
    class="scroll-to-top-button"
    :class="{ 'scroll-to-top-button--visible': isVisible }"
    @click="handleClick"
    aria-label="Scroll to top"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="scroll-to-top-button__icon"
    >
      <path d="m18 15-6-6-6 6" />
    </svg>
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, unref, nextTick } from "vue";
import type { ScrollToTopButtonProps } from "./types";

const props = withDefaults(defineProps<ScrollToTopButtonProps>(), {
  threshold: 300,
  behavior: "smooth",
});

const isVisible = ref(false);
let currentScrollElement: HTMLElement | Window | null = null;

function getScrollElement(): HTMLElement | Window {
  const container = unref(props.containerRef);
  return container || window;
}

function getScrollPosition(): number {
  const element = getScrollElement();
  if (element === window) {
    return window.scrollY || window.pageYOffset || 0;
  }
  return (element as HTMLElement).scrollTop || 0;
}

function handleScroll(): void {
  const scrollY = getScrollPosition();
  isVisible.value = scrollY > props.threshold;
}

function handleClick(): void {
  const element = getScrollElement();
  if (element === window) {
    window.scrollTo({
      top: 0,
      behavior: props.behavior,
    });
  } else {
    (element as HTMLElement).scrollTo({
      top: 0,
      behavior: props.behavior,
    });
  }
}

function setupScrollListener(): void {
  // Remove old listener if exists
  if (currentScrollElement) {
    if (currentScrollElement === window) {
      window.removeEventListener("scroll", handleScroll);
    } else {
      currentScrollElement.removeEventListener("scroll", handleScroll);
    }
  }

  // Get current scroll element
  const element = getScrollElement();
  currentScrollElement = element;

  // Add new listener
  if (element === window) {
    window.addEventListener("scroll", handleScroll, { passive: true });
  } else {
    element.addEventListener("scroll", handleScroll, { passive: true });
  }

  // Check initial state
  handleScroll();
}

onMounted(() => {
  // Watch for container ref changes
  // Use a getter function to properly track the ref
  watch(
    () => {
      const container = unref(props.containerRef);
      return container;
    },
    async () => {
      // Wait for next tick to ensure element is mounted
      await nextTick();
      setupScrollListener();
    },
    { immediate: true }
  );
});

onUnmounted(() => {
  // Clean up listener
  if (currentScrollElement) {
    if (currentScrollElement === window) {
      window.removeEventListener("scroll", handleScroll);
    } else {
      currentScrollElement.removeEventListener("scroll", handleScroll);
    }
  }
});
</script>

<style scoped lang="scss">
@import "./styles.scss";
</style>
