const merge = require('webpack-merge');
const webpack = require('webpack');
const baseConfig = require('./webpack.base.conf');
const path = require('path');

module.exports = merge(baseConfig, {
  mode: 'development',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader', 
          'postcss-loader'
        ]
      },
      {
        test: /\.styl(us)$/,
        use: ['vue-style-loader', 'css-loader', 'postcss-loader', 'stylus-loader']
      },
    ]
  },
  devServer: {
    contentBase: path.resolve(__dirname, '../dist'),
    hot: true,
    open: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
})