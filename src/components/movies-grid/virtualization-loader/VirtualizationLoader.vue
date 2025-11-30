<template>
  <div class="virtualization-loader">
    <Loader size="lg" />
  </div>
  <div class="virtualization-loader__mock-grid">
    <MockGrid />
  </div>
</template>

<script setup lang="ts">
import Loader from "@/shared/components/atoms/loader/Loader.vue";
import { MockGrid } from "./mock-grid";
</script>

<style scoped lang="scss">
@import "./styles.scss";
</style>
