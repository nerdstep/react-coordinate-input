import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import url from '@rollup/plugin-url'
import filesize from 'rollup-plugin-filesize'
import external from 'rollup-plugin-peer-deps-external'
import pkg from './package.json'

export default {
  input: 'src/index.js',
  output: [
    {
      file: pkg.main,
      format: 'umd',
      name: 'reactCoordinateInput',
      globals: { react: 'react', 'prop-types': 'prop-types' },
      exports: 'named',
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: 'es',
    },
  ],
  external: ['react', 'prop-types'],
  plugins: [
    external(),
    url(),
    babel({
      exclude: 'node_modules/**',
    }),
    resolve(),
    commonjs(),
    filesize(),
  ],
}
