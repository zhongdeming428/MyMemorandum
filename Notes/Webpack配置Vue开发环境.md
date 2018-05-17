# 基于Webpack搭建Vue开发环境

## 一、初始化项目文件夹

新建一个文件夹（路径与命名随意），然后打开Terminal，切换路径到该文件夹，通过以下命令初始化：

    npm init -y

`-y`是简化的初始化过程，所有`package.json`的所有属性都使用默认值。

在项目文件夹下新建文件夹：`/dist`、`/src`。

在`/src`文件夹下新建文件：`main.js`和`index.html`，`main.js`是打包的入口文件。

## 二、安装Webpack与Webpack-cli

通过以下命令安装：

    npm install -D webpack webpack-cli

## 三、配置最基础的Webpack

通过以下命令安装基础模块：

    npm install -D style-loader css-loader webpack-merge vue-loader babel-loader babel-preset-env babel-polyfill html-webpack-plugin clean-webpack-plugin webpack-dev-server vue-template-compiler vue-style-loader

在项目文件夹的根目录下新建三个文件：`webpack.dev.conf.js`、`webpack.base.conf.js`和`webpack.prod.conf.js`。

内容分别如下：

**webpack.base.conf.js**

    const path = require('path');
    const HtmlWebpackPlugin = require('html-webpack-plugin');
    const CleanWebpackPlugin = require('clean-webpack-plugin');

    module.exports = {
        entry: './src/main.js',
        output: {
            filename: 'bundle.[hash].js',
            path: path.join(__dirname, './dist')
        },
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader']
                },
                {
                    test: /\.js$/,
                    use: 'babel-loader',
                    exclude: /node_modules/
                }
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './src/index.html'
            }),
            new CleanWebpackPlugin(['dist'])
        ]
    };

**webpack.dev.conf.js**

    const merge = require('webpack-merge');
    const baseConfig = require('./webpack.base.conf.js');

    module.exports = merge(baseConfig, {
        mode: 'development',
        devtool: 'inline-source-map',
        devServer: {
            port: 3000,
            contentBase: './dist'
        }
    });

**webpack.prod.conf.js**

    const merge = require('webpack-merge');
    const baseConfig = require('./webpack.base.conf.js');

    module.exports = merge(baseConfig, {
        mode: 'production'
    });

## 四、配置`npm scripts`

修改`package.json`，在scripts属性中新加入以下命令：

    // package.json
    {
        "scripts": {
            "start": "webpack-dev-server --open --config webpack.dev.conf.js",
            "build": "webpack --config webpack.prod.conf.js"
        }
    }

现在可以测试webpack的基础配置：

修改页面文件，内容分别如下：

**index.html**

    <html>
        <head>
            <meta charset="utf-8"/>
            <title>Vue & Webpack</title>
        </head>
        <body>
            <div id="app">
                <h1>Hello Vue & Webpack!</h1>
            </div>
        </body>
    </html>

**main.js**

    console.log('Yes!');

输入命令`npm run start`和`npm run build`，分别查看效果。

## 五、配置Vue开发环境

通过以下命令安装Vue模块：

    npm install --save vue

在`webpack.base.conf.js`的`module.rules`属性下，在**js和css的规则之前**新加一条规则，修改之后，`webpack.base.conf.js`内容如下：

    const path = require('path');
    const HtmlWebpackPlugin = require('html-webpack-plugin');
    const CleanWebpackPlugin = require('clean-webpack-plugin');

    module.exports = {
        entry: './src/main.js',
        output: {
            filename: 'bundle.[hash].js',
            path: path.join(__dirname, './dist')
        },
        module: {
            rules: [
                {
                    test: /\.vue$/,
                    use: 'vue-loader'
                },
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader']
                },
                {
                    test: /\.js$/,
                    use: 'babel-loader',
                    exclude: /node_modules/
                }
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './src/index.html'
            }),
            new CleanWebpackPlugin(['dist'])
        ]
    };

