# 六种排序算法的JavaScript实现以及总结

最近几天在系统的复习排序算法，之前都没有系统性的学习过，也没有留下过什么笔记，所以很快就忘了，这次好好地学习一下。

为了方便对比各个排序算法的性能，这里先写了一个生成大规模数组的方法——`generateArray`：

    exports.generateArray = function(length) {
        let arr = Array(length);
        for(let i=0; i<length; i++) {
            arr[i] = Math.random();
        }
        return arr;
    };

只需要输入数组长度，即可生成一个符合长度要求的随机数组。

## 一、冒泡排序

冒泡排序也成为沉淀排序(sinking sort)，冒泡排序得名于其排序方式，它遍历整个数组，将数组的每一项与其后一项进行对比，如果不符合要求就交换位置，一共遍历n轮，n为数组的长度。n轮之后，数组得以完全排序。整个过程符合要求的数组项就像气泡从水底冒到水面一样泡到数组末端，所以叫做冒泡排序。

冒泡排序是最简单的排序方法，容易理解、实现简单，但是冒泡排序是效率最低的排序算法，由于算法嵌套了两轮循环（将数组遍历了n遍），所以时间复杂度为O(n^2)。最好的情况下，给出一个已经排序的数组进行冒泡排序，时间复杂度也为O(n)。

JavaScript实现（从小到大排序）：

    function bubbleSort(arr) {
        //console.time('BubbleSort');
        // 获取数组长度，以确定循环次数。
        let len = arr.length;
        // 遍历数组len次，以确保数组被完全排序。
        for(let i=0; i<len; i++) {
            // 遍历数组的前len-1项。
            for(let j=0; j<len - 1; j++) {
                // 将每一项与后一项进行对比，不符合要求的就换位。
                if(arr[j] > arr[j+1]) {
                    [arr[j+1], arr[j]] = [arr[j], arr[j+1]];
                }
            }
        }
        //console.timeEnd('BubbleSort');
        return arr;
    }

代码中的注释部分的代码都用于输出排序时间，供测试使用，下文亦如是。

## 二、选择排序

选择排序是一种原址比较排序法，大致思路：

找到数组中的最小（大）值，并将其放到第一位，然后找到第二小的值放到第二位……以此类推。

JavaScript实现（从小到大排序）：

    function selectionSort(arr) {
        //console.time('SelectionSort');
        // 获取数组长度，确保每一项都被排序。
        let len = arr.length;
        // 遍历数组的每一项。
        for(let i=0; i<len; i++) {
            // 从数组的当前项开始，因为左边部分的数组项已经被排序。
            for(let j=i; j<len; j++) {
                if(arr[j]<arr[i]) {
                    [arr[j], arr[i]] = [arr[i], arr[j]];
                }
            }
        }
        //console.timeEnd('SelectionSort');
        return arr;
    }

由于嵌套了两层循环，其时间复杂度也是O(n^2)，

## 三、插入排序

插入排序是最接近生活的排序，因为我们打牌时就差不多是采用的这种排序方法。该方法从数组的第二项开始遍历数组的`n-1`项（n为数组长度），遍历过程中对于当前项的左边数组项，依次从右到左进行对比，如果左边选项大于（或小于）当前项，则左边选项向右移动，然后继续对比前一项，直到找到不大于（不小于）自身的选项为止，对于所有大于当前项的选项，都在原来位置的基础上向右移动了一项。

示例：

    // 对于如下数组
    var arr = [2,1,3,5,4,3];
    // 从第二项（即arr[1]）开始遍历，
    // 第一轮：
    // a[0] >= 1为true，a[0]右移，
    arr = [2,2,3,5,4,3];
    // 然后1赋给a[0]，
    arr = [1,2,3,5,4,3];
    // 然后第二轮：
    // a[1] >= 3不成立，该轮遍历结束。
    // 第三轮;
    // a[2] >= 5不成立，该轮遍历结束。
    // 第四轮：
    // a[3] >= 4为true，a[3]右移，
    arr = [1,2,3,5,5,3];
    // a[2] >= 4不成立，将4赋给a[3]，然后结束该轮遍历。
    arr = [1,2,3,4,5,3];
    // a[4] >= 3成立，a[4]右移一位，
    arr = [1,2,3,4,5,5];
    // arr[3] >= 3成立，arr[3]右移一位，
    arr = [1,2,3,4,4,5];
    // arr[2] >= 3成立，arr[2]右移一位，
    arr = [1,2,3,3,4,5];
    // arr[1] >= 3不成立，将3赋给a[2]，结束该轮。
    arr = [1,2,3,3,4,5];
    // 遍历完成，排序结束。

如果去掉比较时的等号的话，可以减少一些步骤，所以在JavaScript代码中减少了这部分，
JavaScript实现（从小到大排序）：

    function insertionSort(arr) {
        //console.time('InsertionSort');
        let len = arr.length;
        for(let i=1; i<len; i++) {
            let j = i;
            let tmp = arr[i];
            while(j > 0 && arr[j-1] > tmp) {
                arr[j] = arr[j-1];
                j--;
            }
            arr[j] = tmp;
        }
        //console.timeEnd('InsertionSort');
        return arr;
    }
    
插入排序比一般的高级排序算法（快排、堆排）性能要差，但是还是具有以下优点的：

* 实现起来简单，理解起来不是很复杂。
* 对于较小的数据集而言比较高效。
* 相对于其他复杂度为O(n^2)的排序算法（冒泡、选择）而言更加快速。这一点在文章最后的测试中可以看出来。
* 稳定、及时……

## 四、归并排序

到目前为止，已经介绍了三种排序方法，包括冒泡排序、选择排序和插入排序。这三种排序方法的时间复杂度都为O(n^2)，其中冒泡排序实现最简单，性能最差，选择排序比冒泡排序稍好，但是还不够，插入排序是这三者中表现最好的，对于小数据集而言效率较高。这些原因导致三者的实用性并不高，都是最基本的简单排序方法，多用于教学，很难用于实际中，从这节开始介绍更加高级的排序算法。

归并排序是第一个可以用于实际的排序算法，前面的三个性能都不够好，归并排序的时间复杂度为O(nlogn)，这一点已经由于前面的三个算法了。

值得注意的是，JavaScript中的`Array.prototype.sort`方法没有规定使用哪种排序算法，允许浏览器自定义，FireFox使用的是归并排序法，而Chrome使用的是快速排序法。

归并排序的核心思想是[分治](https://en.wikipedia.org/wiki/Divide_and_conquer_algorithm)，分治是通过递归地将问题分解成相同或者类型相关的两个或者多个子问题，直到问题简单到足以解决，然后将子问题的解决方案结合起来，解决原始方案的一种思想。

归并排序通过将复杂的数组分解成足够小的数组（只包含一个元素），然后通过合并两个有序数组（单元素数组可认为是有序数组）来达到综合子问题解决方案的目的。所以归并排序的核心在于如何整合两个有序数组，拆分数组只是一个辅助过程。

示例：

    // 假设有以下数组，对其进行归并排序使其按从小到大的顺序排列：
    var arr = [8,7,6,5];
    // 对其进行分解，得到两个数组：
    [8,7]和[6,5]
    // 然后继续进行分解，分别再得到两个数组，直到数组只包含一个元素：
    [8]、[7]、[6]、[5]
    // 开始合并数组，得到以下两个数组：
    [7,8]和[5,6]
    // 继续合并，得到
    [5,6,7,8]
    // 排序完成

JavaScript实现（从小到大排序）：

    function mergeSort(arr) {
        //console.time('MergeSort');
        //let count = 0;
        console.log(main(arr));
        //console.timeEnd('MergeSort');
        //return count;
        // 主函数。
        function main(arr) {
            // 记得添加判断，防止无穷递归导致callstack溢出，此外也是将数组进行分解的终止条件。
            if(arr.length === 1) return arr;
            // 从中间开始分解，并构造左边数组和右边数组。
            let mid = Math.floor(arr.length/2);
            let left = arr.slice(0, mid);
            let right = arr.slice(mid);
            // 开始递归调用。
            return merge(arguments.callee(left), arguments.callee(right));
        }
        // 数组的合并函数，left是左边的有序数组，right是右边的有序数组。
        function merge(left, right) {
            // il是左边数组的一个指针，rl是右边数组的一个指针。
            let il = 0,
                rl = 0,
                result = [];
            // 同时遍历左右两个数组，直到有一个指针超出范围。
            while(il < left.length && rl < right.length) {
                //count++;
                // 左边数组的当前项如果小于右边数组的当前项，那么将左边数组的当前项推入result，反之亦然，同时将推入过的指针右移。
                if(left[il] < right[rl]) {
                    result.push(left[il++]);
                }
                else {
                    result.push(right[rl++]);
                }
            }
            // 记得要将未读完的数组的多余部分读到result。
            return result.concat(left.slice(il)).concat(right.slice(rl));
        }
    }

注意是因为数组被分解成为了只有一个元素的许多子数组，所以merge函数从单个元素的数组开始合并，当合并的数组的元素个数超过1时，即为有序数组，仍然还可以继续使用merge函数进行合并。

归并排序的性能确实达到了应用级别，但是还是有些不足，因为这里的merge函数新建了一个result数组来盛放合并后的数组，导致空间复杂度增加，这里还可以进行优化，使得数组进行原地排序。

## 五、快速排序

快速排序由Tony Hoare在1959年发明，是当前最为常用的排序方案，如果使用得当，其速度比一般算法可以快两到三倍，比之冒泡排序、选择排序等可以说快成千上万倍。快速排序的复杂度为O(nlogn)，其核心思想也是分而治之，它递归地将大数组分解为小数组，直到数组长度为1，不过与归并排序的区别在于其重点在于数组的分解，而归并排序的重点在于数组的合并。

**基本思想：**

在数组中选取一个参考点（pivot），然后对于数组中的每一项，大于pivot的项都放到数组右边，小于pivot的项都放到左边，左右两边的数组项可以构成两个新的数组（left和right），然后继续分别对left和right进行分解，直到数组长度为1，最后合并（其实没有合并，因为是在原数组的基础上操作的，只是理论上的进行了数组分解）。

**基本步骤：**

* （1）首先，选取数组的中间项作为参考点pivot。
* （2）创建左右两个指针left和right，left指向数组的第一项，right指向最后一项，然后移动左指针，直到其值不小于pivot，然后移动右指针，直到其值不大于pivot。
* （3）如果left仍然不大于right，交换左右指针的值（指针不交换），然后左指针右移，右指针左移，继续循环直到left大于right才结束，返回left指针的值。
* （4）根据上一轮分解的结果（left的值），切割数组得到left和right两个数组，然后分别再分解。
* （5）重复以上过程，直到数组长度为1才结束分解。

JavaScript实现（从小到大排序）：

    function quickSort(arr) {
        let left = 0,
            right = arr.length - 1;
        //console.time('QuickSort');
        main(arr, left, right);
        //console.timeEnd('QuickSort');
        return arr;
        function main(arr, left, right) {
            // 递归结束的条件，直到数组只包含一个元素。
            if(arr.length === 1) {
                // 由于是直接修改arr，所以不用返回值。
                return;
            }
            // 获取left指针，准备下一轮分解。
            let index = partition(arr, left, right);
            if(left < index - 1) {
                // 继续分解左边数组。
                main(arr, left, index - 1);
            }
            if(index < right) {
                // 分解右边数组。
                main(arr, index, right);
            }
        }
        // 数组分解函数。
        function partition(arr, left, right) {
            // 选取中间项为参考点。
            let pivot = arr[Math.floor((left + right) / 2)];
            // 循环直到left > right。
            while(left <= right) {
                // 持续右移左指针直到其值不小于pivot。
                while(arr[left] < pivot) {
                    left++;
                }
                // 持续左移右指针直到其值不大于pivot。
                while(arr[right] > pivot) {
                    right--;
                }
                // 此时左指针的值不小于pivot，右指针的值不大于pivot。
                // 如果left仍然不大于right。
                if(left <= right) {
                    // 交换两者的值，使得不大于pivot的值在其左侧，不小于pivot的值在其右侧。
                    [arr[left], arr[right]] = [arr[right], arr[left]];
                    // 左指针右移，右指针左移准备开始下一轮，防止arr[left]和arr[right]都等于pivot然后导致死循环。
                    left++;
                    right--;
                }
            }
            // 返回左指针作为下一轮分解的依据。
            return left;
        }
    }

快速排序相对于归并排序而言加强了分解部分的逻辑，消除了数组的合并工作，并且不用分配新的内存来存放数组合并结果，所以性能更加优秀，是目前最常用的排序方案。

之前还在知乎上看到过一个回答，代码大致如下（从小到大排序）：

    function quickSort(arr) {
        // 当数组长度不大于1时，返回结果，防止callstack溢出。
        if(arr.length <= 1) return arr;
        return [
            // 递归调用quickSort，通过Array.prototype.filter方法过滤小于arr[0]的值，注意去掉了arr[0]以防止出现死循环。
            ...quickSort(arr.slice(1).filter(item => item < arr[0])),
            arr[0],
            ...quickSort(arr.slice(1).filter(item => item >= arr[0]))
        ];
    }

以上代码有利于对快排思想的理解，但是实际运用效果不太好，不如之前的代码速度快。

## 六、堆排序

如果说快速排序是应用性最强的排序算法，那么我觉得堆排序是趣味性最强的排序方法，非常有意思。

堆排序也是一种很高效的排序方法，因为它把数组作为二叉树排序而得名，可以认为是归并排序的改良方案，它是一种原地排序方法，但是不够稳定，其时间复杂度为O(nlogn)。

**实现步骤：**

* （1）由数组构造一个堆结构，该结构满足父节点总是大于（或小于）其子节点。
* （2）从堆结构的最右边的叶子节点开始，从右至左、从下至上依次与根节点进行交换，每次交换后，都要再次构建堆结构。值得注意的是每次构建堆结构时，都要忽略已经交换过的非根节点。

数组构建的堆结构：

    // 数组
    var arr = [1,2,3,4,5,6,7];
    // 堆结构
            1
          /   \
        2       3
      /   \   /   \
    4      5 6     7

可以发现对于数组下标为`i`的数组项，其左子节点的值为下标`2*i + 1`对应的数组项，右子节点的值为下标`2*i + 2`对应的数组项。

实际上并没有在内存中开辟一块空间构建堆结构来存储数组数据，只是在逻辑上把数组当做二叉树来对待，构建堆结构指的是使其任意父节点的子节点都不大于（不小于）父节点。

JavaScript实现（从小到大排序）：

    function heapSort(arr) {
        //console.time('HeapSort');
        buildHeap(arr);
        for(let i=arr.length-1; i>0; i--) {
            // 从最右侧的叶子节点开始，依次与根节点的值交换。
            [arr[i], arr[0]] = [arr[0], arr[i]];
            // 每次交换之后都要重新构建堆结构，记得传入i限制范围，防止已经交换的值仍然被重新构建。
            heapify(arr, i, 0);
        }
        //console.timeEnd('HeapSort');
        return arr;
        function buildHeap(arr) {
            // 可以观察到中间下标对应最右边叶子节点的父节点。
            let mid = Math.floor(arr.length / 2);
            for(let i=mid; i>=0; i--) {
                // 将整个数组构建成堆结构以便初始化。
                heapify(arr, arr.length, i);
            }
            return arr;
        }
        // 从i节点开始下标在heapSize内进行堆结构构建的函数。
        function heapify(arr, heapSize, i) {
            // 左子节点下标。
            let left = 2 * i + 1,
                // 右子节点下标。
                right = 2 * i + 2,
                // 假设当前父节点满足要求（比子节点都大）。
                largest = i;
            // 如果左子节点在heapSize内，并且值大于其父节点，那么left赋给largest。
            if(left < heapSize && arr[left] > arr[largest]) {
                largest = left;
            }
            // 如果右子节点在heapSize内，并且值大于其父节点，那么right赋给largest。
            if(right < heapSize && arr[right] > arr[largest]) {
                largest = right;
            }
            if(largest !== i) {
                // 如果largest被修改了，那么交换两者的值使得构造成一个合格的堆结构。
                [arr[largest], arr[i]] = [arr[i], arr[largest]];
                // 递归调用自身，将节点i所有的子节点都构建成堆结构。
                arguments.callee(arr, heapSize, largest);
            }
            return arr;
        }
    }

堆排序的性能稍逊于快速排序，但是真的很有意思。

## 七、性能对比

通过`console.time()`和`console.timeEnd()`查看排序所用时间，通过`generateArray()`产生大规模的数据，最终得到如下结论：

通过对**冒泡排序**的测试，得到以下数据：

    BubbleSort: 406.567ms

给10000条数据进行排序，耗时406毫秒。

    BubbleSort: 1665.196ms

给20000条数据进行排序，耗时1.6s。

    BubbleSort: 18946.897ms

给50000条数据进行排序，耗时19s。
由于机器不太好，当数据量达到100000时基本就非常漫长了，具体多久也没等过，这已经可以看出来性能非常不好了。

通过对**选择排序**的测试，得到以下数据：

    SelectionSort: 1917.083ms

对20000条数据进行排序，耗时1.9s。

    SelectionSort: 12233.060ms

给50000条数据进行排序时，耗时12.2s，可以看出相对于冒泡排序而言已经有了进步，但是远远不够。还可以看出随着数据量的增长，排序的时间消耗越来越大。

通过对**插入排序**的测试，得到以下数据：

    InsertionSort: 273.891ms

对20000条数据进行排序，耗时0.27s。

    InsertionSort: 1500.631ms

对50000条数据进行排序，耗时1.5s。

    InsertionSort: 7467.029ms

对100000条数据进行排序，耗时7.5秒，对比选择排序，又有了很大的改善，但是仍然不够。

通过对**归并排序**的测试，得到以下数据：

    MergeSort: 287.361ms

对100000条数据进行排序，耗时0.3秒，真的很优秀了hhh，

    MergeSort: 2354.007ms

对1000000条数据进行排序，耗时2.4s，绝对的优秀，难怪FireFox会使用这个来定义`Array.prototype.sort`方法，

    MergeSort: 26220.459ms

对10000000条数据进行排序，耗时26s，还不错。
接下来看快排。

通过对**快速排序**的测试，得到以下数据：

    QuickSort: 51.446ms

100000条数据排序耗时0.05s，达到了可以忽略的境界，

    QuickSort: 463.528ms

1000000条数据排序耗时0.46s，也基本可以忽略，太优秀了，

    QuickSort: 5181.508ms

10000000条数据排序耗时5.2s，完全可以接受。

通过对**堆排序**的测试，得到以下数据：

    HeapSort: 3124.188ms

对1000000条数据进行排序，耗时3.1s，逊色于快速排序和归并排序，但是对比其他的排序方法还是不错的啦。

    HeapSort: 41746.788ms

对10000000条数据进行排序，耗时41.7s，不太能接受。

## 八、结论

以前都认为排序方法随便用用无可厚非，现在想想确实挺naive的hhh，想到了以前实习的时候，SQL Server几百万数据几秒钟就排序完成了，这要是用冒泡排序还不得等到两眼发黑？通过这次学习总结排序算法，尤其是对于每种方法性能的测试，我深刻地认识到了算法设计的重要性，只有重视算法的设计、复杂度的对比，才能写出优秀的算法，基于优秀的算法才能写出性能出色的应用！

此外，由于对于算法复杂度的研究不够深入，理解只停留在表面，所以文中如果存在有错误，恳请大牛不吝赐教！

## 九、参考文章

* [Bubble sort](https://en.wikipedia.org/wiki/Bubble_sort)
* [Selection sort](https://en.wikipedia.org/wiki/Selection_sort)
* [Insertion sort](https://en.wikipedia.org/wiki/Insertion_sort)
* [Merge sort](https://en.wikipedia.org/wiki/Merge_sort)
* [Quicksort](https://en.wikipedia.org/wiki/Quicksort)
* [Heapsort](https://en.wikipedia.org/wiki/Heapsort)
* [排序算法](http://javascript.ruanyifeng.com/library/sorting.html)
* [算法复杂度分析](http://www.cnblogs.com/gaochundong/p/complexity_of_algorithms.html)
* [学习javascript数据结构与算法(第二版)](https://search.jd.com/Search?keyword=%E5%AD%A6%E4%B9%A0javascript%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84%E4%B8%8E%E7%AE%97%E6%B3%95&enc=utf-8&suggest=1.def.0.V12&wq=%E5%AD%A6%E4%B9%A0JavaScript&pvid=f777b1033f2e4696a576ecf5b89c121f)
