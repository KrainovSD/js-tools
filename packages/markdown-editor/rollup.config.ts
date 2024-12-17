/* eslint-disable import/no-extraneous-dependencies */
import nodeResolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import { type OutputOptions, type Plugin, type PreRenderedChunk, defineConfig } from "rollup";
import externals from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";

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

  if (name === `vendor_${chunkInfo.name}` && chunkInfo.name === "index") name = "editor";

  return `${name}-[hash].js`;
}

const outputOptions: OutputOptions = {
  sourcemap: true,
  chunkFileNames: defineChunkName,
};

export default defineConfig({
  input: "./src/index.ts",
  output: [
    {
      dir: "./lib/esm",
      format: "es",
      ...outputOptions,
    },
    {
      dir: "./lib/cjs",
      format: "cjs",
      sourcemap: true,
      ...outputOptions,
    },
  ],
  plugins: [
    externals() as Plugin,
    nodeResolve(),
    terser(),
    typescript(),
    postcss({
      modules: {
        generateScopedName: "_[local]_[hash:base64:5]",
      },
      minimize: true,
      use: {
        sass: {
          silenceDeprecations: ["legacy-js-api"],
        },
        less: undefined,
        stylus: undefined,
      },
    }),
  ],
});
