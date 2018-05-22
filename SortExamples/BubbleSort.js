const generateArray = require('./Global').generateArray;

function bubbleSort(arr) {
    let len = arr.length;
    let count = 0;
    arr.forEach(() => {
        for(let i=0; i<len-1; i++) {
            if(arr[i] > arr[i+1]) {
                let tmp = arr[i+1];
                arr[i] = tmp;
                arr[i+1] = arr[i]
            }
            count++;
        }
    });
    return count;
}

// The worst result for bubbleSort.
// O(n^2).
console.log(bubbleSort(generateArray(10000)));