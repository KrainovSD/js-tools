const { defineConfig } = require('rollup');
const nodeResolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const { babel } = require('@rollup/plugin-babel');
const { uglify } = require('rollup-plugin-uglify');
const json = require('@rollup/plugin-json');
const eslint = require('@rollup/plugin-eslint');
const pkg = require('./package.json');

const extensions = ['.ts', '.js'];

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
    eslint({
      throwOnError: true,
      throwOnWarning: true,
    }),
    babel({
      babelHelpers: 'runtime',
      extensions,
      exclude: ['**/*.spec.ts'],
      shouldPrintComment: () => false,
    }),
    nodeResolve({ extensions }),
    json(),
    commonjs(),
    uglify(),
  ],
});

module.exports = options;
