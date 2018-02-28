//这个js文件用于测试underscore接口。

const _ = require('./underscore.js');

var a = _.invoke([[3,2,1], [3,1,5,2,5]], 'sort');

const str = 'sort';

console.log(str.slice(0, -1));
console.log(str[str.length - 1]);
