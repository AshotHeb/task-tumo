<template>
  <nav class="nav">
    <ul class="nav__list">
      <li v-for="item in navItems" :key="item.path" class="nav__item">
        <router-link
          :to="item.path"
          :class="navLinkClasses(item.path)"
          class="nav__link"
        >
          {{ item.name }}
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();

const navItems = [
  { name: "Home", path: "/" },
  { name: "Favorites", path: "/favorites" },
];

function navLinkClasses(path: string): string {
  const classes = ["nav__link"];
  if (path === "/") {
    // Exact match for home page
    if (route.path === "/") {
      classes.push("nav__link--active");
    }
  } else {
    // Exact match or starts with path for other routes
    if (route.path === path || route.path.startsWith(path + "/")) {
      classes.push("nav__link--active");
    }
  }
  return classes.join(" ");
}
</script>

<style scoped lang="scss">
@import "./styles.scss";
</style>
