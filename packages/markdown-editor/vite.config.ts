import path from "path";
import type { PreRenderedChunk } from "rollup";
import { defineConfig } from "vite";

type ChunkConfig = {
  overlaps: string[];
  name: string;
};
const CHUNK_CONFIG: ChunkConfig[] = [
  { overlaps: ["vim", "Vim"], name: "vendor_vim" },
  { overlaps: ["yCollab"], name: "vendor_y.next" },
  { overlaps: ["initMarkdown"], name: "markdown_plugin" },
  { overlaps: ["WebsocketProvider"], name: "vendor_y.websocket" },
];

function defineChunkName(chunkInfo: PreRenderedChunk) {
  let name = `vendor_${chunkInfo.name}`;

  for (const config of CHUNK_CONFIG) {
    if (config.overlaps.every((overlap) => chunkInfo.exports.includes(overlap))) {
      name = config.name;
      break;
    }
  }

  return `${name}-[hash].js`;
}

export default defineConfig({
  plugins: [],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        chunkFileNames: defineChunkName,
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler",
      },
    },
  },
  server: {
    port: 3000,
  },
});
