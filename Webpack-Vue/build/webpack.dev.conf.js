const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.conf');
const path = require('path');

module.exports = merge(baseConfig, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.resolve(__dirname, '../dist'),
    hot: false,
    open: true
  }
})