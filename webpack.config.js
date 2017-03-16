const path = require('path')

module.exports = {
  context: path.resolve(__dirname, 'src'),
  entry: {
    index: [
      './index.js'
    ]
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/build'
  },
  devServer: {
    inline: true,
    publicPath: '/build',
    contentBase: './',
    historyApiFallback: true,
    port: process.env.PORT || 6789,
    open: true
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  }
}
