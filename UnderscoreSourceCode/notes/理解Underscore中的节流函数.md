# 理解Underscore中的节流函数

上一篇中讲解了Underscore中的去抖函数（`_.debounced`），这一篇就来介绍节流函数（`_.throttled`）。

经过上一篇文章，我相信很多人都已经了解了去抖和节流的概念。去抖，在一段连续的触发中只能得到触发一次的结果，在触发之后经过一段时间才可以得到执行的结果，并且必须在经过这段时间之后，才可以进入下一个触发周期。节流不同于去抖，节流是一段连续的触发至少可以得到一次触发结果，上限取决于设置的时间间隔。

## 1 理解函数节流

通过这张我手画的图，我相信可以更容易理解函数节流这个概念。

![throttle](./images/throttle.png)

在这张粗制滥造的手绘图中，从左往右的轴线表示时间轴，下方的粗蓝色线条表示不断的调用throttled函数（看做连续发生的），而上方的一个一个节点表示我们得到的执行func函数的结果。

从图上可以看出来，我们通过函数节流，成功的限制了func函数在一段时间内的调用频率，在实际中能够提高我们应用的性能表现。

接下来我们探究一下Underscore中_.throttle函数的实现。

## 2 Underscore的实现

我们在探究源码之前，先了解一下Underscore API手册中关于_.throttle函数的使用说明：

>throttle_.throttle(function, wait, [options]) 
>
>创建并返回一个像节流阀一样的函数，当重复调用函数的时候，最多每隔 wait毫秒调用一次该函数。对于想控制一些触发频率较高的事件有帮助。（注：详见：javascript函数的throttle和debounce）
>
>默认情况下，throttle将在你调用的第一时间尽快执行这个function，并且，如果你在wait周期内调用任意次数的函数，都将尽快的被覆盖。如果你想禁用第一次首先执行的话，传递{leading: false}，还有如果你想禁用最后一次执行的话，传递{trailing: false}。
>
>var throttled = _.throttle(updatePosition, 100);
>
>$(window).scroll(throttled);

结合我画的那张示意图，应该比较好理解了。

如果传递的options参数中，leading为false，那么不会在throttled函数被执行时立即执行func函数；trailing为false，则不会在结束时调用最后一次func。

**Underscore源码（附注释）**：

    // Returns a function, that, when invoked, will only be triggered at most once
	// during a given window of time. Normally, the throttled function will run
	// as much as it can, without ever going more than once per `wait` duration;
	// but if you'd like to disable the execution on the leading edge, pass
	// `{leading: false}`. To disable execution on the trailing edge, ditto.
	_.throttle = function (func, wait, options) {
		var timeout, context, args, result;
		var previous = 0;
		if (!options) options = {};

		var later = function () {
			//previous===0时，下一次会立即触发。
			//previous===_.now()时，下一次不会立即触发。
			previous = options.leading === false ? 0 : _.now();
			timeout = null;
			result = func.apply(context, args);
			if (!timeout) context = args = null;
		};

		var throttled = function () {
			//获取当前时间戳（13位milliseconds表示）。
			//每一次调用throttled函数，都会重新获取now，计算时间差。
			//而previous只有在func函数被执行过后才回重新赋值。
			//也就是说，每次计算的remaining时间间隔都是每次调用throttled函数与上一次执行func之间的时间差。
			var now = _.now();
			//!previous确保了在第一次调用时才会满足条件。
			//leading为false表示不立即执行。
			//注意是全等号，只有在传递了options参数时，比较才有意义。
			if (!previous && options.leading === false) previous = now;
			//计算剩余时间，now-previous为已消耗时间。
			var remaining = wait - (now - previous);
			context = this;
			args = arguments;
			//remaining <= 0代表当前时间超过了wait时长。
			//remaining > wait代表now < previous，这种情况是不存在的，因为now >= previous是永远成立的(除非主机时间已经被修改过)。
			//此处就相当于只判断了remaining <= 0是否成立。
			if (remaining <= 0 || remaining > wait) {
				//防止出现remaining <= 0但是设置的timeout仍然未触发的情况。
				if (timeout) {
					clearTimeout(timeout);
					timeout = null;
				}
				//将要执行func函数，重新设置previous的值，开始下一轮计时。
				previous = now;
				//时间达到间隔为wait的要求，立即传入参数执行func函数。
				result = func.apply(context, args);
				if (!timeout) context = args = null;
				//remaining>0&&remaining<=wait、不忽略最后一个输出、
				//timeout未被设置时，延时调用later并设置timeout。
				//如果设置trailing===false，那么直接跳过延时调用later的部分。
			} else if (!timeout && options.trailing !== false) {
				timeout = setTimeout(later, remaining);
			}
			return result;
		};

		throttled.cancel = function () {
			clearTimeout(timeout);
			previous = 0;
			timeout = context = args = null;
		};

		return throttled;
	};

接下来，我们分三种情况分析Underscore源码：

* 没有配置options选项时
* options.leading === false时
* options.trailing === false时

### 2.1 默认情况（options === undefined）
在默认情况下调用throttled函数时，options是一个空的对象`{}`，此时`options.leading!==false`并且`options.trailing!==false`，那么throttled函数中的第一个if会被忽略掉，因为options.leading === false永远不会满足。

此时，不断地调用throttled函数，会按照以下方式执行：

* 用now变量保存当前调用时的时间戳，previous默认为0，计算remaining剩余时间，此时应该会小于0，满足了`if (remaining <= 0 || remaining > wait)`。

* 清空timeout并清除其事件，为previous重新赋值以记录当前调用throttled函数的值。

* 能够进入当前的if语句表示剩余时间不足或者是第一次调用throttled函数（且options.leading !== false），那么将会立即执行func函数，使用result记录执行后的返回值。

* 下一次调用throttled函数时，重新计算当前时间和剩余时间，如果剩余时间不足那么仍然立即执行func，如此不断地循环。如果remaining时间足够（大于0），那么会进入else if语句，设置一个timeout异步事件，此时注意到timeout会被赋值，直到later被调用才回被赋值为null。这样做的目的就是为了防止不断进入else if条件语句重复设置timeout异步事件，影响性能，消耗资源。

* 之后调用throttled函数，都会按照这样的方式执行。

通过上面的分析，我们可以发现，除非设置options.leading===false，否则第一次执行throttled函数时，条件语句`if (!previous && options.leading === false) previous = now;`不会被执行。间接导致remaining<0，然后进入if语句立即执行func函数。

接下来我们看看设置options.leading === false时的情况。

### 2.2 options.leading === false

设置options.leading为false时，执行情况与之前并没有太大差异，仅在于`if(!previous && options.leading === false)`语句。当options.leading为false时，第一次执行会满足这个条件，所以赋值previous=== now，间接使得remaining>0。

由于timeout此时为undefined，所以!timeout为true。设置later为异步任务，在remaining时间之后执行。

此后再不断的调用throttled方法，思路同2.1无异，因为!previous为false，所以`if(!previous && options.leading === false)`该语句不再判断，会被完全忽略。可以理解为设置判断!previous的目的就是在第一次调用throttled函数时，判断options.leading是否为false，之后便不再进行判断。

### 2.3 options.trailing === false

此时的区别在于else if中的执行语句。如果`options.trailing === false`成立，那么当remaining>0时间足够时，不会设置timeout异步任务。那么如何实现时间到就立即执行func呢？是通过不断的判断remaining，一旦`remaining <= 0`成立，那么就立即执行func。

接下来，我们手动实现一个简单的throttle函数。

## 实现一个简单的throttle函数

首先，我们需要多个throttled函数共享一些变量，比如previous、result、timeout，所以最好的方案仍然是使用闭包，将这些共享的变量作为throttle函数的私有变量。

其次，我们需要在返回的函数中不断地获取调用该函数时的时间戳now，不断地计算remaining剩余时间，为了实现trailing不等于false时的效果，我们还需要设置timeout。

最终代码如下：

	var throttle = function(func, wait) {
		var timeout, result, now;
		var previous = 0;
		
		return function() {
			now = +(new Date());
		
			if(now - previous >= wait) {
				if(timeout) {
					clearTimeout(timeout);
					timeout = null;
				}
				previous = now;
				result = func.apply(this, arguments);
			}
			else if(!timeout) {
				timeout = setTimeout(function() {
					previous = now;
					result = func.apply(this, arguments);
					timeout = null;
				}, wait - now + previous);
			}
			return result;
		}
	}

可能大家发现了一个问题就是我的now变量也是共享的变量，而underscore中是throttled函数的私有变量，为什么呢？

我们可以注意到：underscore设置timeout时，调用的是另外一个throttle函数的私有函数，叫做later。later在更新previous的时候，使用的是`previous = options.leading === false ? 0 : _.now();`也就是通过`_.now`函数直接获取later被调用时的时间戳。而我使用的是`previous = now`，如果now做成throttled的私有变量，那么timeout的异步任务执行时，设置的previous仍然是过去的时间，而非异步任务被执行时的当前时间。这样做直接导致的结果就是previous相比实际值更小，remaining会更大，下一次func触发会来的更早！

下面这段代码是对上面代码的应用，大家可以直接拷贝到浏览器的控制台，回车然后在页面上滚动鼠标滚轮，看看这个函数实现了怎样的功能，更有利于你对这篇文章的理解！

	var throttle = function(func, wait) {
		var timeout, result, now;
		var previous = 0;
		
		return function() {
			now = +(new Date());
		
			if(now - previous >= wait) {
				if(timeout) {
					clearTimeout(timeout);
					timeout = null;
				}
				previous = now;
				result = func.apply(this, arguments);
			}
			else if(!timeout) {
				timeout = setTimeout(function() {
					previous = now;
					result = func.apply(this, arguments);
					timeout = null;
				}, wait - now + previous);
			}
			return result;
		}
	}
	window.onscroll = throttle(()=>{console.log('yes')}, 2000);