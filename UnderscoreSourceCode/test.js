//这个js文件用于测试underscore接口。

const _ = require('./underscore.1.8.3.js');

// var a = {
//     name: 'test'
// };
// a['test1'] = a;
// var b = {
//     name: 'test'
// };
// b['test1'] = b;

// console.log(_.isEqual(a, b));

// var set1 = new Set([1,2,3,4]);
// var set2 = new Set([1,2,3]);
// console.log(_.isEqual(set1, set2));
// console.log(Array.prototype.slice.call(set1.values(), 0));
// console.log(set1.keys());

// var arr1 = [['name', 'zdm'], ['age', 22]];
// var arr2 = [['name', 'zdm'], ['age', 22], ['gender', 'male']];
// var map1 = new Map(arr1);
// var map2 = new Map(arr2);

// console.log(_.isEqual(map1, map2));
// console.log([...map2]);

// var x = /.\w+/gi;
// var y = /.\w+/ig;

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

// var a = _.throttle(()=>{
//     console.log('yes');
// }, 100000, {
//     // leading:true,
//     // trailing:false
// });
// while(1){
//     a();
// }

// var throttle = function(func, wait){
//     var timeout, result, now;
//     var previous = 0;
    
//     return function() {
//         now = +(new Date());
    
//         if(now - previous >= wait) {
//             if(timeout) {
//                 clearTimeout(timeout);
//                 timeout = null;
//             }
//             previous = now;
//             result = func.apply(this, arguments);
//         }
//         else if(!timeout) {
//             timeout = setTimeout(function() {
//                 previous = now;
//                 result = func.apply(this, arguments);
//                 timeout = null;
//             }, wait - now + previous);
//         }
//         return result;
//     }
// }
// window.onscroll = throttle(()=>{console.log('yes')}, 2000);

// var alert = ()=>{
//     console.log('yes..');
// }
// var b = _.before(3, alert);
// b();
// b();
// b();

// var a = {
//     name: 'test',
//     sayName: function() {
//         console.log(this.name);
//     }
// };
// // _.bindAll(a, 'sayName');

// var b = a.sayName;
// name = 'window.test';
// b();

// function a(arr) {
//     if(arguments.length < 2)
//         throw new Error('funciton a require at least 2 parameters!');
//     return arr.concat(Array.prototype.slice.call(arguments, 1));
// }

// console.log(a([1, 2], 3));

// function a(arr, filter) {
//     if(arguments.length < 3)
//         throw new Error('function a require at least 3 parameters!');
//     var params = Array.prototype.slice.call(arguments, 2);
//     for(var i = 0; i < params.length; i++) {
//         if(filter(params[i])) {
//             arr.push(params[i]);
//         }
//     }
//     return arr;
// }
// console.log(a([], (x) => {
//     return x > 1;
// }, 1, 2, 3, 0));
// <<<<<<< HEAD


// function A(name){
//     this.name = name
// }
// var _A = _.bind(A);
// console.log(new _A('zdm'));
// console.log(new A('zdm'));

// var _bind = function(func, context) {
//     var bound = function() {
//         if(this instanceof bound) {
//             var obj = new Object();
//             obj.prototype = func.prototype;
//             obj.prototype.constructor = func;
//             var res = func.call(obj);
//             if(typeof res == 'function' || typeof res == 'object' && !!res)
//                 return res;
//             else
//                 return obj
//         }
//         else {
//             return func.call(context);
//         }
//     };
//     return bound; 
// }

// var test = {};
// var B = _bind(function() {
//     this.name = 'B';
// }, test);
// var b = B();
// var bb = new B();
// console.log(test);
// console.log(bb);


// var flatten = function(array, result) {
//     var result = result || [];
//     var length = array.length;
//     var toString = Object.prototype.toString;
//     var type = toString.call(array);
//     if(type !== '[object Array]')
//         throw new TypeError('The parameter you passed is not a array');
//     else {
//         for(var i = 0; i < length; i++) {
//             if(toString.call(array[i]) !== '[object Array]') {
//                 result.push(array[i]);
//             }
//             else {
//                 arguments.callee(array[i], result);
//             }
//         }
//     }
//     return result;
// }

// var arr1 = [1,2,3];
// var arr2 = [1,2,[1,2,[1,[1,2,3],2,3]]];
// var arr3 = [1,2,[3]]
// // console.log(flatten(arr1));
// console.log(flatten(arr3));

// var intersection = function(arr1, arr2) {
//     var length = arr1.length;
//     var result = [];
//     var i;
//     for(i = 0; i < length; i++) {
//         if(result.indexOf(arr1[i]) >= 0) 
//             continue;
//         else {
//             if(arr2.indexOf(arr1[i]) >= 0)
//                 result.push(arr1[i]);
//         }
//     }
//     return result;
// }

// var arr1 = [1,2,3,5];
// var arr2 = [4,5,6,3];
// console.log(intersection(arr1, arr2));

// _.uniq([1,1,2], true);

// var uniq = function(array) {
//     var set = new Set(array);
//     return [...set];
// }

// var uniq = function(array, isSorted, func) {
//     var result = [];
//     var length = array.length;
//     var i;
//     var seen = [];
//     if(isSorted && !func) {
//         for(i = 0; i< length; i++) {
//             if(array[i] == seen) continue;
//             else {
//                 result.push(array[i]);
//                 seen = array[i];
//             }
//         }
//     }
//     else if(func){
//         for(i = 0; i < length; i++) {
//             if(seen.indexOf(func(array[i])) < 0) {
//                 seen.push(func(array[i]));
//                 result.push(array[i]);
//             }
//         }
//     }
//     else{
//         for(i = 0; i < length; i++) {
//             if(result.indexOf(array[i]) < 0) {
//                 result.push(array[i]);
//             }
//         }
//     }
//     return result;
// };
// console.log(uniq([1,1,2,2,3,3,3,4], true));
// var objArr = [{id: 'a'}, {id: 'a'}, {id: 'b'}];
//var persons = [{name: 'dm', age: 22}, {name: 'dm', age: 23}, {name: 'dm', age: 22}];


// var union = function() {
//     var arrays = arguments;
//     var length = arguments.length;
//     var result = [];
//     var i;
//     for(i = 0; i < length; i++) {
//         var arr = arrays[i];
//         var arrLength = arrays[i].length;
//         for(var j = 0; j < arrLength; j++) {
//             if(result.indexOf(arr[j]) < 0) {
//                 result.push(arr[j]);
//             }
//         }
//     }
//     return result;
// }

// console.log(union([1,1,2], [2,3], [1,3,4]));

// var difference = function(arr1, arr2) {
//     var length = arr1.length;
//     var i;
//     var result = [];
//     for(i = 0; i < length; i++) {
//         if(arr2.indexOf(arr1[i]) < 0) {
//             result.push(arr1[i]);
//         }
//     }
//     return result;
// }
// console.log(difference([1,1,1], [1,2]));

// function __(obj) {
//     if(obj.wrapped != void 0) {
//         return obj;
//     }
//     if(!(this instanceof __)) {
//         return new __(obj);
//     }
//     this.wrapped = obj;
// }

// __.toString = function(obj) {
//     return obj.name;
// };

// __.prototype.toString = function(obj) {
//     return obj.wrapped.name
// };

// const tmp = __({name: 'none'});
// const name = __.toString({name: 'none'});
// console.log(tmp);

// (function () {
//     var x = function() {
//         console.log('x');
//     };
//     x.name = 'x';
//     global.x = x;
// }())
// console.log(x);

// const a = 1 && 2 && 3 || 2 && 3;
// // a === 3
// const b = 1 && false && 2 || 2 && 3;
// // b === 3
// const c = 1 && false && 2 || false && 2
// // c === false
// const d = 1 && false && 2 || 0 && 2
// // d === 0
// const e = 1 && false && 2 || 1 && 2
// // e === 2