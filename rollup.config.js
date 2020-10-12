import babel from "@rollup/plugin-babel"
import { terser } from "rollup-plugin-terser"
import { version, author, main } from "./package.json"

const year = new Date().getFullYear()
const banner = `/*\nDetails Element Polyfill ${version}\nCopyright © ${year} ${author}\n */`

export default {
  input: "src/index.js",

  output: {
    file: main,
    format: "iife",
    banner
  },

  plugins: [
    babel({
      exclude: "node_modules/**"
    }),
    terser({
      mangle: false,
      compress: false,
      format: {
        beautify: true,
        indent_level: 2,
        comments: /Copyright/
      }
    })
  ]
}
