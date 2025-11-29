import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "home",
    component: () => import("@/pages/Home.vue"),
  },
  {
    path: "/favorites",
    name: "favorites",
    component: () => import("@/pages/Favorites.vue"),
  },
  {
    path: "/movie/:id",
    name: "movieDetails",
    component: () => import("@/pages/MovieDetails.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
