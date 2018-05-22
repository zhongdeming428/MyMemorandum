const generateArray = require('./Global').generateArray;

function insertionSort(arr) {
    let len = arr.length;
    let count = 0;
    for(let i=1; i<len; i++) {
        let j = i;
        let tmp = arr[i];
        while(j > 0 && arr[j-1] > tmp) {
            arr[j] = arr[j-1];
            j--;
            count++;
        }
        arr[j] = tmp;
    }
    console.log(arr);
    return count;
}

console.log(insertionSort(generateArray(10000)));