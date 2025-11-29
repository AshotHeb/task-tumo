<template>
  <Layout>
    <div class="movie-details">
      <h1>Movie Details</h1>
      <p>Movie ID: {{ $route.params.id }}</p>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import Layout from "@/layout/Layout.vue";
</script>

<style scoped lang="scss"></style>
