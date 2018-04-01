# 理解Underscore中的uniq函数

uniq函数，是Underscore中的一个数组去重函数，给它传递一个数组，它将会返回该数组的去重副本。

## 1 ES6版本去重

在ES6版本中，引入了一个新的数据结构——set，这是一种类似数组的数据结构，它有个最大的特点就是内部的每一个元素都是独一无二的，所以我们可以利用它来对数组进行去重：

    var uniq = function(array) {
        var set = new Set(array);
        return [...set];
    }

这是目前而言最快速简介的数组去重方法。但是由于浏览器兼容问题，目前ES6还没有完全普及，这样的方法可能在老旧版本的浏览器当中无法起到作用。所以我们还是需要使用ES5来实现。

## 2 ES5版本去重

对于接受的数组，我们可以对其进行遍历，使用一个result数组存放独一无二的元素，对于传入数组的每一项，在result中进行检索，如果result中不存在，那么就推入result中，最后返回result即可：

    var uniq = function(array) {
        var result = [];
        var length = array.length;
        var i;
        for(i = 0; i < length; i++) {
            if(result.indexOf(array[i]) < 0) {
                result.push(array[i]);
            }
        }
        return result;
    };

该函数已经能够比较简单的数值、字符串、布尔值等简单值了，但是如果是复杂对象的话，可能就达不到去重的目的，比如：

    var objArr = [{name: 'a'}, {name: 'a'}];
    console.log(uniq(objArr));

我们可能会希望返回值是[{name: 'a'}]，但是由于连个对象引用值不相等，所以比较时，不会对这两个对象进行去重，导致最后返回的结果是两个都存在，这显然不是我们所期望的。

我们需要一个指定比较规则的函数。

## 规则定制版去重函数

我们无法预知用户传递的数组内元素的类型，所以我们最好能够让用户自定义比较规则，最好的办法就是让用户传递函数作为参数。

默认函数接受的参数即为数组中的某一项：

    var uniq = function(array, func) {
        var result = [];
        var length = array.length;
        var i;
        if(!func) {
            for(i = 0; i < length; i++) {
                if(result.indexOf(array[i]) < 0) {
                    result.push(array[i]);
                }
            }
        }
        else {
            var seen = [];
            for(i = 0; i < length; i++) {
                if(seen.indexOf(func(array[i])) < 0) {
                    seen.push(func(array[i]));
                    result.push(array[i]);
                }
            }
        }
        return result;
    };

在func没有被传递时，直接进行比较；如果传递了func函数，那么对于array中的每一项，使用func处理后的返回值再进行比较，这样就可以达到对象比较的目的。

再次使用对象进行实验：

    var objArr = [{id: 'a'}, {id: 'a'}, {id: 'b'}];
    console.log(uniq(objArr, function(item) {
        return item.id;
    }));

输出结果中只有两个对象，说明达到了要求。

传递了这个自定义函数之后，去重的灵活性就大大的增加了。比如对于一个传递的对象数组，其中的每个对象都包含两个属性——name和age，我们需要比较这些对象，只有当name和age都相同的时候，我们才认为两个对象相同，那么：

    var persons = [{name: 'dm', age: 22}, {name: 'dm', age: 23}, {name: 'dm', age: 22}];
    console.log(uniq(persons, function(item) {
        return item.name + item.age;
    }));

最后返回的结果能够符合我们去重的要求。

现在去重的问题解决了，可以提高一下效率吗？

如果我们得到的是一个有序的数组（无论是数组排序还是字符串排序），我们可以只比较相邻两项是否相同来去重，这样更加简单快速。

## 快速去重

我们可以给uniq函数新增一个参数——isSorted，代表传递的数组是否是有序数组。

    var uniq = function(array, isSorted, func) {
        var result = [];
        var length = array.length;
        var i;
        var seen = [];
        if(isSorted && !func) {
            for(i = 0; i< length; i++) {
                if(array[i] == seen) continue;
                else {
                    result.push(array[i]);
                    seen = array[i];
                }
            }
        }
        else if(func){
            for(i = 0; i < length; i++) {
                if(seen.indexOf(func(array[i])) < 0) {
                    seen.push(func(array[i]));
                    result.push(array[i]);
                }
            }
        }
        else{
            for(i = 0; i < length; i++) {
                if(result.indexOf(array[i]) < 0) {
                    result.push(array[i]);
                }
            }
        }
        return result;
    };

这样的实现就比较完善了，其中重要的点是对于seen这个变量的运用。

以上代码的实现思想就是来源于Underscore，只不过实现得比Underscore更加简陋，相对而言不那么完善。

## Underscore实现数组去重

以下就是Underscore的源码（附注释）：

    // Produce a duplicate-free version of the array. If the array has already
	// been sorted, you have the option of using a faster algorithm.
	// The faster algorithm will not work with an iteratee if the iteratee
	// is not a one-to-one function, so providing an iteratee will disable
	// the faster algorithm.
	// Aliased as `unique`.
	//数组去重函数，使得数组中的每一项都是独一无二的。
	_.uniq = _.unique = function (array, isSorted, iteratee, context) {
		//如果没有传递isSorted参数（即传递值不是Boolean类型），那么默认为false，其余参数重新赋值。
		if (!_.isBoolean(isSorted)) {
			context = iteratee;
			iteratee = isSorted;
			isSorted = false;
		}
		//如果传递了iteratee，那么使用cb方法包装（确保返回一个函数），然后重新赋值。
		if (iteratee != null) iteratee = cb(iteratee, context);
		//保存结果。
		var result = [];
		//用于存放array的值便于下一次比较，或者用于存储computed值。
		var seen = [];
		//遍历array数组。
		for (var i = 0, length = getLength(array); i < length; i++) {
			//value表示当前项，computed表示要比较的项（有iteratee时是iteratee的返回值，无iteratee时是value自身）。
			var value = array[i],
				computed = iteratee ? iteratee(value, i, array) : value;
			if (isSorted && !iteratee) {
				//如果数组是有序的，并且没有传递iteratee，则依次比较相邻的两项是否相等。
				//！0===true，其余皆为false。
				if (!i || seen !== computed) result.push(value);
				//seen存放当前的项，以便于下一次比较。
				seen = computed;
			} else if (iteratee) {
				//如果传递了iteratee，那么seen就用于存放computed值，便于比较。
				//之所以不直接使用result存放computed值是因为computed只用于比较，result存放的值必须是原来数组中的值。
				if (!_.contains(seen, computed)) {
					seen.push(computed);
					result.push(value);
				}
			} else if (!_.contains(result, value)) {
				//isSorted为false并且iteratee为undefined。
				//可以理解为参数数组中是乱序数字，直接比较就好了。
				result.push(value);
			}
		}
		return result;
	};

数组去重是一件说容易也容易，说简单也简单的事情，就看你怎么做了。

更多Underscore源码解读：[GitHub](https://github.com/zhongdeming428/MyMemorandum/tree/master/UnderscoreSourceCode)