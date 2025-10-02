import { presets } from "@krainovsd/presets/rollup";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import type { InputPluginOption } from "rollup";
import { type PluginOption, defineConfig } from "vite";

// import dts from "vite-plugin-dts";

// import vueDevTools from "vite-plugin-vue-devtools";

const PORT = 3000;

const production = process.env.npm_lifecycle_event === "build:js";

export default defineConfig({
  plugins: [
    vue(),
    // dts({
    //   outDir: "lib/",
    //   rollupTypes: true,
    //   tsconfigPath: "./tsconfig.build.json",
    // }),
    // vueDevTools(),
    presets.plugins.visualizer() as PluginOption,
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
      plugins: [presets.plugins.externals({ includeDependencies: true }) as InputPluginOption],
    },
  },
  server: {
    port: PORT,
    open: "/index.html",
  },
});
