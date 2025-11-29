<template>
  <Toast
    v-if="activeToast"
    :variant="activeToast.variant"
    :title="activeToast.title"
    :description="activeToast.description"
    @close="handleClose"
  />
</template>

<script setup lang="ts">
import { watch, onUnmounted } from "vue";
import { storeToRefs } from "pinia";
import { useGlobalStore } from "@/stores/global";
import { Toast } from "@/shared/components/molecules/toast";

const globalStore = useGlobalStore();
const { activeToast } = storeToRefs(globalStore);

let autoCloseTimer: ReturnType<typeof setTimeout> | null = null;

function handleClose(): void {
  globalStore.clearActiveToast();
  clearAutoCloseTimer();
}

function clearAutoCloseTimer(): void {
  if (autoCloseTimer) {
    clearTimeout(autoCloseTimer);
    autoCloseTimer = null;
  }
}

function startAutoClose(): void {
  clearAutoCloseTimer();
  autoCloseTimer = setTimeout(() => {
    handleClose();
  }, 3000); // 3 seconds
}

// Watch for activeToast changes and start auto-close timer
watch(
  activeToast,
  (newToast) => {
    if (newToast) {
      startAutoClose();
    } else {
      clearAutoCloseTimer();
    }
  },
  { immediate: true }
);

onUnmounted(() => {
  clearAutoCloseTimer();
});
</script>

<style scoped lang="scss"></style>

