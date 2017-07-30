const {join} = require('path')
const BabiliPlugin = require('babili-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  target: 'node',
  output: {
    path: join(process.cwd(), 'dist'),
    filename: 'index.js',
    libraryTarget: 'commonjs2'
  },
  externals: [
    'aws-sdk'
  ],
  module: {rules: [{
    test: /\.js$/,
    loader: 'babel-loader',
    options: {
      cacheDirectory: true,
      presets: ['node6'],
      plugins: ['transform-async-to-generator']
    },
    exclude: [/node_modules/]
  }]},
  plugins: [
    new BabiliPlugin()
  ]
}
