const generateArray = require('./Global').generateArray;

function heapSort(arr) {
    console.time('HeapSort');
    buildHeap(arr);
    for(let i=arr.length-1; i>0; i--) {
        [arr[i], arr[0]] = [arr[0], arr[i]];
        heapify(arr, i, 0);
    }
    console.timeEnd('HeapSort');
    return arr;
    function buildHeap(arr) {
        let mid = Math.floor(arr.length / 2);
        for(let i=mid; i>=0; i--) {
            heapify(arr, arr.length, i);
        }
        return arr;
    }
    function heapify(arr, heapSize, i) {
        let left = 2 * i + 1,
            right = 2 * i + 2,
            largest = i;
        if(left < heapSize && arr[left] < arr[largest]) {
            largest = left;
        }
        if(right < heapSize && arr[right] < arr[largest]) {
            largest = right;
        }
        if(largest !== i) {
            [arr[largest], arr[i]] = [arr[i], arr[largest]];
            arguments.callee(arr, heapSize, largest);
        }
        return arr;
    }
}

console.log(heapSort(generateArray(3)));