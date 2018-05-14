# 入门Webpack笔记

准备了挺久，一直想要好好深入了解一下Webpack，之前一直嫌弃Webpack麻烦，偏向于Parcel这种零配置的模块打包工具一些，但是实际上还是Webpack比较靠谱，并且Webpack功能更加强大。由于上一次学习Webpack的时候并没有了解过Node.js，所以很多时候真的感觉无能为力，连个`__dirname`都觉得好复杂，学习过Node.js之后再来学习Webpack，就会好理解很多，这一次算是比较深入的了解一下Webpack，争取以后能够脱离`create-react-app`或者`Vue-Cli`这种脚手架工具，或者自己也能够写一套脚本自动配置开发环境。

由于写这篇笔记的时候，Webpack已经发行了最新的Webpack 4.0，所以这篇笔记就算是学习Webpack 4.0的笔记吧，笔者所用版本是**webpack 4.8.3**，另外使用Webpack 4.x的命令行需要安装单独的命令行工具，笔者所使用的Webpack命令行工具是**webpack-cli 2.1.3**，学习的时候可以按照这个要求部署开发环境。

此外，在学习webpack之前，你最好对ES6、Node.js有一定的了解，最好使用过一个脚手架。

## 核心概念

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
        <script src='./bundle.js'/>

* （7）在工程目录下，使用以下命令打包：

        webpack

    查看输出结果，可以双击`/dist/index.html`查看有没有报错。

## 解决一些问题


