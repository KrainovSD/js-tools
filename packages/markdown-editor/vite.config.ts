import { defineConfig } from "vite";

const PORT = 3000;

export default defineConfig({
  plugins: [],
  build: {
    sourcemap: false,
  },
  server: {
    port: PORT,
  },
});
