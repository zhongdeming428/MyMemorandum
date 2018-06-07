const generateArray = require('./Global').generateArray;

function quickSort(arr) {
    if(arr.length <= 1) return arr;
    return [
        ...quickSort(arr.slice(1).filter(item => item < arr[0])),
        arr[0],
        ...quickSort(arr.slice(1).filter(item => item >= arr[0]))
    ];
}

console.time('_QuickSort');
let res = quickSort(generateArray(1000000));
console.timeEnd('_QuickSort');
console.log(res);