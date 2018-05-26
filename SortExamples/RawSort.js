const generateArray = require('./Global').generateArray;

const arr = generateArray(10000);
console.time('RawSort');
arr.sort((a, b) => a - b);
console.timeEnd('RawSort');
