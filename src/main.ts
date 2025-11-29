import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "@/router";
import "@/style.css";
import "@/styles.scss";
import App from "@/App.vue";
import { useThemeStore } from "@/stores/theme";
import { useFavoritesStore } from "@/stores/favorites";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

// Initialize theme store before mounting
const themeStore = useThemeStore();
themeStore.initializeTheme();

// Initialize favorites store - load favorites from localStorage
const favoritesStore = useFavoritesStore();
favoritesStore.loadFavoritesFromStorage();

app.mount("#app");
