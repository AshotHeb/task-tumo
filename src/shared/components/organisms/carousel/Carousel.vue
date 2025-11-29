<template>
  <div
    class="carousel"
    :style="carouselStyles"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
  >
    <div class="carousel__container" ref="containerRef">
      <div class="carousel__track" :style="trackStyles" ref="trackRef">
        <div
          v-for="(item, index) in props.items"
          :key="`carousel-item-${index}`"
          class="carousel__slide"
          :style="slideStyles"
        >
          <slot :name="`slide-${index}`" :item="item" :index="index">
            <slot :item="item" :index="index" />
          </slot>
        </div>
      </div>

      <!-- Navigation Arrows -->
      <button
        v-if="showArrows && canGoPrev"
        class="carousel__arrow carousel__arrow--prev"
        @click="goToPrev"
        :aria-label="'Previous slide'"
        type="button"
      >
        ‹
      </button>
      <button
        v-if="showArrows && canGoNext"
        class="carousel__arrow carousel__arrow--next"
        @click="goToNext"
        :aria-label="'Next slide'"
        type="button"
      >
        ›
      </button>

      <!-- Indicators -->
      <div
        v-if="showIndicators && totalSlides > 1"
        class="carousel__indicators"
      >
        <button
          v-for="index in slideIndices"
          :key="`indicator-${index}`"
          class="carousel__indicator"
          :class="{ 'carousel__indicator--active': currentSlide === index }"
          @click="goToSlide(index)"
          :aria-label="`Go to slide ${index + 1}`"
          type="button"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T = unknown">
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import type { CarouselProps } from "./types";
import { normalizeAutoplay, calculateTotalSlides } from "./utils";

const props = withDefaults(defineProps<CarouselProps<T>>(), {
  itemsPerView: 1,
  autoplay: false,
  showArrows: true,
  showIndicators: true,
  swipeable: true,
  transitionDuration: 300,
  loop: true,
});

const containerRef = ref<HTMLElement | null>(null);
const trackRef = ref<HTMLElement | null>(null);

const currentSlide = ref(0);
const isPaused = ref(false);
const touchStartX = ref(0);
const touchEndX = ref(0);
const autoplayTimer = ref<ReturnType<typeof setInterval> | null>(null);

const totalSlides = computed(() =>
  calculateTotalSlides(props.items.length, props.itemsPerView)
);

const slideIndices = computed(() => {
  return Array.from({ length: totalSlides.value }, (_, i) => i);
});

const slideWidth = computed(() => {
  return `${100 / props.itemsPerView}%`;
});

const carouselStyles = computed(() => ({
  "--carousel-transition-duration": `${props.transitionDuration}ms`,
  "--carousel-slide-width": slideWidth.value,
}));

const slideStyles = computed(() => ({
  width: slideWidth.value,
}));

const trackStyles = computed(() => {
  const translateX = -(currentSlide.value * 100);
  return {
    transform: `translateX(${translateX}%)`,
  };
});

const autoplayConfig = computed(() => normalizeAutoplay(props.autoplay));

const canGoPrev = computed(() => {
  if (props.loop) return true;
  return currentSlide.value > 0;
});

const canGoNext = computed(() => {
  if (props.loop) return true;
  return currentSlide.value < totalSlides.value - 1;
});

function goToSlide(index: number): void {
  if (index < 0 || index >= totalSlides.value) return;
  currentSlide.value = index;
  resetAutoplay();
}

function goToNext(): void {
  if (currentSlide.value < totalSlides.value - 1) {
    currentSlide.value++;
  } else if (props.loop) {
    currentSlide.value = 0;
  }
  resetAutoplay();
}

function goToPrev(): void {
  if (currentSlide.value > 0) {
    currentSlide.value--;
  } else if (props.loop) {
    currentSlide.value = totalSlides.value - 1;
  }
  resetAutoplay();
}

function handleMouseEnter(): void {
  if (autoplayConfig.value?.pauseOnHover) {
    isPaused.value = true;
    stopAutoplay();
  }
}

function handleMouseLeave(): void {
  if (autoplayConfig.value?.pauseOnHover) {
    isPaused.value = false;
    startAutoplay();
  }
}

function handleTouchStart(event: TouchEvent): void {
  if (!props.swipeable) return;
  touchStartX.value = event.touches[0].clientX;
}

function handleTouchMove(event: TouchEvent): void {
  if (!props.swipeable) return;
  event.preventDefault();
}

function handleTouchEnd(event: TouchEvent): void {
  if (!props.swipeable) return;
  touchEndX.value = event.changedTouches[0].clientX;
  handleSwipe();
}

function handleSwipe(): void {
  const swipeThreshold = 50;
  const diff = touchStartX.value - touchEndX.value;

  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      // Swipe left - go to next
      goToNext();
    } else {
      // Swipe right - go to previous
      goToPrev();
    }
  }
}

function startAutoplay(): void {
  if (!autoplayConfig.value?.enabled || isPaused.value) return;

  stopAutoplay();

  autoplayTimer.value = setInterval(() => {
    if (currentSlide.value < totalSlides.value - 1) {
      currentSlide.value++;
    } else if (props.loop) {
      currentSlide.value = 0;
    } else {
      stopAutoplay();
    }
  }, autoplayConfig.value.interval);
}

function stopAutoplay(): void {
  if (autoplayTimer.value) {
    clearInterval(autoplayTimer.value);
    autoplayTimer.value = null;
  }
}

function resetAutoplay(): void {
  stopAutoplay();
  startAutoplay();
}

watch(
  () => autoplayConfig.value?.enabled,
  (enabled) => {
    if (enabled) {
      startAutoplay();
    } else {
      stopAutoplay();
    }
  },
  { immediate: true }
);

onMounted(() => {
  if (autoplayConfig.value?.enabled) {
    startAutoplay();
  }
});

onUnmounted(() => {
  stopAutoplay();
});
</script>

<style scoped lang="scss">
@import "./styles.scss";
</style>
