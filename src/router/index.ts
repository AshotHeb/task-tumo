import { createRouter, createWebHistory } from "vue-router";
import type {
  RouteRecordRaw,
  NavigationGuardNext,
  RouteLocationNormalized,
} from "vue-router";
import { saveQueryParamsToStorage, getRestoredQueryParams } from "./utils";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "home",
    component: () => import("@/pages/Home.vue"),
    beforeEnter: (
      to: RouteLocationNormalized,
      _from: RouteLocationNormalized,
      next: NavigationGuardNext
    ) => {
      // Restore query params from localStorage before component loads
      const restoredQuery = getRestoredQueryParams(to.query);
      if (restoredQuery) {
        // Navigate with restored query params - this happens before component loads
        next({ ...to, query: restoredQuery });
        return;
      }
      next();
    },
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

// Save query params to localStorage before leaving home page
router.beforeEach((to, from) => {
  // Only save if we're leaving the home page
  if (from.name === "home" && to.name !== "home") {
    saveQueryParamsToStorage();
  }
});

export default router;
