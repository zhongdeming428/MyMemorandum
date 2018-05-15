# 入门Webpack笔记

准备了挺久，一直想要好好深入了解一下Webpack，之前一直嫌弃Webpack麻烦，偏向于Parcel这种零配置的模块打包工具一些，但是实际上还是Webpack比较靠谱，并且Webpack功能更加强大。由于上一次学习Webpack的时候并没有了解过Node.js，所以很多时候真的感觉无能为力，连个`__dirname`都觉得好复杂，学习过Node.js之后再来学习Webpack，就会好理解很多，这一次算是比较深入的了解一下Webpack，争取以后能够脱离`create-react-app`或者`Vue-Cli`这种脚手架工具，或者自己也能够写一套脚本自动配置开发环境。

由于写这篇笔记的时候，Webpack已经发行了最新的Webpack 4.0，所以这篇笔记就算是学习Webpack 4.0的笔记吧，笔者所用版本是**webpack 4.8.3**，另外使用Webpack 4.x的命令行需要安装单独的命令行工具，笔者所使用的Webpack命令行工具是**webpack-cli 2.1.3**，学习的时候可以按照这个要求部署开发环境。

此外，在学习webpack之前，你最好对ES6、Node.js有一定的了解，最好使用过一个脚手架。

## 一、核心概念

Webpack具有四个核心的概念，想要入门Webpack就得先好好了解这四个核心概念。它们分别是`Entry（入口）`、`Output（输出）`、`loader`和`Plugins（插件）`。接下来详细介绍这四个核心概念。

### 1.Entry

Entry是Webpack的入口起点指示，它指示webpack应该从哪个模块开始着手，来作为其构建内部依赖图的开始。可以在配置文件（webpack.config.js）中配置entry属性来指定一个或多个入口点，**默认为`./src`**（webpack 4开始引入默认值）。

**具体配置方法：**

    entry: string | Array<string>

前者一个单独的string是配置单独的入口文件，配置为后者（一个数组）时，是多文件入口。

另外还可以**通过对象语法进行配置**：

    entry: {
        [entryChunkName]: string | Array<string>
    }

比如：

    //webpack.config.js
    module.exports = {
        entry: {
            app: './app.js',
            vendors: './vendors.js'
        }
    };

以上配置表示从app和vendors属性开始打包构建依赖树，这样做的好处在于分离自己开发的业务逻辑代码和第三方库的源码，因为第三方库安装后，源码基本就不再变化，这样分开打包有利于提升打包速度，减少了打包文件的个数，`Vue-Cli`采取的就是这种分开打包的模式。但是为了支持拆分代码更好的DllPlugin插件，以上语法可能会被抛弃。

### 2.Output

Output属性告诉webpack在哪里输出它所创建的bundles，也可指定bundles的名称，**默认位置为`./dist`**。整个应用结构都会被编译到指定的输出文件夹中去，最基本的属性包括`filename`（文件名）和`path`（输出路径）。

值得注意的是，即是你配置了多个入口文件，你也只能有一个输出点。

**具体配置方法：** 

    output: {
        filename: 'bundle.js',
        path: '/home/proj/public/dist'
    }

值得注意的是,`output.filename`必须是绝对路径，如果是一个相对路径，打包时webpack会抛出异常。

**多个入口时，使用下面的语法输出多个bundle：**

    // webpack.config.js
    module.exports = {
        entry: {
            app: './src/app.js',
            vendors: './src/vendors.js'
        },
        output: {
            filename: '[name].js',
            path: __dirname + '/dist'
        }
    }

以上配置将会输出打包后文件app.js和vendors.js到`__dirname + '/dist'`下。

### 3.Loaders

loader可以理解为webpack的编译器，它使得webpack可以处理一些非JavaScript文件，比如png、csv、xml、css、json等各种类型的文件，使用合适的loader可以让JavaScript的import导入非JavaScript模块。JavaScript只认为JavaScript文件是模块，而webpack的设计思想即万物皆模块，为了使得webpack能够认识其他“模块”，所以需要loader这个“编译器”。

webpack中配置loader有两个目标：
* （1）test属性：标志有哪些后缀的文件应该被处理，是一个正则表达式。
* （2）use属性：指定test类型的文件应该使用哪个loader进行预处理。

比如webpack.config.js:

    module.exports = {
        entry: '...',
        output: '...',
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: 'css-loader'
                }
            ]
        }
    };

该配置文件指示了所有的css文件在`import`时都应该经过css-loader处理，经过css-loader处理后，可以在JavaScript模块中直接使用`import`语句导入css模块。但是使用`css-loader`的前提是先使用npm安装`css-loader`。

此处需要注意的是定义loaders规则时，不是定义在对象的rules属性上，而是定义在module属性的rules属性中。

**配置多个loader**：

有时候，导入一个模块可能要先使用多个loader进行预处理，这时就要对指定类型的文件配置多个loader进行预处理，配置多个loader，把use属性赋值为数组即可，webpack会按照数组中loader的先后顺序，使用对应的loader依次对模块文件进行预处理。

    {
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: [
                        {
                            loader: 'style-loader'
                        },
                        {
                            loader: 'css-loader'
                        }
                    ]
                }
            ]
        }
    }

此外，还可以使用内联方式进行loader配置：

    import Styles from 'style-loader!css-loader?modules!./style.css'

但是这不是推荐的方法，请尽量使用`module.rules`进行配置。

### 4.Plugins

loader用于转换非JavaScript类型的文件，而插件可以用于执行范围更广的任务，包括打包、优化、压缩、搭建服务器等等，功能十分强大。要是用一个插件，一般是先使用npm包管理器进行安装，然后在配置文件中引入，最后将其实例化后传递给plugins数组属性。

插件是webpack的支柱功能，目前主要是解决loader无法实现的其他许多复杂功能，**通过`plugins`属性使用插件：**

    // webpack.config.js
    const webpack = require('webpack');
    module.exports = {
        plugins: [
            new webpack.optimize.UglifyJsPlugin()
        ]
    }

向plugins属性传递实例数组即可。

### 5.Mode

模式（Mode）可以通过配置对象的`mode`属性进行配置，主要值为`production`或者`development`。两种模式的区别在于一个是为生产环境编译打包，一个是为了开发环境编译打包。生产环境模式下，webpack会自动对代码进行压缩等优化，省去了配置的麻烦。

学习完以上基本概念之后，基本也就入门webpack了，因为webpack的强大就是建立在这些基本概念之上，利用webpack多样的loaders和plugins，可以实现强大的打包功能。

## 二、基本配置

按照以下步骤实现webpack简单的打包功能：

* （1）建立工程文件夹，位置和名称随意，并将cmd或者git bash的当前路径切换到工程文件夹。
* （2）安装webpack和webpack-cli到开发环境：

        npm install webpack webpack-cli --save-dev

* （3）在工程文件夹下建立以下文件和目录：

    * /src
        * index.js
        * index.css
    * /dist
        * index.html
    * webpack.config.js

* （4）安装`css-loader`：

        npm install css-loader --save-dev

* （5）配置`webpack.config.js`：

        module.exports = {
            mode: 'development',
            entry: './src/index.js',
            output: {
                path: __dirname + '/dist',
                filename: 'bundle.js'
            },
            module: {
                rules: [
                    {
                        test: /\.css$/,
                        use: 'css-loader'
                    }
                ]
            }
        };

* （6）在`index.html`中引入`bundle.js`：

        <!--index.html-->
        <html>
            <head>
                <title>Test</title>
                <meta charset='utf-8'/>
            </head>
            <body>
                <h1>Hello World!</h1>
            </body>
            <script src='./bundle.js'></script>
        </html>

* （7）在`index.js`中添加：

        import './index.css';
        console.log('Success!');

* （8）在工程目录下，使用以下命令打包：

        webpack

    查看输出结果，可以双击`/dist/index.html`查看有没有报错以及控制台的输出内容。

## 三、如何通过Node脚本使用webpack？

webpack提供Node API，方便我们在Node脚本中使用webpack。

基本代码如下：

    // 引入webpack模块。
    const webpack = require('webpack');
    // 引入配置信息。
    const config = require('./webpack.config');
    // 通过webpack函数直接传入config配置信息。
    const compiler = webpack(config);
    // 通过compiler对象的apply方法应用插件，也可在配置信息中配置插件。
    compiler.apply(new webpack.ProgressPlugin());
    // 使用compiler对象的run方法运行webpack，开始打包。
    compiler.run((err, stats) => {
        if(err) {
            // 回调中接收错误信息。
            console.error(err);
        }
        else {
            // 回调中接收打包成功的具体反馈信息。
            console.log(stats);
        }
    });

## 动态生成index.html和bundle.js

动态生成是啥？动态生成就是指在打包后的模块名称内插入hash值，使得每一次生成的模块具有不同的名称，而index.html之所以要动态生成是因为每次打包生成的模块名称不同，所以在HTML文件内引用时也要更改script标签，这样才能保证每次都能引用到正确的JavaScript文件。

**为什么要添加hash值？**

之所以要动态生态生成bundle文件，是为了防止浏览器缓存机制阻碍文件的更新，在每次修改代码之后，文件名中的hash都会发生改变，强制浏览器进行刷新，获取当前最新的文件。

**如何添加hash到bundle文件中？**

只需要在设置output时，在`output.filename`中添加`[hash]`到文件名中即可，比如：

    // webpack.config.js
    module.exports = {
        output: {
            path: __dirname + '/dist',
            filename: '[name].[hash].js'
        }
    };

**现在可以动态生成bundle文件了，那么如何动态添加bundle到HTML文件呢？**

每次打包bundle文件之后，其名称都会发生更改，每次人为地修改对应的HTML文件以添加JavaScript文件引用实在是令人烦躁，这时需要使用到强大的webpack插件了，有一个叫`html-webpack-plugin`的插件，可以自动生成HTML文件。安装到开发环境：

    npm install html-webpack-plugin --save-dev

安装之后，在`webpack.config.js`中引入，并添加其实例到插件属性（plugins）中去：

    // webpack.config.js
    const HtmlWebpackPlugin = require('html-webpack-plugin');
    module.exports = {
        // other configs ...
        plugins: [
            new HtmlWebpackPlugin({
                // options配置
            })
        ]
    };

这时就可以看到每次生成bundle文件之后，都会被动态生成对应的html文件。

在上面的代码中还可以看到`HtmlWebpackPlugin`插件的构造函数还可以传递一个配置对象作为参数。比较有用的配置属性有`title`（指定HTML中title标签的内容，及网页标题）、`template`（指定模板HTML文件）等等，其他更多具体参考信息请访问：[Html-Webpack-Plugin](https://github.com/jantimon/html-webpack-plugin#options)

## 四、清理/dist文件夹

由于每次生成的JavaScript文件都不同名，所以新的文件不会覆盖旧的文件，而旧的文件一只会存在于`/dist`文件夹中，随着编译次数的增加，这个文件夹会越来越膨胀，所以应该想办法每次生成新的bundle文件之前清理`/dist`文件夹，以确保文件夹的干净整洁，有以下两个较好的处理办法：

**如果你是Node脚本调用webpack打包：**

如果通过Node API调用webpack进行打包，可以在打包之前直接使用Node的fs模块删除`/dist`文件夹中的所有文件：

    const webpack = require('webpack');
    const config = require('./webpack.config');
    const fs = require('fs');
    const compiler = webpack(config);

    var deleteFolderRecursive = function(path) {
        if (fs.existsSync(path)) {
            fs.readdirSync(path).forEach(function(file, index){
                var curPath = path + "/" + file;
                if (fs.lstatSync(curPath).isDirectory()) { // recurse
                    deleteFolderRecursive(curPath);
                } else { // delete file
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(path);
        }
    };

    deleteFolderRecursive(__dirname + '/dist');
    compiler.run((err, stats) => {
        if(err) {
            console.error(err);
        }
        else {
            console.log(stats.hash);
        }
    });

可以看到在调用`compiler.run`打包之前，先使用自定义的`deleteFolderRecursive`方法删除了`/dist`目录下的所有文件。

**如果你使用webpack-cli进行打包**

这时候就得通过webpack的插件完成这个任务了，用到的插件是`clean-webpack-plugin`。

安装：

    npm install clean-webpack-plugin --save-dev

然后在`webpack.config.js`文件中添加插件：

    // webpack.config.js
    const CleanWebpackPlugin = require('clean-webpack-plugin');
    module.exports = {
        plugins: [
            new CleanWebpackPlugin(['dist'])
        ]
    };

之后再次打包，你会发现之前的打包文件全部被删除了。

## 五、搭建开发环境

开发环境与生产环境存在许多的差异，生产环境更讲究生产效率，因此代码必须压缩、精简，必须去除一些生产环境并不需要用到的调试工具，只需要提高应用的效率和性能即可。开发环境更讲究调试、测试，为了方便开发，我们需要搭建一个合适的开发环境。

### （一）使用source maps进行调试

**为何要使用source maps？**

因为webpack对源代码进行打包后，会对源代码进行压缩、精简、甚至变量名替换，在浏览器中，无法对代码逐行打断点进行调试，所有需要使用source maps进行调试，它使得我们在浏览器中可以看到源代码，进而逐行打断点调试。

**如何使用source maps？**

在配置中添加`devtool`属性，赋值为`source-map`或者`inline-source-map`即可，后者报错信息更加具体，会指示源代码中的具体错误位置，而`source-map`选项无法指示到源代码中的具体位置。

### （二）使用开发工具

每次写完代码保存之后还需要手动输入命令或启动Node脚本进行编译是一件令人不胜其烦的事情，选择一下工具可以简化开发过程中的工作：

* 启用watch模式
* 使用webpack-dev-server
* 使用webpack-dev-middleware

**（1）使用watch模式**

在使用`webpack-cli`进行打包时，通过命令`webpack --watch`即可开启watch模式，进入watch模式之后，一旦依赖树中的某一个模块发生了变化，webpack就会重新进行编译。

**（2）使用webpack-dev-server**

使用过`create-react-app`或者`Vue-Cli`这种脚手架的童鞋都知道，通过命令`npm run start`即可建立一个本地服务器，并且webpack会自动打开浏览器打开你正在开发的页面，并且一旦你修改了文件，浏览器会自动进行刷新，基本做到了所见即所得的效果，比webpack的watch模式更加方便给力。

使用方法：

* ① 安装webpack-dev-server：

        npm install --save-dev webpack-dev-server

* ② 修改配置文件，添加devServer属性：

        // webpack.config.js
        module.exports = {
            devServer: {
                contentBase: './dist'
            }
        };

* ③ 添加命令属性到`package.json`：

        // package.json
        {
            "scripts": {
                "start": "webpack-dev-server --open"
            }
        }

* ④ 运行命令

        npm run start
    
    可以看到浏览器打开后的实际效果，尝试修改文件，查看浏览器是否实时更新。

此外还可以再devServer属性下指定更多的配置信息,比如开发服务器的端口、热更新模式、是否压缩等等，具体查询：[Webpack](https://webpack.js.org/configuration/dev-server/#devserver)

通过Node API使用`webpack-dev-server`：

    'use strict';

    const Webpack = require('webpack');
    const WebpackDevServer = require('../../../lib/Server');
    const webpackConfig = require('./webpack.config');

    const compiler = Webpack(webpackConfig);
    const devServerOptions = Object.assign({}, webpackConfig.devServer, {
        stats: {
            colors: true
        }
    });
    const server = new WebpackDevServer(compiler, devServerOptions);

    server.listen(8080, '127.0.0.1', () => {
        console.log('Starting server on http://localhost:8080');
    });

**（3）使用webpack-dev-middleware**

`webpack-dev-middleware`是一个比`webpack-dev-server`更加基础的插件，`webpack-dev-server`也使用了这个插件，所以可以理解为`webpack-dev-middleware`的封装层次更低，使用起来更加复杂，但是低封装性意味着较高的自定义性，使用`webpack-dev-middleware`可以定义更多的设置来满足更多的开发需求，它基于express模块。

这一块不做过多介绍，因为`webpack-dev-server`已经能够应付大多数开发场景，不用再设置更多的express属性了，想要详细了解的童鞋可以了解：[使用 webpack-dev-middleware](https://webpack.docschina.org/guides/development/#使用-webpack-dev-server)

**（4）设置IDE**

某些IDE具有安全写入功能，导致开发服务器运行时IDE无法保存文件，此时需要进行对应的设置。

具体参考：[调整文本编辑器](https://webpack.docschina.org/guides/development/#调整文本编辑器)

### （三）热模块替换

热模块替换（Hot Module Replacement，HMR），代表在应用程序运行过程中替换、添加、删除模块，浏览器无需刷新页面即可呈现出相应的变化。

**使用方法：**

* （1）在devServer属性中添加hot属性并赋值为true：

        // webpack.config.js
        module.exports = {
            devServer: {
                hot: true
            }
        }

* （2）引入两个插件到webpack配置文件：

        // webpack.config.js
        const webpack = require('webpack');
        module.exports = {
            devServer: {
                hot: true
            },
            plugins: [
                new webpack.NamedModulesPlugin(),
                new webpack.HotModuleReplacementPlugin()
            ]
        };

* （3）在**入口文件底部**添加代码，使得在所有代码发生变化时，都能够通知webpack：

        if (module.hot) {
            module.hot.accept('./print.js', function() {
                console.log('Accepting the updated intMe module!');
                printMe();
            })
        }

热模块替换比较难以掌控，容易报错，推荐在不同的开发配置下使用不同的loader简化HMR过程。具体参考：[其他代码和框架](https://webpack.docschina.org/guides/hot-module-replacement/#其他代码和框架)

## 六、搭建生产环境

生产环境要求代码精简、性能优异，而开发要求开发快速、测试方便，代码不要求简洁，所以两种环境下webpack打包的目的也不相同，所以最好将两种环境下的配置文件分开来。对于分开的配置文件，在使用webpack时还是要对其中的配置信息进行整合，`webpack-merge`是一个不错的整合工具（Vue-Cli也有使用到）。

**使用方法：**

* （1）安装webpack-merge：

        npm install webpack-merge --save-dev

* （2）建立三个配置文件：

    * webpack.base.conf.js
    * webpack.dev.conf.js
    * webpack.prod.conf.js

    其中，`webpack.base.conf.js`表示最基础的配置信息，开发环境和生产环境都需要设置的信息，比如`entry`、`output`、`module`等。在另外两个文件中配置一些对应环境下特有的信息，然后通过`webpack-merge`模块与`webpack.base.conf.js`整合。

* （3）添加npm scripts：

        // package.json
        {
            "scripts": {
                "start": "webpack-dev-server --open --config webpack.dev.conf.js",
                "build": "webpack --config webpack.prod.conf.js"
            }
        }
    
此外，建议设置mode属性，因为生产环境下会自动开启代码压缩，免去了配置的麻烦。

## 七、性能优化

### TreeShaking

TreeShaking表示移除JavaScript文件中的未使用到的代码，webpack 4增强了这一部分的功能。通过配置package.json的sideEffects属性，可以指定哪些文件可以移除多余代码。如果sideEffects设置为false，那么表示文件中的未使用代码可以放心移除，没有副作用。如果有些文件中的冗余代码不能被移除，那么可以设置sideEffects属性为一个数组，数组内容为文件的路径字符串。

指定无副作用的文件之后，设置mode为"production"，再次构建代码，可以发现未使用到的代码已经被移除。

### Tips

* 在`module.rules`属性中，设置include属性以指定哪些文件需要被loader处理。
* 只使用必要的loader。
* 保持最新版本。
* 减少项目文件数。

## 八、通过webpack构建PWA应用

渐进式网络应用程序(Progressive Web Application - PWA)，是一种可以提供类似于原生应用程序(native app)体验的网络应用程序(web app)，在离线(offline)时应用程序能够继续运行功能，这是通过 Service Workers 技术来实现的。PWA是最近几年比较火的概念，它的核心是由service worker技术实现的在客户浏览器与服务器之间搭建的一个代理服务器，在网络畅通时，客户浏览器会通过service worker访问服务器，并且缓存注册的文件；在网络断开时，浏览器会访问service worker这个代理服务器，使得在网络断开的情况下，页面还是能够访问，实现了类似原生应用的网站开发。`create-react-app`已经实现了PWA开发的配置。

下面介绍如何通过webpack快速开发PWA。

* （1）安装插件`workbox-webpack-plugin`：

        npm install workbox-webpack-plugin --save-dev
    
* （2）在配置文件中引入该插件：

        // webpack.config.js
        const WorkboxPlugin = require('workbox-webpack-plugin');
        module.exports = {
            plugins: [
                new WorkboxPlugin.GenerateSW({
                    clientsClaim: true,
                    skipWaiting: true
                })
            ]
        };

* （3）使用webpack进行编译，打包出service-worker.js
* （4）在入口文件底部注册service worker：

        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/service-worker.js').then(registration => {
                    console.log('SW registered: ', registration);
                }).catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
            });
        }

* （5）打开页面，进行调试：

        npm run start

* （6）打开浏览器调试工具，查看控制台的输出，如果输出“SW registered: ... ...”，表示注册service worker成功，接下来可以断开网络，或者关闭服务器，再次刷新，可以看到页面仍然可以显示。

## 九、参考文章

* [webpack官方中文文档](https://webpack.docschina.org/)

## 十、总结

webpack确实是一个功能强大的模块打包工具，丰富的loader和plugin使得其功能多而强。学习webpack使得我们可以自定义自己的开发环境，无需依赖`create-react-app`和`Vue-Cli`这类脚手架，也可以针对不同的需求对代码进行不同方案的处理。这篇笔记还只是一篇入门的笔记，如果要真正的构建较为复杂的开发环境和生产环境，还需要了解许多的loader和plugin，好在webpack官网提供了所有的说明，可以给用户提供使用指南：

* [webpack loaders](loaders)
* [webpack plugins](https://webpack.js.org/plugins/)

阅读脚手架的源码也有助于学习webpack，今后应该还有进行这方面的学习，但是答辩即将到来，不知道毕业之前还有没有机会^_^。