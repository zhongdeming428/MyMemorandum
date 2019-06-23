const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const cleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: {
        index: path.resolve(__dirname, '../src/index.js'),
        venders: ['react', 'react-dom', 'redux', 'react-redux']
    },
    output: {
        filename: '[name]_[hash].js',
        path: path.resolve(__dirname, '../dist/')
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, '../src'),
            'components': path.resolve(__dirname, '../src/components')
        },
        extensions: ['.json', '.js', '.jsx', '.css']
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'less-loader']
            }
        ]
    },
    plugins: [
        new htmlWebpackPlugin({
            inject: true,
            template: path.resolve(__dirname, '../index.html')
        }),
        new cleanWebpackPlugin(['dist'])
    ]
}