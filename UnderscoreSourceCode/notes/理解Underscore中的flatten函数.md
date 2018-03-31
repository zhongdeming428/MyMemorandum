# 理解Underscore中的flatten函数

最近是在所在实习公司的第一个sprint，有个朋友又请假了，所以任务比较重，一直这么久都没怎么更新了，这个周末赖了个床，纠结了一会儿决定还是继续写这个系列，虽然比较乏味，但是学到的东西还是很多的。

之前主要是针对函数处理部分的API做解读，经过那些天的努力，基本已经解读完了，现在把重点移到数组上。对于数组处理API的解读，从这篇文章开始。

flatten是一个很基础的函数，在Underscore中也算是一个工具函数，为了方便以后的讲解，今天先阅读flatten函数的源码。

首先，我们带着问题来阅读源码，如果你参加面试，考官让你手写一个展开数组的函数，你会怎么写？

## 实现一个flatten函数

我们接受的参数应该是一个数组，我们可以使用一个叫array的变量表示它，它的返回值应该是一个数组，使用result表示：

    function flatten(array) {
        var result = [];
        // ... 展开代码
        return result
    }

然后我们应该对传入的数组进行类型验证，如果不是数组，我们应该抛出一个类型异常：

    function flatten(array) {
        var result = [];
        if(Object.prototype.toString.call(array) !== '[object Array]')
            throw new TypeError('Please pass a array-type object as parameter to flatten function');
        else {
            // ... 展开代码
        }
        return result
    }

这样就可以保证我们接收到的参数是一个数组，接下来我们应该遍历array参数，对于它的每一项，如果不是数组，我们就将其添加到result中，否则继续展开：

    function flatten(array) {
        var result = [];
        if(Object.prototype.toString.call(array) !== '[object Array]')
            throw new TypeError('Please pass a array-type object as parameter to flatten function');
        else {
            for(var i = 0; i < array.length; i++) {
                if(Object.prototype.toString.call(array[i]) === '[object Array]') {
                    // ... 继续展开。
                }
                else {
                    result.push(array[i]);
                }
            }
        }
        return result
    }

当数组中的项还是一个数组时，我们应当如何展开呢？
由于不确定到底是嵌套了多少层数组，所以最好是使用递归来展开，但是有新的问题，我们的flatten函数返回一个数组结果，但是我们如何把递归结果返回给我们的result呢，是使用concat方法还是怎样？

由于函数中对象类型的参数是引用传值，所以我们可以把result传递给flatten自身，使其直接修改result即可：

    function flatten(array, result) {
        var result = result || [];
        if(Object.prototype.toString.call(array) !== '[object Array]')
            throw new TypeError('Please pass a array-type object as parameter to flatten function');
        else {
            for(var i = 0; i < array.length; i++) {
                if(Object.prototype.toString.call(array[i]) === '[object Array]') {
                    // ... 递归展开。
                    arguments.callee(array[i], result);
                }
                else {
                    result.push(array[i]);
                }
            }
        }
        return result
    }

以上函数，就基本实现了flatten的功能，再美化一下：

    var flatten = function(array, result) {
        var result = result || [];
        var length = array.length;
        var toString = Object.prototype.toString;
        var type = toString.call(array);
        if(type !== '[object Array]')
            throw new TypeError('The parameter you passed is not a array');
        else {
            for(var i = 0; i < length; i++) {
                if(toString.call(array[i]) !== '[object Array]') {
                    result.push(array[i]);
                }
                else {
                    arguments.callee(array[i], result);
                }
            }
        }
        return result;
    }

大家可以把上面这段代码拷贝到控制台进行实验。

## Underscore中的flatten函数

通过我们自己亲手实现一个flatten函数，阅读Underscore源码就变得简单了。
下面是Underscore中flatten函数的源码（附注释）：

    var flatten = function (input, shallow, strict, output) {
		output = output || [];
		var idx = output.length;
		//遍历input参数。
		for (var i = 0, length = getLength(input); i < length; i++) {
			var value = input[i];
			if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
				// Flatten current level of array or arguments object.
				//如果input数组的元素是数组或者类数组对象，根据是否shallow来展开，如果shallow为true，那么只展开一级。
				if (shallow) {
					var j = 0, len = value.length;
					while (j < len) output[idx++] = value[j++];
				} else {
					//如果shallow为false，那么递归展开所有层级。
					flatten(value, shallow, strict, output);
					idx = output.length;
				}
			} else if (!strict) {
				//如果value不是数组或类数组对象，并且strict为false。
				//那么直接将value添加到输出数组，否则忽略value。
				output[idx++] = value;
			}
		}
		return output;
	};

Underscore实现的flatten更加强大，它支持类数组对象而不仅仅是数组，并且它多了两个参数——shallow和strict。

当shallow为true时，flatten只会把输入数组的数组子项展开一级，如果shallow为false，那么会全部展开。

当strict为false时，只要是非数组对象，flatten都会直接添加到output数组中；如果strict为true，那么会无视input数组中的非类数组对象。