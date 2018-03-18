# 理解Underscore中的_.bind函数
最近一直忙于实习以及毕业设计的事情，所以上周阅读源码之后本周就一直没有进展。今天在写完开题报告之后又抽空看了一眼Underscore源码，发现上次没有看明白的一个函数忽然就豁然开朗了，于是赶紧写下了这篇笔记。

关于如何绑定函数this指向，一直是JavaScript中的高频话题，面试时考官也喜欢问如何绑定函数this的指向，以及如何试现一个bind函数，今天我们就从Underscore源码来学习如何实现一个bind函数。

## 预备知识

在学习源码之前，我们最好先了解一下函数中this的指向，我在这个系列之前有写过一篇文章，比较完善的总结了一下JavaScript函数中this的指向问题，详情参见：[博客园](http://www.cnblogs.com/DM428/p/7515818.html)。

另外，在学习`_.bind`函数之前，我们需要先了解一下Underscore中的重要工具函数——`restArgs`。就在我的上一篇文章中就有介绍到：[理解Underscore中的restArgs函数](https://github.com/zhongdeming428/MyMemorandum/blob/master/UnderscoreSourceCode/notes/%E7%90%86%E8%A7%A3Underscore%E4%B8%AD%E7%9A%84restArgs%E5%87%BD%E6%95%B0.md)。

## 工具函数——executeBound

在学习`_.bind`函数之前，我们先来看一下Underscore中的另一个工具函数——executeBound。因为这是一个重要的工具函数，涉及到bind的实现。

executeBound源码（附注释）：

    // Determines whether to execute a function as a constructor
	// or a normal function with the provided arguments.
	//执行绑定函数，决定是否把一个函数作为构造函数或者普通函数调用。
	var executeBound = function (sourceFunc, boundFunc, context, callingContext, args) {
		//如果callingContext不是boundFunc的一个实例，则把sourceFunc作为普通函数调用。
		if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
		//否则把sourceFunc作为构造函数调用。
            //baseCreate函数用于构造一个对象，继承指定的原型。
            //此处self就是继承了sourceFunc.prototype原型的一个空白对象。
		var self = baseCreate(sourceFunc.prototype);
		var result = sourceFunc.apply(self, args);
            //这里之所以要判断一下是因为如果构造函数有返回值并且返回值是一个对象，那么新构造的对象就会是返回值，而非this所指向的值。
		if (_.isObject(result)) return result;
            //只有在构造函数没有返回值或者返回值时非对象时，才返回this所指向的值。
		return self;
	};

首先我们先看为什么在executeBound函数结尾需要判断一下result，原因已经写明在注释里，请大家一定仔细注意！
举一个帮助理解的例子：

    var A = function() {
        this.name = 'A';
        return {};
    }
    var B = function() {
        this.name = 'B';
    }
    var C = function() {
        this.name = 'C';
        return 'C';
    }
    var a = new A();
    var b = new B();
    var c = new C();

在浏览器中输出a、b、c，看看你会发现什么？然后再来仔细思考代码中注释的部分吧。

其次回到我们这篇文章的重点，这个函数的功能非常好理解，就是根据实际情况来决定是否把一个函数（sourceFunc）当做构造函数或者普通函数来调用。这个根据的条件就是看callingContext参数是否是boundFunc函数的一个实例。如果callingContext是boundFunc的一个实例，那么就把sourceFunc当做一个构造函数来调用，否则就当做一个普通函数来调用，使用Function.prototype.apply来改变sourceFunc中this的指向。

单独开这个函数可能会使我们变得疑惑，为什么要这么做呢？这个callingContext跟boundFunc是什么关系？为什么要根据这两个参数的关系来决定是否以构造函数的形式调用sourceFunc。

接下来我们根据实际情景来解析这段源码。

在Underscore源码中，使用`ctrl + F`键查找`executeBound`字段，共有三处结果。其中一处是上方源码所示的executeBound函数声明。另外两处是调用，其形式都如下所示：

    var bound = restArgs(function (callArgs) {
			return executeBound(func, bound, context, this, args.concat(callArgs));
		});

可以注意到实际调用时，第四个参数（callingContext）都是this，代表当前bound函数执行作用域，而第二个参数是bound自身，这样的写法着实奇怪。

其实考虑到我们的目的也就不难理解为什么这么写了，因为当我们把bound函数当做构造函数调用时，构造函数（此时也就是bound函数）内部的this会指向新构造的对象，而这个由bound函数新构造的对象自然就是bound函数的一个实例了，此时就会把sourceFunc当做构造函数调用。

接下来我们再看`_.bind`函数，一起深入理解该函数的同时，顺便理解一下executeBound函数中为什么要根据callingContext和boundFunc的关系来确定sourceFunc的调用方式。


## 理解_.bind函数

我们先看`_.bind`函数的源码（附注释）：

    // Create a function bound to a given object (assigning `this`, and arguments,
	// optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
	// available.
	//将指定函数中的this绑定到指定上下文中，并传递一些参数作为默认参数。
    //其中args是默认参数，以后调用新的func时无需再次传递这些参数。
	_.bind = restArgs(function (func, context, args) {
		if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
		var bound = restArgs(function (callArgs) {
			return executeBound(func, bound, context, this, args.concat(callArgs));
		});
		return bound;
	});

我们看到在`_.bind`函数的内部定义了一个bound函数，然后返回了这个函数，即为闭包。闭包的好处即在于内部的函数是私有函数，可以访问外部函数作用域，在内部函数调用之前，整个外部函数的作用域都是存在且对于内部函数而言是可访问的。在restArgs函数的参数（即匿名函数）中并没有处理如何调用func，因为我们要根据情况来决定。当我们使用`_.bind`函数绑定一个函数的this时，会返回bound函数作为新的func函数，而bound函数会根据其调用的方式，来决定如何调用func，而此处的闭包能够保证在bound执行之前，func是一直存在的。当我们使用new来操作bound函数构造新的对象时，bound内的this指向新构造的对象（即为bound的新实例），executeBound函数内部就会把func当做构造函数来调用；如果以普通函数形式调用bound，那么内部的this会指向外部调用bound函数时的作用域，自然就不是bound的一个实例了，这就是为什么会给executeBound第四个参数传递this的原因。

口说无凭，我们自己写个代码探究一下闭包内部函数中this的指向问题：

    var test = function() {
        var bound = function() {
            this.name = 'bound';
            console.log(this);
        }
        return bound;
    }
    var Bound = test();
    var b = new Bound();
    var b = Bound();

    //bound { name: 'bound' }
    //window

大家可以将上面这段代码拷贝到浏览器控制台试一试，看看结果是不是跟上面的注释一样。

## 实现一个自己的bind函数

通过上面的学习，我们知道了原来bind函数还要考虑到特殊情况——被绑定过this的函数作为构造函数调用时的情况。
接下来我们手动实现一个简单的bind函数：

    var _bind = function(func, context) {
        var bound = function() {
            if(this instanceof bound) {
                var obj = new Object();
                obj.prototype = func.prototype;
                obj.prototype.constructor = func;
                var res = func.call(obj);
                if(typeof res == 'function' || typeof res == 'object' && !!res)
                    return res;
                else
                    return obj
            }
            else {
                return func.call(context);
            }
        };
        return bound; 
    }

在阅读这篇文章之前，你会如何实现一个bind函数呢？

更多Underscore源码解读：[GitHub](https://github.com/zhongdeming428/MyMemorandum/tree/master/UnderscoreSourceCode)