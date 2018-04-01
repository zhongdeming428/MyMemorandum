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