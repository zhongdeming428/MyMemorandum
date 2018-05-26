const generateArray = require('./Global').generateArray;

function bubbleSort(arr) {
    console.time('BubbleSort');
    let len = arr.length;
    let count = 0;
    arr.forEach((v, j) => {
        for(let i=0; i<len-1-j; i++) {
            if(arr[i] > arr[i+1]) {
                let tmp = arr[i+1];
                arr[i+1] = arr[i]
                arr[i] = tmp;
                // [arr[i], arr[i+1]] = [arr[i+1], arr[i]];
            }
            count++;
        }
    });
    console.timeEnd('BubbleSort');
    console.log(arr);
    return count;
}

// The worst result for bubbleSort.
// O(n^2).
console.log(bubbleSort(generateArray(10000)));