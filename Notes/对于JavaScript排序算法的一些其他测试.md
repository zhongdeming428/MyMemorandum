# 对于JavaScript实现排序算法的一些其他测试

在我的[上一篇文章](https://juejin.im/post/5b06ba5051882538953ac7e5)中，总结了六种排序算法的JavaScript实现，以及每种算法的思想，掘金上的许多盆友提出了一些好的想法或者优化的方法，这里针对这些方法做一些新的测试，以验证盆友们的说法。此外，非常感谢大家仔细阅读我的文章，你们的意见让我进步很大，同时意识到自身的许多不足，我还是会继续努力的。

首先还是说明一下，为了方便测试，专门写了一个随机数组生成函数，代码如下：

    exports.generateArray = function(length) {
        let arr = Array(length);
        for(let i=0; i<length; i++) {
            arr[i] = Math.random();
        }
        return arr;
    };

只要输入数组的长度，就可以得到满足要求的随机数组供你测试。

## 一、和原生接口比哪个快？

这是由[@JHanLu](https://juejin.im/user/595f405d6fb9a06bae1df832)提出的想法，确实是个很不错的想法，在这里进行一下测试。比较对象是`Array.prototype.sort`方法和快速排序。

**测试原生方法：**

    console.time('RawSort');
    generateArray(10000000).sort((a, b) => a - b);
    console.timeEnd('RawSort');

针对10000000（一千万）条数据进行从小到大的排序，耗时为11s：

    RawSort: 11069.679ms

针对10000（一万）条数据进行排序，耗时0.023秒：

    RawSort: 23.382ms

**测试快排：**

代码如下：

    function quickSort(arr) {
        let left = 0,
            right = arr.length - 1;
        console.time('QuickSort');
        main(arr, left, right);
        console.timeEnd('QuickSort');
        return arr;
        function main(arr, left, right) {
            if(arr.length === 1) {
                return;
            }
            let index = partition(arr, left, right);
            if(left < index - 1) {
                main(arr, left, index - 1);
            }
            if(index < right) {
                main(arr, index, right);
            }
        }
        function partition(arr, left, right) {
            let pivot = arr[Math.floor((left + right) / 2)];
            while(left <= right) {
                while(arr[left] < pivot) {
                    left++;
                }
                while(arr[right] > pivot) {
                    right--;
                }
                if(left <= right) {
                    [arr[left], arr[right]] = [arr[right], arr[left]];
                    left++;
                    right--;
                }
            }
            return left;
        }
    }

    console.log(quickSort(generateArray(10000000)));

针对10000000（一千万）条数据从小到大进行排序，耗时3.6s：

    QuickSort: 3632.852ms

针对10000（一万）条数据进行排序，耗时0.012s：

    QuickSort: 12.482ms

可以看出来不管是大数据量还是小数据量，都是手动实现的快排更加快速，但是优势不是很大。猜测原因可能是原生方法实际上还是要调用底层的快排来实现排序，比手动实现的快排多了一层封装导致速度有稍微下降。

针对原生方法，还去了解了一下，发现V8引擎是不稳定排序，它根据数组长度来选择排序算法的。当数组长度在10以下时，会采用插入排序；数组长度在10以上时，会采用快速排序，详情参考：[Array.prototype.sort()方法到底是如何排序的？](https://www.jianshu.com/p/bcb6a8f4c114)。

由以上结论可以发现，当前端要排序的数据量比较大（千万级，当然基本不太可能）时，最好还是使用手动实现的快排，速度会比较快。数据量不大时，完全可以使用`Array.prototype.sort`进行排序，毕竟一千万条数据的时间差也不超过两秒。虽然原生方法可以满足我们的要求，但是这也绝不是前端工程师不学习排序和算法的理由。

## 二、冒泡排序写错了？

上一篇文章中，我在第二层循环内也是写的从头到尾的遍历，但是[@雪之祈舞
](https://juejin.im/user/5a773713f265da4e710f344e)提出来，可以进行优化，因为没遍历一次数据，符合要求的数据就自动排序到末尾了（比如第一轮排序最大值就到了最后一个位置），所以在之后的遍历中，都可以忽略数组的后i项，这是正确的做法。接下来进行对比：

**上一篇文章中的写法：**

    function bubbleSort(arr) {
        console.time('BubbleSort');
        let len = arr.length;
        let count = 0;
        arr.forEach(() => {
            // 这里的i<len - 1实际上应该是i<len - 1 - i。
            for(let i=0; i<len-1; i++) {
                if(arr[i] > arr[i+1]) {
                    let tmp = arr[i+1];
                    arr[i] = tmp;
                    arr[i+1] = arr[i]
                }
                count++;
            }
        });
        console.timeEnd('BubbleSort');
        return count;
    }

    console.log(bubbleSort(generateArray(20000)));

测试排序20000（两万）条数据，耗时1.27s：

    BubbleSort: 1277.692ms

而改进代码后：

    function bubbleSort(arr) {
        console.time('BubbleSort');
        let len = arr.length;
        let count = 0;
        arr.forEach(() => {
            for(let i=0; i<len-1-i; i++) {
                if(arr[i] > arr[i+1]) {
                    let tmp = arr[i+1];
                    arr[i] = tmp;
                    arr[i+1] = arr[i]
                }
                count++;
            }
        });
        console.timeEnd('BubbleSort');
        return count;
    }

    console.log(bubbleSort(generateArray(20000)));

测试20000（两万）条数据，耗时0.64s：

    BubbleSort: 638.900ms

可以发现几乎缩短了一半的时间。

## 三、选择排序不够优秀！

这里确实是我懒的缘故，最优秀的做法是每次遍历找出最小值（或者最大值）保存到一个变量中，而我是每次发现小于（或大于）参考值的元素就会将它们进行对调，这样虽然时间复杂度没变，但是变量交换花费的时间较多，造成了性能下降，感谢用户[@ly578269725](https://juejin.im/user/5860e66261ff4b0063070a8d)的指导，由于我的懒惰可能会导致别人的误会，我表示抱歉。下面是实测结果：

**懒惰的写法：**

    function selectionSort(arr) {
        console.time('SelectionSort');
        let len = arr.length;
        let count = 0;
        arr.forEach((item, index) => {
            for(let i=index; i<len; i++) {
                if(arr[i] > arr[index]) {
                    [arr[index], arr[i]] = [arr[i], arr[index]];
                }
                count++;
            }
        });
        console.log(arr);
        console.timeEnd('SelectionSort');
        return count;
    }

    console.log(selectionSort(generateArray(30000)));

对20000（两万）条数据进行排序，耗时5.2s：

    SelectionSort: 5227.515ms

而改良后：

    function selectionSort(arr) {
        console.time('SelectionSort');
        let len = arr.length;
        let count = 0;
        arr.forEach((item, index) => {
            let min = index;
            for(let i=index; i<len; i++) {
                if(arr[i] < arr[index]) {
                    min = i;
                }
                count++;
            }
            if(min !== index) {
                [arr[min], arr[index]] = [arr[index], arr[min]];
            }
        });
        console.log(arr);
        console.timeEnd('SelectionSort');
        return count;
    }

    console.log(selectionSort(generateArray(20000)));

对20000（两万）条数据进行排序，耗时1.25s：

    SelectionSort: 1250.662ms

可以发现确实性能有了提升，此处也可以发现交换数值比赋值消耗更大。

## 四、阮老师的快排错了吗？

前段时间很火的一篇文章，说阮老师的快速排序是完全错误的，指的就是这篇文章：[快速排序（Quicksort）的Javascript实现](http://www.ruanyifeng.com/blog/2011/04/quicksort_in_javascript.html)。关于阮老师这篇文章错了没有，知乎早就有了答案：[如何看待文章《面试官：阮一峰版的快速排序完全是错的》？](https://www.zhihu.com/question/276746146)，包括[廖雪峰](https://www.zhihu.com/people/liaoxuefeng/activities)等大佬都表示阮老师的文章没有什么大问题，至少不能说是完全错误！阮老师的这篇文章写于2011年，当时根本就不是程序员，而且他的这篇文章本来就是讲思想多于代码，通过阮老师的讲解，你很容易就能明白快排是怎么回事，要说他哪里不对，无非就是使用了`Array.prototype.splice`方法来删除原数组中的pivot元素并获取这个pivot，这个方法会增加算法的复杂度，另外阮老师增加了空间复杂度，实现的代码不是最优方案。但是这不是说他的代码完全错误的理由，算法本来就是思想多于代码的东西，你可以说他的代码不够优秀（实际上本来就是面向初学者的，那样的代码更好理解），但是不可以说他的代码完全错误，因为他完完全全遵守了快速排序的核心思想：分治。就像廖雪峰老师所说的一样:人家教程主要是讲思路，快排的基本思想是分治。非要用生产，Array.sort()了解一下？

实际上，阮老师在他的网站[JavaScript 标准参考教程（alpha）](http://javascript.ruanyifeng.com/library/sorting.html#toc12)上，早就实现了优化的快速排序，博客的时间是2013年1月30日，真当人家不懂吗？