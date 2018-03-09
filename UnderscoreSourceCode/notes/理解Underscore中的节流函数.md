# 理解Underscore中的节流函数

上一篇中讲解了Underscore中的去抖函数（`_.debounced`），这一篇就来介绍节流函数（`_.throttled`）。

经过上一篇文章，我相信很多人都已经了解了去抖和节流的概念。去抖，在一段连续的触发中只能得到触发一次的结果，在触发之后经过一段时间才可以得到执行的结果，并且必须在经过这段时间之后，才可以进入下一个触发周期。节流不同于去抖，节流是一段连续的触发至少可以得到一次触发结果，上限取决于设置的时间间隔。

## 1 理解函数节流

通过这张我手画的图，我相信可以更容易理解函数节流这个概念。

![throttle](.\images\throttle.png)

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
			//remaining > wait代表now < previous，这种情况是不存在的，因为now >= previous是永远成立的。
			//此处就相当于只判断了remaining <= 0是否成立。
			if (remaining <= 0 || remaining > wait) {
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

        //供外部手动取消节流效果。
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
