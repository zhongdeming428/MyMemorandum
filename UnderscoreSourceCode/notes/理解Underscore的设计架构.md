# 理解Underscore的设计架构

在一个多月的毕业设计之后，我再次开始了Underscore的源码阅读学习，断断续续也写了好些篇文章了，基本把一些比较重要的或者个人认为有营养的函数都解读了一遍，所以现在学习一下Underscore的整体架构。我相信很多程序员都会有一个梦想，那就是可以写一个自己的模块或者工具库，那么我们现在就来学习一下如果我们要写一个自己的Underscore，我们该怎么写？

大致的阅读了一下Underscore源码，可以发现其基本架构如下：

## 1 定义变量

在ES6之前，JavaScript开发者是无法通过let、const关键字模拟块作用域的，只有函数内部的变量会被认为是私有变量，在外部无法访问，所以大部分框架或者工具库的模式都是在立即执行函数里面定义一系列的变量，完成框架或者工具库的构建，这样做的好处就是代码不会污染全局作用域。Underscore也不例外，它也使用了经典的立即执行函数的模式：

    (function() {
        // ...
    }())

此外，Underscore采用了经典的构造器模式，这使得用户可以通过`_(obj).function()`的方式使用Underscore的接口，因为任意创建的Underscore对象都具有原型上的所有方法。那么代码形式如下：

    (function() {
        var _ = function() {
            // ...
        };
    }())

_是一个函数，但是在JavaScript中，函数也是一个对象，所以我们可以给_添加一系列属性，即Underscore中的一系列公开的接口，以便可以通过`_.function()`的形式调用这些接口。代码形式如下：

    (function() {
        var _ = function() {
            // ...
        };
        _.each = function() {
            // ...
        };
        // ...
    }())

_变量可以当做构造器构造一个Underscore对象，这个对象是标准化的，它具有规定的属性，比如：`_chain`、`_wrapped`以及所有Underscore的接口方法。Underscore把需要处理的参数传递给_构造函数，构造函数会把这个值赋给所构造对象的`_wrapped`属性，这样做的好处就是在之后以`_(obj).function()`形式调用接口时，可以直接到`_wrapped`属性中寻找要处理的值。这就使得在定义_构造函数的时候，需要对传入的参数进行包裹，此外还要防止多层包裹，以及为了防止增加new操作符，需要在内部进行对象构建，代码形式如下：

    (function() {
        var _ = function(obj) {
            // 防止重复包裹的处理，如果obj已经是_的实例，那么直接返回obj。
            if(obj instanceof _) {
                return obj;
            }
            // 判断函数中this的指向，如果this不是_的实例，那么返回构造的_实例。
            // 这里是为了不使用new操作符构造新对象，很巧妙，因为在通过new使用构造函数时，函数中的this会指向新构造的实例。
            if(!(this instanceof _)) {
                return new _();
            }
            // 
            this._wrapped = obj;
        };
        _.each = function() {
            // ...
        };
        // ...
    }())

这一段的处理很关键也很巧妙。

## 2 导出变量
既然我们是在立即执行函数内定义的变量，那么_的生命周期也只存在于匿名函数的执行阶段，一旦函数执行完毕，这个变量所存储的数据也就被释放掉了，所以不导出变量的话实际上这段代码相当于什么都没做。那么该如何导出变量呢？我们知道函数内部可以访问到外部的变量，所以只要把变量赋值给外部作用域或者外部作用域变量就行了。通常为了方便实用，把变量赋值给全局作用域，不同的环境全局作用域名称不同，浏览器环境下通常为window，服务器环境下通常为global，根据不同的使用环境需要做不同的处理，比如浏览器环境下代码形式如下：

    (function() {
        var _ = function() {
            // ...
        };
        _.each = function() {
            // ...
        };
        // ...
        window._ = _;
    }())

这样处理之后，在全局作用域就可以直接通过_使用Underscore的接口了。

但是仅仅这样处理还不够，因为Underscore面向环境很多，针对不同的环境要做不同的处理。接下来看Underscore源码。

首先，Underscore通过以下代码根据不同的环境获取不同的全局作用域：

    //获取全局对象，在浏览器中是self或者window，在服务器端（Node）中是global。
	//在浏览器控制台中输入self或者self.self，结果都是window。
	var root = typeof self == 'object' && self.self === self && self || typeof global == 'object' && global.global === global && global || this || {};
    root._ = _;

注释写在了代码中，如果既不是浏览器环境也不是Node环境的话，就获取值为this，通过this获取全局作用域，如果this仍然为空，就赋值给一个空的对象。感谢大神[@冴羽](https://github.com/mqyqingfeng)的指教，赋值给空对象的作用是防止在开发微信小程序时报错，因为在微信小程序这种特殊环境下，window和global都是undefined，并且强制开启了strict模式,这时候this也是undefined（严格模式下禁止this指向全局变量），所以指定一个空对象给root，防止报错，具体参考：[\`this\` is undefined in strict mode](https://github.com/jashkenas/underscore/pull/2641)。

这里值得学习的地方还有作者关于赋值的写法，十分简洁，尝试了一下，对于下面的写法：

    const flag = val1 && val2 && val3 || val4 && val5;

程序会从左到右依次判断val1、val2、val3的值，假设`||`把与运算分为许多组，那么：
* 一旦当前判断组的某个值转换为Boolean值后为false，那么就跳转到下一组进行判断，直到最后一组，如果最后一组仍然有值被判断为false，那么为false的值被赋给flag。
* 如果当前判断组所有的值转换后都为true，那么最后一个值会被赋给flag。

比如：

    const a = 1 && 2 && 3 || 2 && 3;
    // a === 3
    const b = 1 && false && 2 || 2 && 3;
    // b === 3
    const c = 1 && false && 2 || false && 2
    // c === false
    const d = 1 && false && 2 || 0 && 2
    // d === 0
    const e = 1 && false && 2 || 1 && 2
    // e === 2

除了要考虑给全局作用域赋值的差异以外，还要考虑JavaScript模块化规范的差异，JavaScript模块化规范包括AMD、CMD等。

通过以下代码兼容AMD规范：

    //兼容AMD规范的模块化工具，比如RequireJS。
	if (typeof define == 'function' && define.amd) {
		define('underscore', [], function () {
			return _;
		});
	}

如果define是一个函数并且define.amd不为null或者undefined，那就说明是在AMD规范的工作环境下，使用define函数导出变量。

通过以下代码兼容CommonJS规范：

    //为Node环境导出underscore，如果存在exports对象或者module.exports对象并且这两个对象不是HTML DOM，那么即为Node环境。
	//如果不存在以上对象，把_变量赋值给全局环境（浏览器环境下为window）。
	if (typeof exports != 'undefined' && !exports.nodeType) {
		if (typeof module != 'undefined' && !module.nodeType && module.exports) {
			exports = module.exports = _;
		}
		exports._ = _;
	} else {
		root._ = _;
	}

此外，通过以上代码可以支持ES6模块的import语法。具体原理参考阮一峰老师的教程：[ES6 模块加载 CommonJS 模块](http://es6.ruanyifeng.com/#docs/module-loader#ES6-模块加载-CommonJS-模块)。如果既不是AMD规范也不是CommonJS规范，那么直接将_赋值给全局变量。这一点可以通过将Underscore源码复制到浏览器的控制台回车后再查看`_`和`_.prototype`的值得到结论。

导出变量之后，在外部就可以使用我们定义的接口了。

## 3 实现链式调用

许多出名的工具库都会提供链式调用功能，比如jQuery的链式调用：`$('...').css().click();`，Underscore也提供了链式调用功能：`_.chain(...).each().unzip();`。

链式调用基本都是通过返回原对象实现的，比如返回this，在Underscore中，可以通过`_.chain`函数开始链式调用，实现原理如下：

    // Add a "chain" function. Start chaining a wrapped Underscore object.
	//将传入的对象包装为链式调用的对象，将其标志位置位true。
	_.chain = function (obj) {
		var instance = _(obj);
		instance._chain = true;
		return instance;
	};

它构造一个_实例，然后将其`_chain`链式标志位属性值为true代表链式调用，然后返回这个实例。这样做就是为了强制通过`_().function()`的方式调用接口，因为在_的原型上，所有接口方法与_的属性方法有差异，_原型上的方法多了一个步骤，它会对其父对象的`_chain`属性进行判断，如果为true，那么就继续使用`_.chain`方法进行链式调用的包装，在一部分在后续会继续讨论。

## 4 实现接口扩展

在许多出名的工具库中，都可以实现用户扩展接口，比如jQuery的`$.extend`和`$.fn.extend`方法，Underscore也不例外，其`_.mixin`方法允许用户扩展接口。

这里涉及到的一个概念就是mixin设计模式，mixin设计模式是JavaScript中最常见的设计模式，可以理解为把一个对象的属性拷贝到另外一个对象上,具体可以参考：[掺杂模式（mixin）](http://www.cnblogs.com/snandy/archive/2013/05/24/3086663.html)。

先看Underscore中`_.mixin`方法的源代码：

    _.mixin = function (obj) {
		// _.functions函数用于返回一个排序后的数组，包含所有的obj中的函数名。
		_.each(_.functions(obj), function (name) {
			// 先为_对象赋值。
			var func = _[name] = obj[name];
			// 为_的原型添加函数，以增加_(obj).mixin形式的函数调用方法。
			_.prototype[name] = function () {
				// this._wrapped作为第一个参数传递，其他用户传递的参数放在后面。
				var args = [this._wrapped];
				push.apply(args, arguments);
				// 使用chainResult对运算结果进行链式调用处理，如果是链式调用就返回处理后的结果，
				// 如果不是就直接返回运算后的结果。
				return chainResult(this, func.apply(_, args));
			};
		});
		return _;
	};

这段代码很好理解，就是对于传入的obj对象参数，将对象中的每一个函数拷贝到_对象上，同名会被覆盖。与此同时，还会把obj参数对象中的函数映射到_对象的原型上，为什么说是映射，因为并不是直接拷贝的，还进行了链式调用的处理，通过chainResult方法，实现了了链式调用，所以第三节中说_对象原型上的方法与_对象中的对应方法有差异，原型上的方法多了一个步骤，就是判断是否链式调用，如果是链式调用，那么继续通过`_.chain`函数进行包装。chainResult函数代码如下：

    // Helper function to continue chaining intermediate results.
	//返回一个链式调用的对象，通过判断instance._chain属性是否为true来决定是否返回链式对象。
	var chainResult = function (instance, obj) {
		return instance._chain ? _(obj).chain() : obj;
	};

实现mixin函数之后，Underscore的设计者非常机智的运用了这个函数，代码中只可以看到为_自身定义的一系列函数，比如`_.each`、`_.map`等，但看不到为`_.prototype`所定义的函数，为什么还可以通过`_().function()`的形式调用接口呢？这里就是因为作者通过`_.mixin`函数直接将所有_上的函数映射到了`_.prototype`上，在`_.mixin`函数定义的下方，有一句代码：

    // Add all of the Underscore functions to the wrapper object.
	_.mixin(_);

这句代码就将所有的_上的函数映射到了`_.prototype`上，有点令我叹为观止。

通过`_.mixin`函数，用户可以为_扩展自定义的接口，下面的例子来源于[中文手册](http://www.bootcss.com/p/underscore/#mixin)：

    _.mixin({
        capitalize: function(string) {
            return string.charAt(0).toUpperCase() + string.substring(1).toLowerCase();
        }
    });
    _("fabio").capitalize();
    => "Fabio"

## 5 实现noConflict

在许多工具库中，都有实现noConflict，因为在全局作用域，变量名是独一无二的，但是用户可能引入多个类库，多个类库可能有同一个标识符，这时就要使用noConflict实现无冲突处理。

具体做法就是先保存原来作用域中该标志位的数据，然后在调用noConflict函数时，为全局作用域该标志位赋值为原来的值。代码如下：

    // Save the previous value of the `_` variable.
	//保存之前全局对象中_属性的值。
	var previousUnderscore = root._;
    // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
	// previous owner. Returns a reference to the Underscore object.
	_.noConflict = function () {
		root._ = previousUnderscore;
		return this;
	};

在函数的最后，返回了Underscore对象，允许用户使用另外的变量存储。

## 6 为变量定义一系列基本属性

作为一个对象，应该有一些基本属性，比如toString、value等等，需要重写这些属性或者函数，以便使用时返回合适的信息。此外还需要添加一些版本号啊什么的属性。

## 7 总结

做完以上所有的工作之后，一个基本的工具库基本就搭建完成了，完成好测试、压缩等工作之后，就可以发布在npm上供大家下载了。想要写一个自己的工具库的同学可以尝试一下。

另外如果有错误之处或者有补充之处的话，欢迎大家不吝赐教，一起学习，一起进步！