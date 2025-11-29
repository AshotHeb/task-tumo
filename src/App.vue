<template>
  <div class="app">
    <Layout>
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </Layout>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import Layout from "@/layout/Layout.vue";
</script>

<style scoped lang="scss">
@import "./App.styles.scss";
</style>
