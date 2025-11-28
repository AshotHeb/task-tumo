<template>
  <div class="app">
    <nav class="app__nav">
      <router-link to="/" class="app__link">Home</router-link>
      <router-link to="/about" class="app__link">About</router-link>
      <router-link to="/contact" class="app__link">Contact</router-link>
    </nav>
    <main class="app__main">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.app {
  @apply min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100;

  &__nav {
    @apply flex gap-4 p-4 bg-white shadow-md;
  }

  &__link {
    @apply px-4 py-2 rounded-md text-indigo-600 hover:bg-indigo-50 transition-colors;

    &.router-link-active {
      @apply bg-indigo-100 font-semibold;
    }
  }

  &__main {
    @apply container mx-auto;
  }
}
</style>
