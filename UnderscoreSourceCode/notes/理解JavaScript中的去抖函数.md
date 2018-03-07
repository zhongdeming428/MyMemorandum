# 理解Underscore中的去抖函数

何为去抖函数？在学习Underscore去抖函数之前我们需要先弄明白这个概念。很多人都会把去抖跟节流两个概念弄混，但是这两个概念其实是很好理解的。

去抖函数（Debounce Function），是一个可以限制指定函数触发频率的函数。我们可以理解为**连续调用**同一个函数多次，只得到执行该函数一次的结果;但是隔一段时间再次调用时，又可以重新获得新的结果，具体这段时间有多长取决于我们的设置。这种函数的应用场景有哪些呢？

比如我们写一个DOM事件监听函数，

    window.onscroll = function(){
        console.log('Got it!');
    }

现在当我们滑动鼠标滚轮的时候，我们就可以看到事件被触发了。但是我们可以发现在我们滚动鼠标滚轮的时候，我们的控制台在不断的打印消息，因为window的scroll事件被我们不断的触发了。

在当前场景下，可能这是一个无伤大雅的行为，但是可以预见到，当我们的事件监听函数(Event Handler)涉及到一些复杂的操作时（比如Ajax请求、DOM渲染、大量数据计算），会对计算机性能产生多大影响；在一些比较老旧的机型或者较低版本的浏览器（尤其IE）中，很可能会导致死机情况的出现。所以这个时候我们就要想办法，在指定时间段内，只执行一定次数的事件处理函数。

## 理解去抖函数

说了一些概念和应用场景，但是还是很拗口，到底什么是去抖函数？

我们可以通过如下实例来理解：

假设有以下代码：

    var debounce = function(callback, delay, immediate){
        var timeout, result;
        return function(){
            var callNow;
            if(timeout)
                clearTimeout(timeout);
            callNow = !timeout && immediate;
            if(callNow) {
                result = callback.apply(this, Array.prototype.slice.call(arguments, 0));
                timeout = {};
            }
            else {
                timeout = setTimeout(()=>{
                    callback.apply(this, Array.prototype.slice.call(arguments, 0));
                }, delay);
            }
        };
    };
    var s = debounce(()=>{
        console.log('yes...');
    }, 2000);
    window.onscroll = s;

debounce函数就是我自己实现的一个简单的去抖函数，我们可以通过这段代码进行实验。

步骤如下：

* 复制以上代码，打开浏览器，打开控制台(F12)，然后粘贴代码并回车执行。
* 连续不断的滚动鼠标，查看控制台有无输出。
* 停止滚动鼠标，2s之内再次滚动鼠标，查看是否有输出。
* 连续滚动之后停止2s以上，查看是否有输出。

通过以上步骤，我们可以发现当我们连续滚动鼠标时，控制台没有消息被打印出来，停止2s以内并再次滚动时，也没有消息输出；但是当我们停止的时间超过2s时，我们可以看到控制台有消息输出。

这就是去抖函数。在连续的触发中（无论时长），只能得到触发一次的效果。在指定时间长度内连续触发，最多只能得到一次触发的效果。

## underscore的实现

underscore源码如下（附代码注释）：

    // Returns a function, that, as long as it continues to be invoked, will not
	// be triggered. The function will be called after it stops being called for
	// N milliseconds. If `immediate` is passed, trigger the function on the
	// leading edge, instead of the trailing.
	//去抖函数，传入的函数在wait时间之后（或之前）执行，并且只会被执行一次。
	//如果immediate传递为true，那么在函数被传递时就立即调用。
	//实现原理：涉及到异步JavaScript，多次调用_.debounce返回的函数，会一次性执行完，但是每次调用
	//该函数又会清空上一次的TimeoutID，所以实际上只执行了最后一个setTimeout的内容。
	_.debounce = function (func, wait, immediate) {
		var timeout, result;

		var later = function (context, args) {
			timeout = null;
			//如果没有传递args参数，那么func不执行。
			if (args) result = func.apply(context, args);
		};

		//被返回的函数，该函数只会被调用一次。
		var debounced = restArgs(function (args) {
			//这行代码的作用是清除上一次的TimeoutID，
			//使得如果有多次调用该函数的场景时，只执行最后一次调用的延时。
			if (timeout) clearTimeout(timeout);
			if (immediate) {
				////如果传递了immediate并且timeout为空，那么就立即调用func，否则不立即调用。
				var callNow = !timeout;
				//下面这行代码，later函数内部的func函数注定不会被执行，因为没有给later传递参数。
				//它的作用是确保返回了一个timeout,并且保持到wait毫秒之后，才执行later，
				//清空timeout。而清空timeout是在immediate为true时，callNow为true的条件。
				//timeout = setTimeout(later, wait)的存在是既保证上升沿触发，
				//又保证wait内最多触发一次的必要条件。
				timeout = setTimeout(later, wait);
				if (callNow) result = func.apply(this, args);
			} else {
				//如果没有传递immediate，那么就使用_.delay函数延时执行later。
				timeout = _.delay(later, wait, this, args);
			}

			return result;
		});

		//该函数用于取消当前去抖效果。
		debounced.cancel = function () {
			clearTimeout(timeout);
			timeout = null;
		};

		return debounced;
	};

可以看到underscore使用了闭包的方法，定义了两个私有属性：timeout和result，以及两个私有方法later和debounced。最终会返回debounced作为处理之后的函数。timeout用于接受并存储setTimeout返回的TimeoutID，result用于执行用户传入的func函数的执行结果，later方法用于执行传入的func函数。

### 实现原理

利用了JavaScript的异步执行机制，JavaScript会优先执行完所有的同步代码，然后去事件队列中执行所有的异步任务。

当我们不断的触发debounced函数时，它会不断的clearTimeout(timeout)，然后再重新设置新的timeout，所以实际上在我们的同步代码执行完之前，每次调用debounced函数都会重置timeout。所以异步事件队列中的异步任务会不断刷新，直到最后一个debounced函数执行完。只有最后一个debounced函数设置的later异步任务会在同步代码执行之后被执行。

所以当我们在之前实验中不断的滚动鼠标时，实际上是在不断的调用debounced函数，不断的清除timeout对应的异步任务，然后又设置新的timeout异步任务。当我们停止的时间不超过2s时，timeout对应的异步任务还没有被触发，所以再次滚动鼠标触发debounced函数还可以清除timeout任务然后设置新的timeout任务。一旦停止的时间超过2s，最终的timeout对应的异步代码就会被执行。

## 总结

* 去抖是限制函数执行频率的一种方法。
* 去抖后的函数在指定时间内最多被触发一次，连续触发去抖后的函数只能得到一次的触发效果。
* underscore去抖的实现依赖于JavaScript的异步执行机制，优先执行同步代码，然后执行事件队列中的异步代码。

## 参考
* [underscore 函数去抖的实现](https://github.com/hanzichi/underscore-analysis/issues/21)
* [JavaScript Debounce Function](https://davidwalsh.name/javascript-debounce-function)
* [Stack Overflow：What does _.debounce do?](https://stackoverflow.com/questions/15927371/what-does-debounce-do)
