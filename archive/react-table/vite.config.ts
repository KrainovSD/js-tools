import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const PORT = 3000;

export default defineConfig({
  base: "/",
  plugins: [react()],
  resolve: {},
  build: {
    rollupOptions: {
      external: ["node-fetch"],
    },
    sourcemap: true,
    chunkSizeWarningLimit: 1600,
  },
  server: {
    port: PORT,
  },
});
