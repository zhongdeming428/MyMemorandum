const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.conf');
const path = require('path');

module.exports = merge(baseConfig, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        port: 9999,
        open: true,
        contentBase: path.resolve(__dirname, '../dist')
    }
})