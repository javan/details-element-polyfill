import babel from "@rollup/plugin-babel"
import { terser } from "rollup-plugin-terser"
import { version, author, license, main } from "./package.json"

const banner = [
  `/*!`,
  ` * Details Element Polyfill ${version}`,
  ` * Copyright © ${new Date().getFullYear()} ${author}`,
  ` * Released under the ${license} license`,
  ` */`
].join("\n")

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
