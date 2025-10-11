import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const PORT = 3000;

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: false,
  },
  server: {
    port: PORT,
  },
});
