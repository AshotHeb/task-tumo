<template>
  <button
    type="button"
    :class="buttonClasses"
    :aria-label="isFavorite ? 'Remove from favorites' : 'Add to favorites'"
    @click="handleClick"
  >
    <Heart :size="24" :fill="isFavorite ? '#ef4444' : 'none'" :color="isFavorite ? '#ef4444' : '#6b7280'" />
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Heart } from "lucide-vue-next";
import type { FavoriteProps } from "./types";

const props = defineProps<FavoriteProps>();

const buttonClasses = computed(() => {
  return [
    "favorite",
    {
      "favorite--active": props.isFavorite,
    },
  ];
});

function handleClick(event: MouseEvent): void {
  event.stopPropagation();
  props.onClick();
}
</script>

<style scoped lang="scss">
@import "./styles.scss";
</style>

