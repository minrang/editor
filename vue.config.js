const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

module.exports = {
  //...
  productionSourceMap: false,
  filenameHashing: false,
  configureWebpack: {
    plugins: [
      new MonacoWebpackPlugin({
        filename: '[name].worker.js',
        languages: ['html', 'css', 'javascript', 'typescript', 'json'],
        features: ['find', 'multicursor', 'suggest'],
      }),
    ],
    // externals: {
    //   'monaco-editor': 'monaco-editor',
    //   'element-ui': 'element-ui',
    // },
  },
  devServer: {
    host: 'localhost',
    port: 8313,
    https: true,
    proxy: 'https://minrang.com',
  },
}
