# 一款破产版脚手架的开发

前些天一直在学习入门Webpack，后来尝试了自己搭建一下一个简单的React开发环境，后来就在想可不可以自己写一个简单的脚手架，以免每次搭建一个简单的开发环境都需要自己一个个的配置，这样很麻烦，使用`create-react-app`的话，配置一大堆可能不会用到的功能，比较冗余，所以自己写一个超级简化的脚手架，只处理ES6代码、JSX语法和css模块，这样就满足了基本的使用。

后来在开发的过程中又遇到了新的麻烦，比如使用Node的`child_process.spawn`方法调用npm命令时，会出现错误，因为在Windows环境下，实际上要调用`npm.cmd`，而非`npm`，在这里出现了问题，还有一些其他问题，后来正好看到了[@Jsonz](https://juejin.im/user/58dbb0b844d904006954ca8e)大神写的两篇文章：[探索 create-react-app 源码](https://juejin.im/post/5af452fd518825671c0e96e5)和[create-react-app 源码解析之react-scripts](https://juejin.im/post/5af98aaf518825426d2d4142)，于是也照着学习了一下`create-react-app`脚手架的源码，基本解决了一些问题，最终写出来了一个简（can）单（fei）的React脚手架，当然还有许许多多的不足，但是这个学习的过程值得我记录下来。

这篇文章记录了以下知识：

* 如何使用Node开发一个简单的脚手架。
* 如何发布你的npm模块并定制命令。

## 一、开发React脚手架

`create-react-app`是一个很成功的、功能完善的脚手架，考虑到了许多方面，比如使用`npm`或者`yarn`，比如`npm`和`Node`版本、日志的记录和打印等等诸多方面，开发环境搭建的也十分完善，除了基本的React开发之外，还考虑了图片、postcss、sass、graphQL等等模块的处理。由于能力有限，本文开发的脚手架只涵盖了基本模块的处理，不包含图片、sass……等等。

脚手架的作用主要是建立一个React开发的标准目录、并且配置好webpack打包工具，使得开发过程中可以直接在标准的目录上修改，然后通过配置好的命令启动本地服务器或者打包app。所以脚手架中应该包括一个模板文件夹，里面放入应该拷贝到用户工程文件夹的所有文件或目录。在使用脚手架时，先把模板文件夹中的内容拷贝到用户工程文件夹下，然后修改`package.json`配置文件，最后安装所有模块。这就是我开发的脚手架所完成的基本工作。

脚手架工程目录结构如下：

    ROOT
    │  .gitignore
    │  .npmignore
    │  LICENSE
    │  package-lock.json
    │  package.json
    │  README.md
    │
    ├─dist
    ├─package
    │      create-react.js
    │
    └─templates
        │  .babelrc
        │  .gitignore
        │  README.md
        │  webpack.base.conf.js
        │  webpack.dev.conf.js
        │  webpack.prod.conf.js
        │
        ├─dist
        └─src
            │  index.css
            │  index.html
            │  index.js
            │
            └─components
                    App.js

根据我的[前一篇文章](https://juejin.im/post/5afc29fa6fb9a07ab379a2ae)，搭建React开发环境，最小化的标准目录结构应该如下：

    ROOT
    │  .babelrc
    │  .gitignore
    │  README.md
    │  webpack.base.conf.js
    │  webpack.dev.conf.js
    │  webpack.prod.conf.js
    │
    ├─dist
    └─src
        │  index.css
        │  index.html
        │  index.js
        │
        └─components
                App.js

所以在脚手架根目录下的`templates`文件夹中应该包含以上文件，文件内的内容可以自由定制。

同样根据上一篇文章，需要安装的模块主要有：

    'webpack', 
    'webpack-cli', 
    'html-webpack-plugin', 
    'clean-webpack-plugin', 
    'webpack-dev-server', 
    'css-loader', 
    'webpack-merge', 
    'style-loader', 
    'babel-preset-env', 
    'babel-loader', 
    'babel-polyfill', 
    'babel-preset-react'

和

    'react',
    'react-dom'

第一部分只需要安装在开发环境（`npm i -D ...`），第二部分生产环境也要安装（`npm i --save ...`）。

那么接下来可以通过Node实现脚手架的开发了。

首先介绍一些有用的并且会用到的模块：

* `cross-spawn`：解决跨平台使用npm命令的问题的模块。
* `chalk`：实现控制台彩色文字输出的模块。
* `fs-extra`：实现了一些fs模块不包含的文件操（比如递归复制、删除等等）的模块。
* `commander`： 实现命令行传入参数预处理的模块。
* `validate-npm-package-name`：对于用户输入的工程名的可用性进行验证的模块。

首先，在代码中引入这些基本的模块：

    const spawn = require('cross-spawn');
    const chalk = require('chalk');
    const os = require('os');
    const fs = require('fs-extra');
    const path = require('path');
    const commander = require('commander');
    const validateProjectName = require('validate-npm-package-name');
    const packageJson = require('../package.json');

然后定义我们的模板复制函数：

    function copyTemplates() {
        try {
            if(!fs.existsSync(path.resolve(__dirname, '../templates'))) {
                console.log(chalk.red('Cannot find the template files !'));
                process.exit(1);
            }
            fs.copySync(path.resolve(__dirname, '../templates'), process.cwd());
            console.log(chalk.green('Template files copied successfully!'));
            return true;
        }
        catch(e) {
            console.log(chalk.red(`Error occured: ${e}`))
        }
    }

fs模块首先检测模板文件是否存在（防止被用户删除），如果存在则通过fs的同步拷贝方法（copySync）拷贝到脚手架的当前工作目录（即`process.cwd()`），如果不存在则弹出错误信息，随后使用[退出码](http://nodejs.cn/api/process.html#process_exit_codes)1退出进程。

随后定义`package.json`的处理函数;

    function generatePackageJson() {
        let packageJson = {
            name: projectName,
            version: '1.0.0',
            description: '',
            scripts: {
                start: 'webpack-dev-server --open --config webpack.dev.conf.js',
                build: 'webpack --config webpack.prod.conf.js'
            },
            author: '',
            license: ''
        };
        try {
            fs.writeFileSync(path.resolve(process.cwd(), 'package.json'), JSON.stringify(packageJson));
            console.log(chalk.green('Package.json generated successfully!'));
        }
        catch(e) {
            console.log(chalk.red(e))
        }
    }

可以看出先是定义了一个JavaScript Object，然后修改属性之后通过fs模块将其JSON字符串写入到了`package.json`文件中，实现了`package.json`的生成。

最后安装所有的依赖，分为devDependencies和dependencies：

    function installAll() {
        console.log(chalk.green('Start installing ...'));
        let devDependencies = ['webpack', 'webpack-cli', 'html-webpack-plugin', 'clean-webpack-plugin', 'webpack-dev-server', 'css-loader', 'webpack-merge', 'style-loader', 'babel-preset-env', 'babel-loader', 'babel-polyfill', 'babel-preset-react'];
        let dependencies = ['react', 'react-dom'];
        const child = spawn('cnpm', ['install', '-D'].concat(devDependencies), { 
            stdio: 'inherit' 
        });
        
        child.on('close', function(code) {
            if(code !== 0) {
                console.log(chalk.red('Error occured while installing dependencies!'));
                process.exit(1);
            }
            else {
                const child = spawn('cnpm', ['install', '--save'].concat(dependencies), {
                    stdio: 'inherit'
                })
                child.on('close', function(code) {
                    if(code !== 0) {
                        console.log(chalk.red('Error occured while installing dependencies!'));
                        process.exit(1);
                    }
                    else {
                        console.log(chalk.green('Installation completed successfully!'));
                        console.log();
                        console.log(chalk.green('Start the local server with : '))
                        console.log();
                        console.log(chalk.cyan('    npm run start'))
                        console.log();
                        console.log(chalk.green('or build your app via :'));
                        console.log();
                        console.log(chalk.cyan('    npm run build'));
                    }
                })
            }
        });
    }

函数中，通过`cross-spawn`执行了`cnpm`的安装命令，值得注意的是其配置项：

    { 
        stdio: 'inherit' 
    }

代表将子进程的输出管道连接到父进程上，及父进程可以自动接受子进程的输出结果,详情见[options.stdio](http://nodejs.cn/api/child_process.html#child_process_options_stdio)。


通过`commander`模块实现命令行参数的预处理;

    const program = commander
    .version(packageJson.version)
    .usage(' [options]')
    .arguments('<project-name>')
    .action(name => {
        projectName = name;
    })
    .allowUnknownOption()
    .parse(process.argv);

其中，`version`方法定义了`create-react-application -V`的输出结果，`usage`定义了命令行里的用法，`arguments`定义了程序所接受的默认参数，然后在`action`函数回调中处理了这个默认参数，`allowUnknownOption`表示接受多余参数，`parse`表示把多余未解析的参数解析到`process.argv`中去。

最后是调用三个方法实现React开发环境的搭建：

    if(projectName == undefined) {
        console.log(chalk.red('Please pass the project name while using create-react!'));
        console.log(chalk.green('for example:'))
        console.log();
        console.log('   create-react-application ' + chalk.yellow('<react-app>'));
    }
    else {
        const validateResult = validateProjectName(projectName);
        if(validateResult.validForNewPackages) {
            copyTemplates();
            generatePackageJson();
            installAll();
            //console.log(chalk.green(`Congratulations! React app has been created successfully in ${process.cwd()}`));
        }
        else {
            console.log(chalk.red('The project name given is invalid!'));
            process.exit(1);
        }
    }

如果接受的工程名为空，那么弹出警告。如果不为空，就验证工程名的可用性，如果不可用，就弹出警告并且退出进程，否则调用之前定义的三个主要函数，完成环境的搭建。

截止到此，使用该程序的方式仍然是`node xxx.js --parameters`的方式，我们需要自定义一个命令，并且最好将程序上传到npm，便于使用。

## 二、定义你的命令并且发布npm包

实现自定义命令并发布npm模块只需要以下几步：

* 修改入口文件，头部添加以下两句：

        #!/usr/bin/env node
        'use strict'

    第二行也一定不能少！

* 修改`package.json`，添加`bin`属性：

        // package.json
        {
            "bin": {
                "create-react-application": "package/create-react.js"
            }
        }

* 执行以下命令：

        npm link

* [注册npm账户](https://www.npmjs.com/signup)（如已经注册则可以忽略）。

* 执行以下命令：

        npm adduser
    
    并输入账户密码。

* 执行以下命令：

        npm publish
    
    接下来就可以收到发布成功的邮件啦！


如果要更新你的npm模块，执行以下步骤：

* 使用一下命令更新你的版本号：

        npm version x.x.x

* 再使用以下命令发布;

        npm publish

执行完以上步骤之后，就可以在npm下载你的模块啦！

## 三、FQA

### （1）关于`#!/usr/bin/env node`

这是Unix系操作系统中的一种写法，名字叫做`Shebang`或者`Hashbang`等等。在[Wikipedia的解释](https://en.wikipedia.org/wiki/Shebang_(Unix))中，把这一行代码写在脚本中，使得操作系统把脚本当做可执行文件执行时，会找到对应的程序执行（比如此文中的node），而这段代码本身会被解释器所忽略。

### （2）关于`npm link`

在npm官方文档的解释中，`npm link`的执行，是一个两步的过程。当你在你的包中使用`npm link`时，会将全局文件夹：`{prefix}/lib/node_modules/<package>`链接到执行`npm link`的文件夹，同样也会将执行`npm link`命令的包中的所有可执行文件链接到全局文件夹`{prefix}/bin/{name}`中。

此外，`npm link project-name`会将全局安装的`project-name`模块链接到执行`npm link`命令的当前文件夹的`node_modules`中。

根据npm官方文档，prefix的值可为：

* /usr/local    （大部分系统中）
* %AppData%\npm （Windows中）

具体参考：[prefix configuration](https://docs.npmjs.com/files/folders#prefix-configuration)和[npm link](https://docs.npmjs.com/cli/link)

## 四、简单尝试

本文所开发的脚手架已经上传到了npm，可以通过以下步骤查看实际效果：

* 安装`create-react-application`

        npm i -D create-react-application
    
    或者

        npm i -g create-react-application

* 使用`create-react-application`

        create-react-application <project-name>

源码已经上传到了[GitHub](https://github.com/zhongdeming428/create-react-application)，欢迎大家一起哈啤（#手动滑稽）。

此外文中还有许多不足，比如关于`npm link`的解释我也还不是很清楚，欢迎大家补充指教！

## 五、参考文章

* [npm link 命令的作用浅析](https://blog.csdn.net/juhaotian/article/details/78672390)
* [prefix configuration](https://docs.npmjs.com/files/folders#prefix-configuration)
* [npm link](https://docs.npmjs.com/cli/link)
* [基于Webpack搭建React开发环境](https://juejin.im/post/5afc29fa6fb9a07ab379a2ae)
* [探索 create-react-app 源码](https://juejin.im/post/5af452fd518825671c0e96e5)
* [npm 发布 packages](https://zhuanlan.zhihu.com/p/31901377)