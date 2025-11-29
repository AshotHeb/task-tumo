<template>
  <div class="layout">
    <Header />
    <main class="layout__main">
      <slot />
    </main>
    <Toasts />
  </div>
</template>

<script setup lang="ts">
import Header from "@/components/header/Header.vue";
import { Toasts } from "@/components/toasts";
</script>

<style scoped lang="scss"></style>
