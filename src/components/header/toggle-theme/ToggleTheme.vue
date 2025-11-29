<template>
  <button class="toggle-theme" type="button" @click="toggleTheme">
    <Sun v-if="isDark" :size="20" />
    <Moon v-else :size="20" />
  </button>
</template>

<script setup lang="ts">
import { Sun, Moon } from "lucide-vue-next";
import { useTheme } from "@/shared/composables/use-theme";

const { isDark, toggleTheme } = useTheme();
</script>

<style scoped lang="scss">
@import "./styles.scss";
</style>
