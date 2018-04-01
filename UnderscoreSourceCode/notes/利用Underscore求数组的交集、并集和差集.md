# 利用Underscore求数组的交集、并集和差集

## 1 数组交集函数——intersection

数组的交集是指包含多个数组中的共同元素的一个数组，求数组的交集就是找出给定数组中的共有元素。

下面实现一个求两个数组交集的函数。

判断数组是够包含指定值，使用Array.indexOf就可以。所以我们可以遍历第一个参数数组，然后使用Array.indexOf方法检索第二个参数数组，如果第二个参数数组包含当前项，那么当前项即为两个数组的交集元素，放入结果数组即可：

    var intersection = function(arr1, arr2) {
        var length = arr1.length;
        var result = [];
        var i;
        for(i = 0; i < length; i++) {
            if(result.indexOf(arr1[i]) >= 0) 
                continue;
            else {
                if(arr2.indexOf(arr1[i]) >= 0)
                    result.push(arr1[i]);
            }
        }
        return result;
    }

以上代码实现了求两个数组交集的功能。

如果涉及到多个数组呢？那就是Underscore的实现方法了。

以下是Underscore的源码（附注释）：

    // Produce an array that contains every item shared between all the
	// passed-in arrays.
	//获取传入的多个数组的交集，之所以只有一个形参，是因为该函数使用第一个数组参数作为基准。
	_.intersection = function (array) {
		//将要返回的结果数组。
		var result = [];
		//传入数组的个数。
		var argsLength = arguments.length;
		//遍历第一个数组参数。
		for (var i = 0, length = getLength(array); i < length; i++) {
			//当前项。
			var item = array[i];
			//如果结果数组中已有该项，那么直接跳过当前循环，进入下一轮循环中。
			if (_.contains(result, item)) continue;
			var j;
			//从第二个参数开始，遍历每一个参数。
			for (j = 1; j < argsLength; j++) {
				//一旦有一个参数数组不包含item，就退出循环。
				if (!_.contains(arguments[j], item)) break;
			}
			//如果所有参数数组都包含item项，就把item放入result。
			if (j === argsLength) result.push(item);
		}
		return result;
	};

可以看到该函数一次接受多个数组，但是只有一个形参（array），该参数表示接收到的第一个数组，Underscore使用它作为参考，遍历该数组，然后依次判断剩余参数数组是否包含当前项，如果全部包含则该项为交集元素，推入结果数组当中。

## 2 数组并集函数——union

数组的并集是指包含指定的多个数组的所有元素的数组，求多个数组的并集即为求一个包含所有数组的所有元素的数组。

这里最直接的实现方法就是遍历所有数组参数，然后针对数组的每一项，放入到结果数组中（如果已经存在于结果数组中那么久不再添加）。

	var union = function() {
		var arrays = arguments;
		var length = arguments.length;
		var result = [];
		var i;
		for(i = 0; i < length; i++) {
			var arr = arrays[i];
			var arrLength = arrays[i].length;
			for(var j = 0; j < arrLength; j++) {
				if(result.indexOf(arr[j]) < 0) {
					result.push(arr[j]);
				}
			}
		}
		return result;
	}

在阅读Underscore源码的时候，感觉它的实现方法十分巧妙。

Underscore中已经有了很多工具方法，所以可以拿来直接使用，比如[restArgs](https://github.com/zhongdeming428/MyMemorandum/blob/master/UnderscoreSourceCode/notes/%E7%90%86%E8%A7%A3Underscore%E4%B8%AD%E7%9A%84restArgs%E5%87%BD%E6%95%B0.md)、[flatten](https://github.com/zhongdeming428/MyMemorandum/blob/master/UnderscoreSourceCode/notes/%E7%90%86%E8%A7%A3Underscore%E4%B8%AD%E7%9A%84flatten%E5%87%BD%E6%95%B0.md)、[uniq](https://github.com/zhongdeming428/MyMemorandum/blob/master/UnderscoreSourceCode/notes/%E7%90%86%E8%A7%A3Underscore%E4%B8%AD%E7%9A%84uniq%E5%87%BD%E6%95%B0.md)。为什么强调这几个方法呢？因为使用这几个方法就可以实现数组求并集。

我们的union方法是接受多个数组作为参数的，而restArgs可以把多个数组参数合并到一个数组中作为参数；然后通过flatten函数，我们可以把得到的这个数组参数展开，展开之后得到的数组就是包含所有数组参数的所有元素的一个数组了，但是这个数组中有冗余项，我们必须对其进行去重；这时候使用我们的uniq工具函数就可以对其进行去重了。

经过这三个函数的处理，我们得到的数组就是多个数组参数的并集！

Underscore源码：

	// Produce an array that contains the union: each distinct element from all of
	// the passed-in arrays.
	_.union = restArgs(function (arrays) {
		return _.uniq(flatten(arrays, true, true));
	});

这样的实现是不是很简介大气？

## 3 数组差集函数——difference

数组的差集是指由数组A中所有不属于数组B的元素所组成的一个数组。

直接的实现方法就是遍历前者，然后判断每个元素是否属于后者，如果不属于，那么就推入结果数组。

简单实现：

	var difference = function(arr1, arr2) {
		var length = arr1.length;
		var i;
		var result = [];
		for(i = 0; i < length; i++) {
			if(arr2.indexOf(arr1[i]) < 0) {
				result.push(arr1[i]);
			}
		}
		return result;
	}

Underscore的实现（附注释）：

	// Take the difference between one array and a number of other arrays.
	// Only the elements present in just the first array will remain.
	//数组求差集函数。
	//通过restArgs函数把第二个数组开始的所有参数数组合并到一个数组。
	_.difference = restArgs(function (array, rest) {
		//使用flatten展开rest数组。
		rest = flatten(rest, true, true);
		//使用filter函数过滤array数组达到求差集的目的，判断条件就是value是否属于rest。
		return _.filter(array, function (value) {
			return !_.contains(rest, value);
		});
	});

更多Underscore源码解析：[GitHub](https://github.com/zhongdeming428/MyMemorandum/tree/master/UnderscoreSourceCode)
