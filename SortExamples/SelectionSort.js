const generateArray = require('./Global').generateArray;

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

console.log(selectionSort(generateArray(20000)));