<template>
  <button
    v-if="showButton"
    type="button"
    class="scroll-to-top"
    :style="buttonStyles"
    @click="handleClick"
    aria-label="Scroll to top"
  >
    <ArrowUp :size="20" />
  </button>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from "vue";
import { ArrowUp } from "lucide-vue-next";
import type { ScrollToTopProps } from "./types";
import { getScrollElement, getScrollPosition, scrollToTop } from "./utils";

const props = withDefaults(defineProps<ScrollToTopProps>(), {
  threshold: 300,
  bottom: "2rem",
  right: "2rem",
});

const scrollY = ref(0);
const scrollElementRef = ref<HTMLElement | Window | null>(null);

const showButton = computed(() => scrollY.value > props.threshold);

const buttonStyles = computed(() => ({
  bottom: props.bottom,
  right: props.right,
}));

function handleScroll(): void {
  if (scrollElementRef.value) {
    scrollY.value = getScrollPosition(scrollElementRef.value);
  }
}

function handleClick(): void {
  if (scrollElementRef.value) {
    scrollToTop(scrollElementRef.value);
  }
}

function initializeScrollElement(): void {
  scrollElementRef.value = getScrollElement(props.elementRef);
  scrollElementRef.value.addEventListener("scroll", handleScroll, {
    passive: true,
  });
  handleScroll(); // Initial check
}

function cleanupScrollElement(): void {
  if (scrollElementRef.value) {
    scrollElementRef.value.removeEventListener("scroll", handleScroll);
    scrollElementRef.value = null;
  }
}

watch(
  () => props.elementRef,
  async () => {
    cleanupScrollElement();
    // Use nextTick to ensure elementRef is available
    await nextTick();
    initializeScrollElement();
  },
  { immediate: false }
);

onMounted(() => {
  initializeScrollElement();
});

onUnmounted(() => {
  cleanupScrollElement();
});
</script>

<style scoped lang="scss">
@import "./styles.scss";
</style>

