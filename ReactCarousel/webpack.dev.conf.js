const baseConfig = require('./webpack.base.conf');
const merge = require('webpack-merge');
module.exports = merge(baseConfig, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    port: 9000,
    contentBase: './dist/'
  }
});