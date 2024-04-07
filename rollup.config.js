const { defineConfig } = require('rollup')
const nodeResolve = require('@rollup/plugin-node-resolve')
const commonjs = require('@rollup/plugin-commonjs')
const { babel } = require('@rollup/plugin-babel')
const pkg = require('./package.json')
const { uglify } = require('rollup-plugin-uglify')
const extensions = ['.ts', '.js']
const json = require('@rollup/plugin-json')

const options = defineConfig({
  input: './src/index.ts',
  output: [
    {
      file: pkg.module,
      format: 'es',
      generatedCode: 'es2015',
      sourcemap: true,
    },
    {
      file: pkg.main,
      format: 'cjs',
      generatedCode: 'es2015',
      sourcemap: true,
    },
  ],
  plugins: [
    babel({
      babelHelpers: 'runtime',
      extensions,
      shouldPrintComment: (comment) => false,
    }),
    nodeResolve({ extensions }),
    json(),
    commonjs(),
    uglify(),
  ],
})

module.exports = options
