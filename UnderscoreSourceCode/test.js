//这个js文件用于测试underscore接口。

const _ = require('./underscore.js');

var a = {
    name: 'test'
};
a['test1'] = a;
var b = {
    name: 'test'
};
b['test1'] = b;

// console.log(_.isEqual(a, b));

var set1 = new Set([1,2,3,4]);
var set2 = new Set([1,2,3]);
// console.log(_.isEqual(set1, set2));
// console.log(Array.prototype.slice.call(set1.values(), 0));
// console.log(set1.keys());

var arr1 = [['name', 'zdm'], ['age', 22]];
var arr2 = [['name', 'zdm'], ['age', 22], ['gender', 'male']];
var map1 = new Map(arr1);
var map2 = new Map(arr2);

// console.log(_.isEqual(map1, map2));
// console.log([...map2]);

var x = /.\w+/gi;
var y = /.\w+/ig;

// console.log(_.isEqual(x, y));

// var a = _.debounce((content)=>{
//     console.log('Yes!' + ' ' + content);
// }, 1000, false);
// a(1);
// a(2);
// a(3);
// a(4);

// var debounce = function(callback, delay, immediate){
//     var timeout, result;
//     return function(){
//         var callNow;
//         if(timeout)
//             clearTimeout(timeout);
//         callNow = !timeout && immediate;
//         if(callNow) {
//             result = callback.apply(this, Array.prototype.slice.call(arguments, 0));
//             timeout = {};
//         }
//         else {
//             timeout = setTimeout(()=>{
//                 callback.apply(this, Array.prototype.slice.call(arguments, 0));
//             }, delay);
//         }
//     };
// };

// var b = debounce((x, y)=>{
//     console.log(x + y);
//     console.timeEnd();
// }, 2000);
// console.time();
// b(1,1);
// b(2,2);
// b(3,3);
// b(4,4);

var a = _.throttle(()=>{
    console.log('yes');
}, 100000, {
    // leading:true,
    // trailing:false
});
while(1){
    a();
}