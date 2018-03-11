# 理解Underscore中的restArgs函数

虽然Underscore并没有在API手册中提及到restArgs函数，我们仍然可以通过`_.restArgs`接口使用restArgs函数。如果不去阅读源码，我们很难发现Underscore中还有这样的一个函数，对于这样的一个“没有存在感”的函数，我们为什么要使用并学习它呢？

这个函数虽然比较“低调”，但是它在Underscore中的存在感却一点也不低。在Underscore源码中，restArgs函数作为工具函数，参与多个公开API的实现，可谓劳苦功高。从其多次参与实现公开API可以看出，这是一个十分重要的函数，为了方便讲解后面的公开API，这里专门写一篇文章介绍restArgs工具函数。

## 为什么我们需要restArgs？

在现实中，我们可能有碰到过一些特殊情况，比如我们所写的函数不确定有多少个要传递的参数，这样在函数内部实现参数处理时就会比较棘手。

比如现在我们需要构建一个函数，这个函数接受至少两个参数，第一个是一个数组对象，第二个之后是一些值，我们的函数就需要把这些值添加到第一个参数的尾部。

代码实现：

    function appendToArray(arr) {
        if(arguments.length < 2)
            throw new Error('funciton a require at least 2 parameters!');
        return arr.concat(Array.prototype.slice.call(arguments, 1));
    }

现在我们需要实现另一个函数，该函数也是把参数附加到数组中，不过实现了过滤器功能，比如只把大于1的参数附加到数组中。

代码实现：

    function appendToArrayPlus(arr, filter) {
        if(arguments.length < 3)
            throw new Error('function a require at least 3 parameters!');
        var params = Array.prototype.slice.call(arguments, 2);
        for(var i = 0; i < params.length; i++) {
            if(filter(params[i])) {
                arr.push(params[i]);
            }
        }
        return arr;
    }

可以看出来，我们在开发这两个函数时，做了重复的工作，那就是根据多余参数的开始序号来截断arguments对象。

这样的做法，在写一两个函数时没有什么问题，但是在开发框架时，需要写大量的参数个数不确定的函数，这就会使得冗余代码大量增加，并且多次直接操作arguments对象的做法并不十分优雅。

所以我们需要一个restArgs这样的工具函数，给它传递一个函数以及一个多余参数开始索引（startIndex）作为参数，它会返回一个函数，我们在调用返回的函数时，开始索引之后的多余参数会被放入到数组中，然后一并传递给restArgs的第一个参数函数调用（作为最后一个参数）。

有人会说，ES6中已经实现了rest params的功能，参考[阮老师教程](http://es6.ruanyifeng.com/#docs/function#rest-参数)，但是我们知道一个框架的开发，必须考虑到兼容问题，很多低端浏览器并未实现ES6语法。所以在Underscore中，暂时还未使用ES6语法。

## Underscore的实现

Underscore实现的源码（**附注释**）：

    // Similar to ES6's rest param (http://ariya.ofilabs.com/2013/03/es6-and-rest-parameter.html)
	// This accumulates the arguments passed into an array, after a given index.

	//restArgs用于把func的位于startIndex之后的参数归类为一个数组，
	//然后返回一个函数把这个数组结合startIndex之前的参数传递给func调用。
	var restArgs = function (func, startIndex) {
		//function.length表示function定义时，形式参数的个数。
		//注意此处是func.length，即传入的方法参数的形参个数而不是当前函数的参数个数，需要结合具体传入的参数来看。
		//当startIndex参数未传递时，默认func函数的最后一个参数开始为多余参数，会被整合到数组中。
		startIndex = startIndex == null ? func.length - 1 : +startIndex;
		return function () {
			//length表示构造的多余参数数组的长度，是实际的多余参数或者0。
			var length = Math.max(arguments.length - startIndex, 0),
				rest = Array(length),
				index = 0;
			//新建了一个rest数组，把位于startIndex索引之后的所有参数放入该数组。
			for (; index < length; index++) {
				rest[index] = arguments[index + startIndex];
			}
			//将多余参数放入rest数组之后，直接用Function.prototype.call执行函数。
			switch (startIndex) {
				case 0: return func.call(this, rest);
				case 1: return func.call(this, arguments[0], rest);
				case 2: return func.call(this, arguments[0], arguments[1], rest);
			}
			//如果startIndex > 2，那么使用apply传递数组作为参数的方式执行func。
			//虽然调用方法发生了变化，但是还是会把rest数组放在传入的参数数组的最后。
			//这样做其实与之前的方法无异（switch部分可以删除），但是call的效率高于apply。
			
			//args数组用于盛放startIndex之前的非多余参数。
			var args = Array(startIndex + 1);
			for (index = 0; index < startIndex; index++) {
				args[index] = arguments[index];
			}
			args[startIndex] = rest;
			return func.apply(this, args);
		};
	};

可以注意到两个重点：

* 1 startIndex默认为func函数的形参个数减1，那么代表的含义就是当我们调用restArgs函数不传递第二个参数时，默认从最后一个形参开始即为多余参数。

    比如：

        _.invoke = restArgs(function (obj, path, args) {...});
        _.invoke(obj, path, 1, 2, 3);

    以上代码中，如果我们给_.invoke传递这些参数，那么实际上执行的函数会是：

        function(obj, path, [1, 2, 3]) {
            // ...
        }

    这样我们就可以在写函数`_.invoke`时，很方便的预处理args数组。

* 2 switch中的内容只是后面`func.apply(this, args)`的一个特例，不写switch也完全可以实现功能，但是之所以要写这个switch，是因为Function.prototype.call的效率要高于Function.prototype.apply（具体请参考：[Why is call so much faster than apply?](https://stackoverflow.com/questions/23769556/why-is-call-so-much-faster-than-apply)）。

## 结语

学习完这个内部函数之后，再学习其他API源码时，就会好理解许多，我们需要重点注意的一点就是当restArgs只接受一个函数作为参数时，表示默认从接受的最后一个参数开始（包括最后一个参数）即为多余参数。

其余Underscore源码解读文章：[GitHub](https://github.com/zhongdeming428/MyMemorandum/tree/master/UnderscoreSourceCode)