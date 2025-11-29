<template>
  <div class="layout">
    <Header />
    <main class="layout__main">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import Header from "@/components/header/Header.vue";
</script>

<style scoped lang="scss"></style>
