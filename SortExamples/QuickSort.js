const generateArray = require('./Global').generateArray;

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

console.log(quickSort([2, 1, 4, 2, 3, 6, 9, 8]));
// console.log(quickSort(generateArray(10000)));