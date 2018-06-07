# 理解Underscore中的_.template函数

Underscore中提供了_.template函数实现模板引擎功能，它可以将JSON数据源中的数据对应的填充到提供的字符串中去，类似于服务端渲染的模板引擎。接下来看一下Underscore是如何实现模板引擎的。

## 工具准备

首先是_.template函数的配置项，Underscore源码中配置了默认的配置项：

    _.templateSettings = {
		// 执行JavaScript语句，并将结果插入。
		evaluate: /<%([\s\S]+?)%>/g,
		// 插入变量的值。
		interpolate: /<%=([\s\S]+?)%>/g,
		// 插入变量的值，并进行HTML转义。
		escape: /<%-([\s\S]+?)%>/g
	};

每一项的意思都写在了注释中，修改不同项的正则表达式，可以修改你传入的字符串模板中的占位符。默认的占位符：

* <%  %> ： 表示执行JavaScript语句。
* <%=  %> ： 表示插入变量的值。
* <%-  %> ： 表示对插入值进行HTML转义后再插入。

源码中还写了一个不可能匹配的正则表达式：

    // 一个不可能有匹配项的正则表达式。
	var noMatch = /(.)^/;

一个JSON（类字典），用于映射转义字符到转义后的字符：

    var escapes = {
		"'": "'",
		'\\': '\\',
		'\r': 'r',
		'\n': 'n',
		'\u2028': 'u2028',
		'\u2029': 'u2029'
	};

以及一个匹配转义字符的正则表达式和一个转义函数。

    // 匹配需要转义字符的正则表达式。
	var escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;

	// 返回字符对应的转义后的字符。
	var escapeChar = function (match) {
		return '\\' + escapes[match];
	};

接下来会使用到这些变量。

## 实现_.template

实现原理大致如下：

* 使用正则匹配传入字符串中的所有占位符，并读取占位符中的变量名或JavaScript语句。
* 构造一个字符串，用于定义渲染函数，把读取到的变量名或JavaScript语句嵌入到字符串中，使得在使用渲染函数时，变量会被具体的值替代。如果变量名所代表的值需要转义，则还需使用`_.escape`函数对其进行转义，同样写入字符串中。
* 通过步骤二构造的字符串构造渲染函数，定义一个闭包，闭包负责调用这个渲染函数，返回闭包即可。

如何匹配传入字符串中的占位符是一个问题，因为一个字符串中可能包含多种或者多个占位符，这里用了`String.prototype.replace`方法的一种不常用的方法。

通常，我们至少用`String.prototype.replace`的简单用法，即第一个参数为要替换的字符串，第二个参数为用于替换它的新字符串，该函数返回替换结果，不改变原字符串。如果要将字符串中的指定字符串**全部替换**，那么第一个参数应该传入正则表达式，并且采用全局匹配模式`g`。很多人不知道`String.prototype.replace`还有更加灵活的第三种用法，即第二个参数传递为一个函数，这个函数的返回结果作为替代指定字符串的新字符串，且至少接收一个参数：

* 如果对于第一个参数没有匹配结果，那么回调函数只接受一个参数，即为原字符串。
* 如果有匹配结果，那么接收至少三个参数，依次为匹配到的字符串、匹配字符串的开始索引和原字符串。

可以打开浏览器输入如下代码回车进行验证：

    let str = 'abc';
    str.replace(/a/g, function() {
        console.log(arguments);
    });

如果有多个匹配结果，那么回调函数会被调用多次：

    let str = 'abcabc';
    str.replace(/a/g, function() {
        console.log(arguments);
    });

回车之后，在控制台可以看到两次打印结果。那么就相当于是进行了一个循环操作，这个循环会遍历匹配到的每一项，这样就可以对于匹配到的占位符进行适当的操作了。此外，`String.prototype.replace`函数还有一个很优秀的特性，如果第一个参数传递为正则表达式并且含有多个捕获组（及括号），那么每个捕获组所捕获的字符串都会作为参数传递给回调函数，所以说回调函数至少接收一个参数。其参数个数可以取决于正则表达式中的捕获组个数。验证以下代码：

    let str = 'abcabcabc';
    str.replace(/(ab)|(c)/g, function() {
        console.log(arguments);
    });

可以发现回调所接受的参数个数即为`3 + 正则中的捕获组个数`。基于这个特性，Underscore作者对字符串进行了很好的处理。

实现代码如下：

    _.template = function (text, settings, oldSettings) {
		// 如果第二个参数为null或undefined。。等，那么使用oldSettings作为settings。
		if (!settings && oldSettings) settings = oldSettings;
		// 如果三个参数齐整，那么使用整合后的对象作为settings。
		settings = _.defaults({}, settings, _.templateSettings);

		// Combine delimiters into one regular expression via alternation.
		// 匹配占位符的正则表达式，将配置项中的三个正则合并，每一个正则都是一个捕获组，如果配置项没有包含的话，就默认不匹配任何值。
		var matcher = RegExp([
			(settings.escape || noMatch).source,
			(settings.interpolate || noMatch).source,
			(settings.evaluate || noMatch).source
		].join('|') + '|$', 'g');

		// Compile the template source, escaping string literals appropriately.
		var index = 0;
		var source = "__p+='";
		// function回调作为string.replace的第二个参数会传递至少三个参数，如果有多余捕获的话，也会被作为参数依次传入。
		// string.replace只会返回替换之后的字符串，但是不会对原字符串进行修改，下面的操作实际上没有修改text，只是借用string.replace的回调函数完成新函数的构建。
		text.replace(matcher, function (match, escape, interpolate, evaluate, offset) {
			// 截取没有占位符的字符片段，并且转义其中需要转义的字符。
			source += text.slice(index, offset).replace(escapeRegExp, escapeChar);
			// 跳过占位符，为下一次截取做准备。
			index = offset + match.length;

			// 转义符的位置使用匹配到的占位符中的变量的值替代，构造一个函数的内容。
			if (escape) {
				// 不为空时将转义后的字符串附加到source。
				source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
			} else if (interpolate) {
				source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
			} else if (evaluate) {
				// 由于是直接执行语句，所以直接把evaluate字符串添加到构造函数的字符串中去就好。
				source += "';\n" + evaluate + "\n__p+='";
			}

			// Adobe VMs need the match returned to produce the correct offset.
			// 正常来说没有修改原字符串text，所以不返回值没有关系，但是这里返回了原匹配项，
			// 根据注释的意思，可能是为了防止特殊环境下能够有一个正常的offset偏移量。
			return match;
		});
		source += "';\n";
		// source拼凑出了一个函数定义的所有内容，为后面使用Function构造函数做准备。

		// If a variable is not specified, place data values in local scope.
		// 指定作用域，以取得传入对象数据的所有属性。
		if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

		source = "var __t,__p='',__j=Array.prototype.join," +
			"print=function(){__p+=__j.call(arguments,'');};\n" +
			source + 'return __p;\n';

		var render;
		try {
			// 通过new Function()形式构造函数对象。
			// new Function(param1, ..., paramN, funcBody)
			render = new Function(settings.variable || 'obj', '_', source);
		} catch (e) {
			e.source = source;
			throw e;
		}

		var template = function (data) {
			return render.call(this, data, _);
		};

		// Provide the compiled source as a convenience for precompilation.
		var argument = settings.variable || 'obj';
		// 为template函数添加source属性以便于进行预编译，以便于发现不可重现的错误。
		template.source = 'function(' + argument + '){\n' + source + '}';

		return template;
	};

具体注释都已经写在代码中。

可以发现，在`_.template`函数中，将配置项中的三个正则合并成了一个，并且每一个正则都构成了一个捕获组，这样回调就会接受6个参数，最后一个参数被作者忽略了。在回调中，作者分别对三种匹配项进行了处理，然后拼接到了source字符串中。

构造完source字符串之后，作者就使用了`new Function()`的语法构造了一个`render`函数，通过研究source字符串可以发现，`render`实际上相当于函数：

    function render(settings.variable || 'obj', _) {
        var __t,
            __p = '', 
            __j = Array.prototype.join,
            print = function(){
                __p+=__j.call(arguments,'');
            };
        // 如果配置了variable属性就不需要使用with块了。
        with(obj || {}) {
            __p += '...' + ((__t=(" + /*需要转义的变量*/ + "))==null?'':_.escape(__t)) + ((__t=(" + /*变量*/ + "))==null?'':__t) + ... ;
            /*需要执行的JavaScript字符串*/;
        }
        return __p;
    }

构造完这个render函数，基本的工作也就完成了。

这里比较巧妙的点在于作者通过`String.prototype.replace`函数构造函数字符串，对于每一个特定的模板定制了一个特定的函数，这个函数会构造一个对应于模板的字符串，将变量填充进去，所以返回的字符串即为我们想要的字符串。