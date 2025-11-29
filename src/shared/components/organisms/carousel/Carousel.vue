<template>
  <div class="carousel">
    <button
      v-if="showArrows && canGoPrev"
      type="button"
      class="carousel__arrow carousel__arrow--prev"
      @click="goToPrev"
      aria-label="Previous item"
    >
      <ChevronLeft :size="24" />
    </button>

    <div class="carousel__container" ref="containerRef">
      <div
        class="carousel__track"
        :style="{ transform: `translateX(-${translateX}px)` }"
      >
        <div
          v-for="(item, index) in items"
          :key="index"
          class="carousel__item"
          :class="{ 'carousel__item--active': index === currentIndex }"
          :style="{ width: `${itemWidth}px` }"
        >
          <component :is="item" />
        </div>
      </div>
    </div>

    <button
      v-if="showArrows && canGoNext"
      type="button"
      class="carousel__arrow carousel__arrow--next"
      @click="goToNext"
      aria-label="Next item"
    >
      <ChevronRight :size="24" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";
import type { CarouselProps } from "./types";

const props = withDefaults(defineProps<CarouselProps>(), {
  showArrows: true,
  itemsPerView: 3,
});

const containerRef = ref<HTMLElement | null>(null);
const currentIndex = ref(0);
const itemWidth = ref(0);
const gap = 16; // 1rem = 16px

const canGoPrev = computed(() => currentIndex.value > 0);
const canGoNext = computed(
  () => currentIndex.value < props.items.length - props.itemsPerView
);

const translateX = computed(() => {
  return currentIndex.value * (itemWidth.value + gap);
});

const updateItemWidth = (): void => {
  if (!containerRef.value) return;
  const containerWidth = containerRef.value.offsetWidth;
  itemWidth.value = (containerWidth - gap * (props.itemsPerView - 1)) / props.itemsPerView;
};

const goToPrev = (): void => {
  if (canGoPrev.value) {
    currentIndex.value--;
  }
};

const goToNext = (): void => {
  if (canGoNext.value) {
    currentIndex.value++;
  }
};

onMounted(() => {
  updateItemWidth();
  window.addEventListener("resize", updateItemWidth);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateItemWidth);
});
</script>

<style scoped lang="scss">
@import "./styles.scss";
</style>

