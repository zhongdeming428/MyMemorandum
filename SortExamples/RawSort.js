const generateArray = require('./Global').generateArray;

console.time('RawSort');
generateArray(10000).sort((a, b) => a - b);
console.timeEnd('RawSort');
