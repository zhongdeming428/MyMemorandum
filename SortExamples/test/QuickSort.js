const generateArray = require('../Global').generateArray;

function quickSort(arr) {
    let left = 0,
        right = arr.length - 1;
    main(arr, left, right);
    return arr;
    function main(arr, left, right) {
        if(arr.length === 1) return arr;
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
        let i = left,
            j = right;
        while(i <= j) {
            while(arr[i] < pivot) {
                i++;
            }
            while(arr[j] > pivot) {
                j--    
            }
            if(i <= j) {
                [arr[i], arr[j]] = [arr[j], arr[i]];
                i++;
                j--;
            }
        }
        return i;
    }
}

console.log(quickSort([1,3,4,5,7,3,23,4,5,3,2,1]))