const generateArray = require('./Global').generateArray;

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

// The worst result for bubbleSort.
// O(n^2).
console.log(bubbleSort(generateArray(20000)));