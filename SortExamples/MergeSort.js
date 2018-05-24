const generateArray = require('./Global').generateArray;

function mergeSort(arr) {
    console.time('MergeSort');
    let count = 0;
    console.log(main(arr));
    console.timeEnd('MergeSort');
    return count;
    function main(arr) {
        if(arr.length === 1) return arr;

        let mid = Math.floor(arr.length/2);
        let left = arr.slice(0, mid);
        let right = arr.slice(mid);
        return merge(arguments.callee(left), arguments.callee(right));
    }
    function merge(left, right) {
        let il = 0,
            rl = 0,
            result = [];
        while(il < left.length && rl < right.length) {
            count++;
            if(left[il] < right[rl]) {
                result.push(left[il++]);
            }
            else {
                result.push(right[rl++]);
            }
        }
        return result.concat(left.slice(il)).concat(right.slice(rl));
    }
}

console.log(mergeSort(generateArray(10000000)));