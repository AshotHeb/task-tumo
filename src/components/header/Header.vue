<template>
  <header class="header">
    <Nav />
    <ToggleTheme />
  </header>
</template>

<script setup lang="ts">
import { Nav } from "@/components/nav";
import { ToggleTheme } from "@/components/header/toggle-theme";
</script>

<style scoped lang="scss">
@import "./styles.scss";
</style>
