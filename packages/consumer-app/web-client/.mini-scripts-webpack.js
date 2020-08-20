module.exports = {
  resolve: {
    alias: {
      '@xxx': path.resolve(__dirname, "./src"),
    },
    modules: [
      path.resolve(__dirname, "./node_modules"),
      path.resolve(__dirname, "./src"),
      "node_modules"
    ],
  },
}
