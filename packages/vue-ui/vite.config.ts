import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import type { InputPluginOption } from "rollup";
import externals from "rollup-plugin-peer-deps-external";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import vueDevTools from "vite-plugin-vue-devtools";

const PORT = 3000;

const production = process.env.npm_lifecycle_event === "build:js";

export default defineConfig({
  plugins: [
    vue(),
    dts({
      outDir: "lib/",
      rollupTypes: true,
      tsconfigPath: "./tsconfig.build.json",
    }),
    vueDevTools(),
  ],
  publicDir: production ? false : undefined,
  build: {
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      fileName: "index",
    },
    rollupOptions: {
      output: [
        {
          dir: "./lib/esm",
          format: "es",
          generatedCode: "es2015",
        },
        {
          dir: "./lib/cjs",
          format: "cjs",
          generatedCode: "es2015",
        },
      ],
      plugins: [externals({ includeDependencies: true }) as InputPluginOption],
    },
  },
  server: {
    port: PORT,
    open: "/index.html",
  },
});
