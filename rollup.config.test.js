import babel from "rollup-plugin-babel"

export default {
  input: "test/index.js",

  output: {
    file: "test/dist/index.js",
    format: "iife"
  },

  plugins: [
    babel({
      exclude: "node_modules/**"
    })
  ]
}
