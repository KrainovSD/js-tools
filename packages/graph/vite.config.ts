import { svelte } from "@sveltejs/vite-plugin-svelte";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {},
    },
  },
  server: {
    port: 3002,
  },
});
