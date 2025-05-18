import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import vueDevTools from "vite-plugin-vue-devtools";

const PORT = 3000;

export default defineConfig({
  plugins: [vue(), vueDevTools()],
  build: {
    sourcemap: false,
  },
  server: {
    port: PORT,
    open: "/index.html",
  },
});
