自从工作之后，就已经很久没有写过博客了。时间被分割得比较碎，积累了一段时间的学习成果，才写下了这篇博客。

之前有写过 Webpack4 的文章，但是都比较偏入门，唯一的一篇实战篇 —— [基于Webpack搭建React开发环境](https://juejin.im/post/5afc29fa6fb9a07ab379a2ae)，也是比较简单的，没有涉及到 CSS 抽取，第三方库打包等功能，这篇文章相对而言比较深入。但由于作者水平有限，难免存在谬误之处，欢迎大家指正。

还有没入门的童鞋可以参考我之前的文章：

  * [浅入浅出webpack](https://juejin.im/post/5afa9cd0f265da0b981b9af9)
  * [基于Webpack搭建React开发环境](https://juejin.im/post/5afc29fa6fb9a07ab379a2ae)

## 一、初始化项目

在命令行中敲入如下命令：

    mkdir Webpack-Vue && cd Webpack-Vue && npm init -y
  
然后你就可以在你的当前路径下看到一个叫 `Webpack-Vue` 的文件夹，里面有一个包含默认信息的 `package.json` 文件，打开并修改这个文件的一些内容。

然后我们在项目文件夹中创建以下几个文件夹：

  * dist
  * src
  * build

其中，dist 用于存放 Webpack 打包后的项目文件、src 用于存放你的源代码文件、build 用于存放 Webpack 打包相关的配置文件。

在 src 下，创建入口文件 `index.js`。

其他配置性文件根据你自己的喜好来添加了，比如 `.gitignore` 文件等。

## 二、安装 Webpack

要使用 `Webpack`，第一步当然是先安装。使用以下命令进行安装：

    npm i webpack webpack-cli -D

然后你就可以看到你的项目文件夹中多了一个 `node_modules` 文件夹，然后 `package.json` 文件中多了一个 `devDependencies` 属性。里面包含了安装的依赖名称和依赖版本，现在暂时还只有 `webpack` 和 `webpack-cli`。

## 三、配置最基本的 Webpack

这一节我们将着手配置一个具有最基本打包功能的项目，从 `src/index.js` 开始对项目进行打包。

为了项目结构更加科学合理，我们把所有的 Webpack 配置相关的文件都存放在了 `build` 目录中。

进入 `build` 文件夹，然后创建以下几个文件：

  * webpack.base.conf.js
  * webpack.dev.conf.js
  * webpack.prod.conf.js
  * build.js

其中，`webpack.base.conf.js` 是最基础的打包配置，是开发环境和生产环境都要用到的配置。`webpack.dev.conf.js` 就是在开发环境要使用的配置。`webpack.prod.conf.js` 就是在生产环境要使用的配置了。`build.js` 是通过 Node 接口进行打包的脚本。

接下来我们在对应的文件中写入最基本的配置信息。

### （1）webpack.base.conf.js

首先写最基本的配置信息：

    const path = require('path');
    module.exports = {
      entry: {
        bundle: path.resolve(__dirname, '../src/index.js')
      },
      output: {
        path: '../dist/',
        filename: [name].[hash].js
      },
      module: {
        rules: [

        ]
      },
      plugins: [

      ]
    };